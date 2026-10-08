// ============================================
// TrailQuest — Mock LLM Provider
// ============================================
// Deterministic quest generation for demo mode.
// Returns realistic, pre-built quests so the app
// is fully demoable without any API keys.
// ============================================

import { nanoid } from 'nanoid';
import type { LLMProvider, LLMInput, LLMOutput } from '@/types/providers';
import type { Quest, QuestRequest } from '@/types/quest';
import { z } from 'zod';

const DEMO_QUESTS: Omit<Quest, 'id' | 'metadata'>[] = [
  {
    title: 'The Five-Sense Walk',
    emoji: '🌳',
    description: 'A mindful exploration that engages every sense. Step outside and rediscover the world around you through deliberate observation.',
    duration: 20,
    difficulty: 'curious',
    activityType: 'nature',
    distance: '~800m',
    objectives: [
      { id: 'obj-1', description: 'Find something you have never consciously noticed before', type: 'observe', verifiable: true, optional: false },
      { id: 'obj-2', description: 'Find three different shades of green', type: 'find', verifiable: true, optional: false },
      { id: 'obj-3', description: 'Identify one natural sound you can hear right now', type: 'listen', verifiable: true, optional: false },
      { id: 'obj-4', description: 'Find something that feels unexpectedly textured', type: 'touch', verifiable: true, optional: false },
      { id: 'obj-5', description: 'Take one photo of your favorite discovery', type: 'photograph', verifiable: true, optional: false },
    ],
    tips: ['Walk slowly — this is not a race', 'Look up, down, and behind you', 'Take your shoes off if safe'],
    safetyNotes: ['Stay on marked paths', 'Be aware of your surroundings'],
    rule: 'Once the quest starts, put your phone in your pocket.',
  },
  {
    title: 'Cloud Atlas',
    emoji: '☁️',
    description: 'Look up. The sky is never the same twice. Today you are a cloud cartographer.',
    duration: 10,
    difficulty: 'chill',
    activityType: 'nature',
    distance: '~200m',
    objectives: [
      { id: 'obj-1', description: 'Find a cloud that looks like an animal', type: 'observe', verifiable: true, optional: false },
      { id: 'obj-2', description: 'Count how many different cloud types you can see', type: 'observe', verifiable: false, optional: false },
      { id: 'obj-3', description: 'Take a photo of the most interesting cloud formation', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-4', description: 'Sit or lie down for 2 minutes and just watch the sky', type: 'reflect', verifiable: false, optional: false },
    ],
    tips: ['Find an open area with a clear view of the sky', 'A park bench works perfectly'],
    safetyNotes: ['Watch where you walk while looking up'],
    rule: 'No scrolling. Just sky.',
  },
  {
    title: 'Sound Map',
    emoji: '🎵',
    description: 'Close your eyes and listen. Map every sound you can hear from where you stand. The world is louder than you think.',
    duration: 10,
    difficulty: 'chill',
    activityType: 'discover',
    distance: '~100m',
    objectives: [
      { id: 'obj-1', description: 'Stand still for 60 seconds and count every distinct sound', type: 'listen', verifiable: false, optional: false },
      { id: 'obj-2', description: 'Identify the most distant sound you can hear', type: 'listen', verifiable: false, optional: false },
      { id: 'obj-3', description: 'Find one sound that surprises you', type: 'listen', verifiable: false, optional: false },
      { id: 'obj-4', description: 'Record a 15-second audio clip of your environment', type: 'listen', verifiable: true, optional: true },
    ],
    tips: ['Close your eyes for better focus', 'Try facing different directions'],
    safetyNotes: ['Stay aware of your surroundings even with eyes closed', 'Choose a safe location'],
    rule: 'Phone in pocket. Ears open.',
  },
  {
    title: 'Micro Safari',
    emoji: '🔍',
    description: 'The ground beneath your feet is alive. Get close. Go small. Discover the tiny world.',
    duration: 20,
    difficulty: 'curious',
    activityType: 'discover',
    distance: '~300m',
    objectives: [
      { id: 'obj-1', description: 'Find and photograph three different insects or small creatures', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-2', description: 'Find a plant growing in an unexpected place', type: 'find', verifiable: true, optional: false },
      { id: 'obj-3', description: 'Spot evidence of animal activity (web, nest, tracks, burrow)', type: 'find', verifiable: true, optional: false },
      { id: 'obj-4', description: 'Find the smallest flower you can', type: 'find', verifiable: true, optional: false },
    ],
    tips: ['Crouch down — literally change your perspective', 'Check under leaves and on tree bark', 'Morning and late afternoon are best for insect activity'],
    safetyNotes: ['Don\'t touch unknown insects', 'Watch for thorns and nettles', 'Avoid disturbing nests'],
    rule: 'Get low. Look close. Go slow.',
  },
  {
    title: 'Sunset Sprint',
    emoji: '🌅',
    description: 'A fast-paced movement quest. Get your heart pumping while exploring your neighborhood from new angles.',
    duration: 30,
    difficulty: 'adventure',
    activityType: 'movement',
    distance: '~2km',
    objectives: [
      { id: 'obj-1', description: 'Run or walk briskly to the highest point within 1km of your start', type: 'move', verifiable: false, optional: false },
      { id: 'obj-2', description: 'Find three different types of trees along your route', type: 'find', verifiable: true, optional: false },
      { id: 'obj-3', description: 'Take a photo from the highest point you reach', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-4', description: 'Find a route back that you have never walked before', type: 'move', verifiable: false, optional: false },
      { id: 'obj-5', description: 'Do 10 pushups or stretches at your turnaround point', type: 'move', verifiable: false, optional: true },
    ],
    tips: ['Warm up before running', 'Stay hydrated', 'Use the return route to cool down'],
    safetyNotes: ['Watch for traffic', 'Stay on well-lit paths', 'Carry your phone for emergencies'],
    rule: 'Move first. Think later. Phone stays away.',
  },
  {
    title: 'The Texture Hunt',
    emoji: '🤲',
    description: 'Touch things. Really feel them. We spend so much time touching glass screens — today, touch the real world.',
    duration: 20,
    difficulty: 'chill',
    activityType: 'nature',
    distance: '~500m',
    objectives: [
      { id: 'obj-1', description: 'Find and touch five completely different textures (bark, stone, leaf, grass, soil)', type: 'touch', verifiable: false, optional: false },
      { id: 'obj-2', description: 'Find the roughest texture you can', type: 'touch', verifiable: false, optional: false },
      { id: 'obj-3', description: 'Find the smoothest natural surface', type: 'touch', verifiable: false, optional: false },
      { id: 'obj-4', description: 'Take a close-up photo of your favorite texture', type: 'photograph', verifiable: true, optional: false },
    ],
    tips: ['Tree bark has incredible variety', 'Wet and dry surfaces feel completely different', 'Compare natural and human-made textures'],
    safetyNotes: ['Avoid touching unknown plants', 'Watch for thorns and sharp edges'],
    rule: 'Your hands are your instruments today, not your screen.',
  },
  {
    title: 'Golden Hour Photographer',
    emoji: '📸',
    description: 'The light is magical right now. Go capture it before it fades.',
    duration: 30,
    difficulty: 'curious',
    activityType: 'photography',
    distance: '~1km',
    objectives: [
      { id: 'obj-1', description: 'Photograph a shadow that tells a story', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-2', description: 'Capture light passing through something translucent', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-3', description: 'Find and photograph a natural pattern or symmetry', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-4', description: 'Take a photo from the lowest angle you can', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-5', description: 'Photograph something beautiful that most people walk past', type: 'photograph', verifiable: true, optional: false },
    ],
    tips: ['Shoot toward the light for dramatic silhouettes', 'Get low for more interesting compositions', 'Morning and evening light is warmest'],
    safetyNotes: ['Watch where you step while looking through the camera'],
    rule: 'Use your camera for art, not your phone for scrolling.',
  },
  {
    title: 'Mystery Walk',
    emoji: '🎲',
    description: 'Let chance be your guide. At every intersection, flip a coin. Heads = right. Tails = left. See where the world takes you.',
    duration: 30,
    difficulty: 'adventure',
    activityType: 'surprise',
    distance: '~1.5km',
    objectives: [
      { id: 'obj-1', description: 'Make at least 5 random direction choices', type: 'move', verifiable: false, optional: false },
      { id: 'obj-2', description: 'Find something unexpected on your random route', type: 'find', verifiable: true, optional: false },
      { id: 'obj-3', description: 'Talk to a stranger or wave at someone (if comfortable)', type: 'create', verifiable: false, optional: true },
      { id: 'obj-4', description: 'Take a photo of the most interesting thing on your random route', type: 'photograph', verifiable: true, optional: false },
      { id: 'obj-5', description: 'Describe your route in three words when you return', type: 'reflect', verifiable: false, optional: false },
    ],
    tips: ['Keep track of your general direction so you can find your way back', 'Let yourself be surprised', 'Notice things you would normally ignore'],
    safetyNotes: ['Stay in areas you feel safe', 'Keep track of time', 'Have a way to navigate back'],
    rule: 'No maps. No plan. Just walk.',
  },
];

function selectQuest(request?: QuestRequest): Omit<Quest, 'id' | 'metadata'> {
  if (!request) {
    return DEMO_QUESTS[Math.floor(Math.random() * DEMO_QUESTS.length)];
  }

  // Filter by activity type
  let candidates = DEMO_QUESTS.filter((q) => {
    if (request.mood === 'surprise') return true;
    if (request.mood === 'friends') return true;
    return q.activityType === request.mood;
  });

  // Filter by difficulty
  if (candidates.length > 1) {
    const difficultyMatch = candidates.filter((q) => q.difficulty === request.difficulty);
    if (difficultyMatch.length > 0) candidates = difficultyMatch;
  }

  // Filter by duration
  const targetDuration = parseInt(request.duration);
  if (candidates.length > 1) {
    const durationMatch = candidates.filter((q) => q.duration <= targetDuration + 10);
    if (durationMatch.length > 0) candidates = durationMatch;
  }

  return candidates[Math.floor(Math.random() * candidates.length)] || DEMO_QUESTS[0];
}

export class MockLLMProvider implements LLMProvider {
  readonly name = 'mock-llm';
  readonly isOpen = true;

  async generate(input: LLMInput): Promise<LLMOutput> {
    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

    return {
      text: `[DEMO MODE] Generated response for: ${input.prompt.slice(0, 100)}...`,
      model: 'demo-mock',
      tokensUsed: 150,
      latencyMs: 350,
    };
  }

  async generateStructured<T>(input: LLMInput, schema: z.ZodSchema<T>): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    // Parse the context to determine what kind of quest to generate
    const context = input.context as { request?: QuestRequest } | undefined;
    const questData = selectQuest(context?.request);

    const quest: Quest = {
      id: `quest-${nanoid(8)}`,
      ...questData,
      metadata: {
        model: 'demo-mock',
        generatedAt: new Date().toISOString(),
        agentRunId: `run-${nanoid(8)}`,
        completionProbability: 0.7 + Math.random() * 0.25,
        demoMode: true,
      },
    };

    // Validate against schema
    return schema.parse(quest);
  }
}
