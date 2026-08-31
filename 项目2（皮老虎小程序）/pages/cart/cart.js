Page({
  data: {
    totalAmount: 218,
    // 写死 2 条定制皮老虎购物车数据
    cartItems: [
      {
        id: 101,
        name: "定制工坊 · 刺绣萌趣款皮老虎",
        specs: "萌系布头 + 牛皮风箱",
        price: 100,
        count: 1,
        selected: true,
        shortTag: "萌趣",
        hasImg: false,
        imagePath: "/images/cart/cart_tiger_01.png",
        bgGradient: "linear-gradient(135deg, #BD8B4E 0%, #916127 100%)"
      },
      {
        id: 102,
        name: "定制工坊 · 青绿描金典藏款皮老虎",
        specs: "国潮彩绘头 + 羊皮风箱",
        price: 118,
        count: 1,
        selected: true,
        shortTag: "青绿",
        hasImg: false,
        imagePath: "/images/cart/cart_tiger_02.png",
        bgGradient: "linear-gradient(135deg, #2E5A44 0%, #1A3C2B 100%)"
      }
    ]
  }
})
