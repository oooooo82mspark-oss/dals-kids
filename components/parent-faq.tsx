"use client"

import { useState } from "react"
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Check,
} from "lucide-react"
import { faqs, type FAQItem } from "@/lib/faqs"

export function ParentFAQ() {
  const [openIds, setOpenIds] = useState<string[]>([faqs[0].id])
  const [selectedCategory, setSelectedCategory] = useState<string>("전체")

  const categories = ["전체", "교재 권수", "선행 학습", "학원 병행", "오답/복습", "교재 선택"]

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filteredFaqs =
    selectedCategory === "전체"
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory)

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-14">
      {/* 섹션 헤더 */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <HelpCircle className="h-4 w-4" aria-hidden />
          초등 수학 학부모 필독 FAQ
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          가장 많이 묻고 고민하시는
          <br />
          <span className="text-primary">초등 수학 궁금증 Best Q&A</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          교재 권수부터 선행 진도 범위, 학원 숙제 병행, 오답 관리법까지
          <br className="hidden sm:block" />
          현직 강사 및 학부모들이 검증한 핵심 노하우를 확인하세요.
        </p>
      </div>

      {/* 카테고리 필터 태그 */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all sm:text-sm ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* 아코디언 Q&A 리스트 */}
      <div className="mt-8 space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id)

          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/30"
            >
              {/* 질문 헤더 토글 */}
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-accent/40 sm:p-6"
                aria-expanded={isOpen}
              >
                <div className="space-y-1.5">
                  <span className="inline-block rounded-md bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                    {faq.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground sm:text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-sm font-semibold text-primary">
                    💡 {faq.shortAnswer}
                  </p>
                </div>

                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-foreground">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" aria-hidden />
                  ) : (
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  )}
                </div>
              </button>

              {/* 답변 상세 바디 */}
              {isOpen && (
                <div className="border-t border-border/60 bg-accent/20 px-5 py-5 sm:px-6">
                  <div className="space-y-2.5 text-sm leading-relaxed text-foreground/85">
                    {faq.detailedAnswer.map((p, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{p}</span>
                      </p>
                    ))}
                  </div>

                  {/* 핵심 실천 팁 배너 */}
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900 sm:text-sm">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                    <p className="leading-relaxed">
                      <strong className="font-bold">원포인트 조언: </strong>
                      {faq.tips}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
