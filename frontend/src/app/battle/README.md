# Battle Route

This folder owns the battle lobby experience.

- `page.tsx` provides the server shell and lazy client loading.
- `BattleClient.tsx` handles matchmaking interaction.
- `Battle.module.css` stores battle-only layout and state styles.

Real-time battle rooms can be added later without mixing transport logic into unrelated pages.
