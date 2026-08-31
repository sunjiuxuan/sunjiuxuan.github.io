# 《千面虎工坊》项目图片资源存放指引

本项目已采用“高阶降级渲染”机制。即使未放入任何真实图片，系统也会以**新中式非遗艺术印记与渐变色卡**进行专业级排版展示。

当你需要替换为自己拍摄或绘制的实物摄影图时，请按照以下目录规范与推荐尺寸存放图片：

---

### 📁 1. 首页轮播大图 (`/images/banner/`)
- **文件路径**：`images/banner/home_banner.png`
- **推荐尺寸**：`750 × 380 px`（比例约 2:1，支持 JPG / PNG / WebP）
- **拍摄/设计建议**：皮老虎实物横版特写或非遗展厅大片，色调以深红、暖金、黑褐为主。
- **生效方式**：放入图片后，将 `pages/index/index.js` 中的 `hasBannerImg` 设为 `true`。

---

### 📁 2. 首页商品列表图 (`/images/goods/`)
- **推荐尺寸**：`400 × 400 px`（正方形 1:1，PNG 或白色底 JPG）
- **文件列表**：
  - `images/goods/goods_tiger_01.png` —— **经典朱砂赤纹皮老虎**
  - `images/goods/goods_tiger_02.png` —— **国潮青绿金鳞皮老虎**
  - `images/goods/goods_tiger_03.png` —— **纳福刺绣布艺皮老虎**
  - `images/goods/goods_tiger_04.png` —— **岁岁安康双音皮老虎**
- **生效方式**：放入图片后，在 `pages/index/index.js` 对应商品对象中将 `hasImg` 设为 `true`。

---

### 📁 3. 定制工坊实物图 (`/images/diy/`)
- **推荐尺寸**：
  - 大图预览：`600 × 600 px`（透明底 PNG，效果最佳）
  - 部件小图：`200 × 200 px`（透明底 PNG）
- **文件列表**：
  - `images/diy/tiger_preview_default.png` —— **实时拼装舞台大图**
  - `images/diy/head_clay.png` —— **传统泥头**
  - `images/diy/head_fabric.png` —— **萌系布头**
  - `images/diy/head_color.png` —— **国潮彩绘头**
  - `images/diy/bellows_cow.png` —— **牛皮风箱**
  - `images/diy/bellows_sheep.png` —— **羊皮风箱**
- **生效方式**：放入图片后，在 `pages/diy/diy.js` 中将 `hasCustomImg` 设为 `true`。

---

### 📁 4. 购物车商品图 (`/images/cart/`)
- **推荐尺寸**：`200 × 200 px`（正方形 PNG / JPG）
- **文件列表**：
  - `images/cart/cart_tiger_01.png` —— **定制工坊 · 刺绣萌趣款**
  - `images/cart/cart_tiger_02.png` —— **定制工坊 · 青绿描金典藏款**
- **生效方式**：放入图片后，在 `pages/cart/cart.js` 中将 `hasImg` 设为 `true`。

---

### 📁 5. 个人中心头像 (`/images/avatar/`)
- **推荐尺寸**：`200 × 200 px`（正方形圆形剪裁）
- **文件路径**：`images/avatar/user_avatar.png`
- **生效方式**：放入图片后，在 `pages/user/user.js` 中将 `hasAvatar` 设为 `true`。
