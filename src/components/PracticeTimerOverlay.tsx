import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minimize2,
  Maximize2,
  X,
  Clock,
  CheckCircle2,
  ListOrdered,
  AlertTriangle,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { formatTime, calculateLapsSummary, QuestionLap } from '../utils/timerUtils';
import { ExamQuestion } from '../types/archive';

interface PracticeTimerOverlayProps {
  questions: ExamQuestion[];
  onClose: () => void;
  onJumpToQuestion?: (questionId: string) => void;
}

export const PracticeTimerOverlay: React.FC<PracticeTimerOverlayProps> = ({
  questions,
  onClose,
  onJumpToQuestion,
}) => {
  // Timer mode: 'countdown' | 'stopwatch'
  const [timerMode, setTimerMode] = useState<'countdown' | 'stopwatch'>('countdown');
  const [initialDuration, setInitialDuration] = useState<number>(20 * 60); // 20 mins default for weekly quiz
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Question tracking
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestionSeconds, setCurrentQuestionSeconds] = useState<number>(0);
  const [laps, setLaps] = useState<QuestionLap[]>([]);

  // Sound chime reference (web audio API beep)
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // Audio might be blocked by browser policy without user gesture
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        setCurrentQuestionSeconds((prev) => prev + 1);

        if (timerMode === 'countdown') {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              playAlertSound();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode]);

  // Presets
  const applyPreset = (minutes: number) => {
    setIsRunning(false);
    setTimerMode('countdown');
    const sec = minutes * 60;
    setInitialDuration(sec);
    setSecondsRemaining(sec);
    setElapsedSeconds(0);
    setCurrentQuestionSeconds(0);
  };

  const setStopwatchMode = () => {
    setIsRunning(false);
    setTimerMode('stopwatch');
    setElapsedSeconds(0);
    setCurrentQuestionSeconds(0);
  };

  const handleAddMinutes = (min: number) => {
    setSecondsRemaining((prev) => prev + min * 60);
    setInitialDuration((prev) => prev + min * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'countdown') {
      setSecondsRemaining(initialDuration);
    } else {
      setElapsedSeconds(0);
    }
    setCurrentQuestionSeconds(0);
  };

  // Record time for current question and move to next
  const handleLapAndNextQuestion = () => {
    const qNum = questions[currentQuestionIndex]
      ? questions[currentQuestionIndex].number
      : (currentQuestionIndex + 1).toString();

    setLaps((prev) => [...prev, { questionNumber: qNum, durationSeconds: currentQuestionSeconds }]);
    setCurrentQuestionSeconds(0);

    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      if (questions[nextIdx] && onJumpToQuestion) {
        onJumpToQuestion(questions[nextIdx].id);
      }
    }
  };

  const currentQ = questions[currentQuestionIndex];
  const lapsSummary = calculateLapsSummary(laps);

  const displayTime = timerMode === 'countdown' ? secondsRemaining : elapsedSeconds;
  const isTimeCritical = timerMode === 'countdown' && secondsRemaining <= 60 && secondsRemaining > 0;
  const isTimeUp = timerMode === 'countdown' && secondsRemaining === 0;

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-40 max-w-[calc(100vw-1rem)] bg-[#420B16] text-white rounded-full shadow-2xl border-2 border-amber-400 p-1.5 sm:p-2 pl-3 sm:pl-4 flex items-center gap-2 sm:gap-3 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRunning ? 'text-amber-300 animate-pulse' : 'text-stone-300'}`} />
          <span className="font-mono font-bold text-sm sm:text-base text-amber-200">
            {formatTime(displayTime)}
          </span>
          {currentQ && (
            <span className="text-[10px] sm:text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 rounded-full text-stone-200 truncate max-w-[70px] sm:max-w-none">
              Q {currentQ.number}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-1 sm:p-1.5 rounded-full bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors"
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={() => setIsMinimized(false)}
          className="p-1 sm:p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 transition-colors"
          title="Expand Timer HUD"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Expanded Full Practice Mode HUD
  return (
    <div className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 z-40 w-[calc(100vw-1rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-[#540F1D] overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 duration-200 select-none">
      {/* Top Header */}
      <div className="bg-[#480D19] text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between border-b border-[#320811]">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-300" />
          <span className="font-heading font-bold text-xs sm:text-sm tracking-wide text-white truncate">
            Practice Mode · Timer HUD
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Minimize to floating pill"
            aria-label="Minimize timer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Exit Practice Mode"
            aria-label="Close timer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Clock Face & Controls */}
      <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 space-y-2.5 sm:space-y-3">
        {/* Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px]">
          <button
            onClick={() => applyPreset(15)}
            className={`px-1.5 sm:px-2 py-0.5 rounded-md border transition-colors ${
              timerMode === 'countdown' && initialDuration === 15 * 60
                ? 'bg-[#540F1D] text-white border-transparent font-bold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            15m
          </button>
          <button
            onClick={() => applyPreset(20)}
            className={`px-1.5 sm:px-2 py-0.5 rounded-md border transition-colors ${
              timerMode === 'countdown' && initialDuration === 20 * 60
                ? 'bg-[#540F1D] text-white border-transparent font-bold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            20m
          </button>
          <button
            onClick={() => applyPreset(30)}
            className={`px-1.5 sm:px-2 py-0.5 rounded-md border transition-colors ${
              timerMode === 'countdown' && initialDuration === 30 * 60
                ? 'bg-[#540F1D] text-white border-transparent font-bold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            30m
          </button>
          <button
            onClick={() => applyPreset(45)}
            className={`px-1.5 sm:px-2 py-0.5 rounded-md border transition-colors ${
              timerMode === 'countdown' && initialDuration === 45 * 60
                ? 'bg-[#540F1D] text-white border-transparent font-bold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            45m
          </button>
          <button
            onClick={setStopwatchMode}
            className={`px-1.5 sm:px-2 py-0.5 rounded-md border transition-colors ${
              timerMode === 'stopwatch'
                ? 'bg-[#540F1D] text-white border-transparent font-bold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            Stopwatch
          </button>
        </div>

        {/* Big Time Display */}
        <div
          className={`py-2 px-4 rounded-xl text-center border transition-all ${
            isTimeUp
              ? 'bg-red-50 border-red-300 text-red-700 animate-bounce'
              : isTimeCritical
              ? 'bg-amber-50 border-amber-400 text-amber-900 animate-pulse'
              : 'bg-white border-stone-200 text-stone-900'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 mb-0.5">
            {timerMode === 'countdown' ? 'Time Remaining' : 'Elapsed Practice Time'}
          </div>
          <div className="font-mono font-extrabold text-3xl sm:text-4xl tracking-tight text-[#480D19]">
            {formatTime(displayTime)}
          </div>
          {isTimeUp && (
            <div className="text-xs font-bold text-red-600 mt-1 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Time&apos;s Up!</span>
            </div>
          )}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
              isRunning
                ? 'bg-stone-200 hover:bg-stone-300 text-stone-900'
                : 'bg-[#540F1D] hover:bg-[#6F1528] text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{displayTime === 0 ? 'Restart' : 'Start Timer'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 transition-colors"
            title="Reset Timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {timerMode === 'countdown' && (
            <>
              <button
                onClick={() => handleAddMinutes(1)}
                className="px-2 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold"
                title="Add 1 minute"
              >
                +1m
              </button>
              <button
                onClick={() => handleAddMinutes(5)}
                className="px-2 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold"
                title="Add 5 minutes"
              >
                +5m
              </button>
            </>
          )}
        </div>
      </div>

      {/* Question Lap / Tracker Section */}
      <div className="p-3.5 space-y-3 bg-white max-h-48 overflow-y-auto">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-800 flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-[#540F1D]" />
            <span>Question Tracker</span>
          </span>
          <span className="text-stone-500 font-mono text-[11px]">
            This Question: <strong>{formatTime(currentQuestionSeconds)}</strong>
          </span>
        </div>

        {/* Current Question Action */}
        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-stone-500 uppercase font-bold">Currently Solving:</div>
            <div className="font-heading font-bold text-sm text-[#540F1D]">
              {currentQ ? `Question ${currentQ.number} (${currentQ.type})` : `Question ${currentQuestionIndex + 1}`}
            </div>
          </div>

          <button
            onClick={handleLapAndNextQuestion}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all shadow-xs shrink-0"
            title="Record time spent and advance to next question"
          >
            <span>Lap & Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recorded Question Laps List */}
        {laps.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>Completed Questions ({laps.length})</span>
              <span>Avg: {formatTime(lapsSummary.averageSeconds)}</span>
            </div>

            <div className="space-y-1">
              {laps.map((lap, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 bg-stone-50 rounded-lg text-xs flex items-center justify-between text-stone-700 border border-stone-100"
                >
                  <span className="font-semibold text-stone-800">Q {lap.questionNumber}</span>
                  <span className="font-mono text-stone-600">{formatTime(lap.durationSeconds)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="p-2.5 bg-stone-100 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
        <span>Total Practice: {formatTime(elapsedSeconds)}</span>
        <span className="text-[#540F1D] font-medium">Self-Timed Mode</span>
      </div>
    </div>
  );
};
