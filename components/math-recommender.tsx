"use client"

import { useRef, useState } from "react"
import { RefreshCw, Sparkles } from "lucide-react"
import { recommend, type Level, type Style, type Track } from "@/lib/workbooks"
import { WorkbookCard } from "@/components/workbook-card"

const grades = [1, 2, 3, 4, 5, 6] as const

const levelOptions: { key: Level; label: string; desc: string }[] = [
  { key: "basic", label: "A. 개념 이해가 필요해요", desc: "기초 · 기본" },
  { key: "application", label: "B. 교과서 문제는 잘 풀어요", desc: "응용 · 실력" },
  { key: "advanced", label: "C. 심화·경시 문제를 풀고 싶어요", desc: "심화 · 최상위" },
]

const trackOptions: { key: Track; label: string; desc: string }[] = [
  { key: "current", label: "현행 (지금 학년 공부)", desc: "현재 학년 과정을 탄탄히 다지고 심화까지" },
  { key: "advance", label: "선행 (다음 과정 미리 학습)", desc: "새 개념을 처음 배우니 개념·기본 위주로" },
]

const styleOptions: { key: Style; label: string; desc: string }[] = [
  { key: "calculation", label: "A. 연산 집중 연습", desc: "계산력 훈련" },
  { key: "descriptive", label: "B. 서술형·문장제 대비", desc: "문장 이해력" },
  { key: "comprehensive", label: "C. 개념+유형 종합", desc: "골고루 학습" },
]

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition-all ${
        selected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      {children}
    </button>
  )
}

export function MathRecommender() {
  const [grade, setGrade] = useState<number | null>(null)
  const [track, setTrack] = useState<Track | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [style, setStyle] = useState<Style | null>(null)
  const [results, setResults] = useState<ReturnType<typeof recommend> | null>(null)
  const [resultTrack, setResultTrack] = useState<Track>("current")
  const resultRef = useRef<HTMLDivElement>(null)

  const ready = grade !== null && track !== null && level !== null && style !== null

  const showResults = () => {
    if (!ready) return
    setResults(recommend(level, style, track))
    setResultTrack(track)
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  const reset = () => {
    setGrade(null)
    setTrack(null)
    setLevel(null)
    setStyle(null)
    setResults(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20">
      <header className="pt-12 pb-8 text-center sm:pt-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" aria-hidden />
          우리 아이 맞춤 추천
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
          우리 아이에게 딱 맞는
          <br />
          초등 수학 문제집 찾기
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          몇 가지 질문에 답하면 우리 아이 수준과 학습 목표에 어울리는 문제집을 추천해 드려요.
        </p>
      </header>

      <div className="space-y-6">
        {/* Q1 */}
        <section className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-foreground">
            <span className="text-primary">Q1.</span> 학년을 선택해 주세요
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {grades.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                aria-pressed={grade === g}
                className={`rounded-2xl border-2 py-3 text-center font-semibold transition-all ${
                  grade === g
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                {g}학년
              </button>
            ))}
          </div>
        </section>

        {/* Q2 */}
        <section className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-foreground">
            <span className="text-primary">Q2.</span> 현행 학습인가요, 선행 학습인가요?
          </h2>
          <div className="mt-4 space-y-3">
            {trackOptions.map((opt) => (
              <OptionButton
                key={opt.key}
                selected={track === opt.key}
                onClick={() => setTrack(opt.key)}
              >
                <span className="font-semibold text-foreground">{opt.label}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{opt.desc}</span>
              </OptionButton>
            ))}
          </div>
        </section>

        {/* Q3 */}
        <section className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-foreground">
            <span className="text-primary">Q3.</span> 아이의 현재 수학 학습 상태는 어떤가요?
          </h2>
          <div className="mt-4 space-y-3">
            {levelOptions.map((opt) => (
              <OptionButton
                key={opt.key}
                selected={level === opt.key}
                onClick={() => setLevel(opt.key)}
              >
                <span className="font-semibold text-foreground">{opt.label}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{opt.desc}</span>
              </OptionButton>
            ))}
          </div>
        </section>

        {/* Q4 */}
        <section className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-foreground">
            <span className="text-primary">Q4.</span> 어떤 스타일의 문제집을 찾으시나요?
          </h2>
          <div className="mt-4 space-y-3">
            {styleOptions.map((opt) => (
              <OptionButton
                key={opt.key}
                selected={style === opt.key}
                onClick={() => setStyle(opt.key)}
              >
                <span className="font-semibold text-foreground">{opt.label}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{opt.desc}</span>
              </OptionButton>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={showResults}
          disabled={!ready}
          className="w-full rounded-full bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          {ready ? "결과 보기" : "모든 질문에 답해 주세요"}
        </button>
      </div>

      {results && (
        <div ref={resultRef} className="mt-16 scroll-mt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground text-balance sm:text-3xl">
              {grade}학년 아이에게 추천하는 문제집
            </h2>
            <p className="mt-2 text-muted-foreground">
              선택하신 조건에 맞는 대표 문제집이에요.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((wb) => (
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
              다시 진단하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
