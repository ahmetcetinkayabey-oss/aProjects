import { BadGatewayException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

export type AiAction = 'translate-en' | 'translate-tr' | 'polish' | 'shorten';

const INSTRUCTIONS: Record<AiAction, string> = {
  'translate-en':
    'Translate the user text from Turkish to natural, professional English for a sports camp website. Keep every number, name and unit exactly. Keep the line structure; lines starting with "## " stay subheadings. Return only the translation.',
  'translate-tr':
    "Metni İngilizceden doğal ve profesyonel Türkçeye çevir. Sayıları, adları ve birimleri aynen koru. Satır yapısını koru; '## ' ile başlayan satırlar alt başlık olarak kalsın. Yalnızca çeviriyi yaz.",
  polish:
    "Metni anlamını ve verdiği bilgileri değiştirmeden daha akıcı ve düzgün Türkçeyle yeniden yaz. Yeni bilgi, rakım, sayı veya iddia ekleme. Satır yapısını ve '## ' alt başlıklarını koru. Yalnızca yeni metni yaz.",
  shorten:
    "Metni anlamını koruyarak yaklaşık yarı uzunluğa kısalt. Yeni bilgi ekleme. Satır yapısını ve '## ' alt başlıklarını koru. Yalnızca kısaltılmış metni yaz.",
};

export const AI_ACTIONS = Object.keys(INSTRUCTIONS) as AiAction[];
export const AI_MAX_CHARS = 12000;

@Injectable()
export class AiService {
  private client?: GoogleGenAI;

  get enabled(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  async transform(action: AiAction, text: string): Promise<string> {
    return this.generate(INSTRUCTIONS[action], text);
  }

  /** Gemini'ye tek bir istek gönderir; anahtar/kota/servis hatalarını kullanıcıya uygun hatalara çevirir. */
  async generate(system: string, input: string): Promise<string> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new ServiceUnavailableException('Yapay zekâ anahtarı tanımlı değil.');
    this.client ??= new GoogleGenAI({ apiKey: key, httpOptions: { timeout: 30000 } });
    try {
      const r = await this.client.interactions.create({
        model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        system_instruction: system,
        input,
      });
      const out = (r.steps ?? [])
        .flatMap((s) => (s.type === 'model_output' ? (s.content ?? []) : []))
        .map((c) => (c.type === 'text' ? c.text : ''))
        .join('')
        .trim();
      if (!out) throw new BadGatewayException('Yapay zekâ boş cevap verdi.');
      return out;
    } catch (e) {
      if (e instanceof BadGatewayException) throw e;
      const status = (e as { status?: number }).status;
      if (status === 429) throw new ServiceUnavailableException('Yapay zekâ günlük kullanım sınırına ulaşıldı, daha sonra deneyin.');
      throw new BadGatewayException('Yapay zekâ şu an cevap vermiyor.');
    }
  }
}
