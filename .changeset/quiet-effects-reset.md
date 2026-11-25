---
"@shiftbloom-studio/birthday-cake-loading": patch
---

Reset `CakeUpgrade` and watchtower state during render instead of in an effect, which saves an extra commit when an upgrade becomes impossible or the watchtower is turned off.
