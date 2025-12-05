import { GoogleGenAI, Type } from "@google/genai";
import { Track } from '../types';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchMusicWithGemini = async (query: string): Promise<Track[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of 5 real or realistic sounding songs that match the search query: "${query}". Return the result as a JSON array of objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              album: { type: Type.STRING },
              duration: { type: Type.STRING },
            },
            required: ["id", "title", "artist", "album", "duration"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];

    const rawTracks = JSON.parse(text);
    
    // Add random cover images locally since LLM can't generate valid URLs easily
    return rawTracks.map((track: any, index: number) => ({
      ...track,
      id: `gemini-${Date.now()}-${index}`,
      coverUrl: `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 1000)}`
    }));

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

export const getGeminiGreeting = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Give me a very short, creative greeting for a music app user (e.g. 'Ready to rock?', 'Good vibes only'). Max 5 words.",
        });
        return response.text || "Welcome back";
    } catch (e) {
        return "Welcome back";
    }
}
