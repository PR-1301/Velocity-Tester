import { useState, useEffect, useCallback } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { TypingBox } from './components/TypingBox';
import { StatsPanel } from './components/StatsPanel';
import { ResultModal } from './components/ResultModal';
import { Controls } from './components/Controls';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { useMechanicalSound } from './hooks/useSound';
import {
  calculateWPM,
  calculateAccuracy,
  countCorrectCharacters,
} from './utils/metrics';
import { getRandomText } from './utils/generateText';

interface AppState {
  targetText: string;
  userInput: string;
  timeElapsed: number;
  timeLimit: number;
  isRunning: boolean;
  isComplete: boolean;
  wpm: number;
  accuracy: number;
  correctChars: number;
}

function App() {
  const [state, setState] = useState<AppState>({
    targetText: getRandomText(),
    userInput: '',
    timeElapsed: 0,
    timeLimit: 60,
    isRunning: false,
    isComplete: false,
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }
    const savedTheme = window.localStorage.getItem('keyboard-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('keyboard-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { playClick } = useMechanicalSound();

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (state.isRunning && !state.isComplete) {
      interval = setInterval(() => {
        setState((prev) => {
          const newTimeElapsed = prev.timeElapsed + 1;

          if (newTimeElapsed >= prev.timeLimit) {
            return {
              ...prev,
              isRunning: false,
              isComplete: true,
              timeElapsed: prev.timeLimit,
            };
          }

          const wpm = calculateWPM(prev.userInput.length, newTimeElapsed);
          const correctChars = countCorrectCharacters(prev.targetText, prev.userInput);
          const accuracy = calculateAccuracy(
            correctChars,
            prev.userInput.length || 1
          );

          return {
            ...prev,
            timeElapsed: newTimeElapsed,
            wpm,
            accuracy,
            correctChars,
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [state.isRunning, state.isComplete]);

  // Handle Input Change
  const handleInputChange = useCallback((value: string) => {
    // Play sound on each keypress
    playClick();

    setState((prev) => {
      if (value.length > prev.targetText.length) {
        return prev;
      }

      const isFirstKeystroke = prev.userInput.length === 0 && value.length > 0;
      const newIsRunning = isFirstKeystroke ? true : prev.isRunning;
      const isTextComplete = value === prev.targetText;

      const wpm = calculateWPM(value.length, prev.timeElapsed || 1);
      const correctChars = countCorrectCharacters(prev.targetText, value);
      const accuracy = calculateAccuracy(correctChars, value.length || 1);

      return {
        ...prev,
        userInput: value,
        isRunning: newIsRunning,
        isComplete: isTextComplete,
        wpm,
        accuracy,
        correctChars,
      };
    });
  }, [playClick]);

  const handleReset = useCallback(() => {
    setState({
      targetText: getRandomText(),
      userInput: '',
      timeElapsed: 0,
      timeLimit: state.timeLimit,
      isRunning: false,
      isComplete: false,
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
    });
  }, [state.timeLimit]);

  const handleTimeLimitChange = useCallback((newLimit: number) => {
    setState((prev) => ({
      ...prev,
      timeLimit: newLimit,
      timeElapsed: 0,
      userInput: '',
      targetText: getRandomText(),
      isRunning: false,
      isComplete: false,
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
    }));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--surface)] text-[var(--text-main)] selection:bg-[var(--accent)] selection:text-[var(--surface)]">
      {/* Animated Background Layers */}
      <ParticleBackground />
      <div className="bg-grid opacity-20" />
      <div className="bg-radial-glow" />
      
      {/* Dynamic Mouse Glow */}
      <div 
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-20 blur-[100px] transition-all duration-300 ease-out"
        style={{
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          background: 'radial-gradient(circle, #00f5ff, #bf5af2)',
        }}
      />

      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-20 left-10 text-8xl font-mono animate-float rotate-12">JS</div>
        <div className="absolute bottom-40 right-20 text-8xl font-mono animate-float-delayed -rotate-12">TS</div>
        <div className="absolute top-1/2 right-1/4 text-6xl font-mono animate-float opacity-50">REACT</div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">
                <span className="gradient-text drop-shadow-[0_0_20px_rgba(0,245,255,0.3)]">VELOCITY</span>
              </h1>
              <p className="text-white/20 text-xs font-bold tracking-[0.4em] uppercase">
                Hyper-Sonic Typing Engine
              </p>
            </div>

            <div className="flex items-center gap-4">
              {state.isRunning && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green/5 border border-neon-green/20 animate-pulse-glow">
                  <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#30d158]" />
                  <span className="text-neon-green text-[10px] font-black tracking-widest uppercase">System Active</span>
                </div>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>

              <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 border-neon-cyan/20">
                ⚡
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Stats Panel */}
        <StatsPanel
          wpm={state.wpm}
          accuracy={state.accuracy}
          timeElapsed={state.timeElapsed}
          charsTyped={state.userInput.length}
          isRunning={state.isRunning}
          timeLimit={state.timeLimit}
        />

        {/* Controls */}
        <Controls
          onReset={handleReset}
          isRunning={state.isRunning}
          timeLimit={state.timeLimit}
          onTimeLimitChange={handleTimeLimitChange}
        />

        {/* Typing Box */}
        <TypingBox
          targetText={state.targetText}
          userInput={state.userInput}
          onInputChange={handleInputChange}
          isActive={!state.isComplete}
          isComplete={state.isComplete}
        />

        {/* Virtual Keyboard */}
        <VirtualKeyboard />

        {/* Result Modal */}
        <ResultModal
          isOpen={state.isComplete}
          wpm={state.wpm}
          accuracy={state.accuracy}
          timeElapsed={state.timeElapsed}
          charsTyped={state.userInput.length}
          correctChars={state.correctChars}
          onRetry={handleReset}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 border-t border-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <p className="text-white/10 text-[10px] font-bold tracking-widest uppercase">
              Precision Optimized
            </p>
            <p className="text-white/10 text-[10px] font-bold tracking-widest uppercase">
              Low Latency Engine
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-white/10 text-[10px] font-bold tracking-widest uppercase">System v2.4.0</span>
            <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-neon-cyan w-1/3 animate-shimmer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
