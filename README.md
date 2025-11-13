# 🚗 Car Price Challenge: Higher or Lower

An interactive web game where players guess whether the next car's price is higher or lower than the current one. Built with React, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Dark Futuristic UI**: Neon blue/purple theme with glowing effects
- **Username System**: Stores player names in localStorage
- **Higher/Lower Gameplay**: Guess if the next car costs more or less
- **Bonus Rounds**: Special challenge every 5 levels - guess which car is closer to a target price
- **Leaderboard**: Top 10 scores saved locally
- **Smooth Animations**: Powered by Framer Motion
- **Sound Effects**: Web Audio API for engaging feedback
- **Responsive Design**: Works on desktop and mobile
- **Infinite Levels**: Keep playing to beat your high score

## 🎮 How to Play

1. Enter your username on the start screen
2. Look at the current car and its price
3. Guess if the next car is HIGHER ⬆️ or LOWER ⬇️ in price
4. Every 5 levels, face a bonus round where you choose which car is closer to a target price
5. Try to get the highest score possible!

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Web Audio API** - Sound effects

## 📁 Project Structure

```
src/
├── components/
│   ├── StartScreen.jsx      # Username input and start screen
│   ├── Game.jsx              # Main game logic
│   ├── CarCard.jsx           # Car display component
│   ├── BonusRound.jsx        # Bonus round every 5 levels
│   ├── GameOver.jsx          # Game over screen
│   └── Leaderboard.jsx       # Top 10 players
├── data/
│   └── cars.js               # Car data with prices
├── utils/
│   ├── storage.js            # localStorage utilities
│   └── sounds.js             # Sound effect functions
├── App.jsx                   # Main app with routing
└── index.css                 # Global styles with Tailwind
```

## 🎨 Design Features

- **Neon Colors**: Cyan (#00f0ff), Purple (#bf00ff), Pink (#ff006e)
- **Glass Morphism**: Frosted glass effect on cards
- **Glow Effects**: Text and button shadows
- **Smooth Transitions**: Framer Motion animations
- **Dark Background**: #0f0f0f base color

## 🏆 Scoring

- Each correct guess: +1 point
- Bonus rounds are worth the same as regular rounds
- Wrong guess ends the game
- Scores are saved to local leaderboard

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
