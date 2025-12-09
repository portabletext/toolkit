import {expect, test} from 'vitest'

import {
  isPortableTextBlock,
  isPortableTextListItemBlock,
  isPortableTextSpan,
  isPortableTextToolkitList,
  isPortableTextToolkitSpan,
  isPortableTextToolkitTextNode,
} from '@portabletext/toolkit'

test('isPortableTextBlock: all possible non-list properties', () => {
  expect(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
    }),
    '`true` if all possible non-list properties are present',
  ).toBe(true)
})

test('isPortableTextBlock: all possible list properties', () => {
  expect(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 'bullet',
      level: 1,
    }),
    '`true` if all possible list properties are present',
  ).toBe(true)
})

test('isPortableTextBlock: absolute minimum properties', () => {
  expect(
    isPortableTextBlock({
      _type: 'any-type',
      children: [],
    }),
    '`true` on stripped to the bone block',
  ).toBe(true)
})

test('isPortableTextBlock: minimum properties (with span)', () => {
  expect(
    isPortableTextBlock({
      _type: 'any-type',
      children: [{_type: 'span', text: 'Portable Text'}],
    }),
    '`true` on single span child',
  ).toBe(true)
})

test('isPortableTextBlock: minimum properties (non-span child)', () => {
  expect(
    isPortableTextBlock({
      _type: 'any-type',
      children: [{_type: 'other', arb: 'itrary'}],
    }),
    '`true` on single non-span child',
  ).toBe(true)
})

test('isPortableTextBlock: false on markDefs without a `_key`', () => {
  expect(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_type: 'link', href: 'https://portabletext.org/'} as any],
    }),
    '`false` on mark def with no `_type`',
  ).toBe(false)
})

test('isPortableTextBlock: false on non-string `_type`', () => {
  expect(
    isPortableTextBlock({
      _type: 123 as any,
      children: [],
    }),
    '`false` on non-string `_type`',
  ).toBe(false)
})

test('isPortableTextBlock: false on non-array `markDefs`', () => {
  expect(
    isPortableTextBlock({
      _type: 'block',
      children: [],
      markDefs: 123 as any,
    }),
    '`false` on non-array `markDefs`',
  ).toBe(false)
})

test('isPortableTextBlock: false on missing `children`', () => {
  expect(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
    }),
    '`false` on missing `children`',
  ).toBe(false)
})

test('isPortableTextBlock: false on `children` without `_type`', () => {
  expect(
    isPortableTextBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{yep: ''} as any],
    }),
    '`false` on children missing `_type`',
  ).toBe(false)
})

test('isPortableTextListItemBlock: true on all properties present', () => {
  expect(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      level: 3,
      listItem: 'bullet',
    }),
    '`true` if all list properties are present',
  ).toBe(true)
})

test('isPortableTextListItemBlock: true on `level` missing', () => {
  expect(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 'bullet',
    }),
    '`true` if all block properties + listItem are present',
  ).toBe(true)
})

test('isPortableTextListItemBlock: false on `level` of incorrect type', () => {
  expect(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 'bullet',
      level: 'nope' as any,
    }),
    '`false` if `level` is not a number',
  ).toBe(false)
})

test('isPortableTextListItemBlock: false on `listItem` of incorrect type', () => {
  expect(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
      listItem: 13 as any,
    }),
    '`false` if `listItem` is not a string',
  ).toBe(false)
})

test('isPortableTextListItemBlock: false if no `listItem`', () => {
  expect(
    isPortableTextListItemBlock({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text', marks: ['l']}],
      markDefs: [{_key: 'l', _type: 'link', href: 'https://portabletext.org/'}],
    }),
    '`false` if `listItem` is missing',
  ).toBe(false)
})

test('isPortableTextSpan: true on all valid span properties', () => {
  expect(
    isPortableTextSpan({
      _type: 'span',
      _key: 'a',
      text: 'Portable Text',
      marks: ['l'],
    }),
    '`true` if all properties are present',
  ).toBe(true)
})

test('isPortableTextSpan: true on all required span properties', () => {
  expect(
    isPortableTextSpan({
      _type: 'span',
      text: 'Portable Text',
    }),
    '`true` if all required properties are present',
  ).toBe(true)
})

test('isPortableTextSpan: false on non-`span` type', () => {
  expect(
    isPortableTextSpan({
      _type: 'nonSpan',
      text: 'Portable Text',
    }),
    '`false` if `_type` is not `span`',
  ).toBe(false)
})

test('isPortableTextSpan: false on missing `text`', () => {
  expect(
    isPortableTextSpan({
      _type: 'span',
      foo: 'bar',
    }),
    '`false` if `text` is missing',
  ).toBe(false)
})

test('isPortableTextSpan: false on non-string `text`', () => {
  expect(
    isPortableTextSpan({
      _type: 'span',
      text: 123,
    }),
    '`false` if `text` is not a string',
  ).toBe(false)
})

test('isPortableTextSpan: false on non-array `marks`', () => {
  expect(
    isPortableTextSpan({
      _type: 'span',
      text: 'yes',
      marks: 'also yes',
    }),
    '`false` if `marks` is not an array',
  ).toBe(false)
})

test('isPortableTextSpan: false on non-string `marks` item', () => {
  expect(
    isPortableTextSpan({
      _type: 'span',
      text: 'yes',
      marks: ['yep', 123],
    }),
    '`false` if `marks` contains non-strings',
  ).toBe(false)
})

/**
 * WEAK ASSERTERS FOLLOWS - THESE ARE NOT THOROUGH, ONLY SURFACE-LEVEL
 */
test('isPortableTextToolkitList: true on correct _type', () => {
  expect(isPortableTextToolkitList({_type: '@list'}), '`true` if `_type` is `@list`').toBe(true)
})

test('isPortableTextToolkitList: false on incorrect _type', () => {
  expect(isPortableTextToolkitList({_type: 'list'}), '`false` if `_type` is not `@list`').toBe(
    false,
  )
})

test('isPortableTextToolkitSpan: true on correct _type', () => {
  expect(isPortableTextToolkitSpan({_type: '@span'}), '`true` if `_type` is `@span`').toBe(true)
})

test('isPortableTextToolkitSpan: false on incorrect _type', () => {
  expect(isPortableTextToolkitSpan({_type: 'span'}), '`false` if `_type` is not `@span`').toBe(
    false,
  )
})

test('isPortableTextToolkitTextNode: true on correct _type', () => {
  expect(isPortableTextToolkitTextNode({_type: '@text'}), '`true` if `_type` is `@text`').toBe(true)
})

test('isPortableTextToolkitTextNode: false on incorrect _type', () => {
  expect(isPortableTextToolkitTextNode({_type: 'text'}), '`false` if `_type` is not `@text`').toBe(
    false,
  )
})
