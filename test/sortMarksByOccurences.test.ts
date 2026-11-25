import {sortMarksByOccurences} from '@portabletext/toolkit'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {expect, test} from 'vitest'

import {sortMarksOfChildren} from '../src/sortMarksByOccurences'

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

test('sortMarksOfChildren: matches sortMarksByOccurences for every span', () => {
  const variants: ArbitraryTypedObject[] = [
    {_type: 'span', text: 'a', marks: ['em', 'strong']},
    {_type: 'span', text: 'b', marks: ['strong', 'link']},
    {_type: 'span', text: 'c', marks: ['link', 'em', 'em', 'b']},
    {_type: 'span', text: 'd', marks: ['__proto__', 'constructor', 'strong']},
    {_type: 'span', text: 'e', marks: []},
    {_type: 'span', text: 'f'},
    {_type: 'span', text: 'g', marks: ['strong', false]},
    {_type: 'image', marks: ['strong']},
  ]

  for (const first of variants) {
    for (const second of variants) {
      for (const third of variants) {
        const children = [first, second, third, first, second]
        expect(sortMarksOfChildren(children)).toEqual(children.map(sortMarksByOccurences))
      }
    }
  }

  // A hole in the children ends a run of shared marks
  const sparse: ArbitraryTypedObject[] = [{_type: 'span', text: 'a', marks: ['link', 'strong']}]
  sparse[2] = {_type: 'span', text: 'b', marks: ['strong']}
  sparse[3] = {_type: 'span', text: 'c', marks: ['strong']}
  expect(sortMarksOfChildren(sparse)[0]).toEqual(['link', 'strong'])
  expect(sortMarksOfChildren(sparse)[0]).toEqual(sortMarksByOccurences(sparse[0]!, 0, sparse))
})
