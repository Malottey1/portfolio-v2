---
title: "ClearLegacy — AI Estate Plan Review for Financial Advisors"
tier: supporting
order: 4
role: "AI & AWS Lead — LPL Financial University Hackathon"
dateStart: "Oct 2"
dateEnd: "Oct 3, 2026"
metric: "4/4 planted issues found in ~30s, ~$0.05 AI cost per household"
description: "Reads a client's will, trust, and POA, extracts every beneficiary and named role with an exact quote, and flags conflicts with the account records side by side. Built the Bedrock AI layer and the AWS integration in a 24-hour, five-person hackathon."
details: "Beneficiary designations usually pass outside a will, so when the two disagree money can go to the wrong person. ClearLegacy catches those conflicts and leaves every decision to the advisor, with each one logged. I built the AI layer — structured fact extraction with Claude on Amazon Bedrock, a quote validator that drops any fact not found in the source, plain-English explanations, case summaries, and a cited Q&A assistant — and took over AWS integration: Textract OCR, encrypted S3 storage, a DynamoDB backend with an append-only audit log, Comprehend PII masking, and a Lambda deployment, all feature-flagged with a local fallback. Also led cross-team integration, fixing hand-off bugs between modules and wiring the analysis into the Streamlit UI. No false alarms on a clean household; 100+ automated tests."
stack: ["Python", "Streamlit", "Amazon Bedrock", "Claude", "Textract", "S3", "DynamoDB", "Comprehend", "Lambda", "pytest"]
links:
  repo: "https://github.com/wacaserm/ClearLegacy"
  demo: "https://youtu.be/a0CkyuSDhcI"
image: "/images/projects/clearlegacy.jpg"
---
