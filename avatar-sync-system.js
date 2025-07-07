// ===== AVATAR SYNC SYSTEM v1.0 =====
// Sistema de sincronización automática Avatar + Contenido + Producto

console.log('🚀 Cargando Avatar Sync System v1.0...');

const AvatarSyncSystem = {
    
    // ===== 1. AUTO-GENERADOR DE AVATAR ESPECÍFICO POR PRODUCTO =====
    
    async generarAvatarEspecifico(contextoProducto, tiposContenido) {
        console.log('🎯 Generando avatar específico para:', contextoProducto.nombre);
        
        if (!AppState.apiKey) {
            console.log('⚠️ No hay API Key, usando avatar genérico');
            return this.crearAvatarGenerico(contextoProducto);
        }
        
        const prompt = this.crearPromptAvatarEspecifico(contextoProducto, tiposContenido);
        
        try {
            const respuestaIA = await APIManager.callGemini(prompt);
            const avatarProcesado = this.procesarRespuestaAvatar(respuestaIA, contextoProducto);
            
            console.log('✅ Avatar específico generado:', avatarProcesado.nombre);
            return avatarProcesado;
            
        } catch (error) {
            console.error('Error generando avatar específico:', error);
            return this.crearAvatarGenerico(contextoProducto);
        }
    },
    
    // Crear prompt ultra-específico para el avatar
    crearPromptAvatarEspecifico(contextoProducto, tiposContenido) {
        const painPoint = contextoProducto.painPoints[0] || 'este problema';
        const emocion = contextoProducto.emociones[0] || 'frustración';
        const precio = contextoProducto.precio;
        const nicho = contextoProducto.nicho;
        
        return `Actúa como EXPERTO EN BUYER PERSONAS con 15+ años creando avatares ultra-específicos para marketing de afiliados.

🎯 MISIÓN: Crear un AVATAR ESPECÍFICO para quien compraría "${contextoProducto.nombre}" a ${precio}.

📊 CONTEXTO DEL PRODUCTO:
- Producto: ${contextoProducto.nombre}
- Precio: ${precio}
- Nicho: ${nicho}
- Pain Point Principal: ${painPoint}
- Emoción Target: ${emocion}
- Tipos de contenido: ${tiposContenido.join(', ')}

🧠 CREAR AVATAR ULTRA-ESPECÍFICO:

=== PERFIL DEMOGRÁFICO ===
NOMBRE: [Nombre típico del nicho]
EDAD: [Rango específico para ${precio}]
OCUPACIÓN: [Trabajo que permite gastar ${precio}]
UBICACIÓN: [Ciudad/región específica]
INGRESOS: [Rango que justifica ${precio}]
FAMILIA: [Situación que genera ${painPoint}]

=== PSICOLOGÍA PROFUNDA ===
PROBLEMA PRINCIPAL: ${painPoint} [¿Por qué específicamente?]
FRUSTRACIÓN DIARIA: [Cómo ${painPoint} afecta su día a día]
MIEDO SECRETO: [Qué teme que pase si no resuelve ${painPoint}]
DESEO PROFUNDO: [Qué realmente quiere lograr con ${contextoProducto.nombre}]
EMOCIÓN DOMINANTE: ${emocion} [¿Cuándo la siente más fuerte?]

=== COMPORTAMIENTO DIGITAL ===
PLATAFORMAS ACTIVAS: [Específicas para ${nicho}]
HORARIOS ONLINE: [Cuándo consume contenido sobre ${nicho}]
CONTENIDO QUE BUSCA: [Qué tipo de posts/videos ve sobre ${painPoint}]
INFLUENCERS QUE SIGUE: [Tipos específicos del ${nicho}]
HASHTAGS QUE USA: [Relacionados con ${painPoint}]

=== PROCESO DE COMPRA ESPECÍFICO ===
MOMENTO GATILLO: [Cuándo decide buscar solución para ${painPoint}]
PRIMERA REACCIÓN: [Qué piensa al ver ${contextoProducto.nombre}]
OBJECIÓN PRINCIPAL: [Por qué dudaría de gastar ${precio}]
PRUEBA SOCIAL NECESARIA: [Qué evidencia necesita para ${nicho}]
URGENCIA QUE FUNCIONA: [Qué tipo de presión temporal responde]

=== PERSONALIDAD Y VALORES ===
PERSONALIDAD: [3 rasgos específicos del ${nicho}]
VALORES PRINCIPALES: [Qué más valora en la vida]
ESTILO DE COMUNICACIÓN: [Formal/informal/técnico/emocional]
LENGUAJE QUE USA: [Jerga específica del ${nicho}]
PALABRAS QUE LO MOTIVAN: [Términos que generan acción]
PALABRAS QUE LO ALEJAN: [Términos que evitar en ${nicho}]

=== CONTEXTO DE ${contextoProducto.nombre} ===
POR QUÉ NECESITA ESTO: [Razón específica para ${contextoProducto.nombre}]
QUÉ HA INTENTADO ANTES: [Soluciones previas fallidas para ${painPoint}]
EXPECTATIVA REALISTA: [Qué espera lograr con ${precio} invertido]
TIEMPO DISPONIBLE: [Cuánto tiempo puede dedicar al ${nicho}]
NIVEL DE COMPROMISO: [Qué tan serio está sobre resolver ${painPoint}]

🎯 RESULTADO: Avatar TAN específico que cualquier contenido viral para ${contextoProducto.nombre} le hable directamente y convierta 5x más.

IMPORTANTE:
- Ser súper específico con detalles del ${nicho}
- Conectar directamente con ${painPoint}
- Justificar por qué pagaría ${precio}
- Hacer que sea el cliente IDEAL para ${contextoProducto.nombre}`;
    },
    
    // Procesar respuesta de IA y estructurar avatar
    procesarRespuestaAvatar(respuestaIA, contextoProducto) {
        // Extraer campos específicos
        const extractField = (fieldName, text) => {
            const regex = new RegExp(`${fieldName}:?\\s*([^\\n]+)`, 'i');
            const match = text.match(regex);
            return match ? match[1].trim() : `Información sobre ${fieldName}`;
        };
        
        const extractSection = (sectionName, text) => {
            const regex = new RegExp(`=== ${sectionName} ===([\\s\\S]*?)(?:===|$)`, 'i');
            const match = text.match(regex);
            return match ? match[1].trim() : `Información de ${sectionName}`;
        };
        
        return {
            // Datos básicos
            nombre: extractField('NOMBRE', respuestaIA),
            edad: extractField('EDAD', respuestaIA),
            ocupacion: extractField('OCUPACIÓN', respuestaIA),
            ubicacion: extractField('UBICACIÓN', respuestaIA),
            ingresos: extractField('INGRESOS', respuestaIA),
            familia: extractField('FAMILIA', respuestaIA),
            
            // Psicología
            problemaPrincipal: extractField('PROBLEMA PRINCIPAL', respuestaIA),
            frustracionDiaria: extractField('FRUSTRACIÓN DIARIA', respuestaIA),
            miedoSecreto: extractField('MIEDO SECRETO', respuestaIA),
            deseoProfundo: extractField('DESEO PROFUNDO', respuestaIA),
            emocionDominante: extractField('EMOCIÓN DOMINANTE', respuestaIA),
            
            // Comportamiento digital
            plataformasActivas: extractField('PLATAFORMAS ACTIVAS', respuestaIA),
            horariosOnline: extractField('HORARIOS ONLINE', respuestaIA),
            contenidoQueBusca: extractField('CONTENIDO QUE BUSCA', respuestaIA),
            influencersQueSigue: extractField('INFLUENCERS QUE SIGUE', respuestaIA),
            hashtagsQueUsa: extractField('HASHTAGS QUE USA', respuestaIA),
            
            // Proceso de compra
            momentoGatillo: extractField('MOMENTO GATILLO', respuestaIA),
            primeraReaccion: extractField('PRIMERA REACCIÓN', respuestaIA),
            objecionPrincipal: extractField('OBJECIÓN PRINCIPAL', respuestaIA),
            pruebaSocialNecesaria: extractField('PRUEBA SOCIAL NECESARIA', respuestaIA),
            urgenciaQueFunciona: extractField('URGENCIA QUE FUNCIONA', respuestaIA),
            
            // Personalidad
            personalidad: extractField('PERSONALIDAD', respuestaIA),
            valoresPrincipales: extractField('VALORES PRINCIPALES', respuestaIA),
            estiloComunicacion: extractField('ESTILO DE COMUNICACIÓN', respuestaIA),
            lenguajeQueUsa: extractField('LENGUAJE QUE USA', respuestaIA),
            palabrasQueMotivan: extractField('PALABRAS QUE LO MOTIVAN', respuestaIA),
            palabrasQueAlejan: extractField('PALABRAS QUE LO ALEJAN', respuestaIA),
            
            // Contexto específico del producto
            porQueNecesitaEsto: extractField('POR QUÉ NECESITA ESTO', respuestaIA),
            queHaIntentadoAntes: extractField('QUÉ HA INTENTADO ANTES', respuestaIA),
            expectativaRealista: extractField('EXPECTATIVA REALISTA', respuestaIA),
            tiempoDisponible: extractField('TIEMPO DISPONIBLE', respuestaIA),
            nivelCompromiso: extractField('NIVEL DE COMPROMISO', respuestaIA),
            
            // Metadatos
            productoVinculado: contextoProducto.nombre,
            precio: contextoProducto.precio,
            nicho: contextoProducto.nicho,
            painPointPrincipal: contextoProducto.painPoints[0],
            respuestaCompleta: respuestaIA,
            timestamp: new Date().toISOString(),
            tipo: 'avatar-sincrono-especifico'
        };
    },
    
    // Crear avatar genérico como fallback
    crearAvatarGenerico(contextoProducto) {
        const nicho = contextoProducto.nicho.toLowerCase();
        let avatarBase = {};
        
        if (nicho.includes('fitness') || nicho.includes('salud')) {
            avatarBase = {
                nombre: 'Ana Martínez',
                edad: '28-35 años',
                ocupacion: 'Profesional de oficina',
                ubicacion: 'Ciudad principal, España/México',
                problemaPrincipal: contextoProducto.painPoints[0] || 'Falta de tiempo para ejercicio',
                emocionDominante: contextoProducto.emociones[0] || 'Frustración por no verse bien'
            };
        } else if (nicho.includes('dinero') || nicho.includes('negocio')) {
            avatarBase = {
                nombre: 'Carlos Rivera',
                edad: '30-40 años',
                ocupacion: 'Empleado buscando ingresos extra',
                ubicacion: 'Área metropolitana',
                problemaPrincipal: contextoProducto.painPoints[0] || 'Falta de dinero extra',
                emocionDominante: contextoProducto.emociones[0] || 'Ansiedad financiera'
            };
        } else {
            avatarBase = {
                nombre: 'Usuario Tipo',
                edad: '25-40 años',
                ocupacion: 'Profesional',
                ubicacion: 'Zona urbana',
                problemaPrincipal: contextoProducto.painPoints[0] || 'Necesita solución específica',
                emocionDominante: contextoProducto.emociones[0] || 'Búsqueda de mejora'
            };
        }
        
        return {
            ...avatarBase,
            productoVinculado: contextoProducto.nombre,
            precio: contextoProducto.precio,
            nicho: contextoProducto.nicho,
            painPointPrincipal: contextoProducto.painPoints[0],
            timestamp: new Date().toISOString(),
            tipo: 'avatar-sincrono-generico'
        };
    },
    
    // ===== 2. EXPORTACIÓN COHERENTE Y SINCRONIZADA =====
    
    exportarConjuntoCoherente(contenidoViral, avatarEspecifico, contextoProducto) {
        console.log('🏗️ Exportando conjunto coherente a Funnel Architect...');
        
        const conjuntoCoherente = {
            // Información base
            timestamp: new Date().toISOString(),
            tipo: 'conjunto-coherente-v1',
            version: '1.0',
            
            // Producto central
            producto: {
                nombre: contextoProducto.nombre,
                precio: contextoProducto.precio,
                comision: contextoProducto.comision,
                nicho: contextoProducto.nicho,
                painPoints: contextoProducto.painPoints,
                emociones: contextoProducto.emociones,
                triggers: contextoProducto.triggers,
                descripcion: contextoProducto.descripcion
            },
            
            // Avatar específico generado
            avatar: {
                ...avatarEspecifico,
                vinculacion: 'especifico-para-producto',
                congruencia: 'alta'
            },
            
            // Contenido viral generado
            contenido: {
                respuesta: contenidoViral.respuesta,
                tipos: contenidoViral.tipos,
                timestamp: contenidoViral.timestamp,
                vinculacion: 'especifico-para-producto'
            },
            
            // Metadatos de coherencia
            coherencia: {
                nivel: 'ultra-especifica',
                verificaciones: {
                    productoAvatarMatch: this.verificarCoherenciaProductoAvatar(contextoProducto, avatarEspecifico),
                    avatarContenidoMatch: this.verificarCoherenciaAvatarContenido(avatarEspecifico, contenidoViral),
                    productoContenidoMatch: this.verificarCoherenciaProductoContenido(contextoProducto, contenidoViral)
                }
            },
            
            // Instrucciones de uso
            instrucciones: {
                funnel: `Usar avatar "${avatarEspecifico.nombre}" para producto "${contextoProducto.nombre}"`,
                targeting: `Enfocar en ${avatarEspecifico.problemaPrincipal} con emoción ${avatarEspecifico.emocionDominante}`,
                contenido: `Usar scripts generados para ${contenidoViral.tipos.join(', ')} con precio ${contextoProducto.precio}`
            }
        };
        
        // Exportar a localStorage para Funnel Architect
        localStorage.setItem('funnel_conjunto_coherente', JSON.stringify(conjuntoCoherente));
        
        // También mantener formato anterior para compatibilidad
        localStorage.setItem('funnel_avatars', JSON.stringify([avatarEspecifico]));
        localStorage.setItem('funnel_products', JSON.stringify([contextoProducto]));
        localStorage.setItem('funnel_contenido_viral', JSON.stringify(contenidoViral));
        
        // Datos para exportación completa
        const datosExportacion = {
            avatares: [avatarEspecifico],
            productos: [contextoProducto],
            contenido: contenidoViral,
            conjuntoCoherente: conjuntoCoherente
        };
        
        localStorage.setItem('marketinsight_export_coherente', JSON.stringify(datosExportacion));
        
        console.log('✅ Conjunto coherente exportado exitosamente');
        return conjuntoCoherente;
    },
    
    // Verificaciones de coherencia
    verificarCoherenciaProductoAvatar(producto, avatar) {
        const checks = {
            nichoMatch: avatar.nicho === producto.nicho,
            painPointMatch: avatar.painPointPrincipal === producto.painPoints[0],
            precioJustificado: avatar.precio === producto.precio,
            vinculacionCorrecta: avatar.productoVinculado === producto.nombre
        };
        
        const coherentes = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        
        return {
            porcentaje: Math.round((coherentes / total) * 100),
            detalles: checks,
            nivel: coherentes === total ? 'perfecta' : coherentes >= total * 0.8 ? 'alta' : 'media'
        };
    },
    
    verificarCoherenciaAvatarContenido(avatar, contenido) {
        // Verificar que el contenido mencione elementos del avatar
        const contenidoTexto = contenido.respuesta.toLowerCase();
        const checks = {
            mencionaPainPoint: contenidoTexto.includes(avatar.painPointPrincipal?.toLowerCase() || ''),
            mencionaEmocion: contenidoTexto.includes(avatar.emocionDominante?.toLowerCase() || ''),
            mencionaProducto: contenidoTexto.includes(avatar.productoVinculado?.toLowerCase() || ''),
            timestampCercano: Math.abs(new Date(avatar.timestamp) - new Date(contenido.timestamp)) < 60000 // 1 minuto
        };
        
        const coherentes = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        
        return {
            porcentaje: Math.round((coherentes / total) * 100),
            detalles: checks,
            nivel: coherentes >= total * 0.8 ? 'alta' : coherentes >= total * 0.6 ? 'media' : 'baja'
        };
    },
    
    verificarCoherenciaProductoContenido(producto, contenido) {
        const contenidoTexto = contenido.respuesta.toLowerCase();
        const checks = {
            mencionaProducto: contenidoTexto.includes(producto.nombre.toLowerCase()),
            mencionaPrecio: contenidoTexto.includes(producto.precio),
            mencionaComision: contenidoTexto.includes(producto.comision),
            mencionaPainPoint: contenidoTexto.includes(producto.painPoints[0]?.toLowerCase() || '')
        };
        
        const coherentes = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        
        return {
            porcentaje: Math.round((coherentes / total) * 100),
            detalles: checks,
            nivel: coherentes >= total * 0.8 ? 'alta' : coherentes >= total * 0.6 ? 'media' : 'baja'
        };
    }
};

// ===== 3. INICIALIZACIÓN Y EXPORTACIÓN =====

console.log('✅ Avatar Sync System v1.0 cargado correctamente');

// Auto-ejecutar cuando esté listo el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎯 Avatar Sync System listo para sincronización automática');
    });
} else {
    console.log('🎯 Avatar Sync System listo para sincronización automática');
}

// Exportar para uso global
window.AvatarSyncSystem = AvatarSyncSystem;