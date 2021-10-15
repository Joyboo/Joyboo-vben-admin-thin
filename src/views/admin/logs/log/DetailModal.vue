<template>
  <BasicModal :width="800" :title="t('sys.errorLog.tableActionDesc')" v-bind="$attrs">
    <Description :data="info" @register="register" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { h, computed } from 'vue';
  import { Avatar, Row, Col } from 'ant-design-vue';
  import { BasicModal } from '/@/components/Modal/index';
  import { Description, useDescription } from '/@/components/Description/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import HeaderImg from '/@/assets/images/header.jpg';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const domain = computed(() => userStore.getUserInfo.config.imageDomain);

  defineProps({
    info: {
      type: Object,
      default: null,
    },
  });

  const { t } = useI18n();

  const schema = [
    {
      field: 'admid',
      label: '玩家名',
      render: (_: string, data: any) => {
        if (!Reflect.has(data.relation, 'avatar')) {
          return h('span');
        }
        const avatar = data.relation.avatar ?? '';
        // 头像和姓名合并一个content
        return h(Row, {}, () => [
          h(Col, { span: 12, style: { textAlign: 'center' } }, () =>
            h(Avatar, { src: avatar ? domain.value + avatar : HeaderImg }),
          ),
          h(Col, { span: 12 }, () => h('p', data.relation.realname)),
        ]);
      },
    },
    {
      field: 'admid',
      label: '账号',
      render: (val: string, data: any) => {
        if (!Reflect.has(data.relation, 'username')) {
          return h('span');
        }
        // 账号和id合并
        const username = data.relation.username ?? '';
        return username + ' (' + val + ')';
      },
    },
    {
      field: 'itime',
      label: '操作时间',
    },
    {
      field: 'ip',
      label: 'IP',
    },
    {
      field: 'content',
      label: 'SQL',
      span: 2,
    },
  ];

  const [register] = useDescription({
    column: 2,
    schema,
  });
</script>
