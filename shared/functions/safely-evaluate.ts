/**
 * Pretty much `eval`
 * Shouldn't really ever be used, but it's here if we need it...
 */
export function safelyEvaluate(code: string, ...args: any[]) {
  // Lightweight TypeScript handling: strip common TS syntax and normalize exports
  const transformed = transformTypescriptForEval(code)

  // Create a new function object from the (possibly transformed) code string
  // eslint-disable-next-line no-new-func
  const evalFunc = new Function(...args.map((_, i) => `arg${i}`), transformed)

  // Bind the function to the global object and pass any arguments to the function
  return evalFunc.call(globalThis as any, ...args)
}

function transformTypescriptForEval(input: string): string {
  let output = String(input ?? '')

  // Prefer full TypeScript transpilation if available globally (e.g., loaded typescript.js)
  const tsAny: any = (globalThis as any).ts
  if (tsAny && typeof tsAny.transpileModule === 'function') {
    try {
      const res = tsAny.transpileModule(output, {
        compilerOptions: {
          target: tsAny.ScriptTarget.ES2017,
          module: tsAny.ModuleKind.ESNext,
          jsx: tsAny.JsxEmit.Preserve,
          isolatedModules: true,
          esModuleInterop: true,
          useDefineForClassFields: false,
        },
        reportDiagnostics: false,
      })
      output = res?.outputText ?? output
    }
    catch {
      // fall through to lightweight transforms
    }
  }

  // Convert `export default <expr>;` to `return <expr>;`
  // Handles: export default action; export default function ...; export default async function ...;
  output = output.replace(/^[\t ]*export\s+default\s+/m, 'return ')

  // Strip simple function parameter type annotations inside regular function declarations
  // e.g., function fn(payload: SomeType) => function fn(payload)
  output = output.replace(/(\bfunction\s+[A-Z_$][\w$]*\s*\()(.*?)(\))/gis, (_m, start, params, end) => {
    const strippedParams = stripParamTypes(params)
    return `${start}${strippedParams}${end}`
  })

  // Strip simple function parameter type annotations for async functions
  output = output.replace(/(\basync\s+function\s+[A-Z_$][\w$]*\s*\()(.*?)(\))/gis, (_m, start, params, end) => {
    const strippedParams = stripParamTypes(params)
    return `${start}${strippedParams}${end}`
  })

  // Strip parameter types in named function expressions if any slipped through (rare in our templates)
  output = output.replace(/(\bfunction\s*\()(.*?)(\))/gs, (_m, start, params, end) => {
    const strippedParams = stripParamTypes(params)
    return `${start}${strippedParams}${end}`
  })

  // Remove generics after function name: function fn<T>(...) => function fn(...)
  output = output.replace(/(\bfunction\s+[A-Z_$][\w$]*\s*)<[^>]*>(\s*\()/gi, '$1$2')
  output = output.replace(/(\basync\s+function\s+[A-Z_$][\w$]*\s*)<[^>]*>(\s*\()/gi, '$1$2')

  // Remove TypeScript assertions and operators commonly used in inline code
  // `as Type`, `satisfies Type`, and non-null `!` on identifiers
  output = output.replace(/\s+as\s+[^,;)\n]+/g, '')
  output = output.replace(/\s+satisfies\s+[^,;)\n]+/g, '')
  output = output.replace(/([A-Z_$][\w$]*)!\b/gi, '$1')

  // Remove simple variable declaration type annotations
  // Case 1: const foo: Type = ...
  output = output.replace(/(\b(?:let|const|var)\s+[A-Z_$][\w$]*)\s*:[^=;,\n]+/gi, '$1')

  // Case 2: const { a, b }: SomeType = ... OR const [a, b]: SomeType = ...
  output = output.replace(/(\b(?:let|const|var)\s+[[{][^=;\n]*[\]}])\s*:[^=;\n]+(?==)/gi, '$1')

  // Case 3: Multiple declarators: let a: A, b: B;
  output = output.replace(/(\b(?:let|const|var)\s+(?:[^\s;=][^=;\n]*|[\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]))([;=,])/gi, (_m, decl, tail) => {
    const cleaned = decl.replace(/([A-Z_$][\w$]*)\s*:[^,=;\n]+/gi, '$1')
    return `${cleaned}${tail}`
  })

  return output
}

function stripParamTypes(paramsSection: string): string {
  // Remove occurrences of ": Type" or ": { ... }" within a parameter list, without touching default values or destructuring keys
  // This is intentionally conservative to match our usage patterns
  // 1) Remove type annotations for simple identifiers: foo: Type => foo
  let result = paramsSection.replace(/([A-Z_$][\w$]*)\s*:[^,=)]+/gi, '$1')

  // 2) Remove inline type annotations within destructured objects: { foo: Type } => { foo }
  result = result.replace(/(\{[^}]*?)\b([A-Z_$][\w$]*)\s*:[^,}]+/gi, (_m, prefix, name) => `${prefix}${name}`)

  // 3) Remove "readonly" and "?" optional markers in params if present
  result = result.replace(/\breadonly\s+/g, '')
  result = result.replace(/([A-Z_$][\w$]*)\s*\?/gi, '$1')

  return result
}
