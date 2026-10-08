// ============================================
// TrailQuest — Quest Completion API
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getAttempt,
  saveAttempt,
  getDemoUser,
  updateUser,
  calculateXP,
  checkNewAchievements,
  ACHIEVEMENTS,
} from '@/services/quest';

const CompleteRequestSchema = z.object({
  attemptId: z.string(),
  objectiveResults: z.array(z.object({
    objectiveId: z.string(),
    completed: z.boolean(),
  })),
  reflection: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CompleteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const attempt = getAttempt(parsed.data.attemptId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    // Calculate score
    const totalObjectives = attempt.quest.objectives.filter(o => !o.optional).length;
    const completedObjectives = parsed.data.objectiveResults.filter(o => o.completed).length;
    const score = totalObjectives > 0 ? completedObjectives / totalObjectives : 1;

    // Calculate XP
    const xpEarned = calculateXP(attempt.quest, score);

    // Update attempt
    const updatedAttempt = {
      ...attempt,
      status: 'completed' as const,
      score,
      xpEarned,
      objectiveResults: parsed.data.objectiveResults.map(r => ({
        ...r,
        verified: false,
        confidence: r.completed ? 0.8 : 0,
      })),
      completedAt: new Date().toISOString(),
      reflection: parsed.data.reflection,
    };
    saveAttempt(updatedAttempt);

    // Update user
    const user = getDemoUser();
    const updatedUser = updateUser(user.id, {
      xp: user.xp + xpEarned,
      questsCompleted: user.questsCompleted + 1,
      level: Math.floor((user.xp + xpEarned) / 200) + 1,
    });

    // Check for new achievements
    const newAchievements = checkNewAchievements(user.id);
    const achievementDetails = newAchievements
      .map(key => ACHIEVEMENTS.find(a => a.key === key))
      .filter(Boolean);

    // Add achievement XP
    const achievementXP = achievementDetails.reduce((sum, a) => sum + (a?.xpReward || 0), 0);
    if (achievementXP > 0) {
      updateUser(user.id, {
        xp: updatedUser.xp + achievementXP,
      });
    }

    return NextResponse.json({
      attempt: updatedAttempt,
      xpEarned: xpEarned + achievementXP,
      newAchievements: achievementDetails,
      user: {
        xp: updatedUser.xp + achievementXP,
        level: Math.floor((updatedUser.xp + achievementXP) / 200) + 1,
        questsCompleted: updatedUser.questsCompleted,
      },
    });
  } catch (error) {
    console.error('Quest completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete quest' },
      { status: 500 }
    );
  }
}
