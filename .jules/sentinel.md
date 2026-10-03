## 2025-05-19 - WebSocket Event Spam and Unbounded Bot/Player Room Creation (DoS)
**Vulnerability:** Socket.IO listeners lacked rate limiting on high-frequency actions (`submit_answer`, `send_chat`, `send_reaction`, `add_bot`) and rooms lacked capacity limits or room code string length truncation. Spammers could emit hundreds of requests/sec or create thousands of bots, triggering excessive Levenshtein distance calculations and memory exhaustion.
**Learning:** Real-time multiplayer rooms that accept bot/player additions and evaluate input against text algorithms must enforce per-socket message rate limits and strict room capacity/string length bounds.
**Prevention:** Implement per-connection rate limiting (`isRateLimited`) and cap entity creation (`MAX_PLAYERS_PER_ROOM`, `MAX_BOTS_PER_ROOM`) alongside truncating string parameters.

## 2025-05-18 - Socket.IO Uncaught TypeError Crash on Malformed Payloads
**Vulnerability:** Socket.IO listeners destructuring payloads directly (e.g. `socket.on('event', ({ key }) => ...)`) or calling `.trim()` on unvalidated inputs threw uncaught `TypeError` when sent `null`, numbers, or non-string values, crashing the entire Node server process (DoS).
**Learning:** Event listeners in Express/Socket.IO lack runtime schema enforcement by default. Malformed client packets directly trigger server-side runtime exceptions if not safely defaulted (`data || {}`) and type-checked before invoking string/array methods.
**Prevention:** Always fallback destructuring using `(data || {})` and enforce `typeof val === 'string'` or explicit type guards on user-supplied parameters before operating on them.
