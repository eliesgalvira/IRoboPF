"""Matriz documental: localizar texto no constituye validar un paso fiscal."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VERSIONES = [
    (2012, 'enero', 'c71f36655219', '23/12/2011'),
    (2012, 'febrero', 'a2ba73e20188', '27/01/2012'),
    (2013, 'anual', 'ee99aaa55951', '28/12/2012'),
    (2014, 'anual', '32edd53758bf', '26/12/2013'),
    (2015, 'enero-revision', '218d9a988b28', '14/01/2015'),
    (2015, 'julio-revision', 'e0f7f92d96c6', '13/07/2015; indice anuncia 14/07/2015'),
    (2016, 'anual', '32e6d445c02e', '24/11/2015'),
]
PASOS = {
    'remuneracion': ('RETRIB', 'El contrato recibe una previsión anual normalizada; no reconstruye todas las retribuciones ni su imputación.'),
    'irregularidad': ('IRREGULAR', 'Ref 2020 no prueba el régimen del 40 % anterior a 2015; comprobar límites y transitorios por ejercicio.'),
    'gastos': ('GASTOS', 'Antes de 2015 no trasladar el gasto general moderno de 2.000. Enero 2015 contiene revisión específica de discapacidad.'),
    'reduccion-trabajo': ('REDUCCI', '2012–2014 tienen régimen antiguo; 2015–2016 no usan 5.565/13.115/1,5 de ref 2020. Cotejar fórmula completa y otras reducciones.'),
    'reducciones-personales': ('PENSION', 'Examinar pensión, desempleo y más de dos descendientes por separado; coincidencia de 600 no prueba acumulabilidad.'),
    'minimos': ('MÍNIMO', 'Ref 2020 usa 5.550 y cuantías posteriores; no trasladar a 2012–2014. Desde 2015 falta comparar elegibilidad y reparto.'),
    'escala': ('TABLA 2', 'Enero 2012 difiere del complemento de febrero–2014; 2015 tiene dos escalas con corte 34.000; ref 2020 usa 35.200. 2016 comparte escala nominal, no procedimiento completo.'),
    'exclusion': ('TABLA 1', 'Tabla 2012–2014 y tabla 2015–2016 requieren ocho celdas y condiciones propias; no inferir desde la tabla 2020.'),
    'limite43': ('0,43', 'Comparar el rango 22.000 y las condiciones, no solo el factor. Ref 2020 usa 22.000; no validar por igualdad.'),
    'deduccion80bis': ('DEDUC', '2012–2014 contienen tipo/importe previos y deducción. RD1003/2014 suprime art85bis desde 2015; no confundir con deducciones posteriores.'),
    'tipo-minimo': ('TIPO', 'Ref 2020 usa mínimos Ceuta/Melilla 6/0,8; los históricos requieren tratamiento propio 8/1 y excepciones.'),
    'tipo-maximo': ('TIPO', 'Comparar topes de regularización por año; el contrato actual no implementa regularización.'),
    'redondeos': ('REDON', 'Tipo previo entero histórico y tipo final decimal no equivalen al truncamiento directo moderno; cotejar cada operación.'),
    'regularizacion': ('REGULAR', 'No soportada en el contrato canónico actual ni sustituible por repetir cálculo inicial. Revisiones2012febrero y2015julio esenciales.'),
    'comunicacion': ('COMUNIC', 'Hechos comunicados y fecha de eficacia no se acreditan mediante el cálculo aritmético; falta contrato completo.'),
    'multiples-pagadores': ('PAGADOR', 'El servicio actual no modela el procedimiento especial del art89.A; sumar pagadores no lo implementa.'),
    'vivienda': ('VIVIENDA', 'Comprobar elegibilidad, régimen 2012 y transición 2013, límites y regularización; booleano de ref 2020 insuficiente.'),
    'ceuta-melilla': ('CEUTA', 'La reducción histórica a la mitad no equivale al factor 0,4 de 2020; revisar mínimos y regularización por residencia.'),
    'validaciones': ('VALIDACI', 'Céntimos seguros y divisores positivos no acreditan todas las restricciones legales ni XML histórico.'),
    'fecha-aplicacion': ('EJERCICIO', 'Separar fecha de portada, publicación, pago, período del rendimiento y opción de regularización. El catálogo actual no selecciona 2012–2016.'),
}


def main():
    fuentes = json.loads((ROOT / 'fuentes.json').read_text())
    citas = json.loads((ROOT / 'citas.json').read_text())
    matriz = []
    for anio, version, prefijo, fecha in VERSIONES:
        fuente = next(f for f in fuentes if f['sha256'].startswith(prefijo))
        for paso, (palabra, comparacion) in PASOS.items():
            candidatas = [c['id'] for c in citas if c['documentSha256'] == fuente['sha256']
                          and palabra in c['quote'].upper() and (c['page'] > 4 or paso == 'fecha-aplicacion')]
            matriz.append({'year': anio, 'version': version, 'fechaPortada': fecha, 'step': paso,
                           'documentSha256': fuente['sha256'], 'citasCandidatas': candidatas,
                           'metodoLocalizacion': 'Busqueda literal por pagina, sin inferencia de vigencia ni suficiencia',
                           'status': 'ambiguous' if candidatas else 'missing',
                           'comparacionMotorYRef 2020': comparacion,
                           'motorCanonico': 'ResultadoNoSoportado para 2012–2016 por ausencia de version en catalogo; lectura estatica',
                           'carencia': 'Autenticidad, interpretación, binding por subpaso y prueba numérica pendientes; sin candidato textual no se afirma ausencia del paso en PDF.',
                           'review': 'pendiente-nueva', 'acceptance': False})
    (ROOT / 'cobertura.json').write_text(json.dumps({'matriz': matriz, 'total': len(matriz),
                                                   'pasosPorVersion': 20, 'aceptados': 0,
                                                   'versionesPrevias 2015': 'No recuperadas; no cubiertas por las140 filas'}, ensure_ascii=False, indent=2) + '\n')
    archivos = ['lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts',
                'lib/dominio/irpf/retenciones/versiones/catalogo.ts',
                'lib/dominio/normativa/datos/irpf-retenciones-trabajo-2012-2026.ts']
    (ROOT / 'motor-leido.json').write_text(json.dumps([{'path': p, 'sha256': hashlib.sha256(Path(p).read_bytes()).hexdigest(),
                                                      'size': Path(p).stat().st_size} for p in archivos], indent=2) + '\n')
    print(f'{len(matriz)} celdas candidatas; cero aceptaciones')


if __name__ == '__main__':
    main()
