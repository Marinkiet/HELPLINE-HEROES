# AWS Polly Setup Guide

This application uses AWS Polly as a fallback voice synthesis service when ElevenLabs API fails or is unavailable.

## Configuration

Add your AWS credentials to the `.env` file:

```env
# AWS Polly Configuration (Fallback for voice synthesis)
VITE_AWS_ACCESS_KEY_ID=your_access_key_id_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
VITE_AWS_REGION=us-east-1
```

## How It Works

The voice synthesis service uses a fallback chain:

1. **ElevenLabs API** (Primary)
   - Attempts to use ElevenLabs for high-quality voice synthesis
   - Uses the configured API key from `VITE_ELEVENLABS_API_KEY`

2. **AWS Polly** (Fallback)
   - If ElevenLabs fails (401 error, network error, etc.), automatically tries AWS Polly
   - Requires AWS credentials to be configured in `.env`
   - Uses the "Joanna" neural voice for child-friendly narration

3. **Simulated Audio** (Final Fallback)
   - If both services fail, generates simple synthetic tones
   - Always works as a last resort

## Getting AWS Credentials

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Go to IAM (Identity and Access Management)
3. Create a new user or use an existing one
4. Attach the `AmazonPollyReadOnlyAccess` policy
5. Create access keys and copy:
   - Access Key ID
   - Secret Access Key

## Testing

To test the fallback:

1. Add your AWS credentials to `.env`
2. Restart the development server
3. Open browser console to see logs
4. Enable narration in the app
5. You should see logs showing which service was used:
   - `✅ Real Eleven Labs speech generated successfully!` - ElevenLabs worked
   - `🔄 Attempting AWS Polly fallback...` - Falling back to Polly
   - `✅ AWS Polly speech generated successfully!` - Polly worked
   - `🔊 Creating enhanced simulated audio...` - Using synthetic fallback

## Supported Languages

AWS Polly currently uses the "Joanna" voice for all languages. For better language support, you can modify the voice selection in `src/services/pollyService.ts`.

Available Polly voices can be found in the [AWS Polly documentation](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html).

## Cost

AWS Polly pricing (as of 2024):
- First 5 million characters per month are free (for the first 12 months)
- After free tier: $4.00 per 1 million characters for neural voices
- Each game narration is typically 100-500 characters

For most use cases, the free tier should be sufficient.

## Security Note

Never commit your AWS credentials to version control. The `.env` file should be in `.gitignore` to prevent accidental exposure of sensitive keys.
