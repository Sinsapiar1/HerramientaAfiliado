import '../styles.css';

// Temporary: import existing legacy script to keep functionality.
import '../script.js';

console.log('MarketInsight Pro (Vite + TS) initialized');

// ------------------ IA Provider Selector & APIManager Override ------------------

type ProviderId = 'gemini' | 'openai' | 'together' | 'cohere';

interface ProviderConfig {
  name: string;
  keyLink: string;
  request: (prompt: string, apiKey: string) => Promise<string>;
}

// ===== Helper: compact prompt for non-Gemini providers =====
function compactPrompt(original: string): string {
  // Remove emojis and excessive whitespace
  const noEmoji = original.replace(/[\u{1F300}-\u{1F6FF}]/gu, '');
  return noEmoji.replace(/\s{2,}/g, ' ').trim();
}

// ===== Helper: validate model response =====
function isValidProductResponse(resp: string): boolean {
  const blocks = resp.match(/=== PRODUCTO [1-3] ===[\s\S]*?=== FIN PRODUCTO [1-3] ===/g) || [];
  if (blocks.length !== 3) return false;

  const nombres = blocks.map(b => {
    const m = b.match(/NOMBRE:\s*([^\n]+)/i);
    return m ? m[1].trim().toLowerCase() : '';
  });

  // Todos los nombres deben existir y ser distintos
  if (nombres.some(n => !n || n === '%' || n.length < 3)) return false;
  const unique = new Set(nombres);
  return unique.size === 3;
}

const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  gemini: {
    name: 'Google Gemini',
    keyLink: 'https://aistudio.google.com/app/apikey',
    // no need, Gemini usa la implementación original
    request: async () => {
      throw new Error('Gemini request debe ser manejada por la implementación original');
    },
  },
  openai: {
    name: 'OpenAI GPT-3.5',
    keyLink: 'https://platform.openai.com/account/api-keys',
    request: async (prompt: string, apiKey: string) => {
      const MAX_RETRY = 2;
      const isSimpleTest = /Responde\s+solo\s+con\s+\"OK\"/i.test(prompt);
      const makeCall = async (attempt = 0): Promise<string> => {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Eres un analista senior de marketing de afiliados. Devuelve EXACTAMENTE 3 productos REALES. Cada producto debe incluir NOMBRE (no vacío), PRECIO, COMISION, SCORE, GRAVITY y demás campos. Los NOMBRE deben ser distintos entre sí. No repitas productos, no uses placeholders, no uses las palabras "potencial" ni "estimación". Formato: "=== PRODUCTO N ===" ... "=== FIN PRODUCTO N ===". Idioma: Español.' },
            { role: 'user', content: attempt>0 ? `FORMATO INCORRECTO. Repite EXACTAMENTE usando la plantilla.\n${compactPrompt(prompt)}` : compactPrompt(prompt) }
          ],
          temperature: 0.2,
          top_p: 0.8,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      if (!isSimpleTest && !isValidProductResponse(content)) {
        if (attempt < MAX_RETRY) {
          return await makeCall(attempt + 1);
        }
        throw new Error('El modelo no generó 3 productos válidos.');
      }
      return content;
      };

      return makeCall();
    },
  },
  together: {
    name: 'Together.ai (Mistral 7B)',
    keyLink: 'https://docs.together.ai/reference/authentication-1',
    request: async (prompt: string, apiKey: string) => {
      const MAX_RETRY = 2;
      const isSimpleTest = /Responde\s+solo\s+con\s+\"OK\"/i.test(prompt);
      const makeCall = async (attempt=0): Promise<string> => {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistral-7b-instruct',
          messages: [
            { role: 'system', content: 'Eres un analista senior de marketing de afiliados. Devuelve EXACTAMENTE 3 productos REALES con la plantilla pedida. Cada producto con NOMBRE único. No uses placeholders ni frases de incertidumbre. Idioma: Español.' },
            { role: 'user', content: attempt>0 ? `FORMATO INCORRECTO. Repite EXACTAMENTE usando la plantilla.\n${compactPrompt(prompt)}` : compactPrompt(prompt) }
          ],
          temperature: 0.2,
          top_p: 0.8,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Together.ai error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = (data.text || (data.response as string) || data.generations?.[0]?.text) ?? '';
      if (!isSimpleTest && !isValidProductResponse(content)) {
         if (attempt < MAX_RETRY) {
           return await makeCall(attempt + 1);
         }
         throw new Error('El modelo no generó 3 productos válidos.');
      }
      return content;
      };

      return makeCall();
    },
  },
  cohere: {
    name: 'Cohere (Command-R)',
    keyLink: 'https://dashboard.cohere.com/api-keys',
    request: async (prompt: string, apiKey: string) => {
      const MAX_RETRY = 2;
      const isSimpleTest = /Responde\s+solo\s+con\s+\"OK\"/i.test(prompt);
      const makeCall = async (attempt=0): Promise<string> => {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'command',
          message: attempt>0 ? `FORMATO INCORRECTO. Repite EXACTAMENTE usando la plantilla.\n${compactPrompt(prompt)}` : compactPrompt(prompt),
          temperature: 0.2,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cohere error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = (data.text || (data.response as string) || data.generations?.[0]?.text) ?? '';
      if (!isSimpleTest && !isValidProductResponse(content)) {
         if (attempt < MAX_RETRY) {
            return await makeCall(attempt + 1);
         }
         throw new Error('El modelo no generó 3 productos válidos.');
      }
      return content;
      };

      return makeCall();
    },
  },
};

function initProviderSelector(): void {
  const providerSelect = document.getElementById('apiProvider') as HTMLSelectElement | null;
  const keyLink = document.getElementById('getKeyLink') as HTMLAnchorElement | null;

  if (!providerSelect) return; // UI aún no cargada

  // Restaurar selección previa
  const savedProvider = (localStorage.getItem('aiProvider') || 'gemini') as ProviderId;
  providerSelect.value = savedProvider;
  (window as any).AppState.apiProvider = savedProvider;

  const updateLink = () => {
    const provider = providerSelect.value as ProviderId;
    (window as any).AppState.apiProvider = provider;
    localStorage.setItem('aiProvider', provider);
    if (keyLink) {
      const cfg = PROVIDERS[provider];
      keyLink.href = cfg.keyLink;
      keyLink.textContent = `Obtener API Key (${cfg.name})`;
    }
  };

  providerSelect.addEventListener('change', updateLink);
  updateLink(); // inicial
}

function overrideApiManager(): void {
  const win = window as any;
  if (!win.APIManager) return;
  const originalCallGemini = win.APIManager.callGemini.bind(win.APIManager);

  win.APIManager.callGemini = async (prompt: string) => {
    const provider: ProviderId = win.AppState?.apiProvider || 'gemini';
    if (provider === 'gemini') {
      return originalCallGemini(prompt);
    }

    const cfg = PROVIDERS[provider];
    if (!cfg) throw new Error(`Proveedor no soportado: ${provider}`);

    return await cfg.request(prompt, win.AppState.apiKey);
  };
}

// Inicializar cuando el DOM esté listo (script.js ya se cargó)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProviderSelector();
    overrideApiManager();
    overrideValidation();
  });
} else {
  initProviderSelector();
  overrideApiManager();
  overrideValidation();
}

function overrideValidation(): void {
  const win = window as any;
  if (!win.Utils) return;

  win.Utils.validateApiKey = (key: string) => {
    const provider: ProviderId = win.AppState?.apiProvider || 'gemini';

    if (!key || key.trim().length === 0) {
      return { valid: false, message: 'API Key vacía' };
    }

    // Reglas específicas solo para Gemini; otras pasan con chequeo básico de longitud
    if (provider === 'gemini') {
      if (key.length < 20 || !key.startsWith('AIza')) {
        return { valid: false, message: 'Formato de API Key inválido para Google AI Studio' };
      }
      return { valid: true, message: 'API Key válida' };
    }

    if (key.length < 20) {
      return { valid: false, message: 'API Key muy corta' };
    }

    return { valid: true, message: 'API Key válida' };
  };
}