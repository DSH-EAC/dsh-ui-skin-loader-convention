# example.minimal —— 最小皮肤参考骨架

这是公约 §9 伪码落成的**文档性质参考骨架**，用来说明"一个遵循公约的皮肤至少长什么样"，不要求能装进 DSH 实机运行。可运行的完整示例（极光之夜、水墨青烟等内置皮肤）见参考实现仓库 [`DSH-EAC/dsh-ui-skin-loader`](https://github.com/DSH-EAC/dsh-ui-skin-loader)。三个文件各司其职：`package.json` 展示公约 §3 的唯一强制声明 `dsh.skin` 与标准 DSH 插件 client 半声明形态；`client.ts` 展示"登记元数据 + activate/deactivate 空实现"的最小骨架，注释逐条标明对应红线。

## 发布前自检（公约 §9，每题必须答"是"，逐条引用）

- [ ] 未激活时，我的插件除了登记元数据什么都不做？（R1）——对应 `client.ts` 的 R1 注释与"此处只登记元数据"行内注释
- [ ] `deactivate` 之后，宿主观感与我从未激活时逐像素一致？（§4.3）——对应 `client.ts` 的 R8 注释与 `deactivate` 行内注释
- [ ] 我没有碰加载器保留面、其他皮肤、宿主恢复面？（R2/R3/R4）——对应 `client.ts` 的 R2/R3/R4 注释与 `activate` 行内注释
- [ ] 我没有依赖任何 CSS-module hash / 私有 DOM / HMR 内部？（R5）——对应 `client.ts` 的 R5 注释与 `activate` 行内注释
- [ ] 我不会自己记住"激活"状态、不会自启？（R6）——对应 `client.ts` 的 R6 注释
- [ ] 我没有启停或改写任何其他插件？（R7）——对应 `client.ts` 的 R7 注释
