import { avatars, getAvatarsByRarity } from './avatars';

export const chests = [
  {
    id: 1,
    name: "Avatar Chest",
    emoji: "🎁",
    price: 400,
    description: "Open for a chance to get a random avatar!",
    type: "avatar",
    color: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/50'
    }
  },
  {
    id: 2,
    name: "Coin Chest",
    emoji: "💰",
    price: 300,
    description: "Try your luck to multiply your coins!",
    type: "coin",
    color: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      glow: 'shadow-yellow-500/50'
    }
  }
];

// Avatar Chest Probabilities
const AVATAR_CHEST_PROBABILITIES = [
  { type: 'nothing', probability: 60, label: 'Nothing' },
  { type: 'common', probability: 30, label: 'Common Avatar' },
  { type: 'rare', probability: 8, label: 'Rare Avatar' },
  { type: 'epic', probability: 1, label: 'Epic Avatar' },
  { type: 'legendary', probability: 0.8, label: 'Legendary Avatar' },
  { type: 'matrix', probability: 0.2, label: 'Matrix Avatar' }
];

// Coin Chest Probabilities
const COIN_CHEST_PROBABILITIES = [
  { coins: 0, probability: 65, label: 'Nothing' },
  { coins: 200, probability: 30, label: '200 Coins' },
  { coins: 1000, probability: 3, label: '1,000 Coins' },
  { coins: 5000, probability: 1, label: '5,000 Coins' },
  { coins: 10000, probability: 0.6, label: '10,000 Coins' },
  { coins: 25000, probability: 0.3, label: '25,000 Coins' },
  { coins: 50000, probability: 0.17, label: '50,000 Coins' },
  { coins: 100000, probability: 0.025, label: '100,000 Coins' },
  { coins: 1000000, probability: 0.005, label: '1,000,000 Coins' }
];

// Helper function to select based on probabilities
const selectByProbability = (options) => {
  const totalProbability = options.reduce((sum, opt) => sum + opt.probability, 0);
  let random = Math.random() * totalProbability;

  for (const option of options) {
    random -= option.probability;
    if (random <= 0) {
      return option;
    }
  }

  return options[0]; // Fallback
};

// Open Avatar Chest
export const openAvatarChest = (unlockedAvatars = []) => {
  const result = selectByProbability(AVATAR_CHEST_PROBABILITIES);

  if (result.type === 'nothing') {
    return {
      success: false,
      type: 'nothing',
      message: 'Better luck next time!',
      emoji: '😢'
    };
  }

  // Get avatars of the selected rarity that aren't unlocked
  const rarityAvatars = getAvatarsByRarity(result.type);
  const availableAvatars = rarityAvatars.filter(avatar =>
    avatar.id !== 1 && !unlockedAvatars.includes(avatar.id)
  );

  if (availableAvatars.length === 0) {
    // All avatars of this rarity are unlocked, give coins instead
    const coinReward = {
      common: 500,
      rare: 2000,
      epic: 10000,
      legendary: 30000,
      matrix: 75000
    }[result.type];

    return {
      success: true,
      type: 'coins',
      amount: coinReward,
      message: `All ${result.type} avatars unlocked! Here's ${coinReward} coins instead!`,
      emoji: '🪙'
    };
  }

  // Select random avatar from available ones
  const selectedAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];

  return {
    success: true,
    type: 'avatar',
    avatar: selectedAvatar,
    rarity: result.type,
    message: `You got ${selectedAvatar.name}!`,
    emoji: selectedAvatar.emoji
  };
};

// Open Coin Chest
export const openCoinChest = () => {
  const result = selectByProbability(COIN_CHEST_PROBABILITIES);

  if (result.coins === 0) {
    return {
      success: false,
      type: 'nothing',
      amount: 0,
      message: 'You lost your coins!',
      emoji: '😢'
    };
  }

  return {
    success: true,
    type: 'coins',
    amount: result.coins,
    message: `You won ${result.coins.toLocaleString()} coins!`,
    emoji: '🎉'
  };
};

export const getChestProbabilities = (chestType) => {
  if (chestType === 'avatar') {
    return AVATAR_CHEST_PROBABILITIES;
  }
  return COIN_CHEST_PROBABILITIES;
};
