# 🌱 TrailQuest

### AI that wants you to use your phone less.

TrailQuest turns open AI into real-world outdoor adventures — personalized to your time, interests, environment, and surroundings. The screen is intentionally the shortest part of the experience.

---

## 🎯 Demo

> **Touch Grass → Choose your adventure → AI generates a quest → Put your phone away → Go outside**

```bash
# Quick start (demo mode — no API keys needed)
git clone https://github.com/your-repo/trailquest.git
cd trailquest/trailquest-app
cp .env.example .env.local
# Set DEMO_MODE=true in .env.local
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 💡 Why We Built It

AI has become extraordinarily good at keeping us on screens. Every chatbot, every feed, every assistant is designed to maximize your time staring at glass.

We asked: **what if AI had the opposite goal?**

TrailQuest is an AI adventure agent that creates personalized real-world outdoor micro-quests. You tell it how much time you have, what sounds fun, and how adventurous you feel. It plans a quest. Then it tells you to put your phone away.

> **The screen is the shortest part of the experience.**

---

## 🧠 How It Works

```
OPEN APP → TOUCH GRASS → Configure quest → AI plans adventure
→ Start quest → Phone enters Outdoor Mode → Voice guidance
→ USER PUTS PHONE AWAY → Completes real-world objectives
→ Photo/audio verification → XP + achievements → Memory updated
```

### Quest Example: The Five-Sense Walk

🌳 **Duration:** 20 minutes · **Difficulty:** Curious · **Distance:** ~800m

1. Find something you have never consciously noticed before
2. Find three different shades of green
3. Identify one natural sound
4. Find something that feels unexpectedly textured
5. Take one photo of your favorite discovery

**Rule:** Once the quest starts, put your phone in your pocket.

---

## 🏗️ Architecture

```
User Request
    ↓
Quest Planner Agent (Mastra)
    ├── Context Agent → Weather, Location
    ├── Memory Agent → Backboard (preferences)
    ├── Knowledge Agent → Tiger Data RAG
    └── Search Agent → SerpApi (if needed)
    ↓
Gemma (Open-Weight Model)
    ↓
Candidate Quests → TabPFN Predictor → Safety Agent
    ↓
Final Quest → ElevenLabs Voice → User Goes Outside 🌿
```

### Provider Abstraction

Every external dependency is behind a swappable interface:

```typescript
interface LLMProvider {
  generate(input: LLMInput): Promise<LLMOutput>
  generateStructured<T>(input: LLMInput, schema: ZodSchema<T>): Promise<T>
}

// GemmaProvider — open-weight (production)
// MockLLMProvider — deterministic (demo)
```

---

## 🤖 Open AI at the Core

TrailQuest is powered by **Gemma**, an open-weight model from Google. This is not optional — open AI is central to the architecture.

### Why open AI matters for this product:

| Reason | How |
|--------|-----|
| **Privacy** | Location data stays under user control. Models can run locally. |
| **Offline Mode** | Open models can run on-device. No internet required for core quests. |
| **Transparency** | Safety reasoning is inspectable. No black-box decisions about outdoor activities. |
| **No Lock-in** | Provider abstractions mean any open model can be swapped in. |

---

## 📡 Offline Mode

TrailQuest supports **offline quest generation** using local Gemma:

- 🟢 **Connected Mode** — Full AI, live search, voice, RAG
- 🟣 **Offline Mode** — Local model, cached knowledge, no cloud

What works offline:
- ✅ Quest generation (local Gemma)
- ✅ User preferences
- ✅ Cached quest templates
- ✅ Basic safety checks
- ✅ Browser TTS fallback

What requires internet:
- ❌ Live web search (SerpApi)
- ❌ ElevenLabs voice
- ❌ Cloud RAG
- ❌ Photo verification via cloud API

---

## 🔗 Partner Integrations

| Partner | Role | Status |
|---------|------|--------|
| **Gemma** | Core open-weight reasoning model | ✅ Implemented |
| **MongoDB Atlas** | Application database + vector search | 🔧 Provider ready |
| **Mastra** | Agent orchestration framework | 🔧 Architecture ready |
| **SerpApi** | Live web search for outdoor activities | 🔧 Provider ready |
| **ElevenLabs** | Voice-first outdoor guidance | 🔧 Provider ready |
| **Tiger Data** | Outdoor knowledge RAG (pgvector) | 🔧 Provider ready |
| **Backboard** | Long-term agent memory | 🔧 Provider ready |
| **TabPFN** | Quest completion prediction | 🔧 Provider ready |
| **Tinker** | Fine-tuned personalization model | 🔧 Pipeline ready |
| **Temporal** | Durable quest workflows | 🔧 Provider ready |
| **Sentry** | Agent observability + tracing | 🔧 Provider ready |
| **DigitalOcean** | GPU inference hosting | 🔧 Architecture ready |
| **Render** | Application deployment | 🔧 Config ready |
| **GitHub Copilot** | Development workflow | ✅ Active |

---

## 🛡️ Safety

Every quest passes through a **Safety Agent** that checks:

- ⚠️ Extreme weather conditions
- 🌙 Darkness / low visibility
- 📍 Isolated or dangerous locations
- 🚗 Road crossings and traffic
- 🏊 Water hazards
- ⏱️ Time constraints vs. distance
- 🔒 User-defined limitations

If uncertain: **the quest is not generated.** A safer alternative is offered instead.

TrailQuest is never a substitute for professional emergency/safety services.

---

## 🎮 Gamification

Lightweight, non-addictive gamification:

- **XP** — Earned per quest based on difficulty and completion
- **Levels** — Progress through exploration
- **Achievements** — First Step, Screen Breaker, Offline Explorer, etc.
- **Streaks** — Consecutive days of outdoor activity
- **Quest History** — Personal adventure log

The goal is outdoor activity, not engagement addiction.

---

## 🔒 Privacy

- No permanent precise location storage (coarse location only)
- Clear data flow transparency
- Delete quest history anytime
- No unnecessary data sent to third parties
- Privacy Mode available

---

## 🏃 Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cd trailquest-app
cp .env.example .env.local
# Edit .env.local — set DEMO_MODE=true for quick start
npm install
npm run dev
```

### Environment Variables

See `.env.example` for all available configuration.

Key variables:
- `DEMO_MODE=true` — Run without any API keys
- `GEMMA_BASE_URL` — Gemma API endpoint (Ollama, vLLM, etc.)
- `MONGODB_URI` — MongoDB Atlas connection string

### Running with Gemma locally

```bash
# Install Ollama
# Pull Gemma model
ollama pull gemma3:27b

# Set in .env.local:
# DEMO_MODE=false
# GEMMA_BASE_URL=http://localhost:11434/v1
# GEMMA_MODEL=gemma3:27b

npm run dev
```

---

## 🧪 Testing

```bash
npm run lint        # Lint
npm run build       # Type check + build
# npm test          # Unit tests (coming)
# npm run benchmark # Performance benchmarks (coming)
```

---

## 📁 Project Structure

```
trailquest-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── quest/              # Quest flow
│   │   │   ├── page.tsx        # Configuration wizard
│   │   │   └── [id]/           # Quest detail + active
│   │   ├── history/            # Quest history
│   │   ├── profile/            # User profile + achievements
│   │   ├── about/              # Why open AI
│   │   ├── developer/          # Agent observability
│   │   └── api/                # API routes
│   ├── services/
│   │   ├── ai/                 # LLM providers (Gemma, Mock)
│   │   └── quest/              # Quest generation + store
│   ├── types/                  # Zod schemas + TypeScript types
│   └── lib/                    # Configuration + utilities
├── .env.example                # Environment template
└── README.md
```

---

## 📖 Philosophy

> "The best AI product is one that makes the real world more interesting than the screen itself."

TrailQuest uses open AI to create a reason for you to put your phone down. Not another chatbot. Not another feed. An adventure agent that wants you to go outside.

---

## 📄 License

MIT

---

Built for the **Hacktoberfest 2026 "Touch Grass" Open-Source AI Challenge** 🌱
