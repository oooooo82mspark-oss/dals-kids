import type { Level } from "@/lib/workbooks"

export type Difficulty = "basic" | "application" | "advanced"

export type Question = {
  prompt: string
  options: string[]
  answer: number
  difficulty: Difficulty
}

// Each grade has 5 questions: 2 basic, 2 application, 1 advanced.
export const quizByGrade: Record<number, Question[]> = {
  1: [
    { prompt: "3 + 4 = ?", options: ["6", "7", "8", "9"], answer: 1, difficulty: "basic" },
    { prompt: "9 - 5 = ?", options: ["3", "4", "5", "6"], answer: 1, difficulty: "basic" },
    { prompt: "8 + 7 = ?", options: ["13", "14", "15", "16"], answer: 2, difficulty: "application" },
    { prompt: "15 - 8 = ?", options: ["6", "7", "8", "9"], answer: 1, difficulty: "application" },
    {
      prompt: "어떤 수에 6을 더했더니 13이 되었어요. 어떤 수는?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      difficulty: "advanced",
    },
  ],
  2: [
    { prompt: "6 × 3 = ?", options: ["15", "18", "21", "24"], answer: 1, difficulty: "basic" },
    { prompt: "24 + 18 = ?", options: ["32", "41", "42", "43"], answer: 2, difficulty: "basic" },
    { prompt: "7 × 8 = ?", options: ["48", "54", "56", "63"], answer: 2, difficulty: "application" },
    { prompt: "45 - 27 = ?", options: ["12", "18", "22", "28"], answer: 1, difficulty: "application" },
    {
      prompt: "사탕이 4개씩 6묶음 있어요. 모두 몇 개일까요?",
      options: ["10", "20", "24", "28"],
      answer: 2,
      difficulty: "advanced",
    },
  ],
  3: [
    { prompt: "6 × 7 = ?", options: ["36", "42", "48", "49"], answer: 1, difficulty: "basic" },
    { prompt: "36 ÷ 4 = ?", options: ["6", "7", "8", "9"], answer: 3, difficulty: "basic" },
    { prompt: "24 × 3 = ?", options: ["64", "68", "72", "74"], answer: 2, difficulty: "application" },
    {
      prompt: "1/4 과 2/4 중 더 큰 수는?",
      options: ["1/4", "2/4", "같다", "알 수 없다"],
      answer: 1,
      difficulty: "application",
    },
    {
      prompt: "연필 56자루를 7명이 똑같이 나누면 한 명당 몇 자루?",
      options: ["6", "7", "8", "9"],
      answer: 2,
      difficulty: "advanced",
    },
  ],
  4: [
    { prompt: "3000 + 4500 = ?", options: ["6500", "7000", "7500", "8500"], answer: 2, difficulty: "basic" },
    { prompt: "직각은 몇 도일까요?", options: ["45도", "60도", "90도", "180도"], answer: 2, difficulty: "basic" },
    { prompt: "2.5 + 1.7 = ?", options: ["3.2", "4.2", "3.12", "4.12"], answer: 1, difficulty: "application" },
    { prompt: "3/5 + 1/5 = ?", options: ["2/5", "3/5", "4/5", "4/10"], answer: 2, difficulty: "application" },
    {
      prompt: "1시간 30분은 몇 분일까요?",
      options: ["60분", "90분", "120분", "130분"],
      answer: 1,
      difficulty: "advanced",
    },
  ],
  5: [
    { prompt: "12의 약수는 모두 몇 개일까요?", options: ["4", "5", "6", "7"], answer: 2, difficulty: "basic" },
    { prompt: "1/2 + 1/4 = ?", options: ["2/6", "3/6", "3/4", "1/6"], answer: 2, difficulty: "basic" },
    { prompt: "2/3 × 6 = ?", options: ["3", "4", "5", "6"], answer: 1, difficulty: "application" },
    { prompt: "5, 7, 9, 11 의 평균은?", options: ["7", "8", "9", "10"], answer: 1, difficulty: "application" },
    {
      prompt: "6과 8의 최소공배수는?",
      options: ["12", "16", "24", "48"],
      answer: 2,
      difficulty: "advanced",
    },
  ],
  6: [
    { prompt: "3 : 4 를 분수로 나타내면?", options: ["3/4", "4/3", "3/7", "4/7"], answer: 0, difficulty: "basic" },
    { prompt: "1/2 ÷ 1/4 = ?", options: ["1", "2", "4", "8"], answer: 1, difficulty: "basic" },
    {
      prompt: "전체의 25%가 20명이라면 전체는 몇 명?",
      options: ["40명", "60명", "80명", "100명"],
      answer: 2,
      difficulty: "application",
    },
    {
      prompt: "한 모서리가 3cm인 정육면체의 부피는?",
      options: ["9cm³", "18cm³", "27cm³", "81cm³"],
      answer: 2,
      difficulty: "application",
    },
    {
      prompt: "4 : 6 = 10 : ? 에서 ?에 알맞은 수는?",
      options: ["12", "14", "15", "18"],
      answer: 2,
      difficulty: "advanced",
    },
  ],
}

const weight: Record<Difficulty, number> = { basic: 1, application: 2, advanced: 3 }

export type QuizResult = {
  correct: number
  total: number
  score: number
  maxScore: number
  level: Level
}

// Turn a set of answers into a demonstrated skill level.
export function evaluate(grade: number, answers: number[]): QuizResult {
  const questions = quizByGrade[grade] ?? []
  let score = 0
  let correct = 0
  let maxScore = 0

  questions.forEach((q, i) => {
    maxScore += weight[q.difficulty]
    if (answers[i] === q.answer) {
      score += weight[q.difficulty]
      correct += 1
    }
  })

  let level: Level = "basic"
  if (score >= 8) level = "advanced"
  else if (score >= 5) level = "application"

  return { correct, total: questions.length, score, maxScore, level }
}

export const levelSummary: Record<Level, { title: string; message: string }> = {
  basic: {
    title: "개념·기초 단계",
    message: "개념을 차근차근 익히면 금방 자신감이 붙을 거예요. 기초를 탄탄히 다지는 문제집을 추천해요!",
  },
  application: {
    title: "응용·실력 단계",
    message: "기본기가 탄탄해요! 다양한 유형에 도전하며 실력을 한 단계 올려 봐요.",
  },
  advanced: {
    title: "심화·도전 단계",
    message: "실력이 아주 뛰어나요! 심화·사고력 문제로 수학의 재미를 더 키워 봐요.",
  },
}
