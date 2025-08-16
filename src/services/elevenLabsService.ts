import { AudioConfig, VOICE_IDS } from '../types/audio';

class ElevenLabsService {
  private apiKey: string = '';
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  constructor() {
    // In production, this would come from environment variables
    // For demo purposes, we'll simulate the API calls
    this.apiKey = 'demo-key';
  }

  async generateSpeech(config: AudioConfig): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would make an actual API call:
    /*
    const response = await fetch(`${this.baseUrl}/text-to-speech/${VOICE_IDS[config.language]}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: config.text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
    */
    
    // For demo, return a placeholder audio URL
    return `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`;
  }

  async preloadAudio(texts: Record<string, string>): Promise<Record<string, string>> {
    const audioUrls: Record<string, string> = {};
    
    for (const [key, text] of Object.entries(texts)) {
      // Extract language from key (e.g., 'welcome_en' -> 'en')
      const language = key.split('_').pop() as 'en' | 'af' | 'zu';
      if (language && ['en', 'af', 'zu'].includes(language)) {
        audioUrls[key] = await this.generateSpeech({ language, text });
      }
    }
    
    return audioUrls;
  }
}

export const elevenLabsService = new ElevenLabsService();