
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlantCareInfo, PlantIssueInfo } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzePlantImage = async (base64Image: string): Promise<PlantCareInfo> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Identify this plant and provide comprehensive care instructions. Return ALL data in the specified JSON format.

For wateringFrequencyDays, provide an integer representing average days between waterings (e.g., 1 for daily, 3 for every 3 days, 7 for weekly).
For difficulty, rate as "Easy", "Moderate", or "Expert" based on how challenging the plant is for beginners.
For toxicity, accurately assess if the plant is toxic to pets and/or humans, with specific details about which parts are toxic.
For seasonalCare, provide specific seasonal care tips for spring, summer, fall, and winter.
For propagation, briefly explain how to propagate this plant.
For commonVarieties, list 2-5 popular cultivars or varieties.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commonName: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          description: { type: Type.STRING },
          watering: { type: Type.STRING },
          wateringFrequencyDays: { 
            type: Type.INTEGER,
            description: "Average days between waterings. Use 1 for daily, 7 for weekly, etc."
          },
          light: { type: Type.STRING },
          temperature: { type: Type.STRING },
          soil: { type: Type.STRING },
          fertilizer: { type: Type.STRING },
          pests: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          funFact: { type: Type.STRING },
          difficulty: {
            type: Type.STRING,
            description: "Must be one of: Easy, Moderate, Expert"
          },
          toxicity: {
            type: Type.OBJECT,
            properties: {
              toxicToPets: { type: Type.BOOLEAN },
              toxicToHumans: { type: Type.BOOLEAN },
              details: { type: Type.STRING }
            },
            required: ["toxicToPets", "toxicToHumans", "details"]
          },
          seasonalCare: {
            type: Type.OBJECT,
            properties: {
              spring: { type: Type.STRING },
              summer: { type: Type.STRING },
              fall: { type: Type.STRING },
              winter: { type: Type.STRING }
            },
            required: ["spring", "summer", "fall", "winter"]
          },
          propagation: { type: Type.STRING },
          commonVarieties: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["commonName", "scientificName", "description", "watering", "wateringFrequencyDays", "light", "temperature", "soil", "fertilizer", "pests", "funFact", "difficulty", "toxicity", "seasonalCare", "propagation", "commonVarieties"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as PlantCareInfo;
};

export const analyzePlantIssue = async (base64Image: string): Promise<PlantIssueInfo> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = "Analyze this plant image for pests, diseases, or deficiencies. Identify the issue and provide both organic and chemical treatment options. Be thorough and specific in your diagnosis. Return the data in the specified JSON format.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          issueName: { type: Type.STRING },
          category: { 
            type: Type.STRING,
            description: "Must be one of: Pest, Disease, Nutrient Deficiency, Environmental"
          },
          severity: { 
            type: Type.STRING,
            description: "Must be one of: Low, Moderate, High"
          },
          description: { type: Type.STRING },
          symptoms: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          organicTreatment: { type: Type.STRING },
          chemicalTreatment: { type: Type.STRING },
          prevention: { type: Type.STRING },
        },
        required: ["issueName", "category", "severity", "description", "symptoms", "organicTreatment", "chemicalTreatment", "prevention"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as PlantIssueInfo;
};

export const createGardeningChat = () => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are SproutSage, a world-class gardening expert with decades of horticultural experience. You help users with:
- Plant care and identification
- Landscaping and garden design advice
- Pest control and disease management
- Soil health and composting
- Indoor and outdoor gardening
- Seasonal planting calendars

Your tone is warm, encouraging, and scientific yet accessible. Use markdown for formatting (bold, lists, etc). Keep responses focused on gardening and plant care. Be specific with plant names, quantities, and timelines when possible. When appropriate, use Google Search to provide up-to-date information on seasonal advice, local pests, or trending gardening news. If you're unsure about something, say so rather than guessing.`,
      tools: [{ googleSearch: {} }]
    }
  });
};
