<template>
  <Tooltip
    v-if="getCount > 0"
    :title="t('layout.header.tooltipErrorLog')"
    placement="bottom"
    :mouseEnterDelay="0.5"
    @click="handleToErrorList"
  >
    <Badge :count="getCount" :offset="[0, 10]" :overflowCount="99">
      <LoadingOutlined v-if="reporting" />
      <Icon v-else icon="ion:bug-outline" />
    </Badge>
  </Tooltip>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Tooltip, Badge } from 'ant-design-vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import Icon from '/@/components/Icon';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useErrorLogStore } from '/@/store/modules/errorLog';
  import { PageEnum } from '/@/enums/pageEnum';

  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const { push } = useRouter();
  const errorLogStore = useErrorLogStore();

  const getCount = computed(() => errorLogStore.getErrorLogListCount);
  const reporting = computed(() => errorLogStore.getReporting());

  function handleToErrorList() {
    push(PageEnum.ERROR_LOG_PAGE).then(() => {
      errorLogStore.setErrorLogListCount(0);
      errorLogStore.reportErrorLog();
    });
  }
</script>
