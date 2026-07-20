const EVENT_NAMES = new Set([
  "session_start",
  "page_view",
  "page_exit",
  "section_view",
  "section_dwell",
  "navigation",
  "route_mode",
  "map_place",
  "map_filter",
  "hotel_filter",
  "hotel_outbound",
  "route_generate",
  "builder_details",
  "share_link",
  "builder_reset",
  "external_link",
  "consent_granted",
]);

const encoder = new TextEncoder();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if ((url.pathname === "/collect" || url.pathname === "/delete") && request.method === "OPTIONS") {
      return corsResponse(request, env, null, 204);
    }

    if (url.pathname === "/collect" && request.method === "POST") {
      return handleCollect(request, env);
    }

    if (url.pathname === "/delete" && request.method === "POST") {
      return handleDelete(request, env);
    }

    if (url.pathname === "/admin/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    if (url.pathname === "/admin/logout") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin",
          "Set-Cookie": expiredAdminCookie(),
          "Cache-Control": "no-store",
        },
      });
    }

    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      const authenticated = await isAdmin(request, env);
      return htmlResponse(authenticated ? dashboardHtml() : loginHtml(), authenticated ? 200 : 401);
    }

    if (url.pathname === "/api/stats") {
      if (!(await isAdmin(request, env))) return jsonResponse({ error: "unauthorized" }, 401);
      return handleStats(env);
    }

    if (url.pathname === "/api/visitor") {
      if (!(await isAdmin(request, env))) return jsonResponse({ error: "unauthorized" }, 401);
      return handleVisitor(url, env);
    }

    if (url.pathname === "/health") {
      return jsonResponse({ ok: true, service: "shoryudo-visitor-analytics" });
    }

    return new Response("Not found", { status: 404 });
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(deleteExpiredEvents(env));
  },
};

async function handleCollect(request, env) {
  if (!isAllowedOrigin(request, env)) return jsonResponse({ error: "origin_not_allowed" }, 403);

  const size = Number(request.headers.get("Content-Length") || 0);
  if (size > 12_000) return corsResponse(request, env, { error: "payload_too_large" }, 413);

  const rawBody = await request.text();
  if (encoder.encode(rawBody).byteLength > 12_000) {
    return corsResponse(request, env, { error: "payload_too_large" }, 413);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (_error) {
    return corsResponse(request, env, { error: "invalid_json" }, 400);
  }

  const eventName = cleanText(body.eventName, 48);
  const visitorId = cleanId(body.visitorId);
  const sessionId = cleanId(body.sessionId);
  const eventId = cleanId(body.eventId);
  if (!EVENT_NAMES.has(eventName) || !visitorId || !sessionId || !eventId) {
    return corsResponse(request, env, { error: "invalid_event" }, 400);
  }

  const clientIp = request.headers.get("CF-Connecting-IP") || "";
  const ipHash = clientIp && env.IP_HASH_SECRET ? await hmacHex(env.IP_HASH_SECRET, clientIp) : null;
  const path = cleanPath(body.path);
  const metadata = compactMetadata(body.metadata);
  const durationSeconds = clampInteger(body.durationSeconds, 0, 3600);

  try {
    await env.DB.prepare(
      `INSERT OR IGNORE INTO events (
        event_id, visitor_id, session_id, event_name, section_id, target_id,
        metadata, duration_seconds, path, referrer_host, ip_hash, ip_masked,
        country, device_type, locale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        eventId,
        visitorId,
        sessionId,
        eventName,
        cleanText(body.sectionId, 64) || null,
        cleanText(body.targetId, 160) || null,
        JSON.stringify(metadata),
        durationSeconds,
        path,
        cleanHostname(body.referrerHost),
        ipHash,
        maskIp(clientIp),
        cleanText(request.cf?.country, 2) || null,
        cleanDevice(body.deviceType),
        cleanText(body.locale, 24) || null,
      )
      .run();
  } catch (error) {
    console.error("collect_failed", error?.message || error);
    return corsResponse(request, env, { error: "storage_failed" }, 500);
  }

  return corsResponse(request, env, null, 204);
}

async function handleDelete(request, env) {
  if (!isAllowedOrigin(request, env)) return jsonResponse({ error: "origin_not_allowed" }, 403);

  let body;
  try {
    body = JSON.parse(await request.text());
  } catch (_error) {
    return corsResponse(request, env, { error: "invalid_json" }, 400);
  }

  const visitorId = cleanId(body.visitorId);
  if (!visitorId) return corsResponse(request, env, { error: "invalid_visitor" }, 400);

  await env.DB.prepare("DELETE FROM events WHERE visitor_id = ?").bind(visitorId).run();
  return corsResponse(request, env, { ok: true }, 200);
}

async function handleLogin(request, env) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  if (!env.ADMIN_PASSWORD || !(await secureEqual(password, env.ADMIN_PASSWORD))) {
    return htmlResponse(loginHtml("密码不正确，请重试。"), 401);
  }

  const cookie = await createAdminCookie(env);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin",
      "Set-Cookie": cookie,
      "Cache-Control": "no-store",
    },
  });
}

async function handleStats(env) {
  const statements = [
    env.DB.prepare(`SELECT
      COUNT(*) AS events,
      COUNT(DISTINCT visitor_id) AS visitors,
      COUNT(DISTINCT session_id) AS sessions,
      COALESCE(SUM(duration_seconds), 0) AS engaged_seconds
      FROM events WHERE occurred_at >= datetime('now', '-30 days')`),
    env.DB.prepare(`SELECT date(occurred_at) AS day,
      COUNT(DISTINCT session_id) AS sessions,
      COUNT(DISTINCT visitor_id) AS visitors
      FROM events WHERE occurred_at >= datetime('now', '-13 days')
      GROUP BY day ORDER BY day`),
    env.DB.prepare(`SELECT section_id AS label, COUNT(*) AS total
      FROM events WHERE event_name = 'section_view' AND section_id IS NOT NULL
      AND occurred_at >= datetime('now', '-30 days')
      GROUP BY section_id ORDER BY total DESC LIMIT 10`),
    env.DB.prepare(`SELECT event_name AS label, COUNT(*) AS total
      FROM events WHERE event_name NOT IN ('session_start', 'page_view', 'page_exit', 'section_view', 'section_dwell')
      AND occurred_at >= datetime('now', '-30 days')
      GROUP BY event_name ORDER BY total DESC LIMIT 10`),
    env.DB.prepare(`SELECT visitor_id, ip_masked, substr(ip_hash, 1, 10) AS network_key,
      country, device_type, MIN(occurred_at) AS first_seen, MAX(occurred_at) AS last_seen,
      COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS events,
      COALESCE(SUM(duration_seconds), 0) AS engaged_seconds
      FROM events WHERE occurred_at >= datetime('now', '-30 days')
      GROUP BY visitor_id, ip_masked, network_key, country, device_type
      ORDER BY last_seen DESC LIMIT 80`),
  ];

  const [summary, daily, sections, actions, visitors] = await env.DB.batch(statements);
  return jsonResponse({
    summary: summary.results?.[0] || {},
    daily: daily.results || [],
    sections: sections.results || [],
    actions: actions.results || [],
    visitors: visitors.results || [],
    retentionDays: Number(env.DATA_RETENTION_DAYS || 30),
  });
}

async function handleVisitor(url, env) {
  const visitorId = cleanId(url.searchParams.get("id"));
  if (!visitorId) return jsonResponse({ error: "invalid_visitor" }, 400);

  const result = await env.DB.prepare(`SELECT event_name, section_id, target_id, metadata,
    duration_seconds, path, ip_masked, country, device_type, occurred_at
    FROM events WHERE visitor_id = ? ORDER BY occurred_at DESC LIMIT 160`)
    .bind(visitorId)
    .all();

  return jsonResponse({ visitorId, events: result.results || [] });
}

async function deleteExpiredEvents(env) {
  const days = clampInteger(env.DATA_RETENTION_DAYS || 30, 1, 365) || 30;
  await env.DB.prepare(`DELETE FROM events WHERE occurred_at < datetime('now', ?)`)
    .bind(`-${days} days`)
    .run();
}

function isAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  return origin === env.ALLOWED_ORIGIN;
}

function corsResponse(request, env, payload, status) {
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers({
    "Access-Control-Allow-Origin": origin === env.ALLOWED_ORIGIN ? origin : env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "Cache-Control": "no-store",
  });

  if (payload === null) return new Response(null, { status, headers });
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(payload), { status, headers });
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}

function cleanId(value) {
  const text = String(value || "");
  return /^[a-zA-Z0-9_-]{12,80}$/.test(text) ? text : "";
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

function cleanPath(value) {
  const path = cleanText(value, 180).split(/[?#]/)[0];
  return path.startsWith("/") ? path : "/";
}

function cleanHostname(value) {
  const text = cleanText(value, 120).toLowerCase();
  return /^[a-z0-9.-]+$/.test(text) ? text : null;
}

function cleanDevice(value) {
  const device = cleanText(value, 16);
  return ["mobile", "tablet", "desktop"].includes(device) ? device : "unknown";
}

function clampInteger(value, min, max) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return null;
  return Math.max(min, Math.min(max, number));
}

function compactMetadata(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result = {};
  Object.entries(value)
    .slice(0, 12)
    .forEach(([rawKey, rawValue]) => {
      const key = cleanText(rawKey, 40);
      if (!key) return;
      if (typeof rawValue === "string") result[key] = cleanText(rawValue, 180);
      if (typeof rawValue === "boolean") result[key] = rawValue;
      if (typeof rawValue === "number" && Number.isFinite(rawValue)) result[key] = rawValue;
      if (Array.isArray(rawValue)) {
        result[key] = rawValue.slice(0, 12).map((item) => cleanText(item, 80));
      }
    });
  return result;
}

function maskIp(ip) {
  if (!ip) return null;
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.x.x` : null;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":").filter(Boolean);
    return `${parts.slice(0, 3).join(":")}::/48`;
  }
  return null;
}

async function hmacHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function secureEqual(left, right) {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const a = new Uint8Array(leftHash);
  const b = new Uint8Array(rightHash);
  let difference = a.length ^ b.length;
  for (let index = 0; index < Math.min(a.length, b.length); index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

async function createAdminCookie(env) {
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `v1.${expires}`;
  const signature = await hmacHex(env.ADMIN_SESSION_SECRET, payload);
  return `shoryudo_admin=${payload}.${signature}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`;
}

function expiredAdminCookie() {
  return "shoryudo_admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict";
}

async function isAdmin(request, env) {
  if (!env.ADMIN_SESSION_SECRET) return false;
  const cookie = request.headers.get("Cookie") || "";
  const value = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("shoryudo_admin="))
    ?.slice("shoryudo_admin=".length);
  if (!value) return false;

  const [version, expiresText, signature] = value.split(".");
  const expires = Number(expiresText);
  if (version !== "v1" || !signature || !Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = await hmacHex(env.ADMIN_SESSION_SECRET, `${version}.${expiresText}`);
  return secureEqual(signature, expected);
}

function loginHtml(message = "") {
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>升龙道访问统计</title><style>
:root{color-scheme:light;font-family:Inter,"Noto Sans SC","Microsoft YaHei",sans-serif;color:#1e2926;background:#eef3f0}*{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;background:linear-gradient(145deg,#edf4f1,#f8f5ee)}main{width:min(420px,100%);padding:30px;background:rgba(255,255,255,.9);border:1px solid rgba(45,95,85,.16);border-radius:8px;box-shadow:0 24px 70px rgba(31,54,49,.14)}p{color:#64706d;line-height:1.7}label{display:block;margin:22px 0 8px;font-weight:700}input{width:100%;height:46px;padding:0 12px;border:1px solid #b8c7c1;border-radius:6px;font:inherit}button{width:100%;height:46px;margin-top:12px;border:0;border-radius:6px;color:white;background:#2d5f55;font:inherit;font-weight:750;cursor:pointer}.error{padding:10px 12px;color:#8a3f2d;background:#fff0e9;border-radius:6px}small{display:block;margin-top:18px;color:#7d8985}</style></head>
<body><main><p>PRIVATE ANALYTICS</p><h1>升龙道访问统计</h1><p>仅网站所有者可查看匿名访客轨迹与脱敏网络信息。</p>${message ? `<p class="error">${message}</p>` : ""}<form method="post" action="/admin/login"><label for="password">管理密码</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">进入统计后台</button></form><small>登录状态仅保存在当前浏览器，7 天后自动失效。</small></main></body></html>`;
}

function dashboardHtml() {
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>升龙道访问统计</title><style>
:root{font-family:Inter,"Noto Sans SC","Microsoft YaHei",sans-serif;color:#1f2926;background:#f3f5f2;--green:#2d5f55;--orange:#c86d3d;--line:#dbe3df}*{box-sizing:border-box}body{margin:0}header{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;align-items:center;padding:14px clamp(18px,4vw,54px);background:rgba(255,255,255,.92);border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}header strong{font-size:18px}a{color:var(--green)}main{width:min(1180px,100%);margin:auto;padding:28px clamp(16px,4vw,48px) 64px}.notice{color:#66716e}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:22px 0}.card,.panel{background:white;border:1px solid var(--line);border-radius:8px}.card{padding:17px}.card span{display:block;color:#73807c;font-size:13px}.card strong{display:block;margin-top:7px;font-size:26px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.panel{padding:18px;overflow:hidden}.panel h2{margin:0 0 16px;font-size:18px}.bars{display:grid;gap:9px}.bar{display:grid;grid-template-columns:minmax(90px,1fr) 3fr 42px;gap:10px;align-items:center;font-size:13px}.track{height:8px;overflow:hidden;background:#edf1ef;border-radius:4px}.fill{height:100%;background:var(--green)}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:10px 8px;text-align:left;border-bottom:1px solid var(--line)}th{color:#6f7b77}.table-wrap{overflow:auto}button.link{padding:0;border:0;color:var(--green);background:none;font:inherit;font-weight:700;cursor:pointer}.timeline{display:grid;gap:8px;max-height:520px;overflow:auto}.event{display:grid;grid-template-columns:150px 120px 1fr;gap:12px;padding:10px;background:#f7f9f8;border-radius:6px;font-size:13px}.event time{color:#6f7b77}.event code{overflow-wrap:anywhere;color:#44504d}.empty{padding:20px;color:#77827f;text-align:center;background:#f7f9f8;border-radius:6px}.full{grid-column:1/-1}@media(max-width:760px){.cards,.grid{grid-template-columns:1fr 1fr}.event{grid-template-columns:1fr}.hide-mobile{display:none}}@media(max-width:460px){.cards,.grid{grid-template-columns:1fr}}</style></head>
<body><header><strong>升龙道访问统计</strong><a href="/admin/logout">退出</a></header><main><p class="notice" id="retention">加载中...</p><section class="cards" id="summary"></section><section class="grid"><article class="panel"><h2>最近 14 天访问</h2><div class="bars" id="daily"></div></article><article class="panel"><h2>热门章节</h2><div class="bars" id="sections"></div></article><article class="panel"><h2>常用操作</h2><div class="bars" id="actions"></div></article><article class="panel"><h2>说明</h2><p class="notice">访客编号只代表同一浏览器；更换设备、无痕模式或清除数据后会生成新编号。IP 仅显示脱敏网段，网络键为不可逆指纹的前 10 位。</p></article><article class="panel full"><h2>匿名访客</h2><div class="table-wrap"><table><thead><tr><th>访客编号</th><th>脱敏 IP</th><th class="hide-mobile">国家</th><th>会话</th><th>停留</th><th>最后访问</th></tr></thead><tbody id="visitors"></tbody></table></div></article><article class="panel full"><h2 id="timelineTitle">访客时间线</h2><div class="timeline" id="timeline"><div class="empty">点击上方访客编号查看浏览轨迹</div></div></article></section></main>
<script>
const labels={session_start:'开始访问',page_view:'打开页面',page_exit:'离开页面',section_view:'查看章节',section_dwell:'章节停留',navigation:'站内导航',route_mode:'切换推荐路线',map_place:'查看地图地点',map_filter:'地图筛选',hotel_filter:'筛选酒店城市',hotel_outbound:'打开酒店链接',route_generate:'生成自定义路线',builder_details:'展开路线详情',share_link:'复制分享链接',builder_reset:'恢复默认',external_link:'打开资料链接',consent_granted:'同意匿名统计'};
const esc=(value)=>String(value??'').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const minutes=(seconds)=>Math.max(0,Math.round(Number(seconds||0)/6)/10)+' 分钟';
const short=(id)=>String(id||'').slice(0,8);
function bars(target,rows,labelKey='label',valueKey='total'){const el=document.querySelector(target);if(!rows.length){el.innerHTML='<div class="empty">暂无数据</div>';return}const max=Math.max(...rows.map(row=>Number(row[valueKey]||0)),1);el.innerHTML=rows.map(row=>'<div class="bar"><span>'+esc(labels[row[labelKey]]||row[labelKey]||row.day)+'</span><div class="track"><div class="fill" style="width:'+Math.max(4,Number(row[valueKey]||0)/max*100)+'%"></div></div><strong>'+esc(row[valueKey])+'</strong></div>').join('')}
async function load(){const response=await fetch('/api/stats');if(!response.ok){location.reload();return}const data=await response.json();document.querySelector('#retention').textContent='匿名明细保留 '+data.retentionDays+' 天，过期数据每日自动清理。';const s=data.summary;document.querySelector('#summary').innerHTML=[['匿名访客',s.visitors],['访问会话',s.sessions],['记录事件',s.events],['有效停留',minutes(s.engaged_seconds)]].map(([label,value])=>'<article class="card"><span>'+label+'</span><strong>'+esc(value||0)+'</strong></article>').join('');bars('#daily',data.daily,'day','sessions');bars('#sections',data.sections);bars('#actions',data.actions);document.querySelector('#visitors').innerHTML=data.visitors.map(row=>'<tr><td><button class="link" data-visitor="'+esc(row.visitor_id)+'">'+esc(short(row.visitor_id))+'</button><br><small>'+esc(row.network_key||'无网络键')+'</small></td><td>'+esc(row.ip_masked||'未知')+'</td><td class="hide-mobile">'+esc(row.country||'-')+'</td><td>'+esc(row.sessions)+'</td><td>'+esc(minutes(row.engaged_seconds))+'</td><td>'+esc(new Date(row.last_seen+'Z').toLocaleString())+'</td></tr>').join('')||'<tr><td colspan="6">暂无访问数据</td></tr>';document.querySelectorAll('[data-visitor]').forEach(button=>button.addEventListener('click',()=>loadVisitor(button.dataset.visitor)))}
async function loadVisitor(id){const response=await fetch('/api/visitor?id='+encodeURIComponent(id));const data=await response.json();document.querySelector('#timelineTitle').textContent='访客 '+short(id)+' 的时间线';document.querySelector('#timeline').innerHTML=data.events.map(event=>{let meta='';try{const parsed=JSON.parse(event.metadata||'{}');meta=Object.keys(parsed).length?' · '+JSON.stringify(parsed):''}catch{}return '<div class="event"><time>'+esc(new Date(event.occurred_at+'Z').toLocaleString())+'</time><strong>'+esc(labels[event.event_name]||event.event_name)+'</strong><code>'+esc(event.section_id||event.target_id||event.path)+esc(event.duration_seconds?' · '+event.duration_seconds+'秒':'')+esc(meta)+'</code></div>'}).join('')||'<div class="empty">暂无明细</div>';document.querySelector('#timelineTitle').scrollIntoView({behavior:'smooth',block:'start'})}
load().catch(()=>{document.querySelector('#retention').textContent='统计数据加载失败，请刷新重试。'});
</script></body></html>`;
}
