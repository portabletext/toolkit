# @portabletext/toolkit

[![npm version](https://img.shields.io/npm/v/@portabletext/toolkit.svg?style=flat-square)](https://www.npmjs.com/package/@portabletext/toolkit)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@portabletext/toolkit?style=flat-square)](https://bundlephobia.com/result?p=@portabletext/toolkit)[![Build Status](https://img.shields.io/github/actions/workflow/status/portabletext/toolkit/main.yml?branch=main&style=flat-square)](https://github.com/portabletext/toolkit/actions?query=workflow%3Atest)

Javascript toolkit of handy utility functions for dealing with Portable Text.

Particularly useful for building rendering libraries for Portable Text that outputs HTML.

## Installation

```
npm install --save @portabletext/toolkit
```

## Documentation

See [https://portabletext.github.io/toolkit/](https://portabletext.github.io/toolkit/)

## Usage

```ts
import {toPlainText} from '@portabletext/toolkit'

console.log(toPlainText(myPortableTextBlocks))
```

## Rendering performance

`buildMarksTree` prepares all mark runs in a block together and appends output nodes
without repeatedly copying accumulated children. Prefer it over independently
sorting every span when constructing a render tree.

For unchanged rerenders, keep memoization in the renderer. The toolkit functions
deliberately do not cache: existing callers may mutate inputs or returned trees.
With an immutable-data contract, a renderer can:

- Cache `buildMarksTree` results by block object identity, for example in a
  renderer-owned `WeakMap`. Replace the block whenever its children, marks, or
  annotation definitions change; `_key` alone is not a content version.
- Cache `nestLists` results by document array identity **and nesting mode**.
  Replace the array on any document edit, preserving unchanged block identities
  so their mark trees can still be reused. Nested list items cloned by
  `nestLists` have new identities when nesting is rebuilt.
- Treat cached outputs and referenced input objects as immutable. Do not share
  mutable cached trees between independent consumers. Scope caches to their
  renderer or document lifetime.
- Rebuild the whole edited block's mark tree: a later span can change the mark
  ordering of earlier spans. Rebuild document-level nesting on edits rather than
  assuming only the edited list item is affected.

Stable derived identities only avoid UI work when the consuming renderer uses
them for memoization; they do not automatically prevent component rerenders.

Run preprocessing benchmarks with `pnpm exec vitest bench --run`. To compare
revisions, save a baseline with `--outputJson /tmp/toolkit-bench.json`, then pass
`--compare /tmp/toolkit-bench.json` on the next run. The benchmarks cover small and
large blocks, marks, annotations, newlines, list transitions, and renderer-owned
reuse for unchanged documents and single-block edits. They measure repeated
preprocessing calls, not browser first paint, cold-start latency, or end-to-end
component rendering; measure those and allocation profiles in the consuming app.

## License

MIT © [Sanity.io](https://www.sanity.io/)
