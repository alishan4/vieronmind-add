
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/trpc/react";

const QUESTIONS = [
  "In the past week, have you felt anxious or on edge?",
  "How often do you feel tired or drained after work/study?",
  "Have you noticed low mood or loss of interest recently?",
];

export default function MCQOnboarding() {
  const { data: session, status } = useSession();
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));
  const mutation = api.emotion.submitCheckIn.useMutation();

  const submit = async () => {
    if (!answers.every(Boolean)) return alert("Please answer all questions.");

    // if not logged in, go to Google login
    if (status !== "authenticated" || !session?.user?.id) {
      alert("Please sign in to save your progress 🌿");
      return signIn("google", { callbackUrl: "/onboarding/mcq" });
    }

    const res = await mutation.mutateAsync({
      userId: session.user.id,
      qAnxiety: answers[0] ?? "",
  qFatigue: answers[1] ?? "",
  qLowMood: answers[2] ?? "",
    });

    window.location.href = `/dashboard?c=${res.condition}&s=${res.severity}`;
  };

  useEffect(() => {
    if (status === "authenticated") {
      console.log("🧠 Logged in user:", session.user.email);
    }
  }, [status, session]);

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
              const next = [...answers];
              next[i] = e.target.value;
              setAnswers(next);
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
