'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Volume2, Check, Camera, X, Leaf } from 'lucide-react';
import type { Quest } from '@/types/quest';

export default function ActiveQuestPage() {
  const router = useRouter();
  const params = useParams();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [attemptId, setAttemptId] = useState<string>('');
  const [elapsed, setElapsed] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [objectiveStatus, setObjectiveStatus] = useState<Record<string, boolean>>({});
  const [showPhoneAway, setShowPhoneAway] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('activeQuest');
    const storedAttemptId = sessionStorage.getItem('activeAttemptId');
    if (stored && storedAttemptId) {
      try {
        const data = JSON.parse(stored);
        setQuest(data.quest);
        setAttemptId(storedAttemptId);
      } catch {
        router.push('/quest');
      }
    } else {
      router.push('/quest');
    }
  }, [router]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide phone away message after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPhoneAway(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const toggleObjective = (id: string) => {
    setObjectiveStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quest/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          objectiveResults: quest?.objectives.map((obj) => ({
            objectiveId: obj.id,
            completed: objectiveStatus[obj.id] || false,
          })) || [],
          reflection: reflection || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to complete quest');

      const data = await response.json();
      sessionStorage.setItem('completionResult', JSON.stringify(data));
      router.push(`/quest/${params.id}/complete`);
    } catch (error) {
      console.error('Completion error:', error);
      setIsSubmitting(false);
    }
  };

  if (!quest) {
    return (
      <div className="outdoor-mode">
        <div className="animate-breathe text-5xl">🌱</div>
      </div>
    );
  }

  const completedCount = Object.values(objectiveStatus).filter(Boolean).length;
  const requiredCount = quest.objectives.filter((o) => !o.optional).length;

  // Phone Away Screen
  if (showPhoneAway) {
    return (
      <div className="outdoor-mode">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-6 max-w-md"
        >
          <motion.div
            className="text-7xl mb-8"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌱
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Quest Started</h1>

          <div className="flex items-center justify-center gap-3 mb-8 text-moss-300">
            <Volume2 className="w-5 h-5" />
            <span className="text-lg">Voice mode active</span>
          </div>

          <motion.p
            className="text-2xl font-semibold text-moss-200 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Put your phone away.
          </motion.p>

          <motion.p
            className="text-sm text-moss-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Tap anywhere when you&apos;re ready to check in
          </motion.p>

          <button
            onClick={() => setShowPhoneAway(false)}
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label="Continue to quest tracking"
          />
        </motion.div>
      </div>
    );
  }

  // Completing screen — check off objectives
  if (isCompleting) {
    return (
      <div className="min-h-dvh bg-surface-dark text-text-on-dark pb-32">
        <header className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setIsCompleting(false)}
            className="flex items-center gap-2 text-sm text-text-on-dark-muted hover:text-text-on-dark transition-colors"
          >
            <X className="w-4 h-4" />
            Back
          </button>
          <span className="text-sm font-mono text-text-on-dark-muted">{formatTime(elapsed)}</span>
        </header>

        <main className="px-6 max-w-lg mx-auto pt-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{quest.emoji}</div>
            <h2 className="text-2xl font-bold mb-1">How did it go?</h2>
            <p className="text-text-on-dark-muted text-sm">Check off what you completed</p>
          </div>

          <div className="space-y-3 mb-8">
            {quest.objectives.map((obj) => (
              <button
                key={obj.id}
                onClick={() => toggleObjective(obj.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  objectiveStatus[obj.id]
                    ? 'border-moss-500 bg-moss-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  objectiveStatus[obj.id]
                    ? 'bg-moss-500 border-moss-500 text-white'
                    : 'border-white/30'
                }`}>
                  {objectiveStatus[obj.id] && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <p className="font-medium leading-snug">{obj.description}</p>
                  {obj.optional && (
                    <span className="text-xs text-text-on-dark-muted mt-0.5 inline-block">Optional</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Photo evidence placeholder */}
          <div className="mb-8">
            <button className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed border-white/20 hover:border-white/30 text-text-on-dark-muted hover:text-text-on-dark transition-colors">
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium">Add photo evidence (optional)</span>
            </button>
          </div>

          {/* Reflection */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2 text-text-on-dark-muted">
              Reflection <span className="opacity-50">(optional)</span>
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="How was it? What did you notice?"
              className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-moss-500 focus:outline-none resize-none text-sm"
              rows={3}
            />
          </div>
        </main>

        {/* Submit */}
        <div className="fixed bottom-0 w-full bg-surface-dark/80 backdrop-blur-xl border-t border-white/5 py-4 px-6">
          <div className="max-w-lg mx-auto">
            <p className="text-center text-sm text-text-on-dark-muted mb-3">
              {completedCount}/{requiredCount} objectives completed
            </p>
            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              onClick={handleComplete}
              disabled={isSubmitting}
              className="touch-grass-btn w-full flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Saving quest...</span>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Quest
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Active / Outdoor Mode — Minimal screen
  return (
    <div className="outdoor-mode relative" onClick={() => setShowPhoneAway(false)}>
      {/* Subtle timer */}
      <div className="absolute top-6 right-6 font-mono text-sm text-text-on-dark-muted">
        {formatTime(elapsed)}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 max-w-md text-center"
      >
        <motion.div
          className="text-6xl mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {quest.emoji}
        </motion.div>

        <h1 className="text-2xl font-bold mb-2 text-white">Quest Active</h1>
        <p className="text-moss-300 mb-2">{quest.title}</p>

        <div className="flex items-center justify-center gap-2 text-text-on-dark-muted text-sm mb-12">
          <Volume2 className="w-4 h-4" />
          Voice mode
        </div>

        <div className="space-y-2 mb-12 text-left">
          {quest.objectives.slice(0, 3).map((obj, i) => (
            <div key={obj.id} className="flex items-start gap-3 text-sm text-text-on-dark-muted">
              <span className="text-moss-400 shrink-0">{i + 1}.</span>
              <span className="line-clamp-1">{obj.description}</span>
            </div>
          ))}
          {quest.objectives.length > 3 && (
            <p className="text-xs text-text-on-dark-muted pl-6">
              +{quest.objectives.length - 3} more
            </p>
          )}
        </div>

        <p className="text-lg font-semibold text-moss-200 mb-12">
          Put your phone away. 📱
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); setIsCompleting(true); }}
          className="touch-grass-btn inline-flex items-center gap-3"
        >
          <Leaf className="w-5 h-5" />
          I&apos;m Done
        </motion.button>
      </motion.div>
    </div>
  );
}
