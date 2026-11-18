// Interactive UI & State Controller for 漚汪國小探索園區
window.OWES_APP = (function () {
  const DATA = window.OWES_DATA;
  const SCENE = window.OWES_SCENE;

  const isCompactViewport = window.innerWidth <= 900;

  const uiState = {
    selected: null,
    activeTab: "intro", // 'intro' | 'deep' | 'media' | 'data' | 'honors'
    honorYearFilter: "all",
    honorSearch: "",
    mediaCatFilter: "all", // 'all' | 'agri' | 'pbl' | 'character' | 'arts' | 'charity' | 'campus'
    mediaSourceFilter: "all",
    mediaSearch: "",
    mediaScope: "station", // 'station' | 'all' (when inside a station panel)
    view: "panorama", // 'panorama' | 'bird' | 'train' | 'list' | 'media_hub'
    showLabels: true,
    showStationNav: !isCompactViewport, // Left sliding station list
    animate: true,
    timeMode: "day",
    tour: null,
    showAvatarCard: !isCompactViewport,
    avatar: {
      shirt: "#f97316",
      shirtName: "活力橘",
      pants: "#1e293b",
      hat: "headband",
      hatName: "🏃 運動頭帶",
      prop: "baton",
      propName: "🥢 接力棒"
    }
  };

  const AVATAR_SHIRTS = [
    { color: "#f97316", name: "活力橘", pants: "#1e293b" },
    { color: "#0ea5e9", name: "晴空藍", pants: "#1e3a8a" },
    { color: "#ec4899", name: "櫻花粉", pants: "#334155" },
    { color: "#10b981", name: "翠葉綠", pants: "#1e293b" },
    { color: "#eab308", name: "陽光黃", pants: "#1e293b" },
    { color: "#8b5cf6", name: "紫羅蘭", pants: "#1e1b4b" }
  ];

  const AVATAR_HATS = [
    { id: "headband", label: "🏃 運動頭帶" },
    { id: "cap", label: "🧢 活力球帽" },
    { id: "straw", label: "👒 田園草帽" },
    { id: "none", label: "✨ 無頭飾" }
  ];

  const AVATAR_PROPS = [
    { id: "baton", label: "🥢 接力棒" },
    { id: "badminton", label: "🏸 羽球拍" },
    { id: "book", label: "📖 說書繪本" },
    { id: "drumsticks", label: "🥁 太鼓棒" },
    { id: "accordion", label: "🪗 手風琴" },
    { id: "trophy", label: "🏆 榮耀金盃" },
    { id: "camera", label: "📷 小記者相機" },
    { id: "none", label: "🙌 活力雙手" }
  ];

  const stationMap = Object.fromEntries(DATA.stations.map((s) => [s.id, s]));
  const stationIds = DATA.stations.map((s) => s.id);
  const mediaCatMap = Object.fromEntries(
    (DATA.mediaCategories || []).map((c) => [c.id, c])
  );

  // Toast helper
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.style.display = "none";
    }, 2600);
  }

  // Lightbox Photo Viewer
  function openLightbox(imgSrc, fallbackSrc, title, desc) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const tEl = document.getElementById("lightbox-title");
    const dEl = document.getElementById("lightbox-desc");
    if (!lb || !img) return;
    img.onerror = () => {
      if (fallbackSrc && img.src !== fallbackSrc) img.src = fallbackSrc;
    };
    img.src = imgSrc;
    tEl.textContent = title || "";
    dEl.textContent = desc || "";
    lb.style.display = "grid";
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.style.display = "none";
  }

  // Top-center quote bar removed per user request
  function renderQuote() {}

  // Left Slide-Out Station List (左側八大特色車站導覽清單)
  function renderStationNav() {
    const navEl = document.getElementById("station-nav");
    const openBtn = document.getElementById("station-nav-open-btn");
    const listEl = document.getElementById("station-nav-list");
    if (!navEl || !listEl) return;

    const inOverlayMode = uiState.view === "list" || uiState.view === "media_hub";
    document.body.classList.toggle("has-station-nav-open", !inOverlayMode && uiState.showStationNav);
    if (inOverlayMode) {
      navEl.classList.add("collapsed");
      if (openBtn) openBtn.style.display = "none";
      return;
    }

    navEl.classList.toggle("collapsed", !uiState.showStationNav);
    if (openBtn) {
      openBtn.style.display = uiState.showStationNav ? "none" : "inline-flex";
    }

    listEl.innerHTML = DATA.stations
      .map((st, idx) => {
        const isSelected = uiState.selected === st.id;
        const num = String(idx + 1).padStart(2, "0");
        return `
        <li>
          <button class="st-nav-item ${isSelected ? "on" : ""}" style="--c:${st.color}" data-station="${st.id}">
            <span class="st-nav-icon">${st.icon}</span>
            <div class="st-nav-text">
              <div class="st-nav-top">
                <span class="st-nav-num">${num}</span>
                <strong>${st.name}</strong>
                <em class="st-nav-kind">${st.kind}</em>
              </div>
              <span class="st-nav-sub">${st.tagline}</span>
            </div>
            <span class="st-nav-arrow">›</span>
          </button>
        </li>
      `;
      })
      .join("");

    listEl.querySelectorAll("button[data-station]").forEach((btn) => {
      const stId = btn.getAttribute("data-station");
      btn.addEventListener("click", () => {
        selectStation(stId);
      });
      btn.addEventListener("mouseenter", () => {
        SCENE.state.hovered = stId;
      });
      btn.addEventListener("mouseleave", () => {
        if (SCENE.state.hovered === stId) SCENE.state.hovered = null;
      });
    });

    // Render 3 Campus Diorama Thumbnails in Left Sidebar
    const modelsStripEl = document.getElementById("campus-models-strip");
    if (modelsStripEl && DATA.campusModels) {
      modelsStripEl.innerHTML = `
        <div class="cm-strip-head">
          <span>🏫 校園三區立體模型圖鑑</span>
          <small>點擊放大 / 飛往該區</small>
        </div>
        <div class="cm-strip-grid">
          ${DATA.campusModels
            .map(
              (cm, idx) => `
            <div class="cm-thumb-card ${uiState.selected === cm.stationId ? "on" : ""}" data-cm-idx="${idx}">
              <div class="cm-thumb-img">
                <img src="${cm.img}" alt="${cm.title}" loading="lazy" />
                <span class="cm-zoom-hint">🔍</span>
              </div>
              <div class="cm-thumb-info">
                <b>${cm.shortTitle}</b>
                <button class="cm-fly-btn" data-cm-fly="${cm.stationId}" title="飛往對應 3D 車站">📍 飛往</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      modelsStripEl.querySelectorAll(".cm-thumb-img").forEach((imgBox) => {
        imgBox.addEventListener("click", (e) => {
          e.stopPropagation();
          const card = imgBox.closest(".cm-thumb-card");
          const idx = Number(card.getAttribute("data-cm-idx"));
          const cm = DATA.campusModels[idx];
          if (cm) {
            selectStation(cm.stationId, "intro");
            openLightbox(cm.img, cm.img, cm.title, cm.desc);
          }
        });
      });

      modelsStripEl.querySelectorAll("button[data-cm-fly], .cm-thumb-info b").forEach((el) => {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const card = el.closest(".cm-thumb-card");
          const idx = Number(card.getAttribute("data-cm-idx"));
          const cm = DATA.campusModels[idx];
          if (cm) selectStation(cm.stationId, "intro");
        });
      });
    }
  }

  // Honor Roll Ticker removed per user request (漚汪榮譽榜不用顯示在右上方連續播放)
  function renderHonorRoll() {}

  // Jogger Avatar Outfit Customizer Card (選擇慢跑分身裝扮)
  function buildAvatarSelectorMarkup(prefix = "av") {
    const cur = uiState.avatar;
    return `
      <div class="av-sec">
        <label>👕 運動服色系</label>
        <div class="av-swatches">
          ${AVATAR_SHIRTS.map(
            (s) => `
            <button class="av-swatch ${cur.shirt === s.color ? "on" : ""}" style="--sc:${s.color}" data-${prefix}-shirt="${s.color}" title="${s.name}">
              <span>${s.name}</span>
            </button>
          `
          ).join("")}
        </div>
      </div>
      <div class="av-sec">
        <label>🧢 頭飾配件</label>
        <div class="av-pills">
          ${AVATAR_HATS.map(
            (h) => `
            <button class="av-pill ${cur.hat === h.id ? "on" : ""}" data-${prefix}-hat="${h.id}">
              ${h.label}
            </button>
          `
          ).join("")}
        </div>
      </div>
      <div class="av-sec">
        <label>🎒 隨身道具</label>
        <div class="av-pills">
          ${AVATAR_PROPS.map(
            (p) => `
            <button class="av-pill ${cur.prop === p.id ? "on" : ""}" data-${prefix}-prop="${p.id}">
              ${p.label}
            </button>
          `
          ).join("")}
        </div>
      </div>
    `;
  }

  function bindAvatarSelectorEvents(container, prefix = "av") {
    if (!container) return;
    container.querySelectorAll(`button[data-${prefix}-shirt]`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const col = btn.getAttribute(`data-${prefix}-shirt`);
        const found = AVATAR_SHIRTS.find((s) => s.color === col);
        if (found) {
          uiState.avatar.shirt = found.color;
          uiState.avatar.shirtName = found.name;
          uiState.avatar.pants = found.pants;
          if (SCENE.setAvatarConfig) SCENE.setAvatarConfig(uiState.avatar);
          renderGuideCard();
          showToast(`👕 慢跑分身已換上「${found.name}」運動服！`);
        }
      });
    });

    container.querySelectorAll(`button[data-${prefix}-hat]`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const hatId = btn.getAttribute(`data-${prefix}-hat`);
        const found = AVATAR_HATS.find((h) => h.id === hatId);
        if (found) {
          uiState.avatar.hat = found.id;
          uiState.avatar.hatName = found.label;
          if (SCENE.setAvatarConfig) SCENE.setAvatarConfig(uiState.avatar);
          renderGuideCard();
          showToast(`🧢 慢跑分身已配戴「${found.label}」！`);
        }
      });
    });

    container.querySelectorAll(`button[data-${prefix}-prop]`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const propId = btn.getAttribute(`data-${prefix}-prop`);
        const found = AVATAR_PROPS.find((p) => p.id === propId);
        if (found) {
          uiState.avatar.prop = found.id;
          uiState.avatar.propName = found.label;
          if (SCENE.setAvatarConfig) SCENE.setAvatarConfig(uiState.avatar);
          renderGuideCard();
          showToast(`🎒 慢跑分身已裝備「${found.label}」！`);
        }
      });
    });
  }

  function renderGuideCard() {
    const cardEl = document.getElementById("avatar-card");
    const openBtn = document.getElementById("avatar-open-btn");
    if (!cardEl) return;

    const inOverlay =
      uiState.view === "list" ||
      uiState.view === "media_hub" ||
      uiState.tour ||
      uiState.selected;

    document.body.classList.toggle("has-avatar-card", !inOverlay && uiState.showAvatarCard);

    if (inOverlay) {
      cardEl.style.display = "none";
      if (openBtn) openBtn.style.display = "none";
      return;
    }

    if (!uiState.showAvatarCard) {
      cardEl.style.display = "none";
      if (openBtn) openBtn.style.display = "inline-flex";
      return;
    }

    if (openBtn) openBtn.style.display = "none";
    cardEl.style.display = "block";
    cardEl.innerHTML = `
      <div class="av-head">
        <div class="av-title">
          <span class="av-badge" style="background:${uiState.avatar.shirt}">🏃</span>
          <div>
            <strong>我的慢跑分身裝扮</strong>
            <small>${uiState.avatar.shirtName}・${uiState.avatar.hatName}・${uiState.avatar.propName}</small>
          </div>
        </div>
        <button class="x" id="avatar-card-close-btn" title="收合裝扮面板">×</button>
      </div>
      ${buildAvatarSelectorMarkup("av")}
      <div class="av-actions">
        <button class="av-run-btn ${uiState.view === "train" ? "on" : ""}" id="avatar-follow-run-btn">
          ${uiState.view === "train" ? "🏃 正在陪跑中（點擊返回全景）" : "🏃 跟著慢跑分身逛校園"}
        </button>
      </div>
    `;

    bindAvatarSelectorEvents(cardEl, "av");

    const closeBtn = document.getElementById("avatar-card-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        uiState.showAvatarCard = false;
        renderGuideCard();
      });
    }

    const runBtn = document.getElementById("avatar-follow-run-btn");
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        toggleTrainView();
      });
    }
  }

  // Open Full-Screen Media Hub Overlay
  function openMediaHub(catId = "all") {
    if (uiState.tour) stopTour();
    uiState.selected = null;
    document.body.classList.remove("has-panel");
    uiState.mediaCatFilter = catId || "all";
    uiState.view = "media_hub";
    SCENE.setSelected(null);
    SCENE.setView("list"); // hides 3D labels cleanly while overlay is up
    renderPanel();
    renderListView();
    renderMediaHub();
    renderStationNav();
    renderHonorRoll();
    renderGuideCard();
    renderToolbar();
  }

  // Select Station & Render Right Slide-in Panel
  function selectStation(id, tab = "intro") {
    if (uiState.view === "media_hub" && id) {
      uiState.view = "panorama";
      SCENE.setView("panorama");
    }
    if (id && window.innerWidth <= 900) {
      uiState.showStationNav = false;
      uiState.showAvatarCard = false;
    }
    uiState.selected = id;
    uiState.activeTab = tab;
    uiState.mediaScope = id === "media" || id === "vision" ? "all" : "station";
    if (id && uiState.tour) {
      stopTour();
    }
    document.body.classList.toggle("has-panel", !!id);
    SCENE.setSelected(id);
    renderStationNav();
    renderHonorRoll();
    renderGuideCard();
    renderPanel();
    renderListView();
    renderMediaHub();
    renderToolbar();
  }

  // Helper: Render Media Article Card HTML
  function renderMediaArticleCard(art, showStationBtn = true) {
    const cat = mediaCatMap[art.category] || {
      name: "校園報導",
      short: "報導",
      icon: "📰",
      color: "#2563eb"
    };
    const st = stationMap[art.station];
    return `
      <article class="media-item-card" style="--mc:${cat.color}">
        <div class="media-item-meta">
          <span class="media-cat-badge" style="background:${cat.color}">${cat.icon} ${cat.short}</span>
          <span class="media-src-badge">${art.source}</span>
          ${art.featured ? `<span class="media-feat-badge">★ 焦點報導</span>` : ""}
        </div>
        <h5 class="media-item-title">
          <a href="${art.url}" target="_blank" rel="noopener noreferrer">${art.title}</a>
        </h5>
        <p class="media-item-sum">${art.summary}</p>
        <div class="media-item-foot">
          ${
            showStationBtn && st
              ? `<button class="media-st-jump" data-jump-station="${st.id}" style="--c:${st.color}">
                  ${st.icon} 對應車站：${st.short} ›
                </button>`
              : `<span></span>`
          }
          <a class="media-ext-link" href="${art.url}" target="_blank" rel="noopener noreferrer">
            閱讀原文 ↗
          </a>
        </div>
      </article>
    `;
  }

  function renderPanel() {
    const panelEl = document.getElementById("detail-panel");
    if (!panelEl) return;

    if (!uiState.selected) {
      panelEl.style.display = "none";
      return;
    }

    const st = stationMap[uiState.selected];
    if (!st) {
      panelEl.style.display = "none";
      return;
    }

    panelEl.style.display = "flex";
    panelEl.style.setProperty("--c", st.color);

    const curIdx = stationIds.indexOf(st.id);
    const prevId = stationIds[(curIdx - 1 + stationIds.length) % stationIds.length];
    const nextId = stationIds[(curIdx + 1) % stationIds.length];

    if (st.id !== "media" && uiState.activeTab !== "intro") {
      uiState.activeTab = "intro";
    }

    const tabs =
      st.id === "media"
        ? [
            ["intro", "特色總覽"],
            ["media", `📰 媒體報導 (${DATA.mediaArticles.length})`]
          ]
        : [["intro", "特色總覽"]];

    const renderMediaExplorerHtml = () => {
      const scopeArticles = DATA.mediaArticles;
      const q = uiState.mediaSearch.trim().toLowerCase();
      const filteredMedia = scopeArticles.filter((m) => {
        const matchCat =
          uiState.mediaCatFilter === "all" || m.category === uiState.mediaCatFilter;
        const matchSrc =
          uiState.mediaSourceFilter === "all" || m.source === uiState.mediaSourceFilter;
        const matchQ =
          !q ||
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.source.toLowerCase().includes(q);
        return matchCat && matchSrc && matchQ;
      });

      const sources = ["all", "中華日報", "臺灣時報", "自由時報", "國語日報", "聯合新聞網", "臺南市政府"];

      return `
        <div class="media-explorer-block">
          <div class="media-panel-top">
            <div>
              <h4 style="margin:0">漚汪國小媒體報導分類檢索（共 ${DATA.mediaArticles.length} 篇）</h4>
              <small style="color:var(--ink-2)">目前已篩選出 <b>${filteredMedia.length}</b> 篇新聞報導</small>
            </div>
            <button class="media-expand-btn" id="panel-open-media-hub">🗂️ 全頁大圖看板 ›</button>
          </div>

          <h4>依六大主題分類篩選</h4>
          <div class="media-cat-pills">
            ${DATA.mediaCategories
              .map((cat) => {
                const cnt =
                  cat.id === "all"
                    ? scopeArticles.length
                    : scopeArticles.filter((m) => m.category === cat.id).length;
                if (cnt === 0 && cat.id !== "all") return "";
                return `
                  <button class="media-cat-pill ${uiState.mediaCatFilter === cat.id ? "on" : ""}" style="--mc:${cat.color}" data-mcat="${cat.id}">
                    <span>${cat.icon} ${cat.short}</span>
                    <em>${cnt}</em>
                  </button>
                `;
              })
              .join("")}
          </div>

          <h4>依新聞媒體與關鍵字篩選</h4>
          <div class="media-src-pills">
            ${sources
              .map(
                (src) => `
              <button class="media-src-pill ${uiState.mediaSourceFilter === src ? "on" : ""}" data-msrc="${src}">
                ${src === "all" ? "全部媒體" : src}
              </button>
            `
              )
              .join("")}
          </div>

          <input class="search" id="media-search-input" placeholder="搜尋新聞關鍵字（如：拔蘿蔔、炫勇說書人、文衡殿、110校慶、戴榮吉…）" value="${uiState.mediaSearch}" />

          <div class="media-cards-stack">
            ${
              filteredMedia.length > 0
                ? filteredMedia.map((art) => renderMediaArticleCard(art, true)).join("")
                : `<p class="para" style="text-align:center;padding:24px 0;color:var(--muted)">找不到符合條件的報導，請嘗試切換分類或清除關鍵字。</p>`
            }
          </div>
        </div>
      `;
    };

    let bodyHtml = "";

    if (uiState.activeTab === "intro") {
      const sceneCalloutHtml = st.sceneDesc
        ? `
        <div class="scene-callout">
          <span class="scene-callout-icon">🏃</span>
          <div>
            <strong>3D 校園微縮場景導覽</strong>
            <p>${st.sceneDesc}</p>
          </div>
        </div>
      `
        : "";

      const paragraphs = st.intro.map((p) => `<p class="para">${p}</p>`).join("");

      const matchedCampusModel = DATA.campusModels
        ? DATA.campusModels.find((cm) => cm.stationId === st.id)
        : null;

      const campusModelBannerHtml = matchedCampusModel
        ? `
        <div class="campus-model-hero" id="campus-model-hero-trigger">
          <div class="campus-model-hero-img">
            <img src="${matchedCampusModel.img}" alt="${matchedCampusModel.title}" />
            <span class="cm-hero-badge">${matchedCampusModel.badge}</span>
            <span class="cm-hero-zoom">🔍 點擊放大檢視模型</span>
          </div>
          <div class="campus-model-hero-body">
            <h5>🏫 ${matchedCampusModel.title}</h5>
            <p>${matchedCampusModel.desc}</p>
            <div class="deep-tags">
              ${matchedCampusModel.highlights.map((h) => `<span>✨ ${h}</span>`).join("")}
            </div>
          </div>
        </div>
      `
        : "";

      const visionImgHtml = st.visionImage
        ? `
        <h4>漚汪國小學校願景藍圖（點擊圖片可放大檢視）</h4>
        <div class="vision-img-wrap" id="vision-zoom-trigger">
          <img src="${st.visionImage}" onerror="this.src='${st.visionImageFallback}'" alt="漚汪國小學校願景圖" />
        </div>
      `
        : "";

      const cardsHtml =
        st.cards && st.cards.length > 0 && st.id !== "media"
          ? `
        <h4>主題實景剪影（點擊相片放大檢視）</h4>
        <div class="photo-cards">
          ${st.cards
            .map(
              (c, idx) => `
            <div class="photo-card" data-card-idx="${idx}">
              <div class="photo-card-img">
                <img src="${c.img}" onerror="this.src='${c.fallback}'" alt="${c.title}" loading="lazy" />
                <span class="photo-card-badge">${c.icon}</span>
              </div>
              <div class="photo-card-body">
                <b>${c.title}</b>
                <p>${c.desc}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : "";

      const featuresHtml =
        st.features && st.features.length && st.id !== "media"
          ? `
        <h4>本站重點特色一覽</h4>
        <ul class="features">
          ${st.features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
      `
          : "";

      const honorsForAchievementsStationHtml =
        st.id === "achievements"
          ? `
        <h4>111～114 學年度榮譽榜一覽</h4>
        <ul class="ranklist">
          ${DATA.honors
            .map(
              (h) => `
            <li>
              <span class="yr" style="background:${h.tagColor}">${h.year} 學年</span>
              <div>
                <b>${h.title}</b>
                <div style="font-size:12.5px;color:var(--ink-2);margin-top:2px">${h.detail}</div>
              </div>
            </li>
          `
            )
            .join("")}
        </ul>
      `
          : "";

      const inlineMediaForMediaStationHtml =
        st.id === "media" ? renderMediaExplorerHtml() : "";

      const actionBtnHtml =
        st.id === "media"
          ? `<button class="more-link" id="open-media-hub-bottom-btn">📰 開啟全頁「媒體報導六大分類總覽」›</button>`
          : st.extraLink
          ? `<a class="more-link" href="${st.extraLink.url.replace(/&/g, "&amp;")}" target="_blank" rel="noopener noreferrer">🔗 ${st.extraLink.label} ›</a>`
          : "";

      bodyHtml = `
        <section>
          ${sceneCalloutHtml}
          ${campusModelBannerHtml}
          <h4>理念與特色綜述</h4>
          ${paragraphs}
          ${inlineMediaForMediaStationHtml}
          ${visionImgHtml}
          ${honorsForAchievementsStationHtml}
          ${cardsHtml}
          ${featuresHtml}
          ${actionBtnHtml}
        </section>
      `;
    } else if (uiState.activeTab === "media" && st.id === "media") {
      bodyHtml = `
        <section>
          ${renderMediaExplorerHtml()}
        </section>
      `;
    }

    panelEl.innerHTML = `
      <header class="panel-head">
        <div class="panel-nav">
          <button id="panel-prev-btn" title="上一站">‹</button>
          <span class="kind">${st.code}・${st.kind}</span>
          <button id="panel-next-btn" title="下一站">›</button>
          <button class="x" id="panel-close-btn" title="關閉 (Esc)">×</button>
        </div>
        <h2>${st.icon} ${st.name}</h2>
        <p class="tagline">${st.tagline}</p>
        <div class="tabs" role="tablist">
          ${tabs
            .map(
              ([k, label]) => `
            <button role="tab" class="${uiState.activeTab === k ? "on" : ""}" data-tab="${k}">
              ${label}
            </button>
          `
            )
            .join("")}
        </div>
      </header>
      <div class="panel-body">
        ${bodyHtml}
      </div>
    `;

    // Bind events inside panel
    document.getElementById("panel-prev-btn").addEventListener("click", () => {
      selectStation(prevId, uiState.activeTab);
    });
    document.getElementById("panel-next-btn").addEventListener("click", () => {
      selectStation(nextId, uiState.activeTab);
    });
    document.getElementById("panel-close-btn").addEventListener("click", () => {
      selectStation(null);
    });

    panelEl.querySelectorAll("button[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiState.activeTab = btn.getAttribute("data-tab");
        renderPanel();
      });
    });

    const zoomVision = document.getElementById("vision-zoom-trigger");
    if (zoomVision) {
      zoomVision.addEventListener("click", () => {
        openLightbox(
          st.visionImage,
          st.visionImageFallback,
          "漚汪國小學校願景圖",
          st.tagline
        );
      });
    }

    const cmHeroTrigger = document.getElementById("campus-model-hero-trigger");
    if (cmHeroTrigger && DATA.campusModels) {
      cmHeroTrigger.addEventListener("click", () => {
        const cm = DATA.campusModels.find((m) => m.stationId === st.id);
        if (cm) openLightbox(cm.img, cm.img, cm.title, cm.desc);
      });
    }

    panelEl.querySelectorAll(".photo-card").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const idx = Number(cardEl.getAttribute("data-card-idx"));
        const c = st.cards[idx];
        if (c) openLightbox(c.img, c.fallback, c.title, c.desc);
      });
    });

    const openMediaHubBottomBtn = document.getElementById("open-media-hub-bottom-btn");
    if (openMediaHubBottomBtn) {
      openMediaHubBottomBtn.addEventListener("click", () => openMediaHub("all"));
    }

    const panelOpenMediaHub = document.getElementById("panel-open-media-hub");
    if (panelOpenMediaHub) {
      panelOpenMediaHub.addEventListener("click", () =>
        openMediaHub(uiState.mediaCatFilter)
      );
    }

    panelEl.querySelectorAll("button[data-mscope]").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiState.mediaScope = btn.getAttribute("data-mscope");
        renderPanel();
      });
    });

    panelEl.querySelectorAll("button[data-mcat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiState.mediaCatFilter = btn.getAttribute("data-mcat");
        renderPanel();
      });
    });

    panelEl.querySelectorAll("button[data-msrc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiState.mediaSourceFilter = btn.getAttribute("data-msrc");
        renderPanel();
      });
    });

    const mediaSearchInput = document.getElementById("media-search-input");
    if (mediaSearchInput) {
      if (uiState.mediaSearchFocused) {
        mediaSearchInput.focus();
        mediaSearchInput.setSelectionRange(
          mediaSearchInput.value.length,
          mediaSearchInput.value.length
        );
      }
      mediaSearchInput.addEventListener("focus", () => {
        uiState.mediaSearchFocused = true;
      });
      mediaSearchInput.addEventListener("blur", () => {
        uiState.mediaSearchFocused = false;
      });
      mediaSearchInput.addEventListener("input", (e) => {
        uiState.mediaSearchFocused = true;
        uiState.mediaSearch = e.target.value;
        renderPanel();
      });
    }

    panelEl.querySelectorAll("button[data-jump-station]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetSt = btn.getAttribute("data-jump-station");
        selectStation(targetSt, "intro");
      });
    });
  }

  // Full-Screen Categorized Media Hub Overlay (媒體報導分類整理專區)
  function renderMediaHub() {
    const hubEl = document.getElementById("media-hub");
    if (!hubEl) return;
    if (uiState.view !== "media_hub") {
      hubEl.style.display = "none";
      return;
    }
    hubEl.style.display = "block";

    const q = uiState.mediaSearch.trim().toLowerCase();
    const sources = [
      "all",
      "中華日報",
      "臺灣時報",
      "自由時報",
      "國語日報",
      "聯合新聞網",
      "中時新聞網",
      "ETtoday 新聞雲",
      "臺南市政府",
      "廣達文教基金會"
    ];

    const filteredArticles = DATA.mediaArticles.filter((m) => {
      const matchCat =
        uiState.mediaCatFilter === "all" || m.category === uiState.mediaCatFilter;
      const matchSrc =
        uiState.mediaSourceFilter === "all" || m.source === uiState.mediaSourceFilter;
      const matchQ =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.source.toLowerCase().includes(q);
      return matchCat && matchSrc && matchQ;
    });

    // Group by category when showing 'all' categories so structure is crystal clear
    const activeCategories =
      uiState.mediaCatFilter === "all"
        ? DATA.mediaCategories.filter((c) => c.id !== "all")
        : DATA.mediaCategories.filter((c) => c.id === uiState.mediaCatFilter);

    const groupedSectionsHtml = activeCategories
      .map((cat) => {
        const items = filteredArticles.filter((a) => a.category === cat.id);
        if (items.length === 0) return "";
        return `
        <div class="media-cat-section" style="--mc:${cat.color}">
          <div class="media-cat-sec-head">
            <span class="media-cat-sec-icon">${cat.icon}</span>
            <div>
              <h3>${cat.name} <span>（共 ${items.length} 篇報導）</span></h3>
              <p>${cat.desc}</p>
            </div>
          </div>
          <div class="media-hub-grid">
            ${items.map((art) => renderMediaArticleCard(art, true)).join("")}
          </div>
        </div>
      `;
      })
      .join("");

    hubEl.innerHTML = `
      <div class="media-hub-inner">
        <header class="media-hub-head">
          <div>
            <span class="eyebrow">OUWANG ELEMENTARY SCHOOL MEDIA ARCHIVE</span>
            <h2>📰 漚汪國小媒體報導・六大主題分類總覽</h2>
            <p>完整收錄並整理學校官網全部 4 頁、共 <b>${DATA.mediaArticles.length} 篇</b>平面報紙與網路新聞報導，點擊任一報導可閱讀重點摘要、開啟原文，或直接飛往對應的 3D 校園特色車站！</p>
          </div>
          <button class="media-hub-close" id="media-hub-close-btn">✕ 返回 3D 園區</button>
        </header>

        <!-- 6 Category Selector Cards -->
        <div class="media-hub-cats">
          ${DATA.mediaCategories
            .map((cat) => {
              const cnt =
                cat.id === "all"
                  ? DATA.mediaArticles.length
                  : DATA.mediaArticles.filter((m) => m.category === cat.id).length;
              return `
              <button class="media-hub-cat-card ${uiState.mediaCatFilter === cat.id ? "on" : ""}" style="--mc:${cat.color}" data-hub-cat="${cat.id}">
                <span class="mhc-icon">${cat.icon}</span>
                <div class="mhc-info">
                  <strong>${cat.short}</strong>
                  <small>${cnt} 篇報導</small>
                </div>
              </button>
            `;
            })
            .join("")}
        </div>

        <!-- Filter & Search Bar -->
        <div class="media-hub-toolbar">
          <div class="media-src-pills">
            ${sources
              .map(
                (src) => `
              <button class="media-src-pill ${uiState.mediaSourceFilter === src ? "on" : ""}" data-hub-src="${src}">
                ${src === "all" ? "全部媒體出處" : src}
              </button>
            `
              )
              .join("")}
          </div>
          <div class="media-hub-search-wrap">
            <input class="search" id="hub-media-search" placeholder="🔎 搜尋新聞標題、關鍵字（如：拔蘿蔔、炫勇說書人、文衡殿、戴榮吉、110校慶…）" value="${uiState.mediaSearch}" />
            <span class="media-hub-count">顯示 ${filteredArticles.length} / ${DATA.mediaArticles.length} 篇</span>
          </div>
        </div>

        <!-- Categorized Sections -->
        <div class="media-hub-body">
          ${
            groupedSectionsHtml ||
            `<div class="media-empty">找不到符合條件的新聞報導，請點擊「全部報導」或清除搜尋關鍵字。</div>`
          }
        </div>
      </div>
    `;

    document.getElementById("media-hub-close-btn").addEventListener("click", () => {
      uiState.view = "panorama";
      SCENE.setView("panorama");
      renderMediaHub();
      renderStationNav();
      renderHonorRoll();
      renderGuideCard();
      renderToolbar();
    });

    hubEl.querySelectorAll("button[data-hub-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiState.mediaCatFilter = btn.getAttribute("data-hub-cat");
        renderMediaHub();
      });
    });

    hubEl.querySelectorAll("button[data-hub-src]").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiState.mediaSourceFilter = btn.getAttribute("data-hub-src");
        renderMediaHub();
      });
    });

    const hubSearch = document.getElementById("hub-media-search");
    if (hubSearch) {
      hubSearch.addEventListener("input", (e) => {
        uiState.mediaSearch = e.target.value;
        renderMediaHub();
        const inputAfter = document.getElementById("hub-media-search");
        if (inputAfter) {
          inputAfter.focus();
          inputAfter.setSelectionRange(inputAfter.value.length, inputAfter.value.length);
        }
      });
    }

    hubEl.querySelectorAll("button[data-jump-station]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-jump-station");
        uiState.view = "panorama";
        SCENE.setView("panorama");
        selectStation(targetId, "intro");
      });
    });
  }

  // List View Overlay
  function renderListView() {
    const listEl = document.getElementById("list-view");
    if (!listEl) return;
    if (uiState.view !== "list") {
      listEl.style.display = "none";
      return;
    }
    listEl.style.display = "block";
    const grid = document.getElementById("list-cards-grid");
    grid.innerHTML = DATA.stations
      .map(
        (st) => `
      <button class="card ${uiState.selected === st.id ? "on" : ""}" style="--c:${st.color}" data-st="${st.id}">
        <span class="card-kind">${st.code}・${st.kind}</span>
        <b>${st.icon} ${st.name}</b>
        <span class="card-tag">${st.tagline}</span>
        <span class="card-stat">包含 ${st.deepDive ? st.deepDive.length : 3} 大深度專題・${st.cards.length || 4} 項實景剪影 ›</span>
      </button>
    `
      )
      .join("");

    grid.querySelectorAll("button[data-st]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectStation(btn.getAttribute("data-st"));
      });
    });
  }

  // Tour & Quiz removed per user request (不用慢跑導覽、不用特色測驗)
  function stopTour() {
    uiState.tour = null;
  }

  function renderQuiz() {}

  // Bottom Toolbar (只保留核心視角、站名、播放，精簡響應式排版)
  function renderToolbar() {
    const bar = document.getElementById("bottom-toolbar");
    if (!bar) return;

    bar.innerHTML = `
      <div class="seg">
        <button class="tb ${uiState.view === "panorama" && !uiState.selected ? "on" : ""}" data-view="panorama" title="斜角全景">全景</button>
        <button class="tb ${uiState.view === "bird" ? "on" : ""}" data-view="bird" title="高空鳥瞰校園跑道與前庭為三合院校舍">鳥瞰</button>
        <button class="tb ${uiState.view === "train" ? "on" : ""}" data-view="train" title="跟隨活力跑者慢跑穿梭校園各站">🏃 陪跑視角</button>
        <button class="tb ${uiState.view === "list" ? "on" : ""}" data-view="list" title="全頁卡片清單">全頁清單</button>
      </div>
      <div class="seg">
        <button class="tb ${uiState.showLabels ? "on" : ""}" id="tb-labels" title="顯示站點名稱">站名</button>
        <button class="tb ${!uiState.animate ? "on" : ""}" id="tb-anim" title="暫停或播放人物運動與動畫">${uiState.animate ? "暫停" : "播放"}</button>
      </div>
    `;

    bar.querySelectorAll("button[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-view");
        if (uiState.tour) stopTour();
        if (v !== "list") {
          uiState.selected = null;
          document.body.classList.remove("has-panel");
          SCENE.setSelected(null);
        }
        uiState.view = v;
        SCENE.setView(v);
        if (v === "train") {
          uiState.showStationNav = false;
          if (window.innerWidth <= 900) {
            uiState.showAvatarCard = false;
          }
          showToast("🏃 已切換為「陪跑視角」，跟著漚汪小跑者慢跑運動逛校園各站！");
        }
        renderPanel();
        renderListView();
        renderMediaHub();
        renderStationNav();
        renderHonorRoll();
        renderGuideCard();
        renderToolbar();
      });
    });

    document.getElementById("tb-labels").addEventListener("click", () => {
      uiState.showLabels = !uiState.showLabels;
      SCENE.setShowLabels(uiState.showLabels);
      renderToolbar();
    });

    document.getElementById("tb-anim").addEventListener("click", () => {
      uiState.animate = !uiState.animate;
      SCENE.setAnimate(uiState.animate);
      renderToolbar();
    });
  }

  function toggleTrainView() {
    if (uiState.tour) stopTour();
    uiState.selected = null;
    document.body.classList.remove("has-panel");
    SCENE.setSelected(null);
    uiState.view = uiState.view === "train" ? "panorama" : "train";
    if (uiState.view === "train") {
      uiState.showStationNav = false;
      if (window.innerWidth <= 900) {
        uiState.showAvatarCard = false;
      }
    }
    SCENE.setView(uiState.view);
    showToast(
      uiState.view === "train"
        ? "🏃 開啟陪跑視角！跟著漚汪活力小跑者慢跑穿梭校園與八大特色站點"
        : "已返回校園全景視角"
    );
    renderPanel();
    renderMediaHub();
    renderStationNav();
    renderHonorRoll();
    renderGuideCard();
    renderToolbar();
  }

  // Auto-collapse sidebars and detail drawers during running / station arrival so 100% of screen belongs to 3D view
  function collapsePanelsForRunning(isArrival = false) {
    if (!isArrival && uiState.selected) {
      uiState.selected = null;
      document.body.classList.remove("has-panel");
      SCENE.setSelected(null);
      renderPanel();
    }
    if (!isArrival || window.innerWidth <= 900 || uiState.view === "train") {
      uiState.showStationNav = false;
    }
    if (window.innerWidth <= 900) {
      uiState.showAvatarCard = false;
    }
    renderStationNav();
    renderGuideCard();
    renderToolbar();
  }

  function exitTrainFollowOnDrag() {
    if (uiState.view === "train") {
      uiState.view = "panorama";
      SCENE.state.view = "panorama";
      renderToolbar();
    }
  }

  // Intro Loading Sequence
  function runIntroLoader() {
    const introEl = document.getElementById("intro-screen");
    const barEl = document.getElementById("intro-bar-fill");
    const stepEl = document.getElementById("intro-step-text");
    const skipBtn = document.getElementById("intro-skip-btn");
    const steps = [
      "鋪設標準 PU 環校跑道與綠茵大操場…",
      "築起正門、前庭為三合院校舍與孔子銅像圓環…",
      "升起太陽能光電球場、木屋沙坑與紅蘿蔔遊戲場…",
      "邀請活力跑者、說書人與多元社團學童熱身就位…",
      "鳴槍開跑！歡迎來到活力滿滿的漚汪國小！"
    ];

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      introEl.classList.add("leave");
      setTimeout(() => {
        introEl.style.display = "none";
      }, 650);
    };

    steps.forEach((txt, i) => {
      setTimeout(() => {
        if (finished) return;
        stepEl.textContent = `正在組合微縮校園・${txt}`;
        barEl.style.width = `${((i + 1) / steps.length) * 100}%`;
      }, i * 420);
    });

    setTimeout(finish, 2350);
    skipBtn.addEventListener("click", finish);
  }

  // Boot App
  function init() {
    SCENE.init(document.getElementById("stage-container"));
    if (SCENE.setAvatarConfig) {
      SCENE.setAvatarConfig(uiState.avatar);
    }

    const avatarOpenBtn = document.getElementById("avatar-open-btn");
    if (avatarOpenBtn) {
      avatarOpenBtn.addEventListener("click", () => {
        uiState.showAvatarCard = true;
        if (window.innerWidth <= 767 && uiState.showStationNav) {
          uiState.showStationNav = false;
          renderStationNav();
        }
        renderGuideCard();
      });
    }

    document.getElementById("brand-home-btn").addEventListener("click", () => {
      if (uiState.tour) stopTour();
      uiState.view = "panorama";
      SCENE.setView("panorama");
      selectStation(null);
    });

    // Left Station Nav toggle buttons
    const navCloseBtn = document.getElementById("station-nav-close-btn");
    if (navCloseBtn) {
      navCloseBtn.addEventListener("click", () => {
        uiState.showStationNav = false;
        renderStationNav();
        renderToolbar();
      });
    }

    const navOpenBtn = document.getElementById("station-nav-open-btn");
    if (navOpenBtn) {
      navOpenBtn.addEventListener("click", () => {
        uiState.showStationNav = true;
        if (window.innerWidth <= 767 && uiState.showAvatarCard) {
          uiState.showAvatarCard = false;
          renderGuideCard();
        }
        renderStationNav();
        renderToolbar();
      });
    }

    const navHomeBtn = document.getElementById("station-nav-home-btn");
    if (navHomeBtn) {
      navHomeBtn.addEventListener("click", () => {
        if (uiState.tour) stopTour();
        uiState.view = "panorama";
        SCENE.setView("panorama");
        selectStation(null);
      });
    }

    const navTrainBtn = document.getElementById("station-nav-train-btn");
    if (navTrainBtn) {
      navTrainBtn.addEventListener("click", () => {
        toggleTrainView();
      });
    }

    const navMediaBtn = document.getElementById("station-nav-media-btn");
    if (navMediaBtn) {
      navMediaBtn.addEventListener("click", () => {
        openMediaHub("all");
      });
    }

    const listBackBtn = document.getElementById("list-view-back-btn");
    if (listBackBtn) {
      listBackBtn.addEventListener("click", () => {
        uiState.view = "panorama";
        SCENE.setView("panorama");
        renderListView();
        renderStationNav();
        renderHonorRoll();
        renderGuideCard();
        renderToolbar();
      });
    }

    document.getElementById("lightbox-close-btn").addEventListener("click", closeLightbox);
    document.getElementById("lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLightbox();
        if (uiState.view === "media_hub" || uiState.view === "list") {
          uiState.view = "panorama";
          SCENE.setView("panorama");
          renderListView();
          renderMediaHub();
          renderStationNav();
          renderHonorRoll();
          renderGuideCard();
          renderToolbar();
        } else if (uiState.selected) {
          selectStation(null);
        }
      }
    });

    renderStationNav();
    renderHonorRoll();
    renderGuideCard();
    renderToolbar();
    runIntroLoader();
  }

  return {
    init,
    selectStation,
    openMediaHub,
    toggleTrainView,
    exitTrainFollowOnDrag,
    collapsePanelsForRunning,
    openPhotoLightbox: openLightbox
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  window.OWES_APP.init();
});
