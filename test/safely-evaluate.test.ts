import { describe, expect, test } from 'bun:test'

import {
  safelyEvaluate,
  transformTypescriptForEval,
} from '../shared/utils/safely-evaluate'

describe('transformTypescriptForEval', () => {
  test('strips nested type arguments from function calls', () => {
    const transformed = transformTypescriptForEval(`
const result = await $db.query<Array<{ schema: string, table: string }>>({
  text: 'SELECT 1',
})
`)

    expect(transformed).toContain('await $db.query({')
    expect(transformed).not.toContain('Array<{ schema: string, table: string }>>')
  })

  test('preserves comparison expressions and generic-looking strings', () => {
    const transformed = transformTypescriptForEval(`
const isWithinRange = value < upper && value > lower
const example = '$db.query<Row>()'
`)

    expect(transformed).toContain('value < upper && value > lower')
    expect(transformed).toContain("'$db.query<Row>()'")
  })

  test('evaluates a function containing a generic call', () => {
    const result = safelyEvaluate(`
function getData() {
  const identity = value => value

  return identity<{ database: string }>({ database: 'gentl' })
}

export default { fnc: getData }
`)

    expect(result.fnc()).toEqual({ database: 'gentl' })
  })
})
