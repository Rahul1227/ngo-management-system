import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const aiRef = useRef(null);

  const SYSTEM_PROMPT = `You are a helpful assistant for Aarambh (आरंभ), an NSS Initiative platform. 
Talk ONLY about Aarambh, NSS, service (sewa), donations, humanity, and social welfare.
Keep responses under 80 words.
NSS Motto: "NOT ME, BUT YOU"`;

  // init Gemini (NEW SDK – correct)
  useEffect(() => {
    if (!isOpen || aiRef.current) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY missing");
      return;
    }

    aiRef.current = new GoogleGenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    setMessages([
      {
        role: 'assistant',
        content: 'Namaste! 🙏 Welcome to Aarambh. How can I help you understand our mission of service?',
      },
    ]);
  }, [isOpen]);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        chatBoxRef.current &&
        !chatBoxRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSendMessage = async (msg = inputMessage) => {
    if (!msg.trim() || isLoading || !aiRef.current) return;

    const userText = msg.trim();
    setInputMessage('');
    setIsLoading(true);

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userText },
      { role: 'assistant', content: '', isStreaming: true },
    ]);

    try {
      const stream = await aiRef.current.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT + '\n' + userText }],
          },
        ],
      });

      let text = '';

      let fullText = '';
let displayedText = '';
let typingQueue = [];

for await (const chunk of stream) {
  fullText += chunk.text;
  typingQueue = fullText.split(' ');

  while (typingQueue.length > 0) {
    displayedText += (displayedText ? ' ' : '') + typingQueue.shift();

    setMessages(prev => {
      const arr = [...prev];
      arr[arr.length - 1].content = displayedText;
      return arr;
    });

    // typing speed (adjust if you want)
    await new Promise(res => setTimeout(res, 30));
  }
}


      setMessages(prev => {
        const arr = [...prev];
        arr[arr.length - 1].isStreaming = false;
        return arr;
      });
    } catch (err) {
      console.error('Gemini error:', err);
      setMessages(prev => {
        const arr = [...prev];
        arr[arr.length - 1] = {
          role: 'assistant',
          content: "I'm having trouble connecting right now.",
          isStreaming: false,
        };
        return arr;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-2xl hover:scale-110 transform transition-all duration-300 flex items-center justify-center z-50"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
          </div>
        )}
      </button>

      {isOpen && (
        <div
          ref={chatBoxRef}
          className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">🤖</div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">Aarambh Assistant</h3>
              <p className="text-xs text-white/80">Sewa • NSS Initiative</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">
                    {m.content}
                    {m.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-primary-300 animate-pulse"></span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about Aarambh..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 disabled:opacity-50 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
