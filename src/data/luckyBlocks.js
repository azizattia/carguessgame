// Lucky Block outcomes with probabilities and effects

export const LUCKY_BLOCK_OUTCOMES = [
  // GOOD OUTCOMES (60% total)
  {
    id: 'small_coins',
    type: 'good',
    probability: 0.20,
    title: '💰 Coin Bonus!',
    description: 'You found some coins!',
    emoji: '💰',
    effect: { type: 'coins', value: 100 }
  },
  {
    id: 'medium_coins',
    type: 'good',
    probability: 0.12,
    title: '💵 Big Bonus!',
    description: 'Jackpot! You struck gold!',
    emoji: '💵',
    effect: { type: 'coins', value: 500 }
  },
  {
    id: 'extra_life',
    type: 'good',
    probability: 0.10,
    title: '❤️ Extra Life!',
    description: 'You can survive one wrong answer!',
    emoji: '❤️',
    effect: { type: 'extra_life', value: 1 }
  },
  {
    id: 'level_skip',
    type: 'good',
    probability: 0.08,
    title: '⏭️ Level Skip!',
    description: 'Fast forward! Skip a level!',
    emoji: '⏭️',
    effect: { type: 'skip_level', value: 1 }
  },
  {
    id: 'double_coins',
    type: 'good',
    probability: 0.06,
    title: '✨ 2x Multiplier!',
    description: 'Double coins for next 3 rounds!',
    emoji: '✨',
    effect: { type: 'coin_multiplier', value: 2, duration: 3 }
  },
  {
    id: 'price_hint',
    type: 'good',
    probability: 0.04,
    title: '🔮 Price Oracle!',
    description: 'See price range for next car!',
    emoji: '🔮',
    effect: { type: 'price_hint', value: 1 }
  },

  // BAD OUTCOMES (30% total)
  {
    id: 'lose_small_coins',
    type: 'bad',
    probability: 0.12,
    title: '💸 Pickpocket!',
    description: 'Someone stole your coins!',
    emoji: '💸',
    effect: { type: 'coins', value: -50 }
  },
  {
    id: 'reverse_controls',
    type: 'bad',
    probability: 0.08,
    title: '🔄 Confusion!',
    description: 'Controls reversed for next round!',
    emoji: '🔄',
    effect: { type: 'reverse_controls', value: 1 }
  },
  {
    id: 'half_coins',
    type: 'bad',
    probability: 0.05,
    title: '📉 Recession!',
    description: 'Half coins for next 2 rounds!',
    emoji: '📉',
    effect: { type: 'coin_multiplier', value: 0.5, duration: 2 }
  },
  {
    id: 'level_back',
    type: 'bad',
    probability: 0.03,
    title: '⏮️ Time Warp!',
    description: 'You went back 2 levels!',
    emoji: '⏮️',
    effect: { type: 'level_penalty', value: -2 }
  },
  {
    id: 'blind_mode',
    type: 'bad',
    probability: 0.02,
    title: '🙈 Blind Guess!',
    description: 'Current car price hidden!',
    emoji: '🙈',
    effect: { type: 'hide_price', value: 1 }
  },

  // NEUTRAL/MIXED (10% total)
  {
    id: 'nothing',
    type: 'neutral',
    probability: 0.08,
    title: '📦 Empty Box!',
    description: 'Nothing happened... keep playing!',
    emoji: '📦',
    effect: { type: 'none', value: 0 }
  },
  {
    id: 'mystery',
    type: 'neutral',
    probability: 0.02,
    title: '❓ Mystery!',
    description: 'Something strange happened...',
    emoji: '❓',
    effect: { type: 'random_swap', value: 1 } // Swaps your score and level
  }
];

// Function to get a random outcome based on probabilities
export const getRandomOutcome = () => {
  const totalProbability = LUCKY_BLOCK_OUTCOMES.reduce((sum, outcome) => sum + outcome.probability, 0);
  let random = Math.random() * totalProbability;

  for (const outcome of LUCKY_BLOCK_OUTCOMES) {
    random -= outcome.probability;
    if (random <= 0) {
      return outcome;
    }
  }

  return LUCKY_BLOCK_OUTCOMES[0]; // Fallback
};

// Lucky block appearance settings
export const LUCKY_BLOCK_CONFIG = {
  minLevel: 3, // Start appearing after level 3
  baseChance: 0.25, // 25% chance to appear after completing a level
  cooldown: 2 // Minimum levels between lucky blocks
};
