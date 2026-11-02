import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Award, Zap, BrainCircuit, Target, CheckCircle } from 'lucide-react';

export default function VivaInspector() {
  const [openIndex, setOpenIndex] = useState(0);

  const vivaQuestions = [
    {
      q: "Why did Run C (Loss: 3.4684) achieve a 54.4% lower training loss than Run A (7.6091)?",
      category: "Gradient Dynamics & Optimization",
      badge: "Experiment 2 Key Insight",
      color: "#10b981",
      answer: "In Run A, the learning rate (1e-4) was too conservative for a 2-epoch training constraint, causing the AdamW optimizer to underfit and stay trapped in a high-loss basin. Doubling the step size to 2e-4 in Run B dropped the loss to 4.6819. Doubling rank to r=8 in Run C expanded the intrinsic subspace capacity, allowing the model to accurately capture nuanced academic conditions."
    },
    {
      q: "Why did Run C (r=8) have a faster wall-clock runtime (6.90s) than Run A (9.07s) despite doubling rank?",
      category: "Hardware & Parameter Efficiency",
      badge: "Wall-Clock Analysis",
      color: "#06b6d4",
      answer: "In Low-Rank Adaptation, moving from r=4 to r=8 adds only ~2 million parameters (<0.1% of Qwen2.5-0.5B). On modern PyTorch CUDA tensor cores, small matrix rank multiplies are memory-bandwidth bound rather than compute-bound. Furthermore, faster loss convergence reduced optimizer gradient accumulation overhead, yielding a 23.9% net speedup."
    },
    {
      q: "What is the purpose of LoRA scaling factor (alpha=16) with rank r=8?",
      category: "LoRA Mathematical Formulation",
      badge: "Math Formulation",
      color: "#a855f7",
      answer: "The adapter update is computed as W = W_0 + (alpha / r) * B * A. With alpha=16 and r=8, the scaling factor is 16/8 = 2.0. This scaling constant stabilizes the initialization variance of matrix B (initialized to zero) and matrix A (Gaussian initialized), ensuring smooth backpropagation without distorting frozen foundation weights."
    },
    {
      q: "Why does CampusAI unify both LoRA adaptation and FAISS Vector RAG?",
      category: "System Architecture Strategy",
      badge: "Viva Defense Core",
      color: "#f59e0b",
      answer: "Parametric fine-tuning (LoRA) teaches the model institutional context, question phrasing, and reasoning tone, but cannot guarantee zero-hallucination on specific dates. FAISS dense vector retrieval injects exact uncorrupted clauses (such as Academic Notice 2026-A: October 15, 2026) at sub-10ms latency, creating a fully grounded, auditable campus intelligence engine."
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BrainCircuit size={20} color="#a855f7" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Oral Defense &amp; Viva Examination Flashcards
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Common examiner questions rigorously derived from <code>benchmark_results.json</code> and PEFT architecture.
            </p>
          </div>
        </div>

        <span className="badge-pill badge-violet" style={{ fontSize: '0.75rem' }}>
          Professor / Evaluator Q&amp;A
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {vivaQuestions.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              style={{
                borderRadius: 'var(--radius-md)',
                background: isOpen ? 'rgba(15, 23, 42, 0.85)' : 'rgba(0,0,0,0.25)',
                border: isOpen ? `1px solid ${item.color}60` : '1px solid var(--border-subtle)',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: `${item.color}20`,
                    color: item.color,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                      {item.q}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: item.color, marginTop: '2px', fontWeight: 600 }}>
                      {item.category} • {item.badge}
                    </div>
                  </div>
                </div>

                {isOpen ? <ChevronUp size={18} color={item.color} /> : <ChevronDown size={18} color="#64748b" />}
              </button>

              {isOpen && (
                <div style={{
                  padding: '0 20px 18px 58px',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: 'var(--text-muted)',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.3)',
                    borderLeft: `3px solid ${item.color}`,
                    color: '#e2e8f0',
                  }}>
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
