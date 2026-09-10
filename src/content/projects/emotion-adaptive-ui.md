---
title: "Emotion-Adaptive AI Interface"
tier: supporting
order: 3
role: "Project Lead"
dateStart: "Jun 2025"
dateEnd: "Present"
description: "A browser-only facial-emotion detector that retunes a chat interface's gradient, motion, and tone in real time — proving 'emotion-aware' doesn't require sending anyone's face to a server."
details: "Reads a user's facial expression via webcam and steers the interface's gradient, motion, and tone in real time — detection runs entirely client-side via MediaPipe's Face Landmarker (WASM + GPU), so no video frame ever leaves the browser. An Express backend folds the detected mood into Gemini API prompts so the assistant's tone shifts to match, with anonymous mood/session events logged to MongoDB Atlas behind an explicit consent gate."
stack: ["React", "TypeScript", "Vite", "Framer Motion", "MediaPipe", "Node.js", "Express", "Gemini API", "MongoDB Atlas", "Vercel", "Render"]
links:
  repo: "https://github.com/malottey1/emotion-ui"
image: "/images/projects/emotion-adaptive-ui.jpg"
---
