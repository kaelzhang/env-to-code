[![Build Status](https://travis-ci.org/kaelzhang/env-to-code.svg?branch=master)](https://travis-ci.org/kaelzhang/env-to-code)
[![Coverage](https://codecov.io/gh/kaelzhang/env-to-code/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/env-to-code)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/env-to-code?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/env-to-code)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/env-to-code.svg)](http://badge.fury.io/js/env-to-code)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/env-to-code.svg)](https://www.npmjs.org/package/env-to-code)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/env-to-code.svg)](https://david-dm.org/kaelzhang/env-to-code)
-->

# env-to-code

The module to parse `process.env[SOME_KEY]` into JavaScript variable or JavaScript code, especially, which is very useful for [`webpack.EnvironmentPlugin`](https://webpack.js.org/plugins/environment-plugin/)

## Install

```sh
$ npm i env-to-code
```

## Usage


```sh
# bash
export FOO=bar
export BAZ=1
export DEBUG=false
```

```js
import {
  js,
  code
} from 'env-to-code'

js(process.env.FOO) === 'bar'       // true
code(process.env.FOO) === '"bar"'   // true

js(process.env.BAZ) === 1           // true

js(process.env.DEBUG) === false     // true
code(process.env.DEBUG) === 'false' // true

// But
JSON.stringify(process.env.DEBUG) === '"false"'  // true
```

## js(s, config?)

- **s** `string` environment variable string
- **config** `?Object` optional config
  - **testJSON** `?boolean=false` whether to test if `s` is a JSON
  - **arrayDelimiter** `?string=','` by default, it will try to split the env variable into array with `arrayDelimiter`. To disable this feature, set the option to `false` or `''`

Parses the environment variable into JavaScript variable.

```js
js('English, Chinese')    // ['English', 'Chinese']
js('English')             // 'English'

js('English, Chinese', {
  arrayDelimiter: false
})
// 'English, Chinese'
```

## code(s, config?)

This method has the same arguments as `js()`, and parses `s` into JavaScript code string.

So it is useful for [`webpack.EnvironmentPlugin`](https://webpack.js.org/plugins/environment-plugin/) or writing JavaScript code into files.

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': code(process.env.NODE_ENV),
  'process.env.DEBUG': code(process.env.DEBUG)
});
```

or

```js
// write.js
fs.writeFileSync('foo.js', `module.exports = {debug:${code(process.env.DEBUG)}}`)
```

```sh
DEBUG=true node write.js
```

And in foo.js

```js
module.exports = {debug:true}
```

## License

MIT
