import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTime, calculateLapsSummary, QuestionLap } from './timerUtils';

test('formatTime formats seconds into MM:SS correctly', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(599), '09:59');
  assert.equal(formatTime(1200), '20:00');
});

test('formatTime formats hours into HH:MM:SS when over 3600 seconds', () => {
  assert.equal(formatTime(3665), '01:01:05');
});

test('calculateLapsSummary computes accurate totals and averages', () => {
  const laps: QuestionLap[] = [
    { questionNumber: '1', durationSeconds: 60 },
    { questionNumber: '2', durationSeconds: 120 },
    { questionNumber: '3', durationSeconds: 90 },
  ];

  const summary = calculateLapsSummary(laps);
  assert.equal(summary.totalTimeSeconds, 270);
  assert.equal(summary.averageSeconds, 90);
  assert.equal(summary.fastestQuestion, '1');
  assert.equal(summary.slowestQuestion, '2');
  assert.equal(summary.count, 3);
});

test('calculateLapsSummary handles empty laps list gracefully', () => {
  const summary = calculateLapsSummary([]);
  assert.equal(summary.totalTimeSeconds, 0);
  assert.equal(summary.count, 0);
  assert.equal(summary.fastestQuestion, null);
});
