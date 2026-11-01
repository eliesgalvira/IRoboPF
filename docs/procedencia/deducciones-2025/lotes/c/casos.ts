import { calcularDeduccionesAutonomicasAplicadas } from "../../../../../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

/** Casos hipotéticos de la API aritmética heredada. No son liquidaciones aceptadas. */
export const casos = [
  {
    codigo: "canarias_nacimiento_adopcion_hijos",
    descripcion:
      "Tercer hijo total, primer hijo con discapacidad de al menos 65%; convivencia ininterrumpida, renta inferior al límite y un progenitor con derecho. El orden para el suplemento es el de los hijos con discapacidad.",
    entradas: {
      canariasOrdenHijoNacimientoAdopcion: "tercero",
      canariasHijosNacimientoAdopcion: 1,
      canariasHijosNacimientoAdopcionDiscapacidad65: 1,
      canariasNacimientoCumpleLimites: true,
    },
    esperado: 1130,
    calculoIndependiente: "530 + 600 = 1.130; no 530 + 1.100",
  },
  {
    codigo: "canarias_familia_numerosa",
    descripcion:
      "Familia numerosa general sin discapacidad; dos contribuyentes conviven con los restantes miembros, declaraciones individuales, igual derecho al reparto.",
    entradas: { canariasCategoriaFamiliaNumerosa: "general" },
    esperado: 298.5,
    calculoIndependiente: "597 / 2 = 298,50 por declarante",
  },
  {
    codigo: "canarias_discapacidad_mayores_65",
    descripcion:
      "Dos cónyuges con discapacidad del 33%, menores de 65 años; conjunta con bases por debajo de 61.770. La API no tiene una colección de contribuyentes.",
    entradas: {
      canariasContribuyenteDiscapacidad33: true,
      canariasDiscapacidadMayoresCumpleLimites: true,
    },
    esperado: 800,
    calculoIndependiente: "400 por contribuyente × 2 = 800",
  },
  {
    codigo: "canarias_contribuyentes_desempleados",
    descripcion:
      "Dos cónyuges en desempleo legal más de seis meses, prestaciones y rendimientos íntegros de trabajo de 9.000 cada uno, conjunto 18.000, resto de bases cero; conjunta. Ambos cumplen los requisitos.",
    entradas: { canariasDesempleadoCumpleRequisitos: true },
    esperado: 240,
    calculoIndependiente: "120 por contribuyente × 2 = 240",
  },
  {
    codigo: "balears_gastos_mayores_65_discapacidad",
    descripcion:
      "Dos ascendientes mayores de 65 que generan mínimo, un solo descendiente con derecho, 2.000 de residencia por ascendiente, pagos bancarios, BI individual 20.000, sin ayudas ni conciliación incompatible.",
    entradas: {
      "balears_gastos_mayores_65_discapacidad:cumple": true,
      "balears_gastos_mayores_65_discapacidad:base": 4000,
    },
    esperado: 1320,
    calculoIndependiente: "min(2.000 × 40%,660) + min(2.000 × 40%,660) = 1.320",
  },
] as const

export const resultados = () =>
  casos.map((caso) => ({
    ...caso,
    api: "calcularDeduccionesAutonomicasAplicadas",
    observado: calcularDeduccionesAutonomicasAplicadas(caso.entradas, {
      ejercicio: 2025,
      territorio: caso.codigo.startsWith("canarias_")
        ? "canarias"
        : "illes-balears",
    }),
  }))
