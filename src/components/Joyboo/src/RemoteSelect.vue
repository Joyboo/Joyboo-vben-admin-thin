<template>
  <Select
    :value="value"
    :filter-option="false"
    :allow-clear="true"
    show-search
    :getPopupContainer="(triggerNode) => triggerNode.parentNode || document.body"
    :not-found-content="searchState.fetching ? undefined : null"
    :options="searchState.options"
    @search="fetch"
    @change="handleChange"
    v-bind="$attrs"
  >
    <template v-if="searchState.fetching" #notFoundContent>
      <Spin size="small" />
    </template>
  </Select>
</template>

<script setup lang="ts">
  import { PropType, reactive, watch } from 'vue';
  import { Select, Spin } from 'ant-design-vue';
  import { debounce } from 'lodash-es';

  const emit = defineEmits(['change']);
  const props = defineProps({
    api: {
      type: Function as PropType<(arg?: Recordable) => Promise<OptionsItem[]>>,
      required: true,
    },
    value: {
      type: [Array, Object, String, Number],
    },
    params: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
  });

  let lastFetchId = 0;
  const searchState = reactive<{
    options: OptionsItem[];
    fetching: boolean;
  }>({
    options: [],
    fetching: false,
  });

  // 依赖数据一旦变化，则清空列表，value清空需要在外部处理
  watch(
    () => props.params,
    (newVal) => {
      console.log('--watch params ', newVal);
      searchState.options = [];
    },
    { deep: true },
  );
  const fetch = debounce((value) => {
    if (!value || value === '') {
      return;
    }
    lastFetchId += 1;
    const fetchId = lastFetchId;
    searchState.options = [];
    searchState.fetching = true;

    const params = Object.assign({}, props.params, { value });
    props
      .api(params)
      .then((result) => {
        if (fetchId !== lastFetchId) {
          return;
        }
        searchState.options = result;
        searchState.fetching = false;
      })
      .catch((e) => {
        console.error(e);
      });
  }, 300);

  function handleChange(value) {
    emit('change', value);
  }
</script>

<style scoped lang="less"></style>
