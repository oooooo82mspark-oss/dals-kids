/** 영단어장 앱의 타입 정의 */

export interface VocabWord {
  id: string
  english: string
  korean: string
  memorized: boolean
  wrongCount: number
  correctCount: number
}

export interface VocabSet {
  id: string
  name: string
  words: VocabWord[]
  createdAt: string
  lastTestedAt: string | null
}

export type QuizMode = 'en-to-ko' | 'ko-to-en'

export interface QuizQuestion {
  word: VocabWord
  options: string[]
  correctAnswer: string
  mode: QuizMode
}

export interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: VocabWord[]
  timestamp: string
}
