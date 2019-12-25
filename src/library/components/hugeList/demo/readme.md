## Attributes

| 参数       | 说明               | 类型           | 可选值 | 默认值     |
| ---------- | ------------------ | -------------- | ------ | ---------- |
| itemHeight | 每一项的高度       | String, Number | --     | 32         |
| isLoading  | 是否展示加载中     | Boolean        | --     | false      |
| emptyText  | 内容为空展示的文本 | String         | --     | '暂无数据' |

## 方法

| 方法名称 | 说明      | 参数             |
| -------- | --------- | ---------------- |
| setData  | 设置 list | list(Array 类型) |

## Events

| 事件名称 | 说明             | 回调参数 |
| -------- | ---------------- | -------- |
| onClick  | 点击某项触发回调 | item     |

## Scoped Slot

| name    | 说明                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------- |
| default | 每一项的 slot， eg： `<span slot-scope="{ slotScope }"><i>&#9733;</i> {{ slotScope.label }}</span>` |
| loading | loading 的 slot， eg： `<i slot="loading">Loading</i>`                                              |
