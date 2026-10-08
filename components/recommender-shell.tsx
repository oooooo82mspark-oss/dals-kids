"use client"

import { useState } from "react"
import { Users, Rocket } from "lucide-react"
import { MathRecommender } from "@/components/math-recommender"
import { KidTest } from "@/components/kid-test"

type Mode = "parent" | "kid"

export function RecommenderShell() {
  const [mode, setMode] = useState<Mode>("parent")

  return (
    <div>
      <div className="mx-auto w-full max-w-3xl px-4 pt-8">
        <div
          role="tablist"
          aria-label="추천 방식 선택"
          className="mx-auto grid w-full max-w-md grid-cols-2 gap-1.5 rounded-full border border-border bg-card/60 p-1.5 shadow-sm"
        >
          <button
            role="tab"
            aria-selected={mode === "parent"}
            type="button"
            onClick={() => setMode("parent")}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              mode === "parent"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" aria-hidden />
            부모님이 골라요
          </button>
          <button
            role="tab"
            aria-selected={mode === "kid"}
            type="button"
            onClick={() => setMode("kid")}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              mode === "kid"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Rocket className="h-4 w-4" aria-hidden />
            아이가 테스트해요
          </button>
        </div>
      </div>

      {mode === "parent" ? <MathRecommender /> : <KidTest />}
    </div>
  )
}
