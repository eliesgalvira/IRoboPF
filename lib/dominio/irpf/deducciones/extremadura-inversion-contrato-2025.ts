import { Schema, Struct } from "effect"
import { Inversion681 } from "./inversion-681-comun-2025"
import { HechosEstatales681 } from "./inversion-681-2025"
import { Texto, Centimos, Entero, Fraccion } from "./aragon-dos-codigos-2025/comun"

const FamiliaTercero = Schema.Struct({id:Texto,vinculo:Schema.Literals(["conyuge","consanguinidad","afinidad"]),grado:Entero,
 capitalDirectoIndirecto:Fraccion,votoDirectoIndirecto:Fraccion})
const ParticipacionTercero = Schema.Struct({desde:Texto,hasta:Texto,capitalPropio:Fraccion,votoPropio:Fraccion,
 familiares:Schema.Array(FamiliaTercero),referenciaCensoTercerGrado:Texto})
/** Censo familiar único; la proyección de segundo grado pertenece al adaptador interno. */
const campos = Inversion681.mapFields(Struct.omit(["historialParticipacion"])).fields
export const HechosInversionExt2025 = Schema.Struct({
 perfil:Schema.Literal("constitucion2025-una-inversion-con681"),
 exhaustividad:Schema.Literal("una-inversion-mundial-sin-otras-deducciones"),
 censoInversionesEstatales2025:Texto,
 inversion:Schema.Struct({...campos,
  historialParticipacionTercero:Schema.Array(ParticipacionTercero),
  eleccion:Schema.Struct({estatalCentimos:Centimos,extremaduraCentimos:Centimos}),
 }),
 escrituraPublica:Schema.Struct({id:Texto,entidad:Texto,fecha:Texto,notario:Texto,protocolo:Texto,
  capitalSocialCentimos:Centimos,clase:Schema.Literal("una-clase-sin-prima-un-voto-por-accion-sin-cambios2025"),
  inversores:Schema.Array(Schema.Struct({persona:Texto,importeCentimos:Centimos})),referencia:Texto}),
 inscripcion:Schema.Struct({entidad:Texto,registro:Texto,fecha:Texto,asiento:Texto,forma:Schema.Literals(["SA","SL"]),referencia:Texto}),
 empleo:Schema.Struct({persona:Texto,empleador:Texto,contrato:Texto,inicio:Texto,finObservado:Texto,
  jornadaMinutosSemanales:Entero,jornadaCompletaMinutosSemanales:Entero,
  altaSS:Texto,fechaAltaSS:Texto,sinBajasNiCambiosHastaDevengo:Schema.Literal(true),referencia:Texto}),
 actividad:Schema.Struct({descripcion:Texto,contratosClientes:Schema.Array(Texto),facturasClientes:Schema.Array(Texto),
  contabilidad:Schema.Array(Schema.Struct({desde:Texto,hasta:Texto,referenciaBalance:Texto,totalActivoCentimos:Centimos,
   activos:Schema.Array(Schema.Struct({id:Texto,valorContableCentimos:Centimos,
    clase:Schema.Literals(["equipo-operativo","mercancia-operativa","otro-no-afecto-conservador"]),
    descripcion:Texto,documento:Texto,usoActividad:Texto})),
   sinValoresNiActivosOmitidos:Schema.Literal(true)})),
 }),
 titularidad:Schema.Literal("directa-plena-sin-interpuestas-ni-cotitulares"),
 documentos:Schema.Literal("declarados-no-autenticados"),
 seguimiento:Schema.Struct({tenencia:Texto,empleo24Meses:Texto,entidadYParticipacion:Texto,
  estado:Schema.Literal("obligaciones-futuras-no-certificadas")}),
 reinversion:Schema.Literal("sin-exencion38.2"),
 estatal681:HechosEstatales681,
})
export type HechosInversionExt2025 = typeof HechosInversionExt2025.Type
