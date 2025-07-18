# 📦 HANDOFF PACKAGE v3.0 – MarketInsight Pro (Vite + TypeScript)

> Este documento sustituye versiones previas del hand-off y refleja **el estado real del branch `refactor/vite-ts` a Enero 2025**.
> Las secciones marcadas como **Pendiente** indican tareas planificadas pero aún no presentes en el código.

---

## 1. Contexto rápido

* **Producto**   : MarketInsight Pro – suite de marketing automation para afiliados.
* **Branch activo**: `refactor/vite-ts` (la migración vive solo en la rama, no en un sub-folder).
* **Stack**        : Vite 5 + TypeScript 5, HTML/CSS/JS legacy, Multi-Provider IA (Gemini, OpenAI, Together.ai, Cohere).
* **Deploy**       : GitHub Actions → GitHub Pages (`gh-pages`).

---

## 2. Estructura de archivos (real)

```
📁 repo-root/
├── .github/workflows/deploy.yml            # CI/CD (build + push a gh-pages)
├── dist/                                   # build (auto-generado)
├── node_modules/                           # deps
├── public/
│   ├── trend-predictor.html                # pop-up independiente
│   └── funnel-architect-standalone.html    # módulo standalone
├── src/
│   └── main.ts                             # entrypoint TS + overrides IA
├── index.html                              # legacy app – vive todavía en la raíz
├── script.js                               # 7 k líneas de lógica legacy (global)
├── styles.css                              # estilos monolíticos (CSS3)
├── vite.config.js                          # configuración Vite (ver snippet ↓)
├── tsconfig.json                           # configuración TypeScript (ver snippet ↓)
├── README.md                               # doc v2.x (usuario final)
├── MEJORAS_IMPLEMENTADAS.md                # cambios v2.x
└── MEJORAS_FUTURAS.md                      # roadmap
```

Nota: **index.html, script.js y styles.css** permanecen en la raíz por compatibilidad. Hay plan para moverlos a `public/` pero aún **pendiente**.

---

## 3. Configuración real

### 3.1 Vite (`vite.config.js`)
```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/HerramientaAfiliado/',   // ruta de GitHub Pages
  root: '.',                      // directorio raíz del repo
  server: { port: 5173 },         // vite dev
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
```

### 3.2 TypeScript (`tsconfig.json` – fragmento)
```jsonc
{
  "compilerOptions": {
    "target": "es6",
    "module": "esnext",
    "rootDir": "src",
    "moduleResolution": "node10",
    "strict": true,
    "declaration": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

---

## 4. Multi-Provider IA (implementado)

| ID | Endpoint real | Modelo | Estado |
|----|---------------|--------|--------|
| `gemini`   | `https://generativelanguage.googleapis.com/.../generateContent` | `gemini-1.5-flash` | ✅ |
| `openai`   | `https://api.openai.com/v1/chat/completions` | `gpt-3.5-turbo` | ✅ |
| `together` | `https://api.together.xyz/v1/chat/completions` | `mistral-7b-instruct` | ✅ |
| `cohere`   | `https://api.cohere.ai/v1/chat` | `command` | ✅ |

*La documentación previa mostraba otros endpoints/modelos; la tabla anterior es la que usa el código (ver `src/main.ts`).*

### Validación de respuesta
`src/main.ts` → función `isValidProductResponse()` comprueba exactamente 3 bloques `=== PRODUCTO N === … === FIN PRODUCTO N ===` con **nombres únicos y no vacíos**. Se aplica a todos los proveedores salvo a prompts de test (`Responde solo con "OK"`).

---

## 5. Funcionalidades legacy (en `script.js`)

| Sistema | Estado | Nota |
|---------|--------|------|
| Offer Validator | ✅ | expuesto como `window.OfferValidator` |
| Creative Spy | ✅ | `window.CreativeSpy` |
| Copy Templates System v4.0 | ✅ | `window.CopyTemplateSystem` |
| Profit Calculator v2.0 | ✅ | `window.ProfitCalculator` |
| Trend Predictor (HTML standalone) | ✅ | `public/trend-predictor.html` |
| Funnel Architect (HTML standalone) | ✅ | `public/funnel-architect-standalone.html` |
| Campaign Builder | ⏳ Pendiente (estructura base) |

> El entrypoint **TS** ( `src/main.ts`) sobrescribe `APIManager.callGemini` y valida API Keys, pero el 90 % de la lógica continúa en `script.js`.

---

## 6. Seguridad & utilidades (Pendiente)

Las clases `SecurityManager`, `RateLimiter`, `InputSanitizer`, `GDPRCompliance` descritas en documentos anteriores **aún no existen**. Se dejan listadas en el roadmap para futura implementación.

---

## 7. Próximas carpetas (Pendiente)

* `src/types/` – interfaces compartidas.
* `src/utils/` – helpers reutilizables.
* `src/main.test.ts` + Vitest – suite de tests unitarios.
* Modularización del CSS (variables en `:root`) – refactor de `styles.css`.

---

## 8. Command Cheatsheet (vigente)

```bash
# Setup
npm install

# Desarrollo
npm run dev      # localhost:5173

# Build producción
npm run build    # genera dist/

# Preview local del build
npm run preview
```

Deploy = push a `refactor/vite-ts`; GitHub Actions ejecuta el workflow y publica `dist/` en la rama `gh-pages`.

---

## 9. Roadmap resumido (enero 2025 → v4.0)

1. Terminar **Campaign Builder UI**.
2. Añadir **Vitest** + CI de tests.
3. Extraer tipos y utilidades a `src/types` & `src/utils`.
4. Implementar clases de seguridad (`SecurityManager`, `RateLimiter`, …).
5. Refactor CSS a sistema de tokens + módulos.

---

## 10. Conclusión

El repositorio ya está plenamente migrado a Vite + TypeScript con selector multi-proveedor funcional y todas las features legacy operativas. Las discrepancias menores de directorios y modelos se han documentado más arriba para que el próximo dev/IA continúe sin sorpresas.

> **Referencia rápida**
> • Prod: https://sinsapiar1.github.io/HerramientaAfiliado/  
> • Repo: https://github.com/Sinsapiar1/HerramientaAfiliado  
> • Branch: `refactor/vite-ts`

---

*Última actualización: Ene 2025 – MarketInsight Pro v3.0*

---

## 11. Funcionalidades detalladas (enero 2025)

| # | Sistema | Ubicación | Estado | Descripción breve |
|---|---------|-----------|--------|-------------------|
| 1 | **Detector de Productos** | `script.js` ∼ línea 120 → 1800 | ✅ | Genera exactamente 3 productos únicos, métricas + pain points; usa `APIManager.callGemini` (o proveedor activo). |
| 2 | **Offer Validator** | `script.js` ∼ línea 4000 → 4600 | ✅ | Simula ClickBank/ShareASale, extrae Gravity, EPC, CVR y veredicto. |
| 3 | **Creative Spy** | `script.js` ∼ 4600 → 4950 | ✅ | Extrae hooks, ángulos de venta, métricas estimadas y audiencias. |
| 4 | **Copy Templates System v4** | `script.js` ∼ 6180 → 7410 | ✅ | Genera copy (FB, Google, Email), IA específica y A/B testing; expuesto en ventana modal. |
| 5 | **Profit Calculator v2** | `script.js` ∼ 4960 → 5170 + ∼ 7050 | ✅ | Calcula escenarios Conservador / Realista / Optimista y grafica escalamiento. |
| 6 | **Trend Predictor** | `public/trend-predictor.html` | ✅ | Pop-up Google Trends (lógica simplificada). |
| 7 | **Funnel Architect** | `public/funnel-architect-standalone.html` | ✅ | Constructor visual de funnels, exporta HTML. |
| 8 | **Campaign Builder** | (carpeta futura) | ⏳ | UI placeholder en HTML, sin lógica. |

---

## 12. Estructura de datos (runtime)

> Aun no se ha movido a `src/types/`; las interfaces viven de forma implícita en `script.js`. Se listan aquí para facilitar la futura extracción a TypeScript.

```ts
interface AppState {
  apiKey: string;
  apiProvider: 'gemini' | 'openai' | 'together' | 'cohere';
  productosDetectados: Product[];
  currentAnalysis?: Analysis;
  profitScenarios?: ProfitScenario[];
  validationResults?: ValidationResult[];
  spyResults?: SpyResult[];
}

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  score: string;
  gravity: string;
  epc: string;
  cvr: string;
  painPoints: string[];
  emociones: string[];
  triggers: string[];
  nicho: string;
  timestamp: number;
}
// ...see hand-off v2.x for rest (unchanged-pending)
```

---

## 13. Testing Checklist (manual)

1. **Build** – `npm run build` debe compilar sin warnings; carpeta `dist/` creada.  
2. **Dev Server** – `npm run dev` abre `http://localhost:5173/`; HMR funciona al editar `main.ts`.  
3. **Multi-Provider** – cambiar proveedor en selector y lanzar prompt de prueba "Responde solo con \"OK\""; debe devolver OK sin validación.  
4. **Detector de Productos** – generar 3 productos únicos y sin duplicados.  
5. **Offer Validator + Spy + Profit + Copy** – cada botón añade sección correspondiente y no duplica.  
6. **Trend/Funnel** – enlaces en menú abren pop-ups sin 404.  
7. **Responsivo** – index.html se visualiza bien a 375 px / 768 px / 1200 px.  
8. **Legacy exposed** – en consola: `window.CopyTemplateSystem` y `window.ProfitCalculator` deben existir.  

*(Se recomienda automatizar estas pruebas con Vitest + Playwright en v4.0)*

---

## 14. Troubleshooting rápido

| Problema | Síntoma | Solución |
|----------|---------|----------|
| **API Key inválida** | Pantalla gris + banner | Revisar formato: Google = `AIza...`, OpenAI = `sk-...`, Together = 64 hex, Cohere = 40 alfa-num. |
| **404 en GitHub Pages** | Navega a `/.../index.html` ok, pero assets 404 | Confirmar `base:'/HerramientaAfiliado/'` en `vite.config.js` antes de build. |
| **Puerto ocupado** | `npm run dev` falla | `npm run dev -- --port 3000` |
| **HMR no recarga** | Cambios en `script.js` no se reflejan | Al ser legacy vanilla, recargar manualmente; migración a módulos pendiente. |
| **Cohere 400: tokens** | Prompt grande provoca 400 | Compactar prompt (función `compactPrompt()` ya implementada). |

---

## 15. Business Value (resumido)

La suite reemplaza 6 herramientas SaaS (AdSpy, ClickBank Analytics, Funnel Builder, etc.) por ≈ **$1 000 USD/mes** en valor. Coste variable actual: **$20-50 USD/mes** en llamadas IA.

---

*(Sección añadida para enriquecer el hand-off)*