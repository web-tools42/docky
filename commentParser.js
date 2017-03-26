#!/usr/bin/env babel-node

const dockyPkg = require('./package.json');
const parse = require('comment-parser');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const jade = require('jade');
const docgen = require('react-docgen');
const extractor = require('./parser.js');
require('colors');
const del = require('del');
const Promise = require('promised-io/promise');
const FS = require('promised-io/fs');
const glob = require('glob');

const cwd = process.cwd();
const dockyPath = path.resolve(__dirname);
const pkg = JSON.parse(fs.readFileSync(`${cwd}/package.json`));

/**
 * Custom debug logger
 * @method log
 */
const log = (...args) => {
  console.log(`[Docky v${dockyPkg.version}]`.green, ...args);
};

/**
 * Checks if a folder exists
 * @method folderExists
 * @param  {String} folder
 * @param  {Function} cb(exists) - callback where exists is a boolean
 */
function folderExists(folder) {
  try {
    return fs.statSync(`${cwd}/${folder}`).isDirectory();
  } catch (err) {
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
  } catch (err) {
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
 * Cleans the docs folder
 * @method cleanDocsFolder
 * @return {Promise}
 */
function cleanDocsFolder() {
  log('Cleaning Docs folder');
  return del(['docs/*']);
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
 * Creates the docs folder
 * @method createDocs
 * @param {String} template
 */
function createDocs(html) {
  log('Creating Docs');

  if (folderExists('docs')) {
    cleanDocsFolder()
      .then(writeTemplateFile(html))
      .then(copyAssets)
      .then(() => {
        log('\u2713'.green, 'Docs successfully generated');
        console.log('\n Type \'open docs/index.html\' to view them');
      });
  } else {
    log('Creating docs folder');

    fs.mkdir(`${cwd}/docs`, err => {
      if (err) throw err;

      writeTemplateFile(html)
        .then(copyAssets)
        .then(() => {
          log('\u2713'.green, 'Docs successfully generated');
          console.log('\n Type \'open docs/index.html\' to view them');
        });
    });
  }
}

/**
 * docky.js
 * @param  {String} file - the file to parse
 * @param  {Object} options - additonal options
 */
module.exports = (file, options) => {
  let hasReadme;
  let readme;

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
    console.log(docgen.parse(source));

    if (err) throw err;

    source = extractor.getMethodNames(source);
    source = extractor.getParameters(source);
    source = extractor.getExamples(source);
    source = extractor.getDeprecated(source);
    source = extractor.groupMethods(source);

    const data = {
      package: pkg,
      methods: source,
      pretty: true,
      markdown: require('marked'),
      _,
      readme: hasReadme ? readme : undefined
    };

    jade.renderFile(`${dockyPath}/template/template.jade`, data, (renderErr, html) => {
      if (renderErr) throw renderErr;

      createDocs(html);
    });
  });
};
