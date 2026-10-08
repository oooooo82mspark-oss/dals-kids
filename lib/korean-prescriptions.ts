export type KoreanPrescription = {
  id: string
  symptom: string
  shortBadge: string
  tagColor: string
  cause: string
  solution: string
  recommendedWorkbookNames: string[]
  recommendedBookNames: string[]
  studyRoutine: string
  caution: string
}

export const koreanPrescriptions: KoreanPrescription[] = [
  {
    id: "read-no-understand",
    symptom: "책은 술술 잘 읽는데 물어보면 내용을 전혀 기억 못 해요 (음독 허상)",
    shortBadge: "이해력 부재 처방",
    tagColor: "border-rose-200 bg-rose-50 text-rose-800",
    cause: "글자를 눈으로 훑고 소리 내어 읽지만, 머릿속에서 이미지나 생각으로 번역하지 않는 '기계적 읽기' 상태입니다.",
    solution: "한 문단씩 읽은 뒤 '방금 무슨 일이 있었지?' 한 줄 말로 요약하게 하고, 문제에서 근거 문장을 찾아 밑줄 긋는 훈련을 시켜주세요.",
    recommendedWorkbookNames: ["뿌리깊은 초등국어 독해력", "똑똑한 하루 독해"],
    recommendedBookNames: ["만복이네 떡집", "알사탕"],
    studyRoutine: "문제집 지문 1편 풀기 전, 아이가 핵심 사건 3가지를 손가락으로 꼽으며 말해보기",
    caution: "속독을 칭찬하지 마세요. 천천히 곱씹으며 읽는 '정독 습관'이 진짜 문해력의 시작입니다.",
  },
  {
    id: "vocab-block",
    symptom: "어휘력이 부족해 문제 속 단어 뜻을 몰라 엉뚱한 답을 골라요",
    shortBadge: "어휘 결손 처방",
    tagColor: "border-sky-200 bg-sky-50 text-sky-800",
    cause: "초등 3학년부터 급증하는 교과 한자어와 추상어 노출이 부족하여 문장 전체의 맥락이 끊깁니다.",
    solution: "사전을 찾는 노동 대신, 문맥 속에서 단어의 쓰임새를 익히는 전용 어휘서와 사자성어·속담 만화를 곁들여 어휘 친밀도를 높여주세요.",
    recommendedWorkbookNames: ["어휘가 문해력이다", "초등국어 어휘왕"],
    recommendedBookNames: ["아홉 살 마음 사전", "용선생 초등 교과서 사회"],
    studyRoutine: "하루 새 단어 3개씩 가족 식사 자리나 대화 중에 직접 넣어 문장 만들어 보기",
    caution: "단어장 깜지 쓰기처럼 암기를 강요하면 어휘를 싫어하게 되니 문맥 속에서 뜻을 유추하게 유도하세요.",
  },
  {
    id: "main-sentence-fail",
    symptom: "글의 중심 생각(주제)이나 글쓴이의 의도를 전혀 못 찾아요",
    shortBadge: "주제 파악 처방",
    tagColor: "border-purple-200 bg-purple-50 text-purple-800",
    cause: "단락(문단)별로 중요한 문장과 이를 뒷받침하는 부가 설명을 구분하는 논리적 읽기 훈련이 부족합니다.",
    solution: "각 문단의 첫 문장과 끝 문장에 집중하고, 접속사(그러나, 그러므로, 따라서) 뒤에 오는 결론 문장에 형광펜을 칠하는 시각적 훈련이 필요합니다.",
    recommendedWorkbookNames: ["EBS 문해력 첫걸음/와작", "초등국어 독해왕"],
    recommendedBookNames: ["초등학생을 위한 개념 사피엔스", "자전거 도둑"],
    studyRoutine: "독해 문제 풀 때마다 지문 옆에 '문단별 소주제 한 줄 메모' 남기는 연습하기",
    caution: "부모님이 답을 먼저 알려주지 마시고 '이 글에서 딱 한 문장만 남긴다면 뭘 고를래?'라고 질문을 던져주세요.",
  },
  {
    id: "comic-addict",
    symptom: "학습만화는 하루 종일 보는데 줄글 책(동화책)은 10분도 못 읽어요",
    shortBadge: "만화 탈피 처방",
    tagColor: "border-amber-200 bg-amber-50 text-amber-800",
    cause: "만화의 즉각적인 시각 자극과 대화체에 뇌가 익숙해져, 줄글을 머릿속에서 상상화로 렌더링하는 뇌 회로가 피로감을 느끼기 때문입니다.",
    solution: "갑자기 두꺼운 책을 주지 말고, 그림과 줄글의 비율이 5:5인 얇은 저학년 챕터북이나 낭독(부모 번갈아 읽기)으로 다리를 놓아주세요.",
    recommendedWorkbookNames: ["똑똑한 하루 독해", "바른 글씨와 또박또박 맞춤법"],
    recommendedBookNames: ["만복이네 떡집", "알사탕"],
    studyRoutine: "부모님이 한 페이지, 아이가 한 페이지 번갈아 소리 내어 읽는 '핑퐁 낭독 독서법'",
    caution: "학습만화를 쓰레기 취급하며 강제로 뺏지 마세요. 만화 속 재미있는 주제를 줄글 책으로 연결해 주는 큐레이션이 필요합니다.",
  },
  {
    id: "spelling-space-error",
    symptom: "받아쓰기나 서술형 글쓰기에서 맞춤법·띄어쓰기 실수가 너무 많아요",
    shortBadge: "맞춤법·문법 처방",
    tagColor: "border-teal-200 bg-teal-50 text-teal-800",
    cause: "소리 나는 대로 쓰는 습관이 굳어지고, 글자의 원형(어간·어미)에 대한 기초 맞춤법 규칙 지도가 누락되었습니다.",
    solution: "틀리기 쉬운 대표 받침 규칙(쌍자음, 겹받침)과 띄어쓰기 기본 원칙을 짧은 문장 필사로 손에 익히는 문법 보완서가 직효입니다.",
    recommendedWorkbookNames: ["바른 글씨와 또박또박 맞춤법/띄어쓰기", "어휘가 문해력이다"],
    recommendedBookNames: ["아홉 살 마음 사전"],
    studyRoutine: "매일 일기나 교재에서 가장 마음에 드는 명문장 2문장 정갈하게 따라 쓰기(필사)",
    caution: "글쓰기 창의성을 표현할 때 맞춤법 하나하나를 지적하면 글쓰기 자체를 두려워하게 되니 분리해서 지도하세요.",
  },
]

export type KoreanFAQItem = {
  id: string
  category: "독서 vs 문제집" | "학습만화" | "공부 분량" | "어휘/한자"
  question: string
  shortAnswer: string
  detailedAnswer: string[]
  tips: string
}

export const koreanFaqs: KoreanFAQItem[] = [
  {
    id: "book-vs-workbook",
    category: "독서 vs 문제집",
    question: "책만 많이 읽으면 국어 문제집은 안 풀어도 되나요?",
    shortAnswer: "자유 독서와 시험 독해는 다릅니다. '책 읽기(배경지식)'와 '독해 문제집(문제 해결력)'은 상호보완 관계입니다.",
    detailedAnswer: [
      "책을 많이 읽는 아이는 배경지식과 어휘가 풍부해 큰 자산을 갖추고 있지만, 글쓴이의 의도 파악이나 객관식 선택지의 매력적인 오답을 걸러내는 '시험 독해력'은 별개의 훈련이 필요합니다.",
      "반대로 문제집만 풀고 책을 안 읽는 아이는 단기 점수는 나올지 몰라도 고학년 및 중·고등 비문학에서 배경지식의 한계에 부딪힙니다.",
      "가장 이상적인 비율은 '주 3~4회 하루 20분 자유 독서 + 주 3회 하루 15분(2~3쪽) 독해 문제집 루틴'입니다.",
    ],
    tips: "독서로 독해의 엔진(배경지식)을 키우고, 문제집으로 핸들과 브레이크(문제 풀이 기술)를 익혀야 합니다.",
  },
  {
    id: "is-comic-okay",
    category: "학습만화",
    question: "학습만화(흔한남매, 그리스로마신화 등)만 보는데 이대로 둬도 괜찮을까요?",
    shortAnswer: "배경지식 입문용으로는 훌륭하지만, 3학년부터는 반드시 줄글 책과 병행하는 전환 장치가 필수입니다.",
    detailedAnswer: [
      "학습만화는 어려운 과학·역사 개념에 대한 흥미의 문을 열어주는 긍정적 효과가 분명히 있습니다.",
      "하지만 만화는 그림과 대화체 위주라 글의 인과관계를 스스로 구성하는 '추상적 사고력'을 길러주지 못합니다.",
      "만화를 전면 금지하기보다는 '만화 1권 읽었으면 좋아하는 챕터북 1권 읽기', 또는 같은 주제의 줄글 지식 책(예: 용선생)으로 자연스럽게 사다리를 놓아주세요.",
    ],
    tips: "만화를 억지로 뺏지 마시고, 아이가 좋아하는 만화의 주제(예: 역사, 동물, 우주)와 연관된 줄글 책을 거실 테이블에 슬쩍 놓아두세요.",
  },
  {
    id: "daily-amount",
    category: "공부 분량",
    question: "국어 독해 문제집은 하루에 몇 장씩 푸는 게 적당한가요?",
    shortAnswer: "하루 딱 지문 1~2개(2~3쪽), 시간으로는 15분 내외가 가장 황금 루틴입니다.",
    detailedAnswer: [
      "수학과 달리 국어 독해는 양치기(많은 분량)를 하면 아이가 글을 대충 읽고 문제만 찍어 넘기는 나쁜 스키밍 습관이 생깁니다.",
      "지문 1개를 읽더라도 모르는 단어에 동그라미 치고, 각 문단의 중심 문장을 찾아보며 꼼꼼하게 읽는 '깊이 있는 정독'이 훨씬 가치 있습니다.",
      "채점 후 틀린 문제는 왜 틀렸는지 지문에서 정답의 근거 문장을 다시 찾아 형광펜을 긋게 하세요.",
    ],
    tips: "10문제를 대충 푸는 것보다, 3문제를 풀더라도 정답의 근거를 본문에서 손가락으로 짚어내는 연습이 핵심입니다.",
  },
  {
    id: "hanja-necessary",
    category: "어휘/한자",
    question: "초등 국어 어휘력을 위해 한자 공부나 한자 급수 시험이 꼭 필요한가요?",
    shortAnswer: "급수 시험 암기보다는 교과서 어휘에 자주 쓰이는 '핵심 한자 어원 50~100자'를 가볍게 익히는 것이 100배 유용합니다.",
    detailedAnswer: [
      "한국어 어휘의 70% 이상, 특히 교과서 개념어(광합성, 분수, 민주주의 등)의 90% 이상이 한자어입니다.",
      "그러나 어려운 한자를 획순대로 쓰는 급수 시험은 아이에게 스트레스만 줄 뿐 실전 문해력으로 연결되지 않습니다.",
      "예를 들어 '출(出 = 날 출)'이라는 글자 하나를 알면 '출구, 출석, 수출, 출발'을 저절로 유추할 수 있듯이, 어원 중심의 가벼운 한자 학습서나 교과 어휘서를 권장합니다.",
    ],
    tips: "한자를 쓰는 데 집중하지 말고, 글자의 '뜻'을 바탕으로 단어들의 공통점을 찾아보는 수수께끼 놀이로 접근해 보세요.",
  },
]
