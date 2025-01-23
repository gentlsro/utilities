<script setup lang="ts">
import { utilsConfig } from '$utilsConfig'
import { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

const x = ComparatorEnum.CONTAINS
const y: ExtendedDataType = 'boolean'
</script>

<template>
  <div>
    Utilities
    {{ x }}

    {{ utilsConfig.logging }}
  </div>
</template>
