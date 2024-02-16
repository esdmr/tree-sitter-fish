tree-sitter-fish
================

> Fork of [ram02z/tree-sitter-fish](https://github.com/ram02z/tree-sitter-fish),
> but only the Wasm output, built via GitHub actions.
>
> ```js
> import Parser from 'web-tree-sitter';
> import tsWasm from 'web-tree-sitter/tree-sitter.wasm?url';
> import tsFishWasm from '@esdmr/tree-sitter-fish?url';
>
> await Parser.init({
> 	locateFile() {
> 		return tsWasm;
> 	},
> });
> const fish = await Parser.Language.load(tsFishWasm);
> ```

Fish grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

### Development

Install the dependencies:

    npm install

Run the tests:

    npm run test

Run the build and tests in watch mode:

    npm run test:watch

Test parser against [fish-shell](https://github.com/fish-shell/fish-shell/tree/master/share) `/share` fish files:

    npm run test:examples

#### References
* [tree-sitter-bash](https://github.com/tree-sitter/tree-sitter-bash)
* [Fish Shell Introduction](https://fishshell.com/docs/current/index.html)
