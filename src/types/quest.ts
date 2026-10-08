// ============================================
// TrailQuest — Core Domain Types
// ============================================
import { z } from 'zod';

// --- Quest Configuration (user input) ---

export const QuestDurationSchema = z.enum(['10', '20', '30', '60']);
export type QuestDuration = z.infer<typeof QuestDurationSchema>;

export const QuestMoodSchema = z.enum(['nature', 'discover', 'movement', 'photography', 'surprise', 'friends']);
export type QuestMood = z.infer<typeof QuestMoodSchema>;

export const QuestDifficultySchema = z.enum(['chill', 'curious', 'adventure']);
export type QuestDifficulty = z.infer<typeof QuestDifficultySchema>;

export const QuestRequestSchema = z.object({
  duration: QuestDurationSchema,
  mood: QuestMoodSchema,
  difficulty: QuestDifficultySchema,
  freeText: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    name: z.string().optional(),
  }).optional(),
  userId: z.string().optional(),
});
export type QuestRequest = z.infer<typeof QuestRequestSchema>;

// --- Quest Objective ---

export const QuestObjectiveSchema = z.object({
  id: z.string(),
  description: z.string(),
  type: z.enum(['observe', 'find', 'photograph', 'listen', 'touch', 'move', 'create', 'reflect']),
  verifiable: z.boolean(),
  optional: z.boolean().default(false),
});
export type QuestObjective = z.infer<typeof QuestObjectiveSchema>;

// --- Generated Quest ---

export const QuestSchema = z.object({
  id: z.string(),
  title: z.string(),
  emoji: z.string(),
  description: z.string(),
  duration: z.number(), // minutes
  difficulty: QuestDifficultySchema,
  activityType: QuestMoodSchema,
  distance: z.string().optional(), // e.g. "~800m"
  objectives: z.array(QuestObjectiveSchema),
  tips: z.array(z.string()).optional(),
  safetyNotes: z.array(z.string()).optional(),
  rule: z.string().optional(), // e.g. "Put your phone in your pocket"
  metadata: z.object({
    model: z.string(),
    generatedAt: z.string(),
    agentRunId: z.string().optional(),
    completionProbability: z.number().optional(),
    demoMode: z.boolean().default(false),
  }),
});
export type Quest = z.infer<typeof QuestSchema>;

// --- Quest Attempt ---

export const QuestAttemptStatusSchema = z.enum([
  'pending',
  'active',
  'completed',
  'abandoned',
  'expired',
]);
export type QuestAttemptStatus = z.infer<typeof QuestAttemptStatusSchema>;

export const ObjectiveResultSchema = z.object({
  objectiveId: z.string(),
  completed: z.boolean(),
  verified: z.boolean(),
  confidence: z.number().min(0).max(1).optional(),
  evidence: z.string().optional(), // URL or description
});
export type ObjectiveResult = z.infer<typeof ObjectiveResultSchema>;

export const QuestAttemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  questId: z.string(),
  quest: QuestSchema,
  status: QuestAttemptStatusSchema,
  score: z.number().min(0).max(1).optional(),
  xpEarned: z.number().default(0),
  objectiveResults: z.array(ObjectiveResultSchema).default([]),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  reflection: z.string().optional(),
  agentRun: z.object({
    id: z.string(),
    steps: z.array(z.object({
      agent: z.string(),
      action: z.string(),
      durationMs: z.number(),
      result: z.string().optional(),
    })),
    totalDurationMs: z.number(),
    model: z.string(),
    tokensUsed: z.number().optional(),
  }).optional(),
});
export type QuestAttempt = z.infer<typeof QuestAttemptSchema>;

// --- Quest Evidence ---

export const QuestEvidenceSchema = z.object({
  id: z.string(),
  attemptId: z.string(),
  type: z.enum(['photo', 'audio', 'self_report']),
  url: z.string().optional(),
  description: z.string().optional(),
  verification: z.object({
    verified: z.boolean(),
    confidence: z.number().min(0).max(1),
    model: z.string(),
    feedback: z.string().optional(),
  }).optional(),
  createdAt: z.string(),
});
export type QuestEvidence = z.infer<typeof QuestEvidenceSchema>;

// --- User Profile ---

export const UserPreferencesSchema = z.object({
  favoriteActivities: z.array(z.string()).default([]),
  dislikedActivities: z.array(z.string()).default([]),
  maxDistance: z.number().optional(), // meters
  accessibility: z.array(z.string()).default([]),
  preferredDifficulty: QuestDifficultySchema.optional(),
  preferredDuration: QuestDurationSchema.optional(),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  preferences: UserPreferencesSchema.default({
    favoriteActivities: [],
    dislikedActivities: [],
    accessibility: [],
  }),
  xp: z.number().default(0),
  level: z.number().default(1),
  streak: z.number().default(0),
  questsCompleted: z.number().default(0),
  achievements: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

// --- Achievement ---

export const AchievementSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  emoji: z.string(),
  xpReward: z.number(),
  condition: z.string(), // human-readable condition
});
export type Achievement = z.infer<typeof AchievementSchema>;

// --- Agent Run (Observability) ---

export const AgentStepSchema = z.object({
  agent: z.string(),
  action: z.string(),
  input: z.unknown().optional(),
  output: z.unknown().optional(),
  durationMs: z.number(),
  error: z.string().optional(),
  timestamp: z.string(),
});
export type AgentStep = z.infer<typeof AgentStepSchema>;

export const AgentRunSchema = z.object({
  id: z.string(),
  questId: z.string().optional(),
  userId: z.string().optional(),
  steps: z.array(AgentStepSchema),
  totalDurationMs: z.number(),
  model: z.string(),
  tokensUsed: z.number().optional(),
  status: z.enum(['running', 'completed', 'failed']),
  createdAt: z.string(),
});
export type AgentRun = z.infer<typeof AgentRunSchema>;

// --- Verification Result ---

export const VerificationResultSchema = z.object({
  completed: z.boolean(),
  score: z.number().min(0).max(1),
  objectives: z.array(z.object({
    objective: z.string(),
    verified: z.boolean(),
    confidence: z.number().min(0).max(1),
  })),
  feedback: z.string(),
});
export type VerificationResult = z.infer<typeof VerificationResultSchema>;

// --- Connection Status ---

export const ConnectionModeSchema = z.enum(['connected', 'offline']);
export type ConnectionMode = z.infer<typeof ConnectionModeSchema>;
