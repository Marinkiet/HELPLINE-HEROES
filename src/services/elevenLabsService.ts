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
    // Use child voice for game content
    const voiceId = config.voiceId || VOICE_IDS.child;
    
    console.log(`Generating speech for: "${config.text.substring(0, 50)}..." in ${config.language}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real implementation, this would make an actual API call:
    /*
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
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
    
    // For demo, create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Create a simple pleasant tone
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      // Create a blob URL for the audio
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.sin(2 * Math.PI * 440 * i / audioContext.sampleRate) * 0.1;
      }
      
      // Convert to blob and return URL
      const audioBlob = new Blob([buffer], { type: 'audio/wav' });
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.warn('Web Audio API not supported, using fallback');
      // Fallback to a data URL with a simple audio file
      return `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`;
    }
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