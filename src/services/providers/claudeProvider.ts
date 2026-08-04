import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider } from './baseProvider';
import { ExtractionRequest, ExtractionResponse } from '../../types/provider';

export class ClaudeProvider extends BaseAIProvider {
  name = 'Claude';

  supportsNativePdf(): boolean {
    // Claude 3.5 Sonnet / Opus via API supports high-resolution page image payloads
    return false;
  }

  async extract(request: ExtractionRequest): Promise<ExtractionResponse> {
    return this.runCall(request, 'extraction');
  }

  async verify(request: ExtractionRequest): Promise<ExtractionResponse> {
    return this.runCall(request, 'verification');
  }

  private async runCall(request: ExtractionRequest, stage: 'extraction' | 'verification'): Promise<ExtractionResponse> {
    const apiKey = request.config.claudeApiKey || (import.meta as any).env?.VITE_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API Key is missing. Please enter your Claude API key in Settings.');
    }

    const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    const modelName = request.config.claudeModel || 'claude-3-5-sonnet-20241022';
    const startTime = Date.now();

    const content: any[] = [];

    if (request.pageImages && request.pageImages.length > 0) {
      for (const img of request.pageImages) {
        const mimeMatch = img.dataUrl.match(/^data:(image\/\w+);base64,/);
        const mediaType = (mimeMatch ? mimeMatch[1] : 'image/jpeg') as any;
        const base64Data = img.dataUrl.replace(/^data:image\/\w+;base64,/, '');
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data,
          },
        });
      }
    }

    content.push({
      type: 'text',
      text: request.promptText,
    });

    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 4096,
      temperature: request.config.temperature,
      messages: [{ role: 'user', content }],
    });

    const durationMs = Date.now() - startTime;
    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    const inputTokens = response.usage.input_tokens || 3000;
    const outputTokens = response.usage.output_tokens || 800;

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
