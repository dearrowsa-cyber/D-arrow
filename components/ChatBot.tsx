'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import { MessageCircle, X, Send, Globe, MoreVertical, Paperclip } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

// Format bot responses for professional display
function formatBotResponse(text: string): string[] {
  if (!text) return [];
  
  // Split by line breaks and filter empty lines
  const lines = text.split('\n').filter(line => line.trim());
  
  // Process each line to remove markdown symbols and format nicely
  const formatted = lines.map((line: string) => {
    let cleanLine = line.trim();
    
    // Remove markdown symbols: #, ##, ###, etc.
    cleanLine = cleanLine.replace(/^#+\s*/g, '');
    
    // Remove bullet markers but keep the content
    cleanLine = cleanLine.replace(/^[-*•]\s*/g, '');
    
    // Remove numbered lists
    cleanLine = cleanLine.replace(/^\d+\.\s*/g, '');
    
    return cleanLine;
  });

  return formatted;
}

// Component to render formatted bot response
function FormattedBotMessage({ text }: { text: string }) {
  const lines = formatBotResponse(text);
  
  if (!lines || lines.length === 0) {
    return <span>{text}</span>;
  }

  if (lines.length === 1) {
    return <span>{lines[0]}</span>;
  }

  // Check if it's a single paragraph or multiple items
  const isSingleParagraph = lines.join(' ').length < 100 && lines.length <= 2;

  if (isSingleParagraph) {
    return <span>{lines.join(' ')}</span>;
  }

  // Display as professional bullet points
  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-white font-bold mt-1">•</span>
          <span className="text-white">{line}</span>
        </div>
      ))}
    </div>
  );
}

// 3D Background Scene - Snapchat inspired visuals
function BackgroundShapes() {
  return (
    <group>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 64, 64]} position={[-2, 2, -5]}>
          <MeshDistortMaterial color="#FF6F4F" speed={2} distort={0.3} radius={1} />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.8, 64, 64]} position={[2, -2, -3]}>
          <MeshDistortMaterial color="#FF4D6D" speed={4} distort={0.5} radius={1} />
        </Sphere>
      </Float>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} />
    </group>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ user: string; bot: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<'en' | 'ar'>('en');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [hasInitialNotification, setHasInitialNotification] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2) + Date.now().toString(36));
  const [hasLoggedSession, setHasLoggedSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    setChatLanguage(lang === 'ar' ? 'ar' : 'en');
  }, [lang]);

  // Initial notification when page loads
  useEffect(() => {
    if (!hasInitialNotification) {
      // Delay to let page load
      const timer = setTimeout(() => {
        setUnreadCount(1);
        const welcomeMsg = lang === 'ar' ? 'أهلا بك! 👋' : 'Welcome! 👋';
        setNotificationMessage(welcomeMsg);
        setShowNotification(true);
        setHasInitialNotification(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasInitialNotification, lang]);

  // Dispatch event when chatbot opens or closes + log conversations
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event('chatbot-opened'));
      setUnreadCount(0);
      setShowNotification(false);
      
      if (messages.length === 0) {
        const greetingMsg = chatLanguage === 'ar' 
          ? 'هلا! 👋 كيف أقدر أساعدك اليوم؟' 
          : 'Hey! 👋 How can I help you today?';
        setMessages([{ user: '', bot: greetingMsg }]);
      }
    } else {
      window.dispatchEvent(new Event('chatbot-closed'));
      
      // Log conversation when chat closes (if there are real messages)
      const realMessages = messages.filter(m => m.user && m.user.trim());
      if (realMessages.length > 0 && !hasLoggedSession) {
        setHasLoggedSession(true);
        fetch('/api/chat-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            language: chatLanguage,
            sessionId,
          }),
        }).catch(() => {}); // Silent fail — don't affect UX
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    const userMsg = message;

    // Add user message immediately so it's visible
    setMessages([...messages, { user: userMsg, bot: '' }]);
    setMessage('');

    try {
      const res = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          language: chatLanguage,
          history: messages, // Send conversation history for memory
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `API Error: ${res.status}`);
      const botReply = data.reply || (chatLanguage === 'ar' ? '🤔 عذراً...' : '🤔 Sorry...');
      
      // Update the last message with bot reply (as-is, no truncation)
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].bot = botReply;
        return updated;
      });
      
      // Show notification if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
        setNotificationMessage(botReply.substring(0, 50) + (botReply.length > 50 ? '...' : ''));
        setShowNotification(true);
      }
    } catch (error: any) {
      let errorMsg = chatLanguage === 'ar' ? `🔧 حدث خطأ` : `🔧 Oops!`;
      
      // Update the last message with error
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].bot = errorMsg;
        return updated;
      });
      
      // Show notification if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
        setNotificationMessage(errorMsg);
        setShowNotification(true);
      }
    }
    setLoading(false);
  };

  const isRTL = chatLanguage === 'ar';
  const fontClass = isRTL ? 'font-bukra' : 'font-tt-hoves';
  const translations = {
    en: { title: 'D-Arrow', subtitle: 'Digital Marketing', greeting: 'Welcome 👋', placeholder: 'Type your message...', askQuestion: 'How can we help you today?', thinking: 'Typing...', switchLang: 'العربية', online: 'Online' },
    ar: { title: 'D-Arrow', subtitle: 'التسويق الرقمي', greeting: 'أهلاً بك 👋', placeholder: 'اكتب رسالتك...', askQuestion: 'كيف نقدر نساعدك اليوم؟', thinking: 'جاري الكتابة...', switchLang: 'English', online: 'متصل' },
  };
  const t = translations[chatLanguage];

  return (
    <>
      {/* Minimal Notification Badge - Just Click on Button */}
      {/* Notification logic handled by button badge above */}

      {/* 3D Floating Button with Badge */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center !bg-transparent text-white ${isRTL ? 'left-6' : 'right-6'}`}
      >
        {isOpen ? (
          <div className="bg-gradient-to-r from-[#FF4D6D] to-[#FF9A3C] rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all">
            <X size={24} className="text-white font-bold" />
          </div>
        ) : (
          <img src="/chatbot-main-2.png" alt="Chat" className="w-80 h-80  object-contain animate-pulse !text-black rounded-3xl" />
        )}
        
        {/* Unread Badge - Minimalist Style */}
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Premium Glass Window */}
      {isOpen && (
        <div className={`fixed bottom-24 z-50 w-[90vw] sm:w-[340px] h-[65vh] sm:h-[560px] max-h-[65vh] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/70 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] ${isRTL ? 'left-6' : 'right-6'} ${fontClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
          
          {/* Three.js Background */}
          <div className="absolute inset-0 -z-10 bg-[#0B0D1F]">
            <Canvas>
              <color attach="background" args={['#0B0D1F']} />
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <BackgroundShapes />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
            </Canvas>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#14162E]/60 to-[#1a1c3e]/60 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full border-2 border-[#FF6F4F]/50 shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/chatbot-icon.jpeg" alt="D-Arrow" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold !text-white text-sm tracking-wide">{t.title}</span>
                  <span className="text-[10px] text-white/50 font-medium">{t.subtitle}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />{t.online}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition text-white/60 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Message Area (WhatsApp Bubble Style) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#FF6F4F] to-[#FF4D6D] flex items-center justify-center shadow-lg">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <p className="text-sm font-bold !text-white mb-1">{t.greeting}</p>
                <p className="text-xs !text-white/60">{t.askQuestion}</p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className="space-y-1 animate-in fade-in slide-in-from-bottom-2">
                {/* User Message */}
                {m.user && (
                  <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <div className="max-w-[80%] bg-gradient-to-r from-[#FF6F4F] to-[#FF4D6D] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md text-[13px] leading-relaxed">
                      {m.user}
                    </div>
                  </div>
                )}
                {/* Bot Message */}
                {m.bot && (
                  <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] bg-gradient-to-r from-[#FF9A3C] to-[#FF4D6D] text-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-white/20 text-[13px] leading-relaxed backdrop-blur-sm">
                      <FormattedBotMessage text={m.bot} />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <div className="bg-white/80 px-4 py-2 rounded-2xl shadow-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-[#FF6F4F] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#FF6F4F] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#FF6F4F] rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#14162E]/40 backdrop-blur-xl border-t border-white/5">
            <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-lg">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t.placeholder}
                disabled={loading}
                className={`flex-1 bg-transparent border-none outline-none text-[13px] !text-gray-800 placeholder:text-gray-400 py-2 px-3 ${fontClass}`}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || loading}
                className="bg-gradient-to-r from-[#FF6F4F] to-[#FF4D6D] text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition shadow-md disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </>
  );
}