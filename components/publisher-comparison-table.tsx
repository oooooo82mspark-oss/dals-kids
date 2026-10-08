"use client"

import { useState } from "react"
import {
  ExternalLink,
  HelpCircle,
  Sparkles,
  LayoutGrid,
  ListOrdered,
} from "lucide-react"
import {
  workbooks,
  difficultyBands,
  majorPublishers,
} from "@/lib/workbooks"
import { LevelTagBadge } from "@/components/level-tag"

export function PublisherComparisonTable() {
  const [activeTab, setActiveTab] = useState<"matrix" | "ladder">("matrix")
  const [selectedPublisher, setSelectedPublisher] = useState<string>("all")
  const [highlightWb, setHighlightWb] = useState<string | null>(null)

  // 7단계(최상위)부터 1단계(연산)까지 위에서 아래로 정렬
  const sortedBands = [...difficultyBands].sort((a, b) => b.band - a.band)

  // 전체 교재 난이도 내림차순 정렬
  const ladderList = [...workbooks]
    .filter((w) => selectedPublisher === "all" || w.publisher === selectedPublisher)
    .sort((a, b) => b.difficulty - a.difficulty)

  return (
    <div className="space-y-10">
      {/* 1. 핵심 체감 난이도 한눈에 보기 배너 */}
      <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            체감 난이도 핵심 공식
          </span>
          <span className="text-xs text-muted-foreground">
            학부모·사교육 공인 난이도 사다리
          </span>
        </div>

        <h2 className="mt-2 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          디딤돌 최상위는 쎈보다 확실히 어렵습니다!
        </h2>

        {/* 난이도 체인 — 컴팩트 인라인 뱃지 */}
        <div className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {[
            { name: "최상위", pub: "디딤돌", score: 9.0, bg: "bg-purple-600 text-white" },
            { name: "최고수준", pub: "천재", score: 8.7, bg: "bg-purple-500 text-white" },
            { name: "일품", pub: "신사고", score: 8.0, bg: "bg-rose-500 text-white" },
            { name: "최상위S", pub: "디딤돌", score: 7.5, bg: "bg-rose-400 text-white" },
            { name: "응용해법", pub: "천재", score: 6.8, bg: "bg-orange-500 text-white" },
            { name: "쎈", pub: "신사고", score: 6.0, bg: "bg-amber-500 text-white" },
            { name: "유형해법", pub: "천재", score: 5.4, bg: "bg-blue-500 text-white" },
            { name: "기본+응용", pub: "디딤돌", score: 5.0, bg: "bg-emerald-500 text-white" },
            { name: "기본", pub: "디딤돌", score: 3.5, bg: "bg-emerald-400 text-slate-900" },
          ].map((item, idx, arr) => (
            <span key={item.name} className="inline-flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${item.bg}`}
              >
                {item.name}
                <span className="opacity-70 text-[10px]">{item.pub}</span>
              </span>
              {idx < arr.length - 1 && (
                <span className="text-xs font-black text-muted-foreground/50">&gt;</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* 2. 뷰 전환 탭 & 출판사 필터 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full border border-border bg-card/60 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "matrix"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            출판사 비교 매트릭스 표
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ladder")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "ladder"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListOrdered className="h-4 w-4" />
            난이도 순위 사다리
          </button>
        </div>

        {activeTab === "ladder" && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-muted-foreground shrink-0">출판사 필터:</span>
            {["all", ...majorPublishers].map((pub) => (
              <button
                key={pub}
                type="button"
                onClick={() => setSelectedPublisher(pub)}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  selectedPublisher === pub
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {pub === "all" ? "전체" : pub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3-A. 출판사 비교 매트릭스 표 */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
            <table className="w-full min-w-[840px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="w-48 px-5 py-4">난이도 단계 (Band)</th>
                  {majorPublishers.map((pub) => (
                    <th key={pub} className="px-4 py-4 text-center font-bold text-foreground">
                      {pub}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sortedBands.map((bandInfo) => {
                  return (
                    <tr
                      key={bandInfo.band}
                      className="transition-colors hover:bg-accent/20"
                    >
                      {/* 단계 열 헤더 */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-xs font-bold ${bandInfo.badgeColor}`}
                          >
                            Lv {bandInfo.band}. {bandInfo.title.split(":")[1]?.trim() ?? bandInfo.title}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {bandInfo.subtitle}
                          </span>
                        </div>
                      </td>

                      {/* 5개 출판사별 교재 셀 */}
                      {majorPublishers.map((pub) => {
                        const matchingWbs = workbooks.filter(
                          (w) => w.publisher === pub && w.band === bandInfo.band
                        )

                        return (
                          <td
                            key={pub}
                            className="px-3 py-3 align-top border-l border-border/40 text-center"
                          >
                            {matchingWbs.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {matchingWbs.map((wb) => (
                                  <a
                                    key={wb.id}
                                    href={wb.buyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onMouseEnter={() => setHighlightWb(wb.id)}
                                    onMouseLeave={() => setHighlightWb(null)}
                                    className={`group block rounded-xl border p-2.5 text-left transition-all ${
                                      highlightWb === wb.id
                                        ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                                        : "border-border/80 bg-background/80 hover:border-primary/50 hover:bg-card"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-bold text-foreground group-hover:text-primary">
                                        {wb.name}
                                      </span>
                                      <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                        {wb.difficulty}
                                      </span>
                                    </div>
                                    {wb.difficultyNote && (
                                      <p className="mt-1 text-[11px] leading-tight text-muted-foreground line-clamp-2">
                                        {wb.difficultyNote}
                                      </p>
                                    )}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground/30">-</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-right text-xs text-muted-foreground">
            * 교재 카드를 클릭하면 네이버 쇼핑 최신 정보 및 검색 결과로 연결됩니다.
          </p>
        </div>
      )}

      {/* 3-B. 난이도 순위 사다리 뷰 */}
      {activeTab === "ladder" && (
        <div className="space-y-3">
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm divide-y divide-border/60">
            {ladderList.map((wb, index) => {
              const bandInfo = difficultyBands.find((b) => b.band === wb.band)
              const percent = (wb.difficulty / 10) * 100

              return (
                <div
                  key={wb.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 sm:w-1/3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{wb.name}</span>
                        <span className="text-xs text-muted-foreground">({wb.publisher})</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {wb.tags.map((tag) => (
                          <LevelTagBadge key={tag} tag={tag} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 난이도 게이지 바 */}
                  <div className="flex-1 sm:px-6">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-muted-foreground">{bandInfo?.title}</span>
                      <span className="text-primary font-bold">난이도 {wb.difficulty} / 10</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {wb.difficultyNote && (
                      <p className="mt-1 text-xs text-muted-foreground">{wb.difficultyNote}</p>
                    )}
                  </div>

                  {/* 검색 버튼 */}
                  <div className="shrink-0 text-right">
                    <a
                      href={wb.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      교재 검색
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. 학부모 필독! 대표 문제집 1:1 비교 꿀팁 */}
      <section className="rounded-3xl border border-border bg-card/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            학부모가 가장 많이 묻는 교재 비교 질문 TOP 3
          </h3>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* Q1: 쎈 vs 디딤돌 최상위 */}
          <div className="rounded-2xl border border-border/80 bg-background/60 p-5">
            <span className="inline-block rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
              핵심 비교 1
            </span>
            <h4 className="mt-2 text-base font-bold text-foreground">
              쎈 vs 디딤돌 최상위, 뭐가 더 어렵나요?
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">디딤돌 최상위가 훨씬 어렵습니다.</strong> 쎈은 학교 시험에 나오는 다양한 유형을 훈련하는 &apos;유형서&apos;이며, 최상위는 상위 1~3%를 위한 &apos;극심화서&apos;입니다. 쎈 C단계가 최상위의 기초 레벨에 해당하므로, 쎈을 마스터한 뒤 최상위S나 최상위로 넘어가는 것이 정석 로드맵입니다.
            </p>
          </div>

          {/* Q2: 기응 vs 유형 해결의 법칙 */}
          <div className="rounded-2xl border border-border/80 bg-background/60 p-5">
            <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
              핵심 비교 2
            </span>
            <h4 className="mt-2 text-base font-bold text-foreground">
              디딤돌 기응 vs 유형 해결의 법칙
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              둘 다 비슷한 난이도(Lv 5.0 ~ 5.4)이지만 성격이 다릅니다. <strong className="text-foreground">디딤돌 기응</strong>은 개념 50% + 응용 50%로 한 권에 기본과 응용을 균형 있게 끝내기에 좋고, <strong className="text-foreground">유형 해결의 법칙</strong>은 시험에 출제되는 세부 유형을 빈틈없이 익히는 데 더 강점이 있습니다.
            </p>
          </div>

          {/* Q3: 최상위S vs 최상위 수학 */}
          <div className="rounded-2xl border border-border/80 bg-background/60 p-5">
            <span className="inline-block rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
              핵심 비교 3
            </span>
            <h4 className="mt-2 text-base font-bold text-foreground">
              최상위S vs 최상위 수학 차이는?
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              최상위 수학이 벽처럼 느껴져 힘들어하는 아이들을 위해 만들어진 징검다리 교재가 바로 <strong className="text-foreground">최상위S</strong>(Lv 7.5)입니다. 대표 심화 유형을 그림과 다이어그램으로 친절히 풀어주어, 쎈이나 기응을 푼 후 최상위로 넘어가기 전 훌륭한 디딤돌 역할을 해줍니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
