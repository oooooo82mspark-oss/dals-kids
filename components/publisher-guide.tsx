"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, BarChart3, BookOpen } from "lucide-react"
import { workbooks, type LevelTag, type Workbook } from "@/lib/workbooks"
import { LevelTagBadge } from "@/components/level-tag"
import { PublisherComparisonTable } from "@/components/publisher-comparison-table"

// 단계 정렬 기준: 낮은 단계 → 높은 단계
const tagOrder: LevelTag[] = ["연산", "개념", "기본", "유형", "응용", "서술형", "심화", "최상위", "사고력"]

function groupByPublisher(list: Workbook[]) {
  const map = new Map<string, Workbook[]>()
  for (const wb of list) {
    const arr = map.get(wb.publisher) ?? []
    arr.push(wb)
    map.set(wb.publisher, arr)
  }
  // 각 출판사 내부는 난이도 순으로 정렬
  for (const [, arr] of map) {
    arr.sort((a, b) => a.difficulty - b.difficulty)
  }
  // 출판사는 보유 문제집 수 많은 순 → 이름순
  return Array.from(map.entries()).sort((a, b) => {
    if (b[1].length !== a[1].length) return b[1].length - a[1].length
    return a[0].localeCompare(b[0], "ko")
  })
}

export function PublisherGuide() {
  const [guideMode, setGuideMode] = useState<"compare" | "publishers">("compare")
  const groups = groupByPublisher(workbooks)

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        추천 도구로 돌아가기
      </Link>

      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold text-primary">초등 수학 문제집 종합 가이드</p>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-4xl">
          출판사 간 난이도 비교 &amp; 교재 정리
        </h1>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          &quot;디딤돌 최상위가 쎈보다 얼마나 어려울까?&quot;, &quot;유형 해결의 법칙은 어디쯤일까?&quot;
          출판사별 체감 난이도 비교표와 세부 교재 라인업을 한눈에 살펴보세요.
        </p>
      </header>

      {/* 모드 전환 탭 */}
      <div className="mb-8 flex w-full max-w-md gap-1.5 rounded-full border border-border bg-card/70 p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setGuideMode("compare")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
            guideMode === "compare"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          출판사 간 난이도 비교표
        </button>
        <button
          type="button"
          onClick={() => setGuideMode("publishers")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
            guideMode === "publishers"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          출판사별 교재 목록 ({workbooks.length}종)
        </button>
      </div>

      {guideMode === "compare" ? (
        <PublisherComparisonTable />
      ) : (
        <div className="space-y-8">
          {/* 단계 범례 */}
          <section
            aria-label="단계 안내"
            className="rounded-3xl border border-border bg-card/60 p-5"
          >
            <p className="mb-3 text-sm font-semibold text-foreground">단계 살펴보기</p>
            <div className="flex flex-wrap gap-2">
              {tagOrder.map((tag) => (
                <LevelTagBadge key={tag} tag={tag} />
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              왼쪽으로 갈수록 기초·개념, 오른쪽으로 갈수록 심화·고난도예요. 선행 학습은 개념·기본
              위주로, 현행 심화는 응용 이상 단계를 함께 보는 것을 추천해요.
            </p>
          </section>

          <div className="space-y-6">
            {groups.map(([publisher, list]) => (
              <section
                key={publisher}
                className="rounded-3xl border border-border bg-card/60 p-6 shadow-sm"
              >
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{publisher}</h2>
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                    총 {list.length}종
                  </span>
                </div>

                <ul className="space-y-3">
                  {list.map((wb) => (
                    <li
                      key={wb.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/50 p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-foreground">{wb.name}</span>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                            난이도 {wb.difficulty}
                          </span>
                          {wb.tags.map((tag) => (
                            <LevelTagBadge key={tag} tag={tag} />
                          ))}
                        </div>
                        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                          {wb.reasons[0]}
                        </p>
                        {wb.difficultyNote && (
                          <p className="mt-1 text-xs font-medium text-primary">
                            💡 {wb.difficultyNote}
                          </p>
                        )}
                      </div>
                      <a
                        href={wb.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        교재 검색
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only">{wb.name} 검색 결과 새 탭에서 열기</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
