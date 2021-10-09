<template>
  <Transfer
    :data-source="dataSource"
    :target-keys="targetKeys"
    :disabled="disabled"
    :show-search="showSearch"
    :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
    :show-select-all="false"
    @change="onChange"
  >
    <template
      #children="{
        direction,
        filteredItems,
        selectedKeys,
        disabled: listDisabled,
        onItemSelectAll,
        onItemSelect,
      }"
    >
      <Table
        :row-selection="
          getRowSelection({
            disabled: listDisabled,
            selectedKeys,
            onItemSelectAll,
            onItemSelect,
          })
        "
        :columns="direction === 'left' ? leftColumns : rightColumns"
        :data-source="filteredItems"
        size="small"
        :style="{ pointerEvents: listDisabled ? 'none' : null }"
        :custom-row="
          ({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !selectedKeys.includes(key));
            },
          })
        "
      />
    </template>
  </Transfer>
</template>
<script lang="ts" setup>
  import { Transfer, Table } from 'ant-design-vue';
  import { difference } from 'lodash-es';
  import { ref, watch, computed } from 'vue';
  import { useUserStore } from '/@/store/modules/user';

  interface dataSourceItem {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
  }
  type tableColumn = Record<string, string>;

  const props = defineProps({
    // 选中
    target: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  });

  const emit = defineEmits(['change']);

  const userStore = useUserStore();
  const packageOptions = computed(() => userStore.getUserInfo.pkgList);
  const gameKeyValue = computed(() => userStore.gameKeyValue);

  const targetKeys = ref<string[]>(props.target);
  const dataSource = ref<dataSourceItem[]>([]);
  packageOptions.value.forEach((item: any) => {
    dataSource.value.push({
      key: item.pkgbnd,
      title: item.name + '(id: ' + item.id + ')',
      description: gameKeyValue.value[item.gameid]
        ? gameKeyValue.value[item.gameid] + '(id: ' + item.gameid + ')'
        : 'id: ' + item.gameid,
      disabled: false,
    });
  });

  const leftTableColumns = [
    {
      dataIndex: 'title',
      title: '包',
    },
    {
      dataIndex: 'description',
      title: '所属游戏',
    },
  ];
  const rightTableColumns = leftTableColumns;

  const showSearch = ref<boolean>(false);
  const leftColumns = ref<tableColumn[]>(leftTableColumns);
  const rightColumns = ref<tableColumn[]>(rightTableColumns);

  const onChange = (nextTargetKeys: string[]) => {
    console.log('nextTargetKeys', nextTargetKeys);
    targetKeys.value = nextTargetKeys;
    emit('change', nextTargetKeys);
  };

  watch(() => props.target, onChange);

  const getRowSelection = ({
    disabled,
    selectedKeys,
    onItemSelectAll,
    onItemSelect,
  }: Record<string, any>) => {
    return {
      getCheckboxProps: (item: Record<string, string | boolean>) => ({
        disabled: disabled || item.disabled,
      }),
      onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
        const treeSelectedKeys = selectedRows
          .filter((item) => !item.disabled)
          .map(({ key }) => key);
        const diffKeys = selected
          ? difference(treeSelectedKeys, selectedKeys)
          : difference(selectedKeys, treeSelectedKeys);
        onItemSelectAll(diffKeys, selected);
      },
      onSelect({ key }: Record<string, string>, selected: boolean) {
        onItemSelect(key, selected);
      },
      selectedRowKeys: selectedKeys,
    };
  };
</script>
