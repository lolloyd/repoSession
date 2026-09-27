# Palette's UX & Accessibility Journal

## 2025-05-18 - Screen Reader Accessibility on Custom Visual Controls
**Learning:** Icon-only buttons and emoji reaction pickers in custom pastel design systems lack default accessible names for screen readers unless `aria-label` attributes are explicitly declared.
**Action:** Always verify all icon-only buttons (`<button>` containing `<LucideIcon />` or emojis) have explicit `aria-label` attributes matching their action.
