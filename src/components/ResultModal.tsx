import React, { useEffect, useState, useRef } from 'react';
import { formatTime } from '../utils/metrics';

interface ResultModalProps {
  isOpen: boolean;
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  charsTyped: number;
  correctChars: number;
  onRetry: () => void;
}

interface ConfettiPiece {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: number;
  rotation: number;
}

const getPerformanceData = (wpm: number, accuracy: number) => {
  if (wpm >= 80 && accuracy >= 95) return { level: 'Legendary', emoji: '🏆', color: '#00f5ff', gradient: 'from-cyan-400 to-blue-500' };
  if (wpm >= 60 && accuracy >= 90) return { level: 'Excellent', emoji: '🔥', color: '#30d158', gradient: 'from-green-400 to-emerald-500' };
  if (wpm >= 40 && accuracy >= 85) return { level: 'Great', emoji: '⚡', color: '#ff9f0a', gradient: 'from-yellow-400 to-orange-500' };
  if (wpm >= 20 && accuracy >= 80) return { level: 'Good', emoji: '👍', color: '#bf5af2', gradient: 'from-purple-400 to-violet-500' };
  return { level: 'Keep Going', emoji: '💪', color: '#ff375f', gradient: 'from-pink-400 to-red-500' };
};

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  wpm,
  accuracy,
  timeElapsed,
  charsTyped,
  correctChars,
  onRetry,
}) => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [animatedWpm, setAnimatedWpm] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const animFrameRef = useRef<number>();

  // Confetti + entrance animation
  useEffect(() => {
    if (!isOpen) {
      setShowContent(false);
      setAnimatedWpm(0);
      setAnimatedAccuracy(0);
      return;
    }

    // Delay content for entrance animation
    const timer = setTimeout(() => setShowContent(true), 100);

    // Generate confetti
    const colors = ['#00f5ff', '#bf5af2', '#ff375f', '#30d158', '#ff9f0a', '#0a84ff'];
    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${2 + Math.random() * 2}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setConfetti(pieces);

    // Animate numbers counting up
    const startTime = performance.now();
    const duration = 1200;

    const animateNumbers = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedWpm(Math.round(wpm * eased));
      setAnimatedAccuracy(Math.round(accuracy * eased));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateNumbers);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateNumbers);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, wpm, accuracy]);

  if (!isOpen) return null;

  const perf = getPerformanceData(wpm, accuracy);

  return (
    <>
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}

      {/* Modal Overlay */}
      <div className={`fixed inset-0 modal-overlay flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div
          className={`glass-card rounded-3xl max-w-lg w-full p-8 space-y-6 relative overflow-hidden transition-all duration-500 ${
            showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'
          }`}
          style={{
            border: `1px solid ${perf.color}33`,
            boxShadow: `0 0 60px ${perf.color}15, 0 20px 60px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Decorative glow orbs */}
          <div
            className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: perf.color }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: perf.color }}
          />

          {/* Performance Badge */}
          <div className="text-center relative z-10">
            <div
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-wider uppercase mb-4 transition-all duration-500 ${showContent ? 'animate-bounce-in' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${perf.color}20, ${perf.color}10)`,
                border: `1px solid ${perf.color}40`,
                color: perf.color,
                textShadow: `0 0 20px ${perf.color}60`,
              }}
            >
              <span className="text-xl">{perf.emoji}</span>
              {perf.level}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Test Complete!
            </h2>
            <p className="text-white/30 text-sm mt-2">Here's how you performed</p>
          </div>

          {/* Main Stats — WPM & Accuracy */}
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {/* WPM */}
            <div className="glass-card rounded-2xl p-5 text-center">
              <div className="text-4xl font-extrabold neon-text-cyan font-mono">
                {animatedWpm}
              </div>
              <div className="text-xs uppercase tracking-[0.15em] text-white/30 mt-1 font-medium">
                Words / Min
              </div>
            </div>
            {/* Accuracy */}
            <div className="glass-card rounded-2xl p-5 text-center">
              <div
                className="text-4xl font-extrabold font-mono"
                style={{
                  color: perf.color,
                  textShadow: `0 0 20px ${perf.color}50`,
                }}
              >
                {animatedAccuracy}%
              </div>
              <div className="text-xs uppercase tracking-[0.15em] text-white/30 mt-1 font-medium">
                Accuracy
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-0 relative z-10">
            {[
              { label: 'Time Elapsed', value: formatTime(timeElapsed), icon: '⏱️' },
              { label: 'Total Characters', value: charsTyped.toString(), icon: '📝' },
              { label: 'Correct Characters', value: `${correctChars} / ${charsTyped}`, icon: '✅' },
              { label: 'Error Rate', value: `${charsTyped > 0 ? Math.round(((charsTyped - correctChars) / charsTyped) * 100) : 0}%`, icon: '❌' },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`flex justify-between items-center py-3 transition-all duration-500 ${
                  index < 3 ? 'border-b border-white/5' : ''
                }`}
                style={{
                  transitionDelay: `${0.3 + index * 0.1}s`,
                  opacity: showContent ? 1 : 0,
                  transform: showContent ? 'translateX(0)' : 'translateX(-20px)',
                }}
              >
                <span className="flex items-center gap-2 text-white/40 text-sm font-medium">
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-white/80 font-semibold font-mono text-sm">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="btn-neon w-full py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase relative z-10 group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
