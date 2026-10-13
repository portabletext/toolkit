import {sortMarksByOccurences} from '@portabletext/toolkit'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {expect, test} from 'vitest'

import {sortBlockMarks} from '../src/sortMarksByOccurences'

test('sortMarksByOccurences: sorts correctly', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'This block '},
      {_type: 'span', text: '', marks: []},
      {_type: 'span', text: 'contains', marks: ['strong']},
      {_type: 'span', text: 'a link', marks: ['s0m3l1nk', 'strong']},
      {_type: 'span', text: ' and some bolded text', marks: ['strong']},
    ],
  }

  expect(block.children.map(sortMarksByOccurences)).toEqual([
    [],
    [],
    ['strong'],
    ['strong', 's0m3l1nk'],
    ['strong'],
  ])
})

test('sortMarksByOccurences: sorts correctly on tied decorator usage', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'Some ', marks: ['em', 'strong']},
      {_type: 'span', text: 'marks ', marks: ['strong', 'em']},
      {_type: 'span', text: 'might be tied.', marks: []},
    ],
  }

  expect(block.children.map(sortMarksByOccurences)).toEqual([
    ['strong', 'em'],
    ['strong', 'em'],
    [],
  ])
})

test('sortMarksByOccurences: sorts correctly on tied decorator usage with annotations', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'Some ', marks: ['em', 'a', 'strong', 'b']},
      {_type: 'span', text: 'marks ', marks: ['b', 'strong', 'em', 'a']},
      {_type: 'span', text: 'might be tied.', marks: []},
    ],
  }

  expect(block.children.map(sortMarksByOccurences)).toEqual([
    ['a', 'b', 'strong', 'em'],
    ['a', 'b', 'strong', 'em'],
    [],
  ])
})

test('sortMarksByOccurences: returns empty array on invalid marks', () => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'Some ', marks: ['em', 'a', undefined, '', 'b', true]},
      {_type: 'span', text: 'marks ', marks: ['b', '', 'em', 'a', false]},
      {_type: 'span', text: 'might be tied.', marks: [null]},
    ],
  }

  expect(block.children.map(sortMarksByOccurences)).toEqual([[], [], []])
})

test('sortMarksByOccurences: copies a single mark without inspecting siblings', () => {
  const span = {_type: 'span', text: 'Text', marks: ['strong']}
  const sibling = {
    _type: 'span',
    get text(): string {
      throw new Error('A single mark needs no occurrence counting')
    },
  }
  const marks = sortMarksByOccurences(span, 0, [span, sibling])
  expect(marks).toEqual(['strong'])
  expect(marks).not.toBe(span.marks)
})

test('sortBlockMarks: matches per-span sorting across mixed consecutive runs', () => {
  const variants: ArbitraryTypedObject[] = [
    {_type: 'span', text: 'Text', marks: ['em', 'strong']},
    {_type: 'span', text: 'Text', marks: ['strong', 'a']},
    {_type: 'span', text: 'Text', marks: ['b', 'a', 'em', 'em']},
    {_type: 'span', text: 'Text', marks: ['__proto__', 'constructor', '', 'strong']},
    {_type: 'span', text: ''},
    {_type: 'span', text: 'Text', marks: []},
    {_type: 'span', text: 'Invalid marks', marks: [false]},
    {_type: 'image', marks: ['strong']},
  ]

  for (const first of variants) {
    for (const second of variants) {
      for (const third of variants) {
        const children = [first, second, third, first]
        expect(sortBlockMarks(children).map((prepared) => prepared?.marks ?? [])).toEqual(
          children.map(sortMarksByOccurences),
        )
      }
    }
  }
})

test('sortBlockMarks: gaps interrupt runs and results do not share marks arrays', () => {
  const span = {_type: 'span', text: '', marks: ['em', 'strong']}
  const children = [span]
  children[2] = span
  const prepared = sortBlockMarks(children)
  expect(prepared[0]?.marks).toEqual(['strong', 'em'])
  expect(prepared[1]).toBeUndefined()
  expect(prepared[2]?.marks).toEqual(['strong', 'em'])
  expect(prepared[0]?.marks).not.toBe(prepared[2]?.marks)
  expect(prepared[0]?.marks).not.toBe(span.marks)
})

test('sortBlockMarks: validates each span once rather than rescanning long runs', () => {
  let validations = 0
  const children = Array.from({length: 1_000}, () => ({
    _type: 'span',
    get text() {
      validations++
      return 'Text'
    },
    marks: ['em', 'strong'],
  }))
  sortBlockMarks(children)
  expect(validations).toBe(children.length)
})
