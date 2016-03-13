#!/usr/bin/env node

var program = require('commander');
var package = require('../package.json');
var Docky = require('../index.js');

require('colors');

program
  .version(package.version, '-v, --version')
  .usage('<file> [options]')
  .arguments('<file>')
  .option('-r, --readme <readme>', 'Specify a README file to accompany the js file')
  .action(function (file, options) {
    Docky(file, options);
  })
  .parse(process.argv);

if (!program.args.length) {
  console.log('You must specify at least one file to run docky.'.red);
  program.help();
  process.exit(1);
}
