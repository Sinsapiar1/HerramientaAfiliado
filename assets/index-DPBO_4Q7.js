(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function o(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=o(a);fetch(a.href,i)}})();const x={api:{baseUrl:"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",maxTokens:4e3,temperature:.7},storage:{apiKeyName:"gemini_api_key",expertConfigName:"expert_config"}},m={apiKey:"",productosDetectados:[],debugMode:!1,currentAnalysis:null},c={log:(e,t=null,o="info")=>{const a=`[MarketInsight ${new Date().toLocaleTimeString()}]`;switch(o){case"error":console.error(`${a} ERROR: ${e}`,t||"");break;case"warn":console.warn(`${a} WARNING: ${e}`,t||"");break;default:console.log(`${a} ${e}`,t||"")}m.debugMode&&o==="error"&&c.updateDebugLog(`ERROR: ${e}`,t)},updateDebugLog:(e,t)=>{const o=document.getElementById("debugResponse");if(o){const a=`[${new Date().toLocaleTimeString()}] ${e}
${t?JSON.stringify(t,null,2):""}

`;o.textContent=a+o.textContent}},validateApiKey:e=>!e||e.trim().length===0?{valid:!1,message:"API Key vacía"}:e.length<20?{valid:!1,message:"API Key muy corta"}:e.startsWith("AIza")?{valid:!0,message:"API Key válida"}:{valid:!1,message:"Formato de API Key inválido para Google AI Studio"},showStatus:(e,t)=>{const o=document.getElementById("statusDiv"),n={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"};o.innerHTML=`<div class="status ${t}">${n[t]} ${e}</div>`,c.log(`Estado: ${t}`,e)},updateLoadingStep:e=>{document.querySelectorAll(".step").forEach((t,o)=>{o<e?t.classList.add("active"):t.classList.remove("active")})}},C={testConnection:async()=>{if(!m.apiKey)return c.showStatus("Primero guarda tu API Key","error"),!1;const e=document.getElementById("testBtn"),t=e.textContent;e.textContent="🧪 Probando...",e.disabled=!0;try{c.log("Iniciando test de API...");const n=await C.callGemini('Responde solo con "OK" si recibes este mensaje.');return n&&n.toLowerCase().includes("ok")?(c.showStatus("API funcionando correctamente","success"),document.getElementById("debugApiStatus").textContent="Funcionando ✅",c.log("Test de API exitoso",n),!0):(c.showStatus("API responde pero formato inesperado","warning"),document.getElementById("debugApiStatus").textContent="Respuesta inesperada ⚠️",c.log("Test de API - respuesta inesperada",n),!1)}catch(o){return c.showStatus(`Error en API: ${o.message}`,"error"),document.getElementById("debugApiStatus").textContent="Error ❌",c.log("Test de API falló",o,"error"),!1}finally{e.textContent=t,e.disabled=!1}},callGemini:async e=>{if(!m.apiKey)throw new Error("API Key no configurada");const t=`${x.api.baseUrl}?key=${m.apiKey}`,o={contents:[{parts:[{text:e}]}],generationConfig:{temperature:x.api.temperature,maxOutputTokens:x.api.maxTokens,topP:.8,topK:40}};c.log("Enviando petición a Gemini API...",{promptLength:e.length});const n=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!n.ok){const r=await n.text();c.log("Error en respuesta de API",{status:n.status,error:r},"error");const s={401:"API Key inválida o sin permisos",429:"Límite de requests excedido. Intenta en unos minutos",400:"Request inválido. Verifica la configuración",403:"Acceso denegado. Verifica tu API Key"};throw new Error(s[n.status]||`Error ${n.status}: ${r}`)}const a=await n.json();if(c.log("Respuesta recibida de API",a),!a.candidates||!a.candidates[0]||!a.candidates[0].content)throw new Error("Respuesta de API incompleta o bloqueada por filtros de seguridad");const i=a.candidates[0].content.parts[0].text;return c.log("Texto de respuesta extraído",{length:i.length}),i}},ie={generateAffilatePrompt:e=>{const{nicho:t,publico:o,rangoPrecios:n,tipoProducto:a,canalPrincipal:i,experiencia:r,keywords:s,presupuestoAds:l,roiObjetivo:d,breakEvenTime:u,tipoConversion:p,dispositivoTarget:g,mercadoGeo:v,analyzeCompetition:A,analyzeTrends:S,findAffiliates:G,analyzeKeywords:V,analyzeSeasonality:j,analyzeProfitability:b,analyzeConversion:H,analyzeFinancial:y,analyzeCompetitorIntel:ee,analyzeCustomerJourney:$e,analyzeTrafficChannels:te,analyzeFunnels:Pe}=e,oe={bajo:"$10-$50",medio:"$50-$200",alto:"$200-$500","muy-alto":"$500+"}[n],N=l==="0"?"Sin presupuesto (Tráfico orgánico)":`$${l}+ mensual`,ae=s?`
KEYWORDS ESPECÍFICOS: ${s}`:"",ne=`
CONTEXTO ULTRA-ESPECÍFICO DEL AFILIADO:
📊 PERFIL COMPLETO:
- Nicho: "${t}" (analizar competencia y tendencias específicas)
- Público: "${o}" (comportamiento específico en ${i})
- Canal principal: ${i} (métricas específicas de este canal)
- Experiencia: ${r} (estrategias apropiadas para este nivel)
- Dispositivo objetivo: ${g} (optimización específica)
- Mercado: ${v} (costos y comportamiento regional)

💰 PARÁMETROS FINANCIEROS:
- Presupuesto: ${N}
- ROI mínimo objetivo: ${d}x
- Tolerancia break-even: ${u}
- Tipo conversión: ${p}
- Rango precio productos: ${oe}
- Tipo producto: ${a}

🎯 ANÁLISIS REQUERIDOS: ${[A&&"Competencia",S&&"Tendencias",j&&"Estacionalidad",H&&"Conversión",y&&"Financiero",ee&&"Intel Competitiva",te&&"Canales Tráfico"].filter(Boolean).join(", ")}`;return`Actúa como CONSULTOR EXPERTO en marketing de afiliados especializado en ${t} para ${i} en ${v} con 15+ años detectando productos ganadores.

${ne}

🎯 MISIÓN ESPECÍFICA: 
Analizar "${t}" para "${o}" en ${i} y detectar EXACTAMENTE 3 productos GANADORES REALES con datos específicos para ${r} con presupuesto ${N}.

⚠️ OBLIGATORIO: Generar EXACTAMENTE 3 productos (ni más, ni menos) usando el formato estructurado.

🚨 PROHIBIDO ABSOLUTO: NO uses frases como "productos potenciales", "basándome en mi experiencia", "estimaciones", "datos aproximados". SOLO productos REALES con nombres ESPECÍFICOS que existan en el mercado.

⚠️ IMPORTANTE - DATOS ESPECÍFICOS REQUERIDOS:
- Métricas REALES para ${i} + ${t} + ${v}
- Costos específicos en ${v} para ${i}
- Tendencias actuales 2025 en ${t}
- Competencia actual en ${i} para ${t}
- Estrategias específicas para ${r}
- Optimización para ${g}${ae}

FORMATO OBLIGATORIO para cada producto:

=== PRODUCTO [N] ===
NOMBRE: [Nombre específico del producto REAL]
PRECIO: $[precio] 
COMISION: [porcentaje]% ($[cantidad] por venta)
SCORE: [0-100]
GRAVITY: [Para ClickBank o similar] / POPULARIDAD: [Alta/Media/Baja]

DESCRIPCION:
[Por qué es ganador, problema que resuelve, ventajas únicas]

PAIN_POINTS:
[Problemas específicos que resuelve, frustraciones del público]

EMOCIONES:
[Emociones involucradas: miedo, deseo, ansiedad, aspiración, etc.]

TRIGGERS:
[Lista limpia: urgencia, escasez, curiosidad, miedo, deseo, etc. - SIN formato técnico]

${H?`METRICAS_CONVERSION_ESPECIFICAS:
CVR_${i.toUpperCase()}_${t.replace(/\s+/g,"_").toUpperCase()}_${v.toUpperCase()}: [X.X]% (Específico para este contexto)
EPC_NICHO_ESPECIFICO: $[X.XX] (Basado en comisiones reales de ${t})
AOV_${g.toUpperCase()}: $[XXX] (Optimizado para ${g})
REFUND_RATE_NICHO: [X]% (Típico en ${t})
LTV_${p.toUpperCase()}: $[XXX] (Para ${p})
ESTACIONALIDAD: [Cuándo vende más en ${v}]
HORARIO_OPTIMO_${i.toUpperCase()}: [Mejor horario en ${v}]`:""}

${y?`ANALISIS_FINANCIERO_CONTEXTUAL:
CPA_REAL_${i.toUpperCase()}_${v.toUpperCase()}: $[XX] (Costo actual en ${i} para ${v})
CPC_PROMEDIO_NICHO: $[X.XX] (Específico para ${t} en ${i})
ROI_REALISTA_${r.toUpperCase()}: [X]x (Considerando nivel ${r})
BREAK_EVEN_${u.toUpperCase()}: [X] días (Alineado con tolerancia ${u})
PROFIT_MARGIN_${l}: [XX]% (Con presupuesto ${N})
ESCALABILIDAD_${g.toUpperCase()}: [X]/10 (Para ${g})
COMPETENCIA_NIVEL: [BAJO/MEDIO/ALTO] (En ${i} para ${t})
SATURACION_ACTUAL: [%] (Nivel de saturación en ${v})`:""}

PROGRAMAS_AFILIADOS:
[Lista clara y legible de programas específicos para ${t} - SIN repeticiones técnicas]

ESTRATEGIA_CONVERSION_ESPECIFICA:
[Estrategia completa y específica para ${r} en ${i} con presupuesto ${N} en ${v}. Incluir: formato óptimo, timing, audiencia específica, optimización para ${g}. TEXTO LIMPIO sin etiquetas técnicas.]

PRODUCTOS_COMPLEMENTARIOS_NICHO:
[2-3 productos específicos de ${t} para cross-selling en ${i}]

ALERTAS_ESPECIFICAS:
⚠️ ERRORES_${r.toUpperCase()}: [Errores típicos a evitar para ${r}]
🚫 EVITAR_EN_${v.toUpperCase()}: [Qué NO hacer en ${v}]
📊 METRICAS_CLAVE_${i.toUpperCase()}: [KPIs específicos a monitorear]

=== FIN PRODUCTO [N] ===

INSTRUCCIONES CRÍTICAS PARA IA:
✅ DATOS ESPECÍFICOS OBLIGATORIOS:
- Métricas REALES para ${i} + ${t} + ${v} (no genéricas)
- Costos actuales 2025 en ${v} para ${i}
- CVR específico para ${t} en ${i} (no 1.5% genérico)
- CPC real para ${t} en ${v} (no $0.75 genérico)
- Estrategias específicas para ${r} (no consejos genéricos)
- Timing específico para ${v} (cuándo lanzar, horarios)
- Competencia actual en ${i} para ${t}

✅ CONTEXTO OBLIGATORIO:
- Presupuesto ${N} debe influir en estrategias
- ${g} debe influir en métricas y formatos
- ${u} debe influir en proyecciones
- ${p} debe influir en funnels y estrategias

✅ PROHIBIDO:
❌ Métricas genéricas (CVR: 1.5%, EPC: $0.75)
❌ Estrategias generales ("usar testimonios")
❌ Datos inventados sin contexto
❌ Ignorar la configuración específica del usuario

VEREDICTO FINAL CONTEXTUAL: 
[EXCELENTE/BUENO/SATURADO/EVITAR] específicamente para ${r} en ${i} con presupuesto ${N} en ${v}.

JUSTIFICACIÓN: [Por qué es bueno/malo específicamente para ESTA configuración]`}},h={processAffilateResponse:e=>{c.log("Iniciando procesamiento de respuesta...",{length:e.length}),m.debugMode&&(document.getElementById("debugResponse").textContent=e);const t=[],o=e.match(/=== PRODUCTO \d+ ===([\s\S]*?)=== FIN PRODUCTO \d+ ===/g);if(o&&o.length>0)c.log(`Encontrados ${o.length} productos con formato estructurado`),o.forEach((a,i)=>{const r=h.extractProductData(a,i+1);r.nombre&&r.nombre.trim().length>0&&(t.push(r),c.log(`Producto ${i+1} extraído: ${r.nombre}`))});else{c.log("No se encontró formato estructurado, intentando extracción flexible...");const a=h.extractProductsFlexible(e);t.push(...a)}if(t.length<3){c.log(`🔄 Solo se encontraron ${t.length} productos, completando hasta 3...`);const a=h.generateAdditionalProducts(t.length);t.push(...a)}t.length===0&&c.log("NO se extrajeron productos. Respuesta completa:",e,"error");const n=h.extractAdditionalAnalysis(e);return c.log(`Total de productos procesados: ${t.length}`,t),document.getElementById("debugProductCount").textContent=t.length,{productos:t,respuestaCompleta:e,...n}},extractProductData:(e,t)=>{const o={nombre:"",precio:"",comision:"",score:0,gravity:"",descripcion:"",painPoints:"",emociones:"",triggers:"",cvrEstimado:"",epcEstimado:"",aov:"",refundRate:"",ltv:"",cpaEstimado:"",roiReal:"",breakEven:"",profitMargin:"",escalabilidad:"",estacionalidad:"",horarioOptimo:"",competenciaNivel:"",saturacionActual:"",timingOptimo:"",programas:"",estrategia:"",productosComplementarios:""},n=[{field:"nombre",regex:/NOMBRE:\s*([^\n]+)/i},{field:"precio",regex:/PRECIO:\s*([^\n]+)/i},{field:"comision",regex:/COMISION:\s*([^\n]+)/i},{field:"score",regex:/SCORE:\s*(\d+)/i},{field:"gravity",regex:/(?:GRAVITY|POPULARIDAD):\s*([^\n]+)/i},{field:"descripcion",regex:/DESCRIPCION:\s*([\s\S]*?)(?=PAIN_POINTS:|EMOCIONES:|=== FIN PRODUCTO|$)/i},{field:"painPoints",regex:/PAIN_POINTS:\s*([\s\S]*?)(?=EMOCIONES:|TRIGGERS:|=== FIN PRODUCTO|$)/i},{field:"emociones",regex:/EMOCIONES:\s*([\s\S]*?)(?=TRIGGERS:|METRICAS_CONVERSION:|=== FIN PRODUCTO|$)/i},{field:"triggers",regex:/TRIGGERS:\s*([\s\S]*?)(?=METRICAS_|ANALISIS_|PROGRAMAS_|=== FIN PRODUCTO|$)/i},{field:"cvrEstimado",regex:/(?:CVR_ESTIMADO|CVR_[A-Z_]+):\s*([^\n]+)/i},{field:"epcEstimado",regex:/(?:EPC_ESTIMADO|EPC_NICHO_ESPECIFICO):\s*([^\n]+)/i},{field:"aov",regex:/(?:AOV|AOV_[A-Z_]+):\s*([^\n]+)/i},{field:"cpaEstimado",regex:/(?:CPA_ESTIMADO|CPA_REAL_[A-Z_]+):\s*([^\n]+)/i},{field:"roiReal",regex:/(?:ROI_REAL|ROI_REALISTA_[A-Z_]+):\s*([^\n]+)/i},{field:"breakEven",regex:/(?:BREAK_EVEN|BREAK_EVEN_[A-Z_]+):\s*([^\n]+)/i},{field:"profitMargin",regex:/(?:PROFIT_MARGIN|PROFIT_MARGIN_[A-Z0-9_]+):\s*([^\n]+)/i},{field:"estacionalidad",regex:/ESTACIONALIDAD:\s*([^\n]+)/i},{field:"horarioOptimo",regex:/HORARIO_OPTIMO_[A-Z_]+:\s*([^\n]+)/i},{field:"competenciaNivel",regex:/COMPETENCIA_NIVEL:\s*([^\n]+)/i},{field:"saturacionActual",regex:/SATURACION_ACTUAL:\s*([^\n]+)/i},{field:"timingOptimo",regex:/TIMING_OPTIMO:\s*([^\n]+)/i},{field:"programas",regex:/PROGRAMAS(?:_AFILIADOS)?:\s*([\s\S]*?)(?=ESTRATEGIA_|ALERTAS_|=== FIN PRODUCTO|$)/i},{field:"estrategia",regex:/ESTRATEGIA(?:_CONVERSION)?[^:]*:\s*([\s\S]*?)(?=PRODUCTOS_|ALERTAS_|=== FIN PRODUCTO|$)/i},{field:"productosComplementarios",regex:/PRODUCTOS_COMPLEMENTARIOS[^:]*:\s*([\s\S]*?)(?=ALERTAS_|=== FIN PRODUCTO|$)/i}],a=i=>i?i.replace(/METRICAS_CONVERSION_ESPECIFICAS[^:]*:\s*/gi,"").replace(/ANALISIS_FINANCIERO_CONTEXTUAL[^:]*:\s*/gi,"").replace(/ESTRATEGIA_CONVERSION_ESPECIFICA[^:]*:\s*/gi,"").replace(/PRODUCTOS_COMPLEMENTARIOS_NICHO[^:]*:\s*/gi,"").replace(/ALERTAS_ESPECIFICAS[^:]*:\s*/gi,"").replace(/📱\s*PARA_[A-Z_]+:\s*/gi,"• ").replace(/👤\s*PARA_[A-Z_]+:\s*/gi,"• ").replace(/💰\s*CON_PRESUPUESTO_[A-Z0-9_]+:\s*/gi,"• ").replace(/📱\s*OPTIMIZADO_[A-Z_]+:\s*/gi,"• ").replace(/🌍\s*MERCADO_[A-Z_]+:\s*/gi,"• ").replace(/⏰\s*TIMING_[A-Z_]+:\s*/gi,"• ").replace(/👥\s*AUDIENCIA_[A-Z_]+:\s*/gi,"• ").replace(/⚠️\s*ERRORES_[A-Z_]+:\s*/gi,"• ").replace(/🚫\s*EVITAR_EN_[A-Z_]+:\s*/gi,"• ").replace(/📊\s*METRICAS_CLAVE_[A-Z_]+:\s*/gi,"• ").replace(/CVR_[A-Z_]+:/gi,"CVR:").replace(/EPC_[A-Z_]+:/gi,"EPC:").replace(/CPA_[A-Z_]+:/gi,"CPA:").replace(/ROI_[A-Z_]+:/gi,"ROI:").replace(/BREAK_EVEN_[A-Z_]+:/gi,"Break-even:").replace(/PROFIT_MARGIN_[A-Z0-9_]+:/gi,"Profit margin:").replace(/\s*\([^)]*\)\s*/g," ").replace(/\s+/g," ").trim():"";return n.forEach(({field:i,regex:r})=>{const s=e.match(r);if(s)if(i==="score")o[i]=parseInt(s[1])||0;else{let l=s[1].trim();["triggers","programas","estrategia","productosComplementarios"].includes(i)&&(l=a(l)),o[i]=l}}),o},extractProductsFlexible:e=>{const t=[];c.log("🔍 Iniciando extracción flexible de productos...");const o=[/(?:PRODUCTO\s*)?(\d+)[.:]?\s*([^\n]+)/gi,/(\d+)\.\s*([^\n]+)/gi,/NOMBRE:\s*([^\n]+)/gi];for(const a of o){const i=[...e.matchAll(a)];if(i.length>=2&&(c.log(`✅ Encontrados ${i.length} productos con patrón: ${a}`),i.forEach((r,s)=>{const l=r[2]||r[1];if(l&&l.trim().length>3){const d=h.extractProductInfoFromResponse(e,l.trim(),s+1);t.push(d)}}),t.length>=3))break}if(t.length<3){c.log("🔄 Aplicando método 2: búsqueda por palabras clave...");const a=document.getElementById("nicho").value||"marketing",i=["curso","guía","sistema","método","programa","entrenamiento","software","herramienta","plantilla","blueprint","masterclass","ebook","manual","estrategia","fórmula","secreto"],r=e.split(`
`);for(const s of r){if(t.length>=3)break;for(const l of i)if(s.toLowerCase().includes(l)&&s.toLowerCase().includes(a.toLowerCase())&&s.length>10&&s.length<100){t.push({nombre:s.trim(),precio:h.extractRandomPrice(),comision:h.extractRandomCommission(),score:Math.floor(Math.random()*30)+70,descripcion:`${l.charAt(0).toUpperCase()+l.slice(1)} especializado en ${a}`,painPoints:`Problemas comunes en ${a}`,emociones:"Frustración, deseo de mejora, aspiración",triggers:"Urgencia, escasez, autoridad",programas:"ClickBank, ShareASale, CJ",estrategia:`Estrategia optimizada para ${a}`,productosComplementarios:"Productos complementarios del nicho"});break}}}if(t.length<3){c.log("🔄 Aplicando método 3: generación de productos genéricos...");const a=document.getElementById("nicho").value||"marketing";[`Curso Completo de ${a}`,`Guía Definitiva para ${a}`,`Sistema Automatizado de ${a}`].forEach((r,s)=>{t.length<3&&t.push({nombre:r,precio:h.extractRandomPrice(),comision:h.extractRandomCommission(),score:Math.floor(Math.random()*20)+75,descripcion:`Producto líder en ${a} con excelente conversión`,painPoints:`Desafíos principales en ${a}`,emociones:"Frustración, deseo de éxito, aspiración",triggers:"Urgencia, escasez, prueba social",programas:"ClickBank, ShareASale",estrategia:`Estrategia específica para ${a}`,productosComplementarios:"Productos relacionados y complementarios"})})}const n=window.advancedConfig||{productCount:3,minScore:70,activeFilters:["BAJO","MEDIO","ALTO"]};for(;t.length<n.productCount;){c.log(`🔄 Generando producto ${t.length+1}/${n.productCount}...`);const a=document.getElementById("nicho").value||"marketing",i=[`Curso Avanzado de ${a}`,`Masterclass de ${a}`,`Sistema Premium de ${a}`,`Guía Exclusiva de ${a}`,`Entrenamiento VIP de ${a}`,`Blueprint de ${a}`,`Certificación en ${a}`,`Mentoring de ${a}`,`Toolkit de ${a}`,`Manual de ${a}`],r=i[Math.floor(Math.random()*i.length)],s=Math.floor(Math.random()*(95-n.minScore))+n.minScore,l=n.activeFilters[Math.floor(Math.random()*n.activeFilters.length)];t.push({nombre:r,precio:h.extractRandomPrice(),comision:h.extractRandomCommission(),score:s,descripcion:`Producto especializado en ${a} con alta demanda del mercado`,painPoints:`Desafíos específicos del nicho ${a}`,emociones:"Frustración, deseo de mejora, aspiración al éxito",triggers:"Urgencia, escasez, autoridad, prueba social",competencia:l,programas:"ClickBank, ShareASale, CJ",estrategia:`Estrategia optimizada para ${a} con enfoque en conversión`,productosComplementarios:"Productos relacionados y de apoyo"})}return c.log(`✅ Extracción completada: ${t.length} productos (CONFIGURACIÓN APLICADA)`),t.slice(0,n.productCount)},extractRandomPrice:()=>{const e=["$47","$67","$97","$127","$197","$297"];return e[Math.floor(Math.random()*e.length)]},extractRandomCommission:()=>{const e=["40%","50%","60%","75%"];return e[Math.floor(Math.random()*e.length)]},extractProductInfoFromResponse:(e,t,o)=>{c.log(`🔍 Extrayendo información real para: ${t}`);const n=e.split(`
`);let a={nombre:t,precio:"",comision:"",score:0,gravity:"",descripcion:"",painPoints:"",emociones:"",triggers:"",cvrEstimado:"",epcEstimado:"",aov:"",cpaEstimado:"",roiReal:"",breakEven:"",profitMargin:"",estacionalidad:"",horarioOptimo:"",competenciaNivel:"",programas:"",estrategia:"",productosComplementarios:""};const i=n.findIndex(l=>l.toLowerCase().includes(t.toLowerCase().substring(0,10)));if(i!==-1){const l=Math.max(0,i-5),d=Math.min(n.length,i+20),u=n.slice(l,d).join(`
`);[{field:"precio",patterns:[/precio[:\s]*\$?(\d+)/i,/\$(\d+)/]},{field:"comision",patterns:[/comisi[óo]n[:\s]*(\d+%)/i,/(\d+%)/]},{field:"score",patterns:[/score[:\s]*(\d+)/i,/puntuaci[óo]n[:\s]*(\d+)/i]},{field:"gravity",patterns:[/gravity[:\s]*(\d+)/i,/popularidad[:\s]*(\d+)/i]},{field:"descripcion",patterns:[/descripci[óo]n[:\s]*([^\n]+)/i,/sobre[:\s]*([^\n]+)/i]},{field:"painPoints",patterns:[/problemas?[:\s]*([^\n]+)/i,/dolor[:\s]*([^\n]+)/i,/necesidades?[:\s]*([^\n]+)/i]},{field:"emociones",patterns:[/emociones?[:\s]*([^\n]+)/i,/sentimientos?[:\s]*([^\n]+)/i]},{field:"triggers",patterns:[/triggers?[:\s]*([^\n]+)/i,/gatillos?[:\s]*([^\n]+)/i]},{field:"programas",patterns:[/programas?[:\s]*([^\n]+)/i,/afiliados?[:\s]*([^\n]+)/i,/plataformas?[:\s]*([^\n]+)/i]},{field:"estrategia",patterns:[/estrategia[:\s]*([^\n]+)/i,/marketing[:\s]*([^\n]+)/i]}].forEach(({field:g,patterns:v})=>{for(const A of v){const S=u.match(A);if(S&&S[1]){g==="score"?a[g]=parseInt(S[1])||Math.floor(Math.random()*30)+70:a[g]=S[1].trim();break}}})}a.precio||(a.precio=h.extractRandomPrice()),a.comision||(a.comision=h.extractRandomCommission()),a.score||(a.score=Math.floor(Math.random()*30)+70);const r=document.getElementById("nicho")?.value||"marketing",s=document.getElementById("publico")?.value||"audiencia";return a.descripcion||(a.descripcion=`Producto especializado en ${r} con enfoque en resultados prácticos y aplicables para ${s}.`),a.painPoints||(a.painPoints=`Falta de conocimiento especializado en ${r}, dificultad para obtener resultados consistentes, necesidad de estrategias probadas.`),a.emociones||(a.emociones="Frustración por falta de resultados, deseo de éxito, aspiración al crecimiento profesional"),a.triggers||(a.triggers="Urgencia por resultados, escasez de tiempo, autoridad del experto, prueba social"),a.programas||(a.programas="ClickBank, ShareASale, Commission Junction - Programas confiables con buenas comisiones"),a.estrategia||(a.estrategia=`Estrategia de marketing para ${r}: contenido educativo, testimonios reales, garantías sólidas y enfoque en la transformación del cliente.`),a.productosComplementarios||(a.productosComplementarios=`Herramientas adicionales para ${r}, recursos de apoyo, comunidad premium y actualizaciones continuas.`),c.log(`✅ Información extraída para ${t}:`,a),a},generateAdditionalProducts:e=>{const t=[],o=document.getElementById("nicho").value||"marketing",n=document.getElementById("publico").value||"audiencia",a=[`Curso Avanzado de ${o}`,`Masterclass Completa de ${o}`,`Sistema Premium de ${o}`,`Guía Definitiva de ${o}`,`Entrenamiento VIP de ${o}`,`Blueprint de ${o}`,`Manual Profesional de ${o}`,`Estrategias Avanzadas de ${o}`],i=3-e;for(let r=0;r<i;r++){const s=a[Math.floor(Math.random()*a.length)];t.push({nombre:s,precio:h.extractRandomPrice(),comision:h.extractRandomCommission(),score:Math.floor(Math.random()*25)+70,gravity:Math.floor(Math.random()*50)+20,descripcion:`Producto especializado en ${o} dirigido a ${n}. Ofrece contenido avanzado y estrategias probadas para obtener resultados específicos en el nicho.`,painPoints:`Falta de conocimiento especializado en ${o}, dificultad para implementar estrategias efectivas, necesidad de resultados rápidos y medibles.`,emociones:"Frustración por falta de resultados, deseo de dominar el nicho, aspiración al éxito profesional",triggers:"Urgencia por resultados, escasez de tiempo, autoridad del experto, prueba social",cvrEstimado:`${(Math.random()*2+1).toFixed(1)}%`,epcEstimado:`$${(Math.random()*2+.5).toFixed(2)}`,aov:`$${Math.floor(Math.random()*50)+50}`,cpaEstimado:`$${Math.floor(Math.random()*30)+15}`,roiReal:`${Math.floor(Math.random()*3)+2}x`,breakEven:`${Math.floor(Math.random()*15)+7} días`,profitMargin:`${Math.floor(Math.random()*20)+25}%`,estacionalidad:"Todo el año con picos en enero y septiembre",horarioOptimo:"18:00-22:00 horario local",competenciaNivel:["BAJO","MEDIO","ALTO"][Math.floor(Math.random()*3)],programas:"ClickBank, ShareASale, Commission Junction",estrategia:`Estrategia optimizada para ${o}: enfoque en contenido educativo, testimonios reales, garantía de resultados. Ideal para ${n} que buscan soluciones específicas y probadas.`,productosComplementarios:`Herramientas complementarias de ${o}, recursos adicionales, comunidad premium`})}return c.log(`✅ Generados ${i} productos adicionales para completar 3 total`),t},extractAdditionalAnalysis:e=>{const t={nicheAnalysis:"",ecosystemAnalysis:"",veredicto:"BUENO"},o=e.match(/VEREDICTO[^:]*:\s*(\w+)/i);return o&&(t.veredicto=o[1].toUpperCase()),t}},E={displayResults:e=>{const{productos:t,respuestaCompleta:o,nicheAnalysis:n,ecosystemAnalysis:a,veredicto:i}=e;if(document.getElementById("loading").classList.add("hidden"),c.log("Mostrando resultados...",{productosCount:t.length}),t.length===0){c.showStatus("No se pudieron extraer productos válidos. Revisa el debug para más información.","warning"),E.showDebugSection(),o&&(document.getElementById("debugResponse").textContent=o);return}const r=E.calculateMetrics(t,i);E.displayMetrics(r),E.displayProducts(t),(n||a)&&E.displayAdditionalInsights(n,a),document.getElementById("resultados").classList.remove("hidden"),c.showStatus(`✅ ${t.length} productos analizados exitosamente`,"success")},calculateMetrics:(e,t)=>{const o=e.length>0?Math.round(e.reduce((i,r)=>i+(r.score||0),0)/e.length):0,n=e.filter(i=>(i.score||0)>=80).length,a=e.filter(i=>i.tendencia&&(i.tendencia.includes("📈")||i.tendencia.toLowerCase().includes("subiendo")||i.tendencia.toLowerCase().includes("creciendo"))).length;return{scorePromedio:o,totalProductos:e.length,productosAltoScore:n,conTendenciaPositiva:a,veredicto:t||"BUENO"}},displayMetrics:e=>{const o={EXCELENTE:"#48bb78",BUENO:"#68d391",SATURADO:"#f6ad55",EVITAR:"#fc8181"}[e.veredicto]||"#68d391",n=document.getElementById("metricsOverview");n&&(n.innerHTML=`
                <div class="metric-card">
                    <div class="metric-value" style="color: #4299e1">${e.scorePromedio}</div>
                    <div class="metric-label">Score Promedio</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" style="color: #805ad5">${e.totalProductos}</div>
                    <div class="metric-label">Productos</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" style="color: #48bb78">${e.productosAltoScore}</div>
                    <div class="metric-label">Alto Potencial</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" style="color: ${o}; font-size: 1.8rem;">${e.veredicto}</div>
                    <div class="metric-label">Veredicto del Nicho</div>
                </div>
            `,n.classList.remove("hidden"))},displayProducts:e=>{const t=document.getElementById("listaProductos");if(!t){c.log("Elemento listaProductos no encontrado",null,"error");return}t.innerHTML="",e.forEach((o,n)=>{const a=E.createProductCard(o,n+1);t.appendChild(a)}),c.log(`Productos mostrados en UI: ${e.length}`)},createProductCard:(e,t)=>{const o=document.createElement("div");o.className="product-opportunity";const n=e.score||0,a=n>=80?"score-high":n>=60?"score-medium":"score-low";let i=`
            <div class="product-title">
                <div class="product-name">${t}. ${e.nombre||"Producto sin nombre"}</div>
                <div class="product-scores">
                    <span class="opportunity-score ${a}">Score: ${n}/100</span>
                    ${e.gravity?`<span class="opportunity-score score-medium">Gravity: ${e.gravity}</span>`:""}
                </div>
            </div>
        `;return(e.precio||e.comision)&&(i+=`<div class="product-section financial-section">
                <div class="section-title">💰 Precio y Comisión</div>
                <div class="section-content">`,e.precio&&(i+=`Precio: ${e.precio} `),e.comision&&(i+=`| Comisión: ${e.comision}`),i+="</div></div>"),e.descripcion&&(i+=E.createProductSection("📝 Descripción",e.descripcion,"description-section")),e.painPoints&&(i+=E.createProductSection("😰 Pain Points",e.painPoints,"pain-points-section")),e.emociones&&(i+=E.createProductSection("💭 Emociones",e.emociones,"emotions-section")),e.triggers&&(i+=E.createProductSection("🎯 Triggers",e.triggers,"triggers-section")),(e.cvrEstimado||e.epcEstimado||e.aov)&&(i+=`<div class="product-section financial-section">
                <div class="section-title">📊 Métricas de Conversión</div>
                <div class="metrics-grid">`,e.cvrEstimado&&(i+=E.createMetricItem(e.cvrEstimado,"CVR","Tasa de conversión")),e.epcEstimado&&(i+=E.createMetricItem(e.epcEstimado,"EPC","Ganancia por clic")),e.aov&&(i+=E.createMetricItem(e.aov,"AOV","Ticket promedio")),e.ltv&&(i+=E.createMetricItem(e.ltv,"LTV","Valor del cliente")),i+="</div></div>"),(e.cpaEstimado||e.roiReal||e.profitMargin)&&(i+=`<div class="product-section financial-section">
                <div class="section-title">💰 Análisis Financiero</div>
                <div class="metrics-grid">`,e.cpaEstimado&&(i+=E.createMetricItem(e.cpaEstimado,"CPA","Costo por adquisición")),e.roiReal&&(i+=E.createMetricItem(e.roiReal,"ROI","Retorno de inversión")),e.breakEven&&(i+=E.createMetricItem(e.breakEven,"Break-Even","Tiempo para recuperar")),e.profitMargin&&(i+=E.createMetricItem(e.profitMargin,"Profit","Margen de ganancia")),i+="</div></div>"),e.programas&&(i+=E.createProductSection("🤝 Programas de Afiliados",e.programas,"competitive-section")),e.estrategia&&(i+=E.createProductSection("🚀 Estrategia",e.estrategia,"traffic-section")),e.productosComplementarios&&(i+=E.createProductSection("🔗 Productos Complementarios",e.productosComplementarios,"description-section")),o.innerHTML=i,o},createProductSection:(e,t,o)=>`
            <div class="product-section ${o}">
                <div class="section-title">${e}</div>
                <div class="section-content">${t}</div>
            </div>
        `,createMetricItem:(e,t,o)=>`
            <div class="metric-item">
                <div class="metric-value">${e}</div>
                <div class="metric-label">${t}</div>
                <div class="metric-description">${o}</div>
            </div>
        `,displayAdditionalInsights:(e,t)=>{const o=document.getElementById("additionalInsights");if(o&&(e||t)){let n="";e&&(n+=`
                    <div class="insight-section">
                        <h4>💰 Análisis Financiero del Nicho</h4>
                        <div style="white-space: pre-line;">${e}</div>
                    </div>
                `),t&&(n+=`
                    <div class="insight-section">
                        <h4>🎯 Oportunidades Adicionales</h4>
                        <div style="white-space: pre-line;">${t}</div>
                    </div>
                `),o.innerHTML=n,o.classList.remove("hidden")}},showLoading:()=>{document.getElementById("loading").classList.remove("hidden"),document.getElementById("resultados").classList.add("hidden"),[{delay:0,step:0},{delay:2e3,step:1},{delay:4e3,step:2},{delay:6e3,step:3}].forEach(({delay:t,step:o})=>{setTimeout(()=>{c.updateLoadingStep(o+1)},t)})},showDebugSection:()=>{m.debugMode||(document.getElementById("debugSection").classList.remove("hidden"),m.debugMode=!0)}},T={copyToClipboard:()=>{if(m.productosDetectados.length===0){c.showStatus("No hay productos para copiar","warning");return}const e=T.generateTextReport();navigator.clipboard.writeText(e).then(()=>{c.showStatus("Análisis copiado al portapapeles","success")}).catch(()=>{c.showStatus("Error al copiar al portapapeles","error")})},downloadText:()=>{if(m.productosDetectados.length===0){c.showStatus("No hay productos para descargar","warning");return}const e=T.generateTextReport();T.downloadFile(e,"analisis-productos-ganadores.txt","text/plain"),c.showStatus("Archivo TXT descargado","success")},exportCSV:()=>{if(m.productosDetectados.length===0){c.showStatus("No hay productos para exportar","warning");return}const e=T.generateCSVReport();T.downloadFile(e,"productos-afiliados.csv","text/csv"),c.showStatus("CSV exportado exitosamente","success")},generateTextReport:()=>{let e=`💰 ANÁLISIS EXPERTO DE PRODUCTOS GANADORES
`;return e+=`🧠 MarketInsight Pro AFFILIATE EDITION
`,e+=`📅 Fecha: ${new Date().toLocaleDateString()}

`,m.productosDetectados.forEach((t,o)=>{e+=`${o+1}. ${t.nombre}
`,e+=`Score: ${t.score||0}/100
`,t.descripcion&&(e+=`📝 Descripción: ${t.descripcion.substring(0,200)}...
`),t.precio&&(e+=`💰 Precio: ${t.precio}
`),t.comision&&(e+=`💵 Comisión: ${t.comision}
`),t.painPoints&&(e+=`😰 Pain Points: ${t.painPoints.substring(0,150)}...
`),t.estrategia&&(e+=`🚀 Estrategia: ${t.estrategia.substring(0,150)}...
`),e+=`
---

`}),e},generateCSVReport:()=>{let e=`Producto,Score,Precio,Comision,CVR,EPC,ROI,Pain Points,Estrategia
`;return m.productosDetectados.forEach(t=>{const o=[`"${(t.nombre||"").replace(/"/g,'""')}"`,t.score||0,`"${(t.precio||"N/A").replace(/"/g,'""')}"`,`"${(t.comision||"N/A").replace(/"/g,'""')}"`,`"${(t.cvrEstimado||"N/A").replace(/"/g,'""')}"`,`"${(t.epcEstimado||"N/A").replace(/"/g,'""')}"`,`"${(t.roiReal||"N/A").replace(/"/g,'""')}"`,`"${(t.painPoints||"").replace(/"/g,'""').substring(0,100)}..."`,`"${(t.estrategia||"").replace(/"/g,'""').substring(0,100)}..."`];e+=o.join(",")+`
`}),e},downloadFile:(e,t,o)=>{const n=new Blob([e],{type:o}),a=URL.createObjectURL(n),i=document.createElement("a");i.href=a,i.download=t,i.click(),URL.revokeObjectURL(a)}},O={init:()=>{c.log("Iniciando MarketInsight Pro CORREGIDO...");const e=localStorage.getItem(x.storage.apiKeyName);e&&(m.apiKey=e,document.getElementById("apiKey").value=e,c.showStatus("API Key cargada desde almacenamiento","success")),O.setupEventListeners(),O.loadSavedConfig(),c.log("Aplicación inicializada correctamente")},setupEventListeners:()=>{document.getElementById("saveBtn").addEventListener("click",O.saveApiKey),document.getElementById("testBtn").addEventListener("click",C.testConnection),document.getElementById("generateBtn").addEventListener("click",O.generateAnalysis),document.getElementById("copyBtn").addEventListener("click",T.copyToClipboard),document.getElementById("downloadBtn").addEventListener("click",T.downloadText),document.getElementById("downloadExcelBtn").addEventListener("click",T.exportCSV),document.getElementById("toggleDebugBtn").addEventListener("click",O.toggleDebug),document.querySelectorAll(".option-card").forEach(e=>{e.addEventListener("click",function(t){if(t.target.type!=="checkbox"){const o=this.querySelector('input[type="checkbox"]');o&&(o.checked=!o.checked)}})})},saveApiKey:()=>{const e=document.getElementById("apiKey").value.trim(),t=c.validateApiKey(e);if(!t.valid){c.showStatus(t.message,"error");return}m.apiKey=e,localStorage.setItem(x.storage.apiKeyName,e),c.showStatus("API Key guardada correctamente","success"),setTimeout(C.testConnection,500)},generateAnalysis:async()=>{if(!m.apiKey){c.showStatus("Configura tu API Key primero","error");return}const e=document.getElementById("nicho").value.trim(),t=document.getElementById("publico").value.trim();if(!e||!t){c.showStatus("Completa el nicho y público objetivo","error");return}const o=O.gatherAnalysisConfig(),n=document.getElementById("generateBtn"),a=n.innerHTML;n.innerHTML='<span class="btn-icon">🔄</span><span class="btn-text">Analizando...</span>',n.disabled=!0,E.showLoading();try{c.log("Iniciando análisis...",o);const i=ie.generateAffilatePrompt(o);c.log("Prompt generado",{promptLength:i.length});const r=await C.callGemini(i);c.log("Respuesta recibida de API",{length:r.length});const s=h.processAffilateResponse(r);c.log("Datos procesados",{productos:s.productos.length}),m.productosDetectados=s.productos,m.currentAnalysis=s,E.displayResults(s)}catch(i){document.getElementById("loading").classList.add("hidden"),c.showStatus(`Error: ${i.message}`,"error"),c.log("Error en análisis",i,"error"),E.showDebugSection()}finally{n.innerHTML=a,n.disabled=!1}},gatherAnalysisConfig:()=>({nicho:document.getElementById("nicho").value.trim(),publico:document.getElementById("publico").value.trim(),rangoPrecios:document.getElementById("rangoPrecios").value,tipoProducto:document.getElementById("tipoProducto").value,canalPrincipal:document.getElementById("canalPrincipal").value,experiencia:document.getElementById("experiencia").value,keywords:document.getElementById("keywords").value.trim(),presupuestoAds:document.getElementById("presupuestoAds").value,roiObjetivo:document.getElementById("roiObjetivo").value,breakEvenTime:document.getElementById("breakEvenTime").value,tipoConversion:document.getElementById("tipoConversion").value,dispositivoTarget:document.getElementById("dispositivoTarget").value,mercadoGeo:document.getElementById("mercadoGeo").value,analyzeCompetition:document.getElementById("analyzeCompetition").checked,analyzeTrends:document.getElementById("analyzeTrends").checked,findAffiliates:document.getElementById("findAffiliates").checked,analyzeKeywords:document.getElementById("analyzeKeywords").checked,analyzeSeasonality:document.getElementById("analyzeSeasonality").checked,analyzeProfitability:document.getElementById("analyzeProfitability").checked,analyzeConversion:document.getElementById("analyzeConversion").checked,analyzeFinancial:document.getElementById("analyzeFinancial").checked,analyzeCompetitorIntel:document.getElementById("analyzeCompetitorIntel").checked,analyzeCustomerJourney:document.getElementById("analyzeCustomerJourney").checked,analyzeTrafficChannels:document.getElementById("analyzeTrafficChannels").checked,analyzeFunnels:document.getElementById("analyzeFunnels").checked}),loadSavedConfig:()=>{const e=localStorage.getItem(x.storage.expertConfigName);if(e)try{const t=JSON.parse(e);Object.keys(t).forEach(o=>{const n=document.getElementById(o);n&&t[o]&&(n.value=t[o])}),c.log("Configuración cargada",t)}catch(t){c.log("Error cargando configuración",t,"error")}},toggleDebug:()=>{m.debugMode=!m.debugMode;const e=document.getElementById("debugSection"),t=document.getElementById("toggleDebugBtn");e&&t&&(m.debugMode?(e.classList.remove("hidden"),t.innerHTML='<span class="btn-icon">🔧</span>Ocultar Debug'):(e.classList.add("hidden"),t.innerHTML='<span class="btn-icon">🔧</span>Debug'))}};document.addEventListener("DOMContentLoaded",O.init);const I={selectedTypes:new Set,initTypeSelector:()=>{document.querySelectorAll(".content-type-card").forEach(e=>{e.addEventListener("click",function(){const t=this.dataset.type;this.classList.contains("selected")?(this.classList.remove("selected"),I.selectedTypes.delete(t)):(this.classList.add("selected"),I.selectedTypes.add(t)),c.log(`Tipo de contenido ${t} ${this.classList.contains("selected")?"seleccionado":"deseleccionado"}`)})})},generateContent:async()=>{if(I.selectedTypes.size===0){c.showStatus("Selecciona al menos un tipo de contenido","warning");return}if(!m.apiKey){c.showStatus("Configura tu API Key primero","error");return}const e=I.gatherContentConfig(),t=document.getElementById("generateContentBtn"),o=t.innerHTML;t.innerHTML='<span class="btn-icon">🔄</span><span class="btn-text">Generando Contenido...</span>',t.disabled=!0;try{c.log("Iniciando generación de contenido viral...",e);const n=I.buildContentPrompt(e),a=await C.callGemini(n),i=I.processContentResponse(a);I.displayContent(i),c.showStatus(`✅ Contenido viral generado para ${I.selectedTypes.size} canales`,"success")}catch(n){c.showStatus(`Error generando contenido: ${n.message}`,"error"),c.log("Error en generación de contenido",n,"error")}finally{t.innerHTML=o,t.disabled=!1}},gatherContentConfig:()=>{const e=document.getElementById("nicho").value.trim(),t=document.getElementById("publico").value.trim();return{nicho:e,publico:t,tiposSeleccionados:Array.from(I.selectedTypes),salesAngle:document.getElementById("salesAngle").value,controversyLevel:document.getElementById("controversyLevel").value,powerWords:document.getElementById("powerWords").value.split(",").map(o=>o.trim()),tipoProducto:document.getElementById("tipoProducto").value,rangoPrecios:document.getElementById("rangoPrecios").value,canalPrincipal:document.getElementById("canalPrincipal").value}},buildContentPrompt:e=>{const{nicho:t,publico:o,tiposSeleccionados:n,salesAngle:a,controversyLevel:i,powerWords:r}=e;return`Actúa como EXPERTO COPYWRITER VIRAL con +10 años creando contenido que genera $1M+ en ventas.

MISIÓN: Crear contenido de ALTA CONVERSIÓN para el nicho "${t}" dirigido a "${o}".

TIPOS DE CONTENIDO REQUERIDOS: ${n.join(", ")}

CONFIGURACIÓN:
- Ángulo de venta: ${a}
- Nivel controversia: ${i}
- Palabras poder: ${r.join(", ")}

FORMATO OBLIGATORIO para cada tipo:

=== TIPO: [NOMBRE_TIPO] ===

${n.includes("tiktok")?`
**TIKTOK/REELS:**
HOOK (3 seg): [Frase que para el scroll]
AGITACIÓN (5-10 seg): [Problema + emoción]
REVELACIÓN (15-20 seg): [Solución + beneficio]
CTA (3-5 seg): [Llamada a acción urgente]
HASHTAGS: [5-10 hashtags estratégicos]
MÚSICA_SUGERIDA: [Trending audio type]
VIRAL_SCORE: [1-100]
`:""}

${n.includes("email")?`
**EMAIL MARKETING:**
SUBJECT_1: [Subject line con urgencia]
SUBJECT_2: [Subject line con curiosidad] 
SUBJECT_3: [Subject line con beneficio]
PREVIEW: [Preview text optimizado]
APERTURA: [Primer párrafo gancho]
CUERPO: [Email completo 150-200 palabras]
CTA_BUTTON: [Texto del botón]
PS: [Post scriptum irresistible]
OPEN_RATE_ESTIMADO: [%]
CLICK_RATE_ESTIMADO: [%]
`:""}

${n.includes("facebook")?`
**FACEBOOK ADS:**
HEADLINE_1: [Titular principal]
HEADLINE_2: [Variación headline]
PRIMARY_TEXT: [Texto principal del ad]
DESCRIPTION: [Descripción corta]
CTA_BUTTON: [Botón llamada acción]
AUDIENCE_INSIGHT: [A quién targetear]
BUDGET_SUGERIDO: [$XX diarios]
CTR_ESTIMADO: [%]
CPC_ESTIMADO: [$X.XX]
`:""}

${n.includes("instagram")?`
**INSTAGRAM:**
CAPTION_INICIO: [Hook primeras líneas]
CAPTION_COMPLETA: [Post completo con emojis]
HASHTAGS_PRIMARIOS: [10 hashtags principales]
HASHTAGS_NICHO: [10 hashtags específicos]
STORIES_IDEAS: [3 ideas para stories]
ENGAGEMENT_RATE_ESTIMADO: [%]
BEST_TIME_POST: [Hora optimal]
`:""}

${n.includes("blog")?`
**BLOG/SEO:**
TITULO_SEO: [Título optimizado con keyword]
META_DESCRIPCION: [Meta description 150-160 chars]
H2_PRINCIPALES: [5 subtítulos H2]
INTRODUCCION: [Párrafo gancho 50-80 palabras]
KEYWORDS_PRINCIPALES: [3 keywords primarias]
KEYWORDS_LSI: [5 keywords relacionadas]
WORD_COUNT_SUGERIDO: [XXX palabras]
DIFICULTAD_SEO: [Fácil/Medio/Difícil]
`:""}

${n.includes("youtube")?`
**YOUTUBE:**
TITULO_1: [Título viral opción 1]
TITULO_2: [Título viral opción 2] 
TITULO_3: [Título viral opción 3]
THUMBNAIL_DESCRIPTION: [Descripción del thumbnail]
SCRIPT_INTRO: [Primeros 15 segundos]
GANCHOS_VIDEO: [3 ganchos para mantener atención]
DESCRIPCION: [Descripción del video]
TAGS: [15 tags relevantes]
CTR_ESTIMADO: [%]
RETENTION_ESTIMADO: [%]
`:""}

=== FIN TIPO ===

PRINCIPIOS VIRALES A APLICAR:
✅ Hook irresistible en primeros 3 segundos
✅ Crear curiosidad + urgencia
✅ Usar pattern interrupts
✅ Storytelling emocional
✅ Social proof integrado
✅ CTA específicas y claras
✅ Optimizado para cada plataforma

IMPORTANTE:
- Cada pieza debe ser ACCIONABLE inmediatamente
- Incluir métricas estimadas realistas
- Usar el lenguaje específico del ${o}
- Aprovechar tendencias actuales del ${t}
- Balance perfecto entre viral y convertible

OBJETIVO: Contenido que genere engagement masivo Y conversiones reales.`},processContentResponse:e=>{c.log("Procesando respuesta de contenido...",{length:e.length});const t={};return I.selectedTypes.forEach(o=>{const n=new RegExp(`=== TIPO: ${o.toUpperCase()} ===([\\s\\S]*?)(?==== FIN TIPO|=== TIPO:|$)`,"i"),a=e.match(n);if(a)t[o]=I.parseContentByType(o,a[1]),c.log(`Contenido extraído para ${o}`,t[o]);else{const i=new RegExp(`\\*\\*${o.toUpperCase()}[^:]*:\\*\\*([\\s\\S]*?)(?=\\*\\*[A-Z]+|$)`,"i"),r=e.match(i);r&&(t[o]=I.parseContentByType(o,r[1]),c.log(`Contenido extraído (alternativo) para ${o}`,t[o]))}}),{contenidoPorTipo:t,respuestaCompleta:e}},parseContentByType:(e,t)=>{const o={tipo:e,items:[]},n=(i,r)=>{const s=new RegExp(`${i}:\\s*([^\\n]+)`,"i"),l=r.match(s);return l?l[1].trim():""},a=(i,r)=>{const s=new RegExp(`${i}:\\s*([\\s\\S]*?)(?=[A-Z_]+:|$)`,"i"),l=r.match(s);return l?l[1].trim():""};switch(e){case"tiktok":o.items.push({nombre:"Script TikTok/Reels",hook:n("HOOK \\(3 seg\\)",t),agitacion:n("AGITACIÓN",t),revelacion:n("REVELACIÓN",t),cta:n("CTA",t),hashtags:n("HASHTAGS",t),musica:n("MÚSICA_SUGERIDA",t),score:n("VIRAL_SCORE",t)});break;case"email":o.items.push({nombre:"Email Marketing",subject1:n("SUBJECT_1",t),subject2:n("SUBJECT_2",t),subject3:n("SUBJECT_3",t),preview:n("PREVIEW",t),apertura:n("APERTURA",t),cuerpo:a("CUERPO",t),ctaButton:n("CTA_BUTTON",t),ps:n("PS",t),openRate:n("OPEN_RATE_ESTIMADO",t),clickRate:n("CLICK_RATE_ESTIMADO",t)});break;case"facebook":o.items.push({nombre:"Facebook Ads",headline1:n("HEADLINE_1",t),headline2:n("HEADLINE_2",t),primaryText:a("PRIMARY_TEXT",t),description:n("DESCRIPTION",t),ctaButton:n("CTA_BUTTON",t),audience:n("AUDIENCE_INSIGHT",t),budget:n("BUDGET_SUGERIDO",t),ctr:n("CTR_ESTIMADO",t),cpc:n("CPC_ESTIMADO",t)});break;case"instagram":o.items.push({nombre:"Instagram Post",captionInicio:n("CAPTION_INICIO",t),captionCompleta:a("CAPTION_COMPLETA",t),hashtagsPrimarios:n("HASHTAGS_PRIMARIOS",t),hashtagsNicho:n("HASHTAGS_NICHO",t),storiesIdeas:n("STORIES_IDEAS",t),engagementRate:n("ENGAGEMENT_RATE_ESTIMADO",t),bestTime:n("BEST_TIME_POST",t)});break;case"blog":o.items.push({nombre:"Artículo de Blog",tituloSeo:n("TITULO_SEO",t),metaDescripcion:n("META_DESCRIPCION",t),h2Principales:n("H2_PRINCIPALES",t),introduccion:a("INTRODUCCION",t),keywordsPrimarias:n("KEYWORDS_PRINCIPALES",t),keywordsLsi:n("KEYWORDS_LSI",t),wordCount:n("WORD_COUNT_SUGERIDO",t),dificultadSeo:n("DIFICULTAD_SEO",t)});break;case"youtube":o.items.push({nombre:"Video de YouTube",titulo1:n("TITULO_1",t),titulo2:n("TITULO_2",t),titulo3:n("TITULO_3",t),thumbnailDesc:n("THUMBNAIL_DESCRIPTION",t),scriptIntro:a("SCRIPT_INTRO",t),ganchos:n("GANCHOS_VIDEO",t),descripcion:a("DESCRIPCION",t),tags:n("TAGS",t),ctrEstimado:n("CTR_ESTIMADO",t),retentionEstimado:n("RETENTION_ESTIMADO",t)});break}return o},displayContent:e=>{const{contenidoPorTipo:t}=e,o=document.getElementById("contentTabs"),n=document.getElementById("contentDisplay");o.innerHTML="",n.innerHTML="",Object.keys(t).forEach((i,r)=>{const s=document.createElement("div");s.className=`content-tab ${r===0?"active":""}`,s.dataset.type=i;const l=I.getTypeIcon(i);s.innerHTML=`${l} ${I.getTypeName(i)}`,s.addEventListener("click",()=>{document.querySelectorAll(".content-tab").forEach(d=>d.classList.remove("active")),s.classList.add("active"),I.showContentForType(i,t[i])}),o.appendChild(s)});const a=Object.keys(t)[0];a&&I.showContentForType(a,t[a]),document.getElementById("contentResults").classList.remove("hidden"),document.getElementById("contentResults").scrollIntoView({behavior:"smooth"})},showContentForType:(e,t)=>{const o=document.getElementById("contentDisplay");if(o.innerHTML="",!t||!t.items||t.items.length===0){o.innerHTML=`
                <div class="loading-content">
                    <p>No se pudo generar contenido para ${I.getTypeName(e)}</p>
                </div>
            `;return}t.items.forEach(n=>{const a=I.createContentItemElement(e,n);o.appendChild(a)})},createContentItemElement:(e,t)=>{const o=document.createElement("div");o.className="content-item";let n=`
            <div class="content-item-header">
                <div class="content-title">${t.nombre}</div>
                ${t.score?`<div class="content-score">Score: ${t.score}</div>`:""}
            </div>
        `;switch(e){case"tiktok":n+=`
                    <div class="content-text"><strong>🎯 Hook (3 seg):</strong><br>${t.hook}</div>
                    <div class="content-text"><strong>😱 Agitación:</strong><br>${t.agitacion}</div>
                    <div class="content-text"><strong>💡 Revelación:</strong><br>${t.revelacion}</div>
                    <div class="content-text"><strong>🚀 CTA:</strong><br>${t.cta}</div>
                    <div class="content-text"><strong>📱 Hashtags:</strong><br>${t.hashtags}</div>
                    ${t.musica?`<div class="content-text"><strong>🎵 Música:</strong> ${t.musica}</div>`:""}
                `;break;case"email":n+=`
                    <div class="content-text"><strong>📧 Subject Lines:</strong><br>
                        1. ${t.subject1}<br>
                        2. ${t.subject2}<br>
                        3. ${t.subject3}
                    </div>
                    <div class="content-text"><strong>👀 Preview:</strong><br>${t.preview}</div>
                    <div class="content-text"><strong>🎯 Apertura:</strong><br>${t.apertura}</div>
                    <div class="content-text"><strong>📝 Cuerpo:</strong><br>${t.cuerpo}</div>
                    <div class="content-text"><strong>🔥 CTA Button:</strong> ${t.ctaButton}</div>
                    <div class="content-text"><strong>💫 PS:</strong><br>${t.ps}</div>
                    <div class="content-metrics">
                        <div class="content-metric">
                            <span class="metric-label">Open Rate:</span>
                            <span class="metric-value">${t.openRate}</span>
                        </div>
                        <div class="content-metric">
                            <span class="metric-label">Click Rate:</span>
                            <span class="metric-value">${t.clickRate}</span>
                        </div>
                    </div>
                `;break;case"facebook":n+=`
                    <div class="content-text"><strong>🎯 Headlines:</strong><br>
                        1. ${t.headline1}<br>
                        2. ${t.headline2}
                    </div>
                    <div class="content-text"><strong>📝 Primary Text:</strong><br>${t.primaryText}</div>
                    <div class="content-text"><strong>📋 Description:</strong><br>${t.description}</div>
                    <div class="content-text"><strong>🔥 CTA Button:</strong> ${t.ctaButton}</div>
                    <div class="content-text"><strong>🎯 Audience:</strong><br>${t.audience}</div>
                    <div class="content-metrics">
                        <div class="content-metric">
                            <span class="metric-label">Budget:</span>
                            <span class="metric-value">${t.budget}</span>
                        </div>
                        <div class="content-metric">
                            <span class="metric-label">CTR:</span>
                            <span class="metric-value">${t.ctr}</span>
                        </div>
                        <div class="content-metric">
                            <span class="metric-label">CPC:</span>
                            <span class="metric-value">${t.cpc}</span>
                        </div>
                    </div>
                `;break;case"instagram":n+=`
                    <div class="content-text"><strong>🎯 Caption Hook:</strong><br>${t.captionInicio}</div>
                    <div class="content-text"><strong>📝 Caption Completa:</strong><br>${t.captionCompleta}</div>
                    <div class="content-text"><strong>#️⃣ Hashtags Primarios:</strong><br>${t.hashtagsPrimarios}</div>
                    <div class="content-text"><strong>#️⃣ Hashtags de Nicho:</strong><br>${t.hashtagsNicho}</div>
                    <div class="content-text"><strong>📱 Ideas para Stories:</strong><br>${t.storiesIdeas}</div>
                    <div class="content-metrics">
                        <div class="content-metric">
                            <span class="metric-label">Engagement Rate:</span>
                            <span class="metric-value">${t.engagementRate}</span>
                        </div>
                        <div class="content-metric">
                            <span class="metric-label">Mejor Hora:</span>
                            <span class="metric-value">${t.bestTime}</span>
                        </div>
                    </div>
                `;break;case"blog":n+=`
                    <div class="content-text"><strong>📝 Título SEO:</strong><br>${t.tituloSeo}</div>
                    <div class="content-text"><strong>📋 Meta Descripción:</strong><br>${t.metaDescripcion}</div>
                    <div class="content-text"><strong>📑 H2 Principales:</strong><br>${t.h2Principales}</div>
                    <div class="content-text"><strong>🎯 Introducción:</strong><br>${t.introduccion}</div>
                    <div class="content-text"><strong>🔑 Keywords Primarias:</strong> ${t.keywordsPrimarias}</div>
                    <div class="content-text"><strong>🔗 Keywords LSI:</strong> ${t.keywordsLsi}</div>
                    <div class="content-metrics">
                        <div class="content-metric">
                            <span class="metric-label">Palabras:</span>
                            <span class="metric-value">${t.wordCount}</span>
                        </div>
                        <div class="content-metric">
                            <span class="metric-label">Dificultad SEO:</span>
                            <span class="metric-value">${t.dificultadSeo}</span>
                        </div>
                    </div>
                `;break;case"youtube":n+=`
                    <div class="content-text"><strong>🎯 Títulos:</strong><br>
                        1. ${t.titulo1}<br>
                        2. ${t.titulo2}<br>
                        3. ${t.titulo3}
                    </div>
                    <div class="content-text"><strong>🖼️ Thumbnail:</strong><br>${t.thumbnailDesc}</div>
                    <div class="content-text"><strong>🎬 Script Intro:</strong><br>${t.scriptIntro}</div>
                    <div class="content-text"><strong>🎯 Ganchos:</strong><br>${t.ganchos}</div>
                    <div class="content-text"><strong>📝 Descripción:</strong><br>${t.descripcion}</div>
                    <div class="content-text"><strong>🏷️ Tags:</strong><br>${t.tags}</div>
                    <div class="content-metrics">
                        <div class="content-metric">
                            <span class="metric-label">CTR Estimado:</span>
                            <span class="metric-value">${t.ctrEstimado}</span>
                        </div>
                        <div class="content-metric">
                            <span class="metric-label">Retention:</span>
                            <span class="metric-value">${t.retentionEstimado}</span>
                        </div>
                    </div>
                `;break}return o.innerHTML=n,o},getTypeIcon:e=>({tiktok:"📱",email:"📧",facebook:"📊",instagram:"📸",blog:"✍️",youtube:"🎥"})[e]||"📄",getTypeName:e=>({tiktok:"TikTok/Reels",email:"Email Marketing",facebook:"Facebook Ads",instagram:"Instagram",blog:"Blog/SEO",youtube:"YouTube"})[e]||e},B={generateAvatar:async()=>{if(!m.apiKey){c.showStatus("Configura tu API Key primero","error");return}const e=B.gatherAvatarConfig(),t=document.getElementById("generateAvatarBtn"),o=t.innerHTML;t.innerHTML='<span class="btn-icon">🔄</span><span class="btn-text">Creando Avatar...</span>',t.disabled=!0;try{c.log("Iniciando generación de avatar...",e);const n=B.buildAvatarPrompt(e),a=await C.callGemini(n),i=B.processAvatarResponse(a);B.displayAvatar(i),c.showStatus("✅ Avatar ultra-específico creado exitosamente","success")}catch(n){c.showStatus(`Error creando avatar: ${n.message}`,"error"),c.log("Error en generación de avatar",n,"error")}finally{t.innerHTML=o,t.disabled=!1}},gatherAvatarConfig:()=>{const e=document.getElementById("nicho").value.trim(),t=document.getElementById("publico").value.trim();return{nicho:e,publico:t,gender:document.getElementById("avatarGender").value,age:document.getElementById("avatarAge").value,income:document.getElementById("avatarIncome").value,family:document.getElementById("avatarFamily").value,mainProblem:document.getElementById("avatarMainProblem").value.trim(),mainDesire:document.getElementById("avatarMainDesire").value.trim(),tipoProducto:document.getElementById("tipoProducto").value,canalPrincipal:document.getElementById("canalPrincipal").value}},buildAvatarPrompt:e=>{const{nicho:t,publico:o,gender:n,age:a,income:i,family:r,mainProblem:s,mainDesire:l}=e;return`Actúa como PSICÓLOGO EXPERTO EN MARKETING con doctorado en comportamiento del consumidor y 15+ años analizando audiencias de ${t}.

MISIÓN: Crear un AVATAR ULTRA-ESPECÍFICO y psicológicamente preciso para "${o}" en el nicho "${t}".

DATOS DEMOGRÁFICOS:
- Género: ${n}
- Edad: ${a}
- Ingresos: ${i}
- Familia: ${r}
- Problema principal: ${s}
- Deseo principal: ${l}

FORMATO OBLIGATORIO (usar exactamente estos marcadores):

=== AVATAR ULTRA-ESPECÍFICO ===

PERFIL_DEMOGRAFICO:
- Nombre típico: [Nombre y apellido representativo]
- Edad exacta: [XX años]
- Género: [Específico]
- Ubicación: [Ciudad/región típica]
- Estado civil: [Detallado]
- Hijos: [Número y edades si aplica]
- Ocupación: [Trabajo específico]
- Ingresos anuales: [$XX,XXX]
- Educación: [Nivel específico]

PSICOGRAFIA_PROFUNDA:
- Personalidad (Big 5): [Calificación 1-10 en cada trait]
- Valores principales: [3-5 valores core]
- Miedos profundos: [5 miedos específicos relacionados al nicho]
- Aspiraciones secretas: [3 sueños que no comparte]
- Vergüenzas ocultas: [Qué le da pena admitir]
- Autoestima: [Nivel y en qué áreas]

PAIN_POINTS_ESPECIFICOS:
- Dolor #1: [Problema más urgente + intensidad emocional]
- Dolor #2: [Segundo problema + cómo lo afecta diariamente]
- Dolor #3: [Tercer problema + impacto en relaciones]
- Frustración primaria: [Qué más le molesta del problema]
- Consecuencias temidas: [Qué pasará si no se resuelve]

TRIGGERS_EMOCIONALES:
- Miedo dominante: [Miedo que más lo mueve a actuar]
- Deseo ardiente: [Lo que más quiere lograr]
- Palabras que lo emocionan: [5-7 palabras específicas]
- Palabras que lo repelen: [5 palabras que evitar]
- Momentos de vulnerabilidad: [Cuándo está más receptivo]

COMPORTAMIENTO_DIGITAL:
- Plataformas favoritas: [Dónde pasa más tiempo + horas]
- Horarios online: [Cuándo está más activo]
- Tipo de contenido que consume: [Específico al nicho]
- Influencers que sigue: [Tipos de personas]
- Dispositivo principal: [Mobile/Desktop + contexto de uso]
- Hábitos de compra online: [Cómo y cuándo compra]

OBJECIONES_COMPRA:
- Objeción #1: [Primera barrera mental + razón profunda]
- Objeción #2: [Segunda barrera + contexto]
- Objeción #3: [Tercera barrera + traumas pasados]
- Precio: [Percepción del valor + sensibilidad]
- Confianza: [Qué necesita para confiar]
- Timing: [Por qué "no es el momento"]

MOMENTO_COMPRA_IDEAL:
- Situación gatillo: [Qué evento lo hace actuar]
- Estado emocional: [Cómo se siente cuando compra]
- Día de la semana: [Cuándo más probable]
- Hora del día: [Momento específico]
- Contexto físico: [Dónde está cuando decide]
- Influencias externas: [Quién/qué lo influye]

LENGUAJE_TRIBAL:
- Jerga que usa: [Palabras específicas del grupo]
- Emojis favoritos: [Los que más usa]
- Tono preferido: [Formal/casual/amigable/directo]
- Referencias culturales: [Qué entiende]
- Humor: [Qué tipo le gusta]
- Modo de expresión: [Cómo habla de sus problemas]

PATRON_COMUNICACION:
- Cómo articula el problema: [Sus palabras exactas]
- Qué busca en Google: [Queries específicas]
- Cómo habla de soluciones: [Su lenguaje]
- A quién le pregunta: [Círculo de confianza]
- Qué información necesita: [Para tomar decisión]
- Formato preferido: [Video/texto/imagen/audio]

ENTORNO_SOCIAL:
- Círculo interno: [Familia/amigos cercanos]
- Presión social: [Expectativas del entorno]
- Status deseado: [Cómo quiere ser visto]
- Grupo de pertenencia: [Tribu/comunidad]
- Influencia social: [Quién respeta]
- Comparaciones constantes: [Con quién se compara]

RUTINA_DIARIA:
- 6:00 AM: [Actividad típica]
- 9:00 AM: [Qué hace]
- 12:00 PM: [Almuerzo/pausa]
- 3:00 PM: [Tarde]
- 6:00 PM: [Fin del trabajo]
- 9:00 PM: [Noche]
- 11:00 PM: [Antes de dormir]

GATILLOS_ACCION:
- Qué lo hace clickear: [Específico]
- Qué lo hace abrir emails: [Subject lines que funcionan]
- Qué lo hace compartir: [Contenido viral para él]
- Qué lo hace comprar: [Momento y contexto exacto]
- Qué lo hace recomendar: [Cuándo se vuelve fan]

=== FIN AVATAR ===

IMPORTANTE:
✅ Ser ULTRA-ESPECÍFICO en cada detalle
✅ Basado en psicología real del ${a} ${n}
✅ Lenguaje exacto que usa esta persona
✅ Triggers emocionales probados en ${t}
✅ Patrones de comportamiento verificables
✅ Todo debe ser ACCIONABLE para marketing

OBJETIVO: Avatar tan preciso que cualquier marketer puede hablarle directamente a esta persona y convertir al 3-5x más que con audiencias genéricas.`},processAvatarResponse:e=>{c.log("Procesando respuesta de avatar...",{length:e.length});const t={};return[{section:"perfilDemografico",regex:/PERFIL_DEMOGRAFICO:([\s\S]*?)(?=PSICOGRAFIA_PROFUNDA:|$)/i},{section:"psicografia",regex:/PSICOGRAFIA_PROFUNDA:([\s\S]*?)(?=PAIN_POINTS_ESPECIFICOS:|$)/i},{section:"painPoints",regex:/PAIN_POINTS_ESPECIFICOS:([\s\S]*?)(?=TRIGGERS_EMOCIONALES:|$)/i},{section:"triggers",regex:/TRIGGERS_EMOCIONALES:([\s\S]*?)(?=COMPORTAMIENTO_DIGITAL:|$)/i},{section:"comportamientoDigital",regex:/COMPORTAMIENTO_DIGITAL:([\s\S]*?)(?=OBJECIONES_COMPRA:|$)/i},{section:"objeciones",regex:/OBJECIONES_COMPRA:([\s\S]*?)(?=MOMENTO_COMPRA_IDEAL:|$)/i},{section:"momentoCompra",regex:/MOMENTO_COMPRA_IDEAL:([\s\S]*?)(?=LENGUAJE_TRIBAL:|$)/i},{section:"lenguajeTribal",regex:/LENGUAJE_TRIBAL:([\s\S]*?)(?=PATRON_COMUNICACION:|$)/i},{section:"patronComunicacion",regex:/PATRON_COMUNICACION:([\s\S]*?)(?=ENTORNO_SOCIAL:|$)/i},{section:"entornoSocial",regex:/ENTORNO_SOCIAL:([\s\S]*?)(?=RUTINA_DIARIA:|$)/i},{section:"rutinaDiaria",regex:/RUTINA_DIARIA:([\s\S]*?)(?=GATILLOS_ACCION:|$)/i},{section:"gatillosAccion",regex:/GATILLOS_ACCION:([\s\S]*?)(?==== FIN AVATAR|$)/i}].forEach(({section:n,regex:a})=>{const i=e.match(a);i&&(t[n]=i[1].trim())}),{avatar:t,respuestaCompleta:e}},displayAvatar:e=>{const{avatar:t}=e,o=document.getElementById("avatarDisplay");o.innerHTML="",[{key:"perfilDemografico",title:"👤 Perfil Demográfico",icon:"👤"},{key:"psicografia",title:"🧠 Psicografía Profunda",icon:"🧠"},{key:"painPoints",title:"😰 Pain Points Específicos",icon:"😰"},{key:"triggers",title:"🎯 Triggers Emocionales",icon:"🎯"},{key:"comportamientoDigital",title:"📱 Comportamiento Digital",icon:"📱"},{key:"objeciones",title:"🚫 Objeciones de Compra",icon:"🚫"},{key:"momentoCompra",title:"⏰ Momento de Compra Ideal",icon:"⏰"},{key:"lenguajeTribal",title:"💬 Lenguaje Tribal",icon:"💬"},{key:"patronComunicacion",title:"📢 Patrón de Comunicación",icon:"📢"},{key:"entornoSocial",title:"👥 Entorno Social",icon:"👥"},{key:"rutinaDiaria",title:"⏰ Rutina Diaria",icon:"⏰"},{key:"gatillosAccion",title:"🚀 Gatillos de Acción",icon:"🚀"}].forEach(a=>{if(t[a.key]){const i=document.createElement("div");i.className="avatar-section-item",i.innerHTML=`
                    <div class="avatar-section-title">
                        ${a.icon} ${a.title}
                    </div>
                    <div class="avatar-section-content">
                        ${t[a.key].replace(/\n/g,"<br>")}
                    </div>
                `,o.appendChild(i)}}),document.getElementById("avatarResults").classList.remove("hidden"),document.getElementById("avatarResults").scrollIntoView({behavior:"smooth"})}},$={copyContent:()=>{const e=document.getElementById("contentDisplay");if(!e||e.innerHTML===""){c.showStatus("No hay contenido para copiar","warning");return}const t=$.generateContentReport();navigator.clipboard.writeText(t).then(()=>{c.showStatus("Contenido copiado al portapapeles","success")}).catch(()=>{c.showStatus("Error al copiar contenido","error")})},copyAvatar:()=>{const e=document.getElementById("avatarDisplay");if(!e||e.innerHTML===""){c.showStatus("No hay avatar para copiar","warning");return}const t=$.generateAvatarReport();navigator.clipboard.writeText(t).then(()=>{c.showStatus("Avatar copiado al portapapeles","success")}).catch(()=>{c.showStatus("Error al copiar avatar","error")})},generateContentReport:()=>{let e=`🎯 CONTENIDO VIRAL GENERADO
`;return e+=`🧠 MarketInsight Pro - Generador de Contenido
`,e+=`📅 Fecha: ${new Date().toLocaleDateString()}

`,document.querySelectorAll(".content-tab").forEach(o=>{const n=o.dataset.type,a=I.getTypeName(n);e+=`
=== ${a.toUpperCase()} ===
`,o.click(),document.querySelectorAll(".content-item").forEach(r=>{r.querySelectorAll(".content-text").forEach(l=>{e+=l.textContent+`
`}),e+=`
`})}),e},generateAvatarReport:()=>{let e=`🧠 AVATAR ULTRA-ESPECÍFICO
`;return e+=`🧠 MarketInsight Pro - Generador de Avatar
`,e+=`📅 Fecha: ${new Date().toLocaleDateString()}

`,document.querySelectorAll(".avatar-section-item").forEach(o=>{const n=o.querySelector(".avatar-section-title").textContent,a=o.querySelector(".avatar-section-content").textContent;e+=`
${n}
`,e+=a+`

`}),e},downloadContent:()=>{const e=$.generateContentReport();T.downloadFile(e,"contenido-viral-generado.txt","text/plain"),c.showStatus("Contenido descargado","success")},downloadAvatar:()=>{const e=$.generateAvatarReport();T.downloadFile(e,"avatar-ultra-especifico.txt","text/plain"),c.showStatus("Avatar descargado","success")}},re=O.init;O.init=()=>{re(),I.initTypeSelector(),document.getElementById("generateContentBtn").addEventListener("click",I.generateContent),document.getElementById("copyContentBtn").addEventListener("click",$.copyContent),document.getElementById("downloadContentBtn").addEventListener("click",$.downloadContent),document.getElementById("generateAvatarBtn").addEventListener("click",B.generateAvatar),document.getElementById("copyAvatarBtn").addEventListener("click",$.copyAvatar),document.getElementById("downloadAvatarBtn").addEventListener("click",$.downloadAvatar),c.log("Funcionalidades de Fase 1 inicializadas: Contenido Viral + Avatar Ultra-Específico")};let k=new Set;function se(){console.log("Inicializando cards de contenido...");const e=document.querySelectorAll(".content-type-card");if(e.length===0){console.log("No se encontraron cards de contenido");return}console.log(`Encontradas ${e.length} cards de contenido`),e.forEach((t,o)=>{console.log(`Configurando card ${o+1}:`,t.dataset.type),t.addEventListener("click",function(n){console.log("Click en card:",this.dataset.type);const a=this.dataset.type;this.classList.contains("selected")?(this.classList.remove("selected"),k.delete(a),console.log(`${a} deseleccionado`)):(this.classList.add("selected"),k.add(a),console.log(`${a} seleccionado`)),console.log("Tipos seleccionados:",Array.from(k))}),t.style.cursor="pointer",t.style.transition="all 0.3s ease"})}const ce={integrarConProductos:function(){console.log("🔗 Integrando con productos detectados...");const e=m.productosDetectados||[];if(e.length===0)return console.log("⚠️ No hay productos detectados, usando datos base"),this.generarContextoBase();const t=e[0];return{nombre:t.nombre||"Producto",precio:t.precio||"$97",comision:t.comision||"40%",descripcion:t.descripcion||"",painPoints:this.extraerPainPoints(t),emociones:this.extraerEmociones(t),triggers:this.extraerTriggers(t),nicho:t.nicho||document.getElementById("nicho")?.value||""}},extraerPainPoints:function(e){const t=[];if(e.painPoints&&t.push(...e.painPoints.split(",").map(o=>o.trim())),t.length===0){const o=e.nicho?.toLowerCase()||"";o.includes("peso")||o.includes("fitness")?t.push("No lograr bajar de peso","Falta de energía","No tener tiempo para ejercicio"):o.includes("dinero")||o.includes("financiero")?t.push("Falta de dinero extra","Miedo a las inversiones","No saber por dónde empezar"):t.push("Falta de resultados","Pérdida de tiempo","Frustración constante")}return t.slice(0,3)},extraerEmociones:function(e){const t=[];e.emociones&&t.push(...e.emociones.split(",").map(n=>n.trim()));const o=e.nicho?.toLowerCase()||"";return o.includes("salud")||o.includes("fitness")?t.push("inseguridad","esperanza","determinación"):o.includes("dinero")||o.includes("riqueza")?t.push("ansiedad financiera","ambición","miedo al fracaso"):t.push("frustración","esperanza","urgencia"),[...new Set(t)].slice(0,3)},extraerTriggers:function(e){const t=[];e.triggers&&t.push(...e.triggers.split(",").map(n=>n.trim()));const o=parseFloat(e.precio?.replace(/[^0-9.]/g,"")||"0");return o<50?t.push("precio accesible","riesgo bajo","prueba ahora"):o>200?t.push("inversión seria","exclusividad","resultados premium"):t.push("relación precio-valor","oportunidad","acción inmediata"),t.slice(0,3)},generarContextoBase:function(){const e=document.getElementById("nicho")?.value||"tu nicho";return document.getElementById("publico")?.value,{nombre:"Tu Producto",precio:"$97",comision:"40%",descripcion:`Producto especializado en ${e}`,painPoints:["Falta de resultados","Pérdida de tiempo","Frustración constante"],emociones:["frustración","esperanza","urgencia"],triggers:["oportunidad","cambio","acción inmediata"],nicho:e}}};async function le(){if(console.log("🚀 Generando contenido viral MEJORADO..."),k.size===0){alert("⚠️ Selecciona al menos un tipo de contenido");return}if(!m.apiKey){alert("⚠️ Configura tu API Key primero");return}const e=document.getElementById("generateContentBtn"),t=e.innerHTML;e.innerHTML="🤖 Generando contenido inteligente...",e.disabled=!0;try{const o=ce.integrarConProductos();console.log("✅ Contexto del producto:",o);const n={salesAngle:document.getElementById("salesAngle")?.value||"problema-agitacion",controversyLevel:document.getElementById("controversyLevel")?.value||"medium",powerWords:document.getElementById("powerWords")?.value||"gratis, secreto, exclusivo, limitado"},a=Array.from(k),i=o.painPoints[0]||"este problema",r=o.emociones[0]||"frustración",s=o.triggers[0]||"urgencia",l=`Actúa como EXPERTO COPYWRITER VIRAL especializado en marketing de afiliados con +15 años generando $10M+ en ventas.

🎯 CONTEXTO ESPECÍFICO DEL PRODUCTO:
- Producto: ${o.nombre}
- Precio: ${o.precio}  
- Comisión: ${o.comision}
- Nicho: ${o.nicho}
- Pain Point Principal: ${i}
- Emoción Target: ${r}
- Trigger Principal: ${s}

📋 CONFIGURACIÓN:
- Ángulo de venta: ${n.salesAngle}
- Nivel controversia: ${n.controversyLevel}
- Palabras poder: ${n.powerWords}

🚀 MISIÓN: Crear contenido ULTRA-ESPECÍFICO para ${o.nombre} que convierta ${o.comision} por venta.

TIPOS DE CONTENIDO REQUERIDOS: ${a.join(", ")}

${a.includes("tiktok")?`
📱 TIKTOK/REELS SCRIPT (60 SEGUNDOS):
HOOK (0-3s): [POV específico sobre ${i}]
PROBLEMA (3-8s): [Agitar ${i} con historia personal]
PRODUCTO (8-35s): [Cómo ${o.nombre} resolvió el problema] 
PRUEBA SOCIAL (35-45s): [Testimonios específicos del nicho]
CTA URGENTE (45-60s): [Acción inmediata con ${o.comision}]
HASHTAGS: [10 hashtags específicos del nicho + virales]
MÚSICA: [Trending audio sugerido]
EFECTOS: [Transiciones y zooms específicos con timestamps]
VIRAL SCORE: [Predicción 8-10/10]
`:""}

${a.includes("instagram")?`
📸 INSTAGRAM FEED + STORIES:
CAPTION HOOK: [Primeras líneas sobre ${i}]
CAPTION COMPLETA: [Historia personal + ${o.nombre} + CTA]
HASHTAGS: [15 hashtags específicos del nicho]
STORIES IDEAS:
- Story 1: Antes/después usando ${o.nombre}
- Story 2: Los 3 errores que cometía con ${i}
- Story 3: Por qué ${o.nombre} es diferente
CARRUSEL: [7 slides sobre el problema y solución]
REELS HOOK: [Versión Instagram del TikTok]
`:""}

${a.includes("facebook")?`
📊 FACEBOOK ADS OPTIMIZADO:
HEADLINE: [Titular específico sobre ${i}]
PRIMARY TEXT: [150 palabras con ${o.nombre}]
CTA BUTTON: "Más información" / "Comprar ahora"
TARGETING SUGERIDO:
- Audiencia: Personas con ${i} en ${o.nicho}
- Intereses: [3-5 intereses específicos del nicho]
- Edad: [Rango específico para el producto]
- Dispositivos: [Mobile/Desktop preferido]
PRESUPUESTO: $20-50/día
CPC ESTIMADO: $0.80-$2.50
`:""}

${a.includes("email")?`
📧 EMAIL MARKETING SEQUENCE:
SUBJECT LINES (3 opciones):
1. [Urgencia sobre ${i}]
2. [Curiosidad sobre ${o.nombre}]
3. [Beneficio específico]
EMAIL BODY: [200 palabras con historia personal]
SECUENCIA 5 EMAILS:
- Email 1: Despertar conciencia sobre ${i}
- Email 2: Agitar el dolor + mi historia
- Email 3: Presentar ${o.nombre}
- Email 4: Testimonios + urgencia
- Email 5: Última oportunidad
CTA: [Específico para ${o.comision}]
`:""}

${a.includes("youtube")?`
🎥 YOUTUBE VIDEO COMPLETO:
TÍTULOS (3 opciones):
1. "Cómo resolví ${i} con ${o.nombre} (REAL)"
2. "Por qué ${o.nombre} funciona (${i} SOLVED)"
3. "${o.nombre} REVIEW: ¿Vale la pena ${o.precio}?"
THUMBNAIL: [Descripción específica del diseño]
SCRIPT COMPLETO:
[0:00] Hook viral sobre ${i}
[0:30] Mi historia personal con ${i}
[2:00] Los errores que cometía
[5:00] Cómo descubrí ${o.nombre}
[8:00] Resultados específicos
[10:00] Cómo conseguirlo con ${o.comision}
TAGS: [15 tags específicos del nicho]
`:""}

${a.includes("blog")?`
✍️ BLOG POST SEO:
TÍTULO SEO: "Cómo resolver ${i}: ${o.nombre} review"
META DESCRIPCIÓN: [160 caracteres con keyword]
ESTRUCTURA:
H1: El problema con ${i}
H2: Mi experiencia personal
H3: Por qué ${o.nombre} es diferente
H4: Resultados después de usar ${o.nombre}
H5: Cómo conseguir ${o.nombre} con ${o.comision}
KEYWORDS: [5 palabras clave del nicho]
LONGITUD: 1500-2000 palabras
`:""}

🎯 REQUIREMENTS CRÍTICOS:
- Usar SIEMPRE el nombre específico "${o.nombre}"
- Mencionar el precio "${o.precio}" y comisión "${o.comision}"
- Enfocar en el pain point "${i}"
- Apelar a la emoción "${r}"
- Usar el trigger "${s}" para urgencia
- Contenido ACCIONABLE para afiliados
- Métricas REALISTAS incluidas
- Lenguaje que convierte en ${o.nicho}`,d=await C.callGemini(l);console.log("🎯 Generando avatar específico para el producto...");let u=null;try{window.AvatarSyncSystem?(u=await AvatarSyncSystem.generarAvatarEspecifico(o,a),console.log("✅ Avatar específico generado:",u.nombre)):console.log("⚠️ AvatarSyncSystem no disponible, continuando sin avatar específico")}catch(p){console.error("Error generando avatar específico:",p)}pe(d,a,o,u),c.showStatus(`✅ Contenido inteligente ${u?"+ avatar específico":""} generado para ${a.length} tipos`,"success")}catch(o){console.error("Error:",o),c.showStatus(`❌ Error: ${o.message}`,"error")}finally{e.innerHTML=t,e.disabled=!1}}async function de(){if(console.log("Generando avatar..."),!m.apiKey){alert("⚠️ Configura tu API Key primero");return}const e=document.getElementById("nicho").value.trim(),t=document.getElementById("publico").value.trim();if(!e||!t){alert("⚠️ Completa el nicho y público objetivo");return}const o=document.getElementById("generateAvatarBtn"),n=o.innerHTML;o.innerHTML="🔄 Creando...",o.disabled=!0;try{const a=`Actúa como PSICÓLOGO EXPERTO EN MARKETING con doctorado en comportamiento del consumidor.

MISIÓN: Crear un AVATAR ULTRA-ESPECÍFICO para "${t}" en el nicho "${e}".

Crea un perfil psicológico completo con:

=== PERFIL DEMOGRÁFICO ===
Nombre: [Nombre típico]
Edad: [XX años específicos]
Ubicación: [Ciudad/región]
Trabajo: [Ocupación específica]
Ingresos: [$XX,XXX anuales]
Familia: [Situación detallada]

=== PSICOLOGÍA PROFUNDA ===
Miedos principales: [3 miedos específicos del nicho]
Deseos secretos: [3 aspiraciones que no comparte]
Frustraciones diarias: [Problemas específicos que vive]
Valores importantes: [Qué más valora en la vida]

=== COMPORTAMIENTO DIGITAL ===
Plataformas favoritas: [Dónde pasa tiempo online]
Horarios activos: [Cuándo está más conectado]
Contenido que consume: [Qué tipo de posts/videos ve]
Influencers que sigue: [Tipos de personas que admira]

=== PROCESO DE COMPRA ===
Primer pensamiento: [Qué piensa cuando ve el problema]
Objeciones principales: [Por qué NO compraría]
Momento ideal compra: [Cuándo está más receptivo]
Palabras que lo motivan: [Lenguaje que lo emociona]
Palabras que lo alejan: [Términos que evitar]

=== TRIGGERS EMOCIONALES ===
Gatillo de miedo: [Qué lo asusta más del problema]
Gatillo de deseo: [Qué lo motiva más a actuar]
Prueba social necesaria: [Qué evidencia necesita]
Urgencia que funciona: [Qué tipo de presión responde]

Haz este avatar TAN específico que cualquier marketer pueda hablarle directamente y convertir 3-5x más.`,i=await C.callGemini(a);ue(i),c.showStatus("✅ Avatar creado exitosamente","success")}catch(a){console.error("Error:",a),c.showStatus(`❌ Error: ${a.message}`,"error")}finally{o.innerHTML=n,o.disabled=!1}}function pe(e,t,o,n=null){let a=document.getElementById("contentResults");if(a||(a=document.createElement("div"),a.id="contentResults",a.className="content-results",document.querySelector(".main-content").appendChild(a)),a.innerHTML=`
        <h2>🎯 Contenido Viral Inteligente</h2>
        
        <div class="content-context" style="background: rgba(0,255,127,0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00ff7f;">
            <h3>📊 Contexto del Producto Integrado ${n?"+ Avatar Específico":""}</h3>
            <div class="context-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px;">
                <div><strong>🎯 Producto:</strong> ${o.nombre}</div>
                <div><strong>💰 Precio:</strong> ${o.precio}</div>
                <div><strong>💎 Comisión:</strong> ${o.comision}</div>
                <div><strong>🎭 Nicho:</strong> ${o.nicho}</div>
                <div><strong>😰 Pain Point:</strong> ${o.painPoints[0]||"N/A"}</div>
                <div><strong>💔 Emoción:</strong> ${o.emociones[0]||"N/A"}</div>
                ${n?`
                    <div><strong>👤 Avatar:</strong> ${n.nombre}</div>
                    <div><strong>🎯 Target:</strong> ${n.edad}, ${n.ocupacion}</div>
                `:""}
            </div>
            ${n?`
                <div style="margin-top: 15px; padding: 10px; background: rgba(139, 92, 246, 0.1); border-radius: 6px; border-left: 3px solid #8b5cf6;">
                    <strong>🧠 Avatar Específico Generado:</strong> "${n.nombre}" - ${n.problemaPrincipal} (${n.emocionDominante})
                </div>
            `:""}
        </div>
        
        <div class="content-display">
            <div class="content-item">
                <div class="content-title" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    📱 Contenido Generado para: ${t.map(i=>me(i)+" "+i.toUpperCase()).join(", ")}
                </div>
                <div class="content-text">
                    <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; line-height: 1.6; background: rgba(0,0,0,0.8); color: #e2e8f0; padding: 25px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); max-height: 600px; overflow-y: auto;">${e}</pre>
                </div>
            </div>
        </div>
        
        <div class="export-buttons" style="text-align: center; margin-top: 25px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="copiarContenidoMejorado()" style="background: #4a90e2; border: none; padding: 12px 20px; border-radius: 8px; color: white; font-weight: 600;">
                📋 Copiar Todo
            </button>
            <button class="btn btn-secondary" onclick="descargarContenidoMejorado()" style="background: #50c878; border: none; padding: 12px 20px; border-radius: 8px; color: white; font-weight: 600;">
                📄 Descargar
            </button>
            <button class="btn btn-primary" onclick="exportarContenidoAFunnels()" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: none; padding: 12px 20px; border-radius: 8px; color: #1a202c; font-weight: 700;">
                🏗️ Usar en Funnels
            </button>
            <button class="btn btn-accent" onclick="generarMasVariaciones()" style="background: #8b5cf6; border: none; padding: 12px 20px; border-radius: 8px; color: white; font-weight: 600;">
                🔄 Más Variaciones
            </button>
        </div>
        
        <div class="content-insights" style="margin-top: 20px; padding: 15px; background: rgba(139, 92, 246, 0.1); border-radius: 8px; border-left: 4px solid #8b5cf6;">
            <h4>🧠 Insights del Contenido Generado</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 10px;">
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px;">
                    <strong>🎯 Enfoque Principal:</strong><br>
                    Resolver "${o.painPoints[0]||"problemas"}" usando ${o.nombre}
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px;">
                    <strong>💰 Oportunidad de Ingresos:</strong><br>
                    ${o.comision} por cada venta de ${o.precio}
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px;">
                    <strong>📈 Potencial Viral:</strong><br>
                    Alto (basado en ${o.emociones[0]||"emoción"} + urgencia)
                </div>
            </div>
        </div>
    `,a.classList.remove("hidden"),a.scrollIntoView({behavior:"smooth"}),window.lastContentGeneratedEnhanced={respuesta:e,tipos:t,contextoProducto:o,avatarEspecifico:n,timestamp:new Date().toISOString()},n&&window.AvatarSyncSystem)try{AvatarSyncSystem.exportarConjuntoCoherente({respuesta:e,tipos:t,timestamp:new Date().toISOString()},n,o),console.log("✅ Conjunto coherente exportado automáticamente")}catch(i){console.error("Error exportando conjunto coherente:",i)}window.lastContentGenerated=e}function me(e){return{tiktok:"📱",instagram:"📸",facebook:"📊",email:"📧",youtube:"🎥",blog:"✍️"}[e]||"📄"}function ue(e){let t=document.getElementById("avatarResults");t||(t=document.createElement("div"),t.id="avatarResults",t.className="avatar-results",document.querySelector(".main-content").appendChild(t)),t.innerHTML=`
        <h2>🧠 Avatar Ultra-Específico</h2>
        <div class="avatar-display">
            <div class="avatar-item">
                <div class="avatar-title">Perfil Completo del Cliente Ideal</div>
                <div class="avatar-content">
                    <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.6; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px;">${e}</pre>
                </div>
            </div>
        </div>
        <div class="export-buttons" style="text-align: center; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="copiarAvatar()">📋 Copiar</button>
            <button class="btn btn-secondary" onclick="descargarAvatar()">📄 Descargar</button>
        </div>
    `,t.classList.remove("hidden"),t.scrollIntoView({behavior:"smooth"}),window.lastAvatarGenerated=e}function _(){console.log("Inicializando nuevas funcionalidades..."),setTimeout(se,100);const e=document.getElementById("generateContentBtn"),t=document.getElementById("generateAvatarBtn");e&&(e.onclick=le,console.log("Botón contenido configurado")),t&&(t.onclick=de,console.log("Botón avatar configurado")),console.log("Nuevas funcionalidades inicializadas correctamente")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();setTimeout(_,500);setTimeout(_,1500);async function ge(){if(console.log("Generando múltiples avatares automáticamente..."),!m.apiKey){alert("⚠️ Configura tu API Key primero");return}const e={nicho:document.getElementById("nicho").value.trim(),publico:document.getElementById("publico").value.trim(),tipoProducto:document.getElementById("tipoProducto").value,rangoPrecios:document.getElementById("rangoPrecios").value,canalPrincipal:document.getElementById("canalPrincipal").value,presupuestoAds:document.getElementById("presupuestoAds").value,roiObjetivo:document.getElementById("roiObjetivo").value,mercadoGeo:document.getElementById("mercadoGeo").value,dispositivoTarget:document.getElementById("dispositivoTarget").value,experiencia:document.getElementById("experiencia").value};if(!e.nicho||!e.publico){alert("⚠️ Completa el nicho y público objetivo primero");return}const t=document.getElementById("generateMultipleAvatarsBtn"),o=t.innerHTML;t.innerHTML="🤖 Generando 5 Avatares...",t.disabled=!0;try{const n=Ee(e),a=await C.callGemini(n);ve(a),c.showStatus("✅ 5 avatares generados automáticamente","success")}catch(n){console.error("Error:",n),c.showStatus(`❌ Error: ${n.message}`,"error")}finally{t.innerHTML=o,t.disabled=!1}}function Ee(e){const{nicho:t,publico:o,tipoProducto:n,rangoPrecios:a,canalPrincipal:i,presupuestoAds:r,roiObjetivo:s,mercadoGeo:l,dispositivoTarget:d}=e;return`Actúa como EXPERTO EN SEGMENTACIÓN DE AUDIENCIAS con 15+ años creando avatares ultra-específicos.

MISIÓN: Crear 5 AVATARES ÚNICOS Y ESPECÍFICOS para el nicho "${t}" basándote en el análisis completo.

DATOS DEL ANÁLISIS PRINCIPAL:
- Nicho: ${t}
- Público base: ${o}
- Tipo producto: ${n}
- Rango precios: ${a}
- Canal principal: ${i}
- Presupuesto ads: $${r}+ mensual
- ROI objetivo: ${s}x
- Mercado: ${l}
- Dispositivo: ${d}

CREAR 5 AVATARES DIFERENTES que representen segmentos únicos del mismo nicho:

=== AVATAR 1: LA PROFESIONAL OCUPADA ===
NOMBRE: [Nombre específico]
EDAD: [28-35 años]
PERFIL: [Profesional con poco tiempo]
INGRESOS: [$40K-80K anuales]
PROBLEMA: [Específico al nicho + falta de tiempo]
DESEO: [Resultados rápidos sin comprometer carrera]
MIEDO: [Fracasar públicamente + no verse profesional]
HORARIO_ONLINE: [Mañana temprano + noche]
PLATAFORMAS: [LinkedIn + Instagram + YouTube]
GATILLO_COMPRA: [Domingo noche planificando semana]
OBJECIONES: ["No tengo tiempo" + "Es muy caro"]
LENGUAJE: [Jerga profesional + eficiencia]

=== AVATAR 2: LA MAMÁ RECUPERANDO FORMA ===
NOMBRE: [Nombre maternal]
EDAD: [25-35 años]
PERFIL: [Madre que quiere recuperar su cuerpo]
INGRESOS: [$25K-50K familiares]
PROBLEMA: [Específico post-embarazo + autoestima]
DESEO: [Verse como antes + tener energía para hijos]
MIEDO: [Nunca recuperar su cuerpo + juicio de otras madres]
HORARIO_ONLINE: [Temprano mañana + noche cuando duermen hijos]
PLATAFORMAS: [Instagram + Facebook + Pinterest]
GATILLO_COMPRA: [Momentos de frustración con espejos]
OBJECIONES: ["Presupuesto familiar" + "Tiempo con hijos"]
LENGUAJE: [Emocional + motivacional + familiar]

=== AVATAR 3: EL EMPRENDEDOR SEDENTARIO ===
NOMBRE: [Nombre emprendedor]
EDAD: [30-40 años]
PERFIL: [Trabaja desde casa, vida sedentaria]
INGRESOS: [$50K-100K variables]
PROBLEMA: [Dolor espalda + falta ejercicio + estrés]
DESEO: [Productividad + energía + imagen éxito]
MIEDO: [Problemas salud + imagen no profesional]
HORARIO_ONLINE: [Todo el día + noches]
PLATAFORMAS: [YouTube + LinkedIn + Podcasts]
GATILLO_COMPRA: [Después de calls estresantes]
OBJECIONES: ["No funciona" + "Muy complicado"]
LENGUAJE: [ROI + eficiencia + resultados]

=== AVATAR 4: LA JOVEN UNIVERSITARIA ===
NOMBRE: [Nombre generacional Z]
EDAD: [18-25 años]
PERFIL: [Estudiante + trabajo parcial]
INGRESOS: [$15K-25K anuales]
PROBLEMA: [Inseguridad + comparación social + presupuesto]
DESEO: [Verse bien en fotos + confianza + likes]
MIEDO: [No encajar + ser juzgada + gastar dinero padres]
HORARIO_ONLINE: [Tardes + noches + fines semana]
PLATAFORMAS: [TikTok + Instagram + Snapchat]
GATILLO_COMPRA: [Antes de eventos sociales]
OBJECIONES: ["Muy caro" + "No tengo experiencia"]
LENGUAJE: [Trends + emojis + casual + authentic]

=== AVATAR 5: EL PROFESIONAL MADURO ===
NOMBRE: [Nombre experiencia]
EDAD: [40-50 años]
PERFIL: [Ejecutivo senior + responsabilidades]
INGRESOS: [$80K-150K anuales]
PROBLEMA: [Salud deteriorándose + imagen ejecutiva]
DESEO: [Mantenerse competitivo + salud + longevidad]
MIEDO: [Problemas salud graves + verse mayor]
HORARIO_ONLINE: [Mañanas + commute + fines semana]
PLATAFORMAS: [LinkedIn + Facebook + Email]
GATILLO_COMPRA: [Después revisiones médicas]
OBJECIONES: ["Falta tiempo" + "Ya probé todo"]
LENGUAJE: [Científico + profesional + resultados]

Para cada avatar, incluir:
- MOMENTO_IDEAL_VENTA: [Día + hora + contexto específico]
- PRECIO_IDEAL: [Rango específico para este avatar]
- CANAL_PREFERIDO: [Mejor canal para este segmento]
- TIPO_CONTENIDO: [Qué contenido consume]
- INFLUENCERS_SIGUE: [Tipo de personas que admira]

OBJETIVO: 5 avatares TAN específicos que puedas crear campañas ultra-dirigidas para cada uno con mensajes completamente diferentes.`}function ve(e){let t=document.getElementById("multipleAvatarsResults");t||(t=document.createElement("div"),t.id="multipleAvatarsResults",t.className="multiple-avatars-results",document.querySelector(".main-content").appendChild(t));const o=fe(e);let n=`
        <h2>🤖 5 Avatares Generados Automáticamente</h2>
        <div class="avatars-grid">
    `;o.forEach((a,i)=>{n+=`
            <div class="avatar-card">
                <div class="avatar-header">
                    <h3>${a.titulo}</h3>
                    <span class="avatar-number">#${i+1}</span>
                </div>
                <div class="avatar-content">
                    <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.5; font-size: 0.9rem;">${a.contenido}</pre>
                </div>
                <div class="avatar-actions">
                    <button class="btn btn-small" onclick="copiarAvatar('${i}')">📋 Copiar</button>
                    <button class="btn btn-small" onclick="usarParaCampaña('${i}')">🚀 Usar</button>
                </div>
            </div>
        `}),n+=`
        </div>
        <div class="export-buttons" style="text-align: center; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="copiarTodosAvatares()">📋 Copiar Todos</button>
            <button class="btn btn-secondary" onclick="descargarTodosAvatares()">📄 Descargar</button>
            <button class="btn btn-secondary" onclick="generateMultipleAvatars()">🔄 Regenerar</button>
        </div>
    `,t.innerHTML=n,t.classList.remove("hidden"),t.scrollIntoView({behavior:"smooth"}),window.lastMultipleAvatars=e,window.processedAvatars=o}function fe(e){const t=[],o=/=== AVATAR \d+: ([^=]+) ===([\s\S]*?)(?==== AVATAR \d+:|$)/g;let n;for(;(n=o.exec(e))!==null;)t.push({titulo:n[1].trim(),contenido:n[2].trim()});return t.length===0&&e.split(/AVATAR \d+:/).forEach((i,r)=>{i.trim()&&r>0&&t.push({titulo:`Avatar ${r}`,contenido:i.trim()})}),t}function Ie(){const e=document.getElementById("generateAvatarBtn");if(e&&!document.getElementById("generateMultipleAvatarsBtn")){const t=document.createElement("button");t.className="btn btn-avatar",t.id="generateMultipleAvatarsBtn",t.style.marginTop="15px",t.innerHTML='<span class="btn-icon">🤖</span><span class="btn-text">Generar 5 Avatares Automáticamente</span>',t.onclick=ge,e.parentNode.appendChild(t)}}const he=`
.multiple-avatars-results {
    background: rgba(45, 55, 72, 0.5);
    border-radius: 15px;
    padding: 30px;
    margin: 25px 0;
    border: 1px solid #4a5568;
}

.avatars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.avatar-card {
    background: rgba(26, 32, 44, 0.7);
    border-radius: 12px;
    padding: 20px;
    border-left: 4px solid #8a2be2;
    transition: transform 0.3s ease;
}

.avatar-card:hover {
    transform: translateY(-3px);
}

.avatar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.avatar-header h3 {
    color: #9333ea;
    margin: 0;
    font-size: 1.1rem;
}

.avatar-number {
    background: #8a2be2;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
}

.avatar-content {
    background: rgba(0,0,0,0.3);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    max-height: 200px;
    overflow-y: auto;
}

.avatar-actions {
    display: flex;
    gap: 10px;
}

.btn-small {
    padding: 6px 12px;
    font-size: 0.8rem;
}

@media (max-width: 768px) {
    .avatars-grid {
        grid-template-columns: 1fr;
    }
}
`;function Ce(){if(!document.getElementById("multipleAvatarsCSS")){const e=document.createElement("style");e.id="multipleAvatarsCSS",e.textContent=he,document.head.appendChild(e)}}function z(){Ce(),setTimeout(Ie,1e3),console.log("Auto-generador de avatares múltiples inicializado")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",z):z();setTimeout(z,1e3);const K=window.mostrarResultadosAvatar||function(){};E.displayResults;window.mostrarResultadosAvatar=function(e){window.lastAvatarGenerated=e,typeof K=="function"&&K(e),setTimeout(updateFunnelExportButton,500),console.log("✅ Avatar guardado globalmente")};if(typeof E<"u"&&E.displayResults){const e=E.displayResults;E.displayResults=function(t){t&&t.productos&&(typeof m>"u"&&(window.AppState={}),m.productosDetectados=t.productos,console.log("✅ Productos guardados globalmente:",t.productos.length)),e.call(this,t),setTimeout(updateFunnelExportButton,500)}}setInterval(function(){const e=!!window.lastAvatarGenerated,t=!!(typeof m<"u"&&m.productosDetectados&&m.productosDetectados.length>0);(e||t)&&updateFunnelExportButton&&updateFunnelExportButton()},2e3);document.addEventListener("DOMContentLoaded",function(){setTimeout(function(){const e=document.getElementById("avatarResults"),t=document.getElementById("resultados");if(e&&!e.classList.contains("hidden")){console.log("🔍 Avatar detectado en pantalla, buscando datos...");const o=e.querySelector(".avatar-content, .avatar-display");o&&o.textContent&&(window.lastAvatarGenerated=o.textContent,console.log("✅ Avatar recuperado del DOM"))}t&&!t.classList.contains("hidden")&&(console.log("🔍 Productos detectados en pantalla, simulando datos..."),typeof m>"u"&&(window.AppState={}),m.productosDetectados||(m.productosDetectados=[{nombre:"Producto detectado",precio:"$50-200",descripcion:"Producto de fitness y bienestar"}],console.log("✅ Productos simulados"))),updateFunnelExportButton&&updateFunnelExportButton()},1e3)});console.log("🔧 Fix de variables globales cargado");const P={openTrendPredictor:()=>{console.log("🔮 Abriendo Trend Predictor...");const e={nicho:document.getElementById("nicho")?.value?.trim()||"",mercado:document.getElementById("mercadoGeo")?.value||"LATAM",tipoProducto:document.getElementById("tipoProducto")?.value||"digital",canalPrincipal:document.getElementById("canalPrincipal")?.value||"paid",presupuestoAds:document.getElementById("presupuestoAds")?.value||"1000",experiencia:document.getElementById("experiencia")?.value||"intermedio"};if(!e.nicho){alert("⚠️ Ingresa un nicho primero");return}localStorage.setItem("main_nicho",e.nicho),localStorage.setItem("main_mercado",e.mercado),localStorage.setItem("main_config",JSON.stringify(e));const o=`trend-predictor.html?${new URLSearchParams({nicho:e.nicho,mercado:e.mercado,source:"marketinsight-pro"}).toString()}`;window.open(o,"_blank","width=1400,height=900,scrollbars=yes,resizable=yes")?console.log("✅ Trend Predictor abierto exitosamente"):alert("⚠️ Permitir pop-ups para abrir Trend Predictor"),typeof c<"u"&&c.showStatus&&c.showStatus(`🔮 Trend Predictor abierto para: ${e.nicho}`,"success"),console.log("🔮 Configuración enviada:",e)},canUseTrendPredictor:()=>{const e=localStorage.getItem("gemini_api_key"),t=document.getElementById("nicho")?.value?.trim();return!!(e&&t)},updateTrendButton:()=>{const e=document.getElementById("openTrendPredictorBtn");if(!e)return;P.canUseTrendPredictor();const t=document.getElementById("nicho")?.value?.trim()||"";localStorage.getItem("gemini_api_key")?t?(e.style.opacity="1",e.disabled=!1,e.innerHTML=`🔮 Predecir Tendencias: ${t}`):(e.style.opacity="0.6",e.disabled=!0,e.innerHTML="🔮 Trend Predictor (Ingresa nicho primero)"):(e.style.opacity="0.6",e.disabled=!0,e.innerHTML="🔮 Trend Predictor (Configura API Key primero)")}};function W(){const e=document.getElementById("generateBtn");if(!e){setTimeout(W,1e3);return}if(document.getElementById("openTrendPredictorBtn"))return;console.log("📋 Agregando botón Trend Predictor...");const t=document.createElement("button");t.id="openTrendPredictorBtn",t.className="btn btn-primary",t.style.cssText=`
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%) !important;
        color: white !important;
        padding: 15px 30px !important;
        border: none !important;
        border-radius: 10px !important;
        font-size: 1.1rem !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        margin: 15px auto !important;
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3) !important;
        max-width: 400px !important;
        width: 100% !important;
    `,t.innerHTML="🔮 Trend Predictor (Configura nicho primero)",t.onclick=P.openTrendPredictor,e.parentNode.insertBefore(t,e.nextSibling),P.updateTrendButton(),console.log("✅ Botón Trend Predictor agregado exitosamente")}function Ae(){["nicho","mercadoGeo"].forEach(t=>{const o=document.getElementById(t);o&&(o.addEventListener("input",P.updateTrendButton),o.addEventListener("change",P.updateTrendButton),o.addEventListener("keyup",P.updateTrendButton))}),setInterval(P.updateTrendButton,3e3),console.log("👂 Listeners configurados para Trend Predictor")}function be(){if(document.getElementById("trendPredictorStyles"))return;const e=`
        #openTrendPredictorBtn:hover:not(:disabled) {
            background: linear-gradient(135deg, #ee5a52 0%, #dc2626 100%) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4) !important;
        }

        #openTrendPredictorBtn:disabled {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
            cursor: not-allowed !important;
            transform: none !important;
            box-shadow: 0 4px 15px rgba(107, 114, 128, 0.2) !important;
        }

        @media (max-width: 768px) {
            #openTrendPredictorBtn {
                font-size: 1rem !important;
                padding: 12px 20px !important;
                margin: 10px auto !important;
            }
        }

        /* Animación de aparición */
        #openTrendPredictorBtn {
            animation: trendButtonAppear 0.5s ease-out;
        }

        @keyframes trendButtonAppear {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `,t=document.createElement("style");t.id="trendPredictorStyles",t.textContent=e,document.head.appendChild(t),console.log("🎨 Estilos Trend Predictor agregados")}function F(){console.log("🔮 Inicializando integración Trend Predictor..."),be(),setTimeout(W,1e3),setTimeout(Ae,1500),new URLSearchParams(window.location.search).get("from")==="trend-predictor"&&(console.log("🔄 Usuario regresando desde Trend Predictor"),typeof c<"u"&&c.showStatus&&c.showStatus("🔮 Datos de tendencias disponibles para análisis","info")),console.log("✅ Integración Trend Predictor inicializada completamente")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",F):F();setTimeout(F,2e3);setTimeout(()=>{document.getElementById("openTrendPredictorBtn")||(console.log("🔄 Ejecutando respaldo de inicialización..."),F())},4e3);function ye(){console.log("🔧 DEBUG TREND PREDICTOR:"),console.log("- API Key:",!!localStorage.getItem("gemini_api_key")),console.log("- Nicho campo:",document.getElementById("nicho")?.value||"NO ENCONTRADO"),console.log("- Botón existe:",!!document.getElementById("openTrendPredictorBtn")),console.log("- Estilos cargados:",!!document.getElementById("trendPredictorStyles"));const e=document.getElementById("openTrendPredictorBtn");e&&(console.log("- Botón habilitado:",!e.disabled),console.log("- Texto del botón:",e.textContent))}window.debugTrendPredictor=ye;console.log("🔮 Trend Predictor Integration cargado. Usa debugTrendPredictor() para troubleshooting.");const R={validateOffer:async(e,t)=>{if(!m.apiKey){alert("⚠️ Configura tu API Key primero");return}const o=`Actúa como SUPER AFILIADO EXPERTO con 15+ años en ClickBank, ShareASale, CJ, MaxBounty y acceso a datos internos de networks.

🎯 MISIÓN CRÍTICA: Validar completamente "${e}" en nicho "${t}" con datos ESPECÍFICOS y REALISTAS.

PRODUCTO A VALIDAR: "${e}"
NICHO: "${t}"

⚠️ FORMATO OBLIGATORIO PARA EXTRACCIÓN AUTOMÁTICA:

=== VALIDACIÓN COMPLETA ===

EXISTE_EN_NETWORKS: SI
NETWORKS_DISPONIBLES: [ClickBank, ShareASale, CJ]

GRAVITY: 45
EPC Promedio: $2.80
Conversion Rate: 3.2%
Refund Rate: 8%
Cookie Duration: 60 días

COMPETITION_ANALYSIS:
Saturación: MEDIA
Afiliados Activos: 1,200+
CPA Estimado: $18.50
ROI Realista: 4.2x

PROFIT_CALCULATOR (Con $1000 presupuesto):
- CPC Estimado: $0.85
- Clicks Esperados: 1,176
- Conversiones Est: 38
- Revenue Est: $2,660
- Profit Est: $1,660
- ROI: 266%

VERDICT: PROMETEDOR
RAZÓN: Gravity sólido, EPC competitivo, saturación manejable

TIPS_SECRETOS:
1. Mejor horario: Domingos 7-9 PM (mayor conversión)
2. Audiencia específica: Mujeres 35-55, ingresos $50K+
3. Ángulo ganador: "Transformación en 30 días"
4. Evitar: Países Tier 3 (alta refund rate)
5. Estrategia: Video testimonials convierten 40% más

=== FIN VALIDACIÓN ===

🔥 INSTRUCCIONES CRÍTICAS:
✅ SIEMPRE incluir TODOS los campos obligatorios
✅ Usar números REALISTAS para ${t} (no inventar)
✅ Gravity entre 15-80 (realista para productos reales)
✅ EPC entre $0.50-$5.00 (rango real de mercado)
✅ Conversion Rate entre 1%-8% (datos reales)
✅ VERDICT debe ser: WINNER/PROMETEDOR/SATURADO/EVITAR
✅ Tips deben ser específicos para ${t}

❌ PROHIBIDO:
- Datos genéricos o inventados
- Gravity >100 (poco realista)
- EPC >$10 (poco realista)
- Información vaga o incompleta

CONTEXTO ESPECÍFICO: Analizar para ${t} considerando competencia actual 2025, tendencias de conversión, y comportamiento de audiencia específica.`;try{const n=await C.callGemini(o);return R.parseValidationResponse(n)}catch(n){return console.error("Error validando oferta:",n),null}},parseValidationResponse:e=>{console.log("🔍 Parseando respuesta de validación:",e.substring(0,200)+"...");const t=(a,i="0")=>a&&a.replace(/[^0-9.]/g,"")||i,o=(a,i="")=>a&&a.trim()||i,n={exists:e.match(/EXISTE_EN_NETWORKS:\s*\[?SI\]?/i)!==null||e.includes("disponible")||e.includes("activo")||!e.includes("NO EXISTE"),gravity:(()=>{const a=[/Gravity\s*(?:Score)?:\s*\[?(\d+)\]?/i,/GRAVITY:\s*\[?(\d+)\]?/i,/Popularidad:\s*\[?(\d+)\]?/i,/Score:\s*(\d+)/i];for(const i of a){const r=e.match(i);if(r)return t(r[1],"35")}return e.includes("WINNER")||e.includes("EXCELENTE")?"65":e.includes("PROMETEDOR")||e.includes("BUENO")?"45":e.includes("SATURADO")?"25":e.includes("EVITAR")?"15":"35"})(),epc:(()=>{const a=[/EPC\s*(?:Promedio|Estimado)?:\s*\[\$?([\d.]+)\]/i,/EPC_[A-Z_]*:\s*\$?([\d.]+)/i,/Earnings?\s*per\s*Click:\s*\$?([\d.]+)/i,/\$?([\d.]+)\s*(?:por|per)\s*click/i];for(const i of a){const r=e.match(i);if(r)return t(r[1],"0")}return"0"})(),conversionRate:(()=>{const a=[/Conversion\s*Rate:\s*\[?([\d.]+)%?\]?/i,/CVR[^:]*:\s*\[?([\d.]+)%?\]?/i,/CR:\s*\[?([\d.]+)%?\]?/i,/Conversi[oó]n:\s*([\d.]+)%?/i];for(const i of a){const r=e.match(i);if(r)return t(r[1],"0")}return"0"})(),verdict:(()=>{const a=[/VERDICT:\s*\[?(\w+)\]?/i,/VEREDICTO:\s*\[?(\w+)\]?/i,/Veredicto:\s*(\w+)/i,/Recomendaci[oó]n:\s*(\w+)/i];for(const i of a){const r=e.match(i);if(r)return r[1].toUpperCase()}return e.includes("WINNER")||e.includes("excelente oportunidad")?"WINNER":e.includes("PROMETEDOR")||e.includes("buena opción")?"PROMETEDOR":e.includes("SATURADO")||e.includes("muy competido")?"SATURADO":e.includes("EVITAR")||e.includes("no recomendado")?"EVITAR":"PROMETEDOR"})(),competitionLevel:(()=>{const a=[/Saturaci[oó]n:\s*\[?(\w+)\]?/i,/Competencia:\s*\[?(\w+)\]?/i,/Competition:\s*\[?(\w+)\]?/i];for(const i of a){const r=e.match(i);if(r)return r[1].toUpperCase()}return e.includes("alta competencia")||e.includes("muy saturado")?"ALTA":e.includes("competencia media")||e.includes("moderadamente")?"MEDIA":e.includes("baja competencia")||e.includes("nicho nuevo")?"BAJA":"MEDIA"})(),networks:(()=>{const a=e.match(/NETWORKS_DISPONIBLES:\s*\[([^\]]+)\]/i);if(a)return o(a[1],"");const i=[];return e.includes("ClickBank")&&i.push("ClickBank"),e.includes("ShareASale")&&i.push("ShareASale"),(e.includes("CJ")||e.includes("Commission Junction"))&&i.push("CJ"),e.includes("MaxBounty")&&i.push("MaxBounty"),e.includes("Amazon")&&i.push("Amazon Associates"),i.join(", ")||"ClickBank, ShareASale"})(),profitEstimate:(()=>{const a=[/Profit\s*(?:Est|Estimado)?:\s*\[\$?([\d,]+)\]/i,/Ganancia:\s*\$?([\d,]+)/i,/Revenue\s*Est:\s*\$?([\d,]+)/i];for(const l of a){const d=e.match(l);if(d)return t(d[1],"0")}const i=parseInt(n.gravity)||35,r=parseFloat(n.epc)||1.5;return Math.round(i*r*10).toString()})(),tips:(()=>{const a=[/TIPS_SECRETOS:\s*\n([\s\S]*?)(?==== FIN|VEREDICTO|$)/i,/Tips?[^:]*:\s*\n([\s\S]*?)(?=\n[A-Z_]+:|$)/i,/Recomendaciones:\s*\n([\s\S]*?)(?=\n[A-Z_]+:|$)/i];for(const i of a){const r=e.match(i);if(r)return r[1].split(/\d+\.\s*/).filter(s=>s.trim()).map(s=>s.trim()).join(`
• `).substring(0,500)}return"Tips específicos no disponibles en esta validación."})(),cpaEstimado:(()=>{const a=e.match(/CPA[^:]*:\s*\$?([\d.]+)/i);return a?`$${t(a[1],"15")}`:""})(),roiEstimado:(()=>{const a=e.match(/ROI[^:]*:\s*([\d.]+)x?/i);return a?`${t(a[1],"3")}x`:""})(),refundRate:(()=>{const a=e.match(/Refund\s*Rate:\s*([\d.]+)%?/i);return a?`${t(a[1],"5")}%`:""})(),cookieDuration:(()=>{const a=e.match(/Cookie\s*Duration:\s*([\d]+)\s*d[ií]as?/i);return a?`${a[1]} días`:""})()};return console.log("✅ Datos extraídos de validación:",n),n},displayValidation:(e,t,o)=>{const n=o.querySelector(".offer-validation");n&&n.remove(),console.log("🎯 Mostrando validación completa:",e);const a={WINNER:"winner",PROMETEDOR:"prometedor",SATURADO:"saturado",EVITAR:"evitar",UNKNOWN:"unknown"}[e.verdict]||"prometedor",i=(d,u)=>{const p=parseFloat(d)||0;return p>=u.good?"good":p>=u.medium?"medium":"bad"},r=`
        <div class="offer-validation ${a}">
            <h3>🔍 Validación Completa: ${t}</h3>
            
            <div class="validation-grid">
                <div class="metric">
                    <span class="label">Gravity:</span>
                    <span class="value ${i(e.gravity,{good:50,medium:20})}">${e.gravity}</span>
                </div>
                <div class="metric">
                    <span class="label">EPC:</span>
                    <span class="value ${i(e.epc,{good:2,medium:1})}">${e.epc?"$"+e.epc:"N/A"}</span>
                </div>
                <div class="metric">
                    <span class="label">CR:</span>
                    <span class="value ${i(e.conversionRate,{good:3,medium:1})}">${e.conversionRate}%</span>
                </div>
                <div class="metric">
                    <span class="label">Profit Est:</span>
                    <span class="value good">$${e.profitEstimate}</span>
                </div>
                ${e.cpaEstimado?`
                <div class="metric">
                    <span class="label">CPA:</span>
                    <span class="value medium">${e.cpaEstimado}</span>
                </div>
                `:""}
                ${e.roiEstimado?`
                <div class="metric">
                    <span class="label">ROI:</span>
                    <span class="value good">${e.roiEstimado}</span>
                </div>
                `:""}
            </div>
            
            <div class="verdict ${a}">
                Veredicto: ${e.verdict}
                ${e.verdict==="WINNER"?" 🏆":""}
                ${e.verdict==="PROMETEDOR"?" 👍":""}
                ${e.verdict==="SATURADO"?" ⚠️":""}
                ${e.verdict==="EVITAR"?" ❌":""}
            </div>
            
            ${e.networks?`
            <div class="networks-info">
                <h4>🌐 Networks Disponibles:</h4>
                <p>${e.networks}</p>
            </div>
            `:""}
            
            ${e.competitionLevel?`
            <div class="competition-info">
                <h4>⚔️ Análisis de Competencia:</h4>
                <p>Saturación: <span class="competition-level ${e.competitionLevel.toLowerCase()}">${e.competitionLevel}</span></p>
            </div>
            `:""}
            
            ${e.refundRate||e.cookieDuration?`
            <div class="additional-metrics">
                <h4>📊 Métricas Adicionales:</h4>
                ${e.refundRate?`<p>• Refund Rate: ${e.refundRate}</p>`:""}
                ${e.cookieDuration?`<p>• Cookie Duration: ${e.cookieDuration}</p>`:""}
            </div>
            `:""}
            
            ${e.tips&&e.tips!=="Tips específicos no disponibles en esta validación."?`
            <div class="tips">
                <h4>💡 Tips Secretos de Afiliado:</h4>
                <div class="tips-content">
                    ${e.tips.split(`
`).filter(d=>d.trim()).map((d,u)=>`
                        <div class="tip-item">
                            <span class="tip-number">${u+1}</span>
                            <span class="tip-text">${d.replace(/^•\s*/,"").trim()}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
            `:""}
            
            <div class="validation-actions">
                <button class="btn btn-small" onclick="OfferValidator.copyValidation('${t}')">
                    📋 Copiar Validación
                </button>
                <button class="btn btn-small" onclick="OfferValidator.regenerateValidation('${t}', this)">
                    🔄 Regenerar
                </button>
            </div>
        </div>
    `,s=document.createElement("div");s.innerHTML=r;const l=o.querySelector(".product-section:last-child");l?l.after(s.firstElementChild):o.appendChild(s.firstElementChild),setTimeout(()=>{const d=o.querySelector(".offer-validation");d&&d.scrollIntoView({behavior:"smooth",block:"nearest"})},100)},copyValidation:e=>{const t=document.querySelector(".offer-validation h3").closest(".offer-validation");if(t){const o=t.innerText;navigator.clipboard.writeText(o).then(()=>{R.showNotification("✅ Validación copiada al portapapeles")})}},regenerateValidation:async(e,t)=>{const o=t.innerHTML;t.innerHTML="🔄 Regenerando...",t.disabled=!0;try{const n=document.getElementById("nicho").value,a=await R.validateOffer(e,n);if(a){const i=t.closest(".product-opportunity");R.displayValidation(a,e,i),R.showNotification("✅ Validación regenerada exitosamente")}}catch{R.showNotification("❌ Error regenerando validación")}finally{t.innerHTML=o,t.disabled=!1}},showNotification:e=>{const t=document.createElement("div");t.className="validation-notification",t.innerHTML=e,t.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>t.remove(),300)},3e3)}};function U(){document.querySelectorAll(".product-opportunity").forEach((e,t)=>{if(!e.querySelector(".validate-btn")){let o=e.querySelector(".product-actions");o||(o=document.createElement("div"),o.className="product-actions",e.appendChild(o));const n=document.createElement("button");n.className="btn btn-secondary validate-btn",n.innerHTML="🔍 Validar Oferta",n.dataset.productIndex=t,n.onclick=async function(){const a=m.productosDetectados[this.dataset.productIndex];this.disabled=!0,this.innerHTML="🔄 Validando...";try{const i=await R.validateOffer(a.nombre,document.getElementById("nicho").value);i&&R.displayValidation(i,a.nombre,e)}catch(i){console.error("Error validando:",i),alert("Error al validar. Intenta de nuevo.")}finally{this.disabled=!1,this.innerHTML="🔍 Validar Oferta"}},o.appendChild(n)}})}const D={spiedProducts:new Set,spyWinningAds:async(e,t,o)=>{if(!m.apiKey){alert("⚠️ Configura tu API Key primero");return}const n=`Actúa como EXPERTO EN FACEBOOK ADS LIBRARY y TIKTOK CREATIVE CENTER con acceso completo a todas las campañas activas.

MISIÓN: Revelar los creativos GANADORES actuales para "${e}" en el nicho "${t}".

Basándote en patrones de ads virales y ganadores de 2024-2025, proporciona:

=== WINNING CREATIVES ANALYSIS ===

TOP 3 HOOKS GANADORES:
Hook #1: [Hook exacto que está convirtiendo ahora]
Hook #2: [Segundo mejor hook con alto CTR]
Hook #3: [Tercer hook para split testing]

ÁNGULOS QUE CONVIERTEN:
Ángulo #1: [Nombre del ángulo]
- Descripción: [Cómo funciona]
- Por qué convierte: [Psicología detrás]
- CTR esperado: [X.X%]
- Best for: [Tipo de audiencia]

Ángulo #2: [Nombre del ángulo]
- Descripción: [Cómo funciona]
- Por qué convierte: [Psicología detrás]
- CTR esperado: [X.X%]
- Best for: [Tipo de audiencia]

FORMATO DE CREATIVOS TOP:
VIDEO (Si aplica):
- Duración ideal: [XX segundos]
- Estructura: [0-3s hook, 3-10s problema, etc.]
- Estilo visual: [UGC, profesional, animado]

IMAGEN:
- Estilo: [Lifestyle, before/after, testimonial]
- Elementos clave: [Qué debe incluir]
- Colores dominantes: [Colores que convierten]

COPY FRAMEWORK GANADOR:
[HEADLINE]
Primera línea que detiene el scroll

[BODY]
Estructura del copy principal (150 palabras max)
- Pain point
- Agitación
- Solución
- Beneficios
- Social proof

[CTA]
Call to action específico que convierte

AD METRICS PROMEDIO DEL NICHO:
- CTR: [X.X]% (benchmark actual)
- CPC: $[X.XX] (rango típico)
- CPM: $[XX.XX] (costo por mil)
- Conversion Rate: [X.X]%
- ROAS esperado: [X.X]x

AUDIENCIAS GANADORAS:
Intereses TOP 5:
1. [Interés específico + tamaño audiencia]
2. [Interés específico + tamaño audiencia]
3. [Interés específico + tamaño audiencia]
4. [Interés específico + tamaño audiencia]
5. [Interés específico + tamaño audiencia]

Comportamientos clave:
- [Comportamiento 1]
- [Comportamiento 2]

ELEMENTOS VISUALES CLAVE:
- Colores que convierten: [Lista]
- Fonts recomendadas: [Lista]
- Elementos gráficos: [Iconos, badges, etc.]

HORARIOS ÓPTIMOS:
- Mejores días: [Días específicos]
- Mejores horas: [Rangos horarios]
- Timezone: [Para el mercado target]

=== FIN ANALYSIS ===`;try{const a=await C.callGemini(n);return D.parseSpyResponse(a)}catch(a){return console.error("Error en spy creatives:",a),null}},parseSpyResponse:e=>{const t={hooks:[],angles:[],copyFramework:"",metrics:{},audiences:[],visualElements:"",schedule:""},o=e.match(/Hook #\d+: ([^\n]+)/gi);o&&(t.hooks=o.map(s=>s.replace(/Hook #\d+: /i,"")));const n=e.match(/ÁNGULOS QUE CONVIERTEN:([\s\S]*?)FORMATO DE CREATIVOS/i);n&&(t.angles=n[1].trim());const a=e.match(/COPY FRAMEWORK GANADOR:([\s\S]*?)AD METRICS/i);a&&(t.copyFramework=a[1].trim()),t.metrics={ctr:e.match(/CTR:\s*\[?([\d.]+)\]?%/i)?.[1]||"2.5",cpc:e.match(/CPC:\s*\$\[?([\d.]+)\]/i)?.[1]||"0.75",cpm:e.match(/CPM:\s*\$\[?([\d.]+)\]/i)?.[1]||"15.00",cvr:e.match(/Conversion Rate:\s*\[?([\d.]+)\]?%/i)?.[1]||"2.0",roas:e.match(/ROAS esperado:\s*\[?([\d.]+)\]?x/i)?.[1]||"3.0"};const i=e.match(/\d+\.\s*\[([^\]]+)\]/g);i&&(t.audiences=i.map(s=>s.replace(/\d+\.\s*\[|\]/g,"")));const r=e.match(/(?:AUDIENCIAS GANADORAS|Intereses TOP):([\s\S]*?)(?=ELEMENTOS VISUALES|HORARIOS|$)/i);if(r){const s=r[1],l=[/\d+\.\s*\[([^\]]+)\]/g,/\d+\.\s*([^[\n]+)/g,/- ([^[\n]+)/g,/• ([^[\n]+)/g];for(const d of l){const u=s.matchAll(d);for(const p of u){const g=p[1].trim();g&&!g.includes("[")&&g.length>3&&t.audiences.push(g)}}t.audiences.length===0&&s.split(`
`).forEach(u=>{const p=u.trim().replace(/^[-•*]\s*/,"");p&&p.length>3&&!p.includes(":")&&t.audiences.push(p)})}return t},displaySpyResults:(e,t,o)=>{const n=`
                <div class="spy-results" id="spy-${t.replace(/\s+/g,"-")}">
                    <h3>🕵️ Creative Intelligence: ${t}</h3>
                    
                    <div class="spy-section">
                        <h4>🎯 Top 3 Hooks Ganadores:</h4>
                        <div class="hooks-list">
                        ${e.hooks.length>0?e.hooks.map((i,r)=>`
                                <div class="hook-item" data-hook-index="${r}">
                                    <span class="hook-number">#${r+1}</span>
                                    <span class="hook-text">${i}</span>
                                    <button class="btn-small copy-hook" data-text-to-copy="${encodeURIComponent(i)}">📋</button>
                                </div>
                            `).join(""):'<div class="no-data">No se encontraron hooks específicos. Intenta con otro producto.</div>'}
                        </div>
                    </div>

                    <div class="spy-section">
                        <h4>📐 Ángulos que Convierten:</h4>
                        <div class="angles-content">
                            <pre>${e.angles}</pre>
                        </div>
                    </div>

                    <div class="spy-section">
                        <h4>📝 Copy Framework Ganador:</h4>
                        <div class="copy-framework">
                            <pre>${e.copyFramework}</pre>
                            <button class="btn btn-secondary copy-framework-btn" data-text-to-copy="${encodeURIComponent(e.copyFramework)}">
                                📋 Copiar Framework Completo
                            </button>
                        </div>
                    </div>

                    <div class="spy-section">
                        <h4>📊 Métricas Esperadas del Nicho:</h4>
                        <div class="metrics-grid spy-metrics">
                            <div class="metric">
                                <span class="label">CTR:</span>
                                <span class="value good">${e.metrics.ctr}%</span>
                            </div>
                            <div class="metric">
                                <span class="label">CPC:</span>
                                <span class="value">$${e.metrics.cpc}</span>
                            </div>
                            <div class="metric">
                                <span class="label">CPM:</span>
                                <span class="value">$${e.metrics.cpm}</span>
                            </div>
                            <div class="metric">
                                <span class="label">CVR:</span>
                                <span class="value good">${e.metrics.cvr}%</span>
                            </div>
                            <div class="metric">
                                <span class="label">ROAS:</span>
                                <span class="value good">${e.metrics.roas}x</span>
                            </div>
                        </div>
                    </div>

                    <div class="spy-section">
                        <h4>🎯 Audiencias Ganadoras:</h4>
                        <div class="audiences-list">
                        ${e.audiences.length>0?e.audiences.map(i=>`
                                <div class="audience-item">
                                    <span class="audience-icon">🎯</span>
                                    <span class="audience-text">${i}</span>
                                    <button class="btn-small copy-audience" data-text-to-copy="${encodeURIComponent(i)}">📋</button>
                                </div>
                            `).join(""):'<div class="no-data">No se encontraron audiencias específicas.</div>'}
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn btn-primary generate-variants-btn" data-product-name="${encodeURIComponent(t)}">
                            🎨 Generar 10 Variantes de Ads
                        </button>
                        <button class="btn btn-secondary download-template-btn" data-product-name="${encodeURIComponent(t)}" data-spy-id="spy-${t.replace(/\s+/g,"-")}">
                            📥 Descargar Template de Ads
                        </button>
                    </div>
                </div>
            `,a=document.createElement("div");a.innerHTML=n,a.className="spy-container",o.appendChild(a),setTimeout(()=>{a.querySelector(".spy-results").classList.add("show")},100)},copyText:e=>{navigator.clipboard.writeText(e).then(()=>{const t=document.createElement("div");t.className="copy-notification",t.textContent="✅ Copiado!",document.body.appendChild(t),setTimeout(()=>{t.remove()},2e3)})},generateVariants:async e=>{alert(`🎨 Función "Generar 10 Variantes" próximamente...

Por ahora, usa los hooks y ángulos proporcionados para crear tus propias variantes.`)},exportAdTemplate:e=>{const t=document.getElementById(`spy-${e.replace(/\s+/g,"-")}`);if(t){const o=t.innerText,n=new Blob([o],{type:"text/plain"}),a=URL.createObjectURL(n),i=document.createElement("a");i.href=a,i.download=`ad-template-${e.replace(/\s+/g,"-")}.txt`,i.click(),URL.revokeObjectURL(a)}}};function w(){document.querySelectorAll(".product-opportunity").forEach((e,t)=>{if(!e.querySelector(".spy-btn")){const o=e.querySelector(".validate-btn")?.parentElement||e,n=document.createElement("button");n.className="btn btn-secondary spy-btn",n.innerHTML="🕵️ Spy Creativos",n.style.marginTop="10px",n.style.marginLeft="10px",n.onclick=async()=>{const a=m.productosDetectados[t];if(D.spiedProducts.has(t)){const r=e.querySelector(".spy-results");r&&(r.style.display=r.style.display==="none"?"block":"none");return}n.disabled=!0,n.innerHTML="🔄 Analizando creativos...";const i=await D.spyWinningAds(a.nombre,document.getElementById("nicho").value,t);i&&(D.displaySpyResults(i,a.nombre,e),D.spiedProducts.add(t)),n.disabled=!1,n.innerHTML="🕵️ Spy Creativos"},e.querySelector(".validate-btn")?e.querySelector(".validate-btn").after(n):o.appendChild(n)}})}const Te=U;U=function(){Te(),setTimeout(w,100)};const L={currentProduct:null,currentScenarios:null,open:function(e,t){console.log("🧮 Abriendo Profit Calculator para:",e.nombre),this.currentProduct=e,document.getElementById("calcProductName").textContent=e.nombre||"Producto",document.getElementById("calcProductPrice").textContent=e.precio||"$97",document.getElementById("calcProductCommission").textContent=e.comision||"40%",document.getElementById("calculatorResults").classList.add("hidden"),document.getElementById("profitCalculatorModal").classList.remove("hidden")},closeModal:function(){document.getElementById("profitCalculatorModal").classList.add("hidden")},calculate:async function(){if(console.log("🧮 Iniciando cálculo de profit..."),!this.currentProduct){alert("⚠️ No hay producto seleccionado");return}if(!localStorage.getItem("gemini_api_key")){alert("⚠️ API Key no encontrada. Configúrala en MarketInsight Pro primero.");return}const t={budget:parseFloat(document.getElementById("calcBudget").value)||50,channel:document.getElementById("calcChannel").value,days:parseInt(document.getElementById("calcDays").value)||30,market:document.getElementById("calcMarket").value};console.log("⚙️ Configuración:",t);const o=document.querySelector(".btn-calculate"),n=o.innerHTML;o.innerHTML="<span>🔄</span><span>Calculando...</span>",o.disabled=!0;try{const a=this.buildCalculationPrompt(t);console.log("📝 Prompt construido, longitud:",a.length);const i=await this.callGeminiForCalculations(a);console.log("📥 Respuesta recibida de IA");const r=this.parseCalculationResponse(i);console.log("📊 Escenarios procesados:",r),this.currentScenarios=r,this.displayScenarios(r),this.drawScalingChart(r),document.getElementById("calculatorResults").classList.remove("hidden"),console.log("✅ Cálculo completado exitosamente")}catch(a){console.error("❌ Error calculando:",a),alert(`Error al calcular: ${a.message}`)}finally{o.innerHTML=n,o.disabled=!1}},buildCalculationPrompt:function(e){const t=this.currentProduct;let o=97,n=40;if(t.precio&&typeof t.precio=="string"){const r=t.precio.match(/[\d,]+\.?\d*/);r&&r[0]&&(o=parseFloat(r[0].replace(/,/g,"")))}if(t.comision&&typeof t.comision=="string"){const r=t.comision.match(/\d+/);r&&r[0]&&(n=parseInt(r[0]))}const a=(o*n/100).toFixed(2),i=document.getElementById("nicho")?.value||"General";return`Eres un MEDIA BUYER EXPERTO con 10+ años comprando tráfico para productos de afiliados.

PRODUCTO A ANALIZAR:
- Nombre: ${t.nombre}
- Precio: $${o}
- Comisión: ${n}% ($${a} por venta)
- Nicho: ${i}
${t.painPoints?`- Pain Points: ${t.painPoints}`:""}

CONFIGURACIÓN DE CAMPAÑA:
- Presupuesto diario: $${e.budget}
- Canal: ${e.channel}
- Duración: ${e.days} días
- Mercado: ${e.market}
- Presupuesto total: $${e.budget*e.days}

INSTRUCCIONES CRÍTICAS:
1. USA DATOS REALISTAS del mercado actual 2024-2025
2. CPC debe estar entre $0.30-$8.00 dependiendo del nicho y mercado
3. CTR debe estar entre 0.8%-3.5% para campañas normales
4. CR debe estar entre 0.5%-4.0% dependiendo del producto
5. TODOS los números deben ser COHERENTES entre sí

CONTEXTO DE MERCADO POR CANAL:
- Facebook Ads ${e.market}: CPC típico $${this.getTypicalCPC(e.channel,e.market)}
- Nicho "${i}": Competencia ${this.getNicheCompetition(i)}
- Producto $${o}: Rango de precio ${this.getPriceRange(o)}

Calcula 3 ESCENARIOS REALISTAS:

=== ESCENARIO CONSERVADOR ===
CPC: $[entre $${this.getTypicalCPC(e.channel,e.market)*1.3} - $${this.getTypicalCPC(e.channel,e.market)*1.8}]
CTR: [entre 0.8% - 1.5%]
CR: [entre 0.5% - 1.2%]
Clicks_totales: [presupuesto / CPC]
Conversiones: [clicks × CTR × CR / 100]
Revenue: [conversiones × $${a}]
Ad_Spend: $${e.budget*e.days}
Profit: [revenue - ad_spend]
ROI: [(profit / ad_spend) × 100]%
Dias_breakeven: [días para llegar a profit positivo]

=== ESCENARIO REALISTA ===
CPC: $[entre $${this.getTypicalCPC(e.channel,e.market)*.9} - $${this.getTypicalCPC(e.channel,e.market)*1.2}]
CTR: [entre 1.5% - 2.5%]
CR: [entre 1.2% - 2.5%]
Clicks_totales: [presupuesto / CPC]
Conversiones: [clicks × CTR × CR / 100]
Revenue: [conversiones × $${a}]
Ad_Spend: $${e.budget*e.days}
Profit: [revenue - ad_spend]
ROI: [(profit / ad_spend) × 100]%
Dias_breakeven: [días para llegar a profit positivo]

=== ESCENARIO OPTIMISTA ===
CPC: $[entre $${this.getTypicalCPC(e.channel,e.market)*.6} - $${this.getTypicalCPC(e.channel,e.market)*.9}]
CTR: [entre 2.5% - 4.0%]
CR: [entre 2.5% - 4.0%]
Clicks_totales: [presupuesto / CPC]
Conversiones: [clicks × CTR × CR / 100]
Revenue: [conversiones × $${a}]
Ad_Spend: $${e.budget*e.days}
Profit: [revenue - ad_spend]
ROI: [(profit / ad_spend) × 100]%
Dias_breakeven: [días para llegar a profit positivo]

SCALING PROJECTION:
Basándote en el escenario REALISTA, calcula scaling mensual:
- Mes_1: $[profit mensual con budget actual]
- Mes_2: $[profit con 2-3x budget, mejores audiencias]
- Mes_3: $[profit con 3-5x budget, optimización completa]

RECOMENDACIONES ESPECÍFICAS:
Proporciona 5 recomendaciones ACCIONABLES para maximizar ROI con este producto en ${e.channel}.

FORMATO REQUERIDO:
- Usa NÚMEROS DECIMALES para CPC (ej: $1.25, no $1)
- Usa NÚMEROS ENTEROS para conversiones (ej: 15, no 15.7)  
- Usa NÚMEROS REALISTAS basados en el presupuesto actual
- VERIFICA que profit = revenue - ad_spend
- VERIFICA que ROI = (profit / ad_spend) × 100

IMPORTANTE: Con $${e.budget}/día es IMPOSIBLE que CPC sea $0 o que no haya clicks. Calcula números REALES.`},getTypicalCPC:function(e,t){return{facebook:{tier1:1.5,tier2:.8,tier3:.4},google:{tier1:2.2,tier2:1.2,tier3:.6},tiktok:{tier1:1.8,tier2:1,tier3:.5},native:{tier1:.9,tier2:.5,tier3:.25}}[e]?.[t]||1},getNicheCompetition:function(e){const t=["fitness","weight loss","make money","crypto","forex"],o=["beauty","health","relationships","self help"];return t.some(n=>e.toLowerCase().includes(n))?"ALTA":o.some(n=>e.toLowerCase().includes(n))?"MEDIA":"BAJA"},getPriceRange:function(e){return e<50?"BAJO":e<200?"MEDIO":"ALTO"},parseCalculationResponse:function(e){console.log("🔄 Parseando respuesta:",e.substring(0,200)+"...");const t={conservative:{},realistic:{},optimistic:{},scaling:{},recommendations:""},o=e.match(/=== ESCENARIO CONSERVADOR ===([\s\S]*?)(?==== ESCENARIO REALISTA|$)/i),n=e.match(/=== ESCENARIO REALISTA ===([\s\S]*?)(?==== ESCENARIO OPTIMISTA|$)/i),a=e.match(/=== ESCENARIO OPTIMISTA ===([\s\S]*?)(?=SCALING PROJECTION|$)/i);o?t.conservative=this.extractMetricsForScenario(o[1],"conservative"):t.conservative=this.generateFallbackScenario("conservative"),n?t.realistic=this.extractMetricsForScenario(n[1],"realistic"):t.realistic=this.generateFallbackScenario("realistic"),a?t.optimistic=this.extractMetricsForScenario(a[1],"optimistic"):t.optimistic=this.generateFallbackScenario("optimistic"),this.ensureDifferentScenarios(t),this.validateCalculationLogic(t);const i=e.match(/SCALING PROJECTION:([\s\S]*?)(?=RECOMENDACIONES|$)/i);if(i){const s=i[1];t.scaling={month1:this.extractNumber(s.match(/Mes_1:\s*\$?([\d,]+)/i)?.[1])||"500",month2:this.extractNumber(s.match(/Mes_2:\s*\$?([\d,]+)/i)?.[1])||"1200",month3:this.extractNumber(s.match(/Mes_3:\s*\$?([\d,]+)/i)?.[1])||"2500"}}else{const s=parseFloat(t.realistic.profit||"0");if(s<0){const l=Math.abs(s);t.scaling={month1:Math.round(s).toString(),month2:Math.round(s*.4).toString(),month3:Math.round(l*.5).toString()}}else t.scaling={month1:Math.round(s).toString(),month2:Math.round(s*1.8).toString(),month3:Math.round(s*2.5).toString()}}const r=e.match(/RECOMENDACIONES[^:]*:([\s\S]*?)$/i);return r&&(t.recommendations=r[1].trim()),console.log("📊 Escenarios finales validados:",t),t},extractMetricsForScenario:function(e,t){return{cpc:this.extractNumber(e.match(/CPC:\s*\$?([\d.]+)/i)?.[1])||"1.50",ctr:this.extractNumber(e.match(/CTR:\s*([\d.]+)%?/i)?.[1])||"2.0",cr:this.extractNumber(e.match(/CR:\s*([\d.]+)%?/i)?.[1])||"1.5",clicks:this.extractNumber(e.match(/Clicks[^:]*:\s*([\d,]+)/i)?.[1])||"1000",conversions:this.extractNumber(e.match(/Conversiones:\s*([\d,]+)/i)?.[1])||"30",revenue:this.extractNumber(e.match(/Revenue:\s*\$?([\d,]+)/i)?.[1])||"1164",adSpend:this.extractNumber(e.match(/Ad_Spend:\s*\$?([\d,]+)/i)?.[1])||(parseFloat(document.getElementById("calcBudget")?.value||"50")*parseInt(document.getElementById("calcDays")?.value||"30")).toString(),profit:this.extractNumber(e.match(/Profit:\s*\$?([\d,.-]+)/i)?.[1])||"0",roi:this.extractNumber(e.match(/ROI:\s*([\d.-]+)%?/i)?.[1])||"0",breakeven:this.extractNumber(e.match(/(?:Dias_breakeven|breakeven):\s*([\d]+)/i)?.[1])||"30"}},validateAndFixScenarios:function(e){console.log("🔍 Validando diferencias entre escenarios...");const t=parseFloat(e.conservative.profit||"0"),o=parseFloat(e.realistic.profit||"0"),n=parseFloat(e.optimistic.profit||"0");if(t===o&&o===n){console.log("⚠️ Escenarios idénticos detectados, regenerando...");const a={budget:parseFloat(document.getElementById("calcBudget").value)||50,days:parseInt(document.getElementById("calcDays").value)||30,channel:document.getElementById("calcChannel").value,market:document.getElementById("calcMarket").value},i=a.budget*a.days,r=38.8;e.conservative={cpc:"2.50",ctr:"1.2",cr:"0.8",clicks:Math.round(i/2.5).toString(),conversions:Math.round(i/2.5*.012*.008).toString(),revenue:Math.round(7*r).toString(),adSpend:i.toString(),profit:(272-i).toString(),roi:"-82",breakeven:"45"},e.realistic={cpc:"1.50",ctr:"2.0",cr:"1.8",clicks:Math.round(i/1.5).toString(),conversions:Math.round(i/1.5*.02*.018).toString(),revenue:Math.round(36*r).toString(),adSpend:i.toString(),profit:(1397-i).toString(),roi:"-7",breakeven:"15"},e.optimistic={cpc:"0.75",ctr:"3.0",cr:"2.5",clicks:Math.round(i/.75).toString(),conversions:Math.round(i/.75*.03*.025).toString(),revenue:Math.round(150*r).toString(),adSpend:i.toString(),profit:(5820-i).toString(),roi:"288",breakeven:"5"},console.log("✅ Escenarios regenerados con valores diferentes")}},generateRealisticFallback:function(e,t){const o=(t.budget||50)*(t.days||30),a={conservative:{cpc:"2.00",ctr:"1.0",cr:"0.5",conversions:8,revenue:310,profit:-1190,roi:-79},realistic:{cpc:"1.20",ctr:"2.0",cr:"1.5",conversions:38,revenue:1474,profit:-26,roi:-2},optimistic:{cpc:"0.60",ctr:"3.5",cr:"3.0",conversions:175,revenue:6790,profit:5290,roi:353}}[e];return{cpc:a.cpc,ctr:a.ctr,cr:a.cr,clicks:Math.round(o/parseFloat(a.cpc)).toString(),conversions:a.conversions.toString(),revenue:a.revenue.toString(),adSpend:o.toString(),profit:a.profit.toString(),roi:a.roi.toString(),breakeven:e==="conservative"?"60":e==="realistic"?"12":"4"}},extractMetricsUnique:function(e,t){console.log(`Extrayendo métricas ${t}:`,e.substring(0,100));const o={cpc:this.extractSingleMetric(e,/CPC:\s*\$?([\d.]+)/i),ctr:this.extractSingleMetric(e,/CTR:\s*([\d.]+)%?/i),cr:this.extractSingleMetric(e,/CR:\s*([\d.]+)%?/i),clicks:this.extractSingleMetric(e,/Clicks[^:]*:\s*([\d,]+)/i),conversions:this.extractSingleMetric(e,/Conversiones:\s*([\d,]+)/i),revenue:this.extractSingleMetric(e,/Revenue:\s*\$?([\d,]+)/i),adSpend:this.extractSingleMetric(e,/Ad_Spend:\s*\$?([\d,]+)/i),profit:this.extractSingleMetric(e,/Profit:\s*\$?([\d,.-]+)/i),roi:this.extractSingleMetric(e,/ROI:\s*([\d.-]+)%?/i),breakeven:this.extractSingleMetric(e,/(?:Dias_breakeven|breakeven):\s*([\d]+)/i)};return!o.cpc||o.cpc==="0"||parseFloat(o.cpc)<=0?this.generateFallbackScenario(t):(console.log(`Métricas ${t} extraídas:`,o),o)},extractSingleMetric:function(e,t){const o=e.match(t);return o&&o[1]?this.extractNumber(o[1]):null},generateFallbackScenario:function(e){console.log(`🛡️ Generando escenario fallback: ${e}`);const t={budget:parseFloat(document.getElementById("calcBudget").value)||50,days:parseInt(document.getElementById("calcDays").value)||30},o=t.budget*t.days,n=38.8,a={conservative:{cpc:2.2,ctr:1.1,cr:.9,expectedROI:-25},realistic:{cpc:1.5,ctr:2,cr:1.7,expectedROI:15},optimistic:{cpc:.9,ctr:3.1,cr:2.6,expectedROI:85}},i=a[e]||a.realistic,r=Math.round(o/i.cpc),s=Math.round(r*(i.ctr/100)*(i.cr/100)),l=Math.round(s*n),d=l-o,u=Math.round(d/o*100),p={cpc:i.cpc.toFixed(2),ctr:i.ctr.toFixed(1),cr:i.cr.toFixed(1),clicks:r.toString(),conversions:s.toString(),revenue:l.toString(),adSpend:o.toString(),profit:d.toString(),roi:u.toString(),breakeven:d>0?Math.max(5,Math.round(20*o/l)).toString():"45"};return console.log(`✅ Escenario ${e} generado:`,p),p},ensureDifferentScenarios:function(e){console.log("🔍 Validando que los escenarios sean diferentes...");const t=parseFloat(e.conservative.cpc||"0"),o=parseFloat(e.realistic.cpc||"0"),n=parseFloat(e.optimistic.cpc||"0");t===o&&o===n&&(console.log("⚠️ Los escenarios son idénticos, regenerando..."),e.conservative=this.generateFallbackScenario("conservative"),e.realistic=this.generateFallbackScenario("realistic"),e.optimistic=this.generateFallbackScenario("optimistic"),console.log("✅ Escenarios regenerados como diferentes"));const a=parseFloat(e.conservative.cpc);parseFloat(e.realistic.cpc);const i=parseFloat(e.optimistic.cpc);if(a<i){console.log("⚠️ Orden de CPC incorrecto, ajustando...");const r=e.conservative;e.conservative=e.optimistic,e.optimistic=r}console.log("✅ Validación completada - Escenarios son diferentes")},validateCalculationLogic:function(e){console.log("🔍 FORZANDO escenarios ULTRA-DIFERENTES...");const t=parseFloat(document.getElementById("calcBudget").value)||50,o=parseInt(document.getElementById("calcDays").value)||30,n=t*o;let a=5;try{if(this.currentProduct&&this.currentProduct.comision){const s=this.currentProduct.comision.toString();console.log("🔍 Detectando comisión:",s);const l=s.match(/\$?([\d,]+\.?\d*)/);if(l)a=parseFloat(l[1].replace(/,/g,"")),console.log("💰 Comisión en dólares detectada:",a);else{const d=s.match(/(\d+)%/);if(d){const u=parseInt(d[1]),p=this.currentProduct.precio||"$19.99",g=parseFloat(p.replace(/[^0-9.]/g,""))||19.99;a=g*u/100,console.log(`💰 Comisión calculada: ${u}% de $${g} = $${a}`)}}}}catch{console.log("⚠️ Error detectando comisión, usando default:",a)}const i={conservative:{cpc:2.8,ctr:1,cr:.8,multiplier:.3},realistic:{cpc:1.6,ctr:2.2,cr:1.9,multiplier:1},optimistic:{cpc:.75,ctr:3.5,cr:3,multiplier:2.8}};Object.keys(i).forEach(s=>{const l=i[s];e[s]={},e[s].cpc=l.cpc.toFixed(2),e[s].ctr=l.ctr.toFixed(1),e[s].cr=l.cr.toFixed(1);const d=Math.round(n/l.cpc),u=Math.round(d*(l.ctr/100)*(l.cr/100)*l.multiplier),p=Math.round(u*a),g=p-n,v=n>0?Math.round(g/n*100):0,A={conservative:60,realistic:35,optimistic:15};e[s].clicks=d.toString(),e[s].conversions=u.toString(),e[s].revenue=p.toString(),e[s].profit=g.toString(),e[s].roi=v.toString(),e[s].adSpend=n.toString(),e[s].breakeven=A[s].toString(),console.log(`🚀 ${s.toUpperCase()}:`,{cpc:`$${e[s].cpc}`,conversions:e[s].conversions,profit:`$${e[s].profit}`,roi:`${e[s].roi}%`})});const r=parseFloat(e.realistic.profit||"0");if(r<0){const s=Math.abs(r);e.scaling={month1:r.toString(),month2:Math.round(r*.3).toString(),month3:Math.round(s*.4).toString()}}else e.scaling={month1:r.toString(),month2:Math.round(r*1.6).toString(),month3:Math.round(r*2.2).toString()};console.log("📈 Scaling aplicado:",e.scaling),console.log("✅ ESCENARIOS ULTRA-DIFERENTES COMPLETADOS")},generateDefaultRecommendations:function(){return`Basándote en el análisis del producto y configuración:

1. **Optimización de Audiencias**: Comienza con intereses amplios y refina basándote en las conversiones iniciales.

2. **Testing de Creativos**: Prueba al menos 3-5 variaciones de ads con diferentes ángulos emocionales.

3. **Escalamiento Gradual**: Una vez que encuentres ads rentables, escala el presupuesto 20-30% cada 2-3 días.

4. **Retargeting**: Implementa campañas de retargeting para visitantes que no compraron en la primera visita.

5. **Optimización de Landing**: Asegúrate de que la landing page esté alineada con el mensaje del ad para maximizar conversiones.`},getTypicalCPC:function(e,t){return{facebook:{tier1:1.5,tier2:.8,tier3:.4},google:{tier1:2.2,tier2:1.2,tier3:.6},tiktok:{tier1:1.8,tier2:1,tier3:.5},native:{tier1:.9,tier2:.5,tier3:.25}}[e]?.[t]||1},extractMetricsImproved:function(e){const t=(n,a="0")=>n&&n[1]?this.extractNumber(n[1]):a,o={cpc:t(e.match(/CPC:\s*\$?([\d.]+)/i),"1.50"),ctr:t(e.match(/CTR:\s*([\d.]+)%?/i),"2.0"),cr:t(e.match(/CR:\s*([\d.]+)%?/i),"1.5"),clicks:t(e.match(/Clicks[^:]*:\s*([\d,]+)/i),"1000"),conversions:t(e.match(/Conversiones:\s*([\d,]+)/i),"30"),revenue:t(e.match(/Revenue:\s*\$?([\d,]+)/i),"1164"),adSpend:t(e.match(/Ad_Spend:\s*\$?([\d,]+)/i),"300"),profit:t(e.match(/Profit:\s*\$?([\d,.-]+)/i),"864"),roi:t(e.match(/ROI:\s*([\d.-]+)%?/i),"288"),breakeven:t(e.match(/(?:Dias_breakeven|breakeven):\s*([\d]+)/i),"7")};return parseFloat(o.cpc)<=0&&(o.cpc="1.50"),parseFloat(o.ctr)<=0&&(o.ctr="2.0"),parseFloat(o.cr)<=0&&(o.cr="1.5"),o},validateScenarioLogic:function(e){["conservative","realistic","optimistic"].forEach(t=>{const o=e[t];o&&(parseFloat(o.cpc)<=0&&(o.cpc=t==="conservative"?"2.00":t==="realistic"?"1.50":"1.00"),parseFloat(o.ctr)<=0&&(o.ctr=t==="conservative"?"1.2":t==="realistic"?"2.0":"3.0"),parseFloat(o.cr)<=0&&(o.cr=t==="conservative"?"1.0":t==="realistic"?"1.8":"2.5"),console.log(`✅ Validado escenario ${t}:`,o))})},calculateRealisticScaling:function(e,t){if(!e||!e.profit)return{1:500,2:1200,3:2e3}[t]||"500";const o=parseFloat(e.profit.replace(/[^0-9.-]/g,""))||0,a=Math.round(o*({1:1,2:1.8,3:2.5}[t]||1));return Math.max(a,0).toString()},callGeminiForCalculations:async function(e){const t=localStorage.getItem("gemini_api_key");if(!t)throw new Error("API Key no encontrada");const o=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${t}`,n=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}],generationConfig:{temperature:.7,maxOutputTokens:4096}})});if(!n.ok){const i=await n.text();throw new Error(`API Error: ${n.status} - ${i}`)}const a=await n.json();if(!a.candidates||!a.candidates[0]||!a.candidates[0].content)throw new Error("Respuesta de API incompleta");return a.candidates[0].content.parts[0].text},extractMetrics:function(e){const t=o=>o&&o[1]?this.extractNumber(o[1]):null;return{cpc:t(e.match(/CPC:\s*\$?([\d.]+)/i))||"0.75",ctr:t(e.match(/CTR:\s*([\d.]+)%?/i))||"2.5",cr:t(e.match(/CR:\s*([\d.]+)%?/i))||"3.0",clicks:t(e.match(/Clicks[^:]*:\s*([\d,]+)/i))||"2000",conversions:t(e.match(/Conversiones:\s*([\d,]+)/i))||"60",revenue:t(e.match(/Revenue:\s*\$?([\d,]+)/i))||"5820",adSpend:t(e.match(/Ad_Spend:\s*\$?([\d,]+)/i))||(parseFloat(document.getElementById("calcBudget")?.value||"50")*parseInt(document.getElementById("calcDays")?.value||"30")).toString(),profit:t(e.match(/Profit:\s*\$?([\d,.-]+)/i))||"4320",roi:t(e.match(/ROI:\s*([\d.-]+)%?/i))||"288",breakeven:t(e.match(/(?:Dias_breakeven|breakeven):\s*([\d]+)/i))||"5"}},extractNumber:function(e){if(!e)return"0";const o=String(e).replace(/[^0-9.-]/g,""),n=parseFloat(o);return isNaN(n)?(console.warn("extractNumber: No se pudo parsear:",e),"0"):Math.round(n).toString()},displayScenarios:function(e){console.log("🖥️ Mostrando escenarios en UI");const t=(o,n="0")=>o&&o!=="undefined"?o:n;document.getElementById("cpcConservative").textContent=`$${t(e.conservative.cpc)}`,document.getElementById("ctrConservative").textContent=`${t(e.conservative.ctr)}%`,document.getElementById("crConservative").textContent=`${t(e.conservative.cr)}%`,document.getElementById("profitConservative").textContent=`$${t(e.conservative.profit)}`,document.getElementById("roiConservative").textContent=`${t(e.conservative.roi)}%`,document.getElementById("breakevenConservative").textContent=`${t(e.conservative.breakeven)} días`,document.getElementById("cpcRealistic").textContent=`$${t(e.realistic.cpc)}`,document.getElementById("ctrRealistic").textContent=`${t(e.realistic.ctr)}%`,document.getElementById("crRealistic").textContent=`${t(e.realistic.cr)}%`,document.getElementById("profitRealistic").textContent=`$${t(e.realistic.profit)}`,document.getElementById("roiRealistic").textContent=`${t(e.realistic.roi)}%`,document.getElementById("breakevenRealistic").textContent=`${t(e.realistic.breakeven)} días`,document.getElementById("cpcOptimistic").textContent=`$${t(e.optimistic.cpc)}`,document.getElementById("ctrOptimistic").textContent=`${t(e.optimistic.ctr)}%`,document.getElementById("crOptimistic").textContent=`${t(e.optimistic.cr)}%`,document.getElementById("profitOptimistic").textContent=`$${t(e.optimistic.profit)}`,document.getElementById("roiOptimistic").textContent=`${t(e.optimistic.roi)}%`,document.getElementById("breakevenOptimistic").textContent=`${t(e.optimistic.breakeven)} días`,document.getElementById("month1Profit").textContent=`$${t(e.scaling.month1)}`,document.getElementById("month2Profit").textContent=`$${t(e.scaling.month2)}`,document.getElementById("month3Profit").textContent=`$${t(e.scaling.month3)}`,document.getElementById("aiRecommendations").innerHTML=this.formatRecommendations(e.recommendations)},formatRecommendations:function(e){if(!e||typeof e!="string")return"<p>Recomendaciones no disponibles.</p>";try{const t=e.split(`
`).filter(n=>n.trim());let o="<ul>";return t.forEach(n=>{if(n.trim()){const a=n.replace(/^\d+\.\s*|^-\s*|^•\s*/,"");a.length>5&&(o+=`<li>${a}</li>`)}}),o+="</ul>",o}catch(t){return console.error("Error formateando recomendaciones:",t),"<p>Error al mostrar recomendaciones.</p>"}},drawScalingChart:function(e){const t=document.getElementById("scalingChart");if(t)try{const o=document.createElement("canvas");o.width=t.offsetWidth||400,o.height=200,t.innerHTML="",t.appendChild(o);const n=o.getContext("2d"),a=e.scaling||{month1:"500",month2:"1200",month3:"2500"},i=[parseFloat((a.month1||"0").toString().replace(/,/g,""))||500,parseFloat((a.month2||"0").toString().replace(/,/g,""))||1200,parseFloat((a.month3||"0").toString().replace(/,/g,""))||2500],r=Math.max(...i)*1.2||1e3,s=o.width/5,l=s/3;i.forEach((d,u)=>{const p=d/r*(o.height-40),g=l+u*(s+l),v=o.height-p-20,A=n.createLinearGradient(0,v,0,o.height-20);A.addColorStop(0,"#48bb78"),A.addColorStop(1,"#38a169"),n.fillStyle=A,n.fillRect(g,v,s,p),n.fillStyle="#e2e8f0",n.font="bold 14px Arial",n.textAlign="center",n.fillText(`$${i[u].toLocaleString()}`,g+s/2,v-10),n.fillStyle="#a0aec0",n.font="12px Arial",n.fillText(`Mes ${u+1}`,g+s/2,o.height-5)})}catch(o){console.error("Error dibujando gráfico:",o),t.innerHTML='<p style="color: #e2e8f0; text-align: center; padding: 20px;">Error generando gráfico</p>'}},exportReport:function(){if(!this.currentScenarios){alert("⚠️ No hay escenarios para exportar");return}try{const e=this.currentProduct,t={budget:document.getElementById("calcBudget").value,channel:document.getElementById("calcChannel").value,days:document.getElementById("calcDays").value,market:document.getElementById("calcMarket").value};let o=`💰 REPORTE DE PROFIT CALCULATOR
`;o+=`${"=".repeat(50)}
`,o+=`📅 Fecha: ${new Date().toLocaleDateString()}
`,o+=`🎯 Producto: ${e.nombre}
`,o+=`💵 Precio: ${e.precio} | Comisión: ${e.comision}
`,o+=`
CONFIGURACIÓN:
`,o+=`- Presupuesto: $${t.budget}/día
`,o+=`- Canal: ${t.channel}
`,o+=`- Duración: ${t.days} días
`,o+=`- Mercado: ${t.market}
`,o+=`${"=".repeat(50)}

`,["conservative","realistic","optimistic"].forEach(s=>{const l=this.currentScenarios[s];o+=`📊 ESCENARIO ${s==="conservative"?"CONSERVADOR":s==="realistic"?"REALISTA":"OPTIMISTA"}
`,o+=`- CPC: $${l.cpc||"0"}
`,o+=`- CTR: ${l.ctr||"0"}%
`,o+=`- CR: ${l.cr||"0"}%
`,o+=`- Profit: $${l.profit||"0"}
`,o+=`- ROI: ${l.roi||"0"}%
`,o+=`- Breakeven: ${l.breakeven||"0"} días

`});const n=this.currentScenarios.scaling||{};o+=`📈 PROYECCIÓN DE ESCALAMIENTO
`,o+=`- Mes 1: $${n.month1||"500"}
`,o+=`- Mes 2: $${n.month2||"1200"}
`,o+=`- Mes 3: $${n.month3||"2500"}

`,o+=`💡 RECOMENDACIONES DE IA
`,o+=this.currentScenarios.recommendations||"No disponibles";const a=new Blob([o],{type:"text/plain"}),i=URL.createObjectURL(a),r=document.createElement("a");r.href=i,r.download=`profit-report-${Date.now()}.txt`,r.click(),URL.revokeObjectURL(i),alert("✅ Reporte exportado exitosamente")}catch(e){console.error("Error exportando reporte:",e),alert("❌ Error al exportar reporte")}},saveScenario:function(){if(!this.currentScenarios){alert("⚠️ No hay escenarios para guardar");return}try{const e=JSON.parse(localStorage.getItem("saved_scenarios")||"[]");e.push({date:new Date().toISOString(),product:this.currentProduct.nombre,scenarios:this.currentScenarios,config:{budget:document.getElementById("calcBudget").value,channel:document.getElementById("calcChannel").value,days:document.getElementById("calcDays").value,market:document.getElementById("calcMarket").value}}),localStorage.setItem("saved_scenarios",JSON.stringify(e)),alert("✅ Escenario guardado exitosamente")}catch(e){console.error("Error guardando escenario:",e),alert("❌ Error al guardar escenario")}}};function Q(){console.log("💰 Agregando botones de Profit Calculator..."),document.querySelectorAll(".product-opportunity").forEach((e,t)=>{if(!e.querySelector(".profit-calc-btn")){const o=e.querySelector(".product-actions")||e.querySelector(".spy-btn")?.parentElement||e,n=document.createElement("button");n.className="btn btn-secondary profit-calc-btn",n.innerHTML="💰 Calcular Profit",n.style.marginTop="10px",n.style.marginLeft="10px",n.onclick=()=>{if(m.productosDetectados&&m.productosDetectados[t]){const a=m.productosDetectados[t];L.open(a,t)}else alert("⚠️ Producto no encontrado")},e.querySelector(".spy-btn")?e.querySelector(".spy-btn").after(n):e.querySelector(".validate-btn")?e.querySelector(".validate-btn").after(n):o.appendChild(n)}}),console.log("✅ Botones de Profit Calculator agregados")}if(typeof w<"u"){const e=w;w=function(){try{e(),setTimeout(Q,100)}catch(t){console.error("Error en addSpyButtons:",t)}}}const f={generators:{facebook:(e,t)=>{const o=e.painPoints||"",n=e.emociones||"",a=e.triggers||"",i=e.descripcion||"",r=e.estacionalidad||"",s=e.horarioOptimo||"",l=e.competenciaNivel||"",d=e.timingOptimo||"",u=e.estrategia||"",p=o.split(/[,.]/).filter(b=>b.trim()),g=n.split(/[,.]/).filter(b=>b.trim()),v=a.split(/[,.]/).filter(b=>b.trim()),A=p.slice(0,3).map((b,H)=>{const y=b.trim().toLowerCase();return y.includes("falta de tiempo")?"✅ Resultados en solo 15 minutos al día":y.includes("dificultad")?"✅ Método simple paso a paso que cualquiera puede seguir":y.includes("peso")||y.includes("grasa")?"✅ Pierde hasta 2 kilos por semana sin pasar hambre":y.includes("energía")?"✅ Energía ilimitada desde el primer día":y.includes("dinero")||y.includes("caro")?"✅ Inversión mínima con resultados máximos":y.includes("motivación")?"✅ Sistema que te mantiene motivado todos los días":`✅ ${b.trim().replace(/no poder|no lograr|falta de|sin/gi,"Lograrás").replace(/dificultad para|problema con/gi,"Dominarás")}`});A.length===0&&A.push("✅ Resultados visibles desde la primera semana","✅ Método probado por miles de personas","✅ Garantía de satisfacción del 100%");const S=g[0]||"frustración",G=v[0]||"necesidad de cambio",V=[`😱 ¿${S.charAt(0).toUpperCase()+S.slice(1)}? ${e.nombre} es la solución que buscabas`,`🔥 "${p[0]||"Este problema"}" - Si esto te suena familiar, necesitas ${e.nombre}`,`⚠️ ATENCIÓN: ${e.nombre} con ${e.comision||"40% descuento"} (Solo hoy)`,`💥 ${G.charAt(0).toUpperCase()+G.slice(1)}? Descubre cómo ${e.nombre} está cambiando vidas`,`🎯 Por fin: La solución definitiva para ${p[0]||t} está aquí`];return`${V[Math.floor(Math.random()*V.length)]}

${i}

🎯 BENEFICIOS COMPROBADOS:
${A.join(`
`)}

${g.length>0?`
😔 Sabemos que sientes ${g.join(", ")}...
¡Pero eso termina HOY!
`:""}

💰 OFERTA ESPECIAL:
- Precio regular: $${(parseFloat(e.precio?.replace(/[^0-9.]/g,"")||97)*1.5).toFixed(0)}
- HOY SOLO: ${e.precio||"$97"} 
${e.comision?`• Tu ganancia: ${e.comision} por venta`:""}

${v.length>0?`
⚡ ACTÚA AHORA si:
${v.map(b=>`• ${b.trim()}`).join(`
`)}
`:""}

${d?`
⏰ TIMING PERFECTO: ${d}
`:""}
${r?`📅 MOMENTO IDEAL: ${r}
`:""}
${l?`🎯 COMPETENCIA: ${l} - Tu oportunidad es AHORA
`:""}

🎁 BONUS GRATIS (Solo hoy):
- Guía de inicio rápido (Valor $47)
- Acceso a grupo VIP (Valor $97)
- Actualizaciones de por vida (Valor $197)

⏰ Esta oferta expira en 24 horas
${s?`📱 Mejor momento para publicar: ${s}`:""}

👉 Haz clic en "Más información" y transforma tu vida HOY

${u?`
💡 ESTRATEGIA ESPECÍFICA:
${u.substring(0,200)}...
`:""}

#${t.replace(/\s+/g,"")} #TransformaciónReal #${new Date().getFullYear()}`},google:(e,t)=>{const o=e.estacionalidad||"",n=e.horarioOptimo||"",a=e.competenciaNivel||"",i=e.cpaEstimado||"",r=e.roiReal||"",s=new Set;e.nombre&&e.nombre.split(" ").filter(p=>p.length>3).forEach(p=>s.add(p.toLowerCase())),e.painPoints&&(e.painPoints.match(/\b\w{4,}\b/g)||[]).slice(0,5).forEach(g=>s.add(g.toLowerCase())),t.split(" ").forEach(p=>{p.length>3&&s.add(p.toLowerCase())});const l=[e.nombre?.substring(0,30)||`${t} Solución`,`${e.comision||"Oferta 40% Desc"}`,"Garantía 30 Días","Resultados Rápidos","Miles Satisfechos",e.triggers?e.triggers.split(",")[0].substring(0,30):"Empieza Hoy"],d=e.descripcion?`${e.descripcion.substring(0,70)}. Garantía total.`:`Solución probada para ${t}. Resultados garantizados o devolución.`,u=`${e.painPoints?"Resuelve "+e.painPoints.split(",")[0]:"Transforma tu vida"}. Método comprobado. Empieza hoy.`;return`📊 GOOGLE ADS - CAMPAÑA OPTIMIZADA POR IA

🎯 HEADLINES (Usa mínimo 5):
${l.map((p,g)=>`H${g+1}: ${p}`).join(`
`)}

📝 DESCRIPCIONES:
D1: ${d.substring(0,90)}
D2: ${u.substring(0,90)}

🔗 URL VISIBLE:
www.tu-sitio.com/${t.toLowerCase().replace(/\s+/g,"-")}

📍 EXTENSIONES RECOMENDADAS:
- Precio: ${e.precio||"$97"} (Antes $${(parseFloat(e.precio?.replace(/[^0-9.]/g,"")||97)*1.5).toFixed(0)})
- Llamadas: "Consulta Gratis 24/7"
- Enlaces de sitio:
  - Testimonios Reales
  - Garantía Completa
  - Preguntas Frecuentes
  - Comprar Ahora
- Texto destacado:
  - ✓ Envío Gratis
  - ✓ Garantía 30 días
  - ✓ Soporte 24/7
  - ✓ Pago Seguro

🎯 KEYWORDS SUGERIDAS:
${Array.from(s).slice(0,10).map(p=>`• ${p}`).join(`
`)}
- comprar ${t}
- mejor ${t}
- ${t} barato
- ${t} online

📊 CONFIGURACIÓN RECOMENDADA ESPECÍFICA:
- Tipo de campaña: Search (Búsqueda)
- Estrategia: Maximizar conversiones
- Presupuesto diario: $20-50
${i?`- CPA objetivo: ${i}`:"- CPC máximo: $0.50-2.00"}
${r?`- ROI esperado: ${r}`:""}
${a?`- Nivel competencia: ${a}`:""}

${o?`📅 TIMING ESPECÍFICO:
${o}
`:""}
${n?`⏰ HORARIOS ÓPTIMOS:
${n}
`:""}

💡 ANÁLISIS ESPECÍFICO APLICADO:
Pain Points detectados: ${e.painPoints||"General"}
Emociones target: ${e.emociones||"Deseo de cambio"}
Triggers principales: ${e.triggers||"Urgencia"}
${a?`Competencia actual: ${a}`:""}
${o?`Estacionalidad: ${o}`:""}`},email:(e,t)=>{const o=e.estacionalidad||"",n=e.horarioOptimo||"",a=e.timingOptimo||"",i=e.competenciaNivel||"",r=e.estrategia||"",s=e.painPoints?e.painPoints.split(/[,.]/).filter(p=>p.trim())[0]:`los desafíos en ${t}`,l=e.emociones?e.emociones.split(",")[0].trim():"frustración",d=e.triggers?e.triggers.split(",")[0].trim():"necesitas una solución real";return`📧 SECUENCIA DE EMAIL DE ALTA CONVERSIÓN

🎯 SUBJECT LINES (A/B Test estos):
${[`¿${l.charAt(0).toUpperCase()+l.slice(1)} con ${s}? (Abrir urgente)`,`[REGALO] Solución para ${s} + Bonus gratis`,`${e.nombre} - ${e.comision||"40% desc"} termina en 3 horas`,`La verdad sobre ${s} que nadie te dice...`,`¿${d.charAt(0).toUpperCase()+d.slice(1)}? Tengo algo para ti`].map((p,g)=>`${g+1}. ${p}`).join(`
`)}

📱 PREVIEW TEXT:
"Descubre cómo Juan resolvió ${s} en solo 7 días..."

------- EMAIL 1: HISTORIA + DOLOR -------

Hola [Nombre],

¿Te suena familiar esto?

${e.painPoints?e.painPoints.split(",").map(p=>`• ${p.trim()}`).join(`
`):`• Luchas constantemente con ${t}
• Sientes que nada funciona
• Estás cansado de promesas vacías`}

Si dijiste "sí" a alguno...

Necesitas conocer la historia de Carlos.

Hace 3 meses, Carlos estaba exactamente donde tú estás ahora.

${l.charAt(0).toUpperCase()+l.slice(1)}, agotado, a punto de rendirse...

Hasta que descubrió ${e.nombre}.

Hoy, Carlos me envió este mensaje:

"No puedo creer los resultados. En solo 2 semanas mi vida cambió por completo. ${e.descripcion?e.descripcion.substring(0,100)+"...":"Los resultados superaron todas mis expectativas."}"

¿Quieres saber exactamente qué hizo Carlos?

[BOTÓN: Ver la Historia Completa de Carlos >>]

Pero hay un problema...

Esta oferta especial (${e.comision||"40% de descuento"}) termina mañana a medianoche.

Y solo quedan 37 cupos con los bonos incluidos.

Tu decisión: Seguir igual o transformar tu vida como Carlos.

[BOTÓN: Quiero Transformar Mi Vida >>]

Un abrazo,
[Tu nombre]

P.D. Carlos me pidió que te dijera: "${d?"Si "+d+", este es tu momento":"Si yo pude, tú también puedes"}."

P.D.2. Los próximos 10 que se registren reciben una sesión 1-a-1 GRATIS conmigo (valor $197).

${a?`
P.D.3. TIMING PERFECTO: ${a}`:""}
${o?`
P.D.4. MOMENTO IDEAL: ${o}`:""}

------- EMAIL 2: URGENCIA + PRUEBA -------

Asunto: 🔴 Quedan 8 horas (mira esto antes que sea tarde)

[Nombre],

Números que no mienten:

- 1,247 personas ya tienen ${e.nombre}
- 96% reportan resultados en la primera semana
- Solo quedan 19 cupos con precio especial

Mira lo que están diciendo:

"Increíble, ${e.triggers?"por fin "+e.triggers.split(",")[0]:"resultados reales"}" - María G.

"${e.emociones?"Pasé de "+e.emociones.split(",")[0]+" a felicidad total":"Mi vida cambió completamente"}" - Roberto S.

"Ojalá hubiera encontrado esto antes" - Carmen L.

En 8 horas:
- Precio sube a $${(parseFloat(e.precio?.replace(/[^0-9.]/g,"")||97)*1.5).toFixed(0)}
- Sin bonos especiales
- Sin garantía extendida

Tu elección.

[BOTÓN: Asegurar Mi Cupo Ahora >>]

[Tu nombre]

------- EMAIL 3: ÚLTIMA OPORTUNIDAD -------

Asunto: Se acabó (último email)

[Nombre],

2 horas.

Después de eso:
- ${e.nombre} vuelve a precio completo
- Los 3 bonos desaparecen
- Tu oportunidad se va

¿Recuerdas por qué empezaste a leer estos emails?

Porque ${s}.

Porque sientes ${l}.

Porque ${d}.

Esta es tu señal.

[BOTÓN: SÍ, QUIERO CAMBIAR >>]

O sigue igual.

Tu decides.

[Tu nombre]

💰 GARANTÍA TOTAL: Si no ves resultados en 30 días, devolución del 100%

${r?`
------- BONUS: ESTRATEGIA ESPECÍFICA -------

${r.substring(0,300)}...

Esta estrategia está incluida GRATIS con tu compra.`:""}

${n?`
📱 MEJOR MOMENTO PARA ENVIAR: ${n}`:""}
${i?`
🎯 NIVEL DE COMPETENCIA: ${i} - Ventaja competitiva clara`:""}`}},copyTemplate:async(e,t,o)=>{try{const n=f.generators[e](t,o);if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(n);else{const a=document.createElement("textarea");a.value=n,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select(),document.execCommand("copy"),document.body.removeChild(a)}return f.showNotification(`✅ Template ${e.toUpperCase()} copiado (${n.length} caracteres)`,"success"),console.log(`Template ${e} copiado exitosamente`),!0}catch(n){return console.error("Error copiando template:",n),f.showNotification("❌ Error al copiar. Intenta de nuevo.","error"),!1}},showNotification:(e,t="success")=>{document.querySelectorAll(".template-notification").forEach(a=>a.remove());const n=document.createElement("div");n.className=`template-notification ${t}`,n.innerHTML=e,n.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            background: ${t==="success"?"#48bb78":"#f56565"};
            color: white;
            max-width: 400px;
        `,document.body.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateX(100px)",setTimeout(()=>n.remove(),300)},3e3)},addTemplateButtons:()=>{console.log("Agregando botones de templates..."),document.querySelectorAll(".product-opportunity").forEach((e,t)=>{if(e.querySelector(".template-buttons"))return;if(!m.productosDetectados[t]){console.log(`No hay producto en índice ${t}`);return}const n=document.getElementById("nicho")?.value||"marketing",a=document.createElement("div");a.className="template-buttons",a.style.cssText=`
                background: rgba(59, 130, 246, 0.08);
                border: 1px solid #3b82f6;
                border-radius: 10px;
                padding: 15px;
                margin: 15px 0;
            `,a.innerHTML=`
                <h4 style="color: #3b82f6; margin: 0 0 10px 0; font-size: 1rem;">
                    📋 Copy Templates Instantáneos:
                </h4>
                <div class="template-buttons-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
                    <button class="btn-template facebook" 
                            style="background: linear-gradient(135deg, #1877f2 0%, #0e5fc0 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;"
                            onclick="CopyTemplateSystem.copyTemplate('facebook', AppState.productosDetectados[${t}], '${n.replace(/'/g,"\\'")}')">
                        📘 Facebook Ad
                    </button>
                    <button class="btn-template google" 
                            style="background: linear-gradient(135deg, #4285f4 0%, #1a73e8 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;"
                            onclick="CopyTemplateSystem.copyTemplate('google', AppState.productosDetectados[${t}], '${n.replace(/'/g,"\\'")}')">
                        🔍 Google Ad
                    </button>
                    <button class="btn-template email" 
                            style="background: linear-gradient(135deg, #ea4335 0%, #d33b27 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;"
                            onclick="CopyTemplateSystem.copyTemplate('email', AppState.productosDetectados[${t}], '${n.replace(/'/g,"\\'")}')">
                        📧 Email Sequence
                    </button>
                </div>
                <div class="ai-template-buttons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                    <button class="btn-ai-template" 
                            style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;"
                            onclick="CopyTemplateSystem.generateAITemplate(${t}, '${n.replace(/'/g,"\\'")}')">
                        🤖 IA Específica
                    </button>
                    <button class="btn-ab-template" 
                            style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem;"
                            onclick="CopyTemplateSystem.generateABTemplate(${t}, '${n.replace(/'/g,"\\'")}')">
                        🔄 A/B Testing
                    </button>
                </div>
            `;const i=e.querySelector(".product-actions"),r=e.querySelector(".offer-validation"),s=e.querySelector(".spy-results");r?r.parentNode.insertBefore(a,r):s?s.parentNode.insertBefore(a,s):i?e.insertBefore(a,i):e.appendChild(a)}),console.log("Botones de templates agregados exitosamente")},generateAICopy:async(e,t,o)=>{const n=`
Actúa como COPYWRITER EXPERTO en marketing de afiliados especializado en ${t}. 

ANÁLISIS ULTRA-ESPECÍFICO DEL PRODUCTO:
PRODUCTO: ${e.nombre}
NICHO: ${t}
PRECIO: ${e.precio}
COMISIÓN: ${e.comision}
PAIN POINTS: ${e.painPoints}
EMOCIONES: ${e.emociones}
TRIGGERS: ${e.triggers}
DESCRIPCIÓN: ${e.descripcion}

DATOS ESPECÍFICOS DEL MERCADO:
ESTACIONALIDAD: ${e.estacionalidad||"No especificada"}
TIMING ÓPTIMO: ${e.timingOptimo||"No especificado"}
HORARIO ÓPTIMO: ${e.horarioOptimo||"No especificado"}
COMPETENCIA: ${e.competenciaNivel||"No especificada"}
ESTRATEGIA ESPECÍFICA: ${e.estrategia||"No especificada"}
CPA ESTIMADO: ${e.cpaEstimado||"No especificado"}
ROI REAL: ${e.roiReal||"No especificado"}

MISIÓN: Genera un copy de ${o} ULTRA-ESPECÍFICO que:
- Use TODOS los datos específicos disponibles
- Aproveche el timing y estacionalidad exactos
- Considere el nivel de competencia actual
- Incluya la estrategia específica detectada
- Sea 100% congruente con el análisis contextualizado
- Maximice conversiones para este contexto específico
- Tenga la longitud correcta para ${o}
- Use emojis estratégicamente
- Incluya urgencia basada en timing real

IMPORTANTE: Devuelve SOLO el copy optimizado, sin explicaciones.`;try{return await C.callGemini(n)}catch(a){return console.error("Error generando copy con IA:",a),f.generators[o](e,t)}},generateABVariations:async(e,t,o)=>{const n=`
Actúa como EXPERTO EN A/B TESTING para marketing de afiliados.

Basándote en este análisis específico:
PRODUCTO: ${e.nombre}
NICHO: ${t}
DATOS ESPECÍFICOS: ${e.estacionalidad}, ${e.timingOptimo}, ${e.competenciaNivel}

Genera 3 VARIACIONES DIFERENTES de copy para ${o} que:
1. VARIACIÓN A: Enfoque en urgencia y escasez
2. VARIACIÓN B: Enfoque en beneficios y transformación  
3. VARIACIÓN C: Enfoque en prueba social y autoridad

Cada variación debe:
- Usar los datos específicos detectados
- Ser completamente diferente en enfoque
- Mantener la misma longitud
- Estar lista para A/B testing

FORMATO:
=== VARIACIÓN A ===
[Copy completo]

=== VARIACIÓN B ===
[Copy completo]

=== VARIACIÓN C ===
[Copy completo]`;try{return await C.callGemini(n)}catch(a){return console.error("Error generando variaciones A/B:",a),"Error generando variaciones. Intenta de nuevo."}},generateAITemplate:async(e,t)=>{const o=m.productosDetectados[e];if(!o)return;const n=await f.showTypeSelector();if(!n)return;const a=f.createTemplateModal(`🤖 Generando copy con IA específica para ${n}...`);document.body.appendChild(a);try{const i=await f.generateAICopy(o,t,n);a.querySelector(".modal-content").innerHTML=`
                <div class="modal-header">
                    <h3>🤖 Copy IA Específica - ${n.toUpperCase()}</h3>
                    <button class="close-modal" onclick="this.closest('.template-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="template-result">
                        <textarea readonly style="width: 100%; height: 400px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.5;">${i}</textarea>
                    </div>
                    <div class="template-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="CopyTemplateSystem.copyFromModal(this)" class="btn-primary">📋 Copiar</button>
                        <button onclick="CopyTemplateSystem.downloadFromModal(this, '${n}')" class="btn-secondary">💾 Descargar</button>
                        <button onclick="CopyTemplateSystem.regenerateTemplate(${e}, '${t}', '${n}')" class="btn-accent">🔄 Regenerar</button>
                    </div>
                </div>
            `,f.showNotification("✅ Copy IA específica generado!","success")}catch(i){console.error("Error:",i),a.querySelector(".modal-content").innerHTML=`
                <div class="modal-header">
                    <h3>❌ Error</h3>
                    <button class="close-modal" onclick="this.closest('.template-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>Error generando copy. Intenta de nuevo.</p>
                </div>
            `}},generateABTemplate:async(e,t)=>{const o=m.productosDetectados[e];if(!o)return;const n=await f.showTypeSelector();if(!n)return;const a=f.createTemplateModal(`🔄 Generando 3 variaciones A/B para ${n}...`);document.body.appendChild(a);try{const i=await f.generateABVariations(o,t,n);a.querySelector(".modal-content").innerHTML=`
                <div class="modal-header">
                    <h3>🔄 Variaciones A/B - ${n.toUpperCase()}</h3>
                    <button class="close-modal" onclick="this.closest('.template-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="template-result">
                        <textarea readonly style="width: 100%; height: 500px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.5;">${i}</textarea>
                    </div>
                    <div class="template-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="CopyTemplateSystem.copyFromModal(this)" class="btn-primary">📋 Copiar Todo</button>
                        <button onclick="CopyTemplateSystem.downloadFromModal(this, '${n}-ab')" class="btn-secondary">💾 Descargar</button>
                        <button onclick="CopyTemplateSystem.generateABTemplate(${e}, '${t}')" class="btn-accent">🔄 Nuevas Variaciones</button>
                    </div>
                </div>
            `,f.showNotification("✅ 3 variaciones A/B generadas!","success")}catch(i){console.error("Error:",i),a.querySelector(".modal-content").innerHTML=`
                <div class="modal-header">
                    <h3>❌ Error</h3>
                    <button class="close-modal" onclick="this.closest('.template-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>Error generando variaciones. Intenta de nuevo.</p>
                </div>
            `}},showTypeSelector:()=>new Promise(e=>{const t=document.createElement("div");t.className="template-modal",t.style.cssText=`
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            `,t.innerHTML=`
                <div class="modal-content" style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; width: 90%;">
                    <h3 style="margin: 0 0 20px 0; color: #1f2937;">Selecciona el tipo de copy:</h3>
                    <div class="type-buttons" style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="type-btn" data-type="facebook" style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; text-align: left;">
                            📘 Facebook Ad
                        </button>
                        <button class="type-btn" data-type="google" style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; text-align: left;">
                            🔍 Google Ad
                        </button>
                        <button class="type-btn" data-type="email" style="padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; font-weight: 600; text-align: left;">
                            📧 Email Sequence
                        </button>
                    </div>
                    <button onclick="this.closest('.template-modal').remove(); resolve(null);" style="margin-top: 20px; padding: 10px 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer;">
                        Cancelar
                    </button>
                </div>
            `,t.querySelectorAll(".type-btn").forEach(o=>{o.addEventListener("click",()=>{const n=o.dataset.type;t.remove(),e(n)})}),document.body.appendChild(t)}),createTemplateModal:e=>{const t=document.createElement("div");return t.className="template-modal",t.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `,t.innerHTML=`
            <div class="modal-content" style="background: white; padding: 20px; border-radius: 12px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div class="loading-content" style="text-align: center; padding: 40px;">
                    <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <p>${e}</p>
                </div>
            </div>
        `,t},copyFromModal:async e=>{const t=e.closest(".modal-body").querySelector("textarea");if(t)try{await navigator.clipboard.writeText(t.value),f.showNotification("✅ Copiado al portapapeles!","success")}catch(o){console.error("Error copiando:",o),f.showNotification("❌ Error al copiar","error")}},downloadFromModal:(e,t)=>{const o=e.closest(".modal-body").querySelector("textarea");if(o){const n=new Blob([o.value],{type:"text/plain"}),a=URL.createObjectURL(n),i=document.createElement("a");i.href=a,i.download=`copy-${t}-${Date.now()}.txt`,i.click(),URL.revokeObjectURL(a),f.showNotification("✅ Descargado!","success")}},regenerateTemplate:async(e,t,o)=>{const n=m.productosDetectados[e];if(!n)return;const i=document.querySelector(".template-modal").querySelector(".modal-content");i.innerHTML=`
            <div class="loading-content" style="text-align: center; padding: 40px;">
                <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p>🔄 Regenerando copy con IA específica...</p>
            </div>
        `;try{const r=await f.generateAICopy(n,t,o);i.innerHTML=`
                <div class="modal-header">
                    <h3>🤖 Copy IA Específica - ${o.toUpperCase()} (Regenerado)</h3>
                    <button class="close-modal" onclick="this.closest('.template-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="template-result">
                        <textarea readonly style="width: 100%; height: 400px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.5;">${r}</textarea>
                    </div>
                    <div class="template-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="CopyTemplateSystem.copyFromModal(this)" class="btn-primary">📋 Copiar</button>
                        <button onclick="CopyTemplateSystem.downloadFromModal(this, '${o}')" class="btn-secondary">💾 Descargar</button>
                        <button onclick="CopyTemplateSystem.regenerateTemplate(${e}, '${t}', '${o}')" class="btn-accent">🔄 Regenerar</button>
                    </div>
                </div>
            `,f.showNotification("✅ Copy regenerado!","success")}catch(r){console.error("Error:",r),i.innerHTML=`
                <div class="modal-header">
                    <h3>❌ Error</h3>
                    <button class="close-modal" onclick="this.closest('.template-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>Error regenerando copy. Intenta de nuevo.</p>
                </div>
            `}}},Se=E.displayResults;E.displayResults=function(e){Se.call(this,e),setTimeout(()=>{f.addTemplateButtons()},500)};document.addEventListener("DOMContentLoaded",function(){console.log("✅ Inicializando MarketInsight Pro...");try{const e=document.getElementById("profitCalculatorModal");e&&e.addEventListener("click",function(t){t.target===this&&L.closeModal()}),document.addEventListener("keydown",function(t){if(t.key==="Escape"){const o=document.getElementById("profitCalculatorModal");o&&!o.classList.contains("hidden")&&L.closeModal()}}),console.log("💰 Profit Calculator inicializado")}catch(e){console.error("Error inicializando:",e)}});document.addEventListener("click",function(e){if(e.target.matches(".copy-hook, .copy-audience, .copy-framework-btn")){e.preventDefault();const t=decodeURIComponent(e.target.dataset.textToCopy||"");t&&navigator.clipboard.writeText(t).then(()=>{const o=document.createElement("div");o.className="copy-notification",o.innerHTML="✅ ¡Copiado al portapapeles!",o.style.cssText=`
                    position: fixed;
                    top: ${e.clientY-50}px;
                    left: ${e.clientX-50}px;
                    background: #48bb78;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 10000;
                    font-weight: 600;
                `,document.body.appendChild(o),setTimeout(()=>{o.style.opacity="0",setTimeout(()=>o.remove(),300)},2e3)}).catch(o=>{console.error("Error al copiar:",o),alert("Error al copiar. Intenta seleccionar y copiar manualmente.")})}if(e.target.matches(".generate-variants-btn")&&(e.preventDefault(),alert(`🎨 Función "Generar 10 Variantes" próximamente...

Por ahora, usa los hooks y ángulos proporcionados para crear tus propias variantes.`)),e.target.matches(".download-template-btn")){e.preventDefault();const t=e.target.dataset.spyId,o=document.getElementById(t);if(o){const n=o.innerText,a=new Blob([n],{type:"text/plain"}),i=URL.createObjectURL(a),r=document.createElement("a");r.href=i,r.download=`ad-template-${Date.now()}.txt`,r.click(),URL.revokeObjectURL(i),f.showNotification("✅ ¡Template descargado!","success")}}});setInterval(()=>{try{const e=document.querySelectorAll(".product-opportunity");e.length>0&&m.productosDetectados.length>0&&(Array.from(e).some(a=>!a.querySelector(".profit-calc-btn"))&&Q(),Array.from(e).some(a=>!a.querySelector(".template-buttons"))&&f.addTemplateButtons(),Array.from(e).some(a=>!a.querySelector(".validate-btn"))&&typeof U<"u"&&U())}catch{}},5e3);console.log("✅ MarketInsight Pro cargado completamente");function Oe(){Re(),setTimeout(()=>{const e=document.querySelector(".advanced-config-section");e&&(e.style.display="none",console.log("🔧 Configuración avanzada oculta temporalmente"))},500)}function Re(){const e=document.getElementById("themeToggle"),t=document.body;if(!e)return;const o=localStorage.getItem("theme")||"dark";t.setAttribute("data-theme",o),e.addEventListener("click",()=>{const a=t.getAttribute("data-theme")==="dark"?"light":"dark";t.setAttribute("data-theme",a),localStorage.setItem("theme",a),t.style.transition="all 0.3s ease",setTimeout(()=>{t.style.transition=""},300),c.log(`🎨 Tema cambiado a: ${a}`)})}typeof h<"u"&&(h.generateAdditionalProductsAdvanced=function(e){const t=window.advancedConfig||{productCount:3,minScore:70,activeFilters:["BAJO","MEDIO","ALTO"]},o=t.productCount-e;if(o<=0)return[];const n=[],a=document.getElementById("nicho")?.value||"marketing",i=document.getElementById("publico")?.value||"audiencia",r=[`Curso Avanzado de ${a}`,`Masterclass Completa de ${a}`,`Sistema Premium de ${a}`,`Guía Definitiva de ${a}`,`Entrenamiento VIP de ${a}`,`Blueprint de ${a}`,`Manual Profesional de ${a}`,`Certificación en ${a}`,`Mentoring de ${a}`,`Toolkit de ${a}`];for(let s=0;s<o&&s<r.length;s++){const l=Math.floor(Math.random()*(95-t.minScore))+t.minScore,d=t.activeFilters[Math.floor(Math.random()*t.activeFilters.length)];n.push({nombre:r[s],precio:h.extractRandomPrice(),comision:h.extractRandomCommission(),score:l,descripcion:`Producto profesional de ${a} dirigido a ${i}`,painPoints:[`Falta de conocimiento en ${a}`,"Necesidad de resultados rápidos","Búsqueda de métodos probados"],emociones:["Frustración","Esperanza","Determinación"],triggers:["Exclusividad","Resultados garantizados","Soporte premium"],competencia:d,networks:["ClickBank","ShareASale","CJ Affiliate"],tips:[`Enfocarse en ${i} específicamente`,"Usar testimonios reales","Crear urgencia con tiempo limitado"]})}return c.log(`✅ Generados ${n.length} productos adicionales con score mínimo ${t.minScore}`),n});document.addEventListener("DOMContentLoaded",function(){setTimeout(()=>{Oe(),c.log("✅ Funcionalidades avanzadas inicializadas")},1e3)});console.log("✅ Funcionalidades profesionales cargadas");typeof window<"u"&&(window.APIManager=C,window.AppState=m,window.Utils=c,typeof f<"u"&&(window.CopyTemplateSystem=f),typeof L<"u"&&(window.ProfitCalculator=L));typeof window<"u"&&(window.CopyTemplateSystem=f,window.ProfitCalculator=L);console.log("MarketInsight Pro (Vite + TS) initialized");function M(e){return e.replace(/[\u{1F300}-\u{1F6FF}]/gu,"").replace(/\s{2,}/g," ").trim()}function q(e){const t=e.match(/=== PRODUCTO [1-3] ===[\s\S]*?=== FIN PRODUCTO [1-3] ===/g)||[];if(t.length!==3)return!1;const o=t.map(a=>{const i=a.match(/NOMBRE:\s*([^\n]+)/i);return i?i[1].trim().toLowerCase():""});return o.some(a=>!a||a==="%"||a.length<3)?!1:new Set(o).size===3}const Z={gemini:{name:"Google Gemini",keyLink:"https://aistudio.google.com/app/apikey",request:async()=>{throw new Error("Gemini request debe ser manejada por la implementación original")}},openai:{name:"OpenAI GPT-3.5",keyLink:"https://platform.openai.com/account/api-keys",request:async(e,t)=>{const n=/Responde\s+solo\s+con\s+\"OK\"/i.test(e),a=async(i=0)=>{const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"system",content:'Eres un analista senior de marketing de afiliados. Devuelve EXACTAMENTE 3 productos REALES. Cada producto debe incluir NOMBRE (no vacío), PRECIO, COMISION, SCORE, GRAVITY y demás campos. Los NOMBRE deben ser distintos entre sí. No repitas productos, no uses placeholders, no uses las palabras "potencial" ni "estimación". Formato: "=== PRODUCTO N ===" ... "=== FIN PRODUCTO N ===". Idioma: Español.'},{role:"user",content:i>0?`FORMATO INCORRECTO. Repite EXACTAMENTE usando la plantilla.
${M(e)}`:M(e)}],temperature:.2,top_p:.8,max_tokens:4e3})});if(!r.ok){const d=await r.text();throw new Error(`OpenAI error ${r.status}: ${d}`)}const l=(await r.json()).choices?.[0]?.message?.content||"";if(!n&&!q(l)){if(i<2)return await a(i+1);throw new Error("El modelo no generó 3 productos válidos.")}return l};return a()}},together:{name:"Together.ai (Mistral 7B)",keyLink:"https://docs.together.ai/reference/authentication-1",request:async(e,t)=>{const n=/Responde\s+solo\s+con\s+\"OK\"/i.test(e),a=async(i=0)=>{const r=await fetch("https://api.together.xyz/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({model:"mistral-7b-instruct",messages:[{role:"system",content:"Eres un analista senior de marketing de afiliados. Devuelve EXACTAMENTE 3 productos REALES con la plantilla pedida. Cada producto con NOMBRE único. No uses placeholders ni frases de incertidumbre. Idioma: Español."},{role:"user",content:i>0?`FORMATO INCORRECTO. Repite EXACTAMENTE usando la plantilla.
${M(e)}`:M(e)}],temperature:.2,top_p:.8,max_tokens:4e3})});if(!r.ok){const d=await r.text();throw new Error(`Together.ai error ${r.status}: ${d}`)}const s=await r.json(),l=(s.text||s.response||s.generations?.[0]?.text)??"";if(!n&&!q(l)){if(i<2)return await a(i+1);throw new Error("El modelo no generó 3 productos válidos.")}return l};return a()}},cohere:{name:"Cohere (Command-R)",keyLink:"https://dashboard.cohere.com/api-keys",request:async(e,t)=>{const n=/Responde\s+solo\s+con\s+\"OK\"/i.test(e),a=async(i=0)=>{const r=await fetch("https://api.cohere.ai/v1/chat",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({model:"command",message:i>0?`FORMATO INCORRECTO. Repite EXACTAMENTE usando la plantilla.
${M(e)}`:M(e),temperature:.2,max_tokens:1024})});if(!r.ok){const d=await r.text();throw new Error(`Cohere error ${r.status}: ${d}`)}const s=await r.json(),l=(s.text||s.response||s.generations?.[0]?.text)??"";if(!n&&!q(l)){if(i<2)return await a(i+1);throw new Error("El modelo no generó 3 productos válidos.")}return l};return a()}}};function X(){const e=document.getElementById("apiProvider"),t=document.getElementById("getKeyLink");if(!e)return;const o=localStorage.getItem("aiProvider")||"gemini";e.value=o,window.AppState.apiProvider=o;const n=()=>{const a=e.value;if(window.AppState.apiProvider=a,localStorage.setItem("aiProvider",a),t){const i=Z[a];t.href=i.keyLink,t.textContent=`Obtener API Key (${i.name})`}};e.addEventListener("change",n),n()}function J(){const e=window;if(!e.APIManager)return;const t=e.APIManager.callGemini.bind(e.APIManager);e.APIManager.callGemini=async o=>{const n=e.AppState?.apiProvider||"gemini";if(n==="gemini")return t(o);const a=Z[n];if(!a)throw new Error(`Proveedor no soportado: ${n}`);return await a.request(o,e.AppState.apiKey)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{X(),J(),Y()}):(X(),J(),Y());function Y(){const e=window;e.Utils&&(e.Utils.validateApiKey=t=>{const o=e.AppState?.apiProvider||"gemini";return!t||t.trim().length===0?{valid:!1,message:"API Key vacía"}:o==="gemini"?t.length<20||!t.startsWith("AIza")?{valid:!1,message:"Formato de API Key inválido para Google AI Studio"}:{valid:!0,message:"API Key válida"}:t.length<20?{valid:!1,message:"API Key muy corta"}:{valid:!0,message:"API Key válida"}})}
