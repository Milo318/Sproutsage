
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlantCareInfo, PlantIssueInfo } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzePlantImage = async (base64Image: string): Promise<PlantCareInfo> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = "Identify this plant and provide detailed care instructions. Return the data in the specified JSON format. For wateringFrequencyDays, provide an integer representing the average number of days between waterings (e.g., 3 for every 3 days, 7 for weekly).";
  
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
        },
        required: ["commonName", "scientificName", "description", "watering", "wateringFrequencyDays", "light", "temperature", "soil", "fertilizer", "pests", "funFact"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as PlantCareInfo;
};

export const analyzePlantIssue = async (base64Image: string): Promise<PlantIssueInfo> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = "Analyze this plant image for pests, diseases, or deficiencies. Identify the issue and provide organic and chemical treatment options. Return the data in the specified JSON format.";
  
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
      systemInstruction: "You are SproutSage, a world-class gardening expert. You help users with plant care, landscaping advice, pest control, and soil health. Your tone is friendly, encouraging, and scientific yet accessible. Use markdown for formatting. Keep responses focused on gardening. When appropriate, use Google Search to provide up-to-date information on seasonal advice, local pests, or trending gardening news.",
      tools: [{ googleSearch: {} }]
    }
  });
};
