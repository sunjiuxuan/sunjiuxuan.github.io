/* 轻量图表：横条、柱状、堆叠、环形、计数。初始即为最终状态；不在首屏的图表先归零，滚动到位后再长出来 */
(function () {
  var WT = window.WT = window.WT || {};
  var C = WT.charts = {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(v, d) { return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d || 0 }); }
  C.fmt = fmt;

  // 动画登记：el 在视口外时先执行 reset，进入视口执行 play
  var queue = [];
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var it = queue.find(function (q) { return q.el === e.target; }); if (!it || it.done) return;
      it.done = true; io.unobserve(e.target);
      requestAnimationFrame(function () { requestAnimationFrame(function () { e.target.classList.remove('pending'); it.play(); }); });
    });
  }, { threshold: 0.25 }) : null;
  var staticMode = /[?&]static=1/.test(location.search);
  window.addEventListener('beforeprint', function () { queue.forEach(function (q) { if (!q.done) { q.done = true; q.el.classList.remove('pending'); q.play(); } }); });
  C.animate = function (el, reset, play) {
    if (reduce || !io || staticMode) return;
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;   // 首屏可见的保持最终状态
    el.classList.add('pending'); reset();
    queue.push({ el: el, play: play }); io.observe(el);
  };

  C.hbars = function (el, rows, o) {
    o = o || {};
    var max = o.max || Math.max.apply(null, rows.map(function (r) { return r.v; }));
    el.classList.add('hbars', 'chart');
    el.innerHTML = rows.map(function (r) {
      return '<div class="hbar"><div class="lab">' + r.n + (r.note ? '<small>' + r.note + '</small>' : '') + '</div>' +
        '<div class="track" role="img" aria-label="' + r.n + ' ' + fmt(r.v, o.d) + (o.unit || '') + '"><div class="fill" style="width:' + (r.v / max * 100).toFixed(2) + '%;' + (r.c ? '--c:' + r.c : '') + '"></div></div>' +
        '<div class="val">' + (o.prefix || '') + fmt(r.v, o.d) + (o.unit || '') + '</div></div>';
    }).join('');
    var fills = el.querySelectorAll('.fill'), widths = Array.prototype.map.call(fills, function (f) { return f.style.width; });
    C.animate(el, function () { fills.forEach(function (f) { f.style.width = '0%'; }); },
      function () { fills.forEach(function (f, i) { setTimeout(function () { f.style.width = widths[i]; }, i * 90); }); });
  };

  C.columns = function (el, rows, o) {
    o = o || {};
    var max = o.max || Math.max.apply(null, rows.map(function (r) { return r.v; })) * 1.12;
    el.classList.add('chart');
    el.innerHTML = '<div class="cols">' + rows.map(function (r) {
      return '<div class="col"><div class="bar" style="height:' + (r.v / max * 100).toFixed(2) + '%;' + (r.c ? '--c:' + r.c : '') + '" role="img" aria-label="' + r.n + ' ' + fmt(r.v, o.d) + (o.unit || '') + '"><b>' + fmt(r.v, o.d) + (o.unit || '') + '</b></div></div>';
    }).join('') + '</div><div class="col-labels">' + rows.map(function (r) { return '<span>' + r.n + '</span>'; }).join('') + '</div>';
    var bars = el.querySelectorAll('.bar'), hs = Array.prototype.map.call(bars, function (b) { return b.style.height; });
    C.animate(el, function () { bars.forEach(function (b) { b.style.height = '0%'; }); },
      function () { bars.forEach(function (b, i) { setTimeout(function () { b.style.height = hs[i]; }, i * 140); }); });
  };

  C.stack = function (el, rows, palette, o) {
    o = o || {};
    var max = o.max || Math.max.apply(null, rows.map(function (r) { return r.total; }));
    el.classList.add('stack', 'chart');
    el.innerHTML = rows.map(function (r) {
      return '<div class="stack-row"><div class="lab"><b>' + r.n + '</b><small>' + (r.sub || '') + '</small></div><div class="stack-track" style="width:' + (r.total / max * 100).toFixed(2) + '%">' +
        r.parts.map(function (p, i) { return '<i style="width:' + (p.v / r.total * 100).toFixed(2) + '%;--c:' + palette[i % palette.length] + '" title="' + p.n + ' ' + fmt(p.v) + (o.unit || '') + '"></i>'; }).join('') +
        '</div><div class="tot">' + fmt(r.total) + (o.unit || '') + '</div></div>';
    }).join('');
    var tracks = el.querySelectorAll('.stack-track'), ws = Array.prototype.map.call(tracks, function (t) { return t.style.width; });
    tracks.forEach(function (t) { t.style.transition = 'width 1.3s cubic-bezier(.2,.7,.2,1)'; });
    C.animate(el, function () { tracks.forEach(function (t) { t.style.width = '0%'; }); },
      function () { tracks.forEach(function (t, i) { setTimeout(function () { t.style.width = ws[i]; }, i * 200); }); });
  };

  C.donut = function (el, rows, palette, center) {
    var R = 70, L = 2 * Math.PI * R, tot = rows.reduce(function (a, r) { return a + r.v; }, 0), acc = 0;
    var s = '<svg viewBox="0 0 200 200" role="img" aria-label="' + rows.map(function (r) { return r.n + ' ' + Math.round(r.v / tot * 100) + '%'; }).join('，') + '">';
    s += '<circle cx="100" cy="100" r="' + R + '" fill="none" stroke="var(--qing-soft)" stroke-width="26"/>';
    rows.forEach(function (r, i) {
      var len = r.v / tot * L;
      s += '<circle class="seg" cx="100" cy="100" r="' + R + '" fill="none" stroke="' + palette[i % palette.length] + '" stroke-width="26" stroke-dasharray="' + len.toFixed(2) + ' ' + (L - len).toFixed(2) + '" stroke-dashoffset="' + (-acc).toFixed(2) + '" transform="rotate(-90 100 100)"/>';
      acc += len;
    });
    s += '<text x="100" y="96" text-anchor="middle" font-size="24" font-weight="900" fill="var(--ink)" font-family="var(--f-display)">' + center[0] + '</text>';
    s += '<text x="100" y="120" text-anchor="middle" font-size="12" fill="var(--muted)">' + center[1] + '</text></svg>';
    el.classList.add('donut', 'chart'); el.innerHTML = s;
    var segs = el.querySelectorAll('circle.seg'), da = Array.prototype.map.call(segs, function (c) { return c.getAttribute('stroke-dasharray'); });
    C.animate(el, function () { segs.forEach(function (c) { c.setAttribute('stroke-dasharray', '0 ' + L); }); },
      function () { segs.forEach(function (c, i) { setTimeout(function () { c.setAttribute('stroke-dasharray', da[i]); }, i * 180); }); });
  };

  C.count = function (el) {
    var target = parseFloat(el.dataset.v), d = parseInt(el.dataset.d || '0', 10), suffix = el.dataset.suffix || '';
    el.textContent = fmt(target, d) + suffix;
    C.animate(el, function () { el.textContent = fmt(0, d) + suffix; }, function () {
      var t0 = performance.now(), dur = 1400;
      (function step(t) { var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3); el.textContent = fmt(target * k, d) + suffix; if (k < 1) requestAnimationFrame(step); })(t0);
    });
  };

  C.gantt = function (el, heads, rows) {
    var cols = heads.length, html = '<div class="h"></div>' + heads.map(function (h) { return '<div class="h">' + h + '</div>'; }).join('');
    rows.forEach(function (r, i) {
      var rn = i + 2;
      html += '<div class="t" style="grid-row:' + rn + '">' + r.n + (r.s ? '<small>' + r.s + '</small>' : '') + '</div>';
      for (var c = 0; c < cols; c++) html += '<div class="cell" style="grid-row:' + rn + ';grid-column:' + (c + 2) + '"></div>';
      r.b.forEach(function (b, k) {
        html += '<div class="b" style="grid-row:' + rn + ';grid-column:' + (b[0] + 2) + ' / ' + (b[1] + 3) + ';--c:' + (b[2] || 'var(--qing)') + ';transition-delay:' + (i * 0.08 + k * 0.1).toFixed(2) + 's" title="' + r.n + '"></div>';
      });
    });
    el.classList.add('gantt'); el.style.setProperty('--cols', cols); el.innerHTML = html;
    C.animate(el, function () { el.classList.add('pending'); }, function () { el.classList.remove('pending'); });
  };
})();
