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


# Part 2 – Reliability & Production Readiness
## Objective

While Part 1 focused on reducing token usage and API cost, Part 2 improves the reliability and robustness of the AI agent pipeline. The goal is to ensure that invalid inputs, temporary failures, slow API responses, and unexpected errors are handled gracefully without affecting the user experience.

---

## Feature 1 – Input Validation

### Problem

Invalid or malformed user queries can cause unnecessary LLM calls and unexpected failures.

### Solution

An input validation layer checks every query before it enters the pipeline.

### Validation Rules

- Query must not be empty
- Query must be a string
- Query length must not exceed the maximum limit

### Workflow

```text
User Query
     │
     ▼
Input Validator
     │
     ├── Invalid → Error
     │
     └── Valid
            │
            ▼
        Planner
```

### Benefits

- Prevents invalid requests
- Saves unnecessary API calls
- Improves system stability

---

## Feature 2 – Response Validation

### Problem

LLM responses may occasionally be empty or malformed.

### Solution

Every generated response is validated before returning it to the user.

### Validation Rules

- Response must exist
- Response must be a string
- Response must contain meaningful content

### Workflow

```text
LLM Response
      │
      ▼
Response Validator
      │
      ├── Invalid → Retry
      │
      └── Valid
             │
             ▼
        Return Response
```

### Benefits

- Prevents invalid AI outputs
- Improves response quality
- Ensures consistent API behavior

---

## Feature 3 – Retry Mechanism

### Problem

Temporary API failures should not immediately fail the entire pipeline.

### Solution

Failed LLM operations are automatically retried up to three times before returning a fallback response.

### Workflow

```text
LLM Call
   │
   ▼
Success?
 │
 ├── Yes → Continue
 │
 └── No
       │
       ▼
 Retry (Max 3 Attempts)
       │
       ▼
 Still Failed?
       │
       ├── Yes → Fallback Response
       └── No → Continue
```

### Benefits

- Handles temporary failures
- Improves reliability
- Reduces failed requests

---

## Feature 4 – Timeout Protection

### Problem

LLM requests may occasionally take too long or become unresponsive.

### Solution

Each LLM request is wrapped inside a timeout mechanism using `Promise.race()`.

### Workflow

```text
LLM Request
      │
      ▼
 Timeout Monitor
      │
      ├── Completed → Continue
      │
      └── Timeout → Retry
```

### Benefits

- Prevents hanging requests
- Improves responsiveness
- Keeps pipeline predictable

---

## Feature 5 – Memory Management

### Problem

Conversation state should be maintained efficiently during execution.

### Solution

A lightweight in-memory conversation manager stores recent messages with a configurable limit.

### Workflow

```text
User
 │
 ▼
Memory Manager
 │
 ▼
Recent Conversation
 │
 ▼
Pipeline
```

### Benefits

- Maintains recent context
- Prevents unlimited memory growth
- Lightweight implementation

---

## Feature 6 – Pipeline Metrics

### Problem

Pipeline performance should be measurable for debugging and optimization.

### Solution

Metrics are collected during every pipeline execution.

### Metrics Collected

- Execution Time
- Input Tokens
- Optimized Tokens
- Tokens Saved
- Retrieved Documents
- Retry Count
- LLM Calls

### Sample Output

```json
{
  "executionTime": "615 ms",
  "inputTokens": 374,
  "optimizedTokens": 149,
  "savedTokens": 225,
  "retrievedDocuments": 5,
  "retries": 0,
  "llmCalls": 2
}
```

---

## Updated Pipeline

```text
                    User Query
                         │
                         ▼
                Input Validation
                         │
                         ▼
                Conversation Memory
                         │
                         ▼
                     Planner
                         │
                         ▼
                    Retriever
                         │
                         ▼
                 Smart Retrieval
                         │
                         ▼
             History Compression
                         │
                         ▼
                  LLM Summarizer
                         │
                         ▼
               Response Validation
                         │
                         ▼
               Retry + Timeout Logic
                         │
                         ▼
                Fallback (if needed)
                         │
                         ▼
                   Final Response
```

---

## Production Improvements

| Feature | Purpose |
| :------ | :------ |
| Input Validation | Prevent invalid requests |
| Response Validation | Ensure valid AI output |
| Retry Mechanism | Recover from temporary failures |
| Timeout Protection | Prevent hanging requests |
| Memory Manager | Maintain recent conversation |
| Metrics Monitoring | Track pipeline performance |


---
# Part 3 – Observability & Scalability

## Objective

Part 3 enhances the pipeline with production-oriented features for better performance monitoring, request tracing, and reduced API usage.

---

## Feature 1 – Response Caching

### Problem

Repeated queries trigger unnecessary LLM calls, increasing latency and API cost.

### Solution

An in-memory cache stores responses for repeated queries.

### Benefits

- Faster repeated responses
- Reduced API cost
- Fewer LLM calls

---

## Feature 2 – Request Tracking

### Problem

Tracing requests across multiple pipeline stages is difficult.

### Solution

Each pipeline execution is assigned a unique Request ID.

### Benefits

- Easier debugging
- Better request traceability
- Improved production monitoring

---

## Feature 3 – Configuration Management

### Problem

Hardcoded values make configuration difficult.

### Solution

Pipeline settings are centralized in a single configuration file.

### Benefits

- Easier maintenance
- Cleaner codebase
- Configurable pipeline behavior

---

## Feature 4 – Health Check API

### Problem

Production systems require a simple way to verify service health.

### Solution

A `/health` endpoint reports server status, uptime, and cache information.

### Sample Response

```json
{
  "success": true,
  "status": "healthy",
  "uptime": "35 seconds",
  "cacheEntries": 1
}
```

---

## Feature 5 – Enhanced Metrics

Additional runtime metrics are collected:

- Cache Hits
- Cache Misses
- Success Requests
- Failed Requests

### Sample Output

```json
{
  "executionTime": "1206 ms",
  "cacheHits": 1,
  "cacheMisses": 1,
  "llmCalls": 2
}
```

---

## Updated Pipeline

```text
User Query
      │
      ▼
Input Validation
      │
      ▼
Request Tracking
      │
      ▼
Cache Lookup
      │
      ├── Hit → Return Cached Response
      │
      └── Miss
             │
             ▼
Conversation Memory
      │
      ▼
Planner
      │
      ▼
Retriever
      │
      ▼
Smart Retrieval
      │
      ▼
History Compression
      │
      ▼
LLM Summarizer
      │
      ▼
Response Validation
      │
      ▼
Cache Response
      │
      ▼
Final Response
```

---
# Part 3 – CI/CD & Deployment

## Objective

The final part of the assignment focuses on automating the development workflow and preparing the AI agent for production deployment. A Continuous Integration (CI) pipeline was implemented using GitHub Actions to automatically validate code quality and run tests before deployment. The deployment workflow is structured for staging deployments, secure secret management, and safe rollback procedures.

---

## Feature 1 – Continuous Integration (GitHub Actions)

### Problem

Manually verifying code quality before every commit is time-consuming and error-prone.

### Solution

A GitHub Actions workflow automatically runs whenever code is pushed to the repository or a Pull Request is opened.

### CI Workflow

```text
Push / Pull Request
          │
          ▼
Checkout Repository
          │
          ▼
Install Dependencies
          │
          ▼
Run ESLint
          │
          ▼
Run Vitest Tests
          │
          ▼
Pipeline Success
```

### Benefits

- Automated code quality checks
- Early bug detection
- Consistent development workflow
- Prevents broken code from being merged

---

## Feature 2 – Automated Staging Deployment

### Problem

Manual deployments increase the risk of human error and inconsistent releases.

### Solution

After all CI checks pass, merging into the **main** branch triggers the deployment stage. The current workflow is prepared for deployment to a staging environment and can easily be integrated with services such as Render or Railway.

### Deployment Workflow

```text
Merge to main
       │
       ▼
GitHub Actions
       │
       ▼
Run Lint
       │
       ▼
Run Tests
       │
       ▼
Deploy to Staging
```

### Benefits

- Consistent deployments
- Faster release cycle
- Reduced manual effort
- Easy integration with cloud platforms

---

## Feature 3 – Secrets Management

### Problem

Hardcoding API keys inside the repository exposes sensitive credentials.

### Solution

Sensitive information is stored securely using **GitHub Actions Secrets** instead of committing it to the repository.

### Secret Flow

```text
GitHub Repository
        │
        ▼
Secrets & Variables
        │
        ▼
GitHub Actions
        │
        ▼
Environment Variables
        │
        ▼
Application
```

### Managed Secrets

- GEMINI_API_KEY
- Deployment Tokens
- Future API Credentials

### Benefits

- Secure credential management
- No secrets committed to Git
- Easy key rotation
- Secure CI/CD execution

---

## Feature 4 – Automated Testing

Before every deployment, the pipeline automatically executes:

- ESLint
- Vitest Unit Tests

This ensures that invalid code never reaches the deployment stage.

### Testing Workflow

```text
Source Code
      │
      ▼
ESLint
      │
      ▼
Vitest
      │
      ▼
Deployment
```

### Benefits

- Improved code quality
- Prevents regressions
- Faster debugging
- Reliable deployments

---

## Feature 5 – Rollback Strategy

### Problem

A production deployment may occasionally introduce unexpected issues.

### Solution

If a deployment fails, the pipeline follows a structured rollback process.

### Rollback Workflow

```text
Deployment Failure
        │
        ▼
Pause Deployment
        │
        ▼
Review GitHub Actions Logs
        │
        ▼
Identify Failing Commit
        │
        ▼
Rollback Previous Stable Release
        │
        ▼
Verify Health Endpoint
        │
        ▼
Investigate Root Cause
```

### Benefits

- Faster recovery
- Reduced production downtime
- Safer releases
- Improved operational reliability

---

## CI/CD Pipeline Overview

```text
Developer Push
        │
        ▼
GitHub Actions
        │
        ▼
Checkout Repository
        │
        ▼
Install Dependencies
        │
        ▼
Run ESLint
        │
        ▼
Run Unit Tests
        │
        ▼
Deploy to Staging (main branch)
```

---

## Result

The CI/CD pipeline improves software quality and deployment reliability by providing:

- Automated linting with ESLint
- Automated unit testing using Vitest
- GitHub Actions based CI pipeline
- Staging deployment workflow
- Secure secret management
- Production rollback strategy
- Faster and more reliable software delivery

---
- Runtime metrics collection
- Graceful fallback handling
