import { ExternalLink } from "lucide-react"
import type { Workbook } from "@/lib/workbooks"
import { LevelTagBadge } from "@/components/level-tag"

export function WorkbookCard({ workbook }: { workbook: Workbook }) {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex flex-wrap gap-2">
        {workbook.tags.map((tag) => (
          <LevelTagBadge key={tag} tag={tag} />
        ))}
      </div>

      <h3 className="text-xl font-bold text-foreground text-balance">{workbook.name}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{workbook.publisher}</p>

      <ul className="mt-4 flex-1 space-y-2">
        {workbook.reasons.map((reason, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>

      <a
        href={workbook.buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        구매하러 가기
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
    </div>
  )
}
