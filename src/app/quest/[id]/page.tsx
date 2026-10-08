'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Play, Clock, MapPin, Target, Shield, Zap, ChevronRight } from 'lucide-react';
import type { Quest, AgentStep } from '@/types/quest';

interface QuestData {
  quest: Quest;
  attemptId: string;
  agentRun: {
    steps: AgentStep[];
    totalDurationMs: number;
  };
}

export default function QuestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [data, setData] = useState<QuestData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('activeQuest');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        router.push('/quest');
      }
    } else {
      router.push('/quest');
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-dvh bg-nature-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-breathe">🌱</div>
          <p className="text-text-muted dark:text-text-on-dark-muted">Loading quest...</p>
        </div>
      </div>
    );
  }

  const { quest, attemptId, agentRun } = data;

  return (
    <div className="min-h-dvh bg-nature-gradient pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/quest" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            New Quest
          </Link>
          {quest.metadata.demoMode && <span className="demo-badge text-xs">Demo</span>}
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Quest Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="text-6xl mb-4 inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            {quest.emoji}
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{quest.title}</h1>
          <p className="text-text-secondary dark:text-text-on-dark-muted text-lg leading-relaxed max-w-lg mx-auto">
            {quest.description}
          </p>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <span className="flex items-center gap-1.5 bg-moss-100 dark:bg-moss-900 text-moss-700 dark:text-moss-300 px-3 py-1.5 rounded-full text-sm font-medium">
            <Clock className="w-3.5 h-3.5" />
            {quest.duration} min
          </span>
          {quest.distance && (
            <span className="flex items-center gap-1.5 bg-moss-100 dark:bg-moss-900 text-moss-700 dark:text-moss-300 px-3 py-1.5 rounded-full text-sm font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {quest.distance}
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-moss-100 dark:bg-moss-900 text-moss-700 dark:text-moss-300 px-3 py-1.5 rounded-full text-sm font-medium">
            <Target className="w-3.5 h-3.5" />
            {quest.difficulty}
          </span>
        </motion.div>

        {/* Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-moss-500" />
            Your Mission
          </h2>
          <ol className="space-y-3">
            {quest.objectives.map((obj, i) => (
              <motion.li
                key={obj.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex gap-3 items-start"
              >
                <span className="w-7 h-7 rounded-full bg-moss-100 dark:bg-moss-800 text-moss-600 dark:text-moss-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium leading-snug">{obj.description}</p>
                  {obj.optional && (
                    <span className="text-xs text-text-muted dark:text-text-on-dark-muted mt-0.5 inline-block">Optional</span>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Rule */}
        {quest.rule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-moss-500 text-white rounded-2xl p-6 mb-6 text-center"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-2 opacity-80">The Rule</h3>
            <p className="text-lg font-semibold leading-snug">{quest.rule}</p>
          </motion.div>
        )}

        {/* Tips */}
        {quest.tips && quest.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6 mb-6"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 text-text-muted dark:text-text-on-dark-muted">
              💡 Tips
            </h3>
            <ul className="space-y-2">
              {quest.tips.map((tip, i) => (
                <li key={i} className="text-sm text-text-secondary dark:text-text-on-dark-muted flex gap-2">
                  <span className="text-moss-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Safety */}
        {quest.safetyNotes && quest.safetyNotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass rounded-2xl p-6 mb-6 border-l-4 border-sunset-400"
          >
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2 text-sunset-500">
              <Shield className="w-4 h-4" />
              Safety
            </h3>
            <ul className="space-y-2">
              {quest.safetyNotes.map((note, i) => (
                <li key={i} className="text-sm text-text-secondary dark:text-text-on-dark-muted">{note}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Agent Trace (collapsed) */}
        <motion.details
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 mb-6 group"
        >
          <summary className="font-semibold text-sm uppercase tracking-wider cursor-pointer flex items-center gap-2 text-text-muted dark:text-text-on-dark-muted">
            <Zap className="w-4 h-4" />
            Agent Trace — {agentRun.totalDurationMs}ms total
            <ChevronRight className="w-4 h-4 ml-auto group-open:rotate-90 transition-transform" />
          </summary>
          <div className="mt-4 space-y-2">
            {agentRun.steps.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-moss-100 dark:border-moss-800 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-moss-400" />
                  <span className="font-medium">{s.agent}</span>
                  <span className="text-text-muted dark:text-text-on-dark-muted">→ {s.action}</span>
                </div>
                <span className="font-mono text-xs text-text-muted dark:text-text-on-dark-muted">{s.durationMs}ms</span>
              </div>
            ))}
          </div>
        </motion.details>

        {/* Completion probability */}
        {quest.metadata.completionProbability && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-center text-sm text-text-muted dark:text-text-on-dark-muted mb-8"
          >
            Estimated completion: {Math.round(quest.metadata.completionProbability * 100)}%
          </motion.div>
        )}
      </main>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 w-full glass py-4 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sessionStorage.setItem('activeAttemptId', attemptId);
              router.push(`/quest/${params.id}/active`);
            }}
            className="touch-grass-btn w-full flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" />
            Start Quest
          </motion.button>
        </div>
      </div>
    </div>
  );
}
