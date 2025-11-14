// Brainrot chaos elements for the game

export const JUMPSCARES = [
  {
    id: 1,
    emoji: "👁️👄👁️",
    text: "I'M WATCHING YOU",
    sound: "👀"
  },
  {
    id: 2,
    emoji: "🤡",
    text: "HONK HONK",
    sound: "🤡"
  },
  {
    id: 3,
    emoji: "😱",
    text: "BOO!",
    sound: "👻"
  },
  {
    id: 4,
    emoji: "💀",
    text: "SKULL EMOJI",
    sound: "💀"
  },
  {
    id: 5,
    emoji: "🗿",
    text: "MOYAI",
    sound: "🗿"
  },
  {
    id: 6,
    emoji: "🧠",
    text: "BRAINROT ACTIVATED",
    sound: "🧠"
  },
  {
    id: 7,
    emoji: "🐸",
    text: "IT IS WEDNESDAY MY DUDES",
    sound: "🐸"
  },
  {
    id: 8,
    emoji: "🦧",
    text: "REJECT MODERNITY",
    sound: "🦧"
  },
  {
    id: 9,
    emoji: "🍕",
    text: "PIZZA TIME",
    sound: "🍕"
  },
  {
    id: 10,
    emoji: "📮",
    text: "SUS",
    sound: "📮"
  },
  {
    id: 11,
    emoji: "🎺💀",
    text: "DOOT DOOT",
    sound: "🎺"
  },
  {
    id: 12,
    emoji: "🐱",
    text: "MEOW",
    sound: "🐱"
  },
  {
    id: 13,
    emoji: "👽",
    text: "AYYYY LMAO",
    sound: "👽"
  },
  {
    id: 14,
    emoji: "🤨",
    text: "THE ROCK IS JUDGING YOU",
    sound: "🤨"
  },
  {
    id: 15,
    emoji: "🔥",
    text: "THIS IS FINE",
    sound: "🔥"
  }
];

export const getRandomJumpscare = () => {
  return JUMPSCARES[Math.floor(Math.random() * JUMPSCARES.length)];
};

// Chaos settings
export const CHAOS_CONFIG = {
  jumpscareChance: 0.03,      // 3% chance
  screenFlipChance: 0.03,     // 3% chance
  movingButtonsChance: 0.03   // 3% chance
};
