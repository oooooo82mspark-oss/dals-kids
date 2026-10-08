import type { Metadata } from "next"
import { PublisherGuide } from "@/components/publisher-guide"

export const metadata: Metadata = {
  title: "출판사별 문제집 단계 정리 | 초등 수학 문제집 찾기",
  description: "개념부터 최상위까지, 출판사별 초등 수학 문제집의 난이도 단계를 한눈에 정리한 참고 자료예요.",
}

export default function GuidePage() {
  return <PublisherGuide />
}
