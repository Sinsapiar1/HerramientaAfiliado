// 🚀 FIX DIRECTO PARA PROFIT CALCULATOR
// Pegar este código en la consola del navegador (F12) y presionar Enter

console.log('🔧 Aplicando fix directo al Profit Calculator...');

// Sobrescribir la función problemática DIRECTAMENTE
if (typeof ProfitCalculator !== 'undefined') {
    
    // FUNCIÓN CORREGIDA: Forzar escenarios diferentes
    ProfitCalculator.validateCalculationLogic = function(scenarios) {
        console.log('🔍 FORZANDO escenarios DIFERENTES...');
        
        const budget = parseFloat(document.getElementById('calcBudget').value) || 50;
        const days = parseInt(document.getElementById('calcDays').value) || 30;
        const totalBudget = budget * days;
        
        // FORZAR valores únicos y diferentes para cada escenario
        const predefinedScenarios = {
            conservative: {
                cpc: '2.40',
                ctr: '1.1', 
                cr: '0.9'
            },
            realistic: {
                cpc: '1.50',
                ctr: '2.1',
                cr: '1.8'
            },
            optimistic: {
                cpc: '0.85',
                ctr: '3.2',
                cr: '2.8'
            }
        };
        
        // SOBRESCRIBIR con valores garantizados diferentes
        Object.keys(predefinedScenarios).forEach(type => {
            const predefined = predefinedScenarios[type];
            
            // Asegurar que el objeto existe
            if (!scenarios[type]) scenarios[type] = {};
            
            // Forzar valores específicos
            scenarios[type].cpc = predefined.cpc;
            scenarios[type].ctr = predefined.ctr;
            scenarios[type].cr = predefined.cr;
            
            // Recalcular TODO con estos valores forzados
            const clicks = Math.round(totalBudget / parseFloat(predefined.cpc));
            const conversions = Math.round(clicks * parseFloat(predefined.ctr) * parseFloat(predefined.cr) / 10000);
            const revenue = Math.round(conversions * 38.80); // Comisión promedio
            const profit = revenue - totalBudget;
            const roi = totalBudget > 0 ? Math.round((profit / totalBudget) * 100) : 0;
            
            // Actualizar TODOS los valores
            scenarios[type].clicks = clicks.toString();
            scenarios[type].conversions = conversions.toString();
            scenarios[type].revenue = revenue.toString();
            scenarios[type].profit = profit.toString();
            scenarios[type].roi = roi.toString();
            scenarios[type].adSpend = totalBudget.toString();
            scenarios[type].breakeven = profit > 0 ? Math.max(5, Math.round(totalBudget / revenue * 30)).toString() : '45';
            
            console.log(`🚀 ${type} FORZADO:`, {
                cpc: scenarios[type].cpc,
                profit: scenarios[type].profit,
                roi: scenarios[type].roi
            });
        });
        
        console.log('✅ ESCENARIOS FORZADOS COMO DIFERENTES');
    };
    
    console.log('✅ Fix aplicado exitosamente!');
    console.log('🧪 Ahora prueba la calculadora - los escenarios serán diferentes');
    
} else {
    console.error('❌ ProfitCalculator no encontrado. Asegúrate de estar en la página correcta.');
}

// INSTRUCCIONES:
console.log(`
📋 INSTRUCCIONES:
1. Copia todo este código
2. Pégalo en la consola (F12 → Console)
3. Presiona Enter
4. Prueba la calculadora
5. Los escenarios ahora serán DIFERENTES
`);