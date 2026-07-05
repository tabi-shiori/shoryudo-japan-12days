const locations = [
  {
    id: "nagoya",
    name: "名古屋",
    jp: "Nagoya",
    score: 8.2,
    type: "city",
    x: 440,
    y: 400,
    stay: "2-3晚，进出与购物基地",
    base: "名古屋站或荣周边",
    vibe: "实用的中部枢纽，适合恢复体力、购物和吃饭。",
    highlights: ["名古屋城", "荣商圈", "大须商店街", "味噌猪排与鳗鱼饭"],
    transport: "中部国际机场到市区以名铁为主；去高山、松本、富山都有铁路或巴士方案。",
    clothing: "9月底仍可能偏热，10月初早晚加薄外套。",
    tags: ["city", "food", "shopping"],
  },
  {
    id: "gero",
    name: "下吕温泉",
    jp: "Gero Onsen",
    score: 8.7,
    type: "onsen",
    x: 345,
    y: 346,
    stay: "半天到1晚",
    base: "下吕站步行范围",
    vibe: "经济化体验温泉很合适，不必住奢华旅馆。",
    highlights: ["飞驒川散步", "足汤", "日归温泉", "温泉街小吃"],
    transport: "名古屋到下吕可搭 JR 特急；继续去高山也顺路。",
    clothing: "泡温泉当天行李轻一点，带易干小毛巾。",
    tags: ["onsen", "slow"],
  },
  {
    id: "takayama",
    name: "飞驒高山",
    jp: "Takayama",
    score: 9.2,
    type: "culture",
    x: 295,
    y: 278,
    stay: "2-3晚，北阿尔卑斯门户",
    base: "高山站到古街之间",
    vibe: "古街、朝市、飞驒牛和木造町屋，适合慢慢晃。",
    highlights: ["宫川朝市", "三町古街", "高山阵屋", "飞驒牛"],
    transport: "名古屋、白川乡、上高地、松本方向都有公共交通衔接。",
    clothing: "早市和夜晚偏凉，薄风衣或针织衫实用。",
    tags: ["culture", "food", "base"],
  },
  {
    id: "furukawa",
    name: "飞驒古川",
    jp: "Hida-Furukawa",
    score: 8.4,
    type: "culture",
    x: 312,
    y: 245,
    stay: "高山出发半日",
    base: "不建议单独换宿",
    vibe: "比高山更安静，适合在白壁土藏和濑户川边散步。",
    highlights: ["白壁土藏街", "濑户川", "小镇咖啡", "木工与祭典文化"],
    transport: "从高山搭 JR 短途往返，适合作为松弛半日。",
    clothing: "轻装即可，雨天也比较好逛。",
    tags: ["culture", "slow"],
  },
  {
    id: "kamikochi",
    name: "上高地",
    jp: "Kamikochi",
    score: 9.6,
    type: "nature",
    x: 424,
    y: 257,
    stay: "高山/平汤出发一日",
    base: "高山或平汤温泉",
    vibe: "清澈河谷、森林、山影，最贴合你的摄影慢游偏好。",
    highlights: ["大正池", "河童桥", "明神池", "梓川步道"],
    transport: "核心区以巴士/出租车接驳进入；红叶季人多，建议早出发。",
    clothing: "海拔高，清晨冷；防风外套和舒适步行鞋优先。",
    tags: ["nature", "photo"],
  },
  {
    id: "shirakawa",
    name: "白川乡",
    jp: "Shirakawa-go",
    score: 8.6,
    type: "culture",
    x: 250,
    y: 214,
    stay: "2-4小时转场游",
    base: "不建议此行住宿",
    vibe: "合掌造村落标志性强，适合作为高山到金泽之间的中转景点。",
    highlights: ["荻町合掌村", "展望台", "乡土建筑", "稻田与村道"],
    transport: "高山到白川乡、白川乡到金泽/富山多用预约制巴士。",
    clothing: "村内步行多，雨天路面湿滑，鞋底防滑更安心。",
    tags: ["culture", "photo"],
  },
  {
    id: "kanazawa",
    name: "金泽",
    jp: "Kanazawa",
    score: 9.3,
    type: "culture",
    x: 166,
    y: 133,
    stay: "2晚最舒服",
    base: "金泽站或香林坊/片町",
    vibe: "庭园、茶屋街、美术馆和海鲜市场，清新日式审美最浓。",
    highlights: ["兼六园", "东茶屋街", "21世纪美术馆", "近江町市场"],
    transport: "从白川乡巴士进入，从金泽到富山铁路很顺。",
    clothing: "城市步行为主，可准备一套稍微好看的拍照衣服。",
    tags: ["culture", "food", "city"],
  },
  {
    id: "toyama",
    name: "富山",
    jp: "Toyama",
    score: 8.4,
    type: "city",
    x: 206,
    y: 82,
    stay: "1晚，立山前置基地",
    base: "富山站周边",
    vibe: "海鲜和玻璃美术馆很好，最重要是为立山黑部降低压力。",
    highlights: ["富山湾寿司", "玻璃美术馆", "环水公园", "药都文化"],
    transport: "去立山站方便；从金泽到富山也很短。",
    clothing: "城市轻装，第二天山岳穿越要提前整理行李。",
    tags: ["city", "food"],
  },
  {
    id: "tateyama",
    name: "立山黑部",
    jp: "Tateyama Kurobe",
    score: 9.4,
    type: "nature",
    x: 360,
    y: 144,
    stay: "完整一日穿越",
    base: "前晚住富山，后晚住松本",
    vibe: "山岳交通体验最强，但价格、天气和换乘复杂度都更高。",
    highlights: ["室堂", "大观峰", "黑部水坝", "缆车与无轨电车"],
    transport: "富山侧进入，经多段交通穿越到信浓大町/松本。",
    clothing: "山上温差明显，防风保暖层、防雨和轻便行李很重要。",
    tags: ["nature", "photo"],
  },
  {
    id: "matsumoto",
    name: "松本",
    jp: "Matsumoto",
    score: 8.5,
    type: "culture",
    x: 520,
    y: 156,
    stay: "1晚，立山后收尾",
    base: "松本站到松本城之间",
    vibe: "城下町、咖啡和工艺感很好，是山岳路线后的安静落点。",
    highlights: ["松本城", "中町通", "绳手通", "咖啡与民艺"],
    transport: "从信浓大町接入，回名古屋可走 JR 或高速巴士。",
    clothing: "早晚凉，适合轻外套。",
    tags: ["culture", "slow"],
  },
  {
    id: "inuyama",
    name: "犬山",
    jp: "Inuyama",
    score: 8.1,
    type: "culture",
    x: 501,
    y: 334,
    stay: "名古屋半日支线",
    base: "不建议换宿",
    vibe: "如果想多一点城下町氛围，可从名古屋半日往返。",
    highlights: ["犬山城", "城下町小吃", "木曾川", "明治村可选"],
    transport: "从名古屋搭名铁往返方便。",
    clothing: "半日轻装，适合放在购物日之前。",
    tags: ["culture", "city"],
  },
];

const routeModes = {
  balanced: {
    title: "平衡默认：风景、人文、温泉、购物都保留",
    copy: "适合第一次去升龙道的小白路线。上高地和立山黑部都保留，但在富山和高山各留缓冲，天气不好也能转城市慢游。",
    metrics: [
      ["6次", "主要换宿"],
      ["2天", "山岳风景日"],
      ["1次", "经济温泉体验"],
    ],
    days: [
      ["D1", "名古屋", "抵达与补给", ["上海飞名古屋", "名铁进市区", "晚上便利店/药妆/简单晚餐"], "住名古屋", "机场到市区约30-45分钟"],
      ["D2", "名古屋", "城市适应日", ["名古屋城或德川园", "荣商圈与大须商店街", "味噌猪排/鳗鱼饭"], "住名古屋", "控制步数，倒时差"],
      ["D3", "下吕", "经济温泉日", ["名古屋到下吕", "温泉街散步与足汤", "日归温泉或经济温泉酒店"], "住下吕或高山", "若想少换宿可傍晚去高山"],
      ["D4", "高山", "古城人文", ["宫川朝市", "三町古街", "高山阵屋", "飞驒牛晚餐"], "住高山", "全天步行友好"],
      ["D5", "高山", "慢游缓冲", ["飞驒古川半日", "咖啡/民艺/小店", "天气不好则高山市内慢游"], "住高山", "给D6山景留体力"],
      ["D6", "上高地", "河谷摄影", ["早班车去上高地", "大正池到河童桥", "体力好再到明神池"], "住高山或平汤", "红叶季早出发"],
      ["D7", "白川乡/金泽", "世界遗产转场", ["高山到白川乡", "荻町合掌村", "下午到金泽"], "住金泽", "巴士建议预约"],
      ["D8", "金泽", "美学城市", ["兼六园", "21世纪美术馆", "近江町市场", "东茶屋街"], "住金泽", "城市日，适合穿好看点"],
      ["D9", "富山", "海鲜缓冲", ["金泽到富山", "玻璃美术馆", "富山湾寿司", "整理山岳行李"], "住富山", "为D10降低压力"],
      ["D10", "立山黑部", "山岳穿越", ["富山到立山", "室堂/大观峰/黑部水坝", "信浓大町到松本"], "住松本", "天气差可改富山市内/金泽"],
      ["D11", "松本/名古屋", "城下町收尾", ["松本城", "中町通/绳手通", "下午回名古屋购物"], "住名古屋", "给返程留安全垫"],
      ["D12", "名古屋", "返程", ["早餐采购", "机场退税/伴手礼", "飞回上海"], "返程", "提前确认航站楼"],
    ],
  },
  scenery: {
    title: "风景优先：把山水时间放大",
    copy: "高山区域住得更久，上高地保留完整时间，立山黑部必须看天气才执行。购物压缩到最后一天。",
    metrics: [
      ["3天", "自然风景"],
      ["5晚", "山城/山麓"],
      ["低", "城市购物比重"],
    ],
    days: [
      ["D1", "名古屋", "抵达", ["上海飞名古屋", "市区补给", "早睡"], "住名古屋", "少安排"],
      ["D2", "下吕", "温泉开场", ["名古屋上午购物补给", "下午下吕温泉", "足汤与温泉街"], "住下吕", "经济温泉酒店即可"],
      ["D3", "高山", "古街慢游", ["下吕到高山", "宫川朝市", "高山老街"], "住高山", "慢慢拍"],
      ["D4", "高山", "飞驒古川", ["飞驒古川半日", "高山市内咖啡", "飞驒牛晚餐"], "住高山", "缓冲"],
      ["D5", "平汤", "山麓温泉", ["高山到平汤", "轻松温泉", "准备上高地"], "住平汤或高山", "更贴近上高地"],
      ["D6", "上高地", "完整摄影日", ["大正池清晨", "河童桥", "明神池", "傍晚回程"], "住高山", "体力自由控制"],
      ["D7", "白川乡/金泽", "村落转场", ["高山到白川乡", "展望台", "到金泽"], "住金泽", "预约巴士"],
      ["D8", "金泽", "庭园与市场", ["兼六园", "近江町市场", "东茶屋街"], "住金泽", "放慢"],
      ["D9", "富山", "海景城市", ["富山寿司", "环水公园", "玻璃美术馆"], "住富山", "早点休息"],
      ["D10", "立山黑部", "山岳穿越", ["按天气执行立山黑部", "若阴雨改富山/松本", "晚上到松本"], "住松本", "关键看天气"],
      ["D11", "松本/名古屋", "城与归程", ["松本城", "中町通", "回名古屋"], "住名古屋", "轻松收尾"],
      ["D12", "名古屋", "返程", ["机场伴手礼", "飞回上海"], "返程", "不排景点"],
    ],
  },
  budget: {
    title: "更省钱：温泉保留，山岳高价体验可替换",
    copy: "保留下吕、高山、白川乡、金泽这些高性价比体验；立山黑部改为天气好且预算允许才执行。",
    metrics: [
      ["可省", "立山黑部高额交通"],
      ["多用", "普通车/巴士"],
      ["保留", "下吕温泉"],
    ],
    days: [
      ["D1", "名古屋", "抵达", ["上海飞名古屋", "名古屋站周边入住", "简单晚餐"], "住名古屋", "选经济连锁"],
      ["D2", "名古屋/犬山", "低成本城市日", ["犬山半日或名古屋城", "大须商店街", "超市/居酒屋"], "住名古屋", "交通成本低"],
      ["D3", "下吕", "经济温泉", ["JR到下吕", "足汤", "日归温泉"], "住高山", "可不住温泉旅馆"],
      ["D4", "高山", "古街与早市", ["宫川朝市", "三町古街", "阵屋外观/可选入内"], "住高山", "以步行为主"],
      ["D5", "高山", "飞驒古川", ["短途JR往返", "小镇散步", "高山晚餐"], "住高山", "轻支线"],
      ["D6", "上高地", "自然风景", ["上高地一日", "不进收费景点", "自备轻食"], "住高山", "预算友好"],
      ["D7", "白川乡/金泽", "合掌村转场", ["预约巴士", "白川乡2-3小时", "到金泽"], "住金泽", "控制停留"],
      ["D8", "金泽", "庭园城市", ["兼六园", "市场", "茶屋街"], "住金泽", "美术馆按兴趣"],
      ["D9", "金泽/富山", "预算缓冲", ["金泽继续慢游", "或短途去富山吃寿司"], "住金泽或富山", "按住宿价格选"],
      ["D10", "松本", "替代立山", ["富山/金泽到松本", "松本城", "中町通"], "住松本", "省掉立山黑部"],
      ["D11", "名古屋", "回程购物", ["松本回名古屋", "荣/大须购物", "伴手礼"], "住名古屋", "最后采购"],
      ["D12", "名古屋", "返程", ["飞回上海"], "返程", "简单"],
    ],
  },
  rain: {
    title: "雨天替代：山岳日改城市与室内",
    copy: "9月底10月初仍可能遇到雨或台风尾巴。这个版本把上高地/立山黑部设置为天气窗口，雨天转金泽、富山、松本室内线。",
    metrics: [
      ["弹性", "山岳顺延"],
      ["增加", "美术馆/市场"],
      ["降低", "天气风险"],
    ],
    days: [
      ["D1", "名古屋", "抵达", ["上海飞名古屋", "市区入住"], "住名古屋", "不硬排"],
      ["D2", "名古屋", "室内友好", ["丰田产业技术纪念馆", "大须商店街", "荣地下街"], "住名古屋", "雨天可行"],
      ["D3", "下吕/高山", "温泉转场", ["下吕温泉", "傍晚高山"], "住高山", "雨天温泉反而舒服"],
      ["D4", "高山", "古街短走", ["宫川朝市看天气", "高山阵屋", "咖啡小店"], "住高山", "雨具准备"],
      ["D5", "高山", "天气窗口", ["若晴：上高地", "若雨：飞驒古川/高山市内"], "住高山", "留弹性"],
      ["D6", "高山", "顺延上高地", ["若D5未去且天气转好：上高地", "否则慢游"], "住高山", "不强行"],
      ["D7", "白川乡/金泽", "转场", ["巴士转场", "白川乡短停", "到金泽"], "住金泽", "雨天缩短村落停留"],
      ["D8", "金泽", "雨天美学", ["21世纪美术馆", "近江町市场", "茶屋街短走"], "住金泽", "城市可控"],
      ["D9", "富山", "室内缓冲", ["玻璃美术馆", "富山寿司", "检查立山天气"], "住富山", "关键观察"],
      ["D10", "立山或替代", "天气决定", ["晴：立山黑部穿越", "雨：富山/松本城市线"], "住松本", "安全优先"],
      ["D11", "松本/名古屋", "回名古屋", ["松本城外观或市美术馆", "回名古屋购物"], "住名古屋", "回国前安全垫"],
      ["D12", "名古屋", "返程", ["飞回上海"], "返程", "确认航班"],
    ],
  },
};

const compareCards = [
  {
    title: "上高地",
    tag: "更贴合你的审美",
    featured: true,
    body: "清澈河谷、森林步道、山影和木桥，走起来轻松，花费也比立山黑部可控。",
    points: ["建议保留", "高山/平汤出发", "早出发避开人潮", "轻徒步即可满足摄影"],
  },
  {
    title: "立山黑部",
    tag: "天气好时很值得",
    featured: false,
    body: "是一次完整山岳交通体验，但成本高、换乘多、天气影响大。适合做成可开关模块。",
    points: ["晴天执行", "前晚住富山", "后晚住松本", "行李尽量轻"],
  },
  {
    title: "网站默认策略",
    tag: "全都保留但留缓冲",
    featured: false,
    body: "用富山和高山做缓冲，让两个自然重头戏都有机会，同时避免雨天把路线打崩。",
    points: ["D5/D6处理上高地天气窗口", "D9观察立山天气", "D10可切换富山/松本室内线"],
  },
];

const hotels = [
  {
    base: "名古屋",
    name: "Sotetsu Fresa Inn Nagoya-Shinkansenguchi",
    score: 8.8,
    price: "¥9,000-16,000/晚",
    location: "名古屋站太阁通口一侧，适合机场与高山方向转场",
    review: "常见评价是位置方便、干净、入住流程顺；房间偏紧凑，适合一个人短住。",
    note: "D1/D2/D11优先候选，性价比和交通便利度平衡。",
    best: true,
  },
  {
    base: "名古屋",
    name: "Vessel Hotel Campana Nagoya",
    score: 8.6,
    price: "¥12,000-22,000/晚",
    location: "名古屋站步行圈，带大浴场，购物与转场都方便",
    review: "评价关键词多为早餐不错、大浴场加分、房间舒适；旺季价格可能上浮。",
    note: "如果想在城市日也泡个大浴场，这家比普通商务酒店更舒服。",
  },
  {
    base: "名古屋",
    name: "Daiwa Roynet Hotel Nagoya Taiko-dori Side",
    score: 8.5,
    price: "¥11,000-20,000/晚",
    location: "名古屋站西侧，去机场、JR和巴士点都顺",
    review: "常见评价是房间比普通商务酒店宽一点、设施稳定；价格不一定最低。",
    note: "适合把名古屋作为第一晚和最后一晚的安全基地。",
  },
  {
    base: "下吕/温泉",
    name: "Gero Onsen Kanko Hotel Yumotokan",
    score: 8.4,
    price: "¥10,000-20,000/晚",
    location: "下吕温泉街与车站步行范围，适合经济温泉体验",
    review: "评价通常集中在老派温泉旅馆氛围、交通方便；设施不算新，期待值要放平。",
    note: "预算友好的温泉候选，适合D3住一晚或日归后转高山。",
    best: true,
  },
  {
    base: "下吕/温泉",
    name: "Bosenkan",
    score: 8.2,
    price: "¥14,000-28,000/晚",
    location: "下吕温泉河岸区域，温泉旅馆感更明显",
    review: "常见评价是庭园和露天风吕有氛围；房型差异大，订前要看具体房间。",
    note: "如果当天想把温泉仪式感拉高一点，可以作为升级选项。",
  },
  {
    base: "高山",
    name: "WAT Hotel & Spa Hida Takayama",
    score: 9.0,
    price: "¥11,000-21,000/晚",
    location: "高山站步行圈，去老街、巴士中心和餐厅都方便",
    review: "常见评价是新、干净、有大浴场和休息区；旺季热门，要早订。",
    note: "高山2-3晚的首选平衡项，特别适合不自驾旅行。",
    best: true,
  },
  {
    base: "高山",
    name: "Country Hotel Takayama",
    score: 8.3,
    price: "¥7,000-13,000/晚",
    location: "高山站和巴士中心旁，转上高地/白川乡非常顺",
    review: "评价关键词是位置极强、便宜、房间较小且设施偏旧。",
    note: "如果你更看重交通和预算，这家可以压低高山住宿成本。",
  },
  {
    base: "高山",
    name: "K's House Takayama Oasis",
    score: 8.1,
    price: "¥5,000-12,000/晚",
    location: "高山站附近，适合一个人住私密房或轻社交",
    review: "常见评价是气氛轻松、员工友好、适合独旅；隔音和空间按青旅预期看待。",
    note: "独旅预算控制选项，想住酒店感则优先WAT或Country。",
  },
  {
    base: "金泽",
    name: "Hotel Forza Kanazawa",
    score: 8.9,
    price: "¥10,000-19,000/晚",
    location: "近江町市场附近，去兼六园、茶屋街和车站都方便",
    review: "常见评价是房间现代、位置适合观光、早餐口碑不错；不在车站正门口。",
    note: "金泽2晚的强候选，适合城市美学和海鲜市场路线。",
    best: true,
  },
  {
    base: "金泽",
    name: "The Square Hotel Kanazawa",
    score: 8.7,
    price: "¥11,000-21,000/晚",
    location: "近江町市场与香林坊之间，步行观光很顺",
    review: "评价关键词是设计感、公共浴场、位置好；热门日期价格会跳。",
    note: "更清新日式、更有设计感的金泽候选。",
  },
  {
    base: "金泽",
    name: "Hotel Intergate Kanazawa",
    score: 8.5,
    price: "¥10,000-20,000/晚",
    location: "尾山神社/香林坊一带，适合慢逛金泽中心区",
    review: "常见评价是公共空间舒服、茶点服务加分；去车站需公交或打车。",
    note: "想把金泽住得更有城市生活感，可以看这家。",
  },
  {
    base: "富山",
    name: "Daiwa Roynet Hotel Toyama-Ekimae",
    score: 8.8,
    price: "¥9,000-18,000/晚",
    location: "富山站前，第二天去立山黑部前置最省心",
    review: "常见评价是位置强、房间稳定、浴室体验好；旺季需早订。",
    note: "D9住富山的首选，核心价值是降低D10山岳穿越压力。",
    best: true,
  },
  {
    base: "富山",
    name: "Hotel JAL City Toyama",
    score: 8.6,
    price: "¥10,000-20,000/晚",
    location: "富山站步行圈，去餐厅、轻轨和车站都方便",
    review: "评价多为新、安静、服务稳定；价格通常略高于基础商务酒店。",
    note: "如果想要更稳一点的城市酒店体验，可以选它。",
  },
  {
    base: "富山",
    name: "Toyama Excel Hotel Tokyu",
    score: 8.4,
    price: "¥9,000-18,000/晚",
    location: "富山站前商圈，吃饭和交通都方便",
    review: "常见评价是老牌稳定、景观和位置不错；房型新旧感要看具体房间。",
    note: "适合把富山当成一晚中转，不想走远。",
  },
  {
    base: "松本",
    name: "Dormy Inn Matsumoto",
    score: 8.8,
    price: "¥9,000-18,000/晚",
    location: "松本站与松本城之间，带天然温泉/大浴场体系",
    review: "常见评价是泡汤、夜鸣面和位置都加分；热门日价格不一定经济。",
    note: "立山黑部后住这里很合适，能用大浴场恢复体力。",
    best: true,
  },
  {
    base: "松本",
    name: "Iroha Grand Hotel Matsumoto Ekimae",
    score: 8.5,
    price: "¥8,000-16,000/晚",
    location: "松本站步行圈，回名古屋转场方便",
    review: "评价关键词是位置好、干净、性价比可以；房间按商务酒店预期。",
    note: "如果不执着大浴场，它是松本经济稳妥项。",
  },
  {
    base: "松本",
    name: "Richmond Hotel Matsumoto",
    score: 8.4,
    price: "¥8,000-16,000/晚",
    location: "松本站到松本城之间，适合步行逛城下町",
    review: "常见评价是服务稳定、位置均衡；设施风格不算特别有设计感。",
    note: "适合D10/D11一晚过渡，第二天逛城再回名古屋。",
  },
];

const trafficRows = [
  ["上海 ⇄ 名古屋", "直飞优先，名古屋中部国际机场进出", "约2.5-3小时飞行", "大阪/东京进出但转场变长", "口岸未定前先按名古屋做主线"],
  ["中部机场 → 名古屋市区", "名铁机场线", "约30-45分钟", "机场巴士/出租车", "返程日预留机场购物和退税时间"],
  ["名古屋 → 下吕/高山", "JR特急或高速巴士", "下吕约1.5小时，高山约2.5小时", "名古屋直达高山巴士", "温泉经济化可只日归下吕"],
  ["高山 ⇄ 上高地", "高山/平汤转巴士", "约1.5-2.5小时视换乘", "住平汤缩短早晨路程", "10月红叶季易拥挤，早出发"],
  ["高山 → 白川乡 → 金泽", "浓飞/北铁巴士", "高山到白川乡约50分钟，白川乡到金泽约1.5小时", "高山到富山再铁路", "热门班次建议预约"],
  ["金泽 → 富山", "北陆新干线/在来线", "约20-60分钟视车种", "高速巴士", "富山作为立山前置基地"],
  ["富山 → 立山黑部 → 松本", "阿尔卑斯路线多段换乘", "完整一日", "天气差改富山/松本城市日", "2026运营期覆盖9月底10月初"],
  ["松本 → 名古屋", "JR特急/高速巴士", "约2-3小时级别", "经长野或中津川路线", "D11回名古屋给D12安全垫"],
];

const passAdvice = [
  {
    title: "默认不急着锁定通票",
    body: "这条路线横跨巴士、JR和立山黑部多段交通，分段购票通常更灵活；等机票口岸与住宿定后再精算。",
  },
  {
    title: "Alpine-Takayama-Matsumoto Pass",
    body: "适合主攻高山与立山黑部的5日窗口。2026官方成人价为24,500日元，适合放在D6-D10附近比较。",
  },
  {
    title: "Takayama-Hokuriku Pass",
    body: "适合高山、白川乡、金泽、富山方向，但不等于覆盖完整立山黑部穿越。若删掉立山黑部可重点比较。",
  },
  {
    title: "巴士预约优先级",
    body: "高山-白川乡-金泽、上高地红叶季接驳、部分高山-松本方向，建议临近开放后先抢顺路班次。",
  },
];

const checklistItems = [
  "确认上海-名古屋或替代口岸机票",
  "核对护照有效期与日本签证材料",
  "锁定名古屋/高山/金泽/富山/松本住宿",
  "预约高山-白川乡-金泽巴士",
  "出发前7天看上高地与立山天气",
  "决定立山黑部是否执行并预留预算",
  "准备Suica/现金/常用信用卡",
  "下载离线地图与翻译App",
  "准备防风外套、轻便雨具、好走的鞋",
  "温泉礼仪与纹身/大浴场规则确认",
  "独旅安全：夜间少走偏僻路，行程给家人备份",
  "药品、充电宝、转换插头、随身小包",
];

const builderOptions = [
  ["kamikochi", "上高地"],
  ["tateyama", "立山黑部"],
  ["onsen", "温泉体验"],
  ["kanazawa", "金泽美学"],
  ["shirakawa", "白川乡"],
  ["shopping", "名古屋购物"],
];

const builderOptionLabels = Object.fromEntries(builderOptions);
const defaultBuilderSelection = ["kamikochi", "kanazawa", "onsen", "shopping"];
let builderExpanded = false;

const builderProfiles = {
  balanced: {
    title: "平衡慢游版",
    summary: "风景、人文、温泉和购物都保留，山岳日之间留缓冲，适合第一次去升龙道。",
    pace: "每天1个主目标",
    logic: "核心思路是把高体力的山岳日和城市日错开，不把一个人旅行排成赶场。",
  },
  slow: {
    title: "少换宿留白版",
    summary: "压低换酒店频率，高山和金泽作为主要基地，适合想慢慢拍照、逛街和泡汤的人。",
    pace: "基地型慢游",
    logic: "用日归替代连续转场，把不确定天气和体力波动留在缓冲日里。",
  },
  photo: {
    title: "摄影优先版",
    summary: "把上高地、白川乡、立山黑部放到更适合光线和天气窗口的位置，清晨出发优先。",
    pace: "清晨出发",
    logic: "好风景尽量放在上午，下午安排转场或城市散步，减少错过光线的概率。",
  },
  budget: {
    title: "经济取舍版",
    summary: "保留最有代表性的温泉、古城和金泽，把高价山岳交通做成天气好才执行的加价模块。",
    pace: "预算优先",
    logic: "把住宿和交通成本压在可控范围内，贵的体验只在天气值得时才上。",
  },
};

const typeColors = {
  nature: "#5d9fbd",
  culture: "#c86d3d",
  onsen: "#d5a542",
  city: "#2c4d73",
};

function $(selector) {
  return document.querySelector(selector);
}

function createEl(tag, className, html) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html !== undefined) el.innerHTML = html;
  return el;
}

function renderRoute(modeKey = "balanced") {
  const mode = routeModes[modeKey];
  const summary = $("#routeSummary");
  summary.innerHTML = `
    <div class="summary-panel">
      <h3>${mode.title}</h3>
      <p>${mode.copy}</p>
    </div>
    <div class="summary-metrics">
      ${mode.metrics
        .map(
          ([value, label]) => `
          <div class="metric">
            <strong>${value}</strong>
            <span>${label}</span>
          </div>
        `,
        )
        .join("")}
    </div>
  `;

  const timeline = $("#timeline");
  timeline.innerHTML = mode.days
    .map(([day, place, title, items, sleep, transit], index) => {
      const accent = ["#2d5f55", "#c86d3d", "#5d9fbd", "#d5a542"][index % 4];
      return `
        <article class="day-card" style="--accent:${accent}">
          <div class="day-top">
            <span class="day-no">${day}</span>
            <span class="pill">${place}</span>
          </div>
          <h3>${title}</h3>
          <ul class="day-list">
            ${items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          <div class="day-meta">
            <span><strong>住宿：</strong>${sleep}</span>
            <span><strong>交通：</strong>${transit}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderMap() {
  const pinLayer = $("#mapPins");
  pinLayer.innerHTML = locations
    .map(
      (loc) => `
      <g class="map-pin" data-id="${loc.id}" data-type="${loc.type}" tabindex="0" role="button" aria-label="${loc.name}，评分${loc.score}">
        <circle class="pin-dot" style="--pin:${typeColors[loc.type]}" cx="${loc.x}" cy="${loc.y}" r="21"></circle>
        <text class="pin-score" x="${loc.x}" y="${loc.y}">${loc.score.toFixed(1)}</text>
        <text class="pin-label" x="${loc.x + 28}" y="${loc.y + 7}">${loc.name}</text>
      </g>
    `,
    )
    .join("");

  pinLayer.querySelectorAll(".map-pin").forEach((pin) => {
    pin.addEventListener("click", () => selectPlace(pin.dataset.id));
    pin.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPlace(pin.dataset.id);
      }
    });
  });

  document.querySelectorAll(".map-tools input").forEach((input) => {
    input.addEventListener("change", filterPins);
  });

  selectPlace("kamikochi");
}

function filterPins() {
  const enabled = new Set(
    Array.from(document.querySelectorAll(".map-tools input:checked")).map((input) => input.value),
  );
  document.querySelectorAll(".map-pin").forEach((pin) => {
    pin.setAttribute("aria-hidden", enabled.has(pin.dataset.type) ? "false" : "true");
  });
}

function selectPlace(id) {
  const loc = locations.find((item) => item.id === id) || locations[0];
  document.querySelectorAll(".map-pin").forEach((pin) => {
    pin.classList.toggle("active", pin.dataset.id === id);
  });

  $("#placePanel").innerHTML = `
    <div class="place-score"><strong>${loc.score.toFixed(1)}</strong><span>/10</span></div>
    <h3>${loc.name}<span class="muted-name"> · ${loc.jp}</span></h3>
    <p>${loc.vibe}</p>
    <div class="place-facts">
      <div class="fact-row"><span>停留</span><strong>${loc.stay}</strong></div>
      <div class="fact-row"><span>住宿</span><strong>${loc.base}</strong></div>
      <div class="fact-row"><span>交通</span><strong>${loc.transport}</strong></div>
      <div class="fact-row"><span>穿搭</span><strong>${loc.clothing}</strong></div>
    </div>
    <div class="tag-row">
      ${loc.highlights.map((item) => `<span class="tag">${item}</span>`).join("")}
    </div>
  `;
}

function renderCompare() {
  $("#compareGrid").innerHTML = compareCards
    .map(
      (card) => `
      <article class="compare-card ${card.featured ? "featured" : ""}">
        <span class="tag">${card.tag}</span>
        <h3>${card.title}</h3>
        <p>${card.body}</p>
        <ul>${card.points.map((point) => `<li>${point}</li>`).join("")}</ul>
      </article>
    `,
    )
    .join("");
}

function hotelActionLinks(hotel) {
  const query = encodeURIComponent(`${hotel.name} ${hotel.base} Japan`);
  return {
    official: `https://www.google.com/search?q=${query}%20official%20hotel`,
    booking: `https://www.booking.com/searchresults.html?ss=${query}`,
    agoda: `https://www.agoda.com/search?text=${query}`,
    maps: `https://www.google.com/maps/search/?api=1&query=${query}`,
  };
}

function renderHotels(activeBase = hotels[0]?.base || "全部") {
  const baseOptions = Array.from(new Set(hotels.map((hotel) => hotel.base)));
  const bases = [...baseOptions, "全部"];
  const currentBase = bases.includes(activeBase) ? activeBase : baseOptions[0] || "全部";
  const tabs = $("#hotelTabs");
  tabs.innerHTML = bases
    .map(
      (base) => `
      <button class="mode-button ${base === currentBase ? "active" : ""}" type="button" data-base="${base}">
        ${base}
      </button>
    `,
    )
    .join("");

  tabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => renderHotels(button.dataset.base));
  });

  const shown = currentBase === "全部" ? hotels : hotels.filter((hotel) => hotel.base === currentBase);
  $("#hotelGrid").innerHTML = shown
    .map((hotel) => {
      const links = hotelActionLinks(hotel);
      return `
      <article class="hotel-card ${hotel.best ? "best" : ""}">
        <div class="hotel-top">
          <div>
            <span class="hotel-base">${hotel.base}</span>
            <h3>${hotel.name}</h3>
          </div>
          <span class="hotel-score"><small>适合度</small>${hotel.score.toFixed(1)}</span>
        </div>
        <div class="hotel-meta">
          <div><span>价格</span><strong>${hotel.price}</strong></div>
          <div><span>位置</span><strong>${hotel.location}</strong></div>
        </div>
        <p class="hotel-review">${hotel.review}</p>
        <div class="hotel-note">${hotel.note}</div>
        <div class="hotel-actions" aria-label="${hotel.name} 订房链接">
          <a href="${links.official}" target="_blank" rel="noreferrer">官网</a>
          <a href="${links.booking}" target="_blank" rel="noreferrer">Booking</a>
          <a href="${links.agoda}" target="_blank" rel="noreferrer">Agoda</a>
          <a href="${links.maps}" target="_blank" rel="noreferrer">地图</a>
        </div>
      </article>
    `;
    })
    .join("");
}

function renderTraffic() {
  $("#trafficTable").innerHTML = trafficRows
    .map(
      ([route, mode, duration, alt, note]) => `
      <tr>
        <td><strong>${route}</strong></td>
        <td>${mode}</td>
        <td>${duration}</td>
        <td>${alt}</td>
        <td>${note}</td>
      </tr>
    `,
    )
    .join("");

  $("#passAdvice").innerHTML = passAdvice
    .map(
      (item) => `
      <div class="pass-item">
        <strong>${item.title}</strong>
        <p>${item.body}</p>
      </div>
    `,
    )
    .join("");
}

function renderBuilder() {
  const initialState = readBuilderState();
  $("#builderChecks").innerHTML = builderOptions
    .map(([value, label]) => {
      const checked = initialState.selected.includes(value) ? "checked" : "";
      return `<label><input type="checkbox" value="${value}" ${checked} /> <span>${label}</span></label>`;
    })
    .join("");

  $("#travelStyle").value = initialState.style;
  $("#builderChecks").addEventListener("change", handleBuilderInput);
  $("#travelStyle").addEventListener("change", handleBuilderInput);
  updateBuilder();
}

function handleBuilderInput() {
  builderExpanded = false;
  updateBuilder();
}

function normaliseBuilderState(state) {
  const validOptions = new Set(builderOptions.map(([value]) => value));
  const selected =
    Array.isArray(state?.selected) && state.selected.length
      ? state.selected.filter((value) => validOptions.has(value))
      : defaultBuilderSelection;
  const style = builderProfiles[state?.style] ? state.style : "balanced";
  return { selected, style };
}

function readBuilderState() {
  const params = new URLSearchParams(location.search);
  if (params.has("style") || params.has("keep")) {
    return normaliseBuilderState({
      style: params.get("style"),
      selected: (params.get("keep") || "").split(",").filter(Boolean),
    });
  }

  try {
    const saved = JSON.parse(localStorage.getItem("shoryudo-builder") || "null");
    if (saved) return normaliseBuilderState(saved);
  } catch (error) {
    localStorage.removeItem("shoryudo-builder");
  }

  return normaliseBuilderState({ selected: defaultBuilderSelection, style: "balanced" });
}

function getBuilderState() {
  return normaliseBuilderState({
    selected: Array.from(document.querySelectorAll("#builderChecks input:checked")).map((input) => input.value),
    style: $("#travelStyle").value,
  });
}

function saveBuilderState(state) {
  localStorage.setItem("shoryudo-builder", JSON.stringify(state));
}

function buildCustomDays(selected, style) {
  const has = (key) => selected.has(key);
  const budgetTateyama = style === "budget" && has("tateyama");
  const days = [
    {
      place: "名古屋",
      title: "抵达与补给",
      items: ["上海飞名古屋，优先中部国际机场进出", "名铁进市区，办理交通卡/取现金", "晚上只安排便利店、药妆或近酒店晚餐"],
      sleep: "名古屋",
      transit: "机场到市区约30-45分钟",
    },
    {
      place: "名古屋",
      title: has("shopping") ? "城市适应与购物打底" : "城市适应与庭园散步",
      items: has("shopping")
        ? ["名古屋城或德川园二选一", "荣商圈、大须商店街先踩点", "把大件购物留到D11，今天只熟悉价格"]
        : ["名古屋城或德川园慢逛", "热田神宫/四间道二选一", "晚上吃味噌猪排或鳗鱼饭"],
      sleep: "名古屋",
      transit: "地铁+步行，控制第一段体力",
    },
    has("onsen")
      ? {
          place: "下吕温泉",
          title: "经济温泉体验",
          items:
            style === "budget"
              ? ["名古屋到下吕，优先日归温泉或平价温泉酒店", "温泉街足汤、飞驒川散步", "不追求一泊二食，把预算留给交通和美食"]
              : ["名古屋到下吕，住一晚温泉酒店或做日归温泉", "温泉街、足汤、合掌村民家园轻松走", "晚上早点休息，为高山段留体力"],
          sleep: style === "slow" ? "下吕/高山" : "下吕温泉",
          transit: "JR特急或高速巴士，尽量白天抵达",
        }
      : {
          place: "高山",
          title: "跳过温泉，直接进入飞驒",
          items: ["名古屋直接到高山", "下午三町古街轻量散步", "晚餐安排飞驒牛或朴叶味噌"],
          sleep: "高山",
          transit: "少一段停留，换来更低住宿成本",
        },
    {
      place: "高山",
      title: "古城人文日",
      items: ["宫川朝市早逛", "高山阵屋和三町古街", "下午留给咖啡、小店、民艺馆"],
      sleep: "高山",
      transit: "全天步行友好，适合慢拍细节",
    },
    {
      place: "高山/飞驒古川",
      title: style === "photo" && has("kamikochi") ? "上高地前夜准备" : "飞驒慢游缓冲",
      items:
        style === "photo" && has("kamikochi")
          ? ["上午飞驒古川或高山老街补拍", "下午采购次日轻食和雨具", "确认上高地巴士时刻，早点睡"]
          : ["飞驒古川半日，适合安静街景和水渠", "天气不好则留在高山咖啡/小店", "这天不塞远距离移动"],
      sleep: has("kamikochi") && style === "photo" ? "高山或平汤" : "高山",
      transit: "短距离JR/巴士，作为机动日",
    },
    has("kamikochi")
      ? {
          place: "上高地",
          title: "河谷摄影与山景日",
          items:
            style === "photo"
              ? ["尽量早班车进上高地", "大正池到河童桥慢拍，光线好再走明神池", "下午回高山/平汤，避免夜间赶路"]
              : ["大正池、田代池、河童桥为主线", "体力好再加明神池", "雨天改高山市内或新穗高缆车判断"],
          sleep: style === "slow" ? "高山" : "高山或平汤",
          transit: "巴士进出，红叶季建议提前查班次",
        }
      : {
          place: has("shirakawa") ? "白川乡" : "奥飞驒/高山",
          title: has("shirakawa") ? "合掌村半日" : "删掉上高地后的轻量山景",
          items: has("shirakawa")
            ? ["高山到白川乡，上午拍荻町合掌村", "避开正午人流，先上展望台再回村里", "下午回高山或继续去金泽"]
            : ["高山周边慢游，或选新穗高缆车看天气执行", "保留半天休息和洗衣", "如果想补自然景观，可临时加平汤/奥飞驒"],
          sleep: has("kanazawa") && has("shirakawa") ? "金泽" : "高山",
          transit: "用短线替代完整山岳日",
        },
    has("shirakawa") && has("kanazawa")
      ? {
          place: "白川乡/金泽",
          title: "世界遗产转场",
          items: ["高山出发到白川乡，行李尽量寄存或轻装", "荻町合掌村2-3小时足够", "下午进金泽，晚上东茶屋街或近江町周边吃饭"],
          sleep: "金泽",
          transit: "浓飞/北铁巴士建议预约",
        }
      : has("kanazawa")
        ? {
            place: "金泽",
            title: "进入美学城市",
            items: ["高山到金泽，下午不要排太满", "东茶屋街或主计町茶屋街散步", "晚餐选海鲜、关东煮或居酒屋"],
            sleep: "金泽",
            transit: "巴士转场日，下午做轻量城市散步",
          }
        : has("tateyama")
          ? {
              place: "富山",
              title: "为立山黑部靠近入口",
              items: ["高山到富山，减少次日山岳压力", "富山玻璃美术馆或富山城址公园", "晚餐吃富山湾寿司"],
              sleep: "富山",
              transit: "把长交通拆开，降低误车风险",
            }
          : {
              place: "松本",
              title: "城下町替代线",
              items: ["高山到松本", "中町通、绳手通轻逛", "晚上住车站附近，方便回名古屋"],
              sleep: "松本",
              transit: "不上金泽/富山时，用松本收束路线",
            },
    has("kanazawa")
      ? {
          place: "金泽",
          title: "兼六园与美术馆",
          items: ["早上兼六园，人少也更好拍", "21世纪美术馆提前看展览预约", "下午近江町市场、武家屋敷或茶屋街二选一"],
          sleep: "金泽",
          transit: "城市日，适合穿好看一点拍照",
        }
      : has("tateyama")
        ? {
            place: "富山",
            title: "富山海鲜与山岳准备",
            items: ["玻璃美术馆、岩濑老街或环水公园", "确认立山黑部天气和行李转送", "早点休息，次日不要临时改太多"],
            sleep: "富山",
            transit: "前泊富山，换来更稳的山岳日",
          }
        : {
            place: "松本",
            title: "松本城与街区慢游",
            items: ["松本城上午拍", "中町通、绳手通、咖啡店", "下午可回名古屋或继续住松本"],
            sleep: "松本",
            transit: "城市节奏轻，适合替代山岳日",
          },
    has("tateyama")
      ? {
          place: "富山",
          title: budgetTateyama ? "立山黑部执行判断" : "立山黑部前泊准备",
          items: budgetTateyama
            ? ["早上查山上能见度和预算", "晴天再执行室堂折返或全线穿越", "阴雨则改富山市内，把钱省下来"]
            : ["金泽/高山转富山，整理轻装包", "确认阿尔卑斯路线票务和行李寄送", "晚上吃寿司，早点睡"],
          sleep: "富山",
          transit: "这天的作用是给山岳线留成功率",
        }
      : has("kanazawa")
        ? {
            place: "金泽/加贺",
            title: "金泽第二天或近郊温泉",
            items: ["想慢就留金泽补茶屋街、市场和小店", "想泡汤可日归加贺温泉乡", "晚上可住金泽或回名古屋"],
            sleep: style === "slow" ? "金泽" : "名古屋",
            transit: "不上立山黑部时，这天用于休整",
          }
        : {
            place: "名古屋",
            title: "回到城市做收尾",
            items: ["松本/高山回名古屋", "下午轻购物或咖啡", "整理行李和退税清单"],
            sleep: "名古屋",
            transit: "提前回大城市，返程压力更低",
          },
    has("tateyama")
      ? {
          place: budgetTateyama ? "富山/松本" : "立山黑部",
          title: budgetTateyama ? "可选山岳日或城市替代" : "山岳穿越日",
          items: budgetTateyama
            ? ["晴天：富山到室堂折返，或全线到松本", "雨天：富山城市线/金泽补完", "不要为了打卡在低能见度时硬上山"]
            : ["富山到立山，室堂、大观峰、黑部水坝", "穿越到信浓大町再去松本", "这天票价高、时间长，必须早出发"],
          sleep: "松本",
          transit: "全程公共交通，务必按官方时刻表执行",
        }
      : {
          place: has("kanazawa") ? "松本/名古屋" : "名古屋",
          title: "城下町收尾或提前购物",
          items: has("kanazawa")
            ? ["金泽到松本或直接回名古屋", "如果去松本，主打松本城和老街", "如果想省体力，直接回名古屋购物"]
            : ["名古屋市内补完", "荣、名站、大须按购物清单走", "晚上整理行李"],
          sleep: "名古屋",
          transit: "把返程前一晚放在名古屋更稳",
        },
    {
      place: "名古屋",
      title: has("shopping") ? "购物与美食收尾" : "低强度收尾日",
      items: has("shopping")
        ? ["名站/荣集中采购药妆、衣服和伴手礼", "午餐安排鳗鱼饭、味噌猪排或咖啡甜点", "晚上提前打包，确认返程交通"]
        : ["热田神宫、四间道或丰田产业技术纪念馆三选一", "找一家舒服的咖啡店收尾", "晚上提前打包，确认返程交通"],
      sleep: "名古屋",
      transit: "住名站或荣，方便最后一天去机场",
    },
    {
      place: "名古屋/上海",
      title: "返程日",
      items: ["按航班时间去中部国际机场", "预留退税、托运和交通误差", "如果是晚班机，可上午补买伴手礼"],
      sleep: "返程",
      transit: "名铁到机场约30-45分钟",
    },
  ];

  return days.map((day, index) => ({ ...day, day: `D${index + 1}` }));
}

function summariseStays(days) {
  return days
    .filter((day) => day.sleep !== "返程")
    .reduce((stays, day) => {
      const last = stays[stays.length - 1];
      if (last?.base === day.sleep) {
        last.nights += 1;
      } else {
        stays.push({ base: day.sleep, nights: 1 });
      }
      return stays;
    }, []);
}

function buildCustomPlan(state) {
  const selected = new Set(state.selected);
  const profile = builderProfiles[state.style] || builderProfiles.balanced;
  const days = buildCustomDays(selected, state.style);
  const stays = summariseStays(days);
  const labels = state.selected.map((value) => builderOptionLabels[value]).filter(Boolean);
  const fitScore = Math.min(
    96,
    Math.max(
      78,
      84 +
        state.selected.length * 2 +
        (selected.has("kamikochi") && selected.has("kanazawa") ? 3 : 0) -
        (state.style === "budget" && selected.has("tateyama") ? 3 : 0),
    ),
  );
  const budgetLevel =
    state.style === "budget"
      ? selected.has("tateyama")
        ? "中：立山黑部做可选"
        : "低-中"
      : selected.has("tateyama")
        ? "中-高：山岳交通另留预算"
        : "中";
  const weatherFlex = selected.has("tateyama")
    ? "需要1个晴天窗口"
    : selected.has("kamikochi")
      ? "雨天可退回高山/奥飞驒"
      : "整体较稳定";

  const reasons = [profile.logic];
  if (selected.has("kamikochi") && selected.has("tateyama")) {
    reasons.push("上高地和立山黑部分开放，中间用金泽/富山做缓冲，避免连续两天高强度山岳交通。");
  }
  if (selected.has("onsen")) {
    reasons.push("温泉放在前半段，下吕或平价日归都能体验，不会挤压后面山景和城市时间。");
  }
  if (selected.has("shirakawa")) {
    reasons.push("白川乡适合作为高山到金泽的转场点，不建议单独为了它多折返一次。");
  }
  if (!selected.has("kamikochi")) {
    reasons.push("删掉上高地后，自然摄影感会下降，建议用新穗高、奥飞驒或松本周边补一个山景半日。");
  }
  if (state.style === "budget") {
    reasons.push("省钱版把昂贵体验变成条件执行，晴天和值得拍时再花钱，阴雨就转城市线。");
  }

  const cautions = [];
  if (selected.has("tateyama")) cautions.push("立山黑部票价和耗时都高，出发前一天必须查能见度、运行情况和行李转送。");
  if (selected.has("kamikochi")) cautions.push("上高地红叶季巴士容易满，建议至少提前一天确认班次，清晨出发体验最好。");
  if (selected.has("shirakawa")) cautions.push("白川乡到金泽/高山的巴士建议预约，行李越少越舒服。");
  if (state.style === "slow") cautions.push("慢游版会减少打卡数量，如果想加入立山黑部，最好牺牲一个城市缓冲日。");
  if (cautions.length === 0) cautions.push("这版比较稳，重点是把住宿订在车站附近，减少一个人拖行李的压力。");

  return {
    profile,
    title: `${profile.title}：${labels.length ? labels.join(" + ") : "基础城市慢游"}`,
    days,
    stays,
    fitScore,
    metrics: [
      ["匹配重点", labels.length ? labels.join("、") : "城市慢游"],
      ["住宿基地", Array.from(new Set(stays.map((stay) => stay.base))).join(" → ")],
      ["换宿压力", `${Math.max(stays.length - 1, 0)}次左右`],
      ["预算压力", budgetLevel],
      ["天气弹性", weatherFlex],
    ],
    reasons,
    cautions,
  };
}

function makeBuilderShareUrl(state) {
  const url = new URL(location.href);
  url.searchParams.set("style", state.style);
  url.searchParams.set("keep", state.selected.join(","));
  url.hash = "builder";
  return url.toString();
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function applyBuilderState(state) {
  const normalised = normaliseBuilderState(state);
  document.querySelectorAll("#builderChecks input").forEach((input) => {
    input.checked = normalised.selected.includes(input.value);
  });
  $("#travelStyle").value = normalised.style;
  updateBuilder();
}

function bindBuilderActions(state) {
  $("#toggleBuilderDetails")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const fold = $("#builderFold");
    const expanded = !fold.classList.contains("expanded");
    builderExpanded = expanded;
    fold.classList.toggle("expanded", expanded);
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "收起详细路线" : "展开查看完整12天路线、取舍理由和执行提醒";
    if (!expanded) {
      $("#builderResult").scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });

  $("#copyBuilderLink")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    try {
      await copyText(makeBuilderShareUrl(state));
      button.textContent = "已复制链接";
      setTimeout(() => {
        button.textContent = "复制分享链接";
      }, 1600);
    } catch (error) {
      button.textContent = "复制失败，请手动复制地址栏";
    }
  });

  $("#resetBuilder")?.addEventListener("click", () => {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "builder";
    history.replaceState(null, "", url.toString());
    localStorage.removeItem("shoryudo-builder");
    builderExpanded = false;
    applyBuilderState({ selected: defaultBuilderSelection, style: "balanced" });
  });
}

function updateBuilder() {
  const state = getBuilderState();
  const plan = buildCustomPlan(state);
  saveBuilderState(state);
  const expandedClass = builderExpanded ? "expanded" : "";
  $("#builderResult").innerHTML = `
    <div class="result-head">
      <div>
        <span class="result-kicker">智能路线建议</span>
        <h3>${plan.title}</h3>
        <p>${plan.profile.summary}</p>
      </div>
      <div class="result-badge"><strong>${plan.fitScore}</strong><span>匹配度</span></div>
    </div>
    <div class="result-metrics">
      ${plan.metrics
        .map(
          ([label, value]) => `
          <div>
            <span>${label}</span>
            <strong>${value}</strong>
          </div>
        `,
        )
        .join("")}
    </div>
    <div class="result-fold ${expandedClass}" id="builderFold">
      <div class="result-section">
        <h4>住宿节奏</h4>
        <div class="stay-plan">
          ${plan.stays.map((stay) => `<span>${stay.base}<strong>${stay.nights}晚</strong></span>`).join("")}
        </div>
      </div>
      <div class="result-section">
        <h4>12天逐日建议</h4>
        <div class="result-days">
          ${plan.days
            .map(
              (day) => `
              <article class="custom-day">
                <div class="custom-day-top">
                  <span>${day.day}</span>
                  <strong>${day.place}</strong>
                </div>
                <h5>${day.title}</h5>
                <ul>${day.items.map((item) => `<li>${item}</li>`).join("")}</ul>
                <p><strong>住宿：</strong>${day.sleep}<br><strong>交通：</strong>${day.transit}</p>
              </article>
            `,
            )
            .join("")}
        </div>
      </div>
      <div class="result-section result-note">
        <h4>为什么这样排</h4>
        <ul>${plan.reasons.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="result-section result-warning">
        <h4>执行提醒</h4>
        <ul>${plan.cautions.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="result-glass-fade">
        <button type="button" id="toggleBuilderDetails" aria-expanded="${builderExpanded}">
          ${builderExpanded ? "收起详细路线" : "展开查看完整12天路线、取舍理由和执行提醒"}
        </button>
      </div>
    </div>
    <div class="result-actions">
      <button type="button" id="copyBuilderLink">复制分享链接</button>
      <button type="button" id="resetBuilder">恢复默认</button>
    </div>
  `;
  bindBuilderActions(state);
}

function renderChecklist() {
  const saved = JSON.parse(localStorage.getItem("shoryudo-checklist") || "[]");
  $("#checklist").innerHTML = checklistItems
    .map((item, index) => {
      const checked = saved.includes(index) ? "checked" : "";
      return `<label><input type="checkbox" data-index="${index}" ${checked} /> <span>${item}</span></label>`;
    })
    .join("");

  $("#checklist").addEventListener("change", () => {
    const checked = Array.from(document.querySelectorAll("#checklist input:checked")).map((input) =>
      Number(input.dataset.index),
    );
    localStorage.setItem("shoryudo-checklist", JSON.stringify(checked));
  });
}

function initModes() {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".mode-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderRoute(button.dataset.mode);
    });
  });
}

function init() {
  renderRoute();
  renderMap();
  renderCompare();
  renderHotels();
  renderTraffic();
  renderBuilder();
  renderChecklist();
  initModes();
  if (location.hash) {
    requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView();
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
