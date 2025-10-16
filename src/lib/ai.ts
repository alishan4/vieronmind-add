export type AnalyzeMode = "mcq" | "image";

export interface AnalyzeResult {
  condition: "anxiety" | "burnout" | "depression" | "stress";
  severity: "low" | "moderate" | "high";
  recommendation: string;
}

export async function analyzeEmotionMock(
  answers: string[],
  mode: AnalyzeMode,
): Promise<AnalyzeResult> {
  const text = answers.join(" ").toLowerCase();

  // simple rule-based triage (safe placeholder)
  if (text.includes("panic") || text.includes("fear") || text.includes("worry"))
    return { condition: "anxiety", severity: "moderate", recommendation: "mindfulness + CBT" };

  if (text.includes("tired") || text.includes("exhausted") || text.includes("work"))
    return { condition: "burnout", severity: "moderate", recommendation: "rest scheduling" };

  if (text.includes("sad") || text.includes("hopeless"))
    return { condition: "depression", severity: "high", recommendation: "therapy + support plan" };

  if (mode === "image" && answers[0]?.includes("storm"))
    return { condition: "stress", severity: "moderate", recommendation: "breathing + grounding" };

  return { condition: "stress", severity: "low", recommendation: "daily breathing exercise" };
}
