# Bolt's Journal

Critical learnings and codebase performance insights.

## 2025-03-02 - [Preventing React Re-Renders on High-Frequency Timer Ticks]
**Learning:** High-frequency socket events like `timer_tick` (1s intervals) update top-level state in `App.jsx`, triggering re-renders across all child components unless handlers are wrapped with `useCallback` and pure components (`Navbar`, `ChatFeed`, `Scoreboard`) are wrapped with `React.memo`. Caching computed values like player list sorting with `useMemo` avoids redundant array allocations during active rounds.
**Action:** When working on real-time multiplayer UIs with ticking timers, pair `React.memo` on pure UI panels with `useCallback` for all passed callbacks to maintain stable prop references.
