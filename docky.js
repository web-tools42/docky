const package = require('./package.json');
const parse = require('comment-parser');
const _ = require('lodash');
const fs = require('fs');
const jade = require('jade');
const extractor = require('./parser.js');
const cwd = process.cwd();
const colors = require('colors');

/**
 * Checks if a file exists and is not a directory
 * @method fileExists
 * @param  {String} file
 * @param  {Function} cb - callback
 */
function fileExists(file, cb) {
  if (typeof file !== 'string') {
    throw new Error('File argument should be a string');
  }

  return fs.stat(`${cwd}/${file}`, (err, stat) => {
    if (err) throw err;

    if (stat.isDirectory()) {
      console.error(`'${file}' is a directory. Please specify a file.`.red);
      process.exit(1);
    }

    if (cb) cb(null, true);
  });
}

module.exports = function (file, options) {

  var hasReadme;
  var readme;

  if (options.readme) {
    fileExists(options.readme, function (err, exists) {
      hasReadme = true;
      readme = fs.readFileSync(`${cwd}/${options.readme}`, 'utf8');
    });
  }

  fileExists(file, (err, exists) => {
    console.log(`[Docky v${package.version}] Processing "${file}"...`.green);

    parse.file(file, (err, source) => {
      if (err) throw err;
      source = extractor.getMethodNames(source);
      source = extractor.getParameters(source);
      source = extractor.getExamples(source);

      var data = {
        package,
        helpers: source,
        pretty: true,
        markdown: require('marked'),
      };

      if (hasReadme) {
        data.readme = readme;
      }

      jade.renderFile(__dirname + '/docs/index.jade', data, (err, html) => {
        if (err) throw err;

        fs.writeFile(`${cwd}/docs/jade.html`, html, 'utf8', err => {
          if (err) throw err;
          console.log('\u2713'.green, 'Docs successfully compiled');
          console.log('Type \'open docs/jade.html\' to view them');
        });
      });
    });
  });
};
