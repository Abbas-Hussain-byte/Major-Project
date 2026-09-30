# Voice Interim Providers & Fallback Design

Because Bhashini credentials are not yet available, the system uses an interim provider model that permanently acts as a fallback chain.

## Fallback Design
The `VOICE_PROVIDERS` environment variable defines an ordered list of providers (e.g. `bhashini,browser_gemini`).
- The factory walks the list in order.
- Skips providers that are not configured (e.g. no credentials).
- On runtime failure or timeout, it falls through to the next provider.

## Interim Constraints
Until Bhashini credentials are provided:
- ASR (speech-to-text) and TTS (text-to-speech) are handled client-side using `SpeechRecognition` and `speechSynthesis` (Browser limits).
- MT (translation) falls back to Gemini (`gemini-3.5-flash`).

## Privacy Note
For the browser-based speech recognition on Chrome, audio is sent to Google's servers for transcription. This should be communicated to the user or handled carefully.

## Swapping in Bhashini
Once credentials arrive:
1. Update `.env` with Bhashini credentials.
2. Implement `server/src/services/voiceGateway/providers/bhashiniTranslation.js` matching the required Bhashini API shape.
3. Keep `VOICE_PROVIDERS=bhashini,browser_gemini`. The factory will automatically pick up Bhashini as the primary.

## Manual Test Checklist
Please verify the following scenarios manually:
- [ ] Chrome on Android: Ensure speech recognition works.
- [ ] Mic permission denied: Verify the UI shows "Microphone permission denied" and falls back to text.
- [ ] Missing Telugu voice: If `hasVoice('te')` returns false, verify it falls back to text with a one-line explanation.
- [ ] Offline: Verify it catches the network error and falls back cleanly.
- [ ] Unsupported browser: Test on a browser without SpeechRecognition (e.g., Firefox) and ensure it degrades gracefully to text.
