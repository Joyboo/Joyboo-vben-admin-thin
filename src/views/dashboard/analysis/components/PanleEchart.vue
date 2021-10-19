<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, Ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { basicProps } from './props';
  import { WeekData } from '../data';

  const props = defineProps({
    ...basicProps,
    key: { type: String },
    title: { type: String },
    ystart: { type: String },
    yend: { type: String },
    data: {
      type: Object as PropType<WeekData>,
      default(): WeekData {
        return {
          week: [],
          last: [],
        };
      },
    },
  });

  const { getIsMobile } = useAppInject();
  const { getThemeColor } = useRootSetting();

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  const doSetOptions = () => {
    // console.log('doSetOptions', props.data);
    setOptions({
      title: {
        top: '-2%',
        text: props.title,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        /* axisPointer: {
            type: 'cross',
            label: {
              precision: this.precision // 十字准星小数点精度
            }
          },*/
        // padding: [5, 10],
        // formatter: '{a}' + this.title + ' <br/>星期{b} : ' + ystart + '{c}' + yend
        // trigger: 'item',
        formatter(data) {
          const tip: Array<String> = [];
          if (data.length) {
            for (const i in data) {
              const item = data[i];
              tip.push(item.seriesName + ': ' + props.ystart + item.value + props.yend);
            }
          }
          return tip.join('<br>');
        },
      },
      /* toolbox: {
          show: true,
          feature: {
            // dataView: {readOnly: false}, // 转换为数据视图
            // magicType: {type: ['line', 'bar']}, // 切换折线图或柱状图
            // restore: {}, // 还原
            // saveAsImage: {}  // 保存为图片
          }
        },*/
      legend: {
        bottom: '3px',
        data: ['上周' + props.title, '本周' + props.title],
      },
      xAxis: {
        type: 'category',
        // name: '星期',
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: getThemeColor.value,
          },
        },
        data: ['一', '二', '三', '四', '五', '六', '日'],
      },
      grid: {
        top: '10%',
        left: getIsMobile.value ? '6%' : '2%',
        right: getIsMobile.value ? '15%' : '5%',
        bottom: '10%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        // name: 'Y',
        minorTick: {
          show: true,
        },
        minorSplitLine: {
          show: true,
        },
        splitNumber: 5, // Y轴刻度数，仅参考，实际会变动
        axisLabel: {
          formatter: (data: string) => props.ystart + data + props.yend,
        },
        axisLine: {
          lineStyle: {
            color: getThemeColor.value,
          },
        },
      },
      series: [
        {
          name: '上周' + props.title,
          type: 'line',
          color: getThemeColor.value,
          // data: [1, 3, 9, 27, 81, 247, 200],
          data: props.data.last,
          // animationDuration: 1000, // 初始动画时长
          // animationEasing: 'cubicln' // 初始动画类型
        },
        {
          name: '本周' + props.title,
          type: 'line',
          color: '#F56C6C',
          // data: [1, 2, 4, 25, 16],
          data: props.data.week,
          // animationDuration: 1000,
          // animationEasing: 'cubicln'
        },
      ],
    });
  };
  onMounted(doSetOptions);

  watch(() => props.data, doSetOptions, { immediate: true });
  watch(() => getThemeColor.value, doSetOptions);
</script>
