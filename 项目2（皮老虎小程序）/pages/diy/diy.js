Page({
  data: {
    activeTab: 'head', // 'head' | 'bellows'
    basePrice: 88,
    totalPrice: 88,
    selectedHeadId: 1,
    selectedBellowsId: 1,
    hasCustomImg: false,
    currentPreviewImg: "/images/diy/tiger_preview_default.png",
    
    // 虎头模块数据 (3个选项)
    headOptions: [
      {
        id: 1,
        name: "传统泥头",
        desc: "黄胶泥手工雕塑",
        material: "古法黄泥",
        shortChar: "泥",
        priceOffset: 0,
        accentColor: "#B8281B",
        bgGradient: "linear-gradient(135deg, #B8281B 0%, #8D180E 100%)",
        imgPath: "/images/diy/head_clay.png"
      },
      {
        id: 2,
        name: "萌系布头",
        desc: "织锦软绒手工刺绣",
        material: "刺绣织锦",
        shortChar: "布",
        priceOffset: 12,
        accentColor: "#BD8B4E",
        bgGradient: "linear-gradient(135deg, #BD8B4E 0%, #916127 100%)",
        imgPath: "/images/diy/head_fabric.png"
      },
      {
        id: 3,
        name: "国潮彩绘头",
        desc: "青绿描金金丝重彩",
        material: "矿彩描金",
        shortChar: "彩",
        priceOffset: 20,
        accentColor: "#2E5A44",
        bgGradient: "linear-gradient(135deg, #2E5A44 0%, #1A3C2B 100%)",
        imgPath: "/images/diy/head_color.png"
      }
    ],

    // 风箱模块数据 (2个选项)
    bellowsOptions: [
      {
        id: 1,
        name: "牛皮风箱",
        desc: "精选生熟黄牛皮·厚韧耐拉",
        material: "天然黄牛皮",
        shortChar: "牛",
        priceOffset: 0,
        accentColor: "#7A4A28",
        bgGradient: "linear-gradient(135deg, #7A4A28 0%, #543015 100%)",
        imgPath: "/images/diy/bellows_cow.png"
      },
      {
        id: 2,
        name: "羊皮风箱",
        desc: "柔软细腻山羊皮·鸣声清脆",
        material: "特级白山羊皮",
        shortChar: "羊",
        priceOffset: 10,
        accentColor: "#9C7654",
        bgGradient: "linear-gradient(135deg, #9C7654 0%, #6E4D31 100%)",
        imgPath: "/images/diy/bellows_sheep.png"
      }
    ],

    currentHead: { id: 1, name: "传统泥头", material: "古法黄泥", priceOffset: 0, accentColor: "#B8281B" },
    currentBellows: { id: 1, name: "牛皮风箱", material: "天然黄牛皮", priceOffset: 0, accentColor: "#7A4A28" }
  },

  onLoad() {
    this.recalculatePrice();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  selectHead(e) {
    const id = e.currentTarget.dataset.id;
    const selected = this.data.headOptions.find(item => item.id === id);
    this.setData({
      selectedHeadId: id,
      currentHead: selected
    });
    this.recalculatePrice();
  },

  selectBellows(e) {
    const id = e.currentTarget.dataset.id;
    const selected = this.data.bellowsOptions.find(item => item.id === id);
    this.setData({
      selectedBellowsId: id,
      currentBellows: selected
    });
    this.recalculatePrice();
  },

  recalculatePrice() {
    const total = this.data.basePrice + this.data.currentHead.priceOffset + this.data.currentBellows.priceOffset;
    this.setData({ totalPrice: total });
  }
})
