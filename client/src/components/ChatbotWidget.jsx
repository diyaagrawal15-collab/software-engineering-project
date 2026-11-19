import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Heart, ShieldAlert, Bot } from 'lucide-react';
import { chatbotService } from '../services/api';

const QUICK_PROMPTS = [
  'Feeling anxious right now',
  'Guide my breathing',
  "Can't sleep tonight",
  'Work & study stress',
  'Emergency helpline',
];

const ChatbotWidget = ({ onOpenCrisisModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your StressCare Assistant. How are you feeling today? You can share what's on your mind, or ask for a quick guided breathing exercise.",
      suggestedActions: ['Start 4-7-8 Breathing', 'Take Stress Assessment'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    // Append user message
    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await chatbotService.sendMessage(text);
      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.data.reply,
            suggestedActions: res.data.suggestedActions,
            isEmergency: res.data.isEmergency,
          },
        ]);
        if (res.data.isEmergency && onOpenCrisisModal) {
          onOpenCrisisModal();
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm having a slight moment connecting to my wellness knowledge base, but please take a slow breath. If you need urgent support, please use the Emergency Helpline button at the top.",
          suggestedActions: ['Crisis Helplines'],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 90,
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            color: '#ffffff',
            borderRadius: '9999px',
            padding: '0.85rem 1.35rem',
            boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}
        >
          <Bot size={22} />
          <span>Stress Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 48px)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 95,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '10px' }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>StressCare Assistant</h4>
                <span style={{ fontSize: '0.75rem', color: '#e0f2fe' }}>Confidential & Supportive</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', color: '#ffffff', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: m.sender === 'user' ? '#0284c7' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                    boxShadow: m.sender === 'user' ? 'none' : 'var(--shadow-sm)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.5
                  }}
                >
                  {m.text}
                </div>

                {/* Suggested Action Chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {m.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          if (action === 'Crisis Helplines' || action.includes('Helpline')) {
                            onOpenCrisisModal();
                          } else {
                            handleSend(action);
                          }
                        }}
                        style={{
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          border: '1px solid #bae6fd',
                          borderRadius: '9999px',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic', padding: '0.25rem' }}>
                <Sparkles size={14} className="spin" />
                Assistant is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 500
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border)'
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="text"
                placeholder="Ask about stress, breathing, sleep..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.85rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                style={{
                  backgroundColor: inputText.trim() ? '#0284c7' : '#cbd5e1',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  flexShrink: 0
                }}
              >
                <Send size={16} />
              </button>
            </form>
            <p style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center', margin: '0.4rem 0 0 0' }}>
              Educational support tool. Does not diagnose mental conditions.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
