
package com.securecomm;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.AudioManager;
import android.media.MediaRecorder;
import android.util.Base64;
import android.util.Log;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class AudioModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AudioModule";
    private static final int SAMPLE_RATE = 44100; // 44.1KHz
    private static final int CHANNEL_CONFIG_IN = AudioFormat.CHANNEL_IN_MONO;
    private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT;
    private static final int BUFFER_SIZE_RECORDING = AudioRecord.getMinBufferSize(
            SAMPLE_RATE,
            CHANNEL_CONFIG_IN,
            AUDIO_FORMAT
    );

    private static final int CHANNEL_CONFIG_OUT = AudioFormat.CHANNEL_OUT_MONO;
    private static final int BUFFER_SIZE_PLAYING = AudioTrack.getMinBufferSize(
            SAMPLE_RATE,
            CHANNEL_CONFIG_OUT,
            AUDIO_FORMAT
    );

    private AudioRecord audioRecord = null;
    private AudioTrack audioTrack = null;
    private boolean isRecording = false;
    private boolean isPlaying = false;
    private ExecutorService executorService = Executors.newSingleThreadExecutor();

    public AudioModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AudioModule";
    }

    @ReactMethod
    public void startRecording(Promise promise) {
        if (isRecording) {
            promise.resolve(true);
            return;
        }

        try {
            audioRecord = new AudioRecord(
                    MediaRecorder.AudioSource.MIC,
                    SAMPLE_RATE,
                    CHANNEL_CONFIG_IN,
                    AUDIO_FORMAT,
                    BUFFER_SIZE_RECORDING
            );

            if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
                throw new IllegalStateException("AudioRecord not initialized");
            }

            audioRecord.startRecording();
            isRecording = true;
            Log.d(TAG, "Recording started");

            executorService.execute(() -> {
                byte[] buffer = new byte[BUFFER_SIZE_RECORDING];
                while (isRecording) {
                    int bytesRead = audioRecord.read(buffer, 0, buffer.length);
                    if (bytesRead > 0) {
                        // Convert byte array to Base64 string for sending to JS
                        String base64Data = Base64.encodeToString(buffer, 0, bytesRead, Base64.NO_WRAP);
                        sendEvent("onAudioData", base64Data);
                        
                        // Calculate voice level (simple RMS for now)
                        long sum = 0;
                        for (int i = 0; i < bytesRead; i += 2) {
                            short sample = (short) ((buffer[i + 1] << 8) | buffer[i]);
                            sum += sample * sample;
                        }
                        double rms = Math.sqrt(sum / (bytesRead / 2));
                        double volume = rms / 32768.0; // Max amplitude for 16-bit PCM
                        sendEvent("onVoiceLevelChanged", volume);
                    }
                }
            });
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to start recording", e);
            promise.reject("START_RECORDING_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void stopRecording(Promise promise) {
        if (!isRecording) {
            promise.resolve(true);
            return;
        }
        isRecording = false;
        if (audioRecord != null) {
            try {
                audioRecord.stop();
                audioRecord.release();
                Log.d(TAG, "Recording stopped and released");
            } catch (Exception e) {
                Log.e(TAG, "Failed to stop recording", e);
                promise.reject("STOP_RECORDING_FAILED", e.getMessage());
            } finally {
                audioRecord = null;
            }
        }
        promise.resolve(true);
    }

    @ReactMethod
    public void startPlaying(Promise promise) {
        if (isPlaying) {
            promise.resolve(true);
            return;
        }

        try {
            audioTrack = new AudioTrack(
                    AudioManager.STREAM_MUSIC,
                    SAMPLE_RATE,
                    CHANNEL_CONFIG_OUT,
                    AUDIO_FORMAT,
                    BUFFER_SIZE_PLAYING,
                    AudioTrack.MODE_STREAM
            );

            if (audioTrack.getState() != AudioTrack.STATE_INITIALIZED) {
                throw new IllegalStateException("AudioTrack not initialized");
            }

            audioTrack.play();
            isPlaying = true;
            Log.d(TAG, "Playing started");
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to start playing", e);
            promise.reject("START_PLAYING_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void playAudioData(String base64AudioData, Promise promise) {
        if (!isPlaying || audioTrack == null) {
            promise.reject("NOT_PLAYING", "AudioTrack is not active or initialized.");
            return;
        }

        try {
            byte[] audioData = Base64.decode(base64AudioData, Base64.DEFAULT);
            audioTrack.write(audioData, 0, audioData.length);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Failed to play audio data", e);
            promise.reject("PLAY_AUDIO_DATA_FAILED", e.getMessage());
        }
    }

    @ReactMethod
    public void stopPlaying(Promise promise) {
        if (!isPlaying) {
            promise.resolve(true);
            return;
        }
        isPlaying = false;
        if (audioTrack != null) {
            try {
                audioTrack.stop();
                audioTrack.release();
                Log.d(TAG, "Playing stopped and released");
            } catch (Exception e) {
                Log.e(TAG, "Failed to stop playing", e);
                promise.reject("STOP_PLAYING_FAILED", e.getMessage());
            } finally {
                audioTrack = null;
            }
        }
        promise.resolve(true);
    }

    private void sendEvent(String eventName, Object data) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, data);
    }
}
