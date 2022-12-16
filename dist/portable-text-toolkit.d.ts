import type {ArbitraryTypedObject} from '@portabletext/types'
import type {PortableTextBlock} from '@portabletext/types'
import type {PortableTextListItemBlock} from '@portabletext/types'
import type {PortableTextMarkDefinition} from '@portabletext/types'
import type {PortableTextSpan} from '@portabletext/types'
import type {TypedObject} from '@portabletext/types'

/**
 * Takes a Portable Text block and returns a nested tree of nodes optimized for rendering
 * in HTML-like environments where you want marks/annotations to be nested inside of eachother.
 * For instance, a naive span-by-span rendering might yield:
 *
 * ```html
 * <strong>This block contains </strong>
 * <strong><a href="https://some.url/">a link</a></strong>
 * <strong> and some bolded and </strong>
 * <em><strong>italicized text</strong></em>
 * ```
 *
 * ...whereas an optimal order would be:
 *
 * ```html
 * <strong>
 *   This block contains <a href="https://some.url/">a link</a>
 *   and some bolded and <em>italicized text</em>
 * </strong>
 * ```
 *
 * Note that since "native" Portable Text spans cannot be nested,
 * this function returns an array of "toolkit specific" types:
 * {@link ToolkitTextNode | `@text`} and {@link ToolkitNestedPortableTextSpan | `@span` }.
 *
 * The toolkit-specific type can hold both types, as well as any arbitrary inline objects,
 * creating an actual tree.
 *
 * @param block - The Portable Text block to create a tree of nodes from
 * @returns Array of (potentially) nested spans, text nodes and/or arbitrary inline objects
 */
export declare function buildMarksTree<
  M extends PortableTextMarkDefinition = PortableTextMarkDefinition
>(
  block: PortableTextBlock<M>
): (ToolkitNestedPortableTextSpan<M> | ToolkitTextNode | ArbitraryTypedObject)[]

/**
 * Strict check to determine if node is a correctly formatted Portable Text block.
 *
 * @param node - Node to check
 * @returns True if valid Portable Text block, otherwise false
 */
export declare function isPortableTextBlock(
  node: PortableTextBlock | TypedObject
): node is PortableTextBlock

/**
 * Strict check to determine if node is a correctly formatted portable list item block.
 *
 * @param block - Block to check
 * @returns True if valid Portable Text list item block, otherwise false
 */
export declare function isPortableTextListItemBlock(
  block: PortableTextBlock | TypedObject
): block is PortableTextListItemBlock

/**
 * Strict check to determine if node is a correctly formatted Portable Text span.
 *
 * @param node - Node to check
 * @returns True if valid Portable Text span, otherwise false
 */
export declare function isPortableTextSpan(
  node: ArbitraryTypedObject | PortableTextSpan
): node is PortableTextSpan

/**
 * Loose check to determine if block is a toolkit list node.
 * Only checks `_type`, assumes correct structure.
 *
 * @param block - Block to check
 * @returns True if toolkit list, otherwise false
 */
export declare function isPortableTextToolkitList(
  block: TypedObject | ToolkitPortableTextList
): block is ToolkitPortableTextList

/**
 * Loose check to determine if span is a toolkit span node.
 * Only checks `_type`, assumes correct structure.
 *
 * @param span - Span to check
 * @returns True if toolkit span, otherwise false
 */
export declare function isPortableTextToolkitSpan(
  span: TypedObject | ToolkitNestedPortableTextSpan
): span is ToolkitNestedPortableTextSpan

/**
 * Loose check to determine if node is a toolkit text node.
 * Only checks `_type`, assumes correct structure.
 *
 * @param node - Node to check
 * @returns True if toolkit text node, otherwise false
 */
export declare function isPortableTextToolkitTextNode(
  node: TypedObject | ToolkitTextNode
): node is ToolkitTextNode

/**
 * List nesting mode for direct, nested lists, see the {@link nestLists | `nestLists()` function}
 */
export declare const LIST_NEST_MODE_DIRECT = 'direct'

/**
 * List nesting mode for HTML, see the {@link nestLists | `nestLists()` function}
 */
export declare const LIST_NEST_MODE_HTML = 'html'

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
 * @param blocks - Array of Portable Text blocks and other arbitrary types
 * @param mode - Mode to use for nesting, `direct` or `html`
 * @returns Array of potentially nested nodes optimized for rendering
 */
export declare function nestLists<T extends TypedObject = PortableTextBlock | TypedObject>(
  blocks: T[],
  mode: 'direct'
): (T | ToolkitPortableTextDirectList)[]

export declare function nestLists<T extends TypedObject = PortableTextBlock | TypedObject>(
  blocks: T[],
  mode: 'html'
): (T | ToolkitPortableTextHtmlList)[]

export declare function nestLists<T extends TypedObject = PortableTextBlock | TypedObject>(
  blocks: T[],
  mode: 'direct' | 'html'
): (T | ToolkitPortableTextHtmlList | ToolkitPortableTextDirectList)[]

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
 * and is used internally in {@link buildMarksTree | `buildMarksTree()`}.
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
export declare function sortMarksByOccurences(
  span: PortableTextSpan | TypedObject,
  index: number,
  blockChildren: (PortableTextSpan | TypedObject)[]
): string[]

/**
 * Returns the plain-text representation of a
 * {@link ToolkitNestedPortableTextSpan | toolkit-specific Portable Text span}.
 *
 * Useful if you have a subset of nested nodes and want the text from just those,
 * instead of for the entire Portable Text block.
 *
 * @param span - Span node to get text from (Portable Text toolkit specific type)
 * @returns The plain-text version of the span
 */
export declare function spanToPlainText(span: ToolkitNestedPortableTextSpan): string

/**
 * List nesting mode, see the {@link nestLists | `nestLists()` function}
 */
export declare type ToolkitListNestMode = 'html' | 'direct'

/**
 * Toolkit-specific type representing a portable text span that can hold other spans.
 * In this type, each span only has a single mark, instead of an array of them.
 */
export declare interface ToolkitNestedPortableTextSpan<
  M extends PortableTextMarkDefinition = PortableTextMarkDefinition
> {
  /**
   * Type name, prefixed with `@` to signal that this is a toolkit-specific node.
   */
  _type: '@span'
  /**
   * Unique key for this span
   */
  _key?: string
  /**
   * Holds the value (definition) of the mark in the case of annotations.
   * `undefined` if the mark is a decorator (strong, em or similar).
   */
  markDef?: M
  /**
   * The key of the mark definition (in the case of annotations).
   * `undefined` if the mark is a decorator (strong, em or similar).
   */
  markKey?: string
  /**
   * Type of the mark. For annotations, this is the `_type` property of the value.
   * For decorators, it will hold the name of the decorator (strong, em or similar).
   */
  markType: string
  /**
   * Child nodes of this span. Can be toolkit-specific text nodes, nested spans
   * or any inline object type.
   */
  children: (
    | ToolkitTextNode
    | ToolkitNestedPortableTextSpan<PortableTextMarkDefinition>
    | ArbitraryTypedObject
  )[]
}

export declare type ToolkitNestListsOutputNode<T> =
  | T
  | ToolkitPortableTextHtmlList
  | ToolkitPortableTextDirectList

/**
 * Toolkit-specific type representing a nested list in "direct" mode, where deeper lists are nested
 * inside of the lists children, alongside other blocks.
 */
export declare interface ToolkitPortableTextDirectList {
  /**
   * Type name, prefixed with `@` to signal that this is a toolkit-specific node.
   */
  _type: '@list'
  /**
   * Unique key for this list (within its parent)
   */
  _key: string
  /**
   * List mode, signaling that list nodes can appear as direct children
   */
  mode: 'direct'
  /**
   * Level/depth of this list node (starts at `1`)
   */
  level: number
  /**
   * Style of this list item (`bullet`, `number` are common values, but can be customized)
   */
  listItem: string
  /**
   * Child nodes of this list - either portable text list items, or another, deeper list
   */
  children: (PortableTextListItemBlock | ToolkitPortableTextDirectList)[]
}

/**
 * Toolkit-specific type representing a nested list in HTML mode, where deeper lists are nested
 * inside of the _list items_, eg `<ul><li>Some text<ul><li>Deeper</li></ul></li></ul>`
 */
export declare interface ToolkitPortableTextHtmlList {
  /**
   * Type name, prefixed with `@` to signal that this is a toolkit-specific node.
   */
  _type: '@list'
  /**
   * Unique key for this list (within its parent)
   */
  _key: string
  /**
   * List mode, signaling that list nodes will appear as children of the _list items_
   */
  mode: 'html'
  /**
   * Level/depth of this list node (starts at `1`)
   */
  level: number
  /**
   * Style of this list item (`bullet`, `number` are common values, but can be customized)
   */
  listItem: string
  /**
   * Child nodes of this list - toolkit-specific list items which can themselves hold deeper lists
   */
  children: ToolkitPortableTextListItem[]
}

/**
 * Toolkit-specific type representing a nested list
 *
 * See the `nestLists()` function for more info
 */
export declare type ToolkitPortableTextList =
  | ToolkitPortableTextHtmlList
  | ToolkitPortableTextDirectList

/**
 * Toolkit-specific type representing a list item block, but where the children can be another list
 */
export declare interface ToolkitPortableTextListItem
  extends PortableTextListItemBlock<
    PortableTextMarkDefinition,
    PortableTextSpan | ToolkitPortableTextList
  > {}

/**
 * Toolkit-specific type representing a text node, used when nesting spans.
 *
 * See the {@link buildMarksTree | `buildMarksTree()` function}
 */
export declare interface ToolkitTextNode {
  /**
   * Type name, prefixed with `@` to signal that this is a toolkit-specific node.
   */
  _type: '@text'
  /**
   * The actual string value of the text node
   */
  text: string
}

/**
 * Takes a Portable Text block (or an array of them) and returns the text value
 * of all the Portable Text span nodes. Adds whitespace when encountering inline,
 * non-span nodes to ensure text flow is optimal.
 *
 * Note that this only accounts for regular Portable Text blocks - any text inside
 * custom content types are not included in the output.
 *
 * @param block - Single block or an array of blocks to extract text from
 * @returns The plain-text content of the blocks
 */
export declare function toPlainText(
  block: PortableTextBlock | ArbitraryTypedObject[] | PortableTextBlock[]
): string

export {}
