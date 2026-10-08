"use client"

import { useState } from "react"
import {
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  BookCheck,
  ChevronRight,
  ExternalLink,
  Flame,
  Clock,
  ShieldAlert,
} from "lucide-react"
import { prescriptions, type PrescriptionProblemId } from "@/lib/prescriptions"
import { getWorkbookById } from "@/lib/workbooks"

export function ProblemPrescription() {
  const [selectedId, setSelectedId] =
    useState<PrescriptionProblemId>("calculation-mistake")

  const current =
    prescriptions.find((p) => p.id === selectedId) || prescriptions[0]

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-14">
      {/* 섹션 헤더 */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-semibold text-rose-800">
          <Stethoscope className="h-4 w-4" aria-hidden />
          오답 유형별 1:1 맞춤 처방전
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          우리 아이 수학 고민,
          <br />
          <span className="text-primary">증상별 딱 맞는 해결책과 교재 매칭</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          단순히 문제집만 더 풀린다고 해결되지 않습니다.
          <br className="hidden sm:block" />
          아이의 막히는 원인을 정확히 진단하고 올바른 처방 교재를 선택해 주세요.
        </p>
      </div>

      {/* 증상 탭 / 셀렉터 버튼 리스트 */}
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {prescriptions.map((item) => {
          const isSelected = item.id === selectedId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card/70 hover:border-primary/40 hover:bg-card"
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.shortBadge}
              </span>
              <span className="mt-1 line-clamp-1 text-xs text-foreground/80">
                {item.symptom.slice(0, 14)}...
              </span>
            </button>
          )
        })}
      </div>

      {/* 선택된 처방전 카드 */}
      <div className="mt-6 overflow-hidden rounded-3xl border-2 border-border bg-card p-6 shadow-md sm:p-8">
        {/* 상단 증상 표시 */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${current.tagColor}`}
            >
              <AlertCircle className="h-3.5 w-3.5" aria-hidden />
              {current.shortBadge}
            </span>
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">
              &ldquo;{current.symptom}&rdquo;
            </h3>
          </div>
        </div>

        {/* 원인 및 솔루션 그리드 */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* 원인 분석 */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5">
            <div className="flex items-center gap-2 text-amber-800">
              <Flame className="h-5 w-5" aria-hidden />
              <h4 className="font-bold text-foreground">왜 이런 현상이 생길까요?</h4>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">
              {current.cause}
            </p>
          </div>

          {/* 핵심 해결 전략 */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
              <h4 className="font-bold text-foreground">전문가 해결 전략</h4>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">
              {current.solution}
            </p>
          </div>
        </div>

        {/* 추천 처방 교재 리스트 */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <BookCheck className="h-5 w-5 text-primary" aria-hidden />
            <h4 className="text-lg font-bold text-foreground">
              이 증상에 추천하는 처방 교재
            </h4>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {current.recommendedBookIds.map((bookId, idx) => {
              const wb = getWorkbookById(bookId)
              const fallbackName = current.recommendedBookNames[idx] || bookId
              const displayName = wb ? wb.name : fallbackName
              const displayPublisher = wb ? wb.publisher : "추천 출판사"
              const buyUrl = wb
                ? wb.buyUrl
                : `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(
                    displayName
                  )}`

              return (
                <div
                  key={bookId}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-accent/30 p-4 transition-all hover:border-primary/40 hover:bg-card"
                >
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {displayPublisher}
                    </span>
                    <h5 className="mt-1 font-bold text-foreground leading-snug">
                      {displayName}
                    </h5>
                    {wb?.difficultyNote && (
                      <p className="mt-1.5 text-xs text-foreground/70">
                        {wb.difficultyNote}
                      </p>
                    )}
                  </div>

                  <a
                    href={buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <span>교재 보러가기</span>
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </div>
              )
            })}
          </div>
        </div>

        {/* 학습 루틴 & 주의사항 */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 pt-2">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-xs font-bold text-foreground">추천 공부 루틴</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {current.studyRoutine}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/30 p-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden />
            <div>
              <p className="text-xs font-bold text-foreground">지도 시 주의사항</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {current.caution}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
