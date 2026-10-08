'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Activity, Cpu, Database, Globe, Wifi, WifiOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getProviderStatus } from '@/lib/config';

interface ProviderInfo {
  name: string;
  configured: boolean;
  mode: 'real' | 'mock' | 'demo';
}

export default function DeveloperPage() {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    // Fetch status from API
    fetch('/api/system/status')
      .then((r) => r.json())
      .then((data) => setProviders(data.providers || []))
      .catch(() => {
        // Fallback: show demo mode providers
        setProviders([
          { name: 'Gemma (LLM)', configured: false, mode: 'demo' },
          { name: 'MongoDB Atlas', configured: false, mode: 'demo' },
          { name: 'SerpApi', configured: false, mode: 'mock' },
          { name: 'ElevenLabs', configured: false, mode: 'mock' },
          { name: 'Backboard', configured: false, mode: 'mock' },
          { name: 'Tiger Data', configured: false, mode: 'mock' },
          { name: 'TabPFN', configured: false, mode: 'mock' },
          { name: 'Sentry', configured: false, mode: 'mock' },
          { name: 'Arduino', configured: false, mode: 'mock' },
        ]);
      });
  }, []);

  const StatusIcon = ({ mode }: { mode: string }) => {
    if (mode === 'real') return <CheckCircle className="w-4 h-4 text-moss-500" />;
    if (mode === 'demo') return <AlertCircle className="w-4 h-4 text-sunset-400" />;
    return <XCircle className="w-4 h-4 text-text-muted dark:text-text-on-dark-muted" />;
  };

  return (
    <div className="min-h-dvh bg-nature-gradient">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Developer
          </h1>
          <span className="demo-badge text-xs">Internal</span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-moss-500" />
            System Status
          </h2>

          <div className="glass rounded-2xl p-6">
            <div className="grid gap-3">
              {providers.map((provider) => (
                <div
                  key={provider.name}
                  className="flex items-center justify-between py-2 border-b border-moss-100 dark:border-moss-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon mode={provider.mode} />
                    <span className="font-medium text-sm">{provider.name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    provider.mode === 'real'
                      ? 'bg-moss-100 dark:bg-moss-900 text-moss-600 dark:text-moss-300'
                      : provider.mode === 'demo'
                      ? 'bg-sunset-400/10 text-sunset-500'
                      : 'bg-earth-100 dark:bg-earth-900 text-earth-500'
                  }`}>
                    {provider.mode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-moss-500" />
            Architecture
          </h2>

          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-moss-50 dark:bg-moss-900/50 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-moss-500" />
                  Frontend
                </h4>
                <ul className="text-xs space-y-1 text-text-secondary dark:text-text-on-dark-muted">
                  <li>• Next.js 15 (App Router)</li>
                  <li>• Tailwind CSS 4</li>
                  <li>• Framer Motion</li>
                  <li>• TypeScript (strict)</li>
                </ul>
              </div>
              <div className="bg-moss-50 dark:bg-moss-900/50 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-moss-500" />
                  AI / Backend
                </h4>
                <ul className="text-xs space-y-1 text-text-secondary dark:text-text-on-dark-muted">
                  <li>• Gemma (open-weight)</li>
                  <li>• Provider abstractions</li>
                  <li>• Zod validation</li>
                  <li>• Agent orchestration</li>
                </ul>
              </div>
            </div>

            <div className="bg-moss-50 dark:bg-moss-900/50 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-2">Provider Pattern</h4>
              <pre className="text-xs font-mono text-text-secondary dark:text-text-on-dark-muted overflow-x-auto whitespace-pre">
{`interface LLMProvider {
  generate(input: LLMInput): Promise<LLMOutput>
  generateStructured<T>(input, schema): Promise<T>
}

// Production:  GemmaProvider → Gemma API
// Demo:        MockLLMProvider → Pre-built quests
// Offline:     LocalGemmaProvider → Local model`}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Connection modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Connection Modes</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="w-5 h-5 text-moss-500" />
                <h3 className="font-semibold">🟢 Connected</h3>
              </div>
              <ul className="text-sm space-y-1 text-text-secondary dark:text-text-on-dark-muted">
                <li>• Full AI generation via Gemma</li>
                <li>• Live search via SerpApi</li>
                <li>• Voice via ElevenLabs</li>
                <li>• RAG via Tiger Data</li>
                <li>• Memory via Backboard</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <WifiOff className="w-5 h-5 text-sky-500" />
                <h3 className="font-semibold">🟣 Offline</h3>
              </div>
              <ul className="text-sm space-y-1 text-text-secondary dark:text-text-on-dark-muted">
                <li>• Local Gemma model</li>
                <li>• Cached quest templates</li>
                <li>• Local user preferences</li>
                <li>• No cloud dependencies</li>
                <li>• Browser TTS fallback</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-moss-200 dark:border-moss-800">
                  <th className="text-left px-5 py-3 font-semibold">Method</th>
                  <th className="text-left px-5 py-3 font-semibold">Endpoint</th>
                  <th className="text-left px-5 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-moss-100 dark:divide-moss-800 font-mono text-xs">
                {[
                  ['POST', '/api/quest/generate', 'Generate a new quest'],
                  ['POST', '/api/quest/complete', 'Complete a quest attempt'],
                  ['GET', '/api/quest/history', 'Get quest history'],
                  ['GET', '/api/user/profile', 'Get user profile'],
                  ['GET', '/api/system/status', 'System/provider status'],
                ].map(([method, endpoint, desc]) => (
                  <tr key={endpoint}>
                    <td className={`px-5 py-2.5 font-semibold ${method === 'POST' ? 'text-sky-500' : 'text-moss-500'}`}>{method}</td>
                    <td className="px-5 py-2.5">{endpoint}</td>
                    <td className="px-5 py-2.5 font-sans text-text-secondary dark:text-text-on-dark-muted">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
