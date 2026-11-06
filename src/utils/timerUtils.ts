export interface QuestionLap {
  questionNumber: string;
  durationSeconds: number;
}

export function formatTime(totalSeconds: number): string {
  const isNegative = totalSeconds < 0;
  const absSec = Math.abs(totalSeconds);
  const hours = Math.floor(absSec / 3600);
  const minutes = Math.floor((absSec % 3600) / 60);
  const seconds = absSec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const formatted = hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  return isNegative ? `-${formatted}` : formatted;
}

export function calculateLapsSummary(laps: QuestionLap[]) {
  if (laps.length === 0) {
    return {
      totalTimeSeconds: 0,
      averageSeconds: 0,
      fastestQuestion: null,
      slowestQuestion: null,
      count: 0,
    };
  }

  const totalTimeSeconds = laps.reduce((acc, lap) => acc + lap.durationSeconds, 0);
  const averageSeconds = Math.round(totalTimeSeconds / laps.length);

  let fastest = laps[0];
  let slowest = laps[0];

  for (const lap of laps) {
    if (lap.durationSeconds < fastest.durationSeconds) fastest = lap;
    if (lap.durationSeconds > slowest.durationSeconds) slowest = lap;
  }

  return {
    totalTimeSeconds,
    averageSeconds,
    fastestQuestion: fastest.questionNumber,
    slowestQuestion: slowest.questionNumber,
    count: laps.length,
  };
}
