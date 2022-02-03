import tap from 'tap'
import {spanToPlainText} from '../src'

tap.test('spanToPlainText: converts single-span correctly', (t) => {
  t.equal(
    spanToPlainText({
      _type: '@span',
      _key: 'a',
      children: [{_type: '@text', text: 'Just a plain text thing'}],
      markType: 'em',
    }),
    'Just a plain text thing'
  )
  t.end()
})

tap.test('spanToPlainText: converts nested spans correctly', (t) => {
  t.equal(
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
    }),
    'Just a very nested span of marks.'
  )
  t.end()
})
