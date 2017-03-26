<p align="center"><img
    src="https://github.com/markmur/docky/raw/master/template/images/docky.png?raw=true"
    width="150"
    title="Docky" /></p>
# <h1 align="center">Docky</h1>
<p align="center">Generate Documentation for React Components.</p>

## CLI Usage

Install docky globally:

```shell
npm install -g docky
```

Run docky on a single file or entire folder:

```shell
docky src/components/**/*.js
```

## Options

```shell
  Usage: docky <files> [options]

  Options:

    -h, --help               output usage information
    -v, --version            output the version number
    -w, --watch              run on file change


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
