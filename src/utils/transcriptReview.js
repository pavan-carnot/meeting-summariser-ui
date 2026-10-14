export function reviewReasons(segment) {
  if (segment.user_edited) return [];
  const reasons = [];
  if (/(.{1,40}?)\1{5,}/u.test(segment.text || '') || segment.review_reasons?.includes('repetition')) {
    reasons.push('Repeated text detected');
  }
  const score = segment.confidence;
  if (segment.confidence_source !== 'default' && typeof score === 'number' && Number.isFinite(score) && score < 55) {
    reasons.push('Low model score');
  }
  return reasons;
}

export function scoreDetails(segment) {
  if (segment.user_edited) return 'Edited text — no model score applies to your correction.';
  if (segment.confidence_source === 'default') return 'Model confidence: unknown.';
  if (typeof segment.model_confidence === 'number' && Number.isFinite(segment.model_confidence)) {
    return `Model confidence: ${Math.round(segment.model_confidence)}%.`;
  }
  if (typeof segment.confidence === 'number' && Number.isFinite(segment.confidence)) {
    return `Stored score: ${Math.round(segment.confidence)}%. This older result may include application adjustments; the original model score is unavailable.`;
  }
  return 'Model confidence: unknown.';
}
