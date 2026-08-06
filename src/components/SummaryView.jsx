import React, { useState } from 'react';
import { Download, FileJson, FileText, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from './Card.jsx';

const priorityColor = (p) => {
  const key = (p || 'medium').toLowerCase();
  if (key === 'high') return '#ef4444';
  if (key === 'low') return '#10b981';
  return '#f59e0b';
};

function downloadBlob(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function SummaryView({ summary, transcript }) {
  const [tab, setTab] = useState('summary');
  const [expandedAction, setExpandedAction] = useState(null);
  const [expandedSpeaker, setExpandedSpeaker] = useState(null);

  if (!summary) return null;

  const meetingSummary = summary.meeting_summary || {};
  const actionItems = summary.action_items || [];
  const speakerSummaries = summary.speaker_summaries || {};
  const metadata = summary.metadata || {};

  const buildFullReport = () => {
    const lines = [];
    lines.push('========================================');
    lines.push('           MEETING MINUTES REPORT       ');
    lines.push('========================================');
    lines.push(`Language: ${metadata.language_name || metadata.language || 'Unknown'}`);
    lines.push('\n----------------------------------------\n1. MEETING SUMMARY\n----------------------------------------');
    lines.push(meetingSummary.summary || 'No summary available.');
    lines.push('\n----------------------------------------\n2. KEY POINTS\n----------------------------------------');
    (meetingSummary.key_points || []).forEach((k) => lines.push(`- ${k}`));
    lines.push('\n----------------------------------------\n3. DECISIONS MADE\n----------------------------------------');
    (meetingSummary.decisions || []).forEach((d) => lines.push(`- ${d}`));
    lines.push('\n----------------------------------------\n4. ACTION ITEMS\n----------------------------------------');
    actionItems.forEach((it) => {
      lines.push(`📌 Action: ${it.action || ''}`);
      lines.push(`   Assignee: ${it.assignee || 'Unassigned'}`);
      lines.push(`   Due Date: ${it.due_date || 'Not specified'}`);
      lines.push(`   Priority: ${(it.priority || 'medium').toUpperCase()}`);
      lines.push('');
    });
    if (Object.keys(speakerSummaries).length) {
      lines.push('\n----------------------------------------\n5. SPEAKER SUMMARIES\n----------------------------------------');
      Object.entries(speakerSummaries).forEach(([name, s]) => {
        lines.push(`👤 ${name}:`);
        lines.push(`   Brief: ${s.brief_summary || ''}`);
        (s.key_contributions || []).forEach((c) => lines.push(`     - ${c}`));
        lines.push('');
      });
    }
    lines.push('\n----------------------------------------\n6. VERBATIM TRANSCRIPT\n----------------------------------------');
    lines.push(transcript || '');
    return lines.join('\n');
  };

  return (
    <Card>
      {/* Download bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="ghost" onClick={() => downloadBlob('meeting_summary.json', JSON.stringify(summary, null, 2), 'application/json')}>
            <FileJson size={14} style={{ display: 'inline-block', marginRight: 6 }} />
            JSON
          </Button>
          <Button variant="ghost" onClick={() => downloadBlob('transcript.txt', transcript || '', 'text/plain')} disabled={!transcript}>
            <FileText size={14} style={{ display: 'inline-block', marginRight: 6 }} />
            Transcript
          </Button>
          <Button variant="ghost" onClick={() => downloadBlob('meeting_report.txt', buildFullReport(), 'text/plain')}>
            <Download size={14} style={{ display: 'inline-block', marginRight: 6 }} />
            Full report
          </Button>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 5, borderRadius: 12, marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'summary', label: 'Meeting Summary' },
          { id: 'speakers', label: 'Speaker Summaries' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? '#111' : '#64748b',
              boxShadow: tab === t.id ? '0 1px 4px rgba(17,17,17,0.08)' : 'none',
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h4 style={sectionHeadStyle}>Summary</h4>
            <p style={{ margin: 0, color: '#333', lineHeight: 1.6, fontSize: 14.5 }}>
              {meetingSummary.summary || <em style={{ color: '#94a3b8' }}>No summary available.</em>}
            </p>

            <SectionList
              title="Key Points"
              accent="#0d9488"
              items={meetingSummary.key_points || []}
              marker="dot"
              emptyLabel="No key points captured."
            />

            <SectionList
              title="Decisions"
              accent="#0d9488"
              items={meetingSummary.decisions || []}
              marker="check"
              emptyLabel="No decisions were recorded."
            />

            {metadata && Object.keys(metadata).length > 0 && (
              <div style={{
                marginTop: 24, padding: 14, borderRadius: 10, background: '#f8fafc',
                border: '1px solid #e2e8f0', fontSize: 13, color: '#64748b',
              }}>
                <div><strong>Language:</strong> {metadata.language_name || metadata.language || 'Unknown'}</div>
                <div><strong>Participants:</strong> {metadata.participant_count ?? '—'}</div>
                {metadata.is_long_recording !== undefined && (
                  <div><strong>Long recording:</strong> {metadata.is_long_recording ? 'Yes' : 'No'}</div>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 style={sectionHeadStyle}>Action Items ({actionItems.length})</h4>
            {actionItems.length === 0 && <div style={emptyStyle}>No action items identified.</div>}
            {actionItems.map((item, i) => {
              const open = expandedAction === i;
              return (
                <div key={i} style={{
                  border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 10, background: '#fff',
                }}>
                  <button
                    onClick={() => setExpandedAction(open ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, color: '#111', fontSize: 14 }}>
                      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      📌 {item.action || 'Untitled action'}
                    </span>
                    <Badge color={priorityColor(item.priority)}>{(item.priority || 'medium').toUpperCase()}</Badge>
                  </button>
                  {open && (
                    <div style={{ padding: '4px 14px 14px 40px', fontSize: 13.5, color: '#333' }}>
                      <div><strong>Assignee:</strong> {item.assignee || 'Unassigned'}</div>
                      <div><strong>Due date:</strong> {item.due_date || 'Not specified'}</div>
                      {item.notes && <div style={{ marginTop: 4 }}><strong>Notes:</strong> {item.notes}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'speakers' && (
        <div>
          {Object.keys(speakerSummaries).length === 0 && (
            <div style={emptyStyle}>No speaker summaries available.</div>
          )}
          {Object.entries(speakerSummaries).map(([speaker, s], i) => {
            const open = expandedSpeaker === i;
            return (
              <div key={speaker} style={{
                border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 10, background: '#fff',
              }}>
                <button
                  onClick={() => setExpandedSpeaker(open ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left', fontSize: 15, fontWeight: 700, color: '#111',
                  }}
                >
                  {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  🗣️ {speaker}
                </button>
                {open && (
                  <div style={{ padding: '4px 20px 18px 42px', fontSize: 14, color: '#333' }}>
                    <div style={{ marginBottom: 10 }}>{s.brief_summary || <em>No summary.</em>}</div>
                    {s.key_contributions?.length > 0 && (
                      <>
                        <div style={subheadStyle}>Key contributions</div>
                        <ul style={ulStyle}>{s.key_contributions.map((c, j) => <li key={j}>{c}</li>)}</ul>
                      </>
                    )}
                    {s.action_items?.length > 0 && (
                      <>
                        <div style={subheadStyle}>Action items</div>
                        <ul style={ulStyle}>{s.action_items.map((c, j) => <li key={j}>{c}</li>)}</ul>
                      </>
                    )}
                    {s.questions_raised?.length > 0 && (
                      <>
                        <div style={subheadStyle}>Questions raised</div>
                        <ul style={ulStyle}>{s.questions_raised.map((c, j) => <li key={j}>{c}</li>)}</ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// Minimal list section — clean typography, subtle marker per item.
// The marker shape (dot vs check) is the only differentiator between
// "Key Points" (topics discussed) and "Decisions" (things resolved).
function SectionList({ title, accent, items, marker, emptyLabel }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{
        fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 12,
        letterSpacing: '.1em', textTransform: 'uppercase',
        color: '#94a3b8', marginBottom: 12,
      }}>{title}</div>

      {items.length === 0 && <div style={emptyStyle}>{emptyLabel}</div>}

      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item, i) => (
          <li key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '6px 0', fontSize: 14, lineHeight: 1.6, color: '#0f172a',
          }}>
            {marker === 'check' ? (
              <CheckCircle2
                size={15}
                color={accent}
                strokeWidth={2.25}
                style={{ flexShrink: 0, marginTop: 3 }}
              />
            ) : (
              <span style={{
                flexShrink: 0, marginTop: 9, width: 5, height: 5,
                borderRadius: '50%', background: accent,
              }} />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const sectionHeadStyle = {
  fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: 15,
  color: '#0f172a', margin: '20px 0 8px', textTransform: 'uppercase',
  letterSpacing: '.05em',
};
const subheadStyle = { ...sectionHeadStyle, fontSize: 12.5, margin: '12px 0 4px', color: '#64748b' };
const ulStyle = { margin: '4px 0 0 20px', padding: 0, color: '#333', lineHeight: 1.65, fontSize: 14 };
const emptyStyle = { color: '#94a3b8', fontStyle: 'italic', fontSize: 13.5 };
