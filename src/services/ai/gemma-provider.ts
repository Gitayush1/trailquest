// ============================================
// TrailQuest — Gemma Provider
// ============================================
// Open-weight LLM provider using Gemma via
// OpenAI-compatible API (Ollama, vLLM, etc.)
// ============================================

import { z } from 'zod';
import type { LLMProvider, LLMInput, LLMOutput } from '@/types/providers';
import { config } from '@/lib/config';

export class GemmaProvider implements LLMProvider {
  readonly name = 'gemma';
  readonly isOpen = true;

  private baseUrl: string;
  private model: string;
  private apiKey: string;

  constructor(options?: { baseUrl?: string; model?: string; apiKey?: string }) {
    this.baseUrl = options?.baseUrl || config.gemma.baseUrl;
    this.model = options?.model || config.gemma.model;
    this.apiKey = options?.apiKey || config.gemma.apiKey;
  }

  async generate(input: LLMInput): Promise<LLMOutput> {
    const startTime = performance.now();

    const messages = [];
    if (input.systemPrompt) {
      messages.push({ role: 'system' as const, content: input.systemPrompt });
    }
    messages.push({ role: 'user' as const, content: input.prompt });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: input.temperature ?? 0.7,
        max_tokens: input.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemma API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      text: data.choices?.[0]?.message?.content || '',
      model: this.model,
      tokensUsed: data.usage?.total_tokens,
      latencyMs,
    };
  }

  async generateStructured<T>(input: LLMInput, schema: z.ZodSchema<T>): Promise<T> {
    // Add JSON instruction to the prompt
    const structuredPrompt = `${input.prompt}

IMPORTANT: Respond with valid JSON only. No markdown, no explanation, just the JSON object.`;

    const result = await this.generate({
      ...input,
      prompt: structuredPrompt,
    });

    // Extract JSON from response (handles markdown code blocks)
    let jsonText = result.text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    try {
      const parsed = JSON.parse(jsonText);
      return schema.parse(parsed);
    } catch (error) {
      throw new Error(
        `Failed to parse structured output from Gemma: ${error instanceof Error ? error.message : String(error)}\n\nRaw output: ${result.text.slice(0, 500)}`
      );
    }
  }

  async *stream(input: LLMInput): AsyncIterable<string> {
    const messages = [];
    if (input.systemPrompt) {
      messages.push({ role: 'system' as const, content: input.systemPrompt });
    }
    messages.push({ role: 'user' as const, content: input.prompt });

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: input.temperature ?? 0.7,
        max_tokens: input.maxTokens ?? 2048,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemma stream error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    }
  }
}
