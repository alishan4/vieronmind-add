"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SummaryInner() {
  const params = useSearchParams();
  const condition = params.get("condition");

  return <div>Summary: {condition}</div>;
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div>Loading summary...</div>}>
      <SummaryInner />
    </Suspense>
  );
}
