// ============================================
// TrailQuest — App Configuration
// ============================================
// Centralized config that reads from env vars
// with safe defaults for demo mode.
// ============================================

export const config = {
  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isDemoMode: process.env.DEMO_MODE === 'true' || !process.env.GEMMA_BASE_URL,

  // Gemma (Core Open Model)
  gemma: {
    model: process.env.GEMMA_MODEL || 'gemma-3-27b-it',
    baseUrl: process.env.GEMMA_BASE_URL || 'http://localhost:11434/v1',
    apiKey: process.env.GEMMA_API_KEY || '',
  },

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || '',
    database: process.env.MONGODB_DATABASE || 'trailquest',
  },

  // Tiger Data / pgvector
  tigerdata: {
    databaseUrl: process.env.TIGERDATA_DATABASE_URL || '',
  },

  // SerpApi
  serpapi: {
    apiKey: process.env.SERPAPI_API_KEY || '',
  },

  // ElevenLabs
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
    voiceId: process.env.ELEVENLABS_VOICE_ID || '',
  },

  // Backboard
  backboard: {
    apiKey: process.env.BACKBOARD_API_KEY || '',
  },

  // Sentry
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    authToken: process.env.SENTRY_AUTH_TOKEN || '',
  },

  // DigitalOcean
  digitalocean: {
    endpoint: process.env.DIGITALOCEAN_ENDPOINT || '',
    apiToken: process.env.DIGITALOCEAN_API_TOKEN || '',
  },

  // TabPFN
  tabpfn: {
    endpoint: process.env.TABPFN_ENDPOINT || 'http://localhost:8080',
  },

  // Tinker
  tinker: {
    apiKey: process.env.TINKER_API_KEY || '',
    endpoint: process.env.TINKER_ENDPOINT || '',
  },

  // Temporal
  temporal: {
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    namespace: process.env.TEMPORAL_NAMESPACE || 'trailquest',
    apiKey: process.env.TEMPORAL_API_KEY || '',
  },

  // Arduino
  arduino: {
    endpoint: process.env.ARDUINO_ENDPOINT || '',
  },
} as const;

export function getProviderStatus(): Record<string, { configured: boolean; mode: 'real' | 'mock' | 'demo' }> {
  return {
    gemma: {
      configured: !!config.gemma.baseUrl && !config.isDemoMode,
      mode: config.isDemoMode ? 'demo' : 'real',
    },
    mongodb: {
      configured: !!config.mongodb.uri,
      mode: config.mongodb.uri ? 'real' : 'demo',
    },
    serpapi: {
      configured: !!config.serpapi.apiKey,
      mode: config.serpapi.apiKey ? 'real' : 'mock',
    },
    elevenlabs: {
      configured: !!config.elevenlabs.apiKey,
      mode: config.elevenlabs.apiKey ? 'real' : 'mock',
    },
    backboard: {
      configured: !!config.backboard.apiKey,
      mode: config.backboard.apiKey ? 'real' : 'mock',
    },
    tigerdata: {
      configured: !!config.tigerdata.databaseUrl,
      mode: config.tigerdata.databaseUrl ? 'real' : 'mock',
    },
    tabpfn: {
      configured: !!config.tabpfn.endpoint && config.tabpfn.endpoint !== 'http://localhost:8080',
      mode: 'mock',
    },
    sentry: {
      configured: !!config.sentry.dsn,
      mode: config.sentry.dsn ? 'real' : 'mock',
    },
    arduino: {
      configured: !!config.arduino.endpoint,
      mode: config.arduino.endpoint ? 'real' : 'mock',
    },
  };
}
