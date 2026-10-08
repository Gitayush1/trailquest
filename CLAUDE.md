# CLAUDE.md — Developer & AI Agent Guide for 🌱 TrailQuest

## Project Overview
**TrailQuest** is an open-AI adventure agent designed for Hacktoberfest 2026 ("Touch Grass" Challenge).
It turns open-source / open-weight AI (Ollama/Llama 3, vLLM, OpenRouter, Hugging Face Local, or Mock Demo Mode) into real-world outdoor micro-adventures personalized to time, location, environment, and user preferences. The screen is intentionally the shortest part of the experience.

---

## 🚀 Key Commands

### Development Server
```bash
npm run dev
# Starts local development server at http://localhost:3000
```

### Production Build & Linting
```bash
npm run build
# Compiles Next.js application with TypeScript checks and Turbopack

npm run lint
# Runs ESLint checks across the codebase
```

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion for smooth micro-animations
- **Icons**: Lucide React (`lucide-react`)
- **AI Layer**: Unified Provider Architecture (`src/services/ai/`)
  - `ollama` (Local open weights: Llama 3.2, Mistral, Qwen)
  - `vllm` (Self-hosted API endpoints)
  - `openrouter` (Open model fallback gateway)
  - `huggingface` (TGI / Inference Endpoints)
  - `mock` (Offline zero-key demo provider)
- **Offline / Edge Support**: Dynamic Offline Prompt Engine (`src/services/ai/offline-engine.ts`) with browser speech synthesis (`Web Speech API`)
- **State & Storage**: LocalStorage / Browser Cache Engine (`src/services/storage/local-storage.ts`)

---

## 📁 Repository Structure

```
trailquest-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                       # Landing / Hero page
│   │   ├── about/page.tsx                 # Mission & Open AI philosophy
│   │   ├── developer/page.tsx             # Live provider diagnostic dashboard
│   │   ├── history/page.tsx               # Past quest attempt logs
│   │   ├── profile/page.tsx               # Gamification, levels, streak & badges
│   │   ├── quest/
│   │   │   ├── page.tsx                   # Wizard generator (time/mood/difficulty)
│   │   │   └── [id]/
│   │   │       ├── page.tsx               # Quest detail & AI Agent trace
│   │   │       ├── active/page.tsx        # Outdoor phone-away active quest mode
│   │   │       └── complete/page.tsx      # Reflection, XP & score summary
│   │   └── api/                           # Next.js API Routes (Server-side LLM gateway)
│   ├── components/                        # UI Components (Navigation, Cards, Shields)
│   ├── services/
│   │   ├── ai/                            # LLM Providers & Offline Engine
│   │   └── storage/                       # Persistent user state & quests
│   └── types/                             # Strict TypeScript interfaces & Zod schemas
└── README.md                              # Comprehensive Hacktoberfest submission doc
```

---

## 🏆 Hackathon Eligibility Highlights

1. **Overall Challenge Winner**: Solves screen addiction with open AI.
2. **Best Mobile / Edge Experience**: PWA-ready, offline fallback generation, zero network required in nature.
3. **Best Multimodal / Real-World AI**: Natural voice guidance + optional camera reflection analysis.
4. **Best Open Source Model Implementation**: Pluggable provider system natively targeting open-weight model servers (Ollama, vLLM, HuggingFace).
