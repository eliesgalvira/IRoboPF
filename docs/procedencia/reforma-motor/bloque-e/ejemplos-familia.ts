import type {
  CasoFiscalAnual,
  ComunidadAutonoma,
} from "../../../../lib/dominio/irpf/caso-fiscal-anual"
import type { AnioFiscal } from "../../../../lib/dominio/normativa/anio-fiscal"
import type {
  DerechosMinimosAnuales,
  TitularDescendiente,
} from "../../../../lib/dominio/irpf/minimos/derechos-contrato"

export const territoriosFamilia = [
  "andalucia",
  "aragon",
  "asturias",
  "illes-balears",
  "canarias",
  "cantabria",
  "castilla-la-mancha",
  "castilla-y-leon",
  "catalunya",
  "extremadura",
  "galicia",
  "madrid",
  "murcia",
  "la-rioja",
  "comunitat-valenciana",
  "ceuta",
  "melilla",
] as const
export const padreFamilia = (titularId: string): TitularDescendiente => ({
  titularId,
  grado: 1,
  vinculo: { clase: "consanguinidad" },
  relacion: "convivencia",
  custodia: "compartida",
  alimentosJudiciales: false,
  aplicaEspecialidadAlimentos: false,
  residenteIrpf: true,
  rentasNoExentasCentimos: 3000000,
})
/** Hechos sintéticos: ganancias del ahorro, sin cotizaciones estimadas ni renta laboral. */
export const familiaAnual = (
  ejercicio: AnioFiscal,
  territorio: DerechosMinimosAnuales["territorio"] = "madrid"
): DerechosMinimosAnuales => ({
  ejercicio,
  territorio,
  regimen: "comun",
  modalidad: "individual",
  devengo: `${ejercicio}-12-31`,
  contribuyenteId: "s-1",
  edadContribuyenteDevengo: 40,
  discapacidadContribuyente: { _tag: "SinDiscapacidad" },
  ascendientes: "ninguno",
  fallecimientosEnElEjercicio: "ninguno",
  descendientesCompletos: true,
  conciliacionRentasContribuyente: {
    perfil: "caso-anual-parcial",
    otrasRentasOGastosNoRepresentados: "ninguno",
  },
  descendientes: [8, 5].map((edad, i) => ({
    sujetoId: `s-${i + 3}`,
    fechaNacimiento: `${ejercicio - edad}-01-01`,
    edadDevengo: edad,
    vivoAlDevengo: true,
    rentasNoExentasCentimos: 0,
    declaracion: { modalidad: "no-presenta" },
    discapacidad: { _tag: "SinDiscapacidad" },
    titulares: [padreFamilia("s-1"), padreFamilia("s-2")],
    titularesCompletos: true,
  })),
})
export const casoFamiliaAnual = (
  derechosMinimos: DerechosMinimosAnuales
): CasoFiscalAnual & { readonly derechosMinimos: DerechosMinimosAnuales } => ({
  anio: derechosMinimos.ejercicio,
  comunidadAutonoma: derechosMinimos.territorio satisfies ComunidadAutonoma,
  derechosMinimos,
  situacionFamiliar: {
    tipo: "individual",
    edad: derechosMinimos.edadContribuyenteDevengo,
    discapacidad: derechosMinimos.discapacidadContribuyente,
    descendientes: [],
    ascendientes: [],
  },
  rendimientos: {
    trabajo: [],
    gananciasPatrimoniales: [
      {
        importeGananciaCentimos: 3000000,
        tratamientoMayores65: { _tag: "SinExencionMayores65" },
        fechaAdquisicion: "2000-01-01",
        fechaTransmision: `${derechosMinimos.ejercicio}-06-01`,
      },
    ],
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 0,
  pagosACuentaCentimos: 0,
})
