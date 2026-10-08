'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Trophy, Leaf, Clock, Target, Zap } from 'lucide-react';
import type { UserProfile } from '@/types/quest';

interface AchievementDisplay {
  key: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  condition: string;
  earned: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<AchievementDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setAchievements(data.achievements || []);
        }
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh bg-nature-gradient flex items-center justify-center">
        <div className="text-4xl animate-breathe">🌱</div>
      </div>
    );
  }

  const xpToNext = user ? 200 - (user.xp % 200) : 200;
  const xpProgress = user ? (user.xp % 200) / 200 : 0;

  return (
    <div className="min-h-dvh bg-nature-gradient">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="font-semibold">Profile</h1>
          <span className="demo-badge text-xs">Demo</span>
        </div>
      </header>

      <main className="pt-24 pb-24 px-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-moss-100 dark:bg-moss-900 flex items-center justify-center text-4xl mx-auto mb-4">
            🌿
          </div>
          <h2 className="text-2xl font-bold">{user?.name || 'Explorer'}</h2>
          <p className="text-text-muted dark:text-text-on-dark-muted text-sm mt-1">
            Joined {user ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
          </p>
        </motion.div>

        {/* Level & XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-sunset-400" />
              <span className="font-semibold">Level {user?.level || 1}</span>
            </div>
            <span className="text-sm text-text-muted dark:text-text-on-dark-muted">{user?.xp || 0} XP total</span>
          </div>
          <div className="h-3 bg-moss-100 dark:bg-moss-900 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-moss-500 to-moss-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </div>
          <p className="text-xs text-text-muted dark:text-text-on-dark-muted">{xpToNext} XP to next level</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="glass rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-moss-500" />
            <div className="text-xl font-bold">{user?.questsCompleted || 0}</div>
            <div className="text-xs text-text-muted dark:text-text-on-dark-muted">Quests</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-moss-500" />
            <div className="text-xl font-bold">{user?.streak || 0}</div>
            <div className="text-xs text-text-muted dark:text-text-on-dark-muted">Streak</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-sunset-400" />
            <div className="text-xl font-bold">{user?.achievements.length || 0}</div>
            <div className="text-xs text-text-muted dark:text-text-on-dark-muted">Badges</div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-sunset-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((a, i) => (
              <motion.div
                key={a.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className={`glass rounded-xl p-4 text-center transition-all ${
                  a.earned ? '' : 'opacity-40 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{a.emoji}</div>
                <div className="font-semibold text-sm">{a.name}</div>
                <div className="text-xs text-text-muted dark:text-text-on-dark-muted mt-1">{a.description}</div>
                {a.earned && (
                  <div className="text-xs font-medium text-moss-600 dark:text-moss-400 mt-2">+{a.xpReward} XP</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
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
          <Link href="/history" className="flex flex-col items-center gap-1 text-xs text-text-muted dark:text-text-on-dark-muted hover:text-text-primary dark:hover:text-text-on-dark transition-colors">
            <Clock className="w-5 h-5" />
            History
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-xs text-moss-600 dark:text-moss-400 font-medium">
            <span className="text-lg">👤</span>
            Profile
          </Link>
        </div>
      </nav>
    </div>
  );
}
