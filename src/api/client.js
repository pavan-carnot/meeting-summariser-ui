import axios from 'axios';

// In dev, we leave baseURL empty so the Vite proxy (/api → backend) handles it.
// In production, VITE_API_URL from .env is the direct backend origin.
const BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '');

console.log('[api] baseURL:', BASE_URL || '(dev proxy /api → backend)',
            '| VITE_API_URL:', import.meta.env.VITE_API_URL,
            '| DEV:', import.meta.env.DEV);

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 300000,
});

// ── Request / response tracing ─────────────────────────────
api.interceptors.request.use((cfg) => {
  const method = (cfg.method || 'GET').toUpperCase();
  console.log(`[api] → ${method} ${cfg.baseURL || ''}${cfg.url}`);
  cfg.metadata = { start: performance.now() };
  return cfg;
});
api.interceptors.response.use(
  (res) => {
    const ms = (performance.now() - (res.config.metadata?.start || 0)).toFixed(0);
    console.log(`[api] ← ${res.status} ${res.config.url}  (${ms}ms)`);
    return res;
  },
  (err) => {
    const cfg = err.config || {};
    const ms = (performance.now() - (cfg.metadata?.start || 0)).toFixed(0);
    console.error(`[api] ✗ ${err.response?.status || err.code || 'ERR'} ${cfg.url}  (${ms}ms)`,
      { message: err.message, data: err.response?.data });
    return Promise.reject(err);
  },
);

// ── Core meeting APIs ─────────────────────────────────────
export async function getLanguages() {
  try {
    const { data } = await api.get('/api/languages');
    return data;
  } catch {
    return [
      { code: 'auto', name: 'Auto-detect' },
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ar', name: 'Arabic' },
    ];
  }
}

export async function checkHealth() {
  const { data } = await api.get('/api/health');
  return data;
}

export async function uploadAudio(file, { language, isLongRecording = false } = {}) {
  const fd = new FormData();
  fd.append('file', file);
  if (language && language !== 'auto') fd.append('language', language);
  fd.append('is_long_recording', String(isLongRecording));
  const { data } = await api.post('/api/upload-audio', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 600000,
  });
  return data;
}

export async function uploadText(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post('/api/upload-text', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function extractParticipants(transcript) {
  const { data } = await api.post('/api/extract-participants', { transcript });
  return data;
}

export async function summarize({ transcript, participants, language, isLongRecording, additionalContext }) {
  const payload = {
    transcript,
    participants: Array.isArray(participants)
      ? participants
      : String(participants || '').split(',').map((p) => p.trim()).filter(Boolean),
    language: !language || language === 'auto' ? null : language,
    is_long_recording: !!isLongRecording,
    additional_context: additionalContext || null,
  };
  const { data } = await api.post('/api/summarize', payload);
  return data;
}

export async function getJob(jobId) {
  const { data } = await api.get(`/api/job/${jobId}`, { timeout: 10000 });
  return data;
}

// Poll a job until it completes/fails. Calls onUpdate on each poll.
export async function pollJob(jobId, { intervalMs = 2000, maxRetries = 60, onUpdate } = {}) {
  return new Promise((resolve, reject) => {
    let consecutiveErrors = 0;
    const tick = async () => {
      try {
        const status = await getJob(jobId);
        consecutiveErrors = 0; // Reset error counter on successful response
        if (onUpdate) onUpdate(status);
        const s = String(status.status || '').toLowerCase();
        if (s === 'completed') return resolve(status);
        if (s === 'failed') return reject(new Error(status.error || status.status_message || `Job ${jobId} failed`));
        setTimeout(tick, intervalMs);
      } catch (err) {
        consecutiveErrors += 1;
        if (consecutiveErrors < maxRetries) {
          console.warn(`[pollJob] transient network error (${consecutiveErrors}/${maxRetries}), retrying...`, err.message);
          setTimeout(tick, intervalMs);
        } else {
          reject(new Error(`Job poll failed for ${jobId}: ${err.message}`));
        }
      }
    };
    tick();
  });
}

// ── Follow-up email APIs ─────────────────────────────────
export async function smtpStatus() {
  try {
    const { data } = await api.get('/api/email/smtp-status');
    return data;
  } catch {
    return { configured: false, reason: 'Could not reach server' };
  }
}

export async function draftEmails({ actionItems, meetingSummary, senderName }) {
  const { data } = await api.post('/api/email/draft', {
    action_items: actionItems,
    meeting_summary: meetingSummary,
    sender_name: senderName || 'Meeting Organiser',
  });
  return data;
}

export async function sendEmail({ toAddress, body, subject = 'Action Items from Our Recent Meeting' }) {
  const { data } = await api.post('/api/email/send', { to_address: toAddress, body, subject });
  return data;
}

export async function sendAllEmails({ roster, drafts, meetingTitle = 'Our Recent Meeting' }) {
  const { data } = await api.post('/api/email/send-all', {
    roster, drafts, meeting_title: meetingTitle,
  });
  return data;
}

export async function prefillContacts(assignees) {
  try {
    const { data } = await api.post('/api/contacts/prefill', { assignees });
    return data;
  } catch {
    return { roster: {} };
  }
}

export async function saveContacts(mapping) {
  try {
    const { data } = await api.post('/api/contacts/save', { mapping });
    return data;
  } catch (err) {
    console.warn('saveContacts failed:', err);
  }
}
