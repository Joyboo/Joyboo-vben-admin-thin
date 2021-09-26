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
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTree } from '/@/components/Tree';

  export default defineComponent({
    name: 'RoleTree',
    components: { BasicTree },
    props: {
      treeData: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    emits: ['select'],
    setup(_, { emit }) {
      function handleSelect(keys) {
        emit('select', keys[0]);
      }

      return { handleSelect };
    },
  });
</script>
