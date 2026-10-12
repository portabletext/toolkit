import {
  buildMarksTree,
  LIST_NEST_MODE_DIRECT,
  LIST_NEST_MODE_HTML,
  nestLists,
} from '@portabletext/toolkit'
import type {PortableTextBlock} from '@portabletext/types'
import {bench, describe} from 'vitest'

const options = {time: 100, iterations: 5, warmupTime: 50}

function blockWithSpans(count: number, marks: (index: number) => string[]): PortableTextBlock {
  return {
    _type: 'block',
    children: Array.from({length: count}, (_, index) => ({
      _type: 'span',
      _key: String(index),
      text: 'Portable Text',
      marks: marks(index),
    })),
  }
}

describe('mark tree preprocessing', () => {
  for (const size of [10, 1_000, 10_000]) {
    const plain = blockWithSpans(size, () => [])
    const singleMark = blockWithSpans(size, () => ['strong'])
    const sharedMarks = blockWithSpans(size, () => ['em', 'strong'])
    const annotations = {
      ...blockWithSpans(size, (index) => [`link-${index % 100}`, 'strong']),
      markDefs: Array.from({length: 100}, (_, index) => ({
        _key: `link-${index}`,
        _type: 'link',
      })),
    }
    const newlines: PortableTextBlock = {
      _type: 'block',
      children: [{_type: 'span', text: 'line\n'.repeat(size)}],
    }

    bench(
      `plain (${size})`,
      () => {
        buildMarksTree(plain)
      },
      options,
    )
    bench(
      `single mark (${size})`,
      () => {
        buildMarksTree(singleMark)
      },
      options,
    )
    bench(
      `shared marks (${size})`,
      () => {
        buildMarksTree(sharedMarks)
      },
      options,
    )
    bench(
      `alternating annotations (${size})`,
      () => {
        buildMarksTree(annotations)
      },
      options,
    )
    bench(
      `newlines (${size})`,
      () => {
        buildMarksTree(newlines)
      },
      options,
    )
  }
})

describe('list preprocessing', () => {
  const plain = Array.from({length: 1_000}, () => blockWithSpans(100, () => []))
  const lists = plain.map((block, index) => ({
    ...block,
    _key: String(index),
    listItem: 'bullet',
    level: index % 2 === 0 ? 50 : 49,
  }))

  for (const mode of [LIST_NEST_MODE_HTML, LIST_NEST_MODE_DIRECT] as const) {
    bench(
      `non-list blocks (${mode})`,
      () => {
        nestLists(plain, mode)
      },
      options,
    )
    bench(
      `deep transitions (${mode})`,
      () => {
        nestLists(lists, mode)
      },
      options,
    )
  }
})

describe('renderer-owned immutable memoization', () => {
  const blocks = Array.from({length: 100}, () => blockWithSpans(100, () => ['em', 'strong']))
  const updatedBlocks = blocks.map((block, index) =>
    index === 50
      ? {...block, children: [...block.children, {_type: 'span', text: 'Edited'}]}
      : block,
  )
  const cache = new WeakMap<PortableTextBlock, ReturnType<typeof buildMarksTree>>()
  for (const block of blocks) {
    cache.set(block, buildMarksTree(block))
  }

  bench(
    'unchanged document, rebuild',
    () => {
      blocks.map((block) => buildMarksTree(block))
    },
    options,
  )
  bench(
    'unchanged document, reuse',
    () => {
      blocks.map((block) => cache.get(block))
    },
    options,
  )
  bench(
    'single-block edit, rebuild',
    () => {
      updatedBlocks.map((block) => buildMarksTree(block))
    },
    options,
  )
  bench(
    'single-block edit, reuse unchanged blocks',
    () => {
      updatedBlocks.map((block) => cache.get(block) ?? buildMarksTree(block))
    },
    options,
  )
})
