import { createDefu } from 'defu'

export const customDefu = createDefu((obj, key, value) => {
  // For arrays, use the value, don't extend
  if (Array.isArray(obj[key])) {
    obj[key] = value ?? obj[key]

    return true
  }
})
