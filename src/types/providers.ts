// ============================================
// TrailQuest — Provider Interfaces
// ============================================
// Every external dependency is behind an interface.
// This enables: mock providers, demo mode, offline mode,
// and swapping implementations without touching consumers.
// ============================================

import { z } from 'zod';

// --- LLM Provider ---

export interface LLMInput {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  context?: Record<string, unknown>;
}

export interface LLMOutput {
  text: string;
  model: string;
  tokensUsed?: number;
  latencyMs: number;
}

export interface LLMProvider {
  readonly name: string;
  readonly isOpen: boolean; // true for open-weight models
  generate(input: LLMInput): Promise<LLMOutput>;
  generateStructured<T>(input: LLMInput, schema: z.ZodSchema<T>): Promise<T>;
  stream?(input: LLMInput): AsyncIterable<string>;
}

// --- Embedding Provider ---

export interface EmbeddingInput {
  text: string | string[];
  model?: string;
}

export interface EmbeddingOutput {
  embeddings: number[][];
  model: string;
  dimensions: number;
}

export interface EmbeddingProvider {
  readonly name: string;
  embed(input: EmbeddingInput): Promise<EmbeddingOutput>;
}

// --- Vision Provider ---

export interface VisionInput {
  imageUrl?: string;
  imageBase64?: string;
  prompt: string;
}

export interface VisionOutput {
  description: string;
  labels: string[];
  confidence: number;
  model: string;
}

export interface VisionProvider {
  readonly name: string;
  analyze(input: VisionInput): Promise<VisionOutput>;
}

// --- Speech Provider ---

export interface TTSInput {
  text: string;
  voiceId?: string;
  speed?: number;
}

export interface TTSOutput {
  audioUrl?: string;
  audioBuffer?: ArrayBuffer;
  durationMs: number;
}

export interface STTInput {
  audioUrl?: string;
  audioBuffer?: ArrayBuffer;
}

export interface STTOutput {
  text: string;
  confidence: number;
}

export interface SpeechProvider {
  readonly name: string;
  textToSpeech(input: TTSInput): Promise<TTSOutput>;
  speechToText?(input: STTInput): Promise<STTOutput>;
}

// --- Search Provider ---

export interface SearchQuery {
  query: string;
  location?: { lat: number; lng: number };
  type?: 'outdoor_activities' | 'parks' | 'events' | 'general';
  limit?: number;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
  location?: { lat: number; lng: number; name: string };
  metadata?: Record<string, unknown>;
}

export interface SearchProvider {
  readonly name: string;
  search(query: SearchQuery): Promise<SearchResult[]>;
  shouldSearch(context: string): Promise<boolean>;
}

// --- Memory Provider ---

export interface MemoryEntry {
  key: string;
  value: unknown;
  userId: string;
  category: 'preference' | 'history' | 'reflection' | 'pattern';
  timestamp: string;
}

export interface MemoryProvider {
  readonly name: string;
  store(entry: MemoryEntry): Promise<void>;
  recall(userId: string, category?: string): Promise<MemoryEntry[]>;
  search(userId: string, query: string): Promise<MemoryEntry[]>;
  forget(userId: string, key: string): Promise<void>;
}

// --- Vector Store ---

export interface VectorDocument {
  id: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, unknown>;
}

export interface VectorQuery {
  query: string;
  embedding?: number[];
  limit?: number;
  filter?: Record<string, unknown>;
}

export interface VectorStoreProvider {
  readonly name: string;
  upsert(documents: VectorDocument[]): Promise<void>;
  search(query: VectorQuery): Promise<VectorDocument[]>;
  hybridSearch?(query: VectorQuery): Promise<VectorDocument[]>; // keyword + vector
  delete(ids: string[]): Promise<void>;
}

// --- Environment Sensor Provider ---

export interface EnvironmentData {
  temperature?: number;    // celsius
  humidity?: number;       // percentage
  lightLevel?: number;     // lux
  soundLevel?: number;     // decibels
  motion?: boolean;
  timestamp: string;
  source: string;
}

export interface EnvironmentSensorProvider {
  readonly name: string;
  readonly isHardware: boolean;
  read(): Promise<EnvironmentData>;
  isAvailable(): Promise<boolean>;
}

// --- Quest Predictor ---

export interface PredictionInput {
  duration: number;
  difficulty: string;
  activityType: string;
  weather?: string;
  temperature?: number;
  timeOfDay: string;
  userCompletionRate?: number;
  previousRating?: number;
}

export interface PredictionOutput {
  completionProbability: number;
  confidence: number;
  model: string;
  features: Record<string, number>;
}

export interface QuestPredictorProvider {
  readonly name: string;
  predict(input: PredictionInput): Promise<PredictionOutput>;
  predictBatch(inputs: PredictionInput[]): Promise<PredictionOutput[]>;
}
