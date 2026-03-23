
export interface PlantCareInfo {
  commonName: string;
  scientificName: string;
  description: string;
  watering: string;
  wateringFrequencyDays: number;
  light: string;
  temperature: string;
  soil: string;
  fertilizer: string;
  pests: string[];
  funFact: string;
  difficulty: 'Easy' | 'Moderate' | 'Expert';
  toxicity: {
    toxicToPets: boolean;
    toxicToHumans: boolean;
    details: string;
  };
  seasonalCare: {
    spring: string;
    summer: string;
    fall: string;
    winter: string;
  };
  propagation: string;
  commonVarieties: string[];
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
  date: string;
  note: string;
  imageUrl?: string;
  category: 'Growth' | 'Watering' | 'Issue' | 'Observation';
}

export interface SavedPlant {
  id: string;
  info: PlantCareInfo;
  imageUrl: string;
  lastWatered: string;
  nickname?: string;
  dateAdded: string;
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
  HOME = 'home',
  IDENTIFY = 'identify',
  DIAGNOSE = 'diagnose',
  JOURNAL = 'journal',
  MY_GARDEN = 'garden',
  CHAT = 'chat'
}
