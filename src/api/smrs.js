// SMRS API helpers — all calls go to /api/smrs/* on the Meeting Summarizer backend
import axios from 'axios';

const BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '');

const smrsApi = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/** Upload RSA private key .pem file */
export async function smrsUploadKey(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await smrsApi.post('/api/smrs/upload-key', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Clear uploaded RSA key from backend memory */
export async function smrsClearKey() {
  const { data } = await smrsApi.post('/api/smrs/clear-key');
  return data;
}

/** TCP scan to detect device at ip:port */
export async function smrsScanDevice(ip, port = 22) {
  const { data } = await smrsApi.post('/api/smrs/scan-device', { ip, port });
  return data;
}

/** SSH connect to device */
export async function smrsConnectSsh(ip, user, password, recDir = null) {
  const { data } = await smrsApi.post('/api/smrs/connect-ssh', {
    ip, user, password, rec_dir: recDir,
  });
  return data;
}

/** Disconnect from device */
export async function smrsDisconnect() {
  const { data } = await smrsApi.post('/api/smrs/disconnect');
  return data;
}

/** Get current SSH auth state */
export async function smrsSshStatus() {
  const { data } = await smrsApi.get('/api/smrs/ssh-status');
  return data;
}

/** Run ingest: download, decrypt, wipe from device */
export async function smrsProcessIngest() {
  const { data } = await smrsApi.post('/api/smrs/process-ingest', {}, { timeout: 120000 });
  return data;
}

/** List all decrypted .wav files */
export async function smrsListFiles() {
  const { data } = await smrsApi.get('/api/smrs/audio-files');
  return data.files || [];
}

/** Download decrypted .wav file as blob */
export async function smrsDownloadAudioBlob(filename) {
  const { data } = await smrsApi.get(`/api/smrs/audio-files/${encodeURIComponent(filename)}`, {
    responseType: 'blob',
  });
  return data;
}

/** Load a decrypted file into the Meeting Summarizer pipeline */
export async function smrsLoadToPipeline(filename, language = null, isLongRecording = false) {
  const { data } = await smrsApi.post('/api/smrs/load-to-pipeline', {
    filename,
    language,
    is_long_recording: isLongRecording,
  });
  return data;
}
