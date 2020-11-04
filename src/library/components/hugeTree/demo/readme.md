> 海量数据建议不要放到 data 里，vue 依赖收集会导致内存占用过多。所以此插件没有使用 props 传递海量数据，而是通过 setData(data) 方法。

## node 节点样例

```
{
  id: 0,
  label: '全部',
  parentId: null, // 根节点的 parentId 必须为 null
  disabled: false, // 可选
  children: [
    {
      id: 1,
      label: '全部',
      parentId: 0, // 根节点的 parentId 必须为 null
      disabled: false, // 可选
      children: null
    }
  ]
},
```

## Attributes

| 参数                 | 说明                                                                                         | 类型           | 可选值                                                  | 默认值               |
| -------------------- | -------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------- | -------------------- |
| hasInput             | 是否含有过滤输入框,输入框过滤支持多个关键词,逗号隔开(中英都可以),eg: '位置 1，位置 2,位置 3' | Boolean        | --                                                      | false                |
| placeholder          | 过滤输入框的 placeholder，配合 hasInput 使用                                                 | String         | --                                                      | 请输入关键字进行查找 |
| indent               | 缩进                                                                                         | String, Number | --                                                      | 15                   |
| expandLevel          | 展开程度                                                                                     | String, Number | 'all',1,2,3,,,                                          | 'all'                |
| expandKeys           | 指定 id 展开, 若指定 id 展开，则 expandLevel 失效                                            | Array          |                                                         | []                   |
| isLoading            | 是否展示'加载中...'指示状态                                                                  | Boolean        | --                                                      | false                |
| checkedAction        | 操作 label 执行选中                                                                          | String         | 'none': 不选中；'click': 单击选中；'dblclick': 双击选中 | 'none'               |
| emptyText            | 内容为空展示的文本                                                                           | String         | --                                                      | '暂无数据'           |
| showCheckbox         | 是否展示 checkbox                                                                            | Boolean        | --                                                      | false                |
| showCheckboxLeafOnly | 是否仅叶子节点展示 checkbox, 配合 showCheckbox = true 才有效。                               | Boolean        | --                                                      | false                |
| defaultCheckedKeys   | 默认选中, setData 之后赋值。                                                                 | Array          | --                                                      | []                   |
| checkStriclty        | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法                                     | Boolean        | --                                                      | false                |

## 方法

| 方法名称        | 说明                                 | 参数                                                           |
| --------------- | ------------------------------------ | -------------------------------------------------------------- |
| setData         | 设置 tree                            | tree(Array 类型)                                               |
| setCheckedKeys  | 回显选中状态                         | id 组成的数组                                                  |
| setCheckedNodes | 回显选中状态                         | node 节点组成的数组                                            |
| getCheckedKeys  | 返回 id 组成的数组                   | --                                                             |
| getCheckedNodes | 返回 node 节点组成的数组             | --                                                             |
| clearChecked    | 清空所有选中                         | --                                                             |
| setExpand       | 指定 id 展开                         | id 组成的数组                                                  |
| showCheckedOnly | 只展示选中的项，此方法会置空过滤条件 | isOnlyInCheckedSearch, 是否只在选中的节点里进行筛选, 默认 true |
| restore         | 对 showCheckedOnly 之后进行恢复      | --                                                             |
| update          | 手动更新选中状态                     | --                                                             |
| clear           | 清空内存占用                         | --                                                             |

## Events

| 事件名称        | 说明                                   | 回调参数                         |
| --------------- | -------------------------------------- | -------------------------------- |
| onChange        | 选中状态变化触发                       | （{ checkedKeys, checkedNodes }) |
| onClickLabel    | 点击 label 触发                        | node                             |
| onClickCheckbox | 点击 checkbox 触发, 获取当前点击的节点 | node                             |

## Scoped Slot

| name      | 说明                                                                                                |
| --------- | --------------------------------------------------------------------------------------------------- |
| default   | label 的 slot， eg： `<span slot-scope="{ slotScope }"><i>&#9733;</i> {{ slotScope.label }}</span>` |
| pre-input | input 输入框前的 slot， eg： `<span slot="pre-input">https://</span>`                               |
| loading   | 自定义加载中 slot， eg： `<i slot="loading">加载中...</i>`                                          |
