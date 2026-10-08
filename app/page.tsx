import Link from "next/link"
import { BookOpen } from "lucide-react"
import { RecommenderShell } from "@/components/recommender-shell"
import { ComboRecommendation } from "@/components/combo-recommendation"
import { DiagnosticBanner } from "@/components/diagnostic-banner"
import { ProblemPrescription } from "@/components/problem-prescription"
import { ParentFAQ } from "@/components/parent-faq"

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-accent/40 via-background to-background">
      <Link
        href="/guide"
        title="출판사 간 난이도 비교표 및 교재 정리"
        className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-primary/20 bg-card/90 px-3.5 py-2 text-xs font-bold text-foreground shadow-md backdrop-blur transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground sm:right-6 sm:top-6 sm:px-4 sm:py-2.5 sm:text-sm"
      >
        <BookOpen className="h-4 w-4" aria-hidden />
        <span>출판사 난이도 비교</span>
      </Link>

      {/* 1. EBS 초등 기초학력 진단평가 배너 */}
      <DiagnosticBanner />

      {/* 맞춤형 문제집 추천 셸 (부모 선택 or 아이 테스트) */}
      <RecommenderShell />

      {/* 구분선 */}
      <div className="mx-auto max-w-4xl px-4">
        <hr className="border-border" />
      </div>

      {/* 2. 수준별 황금 조합 (개념+유형+연산 3권 세트) */}
      <ComboRecommendation />

      {/* 구분선 */}
      <div className="mx-auto max-w-4xl px-4">
        <hr className="border-border" />
      </div>

      {/* 3. 오답 유형별 처방전 (증상별 교재 매칭) */}
      <ProblemPrescription />

      {/* 구분선 */}
      <div className="mx-auto max-w-4xl px-4">
        <hr className="border-border" />
      </div>

      {/* 4. 학부모 FAQ (Q&A) */}
      <ParentFAQ />

      {/* 푸터 */}
      <footer className="mt-16 border-t border-border bg-card/40 py-10 text-center text-xs text-muted-foreground">
        <p>© 달스키즈(Dals Kids) - 초등 수학 문제집 맞춤 추천 시스템</p>
        <p className="mt-1">
          EBS 초등 진단평가 연계 · 수준별 황금 조합 · 오답 증상별 처방전
        </p>
      </footer>
    </main>
  )
}


