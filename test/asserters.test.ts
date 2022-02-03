import tap from 'tap'
import {
  isPortableTextBlock,
  isPortableTextListItemBlock,
  isPortableTextSpan,
  isPortableTextToolkitList,
  isPortableTextToolkitSpan,
  isPortableTextToolkitTextNode,
} from '../src'

tap.test('isPortableTextBlock: all possible non-list properties', (t) => {
  t.ok(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
    }),
    '`true` if all possible non-list properties are present'
  )
  t.end()
})

tap.test('isPortableTextBlock: all possible list properties', (t) => {
  t.ok(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 'bullet',
      level: 1,
    }),
    '`true` if all possible list properties are present'
  )
  t.end()
})

tap.test('isPortableTextBlock: absolute minimum properties', (t) => {
  t.ok(
    isPortableTextBlock({
      _type: 'any-type',
      children: [],
    }),
    '`true` on stripped to the bone block'
  )
  t.end()
})

tap.test('isPortableTextBlock: minimum properties (with span)', (t) => {
  t.ok(
    isPortableTextBlock({
      _type: 'any-type',
      children: [{_type: 'span', text: 'Portable Text'}],
    }),
    '`true` on single span child'
  )
  t.end()
})

tap.test('isPortableTextBlock: minimum properties (non-span child)', (t) => {
  t.ok(
    isPortableTextBlock({
      _type: 'any-type',
      children: [{_type: 'other', arb: 'itrary'}],
    }),
    '`true` on single non-span child'
  )
  t.end()
})

tap.test('isPortableTextBlock: false on markDefs without a `_key`', (t) => {
  t.notOk(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_type: 'link', href: 'https://portabletext.org/'} as any],
    }),
    '`false` on mark def with no `_type`'
  )
  t.end()
})

tap.test('isPortableTextBlock: false on non-string `_type`', (t) => {
  t.notOk(
    isPortableTextBlock({
      _type: 123 as any,
      children: [],
    }),
    '`false` on non-string `_type`'
  )
  t.end()
})

tap.test('isPortableTextBlock: false on non-array `markDefs`', (t) => {
  t.notOk(
    isPortableTextBlock({
      _type: 'block',
      children: [],
      markDefs: 123 as any,
    }),
    '`false` on non-array `markDefs`'
  )
  t.end()
})

tap.test('isPortableTextBlock: false on missing `children`', (t) => {
  t.notOk(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
    }),
    '`false` on missing `children`'
  )
  t.end()
})

tap.test('isPortableTextBlock: false on `children` without `_type`', (t) => {
  t.notOk(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{yep: ''} as any],
    }),
    '`false` on children missing `_type`'
  )
  t.end()
})

tap.test('isPortableTextListItemBlock: true on all properties present', (t) => {
  t.ok(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      level: 3,
      listItem: 'bullet',
    }),
    '`true` if all list properties are present'
  )
  t.end()
})

tap.test('isPortableTextListItemBlock: true on `level` missing', (t) => {
  t.ok(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 'bullet',
    }),
    '`true` if all block properties + listItem are present'
  )
  t.end()
})

tap.test('isPortableTextListItemBlock: false on `level` of incorrect type', (t) => {
  t.notOk(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 'bullet',
      level: 'nope' as any,
    }),
    '`false` if `level` is not a number'
  )
  t.end()
})

tap.test('isPortableTextListItemBlock: false on `listItem` of incorrect type', (t) => {
  t.notOk(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 13 as any,
    }),
    '`false` if `listItem` is not a string'
  )
  t.end()
})

tap.test('isPortableTextListItemBlock: false if no `listItem`', (t) => {
  t.notOk(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
    }),
    '`false` if `listItem` is missing'
  )
  t.end()
})

tap.test('isPortableTextSpan: true on all valid span properties', (t) => {
  t.ok(
    isPortableTextSpan({
      _type: 'span',
      _key: 'a',
      text: 'Portable Text',
      marks: ['l'],
    }),
    '`true` if all properties are present'
  )
  t.end()
})

tap.test('isPortableTextSpan: true on all required span properties', (t) => {
  t.ok(
    isPortableTextSpan({
      _type: 'span',
      text: 'Portable Text',
    }),
    '`true` if all required properties are present'
  )
  t.end()
})

tap.test('isPortableTextSpan: false on non-`span` type', (t) => {
  t.notOk(
    isPortableTextSpan({
      _type: 'nonSpan',
      text: 'Portable Text',
    }),
    '`false` if `_type` is not `span`'
  )
  t.end()
})

tap.test('isPortableTextSpan: false on missing `text`', (t) => {
  t.notOk(
    isPortableTextSpan({
      _type: 'span',
      foo: 'bar',
    }),
    '`false` if `text` is missing'
  )
  t.end()
})

tap.test('isPortableTextSpan: false on non-string `text`', (t) => {
  t.notOk(
    isPortableTextSpan({
      _type: 'span',
      text: 123,
    }),
    '`false` if `text` is not a string'
  )
  t.end()
})

tap.test('isPortableTextSpan: false on non-array `marks`', (t) => {
  t.notOk(
    isPortableTextSpan({
      _type: 'span',
      text: 'yes',
      marks: 'also yes',
    }),
    '`false` if `marks` is not an array'
  )
  t.end()
})

tap.test('isPortableTextSpan: false on non-string `marks` item', (t) => {
  t.notOk(
    isPortableTextSpan({
      _type: 'span',
      text: 'yes',
      marks: ['yep', 123],
    }),
    '`false` if `marks` contains non-strings'
  )
  t.end()
})

/**
 * WEAK ASSERTERS FOLLOWS - THESE ARE NOT THOROUGH, ONLY SURFACE-LEVEL
 */
tap.test('isPortableTextToolkitList: true on correct _type', (t) => {
  t.ok(isPortableTextToolkitList({_type: '@list'}), '`true` if `_type` is `@list`')
  t.end()
})

tap.test('isPortableTextToolkitList: false on incorrect _type', (t) => {
  t.notOk(isPortableTextToolkitList({_type: 'list'}), '`false` if `_type` is not `@list`')
  t.end()
})

tap.test('isPortableTextToolkitSpan: true on correct _type', (t) => {
  t.ok(isPortableTextToolkitSpan({_type: '@span'}), '`true` if `_type` is `@span`')
  t.end()
})

tap.test('isPortableTextToolkitSpan: false on incorrect _type', (t) => {
  t.notOk(isPortableTextToolkitSpan({_type: 'span'}), '`false` if `_type` is not `@span`')
  t.end()
})

tap.test('isPortableTextToolkitTextNode: true on correct _type', (t) => {
  t.ok(isPortableTextToolkitTextNode({_type: '@text'}), '`true` if `_type` is `@text`')
  t.end()
})

tap.test('isPortableTextToolkitTextNode: false on incorrect _type', (t) => {
  t.notOk(isPortableTextToolkitTextNode({_type: 'text'}), '`false` if `_type` is not `@text`')
  t.end()
})
