import { Schema } from "effect"
import { Texto, Entero, Centimos, Pago, fecha, ref, exigir } from "./comun"
export const Inversion = Schema.Struct({
  pago: Pago,
  entidad: Texto,
  forma: Schema.Literals(["SA", "SL", "SAL", "SLL", "cooperativa"]),
  operacion: Schema.Literals([
    "constitucion",
    "ampliacion",
    "aportacion-social",
  ]),
  constitucion: Texto,
  escritura: Texto,
  domicilioSocial: Texto,
  domicilioFiscal: Texto,
  actividad: Schema.Literals(["economica", "patrimonial"]),
  memoriaActividad: Texto,
  capitalPropioMaxPuntosBasicos: Entero,
  capitalFamiliarMaxPuntosBasicos: Entero,
  votosFamiliarMaxPuntosBasicos: Entero,
  referenciaCensoFamiliarTercerGrado: Texto,
  referenciaRegistroParticipaciones: Texto,
  funcion: Schema.Literals([
    "sin-funciones",
    "consejero-no-ejecutivo",
    "direccion",
    "empleado",
  ]),
  empleadosJornadaCompleta: Entero,
  referenciaContratosAlta: Texto,
  facturacionAnualCentimos: Centimos,
  plantillaMediaAntesCentesimas: Entero,
  mercado: Schema.Literals(["sin-cotizacion", "MAB-expansion", "otro"]),
  universidadCentro: Schema.String,
  mantenimientoHastaDevengo: Schema.Literals([
    "sin-transmision-ni-incumplimiento",
    "transmitida",
    "incumplimiento",
  ]),
  referenciaSeguimiento: Texto,
  obligacionMantenimientoFuturo: Texto,
  economiaSocialLey5: Schema.String,
})
export type Inversion = typeof Inversion.Type
export function sociedad(
  i: Inversion,
  territorio: string,
  perfil: "mercantil" | "MAB" | "economia-social" = "mercantil"
): void {
  ref(i.entidad)
  exigir(
    i.capitalPropioMaxPuntosBasicos <= i.capitalFamiliarMaxPuntosBasicos &&
      i.capitalFamiliarMaxPuntosBasicos <= 10000 &&
      i.votosFamiliarMaxPuntosBasicos <= 10000,
    "Participación propia/familiar contradictoria o superior al cien por ciento"
  )
  ref(i.escritura)
  ref(i.memoriaActividad)
  ref(i.referenciaCensoFamiliarTercerGrado)
  ref(i.referenciaRegistroParticipaciones)
  ref(i.referenciaSeguimiento)
  ref(i.obligacionMantenimientoFuturo)
  exigir(
    fecha(i.constitucion) <= fecha(i.pago.fecha),
    "Inversión anterior a constitución"
  )
  exigir(
    i.domicilioSocial === territorio && i.domicilioFiscal === territorio,
    "Domicilios social/fiscal fuera del territorio"
  )
  if (perfil !== "economia-social")
    exigir(i.actividad === "economica", "Entidad de gestión patrimonial")
  if (perfil === "mercantil")
    exigir(
      i.funcion !== "direccion" && i.funcion !== "empleado",
      "Inversor con funciones ejecutivas/dirección o relación laboral"
    )
  exigir(
    i.mantenimientoHastaDevengo === "sin-transmision-ni-incumplimiento",
    "Incumplimiento observado; aportar regularización del beneficio anterior"
  )
}
export function ampliacionTresAnios(i: Inversion): void {
  if (i.operacion !== "ampliacion") return
  const dia = fecha(i.pago.fecha)
  const limite = String(Number(dia.slice(0, 4)) - 3) + dia.slice(4)
  exigir(
    i.constitucion >= limite,
    "Sociedad constituida fuera de los tres años anteriores a ampliación"
  )
}
