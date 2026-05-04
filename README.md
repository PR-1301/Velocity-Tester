# Keyboard Speed Tester

A high-performance, real-time keyboard speed testing application built with React, TypeScript, and Tailwind CSS.

## Features

✨ **Real-Time Metrics**
- Words Per Minute (WPM) calculation
- Accuracy percentage tracking
- Character count display
- Live timer with multiple modes

🎯 **Interactive Typing Experience**
- Character-by-character comparison with color coding (green for correct, red for incorrect)
- Smooth cursor progression
- Automatic timer start on first keystroke
- Prevent copy-paste functionality

📊 **Results Display**
- Performance level badge (Excellent, Great, Good, Fair, Keep Practicing)
- Detailed statistics modal
- Retry functionality to start new test

⚙️ **Customization**
- Multiple time modes (15s, 30s, 60s)
- Random text generation from curated dataset
- Responsive design for all screen sizes
- Dark mode support

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **JetBrains Mono Font** - Monospace typing display

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

1. **Clone/Navigate to the project directory**
   ```bash
   cd Keyboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will automatically open at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
keyboard-speed-tester/
├── src/
│   ├── components/
│   │   ├── TypingBox.tsx          # Main input and text display
│   │   ├── StatsPanel.tsx         # Live metrics display
│   │   ├── ResultModal.tsx        # Results and performance badge
│   │   └── Controls.tsx           # Time mode and reset controls
│   ├── utils/
│   │   ├── metrics.ts             # WPM, accuracy calculations
│   │   └── generateText.ts        # Sample text dataset
│   ├── App.tsx                    # Main application state
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## How It Works

1. **Initialization**: A random paragraph is displayed for typing
2. **Input Handling**: User types in the input field
3. **Timer Start**: Timer begins on the first keystroke
4. **Real-Time Feedback**: Characters are highlighted as correct (green) or incorrect (red)
5. **Metrics Calculation**: WPM and accuracy update live
6. **Test Completion**: Test ends when either:
   - Time limit is reached
   - User completes the entire paragraph
7. **Results**: Performance badge and detailed statistics are displayed

## Metrics Calculation

**Words Per Minute (WPM)**
```
WPM = (characters_typed / 5) / (time_elapsed_in_minutes)
```

**Accuracy**
```
Accuracy = (correct_characters / total_typed_characters) × 100
```

## Keyboard Shortcuts

- **Tab**: Move focus to input field
- **Click/Focus**: Auto-focus on input field when test is active

## Performance Levels

- **Excellent**: WPM ≥ 80, Accuracy ≥ 95%
- **Great**: WPM ≥ 60, Accuracy ≥ 90%
- **Good**: WPM ≥ 40, Accuracy ≥ 85%
- **Fair**: WPM ≥ 20, Accuracy ≥ 80%
- **Keep Practicing**: Below fair level

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

## Development Notes

### Typing Prevention
- Copy-paste is disabled to ensure fair testing
- Users cannot type beyond the target text length

### State Management
- Uses React hooks (`useState`, `useEffect`, `useCallback`)
- Local state for all metrics and test status
- No external state management needed

### Styling
- Tailwind CSS for all UI components
- Dark mode support with `dark:` variant
- Smooth transitions and hover effects

## Future Enhancements

- 📈 Local leaderboard with localStorage
- 🎵 Sound feedback for errors
- 🎨 Theme customization
- 📱 Mobile-optimized layout
- 🌐 Multiplayer typing races
- 📚 Custom text input
- 🏆 Statistics tracking over time

## License

MIT

## Contributing

Feel free to open issues or submit pull requests for improvements!

---

**Built with ⌨️ and ❤️ for typing enthusiasts**
