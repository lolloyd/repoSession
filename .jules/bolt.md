# Bolt's Journal

Critical learnings and codebase performance insights.

## 2025-05-18 - Isolate High-Frequency Timer State Updates in Real-Time React Games
**Learning:** In WebSocket / Socket.io multiplayer applications with countdown timers, per-second `timer_tick` state updates cause top-level state changes. Without memoization (`React.memo`) and callback stabilization (`useCallback`), every timer tick forces full-tree re-renders of non-timer components like `ChatFeed` (re-rendering up to 80 messages), `Scoreboard` (re-sorting arrays), and `Navbar`.
**Action:** Always wrap action handlers in `useCallback`, memoize derived arrays with `useMemo`, and wrap pure child UI components in `React.memo` to isolate timer-driven re-renders strictly to components displaying time.
