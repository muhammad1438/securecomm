import { Platform, NativeModules, NativeEventEmitter } from "react-native";
import { Buffer } from "buffer"; // Import Buffer polyfill

const { AudioModule } = NativeModules;
const audioEventEmitter = new NativeEventEmitter(AudioModule);

class AudioService {
  private isRecording = false;
  private isPlaying = false;

  onVoiceLevelChanged?: (level: number) => void;

  constructor() {
    audioEventEmitter.addListener("onVoiceLevelChanged", (level: number) => {
      this.onVoiceLevelChanged?.(level);
    });
  }

  async initialize(): Promise<void> {
    // No specific initialization needed for the native module beyond constructor setup
    // This method is kept for consistency if future initializations are needed.
  }

  async startRecording(onAudioData: (data: Uint8Array) => void): Promise<void> {
    if (this.isRecording) return;

    try {
      const started = await AudioModule.startRecording();
      if (started) {
        this.isRecording = true;
        audioEventEmitter.addListener(
          "onAudioData",
          (base64AudioData: string) => {
            const audioData = new Uint8Array(
              Buffer.from(base64AudioData, "base64")
            );
            onAudioData(audioData);
          }
        );
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      throw error;
    }
  }

  async stopRecording(): Promise<void> {
    if (!this.isRecording) return;

    try {
      await AudioModule.stopRecording();
      this.isRecording = false;
      audioEventEmitter.removeAllListeners("onAudioData");
    } catch (error) {
      console.error("Failed to stop recording:", error);
      throw error;
    }
  }

  async playAudioData(audioData: Uint8Array): Promise<void> {
    if (!this.isPlaying) {
      // Start playing if not already started
      await AudioModule.startPlaying();
      this.isPlaying = true;
    }

    try {
      const base64AudioData = Buffer.from(audioData).toString("base64");
      await AudioModule.playAudioData(base64AudioData);
    } catch (error) {
      console.error("Failed to play audio data:", error);
      // Optionally stop playing if an error occurs during playback of a chunk
      // This might need more sophisticated error handling depending on desired behavior
      // this.stopPlaying();
    }
  }

  async stopPlaying(): Promise<void> {
    if (!this.isPlaying) return;

    try {
      await AudioModule.stopPlaying();
      this.isPlaying = false;
    } catch (error) {
      console.error("Failed to stop playing:", error);
      throw error;
    }
  }
}

export const audioService = new AudioService();
