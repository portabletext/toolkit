import type {PortableTextListItemBlock} from '@portabletext/types'
import tap from 'tap'
import {LIST_NEST_MODE_DIRECT, LIST_NEST_MODE_HTML, nestLists} from '../src'

tap.test('nestLists: returns empty tree on no blocks', (t) => {
  t.same(nestLists([], LIST_NEST_MODE_HTML), [])
  t.end()
})

tap.test('nestLists: returns non-list blocks verbatim', (t) => {
  const block = {_type: 'block', children: [{_type: 'span', text: 'Verbatim, please'}]}
  t.same(nestLists([block], LIST_NEST_MODE_HTML), [block])
  t.end()
})

tap.test('nestLists: wraps list items in toolkit list node', (t) => {
  const block = {
    _type: 'block',
    _key: 'a',
    children: [{_type: 'span', text: 'Verbatim, please'}],
    listItem: 'bullet',
  }
  t.same(nestLists([block], LIST_NEST_MODE_HTML), [
    {
      _type: '@list',
      _key: 'a-parent',
      mode: 'html',
      level: 1,
      listItem: 'bullet',
      children: [block],
    },
  ])

  // Uses index as key if no _key is present
  t.same(nestLists([{...block, _key: undefined}], LIST_NEST_MODE_HTML)[0]?._key, '0-parent')
  t.end()
})

tap.test('nestLists: wraps adjacent list items of same type/level in toolkit list node', (t) => {
  const blocks = createBlocks(['First', 'Second', 'Third'])
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_HTML))
  t.end()
})

tap.test('nestLists: wraps adjacent list items of different types in separate list nodes', (t) => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', startIndex: 2}),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_HTML))
  t.end()
})

tap.test('nestLists: ends lists when non-list item occurs', (t) => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    {_type: 'map'},
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', startIndex: 2}),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_HTML))
  t.end()
})

tap.test('nestLists: wraps deeper lists inside of last list item in html mode', (t) => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', level: 2, startIndex: 2}),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_HTML))
  t.end()
})

tap.test('nestLists: nests deeper lists inside of parent list in direct mode', (t) => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', level: 2, startIndex: 2}),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_DIRECT))
  t.end()
})

tap.test('nestLists: assumes level is 1 if not set', (t) => {
  const blocks = [
    ...createBlocks(['Bullet 1']).map(({level, ...block}) => block),
    ...createBlocks(['Bullet 2'], {startIndex: 1, type: 'number'}).map(
      ({level, ...block}) => block
    ),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_HTML))
  t.end()
})

tap.test('nestLists: handles deeper/shallower transitions correctly in html mode', (t) => {
  const blocks = [
    ...createBlocks(['Level 1, A', 'Level 1, B']),
    ...createBlocks(['Level 2, C', 'Level 2, D'], {level: 2, startIndex: 2}),
    ...createBlocks(['Level 3, E', 'Level 3, F'], {level: 3, startIndex: 4}),
    ...createBlocks(['Level 2, G', 'Level 2, H'], {level: 2, startIndex: 6}),
    ...createBlocks(['Level 3, I', 'Level 3, J'], {level: 3, startIndex: 8}),
    ...createBlocks(['Level 1, K', 'Level 1, L'], {level: 1, startIndex: 10, type: 'number'}),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_HTML))
  t.end()
})

tap.test('nestLists: handles deeper/shallower transitions correctly in direct mode', (t) => {
  const blocks = [
    ...createBlocks(['Level 1, A', 'Level 1, B']),
    ...createBlocks(['Level 2, C', 'Level 2, D'], {level: 2, startIndex: 2}),
    ...createBlocks(['Level 3, E', 'Level 3, F'], {level: 3, startIndex: 4}),
    ...createBlocks(['Level 2, G', 'Level 2, H'], {level: 2, startIndex: 6}),
    ...createBlocks(['Level 3, I', 'Level 3, J'], {level: 3, startIndex: 8}),
    ...createBlocks(['Level 1, K', 'Level 1, L'], {level: 1, startIndex: 10, type: 'number'}),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_DIRECT))
  t.end()
})

tap.only('nestLists: wraps adjacent list items of different types in separate list nodes', (t) => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2'], {type: 'bullet', startIndex: 0}),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', startIndex: 2}),
  ]
  t.matchSnapshot(nestLists(blocks, LIST_NEST_MODE_HTML))
  t.end()
})

function createBlocks(
  spans: string[],
  options: {level?: number; type?: string; startIndex?: number} = {}
): PortableTextListItemBlock[] {
  const {level = 1, type = 'bullet', startIndex = 0} = options
  return spans.map((span, i) => ({
    _type: 'block',
    _key: `${String.fromCharCode(65 + startIndex + i)}${i}`,
    children: [{_type: 'span', text: span}],
    listItem: type,
    level,
  }))
}
