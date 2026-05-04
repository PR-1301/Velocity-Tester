import React, { useEffect, useRef } from 'react';

interface TypingBoxProps {
  targetText: string;
  userInput: string;
  onInputChange: (value: string) => void;
  isActive: boolean;
  isComplete: boolean;
}

export const TypingBox: React.FC<TypingBoxProps> = ({
  targetText,
  userInput,
  onInputChange,
  isActive,
  isComplete,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Auto-scroll to keep cursor in view
  useEffect(() => {
    if (cursorRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const cursor = cursorRef.current;
      const cursorTop = cursor.offsetTop;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      if (cursorTop > scrollTop + containerHeight - 60) {
        container.scrollTo({
          top: cursorTop - containerHeight + 80,
          behavior: 'smooth',
        });
      }
    }
  }, [userInput]);

  // Prevent copy-paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  // Focus input when clicking the text display area
  const handleContainerClick = () => {
    if (inputRef.current && isActive) {
      inputRef.current.focus();
    }
  };

  // Get character styling class
  const getCharClass = (index: number): string => {
    if (index >= userInput.length) {
      if (index === userInput.length) return 'typing-char-cursor';
      return 'typing-char-pending';
    }
    return userInput[index] === targetText[index]
      ? 'typing-char-correct'
      : 'typing-char-incorrect';
  };

  const progress = userInput.length / targetText.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Progress bar */}
      <div className="relative h-1 w-full rounded-full overflow-hidden bg-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #00f5ff, #bf5af2, #ff375f)',
            boxShadow: '0 0 12px rgba(0, 245, 255, 0.5)',
          }}
        />
      </div>

      {/* Display Text with Character Highlighting */}
      <div
        ref={textContainerRef}
        onClick={handleContainerClick}
        className="glass-card rounded-2xl p-6 md:p-8 min-h-[160px] max-h-[280px] overflow-y-auto cursor-text relative group"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Top-left glow accent */}
        <div
          className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.3), transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <div className="font-mono text-lg md:text-xl leading-[2] tracking-wide text-white/25 break-words select-none relative z-10">
          {targetText.split('').map((char, index) => (
            <span
              key={index}
              ref={index === userInput.length ? cursorRef : undefined}
              className={`transition-all duration-75 inline-block ${getCharClass(index)}`}
              style={{
                paddingBottom: '2px',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* Bottom instruction overlay when not started */}
        {userInput.length === 0 && !isComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-900/40 backdrop-blur-sm rounded-2xl z-20 transition-all duration-500">
            <div className="text-center space-y-3 animate-float">
              <div className="text-4xl">⌨️</div>
              <p className="text-white/40 text-sm font-medium tracking-wider uppercase">
                Click here & start typing
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-xs text-white/20">Timer starts automatically</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        onPaste={handlePaste}
        disabled={isComplete}
        className="typing-input w-full px-5 py-3 rounded-xl font-mono text-white/90 text-base tracking-wider"
        autoComplete="off"
        spellCheck="false"
        placeholder={isComplete ? '✅ Test complete!' : 'Start typing here...'}
      />
    </div>
  );
};
