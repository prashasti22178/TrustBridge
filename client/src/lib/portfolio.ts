import type { Applicant } from '../types/underwriter';

/** All summary values describe the same loaded queue, including an empty queue. */
export function summarizePortfolio(applicants: Applicant[]) {
  const total = applicants.length;
  const percentage = (count: number) => total ? Math.round(count / total * 1000) / 10 : 0;
  const scores = applicants.map(a => a.trustScore).sort((a, b) => a - b);
  const riskCounts = { LOW: 0, MODERATE: 0, HIGH: 0, UNASSESSED: 0 };
  for (const applicant of applicants) {
    const key = applicant.riskTier;
    if (key === 'LOW' || key === 'MODERATE' || key === 'HIGH') riskCounts[key]++;
    else riskCounts.UNASSESSED++;
  }
  const buckets = [
    { label: '< 50', min: 0, max: 50, color: '#f43f5e' },
    { label: '50–65', min: 50, max: 65, color: '#f59e0b' },
    { label: '65–75', min: 65, max: 75, color: '#6366f1' },
    { label: '75–85', min: 75, max: 85, color: '#10b981' },
    { label: '85–100', min: 85, max: 101, color: '#06b6d4' }
  ];
  return {
    total,
    averageScore: total ? Math.round(scores.reduce((a, b) => a + b, 0) / total * 10) / 10 : 0,
    median: total ? (scores[Math.floor((total - 1) / 2)] + scores[Math.floor(total / 2)]) / 2 : 0,
    pending: applicants.filter(a => a.status === 'PENDING_REVIEW' || a.status === 'NEEDS_INFO').length,
    lowRiskPercentage: percentage(riskCounts.LOW),
    riskCounts,
    riskDistribution: [
      { label: 'Low Risk', value: riskCounts.LOW, color: '#10b981' },
      { label: 'Moderate Risk', value: riskCounts.MODERATE, color: '#6366f1' },
      { label: 'High Risk', value: riskCounts.HIGH, color: '#f43f5e' },
      { label: 'Unassessed', value: riskCounts.UNASSESSED, color: '#64748b' }
    ],
    scoreDistribution: buckets.map(b => ({ label: b.label, color: b.color,
      value: scores.filter(score => score >= b.min && score < b.max).length })),
    statusDistribution: [
      { label: 'Approved', status: 'APPROVED', color: '#10b981' },
      { label: 'Pending review', status: 'PENDING_REVIEW', color: '#6366f1' },
      { label: 'Needs information', status: 'NEEDS_INFO', color: '#f59e0b' },
      { label: 'Paused', status: 'PAUSED', color: '#f43f5e' }
    ].map(s => ({ label: s.label, color: s.color, value: applicants.filter(a => a.status === s.status).length }))
  };
}
