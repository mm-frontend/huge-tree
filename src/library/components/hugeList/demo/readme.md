## Attributes

| 参数       | 说明               | 类型           | 可选值 | 默认值     |
| ---------- | ------------------ | -------------- | ------ | ---------- |
| list       | 列表数据           | Array          | --     | []         |
| height     | 容器高度           | String, Number | --     | 600        |
| itemHeight | 每一项的高度       | String, Number | --     | 32         |
| isLoading  | 是否展示加载中     | Boolean        | --     | false      |
| emptyText  | 内容为空展示的文本 | String         | --     | '暂无数据' |

## Scoped Slot

| name    | 说明                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------- |
| default | 每一项的 slot， eg： `<span slot-scope="{ slotScope }"><i>&#9733;</i> {{ slotScope.label }}</span>` |
| loading | loading 的 slot， eg： `<i slot="loading">Loading</i>`                                              |
