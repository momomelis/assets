import React, { useState, useMemo } from 'react';
import { User, Target, CheckCircle, XCircle, TrendingUp, Star, AlertCircle, ChevronRight, RotateCcw, Zap, BookOpen, Award } from 'lucide-react';

// ─── Customer Avatars ────────────────────────────────────────────────────────

const AVATARS = [
  {
    id: 'zoe',
    name: 'Zoe',
    age: 24,
    title: 'The Conscious Gen-Z',
    emoji: '🍓',
    color: '#FF2D78',
    accent: '#FF6FA8',
    bg: 'rgba(255,45,120,0.08)',
    occupation: 'Junior UX Designer',
    location: 'Istanbul / Berlin',
    income: '$28k–$40k',
    goals: [
      'Express identity through every product she owns',
      'Reduce environmental footprint without sacrificing style',
      'Build community around shared values',
    ],
    pains: [
      'Period products feel clinical and embarrassing to buy',
      'Sustainable alternatives are either ugly or overpriced',
      'Tired of blue-liquid ads that ignore real bodies',
    ],
    values: ['Self-expression', 'Sustainability', 'Authenticity', 'Community'],
    buyingTriggers: [
      'Aesthetic aligns with her identity',
      'Founder story feels real and relatable',
      'TikTok / peer validation',
    ],
    objections: [
      'Will it actually work as well as disposables?',
      'How does it look under tight clothing?',
      'Is the brand actually ethical or just marketing?',
    ],
    offerCriteria: {
      aesthetics: 9,
      sustainability: 9,
      pricePoint: 6,
      socialProof: 9,
      techInnovation: 7,
      inclusivity: 8,
    },
  },
  {
    id: 'maya',
    name: 'Maya',
    age: 31,
    title: 'The Working Professional',
    emoji: '💼',
    color: '#7B61FF',
    accent: '#A58CFF',
    bg: 'rgba(123,97,255,0.08)',
    occupation: 'Product Manager',
    location: 'London / Istanbul',
    income: '$55k–$85k',
    goals: [
      'Feel confident and put-together at work every day',
      'Simplify her routine without compromising quality',
      'Invest in products that last and deliver ROI',
    ],
    pains: [
      'Period anxiety during important meetings or travel',
      'Bulky pads create visible lines under professional attire',
      'Has to plan outfits around her cycle',
    ],
    values: ['Reliability', 'Discretion', 'Quality', 'Efficiency'],
    buyingTriggers: [
      'Solves a specific, recurring professional problem',
      'Evidence-based claims (lab tests, wash cycles)',
      'Seamless look under office wear',
    ],
    objections: [
      'I need zero risk of leaks during board meetings',
      'Will it survive frequent travel and laundry?',
      'Is the price justified vs. disposables over time?',
    ],
    offerCriteria: {
      aesthetics: 7,
      sustainability: 6,
      pricePoint: 5,
      socialProof: 6,
      techInnovation: 9,
      inclusivity: 7,
    },
  },
  {
    id: 'nour',
    name: 'Nour',
    age: 19,
    title: 'The Student Activist',
    emoji: '✊',
    color: '#00D4AA',
    accent: '#4EEECF',
    bg: 'rgba(0,212,170,0.08)',
    occupation: 'University Student',
    location: 'Ankara / Online',
    income: '$8k–$15k',
    goals: [
      'Fight period stigma in her community',
      'Make conscious purchases on a tight budget',
      'Support brands that give back',
    ],
    pains: [
      'Cannot afford to replace disposables with quality alternatives',
      'Feels alone in talking openly about menstruation',
      'Mainstream brands feel performative, not genuine',
    ],
    values: ['Activism', 'Affordability', 'Solidarity', 'Transparency'],
    buyingTriggers: [
      'Brand actively funds menstrual equity causes',
      'Community / discount program for students',
      'Word-of-mouth from trusted peers',
    ],
    objections: [
      'The price is out of my budget right now',
      'Will it hold up with my active campus life?',
      'Is the activism real or just a marketing angle?',
    ],
    offerCriteria: {
      aesthetics: 7,
      sustainability: 8,
      pricePoint: 10,
      socialProof: 8,
      techInnovation: 5,
      inclusivity: 10,
    },
  },
];

// ─── Offer Criteria Labels ────────────────────────────────────────────────────

const CRITERIA_META = {
  aesthetics:      { label: 'Aesthetic Appeal',    description: 'Does the product look and feel like "me"?' },
  sustainability:  { label: 'Sustainability',       description: 'Is the brand ethical and eco-conscious?' },
  pricePoint:      { label: 'Price Accessibility',  description: 'Can I realistically afford this?' },
  socialProof:     { label: 'Social Proof',         description: 'Do people I trust recommend it?' },
  techInnovation:  { label: 'Tech Innovation',      description: 'Does the technology solve my real problem?' },
  inclusivity:     { label: 'Inclusivity',          description: 'Does this brand see all bodies and budgets?' },
};

// ─── Transferable Skills ─────────────────────────────────────────────────────

const SKILLS = [
  { id: 'empathy',   label: 'Customer Empathy',    icon: '🧠', description: 'Reading real human needs behind stated preferences' },
  { id: 'framing',   label: 'Offer Framing',        icon: '🎯', description: 'Translating features into outcomes your avatar actually cares about' },
  { id: 'research',  label: 'Qualitative Research', icon: '🔬', description: 'Extracting signal from customer conversations and behaviour' },
  { id: 'copywrite', label: 'Resonant Copywriting', icon: '✍️', description: 'Writing in your customer\'s voice, not your own' },
  { id: 'pricing',   label: 'Value Pricing',        icon: '💡', description: 'Setting price based on perceived value, not cost-plus' },
  { id: 'feedback',  label: 'Offer Iteration',      icon: '🔁', description: 'Running fast validation loops before spending on production' },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

const avg = (values) => values.reduce((s, v) => s + v, 0) / values.length;

const scoreColor = (score) => {
  if (score >= 80) return '#00D4AA';
  if (score >= 60) return '#FFB800';
  return '#FF2D78';
};

const ScoreBar = ({ value, max = 10, color = '#7B61FF' }) => (
  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, width: '100%' }}>
    <div style={{
      height: '100%',
      borderRadius: 4,
      background: color,
      width: `${(value / max) * 100}%`,
      transition: 'width 0.5s ease',
    }} />
  </div>
);

// ─── Component ───────────────────────────────────────────────────────────────

const CustomerAvatarValidation = () => {
  const [activeTab, setActiveTab] = useState('avatars');
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);
  const [immersionStep, setImmersionStep] = useState(0);
  const [offerInputs, setOfferInputs] = useState({
    aesthetics: 5,
    sustainability: 5,
    pricePoint: 5,
    socialProof: 5,
    techInnovation: 5,
    inclusivity: 5,
  });
  const [unlockedSkills, setUnlockedSkills] = useState([]);
  const [validationRun, setValidationRun] = useState(false);

  const selectedAvatar = AVATARS.find((a) => a.id === selectedAvatarId);

  // ── Validation score ──────────────────────────────────────────────────────

  const validationResult = useMemo(() => {
    if (!selectedAvatar) return null;
    const criteria = selectedAvatar.offerCriteria;
    const scores = Object.keys(criteria).map((key) => {
      const avatarWeight = criteria[key];      // how much this criterion matters to the avatar (1-10)
      const offerScore  = offerInputs[key];   // how well the offer delivers on it (1-10)
      return { key, avatarWeight, offerScore, match: (offerScore / 10) * avatarWeight };
    });
    const maxPossible = Object.values(criteria).reduce((s, v) => s + v, 0);
    const achieved    = scores.reduce((s, r) => s + r.match, 0);
    const overall     = Math.round((achieved / maxPossible) * 100);
    return { scores, overall };
  }, [selectedAvatar, offerInputs]);

  // ── Unlock skills when validation runs ───────────────────────────────────

  const runValidation = () => {
    setValidationRun(true);
    // unlock skills progressively based on engagement
    const toUnlock = ['empathy', 'framing'];
    if (validationResult?.overall >= 60) toUnlock.push('pricing');
    if (validationResult?.overall >= 80) toUnlock.push('research', 'copywrite', 'feedback');
    setUnlockedSkills(toUnlock);
    setActiveTab('validate');
  };

  const resetAll = () => {
    setSelectedAvatarId(null);
    setImmersionStep(0);
    setOfferInputs({ aesthetics: 5, sustainability: 5, pricePoint: 5, socialProof: 5, techInnovation: 5, inclusivity: 5 });
    setUnlockedSkills([]);
    setValidationRun(false);
    setActiveTab('avatars');
  };

  // ── Styles ────────────────────────────────────────────────────────────────

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0E0E14',
      color: '#E8E8F0',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: '32px 24px',
      maxWidth: 900,
      margin: '0 auto',
    },
    header: {
      marginBottom: 32,
    },
    tag: {
      display: 'inline-block',
      background: 'rgba(255,45,120,0.15)',
      color: '#FF6FA8',
      borderRadius: 4,
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: 800,
      lineHeight: 1.2,
      margin: '0 0 8px',
      background: 'linear-gradient(135deg, #FF2D78, #7B61FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      fontSize: 14,
      color: '#888',
      margin: 0,
    },
    tabs: {
      display: 'flex',
      gap: 4,
      marginBottom: 28,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      paddingBottom: 0,
    },
    tab: (active) => ({
      padding: '10px 18px',
      borderRadius: '6px 6px 0 0',
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: active ? 700 : 500,
      background: active ? 'rgba(255,45,120,0.12)' : 'transparent',
      color: active ? '#FF6FA8' : '#888',
      borderBottom: active ? '2px solid #FF2D78' : '2px solid transparent',
      transition: 'all 0.2s',
    }),
    card: (border = 'rgba(255,255,255,0.08)') => ({
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${border}`,
      borderRadius: 12,
      padding: 24,
      marginBottom: 16,
    }),
    avatarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 16,
      marginBottom: 24,
    },
    avatarCard: (avatar, selected) => ({
      background: selected ? avatar.bg : 'rgba(255,255,255,0.02)',
      border: `1px solid ${selected ? avatar.color : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 12,
      padding: 20,
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    pillList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8,
    },
    pill: (color = '#7B61FF') => ({
      background: `${color}22`,
      color: color,
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 600,
    }),
    slider: {
      width: '100%',
      accentColor: '#7B61FF',
      cursor: 'pointer',
    },
    button: (variant = 'primary') => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 20px',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: 13,
      background: variant === 'primary'
        ? 'linear-gradient(135deg, #FF2D78, #7B61FF)'
        : 'rgba(255,255,255,0.06)',
      color: '#fff',
      transition: 'opacity 0.2s',
    }),
    sectionTitle: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 16,
      color: '#E8E8F0',
    },
    label: {
      fontSize: 12,
      color: '#888',
      marginBottom: 4,
    },
    score: (s) => ({
      fontSize: 48,
      fontWeight: 900,
      color: scoreColor(s),
      lineHeight: 1,
    }),
    skillCard: (unlocked) => ({
      background: unlocked ? 'rgba(0,212,170,0.06)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${unlocked ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 10,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      opacity: unlocked ? 1 : 0.45,
      transition: 'all 0.3s',
    }),
  };

  // ── IMMERSION STEPS ───────────────────────────────────────────────────────

  const IMMERSION_PROMPTS = selectedAvatar
    ? [
        {
          heading: `You are ${selectedAvatar.name}.`,
          body: `${selectedAvatar.age} years old. ${selectedAvatar.occupation}. Based in ${selectedAvatar.location}.\nYour income is ${selectedAvatar.income}.\nEvery purchase decision you make is filtered through one question: does this feel like *me*?`,
        },
        {
          heading: 'These are your goals.',
          body: selectedAvatar.goals.map((g) => `→ ${g}`).join('\n'),
        },
        {
          heading: 'These are your pains.',
          body: selectedAvatar.pains.map((p) => `→ ${p}`).join('\n'),
        },
        {
          heading: 'This is what makes you buy.',
          body: selectedAvatar.buyingTriggers.map((t) => `✓ ${t}`).join('\n'),
        },
        {
          heading: 'These are your objections.',
          body: selectedAvatar.objections.map((o) => `? ${o}`).join('\n'),
        },
      ]
    : [];

  // ═════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <div style={styles.container}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <span style={styles.tag}>Customer Avatar Validation</span>
        <h1 style={styles.title}>Become the Customer. Validate the Offer.</h1>
        <p style={styles.subtitle}>
          Immerse yourself in your avatar → score your offer against what they actually care about → leave with marketable skills regardless of outcome.
        </p>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div style={styles.tabs}>
        {[
          { id: 'avatars',  label: '1. Choose Avatar',  icon: <User size={13} /> },
          { id: 'immerse',  label: '2. Become the Avatar', icon: <Target size={13} /> },
          { id: 'validate', label: '3. Validate Offer', icon: <CheckCircle size={13} /> },
          { id: 'skills',   label: '4. Skills Earned',  icon: <Award size={13} /> },
        ].map((t) => (
          <button
            key={t.id}
            style={styles.tab(activeTab === t.id)}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <button style={styles.button('secondary')} onClick={resetAll}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1 — AVATARS
        ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'avatars' && (
        <>
          <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
            Pick the avatar that best represents your primary target customer. You'll step into their shoes in the next phase.
          </p>
          <div style={styles.avatarGrid}>
            {AVATARS.map((avatar) => (
              <div
                key={avatar.id}
                style={styles.avatarCard(avatar, selectedAvatarId === avatar.id)}
                onClick={() => setSelectedAvatarId(avatar.id)}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{avatar.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: avatar.color }}>{avatar.name}</div>
                <div style={{ fontSize: 12, color: '#AAA', marginBottom: 4 }}>{avatar.title}</div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                  {avatar.age} · {avatar.occupation} · {avatar.location}
                </div>
                <div style={styles.pillList}>
                  {avatar.values.map((v) => (
                    <span key={v} style={styles.pill(avatar.color)}>{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedAvatar && (
            <button
              style={styles.button('primary')}
              onClick={() => { setImmersionStep(0); setActiveTab('immerse'); }}
            >
              Step into {selectedAvatar.name}'s world <ChevronRight size={15} />
            </button>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2 — IMMERSION
        ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'immerse' && selectedAvatar && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: selectedAvatar.bg,
              border: `2px solid ${selectedAvatar.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>
              {selectedAvatar.emoji}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: selectedAvatar.color }}>{selectedAvatar.name} — {selectedAvatar.title}</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Step {immersionStep + 1} of {IMMERSION_PROMPTS.length}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, marginBottom: 28 }}>
            <div style={{
              height: '100%',
              borderRadius: 4,
              background: selectedAvatar.color,
              width: `${((immersionStep + 1) / IMMERSION_PROMPTS.length) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>

          <div style={{ ...styles.card(selectedAvatar.color + '44'), minHeight: 180 }}>
            <h2 style={{ color: selectedAvatar.color, marginBottom: 16, fontSize: 18 }}>
              {IMMERSION_PROMPTS[immersionStep].heading}
            </h2>
            <pre style={{
              fontFamily: 'inherit',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              color: '#C8C8D8',
              fontSize: 14,
              margin: 0,
            }}>
              {IMMERSION_PROMPTS[immersionStep].body}
            </pre>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {immersionStep > 0 && (
              <button
                style={styles.button('secondary')}
                onClick={() => setImmersionStep((s) => s - 1)}
              >
                ← Back
              </button>
            )}
            {immersionStep < IMMERSION_PROMPTS.length - 1 ? (
              <button
                style={styles.button('primary')}
                onClick={() => setImmersionStep((s) => s + 1)}
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                style={styles.button('primary')}
                onClick={() => setActiveTab('validate')}
              >
                Rate your offer against {selectedAvatar.name} <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Avatar detail panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28 }}>
            <div style={styles.card()}>
              <div style={styles.sectionTitle}>Buying Triggers</div>
              {selectedAvatar.buyingTriggers.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <CheckCircle size={14} color="#00D4AA" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: '#B8B8C8' }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={styles.card()}>
              <div style={styles.sectionTitle}>Objections to Overcome</div>
              {selectedAvatar.objections.map((o, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <AlertCircle size={14} color="#FFB800" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: '#B8B8C8' }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'immerse' && !selectedAvatar && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
          <User size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p>Choose an avatar first.</p>
          <button style={styles.button('primary')} onClick={() => setActiveTab('avatars')}>
            Pick an Avatar
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3 — OFFER VALIDATION
        ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'validate' && (
        <>
          {!selectedAvatar ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <Target size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>Select and immerse yourself in an avatar first.</p>
              <button style={styles.button('primary')} onClick={() => setActiveTab('avatars')}>
                Choose Avatar
              </button>
            </div>
          ) : (
            <>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
                Rate how well your current offer delivers on each dimension. The score is weighted by how much <strong style={{ color: selectedAvatar.color }}>{selectedAvatar.name}</strong> actually cares about each criterion.
              </p>

              {/* Sliders */}
              {Object.keys(CRITERIA_META).map((key) => (
                <div key={key} style={{ ...styles.card(), marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{CRITERIA_META[key].label}</div>
                      <div style={styles.label}>{CRITERIA_META[key].description}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: '#666' }}>
                        Avatar priority: <strong style={{ color: selectedAvatar.color }}>{selectedAvatar.offerCriteria[key]}/10</strong>
                      </span>
                      <span style={{
                        fontWeight: 800, fontSize: 18,
                        color: offerInputs[key] >= selectedAvatar.offerCriteria[key] ? '#00D4AA' : '#FFB800',
                        width: 28, textAlign: 'right',
                      }}>
                        {offerInputs[key]}
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={offerInputs[key]}
                    style={styles.slider}
                    onChange={(e) => setOfferInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#555', marginTop: 4 }}>
                    <span>1 — Weak</span>
                    <span>10 — Exceptional</span>
                  </div>
                </div>
              ))}

              <button style={{ ...styles.button('primary'), marginTop: 8 }} onClick={runValidation}>
                <Zap size={14} /> Run Validation
              </button>

              {/* Results */}
              {validationRun && validationResult && (
                <div style={{ ...styles.card(scoreColor(validationResult.overall) + '55'), marginTop: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 24 }}>
                    <div>
                      <div style={styles.label}>Overall Match Score</div>
                      <div style={styles.score(validationResult.overall)}>
                        {validationResult.overall}%
                      </div>
                    </div>
                    <div style={{ paddingBottom: 6 }}>
                      {validationResult.overall >= 80 && (
                        <div style={{ color: '#00D4AA', fontWeight: 700 }}>
                          <CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          Strong fit — lead with this avatar
                        </div>
                      )}
                      {validationResult.overall >= 60 && validationResult.overall < 80 && (
                        <div style={{ color: '#FFB800', fontWeight: 700 }}>
                          <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          Moderate fit — shore up the weak areas
                        </div>
                      )}
                      {validationResult.overall < 60 && (
                        <div style={{ color: '#FF2D78', fontWeight: 700 }}>
                          <XCircle size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                          Low fit — reconsider offer or avatar
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Per-criterion breakdown */}
                  <div style={{ display: 'grid', gap: 10 }}>
                    {validationResult.scores.map(({ key, avatarWeight, offerScore, match }) => (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                          <span style={{ color: '#C8C8D8' }}>{CRITERIA_META[key].label}</span>
                          <span style={{ color: '#888' }}>
                            Offer {offerScore}/10 · Avatar priority {avatarWeight}/10 · Weighted {match.toFixed(1)}
                          </span>
                        </div>
                        <ScoreBar
                          value={match}
                          max={avatarWeight}
                          color={offerScore >= avatarWeight ? '#00D4AA' : '#FFB800'}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 13 }}>
                    <strong style={{ color: '#E8E8F0' }}>What to improve: </strong>
                    <span style={{ color: '#888' }}>
                      {validationResult.scores
                        .filter(({ offerScore, avatarWeight }) => offerScore < avatarWeight)
                        .map(({ key }) => CRITERIA_META[key].label)
                        .join(', ') || 'Nothing — you\'re exceeding expectations across the board.'}
                    </span>
                  </div>

                  <button
                    style={{ ...styles.button('secondary'), marginTop: 16 }}
                    onClick={() => setActiveTab('skills')}
                  >
                    <BookOpen size={14} /> See skills you've earned
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4 — SKILLS
        ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'skills' && (
        <>
          <div style={{ ...styles.card('rgba(0,212,170,0.2)'), marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <TrendingUp size={20} color="#00D4AA" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  Even if the business doesn't make it, these skills do.
                </div>
                <div style={{ color: '#888', fontSize: 13, lineHeight: 1.6 }}>
                  Every hour you spend inside a customer's head builds a capability that transfers across any product, market, or company. This is the real asset.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {SKILLS.map((skill) => {
              const unlocked = unlockedSkills.includes(skill.id);
              return (
                <div key={skill.id} style={styles.skillCard(unlocked)}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{skill.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{skill.label}</span>
                      {unlocked
                        ? <span style={{ ...styles.pill('#00D4AA'), fontSize: 10 }}>Unlocked</span>
                        : <span style={{ ...styles.pill('#555'), fontSize: 10 }}>Run validation to unlock</span>
                      }
                    </div>
                    <div style={{ color: '#888', fontSize: 13 }}>{skill.description}</div>
                  </div>
                  {unlocked && <Star size={14} color="#00D4AA" style={{ flexShrink: 0, marginTop: 3 }} />}
                </div>
              );
            })}
          </div>

          {unlockedSkills.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 20px' }}>
              <p style={{ color: '#666', fontSize: 13 }}>
                Complete the avatar immersion and run validation to start unlocking skills.
              </p>
              <button
                style={styles.button('primary')}
                onClick={() => setActiveTab(selectedAvatar ? 'validate' : 'avatars')}
              >
                {selectedAvatar ? 'Go to Validation' : 'Start with an Avatar'}
              </button>
            </div>
          )}

          {unlockedSkills.length > 0 && (
            <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: 10, fontSize: 13, color: '#C8C8D8' }}>
              <strong style={{ color: '#FF6FA8' }}>{unlockedSkills.length} of {SKILLS.length} skills unlocked.</strong>
              {' '}Refine your offer, experiment with different avatars, and iterate — each loop sharpens the skill set.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerAvatarValidation;
