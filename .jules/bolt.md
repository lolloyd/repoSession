# Bolt's Journal

Critical learnings and codebase performance insights.

## 2025-02-28 - Socket Timer Tick Re-render Cascades
**Learning:** In real-time socket applications where a timer tick fires every second, setting `roomState` at the root component level (`App.jsx`) causes full component tree re-renders every second. Heavy child components like `Scoreboard` (which sorts player arrays) and `ChatFeed` (which maps over message feeds) re-rendered 45 times per round unless memoized.
**Action:** Always wrap non-timer child components in `React.memo`, memoize array sorting/transformations with `useMemo`, and stabilize socket handler props with `useCallback` to prevent cascading ticks from re-rendering off-target sub-trees.
