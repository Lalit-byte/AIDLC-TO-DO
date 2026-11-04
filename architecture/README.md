# Software Architecture & Workflows Specification

This directory contains interactive architectural diagrams and workflow specifications generated using the **Archify** methodology.

## Interactive Diagrams Available

### 1. [To-Do List Full-Stack Architecture (`architecture/index.html`)](file:///C:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/architecture/index.html)
Comprehensive interactive architectural model of the current project codebase:
- **System Architecture Topology:** Visualizes Client Browser, Presentation Tier, State Hooks, Storage Gateway, Express REST API, and SQLite Database.
- **Component Hierarchy Tree:** Visual breakdown of React components, props, state ownership, and accessibility tags.
- **Interactive Workflow Traces:** Step-by-step sequential traces for Add, Edit, Delete, Toggle Complete, Filter, and Storage/Backend Sync.
- **Node & Component Inspector:** Real-time inspection drawer for file paths, contracts, and interfaces.
- **Implemented vs. Planned Matrix:** Verification matrix against codebase.

---

### 2. [Web Request & Cache-Aside Pattern (`architecture/cache-miss-flow.html`)](file:///C:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/architecture/cache-miss-flow.html)
Interactive architectural sequence diagram modeling the **Cache-Aside (Lazy Loading)** pattern:
- **Topology:** Browser &rarr; API Gateway &rarr; Redis Cache &rarr; PostgreSQL Database.
- **Cache Miss Scenario:**
  1. Browser dispatches `GET /api/v1/tasks/:id`.
  2. API inspects Redis key (`GET task:{id}`).
  3. Redis returns cache miss (`nil`).
  4. API queries PostgreSQL (`SELECT * FROM tasks WHERE id = $1`).
  5. API populates Redis cache with TTL (`SET task:{id} ... EX 3600`).
  6. API transmits HTTP 200 OK with `X-Cache: MISS` header back to the Browser.
- **Interactive Stepper:** Next/Prev step controls, automated playback, live node highlighting, code previews, and latency/resilience analysis.
- **Production Engineering Analysis:** Solutions for Cache Stampede (Thundering Herd), Cache Penetration (Bloom Filters), Invalidation drift, and Fail-Open Redis degradation.

---

## How to View
Open either HTML file directly in any modern web browser:
- [`architecture/index.html`](file:///C:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/architecture/index.html)
- [`architecture/cache-miss-flow.html`](file:///C:/Users/SMD/Downloads/aidlc_TO_DO/jalaj3/architecture/cache-miss-flow.html)
