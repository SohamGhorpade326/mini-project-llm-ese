import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Cpu, Database, Sparkles, BookOpen, BarChart3, MessageSquareText, Layers, ShieldCheck } from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Navbar() {
  const [health, setHealth] = useState({ status: 'checking', device: '...', index_vector_count: 0 });
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      const data = await fetchHealth();
      if (isMounted) setHealth(data);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Assistant Console', path: '/assistant', icon: MessageSquareText },
    { name: 'Hyperparameter Benchmarks', path: '/benchmarks', icon: BarChart3 },
    { name: 'Knowledge Engine', path: '/knowledge', icon: BookOpen },
  ];

  const isOnline = health.status === 'healthy';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 10, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        {/* Brand / Institutional Logo */}
        <NavLink to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          color: 'var(--text-main)',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.3))',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Layers size={22} color="#06b6d4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Campus<span style={{ color: '#06b6d4' }}>AI</span>
              </span>
              <span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                LoRA & RAG
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>
              Lab ESE LLM System
            </div>
          </div>
        </NavLink>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '5px 8px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.25))' : 'transparent',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 15px -3px rgba(6, 182, 212, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} color={isActive ? '#22d3ee' : '#94a3b8'} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Backend Status telemetry badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid var(--border-subtle)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
          }}>
            <div className={`status-dot ${isOnline ? 'online' : ''}`} style={{
              backgroundColor: isOnline ? '#10b981' : '#f59e0b'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, color: isOnline ? '#34d399' : '#fbbf24' }}>
                {isOnline ? 'Backend Online' : 'Local Standby'}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'flex', gap: '6px' }}>
                <span>{health.device?.toUpperCase() || 'CPU'}</span>
                <span>•</span>
                <span>{health.index_vector_count ?? 5} FAISS Vecs</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
