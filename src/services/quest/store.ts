// ============================================
// TrailQuest — In-Memory Quest Store
// ============================================
// Used in demo mode when MongoDB is not configured.
// Production uses MongoDB Atlas.
// ============================================

import type { Quest, QuestAttempt, UserProfile } from '@/types/quest';

// In-memory stores (reset on server restart)
const quests = new Map<string, Quest>();
const attempts = new Map<string, QuestAttempt>();
const users = new Map<string, UserProfile>();

// Default demo user
const DEMO_USER_ID = 'demo-user';

export function getDemoUser(): UserProfile {
  if (!users.has(DEMO_USER_ID)) {
    users.set(DEMO_USER_ID, {
      id: DEMO_USER_ID,
      name: 'Explorer',
      preferences: {
        favoriteActivities: [],
        dislikedActivities: [],
        accessibility: [],
      },
      xp: 0,
      level: 1,
      streak: 0,
      questsCompleted: 0,
      achievements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return users.get(DEMO_USER_ID)!;
}

export function saveQuest(quest: Quest): void {
  quests.set(quest.id, quest);
}

export function getQuest(id: string): Quest | undefined {
  return quests.get(id);
}

export function saveAttempt(attempt: QuestAttempt): void {
  attempts.set(attempt.id, attempt);
}

export function getAttempt(id: string): QuestAttempt | undefined {
  return attempts.get(id);
}

export function getAttemptsByUser(userId: string): QuestAttempt[] {
  return Array.from(attempts.values())
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export function updateUser(userId: string, updates: Partial<UserProfile>): UserProfile {
  const user = users.get(userId) || getDemoUser();
  const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
  users.set(userId, updated);
  return updated;
}

export function getUser(userId: string): UserProfile | undefined {
  return users.get(userId);
}

// Achievement definitions
export const ACHIEVEMENTS = [
  { key: 'first_step', name: 'First Step', description: 'Complete your first quest', emoji: '👣', xpReward: 50, condition: 'Complete 1 quest' },
  { key: 'ten_min_explorer', name: '10-Min Explorer', description: 'Complete a 10-minute quest', emoji: '⏱️', xpReward: 30, condition: 'Complete a 10min quest' },
  { key: 'touch_grass_5', name: 'Touch Grass ×5', description: 'Complete 5 quests', emoji: '🌿', xpReward: 100, condition: 'Complete 5 quests' },
  { key: 'nature_detective', name: 'Nature Detective', description: 'Complete 3 nature quests', emoji: '🔍', xpReward: 75, condition: '3 nature quests' },
  { key: 'bird_watcher', name: 'Bird Watcher', description: 'Complete a discover quest focused on wildlife', emoji: '🐦', xpReward: 60, condition: 'Wildlife quest' },
  { key: 'weekend_explorer', name: 'Weekend Explorer', description: 'Complete quests on both Saturday and Sunday', emoji: '🗓️', xpReward: 80, condition: 'Weekend quests' },
  { key: 'screen_breaker', name: 'Screen Breaker', description: 'Complete an adventure difficulty quest', emoji: '📱', xpReward: 90, condition: 'Adventure quest' },
  { key: 'offline_explorer', name: 'Offline Explorer', description: 'Complete a quest in offline mode', emoji: '📡', xpReward: 120, condition: 'Offline quest' },
  { key: 'photographer', name: 'Outdoor Photographer', description: 'Submit 10 photo evidence', emoji: '📸', xpReward: 100, condition: '10 photos' },
  { key: 'streak_3', name: 'Three-Day Streak', description: 'Complete quests 3 days in a row', emoji: '🔥', xpReward: 150, condition: '3-day streak' },
];

export function checkNewAchievements(userId: string): string[] {
  const user = users.get(userId);
  if (!user) return [];

  const userAttempts = getAttemptsByUser(userId).filter((a) => a.status === 'completed');
  const newAchievements: string[] = [];

  // First Step
  if (!user.achievements.includes('first_step') && userAttempts.length >= 1) {
    newAchievements.push('first_step');
  }

  // Touch Grass x5
  if (!user.achievements.includes('touch_grass_5') && userAttempts.length >= 5) {
    newAchievements.push('touch_grass_5');
  }

  // Screen Breaker
  if (!user.achievements.includes('screen_breaker') && userAttempts.some((a) => a.quest.difficulty === 'adventure')) {
    newAchievements.push('screen_breaker');
  }

  // 10-Min Explorer
  if (!user.achievements.includes('ten_min_explorer') && userAttempts.some((a) => a.quest.duration <= 10)) {
    newAchievements.push('ten_min_explorer');
  }

  // Nature Detective
  if (!user.achievements.includes('nature_detective')) {
    const natureQuests = userAttempts.filter((a) => a.quest.activityType === 'nature');
    if (natureQuests.length >= 3) newAchievements.push('nature_detective');
  }

  if (newAchievements.length > 0) {
    updateUser(userId, {
      achievements: [...user.achievements, ...newAchievements],
    });
  }

  return newAchievements;
}

export function calculateXP(quest: Quest, score: number): number {
  const baseXP = quest.duration * 2;
  const difficultyMultiplier = quest.difficulty === 'chill' ? 1 : quest.difficulty === 'curious' ? 1.5 : 2;
  return Math.round(baseXP * difficultyMultiplier * score);
}
