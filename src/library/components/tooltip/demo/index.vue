<template>
  <div>
    <button tooltip="这是啥啥啥报告的啥结果" title="这是啥啥啥报告的啥结果">结果查看</button><br />
    <br />
    <button tooltip="是将符合筛选条件的归并为一个，是将符合筛选条件的归并为一个，是将符合筛选条件的归并为一个">
      归并
    </button>
    <p tooltip="说明">fsafsa sdaf 文字..</p>
    <p tooltip="是将符合筛选条件的归并为一个，是将符合筛选条件的归并为一个，是将符合筛选条件的归并为一个">归并</p>
  </div>
</template>

<style lang="less" style="text/less">
body {
  [tooltip] {
    position: relative;
    // 三角形
    &::before {
      content: '';
      display: none;
      width: 0px;
      height: 0px;
      border: 6px solid;
      border-color: #000000 transparent transparent transparent;
      position: absolute;
      left: 50%;
      bottom: calc(100%);
      transform: translateX(-50%);
      border-radius: 4px;
    }
    // 内容
    &::after {
      content: attr(tooltip);
      display: none;
      min-width: 150px;
      max-width: 300px;
      position: absolute;
      left: 50%;
      bottom: calc(100% + 10px);
      transform: translateX(-50%);
      background: #000000;
      color: #ffffff;
      border-radius: 4px;
      padding: 4px;
    }
    &:hover::after,
    &:hover::before {
      display: block;
    }
  }
}
</style>
