import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Card, Label, Button, ProgressBar } from '../Card.jsx';
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
    if (!file) {
      console.warn('[AudioUpload] process() called with no file — aborting');
      return;
    }
    console.group('[AudioUpload] Process Audio');
    console.log('[AudioUpload] 1/4  file:', {
      name: file.name, sizeKB: (file.size / 1024).toFixed(1),
      type: file.type, language, isLongRecording: isLong,
    });

    setBusy(true);
    setProgress(0);
    setStatusMsg('Uploading audio…');
    setError(null);

    const t0 = performance.now();
    try {
      console.log('[AudioUpload] 2/4  POST /api/upload-audio …');
      const uploadRes = await uploadAudio(file, { language, isLongRecording: isLong });
      const t1 = performance.now();
      console.log(`[AudioUpload]        upload OK in ${(t1 - t0).toFixed(0)}ms →`, uploadRes);

      const { job_id } = uploadRes || {};
      if (!job_id) {
        throw new Error(`Backend returned no job_id. Full response: ${JSON.stringify(uploadRes)}`);
      }

      console.log(`[AudioUpload] 3/4  polling job ${job_id} …`);
      let lastStatus = '';
      const finalStatus = await pollJob(job_id, {
        onUpdate: (s) => {
          setProgress(s.progress || 0);
          setStatusMsg(s.status_message || s.status || 'Processing…');
          const summary = `${s.status || '?'} · ${s.progress || 0}% · ${s.status_message || ''}`;
          if (summary !== lastStatus) {
            console.log('[AudioUpload]        job poll:', summary);
            lastStatus = summary;
          }
        },
      });
      const t2 = performance.now();
      console.log(`[AudioUpload]        job finished in ${((t2 - t1) / 1000).toFixed(1)}s`);

      const transcriptData = finalStatus.result || finalStatus;
      const segs = transcriptData?.transcript;
      console.log('[AudioUpload] 4/4  final transcriptData:', {
        segments: Array.isArray(segs) ? segs.length : 'none',
        language: transcriptData?.language,
        hasRaw: !!transcriptData?.raw_transcription,
        hasConfidenceMetrics: !!transcriptData?.confidence_metrics,
      });

      let transcriptText = '';
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
      console.log('[AudioUpload] DONE  handed off to parent');
    } catch (e) {
      // Extract as much useful info as possible from Axios errors
      const info = {
        message: e?.message,
        code: e?.code,
        httpStatus: e?.response?.status,
        httpData: e?.response?.data,
        url: e?.config?.url,
        method: e?.config?.method,
      };
      console.error('[AudioUpload] FAILED', info, e);
      const readable = info.httpStatus
        ? `${info.httpStatus} — ${JSON.stringify(info.httpData || info.message)}`
        : (info.code === 'ECONNABORTED' ? 'Request timed out'
          : info.message || 'Audio processing failed');
      setError(readable);
    } finally {
      console.groupEnd();
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
