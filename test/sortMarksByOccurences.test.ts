import type {PortableTextBlock} from '@portabletext/types'

import {sortMarksByOccurences} from '@portabletext/toolkit'
import {expect, test} from 'vitest'

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
