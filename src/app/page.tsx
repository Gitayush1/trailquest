'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, ChevronDown, Wifi, WifiOff, Shield, Mic, Brain, Eye } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-nature-gradient">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="text-2xl">🌱</span>
            <span>TrailQuest</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/history" className="opacity-70 hover:opacity-100 transition-opacity hidden sm:block">
              History
            </Link>
            <Link href="/profile" className="opacity-70 hover:opacity-100 transition-opacity hidden sm:block">
              Profile
            </Link>
            <Link href="/about" className="opacity-70 hover:opacity-100 transition-opacity hidden sm:block">
              About
            </Link>
            <span className="demo-badge">Demo Mode</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-dvh flex flex-col items-center justify-center px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {/* Floating leaf */}
          <motion.div
            className="text-6xl mb-8 inline-block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌿
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            AI that wants you to
            <br />
            <span className="bg-gradient-to-r from-moss-500 to-moss-700 bg-clip-text text-transparent dark:from-moss-300 dark:to-moss-500">
              use your phone less.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary dark:text-text-on-dark-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            TrailQuest turns open AI into real-world adventures — personalized to your time, interests, environment, and surroundings.
          </p>

          {/* Main CTA */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href="/quest" className="touch-grass-btn inline-flex items-center gap-3 text-xl">
              <Leaf className="w-6 h-6" />
              Touch Grass
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6"
          >
            <a
              href="#how-it-works"
              className="text-sm font-medium text-text-muted dark:text-text-on-dark-muted hover:text-text-primary dark:hover:text-text-on-dark transition-colors"
            >
              See how it works ↓
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-text-muted dark:text-text-on-dark-muted" />
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The screen is the{' '}
              <span className="italic">shortest</span>{' '}
              part.
            </h2>
            <p className="text-text-secondary dark:text-text-on-dark-muted text-lg max-w-xl mx-auto">
              Most AI keeps you scrolling. TrailQuest gives you a reason to stop.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🌱', title: 'Touch Grass', desc: 'Tell the AI how much time you have and what sounds fun.' },
              { icon: '🤖', title: 'AI Plans', desc: 'Open-weight Gemma creates a personalized outdoor quest.' },
              { icon: '📱', title: 'Phone Away', desc: 'Put your phone in your pocket. Voice guides you.' },
              { icon: '🌍', title: 'Go Outside', desc: 'Complete real-world objectives. Discover something new.' },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-on-dark-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built different.</h2>
            <p className="text-text-secondary dark:text-text-on-dark-muted text-lg max-w-xl mx-auto">
              Not another chatbot with a green theme.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'Open AI at the Core',
                desc: 'Powered by Gemma, an open-weight model. No closed API lock-in. Your data, your model.',
                tag: 'Gemma',
              },
              {
                icon: <WifiOff className="w-6 h-6" />,
                title: 'Offline Mode',
                desc: 'Generate quests without internet. Open AI makes this possible.',
                tag: 'Privacy',
              },
              {
                icon: <Mic className="w-6 h-6" />,
                title: 'Voice-First Outdoors',
                desc: 'ElevenLabs narrates your quest so you can keep your phone in your pocket.',
                tag: 'ElevenLabs',
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: 'AI Verification',
                desc: 'Photo and audio evidence verified by AI. No honor-system gaming.',
                tag: 'Vision',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Safety Agent',
                desc: 'Every quest passes a safety check. Weather, darkness, terrain — all considered.',
                tag: 'Safety',
              },
              {
                icon: <Wifi className="w-6 h-6" />,
                title: 'Agent Memory',
                desc: 'TrailQuest remembers what you enjoy. Quests get better over time.',
                tag: 'Backboard',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass rounded-2xl p-6 group hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-moss-100 dark:bg-moss-900 flex items-center justify-center text-moss-600 dark:text-moss-300 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-on-dark-muted leading-relaxed mb-3">{feature.desc}</p>
                <span className="text-xs font-medium text-moss-600 dark:text-moss-400 bg-moss-100 dark:bg-moss-900 px-2 py-1 rounded-full">
                  {feature.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-semibold leading-relaxed mb-6 italic"
          >
            &ldquo;The best AI product is one that makes the real world more interesting than the screen itself.&rdquo;
          </motion.blockquote>
          <p className="text-text-muted dark:text-text-on-dark-muted text-sm">
            — The TrailQuest Philosophy
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-text-secondary dark:text-text-on-dark-muted mb-8">
            Your next adventure is outside.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/quest" className="touch-grass-btn inline-flex items-center gap-3">
              <Leaf className="w-5 h-5" />
              Touch Grass
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-moss-200 dark:border-moss-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted dark:text-text-on-dark-muted">
          <div className="flex items-center gap-2">
            <span>🌱</span>
            <span>TrailQuest — Built with open AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-text-primary dark:hover:text-text-on-dark transition-colors">
              About
            </Link>
            <Link href="/developer" className="hover:text-text-primary dark:hover:text-text-on-dark transition-colors">
              Developer
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary dark:hover:text-text-on-dark transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
