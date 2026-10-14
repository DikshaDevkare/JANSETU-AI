// Web Speech API wrapper for Speech-to-Text (STT) and Text-to-Speech (TTS)

export interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: (langCode?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Clean markdown, links, brackets, and code syntax before text-to-speech
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/https?:\/\/\S+/gi, '') // remove raw URLs
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/[*_~`#>]/g, '') // remove markdown symbols
    .replace(/•/g, ', ') // replace bullet points with pause
    .replace(/₹(\d+)/g, '$1 Rupees ') // make rupees pronounceable
    .replace(/\s+/g, ' ')
    .trim();
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  // --- Text-to-Speech (TTS) ---
  public speak(
    text: string,
    langCode: string = 'hi-IN',
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported in this browser.');
      return;
    }

    this.stopSpeaking();

    const cleanText = sanitizeTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick appropriate voice
    const voices = this.synth.getVoices();
    let matchingVoice: SpeechSynthesisVoice | undefined;

    if (langCode.startsWith('mr')) {
      matchingVoice = voices.find(v => v.lang.includes('mr') || v.name.toLowerCase().includes('marathi'));
    } else if (langCode.startsWith('hi')) {
      matchingVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
    } else {
      matchingVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN') || v.lang.includes('en-GB') || v.lang.includes('en'));
    }

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    } else if (voices.length > 0) {
      utterance.lang = langCode;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pauseSpeaking() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resumeSpeaking() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && (this.synth.speaking || this.synth.pending));
  }

  // --- Speech-to-Text (STT) Recognition Instance ---
  public createRecognition(
    langCode: string = 'hi-IN',
    onResult: (text: string) => void,
    onError: (errorMsg: string) => void,
    onEnd: () => void
  ): any {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError('Speech Recognition is not supported on this browser. Please use Chrome, Edge, or Safari.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = langCode;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      onResult(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      let msg = 'Microphone error occurred.';
      if (event.error === 'not-allowed') {
        msg = 'Microphone access was denied. Please allow microphone permissions in your browser address bar.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech was detected. Please tap the mic and try speaking again.';
      } else if (event.error === 'network') {
        msg = 'Network connection issue with speech recognition.';
      }
      onError(msg);
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  }
}

export const speechService = new SpeechService();
