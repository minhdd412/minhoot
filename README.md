# EconArena Live — Real-Time Classroom Quiz (Chapter 5: Socialist-Oriented Market Economy)

A complete, Kahoot-style real-time multiplayer quiz web application built with **React, Tailwind CSS, and Firebase Firestore**.

## Features Included
- **Full 20-Question Bank (100% English)** covering Chapter 5 (8 Easy, 8 Medium, 4 Hard) with speed-based scoring and explanations.
- **Host / Teacher Control Center**:
  - Live scannable **QR Code** + **Fullscreen Classroom Projector Modal**.
  - Waiting room lobby showing students joining in real time.
  - Master **"START QUIZ FOR ALL PLAYERS"** button that launches Question 1 simultaneously across all student phones.
  - **Real-Time Live Leaderboard** updating after every single question answered + **Export CSV Results**.
- **Student Arena**:
  - Scan QR -> Enter Nickname & Avatar -> Join Lobby.
  - 2 Power-Ups (1 use each per game): **50/50** (removes 2 wrong answers) and **Time Freeze** (+5 seconds).

---

## How to Publish Online in 3 Minutes (Free)

### Step 1: Create a Free Firebase Firestore Database
1. Go to [console.firebase.google.com](https://console.firebase.google.com/) and click **Create a project**.
2. Go to **Build -> Firestore Database -> Create database**, choose **Start in test mode**, and click **Enable**.
3. Go to **Project Settings (gear icon) -> General -> Your apps -> Add app -> Web (`</>`)**, register the app, and copy the `firebaseConfig` snippet.

### Step 2: Deploy to Vercel or StackBlitz
- **Option A (Vercel - Recommended for official public domain):**
  1. Upload this folder to a free GitHub repository (or drag-and-drop into Vercel).
  2. Vercel automatically builds and gives you a public URL like `https://econ-arena-quiz.vercel.app`.
- **Option B (StackBlitz - Instant online preview without GitHub):**
  1. Go to [stackblitz.com](https://stackblitz.com/) -> **New Project -> React (Vite)**, upload `package.json` and `src/App.jsx`, and copy the live preview URL.

### Step 3: Run Your Classroom Game
1. Open your live website URL on the classroom computer.
2. Click **Host / Teacher Control** -> click **Local Demo (Connect Firebase)** in the top bar -> paste your `firebaseConfig` snippet -> click **Save & Connect Cloud Live**.
3. Click **Project Fullscreen QR** — students scan with their phone cameras, enter their names, and wait until you click **START QUIZ FOR ALL PLAYERS**!
