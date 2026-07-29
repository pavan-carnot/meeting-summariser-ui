import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { glyph: '🔒', title: 'On-premise & secure', desc: 'Runs entirely inside your VPC or data center. Nothing is sent to external servers, ever.' },
  { glyph: '≡', title: 'Four ways in', desc: 'Upload audio, record live, paste raw text, or import a transcript file — whatever fits the moment.' },
  { glyph: '◎', title: 'Speakers detected', desc: 'Participants are identified automatically from the conversation. No manual tagging.' },
  { glyph: '✓', title: 'Action items with owners', desc: 'Every task is extracted with its owner and deadline, ready to paste into your tracker.' },
  { glyph: '◇', title: 'Multi-language', desc: 'Auto-detects the spoken language, or set it manually for maximum accuracy.' },
  { glyph: '⏱', title: 'Long-meeting mode', desc: 'Optimized processing for sessions over 15 minutes without losing detail.' },
];

const steps = [
  { n: '1', title: 'Choose your input', desc: 'Upload audio, record live, paste text, or import a transcript file.' },
  { n: '2', title: 'AI transcribes', desc: 'Speech becomes text and the conversation is parsed for structure and intent.' },
  { n: '3', title: 'Speakers identified', desc: 'Participants and topics are detected automatically from the transcript.' },
  { n: '4', title: 'Summary delivered', desc: 'A concise summary with action items, owners, and deadlines.' },
];

const securityPoints = [
  'Deployed entirely within your own VPC or data center',
  'No third-party AI APIs or external data retention',
  'Full audit trail for every processed meeting',
];

const marqueeItems = [
  'NO THIRD-PARTY APIS', 'ON-PREMISE', 'SPEAKER DETECTION', 'ACTION ITEMS',
  'MULTI-LANGUAGE', 'REAL-TIME', 'NO THIRD-PARTY APIS', 'ON-PREMISE',
  'SPEAKER DETECTION', 'ACTION ITEMS', 'MULTI-LANGUAGE', 'REAL-TIME',
];

// ─────────────────────────────────────────────────────────────
// "How it works" — typographic horizontal flow. No images, no mockups.
// The step number IS the visual: giant outlined numerals, each connected
// by a thin flowing arrow. Minimal, editorial, on-brand.
// ─────────────────────────────────────────────────────────────

function HowItWorks({ steps, reveal, stagger }) {
  return (
    <section id="how" style={{ maxWidth: 1180, margin: '0 auto', padding: '30px 24px 0' }}>
      <style>{`
        .how-num {
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: clamp(96px, 11vw, 160px);
          line-height: .82;
          letter-spacing: -0.06em;
          color: transparent;
          -webkit-text-stroke: 1.5px #0A0F1E;
          transition: -webkit-text-stroke .35s ease, color .35s ease, transform .35s ease;
        }
        .how-step:hover .how-num {
          color: #00C5B0;
          -webkit-text-stroke: 1.5px #00C5B0;
          transform: translateY(-4px);
        }
        .how-arrow { color: #c9c5b5; }
        .how-step:hover ~ .how-arrow,
        .how-arrow.is-active { color: #00C5B0; }
      `}</style>

      <div {...reveal('how-header', { textAlign: 'center', marginBottom: 72 })}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.1em', color: '#9a978d', marginBottom: 12 }}>HOW IT WORKS</div>
        <h2 style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 42, letterSpacing: '-0.02em', margin: 0, color: '#0A0F1E' }}>
          From recording to action items
        </h2>
        <p style={{ fontSize: 15.5, color: '#66645c', marginTop: 14 }}>Four stages. All local.</p>
      </div>

      {/* Row of steps + arrows */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 32px minmax(0,1fr) 32px minmax(0,1fr) 32px minmax(0,1fr)',
        alignItems: 'flex-start',
        gap: 0,
      }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div {...stagger(`step-${i}`, i)} className="how-step" style={{ paddingRight: 8 }}>
              {/* Huge outlined number */}
              <div className="how-num">{s.n}</div>

              {/* Divider line */}
              <div style={{ height: 1, background: '#e5e2d6', margin: '22px 0 20px' }} />

              <h3 style={{
                fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 22,
                margin: 0, color: '#0A0F1E', letterSpacing: '-0.01em', lineHeight: 1.15,
              }}>{s.title}</h3>
              <p style={{
                margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.6, color: '#66645c',
              }}>{s.desc}</p>
            </div>

            {/* Arrow between steps (not after the last) */}
            {i < steps.length - 1 && (
              <div className="how-arrow" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingTop: 40, transition: 'color .35s ease',
              }}>
                <FlowArrow />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function FlowArrow() {
  // Elegant thin arrow — dashed shaft with a solid head. Uses currentColor
  // so parent hover states can tint it teal.
  return (
    <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 12 H36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
      <path d="M32 6 L40 12 L32 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Sticky "why teams use it" section:
//   - The heading pins at top of viewport while the section is on screen.
//   - Cards below it also use position:sticky, each with the SAME top
//     (equal to header height + a little space), so cards stack ON TOP of
//     each other under the pinned header as you scroll.
//   - We track which card is fully "locked" to update a small
//     "01/06" progress badge inside the header.
// IMPORTANT: no ancestor may set `overflow` (other than visible) or a
// `transform` — either breaks position:sticky.
// ─────────────────────────────────────────────────────────────
// Layout tokens for the sticky Features section.
// The navbar is now flush to top: 0 with ~78px total height (12px pad + pill),
// so the pinned Features heading starts just below it.
const NAVBAR_BOTTOM = 120;                       // where the pinned heading starts (bigger gap under navbar when scrolled)
const HEADER_HEIGHT = 128;                       // vertical space the heading takes
const CARD_TOP      = NAVBAR_BOTTOM + HEADER_HEIGHT + 16; // where each card locks
const CARD_MIN_H    = 380;                       // smaller than before

function FeaturesSection({ features }) {
  const palettes = [
    { bg: 'linear-gradient(150deg,#0A0F1E 0%,#1a2136 100%)', color: '#fff', accent: '#00C5B0', muted: 'rgba(255,255,255,0.75)', chipBg: 'rgba(0,197,176,0.14)' },
    { bg: 'linear-gradient(150deg,#00C5B0 0%,#00a795 100%)', color: '#0A0F1E', accent: '#0A0F1E', muted: 'rgba(10,15,30,0.75)', chipBg: 'rgba(10,15,30,0.10)' },
    { bg: 'linear-gradient(150deg,#ffffff 0%,#f6f5ef 100%)', color: '#0A0F1E', accent: '#00C5B0', muted: '#66645c', chipBg: '#f4f3ee' },
    { bg: 'linear-gradient(150deg,#111111 0%,#2a2a30 100%)', color: '#fff', accent: '#00C5B0', muted: 'rgba(255,255,255,0.75)', chipBg: 'rgba(255,255,255,0.10)' },
    { bg: 'linear-gradient(150deg,#faf4dc 0%,#efeee8 100%)', color: '#0A0F1E', accent: '#9a5b00', muted: '#66645c', chipBg: 'rgba(154,91,0,0.10)' },
    { bg: 'linear-gradient(150deg,#00C5B0 0%,#0A0F1E 100%)', color: '#fff', accent: '#fff', muted: 'rgba(255,255,255,0.78)', chipBg: 'rgba(255,255,255,0.14)' },
  ];

  return (
    <section
      id="features"
      style={{
        // Bottom margin gives space BEFORE the next section (How it works)
        // without extending the sticky region — margin is outside the box,
        // so the section's sticky descendants unpin cleanly at its bottom.
        maxWidth: 1180, margin: '130px auto 130px', padding: '0 24px',
        position: 'relative',
      }}
    >
      {/* PINNED HEADING — sits below the floating navbar, centered */}
      <div style={{
        position: 'sticky', top: NAVBAR_BOTTOM, zIndex: 20,
        background: 'linear-gradient(to bottom,#efeee8 0%,#efeee8 78%,rgba(239,238,232,0) 100%)',
        padding: '20px 0 22px',
        minHeight: HEADER_HEIGHT,
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.1em', color: '#9a978d', marginBottom: 10 }}>
            WHY TEAMS USE IT
          </div>
          <h2 style={{
            fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 42,
            letterSpacing: '-0.02em', margin: 0, color: '#0A0F1E',
          }}>Built for how teams actually meet</h2>
        </div>
      </div>

      {/* STACKING CARDS — no bottom padding so the last card + heading
          unpin the moment the section boundary passes them. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
        {features.map((f, i) => {
          const p = palettes[i % palettes.length];
          const isDark = p.color === '#fff';
          return (
            <div
              key={i}
              style={{
                position: 'sticky',
                top: CARD_TOP,      // every card locks at the same line
                background: p.bg,
                color: p.color,
                borderRadius: 24,
                padding: '38px 44px',
                minHeight: CARD_MIN_H,
                boxShadow: '0 24px 56px rgba(17,17,17,0.16), 0 2px 0 rgba(17,17,17,0.04)',
                display: 'grid',
                gridTemplateColumns: '1fr 1.25fr',
                gap: 36,
                alignItems: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {/* Left column: index chip + big glyph tile */}
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: p.chipBg, color: p.accent,
                  padding: '5px 12px', borderRadius: 999,
                  fontSize: 11.5, fontWeight: 800, letterSpacing: '.12em',
                }}>{String(i + 1).padStart(2, '0')} · REASON</div>
                <div style={{
                  marginTop: 22, width: 76, height: 76, borderRadius: 20,
                  background: p.chipBg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 34, color: p.accent,
                }}>{f.glyph}</div>
              </div>

              {/* Right column: headline + copy */}
              <div>
                <h3 style={{
                  fontFamily: "'Manrope',sans-serif", fontWeight: 800,
                  fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.02em',
                  margin: '0 0 16px', color: p.color,
                  paddingBottom: 16,
                  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(10,15,30,0.12)'}`,
                }}>{f.title}</h3>
                <p style={{
                  margin: 0, fontSize: 16, lineHeight: 1.6, fontWeight: 500,
                  color: p.muted, maxWidth: 520,
                }}>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


export default function Landing() {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState({});
  const revealMap = useRef({});
  const [navHover, setNavHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [bigCtaHover, setBigCtaHover] = useState(false);

  const register = (id) => (el) => {
    if (el) revealMap.current[id] = el;
  };

  useEffect(() => {
    const check = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const updates = {};
      let changed = false;
      Object.entries(revealMap.current).forEach(([id, el]) => {
        if (!el || revealed[id]) return;
        if (el.getBoundingClientRect().top < vh * 0.92) {
          updates[id] = true;
          changed = true;
        }
      });
      if (changed) setRevealed((s) => ({ ...s, ...updates }));
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    requestAnimationFrame(() => requestAnimationFrame(check));
    const t = setTimeout(check, 350);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearTimeout(t);
    };
  }, [revealed]);

  const reveal = (id, extra = {}) => ({
    ref: register(id),
    style: {
      opacity: revealed[id] ? 1 : 0,
      transform: revealed[id] ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity .8s ease, transform .8s ease',
      ...extra,
    },
  });

  const stagger = (id, i, extra = {}) => ({
    ref: register(id),
    style: {
      opacity: revealed[id] ? 1 : 0,
      transform: revealed[id] ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity .7s ease ${i * 0.09}s, transform .7s ease ${i * 0.09}s`,
      ...extra,
    },
  });

  const goApp = (e) => {
    e?.preventDefault?.();
    navigate('/app');
  };

  return (
    <div style={{ background: '#efeee8', minHeight: '100vh' }}>
      <style>{`
        html, body { overflow-x: clip; }  /* clip (not hidden) → sticky still works */
        .lp-feature-card { transition: transform .3s ease, box-shadow .3s ease; }
        .lp-feature-card:hover { transform: translateY(-6px); box-shadow: 0 2px 0 rgba(17,17,17,0.04), 0 24px 48px rgba(17,17,17,0.10); }
        .lp-anchor { color: #66645c; }
        .lp-anchor:hover { color: #111; }
      `}</style>

      <div style={{ width: '100%', color: '#111111' }}>

        {/* NAV — flush to top of viewport */}
        <div style={{ position: 'sticky', top: 0, zIndex: 50, maxWidth: 1180, margin: '0 auto', padding: '12px 24px 0' }}>
          <div style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRadius: 18,
            boxShadow: '0 1px 0 rgba(17,17,17,0.05),0 8px 24px rgba(17,17,17,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src="/icarkno%20logo.png"
                alt="icarKno"
                style={{ width: 38, height: 38, flexShrink: 0, objectFit: 'contain', borderRadius: 11 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 16.5 }}>Meeting Summariser</span>
                <span style={{ fontSize: 12, color: '#9a978d' }}>Carnot Research</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
              <a href="#features" className="lp-anchor" style={{ fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>Features</a>
              <a href="#how" className="lp-anchor" style={{ fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>How it works</a>
              <a href="#security" className="lp-anchor" style={{ fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>Security</a>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div style={{
          maxWidth: 1180, margin: '0 auto', padding: '88px 24px 24px',
          display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56, alignItems: 'center',
        }}>
          <div>
            <div style={{
              animation: 'fadeUp .8s ease .05s both', display: 'inline-flex', alignItems: 'center',
              gap: 9, background: '#ffffff', border: '1px solid #e5e2d6', borderRadius: 999,
              padding: '9px 18px', fontSize: 13.5, fontWeight: 600, color: '#00C5B0',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fae63' }}></span>
              On-premise · Your data never leaves your network
            </div>
            <h1 style={{
              animation: 'fadeUp .8s ease .15s both', fontFamily: "'Manrope',sans-serif",
              fontWeight: 800, fontSize: 62, lineHeight: 1.06, letterSpacing: '-0.025em',
              margin: '28px 0 24px', color: '#0A0F1E',
            }}>
              Every meeting,<br />summarised into<br />
              <em style={{ fontStyle: 'normal', borderBottom: '4px solid #00C5B0', color: '#00C5B0' }}>clear action.</em>
            </h1>
            <p style={{
              animation: 'fadeUp .8s ease .28s both', fontSize: 18.5, lineHeight: 1.6,
              color: '#94a3b8', maxWidth: 480, margin: '0 0 36px',
            }}>
              Turn recordings and transcripts into concise summaries, owners, and deadlines — processed entirely on your own infrastructure.
            </p>
            <div style={{ animation: 'fadeUp .8s ease .4s both', display: 'flex', gap: 16, alignItems: 'center' }}>
              <a
                href="/app"
                onClick={goApp}
                onMouseEnter={() => setCtaHover(true)}
                onMouseLeave={() => setCtaHover(false)}
                style={{
                  display: 'inline-block', background: '#111111', color: '#ffffff',
                  borderRadius: 14, padding: '17px 34px', fontSize: 16.5, fontWeight: 700,
                  cursor: 'pointer', textDecoration: 'none',
                  boxShadow: ctaHover ? '0 18px 36px rgba(17,17,17,0.28)' : '0 12px 28px rgba(17,17,17,0.22)',
                  transform: ctaHover ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'transform .25s ease, box-shadow .25s ease',
                }}
              >Explore Product →</a>
              <a href="#how" style={{ fontSize: 16, fontWeight: 600, padding: '16px 10px', color: '#111', textDecoration: 'none' }}>See how it works</a>
            </div>
          </div>

          {/* HERO IMAGE — local overflow:hidden so the 130%-wide image
              doesn't create a horizontal scrollbar. We can't put
              overflow:hidden on the outer wrapper because that would kill
              position:sticky on the features cards below. */}
          <div style={{ animation: 'fadeUp .9s ease .3s both', overflow: 'hidden' }}>
            <img
              src="/image.png"
              alt="Meeting summary preview"
              style={{
                width: '130%',
                display: 'block',
                marginLeft: '-5%',
              }}
            />
          </div>
        </div>

        {/* MARQUEE */}
        <div style={{
          borderTop: '1px solid #e5e2d6', borderBottom: '1px solid #e5e2d6',
          marginTop: 72, padding: '20px 0', overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          <div style={{ display: 'inline-flex', gap: 56, animation: 'marqueeScroll 26s linear infinite' }}>
            {marqueeItems.map((m, i) => (
              <span key={i} style={{
                fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: 15.5,
                color: '#8c8a80', display: 'inline-flex', alignItems: 'center', gap: 56,
              }}>{m} <span style={{ color: '#00C5B0' }}>✦</span></span>
            ))}
          </div>
        </div>

        {/* FEATURES — sticky pinned heading + stacking cards */}
        <FeaturesSection features={features} />


        {/* HOW IT WORKS — horizontal flow with product mockups */}
        <HowItWorks steps={steps} reveal={reveal} stagger={stagger} />

        {/* SECURITY */}
        <div id="security" {...reveal('security', {
          maxWidth: 1180, margin: '130px auto 0', padding: '0 24px', boxSizing: 'border-box',
        })}>
          <div style={{
            background: '#111111', borderRadius: 28, padding: '64px 64px',
            display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.1em', color: '#00C5B0', marginBottom: 14 }}>SECURITY FIRST</div>
              <h3 style={{
                fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 36, color: '#ffffff',
                margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-0.015em',
              }}>Your meetings never leave your network</h3>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: '#a7a49a', margin: 0 }}>
                Every recording, transcript, and summary is processed on your own infrastructure — no third-party APIs, no external retention, no exceptions.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {securityPoints.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  background: '#1d1d1b', borderRadius: 14, padding: '18px 20px',
                }}>
                  <div style={{ color: '#00C5B0', fontSize: 16, marginTop: 1 }}>✓</div>
                  <div style={{ fontSize: 15, color: '#e8e6de', lineHeight: 1.55 }}>{p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div {...reveal('cta', {
          maxWidth: 1180, margin: '140px auto 0', padding: '0 24px', textAlign: 'center',
        })}>
          <h2 style={{
            fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 44,
            letterSpacing: '-0.02em', margin: '0 0 18px',
          }}>Turn your next meeting<br />into clear action.</h2>
          <p style={{ fontSize: 17, color: '#66645c', margin: '0 0 36px' }}>Deploy on your own servers in under a day.</p>
          <a
            href="/app"
            onClick={goApp}
            onMouseEnter={() => setBigCtaHover(true)}
            onMouseLeave={() => setBigCtaHover(false)}
            style={{
              display: 'inline-block', background: '#111111', color: '#ffffff',
              borderRadius: 14, padding: '17px 34px', fontSize: 16.5, fontWeight: 700,
              cursor: 'pointer', textDecoration: 'none',
              boxShadow: bigCtaHover ? '0 18px 36px rgba(17,17,17,0.28)' : '0 12px 28px rgba(17,17,17,0.22)',
              transform: bigCtaHover ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'transform .25s ease, box-shadow .25s ease',
            }}
          >Explore the Product →</a>
        </div>

        {/* FOOTER */}
        <div style={{
          maxWidth: 1180, margin: '120px auto 0', padding: '36px 24px 44px',
          borderTop: '1px solid #e5e2d6', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <img
              src="/icarkno%20logo.png"
              alt="icarKno"
              style={{ width: 34, height: 34, flexShrink: 0, objectFit: 'contain', borderRadius: 10 }}
            />
            <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 15.5 }}>Carnot Research</span>
          </div>
          <div style={{ display: 'flex', gap: 30 }}>
            <a href="#features" className="lp-anchor" style={{ fontSize: 14.5, textDecoration: 'none' }}>Features</a>
            <a href="#how" className="lp-anchor" style={{ fontSize: 14.5, textDecoration: 'none' }}>How it works</a>
            <a href="#security" className="lp-anchor" style={{ fontSize: 14.5, textDecoration: 'none' }}>Security</a>
          </div>
          <div style={{ fontSize: 13.5, color: '#9a978d' }}>© 2026 Carnot Research</div>
        </div>

      </div>
    </div>
  );
}
