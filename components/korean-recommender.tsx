"use client"

import { useState } from "react"
import {
  Rocket,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  Sparkles,
  RotateCcw,
  BookMarked,
  Layers,
} from "lucide-react"
import {
  koreanQuizByGrade,
  evaluateKoreanQuiz,
  type KoreanQuizResult,
} from "@/lib/korean-quiz"
import {
  koreanWorkbooks,
  recommendedBooks,
  type KoreanWorkbook,
  type RecommendedBook,
} from "@/lib/korean-workbooks"

const grades = [1, 2, 3, 4, 5, 6] as const

export function KoreanRecommender() {
  const [grade, setGrade] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<KoreanQuizResult | null>(null)

  const questions = grade ? koreanQuizByGrade[grade] || [] : []

  const handleSelectGrade = (g: number) => {
    setGrade(g)
    setStep(0)
    setAnswers([])
    setResult(null)
  }

  const handleAnswer = (choiceIndex: number) => {
    if (!grade) return
    const nextAnswers = [...answers]
    nextAnswers[step] = choiceIndex
    setAnswers(nextAnswers)

    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      const res = evaluateKoreanQuiz(grade, nextAnswers)
      setResult(res)
    }
  }

  const handleReset = () => {
    setGrade(null)
    setStep(0)
    setAnswers([])
    setResult(null)
  }

  // 1. 학년 선택 화면
  if (grade === null) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            <Sparkles className="h-4 w-4" aria-hidden />
            초등 국어 문해력 듀얼 추천
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            우리 아이 문해력 테스트 &<br />
            <span className="text-emerald-700">맞춤 문제집 + 추천 도서</span> 동시 추천
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
            3문제 어휘·문맥 테스트를 통해 아이의 문해력 수준을 진단하고,
            <br className="hidden sm:block" />딱 맞는 국어 문제집과 학년별 필독 도서를 함께 제안해 드려요.
          </p>
        </header>

        <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h3 className="text-center text-lg font-bold text-foreground">
            아이의 학년을 선택해 주세요
          </h3>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {grades.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleSelectGrade(g)}
                className="rounded-2xl border-2 border-border bg-card py-4 text-center font-bold text-foreground transition-all hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-900"
              >
                <span className="text-lg">{g}학년</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // 2. 퀴즈 진행 화면
  if (result === null && questions.length > 0) {
    const currentQ = questions[step]
    const progressPercent = Math.round(((step + 1) / questions.length) * 100)

    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        {/* 진행률 바 */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>
              {grade}학년 문해력 3분 진단 ({step + 1}/{questions.length})
            </span>
            <span className="text-emerald-700">{progressPercent}% 완료</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 퀴즈 카드 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
            {currentQ.type} 영역
          </span>

          {currentQ.passage && (
            <div className="mt-4 rounded-2xl border border-border/80 bg-accent/30 p-4 text-sm leading-relaxed text-foreground/90 font-serif">
              {currentQ.passage}
            </div>
          )}

          <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl leading-snug">
            {currentQ.question}
          </h3>

          <div className="mt-6 space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnswer(idx)}
                className="w-full rounded-2xl border-2 border-border bg-card p-4 text-left font-medium text-foreground transition-all hover:border-emerald-500 hover:bg-emerald-50/40"
              >
                <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-foreground">
                  {idx + 1}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 3. 진단 결과 및 [문제집 + 책 듀얼 추천] 화면
  const matchedWorkbooks: KoreanWorkbook[] = (result?.recommendedWorkbookIds || [])
    .map((id) => koreanWorkbooks.find((w) => w.id === id))
    .filter(Boolean) as KoreanWorkbook[]

  const matchedBooks: RecommendedBook[] = (result?.recommendedBookIds || [])
    .map((id) => recommendedBooks.find((b) => b.id === id))
    .filter(Boolean) as RecommendedBook[]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      {/* 상단 결과 카드 */}
      <div className="overflow-hidden rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-card to-background p-6 shadow-md sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800">
                {grade}학년 문해력 진단 결과 (3문제 중 {result?.score}개 정답)
              </span>
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                {result?.levelTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            다시 테스트하기
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/85">
          {result?.analysis}
        </p>
      </div>

      {/* 듀얼 추천 섹션 1: 맞춤 국어 문제집 */}
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-700" />
          <h4 className="text-xl font-bold text-foreground">
            추천 맞춤 국어 문제집 (독해·어휘·교과)
          </h4>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          아이의 현재 문해력 결손을 보완하고 교과 성적을 탄탄히 다져주는 엄선 교재입니다.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {matchedWorkbooks.map((wb) => (
            <div
              key={wb.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-emerald-400 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {wb.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{wb.publisher}</span>
                </div>

                <h5 className="mt-2 text-base font-bold text-foreground leading-snug">
                  {wb.name}
                </h5>
                <p className="mt-1 text-xs text-emerald-800 font-medium">
                  {wb.featureNote}
                </p>

                <ul className="mt-3 space-y-1 text-xs text-foreground/75">
                  {wb.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={wb.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-600 hover:text-white"
              >
                <span>교재 최저가 검색</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 듀얼 추천 섹션 2: 학년별 문해력 성장 도서 (책 추천) */}
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-indigo-600" />
          <h4 className="text-xl font-bold text-foreground">
            추천 학년별 문해력 필독 도서 (책 추천)
          </h4>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          문제집과 함께 읽으면 생각의 그릇과 배경지식이 폭발적으로 자라는 필독 도서입니다.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {matchedBooks.map((b) => (
            <div
              key={b.id}
              className="flex flex-col justify-between rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-card to-background p-5 shadow-xs transition-all hover:border-indigo-300 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
                    {b.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {b.author} 저 · {b.publisher}
                  </span>
                </div>

                <h5 className="mt-2 text-lg font-bold text-foreground leading-snug">
                  📖 {b.title}
                </h5>

                <p className="mt-2 text-xs text-foreground/80 leading-relaxed">
                  {b.description}
                </p>

                <div className="mt-3 rounded-xl bg-indigo-50/60 p-3 text-xs">
                  <p className="font-bold text-indigo-950">💡 왜 이 책을 읽어야 할까요?</p>
                  <p className="mt-1 text-indigo-900 leading-relaxed">{b.whyRead}</p>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  <strong className="text-foreground/80">독서 팁: </strong>
                  {b.readingTip}
                </div>
              </div>

              <a
                href={b.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-indigo-700"
              >
                <span>도서 정보 & 구매</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
