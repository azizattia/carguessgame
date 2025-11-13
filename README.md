# 🚗 Car Price Challenge: Higher or Lower

An interactive web game where players guess whether the next car's price is higher or lower than the current one. Built with React, Tailwind CSS, Framer Motion, and Supabase.

## ✨ Features

- **Dark Futuristic UI**: Neon blue/purple theme with glowing effects
- **User Authentication**: Secure login/register system with unique usernames
- **Higher/Lower Gameplay**: Guess if the next car costs more or less
- **Bonus Rounds**: Special challenge every 5 levels - guess which car is closer to a target price
- **Global Leaderboard**: Top 10 scores from all players stored in database
- **Personal Stats**: Track your best score and game history
- **Smooth Animations**: Powered by Framer Motion
- **Sound Effects**: Web Audio API for engaging feedback
- **Responsive Design**: Works on desktop and mobile
- **Infinite Levels**: Keep playing to beat your high score

## 🎮 How to Play

1. Create an account or login with your credentials
2. Look at the current car and its price
3. Guess if the next car is HIGHER ⬆️ or LOWER ⬇️ in price
4. Every 5 levels, face a bonus round where you choose which car is closer to a target price
5. Try to get the highest score possible and top the leaderboard!

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier is fine)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd carguessgame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Go to [Supabase](https://supabase.com) and create a new project

   b. Once your project is created, go to **Settings** → **API**

   c. Copy your **Project URL** and **anon/public key**

   d. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

   e. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Create database tables**

   a. In your Supabase dashboard, go to **SQL Editor**

   b. Copy the contents of `supabase-setup.sql`

   c. Paste and run it in the SQL Editor

   This will create:
   - `user_profiles` table (stores unique usernames)
   - `scores` table (stores all game scores)
   - Row Level Security policies
   - Leaderboard function
   - Automatic user profile creation trigger

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 🛠️ Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Supabase** - Backend as a Service (Auth + Database)
- **PostgreSQL** - Database (via Supabase)
- **Web Audio API** - Sound effects

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth.jsx              # Login/Register screen
│   ├── Game.jsx              # Main game logic
│   ├── CarCard.jsx           # Car display component
│   ├── BonusRound.jsx        # Bonus round every 5 levels
│   ├── GameOver.jsx          # Game over screen
│   └── Leaderboard.jsx       # Top 10 global leaderboard
├── contexts/
│   └── AuthContext.jsx       # Authentication context
├── data/
│   └── cars.js               # Car data with prices
├── lib/
│   └── supabase.js           # Supabase client config
├── utils/
│   ├── storage.js            # Database utilities
│   └── sounds.js             # Sound effect functions
├── App.jsx                   # Main app with auth routing
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
- Scores are saved to global leaderboard
- Leaderboard shows each player's best score and total games played

## 🔐 Authentication

- Unique usernames (enforced at database level)
- Secure password authentication via Supabase Auth
- Email verification available
- Session management with automatic token refresh

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
