/* 心馆合院单独查看器：分区点选、揭顶、参观流线、夜景 */
(function () {
  var WT = window.WT = window.WT || {};
  WT.createCourtViewer = function (container, opt) {
    opt = opt || {};
    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(opt.shot ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    var labelsEl = document.createElement('div'); labelsEl.className = 'wt-labels'; container.appendChild(labelsEl);
    var scene = new THREE.Scene(), DAY = new THREE.Color(0xc9d6dc), NIGHT = new THREE.Color(0x0d1420);
    scene.background = DAY.clone(); scene.fog = new THREE.Fog(DAY.clone(), 160, 420);
    var camera = new THREE.PerspectiveCamera(36, 1, 0.5, 900);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = 1.48; controls.minDistance = 8; controls.maxDistance = 220;
    var hemi = new THREE.HemisphereLight(0xf1f5f4, 0x5a645c, 0.8); scene.add(hemi);
    var sun = new THREE.DirectionalLight(0xfff2dc, 1.05); sun.position.set(-45, 70, 35); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); var sc = sun.shadow.camera; sc.left = -60; sc.right = 60; sc.top = 60; sc.bottom = -60; sc.near = 10; sc.far = 220; sun.shadow.bias = -0.0006; scene.add(sun);

    var ground = new THREE.Mesh(new THREE.CircleGeometry(420, 64), new THREE.MeshStandardMaterial({ color: 0x8f9d8c, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    var path = new THREE.Mesh(new THREE.PlaneGeometry(9, 40), new THREE.MeshStandardMaterial({ color: 0xc8c4ba }));
    path.rotation.x = -Math.PI / 2; path.position.set(0, 0.03, 50); scene.add(path);

    var C = WT.buildCourtyard(THREE, {}); scene.add(C.group);
    C.group.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

    // 松林与远山
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var pineM = [new THREE.MeshStandardMaterial({ color: 0x2f4a3b, flatShading: true }), new THREE.MeshStandardMaterial({ color: 0x3d5a46, flatShading: true })];
    var trunkM = new THREE.MeshStandardMaterial({ color: 0x5a4636 });
    for (var i = 0; i < 160; i++) {
      var a = rnd() * Math.PI * 2, r = 36 + rnd() * 70, x = Math.cos(a) * r, z = Math.sin(a) * r, s = 0.8 + rnd() * 0.9;
      if (z > 20 && Math.abs(x) < 12) continue;
      var t = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * s, 0.3 * s, 1.6 * s, 6), trunkM); t.position.set(x, 0.8 * s, z); t.castShadow = true; scene.add(t);
      for (var k = 0; k < 3; k++) {
        var c = new THREE.Mesh(new THREE.ConeGeometry((1.9 - k * 0.45) * s, 2.2 * s, 7), pineM[i % 2]); c.position.set(x, (1.9 + k * 1.15) * s, z); c.castShadow = true; scene.add(c);
      }
    }
    var mtn = new THREE.MeshStandardMaterial({ color: 0x7d8c84, flatShading: true });
    [[0, -260, 95], [250, -40, 70], [-260, -60, 68], [40, 270, 52], [-150, -190, 80], [190, -200, 60], [-230, 160, 45]].forEach(function (m) {
      var g = new THREE.Mesh(new THREE.CylinderGeometry(24, 85, m[2], 9), mtn); g.position.set(m[0], m[2] / 2 - 2, m[1]); scene.add(g);
    });

    // 参观流线
    var curve = new THREE.CatmullRomCurve3(WT.ROUTE.map(function (p) { return new THREE.Vector3(p[0], 0.45, p[1]); }), false, 'centripetal');
    var routeG = new THREE.Group(); scene.add(routeG);
    routeG.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 300, 0.13, 6, false), new THREE.MeshBasicMaterial({ color: 0xc89a3c })));
    var dots = [];
    for (var d = 0; d < 9; d++) { var m = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 10), new THREE.MeshBasicMaterial({ color: 0xf0c25a })); m.userData.t = d / 9; routeG.add(m); dots.push(m); }
    routeG.visible = opt.route !== false;

    // 标注
    var labels = [];
    WT.ZONES.forEach(function (z) {
      var info = C.zones[z.id]; if (!info) return;
      var el = document.createElement('button'); el.type = 'button'; el.className = 'wt-lbl zone'; el.innerHTML = '<i>' + z.n + '</i>' + z.hall;
      el.addEventListener('click', function () { select(z.id, true); });
      labelsEl.appendChild(el); labels.push({ el: el, id: z.id, pos: new THREE.Vector3(info.center.x, info.top, info.center.z) });
    });

    var PRESETS = {
      aerial: [[0, 0, -1], [52, 44, 66]],
      eye: [[0, 4.5, -12], [5.5, 1.7, 8.5]],
      gate: [[0, 4, 14], [-14, 6, 48]],
      top: [[0, 0, 0], [0.5, 95, 18]],
      side: [[0, 3, -4], [-62, 22, 18]],
      night: [[0, 3, -2], [38, 18, 52]]
    };
    var fly = null;
    function goto(n, instant) {
      var p = PRESETS[n]; if (!p) return;
      var t = new THREE.Vector3().fromArray(p[0]), c = new THREE.Vector3().fromArray(p[1]);
      if (instant) { controls.target.copy(t); camera.position.copy(c); } else fly = { tgt: t, pos: c };
    }
    goto(opt.preset || 'aerial', true);
    controls.autoRotate = !opt.shot && opt.autoRotate !== false && !window.matchMedia('(prefers-reduced-motion: reduce)').matches; controls.autoRotateSpeed = 0.45;

    function stopAuto() { controls.autoRotate = false; if (opt.onInteract) opt.onInteract(); }
    var ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), down = null;
    renderer.domElement.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; stopAuto(); });
    renderer.domElement.addEventListener('wheel', stopAuto, { passive: true });
    renderer.domElement.addEventListener('pointerup', function (e) {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      var r = renderer.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      var hit = ray.intersectObjects(C.pickables, false)[0]; if (hit) select(hit.object.userData.zone, true);
    });
    function select(id, doFly) {
      C.highlight(id);
      labels.forEach(function (l) { l.el.classList.toggle('on', l.id === id); });
      if (doFly) {
        stopAuto();
        var c = C.zones[id].center.clone(); c.y = 1;
        var dir = camera.position.clone().sub(controls.target).normalize(), dist = id === 'main' || id === 'court' ? 52 : 40;
        fly = { tgt: c, pos: c.clone().add(dir.multiplyScalar(dist)).setY(Math.max(18, c.y + dist * 0.55)) };
      }
      if (opt.onSelect) opt.onSelect(id);
    }
    var lamps = null, lampData = [];
    (function () {
      var N = 500, g = new THREE.BufferGeometry(), a = new Float32Array(N * 3);
      for (var i = 0; i < N; i++) lampData.push({ a: Math.random() * 6.283, r: Math.sqrt(Math.random()) * 12, y: Math.random() * 60, v: 1.5 + Math.random() * 3 });
      g.setAttribute('position', new THREE.BufferAttribute(a, 3));
      lamps = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffc860, size: 0.5, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      lamps.visible = false; scene.add(lamps);
    })();
    function setNight(on) {
      scene.background.copy(on ? NIGHT : DAY); scene.fog.color.copy(on ? NIGHT : DAY);
      hemi.intensity = on ? 0.2 : 0.8; sun.intensity = on ? 0.15 : 1.05; C.setNight(on); lamps.visible = on;
    }
    if (opt.xray) C.setXray(true);
    setNight(!!opt.night);
    labelsEl.hidden = opt.labels === false;

    function resize() {
      var w = container.clientWidth, h = container.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < 560 ? 48 : 36; camera.updateProjectionMatrix();
    }
    var ro = new ResizeObserver(resize); ro.observe(container); resize();
    var visible = true, io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }); io.observe(container);
    var v = new THREE.Vector3(), clock = new THREE.Clock(), raf = 0, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function loop() {
      raf = requestAnimationFrame(loop);
      var dt = Math.min(clock.getDelta(), 0.05);
      if (!visible && !opt.shot) return;
      if (fly) { controls.target.lerp(fly.tgt, 0.07); camera.position.lerp(fly.pos, 0.07); if (camera.position.distanceTo(fly.pos) < 0.3) fly = null; }
      controls.update();
      if (routeG.visible) dots.forEach(function (d) { if (!reduce && !opt.shot) d.userData.t = (d.userData.t + dt * 0.018) % 1; d.position.copy(curve.getPointAt(d.userData.t)); d.position.y = 0.6; });
      if (lamps.visible) {
        var a = lamps.geometry.attributes.position.array;
        lampData.forEach(function (L, i) { L.y += L.v * (opt.shot ? 0.6 : dt); if (L.y > 60) L.y = 0; var sp = 1 + L.y / 25; a[i * 3] = Math.cos(L.a) * L.r * sp; a[i * 3 + 1] = 8 + L.y; a[i * 3 + 2] = -2 + Math.sin(L.a) * L.r * sp; });
        lamps.geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      var w = container.clientWidth, h = container.clientHeight;
      labels.forEach(function (l) {
        v.copy(l.pos).project(camera);
        var x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h, hide = v.z > 1 || x < 0 || x > w || y < 0 || y > h;
        l.el.hidden = hide; if (!hide) l.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-100%)';
      });
    }
    loop();
    return {
      ready: Promise.resolve(), goto: goto, select: select, setNight: setNight,
      setXray: function (on) { C.setXray(on); }, setRoute: function (on) { routeG.visible = on; },
      setAutoRotate: function (on) { controls.autoRotate = on; },
      dispose: function () {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); controls.dispose(); renderer.dispose();
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        if (labelsEl.parentNode) labelsEl.parentNode.removeChild(labelsEl);
      }
    };
  };
})();
