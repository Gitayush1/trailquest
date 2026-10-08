---
title: 🌱 TrailQuest — An Open-AI Adventure Agent That Wants You to Use Your Phone Less
published: false
tags: devchallenge, hf26challenge, openai, gemma
cover_image: https://raw.githubusercontent.com/user/trailquest/main/public/cover.png
canonical_url: https://dev.to/user/trailquest
ai_disclosure_level: some_ai
---

# 🌱 TrailQuest

### *"AI that wants you to use your phone less."*

Most AI applications today demand your undivided attention. They want you staring at a glowing rectangle, typing prompts, scrolling chats, or watching streaming tokens. 

We built **TrailQuest** with the exact opposite mission for **Hacktoberfest 2026 Week 1 ("Touch Grass")**:

> **What if open-source AI's primary metric of success was how fast it convinced you to put your phone in your pocket and step outside?**

TrailQuest is an open-AI adventure agent that turns open-weight models (Gemma, Llama 3.2, vLLM, Ollama) into real-world outdoor micro-adventures tailored to your time budget, mood, and surroundings — where **the screen is intentionally the shortest part of the experience**.

---

## 🌲 Why Open AI Matters for "Touch Grass"

When you take AI outdoors — into state parks, local trailheads, urban green spaces, or backyard garden patches — traditional closed-cloud APIs fall short:

1. **Zero Signal on the Trail (Local & Offline First)**: Cellular signals drop the moment you step off the paved path. TrailQuest features a built-in browser-edge fallback engine powered by local open weights (Ollama/vLLM/Gemma). Your adventure agent generates, adapts, and speaks guidance with **zero internet connection required**.
2. **Total Location & Sensory Privacy**: Planning an outdoor quest requires location context, local environment sensory data, and optional reflection photos. With open-weight models running on your device or self-hosted server, **your personal location and photos never hit a centralized proprietary cloud API**.
3. **Unrestricted Customization & Model Swapping**: Closed models enforce rigid guardrails that make dynamic real-world outdoor quest design formulaic. Open weights allow fine-tuning (via Thinking Machines' Tinker) and local prompt engineering for hyper-local botanical, birding, and foliage quests.

---

## 🚀 How TrailQuest Works: The 3-Minute Screen Experience

TrailQuest follows a strict **"Screen-Minimizing"** design workflow:

### 1. The Touch Grass Wizard (`/quest`)
Select your **Time Budget** (15 min micro-walk, 30 min park exploration, or 60+ min nature trek), your **Vibe/Mood** (Curious, Mindful, Energetic, Playful), and your **Difficulty Level**. Optional weather and geolocation sensors automatically contextualize the quest.

```
[⏱️ 15 Min] + [🧘 Mindful] + [🌿 Micro-Nature] ➔ 🎯 "The Pine Needle & Cloud-Tracking Quest"
```

### 2. AI Agent Reasoning & Safety Blueprint (`/quest/[id]`)
In seconds, the open model agent generates:
- 🎯 **Primary & Secondary Objectives** (e.g., *"Find three distinct tree leaf textures without picking them"*, *"Observe bird calls for 2 minutes motionless"*).
- 📜 **Quest Rules & Constraints** (e.g., *"No phone usage during travel between markers"*).
- 🛡️ **Safety Cautions & Environmental Tips** (e.g., *"Watch for poison ivy along low fences; sunset in 45 minutes"*).
- 🔍 **Sentry Agent Trace**: Full transparent breakdown of LLM tool execution, prompt construction, and latency.

### 3. Outdoor Active Focus Mode (`/quest/[id]/active`)
The centerpiece of TrailQuest. The moment you press **"Begin Outdoor Quest"**:
- 📵 **Phone Away Screen**: A 5-second countdown prompts you to place your phone in your pocket or backpack.
- 🔊 **Hands-Free Audio Guidance**: ElevenLabs / Web Speech API voice synthesis narrates quest checkpoints into your earbuds so you never need to look at the screen.
- 🌿 **Ultra-Minimal Display**: Shows only an ambient pulse, elapsed outdoor time, and a voice toggle button.

### 4. Post-Quest Reflection & Leveling (`/quest/[id]/complete`)
Upon return, complete a 30-second reflection, review your **Score Ring**, gain **XP**, level up your **Adventurer Rank**, and unlock outdoor badges (*"Oak Whisperer"*, *"Streak 7: Grass Master"*).

---

## 🛠️ Technical Architecture & Stack

TrailQuest is built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

```
                 ┌────────────────────────────────┐
                 │       🌱 TrailQuest Web        │
                 └──────────────┬─────────────────┘
                                │
                 ┌──────────────▼─────────────────┐
                 │    ⚡ Unified Provider Layer   │
                 └──────┬─────────────────┬───────┘
                        │                 │
    ┌───────────────────▼───┐         ┌───▼───────────────────┐
    │  🤖 Open LLM Engine   │         │  🌐 Edge Offline Engine│
    │ (Gemma/Ollama/vLLM)   │         │ (Browser WebSpeech/JS)│
    └───────────────────────┘         └───────────────────────┘
```

### Pluggable Provider System ([`src/services/ai/`](https://github.com/user/trailquest))
Every core subsystem in TrailQuest is built behind strict TypeScript interface abstractions ([`src/types/providers.ts`](https://github.com/user/trailquest)):

- `LLMProvider`: Switch seamlessly between `GemmaProvider` (Ollama/vLLM/OpenRouter) and `MockLLMProvider` (demo mode).
- `SpeechProvider`: High-definition `ElevenLabsProvider` with Web Speech API fallback.
- `MemoryProvider`: Long-term quest memory via `BackboardProvider` and local storage cache.
- `VectorStoreProvider`: Hybrid outdoor RAG using `TigerDataProvider` (pgvector).
- `SearchProvider`: Real-time weather and trail grounding via `SerpApiProvider`.

---

## 🏆 Partner Category Integrations

| Partner Category | Integration in TrailQuest | Implementation |
| :--- | :--- | :--- |
| **🤖 Gemma (Best Use of Gemma)** | Primary open-weight LLM powering quest generation, constraint checking, and safety analysis. | `GemmaProvider` (`gemma-3-27b-it`) |
| **📊 TabPFN (Prior Labs)** | Predicts optimal quest difficulty & completion probability based on historical user attempt logs. | TabPFN Tabular Predictor Integration |
| **☁️ Render (Best Use of Render)** | Production web runtime hosting the Next.js frontend and Node API routes. | Render Web Service deployment configuration |
| **🔊 ElevenLabs** | Crystal-clear voice narration for hands-free audio checkpoints during active outdoor mode. | `ElevenLabsProvider` |
| **🍃 MongoDB Atlas** | Vector Search & persistence layer storing user profiles, quest attempts, and unlocked achievements. | MongoDB Atlas schemas & native API routes |
| **📡 Sentry Agent Tracing** | Transparent agent execution tracing detailing prompt tokens, execution latency, and step traces. | `/developer` & `/quest/[id]` Sentry agent trace |
| **🔍 SerpApi** | Live weather data & regional trail search grounding for safe outdoor adventure planning. | `SerpApiProvider` |
| **🐯 Tiger Data** | Spatial vector database for regional flora/fauna RAG retrieval. | pgvector Tiger Data provider |
| **💾 Backboard** | Persistent user quest memory across sessions. | `BackboardProvider` |

---

## 📸 Screenshots & Product Walkthrough

### 1. Landing Page — "Touch Grass"
![Landing Page](https://raw.githubusercontent.com/user/trailquest/main/public/demo-hero.png)

### 2. Quest Generator Wizard
![Quest Generator](https://raw.githubusercontent.com/user/trailquest/main/public/demo-wizard.png)

### 3. Active Outdoor Mode — Phone Away UX
![Active Quest](https://raw.githubusercontent.com/user/trailquest/main/public/demo-active.png)

### 4. Developer Diagnostic Dashboard
![Developer Dashboard](https://raw.githubusercontent.com/user/trailquest/main/public/demo-developer.png)

---

## 💻 Local Quickstart

Want to run TrailQuest locally? It works out of the box with zero setup:

```bash
# Clone the repository
git clone https://github.com/user/trailquest.git
cd trailquest/trailquest-app

# Install dependencies
npm install

# Start local server (Demo Mode enabled by default)
npm run dev
```

Open **`http://localhost:3000`** in your browser!

---

## 🧠 Open Innovation Reflection

Building TrailQuest reinforced why **open-source AI is essential for the future of ambient computing**:

> When software is designed to enrich offline, physical human lives rather than extract maximum online screen time, open-weight models are not just an alternative — they are the foundational enabler. They allow intelligence to exist on the edge, respect human privacy, and run freely anywhere under the open sky.

---

*Submitted for **Hacktoberfest 2026 Open-Source AI Challenge: Week 1 ("Touch Grass")**.*
*Tags: `#devchallenge` `#hf26challenge`*
