import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Zap, 
  Database, 
  Sliders, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  FileCheck2,
  Users,
  GraduationCap,
  Calendar,
  AlertCircle
} from 'lucide-react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import AttendanceCalculator from '../components/AttendanceCalculator';
import PolicyTimeline from '../components/PolicyTimeline';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
  };

  const quickStats = [
    { label: "Institutional Q&A Pairs", value: "100 Pairs", detail: "campus_faq_100.json" },
    { label: "Champion LoRA Rank", value: "r = 8", detail: "Run C (Loss: 3.4684)" },
    { label: "Vector Grounding Time", value: "< 10 ms", detail: "FAISS Dense Index" },
    { label: "Edge Model Footprint", value: "0.5B Params", detail: "Qwen2.5 Base Model" },
  ];

  const studentScenarios = [
    {
      q: "“My attendance dropped to 64%. Will I be detained from end-sem exams?”",
      a: "No! Between 60% and 74%, institutional rules grant condonation if you submit a valid medical certificate or OD slip to your HOD within 5 working days.",
      rule: "FAQ Pair #2 & #6"
    },
    {
      q: "“When are the remedial and KT examinations scheduled for 2026?”",
      a: "Remedial and backlog exams are officially scheduled between December 18 and December 24, 2026.",
      rule: "Academic Notice 2026-B"
    },
    {
      q: "“What is the deadline to drop a registered course without penalty?”",
      a: "The final cutoff without grade impact or academic record penalty is October 15, 2026.",
      rule: "Academic Notice 2026-A"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}
    >
      {/* Humanized Hero Section with Campus Scenery Image */}
      <motion.section variants={itemVariants} style={{ marginBottom: '48px' }}>
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Background Real Campus Photograph */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/images/campus_students.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'brightness(0.35) saturate(1.1)',
          }} />

          {/* Foreground Hero Content */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            padding: '64px 36px',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, rgba(9, 14, 26, 0.4) 0%, rgba(9, 14, 26, 0.85) 100%)',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span className="badge-pill badge-amber">
                <GraduationCap size={14} />
                Department of Computer Engineering • ESE Lab Project
              </span>
              <span className="badge-pill badge-cyan">
                PEFT LoRA (r=8) &amp; FAISS Vector RAG
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '20px',
              maxWidth: '900px',
              margin: '0 auto 20px',
            }} className="gradient-text-hero">
              Campus Companion: Fast, Grounded Policy Intelligence
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: '#e2e8f0',
              maxWidth: '720px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>
              Solving everyday student academic anxiety — from attendance condonation cutoffs and backlog exam schedules to 
              hostel curfews and scholarship requirements. Powered by fine-tuned <strong>Qwen2.5-0.5B</strong> and instant <strong>FAISS</strong> retrieval.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <Link to="/assistant" className="btn-primary" style={{ padding: '13px 28px', fontSize: '1rem' }}>
                <span>Ask CampusAI Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/benchmarks" className="btn-secondary" style={{ padding: '13px 24px', fontSize: '1rem' }}>
                <TrendingUp size={18} color="#a855f7" />
                <span>Hyperparameter Benchmarks</span>
              </Link>
              <Link to="/knowledge" className="btn-secondary" style={{ padding: '13px 24px', fontSize: '1rem' }}>
                <BookOpen size={18} color="#06b6d4" />
                <span>Browse Policy Rules</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Metrics Strip */}
      <motion.section variants={itemVariants} style={{ marginBottom: '48px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {quickStats.map((st, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                {st.label}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                {st.value}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 500 }}>
                {st.detail}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Extra Feature 1: Attendance Detention Risk Calculator */}
      <motion.section variants={itemVariants} style={{ marginBottom: '48px' }}>
        <AttendanceCalculator />
      </motion.section>

      {/* Extra Feature 2: Official Policy Directives & Deadlines */}
      <motion.section variants={itemVariants} style={{ marginBottom: '48px' }}>
        <PolicyTimeline />
      </motion.section>

      {/* Human Student Scenarios / Everyday Questions */}
      <motion.section variants={itemVariants} style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="badge-pill badge-violet" style={{ marginBottom: '8px' }}>
            Real Student Inquiries
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '6px' }}>
            Common Academic Questions Answered With Zero Hallucination
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Verified institutional answers grounded in the training FAQ dataset and vector policy index.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {studentScenarios.map((scen, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
                    {scen.rule}
                  </span>
                  <CheckCircle size={16} color="#10b981" />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px', lineHeight: 1.4 }}>
                  {scen.q}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {scen.a}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <Link
                  to="/assistant"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#38bdf8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <span>Test in Live Assistant</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Engineering Lab Showcase with Lab Photo */}
      <motion.section variants={itemVariants} style={{ marginBottom: '48px' }}>
        <div className="glass-panel" style={{
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          alignItems: 'center',
        }}>
          <div style={{ padding: '36px' }}>
            <div className="badge-pill badge-amber" style={{ marginBottom: '10px' }}>
              Lab ESE Experiment 2 Showcase
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>
              Rigorous Empirical Fine-Tuning in the University AI Lab
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Students and faculty collaborators evaluated three experimental ablation configurations on Qwen2.5-0.5B. 
              <strong>Run C</strong> achieved a winning training loss of <strong>3.4684</strong> in just <strong>6.90s</strong> by pairing 
              a 2e-4 learning rate with rank r=8, outperforming underfitted Run A by 54.4%.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Run A Loss</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171' }}>7.6091</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Run B Loss</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>4.6819</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Run C (Champion)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>3.4684</div>
              </div>
            </div>

            <Link to="/benchmarks" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <span>View Full Ablation Trajectories</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            height: '100%',
            minHeight: '320px',
            position: 'relative',
          }}>
            <img
              src="/images/ai_lab_research.jpg"
              alt="University Computer Engineering AI Lab Workbench"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* Interactive Architecture Flow Section */}
      <motion.section variants={itemVariants} style={{ marginBottom: '40px' }}>
        <ArchitectureDiagram />
      </motion.section>
    </motion.div>
  );
}
