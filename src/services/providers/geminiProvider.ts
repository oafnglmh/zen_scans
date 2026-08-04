import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider } from './baseProvider';
import { ExtractionRequest, ExtractionResponse } from '../../types/provider';

export class GeminiProvider extends BaseAIProvider {
  name = 'Gemini';

  supportsNativePdf(): boolean {
    return true;
  }

  async extract(request: ExtractionRequest): Promise<ExtractionResponse> {
    return this.runCall(request, 'extraction');
  }

  async verify(request: ExtractionRequest): Promise<ExtractionResponse> {
    return this.runCall(request, 'verification');
  }

  private async runCall(request: ExtractionRequest, stage: 'extraction' | 'verification'): Promise<ExtractionResponse> {
    const apiKey = request.config.geminiApiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API Key is missing. Please enter your Gemini API key in Settings.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = request.config.geminiModel || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: request.config.temperature,
        topP: request.config.topP,
        topK: request.config.topK,
        responseMimeType: 'application/json',
      },
    });

    const startTime = Date.now();
    const parts: any[] = [];

    // Add prompt
    parts.push(request.promptText);

    // Prefer native PDF if configured and available
    if (request.config.preferNativePdf && request.pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: request.pdfBase64,
        },
      });
    } else if (request.pageImages && request.pageImages.length > 0) {
      for (const img of request.pageImages) {
        const mimeMatch = img.dataUrl.match(/^data:(image\/\w+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const base64Data = img.dataUrl.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }
    } else {
      throw new Error('No PDF data or page images provided for extraction.');
    }

    const result = await model.generateContent(parts);
    const durationMs = Date.now() - startTime;
    const responseText = result.response.text();

    const usage = result.response.usageMetadata;
    const inputTokens = usage?.promptTokenCount || 2000;
    const outputTokens = usage?.candidatesTokenCount || 500;

    const parsedResult = this.cleanAndParseJson(responseText);

    return {
      rawJsonString: responseText,
      parsedResult,
      inputTokens,
      outputTokens,
      durationMs,
      providerName: this.name,
      modelName,
    };
  }
}
