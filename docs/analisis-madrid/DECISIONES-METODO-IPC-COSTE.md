# Método implementado para IPC y coste estimado, 2018–2025

Esta propuesta distingue la operación analítica histórica de las cuotas efectivas. No acredita IRPF ni nóminas. Fuentes primarias, hashes de originales y localizadores: [fuentes](fuentes-metodo-ipc-coste.json).

## IPC

Adoptar en el análisis Madrid2018–2025 el cociente del IPC general nacional de diciembre, tabla50902/serieIPC251852, todos los niveles en base2021=100: F(y)=I(y,diciembre)/I(2018,diciembre). El índice de diciembre2021 es103,965: la referencia2021 no significa diciembre2021=100. Los metadatos INE§3.8–3.9 identifican una serie base2021 desde2002; los precios de referencia del índice encadenado son los de diciembre del año anterior. La notaIPC1225 señala diciembre2025 como último mes calculado en base2021. No mezclar bases de distintas notas ni prolongar a2026 automáticamente.

Con tasas no redondeadas, el producto diciembre/diciembre telescopa al cociente de índices de esos mismos meses. Es el mismo periodo y estimando; cambiar a media anual sí cambia el periodo. Los índices con3decimales retienen más precisión publicada que siete tasas de1decimal porcentual, aunque tampoco son índices sin redondeo.

Método predeterminado implementado: ipc-general-nacional-diciembre-cociente-base2021-v1, con fracciones de enteros en milésimas, sin redondear F, y cuantización half-up de30000×F a céntimos. Conservar el método ipc-diciembre-producto-tasas-1decimal-legacy-v1 y sus otras rutas/snapshots; migración explícita sólo en este análisis, identificando método y hash de edición. No sustituir por debajo la función global ni recatalogar los resultados legacy.

| Año | Índice base 2021 | F producto | F cociente | 30000×F producto EUR | 30000×F cociente EUR | Δ cociente−producto antes de céntimos EUR |
|---|---:|---:|---:|---:|---:|---:|
| 2018 | 97.329 | 1.000000000000 | 1.000000000000 | 30000.00 | 30000.00 | 0.00000000 |
| 2019 | 98.096 | 1.008000000000 | 1.007880487830 | 30240.00 | 30236.41 | -3.58536510 |
| 2020 | 97.574 | 1.002960000000 | 1.002517235356 | 30088.80 | 30075.52 | -13.28293931 |
| 2021 | 103.965 | 1.068152400000 | 1.068181117652 | 32044.57 | 32045.43 | 0.86152957 |
| 2022 | 109.899 | 1.129037086800 | 1.129149585427 | 33871.11 | 33874.49 | 3.37495880 |
| 2023 | 113.308 | 1.164037236491 | 1.164175117385 | 34921.12 | 34925.25 | 4.13642684 |
| 2024 | 116.534 | 1.196630279113 | 1.197320428649 | 35898.91 | 35919.61 | 20.70448610 |
| 2025 | 119.942 | 1.231332557207 | 1.232335686178 | 36939.98 | 36970.07 | 30.09386913 |

La tabla sólo deriva la operación nominal del ejemplo30000EUR2018 existente, sin ejecutar el motor fiscal. Las diferencias de columnas a céntimos pueden diferir de redondear su diferencia racional. En2025 la diferencia antes de cuantizar es30,09386913EUR; no representa IRPF ni causalidad y no se suman años.

Resolución, bajo redondeo al más cercano: cada tasa admite±0,05 puntos porcentuales; su producto para2025 permite30000×F entre36814,625493 y37065,693571EUR. Cada índice admite±0,0005 unidades: el cociente compatible permite entre36969,726547 y36970,414627EUR. En2018 F=1 exactamente porque se divide el mismo dato. Son envolventes de precisión de publicación, no intervalos de confianza ni incertidumbre económica total; los extremos impresos se redondean a6decimales. La cuantización final añade como máximo0,005EUR. La precisión no equivale a exactitud del coste de vida personal.

Objeción experta: el IPC general nacional con ponderaciones cambiantes no representa una cesta personal ni el poder adquisitivo medio anual. Tradeoff: el cociente mejora la fidelidad al nivel publicado de diciembre, pero cambia resultados analíticos y exige versionarlos. Mantener el producto sólo está justificado para reproducir tasas publicadas o resultados legacy; la comodidad no decide el método.

## Coste de empresa

Proponer un único perfil sintético: auxiliar administrativo grupo7, empresa CNAE2009 división62, RG ordinario, indefinido, jornada completa, alta todo el año y doce remuneraciones uniformes con extras prorrateadas. Únicamente trabajo administrativo en oficinas de la empresa, sin exposición a riesgos de su actividad; sin tareas externas, teletrabajo supuesto, horas extra, bajas, pluriempleo, bonificaciones ni especialidades. No acredita hechos de un trabajador.

Ley42/2006 DA4, versión publicada30/10/2015, efectiva01/01/2016, cuadroII.a: oficina0,65%IT+0,35%IMS=1,00%, aplicable todo2018. La siguiente modificación de esa disposición se publica29/12/2018, efectiva01/01/2019 (RDL28/2018 DF5):0,80%+0,70%=1,50%. Dos.Tercera exige ocupación exclusiva, ausencia de exposición y locales destinados a oficinas; el nombre del puesto no basta. En2018 la actividad62 da1,35% en cuadroI y la ocupación elegible1% en cuadroII; desde2019 ambas dan1,5%.

2019–24/12/2025: DA4 versión20181229. Desde25/12/2025, RDL16/2025 DDúnica.2 y DF1.Tres trasladan la tarifa a LGSS DA61, manteniendo la fila de oficina1,5% y requisitos; DF5.1 determina entrada al día siguiente de publicación. Ese relevo no cambia la tasa de2025. No aplicar redacciones posteriores de2026 para probar2018.

Calendario propuesto, proporciones por uno:2018 IT0.0065/IMS0.0035/total0.01;2019–2025 IT0.008/IMS0.007/total0.015. Mantener intactos coreSS y cálculos legacy. Si se implementa, usar un perfil analítico versionado; el1,5% constante existente no se convierte documentalmente en tarifa histórica de oficina. Su diferencial algebraico en2018 sería−0,005×baseOrdinaria2018, sin recalcular aquí importes.

Fórmula propuesta: R=S/12; Bcc(m)=min(max(R,mínimoCCgrupo7(m)),tope(m)); Bcp(m)=min(max(R,mínimoCP(m)),tope(m)). QempresaEstim=Σm[Bcc(m)×(0,236+MEIempresa)+Bcp(m)×(0,055+0,002+0,006+AT/EPoficina)+solidaridadEmpresa(m)]; Cestim=S+QempresaEstim. MEIempresa:0 hasta2022;0,005 en2023;0,0058 en2024;0,0067 en2025. Solidaridad2025: sobre exceso=max(R−tope,0),0,0077×min(exceso,0,1tope)+0,0083×min(max(exceso−0,1tope,0),0,4tope)+0,0098×max(exceso−0,5tope,0). Antes2025 es0. Topes por mes:2018 enero–julio3751,20/agosto–diciembre3803,70;2019–2021 4070,10;2022 4139,40;2023 4495,50;2024 4720,50;2025 4909,50. Su cadena primaria completa se conserva en la documentación de IPC/SS; esta decisión no sustituye esa evidencia.

Mínimos de cotización, SMI y convenio son condiciones distintas. No asignar grupo por salario ni extrapolar a jornada parcial o salarios bajos. ESS55/2018 art3 y PJC178/2025 art3 contienen grupo7; el calendario final implementado en `calendario-oficina.json` completa los meses y revisiones retroactivas2023/2024. La guarda exacta rechaza remuneraciones por debajo de CCgrupo7 o CP; el ejemplo30000 y su trayectoria pasan por no vinculación. No se acredita convenio ni salario legal ni efectivo. Una tabla inicial, especialmente2023, no basta para todo el ejercicio.

La fórmula es estimación anual continua, sin liquidación ni redondeo mensual TGSS acreditados. Para k conceptos redondeados mensualmente al céntimo más cercano, sólo como hipótesis matemática, la desviación de la suma exacta estaría acotada por0,06kEUR/año más el efecto de redondear bases; no es una cota TGSS demostrada. No presentar céntimos como cuota ingresable ni convertir estimaciones en cotizaciones efectivas.

Objeción experta: el perfil sintético no prueba encuadramiento, actividad, convenio, bases ni hechos mensuales. Tradeoff: permite una estimación histórica interpretable dentro de condiciones estrechas, y exige coste no disponible fuera de ellas. Si se mantiene1,5% en2018 sin separar el método, no procede publicar ese coste como perfil histórico de oficina por contradicción de tarifa y elegibilidad incompleta, no por coste de comprobación.
