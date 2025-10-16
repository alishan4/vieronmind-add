"use client";

import { api } from "~/trpc/react";

const OPTIONS = [
  { id: "sunrise", label: "Calm sunrise" },
  { id: "storm", label: "Stormy sky" },
  { id: "forest", label: "Quiet forest" },
  { id: "city", label: "Busy city" },
];

export default function PictureOnboarding() {
  const userId = "demo-user"; // TODO: replace with real user id from auth
  const mutate = api.emotion.analyze.useMutation();

  const pick = async (id: string) => {
    const res = await mutate.mutateAsync({ userId, mode: "image", answers: [id] });
    window.location.href = `/onboarding/summary?c=${res.condition}&s=${res.severity}`;
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold">Which scene matches your mood?</h1>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => pick(o.id)}
            className="rounded border border-gray-300 bg-white p-4 text-left hover:border-indigo-500"
          >
            <div className="h-24 w-full rounded bg-gray-100 mb-2 flex items-center justify-center">
              {/* placeholder block for images; swap with real images later */}
              <span className="text-sm text-gray-500">{o.label}</span>
            </div>
            <span className="text-sm">{o.label}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
