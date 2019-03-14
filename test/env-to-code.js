const test = require('ava')
const {
  code,
  js
} = require('../src')

const U = undefined
const CASES = [
  [
    '',
    // arrayDelimiter
    U,
    // testJSON
    U,
    // code
    '""',
    // js variable
    ''
  ],
  ['1', U, U, '1', 1],
  ['true', U, U, 'true', true],
  ['false', U, U, 'false', false],
  ['a,b', U, U, '["a","b"]', ['a', 'b']],
  ['a,1', U, U, '["a",1]', ['a', 1]],
  ['a,b', '', U, '"a,b"', 'a,b'],
  ['{"a":1}', U, true, '{"a":1}', {a: 1}],
  ['["a", "b"]', U, true, '["a", "b"]', ['a', 'b']],
  ['["a", "b"]', U, false, '["[\\"a\\"","\\"b\\"]"]', ['["a"', '"b"]']],
]

const DEFAULT_DELIMITER = ','
const DEFAULT_TEST_JSON = false

const title = (i, s, options) => {
  if (!options) {
    return `${i}: ${s} with no options`
  }

  const d = 'arrayDelimiter' in options
    ? JSON.stringify(options.arrayDelimiter)
    : 'NONE'
  const j = 'testJSON' in options
    ? JSON.stringify(options.testJSON)
    : 'NONE'

  return `${i}: ${s}, ${d}, ${j}`
}

const runOptions = (i, s, options, codeExpected, jsExpected) => {
  test(title(i, s, options), t => {
    t.is(code(s, options), codeExpected, 'code')

    Object(jsExpected) === jsExpected
      ? t.deepEqual(js(s, options), jsExpected, 'js')
      : t.is(js(s, options), jsExpected, 'js')
  })
}

const runOne = (i, s, arrayDelimiter, testJSON, c, v) => {
  runOptions(i, s, {
    arrayDelimiter,
    testJSON
  }, c, v)

  if (arrayDelimiter === DEFAULT_DELIMITER && testJSON === DEFAULT_TEST_JSON) {
    runOptions(i, s, {}, c, v)
    runOptions(i, s, U, c, v)
    return
  }

  if (arrayDelimiter === DEFAULT_DELIMITER) {
    runOptions(i, s, {
      testJSON
    }, c, v)
    return
  }

  if (testJSON === DEFAULT_TEST_JSON) {
    runOptions(i, s, {
      arrayDelimiter
    }, c, v)
  }
}

const run = ([
  s, d, j, c, v
], i) => {
  const ds = d === U
    ? [',', U]
    : [d]
  const ss = j === U
    ? [true, false]
    : [j]

  ds.forEach(dd => {
    ss.forEach(jj => {
      runOne(i, s, dd, jj, c, v)
    })
  })
}

CASES.forEach(run)
