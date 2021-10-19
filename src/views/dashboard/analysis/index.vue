<template>
  <div class="p-4" ref="wrapEl">
    <GrowCard
      :loading="loading"
      :query="query"
      :list="growCardList"
      class="enter-y"
      @change="change"
    />
    <Panle :loading="loading" :data="panleList" class="enter-y" />
  </div>
</template>
<script lang="ts" setup name="Analysis">
  import { ref, reactive } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import Panle from './components/Panle.vue';
  import { dashboardAnalysis } from '/@/api/dashboard/analysis';
  import type { SearchParams } from '/@/api/dashboard/analysis';
  import { AnalysisResult, GrowCardItem, panleList } from './data';
  import { useLoading } from '/@/components/Loading';

  const loading = ref(true);
  let rq = 0;
  const query: SearchParams = reactive({
    gameid: undefined,
    tzn: -5,
  });

  const change = (key, value) => {
    query[key] = value;
    search(query);
  };

  const growCardList = ref<GrowCardItem[]>([]);
  const wrapEl = ref<ElRef>(null);
  const [openWrapLoading, closeWrapLoading] = useLoading({
    target: wrapEl,
    props: {
      absolute: true,
    },
  });

  const search = (params: SearchParams) => {
    openWrapLoading();
    dashboardAnalysis(params)
      .then((result: AnalysisResult) => {
        const { revenue, chart } = result;
        growCardList.value = [
          {
            title: '本日营收',
            lasttitle: '对比昨天',
            value: revenue.today,
            total: revenue.yesterday,
            color: 'green',
            action: '日',
          },
          {
            title: '本月营收',
            lasttitle: '对比上月',
            value: revenue.month,
            total: revenue.lastmonth,
            color: 'blue',
            action: '月',
          },
        ];

        for (const i in panleList) {
          const dataindex = panleList[i].dataindex;
          panleList[i].data = chart[dataindex];
        }
      })
      .catch(() => {})
      .finally(() => {
        closeWrapLoading();
        // 首次的时候启用Card类似骨架屏的效果
        if (!rq) {
          loading.value = false;
        }
        rq++;
      });
  };

  search(query);
</script>
