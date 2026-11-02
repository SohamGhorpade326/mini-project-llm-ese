import React from 'react';
import { Cpu, Terminal, Shield, GitBranch } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 10, 18, 0.95)',
      padding: '30px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Cpu size={16} color="#06b6d4" />
          </div>
          <div>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Lab ESE LLM System</span>
            <span style={{ marginLeft: '8px', color: 'var(--text-dim)' }}>• Production PEFT & RAG Pipeline</span>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <span className="badge-pill badge-cyan">
            LoRA Rank $r=8$
          </span>
          <span className="badge-pill badge-violet">
            Qwen2.5-0.5B-Instruct
          </span>
          <span className="badge-pill badge-emerald">
            FAISS all-MiniLM-L6-v2
          </span>
          <span className="badge-pill badge-amber">
            FastAPI + PyTorch
          </span>
        </div>

        <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
          © 2026 Academic AI Research. Designed for End-Semester Lab Evaluation.
        </div>
      </div>
    </footer>
  );
}
