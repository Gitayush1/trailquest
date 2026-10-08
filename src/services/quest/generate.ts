// ============================================
// TrailQuest — Quest Generation Service
// ============================================
// Orchestrates the quest generation pipeline:
// 1. Parse user request
// 2. Fetch context (memory, weather, search)
// 3. Generate quest via LLM
// 4. Validate safety
// 5. Return final quest
// ============================================

import { nanoid } from 'nanoid';
import { QuestSchema, type Quest, type QuestRequest } from '@/types/quest';
import { getLLMProvider } from '@/services/ai';
import type { AgentStep } from '@/types/quest';

const QUEST_SYSTEM_PROMPT = `You are TrailQuest, an AI adventure agent that creates personalized real-world outdoor micro-adventures.

Your job is to generate a quest that:
1. Gets the user OUTSIDE and away from their screen
2. Is achievable in the given time
3. Matches the requested difficulty and mood
4. Has clear, actionable objectives
5. Includes a "rule" that encourages the user to put their phone away
6. Is SAFE — never suggest anything dangerous

You must respond with a JSON object matching this exact structure:
{
  "id": "quest-<random>",
  "title": "Quest Title",
  "emoji": "🌳",
  "description": "A compelling 1-2 sentence description",
  "duration": <number in minutes>,
  "difficulty": "<chill|curious|adventure>",
  "activityType": "<nature|discover|movement|photography|surprise|friends>",
  "distance": "~<estimate>",
  "objectives": [
    {
      "id": "obj-<n>",
      "description": "What the user should do",
      "type": "<observe|find|photograph|listen|touch|move|create|reflect>",
      "verifiable": <true if photo/audio can verify>,
      "optional": false
    }
  ],
  "tips": ["Helpful tip"],
  "safetyNotes": ["Safety note"],
  "rule": "A rule that encourages putting the phone away",
  "metadata": {
    "model": "<model name>",
    "generatedAt": "<ISO timestamp>",
    "agentRunId": "<run id>",
    "demoMode": false
  }
}

Design quests that are:
- Sensory-rich: engage sight, sound, touch, smell
- Surprising: make the ordinary feel extraordinary
- Completable: achievable in the given timeframe
- Screen-free: the user should NOT need their phone during the quest
- Safe: avoid dangerous locations, activities, or conditions`;

export interface QuestGenerationResult {
  quest: Quest;
  agentSteps: AgentStep[];
  totalDurationMs: number;
}

export async function generateQuest(request: QuestRequest): Promise<QuestGenerationResult> {
  const steps: AgentStep[] = [];
  const startTime = performance.now();

  // Step 1: Build context
  const contextStart = performance.now();
  const context = buildContext(request);
  steps.push({
    agent: 'ContextAgent',
    action: 'buildContext',
    durationMs: Math.round(performance.now() - contextStart),
    timestamp: new Date().toISOString(),
  });

  // Step 2: Generate quest via LLM
  const llm = getLLMProvider();
  const generateStart = performance.now();

  const quest = await llm.generateStructured(
    {
      prompt: context,
      systemPrompt: QUEST_SYSTEM_PROMPT,
      temperature: 0.8,
      maxTokens: 2048,
      context: { request },
    },
    QuestSchema
  );

  steps.push({
    agent: 'QuestPlannerAgent',
    action: 'generateQuest',
    durationMs: Math.round(performance.now() - generateStart),
    timestamp: new Date().toISOString(),
    output: { model: llm.name, questTitle: quest.title },
  });

  // Step 3: Safety check
  const safetyStart = performance.now();
  const safetyResult = await checkSafety(quest);
  steps.push({
    agent: 'SafetyAgent',
    action: 'checkSafety',
    durationMs: Math.round(performance.now() - safetyStart),
    timestamp: new Date().toISOString(),
    output: { passed: safetyResult.passed, flags: safetyResult.flags },
  });

  if (!safetyResult.passed) {
    // In production, we'd regenerate. For now, add safety notes.
    quest.safetyNotes = [...(quest.safetyNotes || []), ...safetyResult.flags];
  }

  const totalDurationMs = Math.round(performance.now() - startTime);

  return {
    quest,
    agentSteps: steps,
    totalDurationMs,
  };
}

function buildContext(request: QuestRequest): string {
  const timeOfDay = getTimeOfDay();

  return `Generate a quest for a user with these preferences:

TIME: ${request.duration} minutes
MOOD: ${request.mood}
DIFFICULTY: ${request.difficulty}
TIME OF DAY: ${timeOfDay}
${request.freeText ? `USER REQUEST: "${request.freeText}"` : ''}
${request.location?.name ? `LOCATION: ${request.location.name}` : ''}

Remember: The quest should get them OUTSIDE and AWAY from their screen.
The quest must be completable in ${request.duration} minutes.
Difficulty "${request.difficulty}" means:
- chill: relaxing, no pressure, meditative
- curious: engaging, exploratory, mentally stimulating  
- adventure: physically active, challenging, exciting`;
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'early morning (before dawn)';
  if (hour < 9) return 'morning';
  if (hour < 12) return 'late morning';
  if (hour < 14) return 'midday';
  if (hour < 17) return 'afternoon';
  if (hour < 19) return 'evening';
  if (hour < 21) return 'dusk';
  return 'night';
}

interface SafetyCheckResult {
  passed: boolean;
  flags: string[];
}

async function checkSafety(quest: Quest): Promise<SafetyCheckResult> {
  const flags: string[] = [];
  const hour = new Date().getHours();

  // Time-based safety
  if (hour >= 21 || hour < 5) {
    if (quest.difficulty === 'adventure') {
      flags.push('Adventure quests are not recommended after dark. Consider a chill quest instead.');
    }
    flags.push('It is dark outside. Stay in well-lit, familiar areas.');
  }

  // Duration safety
  if (quest.duration > 60) {
    flags.push('Long quests require adequate water and sun protection.');
  }

  // Distance safety
  const distanceMatch = quest.distance?.match(/(\d+(?:\.\d+)?)\s*(km|m)/);
  if (distanceMatch) {
    const distance = parseFloat(distanceMatch[1]);
    const unit = distanceMatch[2];
    const distanceM = unit === 'km' ? distance * 1000 : distance;

    if (distanceM > 3000) {
      flags.push('This is a longer distance quest. Ensure you have appropriate footwear and water.');
    }
  }

  return {
    passed: flags.filter((f) => f.includes('not recommended')).length === 0,
    flags,
  };
}
