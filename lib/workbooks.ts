export type Level = "basic" | "application" | "advanced"
export type Style = "calculation" | "descriptive" | "comprehensive"
export type Track = "current" | "advance"

export type LevelTag = "개념" | "기본" | "응용" | "유형" | "심화" | "최상위" | "연산" | "서술형" | "사고력"

export type Workbook = {
  id: string
  name: string
  publisher: string
  tags: LevelTag[]
  reasons: [string, string]
  buyUrl: string
  levels: Level[]
  styles: Style[]
  // 출판사·시리즈를 통틀어 비교하는 통일 난이도 (1=쉬움 ~ 10=최고난도)
  difficulty: number
  // 난이도 단계 밴드 (1~7)
  band: 1 | 2 | 3 | 4 | 5 | 6 | 7
  // 부모님을 위한 한 줄 난이도 코멘트
  difficultyNote?: string
}

const search = (q: string) =>
  `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`

export const workbooks: Workbook[] = [
  // ===================== [디딤돌] =====================
  {
    id: "didimdol-wonri",
    name: "디딤돌 초등수학 원리",
    publisher: "디딤돌",
    tags: ["개념"],
    reasons: [
      "기초 개념을 시각 자료와 쉬운 설명으로 원리부터 친절하게 알려줘요.",
      "수학을 어려워하는 아이나 첫 예습용으로 부담 없이 시작하기 좋아요.",
    ],
    buyUrl: search("디딤돌 초등수학 원리"),
    levels: ["basic"],
    styles: ["comprehensive"],
    difficulty: 2.5,
    band: 2,
    difficultyNote: "디딤돌 기본보다 쉬운 입문 개념서",
  },
  {
    id: "didimdol-basic",
    name: "디딤돌 초등수학 기본",
    publisher: "디딤돌",
    tags: ["개념", "기본"],
    reasons: [
      "교과 개념을 체계적으로 설명해 학교 수업 진도와 예습에 안성맞춤이에요.",
      "기초 유형을 차근차근 다뤄 수학에 자신감을 붙이기 좋은 대표 교재예요.",
    ],
    buyUrl: search("디딤돌 초등수학 기본"),
    levels: ["basic"],
    styles: ["comprehensive"],
    difficulty: 3.5,
    band: 3,
    difficultyNote: "교과서 수준의 기본기를 다지는 표준 기본서",
  },
  {
    id: "didimdol-basic-app",
    name: "디딤돌 기본+응용",
    publisher: "디딤돌",
    tags: ["기본", "응용"],
    reasons: [
      "개념과 응용 문제를 1:1로 한 권에 끝낼 수 있어 학부모 선호도 1위예요.",
      "교과 기본은 잘 이해하지만 쎈이나 심화서로 바로 가기 전 다리로 제격이에요.",
    ],
    buyUrl: search("디딤돌 기본+응용"),
    levels: ["basic", "application"],
    styles: ["comprehensive"],
    difficulty: 5.0,
    band: 4,
    difficultyNote: "유형 해결의 법칙과 유사한 난이도로, 개념+응용 결합",
  },
  {
    id: "didimdol-app",
    name: "디딤돌 초등수학 응용",
    publisher: "디딤돌",
    tags: ["응용", "심화"],
    reasons: [
      "기본 문제 비중을 줄이고 다양한 응용·실력 문제에 집중한 교재예요.",
      "기본 개념이 확실한 아이가 본격적인 문제해결력을 기를 때 추천해요.",
    ],
    buyUrl: search("디딤돌 초등수학 응용"),
    levels: ["application", "advanced"],
    styles: ["comprehensive"],
    difficulty: 5.8,
    band: 5,
    difficultyNote: "쎈 B단계와 비슷하며 기응보다 응용 비중이 높음",
  },
  {
    id: "didimdol-choesangwi-s",
    name: "최상위수학S",
    publisher: "디딤돌",
    tags: ["응용", "심화"],
    reasons: [
      "최상위 수학으로 넘어가기 전 징검다리 역할을 해주는 준심화서예요.",
      "대표 심화 유형을 이미지와 시각화 모델로 알기 쉽게 풀어 설명해 줘요.",
    ],
    buyUrl: search("최상위수학S"),
    levels: ["application", "advanced"],
    styles: ["comprehensive"],
    difficulty: 7.5,
    band: 6,
    difficultyNote: "쎈보다 어렵고, 최상위 수학보다는 접근이 수월함",
  },
  {
    id: "choesangwi",
    name: "최상위 수학",
    publisher: "디딤돌",
    tags: ["심화", "최상위"],
    reasons: [
      "초등 심화·경시를 대표하는 최고 난이도 교재로, 깊은 사고력을 요구해요.",
      "쎈보다 확실히 한두 단계 위이며, 상위 3% 도전을 위한 필독서예요.",
    ],
    buyUrl: search("최상위 수학 초등"),
    levels: ["advanced"],
    styles: ["comprehensive", "descriptive"],
    difficulty: 9.0,
    band: 7,
    difficultyNote: "쎈이나 일품보다 훨씬 어려운 극심화 교재",
  },
  {
    id: "choesangwi-yeon-san",
    name: "최상위 연산은 수학이다",
    publisher: "디딤돌",
    tags: ["연산"],
    reasons: [
      "단순 기계적 계산이 아니라 수의 원리와 연산 법칙을 생각하게 하는 연산서예요.",
      "연산과 교과 개념을 함께 챙기고 싶은 학생에게 추천해요.",
    ],
    buyUrl: search("최상위 연산은 수학이다"),
    levels: ["basic", "application"],
    styles: ["calculation"],
    difficulty: 2.8,
    band: 1,
    difficultyNote: "원리 중심의 구조적 연산서",
  },

  // ===================== [천재교육] =====================
  {
    id: "chunjae-concept-law",
    name: "개념 해결의 법칙",
    publisher: "천재교육",
    tags: ["개념", "기본"],
    reasons: [
      "교과서 개념을 만화와 쉬운 설명으로 풀어내어 선행이나 자습에 최적화되어 있어요.",
      "기초가 부족하거나 수학에 거부감이 있는 아이도 재미있게 풀 수 있어요.",
    ],
    buyUrl: search("개념 해결의 법칙 초등"),
    levels: ["basic"],
    styles: ["comprehensive"],
    difficulty: 3.4,
    band: 2,
    difficultyNote: "디딤돌 원리/기본과 유사한 친절한 개념 입문서",
  },
  {
    id: "chunjae-pattern-law",
    name: "유형 해결의 법칙",
    publisher: "천재교육",
    tags: ["유형", "응용"],
    reasons: [
      "학교 시험에 나오는 모든 교과 유형을 빈틈없이 체계화한 대표 유형서예요.",
      "쎈의 방대한 양이 부담스러운 아이가 핵심 유형을 알차게 정복하기 좋아요.",
    ],
    buyUrl: search("유형 해결의 법칙 초등"),
    levels: ["basic", "application"],
    styles: ["comprehensive"],
    difficulty: 5.4,
    band: 4,
    difficultyNote: "디딤돌 기응과 대등한 난이도, 쎈보다 살짝 진입장벽이 낮음",
  },
  {
    id: "chunjae-app-law",
    name: "응용 해결의 법칙",
    publisher: "천재교육",
    tags: ["응용", "심화"],
    reasons: [
      "단원별 심화·응용 문제와 서술형 유형을 집중 훈련하는 실력서예요.",
      "유형 해결의 법칙을 끝낸 후 최상위권 진입을 노릴 때 이상적인 다음 단계예요.",
    ],
    buyUrl: search("응용 해결의 법칙 초등"),
    levels: ["application", "advanced"],
    styles: ["comprehensive", "descriptive"],
    difficulty: 6.8,
    band: 5,
    difficultyNote: "쎈 C단계 수준의 문제들을 다수 포함한 준심화서",
  },
  {
    id: "chunjae-top-level",
    name: "최고수준 수학",
    publisher: "천재교육",
    tags: ["심화", "최상위"],
    reasons: [
      "교내 경시대회와 영재원 대비를 위한 고난도 심화·창의사고력 문제집이에요.",
      "디딤돌 최상위와 어깨를 나란히 하는 천재교육의 최고난도 라인업이에요.",
    ],
    buyUrl: search("최고수준 수학 초등"),
    levels: ["advanced"],
    styles: ["comprehensive"],
    difficulty: 8.7,
    band: 7,
    difficultyNote: "디딤돌 최상위와 동급의 최상위권 경시대비서",
  },
  {
    id: "ping-gyesan",
    name: "빅터연산",
    publisher: "천재교육",
    tags: ["연산"],
    reasons: [
      "만화와 스마트 러닝 요소를 접목해 지루하지 않게 연산력을 키워 줘요.",
      "매일 정해진 분량으로 연산 습관을 들이고 싶은 초등 저학년·중학년에 강추해요.",
    ],
    buyUrl: search("빅터연산 초등"),
    levels: ["basic", "application"],
    styles: ["calculation"],
    difficulty: 2.0,
    band: 1,
    difficultyNote: "부담 없는 드릴 연산서",
  },
  {
    id: "chunjae-math-leader-basic",
    name: "수학리더 기본",
    publisher: "천재교육",
    tags: ["기본", "개념"],
    reasons: [
      "한 권으로 교과서 개념과 기초 익힘책 문제를 깔끔하게 정리해 줘요.",
      "예습용 교재로 인기가 높으며 가독성이 매우 뛰어납니다.",
    ],
    buyUrl: search("수학리더 기본 초등"),
    levels: ["basic"],
    styles: ["comprehensive"],
    difficulty: 3.6,
    band: 3,
    difficultyNote: "교과 진도 학습용 기본서",
  },
  {
    id: "chunjae-math-leader-app",
    name: "수학리더 응용·심화",
    publisher: "천재교육",
    tags: ["응용", "심화"],
    reasons: [
      "기본 유형부터 각종 경시 기출 변형까지 폭넓은 난도를 아우르는 교재예요.",
      "쎈과 최상위S 사이 난이도를 원하는 학생에게 훌륭한 선택지입니다.",
    ],
    buyUrl: search("수학리더 응용 심화"),
    levels: ["application", "advanced"],
    styles: ["comprehensive"],
    difficulty: 6.5,
    band: 5,
    difficultyNote: "응용에서 심화로 넘어가는 실력서",
  },

  // ===================== [좋은책신사고] =====================
  {
    id: "shinsago-concept-ssen",
    name: "개념쎈 초등수학",
    publisher: "좋은책신사고",
    tags: ["개념", "기본"],
    reasons: [
      "개념북과 워크북을 통해 개념을 완벽하게 잘게 쪼개어 체계화한 개념 기본서예요.",
      "선행 학습 시 개념을 꼼꼼하게 다지며 기초 연산까지 함께 챙길 수 있어요.",
    ],
    buyUrl: search("개념쎈 초등수학"),
    levels: ["basic"],
    styles: ["comprehensive"],
    difficulty: 3.5,
    band: 3,
    difficultyNote: "쎈 시리즈 중 가장 기초적인 개념서",
  },
  {
    id: "shinsago-light-ssen",
    name: "라이트쎈 초등수학",
    publisher: "좋은책신사고",
    tags: ["유형", "기본"],
    reasons: [
      "오리지널 쎈 수학보다 어려운 C단계를 빼고 필수 기본 유형만 압축했어요.",
      "쎈이 다소 버거운 아이가 유형 연습을 부담 없이 소화할 수 있어요.",
    ],
    buyUrl: search("라이트쎈 초등수학"),
    levels: ["basic", "application"],
    styles: ["comprehensive"],
    difficulty: 4.8,
    band: 4,
    difficultyNote: "쎈보다 쉽고, 디딤돌 기응보다 유형 수가 많음",
  },
  {
    id: "ssen",
    name: "쎈(SSEN) 수학",
    publisher: "좋은책신사고",
    tags: ["유형", "응용"],
    reasons: [
      "A(기본)·B(유형)·C(응용심화)의 3단계로 초등 유형서의 절대강자예요.",
      "유형 해결의 법칙보다 문항 수가 많고 C단계의 응용 난도가 꽤 높습니다.",
    ],
    buyUrl: search("쎈 초등 수학"),
    levels: ["application", "advanced"],
    styles: ["comprehensive"],
    difficulty: 6.0,
    band: 5,
    difficultyNote: "유형서의 대명사 (C단계는 준심화 수준, 단 디딤돌 최상위보단 확실히 낮음)",
  },
  {
    id: "ugongbi",
    name: "우공비 초등수학",
    publisher: "좋은책신사고",
    tags: ["개념", "기본"],
    reasons: [
      "이미지로 개념을 쉽게 기억하게 돕는 전형적인 교과 보조 학습서예요.",
      "학교 시험 및 단원평가 대비에 가장 무난하고 균형 잡힌 구성을 자랑해요.",
    ],
    buyUrl: search("우공비 초등수학"),
    levels: ["basic", "application"],
    styles: ["comprehensive"],
    difficulty: 4.0,
    band: 3,
    difficultyNote: "학교 교과 진도용 표준서",
  },
  {
    id: "ilpum",
    name: "일품 초등수학",
    publisher: "좋은책신사고",
    tags: ["심화"],
    reasons: [
      "쎈 수학 B/C단계를 소화한 후 도전하는 신사고의 대표 심화서예요.",
      "쎈보다 확연히 어렵고 최상위S와 최상위 수학 사이의 탄탄한 심화 문제입니다.",
    ],
    buyUrl: search("일품 초등수학"),
    levels: ["advanced"],
    styles: ["comprehensive"],
    difficulty: 8.0,
    band: 6,
    difficultyNote: "쎈보다 명확히 어렵고, 디딤돌 최상위보다는 살짝 접근성 있음",
  },
  {
    id: "shinsago-ssen-yeonsan",
    name: "쎈연산",
    publisher: "좋은책신사고",
    tags: ["연산"],
    reasons: [
      "교과 진도와 연계된 연산 학습으로 학기별 단원 개념을 동시에 다져요.",
      "매일 2쪽씩 규칙적으로 풀며 연산 정확성을 확보하기 좋습니다.",
    ],
    buyUrl: search("쎈연산 초등"),
    levels: ["basic", "application"],
    styles: ["calculation"],
    difficulty: 2.2,
    band: 1,
    difficultyNote: "교과 연계 드릴 연산서",
  },

  // ===================== [비상교육] =====================
  {
    id: "visang-concept-type-light",
    name: "개념플러스유형 라이트",
    publisher: "비상교육",
    tags: ["개념", "기본"],
    reasons: [
      "개념책과 복습책의 1:1 매칭 구조로 기초를 완벽하게 반복 학습할 수 있어요.",
      "학원과 홈스쿨링에서 진도용 교재로 가장 신뢰받는 베스트셀러입니다.",
    ],
    buyUrl: search("개념플러스유형 라이트 초등"),
    levels: ["basic"],
    styles: ["comprehensive"],
    difficulty: 3.8,
    band: 3,
    difficultyNote: "개념과 기본 유형의 충실한 반복",
  },
  {
    id: "visang-concept-type-power",
    name: "개념플러스유형 파워",
    publisher: "비상교육",
    tags: ["응용", "유형"],
    reasons: [
      "응용 문제와 서술형 비중을 높여 상위권으로 도약할 수 있도록 이끌어 줘요.",
      "쎈 수학 B~C단계 수준의 문제를 체계적으로 훈련하기에 적합해요.",
    ],
    buyUrl: search("개념플러스유형 파워 초등"),
    levels: ["application", "advanced"],
    styles: ["comprehensive"],
    difficulty: 6.2,
    band: 5,
    difficultyNote: "쎈 수학과 매우 유사한 응용 실력 난이도",
  },
  {
    id: "visang-top-score",
    name: "최고득점 수학",
    publisher: "비상교육",
    tags: ["심화", "최상위"],
    reasons: [
      "심화 핵심 유형부터 최고난도 경시 기출까지 단계적으로 공략하는 심화서예요.",
      "일품 및 디딤돌 최상위 수학과 견줄 수 있는 고난도 교재입니다.",
    ],
    buyUrl: search("최고득점 수학 초등"),
    levels: ["advanced"],
    styles: ["comprehensive"],
    difficulty: 8.3,
    band: 6,
    difficultyNote: "일품 수준의 고난도 심화서",
  },

  // ===================== [미래엔] =====================
  {
    id: "gilrabi-wonri",
    name: "문제해결의 길잡이 (원리)",
    publisher: "미래엔",
    tags: ["서술형", "응용"],
    reasons: [
      "문해길로 불리며, 단순 계산이 아닌 문제를 읽고 해결 전략을 세우는 훈련에 최고예요.",
      "서술형과 문장제 문제에 유독 약한 아이의 문해력과 식 세우기를 고쳐 줍니다.",
    ],
    buyUrl: search("문제해결의 길잡이 원리 초등"),
    levels: ["application"],
    styles: ["descriptive"],
    difficulty: 5.8,
    band: 4,
    difficultyNote: "서술형 중심 응용 훈련서",
  },
  {
    id: "gilrabi-simhwa",
    name: "문제해결의 길잡이 (심화)",
    publisher: "미래엔",
    tags: ["서술형", "심화", "최상위"],
    reasons: [
      "초등 서술형 및 사고력 심화 분야의 최고봉으로 꼽히는 명저예요.",
      "디딤돌 최상위만큼 어렵고, 특히 긴 문장제 최고난도 문제를 다룹니다.",
    ],
    buyUrl: search("문제해결의 길잡이 심화 초등"),
    levels: ["advanced"],
    styles: ["descriptive", "comprehensive"],
    difficulty: 8.8,
    band: 7,
    difficultyNote: "디딤돌 최상위급 고난도 서술형 심화서",
  },
  {
    id: "miraen-haru-soksem",
    name: "하루한장 쏙셈",
    publisher: "미래엔",
    tags: ["연산"],
    reasons: [
      "하루 1장씩 쏙 뽑아 풀 수 있어 아이들의 학습 부담감이 가장 적은 연산서예요.",
      "자기주도 학습 습관을 들이고 계산 실수를 줄이는 데 아주 효과적이에요.",
    ],
    buyUrl: search("하루한장 쏙셈"),
    levels: ["basic"],
    styles: ["calculation"],
    difficulty: 2.0,
    band: 1,
    difficultyNote: "하루 1장 분량의 부담 없는 연산서",
  },

  // ===================== [시매쓰 & 길벗스쿨] =====================
  {
    id: "gitjuk-gyesan",
    name: "기적의 계산법",
    publisher: "길벗스쿨",
    tags: ["연산", "기본"],
    reasons: [
      "학년별 연산 단계가 촘촘하게 나뉘어 있어 매일 조금씩 연산 실력을 쌓기 좋아요.",
      "반복 훈련 구성이라 계산 속도와 정확도를 함께 키우고 싶은 아이에게 딱이에요.",
    ],
    buyUrl: search("기적의 계산법"),
    levels: ["basic", "application"],
    styles: ["calculation"],
    difficulty: 2.0,
    band: 1,
    difficultyNote: "국민 연산 드릴 교재",
  },
  {
    id: "munjangje-wang",
    name: "초등수학 문장제의 왕",
    publisher: "시매쓰",
    tags: ["서술형", "기본"],
    reasons: [
      "문장제를 단계별로 나눠 차근차근 접근해 서술형이 어려운 아이도 부담이 적어요.",
      "문장을 식으로 옮기는 연습을 집중적으로 하고 싶을 때 좋아요.",
    ],
    buyUrl: search("초등 수학 문장제"),
    levels: ["basic", "application"],
    styles: ["descriptive"],
    difficulty: 4.2,
    band: 3,
    difficultyNote: "기본 문장제 길라잡이",
  },
  {
    id: "cmath-1031-pre",
    name: "사고력수학 1031 (입문·초급)",
    publisher: "시매쓰",
    tags: ["사고력", "최상위"],
    reasons: [
      "영재교육원과 경시대회 준비를 위한 독보적인 창의사고력 교재예요.",
      "교과 수학을 넘어선 수학적 논리와 탐구력을 기르는 최상위 코스입니다.",
    ],
    buyUrl: search("사고력수학 1031"),
    levels: ["advanced"],
    styles: ["comprehensive", "descriptive"],
    difficulty: 9.3,
    band: 7,
    difficultyNote: "교과를 넘어선 경시/영재원용 극심화 사고력서",
  },
]

// 출판사 간 난이도 비교를 위한 7단계 밴드 정의
export type DifficultyBandInfo = {
  band: 1 | 2 | 3 | 4 | 5 | 6 | 7
  title: string
  subtitle: string
  color: string
  badgeColor: string
  description: string
  targetTarget: string
}

export const difficultyBands: DifficultyBandInfo[] = [
  {
    band: 1,
    title: "1단계 : 연산 / 기초 드릴",
    subtitle: "정확도와 계산 속도 집중 훈련",
    color: "teal",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    description: "매일 1~2쪽씩 계산 실수 줄이기와 연산 습관을 위한 단계",
    targetTarget: "연산 실수가 잦거나 연산 속도가 느린 모든 학생",
  },
  {
    band: 2,
    title: "2단계 : 개념 / 원리 입문",
    subtitle: "선행 및 첫 진도용 쉬운 개념서",
    color: "sky",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    description: "그림과 친절한 설명으로 수학 거부감을 없애고 원리를 익히는 단계",
    targetTarget: "새 학년 예습을 처음 시작하거나 수학에 자신감이 부족한 아이",
  },
  {
    band: 3,
    title: "3단계 : 기본 / 교과 다지기",
    subtitle: "학교 교과서 & 익힘책 완벽 마스터",
    color: "emerald",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "학교 수업 진도에 맞춰 단원평가와 교과 기본 개념을 탄탄히 다지는 단계",
    targetTarget: "학교 시험에서 80점 이상을 안정적으로 목표하는 학생",
  },
  {
    band: 4,
    title: "4단계 : 유형 / 기본 응용",
    subtitle: "다양한 시험 기출 유형 정복",
    color: "amber",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "개념과 응용을 결합하거나 표준 유형을 체계적으로 훈련하는 필수 코스",
    targetTarget: "교과서는 잘 풀지만 시험이나 새로운 문제에 당황하는 아이",
  },
  {
    band: 5,
    title: "5단계 : 실력 응용 / 준심화",
    subtitle: "상위권 도약을 위한 응용 심화",
    color: "orange",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    description: "유형서의 대표주자 쎈의 C단계, 응용 해결의 법칙 등 깊이 있는 응용 단계",
    targetTarget: "상위 10% 이내 진입을 목표로 문제 해결력을 키우고 싶은 학생",
  },
  {
    band: 6,
    title: "6단계 : 심화 / 고난도",
    subtitle: "복합 사고력과 고난도 문제 정복",
    color: "rose",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    description: "최상위 진입을 위한 징검다리(최상위S), 일품 등 쎈보다 확실히 높은 난이도",
    targetTarget: "유형서를 막힘없이 풀고 한 단계 높은 심화에 도전하는 상위권",
  },
  {
    band: 7,
    title: "7단계 : 최상위 / 극심화",
    subtitle: "최상위 1% 및 경시대회 준비",
    color: "purple",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description: "디딤돌 최상위, 최고수준, 문해길 심화 등 깊은 논리적 사고가 필요한 극심화",
    targetTarget: "수학적 직관과 끈기가 뛰어나며 교내외 경시대회를 목표하는 학생",
  },
]

export const majorPublishers = [
  "디딤돌",
  "좋은책신사고",
  "천재교육",
  "비상교육",
  "미래엔",
] as const

// ===================== 황금 조합 추천 =====================

export type ComboTier = "기초" | "중위" | "상위"

export type ComboSlot = {
  role: "개념서" | "유형서" | "연산서" | "심화서" | "서술형서"
  workbookId: string
  /** 이 슬롯에서 해당 교재를 선택한 이유 */
  reason: string
}

export type ComboSet = {
  tier: ComboTier
  title: string
  subtitle: string
  /** 그라데이션 테마용 tailwind 색상 키워드 */
  color: string
  accentFrom: string
  accentTo: string
  description: string
  targetDescription: string
  slots: ComboSlot[]
  studyTip: string
}

export const goldenCombos: ComboSet[] = [
  {
    tier: "기초",
    title: "기초 탄탄 조합",
    subtitle: "개념부터 차근차근, 기본기를 다지는 황금 세트",
    color: "emerald",
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-500",
    description:
      "수학 기초가 불안하거나 새 학년 예습을 시작하는 아이를 위한 조합이에요. 쉬운 개념서로 원리를 이해하고, 가벼운 유형서로 문제 감각을 키우고, 매일 연산으로 계산 실수를 줄여 줘요.",
    targetDescription: "학교 시험 70~85점 / 새 학년 선행 시작 / 수학 자신감이 부족한 아이",
    slots: [
      {
        role: "개념서",
        workbookId: "didimdol-basic",
        reason: "교과 개념을 체계적으로 설명해 예습과 복습 모두에 적합해요.",
      },
      {
        role: "유형서",
        workbookId: "shinsago-light-ssen",
        reason: "쎈보다 부담이 적으면서 필수 유형을 놓치지 않아요.",
      },
      {
        role: "연산서",
        workbookId: "miraen-haru-soksem",
        reason: "하루 1장이라 학습 부담이 적고 꾸준한 습관을 만들어 줘요.",
      },
    ],
    studyTip:
      "📅 개념서를 먼저 1단원씩 끝낸 뒤, 같은 단원의 유형서를 푸세요. 연산서는 매일 1장씩 별도로 병행하면 효과적이에요.",
  },
  {
    tier: "중위",
    title: "실력 도약 조합",
    subtitle: "개념은 OK! 유형 정복으로 상위권에 도전하는 세트",
    color: "amber",
    accentFrom: "from-amber-500",
    accentTo: "to-orange-500",
    description:
      "교과 기본은 이해했지만 시험에서 응용 문제에 막히는 아이를 위한 조합이에요. 개념을 빠르게 정리한 뒤 대표 유형서로 문제 해결력을 키우고, 연산서로 실수를 잡아요.",
    targetDescription: "학교 시험 85~95점 / 유형 문제에서 실수 잦음 / 상위권 진입 목표",
    slots: [
      {
        role: "개념서",
        workbookId: "didimdol-basic-app",
        reason: "개념과 응용을 한 권에 해결해 효율적으로 복습할 수 있어요.",
      },
      {
        role: "유형서",
        workbookId: "ssen",
        reason: "A·B·C 3단계로 모든 유형을 체계적으로 정복하는 절대강자예요.",
      },
      {
        role: "연산서",
        workbookId: "shinsago-ssen-yeonsan",
        reason: "교과 진도와 연계되어 개념 복습과 연산 훈련을 동시에 해요.",
      },
    ],
    studyTip:
      "📅 기본+응용으로 단원 개념을 빠르게 잡고, 쎈 B·C단계에 집중하세요. 연산은 틀린 유형만 선별해서 반복하면 효율이 올라가요.",
  },
  {
    tier: "상위",
    title: "최상위 도전 조합",
    subtitle: "심화·경시까지, 수학 실력을 극대화하는 세트",
    color: "purple",
    accentFrom: "from-purple-500",
    accentTo: "to-rose-500",
    description:
      "교과 유형은 수월하게 풀고 심화·경시대회까지 도전하려는 아이를 위한 조합이에요. 응용서로 워밍업한 뒤 최상위 심화서로 사고력을 키우고, 서술형 전문서로 논리력을 보강해요.",
    targetDescription: "학교 시험 95점 이상 / 경시대회·영재원 준비 / 수학적 사고력 확장",
    slots: [
      {
        role: "유형서",
        workbookId: "didimdol-app",
        reason: "응용 문제에 집중해 심화 진입 전 실력을 점검하기 좋아요.",
      },
      {
        role: "심화서",
        workbookId: "choesangwi",
        reason: "초등 심화의 대표 교재로 깊은 사고력과 문제 해결 전략을 길러 줘요.",
      },
      {
        role: "서술형서",
        workbookId: "gilrabi-wonri",
        reason: "문제 읽기→전략 세우기→풀이 쓰기의 3단계 서술형 훈련의 끝판왕이에요.",
      },
    ],
    studyTip:
      "📅 디딤돌 응용으로 단원별 워밍업 → 최상위 수학으로 심화 도전 → 문해길로 서술형 마무리. 막히는 문제는 3분 고민 후 해설을 보고 다시 풀어 보세요.",
  },
]

/** 조합 내 workbookId로 실제 Workbook 객체를 찾는 헬퍼 */
export function getWorkbookById(id: string): Workbook | undefined {
  return workbooks.find((wb) => wb.id === id)
}

export function recommend(level: Level, style: Style, track: Track = "current"): Workbook[] {
  const order: Level[] = ["basic", "application", "advanced"]
  const scored = workbooks
    .map((wb) => {
      let score = 0
      if (wb.levels.includes(level)) score += 2
      if (wb.styles.includes(style)) score += 3
      // partial level proximity
      const dist = Math.abs(order.indexOf(level) - closestLevel(wb, order.indexOf(level)))
      score -= dist * 0.5

      if (track === "advance") {
        // 선행: 새 학년 개념을 처음 배우므로 개념·기본 위주, 심화·최상위는 지양
        if (wb.tags.includes("개념")) score += 3
        if (wb.levels.includes("basic")) score += 2
        if (wb.tags.includes("심화")) score -= 4
        if (wb.tags.includes("최상위")) score -= 4
        if (wb.levels.includes("advanced") && !wb.levels.includes("basic")) score -= 2
      } else {
        // 현행: 지금 학년을 깊이 다지므로 심화·유형까지 폭넓게
        if (level === "advanced" && (wb.tags.includes("심화") || wb.tags.includes("최상위"))) {
          score += 2.5
        }
        if (level === "application" && (wb.tags.includes("유형") || wb.tags.includes("응용"))) {
          score += 1.5
        }
      }
      return { wb, score }
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  const picked = scored.slice(0, 3).map((s) => s.wb)
  return picked.length >= 2 ? picked : workbooks.slice(0, 3)
}

function closestLevel(wb: Workbook, target: number) {
  const order: Level[] = ["basic", "application", "advanced"]
  const idxs = wb.levels.map((l) => order.indexOf(l))
  return idxs.reduce((best, i) =>
    Math.abs(i - target) < Math.abs(best - target) ? i : best,
  idxs[0])
}

