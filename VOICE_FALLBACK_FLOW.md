# Voice Synthesis Fallback Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Voice Synthesis Request                   │
│                  (User enables narration)                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Try ElevenLabs │
                    │   (Primary)    │
                    └────────┬───────┘
                             │
                    ┌────────▼────────┐
                    │   Success?      │
                    └────┬───────┬────┘
                         │       │
                    YES  │       │  NO (401/Error)
                         │       │
                         │       ▼
                         │  ┌─────────────────┐
                         │  │  Try AWS Polly  │
                         │  │   (Fallback)    │
                         │  └────────┬────────┘
                         │           │
                         │  ┌────────▼────────┐
                         │  │   Configured?   │
                         │  └────┬───────┬────┘
                         │       │       │
                         │  YES  │       │  NO
                         │       │       │
                         │       ▼       ▼
                         │  ┌─────────────────┐
                         │  │   Success?      │
                         │  └────┬───────┬────┘
                         │       │       │
                         │  YES  │       │  NO
                         │       │       │
                         ▼       ▼       ▼
                    ┌─────────────────────────┐
                    │   Simulated Audio      │
                    │  (Synthetic Tones)     │
                    │   (Always Works)       │
                    └────────┬────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Play Audio    │
                    └────────────────┘
```

## Service Priority

1. **ElevenLabs** - Best quality, child-friendly voices
2. **AWS Polly** - Good quality, reliable neural voices
3. **Simulated Audio** - Basic tones, guaranteed to work

## Configuration Required

- **ElevenLabs**: `VITE_ELEVENLABS_API_KEY` in `.env`
- **AWS Polly**: `VITE_AWS_ACCESS_KEY_ID` and `VITE_AWS_SECRET_ACCESS_KEY` in `.env`
- **Simulated**: No configuration needed (browser-based)

## When Each Service Is Used

### ElevenLabs Used When:
- Valid API key is configured
- API quota not exceeded
- Network connection available
- Voice ID is valid

### AWS Polly Used When:
- ElevenLabs fails (401, network error, etc.)
- AWS credentials are configured
- IAM permissions are correct

### Simulated Audio Used When:
- Both ElevenLabs and Polly fail
- No credentials configured
- Guaranteed fallback option
