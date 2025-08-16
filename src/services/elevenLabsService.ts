import { AudioConfig, VOICE_IDS } from '../types/audio';

class ElevenLabsService {
  private apiKey: string = '';
  private baseUrl = 'https://api.elevenlabs.io/v1';
  
  constructor() {
    // Real Eleven Labs API key - replace with your actual key from https://elevenlabs.io/
    this.apiKey = 'sk_8bf03898286bfe228254410a9b3251d00cb8383132b37287';
  }

  async generateSpeech(config: AudioConfig): Promise<string> {
    // Use child voice for game content
    const voiceId = config.voiceId || VOICE_IDS.child;
    
    console.log(`🎵 Generating speech for: "${config.text.substring(0, 50)}..." in ${config.language} with voice ${voiceId}`);
    
    // Simulate API call delay for demo
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // REAL ELEVEN LABS API IMPLEMENTATION
    if (this.apiKey && this.apiKey !== 'demo-key') {
      try {
        console.log('🔗 Attempting real Eleven Labs API call...');
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
              similarity_boost: 0.5,
              style: 0.0,
              use_speaker_boost: true
            }
          })
        });
        
        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('✅ Real Eleven Labs speech generated successfully!');
          return audioUrl;
        } else {
          const errorText = await response.text();
          console.error('❌ Eleven Labs API error:', response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.error('❌ Eleven Labs API request failed:', error);
      }
    }
    
    console.log('⚠️ Falling back to simulated audio...');
    
    // FALLBACK SIMULATED AUDIO (Used when API fails or no key provided)
    try {
      console.log('🔊 Creating enhanced simulated audio...');
      
      // Create a more sophisticated audio simulation based on content type
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = Math.max(2, Math.min(8, config.text.length / 20)); // Dynamic duration based on text length
      const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Create different sound patterns based on content
      const isWelcome = config.text.toLowerCase().includes('welcome') || config.text.toLowerCase().includes('detective');
      const isInstruction = config.text.toLowerCase().includes('click') || config.text.toLowerCase().includes('star');
      const isBodyPart = config.text.toLowerCase().includes('body') || config.text.toLowerCase().includes('private');
      
      for (let i = 0; i < data.length; i++) {
        const time = i / sampleRate;
        let sample = 0;
        
        if (isWelcome) {
          // Cheerful welcome melody
          sample = Math.sin(2 * Math.PI * 440 * time) * 0.3 * Math.exp(-time * 0.5) +
                  Math.sin(2 * Math.PI * 554 * time) * 0.2 * Math.exp(-time * 0.7) +
                  Math.sin(2 * Math.PI * 659 * time) * 0.1 * Math.exp(-time * 0.9);
        } else if (isInstruction) {
          // Gentle instruction tone
          sample = Math.sin(2 * Math.PI * 523 * time) * 0.25 * Math.exp(-time * 0.3) +
                  Math.sin(2 * Math.PI * 392 * time) * 0.15 * Math.exp(-time * 0.5);
        } else if (isBodyPart) {
          // Calm educational tone
          sample = Math.sin(2 * Math.PI * 349 * time) * 0.2 * Math.exp(-time * 0.4) +
                  Math.sin(2 * Math.PI * 466 * time) * 0.1 * Math.exp(-time * 0.6);
        } else {
          // Default pleasant tone
          sample = Math.sin(2 * Math.PI * 440 * time) * 0.2 * Math.exp(-time * 0.5);
        }
        
        // Add some gentle modulation
        sample *= (1 + 0.1 * Math.sin(2 * Math.PI * 2 * time));
        data[i] = sample;
      }
      
      // Convert buffer to blob
      const audioBuffer = this.bufferToWave(buffer);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('✅ Enhanced simulated audio created successfully!');
      return audioUrl;
    } catch (error) {
      console.warn('⚠️ Simulated audio creation failed, using simple fallback:', error);
      // Simple fallback
      return this.createSimpleBeep();
    }
  }

  // Generate star click sound effect
  async generateStarClickSound(): Promise<string> {
    console.log('⭐ Generating star click sound effect...');
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = 0.5; // Short sound effect
      const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Create a magical "ding" sound for star clicks
      for (let i = 0; i < data.length; i++) {
        const time = i / sampleRate;
        // Bright, magical sound with harmonics
        const sample = Math.sin(2 * Math.PI * 880 * time) * 0.4 * Math.exp(-time * 3) +  // High ding
                      Math.sin(2 * Math.PI * 1108 * time) * 0.3 * Math.exp(-time * 4) + // Higher harmonic
                      Math.sin(2 * Math.PI * 1318 * time) * 0.2 * Math.exp(-time * 5) + // Even higher
                      Math.sin(2 * Math.PI * 440 * time) * 0.1 * Math.exp(-time * 2);   // Lower foundation
        
        data[i] = sample;
      }
      
      const audioBuffer = this.bufferToWave(buffer);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('✅ Star click sound effect created!');
      return audioUrl;
    } catch (error) {
      console.warn('⚠️ Star sound creation failed:', error);
      return this.createSimpleBeep();
    }
  }

  // Helper method to convert AudioBuffer to WAV
  private bufferToWave(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  }

  private createSimpleBeep(): string {
    // Fallback simple beep
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