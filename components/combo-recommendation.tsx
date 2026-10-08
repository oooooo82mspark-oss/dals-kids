"use client"

import { useState } from "react"
import {
  Package,
  ExternalLink,
  Lightbulb,
  Target,
  ChevronRight,
  Sparkles,
  BookOpen,
  Calculator,
  Layers,
  PenLine,
  Crown,
} from "lucide-react"
import {
  goldenCombos,
  getWorkbookById,
  type ComboTier,
  type ComboSet,
  type ComboSlot,
} from "@/lib/workbooks"
import { LevelTagBadge } from "@/components/level-tag"

const tierConfig: Record<
  ComboTier,
  {
    icon: typeof BookOpen
    badgeBg: string
    badgeText: string
    cardBorder: string
    cardGlow: string
  }
> = {
  기초: {
    icon: BookOpen,
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    cardBorder: "border-emerald-200",
    cardGlow: "shadow-emerald-100/50",
  },
  중위: {
    icon: Layers,
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    cardBorder: "border-amber-200",
    cardGlow: "shadow-amber-100/50",
  },
  상위: {
    icon: Crown,
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    cardBorder: "border-purple-200",
    cardGlow: "shadow-purple-100/50",
  },
}

const roleIcons: Record<ComboSlot["role"], typeof BookOpen> = {
  개념서: BookOpen,
  유형서: Layers,
  연산서: Calculator,
  심화서: Crown,
  서술형서: PenLine,
}

const roleBadgeColors: Record<ComboSlot["role"], string> = {
  개념서: "bg-sky-100 text-sky-700 border-sky-200",
  유형서: "bg-blue-100 text-blue-700 border-blue-200",
  연산서: "bg-teal-100 text-teal-700 border-teal-200",
  심화서: "bg-rose-100 text-rose-700 border-rose-200",
  서술형서: "bg-indigo-100 text-indigo-700 border-indigo-200",
}

function SlotCard({ slot }: { slot: ComboSlot }) {
  const wb = getWorkbookById(slot.workbookId)
  if (!wb) return null

  const Icon = roleIcons[slot.role]
  const badgeColor = roleBadgeColors[slot.role]

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Role badge */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badgeColor}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {slot.role}
        </span>
      </div>

      {/* Workbook info */}
      <h4 className="text-lg font-bold text-foreground leading-snug">
        {wb.name}
      </h4>
      <p className="mt-0.5 text-sm text-muted-foreground">{wb.publisher}</p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {wb.tags.map((tag) => (
          <LevelTagBadge key={tag} tag={tag} />
        ))}
      </div>

      {/* Selection reason */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">
        <ChevronRight className="mr-1 inline-block h-3.5 w-3.5 text-primary" aria-hidden />
        {slot.reason}
      </p>

      {/* Buy link */}
      <a
        href={wb.buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        구매하러 가기
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </a>
    </div>
  )
}

function ComboCard({ combo }: { combo: ComboSet }) {
  const config = tierConfig[combo.tier]
  const TierIcon = config.icon

  return (
    <section className="space-y-6">
      {/* Combo header */}
      <div
        className={`relative overflow-hidden rounded-3xl border-2 ${config.cardBorder} bg-card p-6 shadow-lg sm:p-8 ${config.cardGlow}`}
      >
        {/* Gradient accent bar */}
        <div
          className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${combo.accentFrom} ${combo.accentTo}`}
          aria-hidden
        />

        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.badgeBg}`}
          >
            <TierIcon className={`h-6 w-6 ${config.badgeText}`} aria-hidden />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold ${config.badgeBg} ${config.badgeText}`}
              >
                {combo.tier}
              </span>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                {combo.title}
              </h3>
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {combo.subtitle}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          {combo.description}
        </p>

        {/* Target audience */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent/60 px-4 py-3">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <p className="text-sm font-medium text-foreground/80">
            <span className="font-bold text-foreground">대상 :</span>{" "}
            {combo.targetDescription}
          </p>
        </div>
      </div>

      {/* Slot cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {combo.slots.map((slot) => (
          <SlotCard key={slot.workbookId} slot={slot} />
        ))}
      </div>

      {/* Connector visualization */}
      <div className="flex items-center justify-center gap-3 px-4 py-2">
        {combo.slots.map((slot, i) => (
          <div key={slot.workbookId} className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${roleBadgeColors[slot.role]}`}
            >
              {slot.role}
            </span>
            {i < combo.slots.length - 1 && (
              <span className="text-xl font-bold text-primary/50">+</span>
            )}
          </div>
        ))}
        <span className="ml-2 text-xl font-bold text-primary">=</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${config.badgeBg} ${config.badgeText}`}
        >
          <Sparkles className="h-3 w-3" aria-hidden />
          황금 조합
        </span>
      </div>

      {/* Study tip */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-bold text-foreground">학습 순서 팁</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/80">
            {combo.studyTip}
          </p>
        </div>
      </div>
    </section>
  )
}

export function ComboRecommendation() {
  const [selectedTier, setSelectedTier] = useState<ComboTier>("기초")

  const currentCombo = goldenCombos.find((c) => c.tier === selectedTier)!

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16">
      {/* Section header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          <Package className="h-4 w-4" aria-hidden />
          수준별 황금 조합
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          개념서 + 유형서 + 연산서
          <br />
          <span className="text-primary">완벽한 3권 세트 추천</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          아이의 수준에 맞춰 검증된 교재 조합을 추천해 드려요.
          <br className="hidden sm:block" />한 권씩 따로 고르는 것보다 체계적인 학습이 가능해요.
        </p>
      </div>

      {/* Tier selector */}
      <div className="mx-auto mt-8 grid w-full max-w-lg grid-cols-3 gap-1.5 rounded-full border border-border bg-card/60 p-1.5 shadow-sm">
        {goldenCombos.map((combo) => {
          const config = tierConfig[combo.tier]
          const isActive = selectedTier === combo.tier
          return (
            <button
              key={combo.tier}
              type="button"
              onClick={() => setSelectedTier(combo.tier)}
              className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <config.icon className="h-4 w-4" aria-hidden />
              {combo.tier}
            </button>
          )
        })}
      </div>

      {/* Combo content */}
      <div className="mt-10">
        <ComboCard combo={currentCombo} />
      </div>
    </div>
  )
}
