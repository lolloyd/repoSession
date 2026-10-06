# Bolt's Journal

Critical learnings and codebase performance insights.

## 2025-05-20 - React Memoization for High-Frequency Socket Timer Ticks
**Learning:** In socket-driven React apps where high-frequency events like `timer_tick` (1s interval) update top-level state (`roomState.timeLeft` in `App.jsx`), all child components re-render every second unless action handlers are wrapped in `useCallback` and pure components (`Navbar`, `ChatFeed`, `Scoreboard`) are wrapped in `React.memo`. Unmemoized array operations like `[...players].sort(...)` in `Scoreboard` run on every tick.
**Action:** Always memoize Socket action handlers in root components and wrap static/semi-static child panels in `React.memo` + `useMemo` to insulate them from timer state updates.
## 2025-02-28 - Socket Timer Tick Re-render Cascades
**Learning:** In real-time socket applications where a timer tick fires every second, setting `roomState` at the root component level (`App.jsx`) causes full component tree re-renders every second. Heavy child components like `Scoreboard` (which sorts player arrays) and `ChatFeed` (which maps over message feeds) re-rendered 45 times per round unless memoized.
**Action:** Always wrap non-timer child components in `React.memo`, memoize array sorting/transformations with `useMemo`, and stabilize socket handler props with `useCallback` to prevent cascading ticks from re-rendering off-target sub-trees.
