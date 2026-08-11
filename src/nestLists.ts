import type {PortableTextBlock, PortableTextListItemBlock, TypedObject} from '@portabletext/types'

import {
  isPortableTextListItemBlock,
  isPortableTextSpan,
  isPortableTextToolkitList,
} from './asserters'
import type {
  ToolkitListNestMode,
  ToolkitPortableTextDirectList,
  ToolkitPortableTextHtmlList,
  ToolkitPortableTextList,
} from './types'

export type ToolkitNestListsOutputNode<T> =
  | T
  | ToolkitPortableTextHtmlList
  | ToolkitPortableTextDirectList

/**
 * Takes an array of blocks and returns an array of nodes optimized for rendering in HTML-like
 * environment, where lists are nested inside of eachother instead of appearing "flat" as in
 * native Portable Text data structures.
 *
 * Note that the list node is not a native Portable Text node type, and thus is represented
 * using the {@link ToolkitPortableTextList | `@list`} type name (`{_type: '@list'}`).
 *
 * The nesting can be configured in two modes:
 *
 * - `direct`: deeper list nodes will appear as a direct child of the parent list
 * - `html`, deeper list nodes will appear as a child of the last _list item_ in the parent list
 *
 * When using `direct`, all list nodes will be of type {@link ToolkitPortableTextDirectList},
 * while with `html` they will be of type {@link ToolkitPortableTextHtmlList}
 *
 * These modes are available as {@link LIST_NEST_MODE_HTML} and {@link LIST_NEST_MODE_DIRECT}.
 *
 * In both modes, a list node is always nested as deeply as its `level` says it is. List items can
 * start at any level and skip any number of levels, so the levels that were never authored are
 * generated to keep the two in sync - meaning renderers can indent by tree depth or by `level` and
 * get the same result. A generated list holds an empty list item in `html` mode, since HTML can
 * only nest a list inside a list item, and holds nothing but the deeper list in `direct` mode.
 *
 * @param blocks - Array of Portable Text blocks and other arbitrary types
 * @param mode - Mode to use for nesting, `direct` or `html`
 * @returns Array of potentially nested nodes optimized for rendering
 */
export function nestLists<T extends TypedObject = PortableTextBlock | TypedObject>(
  blocks: T[],
  mode: 'direct',
): (T | ToolkitPortableTextDirectList)[]
export function nestLists<T extends TypedObject = PortableTextBlock | TypedObject>(
  blocks: T[],
  mode: 'html',
): (T | ToolkitPortableTextHtmlList)[]
export function nestLists<T extends TypedObject = PortableTextBlock | TypedObject>(
  blocks: T[],
  mode: 'direct' | 'html',
): (T | ToolkitPortableTextHtmlList | ToolkitPortableTextDirectList)[]
export function nestLists<T extends TypedObject = PortableTextBlock | TypedObject>(
  blocks: T[],
  mode: ToolkitListNestMode,
): ToolkitNestListsOutputNode<T>[] {
  const tree: ToolkitNestListsOutputNode<T>[] = []
  let currentList: ToolkitPortableTextList | undefined

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (!block) {
      continue
    }

    if (!isPortableTextListItemBlock(block)) {
      tree.push(block)
      currentList = undefined
      continue
    }

    // Start of a new list?
    if (!currentList) {
      const nestedLists = createNestedLists(block, i, mode, 0)
      currentList = nestedLists.current
      tree.push(nestedLists.root)
      continue
    }

    // New list item within same list?
    if (blockMatchesList(block, currentList)) {
      currentList.children.push(block)
      continue
    }

    // Different list props, are we going deeper?
    if ((block.level || 1) > currentList.level) {
      const nestedLists = createNestedLists(block, i, mode, currentList.level)
      appendNestedList(currentList, nestedLists.root)
      currentList = nestedLists.current
      continue
    }

    // Different list props, are we going back up the tree?
    if ((block.level || 1) < currentList.level) {
      // Current list has ended, and we need to hook up with a parent of the same level and type
      const matchingBranch = tree[tree.length - 1]
      const match = matchingBranch && findListMatching(matchingBranch, block)
      if (match) {
        currentList = match
        currentList.children.push(block)
        continue
      }

      // Similar parent can't be found, assume new list
      const nestedLists = createNestedLists(block, i, mode, 0)
      currentList = nestedLists.current
      tree.push(nestedLists.root)
      continue
    }

    // Different list props, different list style?
    if (block.listItem !== currentList.listItem) {
      const matchingBranch = tree[tree.length - 1]
      const match = matchingBranch && findListMatching(matchingBranch, {level: block.level || 1})
      if (match && match.listItem === block.listItem) {
        currentList = match
        currentList.children.push(block)
        continue
      } else {
        const nestedLists = createNestedLists(block, i, mode, 0)
        currentList = nestedLists.current
        tree.push(nestedLists.root)
        continue
      }
    }

    // oxlint-disable-next-line no-console
    console.warn('Unknown state encountered for block', block)
    tree.push(block)
  }

  return tree
}

function blockMatchesList(block: PortableTextBlock, list: ToolkitPortableTextList) {
  return (block.level || 1) === list.level && block.listItem === list.listItem
}

function listFromBlock(
  block: PortableTextListItemBlock,
  index: number,
  mode: ToolkitListNestMode,
  level: number,
  children: PortableTextListItemBlock[],
): ToolkitPortableTextList {
  // Generated ancestor lists share the block's key, so they need the level to stay unique
  const suffix = level === (block.level || 1) ? '' : `-${level}`
  const key = `${block._key || `${index}`}-parent${suffix}`
  return {_type: '@list', _key: key, mode, level, listItem: block.listItem, children}
}

function createNestedLists(
  block: PortableTextListItemBlock,
  index: number,
  mode: ToolkitListNestMode,
  startLevel: number,
): {root: ToolkitPortableTextList; current: ToolkitPortableTextList} {
  const level = block.level || 1
  const firstLevel = startLevel + 1
  const root = listFromBlock(
    block,
    index,
    mode,
    firstLevel,
    listChildren(block, index, mode, firstLevel, level),
  )
  let current = root

  for (let listLevel = firstLevel + 1; listLevel <= level; listLevel++) {
    const list = listFromBlock(
      block,
      index,
      mode,
      listLevel,
      listChildren(block, index, mode, listLevel, level),
    )
    appendNestedList(current, list)
    current = list
  }

  return {root, current}
}

function listChildren(
  block: PortableTextListItemBlock,
  index: number,
  mode: ToolkitListNestMode,
  listLevel: number,
  targetLevel: number,
): PortableTextListItemBlock[] {
  if (listLevel === targetLevel) {
    return [block]
  }

  return mode === 'html' ? [emptyListItemFromBlock(block, index, listLevel)] : []
}

function emptyListItemFromBlock(
  block: PortableTextListItemBlock,
  index: number,
  level: number,
): PortableTextListItemBlock {
  return {
    ...block,
    _key: `${block._key || `${index}`}-placeholder-${level}`,
    children: [],
    level,
  }
}

// Both lists are always created with the same mode, so the mixed cases cannot occur
function appendNestedList(parentList: ToolkitPortableTextList, childList: ToolkitPortableTextList) {
  if (parentList.mode === 'html' && childList.mode === 'html') {
    // Because HTML is kinda weird, nested lists needs to be nested within list items.
    // So while you would think that we could populate the parent list with a new sub-list,
    // we actually have to target the last list element (child) of the parent.
    // However, at this point we need to be very careful - simply pushing to the list of children
    // will mutate the input, and we don't want to blindly clone the entire tree.
    const lastIndex = parentList.children.length - 1
    const lastListItem = parentList.children[lastIndex]
    if (!lastListItem) {
      return
    }

    // Swap the last child for a clone that holds our new list as its last child
    parentList.children[lastIndex] = {
      ...lastListItem,
      children: [...lastListItem.children, childList],
    }
    return
  }

  if (parentList.mode === 'direct' && childList.mode === 'direct') {
    parentList.children.push(childList)
  }
}

function findListMatching<T extends TypedObject | PortableTextBlock>(
  rootNode: T,
  matching: Partial<PortableTextListItemBlock>,
): ToolkitPortableTextList | undefined {
  const level = matching.level || 1
  const style = matching.listItem || 'normal'
  const filterOnType = typeof matching.listItem === 'string'
  if (
    isPortableTextToolkitList(rootNode) &&
    (rootNode.level || 1) === level &&
    filterOnType &&
    (rootNode.listItem || 'normal') === style
  ) {
    return rootNode
  }

  if (!('children' in rootNode)) {
    return undefined
  }

  const node = rootNode.children[rootNode.children.length - 1]
  return node && !isPortableTextSpan(node) ? findListMatching(node, matching) : undefined
}
