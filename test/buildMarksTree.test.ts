import type {PortableTextBlock} from '@portabletext/types'
import tap from 'tap'
import {buildMarksTree} from '../src'

tap.test('buildMarksTree: returns empty tree on empty blocks', (t) => {
  t.same(buildMarksTree({_type: 'block', children: []}), [])
  t.same(buildMarksTree({_type: 'block'} as any), [])
  t.end()
})

tap.test('buildMarksTree: returns newlines as individual text nodes', (t) => {
  t.same(buildMarksTree({_type: 'block', children: [{_type: 'span', text: 'Portable\nText'}]}), [
    {_type: '@text', text: 'Portable'},
    {_type: '@text', text: '\n'},
    {_type: '@text', text: 'Text'},
  ])
  t.end()
})

tap.test('buildMarksTree: nests correctly, extracts correct `markDef`', (t) => {
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

  t.matchSnapshot(buildMarksTree(block))
  t.end()
})

tap.test('buildMarksTree: joins on adjacent spans with same annotation', (t) => {
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

  t.matchSnapshot(buildMarksTree(block))
  t.end()
})

tap.test(
  'buildMarksTree: nests decorators and annotations correctly, extracts correct `markDef`',
  (t) => {
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

    t.matchSnapshot(buildMarksTree(block))
    t.end()
  }
)

tap.test('buildMarksTree: includes inline objects in tree', (t) => {
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

  t.matchSnapshot(buildMarksTree(block))
  t.end()
})

tap.test('buildMarksTree: handles leading inline objects in tree', (t) => {
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

  t.matchSnapshot(buildMarksTree(block))
  t.end()
})

tap.test('buildMarksTree: handles trailing inline objects in tree', (t) => {
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

  t.matchSnapshot(buildMarksTree(block))
  t.end()
})

tap.test('buildMarksTree: includes inline objects in tree, with surrounding marks', (t) => {
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

  t.matchSnapshot(buildMarksTree(block))
  t.end()
})
