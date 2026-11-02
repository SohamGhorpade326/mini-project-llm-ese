import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Database, 
  FileText, 
  Tag, 
  ExternalLink, 
  Filter, 
  CheckCircle, 
  Layers, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { fetchKnowledgeBase } from '../services/api';

export default function KnowledgePage() {
  const [data, setData] = useState({ chunks: [], faqs: [], policy_raw: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chunks'); // 'chunks' | 'faqs' | 'raw'
  const [searchTerm, setSearchTerm] = useState('');
  const [faqCategory, setFaqCategory] = useState('All');
  const [copiedChunk, setCopiedChunk] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchKnowledgeBase();
      setData(res);
      setLoading(false);
    };
    load();
  }, []);

  const categories = ['All', 'Attendance', 'Exams', 'Hostel', 'Scholarship', 'Placements'];

  const filteredChunks = (data.chunks || []).filter((chunk) =>
    chunk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaqs = (data.faqs || []).filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (faqCategory === 'All') return matchesSearch;
    const catLower = faqCategory.toLowerCase();
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();
    return matchesSearch && (qLower.includes(catLower) || aLower.includes(catLower));
  });

  const copyText = (txt, id) => {
    navigator.clipboard.writeText(txt);
    setCopiedChunk(id);
    setTimeout(() => setCopiedChunk(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' }}>
        <div>
          <div className="badge-pill badge-emerald" style={{ marginBottom: '8px' }}>
            Knowledge Engine & Corpus Explorer
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Indexed Academic Policies & Training Datasets
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Inspect vectorized chunks from <code>chunks.npy</code> and the 100-pair QA training ground truth from <code>campus_faq_100.json</code>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge-pill badge-cyan" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            {data.chunks?.length || 5} Policy Chunks
          </span>
          <span className="badge-pill badge-violet" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            {data.faqs?.length || 100} QA Pairs
          </span>
        </div>
      </div>

      {/* Student Handbook Quick Reference Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(245, 158, 11, 0.08))',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={20} color="#06b6d4" />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
              Student Handbook Essential Cutoffs (Ground Truth)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              &ge; 75% aggregate attendance • 60-74% condonation with medical certificate • &lt; 60% detention • Oct 15 drop deadline • Dec 18-24 KT backlog exams
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(data.faqs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'campus_faq_100_export.json';
            a.click();
          }}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
        >
          Export 100-FAQ JSON
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {[
          { id: 'chunks', label: `Vector Chunks (FAISS RAG - ${data.chunks?.length || 5})`, icon: Database },
          { id: 'faqs', label: `100-Pair Training FAQ (LoRA Fine-Tuning - ${data.faqs?.length || 100})`, icon: HelpCircle },
          { id: 'raw', label: 'Raw Policy Document (campus_policy.txt)', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.25))' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={16} color={isActive ? '#22d3ee' : '#94a3b8'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Category Filter Toolbar */}
      {activeTab !== 'raw' && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            width: '100%',
            maxWidth: '460px',
          }}>
            <Search size={16} color="var(--text-dim)" />
            <input
              type="text"
              placeholder={`Search in ${activeTab === 'chunks' ? 'vector policy chunks' : 'training FAQ pairs'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.88rem',
                width: '100%',
              }}
            />
          </div>

          {/* Category Chips for FAQ Tab */}
          {activeTab === 'faqs' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: faqCategory === cat ? '#06b6d4' : 'var(--border-subtle)',
                    background: faqCategory === cat ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: faqCategory === cat ? '#38bdf8' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Vector Chunks (chunks.npy) */}
      {activeTab === 'chunks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredChunks.map((chunk, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="glass-card"
              style={{
                padding: '20px 24px',
                borderLeft: '4px solid #06b6d4',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge-pill badge-cyan">
                    Vector Chunk #{idx}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    FAISS ID: {idx} • 384-dim Embedding
                  </span>
                </div>

                <button
                  onClick={() => copyText(chunk, `chunk-${idx}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                  }}
                  title="Copy Chunk"
                >
                  {copiedChunk === `chunk-${idx}` ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedChunk === `chunk-${idx}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.95rem', color: '#f1f5f9', lineHeight: 1.6 }}>
                "{chunk}"
              </div>
            </motion.div>
          ))}

          {filteredChunks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
              No chunks matched the search term.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 100-Pair Training FAQ (campus_faq_100.json) */}
      {activeTab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Showing {filteredFaqs.length} training pairs matching criteria:
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '16px',
          }}>
            {filteredFaqs.slice(0, 30).map((faq, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge-pill badge-violet" style={{ fontSize: '0.7rem' }}>
                    Pair #{idx + 1}
                  </span>
                  <HelpCircle size={15} color="#a855f7" />
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                  {faq.question}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>

          {filteredFaqs.length > 30 && (
            <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Showing first 30 of {filteredFaqs.length} pairs. Use search or categories above to filter.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Raw Policy Document (campus_policy.txt) */}
      {activeTab === 'raw' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              campus_policy.txt
            </span>
            <span className="badge-pill badge-emerald">
              Official External Policy Notice
            </span>
          </div>

          <pre style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '24px',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'pre-wrap',
            color: '#e2e8f0',
            lineHeight: 1.8,
            fontSize: '0.92rem',
            border: '1px solid var(--border-subtle)',
          }}>
            {data.policy_raw || (
              `Academic Notice 2026-A: The last date for dropping any registered semester course without academic record penalty is October 15, 2026.\n\n` +
              `Academic Notice 2026-B: Remedial / KT examinations for the 2026 semester backlogs are scheduled between December 18 and December 24, 2026.\n\n` +
              `Hostel Notification: Gates close strictly at 10:00 PM on weekdays and 10:30 PM on weekends. Late entry requests must be submitted on the student app.\n\n` +
              `Scholarship Notice 2026: Merit-cum-means scholarship applications remain open until November 30, 2026 for students maintaining CGPA > 8.0 and family income < 5 LPA.\n\n` +
              `Placement Directive: Minimum 80% attendance in pre-placement mock drives is mandatory to retain slot bookings for Day-1 recruiters.`
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
