export interface AudioConfig {
  language: 'en' | 'af' | 'zu';
  text: string;
  voiceId?: string;
}

export interface GameAudio {
  welcome: Record<string, string>;
  bodyParts: Record<string, Record<string, string>>;
  scenarios: Record<string, Record<string, string>>;
  trustedAdults: Record<string, string>;
  feedback: Record<string, Record<string, string>>;
}

export const VOICE_IDS = {
  en: 'pNInz6obpgDQGcFmaJgB', // Adam - friendly male voice
  af: 'EXAVITQu4vr4xnSDxMaL', // Sarah - warm female voice  
  zu: 'VR6AewLTigWG4xSOukaG', // Grace - gentle female voice
  child: 'oJebhZNaPllxk6W0LSBA' // Carla - Children's story narrator
};

export const LANGUAGES = {
  en: 'English',
  af: 'Afrikaans', 
  zu: 'Zulu'
} as const;