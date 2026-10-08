"use client"

import { useRef, useState } from "react"
import { RefreshCw, Rocket, Check } from "lucide-react"
import { recommend, type Track } from "@/lib/workbooks"
import { evaluate, levelSummary, quizByGrade, type QuizResult } from "@/lib/quiz"
import { WorkbookCard } from "@/components/workbook-card"

const grades = [1, 2, 3, 4, 5, 6] as const

export function KidTest() {
  const [grade, setGrade] = useState<number | null>(null)
  const [track, setTrack] = useState<Track>("current")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const questions = grade ? quizByGrade[grade] : []

  const startTest = (g: number) => {
    setGrade(g)
    setStep(0)
    setAnswers([])
    setResult(null)
  }

  const answerQuestion = (choice: number) => {
    if (!grade) return
    const next = [...answers]
    next[step] = choice
    setAnswers(next)

    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      const evaluated = evaluate(grade, next)
      setResult(evaluated)
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }

  const reset = () => {
    setGrade(null)
    setTrack("current")
    setStep(0)
    setAnswers([])
    setResult(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Grade selection screen
  if (grade === null) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-20">
        <header className="pt-10 pb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
            <Rocket className="h-4 w-4" aria-hidden />
            아이가 직접 풀어요
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            간단한 수학 테스트로
            <br />
            내 실력에 맞는 문제집 찾기
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
            학년을 고르고 5문제만 풀어 보면, 실력에 딱 맞는 문제집을 추천해 줘요.
          </p>
        </header>

        <section className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-foreground">지금 공부인가요, 미리 공부인가요?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            미리 공부(선행)를 고르면 새로운 내용을 처음 배우기 좋은 개념 위주 문제집을 추천해요.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                { key: "current", label: "지금 배우는 학년", desc: "현행 학습" },
                { key: "advance", label: "다음 과정 미리 배우기", desc: "선행 학습" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setTrack(opt.key)}
                aria-pressed={track === opt.key}
                className={`rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                  track === opt.key
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <span className="font-semibold text-foreground">{opt.label}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-lg font-bold text-foreground">몇 학년이에요?</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {grades.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => startTest(g)}
                className="rounded-2xl border-2 border-border bg-card py-4 text-center font-semibold text-foreground transition-all hover:border-primary hover:bg-primary/10"
              >
                {g}학년
              </button>
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20">
      {/* Test in progress */}
      {!result && (
        <div className="pt-10">
          <div className="mb-6 flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>{grade}학년 테스트</span>
            <span>
              {step + 1} / {questions.length}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>

          <section className="mt-8 rounded-3xl border border-border bg-card/60 p-6 shadow-sm sm:p-10">
            <p className="text-center text-sm font-semibold text-primary">Q{step + 1}</p>
            <h2 className="mt-2 text-center text-2xl font-bold text-foreground text-balance sm:text-3xl">
              {questions[step].prompt}
            </h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => answerQuestion(i)}
                  className="rounded-2xl border-2 border-border bg-card px-5 py-4 text-center text-lg font-semibold text-foreground transition-all hover:border-primary hover:bg-primary/10"
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={reset}
            className="mx-auto mt-6 flex items-center gap-2 rounded-full border-2 border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            처음부터 다시
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div ref={resultRef} className="scroll-mt-6 pt-10">
          <div className="rounded-3xl border border-border bg-card/60 p-6 text-center shadow-sm sm:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Check className="h-4 w-4" aria-hidden />
              테스트 완료
            </span>
            <p className="mt-4 text-muted-foreground">
              {questions.length}문제 중{" "}
              <span className="font-bold text-foreground">{result.correct}문제</span>를 맞혔어요!
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground text-balance sm:text-3xl">
              {grade}학년 {track === "advance" ? "선행" : "현행"} · {levelSummary[result.level].title}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
              {levelSummary[result.level].message}
              {track === "advance"
                ? " 선행 학습이라 새 개념을 탄탄히 잡아 줄 개념 위주 문제집으로 골랐어요."
                : ""}
            </p>
          </div>

          <div className="mt-10 text-center">
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">추천 문제집</h3>
            <p className="mt-2 text-muted-foreground">지금 실력에 맞는 문제집이에요.</p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommend(result.level, "comprehensive", track).map((wb) => (
              <WorkbookCard key={wb.id} workbook={wb} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-6 py-3 font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              다시 테스트하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
