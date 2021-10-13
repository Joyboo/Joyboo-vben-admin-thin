<template>
  <PageWrapper title="phpMyAdmin" contentBackground class="enter-x">
    <Row :gutter="[30, 30]" style="background-color: #f0f2f5">
      <Col v-for="(item, idx) in pmaConfig" :key="idx" v-bind="colSpan">
        <Card :style="{ textAlign: 'center' }">
          <CardMeta :title="item.name" :description="item.url" :class="item.class ?? ''" />
          <template #cover>
            <SvgIcon class="phpMyAdminIcon" name="phpmyadmin" />
          </template>
          <template class="ant-card-actions" #actions>
            <Tooltip title="Token">
              <span @click="ckToken">
                <EyeOutlined />
              </span>
            </Tooltip>
            <Tooltip title="打开">
              <span @click="ckOpen(item.url)">
                <LoginOutlined />
              </span>
            </Tooltip>
          </template>
        </Card>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts" setup name="PhpMyAdmin">
  import { LoginOutlined, EyeOutlined } from '@ant-design/icons-vue';
  import { Card, CardMeta, Row, Col, Tooltip } from 'ant-design-vue';
  import { computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { SvgIcon } from '/@/components/Icon';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getToken } from '/@/utils/auth';
  import { openWindow } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';

  const { createSuccessModal } = useMessage();
  const userStore = useUserStore();

  const pmaConfig = computed(() => userStore.getUserInfo.config.sysinfo.phpmyadmin ?? []);

  const colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 8,
    xl: 8,
    xxl: 6,
  };

  const token = getToken();

  const ckToken = () => {
    createSuccessModal({
      title: () => '当前Token',
      content: () => token,
    });
  };

  const ckOpen = (url: string) => {
    const fullUrl = url + '?mytoken=' + token;
    openWindow(fullUrl);
  };
</script>

<style lang="less" scoped>
  .phpMyAdminIcon {
    height: 100px !important;
    width: 100px !important;
  }
</style>
