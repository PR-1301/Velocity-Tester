import React from 'react';
import { formatTime } from '../utils/metrics';

interface StatsPanelProps {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  charsTyped: number;
  isRunning: boolean;
  timeLimit: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  glowClass: string;
  icon: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, suffix, color, glowClass, icon, progress }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (progress ?? 0));

  return (
    <div className="glass-card stat-card rounded-2xl p-5 text-center group cursor-default">
      {/* Background shimmer */}
      <div className="absolute inset-0 rounded-2xl shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="text-2xl mb-2 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 transform">
          {icon}
        </div>

        {/* Circular Progress Ring */}
        {progress !== undefined && (
          <div className="relative mx-auto w-24 h-24 mb-3">
            <svg className="w-full h-full" viewBox="0 0 80 80">
              {/* Background ring */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="4"
              />
              {/* Progress ring */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="progress-ring-circle"
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
              />
            </svg>
            {/* Value inside ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-2xl font-bold ${glowClass} transition-all duration-300`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {value}
                {suffix && <span className="text-sm opacity-70">{suffix}</span>}
              </span>
            </div>
          </div>
        )}

        {/* Value (no ring) */}
        {progress === undefined && (
          <div
            className={`text-3xl md:text-4xl font-bold ${glowClass} mb-2 transition-all duration-300`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {value}
            {suffix && <span className="text-lg opacity-70">{suffix}</span>}
          </div>
        )}

        {/* Label */}
        <div className="text-xs uppercase tracking-[0.2em] text-white/30 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
};

export const StatsPanel: React.FC<StatsPanelProps> = ({
  wpm,
  accuracy,
  timeElapsed,
  charsTyped,
  isRunning,
  timeLimit,
}) => {
  const timeProgress = Math.min(timeElapsed / timeLimit, 1);
  const accuracyProgress = accuracy / 100;
  const wpmProgress = Math.min(wpm / 120, 1); // Normalize to 120 WPM max

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
      <StatCard
        label="Speed"
        value={wpm}
        color="#00f5ff"
        glowClass="neon-text-cyan"
        icon="⚡"
        progress={wpmProgress}
      />
      <StatCard
        label="Accuracy"
        value={accuracy}
        suffix="%"
        color={accuracy >= 90 ? '#30d158' : accuracy >= 70 ? '#ff9f0a' : '#ff375f'}
        glowClass={accuracy >= 90 ? 'neon-text-green' : accuracy >= 70 ? 'neon-text-orange' : 'neon-text-pink'}
        icon="🎯"
        progress={accuracyProgress}
      />
      <StatCard
        label="Time"
        value={formatTime(timeElapsed)}
        color={isRunning ? '#ff9f0a' : '#bf5af2'}
        glowClass={isRunning ? 'neon-text-orange' : 'neon-text-purple'}
        icon="⏱️"
        progress={timeProgress}
      />
      <StatCard
        label="Characters"
        value={charsTyped}
        color="#bf5af2"
        glowClass="neon-text-purple"
        icon="✍️"
      />
    </div>
  );
};
