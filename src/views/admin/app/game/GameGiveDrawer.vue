<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="'将游戏分配给管理员，游戏: ' + gameKeyValue[rowId] + ' (id: ' + rowId + ')'"
    width="60%"
    @close="handlerClose"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #give="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          ref="gameGiveTreeRef"
          checkable
          toolbar
          @change="changeTree"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, unref, computed, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { giveFormSchema } from './game.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { gameGive } from '/@/api/admin/app';
  import { useUserStore } from '/@/store/modules/user';

  const treeData = ref<TreeItem[]>([]);
  const emit = defineEmits(['success', 'register']);

  const userStore = useUserStore();
  const gameKeyValue = computed(() => userStore.gameKeyValue);

  const rowId = ref(0);
  let add = [];
  let del = [];
  const gameGiveTreeRef = ref<Nullable<TreeActionType>>(null);

  const [registerForm, { resetFields }] = useForm({
    labelWidth: 90,
    schemas: giveFormSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    add = del = [];
    setDrawerProps({ confirmLoading: false });

    rowId.value = data.record.id;
    const { tree, auth } = await gameGive('GET', { gameid: data.record.id });
    treeData.value = tree;
    origin = auth;

    nextTick(() => {
      // 展开全部
      unref(gameGiveTreeRef.value)?.expandAll(true);
      // 全部取消选中
      //   unref(gameGiveTreeRef.value)?.checkAll(false);
      // 选中指定值
      unref(gameGiveTreeRef.value)?.setCheckedKeys(auth);
    });
  });

  async function handleSubmit() {
    try {
      setDrawerProps({ confirmLoading: true });

      await gameGive('POST', { gameid: rowId.value, add, del });

      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  const handlerClose = () => {
    add = del = [];
    rowId.value = 0;
    resetFields();
  };

  const changeTree = (value: any, label: any, extra: any) => {
    console.log('changeTree ', value, label, extra);
    // 与auth比较
  };
</script>
