import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function AppNavbar({ onOpenSmrs, smrsConnected }) {
  const [hover, setHover] = React.useState(false);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: '#ffffff', borderBottom: '1px solid #e2e8f0',
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Left — logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#111' }}>
          <img
            src="/icarkno%20logo.png"
            alt="icarKno"
            style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 10 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 15.5 }}>Meeting Summariser</span>
            <span style={{ fontSize: 11.5, color: '#94a3b8' }}>by Carnot Research Pvt Ltd</span>
          </div>
        </Link>

        {/* Right — nav actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{
            fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none',
          }}>← Back to home</Link>

          {/* SMRS button */}
          <button
            id="btn-connect-smrs"
            onClick={onOpenSmrs}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              transition: 'all .2s ease',
              border: smrsConnected ? '1.5px solid rgba(13,148,136,0.4)' : 'none',
              background: smrsConnected
                ? 'rgba(13,148,136,0.10)'
                : hover ? '#1e293b' : '#0f172a',
              color: smrsConnected ? '#0f766e' : '#ffffff',
              transform: hover && !smrsConnected ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: hover && !smrsConnected
                ? '0 6px 16px rgba(15,23,42,0.22)'
                : smrsConnected ? 'none' : '0 2px 8px rgba(15,23,42,0.15)',
            }}
          >
            <ShieldCheck size={14} />
            {smrsConnected ? 'SMRS Connected ✓' : 'Connect to SMRS'}
          </button>
        </div>
      </div>
    </div>
  );
}
