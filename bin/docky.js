#!/usr/bin/env node

const Docky = require('../index.js');

const options = {
  watch: false,
  noreadme: false
};

const flags = {
  watch: ['-w', '--watch'],
  noreadme: ['--no-readme']
};

if (process.argv.length < 3) {
  console.error('\nNo file(s) specified.\n'.red);
  process.exit(1);
}

const args = process.argv.slice(2);

const files =
  Object.keys(flags)
    .map(flag => (
      args.map(arg => {
        if (flags[flag].indexOf(arg) > -1) {
          options[flag] = true;
          return null;
        }

        return arg;
      }).filter(x => x)
  ))[0];

if (!files || !files.length) {
  console.error('\nNo file(s) specified.\n'.red);
  process.exit(1);
}

Docky(files, options);
