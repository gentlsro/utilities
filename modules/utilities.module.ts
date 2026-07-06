import { addTemplate, createResolver, defineNuxtModule } from 'nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import { existsSync, readFileSync } from 'node:fs'

const { resolve } = createResolver(import.meta.url)
const currentDir = resolve('..')

function extractComparatorEnum(text: string): string | null {
  const regex = /enum\s+ComparatorEnum\s*\{[^}]*\}/g
  const match = text.match(regex)

  return match ? match[0] : null
}

function extractTypeContent(content: string, typeName: string) {
  // Match type definition that can span multiple lines, including cases where
  // the type name and = are on different lines (e.g., "type DataType\n  = | 'string'")
  // Stop when we encounter another type/enum/interface/const/function/class definition or end of file
  // Pattern breakdown:
  // - type\s+DataType - matches "type DataType"
  // - (?:...|...) - matches either:
  //   - \s*=\s* - equals on same line
  //   - \s*\n[^=]*=\s* - equals on later line (with optional comments/content before =)
  // - ([\\s\\S]*?) - captures the type content (non-greedy)
  // - (?=\n\s*(?:type|enum|interface|const|function|class|export)\s+\w|$) - stops at next declaration or end of file
  const typeRegex = new RegExp(`type\\s+${typeName}(?:\\s*=\\s*|\\s*\\n[^=]*=\\s*)([\\s\\S]*?)(?=\\n\\s*(?:type|enum|interface|const|function|class|export)\\s+\\w|$)`, 'g')
  const match = typeRegex.exec(content)

  if (match?.[1]) {
    return match[1]
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .split('\n') // Split into lines
      .map(line => line.trim()) // Trim each line
      .filter(line => line.length > 0) // Remove empty lines
      .join('\n') // Join back into a single string
  }

  return null
}

const CLIENT_UTILS_CONFIG = '#build/client-utilsConfig.ts'
const COMPARATOR_ENUM = '#build/comparator-enum.ts'
const DATA_TYPE = '#build/data-type.type.ts'

function setAliasPaths(
  nuxt: Nuxt,
  alias: string,
  tsClientPath: string,
) {
  nuxt.options.typescript.tsConfig ??= {}
  nuxt.options.typescript.tsConfig.compilerOptions ??= {}
  nuxt.options.typescript.tsConfig.compilerOptions.paths ??= {}
  nuxt.options.typescript.tsConfig.compilerOptions.paths[alias] = [tsClientPath]

  nuxt.options.nitro.typescript ??= {}
  nuxt.options.nitro.typescript.tsConfig ??= {}
  nuxt.options.nitro.typescript.tsConfig.compilerOptions ??= {}
  nuxt.options.nitro.typescript.tsConfig.compilerOptions.paths ??= {}
  nuxt.options.nitro.typescript.tsConfig.compilerOptions.paths[alias] = [tsClientPath]
}

function generateUtilityConfigCode(configPaths: { path: string, isBase: boolean, cwd: string }[]) {
  return `import { createDefu } from 'defu'

export const customDefu = createDefu((obj, key, value) => {
  // For arrays, use the value, don't extend
  if (Array.isArray(obj[key])) {
    obj[key] = value ?? obj[key]

    return true
  }
})


  ${configPaths.map(({ path }, idx) => {
    return `import config${idx} from '${path}'`
  }).join('\n')}

export const utilsConfig = customDefu(${configPaths.map((_, idx) => `config${idx}`).join(', ')})

export type IIUtilitiesConfig = typeof utilsConfig
export default utilsConfig
`
}

export default defineNuxtModule({
  setup: async (_, nuxt) => {
    console.log('✔ Process Utilities...')

    const configPaths = nuxt.options._layers
      .map(layer => {
        const isBase = layer.cwd === currentDir
        const configPath = isBase ? 'config' : 'utilities-config'

        return { path: resolve(layer.cwd, 'app', configPath), isBase, cwd: layer.cwd }
      })
      .filter(({ path }) => existsSync(`${path}.ts`))

    const configCode = generateUtilityConfigCode(configPaths)

    addTemplate({
      filename: 'client-utilsConfig.ts',
      write: true,
      getContents: () => configCode,
    })

    addTemplate({
      filename: 'server-utilsConfig.ts',
      write: true,
      getContents: () => configCode,
    })

    setAliasPaths(nuxt, '$utilsConfig', './client-utilsConfig.ts')

    // Merge the ComparatorEnum
    const configContents = configPaths
      .map(({ path }) => {
        const fileContents = readFileSync(`${path}.ts`, 'utf-8')
        const enumComparator = extractComparatorEnum(fileContents)

        if (!enumComparator) {
          return null
        }

        return `export ${enumComparator}`
      })
      .filter(x => !!x)
      .join('\n')

    addTemplate({
      filename: 'comparator-enum.ts',
      write: true,
      getContents: () => configContents,
    })

    setAliasPaths(nuxt, '$comparatorEnum', './comparator-enum.ts')

    // Merge the data types
    let dataTypes = configPaths
      .map(({ path }) => {
        const fileContents = readFileSync(`${path}.ts`, 'utf-8')
        return extractTypeContent(fileContents, 'DataType')
      })
      .filter(Boolean) // Remove null or undefined results
      .flatMap(typeContent => (typeContent as string).split('|').map(part => part.trim())) // Split and trim each type
      .filter(part => part.length > 0) // Remove empty parts
      .filter((part, index, arr) => arr.indexOf(part) === index) // Remove duplicates
      .map(part => `| ${part}`) // Format each type as "| type"
      .join('\n') // Join with a newline

    dataTypes = `
export type DataType =
${dataTypes}

type SimpleDataType = \`\${DataType}Simple\`

export type ExtendedDataType = DataType | SimpleDataType`

    addTemplate({
      filename: 'data-type.type.ts',
      write: true,
      getContents: () => dataTypes,
    })

    setAliasPaths(nuxt, '$dataType', './data-type.type.ts')

    nuxt.hook('prepare:types', ({ sharedTsConfig }) => {
      sharedTsConfig.compilerOptions ??= {}
      sharedTsConfig.compilerOptions.paths ??= {}
      sharedTsConfig.compilerOptions.paths.$comparatorEnum = ['./comparator-enum.ts']
      sharedTsConfig.compilerOptions.paths.$dataType = ['./data-type.type.ts']
    })

    // Map components by name
    //     addTemplate({
    //       filename: `${nuxt.options.rootDir}/generated/components-by-name.ts`,
    //       write: true,
    //       getContents: () => `import type { AsyncComponentLoader, Component } from 'vue'
    // export const componentsImportByName: Record<string, AsyncComponentLoader<Component>> = {}
    // `,
    //       //       getContents: async () => {
    //       //         const { globby } = await import('globby')
    //       //         const { resolve, relative } = await import('node:path')
    //       //         const fs = await import('node:fs')

    //       //         // Create a map to store component names and their actual file paths
    //       //         const componentMap = new Map()

    //       //         // Process each layer to find components
    //       //         for (const layer of nuxt.options._layers) {
    //       //           const layerRoot = layer.cwd

    //       //           // These are the patterns within each layer
    //       //           const patterns = [
    //       //             'client/components/**/*.vue',
    //       //             'client/libs/**/*.vue',
    //       //           ]

    //       //           // For each pattern, find matching files in this layer
    //       //           for (const pattern of patterns) {
    //       //             const fullPattern = resolve(layerRoot, pattern)
    //       //             try {
    //       //               const files = await globby(fullPattern)

    //       //               for (const file of files) {
    //       //                 const componentName = file.split('/').pop()?.replace('.vue', '')
    //       //                 if (componentName) {
    //       //                   // Store the absolute file path
    //       //                   componentMap.set(componentName, file)
    //       //                 }
    //       //               }
    //       //             } catch (err) {
    //       //               console.warn(`Failed to glob pattern ${fullPattern}:`, err)
    //       //             }
    //       //           }
    //       //         }

    //       //         // Generate explicit dynamic imports for each component
    //       //         const imports = []
    //       //         for (const [name, filePath] of componentMap.entries()) {
    //       //           // We need to ensure the path is properly formatted for webpack/vite
    //       //           const normalizedPath = filePath.replace(/\\/g, '/')
    //       //           imports.push(`  "${name}": () => import("${normalizedPath}")`)
    //       //         }

    //       //         return `import type { AsyncComponentLoader, Component } from 'vue'

    //       // // Component registry generated at build time
    //       // export const componentsImportByName: Record<string, AsyncComponentLoader<Component>> = {
    //       // ${imports.join(',\n')}
    //       // }
    //       // `
    //       //       },
    //     })

    nuxt.hook('vite:extendConfig', config => {
      if (config.resolve) {
        config.resolve.alias = {
          ...config.resolve.alias,
          $utilsConfig: CLIENT_UTILS_CONFIG,
          $comparatorEnum: COMPARATOR_ENUM,
          $dataType: DATA_TYPE,
        }
      }
    })

    nuxt.hook('nitro:config', nitroConfig => {
      nitroConfig.alias = {
        ...nitroConfig.alias,
        $comparatorEnum: COMPARATOR_ENUM,
        $dataType: DATA_TYPE,
      }
    })
  },
})
