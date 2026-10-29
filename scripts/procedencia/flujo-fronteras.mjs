import {ts} from './flujo-ast.mjs'
const outputs=new Map([
 ['calcularDeduccionTrabajo',['deduccionLegal','limiteAtribuible','importeAplicable','cuotaPosterior']],
 ['calcularCuotaDiferencialCentimos',['return']],
 ['centimosAEuros',['return']],['eurosACentimos',['return']],['crearImporteMonetario',['return']],['truncarImporteMonetario',['return']],['redondearImporteLiquidado',['return']],
 ['fechaValida',['return']],['hayAlimentosPropiosSinMinimo',['return']],['validarDerechosMinimos',['admission']],['validarRentasAnualesDerechos',['admission']],['calcularDerechosMinimos',['contribuyente','descendientes','ascendientes','discapacidadContribuyente','discapacidadFamiliares','total']],
 ['calcularDesgloseCotizacionesPerfilUniforme',['baseOrdinaria','excesoBase','cotizacionEmpresarialOrdinaria','cotizacionTrabajadorOrdinaria','meiEmpresarial','meiTrabajador','solidaridadEmpresarial','solidaridadTrabajador','cotizacionEmpresarial','cotizacionTrabajador']],
 ['calcularDesgloseCotizacionesSocialesLegacy',['baseOrdinaria','excesoBase','cotizacionEmpresarialOrdinaria','cotizacionTrabajadorOrdinaria','meiEmpresarial','meiTrabajador','solidaridadEmpresarial','solidaridadTrabajador','cotizacionEmpresarial','cotizacionTrabajador']],
 ['calcularDesgloseCuotaPorEscalaAhorro',['return']],['calcularDesgloseCuotaPorEscala',['return']],['calcularCuotaPorEscala',['return']],
 ['adaptarActividadGeneral',['aporte.importeEurosExactos','aporte.retencionesEuros','aporte.pagosFraccionadosEuros','etapas']],
 ['calcularActividad2025',['aporte','etapas']],['calcularReduccionTrabajoConOtrasRentas',['return']]
])
export function guards(node,sources){const result=[];let child=node,parent=node.parent;while(parent){if(ts.isIfStatement(parent))result.push({role:'selection',predicate:sources.ref(parent.expression),branch:parent.thenStatement===child?'true':'false'});if(ts.isConditionalExpression(parent))result.push({role:'selection',predicate:sources.ref(parent.condition),branch:parent.whenTrue===child?'true':parent.whenFalse===child?'false':'selector'});if(ts.isForOfStatement(parent))result.push({role:'selection',predicate:sources.ref(parent.expression),branch:'por elemento; cardinalidad no fija'});child=parent;parent=parent.parent}return result}
/** Contratos por llamada, nunca por homonimia de un campo. Las salidas se enumeran separadas. */
export function boundaries(sources){
 const result=[]
 for(const file of ['lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts','lib/dominio/irpf/trabajo-anual/conexion.ts','lib/dominio/irpf/actividades-economicas/adaptador.ts','lib/dominio/laboral/cotizaciones-perfil-uniforme.ts','lib/dominio/laboral/cotizaciones-sociales.ts','lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts']){
  const ast=sources.load(file).ast
  function walk(n){
   if(ts.isCallExpression(n)&&ts.isIdentifier(n.expression)&&outputs.has(n.expression.text)){
    const declaration=sources.declaration(n.expression);let fn=declaration
    if(fn&&ts.isVariableDeclaration(fn))fn=fn.initializer
    const params=fn&&ts.isFunctionLike(fn)?fn.parameters:[]
    result.push({call:sources.ref(n),callee:n.expression.text,declaration:declaration?sources.ref(declaration):null,instance:file+':'+n.getStart(),bindings:n.arguments.flatMap((arg,index)=>{
      if(ts.isObjectLiteralExpression(arg))return arg.properties.map(field=>({argument:index,property:field.name?.getText()??null,expression:ts.isPropertyAssignment(field)?sources.ref(field.initializer):sources.ref(field),formal:params[index]?sources.ref(params[index]):null}))
      return [{argument:index,property:null,expression:sources.ref(arg),formal:params[index]?sources.ref(params[index]):null}]
    }),outputs:outputs.get(n.expression.text),conditions:guards(n,sources),review:'pending-independent',completeRuleAcceptance:false})
   }
   ts.forEachChild(n,walk)
  }
  walk(ast)
 }
 return result
}
