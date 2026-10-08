import Link from "next/link"
import { BookOpen } from "lucide-react"
import { RecommenderShell } from "@/components/recommender-shell"
import { ComboRecommendation } from "@/components/combo-recommendation"

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
      <RecommenderShell />

      {/* 구분선 */}
      <div className="mx-auto max-w-4xl px-4">
        <hr className="border-border" />
      </div>

      <ComboRecommendation />
    </main>
  )
}

