<template>
  <div class="run-segment">
    <div class="ground" :style="`width:${width}px;height:${height}px`">
      <!-- 图 -->
      <section
        v-for="(item, index) in list"
        :key="index"
        :class="partInfo(item).type"
        :style="
          `width: ${partInfo(item).width}px;
            transform: translateX(${partInfo(item).offset}px);
            height: ${height}px`
        "
      >
        <i class="arrow"></i>
      </section>
      <!-- 时间text -->
      <i
        class="time-text"
        v-for="(item, index) in list.flat(10)"
        :key="'key' + index"
        :style="`transform: translate(${getPosition(item.activityTime, '240000').offset - 15}px)`"
        >{{ item.activityTime.substr(0, 2) + ':' + item.activityTime.substr(2, 2) }}</i
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 10,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {
    /**
     *  [{activityType: 2, activityTime: '050000'}],
     *  [{activityType: 1, activityTime: '100000'}, {activityType: 2, activityTime: '120000'}],
     *  [{activityType: 1, activityTime: '130000'}, {activityType: 1, activityTime: '140000'}, {activityType: 2, activityTime: '180000'}],
     *  [{activityType: 1, activityTime: '200000'}],
     */
    partInfo(item) {
      let info = {
        type: 'range',
        width: 0, // 宽度
        offset: 0, // 偏移量
      };
      if (item.length === 1 && item[0].activityType === 2) {
        info.type = 'endOnly';
      }
      // 多个启动，没有停止的情况
      const isStartOnly = item.every(i => i.activityType === 1);
      if (isStartOnly) {
        info.type = 'startOnly';
      }
      let res = {};
      if (info.type === 'startOnly') {
        res = this.getPosition(item[0].activityTime, '240000');
      } else if (info.type === 'endOnly') {
        res = this.getPosition('000000', item[0].activityTime);
      } else {
        res = this.getPosition(item[0].activityTime, item[item.length - 1].activityTime);
      }
      info.width = res.width;
      info.offset = res.offset;
      return info;
    },
    /**
     * 得到位置信息
     * params {x1} string '100000'
     * params {x2} string '150000'
     */
    getPosition(x1, x2) {
      // group的宽度 分成24份， 这里只精确到小时，精确到分秒太复杂
      const unit = this.width / 24;
      const offset = Number(x1.substr(0, 2)) * unit;
      const width = (Number(x2.substr(0, 2)) - Number(x1.substr(0, 2))) * unit;
      return {
        width,
        offset,
      };
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.run-segment {
  padding: 10px 20px;
  font-size: 12px;
  .ground {
    background: #efefef;
    position: relative;
    &::before {
      content: '00:00';
      position: absolute;
      left: -20px;
      top: 14px;
    }
    &::after {
      content: '24:00';
      position: absolute;
      right: -20px;
      top: 14px;
    }
    section {
      position: absolute;
      &.range {
        background: #409eff;
      }
      &.startOnly,
      &.endOnly {
        .arrow {
          position: absolute;
          right: -5px;
          border: 5px solid;
          width: 0;
          height: 0;
          border-color: transparent transparent transparent #409eff;
        }
        &::after {
          content: '';
          display: inline-block;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          vertical-align: top;
          width: 98%;
          height: 2px;
          background: #409eff;
        }
      }
      &.startOnly::before {
        content: '';
        display: inline-block;
        position: absolute;
        left: 0;
        vertical-align: top;
        width: 6px;
        height: 100%;
        background: #409eff;
      }
      &.endOnly::before {
        content: '';
        display: inline-block;
        position: absolute;
        left: 100%;
        vertical-align: top;
        width: 6px;
        height: 100%;
        background: #409eff;
      }
    }
    .time-text {
      position: absolute;
      top: 15px;
      left: 0;
    }
  }
}
</style>
