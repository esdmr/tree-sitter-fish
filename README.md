@esdmr/tree-sitter-fish
================

Fork of [ram02z/tree-sitter-fish](https://github.com/ram02z/tree-sitter-fish), but only the Wasm output, built via GitHub actions.

```js
import Parser from 'web-tree-sitter';
import tsWasm from 'web-tree-sitter/tree-sitter.wasm?url';
import tsFishWasm from '@esdmr/tree-sitter-fish?url';

await Parser.init({
    locateFile() {
        return tsWasm;
    },
});
const fish = await Parser.Language.load(tsFishWasm);
```
