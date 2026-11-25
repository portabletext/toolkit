import {buildMarksTree} from '@portabletext/toolkit'
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

test('buildMarksTree: keeps a long run of shared marks under a single node', () => {
  const children = Array.from({length: 2_000}, (_, i) => ({
    _type: 'span',
    _key: `s${i}`,
    text: `${i}`,
    marks: i % 2 ? ['strong', 'em'] : ['em', 'strong'],
  }))

  expect(buildMarksTree({_type: 'block', children})).toEqual([
    {
      _type: '@span',
      _key: 's0',
      children: [
        {
          _type: '@span',
          _key: 's0',
          children: children.map(({text}) => ({_type: '@text', text})),
          markDef: undefined,
          markType: 'em',
          markKey: 'em',
        },
      ],
      markDef: undefined,
      markType: 'strong',
      markKey: 'strong',
    },
  ])
})

const textNodes = (...texts: string[]) => texts.map((text) => ({_type: '@text', text}))
const treeOfText = (text: string) =>
  buildMarksTree({_type: 'block', children: [{_type: 'span', text}]})

test('buildMarksTree: splits newline-heavy text into lines and newline nodes', () => {
  expect(treeOfText('')).toEqual(textNodes(''))
  expect(treeOfText('\n')).toEqual(textNodes('', '\n', ''))
  expect(treeOfText('a\n\nb\n')).toEqual(textNodes('a', '\n', '', '\n', 'b', '\n', ''))
  expect(treeOfText('a\r\nb')).toEqual(textNodes('a\r', '\n', 'b'))

  const manyLines = treeOfText('line\n'.repeat(5_000))
  expect(manyLines).toEqual([
    ...Array.from({length: 5_000}, () => textNodes('line', '\n')).flat(),
    {_type: '@text', text: ''},
  ])
})

test('buildMarksTree: resolves many annotations, using the first matching definition', () => {
  const markDefs = Array.from({length: 1_000}, (_, i) => ({_key: `link${i}`, _type: 'link'}))
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      ...markDefs.map((def, i) => ({_type: 'span', _key: `s${i}`, text: 'a', marks: [def._key]})),
      {_type: 'span', _key: 'unknown', text: 'b', marks: ['missing']},
    ],
    markDefs: [...markDefs, {_key: 'link500', _type: 'duplicate'}],
  }

  const tree = buildMarksTree(block)
  expect(tree).toHaveLength(1_001)
  tree.slice(0, -1).forEach((node, i) => {
    expect(node).toEqual({
      _type: '@span',
      _key: `s${i}`,
      children: [{_type: '@text', text: 'a'}],
      markDef: markDefs[i],
      markType: 'link',
      markKey: `link${i}`,
    })
  })
  expect((tree[500] as {markDef: unknown}).markDef).toBe(markDefs[500])
  expect(tree.at(-1)).toEqual({
    _type: '@span',
    _key: 'unknown',
    children: [{_type: '@text', text: 'b'}],
    markDef: undefined,
    markType: 'missing',
    markKey: 'missing',
  })
})

test('buildMarksTree: nests a mixed block of decorators, annotations and inline objects', () => {
  // Deterministic pseudo-random block, so the snapshot covers many combinations of mark runs
  let seed = 7
  const random = (max: number) => {
    seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648
    return Math.floor((seed / 2_147_483_648) * max)
  }
  const markPool = ['strong', 'em', 'code', 'underline', 'link1', 'link2', 'comment', '__proto__']
  const children: PortableTextBlock['children'] = []
  for (let i = 0; i < 40; i++) {
    const kind = random(10)
    if (kind === 0) {
      children.push({_type: 'image', _key: `img${i}`})
    } else if (kind === 1) {
      children.push({_type: 'span', _key: `s${i}`, text: `${i}\n`})
    } else {
      const marks = Array.from({length: random(4)}, () => markPool[random(markPool.length)]!)
      children.push({_type: 'span', _key: `s${i}`, text: `${i}`, marks})
    }
  }

  expect(
    buildMarksTree({
      _type: 'block',
      children,
      markDefs: [
        {_key: 'link1', _type: 'link', href: '/one'},
        {_key: 'link2', _type: 'link', href: '/two'},
        {_key: 'link1', _type: 'link', href: '/ignored'},
        {_key: 'comment', _type: 'comment'},
      ],
    }),
  ).toMatchSnapshot()
})
