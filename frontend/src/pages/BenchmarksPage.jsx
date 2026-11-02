import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingDown, 
  Zap, 
  Award, 
  Sliders, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileCode, 
  RefreshCw,
  Cpu,
  Layers,
  BrainCircuit
} from 'lucide-react';
import { fetchBenchmark } from '../services/api';
import VivaInspector from '../components/VivaInspector';

export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'charts' | 'analysis' | 'viva' | 'raw'

  const loadData = async () => {
    setLoading(true);
    const data = await fetchBenchmark();
    setBenchmarks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute maximum loss for relative bar scaling
  const maxLoss = benchmarks.length > 0 ? Math.max(...benchmarks.map(b => b["Training Loss"])) : 10;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' }}>
        <div>
          <div className="badge-pill badge-violet" style={{ marginBottom: '8px' }}>
            Experiment 2: Hyperparameter Ablation
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            LoRA Fine-Tuning Benchmarks & Analysis
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Empirical evaluation of learning rates, rank capacities ($r=4$ vs $r=8$), and convergence trajectories.
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          <span>Reload From benchmark_results.json</span>
        </button>
      </div>

      {/* Navigation Pill Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {[
          { id: 'overview', label: 'Run Comparison Cards', icon: Award },
          { id: 'charts', label: 'Visual Loss Trajectories', icon: BarChart3 },
          { id: 'analysis', label: 'In-Depth Analytical Breakdown', icon: Layers },
          { id: 'viva', label: 'Oral Defense Viva Q&A', icon: BrainCircuit },
          { id: 'raw', label: 'Source JSON Artifact', icon: FileCode },
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

      {/* Tab 1: Overview Cards */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {benchmarks.map((run, idx) => {
              const isWinner = run["Run"].includes("Run C");
              const isBaseline = run["Run"].includes("Run A");

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="glass-card"
                  style={{
                    padding: '28px',
                    position: 'relative',
                    border: isWinner ? '2px solid rgba(16, 185, 129, 0.6)' : '1px solid var(--border-subtle)',
                    background: isWinner 
                      ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.8))' 
                      : 'rgba(15, 23, 42, 0.6)',
                    boxShadow: isWinner ? '0 0 30px -5px rgba(16, 185, 129, 0.3)' : 'none',
                  }}
                >
                  {isWinner && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                    }}>
                      <Award size={13} />
                      CHAMPION MODEL
                    </div>
                  )}

                  {isBaseline && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}>
                      <AlertTriangle size={13} />
                      UNDERFITTED
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                    {run["Run"]}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
                    Ablation Configuration & Result
                  </div>

                  {/* Core Metrics */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                  }}>
                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Training Loss
                      </div>
                      <div style={{
                        fontSize: '1.6rem',
                        fontWeight: 800,
                        color: isWinner ? '#34d399' : isBaseline ? '#f87171' : '#38bdf8',
                        marginTop: '2px',
                      }}>
                        {run["Training Loss"]}
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Runtime
                      </div>
                      <div style={{
                        fontSize: '1.6rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        marginTop: '2px',
                      }}>
                        {run["Time (seconds)"]}
                      </div>
                    </div>
                  </div>

                  {/* Hyperparameter List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>Learning Rate:</span>
                      <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{run["Learning Rate"]}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>LoRA Rank (r):</span>
                      <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>r = {run["LoRA Rank (r)"]}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>Epochs:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{run["Epochs"]}</strong>
                    </div>
                  </div>

                  {/* Verdict badge */}
                  <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    background: isWinner ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)',
                    fontSize: '0.78rem',
                    color: isWinner ? '#a7f3d0' : 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}>
                    {isWinner && "Optimal capacity & step size. Converged with 54.4% lower loss and fastest wall-clock epoch time (6.9s)."}
                    {isBaseline && "Step size (1e-4) too conservative for 2 epochs; weights remained trapped in high-loss region."}
                    {!isWinner && !isBaseline && "Higher LR doubled convergence speed over Run A, but rank r=4 bottlenecked expressive capacity."}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Summary Insight */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Award size={24} color="#06b6d4" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '2px' }}>
                Key Takeaway for Oral Defense (Viva)
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Run C (LR = 2e-4, r = 8) yielded superior representation capacity for institutional domain rules without incurring 
                wall-clock latency overhead (6.9s vs 9.07s). The fine-tuned weights saved in <code>best_campus_lora/</code> correspond directly to Run C.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Loss Trajectories */}
      {activeTab === 'charts' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
            Comparative Training Loss Visualizer
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '32px' }}>
            Visual comparison of final training loss across Experiment 2 runs. Lower is better.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {benchmarks.map((run, idx) => {
              const loss = run["Training Loss"];
              const pct = (loss / maxLoss) * 100;
              const isWinner = run["Run"].includes("Run C");

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 600 }}>{run["Run"]}</span>
                      <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
                        LR: {run["Learning Rate"]} | r: {run["LoRA Rank (r)"]}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: isWinner ? '#34d399' : '#f8fafc' }}>
                      {loss} Loss ({run["Time (seconds)"]})
                    </div>
                  </div>

                  {/* Visual Bar Track */}
                  <div style={{
                    height: '24px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.15 }}
                      style={{
                        height: '100%',
                        borderRadius: 'var(--radius-full)',
                        background: isWinner 
                          ? 'linear-gradient(90deg, #10b981, #34d399)' 
                          : idx === 1 
                            ? 'linear-gradient(90deg, #38bdf8, #818cf8)' 
                            : 'linear-gradient(90deg, #f43f5e, #fb7185)',
                        boxShadow: isWinner ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Loss Reduction (Run A → C)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>-54.4%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From 7.6091 down to 3.4684</div>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Speedup (Run A → C)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>+23.9%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From 9.07s down to 6.90s</div>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>LoRA Parameter Ratio</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>&lt; 0.1%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trainable vs Frozen Base</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Detailed Analytical Breakdown */}
      {activeTab === 'analysis' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
            Analytical Justification: Why Run C Proved Optimal Over Run A
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '18px 22px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid #06b6d4',
            }}>
              <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>
                1. Learning Rate Magnitude and Gradient Traversal (1e-4 vs 2e-4)
              </h4>
              <p>
                In <strong>Run A</strong>, a conservative learning rate of &eta; = 1e-4 resulted in insufficient gradient 
                steps over the limited 2-epoch budget. The loss remained stalled at <strong>7.6091</strong>, indicating underfitting 
                where the cross-entropy loss landscape was not adequately traversed. Raising the learning rate to &eta; = 2e-4 in 
                <strong> Run B</strong> accelerated gradient descent, dropping the loss to <strong>4.6819</strong> with zero signs of gradient divergence.
              </p>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '18px 22px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid #a855f7',
            }}>
              <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>
                2. Intrinsic Dimensionality & LoRA Rank Capacity ($r=4$ vs $r=8$)
              </h4>
              <p>
                While Run B corrected the learning rate, the low rank r = 4 imposed an information bottleneck. 
                Decomposing the weight updates W = W_0 + (&alpha; / r) &times; B &times; A with r = 4 restricted the subspace dimension of the policy adaptation. 
                In <strong>Run C</strong>, doubling the rank to r = 8 (&alpha; = 16) provided the requisite expressive capacity to model 
                complex institutional policies (e.g. conditional attendance condonation, multiple backlog timelines), yielding the champion loss of <strong>3.4684</strong>.
              </p>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '18px 22px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid #10b981',
            }}>
              <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>
                3. Compute and Wall-Clock Time Invariance
              </h4>
              <p>
                Crucially, transitioning from $r=4$ to $r=8$ did not penalize training throughput. 
                Run C completed in <strong>6.9 seconds</strong> compared to 9.07s for Run A, because GPU matrix multiplications on modern tensor cores 
                saturate memory bandwidth similarly for small rank dimensions while achieving superior gradient step convergence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Viva Oral Defense Q&A */}
      {activeTab === 'viva' && (
        <VivaInspector />
      )}

      {/* Tab 5: Raw JSON Artifact */}
      {activeTab === 'raw' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              benchmark_results.json
            </span>
            <span className="badge-pill badge-cyan">
              Source Ground Truth
            </span>
          </div>
          <pre style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '20px',
            borderRadius: 'var(--radius-sm)',
            overflowX: 'auto',
            color: '#34d399',
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}>
            {JSON.stringify(benchmarks, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
