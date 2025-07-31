
import Foundation
import React

@objc(AudioModule)
class AudioModule: NSObject {

  @objc(readAudioChunk:resolver:rejecter:)
  func readAudioChunk(path: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    do {
      let fileUrl = URL(fileURLWithPath: path)
      let fileData = try Data(contentsOf: fileUrl)
      let chunk = fileData.subdata(in: 0..<min(1024, fileData.count))
      resolve(chunk.base64EncodedString())
    } catch {
      reject("error", "Failed to read audio chunk", error)
    }
  }
}
