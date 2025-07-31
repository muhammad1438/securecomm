
package com.securecomm;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyAgreement;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class CryptoModule extends ReactContextBaseJavaModule {

    private KeyPair keyPair;

    public CryptoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
            keyGen.initialize(256);
            this.keyPair = keyGen.generateKeyPair();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getName() {
        return "CryptoModule";
    }

    @ReactMethod
    public void getPublicKey(Promise promise) {
        promise.resolve(Base64.getEncoder().encodeToString(this.keyPair.getPublic().getEncoded()));
    }

    @ReactMethod
    public void generateSharedSecret(String remotePublicKeyString, Promise promise) {
        try {
            KeyAgreement keyAgreement = KeyAgreement.getInstance("ECDH");
            keyAgreement.init(this.keyPair.getPrivate());
            byte[] remotePublicKeyBytes = Base64.getDecoder().decode(remotePublicKeyString);
            PublicKey remotePublicKey = java.security.KeyFactory.getInstance("EC").generatePublic(new java.security.spec.X509EncodedKeySpec(remotePublicKeyBytes));
            keyAgreement.doPhase(remotePublicKey, true);
            byte[] sharedSecret = keyAgreement.generateSecret();
            promise.resolve(Base64.getEncoder().encodeToString(sharedSecret));
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void encrypt(String data, String key, Promise promise) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(key);
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] iv = cipher.getIV();
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            promise.resolve(Base64.getEncoder().encodeToString(iv) + ":" + Base64.getEncoder().encodeToString(encryptedData));
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void decrypt(String encryptedData, String key, Promise promise) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(key);
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
            String[] parts = encryptedData.split(":");
            byte[] iv = Base64.getDecoder().decode(parts[0]);
            byte[] data = Base64.getDecoder().decode(parts[1]);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec gcmParameterSpec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmParameterSpec);
            byte[] decryptedData = cipher.doFinal(data);
            promise.resolve(new String(decryptedData));
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}
