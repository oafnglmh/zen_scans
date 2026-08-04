import { AIProvider, ExtractionRequest, ExtractionResponse } from '../../types/provider';
import { BatchExtractionResult } from '../../types/student';

export abstract class BaseAIProvider implements AIProvider {
  abstract name: string;
  abstract extract(request: ExtractionRequest): Promise<ExtractionResponse>;
  abstract verify(request: ExtractionRequest): Promise<ExtractionResponse>;
  abstract supportsNativePdf(): boolean;

  /**
   * Helper to clean raw markdown triple backticks and parse JSON safely
   */
  protected cleanAndParseJson(rawResponse: string): BatchExtractionResult {
    let clean = rawResponse.trim();
    // Remove markdown ```json ... ``` wrapper if present
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
    }
    
    // Find first { and last }
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }

    try {
      const parsed = JSON.parse(clean);
      return {
        decision_number: String(parsed.decision_number || '').trim(),
        decision_date: String(parsed.decision_date || '').trim(),
        students: Array.isArray(parsed.students) ? parsed.students : [],
      };
    } catch (err: any) {
      throw new Error(`Failed to parse JSON response from AI model: ${err.message}. Raw text snippet: ${rawResponse.slice(0, 300)}`);
    }
  }
}
