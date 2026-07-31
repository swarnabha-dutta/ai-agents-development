# Part 1 – Token & Cost Optimization

## Objective

The original agent pipeline worked correctly but consumed a large number of input tokens by sending the complete conversation history and all retrieved documents to the LLM on every request. This increased both API cost and response latency.

To improve efficiency without sacrificing response quality, two optimization techniques were implemented.

---

## Optimization 1 – Conversation History Compression

### Problem

Sending the complete conversation history with every request results in unnecessary token usage, especially for long conversations.

### Solution

Older conversation messages are summarized using the **Gemini API**, while only the **latest four messages** are preserved.

### Workflow

```text
User Conversation
        │
        ▼
 Gemini Summary
        │
        ▼
Summary + Last 4 Messages
        │
        ▼
      LLM
```

### Benefits

- Reduces unnecessary input tokens
- Preserves important conversation context
- Reduces API cost
- Improves response latency

---

## Optimization 2 – Smart Retrieval

### Problem

The retriever originally returned every available document, increasing the prompt size unnecessarily.

### Solution

Documents are ranked using keyword relevance against the user's query, and only the **Top 5** most relevant documents are passed to the summarizer.

### Workflow

```text
20 Retrieved Documents
          │
          ▼
   Keyword Ranking
          │
          ▼
 Top 5 Relevant Documents
          │
          ▼
         LLM
```

### Benefits

- Smaller prompt size
- Lower token consumption
- Faster inference
- Improved document relevance

---

## Sample Token Comparison

| Metric | Before Optimization | After Optimization |
| :----- | ------------------: | -----------------: |
| Conversation Messages | 6 | 5 (Summary + Latest Messages) |
| Retrieved Documents | 20 | 5 |
| Estimated Tokens | 374 | 149 |
| Tokens Saved | **225 (~60%)** |

---

## Quality Trade-offs

### History Compression

**Advantages**

- Significantly reduces token usage
- Maintains important conversational context

**Trade-off**

- Minor conversational details may occasionally be omitted during summarization.

---

### Smart Retrieval

**Advantages**

- Sends only relevant documents to the LLM
- Improves efficiency and reduces cost

**Trade-off**

- Broad or ambiguous queries may occasionally miss low-ranked supporting documents.

---

## Implementation Summary

The optimization pipeline performs the following steps:

```text
User Query
      │
      ▼
Conversation History
      │
      ▼
Gemini History Compression
      │
      ▼
Planner
      │
      ▼
Retriever (20 Documents)
      │
      ▼
Smart Retrieval (Top 5)
      │
      ▼
Summarizer
      │
      ▼
Final Response
```

---

## Result

The optimized pipeline reduced the estimated prompt size from **374 tokens** to **149 tokens**, saving approximately **225 tokens (~60%)** while maintaining response quality using:

- AI-powered conversation summarization (Gemini)
- Relevance-based document retrieval
- Lightweight token estimation
- Modular agent pipeline architecture
