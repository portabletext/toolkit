import tap from 'tap'
import {toPlainText} from '../src'

tap.test('toPlainText: converts single-block, single-span with no formatting correctly', (t) => {
  t.equal(
    toPlainText({
      _type: 'block',
      _key: 'a',
      style: 'normal',
      children: [{_type: 'span', _key: 's', text: 'Portable Text'}],
      markDefs: [],
    }),
    'Portable Text'
  )
  t.end()
})

tap.test('toPlainText: converts single-block, multi-span with no formatting correctly', (t) => {
  t.equal(
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
    'Portable Text'
  )
  t.end()
})

tap.test('toPlainText: converts single-block, multi-span with formatting correctly', (t) => {
  t.equal(
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
    'Portable Text!'
  )
  t.end()
})

tap.test('toPlainText: converts multi-block, multi-span with formatting correctly', (t) => {
  t.equal(
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
    'Portable Text!\n\nUse it!'
  )
  t.end()
})

tap.test('toPlainText: ignores non-blocks, non-spans', (t) => {
  t.equal(
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
    'Ignore the image.\n\n...and the map!'
  )
  t.end()
})

tap.test('toPlainText: does not add unnecessary whitespace on non-spans', (t) => {
  t.equal(
    toPlainText({
      _type: 'block',
      children: [
        {_type: 'span', text: 'Ignore'},
        {_type: 'image', src: '/some/image.png'},
        {_type: 'span', text: ' the image.'},
      ],
    }),
    'Ignore the image.'
  )
  t.end()
})

tap.test('toPlainText: adds whitespace on span-hugging non-spans', (t) => {
  t.equal(
    toPlainText({
      _type: 'block',
      children: [
        {_type: 'span', text: 'Ignore'},
        {_type: 'image', src: '/some/image.png'},
        {_type: 'span', text: 'the image.'},
      ],
    }),
    'Ignore the image.'
  )
  t.end()
})

tap.test('toPlainText: does not add leading whitespace on span-hugging non-span', (t) => {
  t.equal(
    toPlainText({
      _type: 'block',
      children: [
        {_type: 'image', src: '/some/image.png'},
        {_type: 'span', text: 'Now that is an image.'},
      ],
    }),
    'Now that is an image.'
  )
  t.end()
})
