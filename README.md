# Docky
Auto-Generate JavaScript documenation.

## CLI Usage

Install docky globally:

`npm install -g docky`

Run docky:

`docky <filename>.js`

## Programmatic Usage

`npm install --save-dev docky`

```javascript
const docky = require('docky');

docky('filename.js', {
  readme: '../README.md'
});
```

## Options
```shell

  Usage: docky <file> [options]

  Options:

    -h, --help               output usage information
    -v, --version            output the version number
    -r, --readme <readme>    Specify a README file
```

## Scripts
Compile the template SASS:
`npm run sass`
