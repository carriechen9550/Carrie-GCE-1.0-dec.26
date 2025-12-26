
export type Language = 'en' | 'zh';

export interface ProductAnalysis {
  productName: string;
  category: string; // Tier 3 level
  targetAudience: string;
  painPoints: string[]; // Min 5
  sellingPoints: { point: string; hook: string }[];
  usp: string; // Detailed
  // New Market Data
  marketQuestions: { type: string; question: string; volume: string }[]; // AnswerThePublic
  negativeReviews: { source: string; complaint: string; sentiment: string }[]; // Trustpilot/Amazon
}

export interface CompetitorData {
  id: string;
  name: string;
  platform: 'TikTok' | 'Amazon' | 'Shopify';
  conversionRate: number; // Percentage
  monthlySales: number;
  topVideoUrl: string; // Search URL
  productUrl: string; // Search URL
  strategy: string;
}

export interface SubtitleStrategy {
    font: string;
    color: string;
    size: string;
    animation: string;
    explosiveMoments: string[]; // List of keywords or timestamps to highlight
}

export interface AudioSettings {
    voiceId: string;
    style: string;
    speed: string; // Pacing options
}

export interface Avatar {
    id: string;
    name: string;
    img: string | null; // null if waiting to generate
    desc: string; // Full visual description
    traits: {
        ethnicity: string;
        age: string;
        gender: string;
        vibe: string;
    };
    isCustom?: boolean;
}

export interface MarketingScript {
  id: string;
  versionName: string;
  style: string;
  platform: string;
  duration: string;
  copy: string;
  title: string;
  hashtags: string[];
  
  // AI Suggested Subtitle Config
  subtitleStrategy: SubtitleStrategy;
  
  // User Audio Preferences
  audioSettings: AudioSettings;

  scenes: {
    time: string;
    visual: string;
    audio: string;
    assetType: 'AI_Avatar' | 'Local_Footage' | 'Product_Image';
  }[];
  cta: string;
  source?: 'AI_GEN' | 'USER_PROMPT'; 
}

export enum AppStep {
  INPUT = 0,
  ANALYSIS = 1,
  STRATEGY = 2,
  GENERATION = 3,
  EDITOR = 4
}

export interface StrategyConfig {
  continent: string;
  countries: string[]; // Multi-select
  language: string;
  tone: string;
  videoStyle: string;
  sceneCategory: 'Indoor' | 'Outdoor';
  selectedScenes: string[]; // Array of scene names/IDs
  
  duration: string;
  aspectRatio: string;
  
  selectedAvatars: string[]; // IDs of selected avatars
  customAvatars: string[]; // Array of base64 strings
  
  uploadedScenes: string[];
}

export interface ProductionSlot {
    id: number;
    scriptId: string;
    status: 'idle' | 'generating' | 'done' | 'error';
    currentUrl: string | null;
    history: string[]; // Array of video URLs (versions)
    error?: string;
    promptHistory: string[]; // Track prompts used for each version
}
