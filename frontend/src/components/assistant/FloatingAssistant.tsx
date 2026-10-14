import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Loader2,
  Bot,
  User,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, SourceCitation, SuggestedAction } from '../../types';
import { api } from '../../services/api';
import { speechService } from '../../services/speech';

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onTriggerAction: (action: SuggestedAction) => void;
}

export const FloatingAssistant: React.FC<AssistantProps> = ({
  isOpen,
  onClose,
  onOpen,
  onTriggerAction
}) => {
  const { t, i18n } = useTranslation();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: (i18n.language === 'mr')
        ? 'नमस्कार! मी जनसेतु AI मित्र आहे. मी तुम्हाला सरकारी योजना, दाखले, बीएमसी नागरी तक्रारी आणि आपत्कालीन नंबर याबद्दल अधिकृत माहिती देऊ शकतो. तुम्ही विचारू शकता किंवा माईकवर बोलू शकता.'
        : (i18n.language === 'hi')
        ? 'नमस्ते! मैं जनसेतु AI मित्र हूँ। मैं आपको सरकारी योजनाओं, आवश्यक दस्तावेजों, बीएमसी नागरिक शिकायतों और आपातकालीन सेवाओं की आधिकारिक जानकारी दे सकता हूँ। आप टाइप कर सकते हैं या माइक दबाकर बोल सकते हैं।'
        : 'Namaste! I am JanSetu AI Mitra, your multilingual public services assistant grounded in official government sources. How can I assist you with schemes, documents, civic complaints, or emergencies today?',
      timestamp: 'Just now',
      suggested_actions: [
        { label: 'Farmer Schemes (PM-KISAN)', action_type: 'check_eligibility', payload: { scheme_code: 'PM_KISAN' } },
        { label: 'Ladki Bahin Yojana', action_type: 'navigate', payload: { view: 'schemes', scheme_code: 'LADKI_BAHIN_MAHA' } },
        { label: 'Update Aadhaar Address', action_type: 'navigate', payload: { view: 'services', service_code: 'AADHAAR_UPDATE' } },
        { label: 'Report Road Pothole to BMC', action_type: 'navigate', payload: { view: 'civic' } }
      ]
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Speech-to-Text handler
  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopSpeaking();
      setIsListening(false);
      return;
    }

    const recLang = i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    const rec = speechService.createRecognition(
      recLang,
      (transcript) => {
        setInput(transcript);
      },
      (err) => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Text-to-Speech handler
  const handleSpeak = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      speechService.stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    const langCode = i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN';
    setSpeakingMessageId(msgId);

    speechService.speak(
      text,
      langCode,
      () => setSpeakingMessageId(null),
      () => setSpeakingMessageId(null)
    );
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await api.chatAssistant({
        message: textToSend,
        language: i18n.language,
        conversation_history: history
      });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.reply,
        timestamp: 'Now',
        citations: res.citations,
        suggested_actions: res.suggested_actions
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'I am temporarily unable to connect to the knowledge server. Please verify your connection or try browsing the official schemes directly.',
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-gov-navy to-gov-navyLight text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-400/40 group"
          title="Open JanSetu AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-gov-navy flex items-center justify-center font-bold text-sm shadow">
              <Sparkles className="w-4 h-4 fill-gov-navy" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black text-amber-300 tracking-wide font-serif">
              JANSETU MITRA AI
            </div>
            <div className="text-[10px] text-white/80 font-medium">
              Grounded Assistant • Voice Active
            </div>
          </div>
        </button>
      )}

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[600px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-gov-navy to-gov-navyDark text-white flex items-center justify-between border-b border-amber-400/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-gov-navy flex items-center justify-center font-black shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5 font-serif">
                  <span>JanSetu AI Mitra</span>
                  <span className="text-[10px] font-sans font-normal px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Grounded in Approved Official Government Sources
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              const isSpeaking = speakingMessageId === m.id;

              return (
                <div key={m.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-gov-navy text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm text-xs font-bold">
                      JS
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                    isUser
                      ? 'bg-gov-navy text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}>
                    {/* Message Body */}
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {m.text}
                    </div>

                    {/* Citations Badges */}
                    {!isUser && m.citations && m.citations.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Official Sources Cited</span>
                        </div>
                        {m.citations.map((c, i) => (
                          <a
                            key={i}
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[11px] text-gov-navy font-semibold transition border border-slate-200/60"
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{c.title}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-400 ml-1" />
                            </div>
                            <div className="text-[9px] text-slate-400 font-normal">
                              {c.publisher} • Verified {c.verified_date}
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Action Triggers */}
                    {!isUser && m.suggested_actions && m.suggested_actions.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {m.suggested_actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              onTriggerAction(act);
                              onClose();
                            }}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition flex items-center gap-1 shadow-xs"
                          >
                            <span>{act.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Bot Controls (TTS Listen button) */}
                    {!isUser && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                        <span>JanSetu Grounded AI</span>
                        <button
                          onClick={() => handleSpeak(m.id, m.text)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                            isSpeaking ? 'text-amber-700 bg-amber-100 font-bold' : 'hover:text-gov-navy'
                          }`}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                <Loader2 className="w-4 h-4 animate-spin text-gov-navy" />
                <span>Searching verified government knowledge base...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar with Speech-to-Text */}
          <div className="p-3 bg-white border-t border-slate-200">
            {/* Quick Chips for First Queries */}
            {messages.length <= 2 && (
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1 scrollbar-none">
                {[
                  'Farmer PM-KISAN rules',
                  'Ladki Bahin scheme',
                  'Update Aadhaar address',
                  'Emergency helpline 112'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2.5 rounded-xl transition ${
                  isListening
                    ? 'bg-red-600 text-white mic-recording shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-gov-navy border border-slate-200'
                }`}
                title={isListening ? "Listening... click to stop" : "Speak your question"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-red-600" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening... speak now" : t('chat_placeholder')}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-gov-navy hover:bg-gov-navyLight text-white shadow-sm transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
