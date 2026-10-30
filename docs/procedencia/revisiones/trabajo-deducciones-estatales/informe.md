# Contrarrevisión de trabajo y deducciones estatales

Dictamen histórico: los defectos y estados descritos corresponden a la versión examinada. El [informe final](../../INFORME-FINAL.md) recoge el resultado posterior y sus condiciones.

Base declarada: d9ff49c7. `motor-examinado.json` fija los hashes de los módulos examinados.

**35 decisiones individuales: 32 aceptaciones acotadas y 3 pendientes de evidencia (TDE-27, 28 y 35).** «Accepted» acepta únicamente `acceptanceScope` del registro, incluida en muchos casos la constatación de una ausencia. No certifica una regla completa, un ejercicio, el inventario ni una declaración. Los candidatos antiguos conservan su estado en la auditoría original; `previousStatus` lo registra aquí.

## Defectos reproducidos

Se ejecutó el TypeScript real con Bun, sin reimplementar sus fórmulas: 144 casos anuales con entradas completas, 100 sondeos de reducción y tres representaciones de fecha. `casos-resultados.json` conserva entradas, supuestos y salida íntegra. `casos-verificados.json` contiene 32 comprobaciones discriminantes: 28 rojas y cuatro controles verdes. Son discrepancias esperadas antes de cualquier fix, no una suite de regresión aprobada.

- TDE-09: bruto 9000 y ganancia sujeta 7000, 2012/2014, conservan reducción 4080 donde corresponde 2652. Con otras rentas exactamente 6500 se conserva 4080. La corrección no debe suprimir toda la reducción histórica.
- TDE-10: otras rentas 6500,01/7000 no anulan la reducción desde 2015. Se ejecutaron 2015, 2024, 2025 y el perfil técnico 2026. La suma algebraica de otras rentas debe preceder a reducciones y compensaciones; no sirve copiar una base imponible.
- TDE-18: rendimiento previo 19747,50 devuelve −0,0028 en 2024–2026; debe quedar excluido. Se conservan controles a 19747,49 y 19747,51. Esto prueba la etapa Decimal, no un cambio necesario de céntimo en toda cuota final. Tampoco decide cómo tratar importes con más de dos decimales inmediatamente inferiores al umbral.
- TDE-04/19: con trabajo cero se informan gastos generales 2000 desde 2015 y una reducción teórica positiva. La base queda en cero. Se acepta el problema de información aplicada/teórica, sin afirmar una deuda incorrecta para este caso.
- TDE-23: salario 12000, Madrid, única renta y sin reducciones de base: en 2012 la cuota diferencial observada es 664,10 y, aislando la deducción histórica de 400, debería quedar en 264,10; en 2014, 653,19 frente a 253,19. BI inferior a 8000 y cuota atribuible al trabajo superior a 400. La expectativa conserva las restantes etapas del motor: no valida sus escalas, mínimos ni política de redondeo. El límite específico por tipo medio del art80bis debe implementarse también; no basta restar400 universalmente.
- TDE-20: salario16576, Madrid2025, empleo efectivo único, sin otras rentas ni pagos: diferencial287,12 frente a0 después de DA61 limitada a cuota. Se asume que la SS estimada coincide con la efectiva para aislar la deducción; no se acepta esa inferencia como contrato general.

El primer intento anual de Madrid2026 produjo `ResultadoNoSoportado`: el motor restringe ese año al perfil técnico `simulada-estatal`. Los 24 casos de2026 usan expresamente ese perfil; no acreditan una liquidación madrileña2026.

## DA61: orden, alcance y cadena

Ley5/2025, DF3, pp46–47: efectos desde1enero2025; servicio efectivo laboral/estatutario, umbral18276, tramo pleno hasta16576 y340. RDL5/2026, art28, pp45–46: efectos desde1enero2026; umbral20048,45, tramo pleno17094 y590,89. Se releyeron la corrección BOE-A-2026-6005 (no modifica art28) y la convalidación [BOE-A-2026-6483](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-6483). La convalidación no convierte2026 en ejercicio cerrado.

La pensión es trabajo para art20, pero no servicio efectivo elegible para DA61. El ejemplo AEAT2025 pp1373–1374 de salario6000, pensión12000 e intereses150 excluye la deducción. Ese perfil no se ha ejecutado fiscalmente: falta clasificación de trabajo/pensión en el contrato. El límite proporcional y el orden tras art80 se acreditan documentalmente, pero los escenarios mixtos no están aceptados como implementación.

**Precisión al informe del autor:** la omisión anual se confirma en cuota diferencial. La norma manda restar DA61 de la cuota líquida total una vez practicada art80; no autoriza redefinir la cuota líquida legal restándole DA61. El integrador deberá añadir la etapa correcta y evitar que la conciliación legacy la vuelva a deducir. No se acepta una propuesta de fix que simplemente reste340/590,89 al campo existente sin revisar el contrato.

## Gastos y obligación de declarar

Cotización efectiva, sindicato, colegio, defensa, movilidad y discapacidad activa faltan como hechos de entrada. Los originales art19/20 y art10 RIRPF acreditan los requisitos y límites descritos individualmente. Se aceptan las ausencias, no evaluadores inexistentes. No se ejecutaron los bordes de gastos efectivos, colegiación obligatoria, litigio con pagador, rendimientos asociados a movilidad o actividad simultánea con discapacidad. Introducir propiedades ignoradas en JavaScript no habría sido una prueba válida del contrato.

DT6 de2015: la lectura ampliada del manual2015 pp144–145 respalda el incremento histórico de movilidad y su incompatibilidad con el nuevo incremento por movilidad. No elimina el gasto general ni convierte dos incrementos en acumulables. No se acepta una liquidación completa a partir de esa sola cita.

TDE-31 a34: alta por cuenta propia RETA/RETM desde2023, IMV y unidad de convivencia desde2020, clasificación de fuentes y ejercicio de derechos son causas distintas. El contrato no contiene un evaluador ni todos esos hechos. Los casos de rendimiento cero, menor IMV, alquiler ordinario de1 euro y solicitud voluntaria de devolución quedan **no ejecutados**. Su ausencia está acreditada por código y originales; no se finge un resultado booleano del motor.

TDE-26: se completó la cadena con nueva adquisición BOE-A-2025-994, corrección íntegra de dos páginas: no modifica art6/art96. RDL9/2024 p42, derogación BOE-A-2025-1136 y manual2025 p26 respaldan2500 solo para devengos1–22enero2025. No se aplica por fecha de cobro. La resolución se contrastó también en [BOE](https://www.boe.es/buscar/doc.php?id=BOE-A-2025-1136).

## Objeciones documentales y decisiones

1. **Separar literal y vigencia.** Objeción: un contenedor HTML puede mezclar notas, versiones y redacciones no seleccionadas. Motivo: la cita focal de alquiler33007,20 en `lirpfactual` no permite aceptar el catálogo histórico. Coste: TDE27/28 quedan pendientes de auditorías por familia y año, aunque la carencia de inputs sea observable.
2. **Rechazar una cita improcedente sin borrar el hallazgo.** TDE-A-ley16-2013-18-13 trata IRNR, no IRPF; se excluye como fundamento de TDE33. Motivo: el contexto completo distingue impuestos. Coste: la aceptación de ausencia se apoya en18-3/18-4 y art96, sin validar toda la cadena con una referencia equivocada.
3. **No confundir serialización de tabla con falsedad fiscal.** De113 citas PDF focales,111 coinciden literalmente por clip; dos filas de discapacidad contienen los mismos datos pero distinta representación de tabla. Se conservan textos reextraídos y discrepancias. Coste: no declarar126 coincidencias literales. Las13 citas HTML coinciden en su contenedor; eso no demuestra vigencia. Se añaden16 páginas completas de contexto, incluida la corrección2025:142 registros finales.
4. **No corregir UTC sin contrato.** Con R10000 se obtienen3700 el4julioUTC,4632,50 el5julioUTC y3700 para medianoche5julio+02:00. Motivo: el último instante es4julioUTC y los llamadores pueden haber pactado fecha civil UTC. Coste: TDE35 sigue needs-evidence; no se recomienda alterar zona por este ensayo.
5. **Aceptar ausencia no equivale a aceptar fix.** Motivo: varios hechos no caben en el contrato y cuotas proporcionales exigen nuevas entradas. Coste: regresiones específicas pendientes antes de implementar gastos, clasificación de rentas y obligación de declarar. Los casos rojos existentes autorizan solo sus alcances descritos, no una corrección general sin revisión.

## Integridad, reproducción y límites

Se recalcularon SHA256, SHA512 y tamaño de38 originales: coinciden. La adquisición adicional conserva metadatos saneados y hash propio. No se validaron firmas PAdES/CSV, sellos externos ni preservación fuera del equipo. Tres facsímiles a96dpi documentan pp45–46 del RDL2026 y su convalidación; los demás originales siguen en caché, identificados por hash. Los hashes no autentican por sí solos al emisor.

Los scripts propios se conservan en esta carpeta. `extraer.py`, `ampliar.py` y `correccion.py` reconstruyen secuencialmente las citas; requieren PyMuPDF y BeautifulSoup mediante uv/Nix como en la sesión. `evaluar.py` compara expectativas contra la salida del TypeScript. `decidir.py` reconstruye decisiones propias, sin editar los candidatos. Los scripts de extracción crean texto temporal exclusivamente en el scratch autorizado.

```sh
nix shell nixpkgs#bun nixpkgs#nodejs -c bun docs/procedencia/revisiones/trabajo-deducciones-estatales/casos.ts > docs/procedencia/revisiones/trabajo-deducciones-estatales/casos-resultados.json
nix shell nixpkgs#python3 -c python docs/procedencia/revisiones/trabajo-deducciones-estatales/evaluar.py
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x oxlint docs/procedencia/revisiones/trabajo-deducciones-estatales/casos.ts
nix shell nixpkgs#bun nixpkgs#nodejs -c bun x eslint docs/procedencia/revisiones/trabajo-deducciones-estatales/casos.ts
flock /tmp/irobopf-validacion-pesada.lock nix shell nixpkgs#bun nixpkgs#nodejs -c bun x tsc --noEmit -p docs/procedencia/revisiones/trabajo-deducciones-estatales/tsconfig.json
```

Se consultaron effect-solutions list/show basics/testing y fuente local v4 antes del runner. La primera comprobación de tipos rechazó fs y Date; se sustituyeron por salida estándar y DateTime, sin desactivar reglas. No build, suite legacy pesada, regeneración de inventario ni mutación VCS. Los vínculos de inventario anteriores permanecen sin migrar: esta revisión no abre `--accepted` del corpus.

Comprobación final: oxlint, ESLint y typecheck del runner correctos, sin desactivar reglas. El segundo intento de tipos también rechazó console.log; la versión final escribe JSON mediante process.stdout.write. Las siete huellas de módulos examinados siguen coincidiendo al cierre. Registro en `comprobaciones-ejecucion.json`.
