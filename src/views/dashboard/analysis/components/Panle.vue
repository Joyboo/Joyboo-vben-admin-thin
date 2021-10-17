<template>
  <div class="mt-5">
    <Row :gutter="[20, 20]">
      <Col v-bind="panleColSpan">
        <Card hoverable :size="size" :bodyStyle="{ height: '300px' }" :loading="loading">
          <!--<template #extra>
            <span>
              <a-button ghost type="primary" :size="size" class="ml-2"> 本周 </a-button>
              <a-button ghost danger type="primary" :size="size" class="ml-2"> 上周 </a-button>
            </span>
          </template>-->
          <PanleEchart />
        </Card>
      </Col>
      <Col v-bind="panleColSpan">
        <Card hoverable :size="size" :bodyStyle="{ height: '300px' }" :loading="loading">
          <PanleEchart />
        </Card>
      </Col>
      <Col v-bind="panleColSpan">
        <Card hoverable :size="size" :bodyStyle="{ height: '300px' }" :loading="loading">
          <PanleEchart />
        </Card>
      </Col>
      <Col v-bind="panleColSpan">
        <Card hoverable :size="size" :bodyStyle="{ height: '300px' }" :loading="loading">
          <PanleEchart />
        </Card>
      </Col>
      <Col v-bind="panleColSpan">
        <Card hoverable :size="size" :bodyStyle="{ height: '300px' }" :loading="loading">
          <PanleEchart />
        </Card>
      </Col>
      <Col v-bind="panleColSpan">
        <Card hoverable :size="size" :bodyStyle="{ height: '300px' }" :loading="loading">
          <PanleEchart />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { Row, Col, Card } from 'ant-design-vue';
  import { reactive } from 'vue';
  import PanleEchart from './PanleEchart.vue';

  defineProps({
    loading: {
      type: Boolean,
    },
    size: {
      type: String,
      default: 'small',
    },
  });

  const panleColSpan = reactive({
    xs: 24,
    sm: 24,
    md: 24,
    lg: 12,
    xl: 12,
    xxl: 8,
    title: '123',
  });
</script>

<style lang="less" scoped></style>
