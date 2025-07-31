
import Foundation
import CryptoKit
import React

@objc(CryptoModule)
class CryptoModule: NSObject {

    private var privateKey: P256.KeyAgreement.PrivateKey?

    override init() {
        super.init()
        self.privateKey = P256.KeyAgreement.PrivateKey()
    }

    @objc(getPublicKey:rejecter:)
    func getPublicKey(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let privateKey = self.privateKey else {
            reject("error", "Private key not generated", nil)
            return
        }
        resolve(privateKey.publicKey.rawRepresentation.base64EncodedString())
    }

    @objc(generateSharedSecret:resolver:rejecter:)
    func generateSharedSecret(remotePublicKeyString: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let privateKey = self.privateKey,
              let remotePublicKeyData = Data(base64Encoded: remotePublicKeyString) else {
            reject("error", "Invalid key", nil)
            return
        }
        do {
            let remotePublicKey = try P256.KeyAgreement.PublicKey(rawRepresentation: remotePublicKeyData)
            let sharedSecret = try privateKey.sharedSecretFromKeyAgreement(with: remotePublicKey)
            resolve(sharedSecret.withUnsafeBytes { Data($0).base64EncodedString() })
        } catch {
            reject("error", "Failed to generate shared secret", error)
        }
    }

    @objc(encrypt:key:resolver:rejecter:)
    func encrypt(data: String, key: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let keyData = Data(base64Encoded: key) else {
            reject("error", "Invalid key", nil)
            return
        }
        do {
            let symmetricKey = SymmetricKey(data: keyData)
            let sealedBox = try AES.GCM.seal(data.data(using: .utf8)!, using: symmetricKey)
            resolve(sealedBox.combined!.base64EncodedString())
        } catch {
            reject("error", "Failed to encrypt", error)
        }
    }

    @objc(decrypt:key:resolver:rejecter:)
    func decrypt(encryptedData: String, key: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let keyData = Data(base64Encoded: key),
              let combinedData = Data(base64Encoded: encryptedData) else {
            reject("error", "Invalid data", nil)
            return
        }
        do {
            let symmetricKey = SymmetricKey(data: keyData)
            let sealedBox = try AES.GCM.SealedBox(combined: combinedData)
            let decryptedData = try AES.GCM.open(sealedBox, using: symmetricKey)
            resolve(String(data: decryptedData, encoding: .utf8))
        } catch {
            reject("error", "Failed to decrypt", error)
        }
    }
}
