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
  Calculator,
  BookMarked,
} from "lucide-react"
import { RecommenderShell } from "@/components/recommender-shell"
import { ComboRecommendation } from "@/components/combo-recommendation"
import { DiagnosticBanner } from "@/components/diagnostic-banner"
import { ProblemPrescription } from "@/components/problem-prescription"
import { ParentFAQ } from "@/components/parent-faq"
import { KoreanRecommender } from "@/components/korean-recommender"
import { KoreanComboSection } from "@/components/korean-combo"
import {
  KoreanPrescriptionSection,
  KoreanFAQSection,
} from "@/components/korean-sections"

type SubjectType = "math" | "korean"
type TabType = "recommend" | "combo" | "prescription" | "faq"

const mathTabs = [
  {
    id: "recommend" as TabType,
    label: "맞춤 교재 추천",
    shortLabel: "맞춤 추천",
    icon: Sparkles,
  },
  {
    id: "combo" as TabType,
    label: "3권 황금 조합",
    shortLabel: "황금 조합",
    icon: Package,
  },
  {
    id: "prescription" as TabType,
    label: "오답 증상 처방전",
    shortLabel: "오답 처방전",
    icon: Stethoscope,
  },
  {
    id: "faq" as TabType,
    label: "학부모 필독 FAQ",
    shortLabel: "학부모 Q&A",
    icon: HelpCircle,
  },
]

const koreanTabs = [
  {
    id: "recommend" as TabType,
    label: "문해력 진단 & 듀얼 추천",
    shortLabel: "문해력 진단",
    icon: Sparkles,
  },
  {
    id: "combo" as TabType,
    label: "국어 3권+책 조합",
    shortLabel: "세트 조합",
    icon: Package,
  },
  {
    id: "prescription" as TabType,
    label: "국어 증상별 처방전",
    shortLabel: "국어 처방전",
    icon: Stethoscope,
  },
  {
    id: "faq" as TabType,
    label: "독서·국어 FAQ",
    shortLabel: "국어 Q&A",
    icon: HelpCircle,
  },
]


export default function Page() {
  const [subject, setSubject] = useState<SubjectType>("math")
  const [activeTab, setActiveTab] = useState<TabType>("recommend")

  const currentTabs = subject === "math" ? mathTabs : koreanTabs

  const handleSubjectChange = (newSubject: SubjectType) => {
    setSubject(newSubject)
    setActiveTab("recommend")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 수학(블루/인디고 테마) vs 국어(에메랄드/포레스트 테마)
  const isMath = subject === "math"

  return (
    <main
      className={`min-h-screen pb-20 transition-colors duration-300 ${
        isMath
          ? "bg-gradient-to-b from-sky-50/70 via-background to-background"
          : "bg-gradient-to-b from-emerald-50/70 via-background to-background"
      }`}
    >
      {/* 최상단 글로벌 헤더 & 유틸 바 */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl font-black text-base text-white shadow-xs transition-colors ${
                isMath ? "bg-blue-600" : "bg-emerald-600"
              }`}
            >
              {isMath ? "수" : "국"}
            </div>
            <div>
              <span className="font-extrabold text-foreground tracking-tight text-base sm:text-lg">
                달스키즈{" "}
                <span
                  className={`font-bold text-xs sm:text-sm ${
                    isMath ? "text-blue-600" : "text-emerald-700"
                  }`}
                >
                  {isMath ? "수학 추천 시스템" : "국어·문해력 추천 시스템"}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 출판사 난이도 비교 페이지 이동 */}
            <Link
              href="/guide"
              title="출판사 간 난이도 비교표 및 교재 정리"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-xs transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              <span>출판사 난이도 비교표</span>
            </Link>
          </div>
        </div>

        {/* 과목 전환 스위처 (수학 ⟷ 국어) */}
        <div className="mx-auto max-w-4xl px-4 pt-1">
          <div className="flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSubjectChange("math")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all sm:text-sm ${
                isMath
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600/30 scale-102"
                  : "border border-border bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>초등 수학</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubjectChange("korean")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold transition-all sm:text-sm ${
                !isMath
                  ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30 scale-102"
                  : "border border-border bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <BookMarked className="h-4 w-4" />
              <span>초등 국어·문해력</span>
              <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-amber-950">
                NEW
              </span>
            </button>
          </div>
        </div>

        {/* 메인 4개 카테고리 세그먼트 탭 바 */}
        <div className="mx-auto max-w-4xl px-4 pb-2.5 pt-2">
          <nav
            role="tablist"
            aria-label="서비스 카테고리"
            className="grid grid-cols-4 gap-1 rounded-2xl border border-border/80 bg-accent/40 p-1.5 shadow-xs"
          >
            {currentTabs.map((tab) => {
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
                      isActive
                        ? isMath
                          ? "text-blue-600"
                          : "text-emerald-600"
                        : "text-muted-foreground"
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

      {/* 탭별 단일 컨텐츠 렌더링 */}
      <div className="mt-2 transition-all">
        {/* ===================== [수학 과목 컨텐츠] ===================== */}
        {subject === "math" && (
          <>
            {activeTab === "recommend" && (
              <div className="animate-in fade-in-50 duration-200">
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
          </>
        )}

        {/* ===================== [국어 과목 컨텐츠] ===================== */}
        {subject === "korean" && (
          <>
            {activeTab === "recommend" && (
              <div className="animate-in fade-in-50 duration-200">
                <KoreanRecommender />
              </div>
            )}
            {activeTab === "combo" && (
              <div className="animate-in fade-in-50 duration-200">
                <KoreanComboSection />
              </div>
            )}
            {activeTab === "prescription" && (
              <div className="animate-in fade-in-50 duration-200">
                <KoreanPrescriptionSection />
              </div>
            )}
            {activeTab === "faq" && (
              <div className="animate-in fade-in-50 duration-200">
                <KoreanFAQSection />
              </div>
            )}
          </>
        )}
      </div>

      {/* 푸터 */}
      <footer className="mt-20 border-t border-border bg-card/40 py-8 text-center text-xs text-muted-foreground">
        <p className="font-semibold text-foreground/80">
          달스키즈(Dals Kids) · 초등 수학 & 국어 문해력 맞춤 추천 솔루션
        </p>
        <p className="mt-1">
          EBS 초등 진단평가 연계 · 수준별 황금 조합 · 문제집 + 필독서 듀얼 추천 · 오답 처방전
        </p>
      </footer>
    </main>
  )
}




