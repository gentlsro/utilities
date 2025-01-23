import { addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { existsSync, readFileSync } from 'node:fs'

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
    const configPaths = nuxt.options._layers
      .map(layer => {
        const isBase = layer.cwd === currentDir
        const configPath = isBase ? 'config' : 'utilities-config'

        return { path: resolve(layer.cwd, configPath) }
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
      filename: 'generated/utils.ts',
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
      filename: 'generated/comparator-enum.ts',
      write: true,
      getContents: () => configContents,
    })

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
      filename: 'generated/data-type.type.ts',
      write: true,
      getContents: () => dataTypes,
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
        $utilsConfig: `${nuxt.options.buildDir}/generated/utils.ts`,
        $comparatorEnum: `${nuxt.options.buildDir}/generated/comparator-enum.ts`,
        $dataType: `${nuxt.options.buildDir}/generated/data-type.type.ts`,
      }
    })
  },
})
