import type {PortableTextSpan, TypedObject} from '@portabletext/types'

import {isPortableTextSpan} from './asserters'

const knownDecorators = ['strong', 'em', 'code', 'underline', 'strike-through']

/**
 * Figures out the optimal order of marks, in order to minimize the amount of
 * nesting/repeated elements in environments such as HTML. For instance, a naive
 * implementation might render something like:
 *
 * ```html
 * <strong>This block contains </strong>
 * <strong><a href="https://some.url/">a link</a></strong>
 * <strong> and some bolded text</strong>
 * ```
 *
 * ...whereas an optimal order would be:
 *
 * ```html
 * <strong>
 *   This block contains <a href="https://some.url/">a link</a> and some bolded text
 * </strong>
 * ```
 *
 * This is particularly necessary for cases like links, where you don't want multiple
 * individual links for different segments of the link text, even if parts of it are
 * bolded/italicized.
 *
 * This function is meant to be used like: `block.children.map(sortMarksByOccurences)`,
 * and uses the same ordering as {@link buildMarksTree | `buildMarksTree()`}.
 *
 * The marks are sorted in the following order:
 *
 *  1. Marks that are shared amongst the most adjacent siblings
 *  2. Non-default marks (links, custom metadata)
 *  3. Decorators (bold, emphasis, code etc), in a predefined, preferred order
 *
 * @param span - The current span to sort
 * @param index - The index of the current span within the block
 * @param blockChildren - All children of the block being sorted
 * @returns Array of decorators and annotations, sorted by "most adjacent siblings"
 */
export function sortMarksByOccurences(
  span: PortableTextSpan | TypedObject,
  index: number,
  blockChildren: (PortableTextSpan | TypedObject)[],
): string[] {
  if (!isPortableTextSpan(span) || !span.marks) {
    return []
  }

  if (!span.marks.length) {
    return []
  }

  // Slicing because we'll be sorting with `sort()`, which mutates
  const marks = span.marks.slice()
  if (marks.length === 1) {
    return marks
  }

  const occurences = new Map<string, number>()
  marks.forEach((mark) => {
    let count = 1

    for (let siblingIndex = index + 1; siblingIndex < blockChildren.length; siblingIndex++) {
      const sibling = blockChildren[siblingIndex]

      if (
        sibling &&
        isPortableTextSpan(sibling) &&
        Array.isArray(sibling.marks) &&
        sibling.marks.indexOf(mark) !== -1
      ) {
        count++
      } else {
        break
      }
    }
    occurences.set(mark, count)
  })

  return marks.sort((markA, markB) =>
    sortMarks(occurences.get(markA) ?? 0, occurences.get(markB) ?? 0, markA, markB),
  )
}

/**
 * Prepare a whole block in one backward pass. Each run counts consecutive spans,
 * not duplicate marks within a span. Undefined entries represent non-span children.
 * @internal
 */
export function sortBlockMarks(
  children: (PortableTextSpan | TypedObject)[],
): ({span: PortableTextSpan; marks: string[]} | undefined)[] {
  // Preallocate for backward writes; growing an empty array regresses small blocks.
  // oxlint-disable-next-line unicorn/no-new-array
  const prepared = new Array<{span: PortableTextSpan; marks: string[]} | undefined>(children.length)
  let runs: Map<string, {index: number; count: number}> | undefined

  for (let index = children.length - 1; index >= 0; index--) {
    const span = children[index]
    if (!span || !isPortableTextSpan(span)) {
      prepared[index] = undefined
      continue
    }

    const marks = span.marks?.slice() ?? []
    for (const mark of marks) {
      runs ??= new Map()
      const run = runs.get(mark)
      if (!run) {
        runs.set(mark, {index, count: 1})
      } else if (run.index !== index) {
        run.count = run.index === index + 1 ? run.count + 1 : 1
        run.index = index
      }
    }

    if (marks.length > 1) {
      marks.sort((markA, markB) =>
        sortMarks(runs?.get(markA)?.count ?? 0, runs?.get(markB)?.count ?? 0, markA, markB),
      )
    }
    prepared[index] = {span, marks}
  }

  return prepared
}

function sortMarks(aOccurences: number, bOccurences: number, markA: string, markB: string): number {
  if (aOccurences !== bOccurences) {
    return bOccurences - aOccurences
  }

  const aKnownPos = knownDecorators.indexOf(markA)
  const bKnownPos = knownDecorators.indexOf(markB)

  // Sort known decorators last
  if (aKnownPos !== bKnownPos) {
    return aKnownPos - bKnownPos
  }

  // Sort other marks simply by key
  return markA.localeCompare(markB)
}
