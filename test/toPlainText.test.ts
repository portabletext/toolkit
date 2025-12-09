import {toPlainText} from '@portabletext/toolkit'
import {expect, test} from 'vitest'

test('toPlainText: converts single-block, single-span with no formatting correctly', () => {
  expect(
    toPlainText({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text'}],
      markDefs: [],
    }),
  ).toEqual('Portable Text')
})

test('toPlainText: converts single-block, multi-span with no formatting correctly', () => {
  expect(
    toPlainText({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [
        {_type: 'span', _key: 'a', text: 'Portable '},
        {_type: 'span', _key: 'z', text: 'Text'},
      ],
      markDefs: [],
    }),
  ).toEqual('Portable Text')
})

test('toPlainText: converts single-block, multi-span with formatting correctly', () => {
  expect(
    toPlainText({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [
        {_type: 'span', _key: 'a', text: 'Portable', marks: ['em']},
        {_type: 'span', _key: 'z', text: ' Text!'},
      ],
      markDefs: [],
    }),
  ).toEqual('Portable Text!')
})

test('toPlainText: converts multi-block, multi-span with formatting correctly', () => {
  expect(
    toPlainText([
      {
        _type: 'block',
        _key: 'a',
        style: 'normal',
        children: [
          {_type: 'span', _key: 'a', text: 'Portable', marks: ['link']},
          {_type: 'span', _key: 'z', text: ' Text!', marks: ['link']},
        ],
        markDefs: [{_key: 'link', _type: 'link', href: 'https://portabletext.org'}],
      },
      {
        _type: 'block',
        _key: 'b',
        style: 'normal',
        children: [{_type: 'span', _key: 'a', text: 'Use it!', marks: []}],
      },
    ]),
  ).toEqual('Portable Text!\n\nUse it!')
})

test('toPlainText: ignores non-blocks, non-spans', () => {
  expect(
    toPlainText([
      {
        _type: 'block',
        _key: 'a',
        style: 'normal',
        children: [
          {_type: 'span', _key: 'a', text: 'Ignore'},
          {_type: 'image', _key: 'h', src: '/some/image.png'},
          {_type: 'span', _key: 'z', text: ' the image.'},
        ],
        markDefs: [],
      },
      {
        _type: 'map',
        lat: 59,
        lng: 13,
      },
      {
        _type: 'block',
        _key: 'b',
        style: 'normal',
        children: [{_type: 'span', _key: 'a', text: '...and the map!', marks: []}],
      },
    ]),
  ).toEqual('Ignore the image.\n\n...and the map!')
})

test('toPlainText: does not add unnecessary whitespace on non-spans', () => {
  expect(
    toPlainText({
      _type: 'block',
      children: [
        {_type: 'span', text: 'Ignore'},
        {_type: 'image', src: '/some/image.png'},
        {_type: 'span', text: ' the image.'},
      ],
    }),
    'Ignore the image.',
  )
})

test('toPlainText: adds whitespace on span-hugging non-spans', () => {
  expect(
    toPlainText({
      _type: 'block',
      children: [
        {_type: 'span', text: 'Ignore'},
        {_type: 'image', src: '/some/image.png'},
        {_type: 'span', text: 'the image.'},
      ],
    }),
  ).toEqual('Ignore the image.')
})

test('toPlainText: does not add leading whitespace on span-hugging non-span', () => {
  expect(
    toPlainText({
      _type: 'block',
      children: [
        {_type: 'image', src: '/some/image.png'},
        {_type: 'span', text: 'Now that is an image.'},
      ],
    }),
  ).toEqual('Now that is an image.')
})

test('toPlainText: does not add leading whitespace on span-hugging non-span (trailing)', () => {
  expect(
    toPlainText({
      _type: 'block',
      children: [
        {_type: 'span', text: 'Now that is a '},
        {_type: 'image', src: '/some/image.png'},
        {_type: 'span', text: 'beautiful image.'},
      ],
    }),
  ).toEqual('Now that is a beautiful image.')
})
