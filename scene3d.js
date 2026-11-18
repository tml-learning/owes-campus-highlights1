// 3D Scene Engine for 漚汪國小探索園區
// Grounded Campus + PU Running Track + Outer Carrot Fields + Flying White Egrets + Customizable User Avatar
window.OWES_SCENE = (function () {
  let scene, camera, renderer, controls;
  let clock = new THREE.Clock();
  let raycaster = new THREE.Raycaster();
  let pointer = new THREE.Vector2();
  let pointerDownPos = new THREE.Vector2();

  // State synced with UI
  const state = {
    selected: null,
    hovered: null,
    view: "panorama", // 'panorama' | 'bird' | 'train' (runner follow) | 'list'
    showLabels: true,
    showLinks: false,
    animate: true,
    timeMode: "day", // 'day' | 'dusk' | 'night'
    fx: false,
    weatherKind: "clear",
    cloudCover: 25,
    avatar: {
      shirt: "#f97316",
      shirtName: "活力橘",
      pants: "#1e293b",
      hat: "headband",
      prop: "baton"
    }
  };

  const stationGroups = new Map();
  const stationTargets = new Map();
  const labelElements = new Map();
  const dynamicCallbacks = [];
  const interactiveMeshes = [];
  const windowMaterials = [];

  // Campus Runner Tour (Lead Avatar Runner + 2 Jogging Companions)
  let runnerCurve = null;
  let runnerCurveLength = 1;
  let runnerDist = 0;
  let leadRunnerGroup = null;
  let leadRunnerAvatarHolder = null;
  let companionRunners = [];
  let runnerBadgeEl = null;
  let activeStopInfo = null;
  let currentTargetStationId = "vision";
  let stopOrbitClock = 0;
  let stopArrivalTimer = 0;
  let isStopSheetExpanded = false;

  let sunLight, hemiLight;
  let rainSystem = null;
  let cloudGroups = [];
  let groundMat = null;
  let campusTurfMat = null;

  // Camera smooth target interpolation
  const camTargetPos = new THREE.Vector3(0, 32, 42);
  const camTargetLook = new THREE.Vector3(0, 1.0, 1.0);
  const currentLook = new THREE.Vector3(0, 1.0, 1.0);
  let userInteracting = false;
  let cameraTransitioning = true;
  let cameraTransitionTimer = 0;

  // Material cache
  const matCache = new Map();
  function getMat(color, opts = {}) {
    const key = color + JSON.stringify(opts);
    if (!matCache.has(key)) {
      matCache.set(
        key,
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.74,
          metalness: 0.04,
          ...opts
        })
      );
    }
    return matCache.get(key);
  }

  // Procedural Synthetic PU Rubber Granule Material for the Running Track (操場 PU 顆粒材質)
  let puTrackMat = null;
  function getPuTrackMaterial() {
    if (puTrackMat) return puTrackMat;

    const size = 256;
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = size;
    colorCanvas.height = size;
    const cCtx = colorCanvas.getContext("2d");

    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = size;
    bumpCanvas.height = size;
    const bCtx = bumpCanvas.getContext("2d");

    // Base terracotta PU rubber color
    cCtx.fillStyle = "#c94d32";
    cCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = "#808080";
    bCtx.fillRect(0, 0, size, size);

    // Draw thousands of synthetic EPDM rubber granules
    const palette = ["#b33e24", "#d95b3f", "#e26d50", "#9e331b", "#f08a6c", "#e8a88a"];
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 4200; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1.0 + rand() * 1.8;
      cCtx.fillStyle = palette[Math.floor(rand() * palette.length)];
      cCtx.fillRect(x, y, r, r);

      const bVal = Math.floor(90 + rand() * 140);
      bCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
      bCtx.fillRect(x, y, r, r);
    }

    const colorTex = new THREE.CanvasTexture(colorCanvas);
    colorTex.wrapS = THREE.RepeatWrapping;
    colorTex.wrapT = THREE.RepeatWrapping;
    colorTex.repeat.set(14, 14);
    colorTex.anisotropy = 4;
    colorTex.encoding = THREE.sRGBEncoding;

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(14, 14);

    puTrackMat = new THREE.MeshStandardMaterial({
      map: colorTex,
      bumpMap: bumpTex,
      bumpScale: 0.024,
      roughness: 0.66,
      metalness: 0.02
    });
    return puTrackMat;
  }

  // Procedural High-Res Solar Photovoltaic Grid Material (精緻太陽能光電板材質・無閃爍)
  let solarPanelMat = null;
  function getSolarPanelMaterial() {
    if (solarPanelMat) return solarPanelMat;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Aluminum frame outer border
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 0, 256, 256);

    // Deep monocrystalline silicon navy base
    ctx.fillStyle = "#172554";
    ctx.fillRect(8, 8, 240, 240);

    // Individual solar cells with subtle blue gradient
    const cols = 6;
    const rows = 10;
    const cw = 236 / cols;
    const ch = 236 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 10 + c * cw;
        const y = 10 + r * ch;
        ctx.fillStyle = (r + c) % 2 === 0 ? "#1e3a8a" : "#1d4ed8";
        ctx.fillRect(x + 1.5, y + 1.5, cw - 3, ch - 3);
        // Fine silver busbar lines
        ctx.fillStyle = "rgba(226, 232, 240, 0.35)";
        ctx.fillRect(x + cw * 0.33, y + 1.5, 1, ch - 3);
        ctx.fillRect(x + cw * 0.66, y + 1.5, 1, ch - 3);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    solarPanelMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.3,
      metalness: 0.35
    });
    return solarPanelMat;
  }

  // Procedural High-Res Solar Basketball Court Floor Material (單一平面繪製光電籃球場地板，徹底消除閃爍 Z-fighting)
  let bballCourtMat = null;
  function getBasketballCourtMaterial() {
    if (bballCourtMat) return bballCourtMat;
    const W = 512;
    const H = 384;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Green outer safety apron
    ctx.fillStyle = "#4d903e";
    ctx.fillRect(0, 0, W, H);

    // Royal blue inner court
    const padX = 42;
    const padY = 38;
    const cw = W - padX * 2;
    const ch = H - padY * 2;
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(padX, padY, cw, ch);

    // Terracotta red key zones (left & right) and center circle
    ctx.fillStyle = "#c2412d";
    const keyW = 86;
    const keyH = 116;
    ctx.fillRect(padX, H / 2 - keyH / 2, keyW, keyH);
    ctx.fillRect(W - padX - keyW, H / 2 - keyH / 2, keyW, keyH);

    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 42, 0, Math.PI * 2);
    ctx.fill();

    // Crisp white court lines
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(padX, padY, cw, ch);

    // Center line & circle
    ctx.beginPath();
    ctx.moveTo(W / 2, padY);
    ctx.lineTo(W / 2, H - padY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 42, 0, Math.PI * 2);
    ctx.stroke();

    // Left & Right keys + free-throw circles + 3-point arcs
    ctx.strokeRect(padX, H / 2 - keyH / 2, keyW, keyH);
    ctx.strokeRect(W - padX - keyW, H / 2 - keyH / 2, keyW, keyH);

    ctx.beginPath();
    ctx.arc(padX + keyW, H / 2, 36, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W - padX - keyW, H / 2, 36, Math.PI / 2, (Math.PI * 3) / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(padX + 18, H / 2, 118, -Math.PI * 0.42, Math.PI * 0.42);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W - padX - 18, H / 2, 118, Math.PI * 0.58, Math.PI * 1.42);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    bballCourtMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.62,
      metalness: 0.02
    });
    return bballCourtMat;
  }

  // Procedural High-Res Badminton Court Floor Material (單一平面繪製體育館羽球場，消除閃爍)
  let badmintonCourtMat = null;
  function getBadmintonCourtMaterial() {
    if (badmintonCourtMat) return badmintonCourtMat;
    const W = 512;
    const H = 512;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Warm maple hardwood floor surround
    ctx.fillStyle = "#d99e64";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(160, 100, 45, 0.22)";
    ctx.lineWidth = 2;
    for (let i = 0; i < W; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
      ctx.stroke();
    }

    // BWF standard tournament green PVC mat
    const mx = 48;
    const my = 42;
    const mw = W - mx * 2;
    const mh = H - my * 2;
    ctx.fillStyle = "#15803d";
    ctx.fillRect(mx, my, mw, mh);

    // Crisp white badminton court boundary & service lines
    const cx = mx + 24;
    const cy = my + 24;
    const cw = mw - 48;
    const ch = mh - 48;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(cx, cy, cw, ch);

    // Singles sidelines
    ctx.strokeRect(cx + 26, cy, cw - 52, ch);
    // Long service lines for doubles
    ctx.strokeRect(cx, cy + 24, cw, ch - 48);

    // Short service lines (North & South of center net)
    const netY = H / 2;
    const shortOff = 68;
    ctx.beginPath();
    ctx.moveTo(cx, netY - shortOff);
    ctx.lineTo(cx + cw, netY - shortOff);
    ctx.moveTo(cx, netY + shortOff);
    ctx.lineTo(cx + cw, netY + shortOff);
    // Center service lines
    ctx.moveTo(W / 2, cy);
    ctx.lineTo(W / 2, netY - shortOff);
    ctx.moveTo(W / 2, netY + shortOff);
    ctx.lineTo(W / 2, cy + ch);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    badmintonCourtMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.58,
      metalness: 0.02
    });
    return badmintonCourtMat;
  }

  // Procedural Standing Long-Jump Safety Mat Material (立定跳遠安全地墊材質・無閃爍)
  let longJumpMat = null;
  function getLongJumpMatMaterial() {
    if (longJumpMat) return longJumpMat;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, 256, 256);

    // Safety tile grid lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    for (let i = 0; i <= 256; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }

    // White standing long-jump measurement lines on the right half
    ctx.fillStyle = "#f8fafc";
    for (let r = 0; r < 6; r++) {
      const y = 36 + r * 34;
      ctx.fillRect(148, y, 76, 8);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    longJumpMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.78,
      metalness: 0.02
    });
    return longJumpMat;
  }

  // Procedural Central Soccer Pitch Mowed Turf & Markings Material (中央足球草坪單一材質・無閃爍)
  let soccerPitchMat = null;
  function getSoccerPitchMaterial() {
    if (soccerPitchMat) return soccerPitchMat;
    const W = 1024;
    const H = 512;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Alternating mowed grass stripes
    const stripes = 12;
    const sw = W / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#74b048" : "#6ca442";
      ctx.fillRect(i * sw, 0, sw + 1, H);
    }

    // Plain mowed infield grass (no goals, no pitch lines — students just play freely on the field)
    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    soccerPitchMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.84,
      metalness: 0.02
    });
    return soccerPitchMat;
  }

  // Procedural Live Broadcast TV Screen Texture for Station 08 (媒體報導直播螢幕)
  let liveNewsMat = null;
  function getLiveNewsMaterial() {
    if (liveNewsMat) return liveNewsMat;
    const W = 512;
    const H = 288;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#1d4ed8");
      grad.addColorStop(1, "#0f172a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Top red LIVE banner
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(22, 20, 112, 38);
      ctx.fillStyle = "#ffffff";
      ctx.font = '900 22px "Noto Sans TC", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("● LIVE", 78, 40);

      // Studio headline
      ctx.textAlign = "left";
      ctx.fillStyle = "#fde047";
      ctx.font = '900 32px "Noto Sans TC", sans-serif';
      ctx.fillText("漚汪國小新聞焦點", 150, 42);

      // Illustrated card preview inside TV screen
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(22, 74, 468, 134);
      ctx.fillStyle = "#fb923c";
      ctx.fillRect(36, 90, 140, 102);
      ctx.fillStyle = "#fff";
      ctx.font = '900 44px "Noto Sans TC", sans-serif';
      ctx.fillText("64", 66, 146);

      ctx.fillStyle = "#f8fafc";
      ctx.font = '700 24px "Noto Sans TC", sans-serif';
      ctx.fillText("媒體報導六大主題整理", 196, 116);
      ctx.fillStyle = "#93c5fd";
      ctx.font = '500 18px "Noto Sans TC", sans-serif';
      ctx.fillText("食農探索・課程創新・品格感恩", 196, 152);
      ctx.fillText("藝文雙語・公益關懷・110校慶", 196, 180);

      // Bottom breaking news ticker bar
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(0, 232, W, 56);
      ctx.fillStyle = "#1e293b";
      ctx.font = '900 22px "Noto Sans TC", sans-serif';
      ctx.fillText("📢 走讀將軍胡蘿蔔之鄉・看見漚汪教育溫度", 24, 262);
    };
    draw();

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        draw();
        tex.needsUpdate = true;
      });
    }
    liveNewsMat = new THREE.MeshStandardMaterial({
      map: tex,
      emissive: "#1e40af",
      emissiveIntensity: 0.25,
      roughness: 0.3
    });
    return liveNewsMat;
  }

  // Sculpted 3D Beveled Heart Geometry for Character & Landmark Icons
  function createHeartGeo(scale = 1) {
    const s = new THREE.Shape();
    s.moveTo(0, 0.22 * scale);
    s.bezierCurveTo(0.05 * scale, 0.38 * scale, 0.38 * scale, 0.44 * scale, 0.38 * scale, 0.16 * scale);
    s.bezierCurveTo(0.38 * scale, -0.06 * scale, 0.14 * scale, -0.22 * scale, 0, -0.36 * scale);
    s.bezierCurveTo(-0.14 * scale, -0.22 * scale, -0.38 * scale, -0.06 * scale, -0.38 * scale, 0.16 * scale);
    s.bezierCurveTo(-0.38 * scale, 0.44 * scale, -0.05 * scale, 0.38 * scale, 0, 0.22 * scale);
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 0.12 * scale,
      bevelEnabled: true,
      bevelThickness: 0.04 * scale,
      bevelSize: 0.035 * scale,
      bevelSegments: 3,
      curveSegments: 16
    });
    geo.translate(0, 0, -0.06 * scale);
    return geo;
  }

  const litWindowMat = new THREE.MeshStandardMaterial({
    color: "#fbe7a6",
    emissive: "#ffcf6b",
    emissiveIntensity: 0.14,
    roughness: 0.35
  });
  windowMaterials.push(litWindowMat);

  const screenGlowMat = new THREE.MeshStandardMaterial({
    color: "#7fd3ff",
    emissive: "#38bdf8",
    emissiveIntensity: 0.65,
    roughness: 0.25
  });

  // Helper: Create Octagonal Beveled ExtrudeGeometry
  function createOctagonGeo(radius, depth, bevel = 0.08) {
    const shape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 8 + (i * Math.PI) / 4;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 2,
      curveSegments: 1
    });
    geo.rotateX(-Math.PI / 2);
    return geo;
  }

  // Helper: Create Stadium / Oval Shape for Running Track
  function createStadiumShape(straightLen, radius) {
    const s = new THREE.Shape();
    const hw = straightLen / 2;
    s.absarc(hw, 0, radius, -Math.PI / 2, Math.PI / 2, false);
    s.absarc(-hw, 0, radius, Math.PI / 2, (Math.PI * 3) / 2, false);
    s.closePath();
    return s;
  }

  // Exact Constant-Speed Arc-Length Evaluator for a Stadium Oval Track
  // Guarantees 100% uniform running speed with zero sudden jumps!
  function sampleStadiumOvalByArcLength(straightLen, radius, uNorm, centerZ = -2.0) {
    const u = ((uNorm % 1) + 1) % 1;
    const hw = straightLen / 2;
    const arcLen = Math.PI * radius;
    const totalPerim = 2 * straightLen + 2 * arcLen;
    let s = u * totalPerim;

    let x = 0,
      z = 0,
      tx = 1,
      tz = 0;

    if (s < straightLen) {
      // Bottom straightaway (going +x at local z = +radius)
      const f = s / straightLen;
      x = -hw + f * straightLen;
      z = radius;
      tx = 1;
      tz = 0;
    } else if (s < straightLen + arcLen) {
      // Right semicircle (from local z = +radius around +hw to z = -radius)
      const a = Math.PI / 2 - ((s - straightLen) / arcLen) * Math.PI;
      x = hw + Math.cos(a) * radius;
      z = Math.sin(a) * radius;
      tx = Math.sin(a);
      tz = -Math.cos(a);
    } else if (s < 2 * straightLen + arcLen) {
      // Top straightaway (going -x at local z = -radius)
      const f = (s - straightLen - arcLen) / straightLen;
      x = hw - f * straightLen;
      z = -radius;
      tx = -1;
      tz = 0;
    } else {
      // Left semicircle (from local z = -radius around -hw to z = +radius)
      const a = -Math.PI / 2 - ((s - 2 * straightLen - arcLen) / arcLen) * Math.PI;
      x = -hw + Math.cos(a) * radius;
      z = Math.sin(a) * radius;
      tx = Math.sin(a);
      tz = -Math.cos(a);
    }

    return {
      x,
      z: centerZ + z,
      rotY: Math.atan2(tx, tz)
    };
  }

  // Helper: Create Canvas Signboard Mesh
  function createSignboard(text, bgColor = "#c96f4a", fgColor = "#fffaf2", height = 0.28) {
    const group = new THREE.Group();
    const widthPx = Math.round(96 * (0.95 * text.length + 0.9));
    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, widthPx, 96);
      ctx.strokeStyle = fgColor;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 5;
      ctx.strokeRect(8, 8, widthPx - 16, 80);
      ctx.globalAlpha = 1;
      ctx.fillStyle = fgColor;
      ctx.font = '900 54px "Noto Sans TC", "Microsoft JhengHei", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, widthPx / 2, 50);
    };
    draw();

    const tex = new THREE.CanvasTexture(canvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        draw();
        tex.needsUpdate = true;
      });
    }

    const aspect = widthPx / 96;
    const w = height * aspect;
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.09, height + 0.09, 0.055),
      getMat(bgColor)
    );
    back.castShadow = true;
    group.add(back);

    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(w, height),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.z = 0.032;
    group.add(face);

    return group;
  }

  // Helper: Refined Campus Building with Plinth, Pilasters, Framed Windows, Solar Array & Signboard
  function createBuilding({
    w = 2.6,
    d = 1.3,
    floors = 2,
    wall = "#f2e5ce",
    trim = "#e85d2a",
    sign = "",
    roofType = "flat",
    solar = false
  }) {
    const group = new THREE.Group();
    const floorH = 0.6;
    const h = floors * floorH;

    // Solid Stone Plinth Base (sits cleanly at y >= 0.01)
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.1, 0.08, d + 0.1),
      getMat("#d6cec2")
    );
    plinth.position.y = 0.04;
    plinth.receiveShadow = true;
    group.add(plinth);

    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), getMat(wall));
    body.position.y = 0.08 + h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Corner decorative pilasters
    [
      [-w / 2 + 0.06, -d / 2 + 0.06],
      [w / 2 - 0.06, -d / 2 + 0.06],
      [-w / 2 + 0.06, d / 2 - 0.06],
      [w / 2 - 0.06, d / 2 - 0.06]
    ].forEach(([px, pz]) => {
      const pilaster = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, h + 0.02, 0.14),
        getMat(trim)
      );
      pilaster.position.set(px, 0.08 + h / 2, pz);
      group.add(pilaster);
    });

    // Floor cornice bands
    for (let f = 1; f <= floors; f++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.1, 0.055, d + 0.1),
        getMat(trim)
      );
      band.position.y = 0.08 + f * floorH;
      group.add(band);
    }

    const roofBaseY = 0.08 + h;

    if (roofType === "gable") {
      const roofShape = new THREE.Shape();
      roofShape.moveTo(-d / 2 - 0.16, 0);
      roofShape.lineTo(d / 2 + 0.16, 0);
      roofShape.lineTo(0, 0.56);
      roofShape.closePath();
      const roofGeo = new THREE.ExtrudeGeometry(roofShape, {
        depth: w + 0.2,
        bevelEnabled: false
      });
      roofGeo.translate(0, 0, -(w + 0.2) / 2);
      roofGeo.rotateY(Math.PI / 2);
      const roof = new THREE.Mesh(roofGeo, getMat(trim, { flatShading: true }));
      roof.position.y = roofBaseY + 0.02;
      roof.castShadow = true;
      group.add(roof);

      // Decorative roof ridge cap
      const ridgeCap = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.24, 0.05, 0.09),
        getMat("#f8fafc")
      );
      ridgeCap.position.y = roofBaseY + 0.58;
      group.add(ridgeCap);

      if (solar) {
        // Raised on aluminum rails cleanly above the gable slope so it never clips or flickers
        [-w * 0.3, w * 0.3].forEach((rx) => {
          const strut = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.07, d * 0.44),
            getMat("#cbd5e1")
          );
          strut.position.set(rx, roofBaseY + 0.34, d * 0.26);
          strut.rotation.x = 0.62;
          group.add(strut);
        });
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(w - 0.22, 0.04, d * 0.52),
          getSolarPanelMaterial()
        );
        panel.position.set(0, roofBaseY + 0.4, d * 0.27);
        panel.rotation.x = 0.62;
        panel.castShadow = true;
        group.add(panel);
      }
    } else {
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.2, 0.1, d + 0.2),
        getMat(trim)
      );
      cap.position.y = roofBaseY + 0.05;
      cap.castShadow = true;
      group.add(cap);

      const parapet = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.12, 0.05, d + 0.12),
        getMat("#f8fafc")
      );
      parapet.position.y = roofBaseY + 0.125;
      group.add(parapet);

      if (solar) {
        // Raised on aluminum rails cleanly above flat roof cap
        [-w * 0.32, w * 0.32].forEach((rx) => {
          const strut = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, 0.14, 6),
            getMat("#cbd5e1")
          );
          strut.position.set(rx, roofBaseY + 0.18, 0);
          group.add(strut);
        });
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(w - 0.24, 0.045, d - 0.24),
          getSolarPanelMaterial()
        );
        panel.position.set(0, roofBaseY + 0.25, 0);
        panel.rotation.x = 0.12;
        panel.castShadow = true;
        group.add(panel);
      }
    }

    // Framed Windows with White Sills & Center Mullions
    const cols = Math.max(2, Math.floor(w / 0.48));
    const startX = -((cols - 1) * 0.45) / 2;
    for (let r = 0; r < floors; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = startX + c * 0.45;
        if (r === 0 && Math.abs(wx) < 0.28) continue;
        const wy = 0.08 + 0.32 + r * floorH;
        const wz = d / 2 + 0.015;

        const winFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.3, 0.03),
          getMat("#f8fafc")
        );
        winFrame.position.set(wx, wy, wz);
        group.add(winFrame);

        const winGlass = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.25, 0.038),
          litWindowMat
        );
        winGlass.position.set(wx, wy, wz + 0.006);
        group.add(winGlass);

        const mullion = new THREE.Mesh(
          new THREE.BoxGeometry(0.022, 0.25, 0.044),
          getMat("#f8fafc")
        );
        mullion.position.set(wx, wy, wz + 0.008);
        group.add(mullion);

        const sill = new THREE.Mesh(
          new THREE.BoxGeometry(0.34, 0.03, 0.06),
          getMat("#e2e8f0")
        );
        sill.position.set(wx, wy - 0.15, wz + 0.02);
        group.add(sill);
      }
    }

    // Double Entrance Door, Transom, Handles, Frame & Steps
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.52, 0.04),
      getMat("#f8fafc")
    );
    doorFrame.position.set(0, 0.08 + 0.26, d / 2 + 0.015);
    group.add(doorFrame);

    const door = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.46, 0.05),
      getMat("#6d4c3d")
    );
    door.position.set(0, 0.08 + 0.23, d / 2 + 0.022);
    group.add(door);

    const doorSeam = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.44, 0.056),
      getMat("#3e2723")
    );
    doorSeam.position.set(0, 0.08 + 0.23, d / 2 + 0.024);
    group.add(doorSeam);

    [-0.04, 0.04].forEach((hx) => {
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.07, 0.065),
        getMat("#fbbf24", { metalness: 0.6, roughness: 0.2 })
      );
      handle.position.set(hx, 0.08 + 0.23, d / 2 + 0.026);
      group.add(handle);
    });

    const step = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.06, 0.24),
      getMat("#cbd5e1")
    );
    step.position.set(0, 0.03, d / 2 + 0.14);
    group.add(step);

    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.06, 0.36),
      getMat(trim)
    );
    canopy.position.set(0, 0.08 + 0.54, d / 2 + 0.15);
    group.add(canopy);

    if (sign) {
      const signMesh = createSignboard(sign, trim, "#fffaf2", 0.23);
      signMesh.position.set(
        0,
        roofBaseY + (roofType === "gable" ? 0.72 : 0.38),
        d / 2 - 0.04
      );
      group.add(signMesh);
    }

    return group;
  }

  // Helper: Refined Lush Campus Shade Tree with Root Planter Ring & Layered Foliage
  function createTree(scale = 1, color = "#56a847") {
    const group = new THREE.Group();
    const trunkH = 0.86 * scale;

    // Subtle soil/stone tree ring at base
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18 * scale, 0.22 * scale, 0.04 * scale, 10),
      getMat("#94a3b8")
    );
    ring.position.y = 0.02 * scale;
    group.add(ring);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07 * scale, 0.125 * scale, trunkH, 9),
      getMat("#7c4d2b")
    );
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    group.add(trunk);

    const crownMat = getMat(color, { flatShading: true });
    const crownLightMat = getMat("#74c358", { flatShading: true });

    const c1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48 * scale, 1), crownMat);
    c1.position.set(0, trunkH + 0.28 * scale, 0);
    c1.castShadow = true;
    group.add(c1);

    const c2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35 * scale, 1), crownLightMat);
    c2.position.set(0.26 * scale, trunkH + 0.1 * scale, 0.12 * scale);
    c2.castShadow = true;
    group.add(c2);

    const c3 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35 * scale, 1), crownMat);
    c3.position.set(-0.24 * scale, trunkH + 0.14 * scale, -0.1 * scale);
    c3.castShadow = true;
    group.add(c3);

    const c4 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28 * scale, 1), crownLightMat);
    c4.position.set(0, trunkH + 0.52 * scale, 0.06 * scale);
    c4.castShadow = true;
    group.add(c4);

    return group;
  }

  // Helper: Refined Campus Royal Palm Tree (椰子樹：竹節樹幹 + 椰果 + 弧形羽狀葉)
  function createPalmTree(scale = 1) {
    const group = new THREE.Group();
    const trunkH = 1.68 * scale;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062 * scale, 0.115 * scale, trunkH, 10),
      getMat("#8d6e53")
    );
    trunk.position.y = trunkH / 2;
    trunk.castShadow = true;
    group.add(trunk);

    // Ringed bark joints for Royal Palm authenticity
    [0.42, 0.84, 1.24].forEach((ry) => {
      const barkRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.088 * scale, 0.095 * scale, 0.05 * scale, 10),
        getMat("#755840")
      );
      barkRing.position.y = ry * scale;
      group.add(barkRing);
    });

    // Subtle green crownshaft at top of trunk
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068 * scale, 0.064 * scale, 0.24 * scale, 10),
      getMat("#4d9e3f")
    );
    shaft.position.y = trunkH - 0.08 * scale;
    group.add(shaft);

    // Cluster of coconuts
    const cocoMat = getMat("#78350f");
    for (let c = 0; c < 3; c++) {
      const a = (c * Math.PI * 2) / 3;
      const coco = new THREE.Mesh(new THREE.SphereGeometry(0.048 * scale, 8, 6), cocoMat);
      coco.position.set(
        Math.cos(a) * 0.06 * scale,
        trunkH - 0.04 * scale,
        Math.sin(a) * 0.06 * scale
      );
      group.add(coco);
    }

    const frondMat = getMat("#4d9e3f", { flatShading: true });
    for (let i = 0; i < 7; i++) {
      const ang = (i * Math.PI * 2) / 7;
      const frondGroup = new THREE.Group();
      frondGroup.position.set(0, trunkH + 0.02 * scale, 0);
      frondGroup.rotation.y = ang;

      const innerLeaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.15 * scale, 0.032 * scale, 0.42 * scale),
        frondMat
      );
      innerLeaf.position.set(0, 0.04 * scale, 0.2 * scale);
      innerLeaf.rotation.x = 0.22;
      innerLeaf.castShadow = true;
      frondGroup.add(innerLeaf);

      const outerLeaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.12 * scale, 0.026 * scale, 0.42 * scale),
        frondMat
      );
      outerLeaf.position.set(0, -0.09 * scale, 0.56 * scale);
      outerLeaf.rotation.x = 0.65;
      outerLeaf.castShadow = true;
      frondGroup.add(outerLeaf);

      group.add(frondGroup);
    }
    return group;
  }

  // Helper: Single 3D Plump Jiangjun Carrot (將軍胡蘿蔔)
  function createCarrot(scale = 1, exposed = 0.5) {
    const group = new THREE.Group();
    const bodyH = 0.36 * scale;
    const body = new THREE.Mesh(
      new THREE.ConeGeometry(0.11 * scale, bodyH, 10),
      getMat("#f97316")
    );
    body.rotation.x = Math.PI;
    body.position.y = (exposed - 0.5) * bodyH;
    body.castShadow = true;
    group.add(body);

    const shoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.108 * scale, 10, 8),
      getMat("#ea580c")
    );
    shoulder.position.y = exposed * bodyH;
    group.add(shoulder);

    const leafMat = getMat("#3f9b48");
    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(
        new THREE.ConeGeometry(0.052 * scale, 0.24 * scale, 6),
        leafMat
      );
      const ang = (i * Math.PI * 2) / 4;
      leaf.position.set(
        Math.cos(ang) * 0.032 * scale,
        exposed * bodyH + 0.12 * scale,
        Math.sin(ang) * 0.032 * scale
      );
      leaf.rotation.z = Math.cos(ang) * 0.38;
      leaf.rotation.x = Math.sin(ang) * 0.38;
      group.add(leaf);
    }
    return group;
  }

  // Helper: Carrot Field Patch (紅蘿蔔田畦・層次分明不重疊)
  function createCarrotPatch(w = 3.2, d = 2.0, rows = 3, cols = 5) {
    const group = new THREE.Group();
    const soilBase = new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.1, d),
      getMat("#7b4f2e")
    );
    soilBase.position.y = 0.05;
    soilBase.receiveShadow = true;
    group.add(soilBase);

    const rowSpacing = d / (rows + 0.4);
    const colSpacing = w / (cols + 0.5);

    for (let r = 0; r < rows; r++) {
      const z = -d / 2 + rowSpacing * (r + 0.7);
      const ridge = new THREE.Mesh(
        new THREE.BoxGeometry(w - 0.2, 0.09, rowSpacing * 0.58),
        getMat("#8f5d38")
      );
      ridge.position.set(0, 0.145, z);
      ridge.receiveShadow = true;
      group.add(ridge);

      for (let c = 0; c < cols; c++) {
        const x = -w / 2 + colSpacing * (c + 0.75);
        const s = 0.85 + ((r * 3 + c * 7) % 4) * 0.12;
        const carrot = createCarrot(s, 0.55);
        carrot.position.set(x, 0.19, z);
        carrot.rotation.y = (r + c) * 1.1;
        group.add(carrot);
      }
    }
    return group;
  }

  // Helper: Graceful Flying White Egret (白鷺鷥) with Articulated Flapping Wings
  function createWhiteEgret(scale = 1) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    inner.scale.setScalar(scale);
    group.add(inner);

    const whiteMat = getMat("#ffffff", { roughness: 0.45 });
    const beakMat = getMat("#f59e0b");
    const legMat = getMat("#1e293b");

    // Streamlined white body
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.54, 10), whiteMat);
    body.rotation.x = Math.PI / 2;
    body.scale.set(1, 1, 0.75);
    body.castShadow = true;
    inner.add(body);

    // Tail feathers
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.24, 6), whiteMat);
    tail.rotation.x = -Math.PI / 2;
    tail.position.set(0, 0, -0.33);
    inner.add(tail);

    // Slender S-curved neck + head + pointed yellow beak + eyes + crest plume
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.038, 0.28, 8), whiteMat);
    neck.position.set(0, 0.1, 0.24);
    neck.rotation.x = 0.55;
    inner.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), whiteMat);
    head.position.set(0, 0.2, 0.34);
    inner.add(head);

    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.13, 5), whiteMat);
    plume.rotation.x = -Math.PI * 0.42;
    plume.position.set(0, 0.235, 0.27);
    inner.add(plume);

    [-0.038, 0.038].forEach((ex) => {
      const eDot = new THREE.Mesh(new THREE.SphereGeometry(0.01, 6, 6), legMat);
      eDot.position.set(ex, 0.21, 0.36);
      inner.add(eDot);
    });

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.19, 8), beakMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.19, 0.47);
    inner.add(beak);

    // Long trailing dark legs
    [-0.035, 0.035].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.36, 6), legMat);
      leg.rotation.x = Math.PI / 2 - 0.12;
      leg.position.set(lx, -0.05, -0.39);
      inner.add(leg);
    });

    // Articulated Left & Right 2-segment Wings
    const makeWing = (dir) => {
      const root = new THREE.Group();
      root.position.set(dir * 0.07, 0.03, 0.04);

      const innerW = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.022, 0.24),
        whiteMat
      );
      innerW.position.set(dir * 0.21, 0, -0.02);
      innerW.castShadow = true;
      root.add(innerW);

      const outerPivot = new THREE.Group();
      outerPivot.position.set(dir * 0.41, 0, -0.02);
      const outerW = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.018, 0.18),
        whiteMat
      );
      outerW.position.set(dir * 0.19, 0, -0.02);
      outerW.castShadow = true;
      outerPivot.add(outerW);
      root.add(outerPivot);

      return { root, outerPivot };
    };

    const wingL = makeWing(-1);
    const wingR = makeWing(1);
    inner.add(wingL.root, wingR.root);

    return { group, inner, wingL, wingR };
  }

  // Helper: Refined Lively Miniature Person
  // Strictly non-overlapping leg/sock/shoe geometry with sole at y = +0.014 to prevent any foot flickering!
  function createPerson({
    shirt = "#ffffff",
    pants = "#2f3e5c",
    hat = null, // 'straw' | 'cap' | 'headband' | 'none'
    prop = null, // 'book' | 'badminton' | 'drumsticks' | 'accordion' | 'trophy' | 'camera' | 'carrot' | 'baton' | 'none'
    task = "wave",
    route = null,
    ovalTrack = null,
    speed = 1.8,
    seed = 1,
    scale = 1,
    isUserAvatar = false
  }) {
    const group = new THREE.Group();
    const inner = new THREE.Group();
    inner.scale.setScalar(scale);
    group.add(inner);

    const skinColors = ["#f6d2ae", "#f2c69d", "#eab98f"];
    const hairColors = ["#241c18", "#36261b", "#1c1917"];
    const skin = skinColors[seed % skinColors.length];
    const hair = hairColors[seed % hairColors.length];
    const skinMat = getMat(skin);
    const shirtMat = getMat(shirt);
    const pantsMat = getMat(pants);
    const whiteMat = getMat("#ffffff");

    // Non-overlapping articulated leg builder (hip at y = 0.295, sole bottom at +0.026 above floor!)
    // Guarantees zero floor clipping & zero shadow-acne flickering on feet at any animation angle!
    const buildLeg = (xOff) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(xOff, 0.295, 0);

      // Shorts upper leg: y from 0 to -0.11
      const shortsMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.045, 0.11, 10),
        pantsMat
      );
      shortsMesh.position.y = -0.055;
      shortsMesh.castShadow = true;
      legGroup.add(shortsMesh);

      // Calf skin: y from -0.112 to -0.188
      const calfMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.036, 0.032, 0.076, 10),
        skinMat
      );
      calfMesh.position.y = -0.15;
      legGroup.add(calfMesh);

      // Athletic white sock: y from -0.19 to -0.226
      const sockMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.036, 0.036, 10),
        whiteMat
      );
      sockMesh.position.y = -0.208;
      legGroup.add(sockMesh);

      // Sneaker upper (no castShadow/receiveShadow to eliminate thin sole shadow acne)
      const shoeUpper = new THREE.Mesh(
        new THREE.BoxGeometry(0.086, 0.028, 0.132),
        whiteMat
      );
      shoeUpper.position.set(0, -0.241, 0.018);
      legGroup.add(shoeUpper);

      // Sneaker accent sole: y from -0.255 to -0.269 (sole bottom = +0.026 above ground!)
      const shoeSole = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.014, 0.138),
        shirtMat
      );
      shoeSole.position.set(0, -0.262, 0.018);
      legGroup.add(shoeSole);

      return legGroup;
    };

    const legL = buildLeg(-0.065);
    const legR = buildLeg(0.065);
    inner.add(legL, legR);

    // Refined Torso with Sporty Collar Trim & Waistband
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.125, 0.115, 0.29, 12),
      shirtMat
    );
    torso.scale.set(1.06, 1, 0.76);
    torso.position.set(0, 0.425, 0);
    torso.castShadow = true;
    inner.add(torso);

    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(0.075, 0.016, 8, 16),
      whiteMat
    );
    collar.rotation.x = Math.PI / 2;
    collar.scale.set(1, 0.78, 1);
    collar.position.set(0, 0.565, 0.01);
    inner.add(collar);

    // Articulated Arms with Sleeve, Forearm & Spherical Hand
    const buildArm = (xOff) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(xOff, 0.51, 0);

      const sleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.038, 0.1, 10),
        shirtMat
      );
      sleeve.position.y = -0.05;
      armGroup.add(sleeve);

      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.028, 0.11, 10),
        skinMat
      );
      forearm.position.y = -0.145;
      armGroup.add(forearm);

      const hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.034, 8, 8),
        skinMat
      );
      hand.position.y = -0.21;
      armGroup.add(hand);

      return armGroup;
    };

    const armL = buildArm(-0.155);
    const armR = buildArm(0.155);
    inner.add(armL, armR);

    // Expressive Head with Eyes, Rosy Cheeks, Ears & Sculpted Hair
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.69, 0);
    inner.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.138, 14, 12), skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Ears
    [-0.135, 0.135].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), skinMat);
      ear.position.set(ex, 0, 0);
      headGroup.add(ear);
    });

    // Eyes & Rosy Cheeks (on +Z front face)
    const eyeMat = getMat("#1e293b", { roughness: 0.2 });
    const cheekMat = getMat("#fb7185", { roughness: 0.6 });
    [-0.046, 0.046].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 6), eyeMat);
      eye.position.set(ex, 0.015, 0.126);
      headGroup.add(eye);

      const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), cheekMat);
      cheek.scale.set(1.2, 0.7, 0.5);
      cheek.position.set(ex * 1.45, -0.022, 0.122);
      headGroup.add(cheek);
    });

    // Happy smile arc on face
    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.026, 0.006, 6, 10, Math.PI * 0.8),
      getMat("#991b1b")
    );
    smile.rotation.z = Math.PI * 1.1;
    smile.position.set(0, -0.028, 0.132);
    headGroup.add(smile);

    // Sculpted Hair Cap + Ponytail for half the students
    const hairMat = getMat(hair);
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.144, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.56),
      hairMat
    );
    hairCap.position.set(0, 0.015, -0.008);
    hairCap.rotation.x = -0.12;
    headGroup.add(hairCap);

    if (seed % 2 === 0) {
      const ponytail = new THREE.Mesh(
        new THREE.ConeGeometry(0.048, 0.14, 8),
        hairMat
      );
      ponytail.position.set(0, 0.01, -0.16);
      ponytail.rotation.x = -Math.PI * 0.65;
      headGroup.add(ponytail);
    }

    // Refined Hats / Headbands
    if (hat === "straw") {
      const brim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.022, 16),
        getMat("#e8c96a")
      );
      brim.position.set(0, 0.08, 0);
      headGroup.add(brim);
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.145, 0.095, 14),
        getMat("#e8c96a")
      );
      top.position.set(0, 0.13, 0);
      headGroup.add(top);
      const ribbon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.146, 0.146, 0.024, 14),
        getMat("#ea580c")
      );
      ribbon.position.set(0, 0.095, 0);
      headGroup.add(ribbon);
    } else if (hat === "cap") {
      const capDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.148, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5),
        getMat("#f97316")
      );
      capDome.position.set(0, 0.04, 0);
      headGroup.add(capDome);
      const visor = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.018, 0.12),
        getMat("#ea580c")
      );
      visor.position.set(0, 0.045, 0.14);
      visor.rotation.x = 0.15;
      headGroup.add(visor);
    } else if (hat === "headband") {
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.146, 0.146, 0.042, 16),
        getMat("#ef4444")
      );
      band.position.set(0, 0.04, 0);
      headGroup.add(band);
      const badgeDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 8, 6),
        getMat("#fde047")
      );
      badgeDot.position.set(0, 0.04, 0.146);
      headGroup.add(badgeDot);
    }

    // Refined Handheld Props (No basketball in user selector; refined models for all props)
    let propMesh = null;
    let accParts = null;
    if (prop === "book") {
      const bookGrp = new THREE.Group();
      const coverL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.18, 0.02), getMat("#f59e0b"));
      coverL.position.set(-0.06, 0, 0);
      coverL.rotation.y = 0.25;
      bookGrp.add(coverL);
      const coverR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.18, 0.02), getMat("#f59e0b"));
      coverR.position.set(0.06, 0, 0);
      coverR.rotation.y = -0.25;
      bookGrp.add(coverR);
      const pages = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.022), getMat("#fffbeb"));
      pages.position.set(0, 0, 0.012);
      bookGrp.add(pages);
      bookGrp.position.set(0, -0.21, 0.09);
      armR.add(bookGrp);
      propMesh = bookGrp;
    } else if (prop === "drumsticks") {
      const makeStick = () => {
        const st = new THREE.Group();
        const wood = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.016, 0.24, 8),
          getMat("#fde68a")
        );
        wood.rotation.x = Math.PI / 2;
        st.add(wood);
        const gripBand = new THREE.Mesh(
          new THREE.CylinderGeometry(0.017, 0.017, 0.05, 8),
          getMat("#ef4444")
        );
        gripBand.rotation.x = Math.PI / 2;
        gripBand.position.z = -0.07;
        st.add(gripBand);
        st.position.set(0, -0.21, 0.1);
        return st;
      };
      armL.add(makeStick());
      armR.add(makeStick());
    } else if (prop === "accordion") {
      const acc = new THREE.Group();
      acc.position.set(0, 0.4, 0.145);

      const caseMat = getMat("#dc2626", { roughness: 0.28, metalness: 0.12 });
      const darkMat = getMat("#1e293b", { roughness: 0.45 });
      const ivoryMat = getMat("#fffdf5", { roughness: 0.35 });
      const trimMat = getMat("#e2e8f0", { metalness: 0.45, roughness: 0.25 });

      const accLeft = new THREE.Group();
      accLeft.position.x = -0.082;
      const leftBox = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.195, 0.13), caseMat);
      accLeft.add(leftBox);
      const bassPanel = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.14, 0.085), darkMat);
      bassPanel.position.set(-0.025, 0, 0.01);
      accLeft.add(bassPanel);
      acc.add(accLeft);

      const accBellows = new THREE.Group();
      const bellowsCore = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.175, 0.115), darkMat);
      accBellows.add(bellowsCore);
      [-0.036, -0.018, 0, 0.018, 0.036].forEach((bx) => {
        const pleat = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.184, 0.122), ivoryMat);
        pleat.position.x = bx;
        accBellows.add(pleat);
      });
      acc.add(accBellows);

      const accRight = new THREE.Group();
      accRight.position.x = 0.082;
      const rightBox = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.205, 0.135), caseMat);
      accRight.add(rightBox);
      const grillPlate = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.165, 0.018), trimMat);
      grillPlate.position.set(0, 0, 0.064);
      accRight.add(grillPlate);
      const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.165, 0.048), ivoryMat);
      keyboard.position.set(0.028, 0, 0.028);
      accRight.add(keyboard);
      [-0.055, -0.025, 0.005, 0.035, 0.06].forEach((ky) => {
        const bKey = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.014, 0.025), darkMat);
        bKey.position.set(0.031, ky, 0.036);
        accRight.add(bKey);
      });
      acc.add(accRight);

      // Shoulder leather straps connecting accordion to torso
      [-0.07, 0.07].forEach((sx) => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.16, 0.08), darkMat);
        strap.position.set(sx, 0.05, -0.055);
        strap.rotation.x = 0.35;
        acc.add(strap);
      });

      inner.add(acc);
      accParts = { group: acc, left: accLeft, bellows: accBellows, right: accRight };
    } else if (prop === "trophy") {
      const tr = new THREE.Group();
      const goldMat = getMat("#fbbf24", { metalness: 0.6, roughness: 0.2 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.09), getMat("#78350f"));
      base.position.y = -0.08;
      tr.add(base);
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.035, 0.16, 12), goldMat);
      cup.position.y = 0.02;
      tr.add(cup);
      const handleRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.01, 6, 12), goldMat);
      handleRing.position.y = 0.03;
      tr.add(handleRing);
      tr.position.set(0, -0.22, 0.07);
      armR.add(tr);
      propMesh = tr;
    } else if (prop === "camera") {
      const cam = new THREE.Group();
      const camBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.09), getMat("#1e293b"));
      cam.add(camBody);
      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.07, 12),
        getMat("#94a3b8", { metalness: 0.6, roughness: 0.25 })
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0, 0.065);
      cam.add(lens);
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.034, 0.075, 12),
        getMat("#38bdf8", { metalness: 0.8, roughness: 0.1 })
      );
      glass.rotation.x = Math.PI / 2;
      glass.position.set(0, 0, 0.066);
      cam.add(glass);
      cam.position.set(0, -0.19, 0.08);
      armR.add(cam);
    } else if (prop === "carrot") {
      const heldCarrot = createCarrot(0.75, 0.6);
      heldCarrot.position.set(0, -0.22, 0.08);
      heldCarrot.rotation.x = Math.PI / 2;
      armR.add(heldCarrot);
    } else if (prop === "baton") {
      const batonGrp = new THREE.Group();
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.25, 10),
        getMat("#ef4444", { metalness: 0.45, roughness: 0.25 })
      );
      tube.rotation.x = Math.PI / 2;
      batonGrp.add(tube);
      const goldBand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.05, 10),
        getMat("#fbbf24", { metalness: 0.6, roughness: 0.2 })
      );
      goldBand.rotation.x = Math.PI / 2;
      goldBand.position.z = 0.08;
      batonGrp.add(goldBand);
      batonGrp.position.set(0, -0.21, 0.08);
      armR.add(batonGrp);
    } else if (prop === "badminton") {
      // 3D Badminton Racket (握柄 + 錐套 + 中管 + 橢圓拍框 + 白色球網面)
      const racket = new THREE.Group();
      const grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.018, 0.12, 8),
        getMat("#1e293b")
      );
      grip.position.y = -0.04;
      racket.add(grip);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.009, 0.16, 8),
        getMat("#e2e8f0", { metalness: 0.6, roughness: 0.25 })
      );
      shaft.position.y = 0.09;
      racket.add(shaft);

      const headRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.012, 8, 20),
        getMat("#0ea5e9", { metalness: 0.35, roughness: 0.3 })
      );
      headRing.scale.set(0.82, 1.15, 1);
      headRing.position.y = 0.27;
      racket.add(headRing);

      const strings = new THREE.Mesh(
        new THREE.CircleGeometry(0.088, 16),
        new THREE.MeshBasicMaterial({
          color: "#ffffff",
          transparent: true,
          opacity: 0.48,
          side: THREE.DoubleSide
        })
      );
      strings.scale.set(0.8, 1.12, 1);
      strings.position.y = 0.27;
      racket.add(strings);

      racket.rotation.x = Math.PI * 0.42;
      racket.position.set(0, -0.2, 0.06);
      armR.add(racket);
      propMesh = racket;
    }

    if (isUserAvatar) {
      // Elevated Golden Star Ring under the User's Jogging Avatar
      const starRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.026, 8, 28),
        getMat("#fbbf24", { emissive: "#f59e0b", emissiveIntensity: 0.3 })
      );
      starRing.rotation.x = Math.PI / 2;
      starRing.position.y = 0.04;
      group.add(starRing);
    }

    // Build smooth arc-length curve if route is provided
    let smoothRouteCurve = null;
    let smoothRouteLen = 1;
    let routeDist = 0;
    if (route && route.length >= 3) {
      const pts3 = route.map(([rx, rz]) => new THREE.Vector3(rx, 0, rz));
      smoothRouteCurve = new THREE.CatmullRomCurve3(pts3, true, "centripetal", 0.5);
      smoothRouteLen = Math.max(0.1, smoothRouteCurve.getLength());
      routeDist = ((seed * 0.23) % 1) * smoothRouteLen;
    }

    let ovalTotalPerim = 1;
    let ovalDist = 0;
    if (ovalTrack) {
      ovalTotalPerim =
        2 * ovalTrack.straightL + 2 * Math.PI * ovalTrack.radius;
      ovalDist = ((ovalTrack.startU || 0) % 1) * ovalTotalPerim;
    }

    let tAcc = seed * 1.73;
    const animateStep = (dt) => {
      if (!state.animate) return;
      tAcc += dt;

      if (ovalTrack) {
        ovalDist = (ovalDist + dt * speed) % ovalTotalPerim;
        const sample = sampleStadiumOvalByArcLength(
          ovalTrack.straightL,
          ovalTrack.radius,
          ovalDist / ovalTotalPerim,
          ovalTrack.centerZ
        );
        group.position.x = sample.x;
        group.position.z = sample.z;
        group.rotation.y = sample.rotY;

        const runCycle = tAcc * (speed * 4.4);
        const swing = Math.sin(runCycle) * 0.64;
        legL.rotation.x = swing;
        legR.rotation.x = -swing;
        armL.rotation.x = -swing * 0.85;
        armR.rotation.x = swing * 0.85;
        torso.rotation.x = 0.1;
        inner.position.y = Math.abs(Math.sin(runCycle)) * 0.05;
      } else if (smoothRouteCurve) {
        routeDist = (routeDist + dt * speed) % smoothRouteLen;
        const u = routeDist / smoothRouteLen;
        const pt = smoothRouteCurve.getPointAt(u);
        const tan = smoothRouteCurve.getTangentAt(u);
        group.position.x = pt.x;
        group.position.z = pt.z;
        group.rotation.y = Math.atan2(tan.x, tan.z);

        const runCycle = tAcc * (speed * 4.5);
        const swing = Math.sin(runCycle) * 0.62;
        legL.rotation.x = swing;
        legR.rotation.x = -swing;
        armL.rotation.x = -swing * 0.84;
        armR.rotation.x = swing * 0.84;
        torso.rotation.x = 0.1;
        inner.position.y = Math.abs(Math.sin(runCycle)) * 0.05;
      } else if (task === "run_in_place") {
        if (group.userData && group.userData.pausedAtStation) {
          // Stationary greeting while stopped at a station facing the user
          legL.rotation.x = 0;
          legR.rotation.x = 0;
          torso.rotation.x = 0;
          armL.rotation.x = -0.35 + Math.sin(tAcc * 4.5) * 0.18;
          armL.rotation.z = -0.35;
          armR.rotation.x = 0;
          armR.rotation.z = 2.45 + Math.sin(tAcc * 6.5) * 0.42;
          inner.position.y = Math.abs(Math.sin(tAcc * 3.8)) * 0.04;
        } else {
          const runCycle = tAcc * 6.8;
          const swing = Math.sin(runCycle) * 0.62;
          legL.rotation.x = swing;
          legR.rotation.x = -swing;
          armL.rotation.x = -swing * 0.84;
          armR.rotation.x = swing * 0.84;
          armL.rotation.z = 0;
          armR.rotation.z = 0;
          torso.rotation.x = 0.1;
          inner.position.y = Math.abs(Math.sin(runCycle)) * 0.05;
        }
      } else if (task === "badminton") {
        const bCycle = tAcc * 4.8;
        const swingWave = Math.sin(bCycle);
        const jump = Math.max(0, swingWave) * 0.13;
        inner.position.y = jump;
        armR.rotation.x = -2.15 + swingWave * 0.92;
        armR.rotation.z = 0.22;
        armL.rotation.x = -0.75 - swingWave * 0.35;
        armL.rotation.z = -0.35;
        legL.rotation.x = swingWave * 0.3;
        legR.rotation.x = -swingWave * 0.3;
        torso.rotation.x = swingWave * 0.1;
      } else if (task === "soccer") {
        const sCycle = tAcc * 5.6;
        const kick = Math.sin(sCycle);
        legR.rotation.x = kick * 0.68;
        legL.rotation.x = -kick * 0.38;
        armL.rotation.x = kick * 0.6;
        armR.rotation.x = -kick * 0.6;
        armL.rotation.z = -0.25;
        armR.rotation.z = 0.25;
        torso.rotation.x = -kick * 0.07;
        inner.position.y = Math.abs(Math.cos(sCycle)) * 0.055;
      } else if (task === "jumping_jacks") {
        const jj = (Math.sin(tAcc * 7.0) + 1) * 0.5;
        armL.rotation.z = -0.2 - jj * 2.4;
        armR.rotation.z = 0.2 + jj * 2.4;
        legL.rotation.z = -jj * 0.38;
        legR.rotation.z = jj * 0.38;
        inner.position.y = jj * 0.1;
      } else if (task === "hopscotch") {
        const hopT = tAcc * 5.0;
        inner.position.y = Math.abs(Math.sin(hopT)) * 0.14;
        inner.position.z = Math.sin(hopT * 0.5) * 0.1;
        armL.rotation.z = -1.2 - Math.abs(Math.sin(hopT)) * 0.75;
        armR.rotation.z = 1.2 + Math.abs(Math.sin(hopT)) * 0.75;
        legL.rotation.x = Math.sin(hopT) * 0.36;
        legR.rotation.x = -Math.sin(hopT) * 0.36;
      } else if (task === "drum") {
        armL.rotation.x = -1.25 + Math.sin(tAcc * 14) * 0.55;
        armR.rotation.x = -1.25 - Math.sin(tAcc * 14) * 0.55;
        inner.position.y = Math.abs(Math.sin(tAcc * 7)) * 0.04;
      } else if (task === "accordion") {
        const sq = Math.sin(tAcc * 5.2);
        const open = (sq + 1) * 0.5;
        armL.rotation.x = -1.18;
        armR.rotation.x = -1.18;
        armL.rotation.z = -0.18 + open * 0.22;
        armR.rotation.z = 0.18 - open * 0.22;
        torso.rotation.z = sq * 0.05;
        inner.rotation.z = sq * 0.07;
        inner.position.y = Math.abs(sq) * 0.035;
        if (accParts) {
          accParts.bellows.scale.x = 0.85 + open * 0.42;
          accParts.left.position.x = -(0.072 + open * 0.022);
          accParts.right.position.x = 0.072 + open * 0.022;
        }
      } else if (task === "story") {
        armR.rotation.x = -1.1 + Math.sin(tAcc * 4) * 0.2;
        armL.rotation.z = -1.8 - Math.sin(tAcc * 6) * 0.45;
        inner.rotation.y = Math.sin(tAcc * 2.2) * 0.35;
        inner.position.y = Math.abs(Math.sin(tAcc * 4)) * 0.04;
      } else if (task === "pull_carrot") {
        const pull = Math.sin(tAcc * 4.5);
        torso.rotation.x = 0.25 + pull * 0.25;
        armR.rotation.x = -1.8 - pull * 0.7;
        armL.rotation.x = -1.5 - pull * 0.5;
        inner.position.y = Math.max(0, -pull) * 0.09;
      } else if (task === "trophy") {
        armR.rotation.x = -2.7 + Math.sin(tAcc * 6) * 0.25;
        armL.rotation.z = -2.3 - Math.sin(tAcc * 6) * 0.35;
        inner.position.y = Math.abs(Math.sin(tAcc * 6.5)) * 0.1;
      } else if (task === "photo") {
        armR.rotation.x = -1.45;
        armL.rotation.x = -1.35;
        inner.rotation.y = Math.sin(tAcc * 1.8) * 0.55;
      } else if (task === "cheer") {
        armL.rotation.z = -2.45 - Math.sin(tAcc * 7) * 0.4;
        armR.rotation.z = 2.45 + Math.sin(tAcc * 7) * 0.4;
        inner.position.y = Math.abs(Math.sin(tAcc * 7)) * 0.08;
      } else if (task === "dance") {
        group.rotation.y += dt * 2.2;
        armL.rotation.z = -2.1 + Math.sin(tAcc * 6) * 0.5;
        armR.rotation.z = 2.1 - Math.sin(tAcc * 6) * 0.5;
        legL.rotation.x = Math.sin(tAcc * 6) * 0.32;
        legR.rotation.x = -Math.sin(tAcc * 6) * 0.32;
        inner.position.y = Math.abs(Math.sin(tAcc * 6)) * 0.065;
      } else {
        armR.rotation.z = 2.45 + Math.sin(tAcc * 6.5) * 0.42;
        inner.position.y = Math.abs(Math.sin(tAcc * 3.5)) * 0.035;
      }
    };

    dynamicCallbacks.push(animateStep);
    return group;
  }

  // Rebuild Only the User's Jogging Avatar (在各站不用有裝扮分身，裝扮只要慢跑分身就好)
  function rebuildUserAvatars() {
    const cfg = state.avatar;

    if (leadRunnerAvatarHolder) {
      while (leadRunnerAvatarHolder.children.length > 0) {
        leadRunnerAvatarHolder.remove(leadRunnerAvatarHolder.children[0]);
      }
      const runnerMesh = createPerson({
        shirt: cfg.shirt,
        pants: cfg.pants || "#1e293b",
        hat: cfg.hat === "none" ? null : cfg.hat,
        prop: cfg.prop === "none" ? null : cfg.prop,
        task: "run_in_place",
        seed: 201,
        scale: 1.32,
        isUserAvatar: true
      });
      runnerMesh.userData.pausedAtStation = Boolean(activeStopInfo);
      leadRunnerAvatarHolder.add(runnerMesh);
    }
  }

  // Build Specific Campus Architecture & Lively Student Crowd for Each of the 8 Stations (Refined & Zero Z-Fighting!)
  function buildStationDiorama(st) {
    const g = new THREE.Group();

    if (st.id === "vision") {
      // STATION 01: 學校願景站 (正門、孔子銅像四瓣圓環草坪、前庭為三合院校舍、庭園長頸鹿與斑馬雕塑)
      const mainBldg = createBuilding({
        w: 4.1,
        d: 1.2,
        floors: 2,
        wall: "#f5e6c8",
        trim: "#b84a27",
        sign: "漚汪國民小學",
        roofType: "gable",
        solar: true
      });
      mainBldg.position.set(0, 0, -2.05);
      g.add(mainBldg);

      // Left & Right Sanheyuan Courtyard Wings with Colonnade Pillars, Red-Brick Facades, Windows & Solar Roofs
      [-2.25, 2.25].forEach((wx) => {
        const wing = new THREE.Group();
        wing.position.set(wx, 0, -0.35);

        const wPlinth = new THREE.Mesh(
          new THREE.BoxGeometry(1.04, 0.06, 2.52),
          getMat("#d6cec2")
        );
        wPlinth.position.y = 0.03;
        wing.add(wPlinth);

        const wBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.96, 1.38, 2.44),
          getMat("#f5e6c8")
        );
        wBody.position.y = 0.06 + 0.69;
        wBody.castShadow = true;
        wBody.receiveShadow = true;
        wing.add(wBody);

        // Front red-brick gable end wall
        const brickFace = new THREE.Mesh(
          new THREE.BoxGeometry(0.98, 1.38, 0.42),
          getMat("#b84a27")
        );
        brickFace.position.set(0, 0.06 + 0.69, 1.02);
        wing.add(brickFace);

        // Second-floor cornice band & courtyard colonnade pillars
        const wBand = new THREE.Mesh(
          new THREE.BoxGeometry(1.02, 0.05, 2.48),
          getMat("#7c9070")
        );
        wBand.position.y = 0.76;
        wing.add(wBand);

        const inwardX = wx < 0 ? 0.49 : -0.49;
        const pillarX = wx < 0 ? 0.52 : -0.52;
        [-0.95, -0.32, 0.32].forEach((pz) => {
          const col = new THREE.Mesh(
            new THREE.CylinderGeometry(0.032, 0.036, 1.38, 8),
            getMat("#f8fafc")
          );
          col.position.set(pillarX, 0.75, pz);
          wing.add(col);
        });

        // Courtyard-facing framed windows along the wing
        [-0.75, -0.15, 0.45].forEach((wz) => {
          [0.42, 1.08].forEach((wy) => {
            const winFrame = new THREE.Mesh(
              new THREE.BoxGeometry(0.025, 0.28, 0.3),
              getMat("#f8fafc")
            );
            winFrame.position.set(inwardX, wy, wz);
            wing.add(winFrame);

            const win = new THREE.Mesh(
              new THREE.BoxGeometry(0.032, 0.24, 0.26),
              litWindowMat
            );
            win.position.set(inwardX, wy, wz);
            wing.add(win);
          });
        });

        const wRoof = new THREE.Mesh(
          new THREE.BoxGeometry(1.12, 0.12, 2.58),
          getMat("#7c9070")
        );
        wRoof.position.y = 1.5;
        wRoof.castShadow = true;
        wing.add(wRoof);

        // Aluminum rails + Gridded Solar Panel cleanly raised above wRoof
        [-0.28, 0.28].forEach((rx) => {
          const rail = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.05, 2.2),
            getMat("#cbd5e1")
          );
          rail.position.set(rx, 1.585, 0);
          wing.add(rail);
        });
        const wSolar = new THREE.Mesh(
          new THREE.BoxGeometry(0.82, 0.045, 2.28),
          getSolarPanelMaterial()
        );
        wSolar.position.y = 1.63;
        wSolar.castShadow = true;
        wing.add(wSolar);
        g.add(wing);
      });

      // Central 4-Petal Confucius Courtyard Ring (non-overlapping heights)
      const courtyard = new THREE.Group();
      courtyard.position.set(0, 0, -0.15);

      const brickPlazaRing = new THREE.Mesh(
        new THREE.CylinderGeometry(1.22, 1.25, 0.04, 32),
        getMat("#d99b66")
      );
      brickPlazaRing.position.y = 0.02;
      brickPlazaRing.receiveShadow = true;
      courtyard.add(brickPlazaRing);

      // 4 Green Lawn Quadrants strictly above brickPlazaRing (y: 0.042 .. 0.102, zero overlap!)
      for (let q = 0; q < 4; q++) {
        const startAng = q * (Math.PI / 2) + 0.14;
        const spanAng = Math.PI / 2 - 0.28;
        const petal = new THREE.Mesh(
          new THREE.CylinderGeometry(1.08, 1.1, 0.06, 14, 1, false, startAng, spanAng),
          getMat("#5c9e42")
        );
        petal.position.y = 0.072;
        petal.receiveShadow = true;
        courtyard.add(petal);
      }

      // Tiered Stone Pedestal & Bronze Confucius Statue
      const pedBase1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.1, 0.56),
        getMat("#d6cec2")
      );
      pedBase1.position.y = 0.092;
      courtyard.add(pedBase1);

      const pedBase2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.34, 0.38),
        getMat("#e6dac8")
      );
      pedBase2.position.y = 0.312;
      courtyard.add(pedBase2);

      const plaque = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.2, 0.02),
        getMat("#92400e")
      );
      plaque.position.set(0, 0.312, 0.196);
      courtyard.add(plaque);

      const bronzeMat = getMat("#4a3f35", { roughness: 0.35, metalness: 0.55 });
      const statueBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.13, 0.44, 14),
        bronzeMat
      );
      statueBody.position.y = 0.702;
      statueBody.castShadow = true;
      courtyard.add(statueBody);

      const statueSleeves = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.135, 0.18, 12),
        bronzeMat
      );
      statueSleeves.scale.set(1.2, 1, 0.75);
      statueSleeves.position.set(0, 0.73, 0.02);
      courtyard.add(statueSleeves);

      const statueHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 12, 10),
        bronzeMat
      );
      statueHead.position.y = 0.985;
      courtyard.add(statueHead);

      const statueCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.065, 0.05, 10),
        bronzeMat
      );
      statueCap.position.y = 1.06;
      courtyard.add(statueCap);
      g.add(courtyard);

      // Left Garden: Stone Monument & Refined Miniature Giraffe Sculpture
      const stoneMonument = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.22, 1),
        getMat("#d6c7b2")
      );
      stoneMonument.scale.set(0.9, 1.35, 0.65);
      stoneMonument.position.set(-1.35, 0.2, -1.1);
      g.add(stoneMonument);

      const giraffe = new THREE.Group();
      giraffe.position.set(-0.98, 0, -1.25);
      giraffe.rotation.y = 0.4;
      const gMat = getMat("#f59e0b");
      const gSpotMat = getMat("#92400e");
      const gBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.24), gMat);
      gBody.position.y = 0.22;
      giraffe.add(gBody);
      [-0.06, 0.05].forEach((sz, si) => {
        const spot = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 6), gSpotMat);
        spot.position.set(si % 2 === 0 ? 0.06 : -0.06, 0.24, sz);
        giraffe.add(spot);
      });
      const gNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.04, 0.28, 8), gMat);
      gNeck.position.set(0, 0.38, 0.09);
      gNeck.rotation.x = 0.25;
      giraffe.add(gNeck);
      const gHead = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.11), gMat);
      gHead.position.set(0, 0.51, 0.14);
      giraffe.add(gHead);
      [-0.022, 0.022].forEach((ox) => {
        const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.05, 6), gSpotMat);
        horn.position.set(ox, 0.56, 0.12);
        giraffe.add(horn);
      });
      [
        [-0.04, -0.08],
        [0.04, -0.08],
        [-0.04, 0.08],
        [0.04, 0.08]
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.18, 6), gMat);
        leg.position.set(lx, 0.09, lz);
        giraffe.add(leg);
      });
      g.add(giraffe);

      // Right Garden: Refined Miniature Zebra Sculpture with Head, Muzzle & Stripes
      const zebra = new THREE.Group();
      zebra.position.set(1.28, 0, -1.15);
      zebra.rotation.y = -0.45;
      const zWhite = getMat("#f8fafc");
      const zBlack = getMat("#1e293b");
      const zBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.24), zWhite);
      zBody.position.y = 0.2;
      zebra.add(zBody);
      [-0.07, 0, 0.07].forEach((sz) => {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.146, 0.11, 0.024), zBlack);
        stripe.position.set(0, 0.205, sz);
        zebra.add(stripe);
      });
      const zNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.042, 0.16, 8), zWhite);
      zNeck.position.set(0, 0.3, 0.08);
      zNeck.rotation.x = 0.35;
      zebra.add(zNeck);
      const zHead = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.065, 0.12), zWhite);
      zHead.position.set(0, 0.38, 0.13);
      zebra.add(zHead);
      const zMuzzle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.04), zBlack);
      zMuzzle.position.set(0, 0.37, 0.19);
      zebra.add(zMuzzle);
      [
        [-0.04, -0.08],
        [0.04, -0.08],
        [-0.04, 0.08],
        [0.04, 0.08]
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.16, 6), zWhite);
        leg.position.set(lx, 0.08, lz);
        zebra.add(leg);
      });
      g.add(zebra);

      [-1.55, 1.55].forEach((px) => {
        const palm = createPalmTree(0.95);
        palm.position.set(px, 0, 1.95);
        g.add(palm);
      });

      // Refined Front School Gate with Pillars, Caps, Banners & Stainless Steel Sliding Gate (伸縮門)
      const gate = new THREE.Group();
      gate.position.set(0, 0, 2.42);
      [-0.95, 0.95].forEach((x) => {
        const pillar = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 1.18, 0.32),
          getMat("#e8dfd1")
        );
        pillar.position.set(x, 0.59, 0);
        pillar.castShadow = true;
        gate.add(pillar);

        const pCap = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.06, 0.38),
          getMat("#cbd5e1")
        );
        pCap.position.set(x, 1.2, 0);
        gate.add(pCap);

        const banner = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, 0.85, 0.04),
          getMat("#f97316")
        );
        banner.position.set(x, 0.52, 0.16);
        gate.add(banner);
      });

      const steelMat = getMat("#cbd5e1", { metalness: 0.7, roughness: 0.25 });
      for (let b = 0; b < 5; b++) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.44, 6), steelMat);
        bar.position.set(-0.72 + b * 0.09, 0.22, -0.02);
        gate.add(bar);
      }
      const gateTopRail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.05), steelMat);
      gateTopRail.position.set(-0.54, 0.44, -0.02);
      gate.add(gateTopRail);

      const beam = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.28, 0.36), getMat("#e8dfd1"));
      beam.position.set(0, 1.24, 0);
      gate.add(beam);
      const gateSign = createSignboard("漚汪國民小學", "#d9531e", "#fffaf2", 0.21);
      gateSign.position.set(0, 1.26, 0.2);
      gate.add(gateSign);
      g.add(gate);

      // Obstacle-free courtyard jogging loop strictly on the open front brick plaza (never clipping buildings/statues/lawns)
      const courtyardLoop = [
        [-0.86, 1.62],
        [-0.58, 1.88],
        [0.0, 1.94],
        [0.58, 1.88],
        [0.86, 1.62],
        [0.58, 1.36],
        [0.0, 1.28],
        [-0.58, 1.36]
      ];
      g.add(createPerson({ shirt: "#38bdf8", hat: "headband", route: courtyardLoop, speed: 0.95, seed: 1 }));
      g.add(createPerson({ shirt: "#ef4444", task: "wave", seed: 3 }).translateX(1.28).translateZ(1.48));
      g.add(createPerson({ shirt: "#eab308", task: "cheer", seed: 4 }).translateX(-1.28).translateZ(1.48));
      g.add(createPerson({ shirt: "#10b981", task: "jumping_jacks", seed: 5 }).translateX(-1.38).translateZ(0.82));
      g.add(createPerson({ shirt: "#a855f7", prop: "book", task: "story", seed: 6 }).translateX(1.38).translateZ(0.82));
      g.add(createPerson({ shirt: "#ec4899", task: "cheer", seed: 7 }).translateX(1.48).translateZ(0.18));
      g.add(createPerson({ shirt: "#3b82f6", task: "wave", seed: 8 }).translateX(-1.42).translateZ(-0.35));
    } else if (st.id === "curriculum") {
      // STATION 02: 課程創新站 (廣達設計學習館 + 小小說書人立體繪本策展舞台 + 創客工作坊桌)
      const bldg = createBuilding({
        w: 2.5,
        d: 1.2,
        floors: 2,
        wall: "#fff7ed",
        trim: "#f97316",
        sign: "廣達設計學習館",
        roofType: "gable",
        solar: true
      });
      bldg.position.set(-0.9, 0, -1.75);
      g.add(bldg);

      // 小小說書人繪本策展舞台（巨型立體展開繪本 + 4C 創客靈感燈泡 + 策展畫架）
      const stage = new THREE.Group();
      stage.position.set(1.65, 0, -0.7);
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.18, 1.4), getMat("#d97706"));
      base.position.y = 0.09;
      base.receiveShadow = true;
      stage.add(base);

      const stageTrim = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.04, 1.46), getMat("#fef3c7"));
      stageTrim.position.y = 0.19;
      stage.add(stageTrim);

      // 舞台背板拱門
      const backdropArch = new THREE.Mesh(
        new THREE.BoxGeometry(1.48, 1.55, 0.08),
        getMat("#ea580c")
      );
      backdropArch.position.set(0, 0.94, -0.45);
      backdropArch.castShadow = true;
      stage.add(backdropArch);

      // 巨型立體展開故事繪本 (Open 3D Storybook)
      const bookGroup = new THREE.Group();
      bookGroup.position.set(0, 0.94, -0.35);

      [-1, 1].forEach((side) => {
        const pagePivot = new THREE.Group();
        pagePivot.rotation.y = side * -0.24;

        const cover = new THREE.Mesh(
          new THREE.BoxGeometry(0.62, 0.88, 0.035),
          getMat("#fbbf24")
        );
        cover.position.set(side * 0.31, 0, -0.015);
        pagePivot.add(cover);

        const page = new THREE.Mesh(
          new THREE.BoxGeometry(0.58, 0.82, 0.035),
          getMat("#fffbeb")
        );
        page.position.set(side * 0.3, 0, 0.022);
        pagePivot.add(page);

        if (side === -1) {
          const sunDot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11, 0.11, 0.02, 16),
            getMat("#f97316")
          );
          sunDot.rotation.x = Math.PI / 2;
          sunDot.position.set(-0.32, 0.18, 0.048);
          pagePivot.add(sunDot);

          const hill = new THREE.Mesh(
            new THREE.BoxGeometry(0.46, 0.22, 0.02),
            getMat("#22c55e")
          );
          hill.position.set(-0.3, -0.18, 0.048);
          pagePivot.add(hill);
        } else {
          for (let l = 0; l < 4; l++) {
            const lineBar = new THREE.Mesh(
              new THREE.BoxGeometry(0.4, 0.045, 0.02),
              getMat(l === 0 ? "#ea580c" : "#64748b")
            );
            lineBar.position.set(0.3, 0.22 - l * 0.13, 0.048);
            pagePivot.add(lineBar);
          }
        }
        bookGroup.add(pagePivot);
      });

      const spine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.9, 12),
        getMat("#d97706")
      );
      bookGroup.add(spine);

      // Gold ribbon bookmark peeking beneath the spine
      const ribbon = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 0.2, 0.02),
        getMat("#ef4444")
      );
      ribbon.position.set(0.06, -0.46, 0.03);
      ribbon.rotation.z = -0.14;
      bookGroup.add(ribbon);
      stage.add(bookGroup);

      // 4C 創客靈感發光燈泡立飾（含金色光環）
      const bulbGlobe = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 16, 14),
        getMat("#fde047", { emissive: "#f59e0b", emissiveIntensity: 0.45 })
      );
      bulbGlobe.position.set(-0.56, 1.56, -0.3);
      stage.add(bulbGlobe);
      const bulbHalo = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.016, 8, 20),
        getMat("#fbbf24", { emissive: "#f59e0b", emissiveIntensity: 0.35 })
      );
      bulbHalo.position.set(-0.56, 1.56, -0.3);
      stage.add(bulbHalo);
      const bulbBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.06, 0.1, 10),
        getMat("#94a3b8", { metalness: 0.5, roughness: 0.3 })
      );
      bulbBase.position.set(-0.56, 1.37, -0.3);
      stage.add(bulbBase);

      // 旁側 PBL 策展三腳畫架
      const easel = new THREE.Group();
      easel.position.set(-0.52, 0.21, 0.18);
      easel.rotation.y = 0.35;
      const easelFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.6, 0.03),
        getMat("#b45309")
      );
      easelFrame.position.set(0, 0.58, -0.02);
      easel.add(easelFrame);
      const easelBoard = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.54, 0.03),
        getMat("#fef3c7")
      );
      easelBoard.position.set(0, 0.58, 0.012);
      easel.add(easelBoard);
      [-0.16, 0.16].forEach((lx) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.85, 6),
          getMat("#92400e")
        );
        leg.position.set(lx, 0.42, -0.02);
        easel.add(leg);
      });
      stage.add(easel);

      const stageSign = createSignboard("小小說書人策展舞台", "#ea580c", "#fffaf2", 0.18);
      stageSign.position.set(0, 1.94, -0.42);
      stage.add(stageSign);
      g.add(stage);

      // Maker Workbenches with Miniature Laptops & Design Prototypes
      [-1.25, 0.15].forEach((x, idx) => {
        const tblGroup = new THREE.Group();
        tblGroup.position.set(x, 0, 1.05);
        const tblTop = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.06, 0.58), getMat("#f3e2c7"));
        tblTop.position.y = 0.41;
        tblTop.castShadow = true;
        tblGroup.add(tblTop);
        const tblBase = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.38, 0.46), getMat("#d97706"));
        tblBase.position.y = 0.19;
        tblGroup.add(tblBase);

        // Mini Laptop on table
        const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.18), getMat("#94a3b8"));
        laptopBase.position.set(-0.18, 0.45, 0);
        tblGroup.add(laptopBase);
        const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.02), screenGlowMat);
        laptopScreen.position.set(-0.18, 0.53, -0.08);
        laptopScreen.rotation.x = 0.2;
        tblGroup.add(laptopScreen);

        // Mini 3D Prototype Model on table
        const proto = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.09, 0),
          getMat(idx === 0 ? "#10b981" : "#ec4899")
        );
        proto.position.set(0.2, 0.52, 0);
        tblGroup.add(proto);
        g.add(tblGroup);

        const maker1 = createPerson({
          shirt: idx === 0 ? "#f97316" : "#3b82f6",
          prop: "book",
          task: "story",
          seed: idx + 11
        });
        maker1.position.set(x - 0.24, 0, 1.62);
        maker1.rotation.y = Math.PI;
        g.add(maker1);

        const maker2 = createPerson({
          shirt: idx === 0 ? "#10b981" : "#ec4899",
          task: "cheer",
          seed: idx + 15
        });
        maker2.position.set(x + 0.24, 0, 1.62);
        maker2.rotation.y = Math.PI;
        g.add(maker2);
      });

      const storyteller = createPerson({ shirt: "#ef4444", prop: "book", task: "story", seed: 19 });
      storyteller.position.set(1.65, 0.21, -0.35);
      g.add(storyteller);

      g.add(createPerson({ shirt: "#eab308", task: "jumping_jacks", seed: 20 }).translateX(1.25).translateZ(0.65));
      g.add(createPerson({ shirt: "#8b5cf6", task: "cheer", seed: 21 }).translateX(2.05).translateZ(0.65));
    } else if (st.id === "character") {
      // STATION 03: 品格教育站 (3H 品格實踐館 + 雙層圓形品格劇場 + 立體愛心雕像 + 八大品格石柱)
      const bldg = createBuilding({
        w: 2.6,
        d: 1.2,
        floors: 2,
        wall: "#fefce8",
        trim: "#eab308",
        sign: "3H品格實踐館",
        solar: true
      });
      bldg.position.set(0, 0, -1.8);
      g.add(bldg);

      // Non-overlapping two-tier circular stage
      const stageLower = new THREE.Mesh(
        new THREE.CylinderGeometry(1.26, 1.32, 0.1, 24),
        getMat("#f59e0b")
      );
      stageLower.position.set(0, 0.05, 0.35);
      stageLower.receiveShadow = true;
      g.add(stageLower);

      const stageUpper = new THREE.Mesh(
        new THREE.CylinderGeometry(1.12, 1.16, 0.08, 24),
        getMat("#fde047")
      );
      stageUpper.position.set(0, 0.14, 0.35);
      stageUpper.receiveShadow = true;
      g.add(stageUpper);

      // Pedestal + Sculpted 3D Glossy Beveled Heart Emblem + Golden Arch Ring
      const heartPed = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.3, 0.38, 18),
        getMat("#fffbeb")
      );
      heartPed.position.set(0, 0.37, 0.15);
      g.add(heartPed);

      const heartRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.56, 0.028, 10, 32),
        getMat("#f59e0b", { metalness: 0.45, roughness: 0.25 })
      );
      heartRing.position.set(0, 1.0, 0.15);
      g.add(heartRing);

      const heartMat = getMat("#ef4444", { roughness: 0.24, metalness: 0.12 });
      const heartSculpt = new THREE.Mesh(createHeartGeo(1.02), heartMat);
      heartSculpt.position.set(0, 1.02, 0.15);
      heartSculpt.castShadow = true;
      g.add(heartSculpt);

      // 8 Character Core Value Pillars with Base Plinth & Golden Cap
      const values = ["禮貌", "堅毅", "勇氣", "感恩", "自制", "負責", "正向", "尊重"];
      values.forEach((v, idx) => {
        const ang = Math.PI * 0.1 + (idx / 7) * Math.PI * 0.8;
        const r = 2.48;
        const px = Math.cos(ang) * r;
        const pz = Math.sin(ang) * r - 0.1;

        const pGrp = new THREE.Group();
        pGrp.position.set(px, 0, pz);

        const pBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.28), getMat("#d6cec2"));
        pBase.position.y = 0.05;
        pGrp.add(pBase);

        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.125, 0.68, 8),
          getMat("#f59e0b")
        );
        pillar.position.y = 0.44;
        pillar.castShadow = true;
        pGrp.add(pillar);

        const pCap = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 10, 8),
          getMat("#fde047", { metalness: 0.35, roughness: 0.25 })
        );
        pCap.position.y = 0.84;
        pGrp.add(pCap);

        g.add(pGrp);
      });

      g.add(createPerson({ shirt: "#facc15", task: "cheer", seed: 31 }).translateX(-0.52).translateY(0.18).translateZ(0.55));
      g.add(createPerson({ shirt: "#34d399", task: "dance", seed: 32 }).translateX(0.52).translateY(0.18).translateZ(0.55));
      g.add(createPerson({ shirt: "#f97316", task: "jumping_jacks", seed: 33 }).translateX(-1.35).translateZ(1.1));
      g.add(createPerson({ shirt: "#38bdf8", task: "jumping_jacks", seed: 34 }).translateX(1.35).translateZ(1.1));
      g.add(createPerson({ shirt: "#ec4899", task: "wave", seed: 35 }).translateX(-0.9).translateZ(1.55));
      g.add(createPerson({ shirt: "#a855f7", prop: "book", task: "story", seed: 36 }).translateX(-1.65).translateZ(-0.3));
    } else if (st.id === "teams") {
      // STATION 04: 多元社團站 (「我愛漚汪 I ❤️ OUWANG」彩色地標與學童公仔、太鼓隊、手風琴吹奏、舞蹈隊、PU跑道田徑接力)
      const bldg = createBuilding({
        w: 2.35,
        d: 1.05,
        floors: 2,
        wall: "#f5e9dc",
        trim: "#db3b88",
        sign: "多元社團展演館",
        solar: true
      });
      bldg.position.set(-1.15, 0, -1.9);
      g.add(bldg);

      // Sculpted "I ❤️ OUWANG" Landmark with Plinth, Stepped Rainbow Pillars & 3D Red Heart Emblem
      const landmark = new THREE.Group();
      landmark.position.set(1.5, 0, -1.65);
      landmark.rotation.y = -0.32;

      const lmBase = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.08, 0.36), getMat("#e2e8f0"));
      lmBase.position.y = 0.04;
      landmark.add(lmBase);

      const letterColors = ["#06b6d4", "#ef4444", "#eab308", "#84cc16", "#f97316", "#ec4899", "#3b82f6", "#8b5cf6"];
      letterColors.forEach((col, idx) => {
        if (idx === 1) {
          // Sculpted 3D red Heart emblem in place of ❤️
          const heartBlk = new THREE.Mesh(
            createHeartGeo(0.62),
            getMat("#ef4444", { roughness: 0.25, metalness: 0.1 })
          );
          heartBlk.position.set(-0.85 + idx * 0.25, 0.34, 0);
          heartBlk.castShadow = true;
          landmark.add(heartBlk);
        } else {
          const blk = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.44 + (idx % 2) * 0.08, 0.16),
            getMat(col)
          );
          blk.position.set(-0.85 + idx * 0.25, 0.3 + (idx % 2) * 0.04, 0);
          blk.castShadow = true;
          landmark.add(blk);
        }
      });
      const ouwangSign = createSignboard("我愛漚汪 I❤️OUWANG", "#db2777", "#ffffff", 0.18);
      ouwangSign.position.set(0, 0.82, 0.06);
      landmark.add(ouwangSign);
      g.add(landmark);

      // Detailed Taiko Drums on Crossed X-Stands with Golden Tack Trim
      [-1.9, -1.25, -0.6].forEach((x, idx) => {
        [-0.45, 0.45].forEach((rotZ) => {
          const legBar = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.26, 0.24),
            getMat("#78350f")
          );
          legBar.position.set(x, 0.11, 0.15);
          legBar.rotation.z = rotZ;
          g.add(legBar);
        });

        const drumBarrel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.185, 0.185, 0.26, 16),
          getMat("#dc2626")
        );
        drumBarrel.rotation.x = Math.PI / 2;
        drumBarrel.position.set(x, 0.32, 0.15);
        drumBarrel.castShadow = true;
        g.add(drumBarrel);

        [-0.09, 0.09].forEach((tz) => {
          const tackBand = new THREE.Mesh(
            new THREE.TorusGeometry(0.186, 0.012, 6, 16),
            getMat("#fbbf24", { metalness: 0.5, roughness: 0.25 })
          );
          tackBand.position.set(x, 0.32, 0.15 + tz);
          g.add(tackBand);
        });

        const drumHeads = new THREE.Mesh(
          new THREE.CylinderGeometry(0.165, 0.165, 0.29, 16),
          getMat("#fef3c7")
        );
        drumHeads.rotation.x = Math.PI / 2;
        drumHeads.position.set(x, 0.32, 0.15);
        g.add(drumHeads);

        const drummer = createPerson({
          shirt: "#ef4444",
          hat: "headband",
          prop: "drumsticks",
          task: "drum",
          seed: idx + 40
        });
        drummer.position.set(x, 0, 0.58);
        drummer.rotation.y = Math.PI;
        g.add(drummer);
      });

      // Mini PU Relay Track using Solid Non-Overlapping ExtrudeGeometry Slabs (Zero Z-Fighting!)
      const trackInfield = new THREE.Mesh(
        new THREE.CylinderGeometry(0.68, 0.68, 0.06, 28),
        getMat("#68a84e")
      );
      trackInfield.position.set(1.35, 0.03, 0.72);
      trackInfield.receiveShadow = true;
      g.add(trackInfield);

      const miniRingShape = new THREE.Shape();
      miniRingShape.absarc(0, 0, 1.24, 0, Math.PI * 2, false);
      const miniHole = new THREE.Path();
      miniHole.absarc(0, 0, 0.68, 0, Math.PI * 2, true);
      miniRingShape.holes.push(miniHole);
      const miniRingGeo = new THREE.ExtrudeGeometry(miniRingShape, {
        depth: 0.072,
        bevelEnabled: false,
        curveSegments: 36
      });
      miniRingGeo.rotateX(-Math.PI / 2);
      const trackOuter = new THREE.Mesh(miniRingGeo, getPuTrackMaterial());
      trackOuter.position.set(1.35, 0, 0.72);
      trackOuter.receiveShadow = true;
      g.add(trackOuter);

      const miniLane = new THREE.Mesh(
        new THREE.TorusGeometry(0.96, 0.014, 6, 36),
        getMat("#ffffff")
      );
      miniLane.rotation.x = Math.PI / 2;
      miniLane.position.set(1.35, 0.074, 0.72);
      g.add(miniLane);

      const runnerRoute = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        runnerRoute.push([1.35 + Math.cos(a) * 0.96, 0.72 + Math.sin(a) * 0.96]);
      }
      const relayer1 = createPerson({ shirt: "#fde047", hat: "headband", prop: "baton", route: runnerRoute, speed: 1.02, seed: 44 });
      relayer1.position.y = 0.076;
      g.add(relayer1);

      const relayer2 = createPerson({ shirt: "#38bdf8", hat: "headband", route: runnerRoute, speed: 1.02, seed: 47 });
      relayer2.position.y = 0.076;
      g.add(relayer2);

      g.add(createPerson({ shirt: "#f472b6", task: "dance", seed: 46, scale: 0.95 }).translateX(1.35).translateY(0.064).translateZ(0.72));
      g.add(createPerson({ shirt: "#10b981", hat: "cap", prop: "accordion", task: "accordion", seed: 48 }).translateX(-1.95).translateZ(1.52));
      g.add(createPerson({ shirt: "#f59e0b", hat: "headband", prop: "accordion", task: "accordion", seed: 49 }).translateX(-1.15).translateZ(1.62));
      g.add(createPerson({ shirt: "#c084fc", task: "dance", seed: 50 }).translateX(-0.38).translateZ(1.48));
      g.add(createPerson({ shirt: "#fb7185", task: "dance", seed: 51 }).translateX(-0.82).translateZ(2.26));
      g.add(createPerson({ shirt: "#38bdf8", task: "dance", seed: 52 }).translateX(-1.58).translateZ(2.34));
    } else if (st.id === "facilities") {
      // STATION 05: 優質環境站 (室內體育館羽球場 + 橘色鋼構太陽能光電籃球場 + 紅蘿蔔主題溜滑梯 + 木造樹屋砂坑 + 雲水書車)
      const bldg = createBuilding({
        w: 2.0,
        d: 1.0,
        floors: 2,
        wall: "#ecfdf5",
        trim: "#10b981",
        sign: "育英書院・智慧教室",
        solar: true
      });
      bldg.position.set(-1.45, 0, -2.05);
      g.add(bldg);

      // =====================================================================
      // 1. 漚汪室內體育館・羽球場 (Thickened Solid Textured Slab — Zero Flickering!)
      // =====================================================================
      const gymGroup = new THREE.Group();
      gymGroup.position.set(-1.42, 0, 0.35);

      const gymSideMat = getMat("#d99e64");
      const gymSlabMats = [
        gymSideMat,
        gymSideMat,
        getBadmintonCourtMaterial(),
        gymSideMat,
        gymSideMat,
        gymSideMat
      ];
      const GYM_TOP = 0.07;
      const gymFloorSlab = new THREE.Mesh(
        new THREE.BoxGeometry(2.16, GYM_TOP, 1.96),
        gymSlabMats
      );
      gymFloorSlab.position.y = GYM_TOP / 2;
      gymFloorSlab.receiveShadow = true;
      gymGroup.add(gymFloorSlab);

      // Badminton Net & Net Posts across the center of the court (z = 0)
      [-0.84, 0.84].forEach((nx) => {
        const netPost = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.56, 8),
          getMat("#334155")
        );
        netPost.position.set(nx, GYM_TOP + 0.28, 0);
        gymGroup.add(netPost);
      });
      const netMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.66, 0.24, 0.018),
        new THREE.MeshBasicMaterial({
          color: "#f8fafc",
          transparent: true,
          opacity: 0.62
        })
      );
      netMesh.position.set(0, GYM_TOP + 0.42, 0);
      gymGroup.add(netMesh);
      const netTape = new THREE.Mesh(
        new THREE.BoxGeometry(1.68, 0.03, 0.024),
        getMat("#ffffff")
      );
      netTape.position.set(0, GYM_TOP + 0.54, 0);
      gymGroup.add(netTape);

      // Open-View Gymnasium Pillars, Back Clerestory Wall & Arched Roof
      const gymBackWall = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 1.48, 0.08),
        getMat("#f1f5f9")
      );
      gymBackWall.position.set(0, GYM_TOP + 0.74, -0.94);
      gymGroup.add(gymBackWall);

      const gymWin = new THREE.Mesh(
        new THREE.BoxGeometry(1.75, 0.46, 0.1),
        litWindowMat
      );
      gymWin.position.set(0, GYM_TOP + 1.03, -0.94);
      gymGroup.add(gymWin);

      [
        [-1.02, -0.9],
        [1.02, -0.9],
        [-1.02, 0.9],
        [1.02, 0.9]
      ].forEach(([px, pz]) => {
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.055, 1.56, 10),
          getMat("#0284c7")
        );
        col.position.set(px, GYM_TOP + 0.78, pz);
        gymGroup.add(col);
      });

      const gymRoofDeck = new THREE.Mesh(
        new THREE.BoxGeometry(2.26, 0.08, 2.06),
        getMat("#e2e8f0")
      );
      gymRoofDeck.position.set(0, GYM_TOP + 1.58, 0);
      gymGroup.add(gymRoofDeck);

      const gymVault = new THREE.Mesh(
        new THREE.CylinderGeometry(1.08, 1.08, 2.04, 16, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
        getMat("#0ea5e9", { side: THREE.DoubleSide, roughness: 0.4 })
      );
      gymVault.rotation.x = Math.PI / 2;
      gymVault.scale.set(1.02, 1, 0.32);
      gymVault.position.set(0, GYM_TOP + 1.38, 0);
      gymGroup.add(gymVault);

      const gymSign = createSignboard("漚汪體育館・羽球場", "#0284c7", "#ffffff", 0.17);
      gymSign.position.set(0, GYM_TOP + 1.88, 0.96);
      gymGroup.add(gymSign);

      // 4 Badminton Players standing cleanly above GYM_TOP (y = 0.074 + 0.026 sole = +0.030 clearance!)
      const bPlayerNorth = createPerson({
        shirt: "#38bdf8",
        hat: "headband",
        prop: "badminton",
        task: "badminton",
        seed: 501,
        scale: 0.96
      });
      bPlayerNorth.position.set(-0.28, GYM_TOP + 0.004, -0.52);
      bPlayerNorth.rotation.y = 0;
      gymGroup.add(bPlayerNorth);

      const bPlayerSouth = createPerson({
        shirt: "#f43f5e",
        hat: "headband",
        prop: "badminton",
        task: "badminton",
        seed: 503,
        scale: 0.96
      });
      bPlayerSouth.position.set(0.28, GYM_TOP + 0.004, 0.52);
      bPlayerSouth.rotation.y = Math.PI;
      gymGroup.add(bPlayerSouth);

      const bPartnerNorth = createPerson({
        shirt: "#fde047",
        prop: "badminton",
        task: "badminton",
        seed: 505,
        scale: 0.94
      });
      bPartnerNorth.position.set(0.34, GYM_TOP + 0.004, -0.56);
      bPartnerNorth.rotation.y = 0;
      gymGroup.add(bPartnerNorth);

      const bPartnerSouth = createPerson({
        shirt: "#a855f7",
        prop: "badminton",
        task: "badminton",
        seed: 507,
        scale: 0.94
      });
      bPartnerSouth.position.set(-0.34, GYM_TOP + 0.004, 0.56);
      bPartnerSouth.rotation.y = Math.PI;
      gymGroup.add(bPartnerSouth);

      // Animated 3D White Shuttlecock (白色羽球) flying back & forth over the badminton net
      const shuttlecock = new THREE.Group();
      const cork = new THREE.Mesh(
        new THREE.SphereGeometry(0.036, 10, 8),
        getMat("#fef08a")
      );
      shuttlecock.add(cork);
      const skirt = new THREE.Mesh(
        new THREE.ConeGeometry(0.068, 0.11, 10, 1, true),
        getMat("#ffffff", { side: THREE.DoubleSide })
      );
      skirt.position.y = 0.055;
      shuttlecock.add(skirt);
      gymGroup.add(shuttlecock);

      let shuttleT = 0;
      dynamicCallbacks.push((dt) => {
        if (!state.animate) return;
        shuttleT += dt * 1.65;
        const pingPong = shuttleT % 2;
        const dir = pingPong < 1 ? 1 : -1;
        const u = pingPong < 1 ? pingPong : 2 - pingPong;
        const sx = -0.18 + u * 0.36;
        const sz = -0.48 + u * 0.96;
        const sy = GYM_TOP + 0.52 + Math.sin(u * Math.PI) * 0.58;
        shuttlecock.position.set(sx, sy, sz);
        shuttlecock.rotation.x = dir * (0.8 - u * 1.6);
      });

      g.add(gymGroup);

      // =====================================================================
      // 2. 太陽能光電風雨球場 (Thick Solid Textured Floor Slab & Trusses — Zero Floor/Foot Flickering!)
      // =====================================================================
      const courtGroup = new THREE.Group();
      courtGroup.position.set(1.42, 0, 0.42);

      // Thick 0.075 solid slab cleanly above grassMesh top; single CanvasTexture on top (ZERO Z-fighting!)
      const COURT_TOP = 0.075;
      const courtSideMat = getMat("#4d903e");
      const courtSlabMats = [
        courtSideMat,
        courtSideMat,
        getBasketballCourtMaterial(),
        courtSideMat,
        courtSideMat,
        courtSideMat
      ];
      const courtSlab = new THREE.Mesh(
        new THREE.BoxGeometry(2.38, COURT_TOP, 1.74),
        courtSlabMats
      );
      courtSlab.position.y = COURT_TOP / 2;
      courtSlab.receiveShadow = true;
      courtGroup.add(courtSlab);

      // Refined Basketball Backboards, Orange Rims & Net Cones at Left & Right Ends
      [-0.92, 0.92].forEach((hx) => {
        const dir = hx < 0 ? 1 : -1;
        const hoopPost = new THREE.Mesh(
          new THREE.CylinderGeometry(0.026, 0.026, 1.08, 10),
          getMat("#e2e8f0", { metalness: 0.4, roughness: 0.3 })
        );
        hoopPost.position.set(hx, COURT_TOP + 0.54, 0);
        courtGroup.add(hoopPost);

        const backboard = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 0.3, 0.44),
          getMat("#ffffff")
        );
        backboard.position.set(hx + dir * 0.06, COURT_TOP + 0.96, 0);
        courtGroup.add(backboard);

        const targetSq = new THREE.Mesh(
          new THREE.BoxGeometry(0.015, 0.12, 0.16),
          getMat("#ea580c")
        );
        targetSq.position.set(hx + dir * 0.075, COURT_TOP + 0.93, 0);
        courtGroup.add(targetSq);

        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(0.07, 0.01, 8, 16),
          getMat("#ea580c")
        );
        rim.rotation.x = Math.PI / 2;
        rim.position.set(hx + dir * 0.14, COURT_TOP + 0.88, 0);
        courtGroup.add(rim);

        const rimNet = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.035, 0.11, 10, 1, true),
          getMat("#f8fafc", { side: THREE.DoubleSide })
        );
        rimNet.position.set(hx + dir * 0.14, COURT_TOP + 0.82, 0);
        courtGroup.add(rimNet);
      });

      // Orange Steel H-Columns with Pastel Macaron Safety Pads & Overhead Truss Rafters
      const padColors = ["#60a5fa", "#86efac", "#f9a8d4", "#fde047", "#38bdf8", "#a7f3d0"];
      [
        [-0.96, -0.64],
        [0, -0.64],
        [0.96, -0.64],
        [-0.96, 0.64],
        [0, 0.64],
        [0.96, 0.64]
      ].forEach(([px, pz], idx) => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, 1.54, 10),
          getMat("#ea580c")
        );
        post.position.set(px, COURT_TOP + 0.77, pz);
        courtGroup.add(post);

        const pad = new THREE.Mesh(
          new THREE.CylinderGeometry(0.082, 0.082, 0.46, 12),
          getMat(padColors[idx % padColors.length])
        );
        pad.position.set(px, COURT_TOP + 0.23, pz);
        courtGroup.add(pad);
      });

      // Three transverse orange steel trusses matching reference model 03
      [-0.96, 0, 0.96].forEach((tx) => {
        const trussBar = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.07, 1.44),
          getMat("#ea580c")
        );
        trussBar.position.set(tx, COURT_TOP + 1.5, 0);
        trussBar.rotation.x = 0.1;
        courtGroup.add(trussBar);
      });

      // Open-truss longitudinal orange steel purlins (no solid flat box!)
      [-0.64, 0, 0.64].forEach((bz) => {
        const purlin = new THREE.Mesh(
          new THREE.BoxGeometry(2.14, 0.06, 0.065),
          getMat("#ea580c")
        );
        purlin.position.set(0, COURT_TOP + 1.54 - bz * 0.1, bz);
        courtGroup.add(purlin);
      });

      // Dual-bay Gridded Solar Canopy cleanly separated above frameBeam
      [-0.44, 0.44].forEach((rz) => {
        const solarWing = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.05, 0.84),
          getSolarPanelMaterial()
        );
        solarWing.position.set(0, COURT_TOP + 1.62 + rz * -0.1, rz);
        solarWing.rotation.x = 0.1;
        solarWing.castShadow = true;
        courtGroup.add(solarWing);
      });

      const courtSign = createSignboard("太陽能光電球場", "#0d9468", "#fffaf2", 0.18);
      courtSign.position.set(0, COURT_TOP + 1.88, 0.85);
      courtGroup.add(courtSign);
      g.add(courtGroup);

      // =====================================================================
      // 3. 紅蘿蔔主題溜滑梯與木屋砂坑遊戲場 (Non-overlapping Thickened Slabs & Props)
      // =====================================================================
      const playGroup = new THREE.Group();
      playGroup.position.set(1.15, 0, -1.78);

      const matSide = getMat("#334155");
      const MAT_TOP = 0.06;
      const safeMat = new THREE.Mesh(
        new THREE.BoxGeometry(1.18, MAT_TOP, 0.98),
        [matSide, matSide, getLongJumpMatMaterial(), matSide, matSide, matSide]
      );
      safeMat.position.set(-0.52, MAT_TOP / 2, 0);
      safeMat.receiveShadow = true;
      playGroup.add(safeMat);

      // Carrot-themed Dome Slide Tower
      const domeTower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.19, 0.56, 12),
        getMat("#0ea5e9")
      );
      domeTower.position.set(-0.65, MAT_TOP + 0.28, -0.08);
      playGroup.add(domeTower);

      const domeCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.21, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        getMat("#38bdf8")
      );
      domeCap.position.set(-0.65, MAT_TOP + 0.56, -0.08);
      playGroup.add(domeCap);

      // Cute 3D Carrot Topper on the Playground Slide Tower
      const towerCarrot = createCarrot(0.75, 0.7);
      towerCarrot.position.set(-0.65, MAT_TOP + 0.8, -0.08);
      playGroup.add(towerCarrot);

      const slideChute = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.06, 0.18),
        getMat("#ef4444")
      );
      slideChute.position.set(-0.36, MAT_TOP + 0.21, -0.08);
      slideChute.rotation.z = -0.52;
      playGroup.add(slideChute);

      // Sandpit & Timber Treehouse (non-overlapping border & sand fill)
      const sandBorder = new THREE.Mesh(
        new THREE.BoxGeometry(1.04, 0.07, 0.88),
        getMat("#3b82f6")
      );
      sandBorder.position.set(0.64, 0.035, 0);
      playGroup.add(sandBorder);

      const sandFill = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.04, 0.74),
        getMat("#e7d3b0")
      );
      sandFill.position.set(0.64, 0.09, 0);
      playGroup.add(sandFill);

      // Sandpit toy bucket
      const bucket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.04, 0.08, 10),
        getMat("#f97316")
      );
      bucket.position.set(0.36, 0.15, 0.2);
      playGroup.add(bucket);

      const treeHouse = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.48, 0.34),
        getMat("#92400e")
      );
      treeHouse.position.set(0.64, 0.11 + 0.24, -0.1);
      playGroup.add(treeHouse);

      const thRoof = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.24, 4),
        getMat("#78350f")
      );
      thRoof.rotation.y = Math.PI / 4;
      thRoof.position.set(0.64, 0.11 + 0.6, -0.1);
      playGroup.add(thRoof);

      const greenSlide = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.42),
        getMat("#22c55e")
      );
      greenSlide.position.set(0.64, 0.11 + 0.15, 0.16);
      greenSlide.rotation.x = 0.55;
      playGroup.add(greenSlide);
      g.add(playGroup);

      // =====================================================================
      // 4. 雲水書車 (Refined Mobile Library Van with Wheels, Hubcaps, Awning & Colorful Books)
      // =====================================================================
      const van = new THREE.Group();
      van.position.set(-0.15, 0, -1.95);
      van.rotation.y = 0.15;

      const vBody = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.52, 0.52), getMat("#f59e0b"));
      vBody.position.y = 0.36;
      vBody.castShadow = true;
      van.add(vBody);

      // Open book display recess with colorful book spines
      const bookShelf = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.04), getMat("#fef3c7"));
      bookShelf.position.set(-0.04, 0.38, 0.255);
      van.add(bookShelf);

      ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"].forEach((bc, bi) => {
        const bk = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.03), getMat(bc));
        bk.position.set(-0.24 + bi * 0.11, 0.38, 0.275);
        van.add(bk);
      });

      // Gullwing raised canopy awning
      const awning = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.28), getMat("#fbbf24"));
      awning.position.set(-0.04, 0.62, 0.36);
      awning.rotation.x = -0.35;
      van.add(awning);

      const vCab = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.4, 0.48), getMat("#fef3c7"));
      vCab.position.set(0.56, 0.3, 0);
      van.add(vCab);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.42), getMat("#38bdf8"));
      windshield.position.set(0.735, 0.36, 0);
      van.add(windshield);

      // 4 Rubber Wheels with silver hubcaps
      [
        [-0.28, -0.24],
        [-0.28, 0.24],
        [0.48, -0.24],
        [0.48, 0.24]
      ].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.06, 12),
          getMat("#1e293b")
        );
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wx, 0.1, wz);
        van.add(wheel);

        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.068, 10),
          getMat("#cbd5e1")
        );
        hub.rotation.x = Math.PI / 2;
        hub.position.set(wx, 0.1, wz);
        van.add(hub);
      });

      const vanSign = createSignboard("雲水書車", "#059669", "#ffffff", 0.14);
      vanSign.position.set(0, 0.76, 0);
      van.add(vanSign);
      g.add(van);

      // Students on the Solar Court & Playground standing cleanly above slab height (COURT_TOP + 0.005)
      g.add(createPerson({ shirt: "#ef4444", hat: "headband", task: "jumping_jacks", seed: 51 }).translateX(1.08).translateY(COURT_TOP + 0.005).translateZ(0.42));
      g.add(createPerson({ shirt: "#3b82f6", hat: "headband", task: "jumping_jacks", seed: 52 }).translateX(1.75).translateY(COURT_TOP + 0.005).translateZ(0.42));
      g.add(createPerson({ shirt: "#eab308", task: "cheer", seed: 53 }).translateX(1.42).translateY(COURT_TOP + 0.005).translateZ(0.02));
      g.add(createPerson({ shirt: "#ec4899", task: "hopscotch", seed: 54 }).translateX(0.84).translateY(MAT_TOP + 0.005).translateZ(-1.48));
      g.add(createPerson({ shirt: "#10b981", task: "cheer", seed: 55 }).translateX(2.06).translateY(0.115).translateZ(-1.56));
      const vanReader = createPerson({ shirt: "#8b5cf6", prop: "book", task: "story", seed: 56 });
      vanReader.position.set(-0.08, 0, -1.12);
      vanReader.rotation.y = Math.PI;
      g.add(vanReader);
    } else if (st.id === "gallery") {
      // STATION 06: 學習花絮站 (學習體驗館 + 紅蘿蔔體驗農園 + 豐收竹簍 + 國際數位立體地球儀)
      const bldg = createBuilding({
        w: 2.3,
        d: 1.15,
        floors: 2,
        wall: "#f5f3ff",
        trim: "#8b5cf6",
        sign: "學習體驗館",
        roofType: "gable",
        solar: true
      });
      bldg.position.set(-1.05, 0, -1.8);
      g.add(bldg);

      const patch1 = createCarrotPatch(2.35, 1.35, 3, 4);
      patch1.position.set(1.2, 0, 0.65);
      g.add(patch1);

      const basket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.32, 0.38, 16),
        getMat("#b45309")
      );
      basket.position.set(-1.35, 0.19, 1.1);
      g.add(basket);
      [0.2, 0.38].forEach((hy, hi) => {
        const basketRim = new THREE.Mesh(
          new THREE.TorusGeometry(hi === 0 ? 0.39 : 0.45, 0.026, 8, 22),
          getMat("#92400e")
        );
        basketRim.rotation.x = Math.PI / 2;
        basketRim.position.set(-1.35, hy, 1.1);
        g.add(basketRim);
      });

      for (let i = 0; i < 5; i++) {
        const c = createCarrot(1.15, 0.8);
        c.position.set(
          -1.35 + Math.cos(i * 1.25) * 0.16,
          0.36,
          1.1 + Math.sin(i * 1.25) * 0.16
        );
        g.add(c);
      }

      // Refined International Digital Globe with Brass Meridian, Orbit Ring & Satellite
      const globeGroup = new THREE.Group();
      globeGroup.position.set(1.75, 0, -1.25);

      const globePlinth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.36, 0.08, 16),
        getMat("#475569")
      );
      globePlinth.position.y = 0.04;
      globeGroup.add(globePlinth);

      const globeStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.24, 0.38, 14),
        getMat("#64748b", { metalness: 0.45, roughness: 0.3 })
      );
      globeStand.position.y = 0.25;
      globeGroup.add(globeStand);

      const meridian = new THREE.Mesh(
        new THREE.TorusGeometry(0.53, 0.025, 8, 28),
        getMat("#fbbf24", { metalness: 0.55, roughness: 0.25 })
      );
      meridian.position.y = 0.86;
      globeGroup.add(meridian);

      const globeSphere = new THREE.Group();
      globeSphere.position.y = 0.86;
      globeSphere.rotation.z = 0.32;
      const ocean = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 22, 18),
        getMat("#0ea5e9", { roughness: 0.35 })
      );
      globeSphere.add(ocean);

      // Green continent patches on the globe
      [
        [0.25, 0.2, 0.32, 0.18],
        [-0.28, 0.12, 0.3, 0.16],
        [0.1, -0.25, -0.35, 0.17],
        [-0.2, -0.15, -0.36, 0.15]
      ].forEach(([cx, cy, cz, cr]) => {
        const cont = new THREE.Mesh(
          new THREE.SphereGeometry(cr, 10, 8),
          getMat("#22c55e")
        );
        cont.position.set(cx, cy, cz);
        globeSphere.add(cont);
      });

      const satRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.62, 0.012, 6, 32),
        getMat("#38bdf8", { emissive: "#0284c7", emissiveIntensity: 0.4 })
      );
      satRing.rotation.x = Math.PI * 0.42;
      globeSphere.add(satRing);

      globeGroup.add(globeSphere);
      g.add(globeGroup);

      dynamicCallbacks.push((dt) => {
        if (state.animate) globeSphere.rotation.y += dt * 0.8;
      });

      const pCarrot1 = createPerson({ shirt: "#f97316", hat: "straw", prop: "carrot", task: "pull_carrot", seed: 61 });
      pCarrot1.position.set(0.65, 0, 1.52);
      pCarrot1.rotation.y = Math.PI;
      g.add(pCarrot1);

      const pCarrot2 = createPerson({ shirt: "#10b981", hat: "straw", prop: "carrot", task: "pull_carrot", seed: 62 });
      pCarrot2.position.set(1.55, 0, 1.52);
      pCarrot2.rotation.y = Math.PI;
      g.add(pCarrot2);

      g.add(createPerson({ shirt: "#eab308", hat: "straw", prop: "carrot", task: "trophy", seed: 63 }).translateX(-0.62).translateZ(1.45));
      g.add(createPerson({ shirt: "#ec4899", hat: "straw", task: "cheer", seed: 64 }).translateX(-2.12).translateZ(1.38));
      g.add(createPerson({ shirt: "#3b82f6", task: "wave", seed: 65 }).translateX(0.72).translateZ(-1.05));
      g.add(createPerson({ shirt: "#a855f7", task: "dance", seed: 66 }).translateX(-0.68).translateZ(0.15));
    } else if (st.id === "achievements") {
      // STATION 07: 榮譽榜站 (卓越榮耀殿堂 + 冠亞季軍頒獎台 + 雙耳旋轉大金盃)
      const bldg = createBuilding({
        w: 2.6,
        d: 1.2,
        floors: 2,
        wall: "#fffbeb",
        trim: "#d97706",
        sign: "卓越榮耀殿堂",
        solar: true
      });
      bldg.position.set(0, 0, -1.85);
      g.add(bldg);

      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.56, 0.66), getMat("#f59e0b"));
      p1.position.set(0, 0.28, 0.35);
      g.add(p1);
      const p1Cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.7), getMat("#fde047"));
      p1Cap.position.set(0, 0.57, 0.35);
      g.add(p1Cap);

      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.38, 0.66), getMat("#94a3b8"));
      p2.position.set(-0.75, 0.19, 0.35);
      g.add(p2);
      const p2Cap = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.04, 0.7), getMat("#e2e8f0"));
      p2Cap.position.set(-0.75, 0.39, 0.35);
      g.add(p2Cap);

      const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.28, 0.66), getMat("#b45309"));
      p3.position.set(0.75, 0.14, 0.35);
      g.add(p3);
      const p3Cap = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.04, 0.7), getMat("#d97706"));
      p3Cap.position.set(0.75, 0.29, 0.35);
      g.add(p3Cap);

      // Refined Championship Trophy with Smooth LatheGeometry Chalice Profile, Handles & Star
      const trophy = new THREE.Group();
      trophy.position.set(2.0, 0, -0.2);
      const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.28, 18), getMat("#78350f"));
      tBase.position.y = 0.14;
      trophy.add(tBase);

      const tPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.03), getMat("#fde047"));
      tPlaque.position.set(0, 0.14, 0.43);
      trophy.add(tPlaque);

      const goldMat = new THREE.MeshStandardMaterial({
        color: "#fbbf24",
        emissive: "#d97706",
        emissiveIntensity: 0.2,
        metalness: 0.65,
        roughness: 0.18
      });
      const cupPoints = [
        new THREE.Vector2(0.01, 0.28),
        new THREE.Vector2(0.24, 0.28),
        new THREE.Vector2(0.11, 0.42),
        new THREE.Vector2(0.11, 0.54),
        new THREE.Vector2(0.32, 0.7),
        new THREE.Vector2(0.42, 1.05),
        new THREE.Vector2(0.45, 1.18),
        new THREE.Vector2(0.38, 1.18),
        new THREE.Vector2(0.34, 0.96),
        new THREE.Vector2(0.01, 0.74)
      ];
      const cupMesh = new THREE.Mesh(new THREE.LatheGeometry(cupPoints, 24), goldMat);
      cupMesh.castShadow = true;
      trophy.add(cupMesh);

      [-0.36, 0.36].forEach((hx) => {
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 8, 18), goldMat);
        handle.position.set(hx, 0.92, 0);
        trophy.add(handle);
      });

      const starTop = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), goldMat);
      starTop.position.y = 1.42;
      trophy.add(starTop);

      g.add(trophy);
      dynamicCallbacks.push((dt) => {
        if (state.animate) trophy.rotation.y += dt * 1.1;
      });

      g.add(createPerson({ shirt: "#fef08a", prop: "trophy", task: "trophy", seed: 71 }).translateX(0).translateY(0.6).translateZ(0.35));
      g.add(createPerson({ shirt: "#38bdf8", prop: "trophy", task: "cheer", seed: 72 }).translateX(-0.75).translateY(0.42).translateZ(0.35));
      g.add(createPerson({ shirt: "#fb7185", task: "cheer", seed: 73 }).translateX(0.75).translateY(0.32).translateZ(0.35));
      g.add(createPerson({ shirt: "#f97316", task: "jumping_jacks", seed: 74 }).translateX(-1.35).translateZ(1.35));
      g.add(createPerson({ shirt: "#10b981", task: "jumping_jacks", seed: 75 }).translateX(1.35).translateZ(1.35));
      g.add(createPerson({ shirt: "#a855f7", prop: "camera", task: "photo", seed: 76 }).translateX(-0.55).translateZ(1.65));
    } else if (st.id === "media") {
      // STATION 08: 媒體報導站 (漚汪媒體轉播中心 + 訊號發射塔 + 戶外電視牆)
      const bldg = createBuilding({
        w: 2.4,
        d: 1.2,
        floors: 2,
        wall: "#eff6ff",
        trim: "#2563eb",
        sign: "漚汪媒體轉播中心",
        solar: true
      });
      bldg.position.set(-0.85, 0, -1.8);
      g.add(bldg);

      const tower = new THREE.Group();
      tower.position.set(1.85, 0, -1.2);
      const tBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.48), getMat("#64748b"));
      tBase.position.y = 0.07;
      tower.add(tBase);

      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.15, 2.5, 10),
        getMat("#94a3b8", { metalness: 0.5, roughness: 0.3 })
      );
      mast.position.y = 1.3;
      tower.add(mast);

      [0.8, 1.4, 2.0].forEach((ry, i) => {
        const dishRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.22 - i * 0.04, 0.02, 6, 16),
          getMat("#cbd5e1")
        );
        dishRing.rotation.x = Math.PI / 2;
        dishRing.position.y = ry;
        tower.add(dishRing);
      });

      const dish = new THREE.Mesh(
        new THREE.ConeGeometry(0.24, 0.14, 16, 1, true),
        getMat("#e2e8f0", { side: THREE.DoubleSide, metalness: 0.4, roughness: 0.3 })
      );
      dish.rotation.x = Math.PI * 0.68;
      dish.position.set(-0.14, 1.95, 0.14);
      tower.add(dish);

      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 12, 10),
        new THREE.MeshBasicMaterial({ color: "#ef4444" })
      );
      beacon.position.y = 2.6;
      tower.add(beacon);

      const waveRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.025, 8, 24),
        new THREE.MeshBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.7 })
      );
      waveRing.rotation.x = Math.PI / 2;
      waveRing.position.y = 2.6;
      tower.add(waveRing);
      g.add(tower);

      dynamicCallbacks.push((dt, elapsed) => {
        if (!state.animate) return;
        const p = (elapsed * 0.7) % 1;
        waveRing.scale.setScalar(0.5 + p * 2.2);
        waveRing.material.opacity = 0.8 * (1 - p);
      });

      // Outdoor Live News Broadcast Wall (Crisp CanvasTexture TV Broadcast Screen!)
      const board = new THREE.Group();
      board.position.set(0.95, 0, 0.55);
      board.rotation.y = -0.35;

      [-0.55, 0.55].forEach((px) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.68, 10), getMat("#334155"));
        leg.position.set(px, 0.34, 0);
        board.add(leg);
      });

      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.86, 1.1, 0.11), getMat("#1e293b"));
      frame.position.y = 1.12;
      frame.castShadow = true;
      board.add(frame);

      const screenFace = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 0.94),
        getLiveNewsMaterial()
      );
      screenFace.position.set(0, 1.12, 0.062);
      board.add(screenFace);

      const bSign = createSignboard("媒體報導 LIVE", "#2563eb", "#ffffff", 0.18);
      bSign.position.set(0, 1.82, 0);
      board.add(bSign);
      g.add(board);

      g.add(createPerson({ shirt: "#2563eb", hat: "cap", prop: "camera", task: "photo", seed: 81 }).translateX(-0.9).translateZ(1.15));
      g.add(createPerson({ shirt: "#f97316", prop: "book", task: "story", seed: 82 }).translateX(-0.15).translateZ(1.25));
      g.add(createPerson({ shirt: "#10b981", task: "cheer", seed: 83 }).translateX(0.55).translateZ(1.55));
      g.add(createPerson({ shirt: "#ec4899", task: "dance", seed: 84 }).translateX(-1.6).translateZ(0.45));
      g.add(createPerson({ shirt: "#eab308", task: "jumping_jacks", seed: 85 }).translateX(1.88).translateZ(0.18));
    }

    // Perimeter campus trees on each station zone (No stationary dressed avatar on stations!)
    const treeAngles = [0.4, 1.15, 2.55, 3.85, 5.25];
    treeAngles.forEach((a, i) => {
      const r = 3.55;
      const tree = createTree(0.62 + (i % 3) * 0.11, i % 2 === 0 ? "#4ca644" : "#64b850");
      tree.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
      g.add(tree);
    });

    return g;
  }

  // Build All 8 Campus Feature Zones (Firmly Grounded on Campus Turf — Never Floating!)
  function buildStations() {
    const stations = window.OWES_DATA.stations;
    const labelLayer = document.getElementById("label-layer");

    stations.forEach((st, idx) => {
      const root = new THREE.Group();
      const [px, py, pz] = st.position;
      const radius = st.id === "vision" ? 4.65 : st.id === "facilities" ? 4.4 : 4.05;
      // Grounded firmly at y = 0 (no floating in mid-air)
      root.position.set(px, py, pz);

      const curbMat = new THREE.MeshStandardMaterial({
        color: st.color,
        emissive: st.color,
        emissiveIntensity: 0.0,
        roughness: 0.65
      });
      const curbGeo = createOctagonGeo(radius * 0.99, 0.16, 0.05);
      const curbMesh = new THREE.Mesh(curbGeo, curbMat);
      curbMesh.position.y = 0.01;
      curbMesh.castShadow = true;
      curbMesh.receiveShadow = true;
      root.add(curbMesh);

      const grassGeo = createOctagonGeo(radius * 0.96, 0.14, 0.05);
      const grassMesh = new THREE.Mesh(grassGeo, getMat(st.grass));
      grassMesh.position.y = 0.09; // Top at y = 0.280
      grassMesh.receiveShadow = true;
      grassMesh.userData = { type: "station", stationId: st.id };
      root.add(grassMesh);
      interactiveMeshes.push(grassMesh);

      // Content surface strictly ABOVE grassMesh top (0.288 > 0.280 -> ZERO floor Z-fighting!)
      const surface = new THREE.Group();
      surface.position.y = 0.288;
      surface.add(buildStationDiorama(st));
      root.add(surface);

      const pickDome = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.88, radius * 0.88, 2.5, 12),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      pickDome.position.y = 1.4;
      pickDome.userData = { type: "station", stationId: st.id };
      root.add(pickDome);
      interactiveMeshes.push(pickDome);

      scene.add(root);
      stationGroups.set(st.id, {
        group: root,
        curbMat,
        basePos: new THREE.Vector3(px, py, pz),
        index: idx,
        radius
      });
      stationTargets.set(st.id, new THREE.Vector3(px, 1.3, pz));

      if (labelLayer) {
        const item = document.createElement("div");
        item.className = "label-item";
        const btn = document.createElement("button");
        btn.className = "nameplate";
        btn.style.setProperty("--c", st.color);
        btn.innerHTML = `<span class="dot"></span><span class="np-icon">${st.icon}</span><span>${st.short}</span><em>${st.kind}</em>`;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.OWES_APP) window.OWES_APP.selectStation(st.id);
        });
        btn.addEventListener("mouseenter", () => setHovered(st.id));
        btn.addEventListener("mouseleave", () => setHovered(null));
        item.appendChild(btn);
        labelLayer.appendChild(item);
        labelElements.set(st.id, {
          wrapper: item,
          btn,
          worldPos: new THREE.Vector3(px, st.id === "vision" ? 4.6 : 3.9, pz)
        });
      }
    });

    // Highlight selected/hovered station curb glow (without lifting into the air)
    dynamicCallbacks.push((dt) => {
      stationGroups.forEach((info, id) => {
        const targetGlow = state.selected === id ? 0.45 : state.hovered === id ? 0.25 : 0.0;
        info.curbMat.emissiveIntensity +=
          (targetGlow - info.curbMat.emissiveIntensity) * Math.min(1, dt * 8);
      });
    });
  }

  // Build Grounded Campus + PU Running Track + Outer Jiangjun Carrot Fields Countryside
  function buildCampusAndCarrotCountryside() {
    // 1. Continuous Vast Jiangjun Countryside Ground Plane (絕不漂浮在空中)
    const worldGroundGeo = new THREE.CircleGeometry(210, 64);
    worldGroundGeo.rotateX(-Math.PI / 2);
    groundMat = new THREE.MeshStandardMaterial({
      color: "#6b9d47",
      roughness: 0.92,
      metalness: 0.01
    });
    const worldGround = new THREE.Mesh(worldGroundGeo, groundMat);
    worldGround.position.y = -0.02;
    worldGround.receiveShadow = true;
    scene.add(worldGround);

    // 2. Inner Campus Lawn Zone (校園草地範圍 45 x 42)
    const campusW = 45;
    const campusD = 42;
    campusTurfMat = new THREE.MeshStandardMaterial({
      color: "#76ab50",
      roughness: 0.86,
      metalness: 0.02
    });
    const campusTurf = new THREE.Mesh(
      new THREE.PlaneGeometry(campusW, campusD),
      campusTurfMat
    );
    campusTurf.rotation.x = -Math.PI / 2;
    campusTurf.position.set(0, 0.005, -0.5);
    campusTurf.receiveShadow = true;
    scene.add(campusTurf);

    // Low Red-Brick & Green Hedge School Perimeter Wall (校園圍牆與綠籬，南側留出校門大道)
    const buildWallSegment = (x, z, w, d) => {
      const wg = new THREE.Group();
      wg.position.set(x, 0, z);
      const brick = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.32, d),
        getMat("#c2643d")
      );
      brick.position.y = 0.16;
      brick.castShadow = true;
      brick.receiveShadow = true;
      wg.add(brick);
      const hedge = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.98, 0.28, d * 0.98),
        getMat("#4b8f3b")
      );
      hedge.position.y = 0.44;
      wg.add(hedge);
      scene.add(wg);
    };
    // North, West, East, and South (left/right of front gate) perimeter walls
    buildWallSegment(0, -21.5, 45.4, 0.45);
    buildWallSegment(-22.5, -0.5, 0.45, 42.4);
    buildWallSegment(22.5, -0.5, 0.45, 42.4);
    buildWallSegment(-13.2, 20.5, 18.8, 0.45);
    buildWallSegment(13.2, 20.5, 18.8, 0.45);

    // South Gate Entrance Avenue (校門迎賓紅磚大道連接外圍田間道路，緊接校門無重疊)
    const gateAve = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 0.02, 24.4),
      getMat("#d48c58")
    );
    gateAve.position.set(0, 0.015, 30.8);
    gateAve.receiveShadow = true;
    scene.add(gateAve);

    // =========================================================================
    // 3. CENTRAL 6-LANE SYNTHETIC PU RUNNING TRACK & SOCCER INFIELD (操場 PU 跑道與中央踢足球)
    // =========================================================================
    const trackCenterZ = -1.6;
    const trackGroup = new THREE.Group();
    trackGroup.position.set(0, 0.016, trackCenterZ);
    scene.add(trackGroup);

    const straightL = 6.8;
    const outerR = 5.4;
    const innerR = 3.3;
    const puMat = getPuTrackMaterial();

    // -------------------------------------------------------------------------
    // Solid, non-overlapping track slabs (no coplanar faces = no flickering)
    //   trackGroup y = +0.016 (cleanly above campusTurf 0.005)
    //   curb slab  : local y 0.000 -> 0.040
    //   PU slab    : local y 0.000 -> 0.060
    //   infield    : local y 0.000 -> 0.055  (mowed grass, fills the hole cleanly)
    // -------------------------------------------------------------------------
    const TRACK_TOP = 0.016 + 0.064;

    const makeRingShape = (outerStraight, outerRadius, innerStraight, innerRadius) => {
      const shape = createStadiumShape(outerStraight, outerRadius);
      const hole = new THREE.Path();
      const hw = innerStraight / 2;
      hole.absarc(hw, 0, innerRadius, -Math.PI / 2, Math.PI / 2, false);
      hole.absarc(-hw, 0, innerRadius, Math.PI / 2, (Math.PI * 3) / 2, false);
      hole.closePath();
      shape.holes.push(hole);
      return shape;
    };

    const extrudeFlat = (shape, depth) => {
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 48
      });
      geo.rotateX(-Math.PI / 2);
      return geo;
    };

    // White outer kerb (ring around the PU track, never under the PU surface)
    const curbMesh = new THREE.Mesh(
      extrudeFlat(makeRingShape(straightL, outerR + 0.16, straightL, outerR), 0.04),
      getMat("#f1f5f9", { roughness: 0.6 })
    );
    curbMesh.receiveShadow = true;
    trackGroup.add(curbMesh);

    // PU rubber track ring (PU 顆粒材質，中空不與草坪重疊)
    const puMesh = new THREE.Mesh(
      extrudeFlat(makeRingShape(straightL, outerR, straightL, innerR), 0.06),
      puMat
    );
    puMesh.receiveShadow = true;
    trackGroup.add(puMesh);

    // Thin raised white lane strips (actual geometry sitting 1.2 cm above PU — no z-fighting)
    const laneLineMat = getMat("#ffffff", { roughness: 0.5 });
    for (let lane = 1; lane <= 5; lane++) {
      const r = innerR + (lane / 6) * (outerR - innerR);
      const strip = new THREE.Mesh(
        extrudeFlat(makeRingShape(straightL, r + 0.022, straightL, r - 0.022), 0.012),
        laneLineMat
      );
      strip.position.y = 0.06;
      trackGroup.add(strip);
    }

    // Inner white kerb between track and infield
    const innerKerb = new THREE.Mesh(
      extrudeFlat(makeRingShape(straightL, innerR + 0.001, straightL, innerR - 0.09), 0.075),
      getMat("#f8fafc", { roughness: 0.55 })
    );
    trackGroup.add(innerKerb);

    // Start/Finish line strip on the south straightaway
    const finishLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.012, outerR - innerR - 0.08),
      laneLineMat
    );
    finishLine.position.set(0, 0.066, (innerR + outerR) / 2);
    trackGroup.add(finishLine);

    // Mowed-stripe infield grass (no goals, no pitch lines — just a field to play on)
    const infieldMats = [
      getSoccerPitchMaterial(),
      getMat("#5f9a3c")
    ];
    const infieldGeo = extrudeFlat(createStadiumShape(straightL, innerR - 0.09), 0.055);
    // Planar UV mapping for the top face so the mowed stripes span the whole field
    infieldGeo.computeBoundingBox();
    const bb = infieldGeo.boundingBox;
    const uvAttr = infieldGeo.attributes.uv;
    const posAttr = infieldGeo.attributes.position;
    for (let i = 0; i < uvAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      uvAttr.setXY(
        i,
        (x - bb.min.x) / (bb.max.x - bb.min.x),
        (z - bb.min.z) / (bb.max.z - bb.min.z)
      );
    }
    uvAttr.needsUpdate = true;
    const infieldMesh = new THREE.Mesh(infieldGeo, infieldMats);
    infieldMesh.receiveShadow = true;
    trackGroup.add(infieldMesh);

    // 6 Students casually kicking a soccer ball around on the infield grass (no goals, no lines)
    const soccerPlayersConfig = [
      { x: -2.6, z: 0.35, shirt: "#fde047", pants: "#1e293b", hat: "cap", rotY: Math.PI / 2, seed: 601 },
      { x: 2.55, z: -0.3, shirt: "#10b981", pants: "#1e293b", hat: "cap", rotY: -Math.PI / 2, seed: 602 },
      { x: -1.35, z: -0.95, shirt: "#ef4444", pants: "#1e293b", hat: "headband", rotY: 1.2, seed: 603 },
      { x: -0.75, z: 1.0, shirt: "#f97316", pants: "#1e293b", hat: null, rotY: 1.8, seed: 604 },
      { x: 0.85, z: -1.0, shirt: "#38bdf8", pants: "#1e3a8a", hat: "headband", rotY: -1.3, seed: 605 },
      { x: 1.4, z: 0.95, shirt: "#2563eb", pants: "#1e3a8a", hat: null, rotY: -1.8, seed: 606 }
    ];
    const soccerPlayerMeshes = [];
    soccerPlayersConfig.forEach((sp) => {
      const p = createPerson({
        shirt: sp.shirt,
        pants: sp.pants,
        hat: sp.hat,
        task: "soccer",
        seed: sp.seed,
        scale: 1.02
      });
      p.position.set(sp.x, 0.06, sp.z);
      p.rotation.y = sp.rotY;
      trackGroup.add(p);
      soccerPlayerMeshes.push(p);
    });

    // Refined 3D Soccer Ball (icosahedron panels: white base + 12 dark pentagon caps)
    const BALL_R = 0.13;
    const soccerBall = new THREE.Group();
    const ballWhite = new THREE.Mesh(
      new THREE.IcosahedronGeometry(BALL_R, 2),
      getMat("#ffffff", { roughness: 0.4 })
    );
    ballWhite.castShadow = true;
    soccerBall.add(ballWhite);
    const icoDirs = new THREE.IcosahedronGeometry(1, 0).attributes.position;
    const seenDirs = [];
    for (let i = 0; i < icoDirs.count; i++) {
      const d = new THREE.Vector3(icoDirs.getX(i), icoDirs.getY(i), icoDirs.getZ(i)).normalize();
      if (seenDirs.some((s) => s.distanceTo(d) < 0.01)) continue;
      seenDirs.push(d);
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.012, 5),
        getMat("#1e293b", { roughness: 0.45 })
      );
      cap.position.copy(d).multiplyScalar(BALL_R + 0.002);
      cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      soccerBall.add(cap);
    }
    trackGroup.add(soccerBall);

    // Friendly passing circle: the ball travels between the students' feet
    const passOrder = [0, 2, 4, 1, 5, 3];
    const ballTargets = passOrder.map((idx) => {
      const sp = soccerPlayersConfig[idx];
      const toCenter = new THREE.Vector3(-sp.x, 0, -sp.z).normalize().multiplyScalar(0.28);
      return new THREE.Vector3(sp.x + toCenter.x, 0.058 + BALL_R, sp.z + toCenter.z);
    });
    let soccerPassClock = 0;
    dynamicCallbacks.push((dt) => {
      if (!state.animate) return;
      soccerPassClock += dt * 0.7;
      const segIdx = Math.floor(soccerPassClock) % ballTargets.length;
      const nextIdx = (segIdx + 1) % ballTargets.length;
      const rawU = soccerPassClock - Math.floor(soccerPassClock);
      const u = rawU * rawU * (3 - 2 * rawU); // smooth ease in/out

      const pA = ballTargets[segIdx];
      const pB = ballTargets[nextIdx];
      const bx = pA.x + (pB.x - pA.x) * u;
      const bz = pA.z + (pB.z - pA.z) * u;
      const arcH = Math.sin(u * Math.PI) * 0.22; // low rolling chip, stays near the grass
      soccerBall.position.set(bx, pA.y + arcH, bz);
      soccerBall.rotation.x += dt * 6.0;
      soccerBall.rotation.z -= dt * 4.5;

      // Turn soccer players toward the live soccer ball
      soccerPlayerMeshes.forEach((pm) => {
        const dx = bx - pm.position.x;
        const dz = bz - pm.position.z;
        pm.rotation.y = Math.atan2(dx, dz);
      });
    });

    // Refined Assembly Stage (司令台，含階梯、欄杆與講台，依需求不呈現國旗與旗桿)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, 0.01, -7.85);
    const stagePlat = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.34, 1.35),
      getMat("#e7dec8")
    );
    stagePlat.position.y = 0.17;
    stagePlat.castShadow = true;
    stagePlat.receiveShadow = true;
    stageGroup.add(stagePlat);

    // Front approach stairs (3 steps)
    [0, 1, 2].forEach((s) => {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.11, 0.24),
        getMat("#d6cec2")
      );
      step.position.set(0, 0.055 + s * 0.11, 0.92 - s * 0.14);
      stageGroup.add(step);
    });

    // Side guardrails
    [-1.4, 1.4].forEach((rx) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.28, 1.25),
        getMat("#cbd5e1")
      );
      rail.position.set(rx, 0.48, 0);
      stageGroup.add(rail);
    });

    // Speaker Podium Lectern
    const lectern = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.46, 0.24),
      getMat("#92400e")
    );
    lectern.position.set(0, 0.57, 0.25);
    stageGroup.add(lectern);

    const stageWall = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 1.08, 0.22),
      getMat("#f5ebd6")
    );
    stageWall.position.set(0, 0.8, -0.52);
    stageGroup.add(stageWall);
    const stageRoof = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.13, 1.55),
      getMat("#8fa878")
    );
    stageRoof.position.set(0, 1.4, -0.08);
    stageRoof.rotation.x = 0.12;
    stageRoof.castShadow = true;
    stageGroup.add(stageRoof);
    scene.add(stageGroup);

    // =========================================================================
    // 4. SLOWER CONSTANT-SPEED RUNNERS ON THE PU TRACK (跑者速度放慢且等速平滑)
    // =========================================================================
    const trackRunners = [
      { laneR: 3.65, startU: 0.05, speed: 1.55, shirt: "#f97316", hat: "headband", prop: "baton", seed: 101 },
      { laneR: 3.65, startU: 0.55, speed: 1.55, shirt: "#38bdf8", hat: "headband", prop: null, seed: 102 },
      { laneR: 4.35, startU: 0.22, speed: 1.38, shirt: "#fde047", hat: "cap", prop: null, seed: 103 },
      { laneR: 4.35, startU: 0.74, speed: 1.38, shirt: "#ec4899", hat: "headband", prop: null, seed: 104 },
      { laneR: 5.05, startU: 0.38, speed: 1.24, shirt: "#10b981", hat: null, prop: null, seed: 105 },
      { laneR: 5.05, startU: 0.88, speed: 1.24, shirt: "#a855f7", hat: "cap", prop: null, seed: 106 }
    ];
    trackRunners.forEach((tr) => {
      const runner = createPerson({
        shirt: tr.shirt,
        hat: tr.hat,
        prop: tr.prop,
        ovalTrack: {
          straightL,
          radius: tr.laneR,
          centerZ: trackCenterZ,
          startU: tr.startU
        },
        speed: tr.speed,
        seed: tr.seed,
        scale: 1.02
      });
      runner.position.y = TRACK_TOP;
      scene.add(runner);
    });

    // Cheering & Warming-up Students on the East/West Semicircle Infield Aprons
    const infieldAthletes = [
      { pos: [-4.6, -1.6], shirt: "#ec4899", task: "cheer", scale: 0.96 },
      { pos: [4.6, -1.6], shirt: "#a855f7", task: "jumping_jacks", scale: 0.96 }
    ];
    infieldAthletes.forEach((a, idx) => {
      const p = createPerson({
        shirt: a.shirt,
        hat: a.hat || null,
        prop: a.prop || null,
        task: a.task,
        seed: 120 + idx,
        scale: a.scale
      });
      p.position.set(a.pos[0], 0.016 + 0.06, a.pos[1]);
      scene.add(p);
    });

    // =========================================================================
    // 5. OUTER JIANGJUN CARROT FIELDS COUNTRYSIDE (校園外圍紅蘿蔔田野風光)
    // =========================================================================
    const outerCarrotFieldCoords = [
      // West carrot fields
      [-28, -16, 6.2, 3.8, 0.05],
      [-28, -8, 6.2, 3.8, -0.04],
      [-28, 0, 6.2, 3.8, 0.02],
      [-28, 8, 6.2, 3.8, -0.05],
      [-28, 16, 6.2, 3.8, 0.03],
      [-37, -13, 6.8, 4.2, -0.08],
      [-37, -3, 6.8, 4.2, 0.06],
      [-37, 7, 6.8, 4.2, -0.03],
      [-37, 17, 6.8, 4.2, 0.04],
      // East carrot fields
      [28, -16, 6.2, 3.8, -0.04],
      [28, -8, 6.2, 3.8, 0.05],
      [28, 0, 6.2, 3.8, -0.02],
      [28, 8, 6.2, 3.8, 0.04],
      [28, 16, 6.2, 3.8, -0.03],
      [37, -13, 6.8, 4.2, 0.06],
      [37, -3, 6.8, 4.2, -0.05],
      [37, 7, 6.8, 4.2, 0.03],
      [37, 17, 6.8, 4.2, -0.04],
      // North carrot fields
      [-18, -26.5, 6.0, 3.8, 0.02],
      [-9, -26.5, 6.0, 3.8, -0.03],
      [0, -26.5, 6.0, 3.8, 0.0],
      [9, -26.5, 6.0, 3.8, 0.03],
      [18, -26.5, 6.0, 3.8, -0.02],
      [-14, -34.5, 6.8, 4.2, -0.04],
      [-3, -34.5, 6.8, 4.2, 0.02],
      [8, -34.5, 6.8, 4.2, -0.03],
      [19, -34.5, 6.8, 4.2, 0.05],
      // South carrot fields (flanking the entrance road)
      [-18, 25.5, 6.0, 3.8, -0.02],
      [-9.5, 25.5, 5.6, 3.8, 0.03],
      [9.5, 25.5, 5.6, 3.8, -0.03],
      [18, 25.5, 6.0, 3.8, 0.02],
      [-14, 33.5, 6.5, 4.0, 0.04],
      [14, 33.5, 6.5, 4.0, -0.04]
    ];

    outerCarrotFieldCoords.forEach(([fx, fz, fw, fd, rot]) => {
      const patch = createCarrotPatch(fw, fd, 4, 6);
      patch.position.set(fx, 0, fz);
      patch.rotation.y = rot;
      scene.add(patch);
    });

    // Farmers in straw hats tending the outer carrot fields
    const farmerPositions = [
      [-25.5, -5.5, "#f97316"],
      [-25.5, 11.0, "#10b981"],
      [25.5, -4.5, "#eab308"],
      [25.5, 10.5, "#3b82f6"],
      [-6.0, -24.0, "#ec4899"],
      [7.5, -24.0, "#f97316"],
      [-11.0, 23.2, "#10b981"],
      [11.0, 23.2, "#eab308"]
    ];
    farmerPositions.forEach(([px, pz, col], idx) => {
      const farmer = createPerson({
        shirt: col,
        hat: "straw",
        prop: "carrot",
        task: idx % 2 === 0 ? "pull_carrot" : "wave",
        seed: 400 + idx,
        scale: 1.05
      });
      farmer.position.set(px, 0, pz);
      scene.add(farmer);
    });

    // Campus & Countryside Shade Trees
    const treePositions = [
      [-21, 18], [-16, 19.2], [-10, 19.2], [10, 19.2], [16, 19.2], [21, 18],
      [-21, 6], [-21, -8], [-21, -18], [21, 6], [21, -8], [21, -18],
      [-16, -20.2], [-6, -20.2], [6, -20.2], [16, -20.2],
      // Outer countryside trees
      [-33, -22], [33, -22], [-33, 22], [33, 22],
      [-43, -18], [-43, 0], [-43, 18],
      [43, -18], [43, 0], [43, 18],
      [-24, -31], [0, -39], [24, -31]
    ];
    treePositions.forEach(([tx, tz], i) => {
      const tree = createTree(
        0.78 + (i % 3) * 0.16,
        i % 2 === 0 ? "#4fa643" : "#65b851"
      );
      tree.position.set(tx, 0, tz);
      scene.add(tree);
    });
  }

  // Build Campus Jogging Squad (No Yellow Dots + Obstacle-Free Front Stop + Face User & Station Front + Button to Dismiss & Continue)
  function buildCampusRunnerTour() {
    // 16 obstacle-free waypoints along the open ring avenue, stopping on the +Z FRONT side of each station
    const stopStationDefs = [
      { id: "vision", stopPt: new THREE.Vector3(0, 0.04, 19.8), midNext: new THREE.Vector3(6.0, 0.04, 16.5) },
      { id: "curriculum", stopPt: new THREE.Vector3(9.1, 0.04, 11.2), midNext: new THREE.Vector3(9.1, 0.04, 4.8) },
      { id: "character", stopPt: new THREE.Vector3(10.1, 0.04, 0.2), midNext: new THREE.Vector3(9.5, 0.04, -4.8) },
      { id: "teams", stopPt: new THREE.Vector3(8.5, 0.04, -8.6), midNext: new THREE.Vector3(4.6, 0.04, -9.8) },
      { id: "media", stopPt: new THREE.Vector3(0, 0.04, -10.2), midNext: new THREE.Vector3(-4.6, 0.04, -9.8) },
      { id: "achievements", stopPt: new THREE.Vector3(-8.5, 0.04, -8.6), midNext: new THREE.Vector3(-9.6, 0.04, -4.6) },
      { id: "facilities", stopPt: new THREE.Vector3(-9.8, 0.04, 0.6), midNext: new THREE.Vector3(-8.9, 0.04, 5.6) },
      { id: "gallery", stopPt: new THREE.Vector3(-8.7, 0.04, 12.2), midNext: new THREE.Vector3(-6.0, 0.04, 16.5) }
    ];

    const waypoints = [];
    stopStationDefs.forEach((def) => {
      waypoints.push(def.stopPt);
      waypoints.push(def.midNext);
    });

    runnerCurve = new THREE.CatmullRomCurve3(waypoints, true, "centripetal", 0.5);
    runnerCurveLength = Math.max(1, runnerCurve.getLength());

    // Compute exact arc-length distance (0 .. runnerCurveLength) for each of the 8 station stop points
    const sampleN = 960;
    const stationStops = stopStationDefs.map((def) => {
      let bestU = 0;
      let bestD2 = Infinity;
      for (let i = 0; i < sampleN; i++) {
        const u = i / sampleN;
        const p = runnerCurve.getPointAt(u);
        const d2 = (p.x - def.stopPt.x) ** 2 + (p.z - def.stopPt.z) ** 2;
        if (d2 < bestD2) {
          bestD2 = d2;
          bestU = u;
        }
      }
      const stData = window.OWES_DATA.stations.find((s) => s.id === def.id);
      return {
        id: def.id,
        station: stData,
        stopPt: def.stopPt,
        dist: bestU * runnerCurveLength
      };
    });
    stationStops.sort((a, b) => a.dist - b.dist);

    // Note: Yellow ground path dots removed per user request (跑者不用有畫黃色的點點)

    leadRunnerGroup = new THREE.Group();
    leadRunnerAvatarHolder = new THREE.Group();
    leadRunnerGroup.add(leadRunnerAvatarHolder);

    const runnerHit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 1.6, 10),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    runnerHit.position.y = 0.75;
    runnerHit.userData = { type: "train" };
    leadRunnerGroup.add(runnerHit);
    interactiveMeshes.push(runnerHit);

    scene.add(leadRunnerGroup);

    // 2 Companion Jogging Classmates at fixed arc-length offsets behind the lead runner
    const companionConfigs = [
      { shirt: "#38bdf8", pants: "#1e3a8a", hat: "cap", scale: 1.15, seed: 202, distBack: 1.25, side: -0.32 },
      { shirt: "#ec4899", pants: "#334155", hat: "headband", scale: 1.13, seed: 203, distBack: 2.1, side: 0.32 }
    ];
    companionConfigs.forEach((cfg) => {
      const comp = new THREE.Group();
      comp.add(
        createPerson({
          shirt: cfg.shirt,
          pants: cfg.pants,
          hat: cfg.hat,
          task: "run_in_place",
          seed: cfg.seed,
          scale: cfg.scale
        })
      );
      comp.userData = { distBack: cfg.distBack, side: cfg.side };
      scene.add(comp);
      companionRunners.push(comp);
    });

    // Populate initial user avatars
    rebuildUserAvatars();

    const labelLayer = document.getElementById("label-layer");
    let runnerBadgeBtnEl = null;
    if (labelLayer) {
      const wrapper = document.createElement("div");
      wrapper.className = "label-item";
      const badge = document.createElement("button");
      badge.className = "train-badge";
      badge.innerHTML = `🏃 我的慢跑分身（點擊陪跑）`;
      badge.title = "點擊切換陪跑視角，跟著我的裝扮分身慢跑逛遍校園各站";
      badge.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isWaitingForContinue) {
          resumeRunningToNextStation();
        } else if (window.OWES_APP) {
          window.OWES_APP.toggleTrainView();
        }
      });
      wrapper.appendChild(badge);
      labelLayer.appendChild(wrapper);
      runnerBadgeEl = wrapper;
      runnerBadgeBtnEl = badge;
    }

    // 3D Waypoint Marker (目標站點垂直呼吸光柱與浮動指標，陪跑時遠遠即可辨識目標站點)
    const waypointBeaconGroup = new THREE.Group();
    const beamOuterMat = new THREE.MeshBasicMaterial({
      color: "#f97316",
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beamOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.88, 6.4, 20, 1, true),
      beamOuterMat
    );
    beamOuter.position.y = 3.3;
    waypointBeaconGroup.add(beamOuter);

    const beamCoreMat = new THREE.MeshBasicMaterial({
      color: "#fff7ed",
      transparent: true,
      opacity: 0.44,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beamCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.28, 6.6, 16, 1, true),
      beamCoreMat
    );
    beamCore.position.y = 3.4;
    waypointBeaconGroup.add(beamCore);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: "#f97316",
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const ringBase1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.05, 8, 32),
      ringMat1
    );
    ringBase1.rotation.x = Math.PI / 2;
    ringBase1.position.y = 0.34;
    waypointBeaconGroup.add(ringBase1);

    const crystalMat = new THREE.MeshBasicMaterial({ color: "#fde047" });
    const topCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.36, 0),
      crystalMat
    );
    topCrystal.position.y = 6.8;
    waypointBeaconGroup.add(topCrystal);
    scene.add(waypointBeaconGroup);

    // Top Mini Progress Pill (頂部輕量跑道進度條：即時顯示正前往第幾站、距離與 1~8 站小圓點)
    const rppTextEl = document.getElementById("rpp-text");
    const rppDistEl = document.getElementById("rpp-dist");
    const rppDotsEl = document.getElementById("rpp-dots");
    const rppDotBtns = [];
    if (rppDotsEl) {
      rppDotsEl.innerHTML = "";
      stationStops.forEach((stStop, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "rpp-dot";
        dot.title = `第 ${idx + 1} 站：${stStop.station ? stStop.station.name : stStop.id}`;
        dot.textContent = String(idx + 1);
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          nextStopIdx = idx;
          runnerDist = (stStop.dist - 1.6 + runnerCurveLength) % runnerCurveLength;
          isWaitingForContinue = false;
          activeStopInfo = null;
          isStopSheetExpanded = false;
          stopArrivalTimer = 0;
          setSquadPausedState(false);
          hideRunnerStopHighlightCard();
          if (window.OWES_APP && window.OWES_APP.collapsePanelsForRunning) {
            window.OWES_APP.collapsePanelsForRunning(false);
          }
        });
        rppDotsEl.appendChild(dot);
        rppDotBtns.push(dot);
      });
    }

    function updateRunProgressUI(targetIdx, remDistUnits, arrived) {
      const stObj = stationStops[targetIdx] && stationStops[targetIdx].station;
      if (!stObj) return;
      currentTargetStationId = stObj.id;

      // Position & tint 3D Waypoint Light Pillar at the target station
      const [tx, , tz] = stObj.position;
      waypointBeaconGroup.position.set(tx, 0, tz);
      waypointBeaconGroup.visible = state.view !== "list" && state.view !== "media_hub";
      beamOuterMat.color.set(stObj.color);
      ringMat1.color.set(stObj.color);

      if (rppTextEl) {
        rppTextEl.textContent = arrived
          ? `📍 已抵達：第 ${targetIdx + 1} 站 — ${stObj.name}`
          : `🏃 正在前往：第 ${targetIdx + 1} 站 — ${stObj.name}`;
      }
      if (rppDistEl) {
        const meters = Math.max(1, Math.round(remDistUnits * 3.2));
        rppDistEl.textContent = arrived ? `（賞景導覽中）` : `（距離 ${meters}m）`;
      }
      rppDotBtns.forEach((btn, i) => {
        btn.classList.toggle("done", i < targetIdx);
        btn.classList.toggle("active", i === targetIdx && !arrived);
        btn.classList.toggle("arrived", i === targetIdx && arrived);
        if (i === targetIdx) {
          btn.style.setProperty("--dc", stObj.color);
        } else {
          btn.style.removeProperty("--dc");
        }
      });
    }

    // Helper to show/hide the Two-Stage Bottom Sheet (#runner-stop-card)
    const stopCardEl = document.getElementById("runner-stop-card");
    let currentCardStationId = null;
    let isWaitingForContinue = false;
    let nextStopIdx = 0;

    function setStopSheetStage(expanded) {
      isStopSheetExpanded = Boolean(expanded);
      if (stopCardEl) {
        stopCardEl.classList.toggle("stage-expanded", isStopSheetExpanded);
        stopCardEl.classList.toggle("stage-peek", !isStopSheetExpanded);
      }
      document.body.classList.toggle("has-stop-sheet-expanded", isStopSheetExpanded);
      if (activeStopInfo && activeStopInfo.station) {
        focusCameraOnStationFront(activeStopInfo.station);
      }
    }

    function resumeRunningToNextStation() {
      isWaitingForContinue = false;
      activeStopInfo = null;
      isStopSheetExpanded = false;
      stopArrivalTimer = 0;
      setSquadPausedState(false);
      hideRunnerStopHighlightCard();
      if (window.OWES_APP && window.OWES_APP.collapsePanelsForRunning) {
        window.OWES_APP.collapsePanelsForRunning(false);
      }
      if (runnerBadgeBtnEl) {
        runnerBadgeBtnEl.innerHTML = `🏃 我的慢跑分身（點擊陪跑）`;
      }
      nextStopIdx = (nextStopIdx + 1) % stationStops.length;
      if (!state.selected && state.view !== "train") {
        recomputeCameraGoal();
      }
    }

    // Compute station front camera with Mobile Distance Multiplier (1.35x~1.5x) & Screen-Space Target Y Offset
    // so the 3D station sits in the top 45% golden zone of portrait phones!
    function computeStationFrontCameraGoal(st, orbitAngle = 0) {
      const [sx, , sz] = st.position;
      const isMobile = window.innerWidth < 768;
      const distMult = isMobile ? 1.42 : 1.0; // 1.35~1.5x distance multiplier on mobile
      const baseDist = 13.8 * distMult;
      const camH = isMobile ? (isStopSheetExpanded ? 13.2 : 12.2) : 8.8;
      // Screen-Space Target Offset: shift lookAt Y downward on mobile so station rises into upper 45% of screen
      const lookY = isMobile ? (isStopSheetExpanded ? -1.85 : -0.95) : 0.95;
      const lookZOffset = isMobile ? 1.25 : 0.6;

      return {
        lookX: sx,
        lookY,
        lookZ: sz + lookZOffset,
        posX: sx + Math.sin(orbitAngle) * baseDist,
        posY: camH,
        posZ: sz + Math.cos(orbitAngle) * baseDist
      };
    }

    function focusCameraOnStationFront(st) {
      if (!st || state.view === "list" || state.view === "media_hub") return;
      userInteracting = false;
      cameraTransitioning = true;
      cameraTransitionTimer = 0;
      const goal = computeStationFrontCameraGoal(st, 0);
      camTargetLook.set(goal.lookX, goal.lookY, goal.lookZ);
      camTargetPos.set(goal.posX, goal.posY, goal.posZ);
    }

    function showRunnerStopHighlightCard(stopInfo) {
      if (!stopCardEl || !stopInfo || !stopInfo.station) return;
      const st = stopInfo.station;

      if (state.view === "list" || state.view === "media_hub") {
        stopCardEl.style.display = "none";
        return;
      }

      // First 1.2 seconds upon arrival: pure scenic appreciation mode before sliding up Stage 1 Peek Bar
      if (stopArrivalTimer < 1.2) {
        stopCardEl.style.display = "none";
        return;
      }

      if (currentCardStationId !== st.id) {
        currentCardStationId = st.id;
        isStopSheetExpanded = false;

        stopCardEl.style.setProperty("--c", st.color);
        stopCardEl.classList.remove("stage-expanded");
        stopCardEl.classList.add("stage-peek");
        document.body.classList.remove("has-stop-sheet-expanded");

        stopCardEl.innerHTML = `
          <!-- Lightweight Peek Bar (110px~130px, 80%+ screen unobstructed!) -->
          <div class="rsc-peek-bar">
            <div class="rsc-peek-info">
              <div class="rsc-icon">${st.icon}</div>
              <div class="rsc-peek-text">
                <div class="rsc-peek-title-row">
                  <span class="rsc-kicker">${st.code}</span>
                  <h4>${st.name}</h4>
                </div>
                <p class="rsc-tagline">${st.tagline}</p>
              </div>
            </div>
            <div class="rsc-peek-actions">
              <button class="rsc-continue-btn" id="rsc-continue-btn" type="button">🏃 繼續跑下一站 ▶</button>
            </div>
          </div>
        `;
        stopCardEl.style.display = "block";

        const contBtn = document.getElementById("rsc-continue-btn");
        if (contBtn) {
          contBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            resumeRunningToNextStation();
          });
        }
      } else {
        stopCardEl.style.display = "block";
      }
    }

    function hideRunnerStopHighlightCard() {
      currentCardStationId = null;
      isStopSheetExpanded = false;
      document.body.classList.remove("has-stop-sheet-expanded");
      if (stopCardEl) {
        stopCardEl.style.display = "none";
        stopCardEl.classList.remove("stage-expanded", "stage-peek");
      }
    }

    function setSquadPausedState(isPaused) {
      if (leadRunnerAvatarHolder && leadRunnerAvatarHolder.children[0]) {
        leadRunnerAvatarHolder.children[0].userData.pausedAtStation = isPaused;
      }
      companionRunners.forEach((comp) => {
        if (comp.children[0]) {
          comp.children[0].userData.pausedAtStation = isPaused;
        }
      });
    }

    // Start the runner 2.0 units before Station 01 (學校願景站) so it smoothly arrives at Station 01 first
    const RUNNER_SPEED = 1.42;
    runnerDist = (stationStops[0].dist - 2.0 + runnerCurveLength) % runnerCurveLength;

    // Initialize progress pill for Station 01 on boot
    updateRunProgressUI(0, 2.0, false);

    dynamicCallbacks.push((dt, elapsed) => {
      // Animate 3D Waypoint Light Pillar (breathing beam + expanding ring + spinning crystal)
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * 3.6);
      beamOuter.scale.set(0.92 + pulse * 0.22, 1, 0.92 + pulse * 0.22);
      beamOuterMat.opacity = 0.15 + pulse * 0.14;
      beamCoreMat.opacity = 0.32 + pulse * 0.22;
      const ringWave = (elapsed * 0.85) % 1;
      ringBase1.scale.setScalar(0.75 + ringWave * 1.45);
      ringMat1.opacity = 0.78 * (1 - ringWave);
      topCrystal.rotation.y = elapsed * 2.2;
      topCrystal.position.y = 6.65 + Math.sin(elapsed * 3.2) * 0.24;

      const targetStop = stationStops[nextStopIdx];
      const remDist =
        (targetStop.dist - runnerDist + runnerCurveLength) % runnerCurveLength;

      if (state.animate) {
        if (isWaitingForContinue) {
          stopArrivalTimer += dt;
          updateRunProgressUI(nextStopIdx, 0, true);
          showRunnerStopHighlightCard(activeStopInfo);
        } else {
          const stepDist = dt * RUNNER_SPEED;

          if (remDist <= stepDist || remDist > runnerCurveLength - 0.05) {
            // Arrived at station stop! Enter 1.2s scenic appreciation mode first, then slide up Stage 1 Peek Bar
            runnerDist = targetStop.dist;
            isWaitingForContinue = true;
            activeStopInfo = targetStop;
            stopArrivalTimer = 0;
            stopOrbitClock = 0;
            isStopSheetExpanded = false;
            setSquadPausedState(true);
            if (window.OWES_APP && window.OWES_APP.collapsePanelsForRunning) {
              window.OWES_APP.collapsePanelsForRunning(true);
            }
            focusCameraOnStationFront(targetStop.station);
            updateRunProgressUI(nextStopIdx, 0, true);
            showRunnerStopHighlightCard(activeStopInfo);
            if (runnerBadgeBtnEl && targetStop.station) {
              runnerBadgeBtnEl.innerHTML = `📍 已抵達「${targetStop.station.short}」（點擊繼續跑）`;
            }
          } else {
            runnerDist = (runnerDist + stepDist) % runnerCurveLength;
            updateRunProgressUI(nextStopIdx, remDist - stepDist, false);
          }
        }
      } else {
        updateRunProgressUI(nextStopIdx, isWaitingForContinue ? 0 : remDist, isWaitingForContinue);
      }

      const placeByArcDist = (obj, backDist, lateralOffset = 0) => {
        const d = (runnerDist - backDist + runnerCurveLength) % runnerCurveLength;
        const u = d / runnerCurveLength;
        const pt = runnerCurve.getPointAt(u);
        const tan = runnerCurve.getTangentAt(u);
        const sideX = -tan.z * lateralOffset;
        const sideZ = tan.x * lateralOffset;
        obj.position.set(pt.x + sideX, pt.y, pt.z + sideZ);

        if (activeStopInfo) {
          // Face directly toward the user / camera when stopped at a station (跑到定點後將視角面對使用者)
          obj.rotation.y = Math.atan2(
            camera.position.x - obj.position.x,
            camera.position.z - obj.position.z
          );
        } else {
          obj.rotation.y = Math.atan2(tan.x, tan.z);
        }
      };

      placeByArcDist(leadRunnerGroup, 0, 0);
      companionRunners.forEach((comp) => {
        placeByArcDist(comp, comp.userData.distBack, comp.userData.side);
      });
    });
  }

  // Build Flock of White Egrets Flying Gracefully Over the Carrot Fields & Campus (有白鷺鷥飛過)
  function buildFlyingWhiteEgrets() {
    const egretLoop1 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-34, 8.5, 22),
        new THREE.Vector3(-26, 9.8, -14),
        new THREE.Vector3(0, 11.2, -28),
        new THREE.Vector3(28, 9.5, -12),
        new THREE.Vector3(32, 8.2, 20),
        new THREE.Vector3(0, 9.0, 28)
      ],
      true,
      "centripetal",
      0.5
    );
    const len1 = egretLoop1.getLength();

    const egretLoop2 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(26, 7.2, 24),
        new THREE.Vector3(-18, 8.8, 25),
        new THREE.Vector3(-32, 7.8, 0),
        new THREE.Vector3(-18, 9.2, -25),
        new THREE.Vector3(22, 8.5, -24),
        new THREE.Vector3(34, 7.5, 2)
      ],
      true,
      "centripetal",
      0.5
    );
    const len2 = egretLoop2.getLength();

    // Spawn 12 graceful White Egrets across the two flight loops
    for (let i = 0; i < 12; i++) {
      const egret = createWhiteEgret(0.95 + (i % 3) * 0.12);
      const useLoop1 = i < 7;
      const curve = useLoop1 ? egretLoop1 : egretLoop2;
      const totalL = useLoop1 ? len1 : len2;
      const lateral = ((i % 3) - 1) * 1.4;
      const altOffset = (i % 4) * 0.55;
      let dist = ((i / (useLoop1 ? 7 : 5)) * totalL + i * 2.1) % totalL;
      const speed = 4.6 + (i % 3) * 0.35;
      let flapPhase = i * 1.4;

      scene.add(egret.group);

      dynamicCallbacks.push((dt) => {
        if (!state.animate) return;
        dist = (dist + dt * speed) % totalL;
        flapPhase += dt * 6.2;

        const u = dist / totalL;
        const pt = curve.getPointAt(u);
        const tan = curve.getTangentAt(u);
        const sideX = -tan.z * lateral;
        const sideZ = tan.x * lateral;

        const glideBob = Math.sin(flapPhase) * 0.14;
        egret.group.position.set(
          pt.x + sideX,
          pt.y + altOffset + glideBob,
          pt.z + sideZ
        );
        egret.group.rotation.y = Math.atan2(tan.x, tan.z);

        // Smooth articulated wing flapping
        const flap = Math.sin(flapPhase) * 0.58;
        const outerFlap = Math.sin(flapPhase - 0.45) * 0.48;
        egret.wingL.root.rotation.z = -flap;
        egret.wingL.outerPivot.rotation.z = -outerFlap;
        egret.wingR.root.rotation.z = flap;
        egret.wingR.outerPivot.rotation.z = outerFlap;
      });
    }
  }

  // Build Fluffy Clouds & Weather Rain System
  function buildSkyAndWeather() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.95,
      transparent: true,
      opacity: 0.88,
      flatShading: true
    });

    for (let i = 0; i < 10; i++) {
      const cg = new THREE.Group();
      const blobs = [
        [0, 0, 0, 1.5],
        [1.4, -0.25, 0.2, 1.05],
        [-1.3, -0.3, -0.1, 1.15],
        [0.4, 0.55, 0.1, 1.0]
      ];
      blobs.forEach(([bx, by, bz, br]) => {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(br, 1), cloudMat);
        m.position.set(bx, by, bz);
        cg.add(m);
      });
      const radius = 34 + (i % 4) * 7.5;
      const angle = (i / 10) * Math.PI * 2;
      const height = 15.5 + (i % 3) * 2.2;
      cg.userData = { radius, angle, height, speed: 0.006 + (i % 3) * 0.002 };
      scene.add(cg);
      cloudGroups.push(cg);
    }

    const dropCount = 900;
    const positions = new Float32Array(dropCount * 6);
    for (let i = 0; i < dropCount; i++) {
      const x = (Math.random() - 0.5) * 65;
      const y = Math.random() * 26;
      const z = (Math.random() - 0.5) * 65;
      positions.set([x, y, z, x + 0.05, y - 0.65, z], i * 6);
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const rainMat = new THREE.LineBasicMaterial({
      color: "#bae6fd",
      transparent: true,
      opacity: 0.55
    });
    rainSystem = new THREE.LineSegments(rainGeo, rainMat);
    rainSystem.visible = false;
    scene.add(rainSystem);

    dynamicCallbacks.push((dt, elapsed) => {
      cloudGroups.forEach((cg) => {
        const a = cg.userData.angle + elapsed * cg.userData.speed;
        cg.position.set(
          Math.cos(a) * cg.userData.radius,
          cg.userData.height,
          Math.sin(a) * cg.userData.radius
        );
      });

      const isRain = state.weatherKind === "rain" || state.weatherKind === "storm";
      rainSystem.visible = isRain;
      if (isRain) {
        const arr = rainSystem.geometry.attributes.position.array;
        for (let i = 0; i < dropCount; i++) {
          let y = arr[i * 6 + 1] - 18 * dt;
          if (y < 0) y += 26;
          arr[i * 6 + 1] = y;
          arr[i * 6 + 4] = y - 0.65;
        }
        rainSystem.geometry.attributes.position.needsUpdate = true;
      }
    });
  }

  // Lighting (Always Bright Daytime — 畫面固定呈現明亮白天)
  function resolveTimePhase() {
    return "day";
  }

  const palettes = {
    day: {
      bg: "#b8d0dc",
      fog: "#b8d0dc",
      sun: "#ffe8c2",
      hemiSky: "#c5dcf0",
      hemiGround: "#78593a",
      ground: "#6b9d47",
      turf: "#76ab50",
      sunI: 0.96,
      hemiI: 0.54,
      winGlow: 0.08
    }
  };

  function updateLighting(dt) {
    const phase = resolveTimePhase();
    const pal = palettes[phase] || palettes.day;
    const lerpFactor = Math.min(1, dt * 3);

    scene.background.lerp(new THREE.Color(pal.bg), lerpFactor);
    scene.fog.color.lerp(new THREE.Color(pal.fog), lerpFactor);
    sunLight.color.lerp(new THREE.Color(pal.sun), lerpFactor);
    hemiLight.color.lerp(new THREE.Color(pal.hemiSky), lerpFactor);
    hemiLight.groundColor.lerp(new THREE.Color(pal.hemiGround), lerpFactor);
    if (groundMat) groundMat.color.lerp(new THREE.Color(pal.ground), lerpFactor);
    if (campusTurfMat) campusTurfMat.color.lerp(new THREE.Color(pal.turf), lerpFactor);

    sunLight.intensity += (pal.sunI - sunLight.intensity) * lerpFactor;
    hemiLight.intensity += (pal.hemiI - hemiLight.intensity) * lerpFactor;
    litWindowMat.emissiveIntensity +=
      (pal.winGlow - litWindowMat.emissiveIntensity) * lerpFactor;
  }

  // Dynamic FOV Compensation for Mobile Portrait Screens (aspect < 1 自動放大垂直 FOV 補償水平視野)
  function updateCameraFovForAspect() {
    if (!camera) return;
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    const aspect = w / h;
    camera.aspect = aspect;
    if (w < 768 || aspect < 1) {
      camera.fov = Math.min(52, Math.max(38, 32 / Math.pow(Math.min(1, aspect), 0.46)));
    } else {
      camera.fov = 32;
    }
    camera.updateProjectionMatrix();
  }

  // Camera Target Computation (with Mobile 1.35x~1.5x Distance Multiplier & Screen-Space Target Y Offset)
  function recomputeCameraGoal() {
    userInteracting = false;
    cameraTransitioning = true;
    cameraTransitionTimer = 0;

    if (state.selected && state.view !== "list") {
      const st = window.OWES_DATA.stations.find((s) => s.id === state.selected);
      if (st) {
        const [x, , z] = st.position;
        const isMobile = window.innerWidth < 768;
        const distMult = isMobile ? 1.42 : 1.0;
        const offsetX = isMobile ? 0 : 1.4;
        // Screen-space target offset: shift lookAt Y downward on mobile so station sits in upper 45% golden zone
        camTargetLook.set(x + offsetX, isMobile ? -1.1 : 1.1, z + (isMobile ? 1.3 : 0.4));
        camTargetPos.set(x + offsetX + (isMobile ? 0 : 2.4), isMobile ? 13.0 : 10.8, z + 13.8 * distMult);
        return;
      }
    }

    if (state.view === "bird") {
      camTargetLook.set(0, 0.5, 0.0);
      camTargetPos.set(0, 52, 5.0);
    } else {
      const isMobile = window.innerWidth < 768;
      camTargetLook.set(0, isMobile ? -0.4 : 1.0, 1.0);
      camTargetPos.set(0, isMobile ? 42 : 30, isMobile ? 52 : 38);
    }
  }

  // Project 3D coordinates to 2D screen for Nameplates & Runner Badge
  function updateHtmlOverlays() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const tempV = new THREE.Vector3();

    labelElements.forEach((info, id) => {
      const show = state.showLabels && state.view !== "list";
      info.btn.classList.toggle("hidden", !show);
      info.btn.classList.toggle("on", state.selected === id || state.hovered === id);
      info.btn.classList.toggle("target-waypoint", id === currentTargetStationId);
      if (!show) return;

      tempV.copy(info.worldPos);
      tempV.project(camera);
      if (tempV.z > 1) {
        info.wrapper.style.display = "none";
      } else {
        info.wrapper.style.display = "block";
        const x = (tempV.x * 0.5 + 0.5) * w;
        const y = (-tempV.y * 0.5 + 0.5) * h;
        info.wrapper.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
    });

    if (runnerBadgeEl && leadRunnerGroup) {
      if (state.view === "list" || !state.showLabels) {
        runnerBadgeEl.style.display = "none";
      } else {
        tempV.copy(leadRunnerGroup.position);
        tempV.y += 1.65;
        tempV.project(camera);
        if (tempV.z > 1) {
          runnerBadgeEl.style.display = "none";
        } else {
          runnerBadgeEl.style.display = "block";
          const x = (tempV.x * 0.5 + 0.5) * w;
          const y = (-tempV.y * 0.5 + 0.5) * h;
          runnerBadgeEl.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        }
      }
    }
  }

  function setHovered(id) {
    state.hovered = id;
    document.body.style.cursor = id ? "pointer" : "";
  }

  function onPointerMove(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactiveMeshes, false);
    if (hits.length > 0) {
      const data = hits[0].object.userData;
      if (data.type === "station") {
        setHovered(data.stationId);
      } else {
        document.body.style.cursor = "pointer";
      }
    } else {
      setHovered(null);
    }
  }

  function onPointerDown(e) {
    pointerDownPos.set(e.clientX, e.clientY);
  }

  function onPointerUp(e) {
    const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
    if (moveDist > 6) return;

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactiveMeshes, false);
    if (hits.length > 0) {
      const hitObj = hits[0].object;
      const data = hitObj.userData;
      if (data.type === "train") {
        if (window.OWES_APP) window.OWES_APP.toggleTrainView();
        return;
      }
      if (data.type === "station") {
        if (window.OWES_APP) window.OWES_APP.selectStation(data.stationId);
        return;
      }
    }
  }

  // Initialize Three.js Scene
  function init(container) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#b8d0dc");
    scene.fog = new THREE.Fog("#b8d0dc", 68, 185);

    camera = new THREE.PerspectiveCamera(
      32,
      window.innerWidth / window.innerHeight,
      1.5,
      210
    );
    camera.position.set(0, 32, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 8;
    controls.maxDistance = 95;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.target.set(0, 1.0, 1.0);

    controls.addEventListener("start", () => {
      userInteracting = true;
      cameraTransitioning = false;
      if (state.view === "train" && window.OWES_APP) {
        window.OWES_APP.exitTrainFollowOnDrag();
      }
    });

    hemiLight = new THREE.HemisphereLight("#c5dcf0", "#78593a", 0.54);
    scene.add(hemiLight);

    sunLight = new THREE.DirectionalLight("#ffe8c2", 0.96);
    sunLight.position.set(-28, 42, 26);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -36;
    sunLight.shadow.camera.right = 36;
    sunLight.shadow.camera.top = 36;
    sunLight.shadow.camera.bottom = -36;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 110;
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.normalBias = 0.025;
    scene.add(sunLight);

    // Build Grounded Campus + Outer Carrot Fields + 8 Stations + Jogging Squad + Flying White Egrets
    buildCampusAndCarrotCountryside();
    buildStations();
    buildCampusRunnerTour();
    buildFlyingWhiteEgrets();
    buildSkyAndWeather();

    updateCameraFovForAspect();
    recomputeCameraGoal();

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    window.addEventListener("resize", () => {
      updateCameraFovForAspect();
      renderer.setSize(window.innerWidth, window.innerHeight);
      recomputeCameraGoal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.target.closest && e.target.closest("input, textarea")) return;
      const step = 1.6;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        userInteracting = true;
        camera.position.x -= step;
        controls.target.x -= step;
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        userInteracting = true;
        camera.position.x += step;
        controls.target.x += step;
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        userInteracting = true;
        camera.position.z -= step;
        controls.target.z -= step;
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        userInteracting = true;
        camera.position.z += step;
        controls.target.z += step;
      }
    });

    // Render Loop
    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      dynamicCallbacks.forEach((fn) => fn(dt, elapsed));
      updateLighting(dt);

      // 1. Station Arrival Camera: Upper-45% Golden Framing + Gentle Orbit (±15° sine wave sway)
      if (activeStopInfo && activeStopInfo.station && !state.selected && state.view !== "bird" && !userInteracting) {
        stopOrbitClock += dt;
        const maxOrbitRad = (15 * Math.PI) / 180; // ±15° Gentle Orbit
        const orbitAngle = Math.sin(stopOrbitClock * 0.55) * maxOrbitRad;
        const [sx, , sz] = activeStopInfo.station.position;
        const isMobile = window.innerWidth < 768;
        const distMult = isMobile ? 1.42 : 1.0; // 1.35~1.5x mobile distance multiplier
        const baseDist = 13.8 * distMult;
        const camH = isMobile ? (isStopSheetExpanded ? 13.2 : 12.2) : 8.8;
        const lookY = isMobile ? (isStopSheetExpanded ? -1.85 : -0.95) : 0.95;
        const lookZOff = isMobile ? 1.25 : 0.6;

        camTargetLook.set(sx, lookY, sz + lookZOff);
        camTargetPos.set(
          sx + Math.sin(orbitAngle) * baseDist,
          camH,
          sz + Math.cos(orbitAngle) * baseDist
        );
        camera.position.lerp(camTargetPos, Math.min(1, dt * 3.6));
        currentLook.lerp(camTargetLook, Math.min(1, dt * 4.5));
        controls.target.copy(currentLook);
      } else if (state.view === "train" && leadRunnerGroup && !state.selected) {
        // 2. Runner-Follow Look-Ahead Camera (35% interpolation between runner & target station + elevated pitch)
        const targetSt = window.OWES_DATA.stations.find((s) => s.id === currentTargetStationId);
        const rPos = leadRunnerGroup.position;
        const [tx, , tz] = targetSt ? targetSt.position : [0, 0, 0];
        const isMobile = window.innerWidth < 768;

        // 35% Look-Ahead Offset between runner current position and destination station
        const lookAheadRatio = 0.36;
        const lookX = rPos.x + (tx - rPos.x) * lookAheadRatio;
        const lookZ = rPos.z + (tz - rPos.z) * lookAheadRatio;

        let dirX = lookX - rPos.x;
        let dirZ = lookZ - rPos.z;
        const dirLen = Math.hypot(dirX, dirZ);
        if (dirLen > 0.001) {
          dirX /= dirLen;
          dirZ /= dirLen;
        } else {
          const uNow = ((runnerDist % runnerCurveLength) + runnerCurveLength) % runnerCurveLength / runnerCurveLength;
          const tan = runnerCurve.getTangentAt(uNow);
          dirX = tan.x;
          dirZ = tan.z;
        }

        const backDist = isMobile ? 11.4 : 8.0;
        const camHeight = isMobile ? 9.6 : 6.6;
        // Elevated camera looking slightly downward at the 36% look-ahead point so runner is in lower frame & target station is in upper-mid frame
        camTargetLook.set(lookX, isMobile ? 0.55 : 1.0, lookZ);
        camTargetPos.set(
          rPos.x - dirX * backDist + (-dirZ * 1.35),
          camHeight,
          rPos.z - dirZ * backDist + (dirX * 1.35)
        );
        camera.position.lerp(camTargetPos, Math.min(1, dt * 3.6));
        currentLook.lerp(camTargetLook, Math.min(1, dt * 4.6));
        controls.target.copy(currentLook);
      } else if (!userInteracting && cameraTransitioning) {
        cameraTransitionTimer += dt;
        const k = Math.min(1, dt * 4.2);
        camera.position.lerp(camTargetPos, k);
        currentLook.lerp(camTargetLook, k);
        controls.target.copy(currentLook);
        if (
          camera.position.distanceTo(camTargetPos) < 0.08 &&
          controls.target.distanceTo(camTargetLook) < 0.08
        ) {
          cameraTransitioning = false;
        }
      } else {
        currentLook.copy(controls.target);
      }

      controls.update();
      updateHtmlOverlays();
      renderer.render(scene, camera);
    }
    animate();
  }

  return {
    init,
    state,
    setSelected(id) {
      state.selected = id;
      recomputeCameraGoal();
    },
    setView(v) {
      state.view = v;
      recomputeCameraGoal();
    },
    setShowLabels(v) {
      state.showLabels = v;
    },
    setShowLinks(v) {
      state.showLinks = v;
    },
    setAnimate(v) {
      state.animate = v;
    },
    setTimeMode() {
      state.timeMode = "day";
    },
    setWeather(kind, cloud) {
      state.weatherKind = kind || "clear";
      state.cloudCover = cloud ?? 25;
    },
    setAvatarConfig(cfg) {
      state.avatar = { ...state.avatar, ...cfg };
      rebuildUserAvatars();
    }
  };
})();
