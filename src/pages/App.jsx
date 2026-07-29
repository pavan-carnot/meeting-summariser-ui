import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InputMethodTabs from '../components/InputMethodTabs.jsx';
import AudioUpload from '../components/inputs/AudioUpload.jsx';
import LiveRecording from '../components/inputs/LiveRecording.jsx';
import PasteText from '../components/inputs/PasteText.jsx';
import UploadText from '../components/inputs/UploadText.jsx';
import ParticipantsContext from '../components/ParticipantsContext.jsx';
import TranscriptPreview from '../components/TranscriptPreview.jsx';
import SummaryView from '../components/SummaryView.jsx';
import FollowUpEmails from '../components/FollowUpEmails.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { Card, SectionTitle, ProgressBar } from '../components/Card.jsx';
import {
  getLanguages, extractParticipants, summarize, pollJob,
} from '../api/client.js';

export default function App() {
  const [method, setMethod] = useState('audio');
  const [languages, setLanguages] = useState([{ code: 'auto', name: 'Auto-detect' }]);

  // Transcript state (populated by any input method)
  const [transcript, setTranscript] = useState('');
  const [transcriptData, setTranscriptData] = useState(null);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isLongRecording, setIsLongRecording] = useState(false);

  // Audio blob for playback in TranscriptPreview
  const [audioBlob, setAudioBlob] = useState(null);
  const audioUrl = useMemo(() => (audioBlob ? URL.createObjectURL(audioBlob) : null), [audioBlob]);
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const [participants, setParticipants] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  const [summaryBusy, setSummaryBusy] = useState(false);
  const [summaryProgress, setSummaryProgress] = useState(0);
  const [summaryStatus, setSummaryStatus] = useState('');
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => { getLanguages().then(setLanguages); }, []);

  const handleTranscriptFromAudio = ({ transcript: t, transcriptData: td, language, audioBlob: blob }) => {
    setTranscript(t);
    setTranscriptData(td);
    setAudioBlob(blob || null);
    if (language) setDetectedLanguage(language);
    // Auto-fill participants from speaker segments
    if (td?.transcript && Array.isArray(td.transcript)) {
      const speakers = new Set();
      td.transcript.forEach((seg) => {
        if (seg.speaker !== undefined) speakers.add(`Speaker ${seg.speaker}`);
      });
      if (speakers.size) setParticipants([...speakers].sort().join(', '));
    }
  };

  const handleTranscriptFromText = async (text) => {
    setTranscript(text);
    setTranscriptData(null);
    setAudioBlob(null);
    // Try to auto-extract participants
    if (text?.trim()) {
      try {
        const detected = await extractParticipants(text);
        if (detected?.length) setParticipants(detected.join(', '));
      } catch { /* non-fatal */ }
    }
  };

  const handleTextLoaded = ({ transcript: t, participants: p }) => {
    setTranscript(t);
    setTranscriptData(null);
    setAudioBlob(null);
    if (p?.length) setParticipants(p.join(', '));
  };

  // Called from TranscriptPreview when user saves edits (speaker renames + text edits)
  const handleTranscriptEdit = (flatText, updatedData) => {
    setTranscript(flatText);
    setTranscriptData(updatedData);
    if (Array.isArray(updatedData?.transcript)) {
      const speakers = new Set();
      updatedData.transcript.forEach((seg) => {
        if (seg.speaker !== undefined) speakers.add(String(seg.speaker).match(/^Speaker /) ? String(seg.speaker) : `Speaker ${seg.speaker}`);
      });
      if (speakers.size) setParticipants([...speakers].sort().join(', '));
    }
  };

  const canSubmit = !!transcript.trim() && !!participants.trim();

  const doSummarize = async () => {
    if (!canSubmit) return;
    setSummaryBusy(true);
    setSummaryError(null);
    setSummary(null);
    setSummaryProgress(0);
    setSummaryStatus('Submitting…');
    try {
      const { job_id } = await summarize({
        transcript,
        participants,
        language: detectedLanguage || null,
        isLongRecording,
        additionalContext,
      });
      const final = await pollJob(job_id, {
        onUpdate: (s) => {
          setSummaryProgress(s.progress || 0);
          setSummaryStatus(s.status_message || s.status || 'Processing…');
        },
      });
      const payload = final.result || final;
      setSummary(payload);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (e) {
      setSummaryError(e.message || 'Summary generation failed');
    } finally {
      setSummaryBusy(false);
    }
  };

  return (
    <div style={{ background: '#efeee8', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Page header */}
      <div style={{
        maxWidth: 1260, margin: '0 auto', padding: '32px 24px 16px',
      }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#66645c', fontSize: 13.5, fontWeight: 500,
            textDecoration: 'none', marginBottom: 14,
            padding: '6px 10px 6px 6px', borderRadius: 8,
            transition: 'background .15s ease, color .15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(17,17,17,0.04)'; e.currentTarget.style.color = '#111'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#66645c'; }}
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
        <h1 style={{
          fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 34,
          letterSpacing: '-0.02em', margin: 0, color: '#0A0F1E',
        }}>Meeting Summariser</h1>
        <p style={{ color: '#66645c', fontSize: 15, margin: '6px 0 0' }}>
          Upload audio, record live, or paste a transcript — get a summary, action items, and per-speaker breakdown.
        </p>
      </div>

      <div style={{
        maxWidth: 1260, margin: '0 auto', padding: '16px 24px',
        display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 24,
      }}>
        {/* MAIN COLUMN */}
        <div>
          {/* Input method selector */}
          <div style={{ marginBottom: 20 }}>
            <InputMethodTabs value={method} onChange={setMethod} />
          </div>

          {/* Selected input */}
          {method === 'audio' && (
            <AudioUpload languages={languages} onComplete={handleTranscriptFromAudio} />
          )}
          {method === 'realtime' && (
            <LiveRecording languages={languages} onComplete={handleTranscriptFromAudio} />
          )}
          {method === 'paste' && (
            <PasteText onChange={handleTranscriptFromText} />
          )}
          {method === 'text' && (
            <UploadText onLoaded={handleTextLoaded} />
          )}

          {/* Transcript: rich playback+editor when we have structured data,
              simple text box otherwise (paste / text upload) */}
          {transcriptData?.transcript?.length > 0 ? (
            <div style={{ marginTop: 16 }}>
              <TranscriptPreview
                transcriptData={transcriptData}
                audioSrc={audioUrl}
                onTranscriptChange={handleTranscriptEdit}
              />
            </div>
          ) : transcript ? (
            <div style={{ marginTop: 16 }}>
              <Card>
                <SectionTitle subtitle="Edit directly — participants and generated summary use this text.">
                  Transcript ({transcript.length.toLocaleString()} chars)
                </SectionTitle>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  style={{
                    width: '100%', minHeight: 260, padding: 12, borderRadius: 10,
                    border: '1px solid #d9d5c5', background: '#faf9f4',
                    fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 12.5,
                    lineHeight: 1.55, whiteSpace: 'pre-wrap', color: '#333',
                    resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </Card>
            </div>
          ) : null}

          {/* Participants + Context */}
          <div style={{ marginTop: 16 }}>
            <ParticipantsContext
              participants={participants}
              onParticipantsChange={setParticipants}
              context={additionalContext}
              onContextChange={setAdditionalContext}
              onSubmit={doSummarize}
              canSubmit={canSubmit}
              busy={summaryBusy}
            />
          </div>

          {/* Long recording toggle for the summary path */}
          <div style={{ marginTop: 6, textAlign: 'right', fontSize: 13, color: '#66645c' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isLongRecording}
                onChange={(e) => setIsLongRecording(e.target.checked)}
                style={{ marginRight: 6 }}
              />
              Use hierarchical summarization (long meeting)
            </label>
          </div>

          {/* Summary progress + errors */}
          {summaryBusy && (
            <div style={{ marginTop: 16 }}>
              <Card><ProgressBar value={summaryProgress} label={summaryStatus} /></Card>
            </div>
          )}
          {summaryError && (
            <div style={{
              marginTop: 12, padding: '12px 14px', background: '#fef2f2',
              border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 10, fontSize: 13.5,
            }}>{summaryError}</div>
          )}

          {/* Results */}
          {summary && (
            <div ref={resultsRef} style={{ marginTop: 24 }}>
              <SummaryView summary={summary} transcript={transcript} />
              <FollowUpEmails summary={summary} />
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <Sidebar />
      </div>
    </div>
  );
}
