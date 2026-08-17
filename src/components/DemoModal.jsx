import React from 'react';
import { X, Play, ShieldCheck, FileText, Users, Sparkles, FileAudio } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Modal Top Header */}
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
                Application Video Walkthrough (MP4 Video Recording)
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Actual video demonstration showing audio upload, Pyannote diarization, speaker labelling, and PDF export
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

        {/* Real HTML5 Video Player Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          background: '#090d16',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 20, boxSizing: 'border-box',
        }}>
          <video
            src="/demo.mp4"
            autoPlay
            controls
            playsInline
            style={{
              width: '100%',
              maxHeight: 520,
              borderRadius: 14,
              boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
              background: '#000000',
              outline: 'none',
            }}
          />
        </div>

        {/* Modal Bottom Bar */}
        <div style={{
          padding: '16px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0d9488', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 100% On-Premise Execution
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} /> Pyannote Voice Diarization
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} /> PDF &amp; Email Export
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#0f172a', color: '#ffffff', border: 'none',
              padding: '10px 20px', borderRadius: 10, fontSize: 13.5, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close &amp; Try Live App
          </button>
        </div>
      </div>
    </div>
  );
}
