import {buildMarksTree, isPortableTextToolkitSpan} from '@portabletext/toolkit'
import type {PortableTextBlock} from '@portabletext/types'
import {expect, test} from 'vitest'

test('buildMarksTree: returns empty tree on empty blocks', () => {
  expect(buildMarksTree({_type: 'block', children: []})).toEqual([])
  expect(buildMarksTree({_type: 'block'} as any)).toEqual([])
})

test('buildMarksTree: returns newlines as individual text nodes', () => {
  expect(
    buildMarksTree({_type: 'block', children: [{_type: 'span', text: 'Portable\nText'}]}),
  ).toEqual([
    {_type: '@text', text: 'Portable'},
    {_type: '@text', text: '\n'},
    {_type: '@text', text: 'Text'},
  ])
})

test('buildMarksTree: nests correctly, extracts correct `markDef`', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'This block '},
      {_type: 'span', text: '', marks: []},
      {_type: 'span', text: 'contains', marks: ['strong']},
      {_type: 'span', text: 'a link', marks: ['s0m3l1nk', 'strong']},
      {_type: 'span', text: ' and some bolded text', marks: ['strong']},
    ],
    markDefs: [
      {
        _key: 's0m3l1nk',
        _type: 'link',
        href: 'https://some.example/',
      },
    ],
  }

  expect(buildMarksTree(block)).toMatchSnapshot()
})

test('buildMarksTree: joins on adjacent spans with same annotation', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    _key: 'a',
    style: 'normal',
    children: [
      {_type: 'span', _key: 'a', text: 'Portable', marks: ['link']},
      {_type: 'span', _key: 'z', text: ' Text!', marks: ['link']},
    ],
    markDefs: [{_key: 'link', _type: 'link', href: 'https://portabletext.org'}],
  }

  expect(buildMarksTree(block)).toMatchSnapshot()
})

test('buildMarksTree: nests decorators and annotations correctly, extracts correct `markDef`', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'This block '},
      {_type: 'span', text: 'contains', marks: ['em', 's0m3l1nk']},
      {_type: 'span', text: 'a link', marks: ['s0m3l1nk', 'strong']},
      {_type: 'span', text: ' and some bolded text', marks: ['strong']},
    ],
    markDefs: [
      {
        _key: 's0m3l1nk',
        _type: 'link',
        href: 'https://some.example/',
      },
    ],
  }

  expect(buildMarksTree(block)).toMatchSnapshot()
})

test('buildMarksTree: includes inline objects in tree', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    _key: 'a',
    style: 'normal',
    children: [
      {_type: 'span', _key: 'a', text: 'Include'},
      {_type: 'image', _key: 'h', src: '/some/image.png'},
      {_type: 'span', _key: 'z', text: ' the image.'},
    ],
    markDefs: [],
  }

  expect(buildMarksTree(block)).toMatchSnapshot()
})

test('buildMarksTree: handles leading inline objects in tree', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    _key: 'a',
    style: 'normal',
    children: [
      {_type: 'image', _key: 'a', src: '/some/image.png'},
      {_type: 'span', _key: 'b', text: 'Include'},
      {_type: 'span', _key: 'c', text: ' the image.'},
    ],
    markDefs: [],
  }

  expect(buildMarksTree(block)).toMatchSnapshot()
})

test('buildMarksTree: handles trailing inline objects in tree', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    _key: 'a',
    style: 'normal',
    children: [
      {_type: 'span', _key: 'a', text: 'Include'},
      {_type: 'span', _key: 'b', text: ' the image.'},
      {_type: 'image', _key: 'c', src: '/some/image.png'},
    ],
    markDefs: [],
  }

  expect(buildMarksTree(block)).toMatchSnapshot()
})

test('buildMarksTree: includes inline objects in tree, with surrounding marks', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    _key: 'a',
    style: 'normal',
    children: [
      {_type: 'span', _key: 'a', text: 'Include', marks: ['em', 'strong']},
      {_type: 'image', _key: 'h', src: '/some/image.png'},
      {_type: 'span', _key: 'z', text: ' the image.', marks: ['strong', 'em']},
    ],
    markDefs: [],
  }

  expect(buildMarksTree(block)).toMatchSnapshot()
})

test.each(['', '\n', '\n\n', '\nText', 'Text\n', 'One\n\nTwo\n', 'One\r\nTwo'])(
  'buildMarksTree: preserves empty chunks and newline boundaries in %j',
  (text) => {
    const chunks = text.split('\n')
    const expected = chunks.flatMap((chunk, index) =>
      index === 0
        ? [{_type: '@text', text: chunk}]
        : [
            {_type: '@text', text: '\n'},
            {_type: '@text', text: chunk},
          ],
    )
    expect(buildMarksTree({_type: 'block', children: [{_type: 'span', text}]})).toEqual(expected)
  },
)

test('buildMarksTree: handles large flat output and newline-heavy spans', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: Array.from({length: 10_000}, () => ({_type: 'span', text: 'Text'})),
  }
  const flat = buildMarksTree(block)
  expect(flat).toHaveLength(10_000)
  expect(flat.every((node) => node._type === '@text' && node.text === 'Text')).toBe(true)

  block.children = [{_type: 'span', text: '\n'.repeat(10_000)}]
  const lines = buildMarksTree(block)
  expect(lines).toHaveLength(20_001)
  expect(
    lines.every((node, index) => 'text' in node && node.text === (index % 2 ? '\n' : '')),
  ).toBe(true)
})

test('buildMarksTree: preserves frozen inputs and returns independent output trees', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'First\n', marks: ['em', 'strong']},
      {_type: 'image', _key: 'image'},
      {_type: 'span', text: 'Last', marks: ['strong']},
    ],
  }
  for (const child of block.children) {
    if ('marks' in child) Object.freeze(child.marks)
    Object.freeze(child)
  }
  Object.freeze(block.children)
  Object.freeze(block)
  const first = buildMarksTree(block)
  const second = buildMarksTree(block)
  expect(first).toEqual(second)
  expect(first).not.toBe(second)
  expect(first[1]).toBe(block.children[1])
  const firstSpan = first[0]
  if (!firstSpan || !isPortableTextToolkitSpan(firstSpan)) throw new Error('Expected mark node')
  firstSpan.children.length = 0
  expect(second).toEqual(buildMarksTree(block))
  expect(first).not.toEqual(second)
})

test('buildMarksTree: does not cache in-place text, mark, or annotation edits', () => {
  const span = {_type: 'span', text: 'Before', marks: ['link']}
  const definition = {_key: 'link', _type: 'link'}
  const block = {_type: 'block', children: [span], markDefs: [definition]}
  buildMarksTree(block)
  span.text = 'After'
  span.marks.push('strong')
  definition._type = 'customLink'
  expect(buildMarksTree(block)).toEqual([
    {
      _type: '@span',
      _key: undefined,
      markDef: definition,
      markKey: 'link',
      markType: 'customLink',
      children: [
        {
          _type: '@span',
          _key: undefined,
          markDef: undefined,
          markKey: 'strong',
          markType: 'strong',
          children: [{_type: '@text', text: 'After'}],
        },
      ],
    },
  ])
})

test('buildMarksTree: annotation lookup preserves first matches and arbitrary keys', () => {
  const first = {_key: '__proto__', _type: 'first'}
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'Annotated', marks: ['__proto__']},
      {_type: 'span', text: 'Unknown', marks: ['missing']},
    ],
    markDefs: [first, {_key: '__proto__', _type: 'second'}],
  }
  const nodes = buildMarksTree(block)
  expect(nodes[0]).toMatchObject({markType: 'first', markDef: first})
  const annotation = nodes[0]
  if (!annotation || !isPortableTextToolkitSpan(annotation)) throw new Error('Expected annotation')
  expect(annotation.markDef).toBe(first)
  expect(nodes[1]).toMatchObject({markType: 'missing', markDef: undefined})
})

test('buildMarksTree: indexes definitions once and only when needed', () => {
  let reads = 0
  const markDefs = Array.from({length: 100}, (_, index) => ({
    get _key() {
      reads++
      return `annotation-${index}`
    },
    _type: 'link',
  }))
  const block: PortableTextBlock = {
    _type: 'block',
    markDefs,
    children: [{_type: 'span', text: 'Plain'}],
  }
  buildMarksTree(block)
  expect(reads).toBe(0)
  block.children = Array.from({length: 1_000}, (_, index) => ({
    _type: 'span',
    text: 'Marked',
    marks: [`annotation-${index % 100}`],
  }))
  buildMarksTree(block)
  expect(reads).toBeGreaterThan(0)
  expect(reads).toBeLessThanOrEqual(markDefs.length)
})
