import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Sliders, 
  Database, 
  Cpu, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  RotateCcw, 
  Columns, 
  Bot, 
  User, 
  Zap, 
  ExternalLink,
  ShieldAlert,
  Info,
  ThumbsUp,
  ThumbsDown,
  BookOpen
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function AssistantPage() {
  const [feedbackGiven, setFeedbackGiven] = useState({});
  // Configuration State
  const [useRag, setUseRag] = useState(true);
  const [useLora, setUseLora] = useState(true);
  const [topK, setTopK] = useState(2);
  const [sideBySide, setSideBySide] = useState(false);

  // Chat State
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedSnippets, setExpandedSnippets] = useState({});

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am **CampusAI**, an institutional intelligence assistant fine-tuned with PEFT LoRA and backed by a FAISS vector index.\n\nAsk me about attendance policies, backlog exams, course drop deadlines, scholarships, or hostel regulations.",
      meta: {
        model_used: "Qwen/Qwen2.5-0.5B-Instruct + LoRA (r=8)",
        inference_time_ms: 6.2,
        rag_active: true,
        retrieved_context: [
          "Academic Notice 2026-A: The last date for dropping any registered semester course without academic record penalty is October 15, 2026."
        ],
        similarity_scores: [95.4]
      }
    }
  ]);

  // Dual side-by-side message container for comparisons
  const [comparisonPair, setComparisonPair] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, comparisonPair]);

  const presetQueries = [
    { title: "Attendance Detention Rules", query: "What happens if my attendance falls strictly below 60%?" },
    { title: "Exam Backlog Schedule", query: "When are the remedial and backlog examinations scheduled for 2026?" },
    { title: "Course Drop Deadline", query: "What is the last date to drop a registered course without penalty?" },
    { title: "Scholarship CGPA Criteria", query: "What is the minimum CGPA and family income required for merit-cum-means scholarship?" },
    { title: "Hostel Entry Timings", query: "What are the hostel gate closing times on weekdays and weekends?" },
    { title: "Placement Eligibility", query: "What is the mandatory attendance for pre-placement mock drives?" },
  ];

  const handleSend = async (queryText = inputQuery) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    setInputQuery('');
    const userMsgId = Date.now();
    const userMsg = { id: userMsgId, sender: 'user', text };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (sideBySide) {
        // Run both Base Model (No RAG, No LoRA) vs Fine-tuned + RAG simultaneously for Viva comparison!
        const [baseRes, loraRagRes] = await Promise.all([
          sendChatMessage({ query: text, use_rag: false, use_lora: false, top_k: 1 }),
          sendChatMessage({ query: text, use_rag: true, use_lora: true, top_k: topK })
        ]);

        const assistantMsgId = userMsgId + 1;
        const newMsg = {
          id: assistantMsgId,
          sender: 'assistant',
          isSideBySide: true,
          base: {
            text: baseRes.answer,
            meta: baseRes
          },
          enhanced: {
            text: loraRagRes.answer,
            meta: loraRagRes
          }
        };
        setMessages((prev) => [...prev, newMsg]);
      } else {
        // Standard single mode with active toggle parameters
        const res = await sendChatMessage({ query: text, use_rag: useRag, use_lora: useLora, top_k: topK });
        const assistantMsgId = userMsgId + 1;
        const newMsg = {
          id: assistantMsgId,
          sender: 'assistant',
          text: res.answer,
          meta: res
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId + 1,
          sender: 'assistant',
          text: "An error occurred while communicating with the inference engine. Please check backend health.",
          isError: true,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSnippet = (msgId) => {
    setExpandedSnippets((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: "Conversation reset. You can adjust the LoRA and RAG parameters on the left and test another query.",
        meta: null
      }
    ]);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px', minHeight: 'calc(100vh - 140px)' }}>
      {/* Title & Mode Strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Assistant Workspace</span>
            <span className="badge-pill badge-cyan" style={{ fontSize: '0.72rem' }}>
              Interactive Console
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
            Empirical runtime comparison between raw base LLM and fine-tuned LoRA with vector RAG.
          </p>
        </div>

        {/* Side-by-Side Comparison Toggle for Viva */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setSideBySide(!sideBySide)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: sideBySide ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))' : 'rgba(255,255,255,0.06)',
              border: sideBySide ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid var(--border-subtle)',
              color: sideBySide ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
              boxShadow: sideBySide ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none',
            }}
          >
            <Columns size={16} color={sideBySide ? '#a855f7' : '#94a3b8'} />
            <span>{sideBySide ? "Viva Mode: Split Active" : "Viva Comparison Mode"}</span>
          </button>

          <button
            onClick={clearChat}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            title="Clear Chat History"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Split View Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left Configuration Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Sliders size={18} color="#06b6d4" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Inference Controls</h2>
          </div>

          {/* Toggle 1: Vector Retrieval */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={15} color="#06b6d4" />
                FAISS Vector RAG
              </span>
              <input
                type="checkbox"
                checked={useRag}
                onChange={(e) => setUseRag(e.target.checked)}
                style={{
                  cursor: 'pointer',
                  width: '18px',
                  height: '18px',
                  accentColor: '#06b6d4',
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Retrieves top-k dense embeddings from <code>campus.index</code> using MiniLM.
            </div>
          </div>

          {/* Toggle 2: LoRA Fine-Tuning */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} color="#a855f7" />
                LoRA Fine-Tuning
              </span>
              <input
                type="checkbox"
                checked={useLora}
                onChange={(e) => setUseLora(e.target.checked)}
                style={{
                  cursor: 'pointer',
                  width: '18px',
                  height: '18px',
                  accentColor: '#a855f7',
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Activates fine-tuned $r=8$ adapter matrices trained on 100 FAQ pairs.
            </div>
          </div>

          {/* Top-K Chunks Slider */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Top-K Chunks</span>
              <span className="badge-pill badge-cyan" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                K = {topK}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={topK}
              disabled={!useRag}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              style={{
                width: '100%',
                cursor: useRag ? 'pointer' : 'not-allowed',
                accentColor: '#06b6d4',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>1 chunk</span>
              <span>3 chunks</span>
              <span>5 chunks</span>
            </div>
          </div>

          {/* Preset Chips */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Quick Test Presets
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {presetQueries.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(preset.query)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#38bdf8' }}>{preset.title}</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {preset.query}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* System Telemetry Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={13} color="#10b981" />
              Runtime Telemetry
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Base Model:</span>
              <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>Qwen2.5-0.5B</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>LoRA State:</span>
              <span style={{ color: useLora ? '#a855f7' : '#94a3b8', fontWeight: 600 }}>
                {useLora ? "Active (r=8)" : "Bypassed"}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>RAG Vectors:</span>
              <span style={{ color: useRag ? '#06b6d4' : '#94a3b8', fontWeight: 600 }}>
                {useRag ? `Enabled (k=${topK})` : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Main Chat Area */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '750px',
          padding: '24px',
          position: 'relative',
        }}>
          {/* Messages Scroll View */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isExpanded = expandedSnippets[msg.id];

              if (msg.isSideBySide) {
                // Split Viva Comparison View
                return (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      alignSelf: 'center',
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: '#c084fc',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      <Columns size={13} />
                      Viva Comparison: Base LLM vs. LoRA + Vector RAG
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {/* Left: Base Model Output */}
                      <div style={{
                        background: 'rgba(30, 41, 59, 0.45)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Bot size={14} /> Base Model Only
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            {msg.base.meta.inference_time_ms} ms
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', lineHeight: 1.5, color: '#cbd5e1', flex: 1 }}>
                          {msg.base.text}
                        </div>
                        <div style={{
                          marginTop: '12px',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#f87171',
                          fontSize: '0.72rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          <ShieldAlert size={12} />
                          Ungrounded generic answer (may hallucinate specifics)
                        </div>
                      </div>

                      {/* Right: LoRA + RAG Output */}
                      <div style={{
                        background: 'rgba(6, 182, 212, 0.08)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 0 15px -3px rgba(6, 182, 212, 0.15)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Sparkles size={14} color="#06b6d4" /> LoRA + Vector RAG
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#06b6d4' }}>
                            {msg.enhanced.meta.inference_time_ms} ms
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', lineHeight: 1.5, color: '#f8fafc', flex: 1, fontWeight: 500 }}>
                          {msg.enhanced.text}
                        </div>
                        {msg.enhanced.meta.retrieved_context?.length > 0 && (
                          <div style={{
                            marginTop: '12px',
                            padding: '8px 10px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: '#34d399',
                            fontSize: '0.72rem',
                          }}>
                            <strong>Grounded in FAISS Vector Chunk:</strong>
                            <div style={{ marginTop: '2px', color: '#e2e8f0', fontSize: '0.7rem' }}>
                              "{msg.enhanced.meta.retrieved_context[0]}"
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    maxWidth: '85%',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: isUser ? 'rgba(139, 92, 246, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                      border: isUser ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isUser ? <User size={18} color="#c084fc" /> : <Bot size={18} color="#22d3ee" />}
                    </div>

                    {/* Bubble Content */}
                    <div style={{
                      background: isUser ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(17, 24, 39, 0.85)',
                      border: isUser ? 'none' : '1px solid var(--border-subtle)',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      padding: '14px 18px',
                      color: '#ffffff',
                      boxShadow: 'var(--shadow-card)',
                    }}>
                      <div style={{
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {msg.text}
                      </div>

                      {/* Assistant Meta Strip */}
                      {!isUser && msg.meta && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '10px',
                          marginTop: '12px',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--border-subtle)',
                          fontSize: '0.72rem',
                          color: 'var(--text-dim)',
                        }}>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                            {msg.meta.model_used}
                          </span>
                          <span>•</span>
                          <span>{msg.meta.inference_time_ms} ms</span>

                          {msg.meta.rag_active && (
                            <>
                              <span>•</span>
                              <button
                                onClick={() => toggleSnippet(msg.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#34d399',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  padding: 0,
                                }}
                              >
                                <Database size={12} />
                                <span>{msg.meta.retrieved_context?.length || 0} FAISS Grounded Chunks</span>
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                            </>
                          )}

                          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'helpful' }))}
                              style={{
                                background: feedbackGiven[msg.id] === 'helpful' ? 'rgba(16, 185, 129, 0.2)' : 'none',
                                border: 'none',
                                color: feedbackGiven[msg.id] === 'helpful' ? '#34d399' : 'var(--text-dim)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                              title="Helpful Answer"
                            >
                              <ThumbsUp size={11} />
                              <span>{feedbackGiven[msg.id] === 'helpful' ? 'Helpful' : ''}</span>
                            </button>

                            <button
                              onClick={() => setFeedbackGiven((prev) => ({ ...prev, [msg.id]: 'unclear' }))}
                              style={{
                                background: feedbackGiven[msg.id] === 'unclear' ? 'rgba(239, 68, 68, 0.2)' : 'none',
                                border: 'none',
                                color: feedbackGiven[msg.id] === 'unclear' ? '#f87171' : 'var(--text-dim)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                              title="Unclear or Inaccurate"
                            >
                              <ThumbsDown size={11} />
                            </button>

                            <button
                              onClick={() => copyToClipboard(msg.text, msg.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-dim)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.72rem',
                              }}
                              title="Copy Answer"
                            >
                              {copiedIndex === msg.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                              <span>{copiedIndex === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Expandable FAISS Snippet Drawer */}
                      {!isUser && msg.meta?.rag_active && isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{
                            marginTop: '10px',
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(6, 182, 212, 0.06)',
                            border: '1px solid rgba(6, 182, 212, 0.25)',
                          }}
                        >
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee', marginBottom: '6px' }}>
                            Retrieved Context Vectors (campus.index):
                          </div>
                          {msg.meta.retrieved_context.map((chunk, cIdx) => (
                            <div key={cIdx} style={{
                              fontSize: '0.78rem',
                              color: 'var(--text-muted)',
                              lineHeight: 1.5,
                              marginBottom: '6px',
                              padding: '6px 10px',
                              background: 'rgba(0,0,0,0.25)',
                              borderRadius: '4px',
                              borderLeft: '2px solid #06b6d4',
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.68rem', marginBottom: '2px' }}>
                                <span>Chunk #{cIdx + 1}</span>
                                {msg.meta.similarity_scores?.[cIdx] && (
                                  <span style={{ color: '#10b981', fontWeight: 600 }}>
                                    Match: {msg.meta.similarity_scores[cIdx]}%
                                  </span>
                                )}
                              </div>
                              "{chunk}"
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Sparkles size={16} color="#06b6d4" className="animate-spin" />
                </div>
                <span>CampusAI is searching FAISS and synthesizing tokens with LoRA...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar Form */}
          <div style={{
            marginTop: '16px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px 12px 8px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <input
              type="text"
              placeholder="Ask an academic policy, attendance rule, or exam schedule question..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.95rem',
              }}
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputQuery.trim()}
              className="btn-primary"
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                opacity: isLoading || !inputQuery.trim() ? 0.5 : 1,
                cursor: isLoading || !inputQuery.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Send</span>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
