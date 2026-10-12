import {
  isPortableTextListItemBlock,
  isPortableTextToolkitList,
  LIST_NEST_MODE_DIRECT,
  LIST_NEST_MODE_HTML,
  nestLists,
} from '@portabletext/toolkit'
import type {PortableTextListItemBlock, TypedObject} from '@portabletext/types'
import {expect, test} from 'vitest'

import {listNestingFixtures} from './fixtures/nestLists'

test('nestLists: returns empty tree on no blocks', () => {
  expect(nestLists([], LIST_NEST_MODE_HTML)).toEqual([])
})

test('nestLists: returns non-list blocks verbatim', () => {
  const block = {_type: 'block', children: [{_type: 'span', text: 'Verbatim, please'}]}
  expect(nestLists([block], LIST_NEST_MODE_HTML)).toEqual([block])
})

test('nestLists: wraps list items in toolkit list node', () => {
  const block = {
    _type: 'block',
    _key: 'a',
    children: [{_type: 'span', text: 'Verbatim, please'}],
    listItem: 'bullet',
  }
  expect(nestLists([block], LIST_NEST_MODE_HTML)).toEqual([
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
  expect(nestLists([{...block, _key: undefined}], LIST_NEST_MODE_HTML)[0]?._key).toBe('0-parent')
})

test('nestLists: wraps adjacent list items of same type/level in toolkit list node', () => {
  const blocks = createBlocks(['First', 'Second', 'Third'])
  expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
})

test('nestLists: wraps adjacent list items of different types in separate list nodes', () => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', startIndex: 2}),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
})

test('nestLists: ends lists when non-list item occurs', () => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    {_type: 'map'},
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', startIndex: 2}),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
})

test('nestLists: wraps deeper lists inside of last list item in html mode', () => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', level: 2, startIndex: 2}),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
})

test('nestLists: nests deeper lists inside of parent list in direct mode', () => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2']),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', level: 2, startIndex: 2}),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_DIRECT)).toMatchSnapshot()
})

test('nestLists: assumes level is 1 if not set', () => {
  const blocks = [
    ...createBlocks(['Bullet 1']).map(({level: _level, ...block}) => block),
    ...createBlocks(['Bullet 2'], {startIndex: 1, type: 'number'}).map(
      ({level: _level, ...block}) => block,
    ),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
})

test('nestLists: handles deeper/shallower transitions correctly in html mode', () => {
  const blocks = [
    ...createBlocks(['Level 1, A', 'Level 1, B']),
    ...createBlocks(['Level 2, C', 'Level 2, D'], {level: 2, startIndex: 2}),
    ...createBlocks(['Level 3, E', 'Level 3, F'], {level: 3, startIndex: 4}),
    ...createBlocks(['Level 2, G', 'Level 2, H'], {level: 2, startIndex: 6}),
    ...createBlocks(['Level 3, I', 'Level 3, J'], {level: 3, startIndex: 8}),
    ...createBlocks(['Level 1, K', 'Level 1, L'], {level: 1, startIndex: 10, type: 'number'}),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
})

test('nestLists: handles deeper/shallower transitions correctly in direct mode', () => {
  const blocks = [
    ...createBlocks(['Level 1, A', 'Level 1, B']),
    ...createBlocks(['Level 2, C', 'Level 2, D'], {level: 2, startIndex: 2}),
    ...createBlocks(['Level 3, E', 'Level 3, F'], {level: 3, startIndex: 4}),
    ...createBlocks(['Level 2, G', 'Level 2, H'], {level: 2, startIndex: 6}),
    ...createBlocks(['Level 3, I', 'Level 3, J'], {level: 3, startIndex: 8}),
    ...createBlocks(['Level 1, K', 'Level 1, L'], {level: 1, startIndex: 10, type: 'number'}),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_DIRECT)).toMatchSnapshot()
})

test.each(listNestingFixtures)(
  'nestLists: fills skipped levels for $name in html mode',
  ({blocks}) => {
    expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
  },
)

test.each(listNestingFixtures)(
  'nestLists: fills skipped levels for $name in direct mode',
  ({blocks}) => {
    expect(nestLists(blocks, LIST_NEST_MODE_DIRECT)).toMatchSnapshot()
  },
)

test('nestLists: wraps adjacent list items of different types in separate list nodes', () => {
  const blocks = [
    ...createBlocks(['Bullet 1', 'Bullet 2'], {type: 'bullet', startIndex: 0}),
    ...createBlocks(['Number 1', 'Number 2'], {type: 'number', startIndex: 2}),
  ]
  expect(nestLists(blocks, LIST_NEST_MODE_HTML)).toMatchSnapshot()
})

// Both nesting modes carry `level` on every list node, but only `html` mode _needs_ the tree to be
// as deep as the level, since HTML has no other way of expressing depth. Keeping the two in sync in
// `direct` mode as well means renderers that indent by tree depth and renderers that indent by
// `level` agree on the result, whichever mode they pick.
test.each(listNestingFixtures)('nestLists: nesting depth matches level for $name', ({blocks}) => {
  expect(depthMismatches(nestLists(blocks, LIST_NEST_MODE_HTML))).toEqual([])
  expect(depthMismatches(nestLists(blocks, LIST_NEST_MODE_DIRECT))).toEqual([])
})

test.each([LIST_NEST_MODE_HTML, LIST_NEST_MODE_DIRECT] as const)(
  'nestLists: ascends very deep lists without recursive searches in %s mode',
  (mode) => {
    const depth = 12_000
    const blocks = Array.from({length: depth}, (_, index) => ({
      _type: 'block',
      _key: `item-${index}`,
      listItem: 'bullet',
      level: depth - index,
      children: [{_type: 'span', text: `${index}`}],
    }))
    const tree = nestLists(blocks, mode)
    expect(tree).toHaveLength(1)
    let node: TypedObject | undefined = tree[0]
    for (let level = 1; level <= depth; level++) {
      if (!node || !isPortableTextToolkitList(node)) {
        throw new Error(`Missing list at level ${level}`)
      }
      expect(node.level).toBe(level)
      expect(node._key).toBe(level === depth ? 'item-0-parent' : `item-0-parent-${level}`)
      expect(node.children.at(-1)).toBe(blocks[depth - level])
      expect(node.children).toHaveLength(level === depth ? 1 : 2)
      const firstChild = node.children[0]
      node = mode === LIST_NEST_MODE_HTML ? firstChild?.children[0] : firstChild
    }

    const first = blocks[0]!
    const changedStyle = nestLists([first, {...first, listItem: 'number'}], mode)
    expect(changedStyle).toHaveLength(2)
    expect(changedStyle.map((root) => root._key)).toEqual(['item-0-parent-1', 'item-0-parent-1'])
  },
)

test.each([LIST_NEST_MODE_HTML, LIST_NEST_MODE_DIRECT] as const)(
  'nestLists: preserves style transitions, active branches and frozen inputs in %s mode',
  (mode) => {
    const blocks = [
      ...createBlocks(['root']),
      ...createBlocks(['deep bullet'], {level: 64, startIndex: 1}),
      ...createBlocks(['back to bullet ancestor'], {level: 32, startIndex: 2}),
      ...createBlocks(['same-level number'], {level: 32, type: 'number', startIndex: 3}),
      ...createBlocks(['number root'], {type: 'number', startIndex: 4}),
      ...createBlocks(['new bullet branch'], {level: 4, startIndex: 5}),
      ...createBlocks(['wrong-style ancestor'], {level: 2, type: 'number', startIndex: 6}),
      {_type: 'custom', _key: 'separator'},
      ...createBlocks(['after separator'], {level: 2, startIndex: 7}),
    ]
    const original = structuredClone(blocks)
    for (const block of blocks) {
      if ('children' in block) {
        for (const child of block.children) Object.freeze(child)
        Object.freeze(block.children)
      }
      Object.freeze(block)
    }
    Object.freeze(blocks)

    const tree = nestLists(blocks, mode)
    expect(blocks).toEqual(original)
    expect(tree.map((node) => node._key)).toEqual([
      'A0-parent',
      'D0-parent-1',
      'G0-parent-1',
      'separator',
      'H0-parent-1',
    ])
    expect(tree[3]).toBe(blocks[7])
    expect(depthMismatches(tree)).toEqual([])
    const numberRoot = tree[1]
    if (!numberRoot || !isPortableTextToolkitList(numberRoot)) {
      throw new Error('Missing number root')
    }
    expect(numberRoot.children).toHaveLength(mode === LIST_NEST_MODE_HTML ? 2 : 3)
    expect(nestLists(blocks, mode)).toEqual(tree)
  },
)

test.each([LIST_NEST_MODE_HTML, LIST_NEST_MODE_DIRECT] as const)(
  'nestLists: retains empty-style normalization when ascending in %s mode',
  (mode) => {
    const blocks = [
      ...createBlocks(['empty style'], {type: ''}),
      ...createBlocks(['deep'], {level: 3}),
      ...createBlocks(['normal style'], {type: 'normal'}),
    ]
    const tree = nestLists(blocks, mode)
    expect(tree).toHaveLength(1)
    const root = tree[0]
    if (!root || !isPortableTextToolkitList(root)) {
      throw new Error('Missing root')
    }
    expect(root.listItem).toBe('')
    expect(root.children.at(-1)).toBe(blocks[2])
  },
)

test.each([LIST_NEST_MODE_HTML, LIST_NEST_MODE_DIRECT] as const)(
  'nestLists: preserves matching toolkit lists in authored child tails in %s mode',
  (mode) => {
    const embedded = {
      _type: '@list',
      _key: 'embedded',
      mode,
      level: 1,
      listItem: 'number',
      children: createBlocks(['embedded item'], {type: 'number'}),
    }
    const blocks = [
      ...createBlocks(['root']),
      {
        ...createBlocks(['deep'], {level: 3})[0]!,
        children: [{_type: 'custom', children: [embedded]}],
      },
      ...createBlocks(['return to embedded'], {type: 'number'}),
      ...createBlocks(['deeper embedded'], {type: 'number', level: 2}),
      ...createBlocks(['return again'], {type: 'number'}),
    ]
    const tree = nestLists(blocks, mode)
    expect(tree).toHaveLength(1)
    expect(embedded.children.at(-1)).toBe(blocks[4])
    expect(embedded.children).toHaveLength(mode === LIST_NEST_MODE_HTML ? 3 : 4)
  },
)

function depthMismatches(nodes: TypedObject[]): string[] {
  const mismatches: string[] = []
  for (const node of nodes) {
    collectDepthMismatches(node, 0, mismatches)
  }
  return mismatches
}

function collectDepthMismatches(node: TypedObject, depth: number, mismatches: string[]): void {
  if (isPortableTextToolkitList(node)) {
    if (node.level !== depth + 1) {
      mismatches.push(`list at level ${node.level} is nested ${depth + 1} deep`)
    }

    for (const child of node.children) {
      collectDepthMismatches(child, depth + 1, mismatches)
    }
    return
  }

  if (isPortableTextListItemBlock(node)) {
    if ((node.level || 1) !== depth) {
      mismatches.push(`list item at level ${node.level} is nested ${depth} deep`)
    }

    // In html mode a deeper list hangs off the list item rather than the list, so the nested list
    // is still only one level deeper than the list this item belongs to.
    for (const child of node.children) {
      collectDepthMismatches(child, depth, mismatches)
    }
  }
}

function createBlocks(
  spans: string[],
  options: {level?: number; type?: string; startIndex?: number} = {},
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
