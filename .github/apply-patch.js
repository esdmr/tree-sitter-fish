#!/usr/bin/env node
const assert = require('node:assert');
const fs = require('node:fs');
const process = require('node:process');
const path = require('node:path');
const pkg = require('../package.json');

process.chdir(path.join(__dirname, '..'));

fs.rmSync('binding.gyp', {force: true});

const newTsconfig = fs.readFileSync('tsconfig.json', 'utf8').replaceAll('nodenext', 'node');
fs.writeFileSync('tsconfig.json', newTsconfig, 'utf8');

const upstreamVersionMatch = pkg.version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\d+))?/);
assert.ok(upstreamVersionMatch);

const downstreamVersionMatch = process.env.LAST_TAG?.match(/^v(\d+)\.(\d+)\.(\d+)(?:-(\d+))?/);
assert.ok(downstreamVersionMatch);

let newVersion;

if (
	+upstreamVersionMatch[1] !== +downstreamVersionMatch[1] ||
	+upstreamVersionMatch[2] !== +downstreamVersionMatch[2] ||
	+upstreamVersionMatch[3] - (upstreamVersionMatch[4] ? 1 : 0) !==
		+downstreamVersionMatch[3] - (downstreamVersionMatch[4] ? 1 : 0)
) {
	// This commit bumped the package.json version.
	newVersion = pkg.version;
} else {
	newVersion =
		upstreamVersionMatch[1] + '.' +
		upstreamVersionMatch[2] + '.' +
		(+upstreamVersionMatch[3] + 1) + '-' +
		(downstreamVersionMatch[4] ? +downstreamVersionMatch[4] + 1 : '1');
}

assert.ok(process.env.CURRENT_COMMIT);
const newTag = 'v' + newVersion + '+' + process.env.CURRENT_COMMIT.slice(0, 7);
fs.writeFileSync('.github/LAST_TAG', newTag, 'utf8');
fs.writeFileSync('.github/LAST_UPSTREAM_COMMIT', process.env.CURRENT_COMMIT, 'utf8');

const newPkg = {
	...pkg,
	name: '@esdmr/tree-sitter-fish',
	version: newVersion,
	repository: {
		type: 'git',
		url: 'git+https://github.com/esdmr/tree-sitter-fish.git',
	},
	homepage: 'https://github.com/esdmr/tree-sitter-fish#readme',
	bugs: {
		url: 'https://github.com/esdmr/tree-sitter-fish/issues',
	},
	main: 'tree-sitter-fish.wasm',
	exports: {
		'.': './tree-sitter-fish.wasm',
		'./tree-sitter-fish.wasm': './tree-sitter-fish.wasm',
		'./package.json': './package.json',
	},
	files: ['tree-sitter-fish.wasm'],
	scripts: {
		build: 'tsc -p tsconfig.json && tree-sitter generate --no-bindings',
		'build:wasm': 'npm run build && tree-sitter build-wasm',
		start: 'npm run build:wasm',
	},
	dependencies: undefined,
	peerDependencies: undefined,
	peerDependenciesMeta: undefined,
};

fs.writeFileSync('package.json', JSON.stringify(newPkg, null, 2), 'utf8');

if (process.env.GITHUB_OUTPUT) {
	fs.appendFileSync(process.env.GITHUB_OUTPUT, `upstream_version=${pkg.version}\n`);
	fs.appendFileSync(process.env.GITHUB_OUTPUT, `next_tag=${newTag}\n`);
	fs.appendFileSync(process.env.GITHUB_OUTPUT, `prerelease=${newTag.includes('-')}\n`);
}
