# AI Agent Assignment

## Overview

This project improves an AI agent pipeline by optimizing token usage, increasing reliability, and adding a basic CI/CD workflow for production readiness.

---

# Part 1 – Token & Cost Optimization

## Implemented

- Conversation History Compression using Gemini
- Smart Retrieval (Top 5 relevant documents)
- Token estimation utility
- Before vs After token comparison

### Result

| Metric | Before | After |
| :------ | -----: | ----: |
| Tokens | 374 | 149 |
| Saved |  | **225 (~60%)** |

---

# Part 2 – Reliability & Production Readiness

## Implemented

- Input Validation
- Response Validation
- Retry Mechanism
- Timeout Protection
- Fallback Response
- Conversation Memory
- Runtime Metrics

### Result

The pipeline can now safely handle invalid input, temporary API failures, malformed responses, and timeout scenarios while collecting execution metrics.

---

# Part 3 – CI/CD & Deployment

## Implemented

- GitHub Actions CI Pipeline
- ESLint Integration
- Vitest Unit Testing
- Staging Deployment Workflow
- Secrets Management
- Rollback Strategy

### CI Workflow

```text
Push / Pull Request
        │
        ▼
Install Dependencies
        │
        ▼
Run ESLint
        │
        ▼
Run Tests
        │
        ▼
Deploy (main)
```

---

# Project Structure

```text
src/
├── agents/
├── cache/
├── config/
├── debug/
├── fallback/
├── memory/
├── monitoring/
├── optimization/
├── routes/
├── utils/
└── validation/

.github/workflows/
└── ci-cd.yml
```

---

# Technologies

- Node.js
- Express.js
- Google Gemini API
- GitHub Actions
- ESLint
- Vitest

---

# Result

The final AI agent pipeline now provides:

- ~60% token reduction
- Smart document retrieval
- Reliable error handling
- Retry & timeout protection
- Runtime metrics
- GitHub Actions CI/CD
- Automated testing
- Production-ready deployment workflow
