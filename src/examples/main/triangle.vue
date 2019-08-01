<template>
  <div class="triangle">
    <div :class="['wrap', colorClass]" :style="`width:${width}px;height:${height}px;`">
      <section class="reac-wrap" @click.self="$emit('t-click', {})">
        <div class="reac" :style="getStyle()" @click="$emit('t-click', { ...$attrs, ...$props })"></div>
      </section>
      <div class="v-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 72,
    },
    colorClass: {
      type: String,
      default: 'blue', // 枚举 blue, yellow, red
    },
  },
  data() {
    return {};
  },

  computed: {
    // 旋转角度， 2*PI = 360度
    getDeg() {
      // 先得到n * PI
      const nPI = Math.atan(this.height / this.width);
      const deg = (nPI / (2 * Math.PI)) * 360;
      return deg;
    },
    // 斜边
    reacWidth() {
      return Math.sqrt(this.width * this.width + this.height * this.height);
    },
  },

  mounted() {},

  methods: {
    getStyle() {
      return `
        width: ${this.reacWidth}px;
        transform: rotate(${this.getDeg}deg);
        transform-origin: 0 0;
      `;
    },
  },
};
</script>

<style scoped lang="less" style="text/less">
.triangle {
  .wrap {
    position: relative;
    .reac-wrap {
      overflow: hidden;
      width: 100%;
      height: 100%;
      .reac {
        height: 100%;
        background-image: linear-gradient(90deg, rgba(65, 134, 251, 0.7) 0%, rgba(85, 227, 242, 0.1) 100%);
      }
    }
    .v-line {
      position: absolute;
      bottom: 0;
      width: 4px;
      height: 100%;
      background-color: #4186fb;
      &::before {
        position: absolute;
        top: -8px;
        left: -8px;
        content: '';
        display: block;
        box-sizing: border-box;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #ffffff;
        border: 2px solid #4186fb;
      }
    }
    &:hover {
      &::before {
        position: absolute;
        content: '';
        left: 1px;
        transform: translateY(-50%);
        display: block;
        width: 2px;
        height: 1000px;
        background: rgba(64, 69, 89, 0.4);
      }
      .v-line::before {
        border-color: #ffffff;
        background-color: #4186fb;
        box-shadow: 0px 2px 5px 1px #4186fb;
      }
    }
  }
  .wrap.yellow {
    .reac-wrap {
      border-bottom: 2px dashed rgba(255, 187, 62, 0.5);
      .reac {
        background-image: linear-gradient(90deg, rgba(255, 187, 62, 0.3) 0%, rgba(255, 208, 62, 0) 100%);
        border-top: 2px dashed rgba(255, 187, 62, 0.5);
      }
    }
    .v-line {
      background-color: #ffbb3e;
      &::before {
        border: 2px solid #ffbb3e;
      }
    }
    &:hover .v-line::before {
      border-color: #ffffff;
      background-color: #ffbb3e;
      box-shadow: 0px 2px 5px 1px #ffbb3e;
    }
  }
  .wrap.red {
    .reac-wrap {
      .reac {
        background-image: linear-gradient(90deg, rgba(254, 103, 100, 0.7) 0%, rgba(250, 100, 136, 0.15) 96%);
      }
    }
    .v-line {
      background-color: #fe6764;
      &::before {
        border: 2px solid #fe6764;
      }
    }
    &:hover .v-line::before {
      border-color: #ffffff;
      background-color: #fe6764;
      box-shadow: 0px 2px 5px 1px #fe6764;
    }
  }
}
</style>
