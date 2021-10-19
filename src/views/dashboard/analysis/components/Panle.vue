<template>
  <div class="mt-5">
    <Row :gutter="[20, 20]">
      <Col v-for="item in data" :key="item.dataindex" v-bind="panleColSpan">
        <Card
          hoverable
          :size="size"
          :bodyStyle="{ height: cardBodyHeight(350) }"
          :loading="loading"
        >
          <!--<template #extra>
            <span>
              <a-button ghost type="primary" :size="size" class="ml-2"> 本周 </a-button>
              <a-button ghost danger type="primary" :size="size" class="ml-2"> 上周 </a-button>
            </span>
          </template>-->
          <PanleEchart v-bind="item" :height="cardBodyHeight(380)" />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { Row, Col, Card } from 'ant-design-vue';
  import PanleEchart from './PanleEchart.vue';
  import { EchartStruct } from '../data';
  // import { dashboardAnalysis } from '/@/api/dashboard/analysis';

  defineProps({
    loading: {
      type: Boolean,
    },
    size: {
      type: String as PropType<'default' | 'small'>,
      default: 'small',
    },
    data: {
      type: Array as PropType<EchartStruct[]>,
      default() {
        return [];
      },
    },
  });

  const panleColSpan = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 12,
    xl: 12,
    xxl: 8,
  };
  const cardBodyHeight = (offset: number) => 'calc((100vh - ' + offset + 'px) / 2)';
</script>

<style lang="less" scoped></style>
