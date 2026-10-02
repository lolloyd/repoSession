# Bolt's Journal

Critical learnings and codebase performance insights.

## 2025-05-18 - Socket Timer Ticks Cascading Component Re-renders
**Learning:** In socket-driven React apps with server 1s `timer_tick` broadcasts, root `roomState` updates trigger full tree re-renders every second. Heavy child components (`Scoreboard`, `ChatFeed`, `Navbar`) re-rendered and re-sorted data every second because action props were inline functions.
**Action:** Ensure action handlers passed from root `App` are wrapped in `useCallback` and static/semi-static UI panels are wrapped in `React.memo` with internal `useMemo` for sorting operations.
