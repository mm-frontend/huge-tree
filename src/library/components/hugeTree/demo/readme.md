## Attributes

| 参数        | 说明                                         | 类型           | 可选值         | 默认值               |
| ----------- | -------------------------------------------- | -------------- | -------------- | -------------------- |
| list        | 扁平化的 tree                                | Array          | --             | []                   |
| checkedList | 选中的叶子节点, 结合 v-model 使用            | Array          | --             | []                   |
| hasInput    | 是否含有过滤输入框                           | Boolean        | --             | false                |
| placeholder | 过滤输入框的 placeholder，配合 hasInput 使用 | String         | --             | 请输入关键字进行查找 |
| indent      | 缩进                                         | String, Number | --             | 15                   |
| height      | 容器高度                                     | String, Number | --             | 600                  |
| expandLevel | 展开程度                                     | String, Number | 'all',1,2,3,,, | 'all'                |
| isLoading   | 是否展示加载中                               | Boolean        | --             | false                |

## 方法

| 事件名称       | 说明         | 参数          |
| -------------- | ------------ | ------------- |
| setCheckedKeys | 回显选中状态 | id 组成的数组 |

## Events

| 事件名称 | 说明             | 回调参数 |
| -------- | ---------------- | -------- |
| onChange | 选中状态变化触发 | nodeList |
