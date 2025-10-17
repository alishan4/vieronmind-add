"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-vieromind-background via-vieromind-surface to-vieromind-background flex flex-col items-center justify-center text-center px-6">
      
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-semibold text-vieromind-text mb-4"
      >
        Vieromind AI Therapy 🌿
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-lg md:text-xl text-vieromind-textLight max-w-2xl mb-8"
      >
        A calm space where advanced AI meets compassionate therapy — 
        helping you feel balanced, seen, and supported every day.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="flex gap-4"
      >
        <Link href="/onboarding/mcq">
          <button className="bg-vieromind-teal hover:bg-vieromind-mint text-white font-semibold px-8 py-3 rounded-3xl shadow-soft transition">
            Begin Your Journey
          </button>
        </Link>
        <Link href="/about">
          <button className="bg-white border border-vieromind-teal text-vieromind-text font-medium px-8 py-3 rounded-3xl shadow-soft hover:bg-vieromind-surface transition">
            Learn More
          </button>
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-sm text-vieromind-textLight">
        © {new Date().getFullYear()} Vieromind — Healing Through AI
      </footer>
    </main>
  );
}
