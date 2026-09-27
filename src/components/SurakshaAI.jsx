import { useState } from 'react';
import { MessageSquare, X, Send, Cpu, ChevronRight } from 'lucide-react';

export default function SurakshaAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello, I am Suraksha AI. I can assist with risk analysis and relocation planning. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const suggestedQueries = [
    "What villages require immediate relocation?",
    "Find a safe relocation site for Boragaon",
    "Which sites have available capacity?",
    "What happens if rainfall increases by 30%?"
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      if (text.includes('immediate relocation')) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `12 habitations currently meet the criteria for immediate relocation.\n\nHighest priority:\n1. Boragaon — Risk 92\n2. Sonapur — Risk 89\n3. Chandrapur — Risk 81\n\nEstimated affected population: 8,421.` 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'I am analyzing the multi-hazard GIS data for that request. Please see the relevant map views for more detail.' }]);
      }
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'var(--govt-blue)',
            color: 'white',
            border: 'none',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          <Cpu size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            width: 380,
            height: 600,
            backgroundColor: 'var(--bg-panel)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div style={{padding:'16px 20px', background:'var(--govt-blue)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <Cpu size={20} color="white" />
              <h3 style={{margin:0, color:'white', fontSize:'1.1rem'}}>Suraksha AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} style={{background:'transparent', border:'none', color:'white', cursor:'pointer'}}>
              <X size={20} />
            </button>
          </div>

          <div style={{flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:16}}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--govt-blue)' : 'var(--bg-surface)',
                border: msg.role === 'ai' ? '1px solid var(--border-color)' : 'none',
                padding: '12px 16px',
                borderRadius: 12,
                maxWidth: '85%',
                fontSize: '0.9rem',
                whiteSpace: 'pre-line',
                lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {messages.length === 1 && (
            <div style={{padding:'0 20px 10px 20px', display:'flex', flexDirection:'column', gap:8}}>
              <span className="text-muted" style={{fontSize:'0.75rem'}}>Suggested Queries:</span>
              {suggestedQueries.map(q => (
                <button 
                  key={q} 
                  onClick={() => handleSend(q)}
                  style={{
                    textAlign: 'left',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {q} <ChevronRight size={14} />
                </button>
              ))}
            </div>
          )}

          <div style={{padding:16, borderTop:'1px solid var(--border-color)', display:'flex', gap:10}}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask Suraksha AI..."
              style={{
                flex: 1,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 20,
                padding: '10px 16px',
                color: 'white',
                outline: 'none'
              }}
            />
            <button 
              onClick={() => handleSend(input)}
              style={{
                background: 'var(--govt-blue)',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
