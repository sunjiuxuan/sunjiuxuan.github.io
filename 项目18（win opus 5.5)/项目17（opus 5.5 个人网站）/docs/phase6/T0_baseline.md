# Phase 6 · T0 视觉基线修正（Baseline Fix）— Gemini 执行卡

> 只做本卡内容。不得顺手改地形 / 树 / 花瓣 / 节点 / 大门几何。不新增 Shader。
> 本卡目标：用"删减 + 参数校正"，把世界从"深色科幻 Demo"拉回"晨雾中的明亮山水"，并去掉无意义的渲染开销。

## 0. 为什么先做这个（诊断依据，均来自现有代码）

| # | 现状（文件） | 问题 |
|---|---|---|
| 1 | `RealmApp.tsx` fog 颜色 `#1A1D24`（近黑藏青） | 与晨曦天空完全矛盾；远处物体被"染黑"而不是"融入雾" |
| 2 | `fxProxy.fogDensity` 探索期终值 `0.004` | 60 单位外仅约 6% 雾，几乎没有空气透视，看得到世界边缘 |
| 3 | `World.tsx` 使用 drei `<Sky>`（Preetham 物理天空） | 写实西式蓝天，地平线与雾色断层；之后由自定义天穹替代（T1） |
| 4 | `PostFX.tsx` Bloom `luminanceThreshold 0.5` | 浅色地形 `#EAE5D9` 本身超阈值 → 整个画面发"奶白糊"，这是廉价感主因之一 |
| 5 | `PostFX.tsx` 常驻 `ChromaticAberration` | 宁静山水不需要色散；常驻一个无用效果 |
| 6 | `PostFX.tsx` `disableNormalPass` | v3 已无此 prop（应为 `enableNormalPass`），属无效属性，需删除 |
| 7 | `Water.tsx` `meshPhysicalMaterial transmission` | transmission 会额外渲染一次整个场景到 RT；且正是"玻璃/塑料感"来源 |
| 8 | `GateStage.tsx` `Stars` 5000 + `Sparkles` | 星空+闪粒 = 太空/科幻语义，与"桃花源入口"冲突 |
| 9 | `World.tsx` 平光 `ambientLight` | 无天空/地面色差，体积感为零 |

## 1. 任务清单

### 1.1 新建 `src/realm/art/palette.ts`（唯一色彩来源）
导出常量（sRGB hex + 一个太阳方向）。建议初值（可微调，但须保持冷暖关系）：
- `MIST`：`#E6E1D3`（暖米白雾，= 留白）
- `SKY_ZENITH`：`#BFD3D0`（淡青，T1 天穹用，本卡仅定义）
- `HEMI_SKY`：`#DCE8E4`，`HEMI_GROUND`：`#7A7F5A`（青白天光 / 暖橄榄地面反光）
- `SUN_COLOR`：`#FFE2C2`
- `SUN_DIR`：低角度晨光，仰角约 18°，方位从"入口回望方向的左后方"打过来（让揭幕镜头看到逆光桃林）。导出为归一化 `[x,y,z]`。
- `WATER_TINT`：`#9FBDB4`

### 1.2 雾与背景（`RealmApp.tsx`, `fxProxy.ts`, `introTimeline.ts`）
- `fogExp2` 颜色改为 `MIST`；同时设置 `scene.background = MIST`（`<color attach="background" />`）。地平线必须与雾无缝。
- `introTimeline.ts` 中 `fogDensity` 终值 `0.004 → 0.012`（验收时可在 0.010–0.016 区间调；标准：60 单位处物体明显变淡、100 单位处几乎融进雾）。
- 门阶段初值 `0.06` 保持不变。

### 1.3 移除 drei `<Sky>`（`World.tsx`）
直接删除。T1 会做与雾同色系的渐变天穹。本卡接受"纯雾色背景"。

### 1.4 灯光（`World.tsx`）
- `ambientLight` → `hemisphereLight`（`HEMI_SKY` / `HEMI_GROUND`，强度约 0.9）。
- `directionalLight` 位置 = `SUN_DIR * 60`，颜色 `SUN_COLOR`，强度约 1.8。
- 不开启阴影（Canvas 目前本就没有 `shadows`，保持现状，阴影另立任务）。

### 1.5 后期（`PostFX.tsx`, `fxProxy.ts`, `introTimeline.ts`）
- 删除 `ChromaticAberration` 及其 ref/useFrame 写入；`fx.ca` 字段与时间轴里对 `ca` 的 tween 可保留（无副作用）或一并删除，二选一但须保证时间轴不报错。
- 删除无效的 `disableNormalPass` 属性。
- Bloom：`luminanceThreshold 0.9`、`luminanceSmoothing 0.2`、`mipmapBlur` 保留。
- `fx.bloom` 默认值 `0.8 → 0.4`；时间轴中峰值 `3.5 → 1.6`，回落值 `0.8 → 0.4`。
- DOF `bokehScale` 聚焦目标 `6 → 3`（DOF 对焦目标修正属于后续节点任务，本卡不动）。
- **色调映射核查（必须做）**：确认在 EffectComposer 管线下 ACES 是否真的生效。方法：临时把 `gl.toneMapping` 改为 `NoToneMapping` 对比截图；若画面无差异 → 说明未生效，则在 Composer 末尾加入 `<ToneMapping mode={ToneMappingMode.ACES_FILMIC} />` 并把 Canvas `toneMapping` 设为 `NoToneMapping`，避免双重映射。把结论写进汇报。

### 1.6 水面临时降级（`Water.tsx`）
`meshPhysicalMaterial` → `meshStandardMaterial`：`color WATER_TINT`、`roughness 0.25`、`metalness 0`、`transparent`、`opacity 0.78`、`depthWrite false`。删除 `transmission / ior`。（真正的水 Shader 是后续任务。）

### 1.7 门场景减法（`GateStage.tsx`）
删除 `Stars` 与 `Sparkles` 及其 import。其余（门几何、runes、时间轴引用）一律不动。

## 2. 禁止事项
- 不改 `useRealmStore` API、`fx`/`camProxy` 已有字段名、`IntroRefs`、`Gate` 的 ref 结构、`ZONES`、`placeNodes`。
- 不新增任何 Shader、粒子、几何体、外部资源。
- 不改相机路径、时长、相位切换时刻。

## 3. 验收（全部满足才算完成）
**视觉（各截一张图放进汇报）**
1. 门阶段：门为暗色剪影，立在米白雾中，无星空。
2. 揭幕结束（`exploring` 刚开始）：地形不再整体泛白发光；远山/远树逐层淡入雾；看不到平面边界线。
3. 罗盘飞到"浮生湖"：水面不再像玻璃板，呈淡青半透明。
4. 地平线处背景与雾色无可见分界。

**性能**：在 `exploring` 静止时，用 `gl.info.render.calls` 与 `gl.info.render.triangles` 各打印一次（改前 / 改后），写进汇报。改后调用数不应增加。

**回归**：`loading → gate → entering → descending → exploring → focusing（点节点）→ ESC → exploring` 全流程正常；罗盘飞行正常；`/admin` 可打开；控制台无新报错；`cmd.exe /c "npx tsc --noEmit"` 无新增类型错误（Windows PowerShell 有执行策略限制，命令一律经 `cmd.exe /c`）。

## 4. 汇报格式
- 修改文件列表
- 色调映射核查结论
- draw calls / triangles 改前改后
- 4 张截图
- 发现但未处理的问题（只记录，不要修）
