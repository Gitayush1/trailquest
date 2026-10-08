'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Leaf, Clock, Target, Calendar } from 'lucide-react';
import type { QuestAttempt } from '@/types/quest';

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<QuestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/quest/history');
        if (res.ok) {
          const data = await res.json();
          setAttempts(data.attempts || []);
          setStats({ total: data.total || 0, completed: data.completed || 0 });
        }
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-dvh bg-nature-gradient">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="font-semibold">Quest History</h1>
          <span className="demo-badge text-xs">Demo</span>
        </div>
      </header>

      <main className="pt-24 pb-24 px-6 max-w-2xl mx-auto">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="glass rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-moss-600 dark:text-moss-400">{stats.total}</div>
            <div className="text-sm text-text-muted dark:text-text-on-dark-muted mt-1">Total Quests</div>
          </div>
          <div className="glass rounded-2xl p-5 text-center">
            <div className="text-3xl font-bold text-moss-600 dark:text-moss-400">{stats.completed}</div>
            <div className="text-sm text-text-muted dark:text-text-on-dark-muted mt-1">Completed</div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl animate-breathe mb-4">🌱</div>
            <p className="text-text-muted dark:text-text-on-dark-muted">Loading history...</p>
          </div>
        ) : attempts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="text-xl font-bold mb-2">No quests yet</h2>
            <p className="text-text-muted dark:text-text-on-dark-muted mb-6">Your adventure log is empty. Time to touch grass!</p>
            <Link href="/quest" className="touch-grass-btn inline-flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Start Your First Quest
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt, i) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{attempt.quest.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{attempt.quest.title}</h3>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                        attempt.status === 'completed'
                          ? 'bg-moss-100 dark:bg-moss-900 text-moss-600 dark:text-moss-300'
                          : attempt.status === 'active'
                          ? 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300'
                          : 'bg-earth-100 dark:bg-earth-900 text-earth-600 dark:text-earth-300'
                      }`}>
                        {attempt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-muted dark:text-text-on-dark-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {attempt.quest.duration}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {attempt.quest.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(attempt.startedAt)}
                      </span>
                    </div>
                    {attempt.score !== undefined && attempt.score !== null && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-moss-100 dark:bg-moss-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-moss-500 rounded-full"
                            style={{ width: `${Math.round(attempt.score * 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-text-muted dark:text-text-on-dark-muted">
                            Score: {Math.round(attempt.score * 100)}%
                          </span>
                          {attempt.xpEarned > 0 && (
                            <span className="text-xs font-medium text-moss-600 dark:text-moss-400">
                              +{attempt.xpEarned} XP
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 w-full glass py-3 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-xs text-text-muted dark:text-text-on-dark-muted hover:text-text-primary dark:hover:text-text-on-dark transition-colors">
            <Leaf className="w-5 h-5" />
            Home
          </Link>
          <Link href="/quest" className="flex flex-col items-center gap-1 text-xs text-text-muted dark:text-text-on-dark-muted hover:text-text-primary dark:hover:text-text-on-dark transition-colors">
            <Target className="w-5 h-5" />
            Quest
          </Link>
          <Link href="/history" className="flex flex-col items-center gap-1 text-xs text-moss-600 dark:text-moss-400 font-medium">
            <Clock className="w-5 h-5" />
            History
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-xs text-text-muted dark:text-text-on-dark-muted hover:text-text-primary dark:hover:text-text-on-dark transition-colors">
            <span className="text-lg">👤</span>
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
