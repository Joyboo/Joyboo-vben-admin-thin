<template>
  <vue-json-pretty :path="'res'" :deep="deep" :showLength="showLength" :data="data" />
</template>

<script lang="ts" setup>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  defineProps({
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    deep: {
      type: Number,
      default: 3,
    },
    showLength: {
      type: Boolean,
      default: true,
    },
  });
</script>
