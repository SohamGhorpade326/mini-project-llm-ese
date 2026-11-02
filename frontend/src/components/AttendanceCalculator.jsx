import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, AlertTriangle, CheckCircle, ShieldAlert, BookOpen, ArrowRight } from 'lucide-react';

export default function AttendanceCalculator() {
  const [conducted, setConducted] = useState(40);
  const [attended, setAttended] = useState(27);
  const [courseType, setCourseType] = useState('theory'); // 'theory' (75%), 'lab' (75%), 'placement' (85%)

  const currentPercent = conducted > 0 ? (attended / conducted) * 100 : 0;
  const targetPercent = courseType === 'placement' ? 85 : 75;

  // Calculate classes needed to reach target percentage:
  // (attended + x) / (conducted + x) >= target / 100
  // attended + x >= (target/100)*conducted + (target/100)*x
  // x * (1 - target/100) >= (target/100)*conducted - attended
  // x >= ((target/100)*conducted - attended) / (1 - target/100)
  let classesNeeded = 0;
  if (currentPercent < targetPercent) {
    const t = targetPercent / 100;
    classesNeeded = Math.ceil((t * conducted - attended) / (1 - t));
    if (classesNeeded < 0) classesNeeded = 0;
  }

  // Calculate maximum skips allowed while staying above target
  let skipsAllowed = 0;
  if (currentPercent > targetPercent) {
    // attended / (conducted + y) >= target / 100
    // conducted + y <= attended / (target / 100)
    // y <= attended / (target/100) - conducted
    skipsAllowed = Math.floor(attended / (targetPercent / 100) - conducted);
    if (skipsAllowed < 0) skipsAllowed = 0;
  }

  // Determine status
  let statusBadge = {
    label: "Exam Eligible (Safe)",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.4)",
    icon: CheckCircle,
    advice: "Your attendance is safely above the institutional 75% cutoff. You are fully eligible for semester end-exams."
  };

  if (currentPercent < 60) {
    statusBadge = {
      label: "Course Detention Risk (<60%)",
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.15)",
      border: "rgba(239, 68, 68, 0.4)",
      icon: ShieldAlert,
      advice: "CRITICAL: Attendance strictly below 60% leads to grade drops or course detention without eligibility for end-semester exams (Ref: FAQ Pair #3)."
    };
  } else if (currentPercent < 75) {
    statusBadge = {
      label: "Condonation Required (60% - 74%)",
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.4)",
      icon: AlertTriangle,
      advice: "Requires submission of valid medical certificate or institutional duty proof to HOD within 5 working days of return (Ref: FAQ Pair #2 & #6)."
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calculator size={20} color="#fbbf24" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Attendance Detention & Condonation Simulator
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Built directly from the 100 institutional QA pairs in <code>campus_faq_100.json</code>.
            </p>
          </div>
        </div>

        {/* Type Selector */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
          {[
            { id: 'theory', label: 'Theory (75%)' },
            { id: 'lab', label: 'Lab Sessions (75%)' },
            { id: 'placement', label: 'Placement Drives (85%)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setCourseType(t.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: courseType === t.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: courseType === t.id ? '#ffffff' : 'var(--text-muted)',
                fontWeight: courseType === t.id ? 600 : 400,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600 }}>Total Lectures Conducted:</span>
              <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{conducted}</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={conducted}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setConducted(val);
                if (attended > val) setAttended(val);
              }}
              style={{ width: '100%', accentColor: '#06b6d4' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600 }}>Lectures You Attended:</span>
              <strong style={{ color: '#a855f7', fontFamily: 'var(--font-mono)' }}>{attended}</strong>
            </div>
            <input
              type="range"
              min="0"
              max={conducted}
              value={attended}
              onChange={(e) => setAttended(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#a855f7' }}
            />
          </div>

          {/* Quick preset chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setConducted(40); setAttended(23); }}
              style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Simulate Detention (57.5%)
            </button>
            <button
              onClick={() => { setConducted(40); setAttended(26); }}
              style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Simulate Condonation (65%)
            </button>
            <button
              onClick={() => { setConducted(40); setAttended(34); }}
              style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Simulate Safe (85%)
            </button>
          </div>
        </div>

        {/* Live Status Visualizer */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${statusBadge.border}`,
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Current Attendance
              </span>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: statusBadge.bg,
                color: statusBadge.color,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                <StatusIcon size={13} />
                {statusBadge.label}
              </div>
            </div>

            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: statusBadge.color }}>
              {currentPercent.toFixed(1)}%
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
              {statusBadge.advice}
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
          }}>
            {currentPercent < targetPercent ? (
              <span style={{ color: '#fbbf24' }}>
                Need to attend <strong>{classesNeeded}</strong> consecutive upcoming classes to reach {targetPercent}%.
              </span>
            ) : (
              <span style={{ color: '#34d399' }}>
                You can safely miss up to <strong>{skipsAllowed}</strong> classes while maintaining &ge; {targetPercent}%.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
