import React, { useState } from 'react';
import { Card, SectionTitle, Label } from '../Card.jsx';

export default function PasteText({ onChange }) {
  const [text, setText] = useState('');

  return (
    <Card>
      <SectionTitle subtitle="Paste your meeting transcript. Names/roles at the start of lines are auto-detected as participants.">
        Paste Text
      </SectionTitle>
      <Label>Meeting transcript</Label>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); onChange(e.target.value); }}
        placeholder={`Example:\n\nAlice: Let's kick off the sync…\nBob: The migration is on track.`}
        style={{
          width: '100%', minHeight: 260, padding: 14, borderRadius: 12,
          border: '1px solid #d9d5c5', background: '#fff', fontSize: 14.5,
          fontFamily: "'Inter', sans-serif", lineHeight: 1.5, outline: 'none', boxSizing: 'border-box',
          resize: 'vertical',
        }}
      />
      <div style={{ fontSize: 12.5, color: '#9a978d', marginTop: 6 }}>
        {text.length.toLocaleString()} characters
      </div>
    </Card>
  );
}
