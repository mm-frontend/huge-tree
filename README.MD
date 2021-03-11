## 在线演示
[http://39.98.139.162:3000/demo](http://39.98.139.162:3000/demo)

## 使用方式

npm i huge-tree --save
或
yarn add huge-tree -D

### 全局使用
```
// main.js， 
import BTM from 'huge-tree'
Vue.use(BTM)

// demo1.vue, 使用 huge-tree
<btm-huge-tree><btm-huge-tree/>

// demo2.vue 使用 huge-list
<btm-huge-list></btm-huge-list>
```

### 按需使用
```
// 
import { HugeTree, HugeList } from 'huge-tree'
Vue.use(HugeTree)
Vue.use(HugeList)
```

### 组件内部使用
```
// demo.vue, 
<template>
  <div>
    <btm-huge-tree></btm-huge-tree>
  </div>
</template>

<script>
import { HugeTree } from 'huge-tree'

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
3. yarn dev
4. yarn mock:api // 再开一个窗口执行此命令，两个node服务都跑起来。
5. 0.0.0.0:8000


## 打包为umd类型的js-hugeTree.js
```
运行 yarn build-library 将生成dist/huge-tree.js

// 使用
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>huge-tree</title>
  <script src="**/**/huge-tree.js"></script>
</head>

<body>
  <script>
    console.log(hugeTree)
  </script>
</body>

</html>


```
