"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-vieromind-background text-vieromind-text">
      <div className="rounded-3xl bg-vieromind-surface p-10 shadow-soft w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-semibold">Welcome to Vieromind 🌿</h1>
        <p className="text-vieromind-textLight">
          A calm space where AI meets compassionate therapy.  
          Sign in to begin your personalized wellness journey.
        </p>

        <button
          onClick={() => signIn("google")}
          className="bg-vieromind-teal hover:bg-vieromind-mint transition-all text-white px-6 py-3 rounded-2xl w-full font-medium"
        >
          Continue with Google
        </button>

        <p className="text-xs text-vieromind-textLight pt-2">
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </main>
  );
}
