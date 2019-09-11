<template>
  <div class="">
    <coordinate v-if="runData.length > 0" :min="min" :max="max" :list="runData" :type="type"> </coordinate>
  </div>
</template>

<script>
import Coordinate from '../corrdinate';

export default {
  name: 'Main',
  components: {
    Coordinate,
  },
  props: {},
  data() {
    return {
      type: 'month',
      min: 1552147200, // 2019.03.10
      max: 1568908800, // 2020.09.20
      runData: [
        {
          start: 1554825600, //实际开始时间2019.04.10
          end: 1559145600, //实际结束时间2019.05.30
          time: 4320000, //质保期 ,时间戳差值
          type: 0,
        },
        {
          start: 1557072000, //实际开始时间2019.05.06
          end: 1558281600, //实际结束时间2019.05.20
          time: 1209600, //质保期 ,时间戳差值
          type: 0,
        },
        {
          start: 1562342400, //2019.07.06
          end: 1566230400, //2019.08.20
          time: 3888000,
          type: 1,
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
