<template>
  <div class="p-4">
    <GrowCard :loading="loading" class="enter-y" />
    <Panle :loading="loading" class="enter-y" />
  </div>
</template>
<script lang="ts" setup name="Analysis">
  import { ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import Panle from './components/Panle.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
