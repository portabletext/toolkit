import type {PortableTextListItemBlock} from '@portabletext/types'

function listItem(
  text: string,
  level: number,
  listItemStyle = 'bullet',
): PortableTextListItemBlock {
  return {
    _type: 'block',
    _key: text.toLowerCase().replaceAll(' ', '-'),
    children: [{_type: 'span', text}],
    level,
    listItem: listItemStyle,
  }
}

export const listNestingFixtures = [
  {
    name: 'initial level',
    blocks: [listItem('Level 3', 3), listItem('Level 1', 1)],
  },
  {
    name: 'skipped level while nesting',
    blocks: [listItem('Level 1', 1), listItem('Level 3', 3), listItem('Level 1 again', 1)],
  },
  {
    // Goes back up to a level that has no matching ancestor, so a new branch has to be started
    name: 'shallower level without a matching ancestor',
    blocks: [
      listItem('Level 1', 1),
      listItem('Level 3 number', 3, 'number'),
      listItem('Level 2', 2),
    ],
  },
  {
    // Same level as the current list, but neither it nor any ancestor uses the incoming style
    name: 'same level without a matching list style',
    blocks: [
      listItem('Level 1', 1),
      listItem('Level 2 number', 2, 'number'),
      listItem('Level 2', 2),
    ],
  },
  {
    name: 'skipped levels with a changed list style',
    blocks: [
      listItem('Level 3 bullet', 3),
      listItem('Level 1', 1),
      listItem('Level 5 bullet', 5),
      listItem('Level 2 bullet', 2),
      listItem('Level 5 number', 5, 'number'),
      listItem('Level 1 number', 1, 'number'),
    ],
  },
]
