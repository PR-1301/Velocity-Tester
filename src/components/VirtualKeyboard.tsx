import React, { useEffect, useState } from 'react';

const KEYBOARD_LAYOUT = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Space']
];

interface VirtualKeyboardProps {
  lastKeyPressed?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ lastKeyPressed }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (lastKeyPressed) {
      setActiveKey(lastKeyPressed.toUpperCase());
      const timer = setTimeout(() => setActiveKey(null), 150);
      return () => clearTimeout(timer);
    }
  }, [lastKeyPressed]);

  // Handle physical keyboard events for visual feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toUpperCase();
      if (e.code === 'Space') key = 'SPACE';
      if (e.code === 'Backspace') key = 'BACKSPACE';
      if (e.code === 'Tab') key = 'TAB';
      if (e.code === 'Enter') key = 'ENTER';
      if (e.shiftKey && e.code.startsWith('Shift')) key = 'SHIFT';
      
      setActiveKey(key);
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Backspace': return 'w-20';
      case 'Tab': return 'w-14';
      case 'CapsLock': return 'w-20';
      case 'Enter': return 'w-20';
      case 'Shift': return 'w-24';
      case 'Space': return 'w-full max-w-[400px]';
      default: return 'w-10';
    }
  };

  const isKeyActive = (key: string) => {
    const upperKey = key.toUpperCase();
    if (key === 'Space') return activeKey === 'SPACE';
    return activeKey === upperKey;
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 p-6 glass-card rounded-3xl animate-slide-up opacity-40 hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.4s' }}>
      <div className="flex flex-col gap-2">
        {KEYBOARD_LAYOUT.map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5">
            {row.map((key) => (
              <div
                key={key}
                className={`
                  ${getKeyWidth(key)} h-10 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-tighter uppercase transition-all duration-75
                  ${isKeyActive(key) 
                    ? 'bg-neon-cyan text-surface-900 shadow-neon-cyan scale-95 translate-y-0.5' 
                    : 'bg-white/5 border border-white/10 text-white/40'}
                `}
              >
                {key === 'Space' ? '' : key}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
