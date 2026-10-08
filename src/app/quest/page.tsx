'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Leaf, Clock, Footprints, Flame } from 'lucide-react';
import type { QuestDuration, QuestMood, QuestDifficulty } from '@/types/quest';

const STEPS = ['time', 'mood', 'difficulty', 'generate'] as const;
type Step = (typeof STEPS)[number];

const TIME_OPTIONS: { value: QuestDuration; label: string; icon: string }[] = [
  { value: '10', label: '10 minutes', icon: '⚡' },
  { value: '20', label: '20 minutes', icon: '🌤️' },
  { value: '30', label: '30 minutes', icon: '🌿' },
  { value: '60', label: '1 hour', icon: '🏔️' },
];

const MOOD_OPTIONS: { value: QuestMood; label: string; emoji: string; desc: string }[] = [
  { value: 'nature', label: 'Nature', emoji: '🌿', desc: 'Trees, plants, wildlife' },
  { value: 'discover', label: 'Discover', emoji: '🐦', desc: 'Explore and learn' },
  { value: 'movement', label: 'Movement', emoji: '🏃', desc: 'Get active and energized' },
  { value: 'photography', label: 'Photography', emoji: '📸', desc: 'Capture beauty' },
  { value: 'surprise', label: 'Surprise Me', emoji: '🎲', desc: 'Let the AI decide' },
  { value: 'friends', label: 'With Friends', emoji: '👥', desc: 'Social adventure' },
];

const DIFFICULTY_OPTIONS: { value: QuestDifficulty; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'chill', label: 'Chill', icon: <Leaf className="w-5 h-5" />, desc: 'Relaxing, no pressure' },
  { value: 'curious', label: 'Curious', icon: <Footprints className="w-5 h-5" />, desc: 'Engaging, exploratory' },
  { value: 'adventure', label: 'Adventure', icon: <Flame className="w-5 h-5" />, desc: 'Active, challenging' },
];

export default function QuestPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('time');
  const [duration, setDuration] = useState<QuestDuration | null>(null);
  const [mood, setMood] = useState<QuestMood | null>(null);
  const [difficulty, setDifficulty] = useState<QuestDifficulty | null>(null);
  const [freeText, setFreeText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);

  function goNext() {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1]);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1]);
    }
  }

  async function handleGenerate() {
    if (!duration || !mood || !difficulty) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/quest/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          mood,
          difficulty,
          freeText: freeText || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quest');
      }

      const data = await response.json();
      // Store quest data in sessionStorage for the active page
      sessionStorage.setItem('activeQuest', JSON.stringify(data));
      router.push(`/quest/${data.quest.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsGenerating(false);
    }
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-dvh bg-nature-gradient">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-semibold">Touch Grass</span>
          </div>
          <span className="demo-badge text-xs">Demo</span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-moss-100 dark:bg-moss-900">
          <motion.div
            className="h-full bg-moss-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Time */}
          {step === 'time' && (
            <motion.div
              key="time"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <Clock className="w-8 h-8 mx-auto mb-4 text-moss-500" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">How much time do you have?</h2>
                <p className="text-text-secondary dark:text-text-on-dark-muted">Pick a window. We&apos;ll make it count.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {TIME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setDuration(option.value); goNext(); }}
                    className={`selection-card text-center py-6 ${duration === option.value ? 'selected' : ''}`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Mood */}
          {step === 'mood' && (
            <motion.div
              key="mood"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <Sparkles className="w-8 h-8 mx-auto mb-4 text-moss-500" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">What sounds good?</h2>
                <p className="text-text-secondary dark:text-text-on-dark-muted">Choose your vibe.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {MOOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setMood(option.value); goNext(); }}
                    className={`selection-card text-left ${mood === option.value ? 'selected' : ''}`}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-text-muted dark:text-text-on-dark-muted mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Difficulty */}
          {step === 'difficulty' && (
            <motion.div
              key="difficulty"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <Flame className="w-8 h-8 mx-auto mb-4 text-moss-500" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">How adventurous?</h2>
                <p className="text-text-secondary dark:text-text-on-dark-muted">Set your pace.</p>
              </div>

              <div className="flex flex-col gap-4">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setDifficulty(option.value); goNext(); }}
                    className={`selection-card flex items-center gap-4 ${difficulty === option.value ? 'selected' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-moss-100 dark:bg-moss-900 flex items-center justify-center text-moss-600 dark:text-moss-300 shrink-0">
                      {option.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-text-muted dark:text-text-on-dark-muted">{option.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Generate */}
          {step === 'generate' && (
            <motion.div
              key="generate"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <div className="text-5xl mb-4 animate-breathe inline-block">🌱</div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ready to go outside?</h2>
                <p className="text-text-secondary dark:text-text-on-dark-muted">
                  {duration} min · {mood} · {difficulty}
                </p>
              </div>

              {/* Free text (optional) */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-text-secondary dark:text-text-on-dark-muted">
                  Anything specific? <span className="text-text-muted dark:text-text-on-dark-muted">(optional)</span>
                </label>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="e.g. &quot;I don't want to drive&quot; or &quot;something near water&quot;"
                  className="w-full px-4 py-3 rounded-xl border-2 border-moss-200 dark:border-moss-700 bg-surface-elevated dark:bg-surface-dark-elevated focus:border-moss-500 focus:outline-none resize-none transition-colors text-sm"
                  rows={3}
                />
              </div>

              {/* Summary */}
              <div className="glass rounded-2xl p-5 mb-8">
                <h3 className="font-semibold mb-3 text-sm text-text-muted dark:text-text-on-dark-muted uppercase tracking-wider">Your Quest</h3>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-moss-100 dark:bg-moss-900 text-moss-700 dark:text-moss-300 px-3 py-1.5 rounded-full text-sm font-medium">
                    ⏱️ {duration} min
                  </span>
                  <span className="bg-moss-100 dark:bg-moss-900 text-moss-700 dark:text-moss-300 px-3 py-1.5 rounded-full text-sm font-medium">
                    {MOOD_OPTIONS.find(m => m.value === mood)?.emoji} {mood}
                  </span>
                  <span className="bg-moss-100 dark:bg-moss-900 text-moss-700 dark:text-moss-300 px-3 py-1.5 rounded-full text-sm font-medium">
                    {difficulty === 'chill' ? '🍃' : difficulty === 'curious' ? '👣' : '🔥'} {difficulty}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              {/* Generate button */}
              <motion.button
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating || !duration || !mood || !difficulty}
                className="touch-grass-btn w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating your quest...
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5" />
                    Generate Quest
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      {step !== 'time' && (
        <div className="fixed bottom-0 w-full glass py-4 px-6">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary dark:text-text-on-dark-muted hover:text-text-primary dark:hover:text-text-on-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= stepIndex ? 'bg-moss-500' : 'bg-moss-200 dark:bg-moss-800'
                  }`}
                />
              ))}
            </div>
            {step !== 'generate' && (
              <button
                onClick={goNext}
                disabled={
                  (stepIndex === 0 && !duration) ||
                  (stepIndex === 1 && !mood) ||
                  (stepIndex === 2 && !difficulty)
                }
                className="flex items-center gap-2 text-sm font-medium text-moss-600 dark:text-moss-400 hover:text-moss-700 dark:hover:text-moss-300 transition-colors disabled:opacity-30"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
