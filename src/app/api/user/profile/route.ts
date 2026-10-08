// ============================================
// TrailQuest — User Profile API
// ============================================
import { NextResponse } from 'next/server';
import { getDemoUser, ACHIEVEMENTS } from '@/services/quest';

export async function GET() {
  try {
    const user = getDemoUser();
    const allAchievements = ACHIEVEMENTS.map(a => ({
      ...a,
      earned: user.achievements.includes(a.key),
    }));

    return NextResponse.json({
      user,
      achievements: allAchievements,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
