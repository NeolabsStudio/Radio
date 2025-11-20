
export enum AudioStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR'
}

export type ContentType = 'radio' | 'podcast' | 'audiobook';

export interface Station {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  type: ContentType;
  
  // AI Specific
  prompt?: string; // System prompt for the AI host
  voice?: string; // Voice name preference
  
  // Creator Platform Specific
  author: string;
  isPremium: boolean;
  isUserGenerated: boolean;
  audioUrl?: string; // Direct URL for uploaded content (optional if audioBlob is present)
  audioBlob?: Blob; // Direct binary storage for local uploads
  duration?: string;
  
  // Persistence
  isFavorite?: boolean;
  createdAt?: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string; // AI Host Name
  imageUrl: string;
  audioBuffer: AudioBuffer | null;
  duration: number;
}

export interface Episode {
  id: string;
  stationId: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  imageUrl: string;
}

export interface Program {
  id: string;
  time: string;
  title: string;
  host: string;
  isLive: boolean;
}

export interface UserProfile {
  name: string;
  preferences: string[];
}

export type ViewPage = 'home' | 'radio' | 'podcasts' | 'audiobooks' | 'explore' | 'library' | 'upload' | 'studio';
