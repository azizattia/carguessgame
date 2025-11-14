// Voice roasting system using Web Speech API

export const ROASTS = {
  takingTooLong: [
    "OMG are you serious? It's just two numbers!",
    "My grandmother could guess faster than this!",
    "Hello? Anyone home?",
    "The timer is literally right there!",
    "Are you even trying?",
    "This isn't rocket science!",
    "Tick tock! Time is money!",
    "Did you fall asleep?",
    "We don't have all day!",
    "Even a toddler would be faster!",
  ],
  wrongAnswer: [
    "OMG are you uneducated?",
    "Did you even go to school?",
    "That was embarrassing!",
    "How did you get that wrong?",
    "Seriously? That's your guess?",
    "My dog could guess better!",
    "You need to go back to kindergarten!",
    "That was painful to watch!",
    "I'm embarrassed for you!",
    "Did you close your eyes?",
  ],
  needsExtraLife: [
    "Go ahead, use your coins for that extra life!",
    "You're gonna need a lot of those extra lives!",
    "Better buy more lives, you'll need them!",
    "At this rate, you'll run out of coins fast!",
    "Extra lives won't save you from this embarrassment!",
    "You should probably get all the extra lives you can!",
    "Save your coins, you're hopeless!",
    "Even extra lives can't help you!",
  ],
  lowScore: [
    "Is that really your best?",
    "I've seen worse... barely!",
    "You call that a score?",
    "Maybe try an easier game?",
    "Yikes! That's rough!",
    "Better luck next time... you'll need it!",
    "That's all you got?",
    "I'm not mad, just disappointed!",
  ]
};

let isSpeaking = false;

export const speakRoast = (roastArray) => {
  // Don't overlap roasts
  if (isSpeaking || !('speechSynthesis' in window)) return;

  const roast = roastArray[Math.floor(Math.random() * roastArray.length)];
  const utterance = new SpeechSynthesisUtterance(roast);

  // Configure voice settings for maximum sass
  utterance.rate = 1.1; // Slightly faster for attitude
  utterance.pitch = 1.0;
  utterance.volume = 0.8;

  // Try to use a female voice for extra sass
  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice =>
    voice.name.includes('Female') ||
    voice.name.includes('Samantha') ||
    voice.name.includes('Victoria') ||
    voice.name.includes('Karen')
  );

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  isSpeaking = true;

  utterance.onend = () => {
    isSpeaking = false;
  };

  utterance.onerror = () => {
    isSpeaking = false;
  };

  speechSynthesis.speak(utterance);
};

// Stop any ongoing speech
export const stopRoasting = () => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    isSpeaking = false;
  }
};
