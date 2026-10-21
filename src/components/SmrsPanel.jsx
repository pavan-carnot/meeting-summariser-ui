import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  X, ShieldCheck, Upload, Wifi, WifiOff, Terminal, Folder,
  CheckCircle, AlertCircle, Loader2, Play, Zap, Lock,
  Download, RefreshCw, Eye, EyeOff, LogOut,
} from 'lucide-react';
import {
  smrsUploadKey, smrsClearKey, smrsScanDevice, smrsConnectSsh, smrsDisconnect,
  smrsSshStatus, smrsProcessIngest, smrsListFiles, smrsDownloadAudioBlob,
} from '../api/smrs.js';

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, label }) {
  const colours = {
    idle: { dot: '#94a3b8', bg: 'rgba(148,163,184,0.10)', text: '#64748b' },
    connecting: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.10)', text: '#b45309' },
    connected: { dot: '#0d9488', bg: 'rgba(13,148,136,0.12)', text: '#0f766e' },
    error: { dot: '#dc2626', bg: 'rgba(220,38,38,0.10)', text: '#b91c1c' },
  };
  const c = colours[status] || colours.idle;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: c.bg, color: c.text,
      borderRadius: 999, padding: '4px 10px',
      fontSize: 12, fontWeight: 700, letterSpacing: '.03em',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: c.dot, flexShrink: 0,
        animation: status === 'connecting' ? 'smrsPulse 1.2s ease infinite' : 'none',
      }} />
      {label}
    </span>
  );
}

// ── Step header ────────────────────────────────────────────────────────────────
function StepHeader({ num, title, done, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: done ? '#0d9488' : '#0f172a',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, fontFamily: "'Manrope',sans-serif",
        }}>
          {done ? <CheckCircle size={14} /> : num}
        </div>
        <span style={{
          fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 14,
          color: '#0f172a', letterSpacing: '-0.01em',
        }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function SmrsCard({ children, style = {} }) {
  return (
    <div style={{
      background: '#f8fafc', border: '1px solid #e2e8f0',
      borderRadius: 14, padding: '20px 22px', marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────────
function SmrsInput({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 700,
          letterSpacing: '.1em', color: '#64748b',
          textTransform: 'uppercase', marginBottom: 5,
        }}>{label}</label>
      )}
      <input style={{
        width: '100%', padding: '9px 12px',
        border: '1px solid #e2e8f0', borderRadius: 9,
        background: '#fff', color: '#0f172a', fontSize: 13.5,
        outline: 'none', boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
      }} {...props} />
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
function SmrsBtn({ children, variant = 'primary', loading, disabled, style = {}, ...props }) {
  const base = {
    primary: { background: '#0f172a', color: '#fff', border: 'none' },
    teal: { background: '#0d9488', color: '#fff', border: 'none' },
    outline: { background: 'transparent', color: '#0f172a', border: '1.5px solid #e2e8f0' },
    danger: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
  };
  const v = base[variant] || base.primary;
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '9px 16px', borderRadius: 9,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontSize: 13, fontWeight: 700,
        opacity: disabled || loading ? 0.6 : 1,
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'opacity .15s',
        ...v, ...style,
      }}
      {...props}
    >
      {loading ? <Loader2 size={14} style={{ animation: 'smrsSpin 1s linear infinite' }} /> : null}
      {children}
    </button>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function SmrsPanel({ open, onClose, onLoadFile, onConnectionChange }) {
  // ── Step 1: RSA Key
  const [keyStatus, setKeyStatus] = useState('idle');
  const [keyName, setKeyName] = useState('');
  const [keyMsg, setKeyMsg] = useState('');
  const keyInputRef = useRef();

  // ── Step 2: Connection
  const [connMode, setConnMode] = useState('ssh');
  const [sshIp, setSshIp] = useState('');
  const [sshUser, setSshUser] = useState('kavach');
  const [sshPass, setSshPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [scanIp, setScanIp] = useState('');
  const [connStatus, setConnStatus] = useState('idle');
  const [connMsg, setConnMsg] = useState('');
  const [disconnecting, setDisconnecting] = useState(false);

  // ── Green connection success pop-up bar (fades after 1-2s)
  const [connSuccessVisible, setConnSuccessVisible] = useState(false);
  const [connSuccessMsg, setConnSuccessMsg] = useState('Connection successful');
  const successTimerRef = useRef(null);

  const triggerSuccessPopup = (msg = 'Connection successful') => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    setConnSuccessMsg(msg);
    setConnSuccessVisible(true);
    // Auto-fades after ~1.8 seconds
    successTimerRef.current = setTimeout(() => {
      setConnSuccessVisible(false);
    }, 1800);
  };

  // ── Step 3: Ingest
  const [ingestBusy, setIngestBusy] = useState(false);
  const [termLines, setTermLines] = useState([
    { type: 'sys', text: '[SYSTEM] SMRS engine ready. Upload key and connect device to begin.' },
  ]);
  const termRef = useRef();

  // ── Step 4: Library
  const [audioFiles, setAudioFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingFile, setLoadingFile] = useState(null);

  const appendTerm = useCallback((text, type = 'sys') => {
    setTermLines(prev => [...prev, { type, text }]);
    setTimeout(() => {
      if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
    }, 50);
  }, []);

  const refreshFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      const files = await smrsListFiles();
      setAudioFiles(files);
    } catch { /* silent */ }
    finally { setLoadingFiles(false); }
  }, []);

  // Sync state on open
  useEffect(() => {
    if (open) {
      refreshFiles();
      smrsSshStatus().then(status => {
        if (status?.authenticated) {
          setConnStatus('connected');
          if (status.ip) setSshIp(status.ip);
          if (status.user) setSshUser(status.user);
          onConnectionChange?.(true);
        }
        if (status?.has_key) {
          setKeyStatus('loaded');
          setKeyName(status.key_name || 'key.pem');
        }
      }).catch(() => { });
    }
  }, [open, refreshFiles, onConnectionChange]);

  // ── Disconnect Device — disconnects and securely wipes private key
  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await smrsDisconnect();
    } catch (e) {
      console.warn('Disconnect call error:', e);
    } finally {
      setConnStatus('idle');
      setConnMsg('');
      setSshPass('');
      // Wipe key from frontend state and memory for security
      setKeyStatus('idle');
      setKeyName('');
      setKeyMsg('');
      if (keyInputRef.current) keyInputRef.current.value = '';
      setDisconnecting(false);
      onConnectionChange?.(false);
      appendTerm('🔌 Disconnected from device.', 'sys');
      appendTerm('🔑 Key cleared from memory for security.', 'sys');
    }
  };

  // ── Clear key manually
  const handleClearKey = async () => {
    try {
      await smrsClearKey();
    } catch (e) {
      console.warn('Clear key error:', e);
    } finally {
      setKeyStatus('idle');
      setKeyName('');
      setKeyMsg('');
      if (keyInputRef.current) keyInputRef.current.value = '';
      appendTerm('🔑 key removed.', 'sys');
    }
  };

  // ── Key upload
  const handleKeyFile = async (file) => {
    if (!file) return;
    setKeyStatus('uploading');
    setKeyMsg('');
    try {
      const res = await smrsUploadKey(file);
      if (res.success) {
        setKeyStatus('loaded');
        setKeyName(res.key_name);
        setKeyMsg(res.message);
        appendTerm(`🔑 Key loaded: ${res.key_name}`, 'success');
      } else {
        setKeyStatus('error');
        setKeyMsg(res.message || 'Key upload failed');
        appendTerm(`❌ Key upload failed: ${res.message}`, 'error');
      }
    } catch (e) {
      setKeyStatus('error');
      setKeyMsg(e.response?.data?.detail || e.message);
      appendTerm(`❌ Key upload error: ${e.message}`, 'error');
    }
  };

  // ── SSH connect
  const handleSshConnect = async () => {
    const ip = sshIp.trim();
    if (!ip) { setConnMsg('Enter an IP address.'); return; }
    if (!sshPass) { setConnMsg('Enter SSH password.'); return; }
    setConnStatus('connecting');
    setConnMsg('');
    appendTerm(`🔌 Connecting via SSH to ${sshUser}@${ip}...`, 'sys');
    try {
      const res = await smrsConnectSsh(ip, sshUser, sshPass);
      if (res.success) {
        setConnStatus('connected');
        setConnMsg(res.message);
        appendTerm(`✅ ${res.message}`, 'success');
        onConnectionChange?.(true);
        triggerSuccessPopup('Connection successful');
      } else {
        setConnStatus('error');
        setConnMsg(res.message);
        appendTerm(`❌ ${res.message}`, 'error');
      }
    } catch (e) {
      setConnStatus('error');
      setConnMsg(e.response?.data?.detail || e.message);
      appendTerm(`❌ SSH error: ${e.message}`, 'error');
    }
  };

  // ── Scan connect
  const handleScan = async () => {
    const ip = scanIp.trim();
    if (!ip) { setConnMsg('Enter a target IP address.'); return; }
    setConnStatus('connecting');
    setConnMsg('');
    appendTerm(`🔍 Scanning ${ip}:22 for device...`, 'sys');
    try {
      const res = await smrsScanDevice(ip);
      if (res.detected) {
        setConnStatus('connected');
        setConnMsg(res.message);
        setSshIp(ip);
        appendTerm(`✅ ${res.message}`, 'success');
        onConnectionChange?.(true);
        triggerSuccessPopup('Device connected successfully');
      } else {
        setConnStatus('error');
        setConnMsg(res.message);
        appendTerm(`⚠️ ${res.message}`, 'error');
      }
    } catch (e) {
      setConnStatus('error');
      setConnMsg(e.message);
      appendTerm(`❌ Scan error: ${e.message}`, 'error');
    }
  };

  // ── Ingest
  const handleIngest = async () => {
    if (keyStatus !== 'loaded') {
      appendTerm('⚠️ Upload key in Step 1 first.', 'error'); return;
    }
    if (connStatus !== 'connected') {
      appendTerm('⚠️ Connect to device in Step 2 first.', 'error'); return;
    }
    setIngestBusy(true);
    appendTerm('══════════════════════════════════', 'sys');
    appendTerm('Initiating SMRS ingest — Decrypting audio files...', 'step');
    try {
      const res = await smrsProcessIngest();
      (res.logs || []).forEach(line => {
        let type = 'sys';
        if (line.includes('✅') || line.includes('✨')) type = 'success';
        if (line.includes('❌') || line.includes('Error')) type = 'error';
        if (line.includes('📡') || line.includes('📥') || line.includes('🔓') || line.includes('🧹')) type = 'step';
        appendTerm(line, type);
      });
      if (res.success) {
        appendTerm(`✨ Done — ${res.decrypted_count} file(s) decrypted.`, 'success');
        await refreshFiles();
      } else {
        appendTerm('❌ Ingest failed.', 'error');
      }
    } catch (e) {
      appendTerm(`❌ ${e.response?.data?.detail || e.message}`, 'error');
    } finally {
      setIngestBusy(false);
    }
  };

  // ── Load into summarizer: stage wav file into AudioUpload, close sidebar, NO auto-processing
  const handleLoad = async (fileInfo) => {
    setLoadingFile(fileInfo.name);
    appendTerm(`⏳ Staging ${fileInfo.name} for Meeting Summarizer...`, 'step');
    try {
      const blob = await smrsDownloadAudioBlob(fileInfo.name);
      // Create proper File object for AudioUpload
      const wavFile = new File([blob], fileInfo.name, { type: 'audio/wav' });
      wavFile._smrs = true;
      appendTerm(`✅ ${fileInfo.name} loaded into upload dropzone.`, 'success');
      if (onLoadFile) {
        onLoadFile(wavFile);
      }
      onClose();
    } catch (e) {
      appendTerm(`❌ Could not fetch file: ${e.message}`, 'error');
    } finally {
      setLoadingFile(null);
    }
  };

  const termColor = { sys: '#94a3b8', success: '#0d9488', error: '#ef4444', step: '#f8fafc' };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
          zIndex: 49, backdropFilter: 'blur(2px)',
          animation: 'smrsFadeIn .2s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(540px, 100vw)', background: '#ffffff',
        zIndex: 50, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(15,23,42,0.18)',
        animation: 'smrsSlideIn .28s cubic-bezier(0.22,1,0.36,1)',
        overflowY: 'auto',
      }}>

        {/* ── Top Header ──────────────────────────────────────────────── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: '#0f172a', padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(13,148,136,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck size={18} color="#0d9488" />
            </div>
            <div>
              <div style={{
                fontFamily: "'Manrope',sans-serif", fontWeight: 800,
                fontSize: 15.5, color: '#f8fafc', letterSpacing: '-0.01em',
              }}>SMRS Device Connect</div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 1 }}>
                Secure Meeting Recording System — Ingest &amp; Decrypt
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusBadge
              status={connStatus}
              label={
                connStatus === 'connected' ? 'Device Online'
                  : connStatus === 'connecting' ? 'Connecting…'
                    : connStatus === 'error' ? 'Disconnected'
                      : 'Standby'
              }
            />

            {/* Disconnect button in header — only when connected */}
            {connStatus === 'connected' && (
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                title="Disconnect device and wipe private key"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(239, 68, 68, 0.16)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5', cursor: 'pointer', borderRadius: 8,
                  padding: '5px 10px', fontSize: 11.5, fontWeight: 700,
                  transition: 'background .15s, color .15s',
                }}
              >
                <LogOut size={12} />
                Disconnect
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none',
                color: '#94a3b8', cursor: 'pointer', borderRadius: 8,
                padding: 6, display: 'flex', alignItems: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Green Connection Success Popup Bar (inside sidebar, fades after 1-2s) ── */}
        <div style={{
          maxHeight: connSuccessVisible ? '56px' : '0px',
          opacity: connSuccessVisible ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, padding 0.3s ease',
          background: '#ecfdf5',
          borderBottom: connSuccessVisible ? '1px solid #a7f3d0' : 'none',
          padding: connSuccessVisible ? '11px 24px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CheckCircle size={14} color="#ffffff" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46' }}>
            {connSuccessMsg}
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div style={{ padding: '24px', flex: 1 }}>

          {/* STEP 1 — RSA Key */}
          <StepHeader num="1" title="Upload Private Key" done={keyStatus === 'loaded'}>
            <SmrsCard>
              <div
                onClick={() => keyInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleKeyFile(e.dataTransfer.files[0]); }}
                style={{
                  border: `2px dashed ${keyStatus === 'loaded' ? '#0d9488' : '#e2e8f0'}`,
                  borderRadius: 10, padding: '22px 16px', textAlign: 'center',
                  cursor: 'pointer', transition: 'border-color .2s, background .2s',
                  background: keyStatus === 'loaded' ? 'rgba(13,148,136,0.04)' : '#fff',
                }}
              >
                <input
                  ref={keyInputRef} type="file" accept=".pem" style={{ display: 'none' }}
                  onChange={e => handleKeyFile(e.target.files[0])}
                />
                {keyStatus === 'loaded' ? (
                  <>
                    <CheckCircle size={28} color="#0d9488" style={{ marginBottom: 8 }} />
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f766e' }}>{keyName}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>Key loaded — click to replace</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearKey();
                      }}
                      style={{
                        marginTop: 10, background: 'transparent', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <X size={12} /> Remove key
                    </button>
                  </>
                ) : keyStatus === 'uploading' ? (
                  <>
                    <Loader2 size={28} color="#0d9488" style={{ animation: 'smrsSpin 1s linear infinite', marginBottom: 8 }} />
                    <div style={{ fontSize: 13, color: '#64748b' }}>Validating key…</div>
                  </>
                ) : (
                  <>
                    <Lock size={28} color="#94a3b8" style={{ marginBottom: 8 }} />
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 4 }}>
                      Drop your <code style={{ fontFamily: 'monospace', fontSize: 13 }}>.pem</code> file here
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>or click to browse</div>
                  </>
                )}
              </div>
              {keyStatus === 'error' && (
                <div style={{
                  marginTop: 10, padding: '8px 12px', background: '#fef2f2',
                  border: '1px solid #fecaca', borderRadius: 8, fontSize: 12.5, color: '#b91c1c',
                }}>
                  <AlertCircle size={12} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {keyMsg}
                </div>
              )}
            </SmrsCard>
          </StepHeader>

          {/* STEP 2 — Connect */}
          <StepHeader num="2" title="Connect to Device" done={connStatus === 'connected'}>
            <SmrsCard>
              {connStatus === 'connected' ? (
                /* Connected State View with Disconnect Button */
                <div style={{
                  background: 'rgba(13,148,136,0.06)',
                  border: '1px solid rgba(13,148,136,0.25)',
                  borderRadius: 10, padding: '16px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 10, marginBottom: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 9, height: 9, borderRadius: '50%', background: '#0d9488',
                        animation: 'smrsPulse 1.2s ease infinite', display: 'inline-block',
                      }} />
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: '#0f766e' }}>
                        Connected: {sshUser}@{sshIp}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#fee2e2', border: '1px solid #fca5a5',
                        color: '#b91c1c', cursor: 'pointer', borderRadius: 8,
                        padding: '6px 12px', fontSize: 12.5, fontWeight: 700,
                        transition: 'background .15s',
                      }}
                    >
                      <LogOut size={13} />
                      Disconnect Device
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                    Device is connected and authenticated. You can proceed to Step 3 to ingest and decrypt recordings.
                  </div>
                </div>
              ) : (
                /* Normal Connection Form */
                <>
                  {/* Mode toggle */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
                    {['ssh', 'scan'].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setConnMode(m); setConnMsg(''); }}
                        style={{
                          flex: 1, padding: '7px 0', border: 'none', borderRadius: 7,
                          cursor: 'pointer', fontSize: 12.5, fontWeight: 700,
                          transition: 'all .15s',
                          background: connMode === m ? '#0f172a' : 'transparent',
                          color: connMode === m ? '#fff' : '#64748b',
                        }}
                      >
                        {m === 'ssh' ? '🔒 SSH Mode' : '📡 Scan Mode'}
                      </button>
                    ))}
                  </div>

                  {connMode === 'ssh' ? (
                    <>
                      <SmrsInput
                        label="Device IP Address" type="text"
                        placeholder="e.g. 192.168.1.100"
                        value={sshIp} onChange={e => setSshIp(e.target.value)}
                      />
                      <SmrsInput
                        label="SSH Username" type="text"
                        value={sshUser} onChange={e => setSshUser(e.target.value)}
                      />
                      {/* Password with show/hide */}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{
                          display: 'block', fontSize: 11, fontWeight: 700,
                          letterSpacing: '.1em', color: '#64748b',
                          textTransform: 'uppercase', marginBottom: 5,
                        }}>SSH Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="Enter SSH password"
                            value={sshPass}
                            onChange={e => setSshPass(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSshConnect()}
                            style={{
                              width: '100%', padding: '9px 36px 9px 12px',
                              border: '1px solid #e2e8f0', borderRadius: 9,
                              background: '#fff', color: '#0f172a', fontSize: 13.5,
                              outline: 'none', boxSizing: 'border-box',
                              fontFamily: 'Inter, system-ui, sans-serif',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(v => !v)}
                            style={{
                              position: 'absolute', right: 10, top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: '#94a3b8', padding: 0,
                            }}
                          >
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                      <SmrsBtn
                        variant="primary"
                        loading={connStatus === 'connecting'}
                        disabled={connStatus === 'connecting'}
                        onClick={handleSshConnect}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Wifi size={14} />
                        {connStatus === 'connecting' ? 'Connecting…' : 'Connect via SSH'}
                      </SmrsBtn>
                    </>
                  ) : (
                    <>
                      <SmrsInput
                        label="Target IP Address" type="text"
                        placeholder="e.g. 10.42.0.91"
                        value={scanIp} onChange={e => setScanIp(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleScan()}
                      />
                      <SmrsBtn
                        variant="primary"
                        loading={connStatus === 'connecting'}
                        disabled={connStatus === 'connecting'}
                        onClick={handleScan}
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <Wifi size={14} />
                        {connStatus === 'connecting' ? 'Scanning…' : 'Scan for Device'}
                      </SmrsBtn>
                    </>
                  )}

                  {connMsg && connStatus !== 'connected' && (
                    <div style={{
                      marginTop: 10, padding: '8px 12px',
                      background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: 8, fontSize: 12.5, color: '#b91c1c',
                    }}>
                      <AlertCircle size={12} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                      {connMsg}
                    </div>
                  )}
                </>
              )}
            </SmrsCard>
          </StepHeader>

          {/* STEP 3 — Ingest */}
          <StepHeader num="3" title="Download &amp; Decrypt Recordings" done={false}>
            <SmrsCard style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '14px 18px', borderBottom: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.4 }}>
                  Downloads <code style={{ fontSize: 11.5 }}>.enc</code> files from device,
                  decrypts and wipes source.
                </div>
                <SmrsBtn
                  variant="teal"
                  loading={ingestBusy}
                  disabled={ingestBusy || keyStatus !== 'loaded' || connStatus !== 'connected'}
                  onClick={handleIngest}
                  style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  <Download size={14} />
                  {ingestBusy ? 'Processing…' : 'Run Ingest'}
                </SmrsBtn>
              </div>

              {/* Terminal */}
              <div
                ref={termRef}
                style={{
                  background: '#1e293b', padding: '12px 16px',
                  minHeight: 160, maxHeight: 240, overflowY: 'auto',
                  fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
                  fontSize: 11.5, lineHeight: 1.7,
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 10, paddingBottom: 8,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                      <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
                    ))}
                  </div>
                  <Terminal size={11} color="#475569" />
                  <span style={{ fontSize: 10.5, color: '#475569', letterSpacing: '.05em' }}>
                    AUDIT_LOG
                  </span>
                  <button
                    type="button"
                    onClick={() => setTermLines([{ type: 'sys', text: '[SYSTEM] Log console cleared.' }])}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 10.5, padding: 0 }}
                  >
                    CLEAR
                  </button>
                </div>
                {termLines.map((line, i) => (
                  <div key={i} style={{ color: termColor[line.type] || '#94a3b8', marginBottom: 1 }}>
                    {line.text}
                  </div>
                ))}
                {ingestBusy && (
                  <div style={{ color: '#0d9488', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Loader2 size={11} style={{ animation: 'smrsSpin 1s linear infinite' }} />
                    Processing…
                  </div>
                )}
              </div>
            </SmrsCard>
          </StepHeader>

          {/* STEP 4 — Audio Library */}
          <StepHeader num="4" title="Decrypted Audio Library" done={false}>
            <SmrsCard>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12.5, color: '#64748b' }}>
                  {audioFiles.length} file{audioFiles.length !== 1 ? 's' : ''} available
                </span>
                <SmrsBtn
                  variant="outline" onClick={refreshFiles} loading={loadingFiles}
                  style={{ padding: '6px 10px', fontSize: 12 }}
                >
                  <RefreshCw size={12} />
                  Refresh
                </SmrsBtn>
              </div>

              {audioFiles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8' }}>
                  <Folder size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
                    No decrypted recordings yet
                  </div>
                  <div style={{ fontSize: 12 }}>Run the ingest flow to decrypt files from your device.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {audioFiles.map(f => (
                    <div key={f.name} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', background: '#fff',
                      border: '1px solid #e2e8f0', borderRadius: 10, gap: 10,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: 'rgba(13,148,136,0.10)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Play size={14} color="#0d9488" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: 600, color: '#0f172a',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{f.name}</div>
                          <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1 }}>
                            {f.size_mb} MB · {f.modified}
                          </div>
                        </div>
                      </div>
                      <SmrsBtn
                        variant="teal"
                        loading={loadingFile === f.name}
                        disabled={!!loadingFile}
                        onClick={() => handleLoad(f)}
                        style={{ flexShrink: 0, padding: '7px 12px', fontSize: 12 }}
                      >
                        <Zap size={12} />
                        {loadingFile === f.name ? 'Loading…' : 'Load into Summarizer'}
                      </SmrsBtn>
                    </div>
                  ))}
                </div>
              )}
            </SmrsCard>
          </StepHeader>

        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid #e2e8f0',
          fontSize: 11.5, color: '#94a3b8', background: '#f8fafc', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <ShieldCheck size={12} color="#0d9488" />
          Encrypted transport · Zero cloud exposure · On-prem only
        </div>
      </div>
    </>
  );
}
