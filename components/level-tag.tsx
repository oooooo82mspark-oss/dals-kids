import type { LevelTag } from "@/lib/workbooks"

const styles: Record<LevelTag, string> = {
  개념: "bg-sky-100 text-sky-700",
  기본: "bg-emerald-100 text-emerald-700",
  응용: "bg-amber-100 text-amber-700",
  심화: "bg-rose-100 text-rose-700",
  최상위: "bg-purple-100 text-purple-700",
  연산: "bg-teal-100 text-teal-700",
  서술형: "bg-indigo-100 text-indigo-700",
  유형: "bg-blue-100 text-blue-700",
  사고력: "bg-fuchsia-100 text-fuchsia-700",
}

export function LevelTagBadge({ tag }: { tag: LevelTag }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[tag]}`}
    >
      {tag}
    </span>
  )
}
