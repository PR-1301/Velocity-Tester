import React from 'react';

interface ControlsProps {
  onReset: () => void;
  isRunning: boolean;
  timeLimit: number;
  onTimeLimitChange: (time: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onReset,
  isRunning,
  timeLimit,
  onTimeLimitChange,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Time Mode Selection */}
      <div className="flex gap-2 order-2 sm:order-1">
        {[15, 30, 60, 120].map((time) => (
          <button
            key={time}
            onClick={() => onTimeLimitChange(time)}
            disabled={isRunning}
            className={`time-btn px-5 py-2.5 rounded-xl text-sm font-mono tracking-wider transition-all duration-300 ${
              timeLimit === time ? 'active' : ''
            }`}
          >
            {time < 60 ? `${time}s` : `${time / 60}m`}
          </button>
        ))}
      </div>

      {/* Reset / Stop Button */}
      <button
        onClick={onReset}
        className={`group relative px-6 py-2.5 rounded-xl font-semibold text-sm tracking-wider uppercase transition-all duration-300 order-1 sm:order-2 overflow-hidden ${
          isRunning
            ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/40 text-red-400 hover:border-red-400 hover:shadow-neon-pink'
            : 'btn-neon'
        }`}
      >
        {/* Hover shimmer */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        <span className="relative z-10 flex items-center gap-2">
          {isRunning ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Stop
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </>
          )}
        </span>
      </button>
    </div>
  );
};
