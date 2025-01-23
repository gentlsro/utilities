/**
 * Pretty much `eval`
 * Shouldn't really ever be used, but it's here if we need it...
 */
export function safelyEvaluate(code: string, ...args: any[]) {
  // Create a new function object from the code string
  // eslint-disable-next-line no-new-func
  const evalFunc = new Function(...args.map((_, i) => `arg${i}`), code)

  // Bind the function to the global object (window in a browser)
  // and pass any arguments to the function
  return evalFunc.call(window, ...args)
}
