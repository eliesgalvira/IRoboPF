import { calcularDesgloseCotizacionesPerfilUniforme } from '../../../../../lib/dominio/laboral/cotizaciones-perfil-uniforme.ts'
import { crearImporteMonetario } from '../../../../../lib/dominio/dinero/importe-monetario.ts'
const result = calcularDesgloseCotizacionesPerfilUniforme({ anio: 2025, salarioBrutoAnual: crearImporteMonetario('132500') })
console.log(JSON.stringify(result, null, 2))
