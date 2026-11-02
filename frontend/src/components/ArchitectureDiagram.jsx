import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Sparkles, ArrowRight, Layers, FileText, CheckCircle2, Search, Sliders } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [activeStage, setActiveStage] = useState(2);

  const stages = [
    {
      id: 0,
      title: "1. Policy Ingestion & Indexing",
      subtitle: "Offline RAG Pipeline",
      icon: FileText,
      color: "#06b6d4",
      badge: "all-MiniLM-L6-v2",
      details: [
        "Ingests 'campus_policy.txt' & generates 5 discrete chunks",
        "Encodes chunks into 384-dimensional dense vectors",
        "Builds high-performance FAISS FlatL2/IP vector index ('campus.index')"
      ]
    },
    {
      id: 1,
      title: "2. PEFT LoRA Fine-Tuning",
      subtitle: "Parameter-Efficient Tuning",
      icon: Layers,
      color: "#a855f7",
      badge: "LoRA r=8, alpha=16",
      details: [
        "100 institutional Q&A pairs ('campus_faq_100.json')",
        "Adapts query/value projections (q_proj, v_proj) of Qwen2.5-0.5B",
        "Lowest loss achieved in Run C (Loss: 3.4684 @ 2e-4 LR)"
      ]
    },
    {
      id: 2,
      title: "3. Dual-Engine RAG Inference",
      subtitle: "Real-Time Query Pipeline",
      icon: Cpu,
      color: "#10b981",
      badge: "Sub-10ms Latency",
      details: [
        "Runtime toggle between Base Model and fine-tuned LoRA adapter",
        "Dynamic Top-K FAISS vector retrieval & similarity ranking",
        "Context-augmented generation preventing hallucinations"
      ]
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div>
          <div className="badge-pill badge-cyan" style={{ marginBottom: '8px' }}>
            System Architecture Overview
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Unified PEFT Adaptation & FAISS Vector RAG Flow
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Interactive stage inspector detailing data representations and runtime components.
          </p>
        </div>

        {/* Stage Selector Chips */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          {stages.map((stg) => (
            <button
              key={stg.id}
              onClick={() => setActiveStage(stg.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeStage === stg.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeStage === stg.id ? '#ffffff' : 'var(--text-muted)',
                fontWeight: activeStage === stg.id ? 600 : 400,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Stage {stg.id + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Pipeline Nodes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        position: 'relative',
      }}>
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isSelected = activeStage === stg.id;
          return (
            <motion.div
              key={stg.id}
              onClick={() => setActiveStage(stg.id)}
              whileHover={{ scale: 1.02 }}
              style={{
                background: isSelected ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.5)',
                border: isSelected ? `2px solid ${stg.color}` : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: isSelected ? `0 0 25px -5px ${stg.color}40` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${stg.color}15`,
                  border: `1px solid ${stg.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color={stg.color} />
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: `${stg.color}20`,
                  color: stg.color,
                  fontWeight: 600,
                }}>
                  {stg.badge}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                {stg.title}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                {stg.subtitle}
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stg.details.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={14} color={stg.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
