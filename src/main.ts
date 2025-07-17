import '../styles.css';

// Temporary: import existing legacy script to keep functionality.
import '../script.js';

console.log('MarketInsight Pro (Vite + TS) initialized');

// ------------------ IA Provider Selector & APIManager Override ------------------

type ProviderId = 'gemini' | 'openai' | 'together' | 'cohere';

interface ProviderConfig {
  keyLink: string;
  request: (prompt: string, apiKey: string) => Promise<string>;
}

const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  gemini: {
    keyLink: 'https://aistudio.google.com/app/apikey',
    // no need, Gemini usa la implementación original
    request: async () => {
      throw new Error('Gemini request debe ser manejada por la implementación original');
    },
  },
  openai: {
    keyLink: 'https://platform.openai.com/account/api-keys',
    request: async (prompt: string, apiKey: string) => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    },
  },
  together: {
    keyLink: 'https://app.together.ai/settings/api-keys',
    request: async (prompt: string, apiKey: string) => {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistral-7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Together.ai error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    },
  },
  cohere: {
    keyLink: 'https://dashboard.cohere.com/api-keys',
    request: async (prompt: string, apiKey: string) => {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'command-r',
          message: prompt,
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cohere error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.text || data.generations?.[0]?.text || '';
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
      keyLink.href = PROVIDERS[provider].keyLink;
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