## 使用方式
npm i @bitmain/components-tree --save

```
// main.js， 全局使用
import BTM from '@bitmain/components-tree'
Vue.use(BTM)

// demo1.vue, 使用 huge-tree
<btm-huge-tree><btm-huge-tree/>

// demo2.vue 使用 huge-list
<btm-huge-list></btm-huge-list>
```

```
// 按需使用
import { HugeTree, HugeList } from '@bitmain/components-tree'
Vue.use(HugeTree)
Vue.use(HugeList)
```

```
// demo.vue, 组件内部使用
<template>
  <div>
    <btm-huge-tree></btm-huge-tree>
  </div>
</template>

<script>
import { HugeTree } from '@bitmain/components-tree'

export default {
  components: {
    'btm-huge-tree': HugeTree
  }
}
</script>
```

## Doc
参见 github 各 demo<br>
[huge-tree 使用doc](https://github.com/bitmain-frontend/huge-tree/tree/master/src/library/components/hugeTree/demo)<br>
[huge-list 使用doc](https://github.com/bitmain-frontend/huge-tree/tree/master/src/library/components/hugeList/demo)



## 本地运行
1. git clone
2. yarn install
3. yarn dev && yarn mock:api
4. 0.0.0.0:8000
