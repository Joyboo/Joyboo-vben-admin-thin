<template>
  <Row :gutter="[20, 20]">
    <Col v-for="(item, index) in growCardList" :key="index" v-bind="colSpan">
      <Card size="small" :loading="loading" :title="item.title" hoverable>
        <template #extra>
          <Tag :color="item.color">{{ item.action }}</Tag>
        </template>

        <div class="py-4 px-4 flex justify-between">
          <CountTo prefix="$" :startVal="1" :endVal="item.value" class="text-2xl" />
          <Icon :icon="getIcon(item)" :size="40" :style="getIconStyle(item)" />
        </div>

        <div class="p-2 px-4 flex justify-between">
          <span :style="item.lasttitleStyle || {}">{{ item.lasttitle }}</span>
          <CountTo prefix="$" :startVal="1" :endVal="item.total" />
        </div>
      </Card>
    </Col>
  </Row>
</template>
<script lang="ts" setup>
  import { CountTo } from '/@/components/CountTo/index';
  import { Icon } from '/@/components/Icon';
  import { Tag, Card, Row, Col } from 'ant-design-vue';
  import { growCardList, GrowCardItem } from '../data';
  import { isDef } from '/@/utils/is';
  import type { CSSProperties } from 'vue';
  import { reactive } from 'vue';

  defineProps({
    loading: {
      type: Boolean,
    },
  });

  const colSpan = reactive({
    xs: 24,
    sm: 24,
    md: 12,
    lg: 6,
    xl: 6,
    xxl: 6,
  });

  const getIcon = (item: GrowCardItem) => {
    if (isDef(item.icon)) {
      return item.icon;
    } else if (item.value >= item.total) {
      return 'cartoon-arrow-down-green|svg';
    } else {
      return 'cartoon-arrow-down-red|svg';
    }
  };

  /**
   * 因为使用同一个icon不同颜色来表示不同增减趋势，这里需要旋转180度
   * @param item
   */
  const getIconStyle = (item: GrowCardItem): CSSProperties => {
    if (item.value >= item.total) {
      return { transform: 'rotate(180deg)' };
    } else {
      return {};
    }
  };
</script>
