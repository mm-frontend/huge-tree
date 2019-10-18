<template>
  <div id="">
    <run-segment :list="list"></run-segment>
  </div>
</template>

<script>
import RunSegment from '../runSegment';
export default {
  components: { RunSegment },
  props: {},
  data() {
    return {
      content: [
        {
          activityType: 2, // 停止
          activityTime: '050000',
        },
        {
          activityType: 1, // 启动
          activityTime: '100000',
        },
        {
          activityType: 2,
          activityTime: '120000',
        },
        {
          activityType: 1,
          activityTime: '140000',
        },
        {
          activityType: 1,
          activityTime: '150000',
        },
        {
          activityType: 2,
          activityTime: '180000',
        },
        {
          activityType: 1,
          activityTime: '200000',
        },
      ],
      list: [],
    };
  },

  computed: {},

  mounted() {
    this.list = this.handleSegment(this.content);
  },

  methods: {
    /**
     * 整理出时间段, list 必须按 activityTime正序。
     * eg:
     * return [
     *  [{activityType: 2, activityTime: '050000'}],
     *  [{activityType: 1, activityTime: '100000'}, {activityType: 2, activityTime: '120000'}],
     *  [{activityType: 1, activityTime: '130000'}, {activityType: 1, activityTime: '140000'}, {activityType: 2, activityTime: '180000'}],
     *  [{activityType: 1, activityTime: '200000'}],
     * ]
     */
    handleSegment(list) {
      // 防止后端不排序
      const _list = list.sort((i, j) => Number(i.activityTime) - Number(j.activityTime));
      let result = [];
      let pointer = 0; // 指针，每检测到一个停止，指针+1
      _list.forEach(i => {
        if (!Boolean(result[pointer])) {
          result[pointer] = [];
        }
        result[pointer].push(i);
        if (i.activityType === 2) {
          pointer++;
        }
      });
      return result;
    },
  },
};
</script>

<style scoped lang="less" style="text/less"></style>
