<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { basicProps } from './props';

  defineProps({
    ...basicProps,
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  onMounted(() => {
    setOptions({
      title: {
        text: 'Log Axis',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      legend: {
        left: 'left',
      },
      xAxis: {
        type: 'category',
        name: 'x',
        splitLine: { show: false },
        data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: {
        type: 'log',
        name: 'y',
        minorSplitLine: {
          show: true,
        },
      },
      series: [
        {
          name: 'Log2',
          type: 'line',
          data: [1, 3, 9, 27, 81, 247, 741, 2223, 6669],
        },
        {
          name: 'Log3',
          type: 'line',
          data: [1, 2, 4, 8, 16, 32, 64, 128, 256],
        },
      ],
    });
  });
</script>
