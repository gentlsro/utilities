import { addTemplate, createResolver, defineNuxtModule } from 'nuxt/kit'
import { existsSync, readFileSync } from 'node:fs'
import { relative } from 'node:path'

const { resolve } = createResolver(import.meta.url)
const currentDir = resolve('..')

function extractComparatorEnum(text: string): string | null {
  const regex = /enum\s+ComparatorEnum\s*\{[^}]*\}/g
  const match = text.match(regex)

  return match ? match[0] : null
}

function extractTypeContent(content: string, typeName: string) {
  const typeRegex = new RegExp(`type\\s+${typeName}\\s*=([\\s\\S]*?)(\\n(?=\\w)|$)`, 'g')
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

export default defineNuxtModule({
  setup: async (_, nuxt) => {
    console.log('✔ Creating utilities virtual file...')
    const componentPaths: string[] = []

    const configPaths = nuxt.options._layers
      .map(layer => {
        const isBase = layer.cwd === currentDir
        const configPath = isBase ? 'config' : 'utilities-config'

        componentPaths.push(relative(process.cwd(), `${layer.cwd}/client/components/**/*.vue`))
        componentPaths.push(relative(process.cwd(), `${layer.cwd}/client/libs/**/*.vue`))

        return { path: resolve(layer.cwd, configPath), isBase, cwd: layer.cwd }
      })
      .filter(({ path }) => existsSync(`${path}.ts`))

    // Merge the utility configs
    const codeUtilityConfigs = `import { customDefu } from '$utilsLayer/shared/functions/custom-defu'
${configPaths.map(({ path }, idx) => {
  return `import config${idx} from '${path}'`
}).join('\n')}

export const utilsConfig = customDefu(${configPaths.map((_, idx) => `config${idx}`).join(', ')})

export type IIUtilitiesConfig = typeof utilsConfig
export default utilsConfig
`

    addTemplate({
      filename: `${nuxt.options.rootDir}/generated/utilsConfig.ts`,
      write: true,
      getContents: () => codeUtilityConfigs,
    })

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
      filename: `${nuxt.options.rootDir}/generated/comparator-enum.ts`,
      write: true,
      getContents: () => configContents,
    })

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
      filename: `${nuxt.options.rootDir}/generated/data-type.type.ts`,
      write: true,
      getContents: () => dataTypes,
    })

    const base = configPaths.find(({ isBase }) => isBase)

    // Expose index
    addTemplate({
      filename: `${nuxt.options.rootDir}/generated/utils.ts`,
      write: true,
      getContents: () => `export * from '${base?.cwd}/index'
`,
    })

    // Map components by name
    addTemplate({
      filename: `${nuxt.options.rootDir}/generated/components-by-name.ts`,
      write: true,
      getContents: () => `import type { AsyncComponentLoader, Component } from 'vue'
export const componentsImportByName: Record<string, AsyncComponentLoader<Component>> = {}
`,
      //       getContents: async () => {
      //         const { globby } = await import('globby')
      //         const { resolve, relative } = await import('node:path')
      //         const fs = await import('node:fs')

      //         // Create a map to store component names and their actual file paths
      //         const componentMap = new Map()

      //         // Process each layer to find components
      //         for (const layer of nuxt.options._layers) {
      //           const layerRoot = layer.cwd

      //           // These are the patterns within each layer
      //           const patterns = [
      //             'client/components/**/*.vue',
      //             'client/libs/**/*.vue',
      //           ]

      //           // For each pattern, find matching files in this layer
      //           for (const pattern of patterns) {
      //             const fullPattern = resolve(layerRoot, pattern)
      //             try {
      //               const files = await globby(fullPattern)

      //               for (const file of files) {
      //                 const componentName = file.split('/').pop()?.replace('.vue', '')
      //                 if (componentName) {
      //                   // Store the absolute file path
      //                   componentMap.set(componentName, file)
      //                 }
      //               }
      //             } catch (err) {
      //               console.warn(`Failed to glob pattern ${fullPattern}:`, err)
      //             }
      //           }
      //         }

      //         // Generate explicit dynamic imports for each component
      //         const imports = []
      //         for (const [name, filePath] of componentMap.entries()) {
      //           // We need to ensure the path is properly formatted for webpack/vite
      //           const normalizedPath = filePath.replace(/\\/g, '/')
      //           imports.push(`  "${name}": () => import("${normalizedPath}")`)
      //         }

      //         return `import type { AsyncComponentLoader, Component } from 'vue'

      // // Component registry generated at build time
      // export const componentsImportByName: Record<string, AsyncComponentLoader<Component>> = {
      // ${imports.join(',\n')}
      // }
      // `
      //       },
    })

    nuxt.hook('vite:extendConfig', config => {
      if (!config.resolve) {
        config.resolve = {}
      }

      if (!config.resolve.alias) {
        config.resolve.alias = {}
      }

      config.resolve.alias = {
        ...config.resolve.alias,
        $utils: `${nuxt.options.rootDir}/generated/utils.ts`,
        $utilsConfig: `${nuxt.options.rootDir}/generated/utilsConfig.ts`,
        $comparatorEnum: `${nuxt.options.rootDir}/generated/comparator-enum.ts`,
        $dataType: `${nuxt.options.rootDir}/generated/data-type.type.ts`,
        $components: `${nuxt.options.rootDir}/generated/components-by-name.ts`,
      }
    })
  },
})
