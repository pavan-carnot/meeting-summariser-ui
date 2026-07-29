import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Card, SectionTitle, Label, Button, ProgressBar } from '../Card.jsx';
import { uploadAudio, pollJob } from '../../api/client.js';

export default function AudioUpload({ languages, onComplete }) {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('auto');
  const [isLong, setIsLong] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const pickFile = (f) => {
    setError(null);
    setFile(f || null);
  };

  const process = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    setStatusMsg('Uploading audio…');
    setError(null);
    try {
      const { job_id } = await uploadAudio(file, { language, isLongRecording: isLong });
      const finalStatus = await pollJob(job_id, {
        onUpdate: (s) => {
          setProgress(s.progress || 0);
          setStatusMsg(s.status_message || s.status || 'Processing…');
        },
      });
      const transcriptData = finalStatus.result || finalStatus;
      // Build a flat transcript string like Streamlit does:
      let transcriptText = '';
      const segs = transcriptData?.transcript;
      if (Array.isArray(segs)) {
        transcriptText = segs
          .map((seg) => `[${seg.start_time_formatted || ''}] Speaker ${seg.speaker || '?'}: ${seg.text || ''}`)
          .join('\n');
      }
      onComplete({
        transcript: transcriptText,
        transcriptData,
        language: transcriptData?.language || (language !== 'auto' ? language : null),
        audioBlob: file,
      });
    } catch (e) {
      console.error(e);
      setError(e.message || 'Audio processing failed');
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  };

  return (
    <Card>
      <SectionTitle subtitle="Upload a WAV, MP3, or M4A recording. The system will transcribe it and identify speakers automatically.">
        Upload Audio
      </SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <Label>Audio language</Label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={selectStyle}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#3a3833' }}>
            <input type="checkbox" checked={isLong} onChange={(e) => setIsLong(e.target.checked)} />
            This is a long recording (&gt;15 min)
          </label>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#00C5B0' : '#d9d5c5'}`,
          background: dragOver ? 'rgba(0,197,176,0.05)' : '#faf9f4',
          borderRadius: 14, padding: '30px 20px', textAlign: 'center', cursor: 'pointer',
          transition: 'border-color .15s ease, background .15s ease',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".wav,.mp3,.m4a,audio/*"
          hidden
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        <Upload size={26} color="#66645c" style={{ margin: '0 auto 10px' }} />
        <div style={{ fontWeight: 600, color: '#111' }}>
          {file ? file.name : 'Drop audio here, or click to browse'}
        </div>
        <div style={{ fontSize: 12.5, color: '#9a978d', marginTop: 4 }}>
          WAV · MP3 · M4A · up to a few hundred MB
        </div>
        {file && (
          <button
            onClick={(e) => { e.stopPropagation(); pickFile(null); }}
            style={{
              marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#66645c', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
          ><X size={12} /> Remove file</button>
        )}
      </div>

      {busy && (
        <div style={{ marginTop: 16 }}>
          <ProgressBar value={progress} label={statusMsg} />
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 12, padding: '10px 14px', background: '#fef2f2',
          border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 10, fontSize: 13.5,
        }}>{error}</div>
      )}

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={process} disabled={!file || busy}>
          {busy ? 'Processing…' : 'Process Audio'}
        </Button>
      </div>
    </Card>
  );
}

const selectStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  border: '1px solid #d9d5c5', background: '#fff', fontSize: 14.5, color: '#111',
  outline: 'none',
};
