import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizePortfolio } from '../src/lib/portfolio.ts';
import { roundHalfEven } from '../src/lib/scoring.ts';

test('empty queues stay empty rather than becoming a 1,284-applicant portfolio', () => {
  const result = summarizePortfolio([]);
  assert.equal(result.total, 0);
  assert.equal(result.pending, 0);
  assert.equal(result.averageScore, 0);
  assert.equal(result.lowRiskPercentage, 0);
});

test('every loaded applicant appears once in score, risk and status charts', () => {
  const scores = [0, 49, 50, 65, 75, 85, 100];
  const applicants = scores.map((trustScore, index) => ({ trustScore, status: index ? 'APPROVED' : 'PENDING_REVIEW', riskTier: index ? 'LOW' : undefined }));
  const result = summarizePortfolio(applicants);
  assert.equal(result.total, 7);
  assert.equal(result.pending, 1);
  assert.equal(result.median, 65);
  assert.deepEqual(result.scoreDistribution.map(b => b.value), [2, 1, 1, 1, 2]);
  assert.equal(result.riskDistribution.reduce((sum, b) => sum + b.value, 0), 7);
  assert.equal(result.statusDistribution.reduce((sum, b) => sum + b.value, 0), 7);
});

test('recorded decisions change the displayed pending count', () => {
  assert.equal(summarizePortfolio([{ trustScore: 84, status: 'PENDING_REVIEW' }]).pending, 1);
  assert.equal(summarizePortfolio([{ trustScore: 84, status: 'APPROVED' }]).pending, 0);
});

test('offline scoring rounds ties like Python, including Ravi at 82.5', () => {
  for (const [value, expected] of [[82.5, 82], [83.5, 84], [76.5, 76], [75.6, 76], [0.5, 0]]) {
    assert.equal(roundHalfEven(value), expected);
  }
});
