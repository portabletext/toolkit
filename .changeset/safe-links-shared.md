---
'@portabletext/toolkit': minor
---

Add `uriLooksSafe()`, so renderers can share one check for whether a link `href` is safe to use. It allows `http`, `https`, `mailto`, `tel`, hash-links and relative URLs, and rejects other protocols such as `javascript:`, `data:` and `vbscript:`.
