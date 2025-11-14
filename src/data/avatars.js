export const RARITY_COLORS = {
  common: {
    text: 'text-gray-400',
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    glow: 'shadow-gray-500/50'
  },
  rare: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/50'
  },
  epic: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/50'
  },
  legendary: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/50'
  },
  matrix: {
    text: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/50'
  }
};

export const avatars = [
  // FREE COMMON AVATAR
  {
    id: 1,
    name: "Default Driver",
    emoji: "😊",
    rarity: "common",
    price: 0,
    description: "Your standard profile picture"
  },

  // COMMON AVATARS (500-2000 coins) - 55% probability
  {
    id: 2,
    name: "Cool Racer",
    emoji: "😎",
    rarity: "common",
    price: 500,
    description: "Too cool for the slow lane"
  },
  {
    id: 3,
    name: "Happy Cruiser",
    emoji: "😄",
    rarity: "common",
    price: 600,
    description: "Smiles per mile guaranteed"
  },
  {
    id: 4,
    name: "Thinking Driver",
    emoji: "🤔",
    rarity: "common",
    price: 700,
    description: "Always calculating the best price"
  },
  {
    id: 5,
    name: "Winking Pro",
    emoji: "😉",
    rarity: "common",
    price: 800,
    description: "Knows all the car values"
  },
  {
    id: 6,
    name: "Star Driver",
    emoji: "⭐",
    rarity: "common",
    price: 900,
    description: "A rising star on the road"
  },
  {
    id: 7,
    name: "Fire Racer",
    emoji: "🔥",
    rarity: "common",
    price: 1000,
    description: "Burning rubber since day one"
  },
  {
    id: 8,
    name: "Lightning Fast",
    emoji: "⚡",
    rarity: "common",
    price: 1200,
    description: "Quick decisions, quicker lap times"
  },
  {
    id: 9,
    name: "Trophy Hunter",
    emoji: "🏆",
    rarity: "common",
    price: 1500,
    description: "Collects wins like trophies"
  },
  {
    id: 10,
    name: "Speed Demon",
    emoji: "👹",
    rarity: "common",
    price: 2000,
    description: "Demonic speed, angelic skills"
  },

  // RARE AVATARS (3000-8000 coins) - 36% probability
  {
    id: 11,
    name: "Alien Racer",
    emoji: "👽",
    rarity: "rare",
    price: 3000,
    description: "Out of this world driving"
  },
  {
    id: 12,
    name: "Robot Driver",
    emoji: "🤖",
    rarity: "rare",
    price: 4000,
    description: "Precision programmed performance"
  },
  {
    id: 13,
    name: "Ghost Rider",
    emoji: "👻",
    rarity: "rare",
    price: 5000,
    description: "Haunts the leaderboards"
  },
  {
    id: 14,
    name: "Rocket Pilot",
    emoji: "🚀",
    rarity: "rare",
    price: 6000,
    description: "To infinity and beyond... the speed limit"
  },
  {
    id: 15,
    name: "Diamond Racer",
    emoji: "💎",
    rarity: "rare",
    price: 7000,
    description: "Rare and valuable talent"
  },
  {
    id: 16,
    name: "Crown Champion",
    emoji: "👑",
    rarity: "rare",
    price: 8000,
    description: "Royalty of the racing world"
  },

  // EPIC AVATARS (15000-25000 coins) - ~5% probability
  {
    id: 17,
    name: "Dragon Racer",
    emoji: "🐉",
    rarity: "epic",
    price: 15000,
    description: "Mythical speed, legendary control"
  },
  {
    id: 18,
    name: "Wizard Driver",
    emoji: "🧙",
    rarity: "epic",
    price: 25000,
    description: "Magical predictions every time"
  },

  // LEGENDARY AVATAR (50000 coins) - 3.7% probability
  {
    id: 19,
    name: "Golden God",
    emoji: "🏅",
    rarity: "legendary",
    price: 50000,
    description: "The stuff of legends"
  },

  // MATRIX RARITY (100000 coins) - 0.3% probability (ULTRA RARE)
  {
    id: 20,
    name: "Matrix Master",
    emoji: "🔰",
    rarity: "matrix",
    price: 100000,
    description: "You've seen through the simulation"
  }
];

export const getAvatarById = (id) => {
  return avatars.find(avatar => avatar.id === id) || avatars[0];
};

export const getAvatarsByRarity = (rarity) => {
  return avatars.filter(avatar => avatar.rarity === rarity);
};

export const getRarityInfo = (rarity) => {
  const rarityMap = {
    common: { label: 'Common', probability: '55%' },
    rare: { label: 'Rare', probability: '36%' },
    epic: { label: 'Epic', probability: '5%' },
    legendary: { label: 'Legendary', probability: '3.7%' },
    matrix: { label: 'Matrix', probability: '0.3%' }
  };
  return rarityMap[rarity] || rarityMap.common;
};
