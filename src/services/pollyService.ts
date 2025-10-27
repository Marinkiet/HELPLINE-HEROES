import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { AudioConfig } from '../types/audio';

class PollyService {
  private client: PollyClient | null = null;
  private accessKeyId: string = '';
  private secretAccessKey: string = '';
  private region: string = 'us-east-1';

  constructor() {
    this.accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
    this.secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';
    this.region = import.meta.env.VITE_AWS_REGION || 'us-east-1';

    if (this.accessKeyId && this.secretAccessKey) {
      this.client = new PollyClient({
        region: this.region,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });
    }
  }

  isConfigured(): boolean {
    return this.client !== null && this.accessKeyId !== '' && this.secretAccessKey !== '';
  }

  private getVoiceForLanguage(language: string): string {
    const voiceMap: Record<string, string> = {
      'en': 'Joanna',
      'af': 'Joanna',
      'zu': 'Joanna',
      'xh': 'Joanna',
      'st': 'Joanna',
      'tn': 'Joanna',
      'ts': 'Joanna',
      've': 'Joanna',
      'nr': 'Joanna',
      'nso': 'Joanna',
    };
    return voiceMap[language] || 'Joanna';
  }

  async generateSpeech(config: AudioConfig): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Polly service is not configured');
    }

    try {
      console.log(`🎙️ Generating speech with AWS Polly for: "${config.text.substring(0, 50)}..." in ${config.language}`);

      const voice = this.getVoiceForLanguage(config.language);

      const command = new SynthesizeSpeechCommand({
        Text: config.text,
        OutputFormat: 'mp3',
        VoiceId: voice,
        Engine: 'neural',
        LanguageCode: 'en-US',
      });

      const response = await this.client!.send(command);

      if (response.AudioStream) {
        const audioData = await response.AudioStream.transformToByteArray();
        const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        console.log('✅ AWS Polly speech generated successfully!');
        return audioUrl;
      } else {
        throw new Error('No audio stream received from Polly');
      }
    } catch (error) {
      console.error('❌ AWS Polly error:', error);
      throw error;
    }
  }

  async generateStarClickSound(): Promise<string> {
    console.log('⭐ Generating star click sound with AWS Polly...');

    try {
      return await this.generateSpeech({
        language: 'en',
        text: 'Star!',
      });
    } catch (error) {
      console.error('❌ Failed to generate star click sound with Polly:', error);
      throw error;
    }
  }
}

export const pollyService = new PollyService();
