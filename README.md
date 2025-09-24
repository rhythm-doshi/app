# Neurodiverse Algebra Learning Demo

A Next.js 14 application demonstrating Universal Design for Learning (UDL) principles for algebra education, specifically designed to support learners with ADHD, Dyslexia, and Autism.

## 🎯 Project Goals

This demo showcases evidence-based accessibility features and learning supports that help neurodiverse students succeed in mathematics education.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## 👥 Demo Users

The application includes two main roles:

### Students
- **Ava Chen**: Completed lesson, proficient mastery
- **Ben Williams**: In progress, developing mastery  
- **Noor Patel**: Not started, ready to begin

### Teacher
- **Ms. Rodriguez**: Can assign lessons and view reports

## 🧠 UDL Features

### Engagement (Motivation)
- **Focus Timer**: 5, 15, or 25-minute focused learning sessions
- **Progress Tracking**: Visual progress indicators and achievement badges
- **Gentle Nudging**: Non-intrusive reminders and encouragement
- **Reflection Prompts**: End-of-session emotional check-ins

### Representation (Content Delivery)
- **Dyslexia-Friendly Fonts**: Lexend and Atkinson Hyperlegible options
- **Text Adjustments**: Size, letter spacing, line height controls
- **Text-to-Speech**: Web Speech API with adjustable playback rate
- **Reading Ruler**: Horizontal/vertical focus overlay with keyboard control
- **Color Overlays**: Customizable tint options (yellow, blue, green, pink)
- **High Contrast Mode**: Enhanced visual accessibility
- **Reduced Motion**: Respects user preferences and provides toggle

### Expression (How Students Show Learning)
- **Interactive Balance Scale**: Visual equation solving with drag-and-drop
- **Button Alternatives**: All drag actions have keyboard/button alternatives
- **Multiple Input Methods**: Click, keyboard navigation, and voice commands
- **Step-by-Step Guidance**: Scaffolded problem-solving approach

## 📚 Lesson Content

### Balance the Equation
Interactive algebra lesson covering:
1. **x + 3 = 7** (subtraction concept)
2. **2x = 8** (division concept)
3. **x/3 = 5** (multiplication concept)

Each problem includes:
- Visual balance scale representation
- Audio instructions and feedback
- Multiple solution pathways
- Immediate error correction
- Mastery-based progression

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Toggle Focus Mode |
| `R` | Toggle Reading Ruler |
| `+/-` | Adjust Text Size |
| `Ctrl+Arrow Keys` | Move Reading Ruler |
| `Space/Enter` | Activate Buttons |
| `Tab` | Navigate Elements |

## 👩‍🏫 Teacher Features

### Assignment Management
- Create and assign interactive lessons
- Monitor student progress in real-time
- View completion rates and time-on-task metrics

### Analytics & Reports
- Individual student progress tracking
- UDL tool usage analytics
- Mastery level assessment (Beginner/Developing/Proficient)
- CSV export for detailed analysis
- Learning insights and recommendations

### Student Insights
- Error pattern analysis
- Accessibility tool usage patterns
- Time-on-task and engagement metrics
- Individual learning accommodations tracking

## 🧪 Technical Implementation

### Architecture
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom accessibility utilities
- **State Management**: Zustand with localStorage persistence
- **Typography**: Google Fonts (Inter, Atkinson Hyperlegible, Lexend)
- **Icons**: Lucide React
- **Accessibility**: WCAG 2.2 AA compliant

### Key Components
- `UDLToolbar`: Centralized accessibility controls
- `BalanceScale`: Interactive equation visualization
- `FocusTimer`: Pomodoro-style focus sessions
- `ReadingRuler`: Visual reading assistance overlay
- `TTSButton`: Text-to-speech integration
- `ColorOverlay`: Customizable visual filters

### Data Persistence
- Settings and preferences stored in localStorage
- Mock student progress data for demonstration
- Spaced repetition queue for review scheduling

## 🔬 Evidence-Based Features

### Research-Backed UDL Implementations

1. **Executive Function Support**
   - Focus intervals with immediate feedback
   - Visual timers and timeboxing
   - Checklists with step-wise progression
   - Gentle task return nudges

2. **Reading & Language Support**
   - Dyslexia-friendly font options
   - Adjustable text spacing and sizing
   - Synchronized text-to-speech highlighting
   - Structured literacy scaffolds for word problems

3. **Attention & Sensory Regulation**
   - Reading ruler for visual tracking
   - Color overlays for visual comfort
   - Reduced motion settings
   - Distraction-free mode option

4. **Memory & Recall Enhancement**
   - Spaced repetition system
   - Visual-spatial equation representations
   - Multi-modal encoding (visual + auditory + kinesthetic)
   - Confidence-based review scheduling

## 🎯 Accessibility Standards

- **WCAG 2.2 AA** compliant color contrast ratios
- **Keyboard navigation** for all interactive elements
- **Screen reader** compatible with proper ARIA labels
- **Focus management** with visible focus indicators
- **Reduced motion** support for vestibular disorders
- **Flexible text sizing** up to 200% without horizontal scrolling

## 📊 Demo Data

The application includes realistic mock data:
- 3 students with different learning profiles
- 1 interactive algebra lesson
- Progress tracking and submission data
- Focus session reflections
- Spaced repetition review queues

## 🚀 Deployment

This application is designed to run in any modern web environment:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

This is a demonstration project showcasing UDL principles in educational technology. The codebase serves as a reference implementation for:

- Accessible web application design
- Universal Design for Learning implementation
- Neurodiverse-friendly user interfaces
- Evidence-based educational technology features

## 📄 License

This project is for demonstration purposes. Please see individual dependencies for their respective licenses.

## 🔗 Related Resources

- [Universal Design for Learning Guidelines](http://udlguidelines.cast.org/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)