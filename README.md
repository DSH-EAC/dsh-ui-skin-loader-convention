# DSH UI 皮肤加载公约（UI Skin Loader Covenant）

一份**弱约束**公约：只定义"皮肤插件"与"加载器"之间的最小接缝——皮肤不占用什么、何时被启用、收到什么、何时必须彻底关闭。协议 id：`dsh.ecosystem.ui-skin-loader/v1`，状态：Experimental。

**规范正文：[convention.md](./convention.md)**（v1 定稿文本；本 README 只是门面摘要，一切以正文为准）。

## 它只约束什么

1. **不占用什么**——未激活零副作用，以及八条红线 R1-R8（公约 §5）；
2. **生命周期两个语义事件**——`skin/activate` / `skin/deactivate`，全局互斥、彻底关闭、"退出后不可观测"（公约 §4）；
3. **扩展槽位只新增**——槽位集只增、不改、不删，皮肤可以完全忽略槽位（公约 §6，纯可选）。

除此之外的一切——包格式、故障隔离细则、皮肤内部实现、宿主特化——公约刻意不做（公约 §7）。

## 与相邻体系的分工

本公约与 `DSH-EAC/dsh-ui-skin-manager`、`DSH-EAC/DSH-Desktop-EAC-UI-Skin-Authoring-Convention` 三者在公约层接缝、互不重叠、互不竞争：**强契约**的包格式、事务与故障隔离体系（ADR 0001-0003）属于 `dsh-ui-skin-manager`，本公约刻意不碰；**EAC 桌面宿主**的槽位拓扑与能力边界由 `DSH-Desktop-EAC-UI-Skin-Authoring-Convention` 规定，它是本公约之下的一种宿主实现约定，两者不重叠、不竞争。本公约只负责跨宿主、实现无关的**加载启停弱约束**。

## 版本与兼容

公约版本轴为 `dsh.ecosystem.ui-skin-loader/v{N}`，仅当 §3/§4/§5 发生语义破坏时升 major；新增可选字段与新增 §6 槽位不升版本；加载器忽略未知字段、皮肤忽略未知槽位，双向宽容（公约 §8）。

## 示例

[`examples/minimal-skin/`](./examples/minimal-skin/) 是公约 §9 的文档性质参考骨架；可运行的完整示例随参考实现仓库 `DSH-EAC/dsh-ui-skin-loader` 的内置皮肤发布。

## License

MIT
