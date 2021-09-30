<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="角色列表"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :replaceFields="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup name="RoleTree">
  import { BasicTree } from '/@/components/Tree';

  defineProps({
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
  });

  const emit = defineEmits(['select']);

  function handleSelect(keys) {
    emit('select', keys[0]);
  }
</script>
