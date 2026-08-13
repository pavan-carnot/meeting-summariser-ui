import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, FileAudio, Users, Sparkles, FileText, CheckCircle2, Volume2, ShieldCheck } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 20; // 20 seconds total demo video
  const timerRef = useRef(null);

  // Auto-advance video timer when open & playing
  useEffect(() => {
    if (isOpen && isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            return 0; // loop demo video
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
    { title: 'Upload Audio', time: '0:00', icon: FileAudio },
    { title: 'Diarization', time: '0:05', icon: Users },
    { title: 'Speaker Labelling', time: '0:10', icon: Sparkles },
    { title: 'Summary & PDF', time: '0:15', icon: FileText },
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
        background: '#0f172a',
        borderRadius: 20,
        width: '100%',
        maxWidth: 960,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#0b0f19',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#0d9488', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Play size={16} fill="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>
                Product Demo: Audio Upload &amp; Diarization Workflow
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                Live video demonstration of end-to-end meeting summarization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#1e293b', border: 'none', borderRadius: 8,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Display Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: 480,
          background: '#020617',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          overflow: 'hidden',
        }}>
          {/* Animated Watermark Badge */}
          <div style={{
            position: 'absolute', top: 16, left: 16, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '6px 12px', borderRadius: 999, fontSize: 12, color: '#2dd4bf', fontWeight: 700,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s infinite' }}></span>
            LIVE DEMO RECORDING
          </div>

          <div style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '6px 12px', borderRadius: 999, fontSize: 12, color: '#94a3b8',
          }}>
            <Volume2 size={14} /> Audio Preview Active
          </div>

          {/* SCREEN 1: Uploading Audio File (0:00 - 0:05) */}
          {currentStep === 0 && (
            <div style={{
              width: '88%', height: '80%', background: '#0f172a', borderRadius: 16,
              border: '2px dashed #0d9488', padding: 32,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, background: '#0d948822',
                color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, border: '1px solid #0d948855',
              }}>
                <FileAudio size={36} />
              </div>
              <h4 style={{ color: '#f8fafc', fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
                Selecting "quarterly_sync_recording.mp3"
              </h4>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 20px' }}>
                Free Demo Tier • 5 mins limit • Auto-format conversion to WAV 16kHz
              </p>
              {/* Simulated Progress Bar */}
              <div style={{ width: '80%', height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${(currentTime / 5) * 100}%`, height: '100%',
                  background: 'linear-gradient(90deg, #0d9488, #2dd4bf)',
                  transition: 'width 0.1s linear',
                }} />
              </div>
              <span style={{ fontSize: 12, color: '#2dd4bf', marginTop: 8, fontWeight: 700 }}>
                Uploading &amp; Preparing Audio ({Math.round((currentTime / 5) * 100)}%)
              </span>
            </div>
          )}

          {/* SCREEN 2: Speaker Diarization & Whisper (0:05 - 0:10) */}
          {currentStep === 1 && (
            <div style={{
              width: '88%', height: '80%', background: '#0f172a', borderRadius: 16,
              border: '1px solid #334155', padding: 28,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontWeight: 700, fontSize: 14 }}>
                  <Users size={18} /> Pyannote Voice Diarization Engine
                </div>
                <span style={{ background: '#0284c722', color: '#38bdf8', border: '1px solid #0284c755', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                  2 Speakers Detected
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0' }}>
                <div style={{ background: '#1e293b', padding: 12, borderRadius: 10, borderLeft: '4px solid #38bdf8' }}>
                  <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 800 }}>[00:04] Speaker 0:</span>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#e2e8f0' }}>"Let's review the Q3 product migration timeline and owner assignments."</p>
                </div>
                <div style={{ background: '#1e293b', padding: 12, borderRadius: 10, borderLeft: '4px solid #a855f7' }}>
                  <span style={{ fontSize: 12, color: '#c084fc', fontWeight: 800 }}>[00:12] Speaker 1:</span>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#e2e8f0' }}>"The API integration is complete and tested on staging servers."</p>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} color="#22c55e" /> Whisper confidence score: <strong>96.4%</strong>
              </div>
            </div>
          )}

          {/* SCREEN 3: Speaker Labelling Interface (0:10 - 0:15) */}
          {currentStep === 2 && (
            <div style={{
              width: '88%', height: '80%', background: '#0f172a', borderRadius: 16,
              border: '1px solid #0d9488', padding: 28,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2dd4bf', fontWeight: 800, fontSize: 14 }}>
                  <Sparkles size={18} /> Interactive Speaker Labelling
                </div>
                <span style={{ background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b55', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                  Renaming Active
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: '14px 0' }}>
                <div style={{ background: '#1e293b', padding: 14, borderRadius: 10, border: '1px solid #334155' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Voice ID 0</div>
                  <input readOnly value="Alice Smith (Product Manager)" style={{ width: '100%', padding: 8, background: '#0f172a', border: '1px solid #0d9488', color: '#2dd4bf', borderRadius: 6, fontSize: 12, fontWeight: 700 }} />
                </div>
                <div style={{ background: '#1e293b', padding: 14, borderRadius: 10, border: '1px solid #334155' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Voice ID 1</div>
                  <input readOnly value="Bob Jones (Lead Developer)" style={{ width: '100%', padding: 8, background: '#0f172a', border: '1px solid #a855f7', color: '#c084fc', borderRadius: 6, fontSize: 12, fontWeight: 700 }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button style={{ padding: '6px 14px', background: '#0d9488', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>✓ Save Labels</button>
              </div>
            </div>
          )}

          {/* SCREEN 4: Summary & PDF Export (0:15 - 0:20) */}
          {currentStep === 3 && (
            <div style={{
              width: '88%', height: '80%', background: '#0f172a', borderRadius: 16,
              border: '1px solid #334155', padding: 28,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f8fafc', fontWeight: 800, fontSize: 14 }}>
                  <FileText size={18} color="#0d9488" /> Executive Summary &amp; Action Items
                </div>
                <button style={{ background: '#0d9488', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  📄 Export PDF Report
                </button>
              </div>
              <div style={{ margin: '14px 0' }}>
                <h5 style={{ color: '#2dd4bf', fontSize: 13, margin: '0 0 6px', fontWeight: 800 }}>Key Action Items Extracted:</h5>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.6 }}>
                  <li><strong>Alice Smith</strong> to finalize UI sprint board by Friday</li>
                  <li><strong>Bob Jones</strong> to deploy staging build for QA review</li>
                </ul>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#2dd4bf' }}>
                <ShieldCheck size={16} /> 100% On-premise processing completed in 4.2 seconds
              </div>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div style={{
          padding: '16px 24px',
          background: '#0b0f19',
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
