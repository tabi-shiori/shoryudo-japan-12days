# 日本升龙道 12 天慢旅行

上海出发、名古屋优先进出、不自驾、9 月底到 10 月初的升龙道 12 天互动旅行攻略。

主站是纯静态网站，部署在 GitHub Pages。`analytics.js` 默认把访问交互事件发送到 Cloudflare Worker。后台入口为：

`https://shoryudo-visitor-analytics.tabi-shiori-travel.workers.dev/admin`

分析服务保存完整访客 IP、脱敏网段、不可逆 IP 指纹、随机访客编号和页面交互，明细保留 30 天。完整 IP 仅在密码保护的统计后台显示。Worker 源码、D1 表结构与合约测试位于 `analytics-worker/`，密钥与本机后台密码不会提交到 Git。
