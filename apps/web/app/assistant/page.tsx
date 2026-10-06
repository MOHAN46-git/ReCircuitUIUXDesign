'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/AppShell';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hello! I am your ReCircuit Circular Electronics Copilot. I can help you figure out what projects you can build from your parts, explain pinouts, and suggest where to source missing BOM items.',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    setMessages(prev => [...prev, { id: `u-${Date.now()}`, sender: 'user', text }]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, role: 'buyer' }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'assistant', text: data.response || 'No response' },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'assistant', text: 'AI suggestion only. Please verify pinouts before connecting power.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What can I build with an ESP32 and Soil Moisture Sensor?',
    'How do I test a salvaged TT gear motor without damaging it?',
    'What missing parts do I need for the Smart Plant Guardian?',
  ];

  return (
    <section className="page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">
            <Icon name="spark" className="w-4 h-4" /> AI Electronics Copilot
          </span>
          <h1>Workbench Assistant</h1>
          <p>
            Get pinout guidance, check BOM compatibility, and learn how to reuse salvaged hardware safely.
          </p>
        </div>
      </div>

      <div className="bom-panel" style={{ position: 'static', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
        {/* Messages Stream */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
          {messages.map(m => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: isUser ? 'var(--green)' : 'var(--canvas)',
                    color: isUser ? 'white' : 'var(--ink)',
                    fontSize: '13px',
                    lineHeight: '1.55',
                    boxShadow: isUser ? '0 4px 12px rgba(23,107,76,.15)' : 'none',
                    border: isUser ? 'none' : '1px solid var(--line)',
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ color: 'var(--muted)', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Icon name="spark" className="w-4 h-4 animate-spin" />
              <span>Analyzing circuit requirements...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggested Prompts */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '10px 0', borderTop: '1px solid var(--line)' }}>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              style={{
                whiteSpace: 'nowrap',
                fontSize: '11px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: '#f0f2ed',
                border: '1px solid #dfe3dc',
                color: '#475569',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about project feasibility, pinouts, or circuit reuse..."
            style={{
              flex: 1,
              height: '46px',
              padding: '0 16px',
              border: '1px solid var(--line)',
              borderRadius: '9px',
              background: 'white',
              fontSize: '13px',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputText.trim()}
            className="button button-primary"
          >
            Send <Icon name="arrow" />
          </button>
        </div>
      </div>
    </section>
  );
}
