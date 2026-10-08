import { ExternalLink, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react"

export function DiagnosticBanner() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-6">
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-background p-6 shadow-sm transition-all hover:shadow-md sm:p-7">
        {/* 장식용 블러 서클 */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-200/30 blur-2xl"
          aria-hidden
        />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                공식 진단 사이트 연계
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                무료 평가
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              우리 아이 현재 실력이 궁금하다면?{" "}
              <span className="text-emerald-700">EBS 기초학력 진단평가</span>
            </h3>

            <p className="text-sm leading-relaxed text-foreground/80">
              EBS 초등 및 국가 공인 진단 시스템에서 학년별 무료 모의고사와 AI 맞춤 분석을 받아보세요.
              <br className="hidden sm:inline" /> 진단 후 결과 점수에 맞춰 아래 교재 추천기를 활용하시면 훨씬 정확합니다.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                초등 1~6학년 전 학년 지원
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                온라인 모의고사 & 단추 AI 진단
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:shrink-0">
            <a
              href="https://primary.ebs.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              <span>EBS 초등 진단평가 바로가기</span>
              <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
            </a>
            <a
              href="https://www.basics.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white/80 px-4 py-2 text-xs font-semibold text-emerald-900 transition-colors hover:bg-emerald-100"
            >
              <span>국가기초학력지원포털(늘품이)</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
