import React from 'react';
import { Upload, Mic, FileText, FileUp } from 'lucide-react';

const METHODS = [
  { id: 'audio', label: 'Upload Audio', icon: Upload },
  { id: 'realtime', label: 'Real-Time Audio', icon: Mic },
  { id: 'paste', label: 'Paste Text', icon: FileText },
  { id: 'text', label: 'Upload Text', icon: FileUp },
];

export default function InputMethodTabs({ value, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: 8, background: '#f4f3ee', padding: 6,
      borderRadius: 14, border: '1px solid #e5e2d6',
    }}>
      {METHODS.map((m) => {
        const active = value === m.id;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: active ? '#111111' : 'transparent',
              color: active ? '#ffffff' : '#66645c',
              fontSize: 14.5, fontWeight: 600,
              transition: 'background .15s ease, color .15s ease',
            }}
          >
            <Icon size={16} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
