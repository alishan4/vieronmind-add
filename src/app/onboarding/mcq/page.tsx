"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

const QUESTIONS = [
  "In the past week, have you felt anxious or on edge?",
  "How often do you feel tired or drained after work/study?",
  "Have you noticed low mood or loss of interest recently?",
];

export default function MCQOnboarding() {
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));
  const [userId, setUserId] = useState<string>("demo-user"); // TODO: replace with real user id from auth
  const mutate = api.emotion.analyze.useMutation();

  const submit = async () => {
    if (!answers.every(Boolean)) return alert("Please answer all questions.");
    const res = await mutate.mutateAsync({ userId, answers, mode: "mcq" });
    window.location.href = `/onboarding/summary?c=${res.condition}&s=${res.severity}`;
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Quick Check-in</h1>
      {QUESTIONS.map((q, i) => (
        <div key={i} className="space-y-2">
          <p className="font-medium">{q}</p>
          <select
            className="w-full rounded border border-gray-300 bg-white p-2 text-sm"
            value={answers[i]}
            onChange={(e) => {
              const next = [...answers]; next[i] = e.target.value; setAnswers(next);
            }}
          >
            <option value="">Select…</option>
            <option>Never</option>
            <option>Sometimes</option>
            <option>Often</option>
            <option>Almost daily</option>
          </select>
        </div>
      ))}
      <button
        onClick={submit}
        className="rounded bg-indigo-600 px-4 py-2 text-white"
      >
        Continue
      </button>
    </main>
  );
}
