# Bolt's Journal

Critical learnings and codebase performance insights.

## 2025-05-20 - Socket.io Timer Ticks & Component Tree Memoization
**Learning:** High-frequency socket events (such as 1-second `timer_tick` events updating top-level `roomState.timeLeft`) trigger full component tree re-renders across `Navbar`, `Scoreboard`, and `ChatFeed` if handlers passed as props are inline functions or components aren't memoized.
**Action:** Wrap all socket action handlers in `App.jsx` with `useCallback`, memoize derived values like `currentPlayer` and player sorting with `useMemo`, and wrap static/child components (`Navbar`, `Scoreboard`, `ChatFeed`) with `React.memo` to isolate timer updates exclusively to `PlayingScreen`.
