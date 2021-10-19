<template>
  <Row :gutter="[20, 20]">
    <Col v-for="(item, index) in list" :key="index" v-bind="colSpan">
      <Card
        size="small"
        :loading="loading"
        :title="item.title"
        hoverable
        :bodyStyle="{ height: '128px' }"
      >
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
    <Col v-bind="colSpan">
      <Card
        size="small"
        :loading="loading"
        hoverable
        :bodyStyle="{ height: '128px', lineHeight: '100px' }"
      >
        <template #extra>
          <Tag color="#5F9EA0">
            <template #icon>
              <Icon icon="ant-design:filter-outlined" />
            </template>
            筛选条件
          </Tag>
        </template>

        <Row :gutter="[20, 20]" type="flex" justify="space-around" align="middle">
          <Col :span="12">
            <Select
              :options="gameOptions"
              allowClear
              :defaultValue="query.gameid"
              placeholder="游戏"
              :style="{ width: '100%' }"
              @change="change('gameid', $event)"
            />
          </Col>
          <Col :span="12">
            <Select
              :options="regionOptions"
              :defaultValue="query.tzn"
              placeholder="时区"
              :style="{ width: '100%' }"
              @change="change('tzn', $event)"
            />
          </Col>
        </Row>
      </Card>
    </Col>
    <Col v-bind="colSpan">
      <Card size="small" :loading="loading" hoverable :bodyStyle="{ height: '128px' }">
        <template #extra>
          <Tag color="#A2CD5A">
            <template #icon>
              <Icon icon="ant-design:user-outlined" />
            </template>
            个人信息
          </Tag>
        </template>

        <Row :gutter="[20, 20]" type="flex" justify="space-around" align="middle" @click="goModify">
          <Col :span="10" :style="{ textAlign: 'center' }">
            <Avatar :size="100" :src="userInfo.avatar || HeaderImg" />
          </Col>
          <Col :span="14" :style="{ textAlign: 'center', fontSize: '2.2rem' }">
            {{ userInfo.realname }}
          </Col>
        </Row>
      </Card>
    </Col>
  </Row>
</template>
<script lang="ts" setup>
  import { CountTo } from '/@/components/CountTo/index';
  import { Icon } from '/@/components/Icon';
  import { Tag, Card, Row, Col, Select, Avatar } from 'ant-design-vue';
  import { GrowCardItem } from '../data';
  import { isDef } from '/@/utils/is';
  import type { CSSProperties } from 'vue';
  import { reactive, computed } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { SearchParams } from '/@/api/dashboard/analysis';
  import HeaderImg from '/@/assets/images/header.jpg';
  import { useGo } from '/@/hooks/web/usePage';

  defineProps({
    loading: {
      type: Boolean,
    },
    query: {
      type: Object as PropType<SearchParams>,
      default() {
        return {};
      },
    },
    list: {
      type: Array as PropType<GrowCardItem[]>,
      default() {
        return [];
      },
    },
  });

  const emit = defineEmits(['change']);

  const userInfo = computed(() => useUserStore().getUserInfo);

  const change = (key, value) => emit('change', key, value);

  const colSpan = reactive({
    xs: 24,
    sm: 24,
    md: 12,
    lg: 6,
    xl: 6,
    xxl: 6,
  });

  const gameOptions = computed(() => useUserStore().getGameListOptions);
  const regionOptions = computed(() => {
    const region = useUserStore().getUserInfo.config.sysinfo.region_domain.region ?? {};
    const list: OptionsItem[] = [];
    for (const i in region) {
      const item = region[i];
      list.push({ label: item.name, value: parseInt(item.tzn) });
    }
    return list;
  });

  const go = useGo();
  const goModify = () => {
    go('/system/modify');
  };

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
