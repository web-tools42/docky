const package = require('./package.json');
const parse = require('comment-parser');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const dockyPath = path.resolve(__dirname);
const jade = require('jade');
const extractor = require('./parser.js');
const cwd = process.cwd();
const colors = require('colors');
const del = require('del');
const async = require('async');
const Promise = require('promised-io/promise');
const FS = require('promised-io/fs');

/**
 * Custom debug logger
 * @method log
 */
function log() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(`[Docky v${package.version}]`.green);
  console.log.apply(console, args);
}

/**
 * Checks if a folder exists
 * @method folderExists
 * @param  {String} folder
 * @param  {Function} cb(exists) - callback where exists is a boolean
 */
function folderExists(folder) {
  try {
    return fs.statSync(`${cwd}/${folder}`).isDirectory();
  }
  catch (err) {
    return false;
  }
}

/**
 * Checks if a file exists and is not a directory
 * @method fileExists
 * @param  {String} file
 * @param  {Function} cb - callback
 */
function fileExists(file) {
  try {
    return fs.statSync(`${cwd}/${file}`).isFile();
  }
  catch (err) {
    return false;
  }
}

/**
 * Copies template assets to docs folder
 * @method copyAssets
 */
function copyAssets() {
  log('Copying documentation assets');

  return Promise.all([
    fs.copy(`${dockyPath}/template/css`, 'docs/css'),
    fs.copy(`${dockyPath}/template/images`, 'docs/images'),
    fs.copy(`${dockyPath}/template/js`, 'docs/js'),
  ]);
}

/**
 * Creates the docs folder
 * @method createDocs
 * @param {String} template
 */
function createDocs(html) {
  log('Creating Docs');

  if (folderExists(`docs`)) {
    cleanDocsFolder().then(() => {
      writeTemplateFile(html).then(() => {
        copyAssets().then(() => {
          log('\u2713'.green, 'Docs successfully generated');
          console.log('\n Type \'open docs/index.html\' to view them');
        });
      });
    });
  } else {
    log('Creating docs folder');

    fs.mkdir(`${cwd}/docs`, err => {
      if (err) throw err;

      writeTemplateFile(html).then(() => {
        copyAssets().then(() => {
          log('\u2713'.green, 'Docs successfully generated');
          console.log('\n Type \'open docs/index.html\' to view them');
        });
      });
    });
  }
}

/**
 * Writes the template file to /docs
 * @method writeTemplateFile
 */
function writeTemplateFile(html) {
  log('Writing template file');

  return FS.writeFile(`${cwd}/docs/index.html`, html, 'utf8');
}

/**
 * Cleans the docs folder
 * @method cleanDocsFolder
 * @return {Promise}
 */
function cleanDocsFolder() {
  log('Cleaning Docs folder');
  return del([`docs/*`]);
}

/**
 * docky.js
 * @param  {String} file - the file to parse
 * @param  {Object} options - additonal options
 */
module.exports = function (file, options) {

  var hasReadme;
  var readme;

  if (options.readme) {
    if (fileExists(options.readme)) {
      hasReadme = true;
      readme = fs.readFileSync(`${cwd}/${options.readme}`, 'utf8');
    } else {
      console.log('[Warning] README file not found. Continuing without it...'.red);
    }
  }

  if (!fileExists(file)) {
    console.error(`${file} does not exist. You must specify an existing file.`.red);
    process.exit(1);
  }

  log(`Processing "${file}"...`.green);

  parse.file(file, (err, source) => {
    if (err) throw err;

    source = extractor.getMethodNames(source);
    source = extractor.getParameters(source);
    source = extractor.getExamples(source);
    source = extractor.getDeprecated(source);
    source = extractor.groupMethods(source);

    var data = {
      package,
      methods: source,
      pretty: true,
      markdown: require('marked'),
      _,
    };

    if (hasReadme) {
      data.readme = readme;
    }

    jade.renderFile(`${dockyPath}/template/template.jade`, data, (err, html) => {
      if (err) throw err;

      createDocs(html);
    });
  });

};
