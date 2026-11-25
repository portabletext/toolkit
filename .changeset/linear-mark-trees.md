---
'@portabletext/toolkit': patch
---

Make `buildMarksTree` linear in the number of spans, newlines and annotations. Long runs of shared marks, newline-heavy text and blocks with many annotations no longer take quadratic time. The output is unchanged.
