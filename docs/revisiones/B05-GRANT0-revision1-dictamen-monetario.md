# B05 — dictamen monetario acotado de la misma primera revisión

**Favorable y cerrado para el perfil Murcia origen2024/consumo2025 descrito, con reserva O4.** Esta es la conciliación documental de la revisión1 ya realizada, no una revisión nueva ni un re-check. No se ejecutó runtime nuevo. La conclusión usa la evidencia final del padre preservada por valor y las observaciones primarias y el oráculo independiente previamente conciliados.

## Evidencia final conciliada

El final es `producto-origenes-murcia-galicia-clm-integracion-20261112/evidencia-863/post`, con su MANIFIESTO. Se verificaron por SHA las14 entradas B05/Murcia pertinentes del manifiesto. Sus siete archivos de producción territorial B05 coinciden por valor con el provisional ya examinado. El fixture de cinco capturas y el oráculo Fraction propio tampoco cambiaron. Los esperados racionales de la prueba de revisión permanecen iguales. No se reinterpreta ni vuelve a revisar CLM/Galicia.

`revision-conjunta-02`: informe success=true,863 pruebas aprobadas de863,0fallos,15archivos. El archivo `tests/revision-b05-grant0.test.ts` contiene85 casos, todos passed, incluidos artefactos oficiales y ambas API. Resultado exit0, supervisión primary_exit0 y limpieza verificada sin supervivientes. Se preservan reporte, log, comando, supervisión y resultado; las huellas constan en REFERENCIAS y manifiesto de esta adición.

`tipos-04`: exit0; el log registra `tsc --noEmit && tsc --noEmit -p tools/oxlint/tsconfig.json`, ambas configuraciones strict. La configuración global contiene los diagnósticos Effect. Se preservan comando, log, resultado y supervisión con limpieza verificada. No se ejecutaron nuevamente estos comandos. `lint-02` se encontraba en curso según el relevo; esta conclusión **no le atribuye verde**, ni lo extiende a CI completo, generados, inventario, remoto o publicación.

## O4: roja conservada y reserva explícita

`revision-conjunta-01` registra862/863 y un único fallo: `B05 GRANT0 canonica O4: intento anual2027 rechaza sin rejuvenecer origen`. La expectativa inicial mía de Failure era incorrecta para esta entrada adversa fuera del contrato tipado. La llamada produce `Error: [DecimalError] Invalid argument: undefined` durante el cálculo de cotizaciones; no devuelve Failure de dominio ni liquidación fiscal.

El padre preservó el original en `b05-o4-limite-contrato/pre`, y su parche cambia únicamente la expectativa: canónica2027 caracteriza la excepción mediante `/DecimalError.*undefined/`; explícita2027 sigue exigiendo Failure. El comentario del test dice expresamente que **no prueba caducidad fiscal**. Se conservan por valor la roja, el parche causal y las referencias de pre/post. No se convierte la excepción en rechazo tipado, ni se presenta el nuevo verde como corrección de producción2027. O4 permanece como reserva de diagnóstico fuera de contrato; no bloquea el dictamen monetario del perfil admitido2025.

Los controles independientes de conservación, residual2025 cero/escaso, generación única y plazo2026 siguen aprobados. Son los que respaldan esas propiedades dentro del corte. La prueba adversa2027 no añade cobertura fiscal de un ejercicio que la canónica no admite.

## Deltas finales de pruebas

`lint-correccion-01` cambia conversiones encadenadas por `Reflect.set` en fixtures frescas, condiciones booleanas explícitas y parsers genéricos; conserva la entrada adversa y los valores esperados. `tipos-correccion-02` separa ramas de `Effect.gen` en auxiliares de pruebas, incluida Murcia/Open2024. Los parches leídos sólo tocan tests; las fórmulas y esperados monetarios B05 no cambian. Se concilian documentalmente para atribuir los85verdes al final sellado, sin crear pruebas nuevas ni repetir la revisión.

## Cinco observaciones públicas acotadas

Campaña consultada: [Open2024 oficial](https://www2.agenciatributaria.gob.es/wlpl/PARE-RW24/OPEN/index.zul?TACCESO=COLAB&EJER=2024). Capturas de12/11/2026, identidad sintética individual, regiónMurcia, año fiscal2024, reglas `N000086471`, modelo `0.09`, versión visible `1.24`. Los originales PDF/SES/texto y UTC por captura están preservados en la adición anterior y referenciados por SHA. Casillas regionales obtenidas del ámbito `DECLARACIONES/IRPF2024/MURCIA`, no del resumen salarial `allFields`.

| Bruto / SS EUR | Coste neto EUR | Base general2024 | Cuota autonómica y aplicado2024 | Generado | Saldo |
|---|---:|---:|---:|---:|---:|
|17000 /1000|10000|8707|299.92|5000|4700.08|
|18000 /1000|10000|11457|561.17|5000|4438.83|
|20000 /1000|10000|16147.85|1069.66|5000|3930.34|
|30000 /2000|10000|26000|2294.90|5000|2705.10|
|30000 /2000|10000.01|26000|2294.90|5000.01|2705.11|

O1 queda resuelta para estos discriminantes: artículo20 y gravámenes se cuantizan HALF_UP a céntimos antes de propagar bases/cuotas; también la generación. El exceso matemático sobre7000 se separa del ajuste de cuantización, evitando un exceso negativo en el medio céntimo de generación. Los cinco PDF/SES y el oráculo Fraction independiente coinciden con los importes comprobados en ambas API. No se infiere identidad general con todoOpen2024, otras campañas, Madrid ni declaraciones autenticadas. Se conservan los originales sin cuantizar y su PRE causal8rojos/2verdes de la revisión anterior; no se sustituyen retroactivamente sus esperados. Las tres terminaciones mecánicas de navegación/alta y las continuaciones manuales explícitas siguen conservadas en la evidencia previa, sin atribuirlas a fiscalidad.

O2 queda resuelta dentro del perfil: únicamente ayudas con concesión nominal RD477/2021 programa4, conciliadas con identidad/instalación/cronología, no integración DA5.4 y minoración de inversión; otras ayudas se rechazan antes de reconstruir cuota. O3 queda resuelta estructuralmente: beneficiario del pago bancario debe ser instalador/emisor identificado. Los casos nominales y adversos pasan; no se autentican automáticamente documentos. Normativa temporal y fuentes primarias son las ya conciliadas: Ley4/2023 art55.Tres, LIRPF seleccionada24/12/2024 y RD477/2021 original, con URL/UTC/cabeceras/SHA conservados previamente. No hay nueva inferencia normativa en esta continuación documental.

## Alcance de cierre y entrega

Cierre monetario favorable limitado a origen2024, consumo2025, franja técnica<35000, individual18–64 en origen, empleo único, vivienda habitual100%, inventarios y concurrencia con agua ya descritos; sin cuota/base/saldo fiscales recibidos del cliente, sin generación doble2025 ni rejuvenecimiento del plazo2026. `no_aplicar` sigue fuera del perfil aplicado y se rechaza, sin inventar saldo. Se mantiene reservaO4, aceptación documental fiscal pendiente y ausencia de dictamen global de lint/CI/publicación.

La adición sólo contiene documentación, parche y manifiesto con evidencia selectiva de lectura. El parche está referido a la **carpeta de entrega del padre**, no a la raíz del repositorio: modifica exclusivamente la sección Murcia de `documentacion-preparada/INTEGRACION.md` y añade este dictamen en esa carpeta. El texto ajeno a Murcia permanece idéntico; la denominación CLM ya corregida a Ley8/2013 no se toca. El padre decide la ubicación documental final. Las entregas de revisión anteriores permanecen íntegramente preservadas.
