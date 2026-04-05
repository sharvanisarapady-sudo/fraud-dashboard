import { useCallback, useEffect, useRef, useState } from 'react';
import './VoiceVerification.css';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
] as const;

export function VoiceVerification() {
  const [lang, setLang] = useState<string>(LANGUAGES[0].code);
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);

  const supported =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition != null || window.webkitSpeechRecognition != null);

  const stopRecognition = useCallback(() => {
    const r = recRef.current;
    if (r) {
      try {
        r.stop();
      } catch {
        /* ignore */
      }
      recRef.current = null;
    }
    setListening(false);
    setInterimText('');
  }, []);

  const startRecognition = useCallback(() => {
    if (!supported) return;
    setError(null);
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      setError('Speech recognition is not available.');
      return;
    }
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0]?.transcript ?? '';
        if (event.results[i].isFinal) finalChunk += piece;
        else interim += piece;
      }
      if (finalChunk) {
        setFinalText((prev) => (prev ? `${prev} ${finalChunk}`.trim() : finalChunk.trim()));
      }
      setInterimText(interim.trim());
    };

    recognition.onerror = (ev: SpeechRecognitionErrorEvent) => {
      if (ev.error === 'aborted' || ev.error === 'no-speech') return;
      setError(`${ev.error}${ev.message ? `: ${ev.message}` : ''}`);
    };

    recognition.onend = () => {
      if (recRef.current === recognition) {
        recRef.current = null;
        setListening(false);
        setInterimText('');
      }
    };

    recRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start microphone');
      recRef.current = null;
    }
  }, [lang, supported]);

  useEffect(() => {
    return () => stopRecognition();
  }, [stopRecognition]);

  return (
    <section className="voice-panel" aria-label="Voice verification">
      <h2 className="voice-panel__header">Voice verification</h2>
      {!supported ? (
        <p className="voice-panel__error">
          Web Speech API is not supported in this browser. Try Chrome or Edge on desktop.
        </p>
      ) : (
        <>
          <div className="voice-panel__row">
            <span className="voice-panel__label">Language</span>
            <select
              className="voice-panel__select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              disabled={listening}
              aria-label="Recognition language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            {!listening ? (
              <button
                type="button"
                className="voice-panel__btn voice-panel__btn--start"
                onClick={startRecognition}
              >
                Start microphone
              </button>
            ) : (
              <button
                type="button"
                className="voice-panel__btn voice-panel__btn--stop"
                onClick={stopRecognition}
              >
                Stop microphone
              </button>
            )}
            <span
              className={
                listening ? 'voice-panel__status voice-panel__status--live' : 'voice-panel__status'
              }
            >
              {listening ? '● Listening…' : 'Idle'}
            </span>
          </div>
          {error ? <p className="voice-panel__error">{error}</p> : null}
          <p className="voice-panel__hint">
            Speak clearly. Transcript updates live; final phrases append when the engine commits a
            segment.
          </p>
          <div className="voice-panel__transcript" role="log" aria-live="polite">
            {finalText || interimText ? (
              <>
                {finalText}
                {interimText ? (
                  <>
                    {finalText ? ' ' : null}
                    <span className="voice-panel__interim">{interimText}</span>
                  </>
                ) : null}
              </>
            ) : (
              <span className="voice-panel__interim">Transcript will appear here…</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
