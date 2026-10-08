'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, Star, ArrowRight, Leaf, Sparkles } from 'lucide-react';
import type { Achievement } from '@/types/quest';

interface CompletionData {
  attempt: {
    quest: { title: string; emoji: string; duration: number; difficulty: string };
    score: number;
    objectiveResults: { objectiveId: string; completed: boolean }[];
    reflection?: string;
  };
  xpEarned: number;
  newAchievements: Achievement[];
  user: {
    xp: number;
    level: number;
    questsCompleted: number;
  };
}

export default function QuestCompletePage() {
  const [data, setData] = useState<CompletionData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('completionResult');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-dvh bg-nature-gradient flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-5xl mb-4">🌱</div>
          <h1 className="text-2xl font-bold mb-4">No completion data found</h1>
          <Link href="/quest" className="touch-grass-btn inline-flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Start a Quest
          </Link>
        </div>
      </div>
    );
  }

  const { attempt, xpEarned, newAchievements, user } = data;
  const scorePercent = Math.round((attempt.score || 0) * 100);
  const completedCount = attempt.objectiveResults.filter((o) => o.completed).length;
  const totalCount = attempt.objectiveResults.length;

  return (
    <div className="min-h-dvh bg-nature-gradient">
      <main className="px-6 py-16 max-w-lg mx-auto text-center">
        {/* Celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="text-7xl mb-4">{attempt.quest.emoji}</div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Quest Complete!</h1>
            <p className="text-text-secondary dark:text-text-on-dark-muted text-lg">{attempt.quest.title}</p>
          </motion.div>
        </motion.div>

        {/* Score Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-moss-200 dark:text-moss-800" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                className="text-moss-500"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - attempt.score) }}
                transition={{ delay: 0.6, duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{scorePercent}%</span>
              <span className="text-xs text-text-muted dark:text-text-on-dark-muted">score</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="glass rounded-xl p-4">
            <div className="text-2xl font-bold text-moss-600 dark:text-moss-400">+{xpEarned}</div>
            <div className="text-xs text-text-muted dark:text-text-on-dark-muted mt-1">XP Earned</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
            <div className="text-xs text-text-muted dark:text-text-on-dark-muted mt-1">Objectives</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-2xl font-bold">Lv.{user.level}</div>
            <div className="text-xs text-text-muted dark:text-text-on-dark-muted mt-1">Level</div>
          </div>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-xl p-4 mb-8"
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium flex items-center gap-1.5">
              <Star className="w-4 h-4 text-sunset-400" />
              Level {user.level}
            </span>
            <span className="text-text-muted dark:text-text-on-dark-muted">{user.xp} XP</span>
          </div>
          <div className="h-2 bg-moss-100 dark:bg-moss-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-moss-500 to-moss-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(user.xp % 200) / 2}%` }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </div>
          <p className="text-xs text-text-muted dark:text-text-on-dark-muted mt-1.5">
            {200 - (user.xp % 200)} XP to Level {user.level + 1}
          </p>
        </motion.div>

        {/* New Achievements */}
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-8"
          >
            <h3 className="flex items-center justify-center gap-2 font-semibold mb-4">
              <Trophy className="w-5 h-5 text-sunset-400" />
              New Achievement{newAchievements.length > 1 ? 's' : ''}!
            </h3>
            <div className="space-y-3">
              {newAchievements.map((achievement) => (
                <motion.div
                  key={achievement.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="text-3xl">{achievement.emoji}</div>
                  <div className="text-left">
                    <div className="font-semibold">{achievement.name}</div>
                    <div className="text-sm text-text-muted dark:text-text-on-dark-muted">{achievement.description}</div>
                  </div>
                  <div className="ml-auto text-sm font-bold text-moss-500">+{achievement.xpReward} XP</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reflection */}
        {attempt.reflection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass rounded-xl p-4 mb-8 text-left"
          >
            <h3 className="text-sm font-medium text-text-muted dark:text-text-on-dark-muted mb-2">Your Reflection</h3>
            <p className="text-sm italic">&ldquo;{attempt.reflection}&rdquo;</p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="space-y-3"
        >
          <Link href="/quest" className="touch-grass-btn w-full flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5" />
            Another Quest
          </Link>
          <Link
            href="/history"
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-text-secondary dark:text-text-on-dark-muted hover:text-text-primary dark:hover:text-text-on-dark transition-colors"
          >
            View History
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
