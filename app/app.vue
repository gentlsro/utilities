<script setup lang="ts">
import utilsConfig from '$utilsConfig'
import { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

const x = ComparatorEnum.CONTAINS
const y: ExtendedDataType = 'boolean'

const z = $duration(100, 'second').as('ms')
</script>

<template>
  <div>
    Utilities
    {{ x }}

    {{ z }}

    {{ utilsConfig.logging }}
  </div>
</template>
