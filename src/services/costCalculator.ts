/**
 * Pricing rates per 1,000,000 tokens in USD (as of standard 2025/2026 rates)
 */
const PRICING_TABLE: Record<string, { input: number; output: number }> = {
  'gemini-2.5-flash': { input: 0.075, output: 0.30 },
  'gemini-2.0-flash': { input: 0.10, output: 0.40 },
  'gemini-1.5-pro': { input: 1.25, output: 5.00 },
  'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
  'claude-3-opus-20240229': { input: 15.00, output: 75.00 },
};

export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const rate = PRICING_TABLE[model] || { input: 0.10, output: 0.40 };
  const inputCost = (inputTokens / 1_000_000) * rate.input;
  const outputCost = (outputTokens / 1_000_000) * rate.output;
  return Number((inputCost + outputCost).toFixed(6));
}
