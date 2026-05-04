// Collection of sample texts for typing tests
const typingTexts = [
  "const velocity = (distance, time) => distance / time; // Calculating hyper-sonic typing speeds in real-time.",
  "The quick brown fox jumps over the lazy dog. A classic pangram for testing the limits of human precision.",
  "React hooks like useEffect and useCallback are essential for building high-performance interactive interfaces.",
  "Cyberpunk aesthetics often feature high-tech and low-life themes, illuminated by vibrant neon lights and rainy streets.",
  "Deep learning and neural networks are transforming how we interact with technology and solve complex global challenges.",
  "The architectural elegance of a well-designed system is measured by its scalability, reliability, and maintainability.",
  "Modern web development requires a deep understanding of CSS Grid, Flexbox, and responsive design principles.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. - Steve Jobs",
  "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs",
  "function igniteVelocity() { return new Promise((resolve) => setTimeout(resolve, 1000)); }",
  "import { motion } from 'framer-motion'; export const Hero = () => <motion.div animate={{ opacity: 1 }} />;",
];

// Get random text
export const getRandomText = (): string => {
  return typingTexts[Math.floor(Math.random() * typingTexts.length)];
};

// Get all available texts
export const getAllTexts = (): string[] => {
  return typingTexts;
};
