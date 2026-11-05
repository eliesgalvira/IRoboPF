import {Schema} from "effect"
import type { HechosAmpliacionE2025 } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025"
import {SolicitudE38Anual2025,CAMPOS_FISCALES_EXCLUIDOS_E38} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
const objeto=Schema.is(Schema.Record(Schema.String,Schema.Json)),lista=Schema.is(Schema.Array(Schema.Json))
/** Proyección mecánica de fixtures corregidas;no calcula cuantías ni derechos. */
export function solicitudE38(h:HechosAmpliacionE2025,nacimiento="1990-01-01"):SolicitudE38Anual2025{
 function proyectar(v:Schema.Json):Schema.Json{
  if(lista(v))return v.map(proyectar)
  if(!objeto(v))return v
  return Object.fromEntries(Object.entries(v).filter(([k])=>!CAMPOS_FISCALES_EXCLUIDOS_E38.some(c=>c===k)).map(([k,v])=>[k,proyectar(v)]))
 }
 return Schema.decodeUnknownSync(SolicitudE38Anual2025)({lote:"E38",nacimientoContribuyente:nacimiento,exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:[],hechos:proyectar(Schema.decodeUnknownSync(Schema.Json)(h))},{onExcessProperty:"error"})
}
