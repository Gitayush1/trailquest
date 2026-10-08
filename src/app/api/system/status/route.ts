// ============================================
// TrailQuest — System Status API
// ============================================
import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variables to determine provider status
  const isDemoMode = process.env.DEMO_MODE === 'true' || !process.env.GEMMA_BASE_URL;

  const providers = [
    {
      name: 'Gemma (LLM)',
      configured: !!process.env.GEMMA_BASE_URL && !isDemoMode,
      mode: isDemoMode ? 'demo' : 'real',
    },
    {
      name: 'MongoDB Atlas',
      configured: !!process.env.MONGODB_URI,
      mode: process.env.MONGODB_URI ? 'real' : 'demo',
    },
    {
      name: 'SerpApi',
      configured: !!process.env.SERPAPI_API_KEY,
      mode: process.env.SERPAPI_API_KEY ? 'real' : 'mock',
    },
    {
      name: 'ElevenLabs',
      configured: !!process.env.ELEVENLABS_API_KEY,
      mode: process.env.ELEVENLABS_API_KEY ? 'real' : 'mock',
    },
    {
      name: 'Backboard',
      configured: !!process.env.BACKBOARD_API_KEY,
      mode: process.env.BACKBOARD_API_KEY ? 'real' : 'mock',
    },
    {
      name: 'Tiger Data',
      configured: !!process.env.TIGERDATA_DATABASE_URL,
      mode: process.env.TIGERDATA_DATABASE_URL ? 'real' : 'mock',
    },
    {
      name: 'TabPFN',
      configured: !!process.env.TABPFN_ENDPOINT && process.env.TABPFN_ENDPOINT !== 'http://localhost:8080',
      mode: 'mock',
    },
    {
      name: 'Sentry',
      configured: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      mode: process.env.NEXT_PUBLIC_SENTRY_DSN ? 'real' : 'mock',
    },
    {
      name: 'Arduino UNO Q',
      configured: !!process.env.ARDUINO_ENDPOINT,
      mode: process.env.ARDUINO_ENDPOINT ? 'real' : 'mock',
    },
    {
      name: 'Temporal',
      configured: !!process.env.TEMPORAL_API_KEY,
      mode: process.env.TEMPORAL_API_KEY ? 'real' : 'mock',
    },
    {
      name: 'DigitalOcean',
      configured: !!process.env.DIGITALOCEAN_ENDPOINT,
      mode: process.env.DIGITALOCEAN_ENDPOINT ? 'real' : 'mock',
    },
  ];

  return NextResponse.json({
    status: 'ok',
    demoMode: isDemoMode,
    providers,
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
}
