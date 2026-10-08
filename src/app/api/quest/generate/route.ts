// ============================================
// TrailQuest — Quest Generation API
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import { QuestRequestSchema } from '@/types/quest';
import { generateQuest, saveQuest, saveAttempt, getDemoUser } from '@/services/quest';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = QuestRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await generateQuest(parsed.data);

    // Save the quest
    saveQuest(result.quest);

    // Create an attempt
    const user = getDemoUser();
    const attempt = {
      id: `attempt-${nanoid(8)}`,
      userId: user.id,
      questId: result.quest.id,
      quest: result.quest,
      status: 'pending' as const,
      xpEarned: 0,
      objectiveResults: [],
      startedAt: new Date().toISOString(),
      agentRun: {
        id: `run-${nanoid(8)}`,
        steps: result.agentSteps,
        totalDurationMs: result.totalDurationMs,
        model: result.quest.metadata.model,
        tokensUsed: 0,
      },
    };
    saveAttempt(attempt);

    return NextResponse.json({
      quest: result.quest,
      attemptId: attempt.id,
      agentRun: {
        steps: result.agentSteps,
        totalDurationMs: result.totalDurationMs,
      },
    });
  } catch (error) {
    console.error('Quest generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quest', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
