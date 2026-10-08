"use client"

import { useState } from "react"
import {
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  BookCheck,
  BookMarked,
  Clock,
  ShieldAlert,
} from "lucide-react"
import {
  koreanPrescriptions,
  koreanFaqs,
  type KoreanPrescription,
  type KoreanFAQItem,
} from "@/lib/korean-prescriptions"

export function KoreanPrescriptionSection() {
  const [selectedId, setSelectedId] = useState<string>(
    koreanPrescriptions[0].id
  )

  const current =
    koreanPrescriptions.find((p) => p.id === selectedId) ||
    koreanPrescriptions[0]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-semibold text-rose-800">
          <Stethoscope className="h-4 w-4" aria-hidden />
          국어·독서 고민 1:1 맞춤 처방
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          읽기는 읽는데 왜 문제를 못 풀까?
          <br />
          <span className="text-emerald-700">국어 증상별 처방전 & 도서 매칭</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          단순히 독해 문제집만 더 풀린다고 해결되지 않습니다.
          <br className="hidden sm:block" />
          아이의 읽기 습관과 어휘 결손 원인을 짚고 꼭 맞는 해결책을 찾아주세요.
        </p>
      </div>

      {/* 증상 탭 */}
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {koreanPrescriptions.map((item) => {
          const isSelected = item.id === selectedId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`rounded-2xl border-2 p-3 text-center transition-all ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/60 shadow-xs"
                  : "border-border bg-card hover:border-emerald-300"
              }`}
            >
              <span
                className={`text-xs font-bold block ${
                  isSelected ? "text-emerald-800" : "text-muted-foreground"
                }`}
              >
                {item.shortBadge}
              </span>
              <span className="mt-1 line-clamp-1 text-xs text-foreground/80">
                {item.symptom.slice(0, 12)}...
              </span>
            </button>
          )
        })}
      </div>

      {/* 선택된 처방전 카드 */}
      <div className="mt-6 overflow-hidden rounded-3xl border-2 border-border bg-card p-6 shadow-md sm:p-8">
        <div className="border-b border-border/60 pb-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${current.tagColor}`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {current.shortBadge}
          </span>
          <h3 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
            &ldquo;{current.symptom}&rdquo;
          </h3>
        </div>

        {/* 원인 & 해결책 */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <h4 className="font-bold text-foreground">🔍 원인 분석</h4>
            <p className="mt-2 text-xs leading-relaxed text-foreground/85 sm:text-sm">
              {current.cause}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <h4 className="font-bold text-foreground">✅ 솔루션 & 해결 전략</h4>
            <p className="mt-2 text-xs leading-relaxed text-foreground/85 sm:text-sm">
              {current.solution}
            </p>
          </div>
        </div>

        {/* 처방 교재 및 추천 도서 */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-accent/20 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <BookCheck className="h-4 w-4" />
              추천 국어 문제집
            </div>
            <ul className="mt-2 space-y-1 text-xs text-foreground/80">
              {current.recommendedWorkbookNames.map((name, i) => (
                <li key={i}>• {name}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <BookMarked className="h-4 w-4" />
              함께 읽을 추천 도서
            </div>
            <ul className="mt-2 space-y-1 text-xs text-foreground/80">
              {current.recommendedBookNames.map((name, i) => (
                <li key={i}>📖 {name}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 루틴 및 주의사항 */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 pt-2 text-xs">
          <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3.5">
            <Clock className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <strong>추천 공부 루틴: </strong>
              <span className="text-muted-foreground">{current.studyRoutine}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/40 p-3.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <strong>주의사항: </strong>
              <span className="text-muted-foreground">{current.caution}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function KoreanFAQSection() {
  const [openIds, setOpenIds] = useState<string[]>([koreanFaqs[0].id])

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800">
          국어 교육 Q&A
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          국어·독서 교육에 관한
          <br />
          <span className="text-emerald-700">학부모 단골 질문 Best 4</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          책과 문제집의 비율, 만화책 고민, 하루 적정 분량, 한자 학습까지
          <br className="hidden sm:block" />
          문해력 전문가들이 강조하는 핵심 원칙을 확인하세요.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {koreanFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id)
          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-emerald-300"
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-accent/30 sm:p-6"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <span className="inline-block rounded-md bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                    {faq.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground sm:text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-700">
                    💡 {faq.shortAnswer}
                  </p>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border/60 bg-accent/20 px-5 py-5 sm:px-6">
                  <div className="space-y-2 text-xs leading-relaxed text-foreground/85 sm:text-sm">
                    {faq.detailedAnswer.map((p, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{p}</span>
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-950 sm:text-sm">
                    <strong>조언: </strong>
                    {faq.tips}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
