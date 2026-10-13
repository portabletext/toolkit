---
"@portabletext/toolkit": patch
---

Remove quadratic mark-tree preprocessing and reduce list traversal overhead.
Avoid recursive list traversal stack overflows on deeply nested lists, and sort
`__proto__` marks by their actual adjacent occurrence counts. Preserve primitive
input handling in list guards and avoid unnecessary allocations for small blocks.

Annotation indexing trades an upfront O(markDefs) cost for faster repeated
lookups; blocks with many definitions and few marked spans can be substantially
slower. The additional preprocessing paths also increase bundle size.
