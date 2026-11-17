# Proyección de dos expedientes sintéticos

Contrato cerrado para CLM01 y Catalunya10, ejercicio 2025. H es el slot completo
con vivienda, contrato diciembre 2024 y doce pagos de 600 EUR. P(H) conserva todos
los campos de entradaAPI sin alteración: edad, territorio, ejercicio, modalidad,
trabajo, seguridad social, retenciones y las restantes declaraciones expresas.
Los campos de habitación omitidos del transporte están enumerados exhaustivamente
por expediente en la referencia. H se devuelve congelado recursivamente. Ni P ni
el medidor sustituyen H por entradaTrabajoIndividualReferencia.

El contrato afirma igualdad fiscal H/P(H) sólo bajo las guardas de estos dos H
fijados por SHA. CLM excluye cada una de las cinco vías por edad 40, ausencia de
dación, familia numerosa, monoparentalidad y discapacidad. Los máximos históricos
450 no se aplican a 2025: Ley 1/2026 art.18 y efectos 1/1/2025 están seleccionados.
En Cataluña fallan todas las alternativas de 612-3.1.a y también la vía
independiente de familia numerosa/monoparental de 612-3.2. La renta computable
20500 no excluye: no se confunde con bruto 30000. DF3 Ley 8/2025, efectos 1/1/2025,
es distinta de la entrada en vigor general. Violencia de género=false es una
guarda conservadora adicional: las citas seleccionadas no prueban otra vía.

LIRPF DT15 exige contrato anterior a 1/1/2015 para el régimen transitorio; aquí
el contrato es nuevo en 2024. Art.19 enumera gastos laborales y no incluye alquiler
habitual. No hay derecho de inversión, traslado, derechos sobre otras viviendas
ni rentas inmobiliarias propias. Son hechos expresos de H, nunca blancos de UI.
La proyección no demuestra una regla general de exclusión ni evalúa variantes.
Toda variante, aunque pareciera irrelevante, sale de esta whitelist sin repinear.

Los originales conservan su reserva histórica de captura parcial. El nuevo
binding reconstruye sus SES mediante C_SES_NODE (Node 24.19.0 Nix fijado por hash),
los decodifica nuevamente y contrasta identidad, región, edad y salarios con los
readbacks y el PDF original, derivado mediante el lector existente. RESULTADO,
CDIF, PDF0670 y resumen deben coincidir; ingreso positivo, devolución negativa.
Los totales observados son 726.00 y 758.75; no son constantes de aceptación.
Se exige cero explícito agregado en resumen y PDF0564. El cero documental de
alquiler sigue separado y el importe específico de alquiler Open permanece null.

El medidor rehace el vínculo antes de liquidar P con la API existente y compara
su cuotaDiferencialPresentada con el total derivado usando céntimos exactos.
Sólo igualdad numérica más vínculo válido puede sumar una coincidencia. Siempre
viviendaTransportada=false y transportComplete=false, aun con proyección verificada.
Los casos del manifiesto permanecen intactos; la envoltura de observación conserva
todos los hechos y pesos y añade resultado y evidenciaOpen.proyeccionInquilino
con packageSha256. El paquete se busca relativo al documento de medición en
proyeccion-inquilinos/originales.json. No aporta confianza una bandera copiada.

El paquete identifica el original DOGC-L8-2025-alt con SHA256
c52b4bbdbef9ff1419959c70c8bd7ed6270e570c74dde8d12accbed77ce9d928,
identificado por su URL oficial en normativa/citas.json. La cita temporal y el
artículo completo acompañan a las páginas normativas publicadas. La referencia
distingue el original completo del extracto PDF; la vinculación se ha ejecutado.

Las 27 pruebas de autor pasan. La matriz independiente cubre separación de
autoridad, entradas simultáneas slot/fixture, fronteras y vías, régimen estatal,
originales sustituidos, ausencia de fuentes y resultado copiado. Las fronteras
son rechazos del contrato cerrado; no se presentan como deducciones positivas.
Comando reproducible desde la raíz y su entorno Nix declarado, con C_SES_NODE
apuntando al ejecutable fijado en la referencia:

```
timeout -k 30s 12m bun run test tests/inquilinos-exclusion.test.mjs tests/inquilinos-exclusion-independiente.test.mjs tests/inquilinos-proyeccion.test.mjs tests/inquilinos-proyeccion-medidor.test.mjs --maxWorkers=1
```

El cotejo completo acredita 72/80, con 75 resultados comparables. Los dos nuevos
casos conservan sus importes observados, hechos y pesos; las tres diferencias
de un céntimo siguen abiertas. La revisión independiente encontró un desvío al
vínculo salarial al renombrar un expediente y quitar su descriptor. El adverso
reprodujo el defecto. Ahora la presencia de hechos de vivienda exige un vínculo
específico, incluso fuera del manifiesto cerrado; el control salarial sin esos
hechos sigue admitido. No se modifica ninguna fórmula fiscal.

## Incorporación del original temporal

El original DOGC-L8-2025-alt está identificado con su SHA256 ya fijado en las citas y conservado íntegro para auditoría. El extracto público no cambia hechos, importes ni expectativas. Las pruebas positivas de Cataluña y CLM pasan. Este alcance no certifica otras viviendas ni el ejercicio completo.

## Extractos normativos públicos

Los tres HTML del BOE se publican como extractos literales del elemento
`div#textoxslt` completo, sin cabecera ni pie de navegación. No se presentan como
el archivo original completo: `sha256` identifica la recepción original y
`extractoPublico.sha256` identifica los bytes publicados. Los intervalos UTF16
permiten reproducir el corte sobre el original y trasladar las citas estatales
sin cambiar su contenido. Los selectores históricos se refieren al original.
Los originales completos se conservan para auditoría. Del DOGC se publican las
páginas físicas 30–33 completas como páginas 1–4 del extracto: contienen el
artículo 612-3 entero, sus efectos desde enero de 2025 y la entrada en vigor
general diferenciada. El texto extraído y los píxeles renderizados coinciden
con esas cuatro páginas originales. El HTML del DOCM permanece completo.
Los localizadores del DOGC conservan la numeración física original y su mapa
figura en `extractoPublico`. No se amplían las excepciones del sanitizador.
