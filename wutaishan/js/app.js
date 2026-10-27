/* 汇报网站主程序：三维对比、图表、计算器 */
(function () {
  var WT = window.WT, C = WT.charts, D = window.WT_DATA, P = window.WT_PLAN, G = window.WT_GEO;
  var $ = function (id) { return document.getElementById(id); };
  var fmt = C.fmt;

  var PEAKS = [
    { k: '东台', g: '晨', n: '东台 · 望海峰', alt: 2795, temple: '望海寺', t: '听海 · 晨课声场', d: '东台是看日出和云海的地方。日出前后，观众戴上耳机听五台山佛乐晨课录音，与山风、云海同步。' },
    { k: '北台', g: '雪', n: '北台 · 叶斗峰', alt: 3061, temple: '灵应寺', t: '叶斗经藏 · 非遗种子库', d: '北台海拔3061米，号称“华北屋脊”。在最高处设立象征性的非遗数字“种子库”，每年封存一份传承人年度记录。' },
    { k: '中台', g: '石', n: '中台 · 翠岩峰', alt: 2893, temple: '演教寺', t: '翠岩匠作 · 石与刻', d: '中台以山石著称。这里展示石雕、碑刻与拓印，观众可以亲手拓一张五台山碑刻纹样带走。' },
    { k: '西台', g: '月', n: '西台 · 挂月峰', alt: 2773, temple: '法雷寺', t: '挂月夜话 · 礼俗剧场', d: '西台以赏月闻名。夏季月夜举办“非遗夜话”，讲骡马大会、朝台礼俗的故事。' },
    { k: '南台', g: '花', n: '南台 · 锦绣峰', alt: 2485, temple: '普济寺', t: '锦绣百草 · 康养素食', d: '南台夏季开满高山野花。这里讲五台山的药草、素食与康养智慧，提供节气素斋茶点。' }
  ];

  // ================= 三维 =================
  var host = $('hero3d'), side = $('side'), api = null;
  var S = { mode: 'now', area: 'region', night: false, labels: true, rotate: true, xray: false, route: true, preset: null };
  var PRESET_NAMES = {
    region: [['overview', '全景'], ['north', '南望北台'], ['west', '西望'], ['heart', '心馆一带']],
    taihuai: [['aerial', '鸟瞰'], ['town', '寺院群'], ['compare', '三处候选'], ['site', '心馆场地'], ['eye', '人视']],
    court: [['aerial', '鸟瞰'], ['eye', '庭院'], ['gate', '入口'], ['side', '侧面'], ['top', '俯视']]
  };
  var LEGEND = {
    'region-now': [['#f3e7c6', '主要道路（大石线等）'], ['#fff6e0', '小路与山路'], ['#7fb6e0', '河流']],
    'region-plan': [['#cf5a40', '朝台径（约71公里）'], ['#d9b45a', '心馆与五台驿亭', 1], ['#d9b45a', '一村一艺工坊村落', 1], ['#f3e7c6', '主要道路']],
    'taihuai-now': [['#d6d0c4', '既有建筑（开放地图）'], ['#a65a40', '寺院建筑'], ['#f3e7c6', '主要道路']],
    'taihuai-plan': [['#d9b45a', '推荐场地与入口道路'], ['#8fb3c9', '备选场地'], ['#8e9a88', '生态停车'], ['#a9d6ff', '声音地图点位', 1]],
    'court': [['#c89a3c', '参观流线'], ['#2c6a6f', '选中的分区']]
  };
  function setPressed(sel, fn) { document.querySelectorAll(sel).forEach(function (b) { b.setAttribute('aria-pressed', String(fn(b))); }); }

  function sideDefault() {
    var key = S.area === 'court' ? 'court' : S.area + '-' + S.mode, html = '';
    if (key === 'region-now') html = '<div class="k">现状 · 全域五台</div><h3>五座台顶环抱台怀镇</h3><div class="facts"><span>范围约22.5 × 24.3公里</span><span>最高点北台3061米</span></div><p>台怀镇坐落在五台环抱的Y形河谷中，寺院沿河谷集中分布。开放地图在本范围内标注了' + G.osm.temples.length + '处寺院、' + G.osm.buildings.length + '栋建筑。</p><p>切换到<b>方案实施后</b>，看心馆、五台驿亭和朝台径落在哪里。</p>';
    else if (key === 'region-plan') html = '<div class="k">方案 · 全域五台</div><h3>一心 · 五台 · 一径</h3><div class="facts"><span>朝台径约71公里</span><span>九成以上利用既有道路与山路</span></div><p>心馆设在台怀镇南侧杨柏峪，五座台顶各设一处轻型驿亭，红线为按真实地形和既有道路计算的朝台径。</p><p>点击金色标注查看每座台顶的主题。</p>';
    else if (key === 'taihuai-now') html = '<div class="k">现状 · 台怀镇</div><h3>寺院沿河谷集中</h3><div class="facts"><span>范围约5.2 × 5.3公里</span><span>海拔约1,590–2,360米</span></div><p>塔院寺大白塔是全镇的视觉中心，显通寺、菩萨顶、黛螺顶等寺院集中在北侧。南侧杨柏峪一带地势平缓，沿大石线分布有酒店和服务设施。</p>';
    else if (key === 'taihuai-plan') html = '<div class="k">方案 · 台怀镇</div><h3>心馆落在杨柏峪南</h3><div class="facts"><span>平均坡度2.6°</span><span>距大石线约68米</span><span>距塔院寺约2.4公里</span></div><p>在推荐场地平整出一块台地，建设合院式心馆，配约60个生态停车位，入口道路接大石线。三处候选地都已标出，点击可比较。</p>';
    else html = '<div class="k">一期 · 心馆</div><h3>合院式“清凉之心”</h3><div class="facts"><span>建筑面积约1,200㎡</span><span>9个功能分区</span><span>标准参观约100分钟</span></div><p>点击建筑或标注查看每个分区的展陈内容；打开“揭顶看展陈”可以看到殿内的展柜布置。</p>';
    var lg = LEGEND[key] || [];
    side.innerHTML = html + '<div class="legend3d">' + lg.map(function (l) { return '<span class="' + (l[2] ? 'dot' : '') + '" style="--c:' + l[0] + '">' + l[1] + '</span>'; }).join('') + '</div>';
  }
  function sideFor(d) {
    if (d.kind === 'peak') {
      var p = PEAKS.find(function (x) { return x.k === d.name; });
      side.innerHTML = '<div class="k">' + p.g + ' · ' + p.n + '</div><h3>' + p.t + '</h3><div class="facts"><span>海拔' + fmt(p.alt) + '米</span><span>依托' + p.temple + '周边设施</span></div><p>' + p.d + '</p><p class="note">驿亭为装配式、可拆除，面积不超过60㎡，需征得寺院和景区管理部门同意。</p>';
    } else if (d.kind === 'site') {
      var s = d.site;
      side.innerHTML = '<div class="k">选址比选</div><h3>' + s.n + (s.rec ? ' <span class="tag gold">推荐</span>' : '') + '</h3><div class="facts"><span>海拔' + fmt(s.ele) + '米</span><span>平均坡度' + s.slope + '°</span><span>距主路' + fmt(s.road) + '米</span><span>距塔院寺' + fmt(s.tayuan) + '米</span></div><p>' + SITE_EVAL[s.id] + '</p>';
    } else if (d.kind === 'heart') {
      side.innerHTML = '<div class="k">心 · 一期</div><h3>心馆「清凉之心」</h3><div class="facts"><span>约1,200㎡</span><span>一期投资约2,480万元</span><span>建议2029年6月开馆</span></div><p>集中展示五台县2项国家级、6项省级非遗，设工坊、研学与文创，是朝台印谱的起点和终点。</p><p><button type="button" class="tag gold" style="border:none;cursor:pointer" id="openCourt">进入心馆三维</button></p>';
      var b = $('openCourt'); if (b) b.addEventListener('click', function () { setArea('court'); });
    }
  }
  function zoneSide(id) {
    var z = WT.ZONES.find(function (x) { return x.id === id; });
    side.innerHTML = '<div class="k">' + z.n + ' · ' + z.hall + '</div><h3>' + z.name + '</h3><div class="facts"><span>' + z.area + '㎡' + (z.outdoor ? '（室外）' : '') + '</span><span>' + z.kind + '</span>' + (z.time ? '<span>建议停留' + z.time + '分钟</span>' : '') + '</div><p>' + z.desc + '</p><ul>' + z.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul><div class="tags">' + z.tags.map(function (t, i) { return '<span class="tag' + (i ? '' : ' gold') + '">' + t + '</span>'; }).join('') + '</div>';
  }

  function buildPresets() {
    var bar = $('presetBar');
    bar.innerHTML = PRESET_NAMES[S.area].map(function (p) { return '<button type="button" data-preset="' + p[0] + '" aria-pressed="false">' + p[1] + '</button>'; }).join('');
    bar.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { if (api) api.goto(b.dataset.preset); stopRotate(); setPressed('#presetBar button', function (x) { return x === b; }); }); });
  }
  function stopRotate() { S.rotate = false; if (api) api.setAutoRotate(false); $('t-rotate').setAttribute('aria-pressed', 'false'); }
  function build() {
    if (api) { api.dispose(); api = null; }
    if (!window.THREE || !THREE.OrbitControls) { side.innerHTML = '<p>当前浏览器无法加载三维组件，请检查网络后刷新，或使用离线版。</p>'; return; }
    try {
      var common = { onInteract: function () { S.rotate = false; $('t-rotate').setAttribute('aria-pressed', 'false'); }, autoRotate: S.rotate, labels: S.labels };
      if (S.area === 'court') {
        api = WT.createCourtViewer(host, Object.assign(common, { night: S.night, xray: S.xray, route: S.route, preset: S.preset || 'aerial', onSelect: zoneSide }));
      } else {
        api = WT.createTerrain(host, Object.assign(common, { area: S.area, proposal: S.mode === 'plan', night: S.night, preset: S.preset || undefined, onSelect: sideFor }));
      }
    } catch (e) { console.error(e); side.innerHTML = '<p>三维场景加载失败：' + e.message + '</p>'; return; }
    $('courtTools').hidden = S.area !== 'court';
    setPressed('[data-area]', function (b) { return b.dataset.area === S.area; });
    setPressed('[data-mode]', function (b) { return S.area === 'court' ? b.dataset.mode === 'plan' : b.dataset.mode === S.mode; });
    buildPresets(); sideDefault(); S.preset = null;
  }
  function setArea(a) { S.area = a; build(); }
  document.querySelectorAll('[data-area]').forEach(function (b) { b.addEventListener('click', function () { setArea(b.dataset.area); }); });
  document.querySelectorAll('[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      S.mode = b.dataset.mode;
      if (S.area === 'court') { if (S.mode === 'now') { S.area = 'taihuai'; build(); } return; }
      if (api && api.setProposal) api.setProposal(S.mode === 'plan');
      setPressed('[data-mode]', function (x) { return x.dataset.mode === S.mode; }); sideDefault();
    });
  });
  $('t-night').addEventListener('click', function () { S.night = !S.night; api && api.setNight(S.night); this.setAttribute('aria-pressed', String(S.night)); });
  $('t-labels').addEventListener('click', function () {
    S.labels = !S.labels; this.setAttribute('aria-pressed', String(S.labels));
    var l = host.querySelector('.wt-labels'); if (l) l.hidden = !S.labels;
    if (api && api.setLabels) api.setLabels(S.labels);
  });
  $('t-rotate').addEventListener('click', function () { S.rotate = !S.rotate; api && api.setAutoRotate(S.rotate); this.setAttribute('aria-pressed', String(S.rotate)); });
  $('t-xray').addEventListener('click', function () { S.xray = !S.xray; api && api.setXray && api.setXray(S.xray); this.setAttribute('aria-pressed', String(S.xray)); });
  $('t-route').addEventListener('click', function () { S.route = !S.route; api && api.setRoute && api.setRoute(S.route); this.setAttribute('aria-pressed', String(S.route)); });

  // 链接口令：#3d-region-plan、#3d-taihuai-plan-night、#3d-court 等，供 PPT 直接跳到指定画面
  function fromHash() {
    var h = location.hash.replace('#', '');
    if (h.indexOf('3d-') !== 0) return false;
    var p = h.split('-');
    S.area = ['region', 'taihuai', 'court'].indexOf(p[1]) >= 0 ? p[1] : 'region';
    S.mode = p.indexOf('plan') > 0 ? 'plan' : 'now'; S.night = p.indexOf('night') > 0; S.xray = p.indexOf('xray') > 0;
    $('t-night').setAttribute('aria-pressed', String(S.night)); $('t-xray').setAttribute('aria-pressed', String(S.xray));
    return true;
  }
  var jump = fromHash();
  build();
  if (jump) setTimeout(function () { $('top').scrollIntoView(); }, 50);
  window.addEventListener('hashchange', function () { if (fromHash()) { build(); $('top').scrollIntoView({ behavior: 'smooth' }); } });
  document.querySelectorAll('[data-goto]').forEach(function (b) {
    b.addEventListener('click', function () { location.hash = b.dataset.goto; });
  });

  // ================= 内容与图表 =================
  document.querySelectorAll('.cnt').forEach(C.count);
  C.columns($('chVisitors'), D.visitors.map(function (v, i) { return { n: v.y + '年', v: v.v, c: i === 2 ? 'var(--jin)' : 'var(--qing)' }; }), { d: 1 });
  C.hbars($('chHeritage'), D.heritage.map(function (h, i) { return { n: h.n, v: h.v, c: ['var(--jin)', 'var(--qing)', 'var(--qing-2)', '#8aa9a8'][i] }; }), { unit: '项' });
  $('heritageNote').textContent = '国家级：' + D.heritage[0].items + '；省级：' + D.heritage[1].items + '。';

  var NEEDS = [
    ['五台山风景区管委会', '提升文化内涵、留住游客、四季客流、运营可持续、不增加长期财政负担', '基本陈列免费、体验付费；保本只需约3%游客进馆；冬季“雪中声殿”和线上“云朝台”'],
    ['寺院与宗教界', '不打扰宗教活动，不过度商业化，尊重仪轨', '科技不进殿堂；宗教仪式不作表演；寺院参与内容策划；心馆选址避开核心寺院群'],
    ['非遗传承人', '收入、带徒、展示平台、作品被认可', '驻馆补贴每年60万元；作品进入文创并分成；工坊“每周一课”'],
    ['游客', '看得懂、摸得着、带得走；雨天冬天有去处；时间可控', '标准参观约100分钟；工坊体验；朝台印谱；线上预约分时入馆'],
    ['周边村民', '就业与增收，参与而不是被替代', '一村一艺约30个工坊岗位；社区非遗角讲解；收入留在村里'],
    ['学校与研学机构', '成体系的课程、安全、接待容量', '独立研学教室；三门成熟课程；年接待约2万人次；院校实习基地'],
    ['上级文旅部门', '政策合规、可示范、可申报', '对接“十五五”非遗馆建设与数智化新场景；按团体标准建设，开馆后申报评估定级']
  ];
  $('needsTable').querySelector('tbody').innerHTML = NEEDS.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('');

  C.hbars($('chSurvey'), [
    { n: '精神氛围与整体定位', v: 83.6, note: '禅意、宁静、清凉境界' }, { n: '展示内容与主题', v: 76.6, note: '佛乐、泥塑、木雕、民俗' },
    { n: '互动体验与参与感', v: 74.2, note: '亲手制作、传承人演示' }, { n: '建筑与环境设计', v: 64.1, note: '青砖灰瓦、晋北风情' },
    { n: '科技融合与创新表达', v: 43.8, note: 'VR/AR、沉浸声场', c: 'var(--jin)' }
  ], { unit: '%', d: 1, max: 100 });

  var SITE_EVAL = {
    A: '最平整，土方量小；紧邻大石线，游客到达方便；与塔院寺等核心寺院群保持约2.4公里距离，对宗教环境影响最小。推荐。',
    B: '靠近寺院群北侧，文化氛围浓，但距主路较远，需新修入口道路，且宗教环境协调难度较大。备选。',
    C: '坡度大（平均约10°，局部超过30°），距主路约2.3公里，土方与道路投入大。不推荐。'
  };
  $('siteTable').querySelector('tbody').innerHTML = P.sites.map(function (s) {
    return '<tr><td><b>' + s.n + '</b>' + (s.rec ? ' <span class="tag gold">推荐</span>' : '') + '</td><td class="n">' + fmt(s.ele) + ' 米</td><td class="n">' + s.slope + '°</td><td class="n">' + fmt(s.road) + ' 米</td><td class="n">' + fmt(s.tayuan) + ' 米</td><td>' + SITE_EVAL[s.id] + '</td></tr>';
  }).join('');
  [['平均坡度（越小越好）', 'slope', '°', 1], ['距主路（越近越好）', 'road', '米', 0], ['距塔院寺', 'tayuan', '米', 0]].forEach(function (m) {
    var box = document.createElement('div'); box.className = 'card';
    box.innerHTML = '<h4>' + m[0] + '</h4><div style="margin-top:10px"></div>'; $('siteBars').appendChild(box);
    C.hbars(box.lastChild, P.sites.map(function (s) { return { n: s.n.split(' · ')[0], v: s[m[1]], c: s.rec ? 'var(--jin)' : 'var(--qing-2)' }; }), { unit: m[2], d: m[3] });
  });

  // 心馆
  var tb = $('areaTable').querySelector('tbody'), sum = 0;
  WT.ZONES.forEach(function (z) { if (!z.outdoor) sum += z.area; tb.insertAdjacentHTML('beforeend', '<tr><td>' + z.n + '</td><td>' + z.name + '</td><td>' + z.hall + '</td><td class="n">' + z.area + (z.outdoor ? '（室外）' : '') + '</td></tr>'); });
  $('areaSum').textContent = fmt(sum);
  C.hbars($('chJourney'), WT.ZONES.filter(function (z) { return z.time; }).map(function (z) { return { n: z.n + ' ' + z.hall, v: z.time }; }), { unit: '分' });
  var RENDERS = [
    ['r02_region_plan.jpg', '全域鸟瞰 · 方案实施后：心馆、五台驿亭与朝台径'],
    ['r05_site_aerial.jpg', '心馆场地鸟瞰（候选A · 杨柏峪南）'],
    ['r08_court_eye.jpg', '庭院人视'],
    ['r06_site_night.jpg', '千灯夜景'],
    ['r09_court_xray.jpg', '揭顶看展陈']
  ];
  $('gallery').innerHTML = RENDERS.map(function (r) { return '<figure class="render"><img src="' + ((window.WT_IMG && window.WT_IMG['renders/' + r[0]]) || ('renders/' + r[0])) + '" alt="' + r[1] + '" loading="lazy" onerror="this.parentNode.hidden=true"><figcaption>' + r[1] + '</figcaption></figure>'; }).join('');

  // 五台
  $('peakCards').innerHTML = PEAKS.map(function (p) { return '<button type="button" class="peak" data-peak="' + p.k + '"><div class="g">' + p.g + '</div><div class="nm">' + p.n + '</div><div class="alt">海拔 ' + fmt(p.alt) + ' 米</div><div class="tt">' + p.t + '</div></button>'; }).join('');
  document.querySelectorAll('[data-peak]').forEach(function (b) {
    b.addEventListener('click', function () { S.area = 'region'; S.mode = 'plan'; build(); sideFor({ kind: 'peak', name: b.dataset.peak }); $('top').scrollIntoView({ behavior: 'smooth' }); });
  });
  C.hbars($('chLegs'), P.legs.map(function (l) { return { n: l.f + ' → ' + l.t, v: l.km, note: '约' + l.on + '%利用既有道路与山路' }; }), { unit: ' 公里', d: 1 });

  // 投资
  var TYPES = [['建筑与室外', '#2b6a6e'], ['展陈与数字', '#5f9a9c'], ['驿亭与朝台径', '#9a7429'], ['社区与传承', '#c9a24e'], ['研究与征集', '#8aa9a8'], ['其他费用与预备费', '#b9c3c2']];
  var TYPE_OF = {
    '心馆建筑安装工程': 0, '室外工程与生态停车': 0, '千灯声殿与覆土台地': 0, '景观与下沉庭院': 0,
    '展陈工程': 1, '数字化与智慧导览': 1, '声音地图采录': 1, '云上清凉平台二期与朝台印谱': 1,
    '东台驿亭试点': 2, '四处台顶驿亭': 2, '朝台径标识、安全与应急设施': 2,
    '一村一艺工坊改造': 3, '驻山传承人工作室': 3, '藏品征集与学术研究': 4
  };
  var stackRows = D.phases.map(function (p) {
    var parts = TYPES.map(function (t) { return { n: t[0], v: 0 }; });
    p.rows.forEach(function (r) { var k = TYPE_OF[r.n]; parts[k == null ? 5 : k].v += r.v; });
    return { n: p.n, sub: p.years + ' · ' + p.title, total: p.total, parts: parts };
  });
  C.stack($('chPhases'), stackRows, TYPES.map(function (t) { return t[1]; }), { unit: '' });
  $('phaseKeys').innerHTML = TYPES.map(function (t) { return '<span style="--c:' + t[1] + '">' + t[0] + '</span>'; }).join('');
  var p1 = D.phases[0];
  $('p1Table').querySelector('tbody').innerHTML = p1.rows.map(function (r) { return '<tr><td>' + r.n + '</td><td class="note">' + (r.note || '') + '</td><td class="n">' + fmt(r.v) + '</td></tr>'; }).join('');
  $('p1Sum').textContent = fmt(p1.total);
  var FUND_C = ['#2b6a6e', '#9a7429', '#5f9a9c', '#c97b5f'];
  C.donut($('chFunding'), D.funding, FUND_C, [fmt(p1.total), '一期 · 万元']);
  C.hbars($('fundingList'), D.funding.map(function (f, i) { return { n: f.n, v: f.v, note: f.pct + '% · ' + f.note, c: FUND_C[i] }; }), { unit: '万' });

  // 运营
  C.hbars($('chOpex'), D.opex.map(function (o) { return { n: o.n, v: o.v }; }), { unit: '万' });
  var scenRows = [];
  D.scenarios.forEach(function (s) {
    scenRows.push({ n: s.n + ' · 收入', note: '进馆' + s.conv + '%，约' + s.visitors + '万人次', v: s.income, c: s.net >= 0 ? 'var(--qing)' : 'var(--zhu)' });
    scenRows.push({ n: s.n + ' · 成本', v: s.opex, c: '#9aa6a6' });
  });
  C.hbars($('chScen'), scenRows, { unit: '万', max: 1300 });

  var M = D.model, ctl = { conv: $('c-conv'), study: $('c-study'), shop: $('c-shop'), work: $('c-work') };
  function setInputs(conv, study) { ctl.conv.value = conv; ctl.study.value = study; ctl.shop.value = M.shopPrice; ctl.work.value = M.workshopRate; calc(); }
  function calc() {
    var conv = +ctl.conv.value, study = +ctl.study.value, shop = +ctl.shop.value, work = +ctl.work.value;
    $('o-conv').textContent = conv + '%'; $('o-study').textContent = study + ' 万'; $('o-shop').textContent = shop + ' 元'; $('o-work').textContent = work + '%';
    var want = M.base * conv / 100, vis = Math.min(want, M.capacity);
    var w = vis * work / 100 * M.workshopPrice, s = vis * M.shopRate / 100 * shop * M.shopMargin / 100, f = vis * M.foodRate / 100 * M.foodPrice * M.foodMargin / 100, st = study * M.studyPrice * M.studyNet / 100;
    var inc = w + s + f + st, net = inc - M.opex, max = Math.max(inc, M.opex) * 1.05;
    var el = $('r-net'); el.textContent = (net >= 0 ? '+' : '') + fmt(net) + ' 万元'; el.className = 'net ' + (net >= 0 ? 'pos' : 'neg');
    var parts = [['工坊', w, '#2b6a6e'], ['文创', s, '#5f9a9c'], ['素斋', f, '#8aa9a8'], ['研学', st, '#9a7429']];
    $('r-vs').innerHTML = '<div class="row"><span>收入</span><div class="bar">' + parts.map(function (p) { return '<i style="width:' + (p[1] / max * 100).toFixed(2) + '%;--c:' + p[2] + '" title="' + p[0] + ' ' + fmt(p[1]) + '万"></i>'; }).join('') + '</div><b>' + fmt(inc) + '万</b></div>' +
      '<div class="row"><span>成本</span><div class="bar"><i style="width:' + (M.opex / max * 100).toFixed(2) + '%;--c:#9aa6a6"></i></div><b>' + fmt(M.opex) + '万</b></div>' +
      '<div class="keys">' + parts.map(function (p) { return '<span style="--c:' + p[2] + '">' + p[0] + ' ' + fmt(p[1]) + '万</span>'; }).join('') + '</div>';
    var msg = '入馆约' + fmt(vis, 1) + '万人次/年。';
    msg = (want > M.capacity ? '<div class="warn">' + msg + '需求约' + fmt(want, 1) + '万人次，已超过一期承载上限' + M.capacity + '万。建议分时预约、庭院展演分流，并提前启动二期扩容。</div>' : '') +
      (net >= 0 ? '<div class="ok">' + (want > M.capacity ? '' : msg) + '收入可以覆盖运营成本。</div>' : '<div class="warn">' + (want > M.capacity ? '' : msg) + '每年需要财政补贴约' + fmt(-net) + '万元。</div>');
    $('r-msg').innerHTML = msg;
  }
  $('scenBtns').innerHTML = D.scenarios.map(function (s, i) { return '<button type="button" data-s="' + i + '" aria-pressed="' + (i === 1) + '">' + s.n + '</button>'; }).join('');
  var SC = [[3, 1], [5, 2], [8, 3.5]];
  document.querySelectorAll('[data-s]').forEach(function (b) { b.addEventListener('click', function () { setPressed('[data-s]', function (x) { return x === b; }); setInputs(SC[+b.dataset.s][0], SC[+b.dataset.s][1]); }); });
  Object.keys(ctl).forEach(function (k) { ctl[k].addEventListener('input', function () { setPressed('[data-s]', function () { return false; }); calc(); }); });
  setInputs(5, 2);

  // 建设条件
  $('months').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (m) { return '<div class="' + (D.climate.build.indexOf(m) >= 0 ? 'on' : 'cold') + '">' + m + '月</div>'; }).join('');
  C.hbars($('chTransport'), [{ n: '五台山站（雄忻高铁）', v: 7.9, note: '至景区入口；全线预计2027年3月底具备开通条件', c: 'var(--jin)' }, { n: '忻州五台山机场', v: 125, note: '至台怀镇' }], { unit: ' 公里', d: 1 });

  // 运营组织与宣传
  C.hbars($('chStaff'), [{ n: '运营与服务', v: 8 }, { n: '展陈与研究', v: 6 }, { n: '教育研学', v: 6 }, { n: '馆长办公室', v: 3 }, { n: '数字与技术', v: 3 }, { n: '安全与后勤', v: 2 }], { unit: '人' });
  var CH = [
    ['“朝台服务”（景区官方预约）', '门票预约流程中嵌入心馆免费分时预约', '常设', '全部入园游客'],
    ['抖音 / 微信视频号', '传承人故事短片、佛乐片段、朝台印谱打卡', '每周3条', '大众游客'],
    ['小红书', '文创与手作、拍照点位、四季攻略', '每周3篇', '年轻游客'],
    ['B站', '纪录短片《听见五台》、技艺长视频', '每月2期', '青年与学生'],
    ['微信公众号 / 服务号', '活动预告、研学报名、会员', '每周1篇', '本地与团队客'],
    ['携程 / 美团', '景点页、研学与工坊产品', '常设', '自由行游客'],
    ['周边酒店（杨柏峪片区）', '前台物料、住客专属夜场', '常设', '过夜游客']
  ];
  $('channelTable').querySelector('tbody').innerHTML = CH.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('');
  var mh = []; for (var m = -6; m <= 12; m++) mh.push(m === 0 ? '开馆' : (m > 0 ? '+' + m : m));
  C.gantt($('chLaunch'), mh, [
    { n: '品牌发布与纪录短片', s: '《听见五台》', b: [[0, 2]] },
    { n: '“一人一灯”线上征集', b: [[3, 5]] },
    { n: '媒体预览与达人体验', b: [[5, 5]] },
    { n: '开馆与首届非遗周', s: '文化和自然遗产日', b: [[6, 6, 'var(--jin)']] },
    { n: '常态内容周更', b: [[6, 18]] },
    { n: '季度轮换技艺展', b: [[6, 8], [9, 11], [12, 14], [15, 17]] },
    { n: '冬季“云朝台”', b: [[11, 15, '#5f9a9c']] }
  ]);
  var kbox = $('chKpiA').parentNode; kbox.className = 'grid4'; kbox.style.marginTop = '12px'; kbox.innerHTML = '';
  [['入馆人次', '万', 20, 36], ['研学人次', '万', 1, 2], ['全网粉丝', '万', 10, 30], ['线上预约占比', '%', 80, 90]].forEach(function (k) {
    var d = document.createElement('div'); d.innerHTML = '<div class="note" style="text-align:center">' + k[0] + '</div><div></div>'; kbox.appendChild(d);
    C.columns(d.lastChild, [{ n: '首年', v: k[2], c: 'var(--qing-2)' }, { n: '第三年', v: k[3], c: 'var(--qing)' }], { unit: k[1] });
  });

  // 风险矩阵
  var RISKS = [
    ['用地与审批周期长', 4, 5, '选址论证与遗产影响评估前置；一期选在核心寺院群以外'],
    ['冬季施工窗口短', 4, 3, '装配式结构、工厂预制；关键工序排在4–10月'],
    ['宗教场所协调', 3, 4, '寺院参与策划；科技不进殿堂；仪式不作表演'],
    ['传承人参与不足', 3, 4, '驻馆补贴、作品分成、带徒计划'],
    ['运营收入不足', 3, 3, '保本仅需约3%游客进馆；接入景区预约；前三年财政托底'],
    ['旺季超载', 3, 3, '分时预约、庭院展演分流；一期承载约42万人次/年'],
    ['生态与遗产影响', 2, 5, '台顶只做可拆除的轻型驿亭，体量受控'],
    ['高寒设备故障', 2, 2, '设备耐低温选型，数字内容线上备份'],
    ['高铁开通延后', 2, 2, '方案不依赖高铁客流，开通后作为增量']
  ];
  (function () {
    var W = 360, H = 300, x0 = 44, y0 = 16, cw = (W - x0 - 10) / 5, ch = (H - y0 - 40) / 5;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="风险矩阵：横轴为可能性，纵轴为影响程度">';
    for (var i = 0; i < 5; i++) for (var j = 0; j < 5; j++) {
      var sc = (i + 1) * (5 - j), col = sc >= 15 ? 'var(--zhu-soft)' : sc >= 9 ? 'var(--jin-soft)' : 'var(--qing-soft)';
      s += '<rect x="' + (x0 + i * cw) + '" y="' + (y0 + j * ch) + '" width="' + (cw - 2) + '" height="' + (ch - 2) + '" fill="' + col + '" rx="3"/>';
    }
    s += '<text x="' + (x0 + (W - x0) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="12" fill="var(--muted)">可能性 →</text>';
    s += '<text x="12" y="' + (y0 + (H - y0 - 40) / 2) + '" text-anchor="middle" font-size="12" fill="var(--muted)" transform="rotate(-90 12 ' + (y0 + (H - y0 - 40) / 2) + ')">影响程度 →</text>';
    var cellCount = {};
    RISKS.forEach(function (r, k) {
      var key = r[1] + '-' + r[2], n = cellCount[key] = (cellCount[key] || 0) + 1;
      var cx = x0 + (r[1] - 1) * cw + cw / 2 + (n - 1) * 20 - 6, cy = y0 + (5 - r[2]) * ch + ch / 2, sc = r[1] * r[2];
      var col = sc >= 15 ? 'var(--zhu)' : sc >= 9 ? 'var(--jin)' : 'var(--qing)';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="' + col + '"/><text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">' + (k + 1) + '</text>';
    });
    $('riskSvg').innerHTML = s + '</svg>';
    $('riskList').innerHTML = RISKS.map(function (r, k) { var sc = r[1] * r[2]; return '<div class="r"><i style="--c:' + (sc >= 15 ? 'var(--zhu)' : sc >= 9 ? 'var(--jin)' : 'var(--qing)') + '">' + (k + 1) + '</i><div><b>' + r[0] + '</b><span>' + r[3] + '</span></div></div>'; }).join('');
  })();

  // 实施计划
  var hh = []; for (var y = 2026; y <= 2035; y++) { if (y > 2026) hh.push(y + '上'); hh.push(y + '下'); }
  C.gantt($('chGantt'), hh, [
    { n: '深化调研与倾斜摄影', b: [[0, 1]] },
    { n: '立项与审批', s: '含遗产影响评估', b: [[1, 2]] },
    { n: '建筑与展陈设计', b: [[1, 2]] },
    { n: '藏品征集', b: [[1, 4]] },
    { n: '一期施工', s: '仅4–10月施工', b: [[2, 2], [3, 4]] },
    { n: '布展调试与试运营', b: [[5, 5]] },
    { n: '一期开馆', s: '2029年6月', b: [[5, 5, 'var(--jin)']] },
    { n: '二期：驿亭、朝台径、一村一艺', b: [[6, 10]] },
    { n: '三期：千灯声殿', b: [[11, 18]] },
    { n: '持续运营与评估定级', b: [[5, 18, '#8aa9a8']] }
  ]);

  // 二维码地址
  $('siteUrl').textContent = 'https://sunjiuxuan.github.io/wutaishan/';

  // 检查用：?from=章节id 只显示该章节之后的内容
  var fromSec = (location.search.match(/[?&]from=([a-z0-9-]+)/) || [])[1];
  if (fromSec) { var hide = true; document.querySelectorAll('.hero, .stage, .stage + .note, section.part').forEach(function (el) { if (el.id === fromSec) hide = false; if (hide) el.hidden = true; }); }

  // 导航高亮
  var links = Array.prototype.slice.call(document.querySelectorAll('#navLinks a'));
  var secIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section.part, #top').forEach(function (s) { secIO.observe(s); });
})();
