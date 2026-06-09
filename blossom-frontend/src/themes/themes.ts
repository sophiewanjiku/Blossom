// ============================================================
// THEME CONFIGURATION
// Each theme is a complete personality — not just colours but
// also copy, Luna's name, poetry for each cycle phase, and
// which particle effect to render.
// ============================================================

export type ThemeId = 'frozen' | 'tiana' | 'rapunzel' | 'cinderella'

export interface ThemeConfig {
  id: ThemeId
  name: string
  icon: string
  tagline: string
  particleType: 'snowflake' | 'firefly' | 'lantern' | 'sparkle'
  luna: {
    name: string
    greeting: string
  }
  phasePoetry: {
    menstrual: string
    follicular: string
    ovulation: string
    luteal: string
  }
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  frozen: {
    id: 'frozen',
    name: 'Frozen',
    icon: '❄️',
    tagline: 'Where ice and magic meet your cycle',
    particleType: 'snowflake',
    luna: {
      name: 'Luna of Arendelle',
      greeting: "Welcome ❄️ I'm Luna. Ask me anything about your cycle, fertility, or health.",
    },
    phasePoetry: {
      menstrual:  '"Let it go — your body is releasing and renewing."',
      follicular: '"The ice is thawing. Energy rises with the light."',
      ovulation:  '"The gates are open. Peak power, peak clarity."',
      luteal:     '"The snow settles. Rest, reflect, prepare."',
    },
  },
  tiana: {
    id: 'tiana',
    name: 'Tiana',
    icon: '🐸',
    tagline: 'Where the bayou blooms with your health',
    particleType: 'firefly',
    luna: {
      name: 'Luna of the Bayou',
      greeting: "Welcome to the bayou 🌿 I'm Luna, cher. Ask me anything about your health.",
    },
    phasePoetry: {
      menstrual:  '"Almost there — rest now cher. Your body knows the way."',
      follicular: '"The bayou wakes. New energy is rising in you."',
      ovulation:  '"The fireflies are out. Your most radiant days are here."',
      luteal:     '"The bayou settles at dusk. Nourish yourself."',
    },
  },
  rapunzel: {
    id: 'rapunzel',
    name: 'Rapunzel',
    icon: '🌸',
    tagline: 'Let your health story be your own',
    particleType: 'lantern',
    luna: {
      name: 'Luna of the Tower',
      greeting: "The lanterns are lit 🌸 I'm Luna. Your body, your story — ask me anything.",
    },
    phasePoetry: {
      menstrual:  '"The tower door is closed. Rest and let the world wait."',
      follicular: '"New paint on the canvas — creativity and energy bloom."',
      ovulation:  '"The lanterns float. This is the day you always dreamed of."',
      luteal:     '"The tower grows quiet. Honour your need for stillness."',
    },
  },
  cinderella: {
    id: 'cinderella',
    name: 'Cinderella',
    icon: '✨',
    tagline: 'Your story shines — and so does your health',
    particleType: 'sparkle',
    luna: {
      name: 'Luna of the Palace',
      greeting: "Bibbidi-bobbidi-boo ✨ I'm Luna. Every woman deserves to know her body.",
    },
    phasePoetry: {
      menstrual:  '"The ball is over. Rest, restore, the magic is within."',
      follicular: '"The gown is being made. Energy and possibility rise."',
      ovulation:  '"The clock strikes your moment. Radiant, powerful, you."',
      luteal:     '"Before the next ball — rest, nourish, dream."',
    },
  },
}

export const THEME_ORDER: ThemeId[] = ['frozen', 'tiana', 'rapunzel', 'cinderella']