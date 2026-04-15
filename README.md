# AIMLverse

Learn AI by Playing, Practicing & Exploring.

## Project Intro

AIMLverse is a hackathon-ready AI/ML learning platform built with Next.js 14, TypeScript, and Tailwind CSS. It combines structured learning modules, gamified progress, dynamic badges, a live leaderboard, a floating AI mentor, and a coding playground into one polished prototype.

## Features

- Premium dark futuristic landing page
- Local auth UI for login and registration
- Interactive dashboard with live XP claim flow
- Modules with progress tracking and localStorage persistence
- Dynamic badge unlocking system
- Live leaderboard with current user XP
- Floating AI mentor chatbot with predefined smart responses
- Coding playground with Python sample snippets and mock output terminal
- Responsive UI with glass cards, neon accents, and smooth animations

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Setup Steps

```bash
git clone <your-repo-url>
cd aimlverse
npm install
npm run dev
```

Open `http://localhost:3000`

## Key Routes

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/modules`
- `/leaderboard`
- `/playground`

## Screenshots Placeholders

- `screenshots/landing-page.png`
- `screenshots/dashboard.png`
- `screenshots/modules.png`
- `screenshots/leaderboard.png`
- `screenshots/playground.png`

## Why This Project Stands Out

- Feels like a real product, not just a static hackathon demo
- Interactive learning flow instead of plain notes
- Multiple judge-friendly demo points within a few clicks
- Local-first architecture keeps setup simple and stable
- Modular structure supports clean progressive commit windows

## Deployment Steps for Vercel

1. Push the repository to GitHub.
2. Go to Vercel and import the repository.
3. Keep the default settings for a Next.js project.
4. Click deploy.
5. After deploy, test the main routes listed above.

## Judge Demo Script

1. Open the landing page and highlight the premium product feel.
2. Go to the dashboard and claim daily XP.
3. Open the modules page, start a module, and show progress increasing.
4. Point out the badge unlock when XP or completion rules are hit.
5. Open the leaderboard and show the live current-user XP.
6. Trigger the AI mentor with one quick concept question.
7. Open the coding playground and run one snippet.

## Bug-Fix Checklist

- Verify all navbar links work on mobile and desktop
- Confirm localStorage persists XP, progress, and badges after refresh
- Check modal open and close behavior on small screens
- Confirm mentor widget opens, responds, and scrolls correctly
- Verify playground snippet switching and run state
- Test `npm run build` before submission on a clean terminal

## Final Optimization Suggestions

- Add actual quiz and mini-game routes for deeper judge interaction
- Replace mock mentor replies with a real LLM API after the hackathon
- Add user avatars and richer leaderboard states
- Add confetti or sound for badge unlock moments
- Persist user identity in the auth flow
