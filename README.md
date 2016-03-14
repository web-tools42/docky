# Docky
Auto-Generate JavaScript documenation.

## Install
`npm install -g docky`

## Usage
`docky index.js`

## Programmatic Usage
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

  -h, --help             output usage information
  -v, --version          output the version number
  -r, --readme <readme>  Specify a README file to intro the docs
```

## Scripts
Compile the template SASS:
`npm run sass`
