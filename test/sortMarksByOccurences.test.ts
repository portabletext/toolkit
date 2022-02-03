import type {PortableTextBlock} from '@portabletext/types'
import tap from 'tap'
import {sortMarksByOccurences} from '../src'

tap.test('sortMarksByOccurences: sorts correctly', (t) => {
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

  t.same(block.children.map(sortMarksByOccurences), [
    [],
    [],
    ['strong'],
    ['strong', 's0m3l1nk'],
    ['strong'],
  ])
  t.end()
})

tap.test('sortMarksByOccurences: sorts correctly on tied decorator usage', (t) => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'Some ', marks: ['em', 'strong']},
      {_type: 'span', text: 'marks ', marks: ['strong', 'em']},
      {_type: 'span', text: 'might be tied.', marks: []},
    ],
  }

  t.same(block.children.map(sortMarksByOccurences), [['strong', 'em'], ['strong', 'em'], []])
  t.end()
})

tap.test('sortMarksByOccurences: sorts correctly on tied decorator usage with annotations', (t) => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'Some ', marks: ['em', 'a', 'strong', 'b']},
      {_type: 'span', text: 'marks ', marks: ['b', 'strong', 'em', 'a']},
      {_type: 'span', text: 'might be tied.', marks: []},
    ],
  }

  t.same(block.children.map(sortMarksByOccurences), [
    ['a', 'b', 'strong', 'em'],
    ['a', 'b', 'strong', 'em'],
    [],
  ])
  t.end()
})

tap.test('sortMarksByOccurences: returns empty array on invalid marks', (t) => {
  const block: PortableTextBlock = {
    _type: 'block',
    children: [
      {_type: 'span', text: 'Some ', marks: ['em', 'a', undefined, '', 'b', true]},
      {_type: 'span', text: 'marks ', marks: ['b', '', 'em', 'a', false]},
      {_type: 'span', text: 'might be tied.', marks: [null]},
    ],
  }

  t.same(block.children.map(sortMarksByOccurences), [[], [], []])
  t.end()
})
