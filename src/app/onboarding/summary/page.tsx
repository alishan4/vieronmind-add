"use client";
import { useSearchParams } from "next/navigation";

export default function Summary() {
  const params = useSearchParams();
  const c = params.get("c");
  const s = params.get("s");

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Your check-in summary</h1>
      <p className="text-gray-700">
        Based on your quick check-in, you may be experiencing:{" "}
        <strong>{c}</strong> ({s})
      </p>
      <a
        href="/dashboard"
        className="inline-block rounded bg-indigo-600 px-4 py-2 text-white"
      >
        Continue to Dashboard
      </a>
    </main>
  );
}
