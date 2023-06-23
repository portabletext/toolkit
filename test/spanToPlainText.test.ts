import {expect, test} from 'vitest'
import {spanToPlainText} from '../src'

test('spanToPlainText: converts single-span correctly', () => {
  expect(
    spanToPlainText({
      _type: '@span',
      _key: 'a',
      children: [{_type: '@text', text: 'Just a plain text thing'}],
      markType: 'em',
    })
  ).toEqual('Just a plain text thing')
})

test('spanToPlainText: converts nested spans correctly', () => {
  expect(
    spanToPlainText({
      _type: '@span',
      children: [
        {_type: '@text', text: 'Just a '},
        {
          _type: '@span',
          markType: 'strong',
          children: [
            {_type: '@text', text: 'very'},
            {_type: '@span', markType: 'code', children: [{_type: '@text', text: ' nested'}]},
            {_type: '@text', text: ' span'},
          ],
        },
        {_type: '@text', text: ' of marks.'},
      ],
      markType: 'em',
    })
  ).toEqual('Just a very nested span of marks.')
})
