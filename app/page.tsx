"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  Package,
  Stethoscope,
  HelpCircle,
  BookOpen,
  GraduationCap,
  ExternalLink,
} from "lucide-react"
import { RecommenderShell } from "@/components/recommender-shell"
import { ComboRecommendation } from "@/components/combo-recommendation"
import { DiagnosticBanner } from "@/components/diagnostic-banner"
import { ProblemPrescription } from "@/components/problem-prescription"
import { ParentFAQ } from "@/components/parent-faq"

type TabType = "recommend" | "combo" | "prescription" | "faq"

const tabs = [
  {
    id: "recommend" as TabType,
    label: "맞춤 교재 추천",
    shortLabel: "맞춤 추천",
    icon: Sparkles,
    badge: "대표 기능",
  },
  {
    id: "combo" as TabType,
    label: "3권 황금 조합",
    shortLabel: "황금 조합",
    icon: Package,
    badge: "세트 추천",
  },
  {
    id: "prescription" as TabType,
    label: "오답 증상 처방전",
    shortLabel: "오답 처방전",
    icon: Stethoscope,
    badge: "1:1 매칭",
  },
  {
    id: "faq" as TabType,
    label: "학부모 필독 FAQ",
    shortLabel: "학부모 Q&A",
    icon: HelpCircle,
    badge: "궁금증 해결",
  },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>("recommend")

  return (
    <main className="min-h-screen bg-gradient-to-b from-accent/30 via-background to-background pb-20">
      {/* 최상단 글로벌 헤더 & 유틸 바 */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-base shadow-xs">
              달
            </div>
            <div>
              <span className="font-extrabold text-foreground tracking-tight text-base sm:text-lg">
                달스키즈 <span className="text-primary font-bold text-xs sm:text-sm">수학추천</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EBS 진단평가 퀵 링크 */}
            <a
              href="https://primary.ebs.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              title="EBS 초등 기초학력 진단평가 바로가기"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-emerald-50/80 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100 hover:text-emerald-900"
            >
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">EBS 진단평가</span>
              <span className="sm:hidden">EBS 진단</span>
              <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
            </a>

            {/* 출판사 난이도 비교 페이지 이동 */}
            <Link
              href="/guide"
              title="출판사 간 난이도 비교표 및 교재 정리"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-xs transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:px-3.5"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">출판사 난이도 비교</span>
              <span className="sm:hidden">난이도 표</span>
            </Link>
          </div>
        </div>

        {/* 메인 4개 카테고리 세그먼트 탭 바 */}
        <div className="mx-auto max-w-4xl px-4 pb-2.5 pt-1">
          <nav
            role="tablist"
            aria-label="서비스 카테고리"
            className="grid grid-cols-4 gap-1 rounded-2xl border border-border/80 bg-accent/40 p-1.5 shadow-xs"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-center transition-all sm:flex-row sm:gap-2 sm:py-2.5 ${
                    isActive
                      ? "bg-card text-foreground font-bold shadow-sm ring-1 ring-border"
                      : "text-muted-foreground hover:bg-card/40 hover:text-foreground font-medium"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden
                  />
                  <span className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* 탭별 단일 컨텐츠 렌더링 - 스크롤 과부하 제거 */}
      <div className="mt-2 transition-all">
        {activeTab === "recommend" && (
          <div className="animate-in fade-in-50 duration-200">
            {/* 맞춤 추천 상단에는 EBS 진단 배너 함께 노출 */}
            <DiagnosticBanner />
            <RecommenderShell />
          </div>
        )}

        {activeTab === "combo" && (
          <div className="animate-in fade-in-50 duration-200">
            <ComboRecommendation />
          </div>
        )}

        {activeTab === "prescription" && (
          <div className="animate-in fade-in-50 duration-200">
            <ProblemPrescription />
          </div>
        )}

        {activeTab === "faq" && (
          <div className="animate-in fade-in-50 duration-200">
            <ParentFAQ />
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer className="mt-20 border-t border-border bg-card/40 py-8 text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground/80">
          달스키즈(Dals Kids) · 초등 수학 맞춤 추천 솔루션
        </p>
        <p className="mt-1">
          EBS 초등 진단평가 연계 · 수준별 3권 황금 조합 · 오답 증상별 처방전 · 학부모 Q&A
        </p>
      </footer>
    </main>
  )
}


