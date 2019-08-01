<template>
  <div class="">
    <coordinate v-if="runData.length > 0" :min="min" :max="max" :list="runData" :type="type"></coordinate>
  </div>
</template>

<script>
import Coordinate from './corrdinate';

export default {
  components: {
    Coordinate,
  },
  props: {},
  data() {
    return {
      type: 'month',
      min: 1546272000, // 2019.01.01
      max: 1577808000, // 2020.01.01
      runData: [
        {
          start: 1549036800, //实际开始时间2019.02.02
          end: 1552579200, //实际结束时间2019.03.15  一天的时间戳86400
          time: 3542400, //质保期 ,时间戳差值
          type: 0, // 0，已完成的巡检；1，巡检计划, -1, 红色交叉
        },
        {
          start: 1551715200, //实际开始时间2019.03.05
          end: 1558281600, //实际结束时间2019.05.20
          time: 6566400, //质保期 ,时间戳差值
          type: 0, // 0，已完成的巡检；1，巡检计划，-1, 红色交叉
        },
        // {
        //   start: 1550592000, //实际开始时间2019.02.20
        //   end: 1558281600, //实际结束时间2019.05.20
        //   time: 7689600, //质保期 ,时间戳差值
        //   type: 0, // 0，已完成的巡检；1，巡检计划，-1, 红色交叉
        // },
        {
          start: 1560960000, //2019.06.20
          end: 1567094400, //2019.08.30
          time: 6134400,
          type: 1, // 0，已完成的巡检；1，巡检计划，-1, 红色交叉
        },
      ],
    };
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>

<style scoped lang="less" style="text/less"></style>
