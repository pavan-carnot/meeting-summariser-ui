import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Upload, Mic, FileText, FileUp, ArrowRight,
} from 'lucide-react';

// Left navigation. Only INPUT lives here — the sidebar is the way to pick
// (or switch to) a capture method. Result views are surfaced as horizontal
// tabs inside the main pane instead, so this stays quiet and single-purpose.
//
// A single "Return to results" bridge appears below the INPUT list once
// there's a session to return to.
export default function Sidebar({
  activeView,
  onNavigate,
  hasResults,
  onNewSession,
  onReturnToResults,
}) {
  const inputItems = [
    { id: 'audio',    label: 'Upload Audio', icon: Upload },
    { id: 'realtime', label: 'Real-Time',    icon: Mic },
    { id: 'paste',    label: 'Paste Text',   icon: FileText },
    { id: 'text',     label: 'Upload Text',  icon: FileUp },
  ];

  return (
    <aside style={{
      position: 'sticky', top: 0, alignSelf: 'flex-start',
      height: '100vh',
      width: 260, flexShrink: 0,
      background: '#faf9f4', borderRight: '1px solid #e5e2d6',
      display: 'flex', flexDirection: 'column',
      padding: '22px 18px 18px',
      boxSizing: 'border-box',
      overflowY: 'auto',
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: '#0A0F1E', color: '#00C5B0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 15,
          }}>M</div>
          <div style={{
            fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 15,
            color: '#0A0F1E', letterSpacing: '-0.01em',
          }}>Meeting Summariser</div>
        </div>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#66645c', fontSize: 12.5, fontWeight: 500,
            textDecoration: 'none', padding: '4px 8px 4px 4px',
            borderRadius: 6,
          }}
        >
          <ArrowLeft size={13} />
          Back to home
        </Link>
      </div>

      <button
        onClick={onNewSession}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
          width: '100%', padding: '10px 12px', marginBottom: 22,
          background: '#0A0F1E', color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          fontSize: 13.5, fontWeight: 700,
          boxShadow: '0 4px 12px rgba(10,15,30,0.15)',
        }}
      >
        <Plus size={15} /> New Session
      </button>

      <NavGroup title="Input Method">
        {inputItems.map((it) => (
          <NavItem
            key={it.id}
            icon={it.icon}
            label={it.label}
            active={activeView === it.id}
            onClick={() => onNavigate(it.id)}
          />
        ))}
      </NavGroup>

      {hasResults && (
        <button
          onClick={onReturnToResults}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 12px', marginBottom: 16,
            background: 'rgba(0,197,176,0.10)', color: '#00706b',
            border: '1px solid rgba(0,197,176,0.35)', borderRadius: 9,
            cursor: 'pointer', fontSize: 13, fontWeight: 700,
          }}
        >
          <ArrowRight size={14} />
          <span style={{ flex: 1, textAlign: 'left' }}>Return to results</span>
        </button>
      )}

      <div style={{ flex: 1 }} />

      <div style={{
        fontSize: 11.5, color: '#9a978d', lineHeight: 1.55,
        borderTop: '1px solid #e5e2d6', paddingTop: 14,
      }}>
        Runs entirely on your infrastructure. Nothing leaves your network.
      </div>
    </aside>
  );
}

function NavGroup({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: "'Manrope',sans-serif", fontSize: 11, fontWeight: 800,
        letterSpacing: '.14em', color: '#9a978d', textTransform: 'uppercase',
        padding: '0 8px 8px',
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, disabled, onClick }) {
  const [hover, setHover] = React.useState(false);
  const bg = active
    ? '#0A0F1E'
    : (hover && !disabled ? 'rgba(10,15,30,0.06)' : 'transparent');
  const fg = active ? '#fff' : (disabled ? '#c9c5b5' : '#3a3833');
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', border: 'none',
        borderRadius: 9, background: bg, color: fg,
        fontSize: 13.5, fontWeight: active ? 700 : 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left', width: '100%',
        transition: 'background .12s ease, color .12s ease',
      }}
    >
      <Icon size={15} />
      <span style={{ flex: 1 }}>{label}</span>
      {active && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: '#00C5B0',
        }} />
      )}
    </button>
  );
}
