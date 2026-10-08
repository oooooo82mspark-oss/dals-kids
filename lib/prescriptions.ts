export type PrescriptionProblemId =
  | "calculation-mistake"
  | "word-problem-fear"
  | "concept-weakness"
  | "advanced-block"
  | "slow-speed"
  | "lack-of-habit"

export type Prescription = {
  id: PrescriptionProblemId
  symptom: string
  shortBadge: string
  tagColor: string
  cause: string
  solution: string
  recommendedBookIds: string[]
  recommendedBookNames: string[]
  studyRoutine: string
  caution: string
}

export const prescriptions: Prescription[] = [
  {
    id: "calculation-mistake",
    symptom: "계산 실수가 잦고 단순 연산에서 자주 틀려요",
    shortBadge: "연산 실수 처방",
    tagColor: "border-teal-200 bg-teal-50 text-teal-800",
    cause: "개념은 알지만 손의 계산 숙련도와 자릿수 정렬 습관이 덜 잡혀서 발생합니다.",
    solution: "어려운 문제집보다 하루 2~3쪽 정해진 시간 동안 집중해서 푸는 전용 연산서로 계산 정확도와 암산 감각을 끌어올려야 합니다.",
    recommendedBookIds: ["didimdol-yeon-san", "sseng-yeon-san", "gijeok-yeonsan"],
    recommendedBookNames: ["디딤돌 연산", "쎈연산", "기적의 계산법"],
    studyRoutine: "아침 10분 또는 본 학습 시작 전 워밍업으로 매일 2~3쪽 규칙적 풀기",
    caution: "틀렸다고 많은 양을 벌주듯 풀리면 수학 거부감이 생기므로 정해진 분량만 정확히 푸는 습관이 중요해요.",
  },
  {
    id: "word-problem-fear",
    symptom: "문장이 3줄 이상만 넘어가면 식을 못 세우고 막혀요 (서술형 약점)",
    shortBadge: "서술형·문해력 처방",
    tagColor: "border-indigo-200 bg-indigo-50 text-indigo-800",
    cause: "수학 실력 문제가 아니라, 문장을 읽고 '구하는 것'과 '주어진 조건'을 수학 기호와 식으로 번역하는 훈련이 부족하기 때문입니다.",
    solution: "문제 문장을 빗금(/)으로 끊어 읽고, 핵심 조건에 동그라미 치며 단계별로 풀이식을 적는 서술형/문장제 전용서가 가장 효과적입니다.",
    recommendedBookIds: ["munhaegil-basic", "munhaegil-app", "didimdol-app"],
    recommendedBookNames: ["문장제 해결의 길잡이 (문해길) 기본/원리", "문해길 심화", "디딤돌 응용"],
    studyRoutine: "하루 3~4문제만 풀더라도 풀이 과정을 말로 소리 내어 설명해 보거나 단계별 서술 노트 쓰기",
    caution: "답만 맞히고 넘어가지 말고 '왜 이런 식이 나왔는지' 아이가 직접 설명할 수 있는지 확인해 주세요.",
  },
  {
    id: "concept-weakness",
    symptom: "조금만 꼬아서 내면 개념을 헷갈려하고 공식만 외워서 풀어요",
    shortBadge: "개념 구멍 처방",
    tagColor: "border-sky-200 bg-sky-50 text-sky-800",
    cause: "원리에 대한 시각적 이해 없이 공식 기계적 암기로 진도만 뺐을 때 생기는 전형적인 현상입니다.",
    solution: "친절한 설명과 그림·도형·표로 직관적인 개념 원리를 짚어주는 입문 개념서로 앞 단원부터 구멍을 메워야 합니다.",
    recommendedBookIds: ["didimdol-wonri", "didimdol-basic", "cheonjae-concept-click"],
    recommendedBookNames: ["디딤돌 원리", "디딤돌 기본", "개념클릭 / 우등생 해법"],
    studyRoutine: "개념 박스를 아이가 부모님께 선생님처럼 가르쳐주는 '역설명 학습법' 병행",
    caution: "아이가 모른다고 다그치지 말고, 이전 학년 같은 영역(예: 3학년 분수 구멍 → 4·5학년 분수 붕괴)으로 내려가 점검해 보세요.",
  },
  {
    id: "advanced-block",
    symptom: "기본 유형은 90점 이상인데 심화·최상위 문제만 보면 손도 못 대요",
    shortBadge: "심화 벽 돌파 처방",
    tagColor: "border-purple-200 bg-purple-50 text-purple-800",
    cause: "한 단계 생각하는 문제엔 익숙하지만 두 단계 이상의 조건을 조합하는 복합 사고력 훈련이 안 되어 있습니다.",
    solution: "갑자기 최상위로 가지 말고, 시각화 모델로 풀이 접근법을 쪼개서 보여주는 '준심화서'로 징검다리를 놓아주세요.",
    recommendedBookIds: ["didimdol-choesangwi-s", "munhaegil-app", "choesangwi-math"],
    recommendedBookNames: ["최상위수학S", "문해길 심화", "최상위수학"],
    studyRoutine: "하루 2문제라도 10~15분 동안 혼자 고민하는 '집중 사고 시간' 갖기",
    caution: "바로 해설지를 보지 않고, 힌트만 한 줄 준 뒤 스스로 끝까지 물고 늘어지는 경험이 핵심입니다.",
  },
  {
    id: "slow-speed",
    symptom: "풀기는 푸는데 푸는 속도가 너무 느려서 시험 시간이 모자라요",
    shortBadge: "풀이 속도 처방",
    tagColor: "border-amber-200 bg-amber-50 text-amber-800",
    cause: "유형별 표준 접근법이 체화되지 않아 매번 처음부터 길을 찾거나, 연산 암산력이 느려서 지체됩니다.",
    solution: "자주 나오는 대표 유형을 집중 반복할 수 있는 유형서와 시간을 재고 푸는 속도감 훈련이 필요합니다.",
    recommendedBookIds: ["sseng-math", "didimdol-basic-app", "sseng-yeon-san"],
    recommendedBookNames: ["쎈 수학 (B단계 집중)", "디딤돌 기본+응용", "쎈연산"],
    studyRoutine: "타이머를 맞추고 1문제당 표준 풀이 시간(1.5분~2분) 목표로 5~10문제 단위 타임어택",
    caution: "속도만 강조하면 계산 실수가 늘어날 수 있으니 정확도 90% 이상을 확인하며 점진적으로 줄이세요.",
  },
  {
    id: "lack-of-habit",
    symptom: "수학을 싫어하고 문제집 펼치는 것 자체를 강하게 거부해요",
    shortBadge: "흥미·자신감 처방",
    tagColor: "border-rose-200 bg-rose-50 text-rose-800",
    cause: "현재 교재 난이도가 아이의 인지 능력보다 과도하게 높아서 성취감 없이 좌절감만 누적된 상태입니다.",
    solution: "아이의 현재 실력보다 반 학년~1단계 낮추어 정답률 80% 이상이 나오는 얇고 쉬운 만화/스토리텔링형 교재로 성공 경험을 심어주세요.",
    recommendedBookIds: ["didimdol-wonri", "cheonjae-concept-click", "visang-concept-plus-type-basic"],
    recommendedBookNames: ["디딤돌 초등수학 원리", "개념클릭 해법수학", "개념플러스유형 기본 라이트"],
    studyRoutine: "하루 딱 1~2쪽(15분 이내) 완료 시 즉시 칭찬 스티커와 보상 연계",
    caution: "타인의 아이와 진도를 비교하지 말고, '오늘 약속한 분량을 끝냈다'는 자기효능감을 되찾아주는 게 최우선입니다.",
  },
]
