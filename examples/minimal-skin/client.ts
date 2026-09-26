/**
 * example.minimal —— 公约 §9 最小皮肤的参考骨架（文档性质，不要求实机可运行）。
 *
 * API 形态（经参考实现实机核对：client bundle 顶层 `exports.inject` 是 cordis
 * 服务注入，`exports.apply(ctx)` 被 vendored Loader 在服务就绪后调用）：顶层导出
 * `inject`（服务名数组）与 `apply(ctx)`；apply 内经加载器服务对象
 * `ctx.uiSkinLoader.registerSkin(...)` 登记，并把反登记包进 `ctx.effect`。
 * 注意 package.json 的 `dsh.client.inject` 是包名依赖声明（informational），
 * 不承担服务注入职责——服务注入只看 bundle 顶层的 `exports.inject`。
 *
 * 红线速查（公约 §5）与本骨架的对应关系（自检表逐条映射，见本目录 README.md）：
 * - R1 未激活零副作用：本文件在收到 `activate` 之前唯一的行为是向加载器登记元数据；
 *   不注入 DOM/CSS/主题覆盖，不注册壳级槽位内容，不挂全局监听/定时器。
 * - R2 不占用加载器保留面：骨架不渲染加载器控制台 UI，不占用保留 service 名
 *   `uiSkinLoader`、保留 settings 命名空间 `dsh-ui-skin-loader`、保留槽位 id 前缀
 *   `io.github.dsh-eac.skin.loader.*`（只在 inject 中"使用"保留 service，不"占用"它）。
 * - R3 不触碰其他皮肤 / R4 不触碰宿主恢复面：骨架没有任何样式化或挂载行为，
 *   不读写其他皮肤与宿主崩溃页、诊断页、回退观感、窗口控制件。
 * - R5 不依赖非 ABI：骨架不引用 CSS-module hash、上游私有 DOM/类名、源码路径、HMR 内部。
 * - R6 不自行持久激活：激活与否由加载器单点裁决；骨架不记忆、不自启、不自我恢复。
 * - R7 不启停他人：骨架不启用/禁用/改写任何其他插件。
 * - R8 退出即净：`deactivate` 撤销激活以来的全部副作用，满足 §4.3"退出后不可观测"；
 *   推荐把全部副作用登记进 `ctx.effect`，由 fiber dispose 自动逆序释放。
 */

/** 公约 §4.2：`skin/activate` 的载荷 SkinContext（字段节选，仅为可读性）。 */
export interface SkinContext {
  /** 加载器句柄（service 名 `uiSkinLoader` 是加载器保留面，皮肤只可使用、不可占用——R2） */
  readonly loader: unknown;
  /** 结构化 logger */
  readonly logger: unknown;
  /** 中止信号 */
  readonly signal: AbortSignal;
}

/** 皮肤向加载器登记的元数据与启停回调（公约 §4.2 的两个语义事件）。 */
export interface SkinRegistration {
  /** 与 package.json `dsh.skin.apiVersion` 一致（公约 §3） */
  readonly apiVersion: "dsh.ecosystem.ui-skin-loader/v1";
  /** 与 package.json `dsh.skin.id` 一致（公约 §3） */
  readonly id: string;
  /** 与 package.json `dsh.skin.name` / `version` 一致（仅为展示与诊断） */
  readonly name: string;
  readonly version: string;
  /** `skin/activate`：自此才允许产生可见副作用；副作用必须可逆（公约 §4.2） */
  readonly activate: (context: SkinContext) => void | Promise<void>;
  /** `skin/deactivate`：彻底关闭——撤销激活以来的全部副作用（公约 §4.2 / R8） */
  readonly deactivate: () => void | Promise<void>;
}

/** 加载器暴露给皮肤的最小表面（真实类型随参考实现仓库提供，此处仅声明骨架所需）。 */
export interface UiSkinLoaderService {
  /** 登记皮肤元数据与启停回调；返回反登记函数。登记 ≠ 激活（公约 §3） */
  registerSkin: (registration: SkinRegistration) => () => void;
}

/** 宿主 client 上下文的最小表面（Cordis ctx，节选自公约 §9 伪码用到的两个能力）。 */
interface ClientContext {
  /** 加载器服务（由顶层 `exports.inject = ["uiSkinLoader"]` 等待就绪后可用） */
  readonly uiSkinLoader: UiSkinLoaderService;
  /** 登记进 effect 的副作用由 fiber dispose 自动逆序释放（公约 §4.2 / R8 推荐） */
  effect(dispose: () => void | (() => void), label?: string): void;
}

const SKIN_ID = "example.minimal";

/** client bundle 顶层：cordis 服务注入（还需要 slots/theme/locale 等服务时自行追加）。 */
export const inject: string[] = ["uiSkinLoader"];

/** client apply（Loader 材料化本 bundle 后以 entry fiber 调用）。 */
export function apply(ctx: ClientContext): void {
  // R1：未激活零副作用 —— 此处只登记元数据，不做任何可见副作用。
  const unregister = ctx.uiSkinLoader.registerSkin({
    apiVersion: "dsh.ecosystem.ui-skin-loader/v1",
    id: SKIN_ID,
    name: "最小皮肤",
    version: "0.1.0",

    // skin/activate：自此才产生副作用；全部经 ctx.effect 登记。
    activate: (_context: SkinContext) => {
      // TODO(皮肤作者)：在这里产生全部可见副作用（DOM/CSS/主题/槽位内容），
      // 且每一笔都登记进 ctx.effect；不得触碰 R2/R3/R4/R5 所列对象。
    },

    // skin/deactivate：撤销一切；退出后不可观测（R8，公约 §4.3）。
    deactivate: () => {
      // TODO(皮肤作者)：撤销 activate 以来登记的全部副作用，
      // 宿主观感与"从未激活时"逐像素一致。
    },
  });

  // fiber dispose 时自动反登记（宿主在插件管理器里停用本包时的正道，公约 §4.3-3）。
  ctx.effect(() => unregister);
}
