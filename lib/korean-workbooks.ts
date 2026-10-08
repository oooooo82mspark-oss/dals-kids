export type KoreanLevel = "basic" | "application" | "advanced"
export type KoreanFocus = "reading" | "vocabulary" | "textbook" | "grammar"

export type KoreanWorkbook = {
  id: string
  name: string
  publisher: string
  category: "독해" | "어휘" | "교과" | "문법/맞춤법"
  targetGrade: string
  reasons: [string, string]
  buyUrl: string
  difficulty: number // 1~10
  band: 1 | 2 | 3 | 4 | 5
  tags: string[]
  featureNote: string
}

export type RecommendedBook = {
  id: string
  title: string
  author: string
  publisher: string
  targetGrade: string
  category: "창작동화/문학" | "비문학/지식" | "고전/인문" | "어휘/시"
  description: string
  whyRead: string
  readingTip: string
  searchUrl: string
}

const search = (q: string) =>
  `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`

// 대표 초등 국어 문제집
export const koreanWorkbooks: KoreanWorkbook[] = [
  // --- 독해 교재 ---
  {
    id: "ppuri-dokhae",
    name: "뿌리깊은 초등국어 독해력",
    publisher: "마더텅",
    category: "독해",
    targetGrade: "1~6학년 (단계별)",
    reasons: [
      "하루 15분, 짧지만 알찬 지문과 배경지식 코너로 독해 습관 잡기에 최고예요.",
      "학부모 선호도 1위 독해 교재로, 초등 입문부터 수능형 사고 기초까지 탄탄해요.",
    ],
    buyUrl: search("뿌리깊은 초등국어 독해력"),
    difficulty: 4.5,
    band: 3,
    tags: ["독해", "배경지식", "대표인기"],
    featureNote: "초등 독해서의 정석, 꾸준한 루틴에 최적화",
  },
  {
    id: "ddokddok-dokhae",
    name: "똑똑한 하루 독해",
    publisher: "천재교육",
    category: "독해",
    targetGrade: "1~6학년",
    reasons: [
      "문해력 기초가 부족한 아이도 부담 없이 시작할 수 있는 쉬운 단계 구성이에요.",
      "재미있는 그림과 생활 속 지문이 많아 글밥 거부감이 있는 아이에게 추천해요.",
    ],
    buyUrl: search("똑똑한 하루 독해"),
    difficulty: 3.5,
    band: 2,
    tags: ["독해", "입문", "흥미유발"],
    featureNote: "독해가 어려운 아이를 위한 친절한 입문서",
  },
  {
    id: "ebs-dokhae-wonder",
    name: "EBS 문해력 첫걸음 / 문해력 와작",
    publisher: "EBS",
    category: "독해",
    targetGrade: "1~6학년",
    reasons: [
      "EBS 문해력 진단 시스템과 연계되어 공신력 있는 문해력 분석 훈련을 제공해요.",
      "지문의 핵심 요약과 중심 문장 찾기를 체계적으로 훈련할 수 있어요.",
    ],
    buyUrl: search("EBS 문해력"),
    difficulty: 5.5,
    band: 3,
    tags: ["독해", "문해력", "공교육연계"],
    featureNote: "비문학·교과 지문 독해력 집중 강화",
  },
  {
    id: "summa-dokhae",
    name: "숨마어린이 초등국어 독해왕",
    publisher: "이룸이앤비",
    category: "독해",
    targetGrade: "1~6학년",
    reasons: [
      "문학, 인문, 사회, 과학, 예술 등 다채로운 고품질 지문으로 비문학 독해에 강해요.",
      "중등 국어로 넘어가기 전 논리적인 긴 글 독해력을 기르고 싶을 때 추천해요.",
    ],
    buyUrl: search("초등국어 독해왕"),
    difficulty: 6.8,
    band: 4,
    tags: ["독해", "비문학심화", "사고력"],
    featureNote: "지문 퀄리티가 높아 중상위권 도약에 유리",
  },

  // --- 어휘 교재 ---
  {
    id: "eowhi-munhaeryeok",
    name: "어휘가 문해력이다",
    publisher: "천재교육",
    category: "어휘",
    targetGrade: "1~6학년",
    reasons: [
      "교과서 핵심 한자어와 필수 어휘를 문맥 속에서 자연스럽게 익히도록 도와줘요.",
      "문해력의 80%는 어휘력! 단어 뜻을 몰라 글이 막히는 아이에게 필수 코스예요.",
    ],
    buyUrl: search("어휘가 문해력이다"),
    difficulty: 4.0,
    band: 2,
    tags: ["어휘", "교과연계", "한자어"],
    featureNote: "교과서 어휘와 관용구의 핵심을 짚는 필독 어휘서",
  },
  {
    id: "choi-vocab",
    name: "초등국어 어휘왕",
    publisher: "이룸이앤비",
    category: "어휘",
    targetGrade: "1~6학년",
    reasons: [
      "사자성어, 속담, 반의어, 다의어까지 풍부하게 다루는 종합 어휘 트레이닝북이에요.",
      "글쓰기와 어휘 문제에 자신감을 키워주는 단계별 테스트가 잘 구성되어 있어요.",
    ],
    buyUrl: search("초등국어 어휘왕"),
    difficulty: 5.0,
    band: 3,
    tags: ["어휘", "속담·사자성어", "어휘력확장"],
    featureNote: "어휘력을 한 단계 끌어올리는 탄탄한 구성",
  },

  // --- 교과 / 문법 / 맞춤법 ---
  {
    id: "ebs-manjeom-korean",
    name: "EBS 만점왕 국어",
    publisher: "EBS",
    category: "교과",
    targetGrade: "1~6학년",
    reasons: [
      "학교 교과서 지문을 100% 반영하고 EBS 무료 인강까지 제공되는 교과 기본서예요.",
      "단원평가 대비와 학기 중 교과 진도를 빈틈없이 예습·복습하기에 가장 적합해요.",
    ],
    buyUrl: search("EBS 만점왕 국어"),
    difficulty: 3.5,
    band: 2,
    tags: ["교과기본", "무료인강", "학교시험"],
    featureNote: "학교 교과서 충실도 1위 기본서",
  },
  {
    id: "mat-choom-bub",
    name: "바른 글씨와 또박또박 맞춤법 / 띄어쓰기",
    publisher: "다락원",
    category: "문법/맞춤법",
    targetGrade: "1~4학년",
    reasons: [
      "받아쓰기와 일기 쓸 때 자주 틀리는 받침과 띄어쓰기 구멍을 명쾌하게 잡아줘요.",
      "초등 저학년 글씨 교정과 맞춤법 실수를 바로잡는 데 필수적인 보완서입니다.",
    ],
    buyUrl: search("초등 맞춤법 띄어쓰기"),
    difficulty: 3.0,
    band: 1,
    tags: ["맞춤법", "받아쓰기", "글씨교정"],
    featureNote: "저·중학년 맞춤법 결손 클리닉",
  },
]

// 학년별 문해력 추천 도서 (필독서 & 우수 문학/비문학)
export const recommendedBooks: RecommendedBook[] = [
  // 1~2학년
  {
    id: "book-1-2-1",
    title: "아홉 살 마음 사전",
    author: "박성우",
    publisher: "창비",
    targetGrade: "1~2학년",
    category: "어휘/시",
    description: "내 마음의 80가지 다양한 감정 어휘를 사랑스러운 그림과 상황으로 표현한 책.",
    whyRead: "감정을 표현하는 풍부한 어휘를 익히고 문해력의 뿌리를 내리는 데 큰 도움을 줍니다.",
    readingTip: "아이와 함께 하루에 감정 2가지씩 읽고 '오늘 나에게도 이런 일이 있었는지' 대화 나눠보세요.",
    searchUrl: search("아홉 살 마음 사전"),
  },
  {
    id: "book-1-2-2",
    title: "알사탕",
    author: "백희나",
    publisher: "책읽는곰",
    targetGrade: "1~2학년",
    category: "창작동화/문학",
    description: "마음의 소리를 들려주는 신비한 마법 알사탕을 통해 타인의 마음을 이해하는 감동 그림책.",
    whyRead: "글밥 읽기를 넘어 행간의 의미와 타인에 대한 공감 능력을 키워주는 대표 걸작입니다.",
    readingTip: "소리 내어 함께 읽으며 동동이와 아빠의 속마음에 대해 이야기를 나누어 보세요.",
    searchUrl: search("백희나 알사탕"),
  },
  // 3~4학년
  {
    id: "book-3-4-1",
    title: "만복이네 떡집",
    author: "김리리",
    publisher: "비룡소",
    targetGrade: "3~4학년",
    category: "창작동화/문학",
    description: "나쁜 말만 하던 만복이가 신비한 떡을 먹으며 따뜻한 말과 행동을 배우는 초등 3~4학년 대표 동화.",
    whyRead: "그림책에서 본격적인 챕터북(줄글 책)으로 넘어가는 문해력 징검다리 책으로 가장 사랑받는 도서입니다.",
    readingTip: "하루에 한 챕터(떡 한 종류 이야기)씩 읽고 재미있었던 장면을 그림이나 한 줄로 남겨보세요.",
    searchUrl: search("만복이네 떡집"),
  },
  {
    id: "book-3-4-2",
    title: "용선생이 간다 / 용선생 교과서 사회",
    author: "사회반장",
    publisher: "사회평론",
    targetGrade: "3~4학년",
    category: "비문학/지식",
    description: "재미있는 캐릭터들과 함께 3~4학년 사회·역사 배경지식을 흥미진진하게 풀어낸 지식 도서.",
    whyRead: "초등 3학년부터 급격히 어려워지는 비문학·어휘의 벽을 자연스럽게 무너뜨려 줍니다.",
    readingTip: "독해 문제집을 풀기 전 관련 주제 단원을 가볍게 읽어 배경지식을 충전하는 용도로 활용하세요.",
    searchUrl: search("용선생 초등"),
  },
  // 5~6학년
  {
    id: "book-5-6-1",
    title: "자전거 도둑",
    author: "박완서",
    publisher: "다림",
    targetGrade: "5~6학년",
    category: "창작동화/문학",
    description: "도덕성과 물질만능주의 사이에서 고뇌하는 소년 수남이의 성장을 그린 한국 대표 문학.",
    whyRead: "단순 사건 나열을 벗어나 인물의 내면 갈등과 도덕적 딜레마를 깊이 있게 사유하는 문해력을 완성합니다.",
    readingTip: "'내가 수남이였다면 자전거를 들고 달아났을까?'를 주제로 부모님과 깊은 토론을 해보세요.",
    searchUrl: search("자전거 도둑 박완서"),
  },
  {
    id: "book-5-6-2",
    title: "초등학생을 위한 개념 사피엔스 (비문학 과학·인문)",
    author: "유발 하라리 원작",
    publisher: "김영사",
    targetGrade: "5~6학년",
    category: "비문학/지식",
    description: "인류 역사와 과학 기술 문명을 초등 고학년 눈높이에서 알기 쉽게 풀어낸 비문학 필독서.",
    whyRead: "중학교 교과서에 자주 등장하는 추상적 개념과 논리적 인과관계를 이해하는 고급 독해력을 길러줍니다.",
    readingTip: "목차를 보고 가장 궁금한 챕터부터 골라 읽고 핵심 주제를 세 문장으로 요약해 보게 하세요.",
    searchUrl: search("개념 사피엔스"),
  },
]

// 국어 수준별 3권 황금 조합 세트
export type KoreanComboSet = {
  tier: "기초" | "중위" | "상위"
  title: string
  subtitle: string
  description: string
  targetDescription: string
  slots: {
    role: "독해서" | "어휘서" | "교과서"
    workbookId: string
    reason: string
  }[]
  readingBookId: string
  studyTip: string
}

export const koreanGoldenCombos: KoreanComboSet[] = [
  {
    tier: "기초",
    title: "문해력 첫걸음 3종 세트",
    subtitle: "글 읽기가 부담스럽고 어휘가 부족한 아이를 위한 안심 세트",
    description: "짧고 쉬운 지문으로 매일 성공 경험을 쌓고, 교과 기본 어휘를 챙겨 글밥 거부감을 없애줍니다.",
    targetDescription: "책 읽기를 힘들어하고 학교 국어 시험에서 지문을 다 못 읽는 아이",
    slots: [
      {
        role: "독해서",
        workbookId: "ddokddok-dokhae",
        reason: "하루 10분, 그림 위주의 부담 없는 짧은 지문으로 읽기 자신감 회복",
      },
      {
        role: "어휘서",
        workbookId: "eowhi-munhaeryeok",
        reason: "교과서에 나오는 필수 단어와 표현을 문맥 속에서 알기 쉽게 습득",
      },
      {
        role: "교과서",
        workbookId: "ebs-manjeom-korean",
        reason: "학교 교과 진도와 단원평가를 빈틈없이 잡아주는 친절한 교과 기본서",
      },
    ],
    readingBookId: "book-1-2-1",
    studyTip: "문제 풀이 전 부모님과 함께 소리 내어 지문을 한 번 읽고 시작하면 이해도가 2배로 높아집니다.",
  },
  {
    tier: "중위",
    title: "표준 문해력 탄탄 3종 세트",
    subtitle: "대한민국 학부모님들이 가장 많이 선택하는 정석 문해력 조합",
    description: "하루 한 편 독해 훈련과 풍부한 어휘 확장으로 학교 교과 상위권 및 수능형 독해 기초를 다집니다.",
    targetDescription: "교과서는 잘 읽지만 긴 비문학 지문이나 서술형 답안 작성이 아쉬운 아이",
    slots: [
      {
        role: "독해서",
        workbookId: "ppuri-dokhae",
        reason: "배경지식과 다양한 장르 지문으로 균형 잡힌 독해 근육 형성",
      },
      {
        role: "어휘서",
        workbookId: "choi-vocab",
        reason: "사자성어, 속담, 관용구까지 확장하여 풍부한 언어 구사력 완성",
      },
      {
        role: "교과서",
        workbookId: "ebs-manjeom-korean",
        reason: "교과 단원평가 100점 만점을 안정적으로 굳히는 표준 학습서",
      },
    ],
    readingBookId: "book-3-4-1",
    studyTip: "독해 문제를 푼 뒤 '이 글에서 글쓴이가 가장 하고 싶은 말(주제)이 뭘까?'를 한 줄로 적는 연습을 병행하세요.",
  },
  {
    tier: "상위",
    title: "사고력·비문학 마스터 3종 세트",
    subtitle: "중등 국어 선행 및 깊이 있는 인문·과학 융합 독해력 완성",
    description: "수준 높은 비문학 지문 분석과 고급 개념 어휘를 다루어 글의 숨은 의도와 논리적 구조를 파악합니다.",
    targetDescription: "책을 잘 읽고 일반 독해 문제집은 너무 쉽게 느껴져 심화 훈련이 필요한 아이",
    slots: [
      {
        role: "독해서",
        workbookId: "summa-dokhae",
        reason: "중학 국어와 연계되는 논리적이고 깊이 있는 고급 비문학·문학 지문 정복",
      },
      {
        role: "어휘서",
        workbookId: "choi-vocab",
        reason: "추상적 한자어와 학술적 개념어까지 마스터하여 고급 문해력 장착",
      },
      {
        role: "교과서",
        workbookId: "ebs-dokhae-wonder",
        reason: "비판적 읽기와 사실적·추론적 사고를 정밀하게 평가하는 고난도 트레이닝",
      },
    ],
    readingBookId: "book-5-6-1",
    studyTip: "지문을 읽고 문단별 소주제를 메모하며 글의 구조도를 스스로 그려보는 마인드맵 학습법을 추천합니다.",
  },
]
