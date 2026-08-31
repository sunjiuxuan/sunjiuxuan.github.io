Page({
  data: {
    hasAvatar: false, // 放入 /images/avatar/user_avatar.png 后可设为 true
    userInfo: {
      nickname: "非遗守艺人",
      role: "天字号·传承人"
    },
    // 订单状态区（使用矢量图形类型）
    orderStatusList: [
      { name: "待付款", iconType: "pay", count: 1 },
      { name: "待发货", iconType: "send", count: 1 },
      { name: "待收货", iconType: "receive", count: 0 },
      { name: "退换售后", iconType: "service", count: 0 }
    ],
    // 底部专属非遗服务列表
    menuList: [
      {
        title: "匠人手记与晒单",
        desc: "已发布 2 条典藏评价"
      },
      {
        title: "浚县皮老虎非遗研学",
        desc: "暑期传承特训营"
      },
      {
        title: "非遗工坊专属客服",
        desc: "09:00 - 22:00 守候"
      },
      {
        title: "作品证书防伪查询",
        desc: "一物一码大师溯源"
      }
    ]
  }
})
