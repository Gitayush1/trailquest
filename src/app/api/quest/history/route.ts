// ============================================
// TrailQuest — Quest History API
// ============================================
import { NextResponse } from 'next/server';
import { getAttemptsByUser, getDemoUser } from '@/services/quest';

export async function GET() {
  try {
    const user = getDemoUser();
    const attempts = getAttemptsByUser(user.id);

    return NextResponse.json({
      attempts,
      total: attempts.length,
      completed: attempts.filter(a => a.status === 'completed').length,
    });
  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
