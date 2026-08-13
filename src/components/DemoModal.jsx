import React, { useState } from 'react';
import { X, Play, Pause, FileAudio, Users, Sparkles, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      id: 'upload',
      title: '1. Audio / Video Upload',
      icon: FileAudio,
      desc: 'Select or drag & drop any MP3, WAV, M4A, or MP4 meeting recording. Supports up to 50 MB on Free Demo.',
      highlight: 'Automated format conversion & duration verification',
    },
    {
      id: 'diarization',
      title: '2. Speaker Diarization',
      icon: Users,
      desc: 'Pyannote & Whisper automatically separate and label distinct speakers (Speaker 0, Speaker 1).',
      highlight: 'Interactive Speaker Labelling (Assign real names like Alice & Bob)',
    },
    {
      id: 'summary',
      title: '3. AI Summarization & Action Items',
      icon: Sparkles,
      desc: 'DeepSeek / Llama extracts executive summaries, key decisions, and structured action items with assignees.',
      highlight: 'Word-level Whisper confidence scores & instant search',
    },
    {
      id: 'export',
      title: '4. Executive Export & Emails',
      icon: FileText,
      desc: 'Generate ready-to-send follow-up emails and export formatted PDF reports for stakeholders.',
      highlight: 'One-click copy & automated email template generation',
    },
  ];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20,
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 900,
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0d9488',
            }}>
              <Play size={18} fill="#0d9488" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                Meeting Summarizer Workflow Demo
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
                See how audio upload, speaker identification, and executive summaries work step-by-step
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', borderRadius: 10,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748b', transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 320px',
          flex: 1, minHeight: 420, overflow: 'hidden',
        }}>
          {/* Main Showcase / Preview Area */}
          <div style={{
            background: '#090d16',
            padding: 24,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            position: 'relative',
          }}>
            {/* Visual Demo Card Showcase */}
            <div style={{
              width: '100%', height: '100%',
              background: '#1e293b', borderRadius: 14,
              border: '1px solid #334155',
              padding: 24,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid #334155', paddingBottom: 14,
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                  textTransform: 'uppercase', color: '#38bdf8',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Sparkles size={14} /> Workflow Feature Highlight
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
                  Step {activeStep + 1} of {demoSteps.length}
                </span>
              </div>

              {/* Step Graphic Preview */}
              <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(13, 148, 136, 0.15)',
                  border: '2px solid #0d9488',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: '#2dd4bf', marginBottom: 14,
                }}>
                  {React.createElement(demoSteps[activeStep].icon, { size: 30 })}
                </div>
                <h4 style={{ color: '#f8fafc', fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
                  {demoSteps[activeStep].title}
                </h4>
                <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.5, maxWidth: 440, margin: '0 auto 14px' }}>
                  {demoSteps[activeStep].desc}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '6px 14px', borderRadius: 999,
                  fontSize: 12.5, color: '#38bdf8', fontWeight: 600,
                }}>
                  <CheckCircle2 size={14} /> {demoSteps[activeStep].highlight}
                </div>
              </div>

              {/* Navigation playback bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#0f172a', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #1e293b',
              }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    background: '#0d9488', border: 'none', borderRadius: 8,
                    padding: '6px 14px', color: '#ffffff', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                  }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  {isPlaying ? 'Pause Overview' : 'Auto Play Demo'}
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  {demoSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      style={{
                        width: idx === activeStep ? 24 : 8,
                        height: 8, borderRadius: 4, border: 'none',
                        background: idx === activeStep ? '#0d9488' : '#475569',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps Sidebar / Interactive List */}
          <div style={{
            background: '#ffffff', padding: 20,
            borderLeft: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontSize: 12, fontWeight: 800, color: '#94a3b8',
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14,
              }}>
                Workflow Steps
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {demoSteps.map((step, idx) => {
                  const IconComp = step.icon;
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={step.id}
                      onClick={() => setActiveStep(idx)}
                      style={{
                        padding: '12px 14px', borderRadius: 12,
                        background: isActive ? '#f0fdf4' : '#f8fafc',
                        border: `1px solid ${isActive ? '#bbf7d0' : '#e2e8f0'}`,
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          color: isActive ? '#0d9488' : '#64748b',
                          display: 'flex', alignItems: 'center',
                        }}>
                          <IconComp size={18} />
                        </div>
                        <div>
                          <div style={{
                            fontSize: 13, fontWeight: isActive ? 700 : 600,
                            color: isActive ? '#0d9488' : '#334155',
                          }}>
                            {step.title}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} color={isActive ? '#0d9488' : '#cbd5e1'} />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '12px', borderRadius: 12,
                background: '#0f172a', color: '#ffffff', border: 'none',
                fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
                marginTop: 20,
              }}
            >
              Try Upload Audio Demo Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
