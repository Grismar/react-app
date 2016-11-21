# Build documentation

## Webstorm

Webstorm is configured to use ES6 syntax, with a Babel watcher to compile .js on the fly. Tasks are disable, to avoid interference with Gulp.

## Gulp

### NPM

Using Node Package manager for basic configuration. Make sure your node and NPM installation are up to date. Run as administrator:

```
npm init
npm install
mkdir dist
gulp
```

See ```package.json``` for packages that will be installed by NPM.

### ESLint

Gulp task 'eslint'. Configured through .eslintrc.

```eslint``` documentation at [http://eslint.org/docs/user-guide/configuring].

### Copy newer

Gulp task 'copy-npm-newer'. Copies any of the source.npm_vendor modules that are newer than their assets/vendor/js counterparts and overwrites them.

```gulp-newer``` documentation at [https://www.npmjs.com/package/gulp-newer]

### Concat, Babel and Source Maps

Gulp task 'concat'. Scripts are compiled through Babel and concatenated into a single app.js. Source maps are generated for each compiled script.

```babel``` documentation at [https://babeljs.io/docs/setup/]

### SASS

```browserslist``` documentation at [https://github.com/ai/browserslist#queries]