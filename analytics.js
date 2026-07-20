(() => {
  const endpoint = document.querySelector('meta[name="shoryudo-analytics-endpoint"]')?.content?.replace(/\/$/, "");
  if (!endpoint || endpoint.includes("REPLACE_WITH_WORKER_URL")) return;

  const CONSENT_KEY = "shoryudo-analytics-consent";
  const VISITOR_KEY = "shoryudo-anonymous-visitor";
  const SESSION_KEY = "shoryudo-anonymous-session";
  const MAX_EVENTS_PER_PAGE = 240;
  let trackingStarted = false;
  let sentEvents = 0;
  let visitorId = "";
  let sessionId = "";
  let activeSection = "";
  let activeSectionStarted = 0;
  let pageStarted = Date.now();
  let builderTimer = 0;
  let visibleSections = new Map();
  let sectionObserver = null;
  let interactionTrackingBound = false;

  const readStorage = (storage, key) => {
    try {
      return storage.getItem(key) || "";
    } catch (_error) {
      return "";
    }
  };

  const writeStorage = (storage, key, value) => {
    try {
      storage.setItem(key, value);
      return true;
    } catch (_error) {
      return false;
    }
  };

  const removeStorage = (storage, key) => {
    try {
      storage.removeItem(key);
    } catch (_error) {
      // Storage can be unavailable in hardened browser modes.
    }
  };

  function randomId(prefix) {
    const id = crypto.randomUUID?.() || `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    return `${prefix}_${id.replace(/-/g, "")}`;
  }

  function getOrCreateId(storage, key, prefix) {
    const existing = readStorage(storage, key);
    if (/^[a-zA-Z0-9_-]{12,80}$/.test(existing)) return { id: existing, created: false };
    const id = randomId(prefix);
    writeStorage(storage, key, id);
    return { id, created: true };
  }

  function deviceType() {
    if (window.innerWidth < 700) return "mobile";
    if (window.innerWidth < 1050) return "tablet";
    return "desktop";
  }

  function referrerHost() {
    if (!document.referrer) return "";
    try {
      return new URL(document.referrer).hostname;
    } catch (_error) {
      return "";
    }
  }

  function eventPayload(eventName, detail = {}) {
    return {
      eventId: randomId("evt"),
      visitorId,
      sessionId,
      eventName,
      sectionId: detail.sectionId || "",
      targetId: detail.targetId || "",
      durationSeconds: detail.durationSeconds ?? null,
      metadata: detail.metadata || {},
      path: location.pathname,
      referrerHost: referrerHost(),
      deviceType: deviceType(),
      locale: navigator.language || "",
    };
  }

  function sendEvent(eventName, detail = {}, urgent = false) {
    if (!trackingStarted || sentEvents >= MAX_EVENTS_PER_PAGE) return;
    sentEvents += 1;
    const body = JSON.stringify(eventPayload(eventName, detail));

    if (urgent && navigator.sendBeacon) {
      const sent = navigator.sendBeacon(`${endpoint}/collect`, new Blob([body], { type: "text/plain" }));
      if (sent) return;
    }

    fetch(`${endpoint}/collect`, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      keepalive: urgent,
      headers: { "Content-Type": "text/plain" },
      body,
    }).catch(() => {
      // Analytics must never interrupt the travel guide.
    });
  }

  function endActiveSection(urgent = false) {
    if (!activeSection || !activeSectionStarted) return;
    const durationSeconds = Math.round((Date.now() - activeSectionStarted) / 1000);
    if (durationSeconds >= 2) {
      sendEvent("section_dwell", { sectionId: activeSection, durationSeconds }, urgent);
    }
    activeSectionStarted = 0;
  }

  function activateMostVisibleSection() {
    if (document.visibilityState === "hidden") return;
    let nextSection = "";
    let bestRatio = 0;
    visibleSections.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        nextSection = id;
      }
    });
    if (!nextSection || nextSection === activeSection) {
      if (nextSection && !activeSectionStarted) activeSectionStarted = Date.now();
      return;
    }
    endActiveSection();
    activeSection = nextSection;
    activeSectionStarted = Date.now();
    sendEvent("section_view", { sectionId: nextSection });
  }

  function initSectionTracking() {
    const sections = Array.from(document.querySelectorAll("main > section"));
    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id || entry.target.dataset.analyticsSection || "overview";
          if (entry.isIntersecting) visibleSections.set(sectionId, entry.intersectionRatio);
          else visibleSections.delete(sectionId);
        });
        activateMostVisibleSection();
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  function builderMetadata() {
    return {
      style: document.querySelector("#travelStyle")?.value || "",
      selected: Array.from(document.querySelectorAll("#builderChecks input:checked")).map((input) => input.value),
    };
  }

  function bindInteractionTracking() {
    if (interactionTrackingBound) return;
    interactionTrackingBound = true;

    document.addEventListener("click", (event) => {
      const target = event.target.closest("button, a, .map-pin");
      if (!target) return;

      if (target.matches(".route-section [data-mode]")) {
        sendEvent("route_mode", { targetId: target.dataset.mode });
        return;
      }
      if (target.matches(".map-pin")) {
        sendEvent("map_place", { targetId: target.dataset.id });
        return;
      }
      if (target.matches(".hotel-tabs [data-base]")) {
        sendEvent("hotel_filter", { targetId: target.dataset.base });
        return;
      }
      if (target.matches(".hotel-actions a")) {
        sendEvent("hotel_outbound", {
          targetId: target.dataset.hotel || "",
          metadata: { provider: target.dataset.provider || target.textContent.trim() },
        }, true);
        return;
      }
      if (target.id === "toggleBuilderDetails") {
        sendEvent("builder_details", { targetId: target.getAttribute("aria-expanded") === "true" ? "close" : "open" });
        return;
      }
      if (target.id === "copyBuilderLink") {
        sendEvent("share_link", { metadata: builderMetadata() });
        return;
      }
      if (target.id === "resetBuilder") {
        sendEvent("builder_reset");
        return;
      }
      if (target.matches("a[href^='#']")) {
        sendEvent("navigation", { targetId: target.getAttribute("href").slice(1) || "top" });
        return;
      }
      if (target.matches(".source-list a")) {
        let host = "";
        try {
          host = new URL(target.href).hostname;
        } catch (_error) {
          host = "";
        }
        sendEvent("external_link", { targetId: target.textContent.trim(), metadata: { host } }, true);
      }
    });

    document.addEventListener("change", (event) => {
      if (event.target.matches(".map-tools input")) {
        const enabled = Array.from(document.querySelectorAll(".map-tools input:checked")).map((input) => input.value);
        sendEvent("map_filter", { metadata: { enabled } });
      }

      if (event.target.matches("#builderChecks input, #travelStyle")) {
        window.clearTimeout(builderTimer);
        builderTimer = window.setTimeout(() => {
          sendEvent("route_generate", { metadata: builderMetadata() });
        }, 650);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") endActiveSection(true);
      else activateMostVisibleSection();
    });

    window.addEventListener("pagehide", () => {
      endActiveSection(true);
      sendEvent(
        "page_exit",
        { durationSeconds: Math.min(3600, Math.round((Date.now() - pageStarted) / 1000)) },
        true,
      );
    });
  }

  function startTracking(newlyGranted = false) {
    if (trackingStarted) return;
    const visitor = getOrCreateId(localStorage, VISITOR_KEY, "vis");
    const session = getOrCreateId(sessionStorage, SESSION_KEY, "ses");
    visitorId = visitor.id;
    sessionId = session.id;
    trackingStarted = true;
    pageStarted = Date.now();
    if (newlyGranted) sendEvent("consent_granted");
    if (session.created) sendEvent("session_start");
    sendEvent("page_view");
    initSectionTracking();
    bindInteractionTracking();
  }

  function stopTracking() {
    trackingStarted = false;
    sectionObserver?.disconnect();
    sectionObserver = null;
    visitorId = "";
    sessionId = "";
    activeSection = "";
    activeSectionStarted = 0;
    visibleSections = new Map();
  }

  function createPrivacyControls() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<button class="analytics-settings" id="analyticsSettings" type="button" aria-controls="analyticsConsent" aria-expanded="false">统计设置</button>
      <aside class="analytics-consent" id="analyticsConsent" aria-live="polite" aria-label="匿名访问统计设置">
        <div class="analytics-consent-copy">
          <strong>匿名浏览统计</strong>
          <p>允许后会记录浏览章节、停留时长、酒店跳转和路线选择。IP 仅保存脱敏网段与不可逆指纹，明细 30 天后自动删除，不记录姓名或联系方式。</p>
        </div>
        <div class="analytics-consent-actions">
          <button class="analytics-allow" id="analyticsAllow" type="button">允许匿名统计</button>
          <button class="analytics-decline" id="analyticsDecline" type="button">暂不统计</button>
        </div>
        <p class="analytics-consent-status" id="analyticsConsentStatus"></p>
      </aside>`,
    );

    const panel = document.querySelector("#analyticsConsent");
    const settings = document.querySelector("#analyticsSettings");
    const status = document.querySelector("#analyticsConsentStatus");
    const decline = document.querySelector("#analyticsDecline");

    function setPanel(open) {
      panel.classList.toggle("open", open);
      settings.setAttribute("aria-expanded", String(open));
    }

    function refreshStatus() {
      const consent = readStorage(localStorage, CONSENT_KEY);
      status.textContent = consent === "granted" ? "当前状态：已允许。关闭后会删除本设备对应的匿名明细。" : consent === "denied" ? "当前状态：未启用自定义匿名统计。" : "请选择是否启用；未选择前不会发送自定义浏览事件。";
      decline.textContent = consent === "granted" ? "关闭并删除本设备明细" : "暂不统计";
    }

    settings.addEventListener("click", () => {
      const open = !panel.classList.contains("open");
      refreshStatus();
      setPanel(open);
    });

    document.querySelector("#analyticsAllow").addEventListener("click", () => {
      const wasGranted = readStorage(localStorage, CONSENT_KEY) === "granted";
      writeStorage(localStorage, CONSENT_KEY, "granted");
      startTracking(!wasGranted);
      refreshStatus();
      setPanel(false);
    });

    decline.addEventListener("click", async () => {
      const existingVisitor = readStorage(localStorage, VISITOR_KEY);
      if (readStorage(localStorage, CONSENT_KEY) === "granted" && existingVisitor) {
        decline.disabled = true;
        decline.textContent = "正在删除...";
        try {
          const response = await fetch(`${endpoint}/delete`, {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ visitorId: existingVisitor }),
          });
          if (!response.ok) throw new Error("delete_failed");
        } catch (_error) {
          status.textContent = "删除请求失败，请稍后重试。现有统计设置没有改变。";
          decline.disabled = false;
          refreshStatus();
          setPanel(true);
          return;
        }
      }

      writeStorage(localStorage, CONSENT_KEY, "denied");
      removeStorage(localStorage, VISITOR_KEY);
      removeStorage(sessionStorage, SESSION_KEY);
      stopTracking();
      decline.disabled = false;
      refreshStatus();
      setPanel(false);
    });

    refreshStatus();
    if (!readStorage(localStorage, CONSENT_KEY)) setPanel(true);
  }

  createPrivacyControls();
  if (readStorage(localStorage, CONSENT_KEY) === "granted") startTracking();
})();
