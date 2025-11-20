import { GoogleGenAI, Modality } from "@google/genai";
import { Station } from "../types";

// Initialize client
// Note: In a real app, ensure apiKey is handled securely.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

interface GeneratedContent {
  text: string;
  audioBase64?: string;
}

/**
 * Generates a script and then converts it to audio.
 */
export const generateStationContent = async (station: Station): Promise<GeneratedContent> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  try {
    // 1. Generate the script (Text)
    // We ask for a short script to keep generation fast for the demo
    const textModel = 'gemini-2.5-flash';
    const scriptResponse = await ai.models.generateContent({
      model: textModel,
      contents: station.prompt,
      config: {
        systemInstruction: "You are a professional radio host. Keep it concise, engaging, and suitable for audio broadcasting. Do not include sound effects text like *music plays*.",
        maxOutputTokens: 300, // Keep it short for speed
      }
    });

    const scriptText = scriptResponse.text || "Welcome to NCOR radio.";

    // 2. Generate the Audio (TTS)
    const ttsModel = 'gemini-2.5-flash-preview-tts';
    const audioResponse = await ai.models.generateContent({
      model: ttsModel,
      contents: {
        parts: [{ text: scriptText }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: station.voice || 'Puck' },
          },
        },
      },
    });

    const audioPart = audioResponse.candidates?.[0]?.content?.parts?.[0];
    
    if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
      throw new Error("No audio data received from Gemini.");
    }

    return {
      text: scriptText,
      audioBase64: audioPart.inlineData.data
    };

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};
