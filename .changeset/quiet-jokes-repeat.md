---
'@portabletext/toolkit': major
---

`nestLists()` now nests every list as deeply as its `level` says it is

List items can start at a level deeper than 1, and can skip any number of levels at a time.
`nestLists()` previously ignored both, so a level 3 item could end up as a list nested only one
level deep, and items that later returned to a shallower level could fail to rejoin the list they
belonged to and be emitted as a separate sibling list instead.

The levels that were never authored are now generated, so nesting depth always matches `level`.
A generated list holds an empty list item in `html` mode, since HTML can only nest a list inside a
list item, and holds nothing but the deeper list in `direct` mode.

This changes the output of `nestLists()` for any input where a list starts deeper than level 1 or
skips a level, and therefore changes the rendered output of anything built on it.
