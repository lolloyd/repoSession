## 2025-05-20 - Missing Host Authorization and Room Capacity Checks on Socket Handlers
**Vulnerability:** Socket.IO listeners for `add_bot` and `remove_bot` lacked host socket checks (`socketId === this.hostId`) and room player limits, allowing non-host clients to alter room composition or flood room capacity to trigger resource exhaustion.
**Learning:** Room state actions in Socket.IO handlers must consistently pass `socket.id` and verify host privileges or bounds at the model layer (`GameRoom`), rather than relying solely on UI hidden controls.
**Prevention:** Always forward `socket.id` to room state mutators, check `socketId === this.hostId` for host operations, and set strict maximum bounds (e.g. `this.players.size < 12`) on room entity additions.

## 2025-05-18 - Socket.IO Uncaught TypeError Crash on Malformed Payloads
**Vulnerability:** Socket.IO listeners destructuring payloads directly (e.g. `socket.on('event', ({ key }) => ...)`) or calling `.trim()` on unvalidated inputs threw uncaught `TypeError` when sent `null`, numbers, or non-string values, crashing the entire Node server process (DoS).
**Learning:** Event listeners in Express/Socket.IO lack runtime schema enforcement by default. Malformed client packets directly trigger server-side runtime exceptions if not safely defaulted (`data || {}`) and type-checked before invoking string/array methods.
**Prevention:** Always fallback destructuring using `(data || {})` and enforce `typeof val === 'string'` or explicit type guards on user-supplied parameters before operating on them.
