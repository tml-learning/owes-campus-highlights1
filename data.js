window.OWES_DATA = {
  school: {
    title: "漚汪國小探索園區",
    subtitle: "深耕課程創新 × 扎根品格成長｜活力慢跑運動逛校園 3D 模型",
    fullName: "臺南市將軍區漚汪國民小學",
    heroSlogan: "廣達設計學習 × 宏達品格實踐 × 多元潛能開發",
    heroDesc: "為孩子打造一個充滿創意、合作、溝通、思辨及好品格的學習樂園",
    address: "725 臺南市將軍區忠興里 194 號（胡蘿蔔之鄉・漚汪）",
    phone: "06-7942012",
    url: "https://www.owes.tn.edu.tw",
    highlightsUrl: "https://sites.google.com/owes.tn.edu.tw/school-highlights/%E9%A6%96%E9%A0%81",
    mediaUrl: "https://www.owes.tn.edu.tw/modules/school/index.php?op=all_links",
    coords: { lat: 23.199, lon: 120.158, place: "臺南將軍" }
  },

  quotes: [
    ["深耕課程創新，扎根品格成長，為孩子打造充滿創意與好品格的學習樂園。", "漚汪國小願景"],
    ["透過探究、行動實踐與同儕合作，培養思辨、溝通、合作、創意的 4C 核心素養。", "廣達設計學習計畫"],
    ["Head 認知、Heart 情意、Hand 行動——讓每個漚汪學子成為溫暖且有力量的人。", "3H 品格實踐學校"],
    ["從將軍紅蘿蔔田到世界舞台，深入了解家鄉故事，傳承漚汪在地記憶。", "PBL 在地連結課程"],
    ["禮貌、堅毅、勇氣、感恩、自制、負責、正向、尊重——八大核心價值伴孩子成長。", "漚汪八大品格核心"],
    ["適性揚才，發掘每位孩子的獨特亮點，讓天賦在藝文、體育、語言與科技中自由翱翔。", "多元社團發展"],
    ["從產地到餐桌的食農教育，讓孩子懂得惜食感恩，擁有強健體魄與自信笑容。", "漚汪食農健康課程"]
  ],

  // 3 Campus Miniature Diorama Renders uploaded for Ouwang Elementary School
  campusModels: [
    {
      id: "model-front",
      stationId: "vision",
      badge: "校區模型 01｜校門與前庭院落",
      title: "漚汪國小正門・孔子銅像圓環・前庭為三合院校舍",
      shortTitle: "正門三合院校舍",
      img: "assets/images/campus_model_front.jpg",
      desc: "展現漚汪國民小學經典的前庭為三合院校舍格局；前庭中央為四瓣綠茵環繞的至聖先師孔子銅像圓環，兩側庭園點綴長頸鹿、斑馬與石雕。",
      highlights: ["漚汪國民小學校門", "孔子銅像圓環草坪", "前庭為三合院校舍", "庭園生態動物與石雕"]
    },
    {
      id: "model-track",
      stationId: "teams",
      badge: "校區模型 02｜運動場與校園地標",
      title: "PU 跑道操場・足球草坪・司令台・「我愛漚汪 I ❤️ OUWANG」地標",
      shortTitle: "操場與 I❤️OUWANG",
      img: "assets/images/campus_model_track.jpg",
      desc: "俯瞰漚汪國小寬闊的 PU 環狀跑道與中央翠綠足球草坪，北側為教學大樓與升旗司令台，東側矗立繽紛的「我愛漚汪 I ❤️ OUWANG」立體彩虹字標與卡通學童公仔，是田徑晨練、草坪踢足球與校慶聖火繞境的核心場域。",
      highlights: ["我愛漚汪 I❤️OUWANG 地標", "標準環狀 PU 跑道", "中央翠綠草坪踢足球", "升旗司令台與運動場域"]
    },
    {
      id: "model-court",
      stationId: "facilities",
      badge: "校區模型 03｜綠能運動與共融遊戲區",
      title: "太陽能光電風雨球場・紅蘿蔔主題溜滑梯・木屋砂坑遊戲場",
      shortTitle: "光電球場與共融遊戲場",
      img: "assets/images/campus_model_court.jpg",
      desc: "呈現漚汪國小最受孩子喜愛的綠能與遊憩專區：右側為橘色鋼構、馬卡龍防撞柱包覆的「太陽能光電風雨籃球場」；左側則設有融入在地將軍胡蘿蔔意象的「紅蘿蔔主題溜滑梯共融遊戲場」、立定跳遠地墊與「木造樹屋砂坑溜滑梯」。",
      highlights: ["太陽能光電風雨籃球場", "紅蘿蔔主題溜滑梯", "木造樹屋砂坑遊戲場", "安全防撞柱與綠茵草地"]
    }
  ],

  // 8 3D Stations arranged inside the Ouwang Elementary School Campus around the PU Running Track & Courtyard
  stations: [
    {
      id: "vision",
      code: "STATION 01",
      kind: "核心主站",
      name: "學校願景站",
      short: "學校願景",
      icon: "🏫",
      color: "#d9531e",
      grass: "#68a652",
      position: [0, 0, 14.2],
      tagline: "深耕課程創新・扎根品格成長｜有品卓越、創藝設計、國際數位、食農健康",
      sceneDesc: "漚汪國小正門與前庭為三合院校舍環抱著孔子銅像四瓣圓環草坪，師生們在紅磚中庭廣場熱情揮手、慢跑運動與晨間共讀。",
      carrotTitle: "願景領航紅蘿蔔",
      carrotStory: "生長於前庭為三合院校舍與孔子銅像圓環旁，象徵漚汪國小「有品卓越、創藝設計、國際數位、食農健康」四大教育願景向下扎根、向上茁壯！",
      campusModelImg: "assets/images/campus_model_front.jpg",
      campusModelTitle: "漚汪國小正門・孔子銅像圓環・前庭為三合院校舍模型",
      visionImage: "assets/images/img_01.jpg",
      visionImageFallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXesK9r7MGMw2lg7pdXY22rw1UY6r3QeynRNs1Tj0Z_8XaNajp0PwTAIZyKtucmfVrti5yu15STKX8PJisq6uKD5j6qfpL5irqG2F2l1crAE6naSuFAKbnihWbH_AqkTi1Y?key=ta0rJGZEJGL9j01MurQi7g",
      intro: [
        "臺南市將軍區漚汪國小座落於素有「胡蘿蔔之鄉」美譽的漚汪聚落，是將軍區歷史最悠久、人文底蘊最深厚的教育搖籃。學校以「深耕課程創新、扎根品格成長」為核心教育願景，致力於將在地文化資產轉化為孩子帶得走的終身素養。",
        "我們串聯「廣達設計學習」、「宏達品格實踐」與「多元潛能開發」三大教育引擎，全面建構「有品卓越」、「創藝設計」、「國際數位」與「食農健康」四大課程主軸，為孩子打造一個充滿創意、合作、溝通、思辨及好品格的學習樂園。",
        "在漚汪國小，學習不再侷限於課本：孩子們走進紅蘿蔔田體驗食農生命教育、深入社區走讀探索家鄉文史、站上策展舞台向大眾自信表達，從家鄉土地出發，昂首邁向寬廣的世界。"
      ],
      chips: ["有品卓越", "創藝設計", "國際數位", "食農健康", "廣達設計學習", "宏達品格實踐", "多元潛能開發"],
      facts: [
        { label: "核心願景面向", value: "4", unit: "大主軸" },
        { label: "品格核心價值", value: "8", unit: "項指標" },
        { label: "關鍵素養能力", value: "4C", unit: "全方位" }
      ],
      deepDive: [
        {
          icon: "🌟",
          title: "四大核心願景藍圖",
          subtitle: "有品卓越 × 創藝設計 × 國際數位 × 食農健康",
          content: "以「有品卓越」奠定做人處事的品德根基；以「創藝設計」激發跨域實作與美感創造力；以「國際數位」培養雙語溝通與 AI 科技素養；以「食農健康」結合將軍胡蘿蔔產業與體適能運動，鍛鍊強健體魄與感恩惜食之心。",
          tags: ["全人教育", "四大願景", "素養導向"]
        },
        {
          icon: "🚀",
          title: "三大教學推進引擎",
          subtitle: "廣達設計學習 × 宏達品格實踐 × 多元潛能開發",
          content: "引進廣達文教基金會「設計思考」翻轉課堂，結合宏達文教基金會「3H 品格教育」深耕日常行為，並透過藝文、體育、語言、科技四大領域社團發掘每位孩子的獨特天賦，落實「適性揚才」。",
          tags: ["基金會共好", "翻轉教學", "適性揚才"]
        },
        {
          icon: "🥕",
          title: "在地文史與胡蘿蔔之鄉認同",
          subtitle: "越在地・越國際的校本特色課程",
          content: "將軍區漚汪擁有全台知名的紅蘿蔔產業與深厚人文歷史底蘊。學校將社區變成大教室，帶領學童進行老街走讀、耆老訪談、紅蘿蔔採收與文史說書策展，讓孩子對家鄉產生深厚認同與自信。",
          tags: ["將軍胡蘿蔔", "漚汪文史", "社區共學"]
        }
      ],
      features: [
        "以學生為中心，建構「有品卓越、創藝設計、國際數位、食農健康」四大完整學習圖像",
        "融合將軍漚汪在地文史與農業特色（紅蘿蔔產業、社區文史走讀），深耕家鄉認同",
        "串聯廣達文教基金會與宏達文教基金會資源，推動 PBL 專題探究與 3H 品格實踐",
        "打造兼具太陽能光電球場、86 吋智慧教室與育英書院圖書館的永續美感校園"
      ],
      cards: [
        {
          title: "校園微縮模型｜正門・孔子銅像圓環・前庭為三合院校舍",
          desc: "漚汪國小正門與前庭為三合院校舍立體模型，中央為至聖先師孔子銅像圓環與綠茵步道，兩側庭園點綴長頸鹿、斑馬與石雕。",
          img: "assets/images/campus_model_front.jpg",
          fallback: "assets/images/campus_model_front.jpg",
          icon: "🏫"
        },
        {
          title: "漚汪國小學校願景圖",
          desc: "結合有品卓越、創藝設計、國際數位、食農健康四大願景主軸，培育具備思辨、溝通、合作、創意與好品格的未來人才。",
          img: "assets/images/img_01.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXesK9r7MGMw2lg7pdXY22rw1UY6r3QeynRNs1Tj0Z_8XaNajp0PwTAIZyKtucmfVrti5yu15STKX8PJisq6uKD5j6qfpL5irqG2F2l1crAE6naSuFAKbnihWbH_AqkTi1Y?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "🎯"
        }
      ],
      chart: {
        title: "學校願景四大核心課程涵蓋率（%）",
        unit: "%",
        items: [
          { label: "有品卓越（品格）", value: 100 },
          { label: "創藝設計（PBL）", value: 96 },
          { label: "國際數位（雙語科技）", value: 94 },
          { label: "食農健康（在地體能）", value: 98 }
        ]
      },
      link: "https://www.owes.tn.edu.tw"
    },
    {
      id: "curriculum",
      code: "STATION 02",
      kind: "課程創新",
      name: "課程創新站",
      short: "課程創新",
      icon: "💡",
      color: "#e06318",
      grass: "#6eab54",
      position: [14.2, 0, 9.5],
      tagline: "廣達「創發教學新動力」× PBL 任務導向學習 × Design Thinking 設計思考",
      sceneDesc: "廣達設計學習館與「小小說書人」繪本策展舞台前，多位小小說書人手持繪本生動開講，創客小隊圍繞工作台熱烈實作、擊掌歡呼。",
      carrotTitle: "創意說書紅蘿蔔",
      carrotStory: "誕生於廣達設計學習工坊與小小說書人策展舞台旁，代表漚汪學子具備思辨、溝通、合作與創意的 4C 創客精神！",
      intro: [
        "漚汪國小與廣達文教基金會深度合作，推動「創發教學新動力」計畫，以「Project-Based Learning（PBL）任務導向學習」與「Design Thinking 設計思考」作為校訂課程設計的核心理論基礎。",
        "教師團隊為孩子設計「有使命感的真實學習任務」，引導學生從發現問題、田野踏查、資料整理、原型動手實作到公開策展發表。在探究與同儕合作的歷程中，自然養成思辨（Critical Thinking）、溝通（Communication）、合作（Collaboration）與創意（Creativity）的 4C 核心素養。",
        "最具代表性的在地課程中，學生化身為「漚汪小小說書人」，深入探究家鄉故事與傳統文史記憶，並親自設計展版與立體模型，自信地向市長、貴賓與社區民眾陳述策展歷程。"
      ],
      chips: ["PBL 任務導向學習", "Design Thinking 設計思考", "廣達創發教學新動力", "小小說書人", "家鄉文史走讀", "策展發表", "4C 核心素養"],
      facts: [
        { label: "核心素養", value: "4C", unit: "關鍵能力" },
        { label: "課程模組", value: "4", unit: "大歷程" },
        { label: "教學卓越獎", value: "特優", unit: "全市肯定" }
      ],
      deepDive: [
        {
          icon: "📖",
          title: "在地連結：漚汪小小說書人 × 家鄉故事傳承",
          subtitle: "走讀家鄉文史，傳承百年在地記憶",
          content: "帶領學生走出教室，探訪漚汪傳統聚落與社區長輩，研讀許獻平老師等在地文史著作，認識家鄉歷史脈絡與先民奮鬥精神。孩子們將文史知識轉化為生動的說書劇本與繪本，擔任家鄉文化的最佳代言人。",
          tags: ["在地文史", "小小說書人", "家鄉故事"]
        },
        {
          icon: "🛠️",
          title: "Design Thinking 設計思考 × 動手實作",
          subtitle: "同理心 → 定義問題 → 創意發想 → 原型實作 → 測試策展",
          content: "透過跨領域課程（結合語文、社會、自然與藝術），讓孩子不只是「聽課」，而是拿起工具動手繪圖、切割、組裝與修正，將腦海中的抽象創意轉化為具體可見的立體作品與解決方案。",
          tags: ["設計思考", "跨領域實作", "創客精神"]
        },
        {
          icon: "🎤",
          title: "創意策展發表 × 團隊合作凝聚力",
          subtitle: "自信面對市長與大眾，展現偏鄉學子超凡表達力",
          content: "每學期舉辦主題策展發表會，由學生分工擔任策展人、導覽員與空間設計師。在專題研究過程中學習傾聽、協調與互助，面對市長與外賓提問時更能侃侃而談，展現令人驚豔的自信與團隊默契。",
          tags: ["公開策展", "口語表達", "團隊協作"]
        }
      ],
      features: [
        "在地連結：漚汪小小說書人分享家鄉故事與傳統文化，讓孩子深入了解家鄉脈絡，傳承在地記憶",
        "創意展現：學生自信地向市長與大眾陳述策展歷程，展現 PBL 專題研究的豐碩成果與團隊合作精神",
        "動手實作：透過跨領域學習，實際動手製作，將創意與想法轉化為實體作品呈現",
        "團隊合作：在專題研究過程中，學生學習溝通、協調與分工，共同完成使命任務，凝聚班級向心力",
        "卓越肯定：連年榮獲臺南市教學卓越發展計畫校訂課程深耕組「特優」與課程研發組「優等」"
      ],
      cards: [
        {
          title: "在地連結｜小小說書人分享家鄉故事",
          desc: "漚汪小小說書人分享家鄉傳統文化與生命故事，透過生動肢體與語言讓孩子深入了解家鄉脈絡，傳承在地記憶。",
          img: "assets/images/img_02.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfLalY5k47GXLpjsJz4-X8QKjnyg4bToMNIb_V9rxHiqnn8mDEUGX1ZlY5T-QZiDDjCYzGEPP4VFlp9EPbHCWRpylQO-B_0hCExF-wuGIniYDOtutqwo5znHIjZ4qPjrg?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "📖"
        },
        {
          title: "創意展現｜向市長自信陳述 PBL 策展歷程",
          desc: "學生自信地向市長與大眾陳述策展歷程，展現 PBL 專題研究的豐碩成果、思辨能力與團隊合作精神。",
          img: "assets/images/img_03.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXeSmIIrAQCYkkDWwHhJHZiwKjFFjGg32dhXas4X2zsVcS_h4k7hsTYC6JKf-7WpTUcXcwUslx_MtzTWKj--f3ptm4Yx08xPcIEf4lQDA9vnzN86bRuUMdmmqehC8lud0Jg?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "💡"
        },
        {
          title: "動手實作｜跨領域原型製作與美感創作",
          desc: "透過跨領域學習與設計思考工具，學生親自動手丈量、繪製與製作，將創意與想法轉化為實體呈現。",
          img: "assets/images/img_04.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdKLzmD-msgPPdu6wUdPMfpeDq5V8c8kP3cLQ_-h8ZdGj6ewL2-_1CHDU7YPB7DKL0lVNxRzZBVDZ4ABD1NIQBNEOGezj0WW6ahdeeWRolSOMOm0d1SQA6EgeofQY-sSA4?key=6gxBHb4iqcW_1X4EmeocyA",
          icon: "🛠️"
        },
        {
          title: "團隊合作｜同儕共學與專題分工討論",
          desc: "在專題研究過程中，學生學習溝通、協調與分工，共同解決問題並完成任務，高度凝聚班級向心力。",
          img: "assets/images/img_05.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdS-wK0xkt7hNUSecLVcy9WwP0lcfG64RZHk7SKSwYfLuUOKMQKCcc4RY26iE1wYDRR7sfwm1EQdLbjtpp689INuowcr1nkdswHhM3nZy6BWKxcszzaBnpL0K3QGrqwsBc?key=6gxBHb4iqcW_1X4EmeocyA",
          icon: "🤝"
        }
      ],
      chart: {
        title: "4C 核心素養課程指標達成度",
        unit: "分",
        items: [
          { label: "Critical 思辨力", value: 95 },
          { label: "Communication 溝通", value: 96 },
          { label: "Collaboration 合作", value: 98 },
          { label: "Creativity 創造力", value: 97 }
        ]
      },
      extraLink: {
        label: "漚汪設計學習成果網",
        url: "https://sites.google.com/owes.tn.edu.tw/pbl?usp=sharing&pli=1&authuser=0"
      },
      link: "https://sites.google.com/owes.tn.edu.tw/school-highlights/%E9%A6%96%E9%A0%81"
    },
    {
      id: "character",
      code: "STATION 03",
      kind: "品格教育",
      name: "品格教育站",
      short: "品格教育",
      icon: "💛",
      color: "#d99b08",
      grass: "#72af56",
      position: [15.2, 0, -1.8],
      tagline: "Frayer Model × 3H（Head 認知・Heart 情意・Hand 行動）× 八大核心價值",
      sceneDesc: "品格實踐廣場環繞著八大核心價值木柱，眾多師生在「好品德大讚美」愛心舞台前跳躍鼓掌、做活力健康操，傳遞溫暖與感恩。",
      carrotTitle: "溫暖有品紅蘿蔔",
      carrotStory: "守護在 3H 品格愛心舞台旁，凝聚「禮貌、堅毅、勇氣、感恩、自制、負責、正向、尊重」八大品格核心價值，讓善行在校園發光！",
      intro: [
        "漚汪國小深信「品格是孩子一生最珍貴的資產」，長年與宏達文教基金會合作推動品格實踐學校計畫，致力於將抽象的道德概念轉化為孩子看得見、聽得懂、做得到的具體日常行為。",
        "學校創新導入「Frayer Model（弗雷爾模型）」思考工具建構班級品格，引導孩子從定義、特徵、生活範例與非範例進行深度思辨，落實 3H——Head（品德認知）、Heart（品德情意）、Hand（品德行動）的全方位學習。",
        "圍繞著「禮貌、堅毅、勇氣、感恩、自制、負責、正向、尊重」八大核心品格價值，學校定期舉辦「好品德大讚美」公開表揚、品格小劇場與感恩服務學習，讓善行在校園每個角落發光，更連續榮獲 113、114 學年度「臺南市品德教育特色學校」殊榮！"
      ],
      chips: ["禮貌", "堅毅", "勇氣", "感恩", "自制", "負責", "正向", "尊重", "Frayer Model", "3H 全方位學習"],
      facts: [
        { label: "品格核心價值", value: "8", unit: "大指標" },
        { label: "全方位學習", value: "3H", unit: "知情行" },
        { label: "品德特色學校", value: "連年", unit: "全市獲獎" }
      ],
      deepDive: [
        {
          icon: "🧠",
          title: "Frayer Model 四格思考法 × 3H 品格建構",
          subtitle: "讓品格教育不再只是口號，而是全班共同討論出的行動準則",
          content: "各班師生共同運用 Frayer Model 海報，針對每月的品格主題討論「什麼是負責？」「負責的人有哪些特徵？」「在校園裡哪些行為是負責（正例）？哪些是不負責（反例）？」，達成 Head 認知、Heart 認同、Hand 實踐。",
          tags: ["Frayer Model", "3H 知情行", "班級經營"]
        },
        {
          icon: "🌟",
          title: "好品德大讚美 × 正向激勵文化",
          subtitle: "看見孩子的每一個微小善行，營造溫暖互助校園",
          content: "於兒童朝會定期舉辦「好品德大讚美」，由師長與同儕公開分享並慶賀同學的優良品德具體事蹟（如主動幫助同學、誠實拾金不昧、堅持完成練習），建立自信與見賢思齊的楷模風氣。",
          tags: ["好品德大讚美", "楷模學習", "正向心理"]
        },
        {
          icon: "💛",
          title: "八大核心品格學習圖像",
          subtitle: "禮貌・堅毅・勇氣・感恩・自制・負責・正向・尊重",
          content: "結合視覺化的品格吉祥物與學習圖像，將八大核心價值融入家庭聯絡簿、社區關懷、母親節奉茶與社團團隊訓練之中，達成親師生三方共學共好，期許每位漚汪學子成為溫暖且有力量的人。",
          tags: ["八大核心價值", "親師生共學", "品德特色學校"]
        }
      ],
      features: [
        "Frayer Model 教學策略：帶領學生從定義、特徵、範例與非範例深入建構班級品格 3H（認知・情意・行動）",
        "品格大讚美：定期舉辦好品德大讚美活動，公開慶賀並表揚學生具體的好品德表現",
        "品格學習共同成長：教師專業學習社群共備品格教案，引導孩子在真實生活情境中探索品德核心價值",
        "八項品格核心學習圖像：將「禮貌、堅毅、勇氣、感恩、自制、負責、正向、尊重」全面融入校園日常",
        "全市典範肯定：連續榮獲 113 學年度、114 學年度「臺南市品德教育特色學校」"
      ],
      cards: [
        {
          title: "Frayer Model｜建構班級品格 3H",
          desc: "運用 Frayer Model 教學策略，引導師生共同討論定義與具體行為，建構班級品格 3H (Head認知 / Heart情意 / Hand行動)。",
          img: "assets/images/img_06.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcCX1BlKJbRuBSUqR9cNhUsBXrSKVGbcwUFuH1jukqWAg3EiZqTiQ2QsuzNqTyoqHI1RnNpCQ3_LVBjE9yxLVrUiydlxxGVCBnjsh7EJkBQ9mBGYQ6X5NmOboTK0-1o2sE?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "🤝"
        },
        {
          title: "品格大讚美｜慶賀學生好品德表現",
          desc: "定期舉辦「好品德大讚美」公開表揚活動，慶賀學生具體好品德表現，讓溫暖善行在校園中發光發熱。",
          img: "assets/images/img_07.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcygXiSeDExwPmmw6lLUXk7H_QocvBU_6oEwhF6p2Rzj5pH4rfWawriWKtwjktMdfI9ZBSxbhliRr2bdvTMTHN3VqvCLBVqjLlwkpi44KAM63QKtjDFXqRFWqRIkCxidEg?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "🌟"
        },
        {
          title: "品格學習共同成長｜親師生攜手實踐",
          desc: "透過 Frayer Model 引導孩子探索品德核心價值，結合小組討論與分享，讓親師生在品格路上攜手共同成長。",
          img: "assets/images/img_08.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfq2FU8GZ1-RXSSZR8kOtCCdrEkHNurdRcjH-6mvxKAP_MUjLMAqewxoYsrldT0O1b0pzOP1VxNFpDpemHFwGZU1o4mWrcrAne4k9AwuomwnUeQrrTbmTDuo75Xho0E3V4?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "🌱"
        },
        {
          title: "品格圖像｜八大品格核心價值",
          desc: "建構鮮明的八項品格核心學習圖像：禮貌、堅毅、勇氣、感恩、自制、負責、正向、尊重，陪伴孩子每日實踐。",
          img: "assets/images/img_09.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXczV7Ts0M_Wd03xvkdDX2mmZI29MvLzXnK5mEVOpPTDSuEGekcruCTzhaiyfRn3W6a79hdDgedx_M0UGYkr8QywhMwlljLWGpKLXwNH4JgwzBBfa4PPMOt7YV2a00F59eM?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "💛"
        }
      ],
      chart: {
        title: "3H 品格教育實踐面向達成率",
        unit: "%",
        items: [
          { label: "Head 品德認知", value: 96 },
          { label: "Heart 品德情意", value: 98 },
          { label: "Hand 生活行動", value: 97 },
          { label: "楷模學習內化", value: 95 }
        ]
      },
      extraLink: {
        label: "漚汪SEL學習網",
        url: "https://sites.google.com/owes.tn.edu.tw/owsel?usp=sharing"
      },
      link: "https://sites.google.com/owes.tn.edu.tw/school-highlights/%E9%A6%96%E9%A0%81"
    },
    {
      id: "teams",
      code: "STATION 04",
      kind: "多元社團",
      name: "多元社團站",
      short: "多元社團",
      icon: "🥁",
      color: "#db3b88",
      grass: "#64a44e",
      position: [10.8, 0, -13.2],
      tagline: "適性揚才｜涵蓋藝文、體育、語言與科技四大領域，讓天賦自由翱翔",
      sceneDesc: "緊鄰 PU 環校跑道與「我愛漚汪 I ❤️ OUWANG」彩色立體地標，太鼓隊奮力擊鼓、樂隊演奏手風琴、舞蹈隊翩翩起舞，田徑隊在跑道上奔馳接力！",
      carrotTitle: "多元展能紅蘿蔔",
      carrotStory: "佇立於 PU 跑道與「我愛漚汪 I ❤️ OUWANG」地標旁，為太鼓隊、舞蹈隊、兒童樂隊、田徑隊、英語讀劇與 AI 機器人小將熱情喝采！",
      campusModelImg: "assets/images/campus_model_track.jpg",
      campusModelTitle: "漚汪國小 PU 跑道操場・司令台與「我愛漚汪 I ❤️ OUWANG」地標模型",
      intro: [
        "漚汪國小秉持「適性揚才、多元展能」的教育理念，深信每個孩子都有屬於自己的舞台。學校積極引進專業師資，開設涵蓋「藝文、體育、語言、科技」四大領域的高品質特色社團與代表隊。",
        "在藝文領域，舞蹈隊以曼妙身姿連年榮獲全國學生舞蹈比賽優等，吳彩華老師指導的太鼓隊以雷霆鼓聲震撼全場，兒童樂隊則在合奏中培養深厚音樂素養；在體育領域，田徑隊不畏烈日晨練，於跳高、競走與馬拉松接力屢奪全市冠軍與團體總錦標。",
        "在語言與科技領域，英語讀者劇場團隊以流利口說與戲劇表現勇奪臺南市【特優】桂冠；樂高 AI 機器人團隊則透過機構設計與邏輯編程訓練，代表學校征戰 AI 機器人全國賽榮獲佳作，讓偏鄉學子自信接軌國際與未來科技！"
      ],
      chips: ["舞蹈團隊", "田徑團隊", "兒童樂隊", "太鼓團隊", "樂高機器人", "英語讀劇團隊", "藝文・體育・語言・科技"],
      facts: [
        { label: "社團發展領域", value: "4", unit: "大領域" },
        { label: "重點代表團隊", value: "6", unit: "大團隊" },
        { label: "全國與市賽表現", value: "特優", unit: "屢創佳績" }
      ],
      deepDive: [
        {
          icon: "💃",
          title: "藝文展演：舞蹈隊 × 太鼓隊 × 兒童樂隊",
          subtitle: "力與美的結合，在全國舞台綻放藝術自信",
          content: "舞蹈隊深耕民俗舞與現代舞，連續於 112、114 學年度榮獲「全國學生舞蹈比賽優等」；太鼓隊由吳彩華老師指導，以整齊劃一的鼓點培養專注力與氣勢；兒童樂隊則透過分部與合奏練習，陶冶音樂美感與團隊默契。",
          tags: ["全國舞蹈優等", "震撼太鼓", "兒童樂隊合奏"]
        },
        {
          icon: "🏃",
          title: "體育競技：田徑代表隊 × 馬拉松接力",
          subtitle: "鍛鍊堅毅意志，勇奪女乙組總錦標冠軍與接力第一",
          content: "田徑隊每日利用晨間與課後時光進行系統化體能與技術訓練，在跳高、競走、短跑及耐力跑項目表現傑出，不僅勇奪國小田徑賽女乙組團體總錦標【冠軍】，更在全市馬拉松接力班際對抗賽摘下【第一名】。",
          tags: ["田徑總錦標冠軍", "馬拉松接力第一", "堅毅品格"]
        },
        {
          icon: "🤖",
          title: "語文與科技：英語讀者劇場 × 樂高 AI 機器人",
          subtitle: "雙語口說接軌世界，邏輯編程邁向 AI 未來",
          content: "英語讀劇團隊透過角色扮演與發音語調訓練，勇奪 114 學年度臺南市英語讀者劇場比賽【特優】；樂高機器人社團結合積木機構與電腦程式邏輯，榮獲 114 年 AI 機器人全國賽中年級組【佳作】。",
          tags: ["英語讀劇特優", "AI機器人全國賽", "雙語科技"]
        }
      ],
      features: [
        "舞蹈團隊：民俗舞、現代舞屢獲全國學生舞蹈比賽與全市優等佳績，展現學生的肢體美感與舞台自信",
        "田徑團隊：田徑隊勤奮練習，在馬拉松接力、跳高及競走等項目表現亮眼，榮獲女乙組總錦標冠軍",
        "兒童樂隊：透過日常合奏練習，孩子們不僅學會樂器演奏技巧，更培養深厚的藝術涵養與團隊默契",
        "太鼓團隊：由吳彩華老師指導，透過震撼人心的鼓聲展現氣勢，培養學生高度專注力與合作精神",
        "樂高機器人：透過樂高機器人組裝與電腦程式邏輯訓練，榮獲 AI 機器人全國賽佳作，自信接軌未來科技",
        "英語讀劇團隊：學生以流利的英語口說與生動聲音表情演繹故事，勇奪臺南市英語讀者劇場比賽特優"
      ],
      cards: [
        {
          title: "校園微縮模型｜PU 跑道操場與「我愛漚汪 I ❤️ OUWANG」地標",
          desc: "俯瞰漚汪國小標準 PU 環狀跑道、中央翠綠草坪、升旗司令台與彩色「我愛漚汪 I ❤️ OUWANG」立體字標模型。",
          img: "assets/images/campus_model_track.jpg",
          fallback: "assets/images/campus_model_track.jpg",
          icon: "🏟️"
        },
        {
          title: "舞蹈團隊｜全國學生舞蹈比賽優等",
          desc: "民俗舞、現代舞屢獲全國與全市優等佳績，透過汗水與堅持展現學生的肢體美感與舞台自信。",
          img: "assets/images/img_10.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfAEyge7mgoCeAsR2giMkNyeKmJFzoUBhOrmSaKYbY1SoHGLVqgDuD0wGF67yGmJKpDRm3OpbQN3QJPy_nWi5rCcorSBgaGYeNAIxQW17PaRdR1K0CcJz1klcjDgZlDLYQ?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "💃"
        },
        {
          title: "田徑團隊｜總錦標冠軍與馬拉松接力第一",
          desc: "田徑隊不畏烈日勤奮練習，在馬拉松接力、跳高及競走等項目表現亮眼，鍛鍊出永不放棄的運動家精神。",
          img: "assets/images/img_11.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXehbo1ZXuvmR2IKJmGjBZvGLyJB0YmTIf0TL3sAC5DIKH_gkLtvIaiwzblmTwgBAAneS8H0WZg-QxAPofKNvvH5j2nMaO1iJhpmztpc6JjsXlMhiwp_dKzXUYOD-Rm3bw?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "🏃"
        },
        {
          title: "兒童樂隊｜合奏默契與音樂涵養",
          desc: "透過合奏練習，孩子們不僅學會了多樣樂器技巧，更在彼此傾聽中培養了深厚的藝術涵養與團隊默契。",
          img: "assets/images/img_12.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXewoPqaW5sYy7iOo1rdCJ7yXFvBBAKo_ahUcdyqcxzPoobr4BLJ1gSz1W5UJEYW1ASFvs5QPG_WoLekm4GFIAaqwLaueK-1WWnoyFCYOCDyMUQDr6SdqsAqkHWjxxhZSv0?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "🎵"
        },
        {
          title: "太鼓團隊｜震撼鼓聲與專注氣勢",
          desc: "由吳彩華老師指導，透過震撼人心的鼓聲展現磅礡氣勢，培養學生專注力、節奏感與團隊合作精神。",
          img: "assets/images/img_13.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcXYVmOyPWSUbfqrydcSNB6jgE_YySgivZ94Smg1jxglO0GCcHEDTn534MzX-VhQI475dJq84ZPCQWyrZb24hKtDNA2o9rryrS-uGSckFi9hNCAWMscUy-ukoTcuuR7AnQ?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "🥁"
        },
        {
          title: "樂高機器人｜AI 邏輯編程全國賽佳作",
          desc: "透過樂高機器人與電腦課程的邏輯訓練，讓漚汪的孩子動手解決問題，自信接軌國際與未來 AI 科技趨勢。",
          img: "assets/images/img_14.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXejpuJ3FVvvNWKvdplpXEmfqAHfVA2hR_6N6Ma6CL89nkZIFQuO4nQC1x3_uBnEnJG4KAxGSd6lZti1J6iQqLlHSrrf9e0-JKMdP8OnfgJMJd1rSOUI2UnMhXGwH4sobXU?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "🤖"
        },
        {
          title: "英語讀劇團隊｜全市英語讀者劇場特優",
          desc: "學生以流利的英語口說與生動的聲音表情演繹故事，勇奪臺南市英語讀者劇場比賽特優與優等佳績。",
          img: "assets/images/img_15.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXctzgx0MSTNWtIlnGhZmDACtrKy4Ofp-GPRfUAhHCQcT0LWD-2fAajqlwZhsUKgXL91fz9s4ECJwe-KkfCA252PPWssNgG53cpGPqVPRecU5TMLCb7VjI2O0td-AgFNVb8?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "🎭"
        }
      ],
      chart: {
        title: "多元社團四大領域參與熱度",
        unit: "%",
        items: [
          { label: "藝文（舞/樂/鼓）", value: 98 },
          { label: "體育（田徑/馬拉松）", value: 95 },
          { label: "語言（英語讀劇）", value: 94 },
          { label: "科技（樂高機器人）", value: 92 }
        ]
      },
      link: "https://sites.google.com/owes.tn.edu.tw/school-highlights/%E9%A6%96%E9%A0%81"
    },
    {
      id: "facilities",
      code: "STATION 05",
      kind: "優質環境",
      name: "優質環境站",
      short: "優質環境",
      icon: "☀️",
      color: "#0d9468",
      grass: "#5e9e4c",
      position: [-15.2, 0, -1.5],
      tagline: "體育館羽球場 × 光電球場 × 86吋智慧教室 × 育英書院圖書館 × 公益資源連結",
      sceneDesc: "現代化體育館內學生們揮拍對打羽球、橘色鋼構太陽能光電球場下活力運球投籃，旁側紅蘿蔔主題溜滑梯与木屋砂坑遊戲場上孩子們歡樂奔跑！",
      carrotTitle: "綠能書香紅蘿蔔",
      carrotStory: "沐浴在體育館、太陽能光電球場與育英書院圖書館的陽光下，見證漚汪國小融合羽球與籃球運動、86 吋智慧教室與雲水書車的優質環境！",
      campusModelImg: "assets/images/campus_model_court.jpg",
      campusModelTitle: "漚汪國小體育館・太陽能光電球場・紅蘿蔔主題溜滑梯與樹屋砂坑模型",
      intro: [
        "漚汪國小積極爭取中央與地方政府經費，並廣泛鏈結民間公益與藝文資源，致力於為孩子打造「安全、智慧、綠能且具美感」的現代化學習環境。",
        "在硬體建設上，學校擁有寬敞明亮的「室內體育館（羽球場）」、結合綠能發電與全天候運動空間的「太陽能光電球場」、全新 PU 跑道與足球草坪、明亮通風的「性別友善美感廁所」，以及班班配置「86 吋觸控互動大電視與可調式課桌椅」的智慧教室，讓運動鍛鍊與數位互動學習無縫融入每一天。",
        "在軟體與書香人文方面，校內擁有溫馨典雅的「育英書院圖書館」與「靜思書軒」，更定期迎來佛光山「雲水書車」與博物館行動列車駐校；同時引進「藝術進區」（表演家合作劇團、身聲劇場蒞校演出），並承辦將軍區五校聯合健檢、結合國際同濟會圓夢計畫與普光慈善協會，用滿滿的愛心守護每一位漚汪學童！"
      ],
      chips: ["體育館羽球場", "光電球場", "86吋智慧教室", "美感性別友善廁所", "藝術進區", "公益連結", "育英書院圖書館", "雲水書車"],
      facts: [
        { label: "智慧教室螢幕", value: "86", unit: "吋觸控" },
        { label: "聯合健檢服務", value: "5", unit: "校承辦" },
        { label: "軟硬體亮點", value: "7", unit: "大建設" }
      ],
      deepDive: [
        {
          icon: "🏸",
          title: "室內體育館羽球場 × 綠能光電球場 × 86 吋智慧教室",
          subtitle: "風雨無阻的羽球與籃球運動場域，科技互動的現代化課堂",
          content: "寬敞的室內體育館設有標準羽球場地，讓學生不受日曬雨淋盡情揮拍切磋球技；搭配高聳的太陽能光電籃球場，提供全天候多元運動空間。各班教室更全面升級 86 吋觸控螢幕與可調式課桌椅，大幅提升學童專注度與數位互動效率。",
          tags: ["體育館羽球場", "太陽能光電球場", "86吋觸控大屏"]
        },
        {
          icon: "📚",
          title: "育英書院圖書館 × 雲水書車 × 靜思書軒",
          subtitle: "打造處處可讀、時時悅讀的書香人文校園",
          content: "紀念在地先賢與傳承文風的「育英書院」圖書館空間溫馨舒適，搭配慈濟靜思書軒、佛光山如展翅海鷗般的「雲水書車」行動圖書車以及各大博物館行動列車入校，讓孩子在草地與書香間自在探索知識寶庫。",
          tags: ["育英書院", "雲水書車", "靜思書軒"]
        },
        {
          icon: "❤️",
          title: "藝術進區展演 × 五校聯合健檢 × 公益圓夢",
          subtitle: "匯聚社會溫暖力量，豐富偏鄉學子的文化與健康福祉",
          content: "邀請「表演家合作劇團」、「身聲劇場」等知名劇團走進校園演出，讓孩子近距離體驗表演藝術魅力；學校更主動承辦將軍區五校聯合健康檢查，並攜手同濟會圓夢計畫、普光慈善協會等公益團體，全方位照顧學童身心需求。",
          tags: ["藝術進區", "五校聯合健檢", "同濟會與普光公益"]
        }
      ],
      features: [
        "室內體育館與光電球場：設有室內體育館羽球場與太陽能光電籃球場，讓學生風雨無阻打羽球、打籃球，鍛鍊強健體魄",
        "智慧教室：配置 86 吋觸控互動電視與可調式課桌椅，打造數位共學的優質學習環境",
        "美感廁所：建置性別友善廁所與美感廁所，採光明亮、自然通風，徹底翻轉傳統校園廁所印象",
        "書香校園：擁有優質的育英書院圖書館，並結合雲水書車、靜思書軒及博物館行動列車，拓展閱讀視野",
        "藝術進區：表演家合作劇團、身聲劇場等專業藝術團體蒞校演出，讓孩子在校內近距離接觸表演藝術",
        "公益連結：承辦將軍區五校健檢，並結合社會資源如同濟會圓夢計畫、普光慈善協會，溫暖照顧學童需求"
      ],
      cards: [
        {
          title: "校園微縮模型｜太陽能光電風雨球場與紅蘿蔔共融遊戲場",
          desc: "橘色鋼構太陽能光電籃球場、紅蘿蔔主題溜滑梯共融遊戲場、立定跳遠地墊與木造樹屋砂坑溜滑梯立體模型。",
          img: "assets/images/campus_model_court.jpg",
          fallback: "assets/images/campus_model_court.jpg",
          icon: "☀️"
        },
        {
          title: "光電球場｜綠能發電與全天候運動場域",
          desc: "結合太陽能綠能與運動空間的光電球場，提供全天候遮陽避雨的舒適活動場域，讓孩子風雨無阻盡情揮汗。",
          img: "assets/images/img_16.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdMfalwwAu6XDW6V9H3p5I8D6GUdz7fwsHNni1srPUWnXJUvbpjk_7Kh0jluDYoCsjtJ4sGGKPCSTjkFu1Bc2YDbE6ZNj6Tw95WYMbSv3Q-t01gvvgwV8cZzifLosMz05c?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "☀️"
        },
        {
          title: "智慧教室｜86 吋觸控大屏與可調式課桌椅",
          desc: "班班配置 86 吋高畫質觸控電視與可調式課桌椅，結合平板教學，打造數位互動的優質學習環境。",
          img: "assets/images/img_17.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd60djZof8NH77f4UNtd83hB7gNN3CA2Yi6X789boPe49iesjcYfqXUAXqQLLZoXAHc9ETKQZ1u1SKG8bHUbgOLMfxuWlMO3BktZi-Zt2z1wFL_XPq1fsEV8dFMAWcRneU?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "📺"
        },
        {
          title: "美感廁所｜明亮通風的性別友善空間",
          desc: "建置性別友善廁所與美感廁所，融合自然採光與美學設計，明亮通風，擺脫傳統廁所印象。",
          img: "assets/images/img_18.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXdG9zf1iHWlHTEjwChfiOXc736M8XBfTERNH21i85lg68-VqEsg1amAV-sgwiBUGrQXHePDKdZJO3-SStTch4lDYnPkXhcUWANJS5l_phNLu7-6QGRkoGwP941RZBbHE5U?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "✨"
        },
        {
          title: "藝術進區｜知名劇團蒞校近距離演出",
          desc: "表演家合作劇團、身聲劇場等專業藝術團體蒞校演出，透過互動式劇場讓孩子近距離接觸表演藝術。",
          img: "assets/images/img_19.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXed-gL7NLaUl6i8JlB5Ar5XIbjJjASui-ZHdrnN289OjOD6Tz4_hauVhXw1CHhdJD2yqv3vJACHZRbeXP2G4GtsFTXeCklvZLACcLRFHgG99XqWBbxa48ExUSu16UNZGw?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "🎭"
        },
        {
          title: "公益連結｜五校聯合健檢與圓夢助學",
          desc: "承辦將軍區五校健檢，並結合社會資源如：同濟會圓夢計畫、普光慈善協會，悉心守護學童健康與成長需求。",
          img: "assets/images/img_20.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXe0-Hgxa0Oh6-eBu5q7v-q7D6_EouQ3FzvPUepDlDXJ-y38LZLn-LBhuCx1OOQHPp3RwGi0AzhRynqaAVpUpegMmVIj4IL36sL-Vh8POGwVmkMgZiM-bCuU3YSGGRXCxqY?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "❤️"
        },
        {
          title: "書香校園｜育英書院與雲水書車伴讀",
          desc: "擁有優質的育英書院圖書館，並結合雲水書車、靜思書軒及博物館行動列車，打造豐富多元的閱讀環境。",
          img: "assets/images/img_21.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfQU89zosBCJqXULCFs4AyMIo2citAEAf7OaCTjnlUBNc_36g2Od-LgV-GJwEVR3V1uaFlCKRE58kdB5z57cjoM7OS1LgsuL3nbdoGpKOItK-E08mYcWACTr5v5dXzuS30?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "📚"
        }
      ],
      chart: {
        title: "校園環境升級覆蓋率",
        unit: "%",
        items: [
          { label: "班班智慧觸控螢幕", value: 100 },
          { label: "全天候綠能運動場", value: 100 },
          { label: "書香閱讀資源整合", value: 98 },
          { label: "美感友善空間改造", value: 96 }
        ]
      },
      link: "https://sites.google.com/owes.tn.edu.tw/school-highlights/%E9%A6%96%E9%A0%81"
    },
    {
      id: "gallery",
      code: "STATION 06",
      kind: "學習花絮",
      name: "學習花絮站",
      short: "學習花絮",
      icon: "🥕",
      color: "#7c4dff",
      grass: "#6aa850",
      position: [-13.8, 0, 10.2],
      tagline: "有品卓越 × 創藝設計 × 國際數位 × 食農健康｜從漚汪紅蘿蔔田到餐桌的童年回憶",
      sceneDesc: "學習體驗館旁體驗農園種滿鮮甜的將軍胡蘿蔔，一群戴著草帽的孩子彎腰拔蘿蔔、高舉大蘿蔔歡呼，旁側還有同學操作數位地球儀與寫生創作。",
      carrotTitle: "食農健康紅蘿蔔",
      carrotStory: "來自「胡蘿蔔之鄉」將軍漚汪的食農體驗田，陪伴孩子親手體驗鬆土、播種與採收，實踐從產地到餐桌的惜食感恩！",
      intro: [
        "漚汪國小的「學習花絮」生動記錄了孩子們在「有品卓越」、「創藝設計」、「國際數位」與「食農健康」四大校本願景面向中的真實學習軌跡與燦爛笑容。",
        "身為臺南市將軍區「胡蘿蔔之鄉」的學子，每年秋冬紅蘿蔔產季，老師們便帶領孩子走入社區農田，親手體驗鬆土、播種、觀察羽狀綠葉生長，直到親手拔起一根根飽滿鮮甜的橘紅蘿蔔！透過「從產地到餐桌」的食農健康教育，孩子們不僅認識家鄉農業經濟，更在料理分享中學會惜食感恩。",
        "與此同時，孩子們在創藝設計課堂上揮灑色彩、在國際數位課程中運用平板與世界對話、在品格活動中實踐孝親感恩。每一個珍貴瞬間，都見證了漚汪學子自信、創意與健康的成長。"
      ],
      chips: ["有品卓越", "創藝設計", "國際數位", "食農健康", "產地到餐桌", "將軍胡蘿蔔食農體驗"],
      facts: [
        { label: "學習花絮主軸", value: "4", unit: "大面向" },
        { label: "在地食農特產", value: "胡蘿蔔", unit: "將軍之光" },
        { label: "學生參與率", value: "100", unit: "%" }
      ],
      deepDive: [
        {
          icon: "🥕",
          title: "食農健康：將軍紅蘿蔔「從產地到餐桌」",
          subtitle: "走進家鄉紅蘿蔔田，親手拔出土地的甜美饋贈",
          content: "結合將軍區農會與在地小農資源，帶領學生實地走入紅蘿蔔田進行食農體驗。從認識紅蘿蔔生長週期、田間採收樂趣、清洗分級到製作營養美味的胡蘿蔔料理，搭配校園健康體適能活動，養成惜食感恩與健康飲食習慣。",
          tags: ["將軍紅蘿蔔", "產地到餐桌", "健康體適能"]
        },
        {
          icon: "🎨",
          title: "創藝設計 × 國際數位：美感實作與全球視野",
          subtitle: "動手創作獨一無二的作品，用數位科技連結世界",
          content: "「創藝設計」融合美感教育與設計思考，引導學生透過繪畫、立體工藝與策展將想像力具體化（榮獲推動藝術與美感深耕績優）；「國際數位」則結合雙語情境、國際文化認識與平板數位工具，拓展孩子的全球視野。",
          tags: ["美感深耕績優", "設計思考創作", "數位素養與國際觀"]
        },
        {
          icon: "⭐",
          title: "有品卓越：生活中的溫暖實踐",
          subtitle: "把尊重、負責與感恩化為日常習慣",
          content: "透過節慶感恩活動、班級自治服務與同儕互助合作，讓孩子在真實生活中演練八大核心品格，展現溫文有禮、自信負責的卓越風範。",
          tags: ["感恩惜福", "自主負責", "全人成長"]
        }
      ],
      features: [
        "有品卓越：透過品格教育與楷模學習，培養孩子負責、尊重與感恩的態度，展現卓越的品德素養",
        "創藝設計：結合美感教育與設計思考，引導學生發揮創意、動手實作，將想像力轉化為獨一無二的作品",
        "國際數位：運用智慧科技與平板輔助學習，接軌國際趨勢，培養學生具備數位素養與全球視野",
        "食農健康：從產地到餐桌的將軍紅蘿蔔食農教育，結合健康體適能活動，讓孩子懂得惜食感恩並擁有強健體魄"
      ],
      cards: [
        {
          title: "有品卓越｜品格實踐與自信風采",
          desc: "透過品格教育與楷模學習，培養孩子負責、尊重與感恩的態度，在日常活動中展現卓越的品德素養。",
          img: "assets/images/img_22.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcUuOd-8gNhmqM7SIRIZ1SVpWq7cuhHSU6aLHzFNrxM8PwFLp6lp89qs9tRpilIA6F25WWbJp0YCsyPDxUJbLugRRyoyLBZQl5PE5CiRpfRZuraAkwEDjUejQY?key=6gxBHb4iqcW_1X4EmeocyA",
          icon: "⭐"
        },
        {
          title: "創藝設計｜美感教育與動手創作",
          desc: "結合美感教育與設計思考，引導學生發揮創意，動手實作，將豐富想像力轉化為獨一無二的藝術作品。",
          img: "assets/images/img_23.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcP0_nesi0oKFbAa9gttJ5xd50yzLB_4s2jRnW_WWrek2QADbZf68JJQ5r9nqk-k_oq1stRcBF91YvVFBBDAvfjwQ6muafIdSauebMiYVIAXnwT8P4gk--Mkc_5X649TQA?key=6gxBHb4iqcW_1X4EmeocyA",
          icon: "🎨"
        },
        {
          title: "國際數位｜智慧科技與全球視野",
          desc: "運用智慧科技輔助學習，接軌國際趨勢，透過雙語與數位工具培養學生具備數位素養與全球視野。",
          img: "assets/images/img_24.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd_CJH0W9vX49DFroTBD7cISAV8bL8goqEOGSbQ2maIMfwGoRw3cwySjqw5rGrYxZoOaU2700cGkskdh9DaYUAt5QvSASGXvwIMMRsjTey-j5YrQZ_W-sfDOF_m8IyAvOg?key=6gxBHb4iqcW_1X4EmeocyA",
          icon: "🌍"
        },
        {
          title: "食農健康｜將軍紅蘿蔔從產地到餐桌",
          desc: "從產地到餐桌的食農教育，結合健康體適能活動，讓孩子親手體驗採收樂趣，懂得惜食感恩並擁有強健體魄。",
          img: "assets/images/img_25.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXchL8qTxgEhxH4TdQ2WvUS5Fm3D4og2EvQa-0Sl7gDdlPFxbBQqGxIOfdcz6MAVsWjJ4xqK_YiCH6lgrTB-AmRENhCSxBhbk5PfOnHoLKETMnIwoET9p8Q7PskJOowlvg?key=6gxBHb4iqcW_1X4EmeocyA",
          icon: "🥕"
        }
      ],
      chart: {
        title: "四大面向主題活動參與滿意度",
        unit: "%",
        items: [
          { label: "有品卓越活動", value: 96 },
          { label: "創藝設計實作", value: 95 },
          { label: "國際數位課程", value: 94 },
          { label: "食農健康體驗", value: 99 }
        ]
      },
      link: "https://sites.google.com/owes.tn.edu.tw/school-highlights/%E9%A6%96%E9%A0%81"
    },
    {
      id: "achievements",
      code: "STATION 07",
      kind: "卓越成果",
      name: "榮譽榜站",
      short: "榮譽榜",
      icon: "🏆",
      color: "#c86d08",
      grass: "#6dad52",
      position: [-10.8, 0, -13.2],
      tagline: "卓越成果・榮耀分享｜111～114 學年度全國與全市競賽大放異彩",
      sceneDesc: "操場北側升旗司令台與榮耀廣場旁矗立著旋轉金盃，奪冠小將們在頒獎台上高舉獎盃跳躍歡呼，台下同學熱烈開合跳喝采！",
      carrotTitle: "卓越榮耀紅蘿蔔",
      carrotStory: "閃耀於金色獎盃廣場旁，見證漚汪國小於 111～114 學年度榮獲教學卓越特優、品德教育特色學校、英語讀劇特優、全國舞蹈優等與田徑總錦標冠軍！",
      intro: [
        "漚汪國小全體師生在課程教學研發、3H 品德實踐、藝文團隊展演、AI 科技創客與體育競技上持續深耕，近四年（111～114 學年度）屢獲全國與臺南市【特優】、【優等】及【總錦標冠軍】等 15 項指標性大獎！",
        "從教師團隊榮獲「臺南市教學卓越發展計畫校訂課程深耕組特優」與連年蟬聯「品德教育特色學校」、「藝術教育貢獻獎績優學校」，到學生團隊勇奪「英語讀者劇場特優」、「全國學生舞蹈比賽優等」、「AI 機器人全國賽佳作」與「田徑女乙組總錦標冠軍」，全方位印證了學校多元適性教育的豐碩成果。",
        "每一座閃耀的獎盃背後，都是師長們無私的陪伴指導與孩子們日復一日不畏艱辛練習的汗水結晶。您可於下方一覽 111～114 學年度每一項榮耀紀錄！"
      ],
      chips: ["英語讀者劇場特優", "品德教育特色學校", "全國舞蹈比賽優等", "教學卓越計畫特優", "藝術教育貢獻獎", "AI機器人全國賽", "田徑總錦標冠軍"],
      facts: [
        { label: "111-114 重點榮譽", value: "15", unit: "項大獎" },
        { label: "最高榮譽等級", value: "特優", unit: "暨冠軍" },
        { label: "涵蓋多元領域", value: "5", unit: "大類別" }
      ],
      deepDive: [
        {
          icon: "🏆",
          title: "114 學年度：六大領域全面綻放",
          subtitle: "語文特優 × 品德典範 × 全國舞蹈 × 教卓優等 × 藝術深耕 × AI 機器人全國賽",
          content: "114 學年度漚汪國小再創高峰：學生勇奪臺南市英語讀者劇場比賽【特優】、全國學生舞蹈比賽【優等】、AI 機器人全國賽中年級組【佳作】；學校團隊則榮獲【臺南市品德教育特色學校】、教學卓越計畫課程研發組【優等】及藝術深耕計畫評選【優等】。",
          tags: ["114學年度", "6項大獎", "文武雙全"]
        },
        {
          icon: "🥇",
          title: "113 學年度：校訂課程深耕組【特優】桂冠",
          subtitle: "在地文史結合 PBL 設計思考，獲全市最高教學肯定",
          content: "113 學年度學校以融合在地文化與 PBL 探究的校訂課程，勇奪臺南市教學卓越發展計畫校訂課程深耕組最高榮譽【特優】，同年並榮獲【臺南市品德教育特色學校】與【藝術教育貢獻獎績優學校】三大校級殊榮。",
          tags: ["113學年度", "教學卓越特優", "藝術教育貢獻獎"]
        },
        {
          icon: "🎖️",
          title: "111–112 學年度：課程翻轉與賽場奪冠",
          subtitle: "廣達設計學習啟航，田徑與全國舞蹈屢創紀錄",
          content: "111 學年度正式成為「廣達設計學習學校」，田徑女將勇奪國小田徑賽女乙組團體總錦標【冠軍】及馬拉松接力班際對抗賽【第一名】；112 學年度則榮獲全國學生舞蹈比賽現代舞【優等】、英語讀者劇場【優等】與推動藝術與美感深耕績優學校。",
          tags: ["111-112學年度", "總錦標冠軍", "廣達設計學習"]
        }
      ],
      features: [
        "114學年度：勇奪英語讀者劇場比賽特優、臺南市品德教育特色學校、全國學生舞蹈比賽優等、教學卓越計畫優等、藝術深耕計畫優等、AI機器人全國賽佳作",
        "113學年度：榮獲教學卓越發展計畫校訂課程深耕組特優、臺南市品德教育特色學校、藝術教育貢獻獎績優學校",
        "112學年度：榮獲全國學生舞蹈比賽現代舞優等、英語讀者劇場比賽優等、推動藝術與美感深耕績優",
        "111學年度：正式成為廣達設計學習學校、勇奪田徑賽女乙組總錦標冠軍、馬拉松接力班際對抗賽第一名"
      ],
      cards: [
        {
          title: "英語讀者劇場比賽｜勇奪全市特優",
          desc: "學生以流利的英語口說、團隊默契與生動的表情演繹故事，勇奪臺南市英語讀者劇場比賽特優佳績。",
          img: "assets/images/img_15.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXctzgx0MSTNWtIlnGhZmDACtrKy4Ofp-GPRfUAhHCQcT0LWD-2fAajqlwZhsUKgXL91fz9s4ECJwe-KkfCA252PPWssNgG53cpGPqVPRecU5TMLCb7VjI2O0td-AgFNVb8?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "🎭"
        },
        {
          title: "全國學生舞蹈比賽｜現代舞與民俗舞優等",
          desc: "舞蹈團隊展現平時辛勤練習成果，在全國賽事舞台上完美展現力與美，連年榮獲全國優等殊榮。",
          img: "assets/images/img_10.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfAEyge7mgoCeAsR2giMkNyeKmJFzoUBhOrmSaKYbY1SoHGLVqgDuD0wGF67yGmJKpDRm3OpbQN3QJPy_nWi5rCcorSBgaGYeNAIxQW17PaRdR1K0CcJz1klcjDgZlDLYQ?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "💃"
        },
        {
          title: "教學卓越發展計畫｜校訂課程深耕組特優",
          desc: "課程設計深度結合漚汪在地文化與廣達 PBL 任務導向學習，學生向市長與來賓介紹學校課程特色。",
          img: "assets/images/img_03.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXeSmIIrAQCYkkDWwHhJHZiwKjFFjGg32dhXas4X2zsVcS_h4k7hsTYC6JKf-7WpTUcXcwUslx_MtzTWKj--f3ptm4Yx08xPcIEf4lQDA9vnzN86bRuUMdmmqehC8lud0Jg?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "🏆"
        },
        {
          title: "AI 機器人全國賽 & 田徑總錦標冠軍",
          desc: "文武兼備、科技領航！田徑隊勇奪女乙組總錦標冠軍，機器人團隊榮獲 AI 機器人全國賽中年級組佳作。",
          img: "assets/images/img_14.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXejpuJ3FVvvNWKvdplpXEmfqAHfVA2hR_6N6Ma6CL89nkZIFQuO4nQC1x3_uBnEnJG4KAxGSd6lZti1J6iQqLlHSrrf9e0-JKMdP8OnfgJMJd1rSOUI2UnMhXGwH4sobXU?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "🤖"
        }
      ],
      chart: {
        title: "111～114 學年度重大榮譽統計（項）",
        unit: "項",
        items: [
          { label: "114 學年度", value: 6 },
          { label: "113 學年度", value: 3 },
          { label: "112 學年度", value: 3 },
          { label: "111 學年度", value: 3 }
        ]
      },
      link: "https://sites.google.com/owes.tn.edu.tw/school-highlights/%E9%A6%96%E9%A0%81"
    },
    {
      id: "media",
      code: "STATION 08",
      kind: "媒體報導",
      name: "媒體報導站",
      short: "媒體報導",
      icon: "📰",
      color: "#2563eb",
      grass: "#60a14d",
      position: [0, 0, -15.2],
      tagline: "漚汪媒體報導專區｜完整收錄 64 篇平面與網路媒體報導・六大主題分類檢索",
      sceneDesc: "校園北側媒體轉播中心旁立著訊號塔與戶外 LIVE 大螢幕，多位校園小記者與攝影師正穿梭記錄同學們慢跑運動與多元學習的精彩瞬間。",
      carrotTitle: "焦點傳媒紅蘿蔔",
      carrotStory: "駐守於校園媒體轉播塔旁，將漚汪國小「炫勇說書人」、親子拔蘿蔔食農遊學、文衡殿祈福與 110 週年校慶等 64 篇溫暖故事傳遞給全世界！",
      intro: [
        "我們將學校「媒體報導專區」共 64 篇歷年新聞報導進行系統化整理，歸納為【🥕 食農與生態】、【💡 課程創新與走讀】、【💛 品格與謝師感恩】、【🎨 藝文雙語與競賽】、【❤️ 公益關懷與獎學金】及【🏫 110校慶與校園盛事】六大主題分類。",
        "從「炫勇說書人」挖掘長輩故事、創作《不老仁商戴榮吉》繪本廣送世界華人學校、打造藍碳生態瓶、親子拔蘿蔔食農遊學，到文衡殿育英書院獎學金、立盈企業與校友會溫暖回饋，每一篇報導都見證著漚汪國小的教育溫度！請直接於下方或切換至「📰 媒體報導」分頁進行分類篩選與閱讀。"
      ],
      chips: ["64篇媒體報導全收錄", "六大主題分類", "炫勇說書人", "不老仁商戴榮吉繪本", "親子拔蘿蔔食農遊學", "藍碳生態瓶", "文衡殿育英書院", "110週年校慶"],
      facts: [
        { label: "收錄媒體報導", value: "64", unit: "篇新聞" },
        { label: "主題分類整理", value: "6", unit: "大類別" },
        { label: "主流新聞媒體", value: "9+", unit: "家報導" }
      ],
      deepDive: [
        {
          icon: "💡",
          title: "課程創新與家鄉走讀（12 篇報導）",
          subtitle: "廣達設計學習 × 炫勇說書人 ×《不老仁商戴榮吉》繪本 × 料理說書人",
          content: "自由時報、聯合報與中華日報深入報導漚汪國小攜手廣達文教基金會推動 PBL「創發教學新動力」：學生化身「炫勇說書人」訪談長輩生命智慧、創作《不老仁商戴榮吉》繪本寄送世界華人學校、製作家鄉走讀摺頁，以及微電影《舊情棉綿》話家鄉摘銀。",
          tags: ["炫勇說書人", "不老仁商戴榮吉繪本", "家鄉走讀摺頁", "廣達設計學習"]
        },
        {
          icon: "🥕",
          title: "食農遊學與藍碳生態（10 篇報導）",
          subtitle: "將軍胡蘿蔔親子採收 × 溪汪料理說書人 × 藍碳生態瓶揭碳秘密",
          content: "多家媒體連年報導漚汪國小結合將軍區農會舉辦「食農遊學營親子拔蘿蔔」、串聯臺南 17 校推動食農遊學地圖、舉辦「溪汪料理說書人—啟動新食代」成果展，並帶領學童打造「藍碳生態瓶」探索淨零碳排的科學秘密。",
          tags: ["親子拔蘿蔔", "溪汪料理說書人", "藍碳生態瓶", "17校食農地圖"]
        },
        {
          icon: "💛",
          title: "品格感恩、文衡殿祈福與謝師傳情（9 篇報導）",
          subtitle: "化身職人代言人 × 感恩教師 Q 版似顏繪 × 文衡殿祈福掛心願",
          content: "國語日報與臺灣時報報導漚汪學童化身「職人代言人」探索責任與韌性的品格力量；教師節繪製「Q 版似顏繪畫像」、指認老師兒時照、寫卡片傳情；歲末更齊聚在地信仰中心「漚汪文衡殿」感恩祈福、懸掛新年心願。",
          tags: ["職人代言人", "Q版似顏繪謝師", "文衡殿感恩祈福", "品德教育"]
        },
        {
          icon: "❤️",
          title: "社會公益、校友回饋與 110 週年校慶（33 篇報導）",
          subtitle: "文衡殿育英書院獎學金 × 立盈企業與大豐棉廠回饋 × 110 週年鐵雕藝術校慶",
          content: "完整記錄漚汪文衡殿長期捐助與頒發「育英書院獎學金」、立盈企業黃順立董事長襄助社團經費、校友會贈暖被、將軍大豐棉廠送午安枕、同濟會捐贈五校籃球、普光慈善協會贈檯燈、佳楠慈善會贊助課輔，以及 110 週年校慶創意排字與校友鐵雕藝術展。",
          tags: ["育英書院獎學金", "校友企業回饋", "110週年校慶", "兒藝節藝起賞"]
        }
      ],
      features: [
        "完整收錄並分類整理學校官網 4 頁共 64 篇平面與網路新聞報導，支援六大分類篩選與關鍵字搜尋",
        "涵蓋《中華日報》、《臺灣時報》、《自由時報》、《聯合新聞網》、《國語日報》、《中時新聞網》、《ETtoday》等主流媒體",
        "串聯「漚汪設計學習成果網 (PBL)」與「漚汪 SEL 社會情緒學習網」兩大專題網站",
        "每篇報導均附有主題分類標籤、媒體出處、重點內容摘要、對應 3D 車站與原文連結"
      ],
      cards: [
        {
          title: "PBL 炫勇說書人与市長互動報導",
          desc: "學生挖掘長輩故事學習生命智慧，並自信向市長與大眾陳述 PBL 策展歷程，獲自由時報、中華日報專題報導。",
          img: "assets/images/img_03.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXeSmIIrAQCYkkDWwHhJHZiwKjFFjGg32dhXas4X2zsVcS_h4k7hsTYC6JKf-7WpTUcXcwUslx_MtzTWKj--f3ptm4Yx08xPcIEf4lQDA9vnzN86bRuUMdmmqehC8lud0Jg?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "📰"
        },
        {
          title: "文衡殿育英書院與公益圓夢報導",
          desc: "紀錄漚汪文衡殿育英書院獎學金、同濟會五校圓夢、普光慈善協會、校友會與在地企業溫暖護學故事。",
          img: "assets/images/img_20.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXe0-Hgxa0Oh6-eBu5q7v-q7D6_EouQ3FzvPUepDlDXJ-y38LZLn-LBhuCx1OOQHPp3RwGi0AzhRynqaAVpUpegMmVIj4IL36sL-Vh8POGwVmkMgZiM-bCuU3YSGGRXCxqY?key=ta0rJGZEJGL9j01MurQi7g",
          icon: "❤️"
        },
        {
          title: "將軍胡蘿蔔食農遊學營親子拔蘿蔔",
          desc: "中華日報、臺灣時報與中時連年報導漚汪國小舉辦親子拔蘿蔔體驗與溪汪料理說書人成果展。",
          img: "assets/images/img_25.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXchL8qTxgEhxH4TdQ2WvUS5Fm3D4og2EvQa-0Sl7gDdlPFxbBQqGxIOfdcz6MAVsWjJ4xqK_YiCH6lgrTB-AmRENhCSxBhbk5PfOnHoLKETMnIwoET9p8Q7PskJOowlvg?key=6gxBHb4iqcW_1X4EmeocyA",
          icon: "🥕"
        },
        {
          title: "臺南兒藝節「藝起賞」與藝術深耕報導",
          desc: "ETtoday 與聯合報報導漚汪國小參與六校夏日美學實驗場、創意市集與 110 週年校慶校友鐵雕藝術展。",
          img: "assets/images/img_19.jpg",
          fallback: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXed-gL7NLaUl6i8JlB5Ar5XIbjJjASui-ZHdrnN289OjOD6Tz4_hauVhXw1CHhdJD2yqv3vJACHZRbeXP2G4GtsFTXeCklvZLACcLRFHgG99XqWBbxa48ExUSu16UNZGw?key=SYwlxJvpb9wQSqmZvVrGtw",
          icon: "🎨"
        }
      ],
      chart: {
        title: "64 篇媒體報導六大主題分布（篇）",
        unit: "篇",
        items: [
          { label: "公益關懷與獎學金", value: 16 },
          { label: "課程創新與走讀", value: 14 },
          { label: "校慶與校園盛事", value: 11 },
          { label: "食農遊學與生態", value: 10 },
          { label: "品格與謝師感恩", value: 9 },
          { label: "藝文雙語與競賽", value: 9 }
        ]
      },
      link: "https://www.owes.tn.edu.tw/modules/school/index.php?op=all_links"
    }
  ],

  // 6 Curated Media Categories
  mediaCategories: [
    {
      id: "all",
      name: "全部報導",
      short: "全部",
      icon: "📰",
      color: "#2563eb",
      desc: "完整收錄漚汪國小 64 篇平面報紙、網路媒體與市府焦點新聞"
    },
    {
      id: "agri",
      name: "食農遊學與生態環境",
      short: "食農生態",
      icon: "🥕",
      color: "#d9531e",
      desc: "將軍胡蘿蔔親子拔蘿蔔體驗、17校食農遊學地圖、溪汪料理說書人、藍碳生態瓶揭碳秘密"
    },
    {
      id: "pbl",
      name: "課程創新與家鄉走讀",
      short: "課程走讀",
      icon: "💡",
      color: "#e06318",
      desc: "廣達設計學習 PBL、炫勇說書人訪談長輩、《不老仁商戴榮吉》繪本、家鄉走讀摺頁、微電影摘銀"
    },
    {
      id: "character",
      name: "品格教育與謝師祈福",
      short: "品格感恩",
      icon: "💛",
      color: "#d99b08",
      desc: "化身職人代言人探索責任韌性、教師節 Q 版似顏繪與兒時照猜謎、文衡殿祈福掛心願、勞權戲劇"
    },
    {
      id: "arts",
      name: "藝文雙語與體育競賽",
      short: "藝文雙語",
      icon: "🎨",
      color: "#db3b88",
      desc: "臺南兒藝節「藝起賞」六校實驗場、萬聖節英語闖關、國際志工文化分享、馬拉松接力與 3對3 籃球"
    },
    {
      id: "charity",
      name: "公益關懷與校友回饋",
      short: "公益回饋",
      icon: "❤️",
      color: "#0d9468",
      desc: "漚汪文衡殿育英書院獎學金、立盈企業襄助社團、校友會贈暖被、大豐棉廠送午安枕、同濟會與普光送愛"
    },
    {
      id: "campus",
      name: "110校慶與校園盛事",
      short: "校慶盛事",
      icon: "🏫",
      color: "#7c4dff",
      desc: "110 週年校慶創意排字、校友鐵雕藝術展與打卡裝置藝術、新生入學禮、市長獎合影、附幼堆蔬菜雪人"
    }
  ],

  // Complete 64 Curated Media Reports from https://www.owes.tn.edu.tw/modules/school/index.php?op=all_links (Pages 1-4)
  mediaArticles: [
    // --- 🥕 食農遊學與生態環境 (agri) ---
    {
      id: "m01",
      category: "agri",
      station: "gallery",
      source: "中華日報",
      title: "漚汪國小食農遊學營親子拔蘿蔔",
      summary: "結合將軍區胡蘿蔔產季舉辦親子食農遊學營，帶領家長與學童走進田間親手體驗拔蘿蔔豐收樂趣。",
      url: "https://www.cdns.com.tw/articles/1368652",
      featured: true
    },
    {
      id: "m02",
      category: "agri",
      station: "gallery",
      source: "臺灣時報",
      title: "臺南漚汪國小舉辦親子胡蘿蔔採收體驗食農教育扎根校園",
      summary: "透過實地走入家鄉紅蘿蔔田採收體驗，將「從產地到餐桌」的食農教育深耕於校園日常課程。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-268510c0-1112-423a-a507-cfde0a87f21c&currentCategory=12",
      featured: true
    },
    {
      id: "m03",
      category: "agri",
      station: "curriculum",
      source: "中華日報",
      title: "漚汪學童打造藍碳生態瓶 揭碳的秘密",
      summary: "結合自然科學與環境永續教育，指導學童動手打造「藍碳生態瓶」，探索海洋固碳與淨零減碳科學原理。",
      url: "https://www.cdns.com.tw/articles/1333845",
      featured: true
    },
    {
      id: "m04",
      category: "agri",
      station: "gallery",
      source: "臺灣時報",
      title: "將軍蘿蔔庄田園體驗親子開心拔蘿蔔田園洋溢著歡笑",
      summary: "於將軍蘿蔔庄舉行田園體驗活動，大小朋友合力拔起鮮甜胡蘿蔔，田間充滿溫馨親子歡笑聲。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-240dba5b-55c3-4eec-8910-e8803633654f&currentCategory=12"
    },
    {
      id: "m05",
      category: "agri",
      station: "gallery",
      source: "中華日報",
      title: "漚汪國小食農遊學 趣拔蘿蔔",
      summary: "推動特色食農遊學課程，讓學童親近泥土、認識將軍胡蘿蔔生長歷程，體會農夫辛勞與惜食感恩。",
      url: "https://www.cdns.com.tw/articles/968457"
    },
    {
      id: "m06",
      category: "agri",
      station: "gallery",
      source: "臺灣時報",
      title: "將軍區農會親子田園拔蘿蔔體驗分享豐收成果場面溫馨",
      summary: "學校與將軍區農會攜手合作，透過田園拔蘿蔔與料理分享，深化社區與學校共好的食農精神。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-df382094-c357-4fe5-b37d-af75933ee715"
    },
    {
      id: "m07",
      category: "agri",
      station: "gallery",
      source: "中時新聞網",
      title: "台南 17 校攜手推食農遊學地圖 吃遍一整年農特產",
      summary: "漚汪國小以「將軍胡蘿蔔」為代表亮點，與臺南市 17 所學校共同串聯四季食農遊學地圖。",
      url: "https://www.chinatimes.com/realtimenews/20230209002953-260405?chdtv"
    },
    {
      id: "m08",
      category: "agri",
      station: "curriculum",
      source: "臺灣時報",
      title: "溪汪料理說書人-啟動新「食」代，耍出潮「食」力成果展漚汪國小登場",
      summary: "結合在地食材創發料理與故事表達，學生化身「溪汪料理說書人」舉辦大型飲食文化策展。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-2ffbb23f-61e9-455c-9a90-54fde66be33f&currentCategory=101"
    },
    {
      id: "m09",
      category: "agri",
      station: "curriculum",
      source: "中華日報",
      title: "傳承溪汪美食力 學童扮料理說書人",
      summary: "透過採訪記錄家鄉傳統美食故事並親手實作，展現漚汪學童傳承在地飲食文化的創意與表達力。",
      url: "https://www.cdns.com.tw/articles/525307"
    },
    {
      id: "m10",
      category: "agri",
      station: "gallery",
      source: "中華日報",
      title: "大遠百青森弘前展 飄蘋果香",
      summary: "參與國際農產與飲食文化交流體驗活動，拓展學童對國內外特色農產與健康飲食的認識。",
      url: "https://www.cdns.com.tw/articles/490042"
    },

    // --- 💡 課程創新與家鄉走讀 (pbl) ---
    {
      id: "m11",
      category: "pbl",
      station: "curriculum",
      source: "自由時報",
      title: "台南漚汪國小「炫勇說書人」 挖掘長輩故事學習生命智慧",
      summary: "學生深入社區訪談阿公阿嬤與在地耆老的生命奮鬥故事，化身為「炫勇說書人」進行劇本創作與策展。",
      url: "https://news.ltn.com.tw/news/life/breakingnews/4378009",
      featured: true
    },
    {
      id: "m12",
      category: "pbl",
      station: "curriculum",
      source: "臺南市政府",
      title: "創發教學新動力 漚汪國小「炫勇說書人」PBL 設計學習課程 培養學生 4C 核心能力",
      summary: "結合廣達設計學習計畫，以真實任務引導學生探究家鄉文史，養成思辨、溝通、合作與創意 4C 素養。",
      url: "https://www.tainan.gov.tw/News_Content.aspx?n=16907&s=8563259#",
      featured: true
    },
    {
      id: "m13",
      category: "pbl",
      station: "curriculum",
      source: "中華日報",
      title: "漚汪炫勇說書人 說長輩最勇事蹟",
      summary: "透過口述歷史訪談與說書展演，讓孩子看見家鄉長輩堅毅勇敢的生命典範，深化跨世代情感連結。",
      url: "https://www.cdns.com.tw/articles/843914"
    },
    {
      id: "m14",
      category: "pbl",
      station: "curriculum",
      source: "中華日報",
      title: "學童訪談長輩說英勇故事",
      summary: "帶領學生走入聚落進行田野調查與人物專訪，將長輩的英勇事蹟轉化為生動的校園策展內容。",
      url: "https://www.cdns.com.tw/articles/778624"
    },
    {
      id: "m15",
      category: "pbl",
      station: "curriculum",
      source: "臺灣時報",
      title: "將軍區漚汪國小創作「不老仁商戴榮吉」繪本將廣送世界華人學校",
      summary: "師生共同探訪在地仁商戴榮吉先生事蹟並繪製原創繪本，將漚汪的善良與企業家精神傳遞至世界華人學校。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-6048fe3b-8070-43fc-b6b5-de597aea9273&currentCategory=101",
      featured: true
    },
    {
      id: "m16",
      category: "pbl",
      station: "curriculum",
      source: "中華日報",
      title: "舊情棉綿 話我家鄉微電影摘銀",
      summary: "以將軍區傳統棉被產業與家鄉記憶為主題拍攝微電影《舊情棉綿》，在競賽中脫穎而出榮獲銀獎肯定！",
      url: "https://www.cdns.com.tw/articles/465019",
      featured: true
    },
    {
      id: "m17",
      category: "pbl",
      station: "curriculum",
      source: "中華日報",
      title: "漚汪學童走讀學習摺頁認識家鄉",
      summary: "學生實地踏查漚汪老街、廟宇與聚落景點，親手整理並設計「家鄉走讀學習摺頁」，成為最佳導覽小尖兵。",
      url: "https://www.cdns.com.tw/articles/1172728"
    },
    {
      id: "m18",
      category: "pbl",
      station: "curriculum",
      source: "臺灣時報",
      title: "南市漚汪學生家鄉走讀多樣化學習體驗家鄉之美",
      summary: "透過多元五感走讀課程，帶領各年級學童深入探索將軍漚汪的人文歷史、自然地景與產業風貌。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-9348bec2-5d30-462f-8caf-66c76b302396&currentCategory=12"
    },
    {
      id: "m19",
      category: "pbl",
      station: "curriculum",
      source: "廣達文教基金會",
      title: "廣達文教基金會 X 臺南市政府「112-114 學年度廣達『設計學習』計畫」合作記者會",
      summary: "漚汪國小作為臺南市廣達設計學習重點夥伴學校，受邀參與合作記者會展現 PBL 翻轉教學成果。",
      url: "https://www.quanta-edu.org/zh-tw/event.php?act=view&id=320"
    },
    {
      id: "m20",
      category: "pbl",
      station: "curriculum",
      source: "聯合新聞網",
      title: "創發設計學習新動力 南市府與廣達文教聯手創新局",
      summary: "聯合報報導臺南市政府與廣達文教基金會攜手推動設計思考課程，漚汪國小學生自信展現策展實力。",
      url: "https://udn.com/news/story/6885/7338889"
    },
    {
      id: "m21",
      category: "pbl",
      station: "curriculum",
      source: "臺南市政府",
      title: "創發設計學習新動力，臺南市政府與廣達文教基金會再次聯手開創新局",
      summary: "市府專文肯定漚汪國小等夥伴學校透過「創發教學新動力」計畫，啟動偏鄉學子自主探究動能。",
      url: "https://www.tainan.gov.tw/News_Content.aspx?n=16907&s=8578408"
    },
    {
      id: "m22",
      category: "pbl",
      station: "curriculum",
      source: "中時新聞網",
      title: "全台首學課程博覽會台南登場 112 攤教學互動區單日吸近萬人次體驗",
      summary: "參與全市課程博覽會教學互動展攤，向市民與教育界展示漚汪國小創新校訂課程亮點。",
      url: "https://www.chinatimes.com/realtimenews/20230610003185-260405"
    },

    // --- 💛 品格教育與謝師祈福 (character) ---
    {
      id: "m23",
      category: "character",
      station: "character",
      source: "臺灣時報",
      title: "台南漚汪、依仁國小學童化身職人代言人 探索責任與韌性的品格力量",
      summary: "跨校共學品格課程！學童透過體驗各行各業職人精神，深刻內化「負責」與「堅毅」的核心品格價值。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-77c74a0e-f00c-4f6e-8ea0-7ae9881a4061&currentCategory=12",
      featured: true
    },
    {
      id: "m24",
      category: "character",
      station: "character",
      source: "國語日報",
      title: "南市億載、漚汪謝師恩 寫卡片傳情",
      summary: "國語日報報導漚汪國小教師節感恩活動，孩子們親手撰寫感恩卡片向師長傳遞真摯謝意。",
      url: "https://www.mdnkids.com/content.asp?sub=1&sn=3930"
    },
    {
      id: "m25",
      category: "character",
      station: "character",
      source: "臺灣時報",
      title: "台南漚汪國小感恩教師 Q 版似顏繪畫像挺新鮮視為至寶加以珍藏",
      summary: "結合美感創作與感恩教育，學生仔細觀察老師特徵繪製「Q 版似顏繪」，令老師們驚喜感動並珍藏。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-46558859-4744-4e2f-a4fa-fc0cbf2c66a7&currentCategory=101",
      featured: true
    },
    {
      id: "m26",
      category: "character",
      station: "character",
      source: "中華日報",
      title: "謝師各出奇招 國小校園好溫馨",
      summary: "透過創意多元的敬師互動活動，拉近師生距離，讓感恩與尊重的品格自然流露於校園之中。",
      url: "https://www.cdns.com.tw/articles/463553"
    },
    {
      id: "m27",
      category: "character",
      station: "character",
      source: "臺灣時報",
      title: "台南漚汪國小學生敬師傳愛表心意場面溫馨",
      summary: "舉辦全校敬師奉茶與傳愛活動，學童以禮貌鞠躬與溫暖話語感謝師長平日教導之恩。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-993e59ad-0f32-4eb1-b5ac-66e333be05a5&currentCategory=101"
    },
    {
      id: "m28",
      category: "character",
      station: "character",
      source: "中華日報",
      title: "指認老師兒時照 學童呼有趣",
      summary: "教師節特別企劃「猜猜我是誰—指認老師兒時照片」，全校學童熱烈參與，歡笑聲不斷。",
      url: "https://www.cdns.com.tw/articles/665696"
    },
    {
      id: "m29",
      category: "character",
      station: "character",
      source: "臺灣時報",
      title: "南市漚汪國小感恩祈福師生齊聚文衡殿懸掛心願迎新年",
      summary: "歲末年終全校師生步行至社區信仰中心「漚汪文衡殿」感恩祈福，親手懸掛祈願卡迎接嶄新一年。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-1d1b351f-ff57-42f3-b207-ff6835598756&currentCategory=12",
      featured: true
    },
    {
      id: "m30",
      category: "character",
      station: "character",
      source: "Yahoo 新聞",
      title: "森林工廠勞資糾紛 學童看劇學勞權",
      summary: "透過生動有趣的互動劇場走入校園，帶領學童從小認識勞動權益、互相尊重與法治品格觀念。",
      url: "https://ynews.page.link/rwDFA"
    },
    {
      id: "m31",
      category: "character",
      station: "vision",
      source: "臺南市政府",
      title: "杏壇有愛，因為你在-23 位優良教師獲選臺南市師鐸獎",
      summary: "表揚深耕教育、用愛陪伴孩子成長的典範師長，展現臺南教育界的溫暖專業力量。",
      url: "https://www.tainan.gov.tw/News_Content.aspx?n=16907&s=8555931"
    },

    // --- 🎨 藝文雙語與體育競賽 (arts) ---
    {
      id: "m32",
      category: "arts",
      station: "facilities",
      source: "ETtoday 新聞雲",
      title: "台南兒藝節「藝起賞」新營登場 六校共創夏日美學實驗場",
      summary: "漚汪國小受邀參與臺南市兒童藝術教育節「藝起賞」，六校攜手共創充滿想像力的夏日美學實驗場！",
      url: "https://www.ettoday.net/news/20260612/3182266.htm",
      featured: true
    },
    {
      id: "m33",
      category: "arts",
      station: "gallery",
      source: "聯合新聞網",
      title: "台南藝術教育深耕 創意市集也可以這樣賞與玩",
      summary: "聯合報報導漚汪國小等校推動藝術深耕計畫成果，透過互動式創意市集讓學生從做中學、玩中學美感。",
      url: "https://udn.com/news/story/6898/7304434"
    },
    {
      id: "m34",
      category: "arts",
      station: "teams",
      source: "臺灣時報",
      title: "台南漚汪國小萬聖節學生沉浸充滿英語對話闖關歡樂聲",
      summary: "結合萬聖節舉辦全校雙語情境闖關活動，學生裝扮造型並以流利英語開口對話，校園洋溢歡樂笑聲。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-95f9b352-8f73-46a5-a1a5-f545de1ede25&currentCategory=101",
      featured: true
    },
    {
      id: "m35",
      category: "arts",
      station: "gallery",
      source: "中華日報",
      title: "〈彩繪人生〉國際志工花蜜拉 分享菲美食文化",
      summary: "邀請菲律賓國際志工入校與學童互動，透過美食製作與文化故事分享，開啟偏鄉學子的國際視野。",
      url: "https://www.cdns.com.tw/articles/495002"
    },
    {
      id: "m36",
      category: "arts",
      station: "teams",
      source: "自由時報",
      title: "馬拉松接力班際賽 全班一起跑",
      summary: "自由時報報導漚汪國小全班齊心投入臺南市馬拉松接力班際對抗賽，鍛鍊體魄並勇奪第一名佳績！",
      url: "https://news.ltn.com.tw/news/Tainan/paper/1568166",
      featured: true
    },
    {
      id: "m37",
      category: "arts",
      station: "teams",
      source: "中華日報",
      title: "同濟盃國小 3 對 3 籃球賽 25 隊競技",
      summary: "學童熱血參與同濟盃國小 3 對 3 籃球鬥牛賽，在球場上切磋球技、展現團隊合作與運動家精神。",
      url: "https://www.cdns.com.tw/articles/1119754"
    },
    {
      id: "m38",
      category: "arts",
      station: "gallery",
      source: "中華日報",
      title: "國小潔牙觀摩賽 南市 6 校代表出戰",
      summary: "落實校園健康促進與口腔衛生教育，在全市國小潔牙觀摩賽中展現優異健康素養。",
      url: "https://www.cdns.com.tw/articles/877162"
    },
    {
      id: "m39",
      category: "arts",
      station: "facilities",
      source: "臺南市政府",
      title: "2022 臺南市兒童藝術教育節系列活動「藝起學」跨領域藝術夏令營共創城市美學",
      summary: "辦理跨領域藝術夏令營，結合在地素材與視覺表演藝術，帶領學童共創城市美學。",
      url: "https://www.tainan.gov.tw/News_Content.aspx?n=13371&sms=9749&s=7914142"
    },
    {
      id: "m40",
      category: "arts",
      station: "facilities",
      source: "中華日報",
      title: "８月藝起學 跨領域親子營隊開鑼",
      summary: "暑期跨領域親子藝文營隊熱鬧開鑼，吸引親子攜手參與藝術創作，深化美感生活體驗。",
      url: "https://www.cdns.com.tw/articles/640891"
    },

    // --- ❤️ 公益關懷與校友回饋 (charity) ---
    {
      id: "m41",
      category: "charity",
      station: "facilities",
      source: "中華日報",
      title: "漚汪小學童感恩文衡殿長期捐助",
      summary: "漚汪文衡殿長年捐助學校辦學與弱勢學童，孩子們懷抱感恩之心親自致謝，展現社區廟宇護學溫情。",
      url: "https://www.cdns.com.tw/articles/1341520",
      featured: true
    },
    {
      id: "m42",
      category: "charity",
      station: "facilities",
      source: "臺灣時報",
      title: "將軍漚汪文衡殿頒發育英書院獎學金獎勵學子勤奮向學",
      summary: "傳承百年「育英書院」文風，漚汪文衡殿定期頒發獎學金鼓勵優秀與勤學學子向上奮發。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-55ebaad1-cc39-4cae-9073-936f8be9a6e1&currentCategory=101",
      featured: true
    },
    {
      id: "m43",
      category: "charity",
      station: "facilities",
      source: "中華日報",
      title: "13 生獲育英書院獎學金",
      summary: "表揚 13 位品學兼優學童獲頒文衡殿育英書院獎學金，激勵同儕見賢思齊、勤奮向學。",
      url: "https://www.cdns.com.tw/articles/625981"
    },
    {
      id: "m44",
      category: "charity",
      station: "teams",
      source: "臺灣時報",
      title: "立盈企業董事長黃順立襄助母校偏鄉學校社團經費嘉惠偏鄉學子",
      summary: "傑出校友立盈企業黃順立董事長飲水思源，慷慨捐助母校多元社團發展經費，助偏鄉孩子勇敢追夢。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-350f9c01-b65e-4a99-b7f8-4728dbce8e72&currentCategory=101",
      featured: true
    },
    {
      id: "m45",
      category: "charity",
      station: "teams",
      source: "民眾網",
      title: "立盈企業有限公司董事長黃順立創業有成回饋母校及偏遠學子",
      summary: "報導校友黃順立董事長事業有成後持續回饋家鄉教育，支持漚汪國小社團與閱讀推展。",
      url: "https://www.allnews.tw/news/40111"
    },
    {
      id: "m46",
      category: "charity",
      station: "facilities",
      source: "中華日報",
      title: "校友會送被 漚汪國小暖呼呼",
      summary: "寒冬歲末之際，漚汪國小校友會貼心致贈全校師生溫暖棉被，讓將軍傳統棉被故鄉的溫暖擁抱每位學童。",
      url: "https://www.cdns.com.tw/articles/931283"
    },
    {
      id: "m47",
      category: "charity",
      station: "facilities",
      source: "臺灣時報",
      title: "台南漚汪耶誕市集校友會長送師生耶誕禮物暖被禦寒",
      summary: "結合校園耶誕市集活動，校友會長親自化身聖誕老人致贈禦寒暖被，全校師生倍感溫馨。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-31874937-0f52-4614-8aff-69e27f26381f&currentCategory=12"
    },
    {
      id: "m48",
      category: "charity",
      station: "facilities",
      source: "臺灣時報",
      title: "將軍大豐棉廠送漚汪國小午安枕作兒童節禮物提升午休品質",
      summary: "在地企業「大豐棉廠」發揮製棉專業與愛心，贈送全校學童舒適午安枕作為最棒的兒童節禮物。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-ebc35458-5533-43c7-8eed-6e1908c92ca0&currentCategory=12"
    },
    {
      id: "m49",
      category: "charity",
      station: "facilities",
      source: "中華日報",
      title: "企業送午安枕 學童:午休不再手麻",
      summary: "收到在地棉廠贈送的柔軟午安枕後，學童開心表示午休趴睡不再手麻，下午上課更有精神！",
      url: "https://www.cdns.com.tw/articles/771531"
    },
    {
      id: "m50",
      category: "charity",
      station: "facilities",
      source: "臺灣時報",
      title: "國際同濟會澎嘉南區圓夢計畫捐贈將軍區五校籃球學童滿懷感激",
      summary: "國際同濟會澎嘉南區圓夢計畫深入將軍區，捐贈漚汪等五所國小籃球物資，鼓舞孩子熱愛運動。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-07bb263c-a206-4d5b-bfac-a79597202dab&currentCategory=12"
    },
    {
      id: "m51",
      category: "charity",
      station: "facilities",
      source: "中華日報",
      title: "送籃球到偏鄉 將軍 5 校童開心",
      summary: "同濟會公益送愛到將軍區五校，學童抱著全新籃球在光電球場上開心奔跑投籃。",
      url: "https://www.cdns.com.tw/articles/791613"
    },
    {
      id: "m52",
      category: "charity",
      station: "facilities",
      source: "聯合新聞網",
      title: "南市普光慈善協會贈 21 小學檯燈 逾千學子受惠",
      summary: "臺南市普光慈善協會捐贈護眼檯燈予漚汪國小等 21 所小學，照亮偏鄉學童夜間閱讀與學習之路。",
      url: "https://udn.com/news/story/7326/7264440?from=udn-ch1_breaknews-1-cate3-news"
    },
    {
      id: "m53",
      category: "charity",
      station: "facilities",
      source: "中華日報",
      title: "善心湧入校園 21 國中小受惠",
      summary: "社會公益團體匯聚愛心資源挹注校園，守護偏鄉學子健康視力與學習環境。",
      url: "https://www.cdns.com.tw/articles/827387"
    },
    {
      id: "m54",
      category: "charity",
      station: "facilities",
      source: "中華日報",
      title: "佳楠慈善會 贊助漚汪國小課輔費",
      summary: "佳楠慈善會長期關懷偏鄉教育，慷慨贊助漚汪國小課後輔導與多元學習經費，減輕家庭負擔。",
      url: "https://www.cdns.com.tw/articles/872180"
    },
    {
      id: "m55",
      category: "charity",
      station: "facilities",
      source: "自由時報",
      title: "科技公司送愛偏鄉 數位教育零距離",
      summary: "科技企業捐贈數位學習設備與資源，助力漚汪國小打造無落差的智慧數位教室。",
      url: "https://news.ltn.com.tw/news/Tainan/breakingnews/4107239"
    },

    // --- 🏫 110校慶與校園盛事 (campus) ---
    {
      id: "m56",
      category: "campus",
      station: "vision",
      source: "中華日報",
      title: "漚汪國小 110 歲 藝術慶生",
      summary: "歡慶創校 110 週年（百十校慶），全校師生與歷屆校友齊聚一堂，以豐富的藝文展演為母校慶生！",
      url: "https://www.cdns.com.tw/articles/1190782",
      featured: true
    },
    {
      id: "m57",
      category: "campus",
      station: "vision",
      source: "臺灣時報",
      title: "南市漚汪 110 週年校慶校友捐贈裝置藝術品成打卡景點",
      summary: "110 週年校慶獲傑出校友慷慨捐贈校園大型裝置藝術品，為百年老校注入美學新風貌並成為熱門打卡地標。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-26e57dd0-b61b-444e-9ab6-b1511a30bb38&currentCategory=12",
      featured: true
    },
    {
      id: "m58",
      category: "campus",
      station: "vision",
      source: "國語日報",
      title: "南市漚汪校友教師創作展 欣賞鐵雕藝術",
      summary: "國語日報專文報導漚汪校慶特別企劃「校友暨教師藝術創作展」，展出精湛的鐵雕與多元媒材藝術作品。",
      url: "https://www.mdnkids.com/content.asp?Link_String_=233R00000PDUDWY"
    },
    {
      id: "m59",
      category: "campus",
      station: "vision",
      source: "臺灣時報",
      title: "南市漚汪校慶校友及教師藝術創作展值得細細品味",
      summary: "邀請知名藝術家校友與校內教師聯合策展，讓學童與社區民眾在校園內即可細細品味高水準藝術。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-a008fa21-257c-4623-bc2d-6bd4ad81836d&currentCategory=12"
    },
    {
      id: "m60",
      category: "campus",
      station: "vision",
      source: "國語日報",
      title: "南市漚汪喜迎 110 校慶 師生創意排字",
      summary: "全校師生於綠茵操場上齊心排出「110」字樣，從高空俯瞰壯觀活潑，展現百年漚汪的滿滿朝氣。",
      url: "https://www.mdnkids.com/content.asp?Link_String_=22C700000ZEBQYH"
    },
    {
      id: "m61",
      category: "campus",
      station: "vision",
      source: "臺灣時報",
      title: "南市漚汪 110 週年校慶創意排字留下珍貴畫面",
      summary: "透過空拍鏡頭記錄全校師生為 110 週年校慶創意排字的感動瞬間，成為校史最珍貴的紀念畫面。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-6bdc563c-7faf-49d9-956b-8fefe58f0567&currentCategory=12"
    },
    {
      id: "m62",
      category: "campus",
      station: "vision",
      source: "臺灣時報",
      title: "台南漚汪國小新生入學禮校長期許學生勇敢追夢",
      summary: "精心設計溫馨迎新入學儀式，校長勉勵小一新生培養閱讀習慣與好品格，在漚汪樂園勇敢追夢。",
      url: "https://www.taiwantimes.com.tw/app-container/app-content/new/new-content-detail?blogId=blog-470954ef-df27-4127-bb72-2d136c0255b3&currentCategory=101"
    },
    {
      id: "m63",
      category: "campus",
      station: "vision",
      source: "中華日報",
      title: "漚汪國小畢業生 駛向夢想未來",
      summary: "溫馨感人的畢業典禮，師長與學弟妹祝福畢業生帶著在漚汪養成的 4C 素養與品格力駛向夢想未來。",
      url: "https://www.cdns.com.tw/articles/819300"
    },
    {
      id: "m64",
      category: "campus",
      station: "achievements",
      source: "臺南市政府",
      title: "110 學年度市長獎頒獎典禮 黃偉哲與畢業生開心合影",
      summary: "漚汪國小榮獲市長獎的優秀畢業生出席全市頒獎典禮，與黃偉哲市長開心合影留念。",
      url: "https://www.tainan.gov.tw/News_Content.aspx?n=13370&s=7900715"
    }
  ],

  // 15 Official Honors from 111 to 114 Academic Years
  honors: [
    {
      year: "114",
      tag: "語文特優",
      tagColor: "#8b5cf6",
      title: "英語讀者劇場比賽 - 特優",
      detail: "學生以流利的英語口說與生動的表情演繹故事，勇奪臺南市英語讀者劇場比賽特優佳績。",
      station: "teams"
    },
    {
      year: "114",
      tag: "品德典範",
      tagColor: "#eab308",
      title: "臺南市品德教育特色學校",
      detail: "持續深耕品格教育，再次榮獲全市品德教育特色學校殊榮肯定。",
      station: "character"
    },
    {
      year: "114",
      tag: "全國賽",
      tagColor: "#ec4899",
      title: "全國學生舞蹈比賽 - 優等",
      detail: "舞蹈團隊展現平時辛勤練習成果，在全國賽事舞台上大放異彩，榮獲優等。",
      station: "teams"
    },
    {
      year: "114",
      tag: "教學創新",
      tagColor: "#f97316",
      title: "教學卓越計畫 - 優等",
      detail: "榮獲教學卓越計畫課程研發組成果優等，展現學校創新教學之動能。",
      station: "curriculum"
    },
    {
      year: "114",
      tag: "藝術美感",
      tagColor: "#10b981",
      title: "藝術深耕計畫評選 - 優等",
      detail: "致力推動校園藝術美感教育，成果豐碩，榮獲藝術深耕計畫評選優等。",
      station: "facilities"
    },
    {
      year: "114",
      tag: "科技全國賽",
      tagColor: "#2563eb",
      title: "AI 機器人全國賽 - 佳作",
      detail: "科技教育扎根，學生參加 AI 機器人全國賽榮獲中年級組「佳作」肯定。",
      station: "teams"
    },
    {
      year: "113",
      tag: "品德典範",
      tagColor: "#eab308",
      title: "臺南市品德教育特色學校",
      detail: "榮獲全市品德教育特色學校殊榮，肯定學校在推動「3H」品格教育上的努力。",
      station: "character"
    },
    {
      year: "113",
      tag: "最高特優",
      tagColor: "#e85d2a",
      title: "教學卓越發展計畫 - 特優",
      detail: "校訂課程深耕組特優。課程設計結合在地文化與 PBL 學習，獲高度肯定。",
      station: "curriculum"
    },
    {
      year: "113",
      tag: "藝術貢獻",
      tagColor: "#10b981",
      title: "藝術教育貢獻獎績優學校",
      detail: "長期深耕藝術教育，培養學生美感素養，獲臺南市藝術教育貢獻獎肯定。",
      station: "facilities"
    },
    {
      year: "112",
      tag: "全國賽",
      tagColor: "#ec4899",
      title: "全國學生舞蹈比賽 - 優等",
      detail: "舞蹈隊不畏艱辛練習，在全國舞台上完美展現力與美，榮獲現代舞優等。",
      station: "teams"
    },
    {
      year: "112",
      tag: "語文優等",
      tagColor: "#8b5cf6",
      title: "英語讀者劇場比賽 - 優等",
      detail: "學生以流利的英語口說與生動的表情演繹故事，勇奪臺南市比賽優等。",
      station: "teams"
    },
    {
      year: "112",
      tag: "美感績優",
      tagColor: "#10b981",
      title: "推動藝術與美感深耕績優",
      detail: "落實美感教育於校園生活，提升學生藝術鑑賞能力，榮獲績優學校肯定。",
      station: "gallery"
    },
    {
      year: "111",
      tag: "課程翻轉",
      tagColor: "#f97316",
      title: "廣達設計學習學校",
      detail: "正式成為廣達設計學習計畫學校，導入設計思考模式，翻轉傳統教學。",
      station: "curriculum"
    },
    {
      year: "111",
      tag: "總錦標冠軍",
      tagColor: "#dc2626",
      title: "田徑賽女乙組總錦標冠軍",
      detail: "田徑隊女將們發揮驚人毅力，積分加總榮獲國小田徑賽團體總錦標冠軍！",
      station: "teams"
    },
    {
      year: "111",
      tag: "全市第一",
      tagColor: "#dc2626",
      title: "馬拉松接力班際對抗賽第一名",
      detail: "展現班級團隊合作精神，堅持到底，榮獲馬拉松接力班際對抗賽第一名。",
      station: "teams"
    }
  ]
};
