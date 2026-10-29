"""Superposición semántica R23. Las relaciones se declaran, no se infieren por número."""
from __future__ import annotations
import gzip
import json
from pathlib import Path
from typing import Any

OUT = Path(__file__).resolve().parent
OLD = OUT.parent / 'flujo-escalas-r21-sol'
L = 'lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
X = 'lib/dominio/irpf/trabajo-anual/conexion.ts'
G = 'lib/dominio/irpf/cuotas/escalas-gravamen.ts'
P = 'lib/dominio/irpf/cuotas/escalas-publicadas.ts'
A = 'lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts'
C = 'lib/dominio/irpf/comunidades/comunidad-autonoma.ts'
M = 'lib/dominio/irpf/minimos/'
D = 'lib/dominio/normativa/datos/'


def read(path: Path) -> Any:
    if path.suffix == '.gz':
        with gzip.open(path, 'rt') as stream:
            return json.load(stream)
    return json.loads(path.read_text())


def write(name: str, value: Any) -> None:
    raw = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()
    if name.endswith('.gz'):
        (OUT / name).write_bytes(gzip.compress(raw, mtime=0))
    else:
        (OUT / name).write_bytes(raw)


SOURCES = {m['file']: m for m in read(OUT / 'fuentes.json.gz')['modules']}
EDGES: list[dict[str, Any]] = []


def proof(file: str, symbol: str, needle: str | None = None) -> dict[str, Any]:
    choices = [f for f in SOURCES[file]['facts'] if f['kind'] == 'declaration' and f['symbol'] == symbol]
    if file == L and len(choices) > 1:
        scope = next(f for f in SOURCES[L]['facts'] if f['symbol'] == 'liquidarTrabajoIndividualSimple')
        choices = [f for f in choices if scope['source']['start'] < f['source']['start'] < scope['source']['end']]
    assert len(choices) == 1, (file, symbol, len(choices))
    fact = choices[0]
    if needle is None:
        return {'symbol': symbol, 'source': fact['source'], 'expression': fact['text'], 'rangeKind': 'declaration-not-literal'}
    text = fact['text']
    assert needle in text, (symbol, needle)
    prefix = text[:text.index(needle)]
    source = dict(fact['source'])
    source['start'] += len(prefix.encode('utf-16-le')) // 2
    source['end'] = source['start'] + len(needle.encode('utf-16-le')) // 2
    return {'symbol': symbol, 'source': source, 'expression': needle, 'rangeKind': 'expression-fragment'}


def edge(file: str, symbol: str, prop: str, dependencies: list[str], formula: str,
         branch: str = 'Dentro del dominio del contrato general; ejercicio y territorio del caso.',
         role: str = 'value', needle: str | None = None) -> str:
    key = f'{file}#{symbol}.{prop}'
    if any(e['id'] == key for e in EDGES):
        return key
    evidence = proof(file, symbol, needle)
    mutations = [f for f in SOURCES[file]['facts'] if f['kind'] == 'assignment' and f['text'].split('=', 1)[0].strip() == symbol]
    if mutations:
        evidence['assignments'] = [{'source': f['source'], 'expression': f['text']} for f in mutations]
    EDGES.append({'id': key, 'output': {'file': file, 'symbol': symbol, 'property': prop},
                  'inputs': dependencies, 'role': role, 'formula': formula, 'condition': branch,
                  'evidence': evidence, 'review': 'pending-independent', 'legalAcceptance': False})
    return key


def main() -> None:
    # Descomposición de composición anual, por variable y propiedad consumida.
    local = {
        'baseLiquidableGeneral': (['baseImponibleGeneral'], 'Identidad con BIG, conserva signo.'),
        'baseImponibleGeneral': (['rendimientoTrabajo.rendimientoNeto','reduccionRendimientosTrabajo','rendimientoCapitalInmobiliario.rendimientoNeto','gananciasPatrimoniales.gananciaSujetaGeneral'], 'max(0, netoTrabajo - reducción) + netoInmobiliario + gananciaGeneral; no saturar la suma final.'),
        'baseLiquidableAhorro': (['gananciasPatrimoniales.gananciaSujetaAhorro'], 'max(0, gananciaSujetaAhorro).'),
        'otrasRentasNoExentas': (['rendimientoCapitalInmobiliario.rendimientoNeto','gananciasPatrimoniales.gananciaSujetaGeneral','gananciasPatrimoniales.gananciaSujetaAhorro'], 'Suma algebraica previa a compensación, no bruto ni base liquidable.'),
        'minimoPersonalYFamiliar': (['minimoContribuyente','minimoDescendientes','minimoAscendientes','minimoDiscapacidadContribuyente','minimoDiscapacidadFamiliares'], 'Suma cinco subtotales; no reparto global.'),
        'minimoPersonalYFamiliarAutonomico': (['derechosAutonomicos.total','calcularMinimoPersonalYFamiliar'], 'derechos.total si presente; en otro caso cinco helpers con mínimos autonómicos.'),
        'cuotaIntegraGeneral': (['cuotaIntegraGeneralEstatal','cuotaIntegraGeneralAutonomica'], 'Suma, sin volver a sumar ordinaria y complementaria.'),
        'cuotaMinimoPersonal': (['cuotaMinimoPersonalEstatal','cuotaMinimoPersonalAutonomica'], 'Suma cuotas de mínimos, no importes nominales.'),
        'cuotaMinimoPersonalAhorro': (['ahorroConMinimos.estatal.minoracion','ahorroConMinimos.autonomico.minoracion'], 'Suma minoraciones independientes.'),
        'cuotaGeneralDespuesMinimo': (['cuotaIntegraGeneral','cuotaMinimoPersonal'], 'max(0, cuota general - cuota mínimo general).'),
        'cuotaAutonomicaGeneralDespuesMinimo': (['cuotaIntegraGeneralAutonomica','cuotaMinimoPersonalAutonomica'], 'max(0, cuota autonómica - cuota mínimo autonómico).'),
        'cuotaAhorroDespuesMinimo': (['cuotaIntegraAhorro','cuotaMinimoPersonalAhorro'], 'max(0, cuota bruta conjunta - suma minoraciones).'),
        'deduccionesAutonomicasDeclaradas': (['caso.deduccionAutonomicaAgregadaCentimos'], '(agregado ?? 0)/100. No suma códigos: deducciones[] no vacío rechaza toda liquidación.'),
        'deduccionesAutonomicasAplicadas': (['deduccionesAutonomicasDeclaradas','cuotaAutonomicaGeneralDespuesMinimo','ahorroConMinimos.autonomico.despuesMinimo','usaEscalaAutonomicaReal'], 'Real: min(declaradas, general autonómica postmínimo + ahorro autonómico postmínimo); simulada: declaradas sin este techo.'),
        'cuotaLiquida': (['cuotaGeneralDespuesMinimo','cuotaAhorroDespuesMinimo','deduccionesAutonomicasAplicadas'], 'max(0,general + ahorro - deducciones).'),
        'pagosACuentaAplicadosCentimos': (['caso.pagosACuentaCentimos','retencionTrabajoAeat.importeRetencionAnualCentimos'], 'Suma con retención opcional ?? 0; no altera cuotas anteriores.'),
        'cuotaDiferencialCentimos': (['importesLiquidacion.cuotaLiquidaCentimos','pagosACuentaAplicadosCentimos','caso.retencionesSoportadasCentimos'], 'Cuota redondeada a céntimos menos soportadas menos pagos; sin saturar.'),
    }
    for symbol, (deps, formula) in local.items():
        edge(L, symbol, 'value', deps, formula)
    for symbol,deps,formula,role in [
        ('minimosEstatales',['caso.anio','MINIMOS_ESTATALES_2012','MINIMOS_ESTATALES_2013','MINIMOS_ESTATALES_2014','dependencias.parametrosNormativos.minimosEstatales2025'],'Match2012/13/14 específico; resto servicio2025. El layer fija el servicio2025 a MINIMOS_ESTATALES_2025.','selection'),
        ('resultadoParametrosComunidad',['caso.anio','baseLiquidableGeneral','caso.comunidadAutonoma','caso.fechaFallecimiento'],'Llamada pura al selector: no usa el método de servicio para esta operación.','value'),
        ('parametrosComunidad',['resultadoParametrosComunidad._tag','resultadoParametrosComunidad'],'NoSoportada falla; Parametros retorna mismo objeto.','domain'),
        ('usaEscalaAutonomicaReal',['parametrosComunidad.escalaAutonomicaIgualEstatal'],'Negación del flag del resolver.','selection'),
        ('escalasPublicadasEstatales',['caso.anio','caso.comunidadAutonoma'],'<=2014 y territorio!=simulada: ordinaria+complementaria. Resto undefined.','selection'),
        ('escalaPublicadaAutonomica',['caso.anio','caso.comunidadAutonoma','caso.fechaFallecimiento'],'obtenerEscalaAutonomicaPublicada(caso); sus ramas están descompuestas.','selection'),
        ('escalasPublicadasAutonomicas',['escalaPublicadaAutonomica'],'undefined queda undefined; si presente array de una tabla.','value'),
        ('derechosEstatales',['caso.derechosMinimos','minimosEstatales'],'Ausente undefined; presente calcularDerechosMinimos con juego estatal.','selection'),
        ('derechosAutonomicos',['caso.derechosMinimos','parametrosComunidad.minimosAutonomicos'],'Ausente undefined; presente calcularDerechosMinimos con juego autonómico.','selection'),
        ('importesLiquidacion',['cuotaLiquida'],'Propiedad cuotaLiquidaCentimos = eurosACentimos(cuotaLiquida); otras propiedades no influyen en esta.','value'),
        ('sumarDeduccionesAutonomicasCentimos',['caso.deduccionAutonomicaAgregadaCentimos'],'Nullish devuelve0; no consulta códigos.','value'),
        ('detectarCasoNoSoportado',['caso.deducciones[0]','catalogo por codigo'],'No hay primer código =>None; si hay devuelveSome rechazo, catálogo únicamente selecciona diagnóstico.','domain'),
        ('calcularMinimoPersonalYFamiliar',['anio','minimos','situacionFamiliar'],'Suma contribuyente, descendientes, ascendientes y discapacidad de cada rol mediante los helpers locales descompuestos.','value')]:
        edge(L,symbol,'value',deps,formula,role=role)
    for file,symbol,formula in [
        ('lib/dominio/dinero/importe-monetario.ts','centimosAEuros','Decimal(centimos)/100.'),
        ('lib/dominio/dinero/importe-monetario.ts','eurosACentimos','redondearImporteLiquidado(euros)*100.toNumber().'),
        ('lib/dominio/dinero/importe-monetario.ts','redondearImporteLiquidado','redondearHalfUp(euros,2).'),
        ('lib/dominio/dinero/redondeo.ts','redondearHalfUp','valor.toDecimalPlaces(decimales,Decimal.ROUND_HALF_UP).'),
        ('lib/dominio/irpf/cuotas/cuota-diferencial.ts','calcularCuotaDiferencialCentimos','cuotaLiquidaCentimos-retencionesSoportadasCentimos-pagosACuentaCentimos. Sin saturación.')]:
        edge(file,symbol,'return',['parámetros públicos del helper'],formula)
    for name, source in [('Contribuyente','contribuyente'),('Descendientes','descendientes'),('Ascendientes','ascendientes'),('DiscapacidadContribuyente','discapacidadContribuyente'),('DiscapacidadFamiliares','discapacidadFamiliares')]:
        edge(L, 'minimo'+name, 'value', ['derechosEstatales.'+source,'caso.situacionFamiliar','minimosEstatales'], 'Nullish: elegir salida exacta de derechos si existe; si no, helper familiar. No sumar ambas ramas.')
    for symbol, minimum, component in [
        ('cuotaIntegraGeneralEstatal',None,'estatal'),('cuotaIntegraGeneralAutonomica',None,'autonomico'),
        ('desgloseCuotaIntegraGeneralEstatal',None,'estatal'),('desgloseCuotaIntegraGeneralAutonomica',None,'autonomico'),
        ('cuotaMinimoPersonalEstatal','minimoPersonalYFamiliar','estatal'),('cuotaMinimoPersonalAutonomica','minimoPersonalYFamiliarAutonomico','autonomico'),
        ('desgloseCuotaMinimoPersonalEstatal','minimoPersonalYFamiliar','estatal'),('desgloseCuotaMinimoPersonalAutonomica','minimoPersonalYFamiliarAutonomico','autonomico')]:
        deps = ['baseLiquidableGeneral','usaEscalaAutonomicaReal', 'parametrosComunidad.escalaEstatalGeneral' if component=='estatal' else 'parametrosComunidad.escalaAutonomica.tramos', 'escalasPublicadasEstatales' if component=='estatal' else 'escalasPublicadasAutonomicas']
        if minimum:
            deps.append(minimum)
        edge(L,symbol,'value',deps, f'Base = {"min("+minimum+",BG)" if minimum else "BG"}; F o desglose del componente {component}. Real usa publicadas si presentes, si no integrada. Simulada usa conjunta legacy para estatal y cero/[] para autonómico.')
    for symbol in ['cuotaIntegraAhorro','desgloseCuotaIntegraAhorro']:
        edge(L,symbol,'value',['caso.anio','baseLiquidableAhorro',D+'irpf-estatal-2012-2026.ts#obtenerTramosIrpfAhorro.return'],'Conjunta integrada anual, no celdas generales ni división por dos.')
    edge(L,'ahorroConMinimos','estatal|autonomico',['caso.anio','baseLiquidableAhorro','baseLiquidableGeneral','minimoPersonalYFamiliar','minimoPersonalYFamiliarAutonomico'], 'Llamada con mínimo estatal y autonómico distintos; resultados descompuestos en cuota-integra-ahorro.ts.')
    # Propiedades de filas: se separa selección de valor y valor aritmético.
    for prop,deps,formula in [
        ('[].cuota',['fila.cuota','base','fila.baseInferior','fila.tipo'],'Q+(B-L)*t; Q no se reconstruye integrando tipos.'),
        ('[].baseAplicada',['base','fila.baseInferior'],'B-L'),
        ('[].tipo',['fila.tipo'],'Identidad, fracción adimensional.'),
        ('[].cuotaFija',['fila.cuota'],'Identidad, EUR impuesto.'),
        ('[].limiteInferior',['fila.baseInferior'],'Identidad, EUR renta.'),
        ('[].limiteSuperior',['filas[].baseInferior','fila.baseInferior'],'Primera fila con baseInferior > L, o Infinity. Metadato; no entra en cuota publicada.')]:
        edge(G,'calcularDesgloseCuotaPorEscala',prop,deps,formula,'escalasPublicadas !== undefined; flatMap por tabla; findLast aplicable, B>0.')
    edge(G,'calcularDesgloseCuotaPorEscala','selection',['base','filas[].baseInferior','filas[].inferiorExclusivo'], 'findLast(B>0 && (exclusivo ? B>L : B>=L)); sin fila devuelve []; Murcia2022 L=60000 exclusivo.', role='selection')
    for prop,deps,formula in [
        ('[].cuota',['importeEnTramo','tipo'],'importeEnTramo*tipo'),
        ('[].baseAplicada',['base','estado.limiteAnterior','limite'],'min(max(0,B-anterior),limite-anterior)'),
        ('[].limiteInferior',['estado.limiteAnterior'],'Límite de la fila previa, inicial 0.'),
        ('[].limiteSuperior',['limite'],'Límite superior de esta pareja de tramos.'),
        ('[].tipo',['tipo'],'Segunda posición de pareja; no cuota publicada.')]:
        edge(G,'calcularDesgloseCuotaPorEscala',prop+'@integrada',deps,formula,'escalasPublicadas === undefined; B<=0 => []; solo acumula filas con importeEnTramo>0.')
    edge(G,'calcularCuotaPorEscala','return',['calcularDesgloseCuotaPorEscala.[].cuota'], 'Reduce suma desde base*0. No usa limites/tipo del desglose como otros sumandos.')
    # Ahorro: auxiliar interno componente nunca tratado como frontera.
    for prop,deps,formula in [
        ('remanente',['minimo','baseGeneral','base'],'min(max(0,M-max(0,BG)),max(0,BA))'),
        ('bruta',['anio','base','nombre'],'F_componente(BA)'),
        ('despuesMinimo',['anio','base','remanente','bruta','nombre'],'anio<=2014: F(max(0,BA-r)); desde2015: max(0,bruta-F(r))'),
        ('minoracion',['bruta','despuesMinimo'],'bruta - despuesMinimo')]:
        edge(A,'componente',prop,deps,formula,'nombre=estatal y minimoEstatal, o nombre=autonomico y minimoAutonomico; ambas llamadas en return de calcularAhorroConMinimos.')
    edge(A,'calcularCuotaComponenteAhorro','return',['anio','base','componente',P+'#obtenerEscalasAhorroPublicadas.return'], 'calcularCuotaPorEscala con tramos=[] y publicadas por componente.')
    edge(P,'obtenerEscalasAhorroPublicadas','return',['anio','componente'], '<=2014 estatal ordinario+complementario; autonómico ordinario. 2015 estatal AHORRO_2016_2020, autonómico AHORRO_AUTONOMICO_2015. 2016–20 común;2021–22;2023–24;2025 y continuidad técnica2026.',role='selection')
    # Selectores: todos los resolutores propios se expanden, incluida importación.
    for year in range(2012,2027):
        resolver=f'resolverParametrosComunidadAutonoma{year}'
        edge(C,'obtenerParametrosComunidadAutonoma',str(year),['entrada.anio',resolver], f'Match.when({year}); argumentos exactos conservados en expresión. Fallback => ComunidadAutonomaNoSoportada.',role='selection')
        if year==2026:
            edge(C,resolver,'return',['comunidadAutonoma'], 'Solo simulada-estatal: escala/minimos2025 y flags true; reales devuelven NoSoportada. No cierre normativo2026.',role='domain')
            continue
        stateyear=year if year<=2020 else 2025
        for prop,target in [('escalaEstatalGeneral',f'TRAMOS_IRPF_ESTATAL_GENERAL_{stateyear}'),('escalaAutonomica.tramos',f'obtenerEscalaAutonomicaIrpf{year}'),('minimosAutonomicos',f'obtenerMinimosAutonomicosIrpf{year}')]:
            f=D+(f'minimos-autonomicos-{year}.ts' if prop=='minimosAutonomicos' else f'irpf-autonomico-{year if prop.startswith("escalaAutonomica") else stateyear}.ts')
            edge(C,resolver,prop,[f+'#'+target], 'Tránsito de propiedad, no dependencia de los otros campos devueltos. Resolver importación hasta tabla/alias: ver hechos y rutas de importación exactas.', role='value')
            inputs = ['comunidadAutonoma'] if target.startswith('obtener') else ['literal/alias en fuente']
            if target.startswith('obtenerEscala') and year in (2014,2015):
                inputs.append('baseLiquidableGeneral')
            if (target.startswith('obtenerEscala') and year in (2015,2022,2023)) or (target.startswith('obtenerMinimos') and year in (2022,2023)):
                inputs.append('fechaFallecimiento')
            edge(f,target,'return' if target.startswith('obtener') else 'value',inputs, 'Selección o construcción exacta en expresión. Spreads mantienen orden: propiedad posterior sobrescribe anterior. Solo ruta tramos o mínimo pedido; fuente/nombre no son importes.',role='selection' if target.startswith('obtener') else 'value')
        edge(C,resolver,'escalaAutonomicaIgualEstatal',['comunidadAutonoma'], 'false hasta2015; desde2016 comunidad===simulada-estatal. Es esta propiedad la que decide conjunta legacy frente a dos componentes.',role='selection')
    edge(P,'obtenerEscalaAutonomicaPublicada','return',['anio','comunidadAutonoma','fechaFallecimiento'], 'Andalucía2012–15;Valencia2014–16;Catalunya2020–21 y2022–24;Madrid2022;Madrid2025 sin fallecimiento;Murcia2022 sin fallecimiento; resto undefined implica integrada.',role='selection')
    # Familiares ordinarios: propiedades numéricas y control de orden/rol.
    for file,symbol,prop,deps,formula in [
        ('minimo-contribuyente.ts','obtenerMinimoContribuyente','return',['edad','minimos.contribuyente.general','minimos.contribuyente.adicionalMayor65','minimos.contribuyente.adicionalMayor75'],'general + (edad>=65 ? adicional65:0) + (edad>=75 ? adicional75:0). minimos omitido usa2012/13/14 o2025.'),
        ('minimo-descendientes.ts','obtenerMinimoDescendientes','return',['descendientes[].edad','descendientes[].discapacidad._tag','minimos.descendientes'],'Filtra edad<25 o discapacidad; orden edad descendente; suma primero/segundo/tercero/cuartoYSiguientes y adicional si edad<3. No censo de derechos.'),
        ('minimo-descendientes.ts','minimoPorOrden','return',['indice','minimos.descendientes'],'0→primero,1→segundo,2→tercero,resto→cuartoYSiguientes.'),
        ('minimo-ascendientes.ts','obtenerMinimoAscendientes','return',['ascendientes[].edad','ascendientes[].discapacidad._tag','minimos.ascendientes'],'Suma mayor65OConDiscapacidad si edad>=65 o discapacidad, más adicionalMayor75 si edad>=75.'),
        ('minimo-discapacidad.ts','obtenerMinimoPorDiscapacidad','return',['discapacidad._tag','discapacidad.necesitaAyudaOMovilidadReducida','minimos.grado33Hasta65','minimos.grado65OMas','minimos.gastosAsistencia'],'Sin:0;33a64:grado33 + asistencia si ayuda;65OMas:grado65+asistencia. El rol selecciona su subobjeto.'),
        ('derechos.ts','cumpleRentas','return',['d.rentasNoExentasCentimos','d.declaracion.modalidad','d.declaracion.rentasCentimos'],'rentas<=800000 && (no-presenta || declaradas<=180000).'),
        ('derechos.ts','tieneRelacion','return',['t.residenteIrpf','t.relacion','t.custodia','t.alimentosJudiciales'],'Residente && (relación != ninguna || compartida) && !(alimentos && sin-custodia).'),
        ('derechos.ts','titularesConDerecho','return',['cumpleRentas(d)','d.edadDevengo','d.discapacidad._tag','d.titulares','tieneRelacion(t)'],'Descendiente elegible: posibles por relación; grado mínimo; si hay siguientes y todos cercanos renta<=800000 elegir siguientes; si no cercanos. No confundir renta titular con descendiente.'),
    ]:
        edge(M+file,symbol,prop,deps,formula, 'Helper parcial o derechos explícitos Madrid2025 según llamada; no equiparar sus dominios.')
    for symbol,rolepath,disability_input in [('obtenerMinimoDiscapacidadContribuyente','contribuyente','situacionFamiliar.discapacidad'),('obtenerMinimoDiscapacidadFamiliares','descendiente','familiares[].discapacidad'),('obtenerMinimoDiscapacidadAscendientes','ascendiente','ascendientes[].discapacidad')]:
        edge(M+'minimo-discapacidad.ts',symbol,'return',[disability_input,'minimos.discapacidad.'+rolepath,'obtenerMinimoPorDiscapacidad.return'], 'Helper por rol; contribuyente una llamada, familiares reduce suma desde0.')
    for prop,deps,formula in [
        ('contribuyente',['caso.edadContribuyenteDevengo','minimos.contribuyente'],'obtenerMinimoContribuyente anio2025, no prorrateado.'),
        ('ascendientes',['literal 0'],'new Decimal(0); contrato explícito excluye ascendientes.'),
        ('descendientes',['elegibles','titularesConDerecho','minimos.descendientes'],'Filtra contribuyente seleccionado, orden fechaNacimiento/sujetoId; por orden + incremento, dividido por titulares.length por cada descendiente. Incremento edad<3 o inicio2023–25.'),
        ('discapacidadFamiliares',['elegibles','minimos.discapacidad.descendiente'],'Suma discapacidad de cada elegible/divisor propio.'),
        ('discapacidadContribuyente',['caso.discapacidadContribuyente','minimos.discapacidad.contribuyente'],'Helper sin reparto.'),
        ('total',['contribuyente','descendientes','discapacidadContribuyente','discapacidadFamiliares'],'Suma sin ascendientes por contrato; no tabla de derechos de todos los familiares.')]:
        edge(M+'derechos.ts','calcularDerechosMinimos',prop,deps,formula,'Validación estructural y coherencia antes del cálculo; rechazo empates de nacimiento con distinto divisor.')
    for prop,deps,formula in [
        ('sujetoId',['d.sujetoId'],'Identidad del descendiente elegible.'),
        ('orden',['indice'],'indice+1 tras orden por nacimiento/sujetoId.'),
        ('titulares',['titularesConDerecho(d)'],'Map de titularId seleccionados.'),
        ('divisor',['titularesConDerecho(d).length'],'Número de titulares seleccionados de este descendiente.'),
        ('incremento',['d.edadDevengo','titular.vinculo.fechaInicioIncremento'],'edad<3 o año inicio entre2023 y2025, ambos inclusivos; inicio ausente0.'),
        ('minimo',['indice','minimos.descendientes','incremento','titulares.length'],'(porOrden + adicionalMenorTres si incremento)/divisor propio.'),
        ('discapacidad',['d.discapacidad','minimos.discapacidad.descendiente','titulares.length'],'Helper discapacidad por rol dividido por titulares.length.')]:
        edge(M+'derechos.ts','calcularDerechosMinimos','atribuciones[].'+prop,deps,formula,'Solo elegibles del contribuyente; no orden universal para familias rechazadas.')
    for symbol,formula in [('fechaValida','Año>=1875, mes1–12,día por mes, bisiesto%4/%100/%400; no Date normalizador.'),('validarDerechosMinimos','Schema exacto; IDs únicos, residencia, nacimiento/edad/devengo; vínculos/constitución separados de inicio incremento; mayoría por fecha completa; bisiesto ambiguo rechazado; custodias coherentes; máximo dos grados; rentas mixtas cercanas rechazadas.'),('validarRentasAnualesDerechos','Declaración de conciliación presente; renta finita; neto antes de reducción/compensación coincide half-up céntimos y lado de8000; no acredita hechos externos.'),('hayAlimentosPropiosSinMinimo','Algún titular propio alimentos judiciales y no elegido por titularesConDerecho => rechazo anual; no calcula especialidad.')]:
        edge(M+'derechos.ts',symbol,'admission',['caso.derechosMinimos','rentaNoExenta si conciliación'],formula,role='domain')
    # Explicito: asignaciones de neto, cuotas y salida posterior.
    for symbol,prop,deps,formula in [
        ('neto','value',['trabajo.rendimientoAntesArt20','reduccionArt20','actividad.aporte.importeEurosExactos'],'Trabajo: netoAntesArt20 - min(max(0,netoAntesArt20), reduccion(argumentoArt20,otras=0)); EDS: aporte exacto ya reducido, sin art20.'),
        ('base','value',['neto'],'max(neto,0) exclusivamente para tarifas; BIG/BLG devuelven neto con signo.'),
        ('cuotaEstatal','value',['base','MINIMOS_ESTATALES_2025.contribuyente.general','parametros.escalaEstatalGeneral'],'max(0,Fest(base)-Fest(min(base,ME.contribuyente.general))).'),
        ('cuotaAutonomica','value',['base','parametros.minimosAutonomicos.contribuyente.general','publicada','parametros.escalaAutonomica.tramos'],'max(0,FA(base)-FA(min(base,MA.contribuyente.general))); publicada Madrid2025 ordinaria.'),
        ('liquida','value',['cuotaEstatal','cuotaAutonomica'],'Suma legal anterior a DA61.'),
        ('posterior','value',['liquida','brutoServicios','resultado.cuotaPosterior'],'Inicial liquida; si brutoServicios>0 sustituir por DA61.cuotaPosterior. Pensión y EDS conservan liquida.'),
    ]:
        edge(X,symbol,prop,deps,formula,'Schema CasoFiscalAnualExplicito: individualMadrid2025,18–64,sin familiares/discapacidad/otras rentas/saldos, dos perfiles disjuntos.')
    # DA61 es dominio propio de deducciones, no frontera del motor laboral.
    T='lib/dominio/irpf/trabajo-anual/calcular.ts'
    for prop,formula in [('deduccionLegal','DA61: otras>6500 o bruto=0 =>0; si no max(0,340-max(0,bruto-16576)*0.2). Histórico80bis: max(0,400-max(0,BI-8000)*0.1).'),('limiteAtribuible','DA61: BLG=0→0, si no cuotaIntegraGeneral*netoReducidoServicios/BLG. 80bis: rendimientoComputable*(tipoMedioE+tipoMedioA)/100.'),('importeAplicable','min(legal,limite,cuotaTrasArt80).'),('cuotaPosterior','cuotaTrasArt80-aplicable; conserva líquida legal anterior.')]:
        edge(T,'calcularDeduccionTrabajo',prop,['caso.regla','caso campos de fórmula'],formula,'DA61 solo2025, calificación acreditada, cuotaTrasArt80<=liquidaTotal,neto<=bruto y<=BLG; histórico80bis contrato distinto, tipos<=100.')
    for file,symbol,inputs,formula,condition in [
        (G,'calcularCuotaPorEscalaGeneral',['anio','base','obtenerTramosIrpfLegacy.return'],'Desglose con tabla conjunta legacy y reduce suma tramo.cuota desde base*0.','Solo llamada de la rama sin escala autonómica real.'),
        (G,'calcularDesgloseCuotaPorEscalaGeneral',['anio','base','obtenerTramosIrpfLegacy.return'],'Tránsito a calcularDesgloseCuotaPorEscala sin publicadas.','Solo llamada de la rama sin escala autonómica real.'),
        (A,'calcularCuotaPorEscalaAhorro',['anio','base','obtenerTramosIrpfAhorro.return'],'calcularCuotaPorEscala con tabla conjunta integrada anual.','No usa obtenerEscalasAhorroPublicadas.'),
        (A,'calcularDesgloseCuotaPorEscalaAhorro',['anio','base','obtenerTramosIrpfAhorro.return'],'calcularDesgloseCuotaPorEscala con tabla conjunta integrada anual.','No usa tabla general.'),
        (D+'irpf-estatal-2012-2026.ts','obtenerTramosIrpfLegacy',['anio'],'<=2014 HASTA_2014;2015 TRAMOS2015;<=2020 TRAMOS2016_A_2020;resto DESDE2021.','Tabla de contraste; no se presenta como componente estatal legal.'),
        (D+'irpf-estatal-2012-2026.ts','obtenerTramosIrpfAhorro',['anio'],'Match2012 a2024 por tabla anual;orElse tabla2025, incluida continuidad2026.','Tabla conjunta; ninguna de264 celdas generales.'),
        (M+'minimo-contribuyente.ts','minimosEstatalesDelAnio',['anio'],'Match2012,2013,2014 tabla estatal correspondiente;resto2025.','Solo default cuando no se suministra minimos.'),
        ('lib/dominio/irpf/integracion/base-imponible-general.ts','calcularBaseImponibleGeneral',['rendimientoTrabajo.rendimientoNeto','reduccionRendimientosTrabajo','rendimientoCapitalInmobiliario.rendimientoNeto','gananciaPatrimonialGeneral'],'max(0,netoTrabajo-(reduccion??0))+(netoInmobiliario??0)+(gananciaGeneral??0).','Conserva signo de los dos últimos sumandos.'),
        ('lib/dominio/irpf/integracion/base-imponible-ahorro.ts','calcularBaseImponibleAhorro',['gananciasPatrimoniales.gananciaSujetaAhorro'],'max(0,gananciaSujetaAhorro).','No recibe capital mobiliario no representado.'),
        (X,'estatal',['b','parametros.escalaEstatalGeneral'],'calcularCuotaPorEscala({base:b,tramos:escalaEstatalGeneral}).','Explícito2025.'),
        (X,'autonomica',['b','parametros.escalaAutonomica.tramos','publicada'],'calcularCuotaPorEscala({base:b,tramos,escalasPublicadas:publicada===undefined?undefined:[publicada]}).','ExplícitoMadrid2025 sin fallecimiento.'),
        (X,'brutoServicios',['empleo','trabajo.gastos.integro'],'Inicial0; solo empleo laboral/estatutario sustituye por integro de servicios.','Pensión y EDS quedan0. Las clases vacías o mezcladas se rechazan.'),
        (X,'reduccionArt20',['neto','trabajo.argumentoArt20','calcularReduccionTrabajoConOtrasRentas.return'],'Inicial0; trabajo sustituye por min(max(neto,0),reduccion con otrasRentas=0).','EDS no aplica art20.'),
    ]:
        edge(file,symbol,'return',inputs,formula,condition)
    old=read(OLD/'flujo.json.gz')
    sites=[]
    for s in old['sites']:
        direct=s['valueDependencies']['direct']
        roots=[d['symbol'] for d in direct]
        relevant=[e['id'] for e in EDGES if e['output']['file']==s['source']['file'] and e['output']['symbol'] in roots]
        if s['siteId'].endswith('-tramo'):
            relevant += [e['id'] for e in EDGES if e['output']['file']==G and e['output']['symbol']=='calcularDesgloseCuotaPorEscala']
        if s['siteId']=='anual.cuota.ahorro-componente-postminimo':
            relevant += [e['id'] for e in EDGES if e['output']['file']==A]
        if s['siteId']=='anual.minimo.discapacidad':
            relevant += [e['id'] for e in EDGES if e['output']['file']==M+'minimo-discapacidad.ts']
        sites.append({'siteId':s['siteId'],'subject':s['subject'],'historicalSnapshot':s['snapshot'],'historicalSelector':s['historicalSelectorPreserved'],'source':s['source'],'expression':s['expression'],'roots':roots,'edges':relevant,'localStatus':'candidate-local-closure-with-declared-boundaries','composition':'pending-other-lots','legalAcceptance':False,'independentReview':'pending'})
        current=sites[-1]
        arrays={
            'anual.cuota.general-estatal-tramo':'desgloseCuotaIntegraGeneralEstatal',
            'anual.cuota.general-autonomica-tramo':'desgloseCuotaIntegraGeneralAutonomica',
            'anual.cuota.minimo-estatal-tramo':'desgloseCuotaMinimoPersonalEstatal',
            'anual.cuota.minimo-autonomico-tramo':'desgloseCuotaMinimoPersonalAutonomica',
            'anual.cuota.ahorro-tramo':'desgloseCuotaIntegraAhorro',
        }
        if s['siteId'] in arrays:
            array=arrays[s['siteId']]
            current['instanceBindings']={'instancia':'indice del map de '+array,'importe':'elemento.cuota','arrayProducer':proof(L,array),'meaning':'Solo la propiedad cuota del elemento realmente emitido; no cada número de la declaración.'}
        elif s['siteId']=='anual.cuota.ahorro-componente-postminimo':
            current['instanceBindings']=[{'instancia':0,'nombre':'estatal','componente':'ahorroConMinimos.estatal','importe':'despuesMinimo'},{'instancia':1,'nombre':'autonómico','componente':'ahorroConMinimos.autonomico','importe':'despuesMinimo'}]
        else:
            current['instanceBindings']={'instancia':0,'importe':roots,'meaning':'Expresión exacta en source/expression; si hay varios sumandos no se duplica el importe.'}
    write('grafo.json.gz',{'version':2,'head':'07c07e6376a72f229be735a904ecf36517a1b571','inventory':old['inventory'],'direction':'output-to-input','sites':sites,'edges':EDGES,'wiringAllowed':False,'globalClosure':False})
    cells=read(OLD/'celdas-flujo.json.gz')
    for cell in cells:
        cell['edition']='R23, fuente R21 preservada por separado'
        cell['resolutionR23']={'selection':proof(P,'obtenerEscalaAutonomicaPublicada') if not cell['symbol'].startswith('ESTATAL_') else proof(L,'escalasPublicadasEstatales'),'rowSelection':proof(G,'calcularDesgloseCuotaPorEscala','base.gt(0) &&'),'arithmetic':proof(G,'calcularDesgloseCuotaPorEscala','cuota: fila.cuota.plus(\n                  base.minus(fila.baseInferior).mul(fila.tipo)\n                )'),'scopeNotExtended':True,'independentReview':'pending'}
        if not cell['symbol'].startswith('ESTATAL_'):
            cell['resolutionR23']['additionalConsumer']={'siteId':'anual.deducciones.autonomicas','propertyPath':'cuota autonómica general - cuota mínimo autonómico -> max0 -> capacidad con ahorro autonómico -> min(declarada,capacidad)','condition':'Solo rama real; si cambia capacidad limitante. No convierte celda general en celda del ahorro.','evidence':proof(L,'deduccionesAutonomicasAplicadas')}
    assert len(cells)==264 and len({c['occurrenceId'] for c in cells})==102
    write('celdas.json.gz',cells)
    omissions=[]
    for site in sites:
        original=next(s for s in old['sites'] if s['siteId']==site['siteId'])
        omissions.append({'siteId':site['siteId'],'before':original.get('omissions',original.get('completeness')),'after':site['localStatus'],'resolvedEvidence':site['edges'],'dataContinuations':'rutas-datos.json.gz, por propiedad/año/territorio; condiciones especiales en AMPLIACION.md','notApplicable':['No existe descomposición por código de deducción en esta ruta; lista no vacía rechaza.'] if site['siteId']=='anual.deducciones.autonomicas' else [],'exactBoundaryContracts':'fronteras.json: identidad fuente/símbolo, argumentos y salidas por llamada; no se trata un helper interno como externo.','review':'pending'})
    write('omisiones.json',omissions)
    boundaries: list[dict[str, Any]]=[]
    for file,symbol,args,outputs,call_file,call_symbol,consumers in [
        ('lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts','calcularRendimientoNetoTrabajo',{'anio':'caso.anio','rendimientoIntegro':'rendimientoIntegroTrabajo','cotizacionTrabajador':'cotizacionesSociales.cotizacionTrabajador'},['rendimientoNeto','rendimientoPrevioNeto'],L,'rendimientoTrabajo',['base.general-imponible']),
        ('lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts','sumarRendimientosTrabajo',{'rendimientos':'caso.rendimientos.trabajo','convertirCentimos':'centimosAEuros'},['return Decimal'],L,'rendimientoIntegroTrabajo',['base.general-imponible']),
        ('lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts','calcularRendimientoNetoCapitalInmobiliarioSimplificado',{'rendimientoIntegro':'rendimientoIntegroCapitalInmobiliario'},['rendimientoNeto'],L,'rendimientoCapitalInmobiliario',['base.general-imponible']),
        ('lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts','sumarRendimientosCapitalInmobiliario',{'rendimientos':'caso.rendimientos.capitalInmobiliario ?? []','convertirCentimos':'centimosAEuros'},['return Decimal'],L,'rendimientoIntegroCapitalInmobiliario',['base.general-imponible']),
        ('lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts','calcularGananciasPatrimonialesPorTransmision',{'anio':'caso.anio','edadContribuyente':'caso.situacionFamiliar.edad','ganancias':'caso.rendimientos.gananciasPatrimoniales ?? []','convertirCentimos':'centimosAEuros'},['gananciaSujetaGeneral','gananciaSujetaAhorro'],L,'gananciasPatrimoniales',['base.general-imponible','base.ahorro']),
        ('lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts','calcularReduccionTrabajoConOtrasRentas',{'anio':'caso.anio','fechaFallecimiento':'caso.fechaFallecimiento','rendimientoPrevioNeto':'rendimientoTrabajo.rendimientoPrevioNeto','otrasRentasNoExentas':'netoInmobiliario+gananciaGeneral+gananciaAhorro'},['return Decimal'],L,'reduccionRendimientosTrabajo',['base.general-imponible']),
        ('lib/dominio/laboral/cotizaciones-perfil-uniforme.ts','calcularDesgloseCotizacionesPerfilUniforme',{'anio':'caso.anio','salarioBrutoAnual':'rendimientoIntegroTrabajo','branch':'contexto.modo===canonico'},['cotizacionTrabajador'],L,'cotizacionesSociales',['base.general-imponible']),
        ('lib/dominio/laboral/cotizaciones-sociales.ts','calcularDesgloseCotizacionesSocialesLegacy',{'anio':'caso.anio','salarioBrutoAnual':'rendimientoIntegroTrabajo','branch':'contexto.modo!==canonico'},['cotizacionTrabajador'],L,'cotizacionesSociales',['base.general-imponible']),
        ('lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts','RetencionTrabajoAeat',{'entrada':'caso.retencionTrabajoAeat','contexto':'contexto','branch':'entrada!==undefined; anio coherente'},['calcular.return.importeRetencionAnualCentimos'],L,'retencionTrabajoAeat',['cuota.diferencial']),
        ('lib/dominio/irpf/trabajo-anual/adaptador.ts','adaptarTrabajoAnual',{'entrada':'caso.trabajo'},['estado','motivo si no-soportado','rendimientoAntesArt20','argumentoArt20','gastos.integro'],X,'trabajo',['explicito.big','explicito.blg','explicito.cuota.posterior']),
        ('lib/dominio/irpf/actividades-economicas/adaptador.ts','adaptarActividadGeneral',{'entrada':'caso.actividad','branch':'solo-actividad-eds; activos.length=0 y discapacidad.grado=0'},['estado','motivos si no-soportado','aporte.importeEurosExactos'],X,'actividad',['explicito.big','explicito.blg']),
    ]:
        boundaries.append({'id':file+'#'+symbol,'source':proof(file,symbol),'arguments':args,'outputs':outputs,'call':proof(call_file,call_symbol),'consumers':['anual.'+c for c in consumers],'interpretation':'Contrato externo de salida exacta; no se replica implementación ni se acepta su composición.','review':'pending'})
    boundaries.append({'id':'reduccion-explicita-art20','source':proof('lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo.ts','calcularReduccionTrabajoConOtrasRentas'),'arguments':{'anio':2025,'rendimientoPrevioNeto':'trabajo.argumentoArt20','otrasRentasNoExentas':'0'},'outputs':['return Decimal'],'call':proof(X,'liquidarIrpfAnualExplicito','reduccionArt20 = D.min('),'consumers':['anual.explicito.big','anual.explicito.blg'],'review':'pending'})
    for boundary in boundaries:
        boundary['source'].pop('expression')
    write('fronteras.json',boundaries)
    madrid=read(OLD/'concepto-madrid.json')
    madrid['editionR23']={'path':['ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.madrid.tramos[3][0]','ESCALAS_AUTONOMICAS_IRPF_2020.madrid.tramos','obtenerEscalaAutonomicaIrpf2020(madrid)','resolverParametrosComunidadAutonoma2020.escalaAutonomica.tramos','obtenerParametrosComunidadAutonoma({anio:2020,comunidadAutonoma:madrid})','calcularDesgloseCuotaPorEscala.tramos[3].limiteSuperior / estado.limiteAnterior siguiente','cuota general y cuota minimo autonómico'],'dataRoute':{'year':2020,'community':'madrid','domain':'escala','artifact':'rutas-datos.json.gz'},'effect':'Ancho tramo3 y comienzo tramo4; límite en EUR renta. Publicada2020 undefined, integrada efectiva.','downstreamAdditional':['anual.deducciones.autonomicas'],'review':'pending','legalAcceptance':False}
    write('madrid.json',madrid)
    print(len(sites),'sitios;',len(EDGES),'relaciones candidatas;264 decisiones/102 ocurrencias, sin aceptación')


if __name__=='__main__':
    main()
