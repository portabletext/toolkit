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

The toolkit functions do not cache. For reuse across rerenders, cache
`buildMarksTree` by block object identity and `nestLists` by document array identity
and nesting mode in the renderer. Replace the entire block on text, marks, or
annotation edits, and the document array on any edit; `_key` is not a content
version. Treat cached outputs and referenced inputs as immutable. Pass original
Portable Text to `nestLists`, not trees containing generated `@list` nodes:
legacy handling of those nodes can mutate them.

Run preprocessing benchmarks with `pnpm exec vitest bench --run`. To compare
revisions, save a baseline with `--outputJson /tmp/toolkit-bench.json`, then pass
`--compare /tmp/toolkit-bench.json` on the next run. These measure preprocessing,
not browser rendering. Annotation indexing has an upfront cost proportional to
the number of definitions, so blocks with many definitions but few marked spans
can be substantially slower than a linear search.

## License

MIT © [Sanity.io](https://www.sanity.io/)
