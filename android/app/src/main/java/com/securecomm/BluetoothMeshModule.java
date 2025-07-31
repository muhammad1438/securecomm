
package com.securecomm;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattServerCallback;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.os.ParcelUuid;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class BluetoothMeshModule extends ReactContextBaseJavaModule {
    
    private static final UUID SERVICE_UUID = UUID.fromString("6E400001-B5A3-F393-E0A9-E50E24DCCA9E");
    private static final UUID TX_CHARACTERISTIC_UUID = UUID.fromString("6E400002-B5A3-F393-E0A9-E50E24DCCA9E");
    private static final UUID RX_CHARACTERISTIC_UUID = UUID.fromString("6E400003-B5A3-F393-E0A9-E50E24DCCA9E");
    // Add a characteristic for exchanging public keys
    private static final UUID PUBLIC_KEY_CHARACTERISTIC_UUID = UUID.fromString("6E400004-B5A3-F393-E0A9-E50E24DCCA9E");

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private BluetoothLeAdvertiser bluetoothLeAdvertiser;
    private BluetoothGattServer gattServer;
    private Map<String, BluetoothGatt> connectedDevices;
    private String ownPublicKey;

    public BluetoothMeshModule(ReactApplicationContext reactContext) {
        super(reactContext);
        initializeBluetooth();
        connectedDevices = new HashMap<>();
    }
    
    @Override
    public String getName() {
        return "BluetoothMeshModule";
    }
    
    private void initializeBluetooth() {
        BluetoothManager bluetoothManager = 
            (BluetoothManager) getReactApplicationContext().getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManager.getAdapter();
        if (bluetoothAdapter != null) {
            bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
            bluetoothLeAdvertiser = bluetoothAdapter.getBluetoothLeAdvertiser();
        }
    }

    private final AdvertiseCallback advertisingCallback = new AdvertiseCallback() {
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            super.onStartSuccess(settingsInEffect);
        }

        @Override
        public void onStartFailure(int errorCode) {
            super.onStartFailure(errorCode);
        }
    };

    private final BluetoothGattServerCallback gattServerCallback = new BluetoothGattServerCallback() {
        @Override
        public void onConnectionStateChange(BluetoothDevice device, int status, int newState) {
            if (newState == BluetoothGatt.STATE_CONNECTED) {
                // Handle new connection
            } else if (newState == BluetoothGatt.STATE_DISCONNECTED) {
                // Handle disconnection
            }
        }

        @Override
        public void onCharacteristicReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattCharacteristic characteristic) {
            if (PUBLIC_KEY_CHARACTERISTIC_UUID.equals(characteristic.getUuid())) {
                gattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, 0,
                        ownPublicKey != null ? ownPublicKey.getBytes() : null);
            }
        }
    };

    @ReactMethod
    public void startAdvertising(String publicKey, Promise promise) {
        this.ownPublicKey = publicKey;

        if (bluetoothLeAdvertiser == null) {
            promise.reject("BLUETOOTH_UNAVAILABLE", "Bluetooth Advertiser is not available");
            return;
        }

        gattServer = ((BluetoothManager) getReactApplicationContext().getSystemService(Context.BLUETOOTH_SERVICE)).openGattServer(getReactApplicationContext(), gattServerCallback);
        
        BluetoothGattService service = new BluetoothGattService(SERVICE_UUID, BluetoothGattService.SERVICE_TYPE_PRIMARY);
        service.addCharacteristic(new BluetoothGattCharacteristic(TX_CHARACTERISTIC_UUID, BluetoothGattCharacteristic.PROPERTY_WRITE, BluetoothGattCharacteristic.PERMISSION_WRITE));
        service.addCharacteristic(new BluetoothGattCharacteristic(RX_CHARACTERISTIC_UUID, BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ));
        service.addCharacteristic(new BluetoothGattCharacteristic(PUBLIC_KEY_CHARACTERISTIC_UUID, BluetoothGattCharacteristic.PROPERTY_READ, BluetoothGattCharacteristic.PERMISSION_READ));
        gattServer.addService(service);

        AdvertiseSettings settings = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(true)
                .build();

        AdvertiseData data = new AdvertiseData.Builder()
                .setIncludeDeviceName(true)
                .addServiceUuid(new ParcelUuid(SERVICE_UUID))
                .build();

        bluetoothLeAdvertiser.startAdvertising(settings, data, advertisingCallback);
        promise.resolve(true);
    }
    
    @ReactMethod
    public void startScanning(Promise promise) {
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            promise.reject("BLUETOOTH_DISABLED", "Bluetooth is not enabled");
            return;
        }
        
        ScanCallback scanCallback = new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                BluetoothDevice device = result.getDevice();
                String deviceId = device.getAddress();
                String deviceName = device.getName();
                int rssi = result.getRssi();
                
                WritableMap deviceMap = Arguments.createMap();
                deviceMap.putString("id", deviceId);
                deviceMap.putString("name", deviceName != null ? deviceName : "Unknown");
                deviceMap.putString("address", deviceId);
                deviceMap.putInt("rssi", rssi);
                
                sendEvent("DeviceDiscovered", deviceMap);
            }
            
            @Override
            public void onScanFailed(int errorCode) {
                sendEvent("ScanFailed", Arguments.createMap());
            }
        };
        
        bluetoothLeScanner.startScan(scanCallback);
        promise.resolve("Scanning started");
    }
    
    @ReactMethod
    public void connectToDevice(String deviceAddress, Promise promise) {
        BluetoothDevice device = bluetoothAdapter.getRemoteDevice(deviceAddress);
        device.connectGatt(getReactApplicationContext(), false, new BluetoothGattCallback() {
            @Override
            public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
                 if (newState == BluetoothGatt.STATE_CONNECTED) {
                    connectedDevices.put(deviceAddress, gatt);
                    gatt.discoverServices();
                    WritableMap map = Arguments.createMap();
                    map.putString("deviceId", deviceAddress);
                    map.putString("status", "connected");
                    sendEvent("ConnectionStateChanged", map);
                } else if (newState == BluetoothGatt.STATE_DISCONNECTED) {
                    connectedDevices.remove(deviceAddress);
                    WritableMap map = Arguments.createMap();
                    map.putString("deviceId", deviceAddress);
                    map.putString("status", "disconnected");
                    sendEvent("ConnectionStateChanged", map);
                }
            }

            @Override
            public void onServicesDiscovered(BluetoothGatt gatt, int status) {
                if (status == BluetoothGatt.GATT_SUCCESS) {
                    BluetoothGattService service = gatt.getService(SERVICE_UUID);
                    if (service != null) {
                        BluetoothGattCharacteristic pkCharacteristic = service.getCharacteristic(PUBLIC_KEY_CHARACTERISTIC_UUID);
                        if(pkCharacteristic != null) {
                           gatt.readCharacteristic(pkCharacteristic);
                        }
                    }
                }
            }

            @Override
            public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
                 if (PUBLIC_KEY_CHARACTERISTIC_UUID.equals(characteristic.getUuid())) {
                    String publicKey = new String(characteristic.getValue());
                    WritableMap map = Arguments.createMap();
                    map.putString("deviceId", gatt.getDevice().getAddress());
                    map.putString("publicKey", publicKey);
                    sendEvent("PublicKeyReceived", map);
                }
            }

             @Override
            public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
                byte[] data = characteristic.getValue();
                String deviceId = gatt.getDevice().getAddress();
                
                WritableMap messageMap = Arguments.createMap();
                messageMap.putString("deviceId", deviceId);
                messageMap.putString("data", Base64.getEncoder().encodeToString(data));
                
                sendEvent("MessageReceived", messageMap);
            }
        });
        promise.resolve("Connection initiated");
    }
    
    @ReactMethod
    public void sendMessage(String deviceAddress, String message, Promise promise) {
        BluetoothGatt gatt = connectedDevices.get(deviceAddress);
        if (gatt == null) {
            promise.reject("DEVICE_NOT_CONNECTED", "Device is not connected");
            return;
        }
        
        BluetoothGattService service = gatt.getService(SERVICE_UUID);
        if (service == null) {
            promise.reject("SERVICE_NOT_FOUND", "SecureComm service not found");
            return;
        }
        
        BluetoothGattCharacteristic txCharacteristic = service.getCharacteristic(TX_CHARACTERISTIC_UUID);
        if (txCharacteristic == null) {
            promise.reject("CHARACTERISTIC_NOT_FOUND", "TX characteristic not found");
            return;
        }
        
        txCharacteristic.setValue(Base64.getDecoder().decode(message));
        boolean success = gatt.writeCharacteristic(txCharacteristic);
        
        if (success) {
            promise.resolve("Message sent");
        } else {
            promise.reject("SEND_FAILED", "Failed to send message");
        }
    }
    
    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}
