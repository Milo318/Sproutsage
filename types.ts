
export interface PlantCareInfo {
  commonName: string;
  scientificName: string;
  description: string;
  watering: string;
  wateringFrequencyDays: number; // Structured field for reminders
  light: string;
  temperature: string;
  soil: string;
  fertilizer: string;
  pests: string[];
  funFact: string;
}

export interface PlantIssueInfo {
  issueName: string;
  category: 'Pest' | 'Disease' | 'Nutrient Deficiency' | 'Environmental';
  severity: 'Low' | 'Moderate' | 'High';
  description: string;
  symptoms: string[];
  organicTreatment: string;
  chemicalTreatment: string;
  prevention: string;
}

export interface JournalEntry {
  id: string;
  plantName: string;
  date: string; // ISO string for storage
  note: string;
  imageUrl?: string;
  category: 'Growth' | 'Watering' | 'Issue' | 'Observation';
}

export interface SavedPlant {
  id: string;
  info: PlantCareInfo;
  imageUrl: string;
  lastWatered: string; // ISO string
  nickname?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: GroundingSource[];
}

export enum AppTab {
  IDENTIFY = 'identify',
  DIAGNOSE = 'diagnose',
  JOURNAL = 'journal',
  MY_GARDEN = 'garden',
  CHAT = 'chat'
}
