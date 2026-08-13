import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, FileAudio, Users, Sparkles, FileText, CheckCircle2, Volume2, ShieldCheck, Check, Lock, Download, Mail } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 20; // 20 seconds total video duration
  const timerRef = useRef(null);

  // Auto-advance video timer when open & playing
  useEffect(() => {
    if (isOpen && isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            return 0; // loop video
          }
          return parseFloat((prev + 0.1).toFixed(1));
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen, isPlaying]);

  // Reset time on modal open
  useEffect(() => {
    if (isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine current active chapter (0 to 3) based on time
  const currentStep = currentTime < 5 ? 0 : currentTime < 10 ? 1 : currentTime < 15 ? 2 : 3;

  const demoChapters = [
    { title: '1. Audio Upload', time: '0:00', icon: FileAudio },
    { title: '2. Diarization', time: '0:05', icon: Users },
    { title: '3. Speaker Labelling', time: '0:10', icon: Sparkles },
    { title: '4. Summary & Report', time: '0:15', icon: FileText },
  ];

  const formatTime = (secs) => {
    const s = Math.floor(secs);
    return `0:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 980,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={16} fill="#0d9488" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 800, color: '#0f172a' }}>
                Application Video Walkthrough (Our App Interface)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Showing real meeting summarization, Pyannote speaker diarization, and PDF export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', borderRadius: 8,
              width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Canvas Container — Renders Exact Application UI Components */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: 490,
          background: '#f1f5f9',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: 20, overflow: 'hidden', boxSizing: 'border-box',
        }}>
          {/* Top Live Video Recording Overlay */}
          <div style={{
            position: 'absolute', top: 14, left: 16, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(4px)',
            padding: '5px 12px', borderRadius: 999, fontSize: 11.5, color: '#2dd4bf', fontWeight: 700,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }}></span>
            UI VIDEO DEMO RECORDING
          </div>

          <div style={{
            position: 'absolute', top: 14, right: 16, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(4px)',
            padding: '5px 12px', borderRadius: 999, fontSize: 11.5, color: '#f8fafc', fontWeight: 600,
          }}>
            <Volume2 size={13} color="#2dd4bf" /> 0:20 Product Tour
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SCENE 1: Audio Upload Input Card (0:00 - 0:05)
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 0 && (
            <div style={{
              width: '100%', maxWidth: 860, background: '#ffffff', borderRadius: 16,
              border: '1px solid #cbd5e1', padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.25s ease',
            }}>
              {/* Exact Tier Switcher */}
              <div style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12,
                padding: '10px 14px', marginBottom: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#0d9488', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                    ⚡ Free Demo Tier
                  </span>
                  <span style={{ fontSize: 12.5, color: '#64748b' }}>(Max 5 mins · 50 MB)</span>
                </div>
                <div style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={12} /> Premium Tier 🔒
                </div>
              </div>

              {/* Exact Audio Upload Dropzone */}
              <div style={{
                border: '2px dashed #0d9488', borderRadius: 14, background: '#f0fdf4',
                padding: '24px 20px', textAlign: 'center', marginBottom: 16,
              }}>
                <FileAudio size={36} color="#0d9488" style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                  quarterly_team_sync.mp3
                </div>
                <div style={{ fontSize: 12.5, color: '#0d9488', marginTop: 4, fontWeight: 600 }}>
                  Selected • 3 mins 42 secs • MP3 Format • 14.8 MB
                </div>
              </div>

              {/* Upload Progress Simulation */}
              <div style={{ width: '100%', height: 7, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${(currentTime / 5) * 100}%`, height: '100%',
                  background: '#0d9488', transition: 'width 0.1s linear',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: '#64748b' }}>
                <span>Processing with Whisper &amp; Pyannote...</span>
                <span style={{ fontWeight: 700, color: '#0d9488' }}>{Math.round((currentTime / 5) * 100)}%</span>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              SCENE 2: Transcript Preview & Diarization (0:05 - 0:10)
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div style={{
              width: '100%', maxWidth: 860, background: '#ffffff', borderRadius: 16,
              border: '1px solid #cbd5e1', padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.25s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Colours show Whisper confidence — hover any word for its score.
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#64748b' }}>
                  <span>🟢 High (≥90%)</span>
                  <span>🟡 Medium (70–89%)</span>
                </div>
              </div>

              {/* Transcript Segments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0d9488', marginBottom: 4 }}>
                    [00:02] Speaker 0 <span style={{ color: '#166534', fontWeight: 700, marginLeft: 8 }}>🟢 97% confidence</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: '#1e293b', lineHeight: 1.5 }}>
                    "Let's review our Q3 product goals and finalize feature deadlines for the team."
                  </div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0d9488', marginBottom: 4 }}>
                    [00:14] Speaker 1 <span style={{ color: '#166534', fontWeight: 700, marginLeft: 8 }}>🟢 94% confidence</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: '#1e293b', lineHeight: 1.5 }}>
                    "The backend architecture is complete. We are on track for staging deployment."
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              SCENE 3: Interactive Speaker Labelling (0:10 - 0:15)
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div style={{
              width: '100%', maxWidth: 860, background: '#ffffff', borderRadius: 16,
              border: '1px solid #cbd5e1', padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.25s ease',
            }}>
              {/* Exact Speaker Labelling Box */}
              <div style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12,
                padding: '16px 18px', marginBottom: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
                    <Sparkles size={16} color="#0d9488" /> Speaker Labelling
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Assign real names to detected voice IDs</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#64748b' }}>Speaker 0</span>
                    <input readOnly value="Alice Smith (Product Lead)" style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 700, color: '#0d9488', fontSize: 13, outline: 'none' }} />
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#64748b' }}>Speaker 1</span>
                    <input readOnly value="Bob Jones (Lead Engineer)" style={{ flex: 1, border: 'none', background: 'transparent', fontWeight: 700, color: '#0d9488', fontSize: 13, outline: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button style={{ background: '#0d9488', color: '#ffffff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={14} /> Save Labels
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              SCENE 4: Executive Summary & PDF Export (0:15 - 0:20)
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div style={{
              width: '100%', maxWidth: 860, background: '#ffffff', borderRadius: 16,
              border: '1px solid #cbd5e1', padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.25s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={18} color="#0d9488" /> Executive Summary &amp; Action Items
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Download size={14} /> Export PDF Report
                  </button>
                  <button style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={14} /> Follow-up Emails
                  </button>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', marginBottom: 6 }}>
                  Executive Summary
                </div>
                <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
                  The team aligned on the Q3 product migration. Alice Smith confirmed feature scope, while Bob Jones verified staging readiness for deployment.
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#166534', marginBottom: 4 }}>
                  Action Item Assigned:
                </div>
                <div style={{ fontSize: 13, color: '#14532d', fontWeight: 600 }}>
                  ✓ <strong>Alice Smith</strong> to finalize UI sprint board by Friday
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div style={{
          padding: '16px 24px',
          background: '#0f172a',
          borderTop: '1px solid #1e293b',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Progress Timeline Scrubber */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', minWidth: 36 }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.1"
              value={currentTime}
              onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
              style={{
                flex: 1, accentColor: '#0d9488', cursor: 'pointer', height: 6,
              }}
            />
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', minWidth: 36 }}>
              0:20
            </span>
          </div>

          {/* Chapter Quick Jump Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: '#0d9488', border: 'none', borderRadius: 8,
                  padding: '8px 16px', color: '#ffffff', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                {isPlaying ? 'Pause' : 'Play Demo'}
              </button>
              <button
                onClick={() => { setCurrentTime(0); setIsPlaying(true); }}
                style={{
                  background: '#1e293b', border: 'none', borderRadius: 8,
                  padding: '8px 12px', color: '#94a3b8', fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} /> Replay
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {demoChapters.map((chap, idx) => {
                const isActive = currentStep === idx;
                return (
                  <button
                    key={chap.title}
                    onClick={() => {
                      setCurrentTime(idx * 5);
                      setIsPlaying(true);
                    }}
                    style={{
                      background: isActive ? '#0d9488' : '#1e293b',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      border: 'none', borderRadius: 8,
                      padding: '6px 12px', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    {chap.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
