import React, { useState } from 'react';
import { Calendar, Clock, Award, ShieldAlert, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export default function PolicyTimeline() {
  const [selectedNotice, setSelectedNotice] = useState(0);

  const notices = [
    {
      id: "2026-A",
      title: "Semester Course Drop Deadline",
      date: "October 15, 2026",
      category: "Academic",
      tag: "Academic Notice 2026-A",
      color: "#06b6d4",
      summary: "The final deadline for dropping any registered semester course without academic record penalty or grade impact.",
      actionText: "Course Drop Portal (Student ERP)",
      clause: "Academic Notice 2026-A: The last date for dropping any registered semester course without academic record penalty is October 15, 2026."
    },
    {
      id: "2026-B",
      title: "Remedial & KT Backlog Examination Window",
      date: "December 18 – 24, 2026",
      category: "Examinations",
      tag: "Academic Notice 2026-B",
      color: "#a855f7",
      summary: "Official examination schedule for clearing previous semester backlogs without losing semester continuity.",
      actionText: "Exam Timetable & Seat Hall Ticket",
      clause: "Academic Notice 2026-B: Remedial / KT examinations for the 2026 semester backlogs are scheduled between December 18 and December 24, 2026."
    },
    {
      id: "2026-SCHOLARSHIP",
      title: "Merit-Cum-Means Scholarship Window",
      date: "Until November 30, 2026",
      category: "Financial Aid",
      tag: "Scholarship Notice 2026",
      color: "#10b981",
      summary: "Financial grant eligibility requiring aggregate CGPA > 8.0 and gross family income below 5 LPA.",
      actionText: "Dean of Student Affairs Portal",
      clause: "Scholarship Notice 2026: Merit-cum-means scholarship applications remain open until November 30, 2026 for students maintaining CGPA > 8.0 and family income < 5 LPA."
    },
    {
      id: "HOSTEL-CURFEW",
      title: "Hostel Entry & Gate Hours",
      date: "Daily (10:00 PM / 10:30 PM)",
      category: "Campus Living",
      tag: "Hostel Notification",
      color: "#f59e0b",
      summary: "Gates close strictly at 10:00 PM on weekdays and 10:30 PM on weekends. Late entry requires prior app clearance.",
      actionText: "Late Pass Application Form",
      clause: "Hostel Notification: Gates close strictly at 10:00 PM on weekdays and 10:30 PM on weekends. Late entry requests must be submitted on the student app."
    },
    {
      id: "PLACEMENT-MOCK",
      title: "Pre-Placement Mock Drive Attendance",
      date: "Mandatory Prior to Day-1",
      category: "Career & Placement",
      tag: "Placement Directive",
      color: "#ec4899",
      summary: "Minimum 80% aggregate attendance in mock drives is mandatory to retain slot bookings for Day-1 recruiters.",
      actionText: "Placement Cell Tracker",
      clause: "Placement Directive: Minimum 80% attendance in pre-placement mock drives is mandatory to retain slot bookings for Day-1 recruiters."
    }
  ];

  const active = notices[selectedNotice];

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calendar size={20} color="#06b6d4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Official Policy Directives & Deadlines
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Extracted from <code>campus_policy.txt</code> and indexed in <code>campus.index</code>.
            </p>
          </div>
        </div>

        <span className="badge-pill badge-cyan" style={{ fontSize: '0.75rem' }}>
          5 Active Campus Directives
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
        {/* Left List of Directives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notices.map((notice, idx) => {
            const isSelected = selectedNotice === idx;
            return (
              <button
                key={notice.id}
                onClick={() => setSelectedNotice(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                  border: isSelected ? `1.5px solid ${notice.color}` : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: notice.color, textTransform: 'uppercase' }}>
                      {notice.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>•</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{notice.date}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {notice.title}
                  </div>
                </div>
                <ChevronRight size={16} color={isSelected ? notice.color : '#64748b'} />
              </button>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: `1px solid ${active.color}50`,
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: `0 0 25px -5px ${active.color}25`,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="badge-pill" style={{ background: `${active.color}20`, color: active.color, border: `1px solid ${active.color}40` }}>
                {active.tag}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {active.date}
              </span>
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
              {active.title}
            </h4>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
              {active.summary}
            </p>

            {/* Official Raw Policy Chunk */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${active.color}`,
              fontSize: '0.82rem',
              color: '#e2e8f0',
              lineHeight: 1.5,
              fontFamily: 'var(--font-mono)',
            }}>
              "{active.clause}"
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
          }}>
            <span>Indexed in Vector RAG &amp; LoRA Attention Weights</span>
            <span style={{ color: active.color, fontWeight: 600 }}>Ref: {active.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
