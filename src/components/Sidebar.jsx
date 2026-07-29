import React from 'react';

export default function Sidebar() {
  return (
    <aside style={{
      background: '#fff', border: '1px solid #e5e2d6', borderRadius: 16,
      padding: 22, fontSize: 14, color: '#3a3833', lineHeight: 1.55,
    }}>
      <SB title="Tips for best results">
        <li>Use clear recordings with minimal background noise.</li>
        <li>For non-English audio, pick the language for better accuracy.</li>
        <li>For text transcripts, use <code>Alice: hello</code> style prefixes.</li>
        <li>Turn on <em>long recording</em> for meetings over 15 minutes.</li>
      </SB>
      <SB title="Supported file types">
        <li>Audio: WAV, MP3, M4A</li>
        <li>Text: TXT</li>
      </SB>
      <SB title="Supported languages">
        <li>English, Hindi, Spanish, French, German, Chinese, Japanese, Russian, Arabic — and more.</li>
      </SB>
      <SB title="About">
        <li>LangGraph + local LLMs + Whisper transcription + speaker diarization.</li>
        <li>Everything runs on your own infrastructure.</li>
      </SB>
    </aside>
  );
}

function SB({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 13,
        letterSpacing: '.05em', color: '#0A0F1E', textTransform: 'uppercase',
        marginBottom: 8,
      }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>{children}</ul>
    </div>
  );
}
