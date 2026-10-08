export type KoreanQuizQuestion = {
  id: string
  type: "어휘" | "문맥이해" | "추론/주제"
  question: string
  passage?: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type KoreanQuizResult = {
  score: number // 맞은 개수
  total: number
  level: "basic" | "application" | "advanced"
  levelTitle: string
  analysis: string
  recommendedWorkbookIds: string[]
  recommendedBookIds: string[]
}

// 초등 학년 밴드별 문해력·어휘 3분 진단 퀴즈
export const koreanQuizByGrade: Record<number, KoreanQuizQuestion[]> = {
  // 1~2학년
  1: [
    {
      id: "k1-1",
      type: "어휘",
      question: "다음 중 '비가 그치고 날씨가 맑게 갠 모양'을 나타내는 낱말은 무엇일까요?",
      options: ["주룩주룩", "보슬보슬", "활짝", "말끔히"],
      correctIndex: 2,
      explanation: "'활짝'은 날씨가 맑게 개거나 꽃이 활짝 핀 모양을 뜻해요.",
    },
    {
      id: "k1-2",
      type: "문맥이해",
      passage: "민수는 잃어버렸던 강아지를 공원에서 다시 찾았습니다. 민수의 기분은 어떨까요?",
      question: "글을 읽고 민수의 마음으로 가장 알맞은 것을 고르세요.",
      options: ["안도하고 기쁘다", "화가 나고 억울하다", "심심하고 졸리다", "부끄럽고 미안하다"],
      correctIndex: 0,
      explanation: "소중한 강아지를 되찾았으므로 마음이 놓이고 기쁜 감정이에요.",
    },
    {
      id: "k1-3",
      type: "추론/주제",
      passage: "토끼는 거북이가 느리다고 낮잠을 잤습니다. 거북이는 쉬지 않고 걸어가 먼저 도착했습니다.",
      question: "이 이야기에서 배울 수 있는 생각은 무엇일까요?",
      options: ["빨리 달리는 것이 최고다", "포기하지 않고 꾸준히 노력하면 해낼 수 있다", "잠을 많이 자야 건강하다", "친구를 놀려도 괜찮다"],
      correctIndex: 1,
      explanation: "느려도 쉬지 않고 꾸준히 성실하게 노력하는 것의 소중함을 알려줍니다.",
    },
  ],
  2: [
    {
      id: "k2-1",
      type: "어휘",
      question: "다음 중 '물건의 크기나 부피가 자꾸 줄어들다'라는 뜻의 알맞은 낱말은?",
      options: ["늘어나다", "줄어들다", "쏟아지다", "펼쳐지다"],
      correctIndex: 1,
      explanation: "양이 적어지거나 작아지는 것은 '줄어들다'입니다.",
    },
    {
      id: "k2-2",
      type: "문맥이해",
      passage: "지우는 동생이 아끼던 장난감을 실수로 떨어뜨려 망가뜨렸습니다. 지우가 동생에게 해야 할 말은 무엇일까요?",
      question: "상황에 알맞은 지우의 말을 고르세요.",
      options: ["네가 거기 둔 탓이잖아!", "정말 미안해, 내가 일부러 그런 건 아니야.", "새 걸로 사 오면 되잖아.", "아무 말도 하지 않고 모른 척한다."],
      correctIndex: 1,
      explanation: "실수로 피해를 주었을 때는 솔직하게 사과하고 공감하는 태도가 올바릅니다.",
    },
    {
      id: "k2-3",
      type: "추론/주제",
      passage: "가을이 되자 나뭇잎들이 울긋불긋 물들고, 도토리가 숲속 바닥에 떨어졌습니다. 다람쥐들은 겨울을 나기 위해 바쁘게 움직였습니다.",
      question: "다람쥐들이 바쁘게 움직인 진짜 까닭은 무엇일까요?",
      options: ["겨울잠을 자기 전 먹이를 모아두기 위해", "다른 동물들과 놀기 위해", "숲이 너무 추워서 도망가려고", "나뭇잎을 청소하기 위해"],
      correctIndex: 0,
      explanation: "겨울철에 먹을 도토리를 땅속에 모아두기 위해 분주하게 일하는 모습이에요.",
    },
  ],
  // 3~4학년
  3: [
    {
      id: "k3-1",
      type: "어휘",
      question: "다음 문장의 밑줄 친 부분과 뜻이 가장 가까운 낱말은? [동생은 약속 시간에 <u>어김없이</u> 나타났다.]",
      options: ["틀림없이", "간신히", "우연히", "마지못해"],
      correctIndex: 0,
      explanation: "'어김없이'는 규칙이나 약속에서 벗어남이 없이 틀림없다는 뜻입니다.",
    },
    {
      id: "k3-2",
      type: "문맥이해",
      passage: "식물은 햇빛과 물, 공기 중의 이산화탄소를 이용해 스스로 영양분을 만듭니다. 이 과정을 광합성이라고 부릅니다. 광합성 덕분에 산소도 함께 만들어져 우리가 숨을 쉴 수 있습니다.",
      question: "윗글의 내용과 일치하지 않는 것은 무엇일까요?",
      options: ["식물은 스스로 양분을 만든다.", "광합성에는 햇빛과 물이 필요하다.", "광합성을 하면 산소가 만들어진다.", "식물은 밤에만 광합성을 한다."],
      correctIndex: 3,
      explanation: "광합성은 햇빛이 필요한 반응이므로 밤에만 한다는 설명은 틀렸습니다.",
    },
    {
      id: "k3-3",
      type: "추론/주제",
      passage: "한 아이가 바닷가에 밀려온 수천 마리의 불가사리를 하나씩 바다로 다시 던져주고 있었습니다. 한 어른이 '그렇게 많은데 네가 몇 마리 던진다고 세상이 달라지겠니?'라고 묻자, 아이는 불가사리를 던지며 말했습니다. '하지만 방금 제가 던진 이 한 마리에게는 세상이 바뀌었어요.'",
      question: "이 글이 주는 가장 큰 교훈은 무엇일까요?",
      options: ["바닷가 청소는 어른들이 해야 한다.", "결과가 크지 않아도 작은 생명을 구하는 실천은 소중하다.", "불가사리는 위험한 동물이다.", "불가능한 일은 처음부터 하지 말아야 한다."],
      correctIndex: 1,
      explanation: "비록 전체를 다 바꾸지 못해도, 당장 내가 도울 수 있는 작은 실천의 가치를 강조합니다.",
    },
  ],
  4: [
    {
      id: "k4-1",
      type: "어휘",
      question: "다음 중 '어떤 일에 온 마음과 정성을 쏟음'을 뜻하는 낱말은?",
      options: ["방심", "몰두", "외면", "망설임"],
      correctIndex: 1,
      explanation: "'몰두'는 어떤 일에 온 정신을 푹 기울여 빠져드는 것을 뜻합니다.",
    },
    {
      id: "k4-2",
      type: "문맥이해",
      passage: "훈민정음은 세종대왕이 백성들이 글자를 몰라 억울한 일을 당하는 것을 안타깝게 여겨 창제한 문자입니다. 자음은 발음 기관의 모양을, 모음은 하늘·땅·사람의 모습을 본떠 과학적으로 만들었습니다.",
      question: "세종대왕이 훈민정음을 만든 핵심 까닭은 무엇인가요?",
      options: ["중국에 글자의 우수성을 자랑하려고", "백성들이 글을 쉽게 배워 억울함을 겪지 않게 하려고", "신하들의 시험을 보기 위해", "비밀 암호로 사용하기 위해"],
      correctIndex: 1,
      explanation: "백성을 사랑하는 애민정신으로 억울한 백성을 구제하기 위해 만드셨습니다.",
    },
    {
      id: "k4-3",
      type: "추론/주제",
      passage: "사막여우는 몸집에 비해 커다란 귀를 가지고 있습니다. 이 큰 귀는 몸속의 열을 바깥으로 빠르게 내보내 체온을 낮춰 주고, 모래 속 작은 곤충의 소리까지 듣게 해 줍니다.",
      question: "사막여우의 귀가 큰 까닭으로 볼 수 있는 핵심 이유는?",
      options: ["멋있게 보여 천적을 위협하기 위해", "뜨거운 사막 환경에서 살아남기 위한 적응 결과", "바람을 타고 날아다니기 위해", "물을 저장해 두기 위해"],
      correctIndex: 1,
      explanation: "극심한 더위를 식히고 사냥을 용이하게 하기 위해 환경에 진화·적응한 결과입니다.",
    },
  ],
  // 5~6학년
  5: [
    {
      id: "k5-1",
      type: "어휘",
      question: "다음 중 '서로 반대되거나 어긋나는 관계'를 뜻하는 한자 성어는 무엇일까요?",
      options: ["동고동락", "모순(矛盾)", "일석이조", "역지사지"],
      correctIndex: 1,
      explanation: "창과 방패라는 뜻의 '모순'은 말이나 논리의 앞뒤가 서로 맞지 않는 것을 뜻합니다.",
    },
    {
      id: "k5-2",
      type: "문맥이해",
      passage: "인공지능(AI)은 인간의 반복 노동을 줄여주고 막대한 데이터를 순식간에 분석해 주는 편리함이 있다. 그러나 한편으로는 일자리 감소, 저작권 침해, 알고리즘 편향성과 같은 윤리적 문제도 함께 야기한다. 따라서 기술의 발전과 더불어 올바른 윤리적 규범 마련이 시급하다.",
      question: "글쓴이의 최종 주장으로 가장 적절한 것은?",
      options: ["인공지능 기술의 개발을 전면 중단해야 한다.", "인공지능의 장점만 부각하여 빠르게 도입해야 한다.", "AI 기술 발전에 발맞추어 윤리적 기준과 규범을 함께 마련해야 한다.", "알고리즘 분석은 컴퓨터에게만 맡기면 된다."],
      correctIndex: 2,
      explanation: "AI의 명암을 짚은 뒤 기술 발전과 병행하여 윤리적 규범이 필요하다고 주장하고 있습니다.",
    },
    {
      id: "k5-3",
      type: "추론/주제",
      passage: "꿀벌이 사라지면 인류의 식탁도 위험해진다. 우리가 먹는 농작물의 70% 이상이 꿀벌의 꽃가루받이(수분)를 통해 열매를 맺기 때문이다. 기후변화와 무분별한 농약 사용으로 꿀벌 군집이 붕괴되는 것은 곧 전 지구적 식량 위기의 서막이다.",
      question: "윗글을 통해 추론할 수 있는 가장 적절한 생각은?",
      options: ["꿀벌은 꿀만 생산하는 곤충이다.", "생태계의 작은 연결고리 파괴가 인류의 생존까지 위협할 수 있다.", "농약 사용을 더 늘려 해충을 잡아야 한다.", "꽃가루받이는 사람이 직접 하는 것이 더 효율적이다."],
      correctIndex: 1,
      explanation: "꿀벌의 멸종 위기가 인류 전체의 식량 안보와 직결됨을 통해 생태계 상호작용의 엄중함을 보여줍니다.",
    },
  ],
  6: [
    {
      id: "k6-1",
      type: "어휘",
      question: "다음 문장의 빈칸에 들어갈 가장 알맞은 말은? [이번 사건의 원인을 낱낱이 (      ) 밝혀냈다.]",
      options: ["규명하여", "묵인하여", "왜곡하여", "방관하여"],
      correctIndex: 0,
      explanation: "'규명하다'는 사실이나 진상을 자세히 따져 밝힌다는 뜻입니다.",
    },
    {
      id: "k6-2",
      type: "문맥이해",
      passage: "조선 후기 실학자 박지원은 '열하일기'를 통해 청나라의 발전된 문물을 소개하며, 낡은 명분론에 갇혀 있던 당시 조선 사회를 비판했다. 그는 백성의 삶을 실질적으로 윤택하게 만드는 '이용후생(利用厚生)'의 자세야말로 진정한 학문의 길이라고 역설했다.",
      question: "박지원이 생각한 올바른 학문의 목적은 무엇인가요?",
      options: ["벼슬에 올라 가문을 빛내는 것", "옛 성현의 말씀만 외우고 실천하지 않는 것", "백성들의 실생활을 풍요롭고 편리하게 돕는 것", "외국의 문물을 무조건 배척하는 것"],
      correctIndex: 2,
      explanation: "이용후생이란 백성의 생활에 실질적인 도움을 주는 실용적인 학문을 뜻합니다.",
    },
    {
      id: "k6-3",
      type: "추론/주제",
      passage: "디지털 기기의 과도한 사용은 텍스트를 깊이 읽기보다 훑어읽게(F자형 스키밍) 만든다. 이러한 '얕은 읽기'가 습관화되면 글의 숨은 맥락을 파악하고 비판적으로 사유하는 뇌의 신경회로가 점차 퇴화한다. 이를 극복하려면 의도적으로 긴 호흡의 종이책을 정독하는 시간이 반드시 필요하다.",
      question: "이 글의 중심 제언으로 가장 알맞은 것은?",
      options: ["스마트폰 화면으로 책을 더 빨리 읽어야 한다.", "디지털 스키밍 습관을 벗어나 종이책을 통한 깊이 있는 정독 훈련을 해야 한다.", "모든 디지털 기기를 완전히 폐기해야 한다.", "글은 핵심 단어만 빠르게 건너뛰며 읽는 것이 효율적이다."],
      correctIndex: 1,
      explanation: "디지털 기기의 훑어읽기 부작용을 경고하며 종이책의 깊은 정독을 회복하자고 제안합니다.",
    },
  ],
}

export function evaluateKoreanQuiz(grade: number, answers: number[]): KoreanQuizResult {
  const qList = koreanQuizByGrade[grade] || koreanQuizByGrade[3]
  let correctCount = 0

  qList.forEach((q, idx) => {
    if (answers[idx] === q.correctIndex) {
      correctCount++
    }
  })

  if (correctCount === 3) {
    return {
      score: 3,
      total: 3,
      level: "advanced",
      levelTitle: "문해력 우수 (상위 20%)",
      analysis:
        "어휘력과 문맥 파악, 글의 숨은 주제 추론 능력이 매우 우수합니다! 긴 호흡의 비문학 지문과 사고력 독해를 시작해도 충분히 소화할 수 있는 단계입니다.",
      recommendedWorkbookIds: ["summa-dokhae", "choi-vocab", "ebs-dokhae-wonder"],
      recommendedBookIds: grade <= 2 ? ["book-1-2-2"] : grade <= 4 ? ["book-3-4-2"] : ["book-5-6-1", "book-5-6-2"],
    }
  } else if (correctCount === 2) {
    return {
      score: 2,
      total: 3,
      level: "application",
      levelTitle: "문해력 보통 (교과 탄탄)",
      analysis:
        "기본적인 글의 흐름과 일상 어휘는 잘 이해하지만, 추론 문제나 낯선 한자어에서 약간의 혼란이 있습니다. 꾸준한 독해 루틴과 어휘 확장이 결합되면 빠르게 상위권으로 도약합니다.",
      recommendedWorkbookIds: ["ppuri-dokhae", "eowhi-munhaeryeok", "ebs-manjeom-korean"],
      recommendedBookIds: grade <= 2 ? ["book-1-2-1", "book-1-2-2"] : grade <= 4 ? ["book-3-4-1"] : ["book-5-6-1"],
    }
  } else {
    return {
      score: correctCount,
      total: 3,
      level: "basic",
      levelTitle: "문해력 기초 보강 필요",
      analysis:
        "글밥에 대한 심리적 부담감이 있거나 어휘의 뜻을 어림짐작으로 넘기는 경우가 많습니다. 어려운 문제집 대신 짧고 재미있는 지문으로 읽기 성공 경험을 주는 것이 최우선입니다.",
      recommendedWorkbookIds: ["ddokddok-dokhae", "eowhi-munhaeryeok", "mat-choom-bub"],
      recommendedBookIds: grade <= 2 ? ["book-1-2-1"] : grade <= 4 ? ["book-3-4-1"] : ["book-5-6-2"],
    }
  }
}
