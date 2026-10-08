// ============================================
// TrailQuest — AI Service Factory
// ============================================
// Returns the correct provider based on config.
// Demo mode → MockLLMProvider
// Production → GemmaProvider
// ============================================

import type { LLMProvider } from '@/types/providers';
import { config } from '@/lib/config';
import { MockLLMProvider } from './mock-llm-provider';
import { GemmaProvider } from './gemma-provider';

let _llmProvider: LLMProvider | null = null;

export function getLLMProvider(): LLMProvider {
  if (_llmProvider) return _llmProvider;

  if (config.isDemoMode) {
    _llmProvider = new MockLLMProvider();
  } else {
    _llmProvider = new GemmaProvider();
  }

  return _llmProvider;
}

export function resetProviders(): void {
  _llmProvider = null;
}

export { MockLLMProvider } from './mock-llm-provider';
export { GemmaProvider } from './gemma-provider';
