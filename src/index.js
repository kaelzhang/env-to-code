const stringify = require('js-stringify')

const JUST_RETURN = x => x
const isArray = (s, delimiter) => delimiter && s.indexOf(delimiter) !== -1

// - no `Function(string)` callback if is not basic string
const basic = (s, yes, no) => {
  if (s === undefined || s === '') {
    return yes(s)
  }

  if (s === 'true') {
    return yes(true)
  }

  if (s === 'false') {
    return yes(false)
  }

  const n = Number(s)
  if (String(n) === s) {
    return yes(n)
  }

  return no(s)
}

const trim = s => s.trim()
const simpleBasic = s => basic(s, JUST_RETURN, trim)

// - yes `Function(jsonObject)` callback if is json
// - yes `Function(string)` callback if not json
const json = (s, testJSON, yes, no) => {
  if (!testJSON) {
    return no(s)
  }

  let parsed

  try {
    parsed = JSON.parse(s)
  } catch (error) {
    return no(s)
  }

  return yes(parsed)
}

// No if else callback
const array = (s, delimiter) => isArray(s, delimiter)
  ? s.split(delimiter).map(simpleBasic)
  : s

// convert env variable to JavaScript variable
exports.js = (s, {
  arrayDelimiter = ',',
  testJSON = false
} = {}) => basic(
  s,
  JUST_RETURN,
  s => json(
    s,
    testJSON,
    JUST_RETURN,
    s => array(s, arrayDelimiter)
  )
)

const isNumberString = s => String(Number(s)) === s

exports.code = (s, {
  arrayDelimiter = ',',
  testJSON = false
} = {}) => {
  if (s === undefined || s === '') {
    return stringify(s)
  }

  if (s === 'true' || s === 'false' || isNumberString(s)) {
    return s
  }

  return json(
    s,
    testJSON,
    // If is an JSON string, just return the string
    () => s,
    s => stringify(array(s, arrayDelimiter))
  )
}
