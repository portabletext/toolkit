import {
  buildMarksTree,
  LIST_NEST_MODE_DIRECT,
  LIST_NEST_MODE_HTML,
  nestLists,
} from '@portabletext/toolkit'
import type {PortableTextBlock} from '@portabletext/types'
import {bench, describe} from 'vitest'

const options = {time: 500, iterations: 5, warmupTime: 100}

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
  for (const size of [1, 3, 10, 1_000, 10_000]) {
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
