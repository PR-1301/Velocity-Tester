// Calculate Words Per Minute
export const calculateWPM = (characters: number, timeSeconds: number): number => {
  if (timeSeconds === 0) return 0;
  const words = characters / 5;
  const minutes = timeSeconds / 60;
  return Math.round(words / minutes);
};

// Calculate Accuracy Percentage
export const calculateAccuracy = (correct: number, total: number): number => {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
};

// Get character status (correct, incorrect, or pending)
export const getCharacterStatus = (
  original: string,
  typed: string,
  index: number
): 'correct' | 'incorrect' | 'pending' => {
  if (index >= typed.length) return 'pending';
  return original[index] === typed[index] ? 'correct' : 'incorrect';
};

// Count correct characters
export const countCorrectCharacters = (original: string, typed: string): number => {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    if (original[i] === typed[i]) correct++;
  }
  return correct;
};

// Format time display
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
