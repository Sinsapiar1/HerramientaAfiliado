// ===== CONTENT VIRAL ENHANCED SYSTEM v2.0 =====
// Integración con datos de productos + formatos específicos por plataforma

console.log('🚀 Cargando Content Viral Enhanced System v2.0...');

// ===================== SISTEMA DE INTEGRACIÓN CON PRODUCTOS =====================
const ContentViralEnhanced = {
    
    // Datos del contexto actual
    currentContext: {
        producto: null,
        audiencia: null,
        painPoints: [],
        emociones: [],
        triggers: [],
        competencia: []
    },
    
    // ===== 1. INTEGRACIÓN CON PRODUCTOS DETECTADOS =====
    integrarConProductos: function() {
        console.log('🔗 Integrando con productos detectados...');
        
        // Obtener productos del AppState
        const productos = AppState.productosDetectados || [];
        
        if (productos.length === 0) {
            console.log('⚠️ No hay productos detectados');
            return null;
        }
        
        // Usar el primer producto como referencia (o el seleccionado)
        const producto = productos[0];
        
        // Extraer datos inteligentemente
        this.currentContext.producto = {
            nombre: producto.nombre || 'Producto',
            precio: producto.precio || '$97',
            comision: producto.comision || '40%',
            descripcion: producto.descripcion || '',
            painPoints: this.extraerPainPoints(producto),
            emociones: this.extraerEmociones(producto),
            triggers: this.extraerTriggers(producto),
            nicho: producto.nicho || document.getElementById('nicho')?.value || ''
        };
        
        console.log('✅ Contexto del producto integrado:', this.currentContext.producto);
        return this.currentContext.producto;
    },
    
    // Extraer pain points del análisis del producto
    extraerPainPoints: function(producto) {
        const painPoints = [];
        
        // De campos específicos
        if (producto.painPoints) {
            painPoints.push(...producto.painPoints.split(',').map(p => p.trim()));
        }
        
        // De descripción
        if (producto.descripcion) {
            const problemas = producto.descripcion.match(/(?:problema|dolor|frustración|dificultad|no lograr|falta de)[\w\s]{5,50}/gi) || [];
            painPoints.push(...problemas);
        }
        
        // Defaults por nicho si no hay datos
        if (painPoints.length === 0) {
            const nicho = producto.nicho?.toLowerCase() || '';
            if (nicho.includes('peso') || nicho.includes('fitness')) {
                painPoints.push('No lograr bajar de peso', 'Falta de energía', 'No tener tiempo para ejercicio');
            } else if (nicho.includes('dinero') || nicho.includes('financiero')) {
                painPoints.push('Falta de dinero extra', 'Miedo a las inversiones', 'No saber por dónde empezar');
            } else {
                painPoints.push('Falta de resultados', 'Pérdida de tiempo', 'Frustración constante');
            }
        }
        
        return painPoints.slice(0, 3); // Top 3
    },
    
    // Extraer emociones del producto
    extraerEmociones: function(producto) {
        const emociones = [];
        
        if (producto.emociones) {
            emociones.push(...producto.emociones.split(',').map(e => e.trim()));
        }
        
        // Emociones inferidas del nicho
        const nicho = producto.nicho?.toLowerCase() || '';
        if (nicho.includes('salud') || nicho.includes('fitness')) {
            emociones.push('inseguridad', 'esperanza', 'determinación');
        } else if (nicho.includes('dinero') || nicho.includes('riqueza')) {
            emociones.push('ansiedad financiera', 'ambición', 'miedo al fracaso');
        } else {
            emociones.push('frustración', 'esperanza', 'urgencia');
        }
        
        return [...new Set(emociones)].slice(0, 3);
    },
    
    // Extraer triggers del producto
    extraerTriggers: function(producto) {
        const triggers = [];
        
        if (producto.triggers) {
            triggers.push(...producto.triggers.split(',').map(t => t.trim()));
        }
        
        // Triggers por tipo de producto
        const precio = parseFloat(producto.precio?.replace(/[^0-9.]/g, '') || '0');
        if (precio < 50) {
            triggers.push('precio accesible', 'riesgo bajo', 'prueba ahora');
        } else if (precio > 200) {
            triggers.push('inversión seria', 'exclusividad', 'resultados premium');
        } else {
            triggers.push('relación precio-valor', 'oportunidad', 'acción inmediata');
        }
        
        return triggers.slice(0, 3);
    },
    
    // ===== 2. FORMATOS ESPECÍFICOS POR PLATAFORMA =====
    formatosPorPlataforma: {
        
        tiktok: {
            nombre: 'TikTok/Reels',
            icono: '📱',
            estructura: {
                hook: { tiempo: '0-3s', proposito: 'Parar el scroll' },
                problema: { tiempo: '3-8s', proposito: 'Agitar el dolor' },
                solucion: { tiempo: '8-35s', proposito: 'Presentar producto' },
                pruebaSocial: { tiempo: '35-45s', proposito: 'Testimonios rápidos' },
                cta: { tiempo: '45-60s', proposito: 'Acción urgente' }
            },
            generarContenido: function(contexto) {
                const producto = contexto.producto;
                const painPoint = producto.painPoints[0] || 'este problema';
                const emocion = producto.emociones[0] || 'frustración';
                
                return {
                    hook: `POV: Descubriste el secreto que resolvió tu ${painPoint}`,
                    problema: `¿Te pasa que sufres de ${painPoint} y ya probaste todo?`,
                    solucion: `${producto.nombre} cambió mi vida en 21 días porque...`,
                    pruebaSocial: `Ya somos +50k personas que resolvimos ${painPoint}`,
                    cta: `Link en bio con ${producto.comision} de descuento HOY SOLO`,
                    hashtags: ContentViralEnhanced.generarHashtags('tiktok', producto.nicho),
                    musica: 'Trending audio viral del momento',
                    efectos: 'Zoom en segundo 8, transición en 25s',
                    duracion: '60 segundos',
                    viralScore: '8.5/10'
                };
            }
        },
        
        instagram: {
            nombre: 'Instagram Stories + Feed',
            icono: '📸',
            estructura: {
                hook: 'Primeras 2 líneas irresistibles',
                desarrollo: 'Historia personal + beneficios',
                cta: 'Llamada a acción en comments/DM'
            },
            generarContenido: function(contexto) {
                const producto = contexto.producto;
                const painPoint = producto.painPoints[0] || 'este problema';
                
                return {
                    captionHook: `Esto me cambió la vida después de sufrir ${painPoint} por años...`,
                    captionCompleta: ContentViralEnhanced.generarCaptionInstagram(contexto),
                    hashtags: ContentViralEnhanced.generarHashtags('instagram', producto.nicho),
                    storiesIdeas: [
                        `Antes vs Después de usar ${producto.nombre}`,
                        `5 cosas que nadie te dice sobre ${painPoint}`,
                        `Por qué ${producto.nombre} es diferente (swipe up)`
                    ],
                    carruselIdeas: [
                        `Slide 1: El problema que todos tenemos`,
                        `Slide 2-4: Los 3 errores comunes`,
                        `Slide 5: La solución que funciona`,
                        `Slide 6: Resultados reales`,
                        `Slide 7: Cómo empezar hoy`
                    ]
                };
            }
        },
        
        facebook: {
            nombre: 'Facebook Ads + Posts',
            icono: '📊',
            estructura: {
                headline: 'Titular que convierte',
                primaryText: 'Texto principal (125 palabras max)',
                ctaButton: 'Botón específico'
            },
            generarContenido: function(contexto) {
                const producto = contexto.producto;
                const painPoint = producto.painPoints[0] || 'este problema';
                
                return {
                    headline: `Resuelve ${painPoint} en 30 días o dinero devuelto`,
                    primaryText: ContentViralEnhanced.generarTextoFacebook(contexto),
                    ctaButton: 'Más información',
                    targeting: ContentViralEnhanced.generarTargeting(contexto),
                    presupuestoSugerido: '$20-50/día',
                    cpcEstimado: '$0.80-$2.50'
                };
            }
        },
        
        email: {
            nombre: 'Email Marketing',
            icono: '📧',
            estructura: {
                subject: 'Línea de asunto irresistible',
                preview: 'Texto preview que abre',
                body: 'Cuerpo del email'
            },
            generarContenido: function(contexto) {
                const producto = contexto.producto;
                const painPoint = producto.painPoints[0] || 'este problema';
                
                return {
                    subjectLines: [
                        `Urgent: Tu ${painPoint} tiene solución (prueba adjunta)`,
                        `[PERSONAL] ¿Por qué sigues sufriendo ${painPoint}?`,
                        `Re: ${producto.nombre} - resultados en 48h`
                    ],
                    preview: `Los primeros 50 que vean esto...`,
                    emailBody: ContentViralEnhanced.generarEmailBody(contexto),
                    secuencia: [
                        'Email 1: Despertar conciencia del problema',
                        'Email 2: Agitar el dolor + historia personal',
                        'Email 3: Presentar solución + prueba social',
                        'Email 4: Urgencia + escasez',
                        'Email 5: Última oportunidad'
                    ]
                };
            }
        },
        
        youtube: {
            nombre: 'YouTube Long-form',
            icono: '🎥',
            estructura: {
                titulo: 'Título optimizado para CTR',
                thumbnail: 'Descripción del thumbnail',
                script: 'Script completo con timestamps'
            },
            generarContenido: function(contexto) {
                const producto = contexto.producto;
                const painPoint = producto.painPoints[0] || 'este problema';
                
                return {
                    titulos: [
                        `Cómo resolví ${painPoint} en 30 días (método que FUNCIONA)`,
                        `Doctor revela: Por qué tienes ${painPoint} (y cómo solucionarlo)`,
                        `${producto.nombre} REVIEW HONESTA: ¿Realmente funciona?`
                    ],
                    thumbnail: `Imagen: Before/After + texto "30 días" + cara sorprendida`,
                    scriptIntro: ContentViralEnhanced.generarScriptYoutube(contexto),
                    tags: ContentViralEnhanced.generarHashtags('youtube', producto.nicho),
                    duracionSugerida: '8-12 minutos',
                    momentosClave: [
                        '0:00 Hook viral',
                        '0:30 Mi historia personal',
                        '2:00 Los 3 errores comunes',
                        '5:00 La solución que encontré',
                        '8:00 Resultados y proof',
                        '10:00 Cómo empezar'
                    ]
                };
            }
        }
    },
    
    // ===== 3. GENERADORES DE CONTENIDO ESPECÍFICO =====
    
    generarCaptionInstagram: function(contexto) {
        const producto = contexto.producto;
        const painPoint = producto.painPoints[0] || 'este problema';
        const emocion = producto.emociones[0] || 'frustración';
        
        return `Esto me cambió la vida después de sufrir ${painPoint} por años... 😭➡️😍

¿Te pasa que has probado TODO y nada funciona? 

Yo estaba igual. ${emocion.charAt(0).toUpperCase() + emocion.slice(1)} constante, sin esperanza...

Hasta que descubrí ${producto.nombre} 🤯

En solo 21 días:
✅ Resolví completamente ${painPoint}
✅ Recuperé mi confianza 
✅ Cambié mi vida para siempre

Si estás listo/a para el cambio REAL, comenta "YO" 👇

P.D: Link en bio con descuento especial HOY 🔥

#transformacion #cambio #resultados #${producto.nicho.replace(/\s+/g, '')}`
    },
    
    generarTextoFacebook: function(contexto) {
        const producto = contexto.producto;
        const painPoint = producto.painPoints[0] || 'este problema';
        
        return `🚨 ¿Cansado/a de ${painPoint}?

Descubre el método que está cambiando vidas:

→ ${producto.nombre}
→ Resultados en 30 días o menos
→ +10,000 personas ya lo usan
→ Garantía de satisfacción

"Después de años sufriendo ${painPoint}, finalmente encontré la solución que funciona de verdad." - María, 34 años

⏰ Oferta especial termina en 24 horas
💎 Solo los primeros 100
🎁 Bonus gratis incluidos

¿Listo para cambiar tu vida?`;
    },
    
    generarEmailBody: function(contexto) {
        const producto = contexto.producto;
        const painPoint = producto.painPoints[0] || 'este problema';
        
        return `Hola [NOMBRE],

¿Puedo preguntarte algo personal?

¿Cuántas veces has intentado resolver ${painPoint} y has fallado?

Si eres como el 90% de las personas, probablemente muchas...

Pero no es tu culpa.

El problema es que nadie te ha enseñado el método CORRECTO.

${producto.nombre} cambia eso.

En los últimos 30 días, hemos ayudado a más de 10,000 personas a:

✅ Resolver ${painPoint} definitivamente
✅ Recuperar su confianza
✅ Cambiar su vida para siempre

Y ahora es tu turno.

Pero hay un problema...

Solo tenemos capacidad para 100 personas más este mes.

Y ya van 73.

Si quieres ser una de las 27 restantes, necesitas actuar AHORA.

[BOTÓN: SÍ, QUIERO CAMBIAR MI VIDA]

Nos vemos del otro lado,
[TU NOMBRE]

P.D: Esta oportunidad no volverá hasta dentro de 6 meses. No la dejes pasar.`;
    },
    
    generarScriptYoutube: function(contexto) {
        const producto = contexto.producto;
        const painPoint = producto.painPoints[0] || 'este problema';
        
        return `[0:00] ¿Qué tal si te dijera que existe una forma de resolver ${painPoint} en solo 30 días, incluso si ya has probado todo?

[0:10] Quédate hasta el final porque voy a compartir contigo el método exacto que cambió mi vida y la de más de 10,000 personas.

[0:20] Pero antes, déjame contarte mi historia...

[0:30] Hace 2 años, yo también sufría de ${painPoint}. Había probado TODO: [lista 3-4 métodos comunes]

[1:00] Nada funcionaba. Estaba frustrado, sin esperanza, pensando que nunca iba a resolver este problema...

[1:30] Hasta que un día, completamente por casualidad, descubrí ${producto.nombre}...

[2:00] Al principio era escéptico. ¿Cómo algo tan simple podía funcionar cuando nada más lo había hecho?

[2:30] Pero decidí probarlo. Y lo que pasó en los siguientes 30 días cambió mi vida para siempre...

[Continúa desarrollando la historia, beneficios, prueba social y call to action]`;
    },
    
    // ===== 4. GENERADORES DE HASHTAGS INTELIGENTES =====
    
    generarHashtags: function(plataforma, nicho) {
        const hashtagsBase = {
            tiktok: ['fyp', 'viral', 'trending', 'transformation', 'results'],
            instagram: ['transformation', 'before-after', 'results', 'motivation', 'inspiration'],
            youtube: ['how-to', 'tutorial', 'review', 'transformation', 'results'],
            facebook: [] // Facebook no usa hashtags tanto
        };
        
        const hashtagsNicho = this.generarHashtagsPorNicho(nicho);
        const hashtagsPlataforma = hashtagsBase[plataforma] || [];
        
        return [...hashtagsPlataforma, ...hashtagsNicho].slice(0, 10);
    },
    
    generarHashtagsPorNicho: function(nicho) {
        const nichoLower = nicho.toLowerCase();
        
        if (nichoLower.includes('peso') || nichoLower.includes('fitness')) {
            return ['weightloss', 'fitness', 'health', 'diet', 'workout'];
        } else if (nichoLower.includes('dinero') || nichoLower.includes('negocio')) {
            return ['money', 'business', 'entrepreneur', 'success', 'wealth'];
        } else if (nichoLower.includes('relacion') || nichoLower.includes('amor')) {
            return ['love', 'relationship', 'dating', 'couples', 'romance'];
        } else {
            return ['success', 'transformation', 'change', 'goals', 'motivation'];
        }
    },
    
    // ===== 5. TARGETING INTELIGENTE =====
    
    generarTargeting: function(contexto) {
        const producto = contexto.producto;
        const nicho = producto.nicho.toLowerCase();
        
        const targeting = {
            audiencia: 'Personas interesadas en ' + producto.nicho,
            edad: '25-45 años',
            genero: 'Todos',
            ubicacion: 'Países de habla hispana',
            intereses: [],
            comportamientos: [],
            exclusiones: []
        };
        
        // Intereses por nicho
        if (nicho.includes('peso') || nicho.includes('fitness')) {
            targeting.intereses = ['Fitness', 'Nutrición', 'Pérdida de peso', 'Ejercicio'];
            targeting.comportamientos = ['Compran productos de fitness online'];
        } else if (nicho.includes('dinero') || nicho.includes('negocio')) {
            targeting.intereses = ['Emprendimiento', 'Inversiones', 'Negocios online'];
            targeting.comportamientos = ['Compran cursos online', 'Buscan oportunidades de negocio'];
        }
        
        return targeting;
    },
    
    // ===== 6. FUNCIÓN PRINCIPAL MEJORADA =====
    
    generarContenidoMejorado: async function(tiposSeleccionados) {
        console.log('🚀 Generando contenido mejorado para:', tiposSeleccionados);
        
        // 1. Integrar datos de productos
        const contextoProducto = this.integrarConProductos();
        if (!contextoProducto) {
            throw new Error('No hay productos detectados. Ejecuta el análisis principal primero.');
        }
        
        // 2. Obtener configuración adicional
        const configuracion = {
            salesAngle: document.getElementById('salesAngle')?.value || 'problema-agitacion',
            controversyLevel: document.getElementById('controversyLevel')?.value || 'medium',
            powerWords: document.getElementById('powerWords')?.value || '',
            audienciaConfig: {
                genero: document.getElementById('avatarGender')?.value || 'mixto',
                edad: document.getElementById('avatarAge')?.value || '25-35',
                ingresos: document.getElementById('avatarIncome')?.value || 'medio'
            }
        };
        
        // 3. Generar contenido para cada plataforma seleccionada
        const contenidoGenerado = {};
        
        for (const tipo of tiposSeleccionados) {
            const plataforma = this.formatosPorPlataforma[tipo];
            if (plataforma) {
                console.log(`📱 Generando contenido para ${plataforma.nombre}...`);
                
                const contextoCompleto = {
                    producto: contextoProducto,
                    configuracion: configuracion,
                    plataforma: tipo
                };
                
                contenidoGenerado[tipo] = {
                    plataforma: plataforma.nombre,
                    icono: plataforma.icono,
                    contenido: plataforma.generarContenido(contextoCompleto),
                    estructura: plataforma.estructura
                };
            }
        }
        
        return {
            contexto: contextoProducto,
            configuracion: configuracion,
            contenido: contenidoGenerado,
            resumen: {
                producto: contextoProducto.nombre,
                painPointPrincipal: contextoProducto.painPoints[0],
                emocionPrincipal: contextoProducto.emociones[0],
                plataformasGeneradas: tiposSeleccionados.length,
                timestamp: new Date().toISOString()
            }
        };
    }
};

// ===== 7. SOBRESCRIBIR FUNCIÓN ORIGINAL =====

// Guardar referencia a la función original
window.generateViralContentOriginal = window.generateViralContent;

// Nueva función mejorada
async function generateViralContent() {
    console.log('🚀 Ejecutando generador de contenido MEJORADO...');
    
    if (selectedContentTypes.size === 0) {
        alert('⚠️ Selecciona al menos un tipo de contenido');
        return;
    }
    
    if (!AppState.apiKey) {
        alert('⚠️ Configura tu API Key primero');
        return;
    }
    
    const btn = document.getElementById('generateContentBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '🤖 Generando contenido inteligente...';
    btn.disabled = true;
    
    try {
        // Usar el nuevo sistema mejorado
        const tiposSeleccionados = Array.from(selectedContentTypes);
        const resultadoCompleto = await ContentViralEnhanced.generarContenidoMejorado(tiposSeleccionados);
        
        // Mostrar resultados mejorados
        mostrarResultadosContenidoMejorado(resultadoCompleto);
        
        Utils.showStatus(`✅ Contenido inteligente generado para ${tiposSeleccionados.length} plataformas`, 'success');
        
    } catch (error) {
        console.error('Error en generador mejorado:', error);
        
        // Fallback a la función original si hay error
        console.log('🔄 Usando fallback al generador original...');
        try {
            await window.generateViralContentOriginal();
        } catch (fallbackError) {
            Utils.showStatus(`❌ Error: ${error.message}`, 'error');
        }
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ===== 8. MOSTRAR RESULTADOS MEJORADOS =====

function mostrarResultadosContenidoMejorado(resultado) {
    let resultsSection = document.getElementById('contentResults');
    if (!resultsSection) {
        resultsSection = document.createElement('div');
        resultsSection.id = 'contentResults';
        resultsSection.className = 'content-results';
        document.querySelector('.main-content').appendChild(resultsSection);
    }
    
    // Crear HTML mejorado
    let html = `
        <h2>🎯 Contenido Viral Inteligente</h2>
        
        <div class="content-context">
            <h3>📊 Contexto del Producto</h3>
            <div class="context-grid">
                <div class="context-item">
                    <strong>Producto:</strong> ${resultado.contexto.nombre}
                </div>
                <div class="context-item">
                    <strong>Precio:</strong> ${resultado.contexto.precio}
                </div>
                <div class="context-item">
                    <strong>Pain Point Principal:</strong> ${resultado.resumen.painPointPrincipal}
                </div>
                <div class="context-item">
                    <strong>Emoción Target:</strong> ${resultado.resumen.emocionPrincipal}
                </div>
            </div>
        </div>
        
        <div class="content-platforms">
    `;
    
    // Generar contenido para cada plataforma
    Object.entries(resultado.contenido).forEach(([tipo, datos]) => {
        html += `
            <div class="platform-content">
                <h3>${datos.icono} ${datos.plataforma}</h3>
                <div class="platform-details">
                    ${generarHTMLPlataforma(tipo, datos)}
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div class="export-buttons" style="text-align: center; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="copiarContenidoMejorado()">📋 Copiar Todo</button>
            <button class="btn btn-secondary" onclick="descargarContenidoMejorado()">📄 Descargar</button>
            <button class="btn btn-primary" onclick="exportarAFunnelArchitect()">🏗️ Usar en Funnels</button>
        </div>
    `;
    
    resultsSection.innerHTML = html;
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Guardar para exportar
    window.lastContentGeneratedEnhanced = resultado;
}

function generarHTMLPlataforma(tipo, datos) {
    const contenido = datos.contenido;
    
    switch (tipo) {
        case 'tiktok':
            return `
                <div class="tiktok-content">
                    <div class="script-timeline">
                        <div class="timeline-item">
                            <strong>Hook (0-3s):</strong> ${contenido.hook}
                        </div>
                        <div class="timeline-item">
                            <strong>Problema (3-8s):</strong> ${contenido.problema}
                        </div>
                        <div class="timeline-item">
                            <strong>Solución (8-35s):</strong> ${contenido.solucion}
                        </div>
                        <div class="timeline-item">
                            <strong>Prueba Social (35-45s):</strong> ${contenido.pruebaSocial}
                        </div>
                        <div class="timeline-item">
                            <strong>CTA (45-60s):</strong> ${contenido.cta}
                        </div>
                    </div>
                    <div class="metadata">
                        <p><strong>Hashtags:</strong> #${contenido.hashtags.join(' #')}</p>
                        <p><strong>Música:</strong> ${contenido.musica}</p>
                        <p><strong>Efectos:</strong> ${contenido.efectos}</p>
                        <p><strong>Viral Score:</strong> ${contenido.viralScore}</p>
                    </div>
                </div>
            `;
            
        case 'instagram':
            return `
                <div class="instagram-content">
                    <div class="caption-section">
                        <h4>Caption Completa:</h4>
                        <div class="caption-text">${contenido.captionCompleta.replace(/\n/g, '<br>')}</div>
                    </div>
                    <div class="stories-section">
                        <h4>Ideas para Stories:</h4>
                        <ul>
                            ${contenido.storiesIdeas.map(idea => `<li>${idea}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="carousel-section">
                        <h4>Ideas para Carrusel:</h4>
                        <ul>
                            ${contenido.carruselIdeas.map(idea => `<li>${idea}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
        case 'facebook':
            return `
                <div class="facebook-content">
                    <div class="ad-preview">
                        <h4>Preview del Ad:</h4>
                        <div class="ad-headline">${contenido.headline}</div>
                        <div class="ad-text">${contenido.primaryText.replace(/\n/g, '<br>')}</div>
                        <div class="ad-cta">[${contenido.ctaButton}]</div>
                    </div>
                    <div class="targeting-info">
                        <h4>Targeting Sugerido:</h4>
                        <p><strong>Audiencia:</strong> ${contenido.targeting.audiencia}</p>
                        <p><strong>Edad:</strong> ${contenido.targeting.edad}</p>
                        <p><strong>Presupuesto:</strong> ${contenido.presupuestoSugerido}</p>
                        <p><strong>CPC Estimado:</strong> ${contenido.cpcEstimado}</p>
                    </div>
                </div>
            `;
            
        case 'email':
            return `
                <div class="email-content">
                    <div class="subject-lines">
                        <h4>Subject Lines:</h4>
                        <ul>
                            ${contenido.subjectLines.map((subject, i) => `<li><strong>Opción ${i+1}:</strong> ${subject}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="email-body">
                        <h4>Cuerpo del Email:</h4>
                        <div class="email-text">${contenido.emailBody.replace(/\n/g, '<br>')}</div>
                    </div>
                    <div class="sequence">
                        <h4>Secuencia Sugerida:</h4>
                        <ol>
                            ${contenido.secuencia.map(email => `<li>${email}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `;
            
        case 'youtube':
            return `
                <div class="youtube-content">
                    <div class="titles">
                        <h4>Títulos Optimizados:</h4>
                        <ul>
                            ${contenido.titulos.map((titulo, i) => `<li><strong>Opción ${i+1}:</strong> ${titulo}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="thumbnail">
                        <h4>Thumbnail:</h4>
                        <p>${contenido.thumbnail}</p>
                    </div>
                    <div class="script">
                        <h4>Script Intro:</h4>
                        <div class="script-text">${contenido.scriptIntro.replace(/\n/g, '<br>')}</div>
                    </div>
                    <div class="timestamps">
                        <h4>Momentos Clave:</h4>
                        <ul>
                            ${contenido.momentosClave.map(momento => `<li>${momento}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
        default:
            return `<div class="generic-content">${JSON.stringify(contenido, null, 2)}</div>`;
    }
}

// ===== 9. FUNCIONES DE EXPORTACIÓN MEJORADAS =====

function copiarContenidoMejorado() {
    if (window.lastContentGeneratedEnhanced) {
        const texto = formatearContenidoParaCopiar(window.lastContentGeneratedEnhanced);
        navigator.clipboard.writeText(texto);
        Utils.showStatus('✅ Contenido completo copiado', 'success');
    }
}

function descargarContenidoMejorado() {
    if (window.lastContentGeneratedEnhanced) {
        const texto = formatearContenidoParaCopiar(window.lastContentGeneratedEnhanced);
        const blob = new Blob([texto], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contenido-viral-inteligente-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        Utils.showStatus('✅ Contenido descargado', 'success');
    }
}

function formatearContenidoParaCopiar(resultado) {
    let texto = `CONTENIDO VIRAL INTELIGENTE
${'='.repeat(50)}

CONTEXTO DEL PRODUCTO:
- Producto: ${resultado.contexto.nombre}
- Precio: ${resultado.contexto.precio}
- Pain Point Principal: ${resultado.resumen.painPointPrincipal}
- Emoción Target: ${resultado.resumen.emocionPrincipal}

${'='.repeat(50)}

`;

    Object.entries(resultado.contenido).forEach(([tipo, datos]) => {
        texto += `${datos.icono} ${datos.plataforma.toUpperCase()}
${'-'.repeat(30)}

`;
        
        const contenido = datos.contenido;
        switch (tipo) {
            case 'tiktok':
                texto += `SCRIPT TIKTOK/REELS:

Hook (0-3s): ${contenido.hook}
Problema (3-8s): ${contenido.problema}
Solución (8-35s): ${contenido.solucion}
Prueba Social (35-45s): ${contenido.pruebaSocial}
CTA (45-60s): ${contenido.cta}

Hashtags: #${contenido.hashtags.join(' #')}
Música: ${contenido.musica}
Efectos: ${contenido.efectos}
Viral Score: ${contenido.viralScore}

`;
                break;
                
            case 'instagram':
                texto += `CAPTION INSTAGRAM:

${contenido.captionCompleta}

STORIES IDEAS:
${contenido.storiesIdeas.map((idea, i) => `${i+1}. ${idea}`).join('\n')}

CARRUSEL IDEAS:
${contenido.carruselIdeas.map((idea, i) => `${i+1}. ${idea}`).join('\n')}

`;
                break;
                
            case 'facebook':
                texto += `FACEBOOK AD:

Headline: ${contenido.headline}

Primary Text:
${contenido.primaryText}

CTA Button: ${contenido.ctaButton}
Presupuesto: ${contenido.presupuestoSugerido}
CPC Estimado: ${contenido.cpcEstimado}

`;
                break;
                
            case 'email':
                texto += `EMAIL MARKETING:

SUBJECT LINES:
${contenido.subjectLines.map((subject, i) => `${i+1}. ${subject}`).join('\n')}

EMAIL BODY:
${contenido.emailBody}

SECUENCIA:
${contenido.secuencia.map((email, i) => `${i+1}. ${email}`).join('\n')}

`;
                break;
                
            case 'youtube':
                texto += `YOUTUBE VIDEO:

TÍTULOS:
${contenido.titulos.map((titulo, i) => `${i+1}. ${titulo}`).join('\n')}

THUMBNAIL: ${contenido.thumbnail}

SCRIPT INTRO:
${contenido.scriptIntro}

MOMENTOS CLAVE:
${contenido.momentosClave.join('\n')}

`;
                break;
        }
        
        texto += '\n';
    });
    
    return texto;
}

// ===== 10. INICIALIZACIÓN =====

console.log('✅ Content Viral Enhanced System v2.0 cargado correctamente');

// Auto-ejecutar cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎯 Content Viral Enhanced listo para usar');
    });
} else {
    console.log('🎯 Content Viral Enhanced listo para usar');
}