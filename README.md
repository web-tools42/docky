<p align="center">
  <img src="https://github.com/markmur/docky/raw/master/docs/images/docky.png?raw=true" width="150" alt="Docky" />
</p>

<h1 align="center">
  Docky
</h1>
<p align="center">
  Generate Documentation for React Components.
</p>

## CLI Usage

Install docky globally:

```shell
npm install -g docky
```

Run docky on a single file or entire folder:

```bash
docky src/components/**/*.js
```

### Example Usage

```bash
docky src/components/**/*.js \ # specify the components to parse
  --watch "src/components/**/*.js","./README.md" \ # watch files
  --ignore "src/components/**/index.js" \ # ignored files
  --use-readme=false
```

### Options

```bash
Usage: docky [files] [options]

Options:

-h, --help              output usage information
-V, --version           output the version number
-c, --color <HEX>       Change the primary theme color (defaults to blue)
-w, --watch "<files>"   Watch specific files and compile on change (comma separate directories/files to watch multiple)
-i, --ignore "<files>"  Ignore specified files from docs
--use-readme [bool]     include/omit README from your documentation (defaults to true)


```

## Contributing

Docky uses Pug (formally known as Jade) and SASS for template generation. The files can be found under the `template` directory.

There is a `components` directory which contains some example React components for testing. You can run docky over the local folder by running:

```shell
npm run docs
```

or

```shell
./bin/docky.js components/**/*.js
```

To compile the sass, run:
```shell
npm run sass
```

Alternatively, you can add a `:watch` flag to auto-generate on change:

```shell
npm run sass:watch
```

### Thanks

This tool relies heavily on the [react-docgen](https://github.com/reactjs/react-docgen) project by the reactjs team so many thanks to those who have made Docky possible.
