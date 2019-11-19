## node 节点样例

```
{
  id: 0,
  label: '全部',
  parentId: null, // 根节点的 parentId 必须为 null
  isLeaf: false, // 是否是叶子节点
  path: [0], // 节点路径
  checked: false,  // 可选
  disabled: false, // 可选
  childrenCount: 2， // 可选
},
{
  id: 1,
  label: '位置1',
  parentId: 0, // 根节点的 parentId 必须为 null
  isLeaf: false, // 是否是叶子节点
  path: [0, 1], // 节点路径
  checked: false,  // 可选
  disabled: false, // 可选
  childrenCount: 1， // 可选
},
{
  id: 2,
  label: '叶子节点1',
  parentId: 1, // 根节点的 parentId 必须为 null
  isLeaf: true, // 是否是叶子节点
  path: [0, 1, 2], // 节点路径
  checked: false,  // 可选
  disabled: false, // 可选
  childrenCount: 0， // 可选
}
```

## Attributes

| 参数          | 说明                                                | 类型           | 可选值                                                  | 默认值               |
| ------------- | --------------------------------------------------- | -------------- | ------------------------------------------------------- | -------------------- |
| list          | 扁平化的 tree                                       | Array          | --                                                      | []                   |
| checkedList   | 选中的叶子节点, 由 id 组成的数组，结合 v-model 使用 | Array          | --                                                      | []                   |
| hasInput      | 是否含有过滤输入框                                  | Boolean        | --                                                      | false                |
| placeholder   | 过滤输入框的 placeholder，配合 hasInput 使用        | String         | --                                                      | 请输入关键字进行查找 |
| indent        | 缩进                                                | String, Number | --                                                      | 15                   |
| height        | 容器高度                                            | String, Number | --                                                      | 600                  |
| expandLevel   | 展开程度                                            | String, Number | 'all',1,2,3,,,                                          | 'all'                |
| isLoading     | 是否展示加载中                                      | Boolean        | --                                                      | false                |
| checkedAction | 操作 label 执行选中                                 | String         | 'none': 不选中；'click': 单击选中；'dblclick': 双击选中 | 'none'               |
| emptyText     | 内容为空展示的文本                                  | String         | --                                                      | '暂无数据'           |
| showCheckbox  | 是否展示 checkbox                                   | Boolean        | --                                                      | false                |

## 方法

| 事件名称        | 说明                     | 参数                |
| --------------- | ------------------------ | ------------------- |
| setCheckedKeys  | 回显选中状态             | id 组成的数组       |
| setCheckedNodes | 回显选中状态             | node 节点组成的数组 |
| getCheckedKeys  | 返回 id 组成的数组       | --                  |
| getCheckedNodes | 返回 node 节点组成的数组 | --                  |

## Events

| 事件名称     | 说明             | 回调参数 |
| ------------ | ---------------- | -------- |
| onChange     | 选中状态变化触发 | nodeList |
| onClickLabel | 点击 label 触发  | node     |

## Scoped Slot

| name    | 说明                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------- |
| default | label 的 slot， eg： `<span slot-scope="{ slotScope }"><i>&#9733;</i> {{ slotScope.label }}</span>` |