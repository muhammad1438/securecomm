
import Foundation
import CoreBluetooth
import React

@objc(BluetoothMeshModule)
class BluetoothMeshModule: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralManagerDelegate, CBPeripheralDelegate {
    
    private let serviceUUID = CBUUID(string: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
    private let txCharacteristicUUID = CBUUID(string: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E")
    private let rxCharacteristicUUID = CBUUID(string: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E")
    private let publicKeyCharacteristicUUID = CBUUID(string: "6E400004-B5A3-F393-E0A9-E50E24DCCA9E")

    private var centralManager: CBCentralManager!
    private var peripheralManager: CBPeripheralManager!
    private var connectedPeripherals: [String: CBPeripheral] = [:]
    private var discoveredDevices: [String: CBPeripheral] = [:]
    private var ownPublicKey: String?

    override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }
    
    override func supportedEvents() -> [String]! {
        return [
            "DeviceDiscovered",
            "ConnectionStateChanged", 
            "MessageReceived",
            "PublicKeyReceived",
            "ScanFailed"
        ]
    }

    @objc(startAdvertising:resolver:rejecter:)
    func startAdvertising(publicKey: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        self.ownPublicKey = publicKey
        if peripheralManager.state == .poweredOn {
            let service = CBMutableService(type: serviceUUID, primary: true)
            let txCharacteristic = CBMutableCharacteristic(type: txCharacteristicUUID, properties: .write, value: nil, permissions: .writeable)
            let rxCharacteristic = CBMutableCharacteristic(type: rxCharacteristicUUID, properties: .notify, value: nil, permissions: .readable)
            let pkCharacteristic = CBMutableCharacteristic(type: publicKeyCharacteristicUUID, properties: .read, value: publicKey.data(using: .utf8), permissions: .readable)
            service.characteristics = [txCharacteristic, rxCharacteristic, pkCharacteristic]
            peripheralManager.add(service)
            peripheralManager.startAdvertising([CBAdvertisementDataServiceUUIDsKey: [serviceUUID]])
            resolve(true)
        } else {
            reject("BLUETOOTH_OFF", "Bluetooth is not powered on", nil)
        }
    }
    
    @objc func startScanning(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard centralManager.state == .poweredOn else {
            reject("BLUETOOTH_DISABLED", "Bluetooth is not powered on", nil)
            return
        }
        
        centralManager.scanForPeripherals(withServices: [serviceUUID], options: nil)
        resolve("Scanning started")
    }
    
    @objc func connectToDevice(_ deviceAddress: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let peripheral = discoveredDevices[deviceAddress] else {
            reject("DEVICE_NOT_FOUND", "Device not found in discovered devices", nil)
            return
        }
        
        peripheral.delegate = self
        centralManager.connect(peripheral, options: nil)
        resolve("Connection initiated")
    }
    
    @objc func sendMessage(_ deviceAddress: String, message: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let peripheral = connectedPeripherals[deviceAddress],
              let service = peripheral.services?.first(where: { $0.uuid == serviceUUID }),
              let characteristic = service.characteristics?.first(where: { $0.uuid == txCharacteristicUUID }),
              let data = Data(base64Encoded: message) else {
            reject("SEND_ERROR", "Could not send message", nil)
            return
        }
        
        peripheral.writeValue(data, for: characteristic, type: .withResponse)
        resolve("Message sent")
    }
    
    // MARK: - CBCentralManagerDelegate
    
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        // Handle state updates
    }
    
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        let deviceId = peripheral.identifier.uuidString
        discoveredDevices[deviceId] = peripheral
        sendEvent(withName: "DeviceDiscovered", body: ["id": deviceId, "name": peripheral.name ?? "Unknown", "rssi": RSSI])
    }
    
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        let deviceId = peripheral.identifier.uuidString
        connectedPeripherals[deviceId] = peripheral
        peripheral.discoverServices([serviceUUID])
        sendEvent(withName: "ConnectionStateChanged", body: ["deviceId": deviceId, "status": "connected"])
    }
    
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        let deviceId = peripheral.identifier.uuidString
        connectedPeripherals.removeValue(forKey: deviceId)
        sendEvent(withName: "ConnectionStateChanged", body: ["deviceId": deviceId, "status": "disconnected"])
    }
    
    // MARK: - CBPeripheralDelegate
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        guard let services = peripheral.services else { return }
        for service in services {
            if service.uuid == serviceUUID {
                peripheral.discoverCharacteristics(nil, for: service)
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        guard let characteristics = service.characteristics else { return }
        for characteristic in characteristics {
            if characteristic.uuid == publicKeyCharacteristicUUID {
                peripheral.readValue(for: characteristic)
            }
             if characteristic.uuid == rxCharacteristicUUID {
                peripheral.setNotifyValue(true, for: characteristic)
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        let deviceId = peripheral.identifier.uuidString
        if characteristic.uuid == publicKeyCharacteristicUUID, let data = characteristic.value, let publicKey = String(data: data, encoding: .utf8) {
            sendEvent(withName: "PublicKeyReceived", body: ["deviceId": deviceId, "publicKey": publicKey])
        } else if characteristic.uuid == rxCharacteristicUUID, let data = characteristic.value {
            sendEvent(withName: "MessageReceived", body: ["deviceId": deviceId, "data": data.base64EncodedString()])
        }
    }

    // MARK: - CBPeripheralManagerDelegate
    
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        if peripheral.state == .poweredOn {
            // Can now start advertising
        }
    }
}

// Bridge configuration
@objc(BluetoothMeshModuleBridge)
class BluetoothMeshModuleBridge: NSObject {
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
