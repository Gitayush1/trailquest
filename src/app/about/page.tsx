'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Brain, WifiOff, Shield, Eye, Leaf, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-nature-gradient">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="font-semibold">About TrailQuest</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="text-6xl mb-6">🌱</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why We Built TrailQuest</h2>
          <p className="text-lg text-text-secondary dark:text-text-on-dark-muted max-w-2xl mx-auto leading-relaxed">
            AI has become extraordinarily good at keeping us on screens. We asked: what if AI had the opposite goal?
          </p>
        </motion.div>

        {/* The Problem */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-4">The Problem</h3>
          <div className="glass rounded-2xl p-6 space-y-4 text-text-secondary dark:text-text-on-dark-muted leading-relaxed">
            <p>
              The average person spends over 7 hours a day looking at screens. AI assistants, despite their power, tend to make this worse — every interaction is another reason to keep scrolling, typing, reading.
            </p>
            <p>
              We love AI. But we also believe the real world is more interesting than any screen. The challenge was simple: can we build an AI that genuinely makes people want to put their phone down?
            </p>
          </div>
        </motion.section>

        {/* The Solution */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-4">The Idea</h3>
          <div className="glass rounded-2xl p-6 space-y-4 text-text-secondary dark:text-text-on-dark-muted leading-relaxed">
            <p>
              TrailQuest is an AI adventure agent that creates personalized outdoor micro-quests. You tell it how much time you have, what sounds fun, and how adventurous you feel. It generates a real-world quest — then tells you to put your phone away.
            </p>
            <p className="font-semibold text-text-primary dark:text-text-on-dark">
              The screen is intentionally the shortest part of the experience.
            </p>
          </div>
        </motion.section>

        {/* Why Open AI */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-moss-500" />
            Why Open AI Matters
          </h3>
          <div className="space-y-4">
            {[
              {
                title: 'Privacy',
                desc: 'Your location, preferences, and outdoor activities stay under your control. Open models can run locally.',
                icon: <Shield className="w-5 h-5" />,
              },
              {
                title: 'Offline Mode',
                desc: 'Open-weight models like Gemma can run on your device. No internet? No problem. You can still get quest recommendations.',
                icon: <WifiOff className="w-5 h-5" />,
              },
              {
                title: 'Transparency',
                desc: 'You can inspect exactly how the model reasons about safety, quest difficulty, and personalization.',
                icon: <Eye className="w-5 h-5" />,
              },
              {
                title: 'No Lock-in',
                desc: 'TrailQuest is built on provider abstractions. Swap models, providers, or hosting without touching application code.',
                icon: <Leaf className="w-5 h-5" />,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-5 flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-moss-100 dark:bg-moss-900 flex items-center justify-center text-moss-600 dark:text-moss-300 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-text-secondary dark:text-text-on-dark-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Architecture */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-4">Architecture</h3>
          <div className="glass rounded-2xl p-6 font-mono text-sm leading-loose text-text-secondary dark:text-text-on-dark-muted overflow-x-auto">
            <pre>{`User Request
    ↓
Quest Planner Agent (Mastra)
    ├── Context Agent → Weather, Location
    ├── Memory Agent → Backboard (preferences)
    ├── Knowledge Agent → Tiger Data RAG
    └── Search Agent → SerpApi (if needed)
    ↓
Gemma (Open-Weight Model)
    ↓
Candidate Quests
    ↓
TabPFN Predictor → Completion probability
    ↓
Safety Agent → Check conditions
    ↓
Final Quest
    ↓
ElevenLabs Voice → "Put your phone away."
    ↓
User Goes Outside 🌿`}</pre>
          </div>
        </motion.section>

        {/* Partners */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-4">Partner Integrations</h3>
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-moss-200 dark:border-moss-800">
                  <th className="text-left px-5 py-3 font-semibold">Partner</th>
                  <th className="text-left px-5 py-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-moss-100 dark:divide-moss-800">
                {[
                  ['Gemma', 'Core open-weight reasoning model'],
                  ['MongoDB Atlas', 'Application database + vector search'],
                  ['Mastra', 'Agent orchestration framework'],
                  ['SerpApi', 'Live web search for outdoor activities'],
                  ['ElevenLabs', 'Voice-first outdoor guidance'],
                  ['Tiger Data', 'Outdoor knowledge RAG (pgvector)'],
                  ['Backboard', 'Long-term agent memory'],
                  ['TabPFN', 'Quest completion prediction'],
                  ['Temporal', 'Durable quest workflows'],
                  ['Sentry', 'Agent observability + tracing'],
                  ['DigitalOcean', 'GPU inference hosting'],
                  ['Render', 'Application deployment'],
                ].map(([partner, role]) => (
                  <tr key={partner} className="hover:bg-moss-50 dark:hover:bg-moss-900/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{partner}</td>
                    <td className="px-5 py-3 text-text-secondary dark:text-text-on-dark-muted">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Philosophy quote */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <blockquote className="text-xl sm:text-2xl font-semibold italic leading-relaxed mb-4">
            &ldquo;TrailQuest uses open AI to make the real world more interesting than the screen.&rdquo;
          </blockquote>
        </motion.section>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/quest" className="touch-grass-btn inline-flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Try It
          </Link>
          <Link href="/developer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-moss-300 dark:border-moss-700 font-medium text-sm hover:bg-moss-50 dark:hover:bg-moss-900 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Developer View
          </Link>
        </div>
      </main>
    </div>
  );
}
