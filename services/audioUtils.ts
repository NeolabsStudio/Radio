// Singleton AudioContext to respect browser autoplay policies and resource management
let audioCtx: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    // Set sampleRate to 24000 to match Gemini TTS output
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000, 
    });
  }
  return audioCtx;
};

export const decodeAudioData = async (base64Data: string): Promise<AudioBuffer> => {
  const ctx = getAudioContext();
  
  try {
    // 1. Decode Base64 string to binary string
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    
    // 2. Convert to Uint8Array
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 3. Decode Raw PCM (16-bit signed integer, 24kHz, Mono, Little Endian)
    // Using DataView to ensure correct Endianness handling regardless of system architecture.
    const sampleRate = 24000;
    
    // Calculate number of samples (16-bit = 2 bytes per sample)
    const numSamples = Math.floor(len / 2);
    
    const audioBuffer = ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    const dataView = new DataView(bytes.buffer);
    
    // Loop through samples
    for (let i = 0; i < numSamples; i++) {
      // getInt16 at byte offset i*2, true for Little Endian
      const pcm16 = dataView.getInt16(i * 2, true);
      // Normalize to range [-1.0, 1.0]
      channelData[i] = pcm16 / 32768.0;
    }
    
    return audioBuffer;
  } catch (e) {
    console.error("Error decoding audio data:", e);
    // Return empty buffer on error to prevent crash, or rethrow
    return ctx.createBuffer(1, 1, 24000); 
  }
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};