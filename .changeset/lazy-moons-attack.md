---
'@portabletext/toolkit': major
---

Require Node.js 22.12 or later, and drop the legacy `main` and `module` fields

The package has been ESM-only for a while, but still carried `main` and `module` entry points for
resolvers that predate `exports`. Those are gone, so the package resolves through `exports` only.
