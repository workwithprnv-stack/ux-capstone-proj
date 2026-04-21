'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CronosBotAvatar from '@/components/CronosBotAvatar';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I am Saturn, your CRONOS research assistant. I can help you find groundbreaking papers or brainstorm new research directions. What's on your mind?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMsg: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('best paper') || q.includes('top paper')) {
      return "While 'best' is subjective in research, I'm seeing massive interest in 'Attention Is All You Need' and 'Scaling Laws for Neural Language Models'. Would you like me to find the latest highly-cited papers in a specific field like Computer Vision or LLMs?";
    }
    
    if (q.includes('brainstorm') || q.includes('idea') || q.includes('research direction')) {
      return "Let's align our orbits! If you're looking for fresh ideas, have you considered exploring 'Efficient Fine-tuning for Multi-modal Models' or perhaps 'The intersection of Ethics and Reinforcement Learning in Autonomous Systems'? I can generate more specific prompts if you tell me your primary interest.";
    }

    if (q.includes('help') || q.includes('how')) {
      return "I can help you search the arXiv archives, summarize complex findings, or suggest related works to build your literature review. Just ask!";
    }

    return "That's an interesting thought. In the vast galaxy of research, every idea counts. I'm searching my knowledge base for relevant connections... could you elaborate on that?";
  };

  return (
    <div className="page-minimal" id="support-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '100px 40px 40px' }}>
      <Link href="/" className="nav-link-minimal" style={{ marginBottom: '32px', display: 'inline-block' }}>
        ← Back
      </Link>

      <div style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', marginBottom: '16px' }}>
            <CronosBotAvatar size={100} />
          </div>
          <h1 className="section-title-minimal">Support Orbit</h1>
          <p style={{ color: '#666' }}>Chat with Saturn to accelerate your research</p>
        </div>

        {/* Chat Window */}
        <div style={{ 
          flex: 1, 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-medium)', 
          borderRadius: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Scrollable Area */}
          <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ 
                display: 'flex', 
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', 
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                {msg.sender === 'bot' && <CronosBotAvatar size={40} />}
                <div style={{ 
                  maxWidth: '70%', 
                  padding: '16px 20px', 
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  boxShadow: msg.sender === 'user' ? '0 10px 20px rgba(220, 105, 168, 0.2)' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <CronosBotAvatar size={40} />
                <div style={{ color: '#666', fontSize: '13px', fontStyle: 'italic' }}>Saturn is calculating...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
            <div style={{ position: 'relative', display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about papers or brainstorm ideas..."
                style={{ 
                  flex: 1, 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border-medium)', 
                  borderRadius: '100px', 
                  padding: '16px 24px', 
                  color: '#fff', 
                  outline: 'none',
                  fontSize: '15px',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#DC69A8'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
              />
              <button 
                type="submit" 
                className="filter-chip-minimal active" 
                style={{ borderRadius: '50%', width: '54px', height: '54px', padding: 0, border: 'none' }}
              >
                ↑
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
