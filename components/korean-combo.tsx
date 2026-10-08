"use client"

import { useState } from "react"
import {
  Package,
  BookOpen,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronRight,
  BookMarked,
} from "lucide-react"
import {
  koreanGoldenCombos,
  koreanWorkbooks,
  recommendedBooks,
  type KoreanComboSet,
} from "@/lib/korean-workbooks"

export function KoreanComboSection() {
  const [selectedTier, setSelectedTier] = useState<"기초" | "중위" | "상위">("중위")

  const currentCombo =
    koreanGoldenCombos.find((c) => c.tier === selectedTier) ||
    koreanGoldenCombos[1]

  const readingBook = recommendedBooks.find(
    (b) => b.id === currentCombo.readingBookId
  )

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14">
      {/* 섹션 헤더 */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800">
          <Package className="h-4 w-4" aria-hidden />
          국어 문해력 황금 세트
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          독해서 + 어휘서 + 교과서
          <br />
          <span className="text-emerald-700">검증된 국어 3권 + 필독서 조합</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          단순히 문제집 한 권만 푸는 것보다, 독해·어휘·교과를 함께 채우고
          <br className="hidden sm:block" />
          문해력 성장 도서 1권을 곁들이는 것이 초등 국어의 가장 이상적인 조합입니다.
        </p>
      </div>

      {/* 수준 선택 세그먼트 */}
      <div className="mx-auto mt-8 grid w-full max-w-md grid-cols-3 gap-1.5 rounded-full border border-border bg-card p-1.5 shadow-xs">
        {(["기초", "중위", "상위"] as const).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setSelectedTier(tier)}
            className={`rounded-full py-2.5 text-xs font-bold transition-all sm:text-sm ${
              selectedTier === tier
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tier} 세트
          </button>
        ))}
      </div>

      {/* 조합 정보 카드 */}
      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-emerald-200 bg-card p-6 shadow-md sm:p-8">
        <div className="border-b border-border/60 pb-5">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
            {currentCombo.tier} 추천
          </span>
          <h3 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
            {currentCombo.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentCombo.subtitle}
          </p>
          <p className="mt-3 text-xs text-foreground/80 leading-relaxed sm:text-sm">
            {currentCombo.description}
          </p>
        </div>

        {/* 3권 슬롯 그리드 */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {currentCombo.slots.map((slot) => {
            const wb = koreanWorkbooks.find((w) => w.id === slot.workbookId)
            if (!wb) return null

            return (
              <div
                key={slot.workbookId}
                className="flex flex-col justify-between rounded-2xl border border-border bg-accent/30 p-4 transition-all hover:border-emerald-400 hover:bg-card"
              >
                <div>
                  <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    {slot.role}
                  </span>
                  <h4 className="mt-2 font-bold text-foreground leading-snug">
                    {wb.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {wb.publisher}
                  </p>
                  <p className="mt-2.5 text-xs text-foreground/75 leading-relaxed">
                    <ChevronRight className="mr-0.5 inline h-3 w-3 text-emerald-600" />
                    {slot.reason}
                  </p>
                </div>

                <a
                  href={wb.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-1 rounded-xl bg-card py-2 text-xs font-bold text-emerald-800 border border-emerald-200 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <span>교재 구매</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )
          })}
        </div>

        {/* 함께 읽으면 좋은 필독 도서 1권 */}
        {readingBook && (
          <div className="mt-6 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 p-5">
            <div className="flex items-center gap-2 text-indigo-900">
              <BookMarked className="h-5 w-5" />
              <h4 className="font-bold">이 세트와 함께 읽을 문해력 도서</h4>
            </div>
            <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold text-foreground text-base">
                  📖 {readingBook.title}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({readingBook.author} 저)
                  </span>
                </p>
                <p className="mt-1 text-xs text-indigo-950/80">
                  {readingBook.whyRead}
                </p>
              </div>
              <a
                href={readingBook.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                <span>책 보러가기</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* 공부 꿀팁 */}
        <div className="mt-4 rounded-xl bg-emerald-50/70 p-4 text-xs text-emerald-950">
          <strong className="font-bold">💡 실천 팁: </strong>
          {currentCombo.studyTip}
        </div>
      </div>
    </div>
  )
}
