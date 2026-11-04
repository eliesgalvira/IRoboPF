import { crearImporteMonetario as importe } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import type { MinimosPersonalesFamiliaresIrpf } from "./minimos-autonomicos-2025"
import { MINIMOS_ESTATALES_2026 } from "./minimos-estatales-2026"

/** EUR anuales. Corte 4-11-2026; referencias y vigencias por precepto, no prórroga de 2025.
 * Transcripción B2026 revisada con E familiar; dictamen y límites en docs/procedencia/reforma-motor/bloque-e/revision-familia-2026/INFORME.md.
 */
export const FUENTES_MINIMOS_AUTONOMICOS_2026 = {
  andalucia: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "andalucia",
        articulo: "23 bis",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2021-17915&p=20261104&tn=1#a2-12",
        sha256:
          "38bee1f4a2726db599b5955c89e0f86f994e537c42f258ef979f403bbe80405e",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  aragon: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "aragon",
        url: "https://www.boe.es/buscar/act.php?id=BOA-d-2005-90006&p=20261104&tn=1",
        sha256:
          "fa282a231a7a0d9ad67237af2086b67b59bd8e27cc05ff9eeda8519954ccd307",
        alcance:
          "Capítulo/sección IRPF vigente examinado: no fija mínimos distintos; aplicación positiva LIRPF 56.3 y 57–61. No se invoca sólo el manual 2025.",
        articulosIRPF: [
          "único",
          "único. Aprobación del Texto Refundido de las disposiciones dictadas por la Comunidad Autónoma de Aragón en materia de tributos cedidos.",
          "000-1. Régimen jurídico aplicable a los tributos cedidos.",
          "000-2. Tributos cedidos con facultades normativas.",
          "110-1. Escala autonómica del impuesto.",
          "110-2. Deducciones de la cuota íntegra autonómica del impuesto por nacimiento o adopción del tercer hijo o sucesivos.",
          "110-3. Deducción de la cuota íntegra autonómica del impuesto en atención al grado de discapacidad de alguno de los hijos.",
          "110-4. Deducción de la cuota íntegra autonómica del impuesto por adopción internacional de niños.",
          "110-5. Deducción de la cuota íntegra autonómica del impuesto por el cuidado de personas dependientes.",
          "110-6. Deducción por donaciones con finalidad ecológica y en investigación y desarrollo científico y técnico.",
          "110-7. Deducción de la cuota íntegra autonómica del impuesto por adquisición de vivienda habitual por víctimas del terrorismo.",
          "110-8. Deducción de la cuota íntegra autonómica del impuesto por inversión en acciones de entidades que cotizan en el segmento de empresas en expansión del Mercado Alternativo Bursátil.",
          "110-9. Deducción por inversión en la adquisición de acciones o participaciones sociales de nuevas entidades o de reciente creación.",
          "110-10. Deducción de la cuota íntegra autonómica por adquisición o rehabilitación de vivienda habitual en núcleos rurales o análogos.",
          "110-11. Deducción de la cuota íntegra autonómica por adquisición de libros de texto y material escolar.",
          "110-12. Deducción de la cuota íntegra autonómica por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago.",
          "110-13. Deducción de la cuota íntegra autonómica por arrendamiento de vivienda social.",
          "110-14. Deducción de la cuota íntegra autonómica para mayores de 70 años.",
          "110-15. Deducción de la cuota íntegra autonómica por gastos en primas individuales de seguros de salud.",
          "110-16. Deducción de la cuota íntegra autonómica por nacimiento o adopción del primer y/o segundo hijo.",
          "110-17. Deducción de la cuota íntegra autonómica por gastos de guardería de hijos menores de 3 años.",
          "110-18. Deducción de la cuota íntegra autonómica por determinadas subvenciones y/o ayudas obtenidas a consecuencia de los daños sufridos por las inundaciones acaecidas en la cuenca del río Ebro.",
          "110-19. Deducción por inversión en entidades de la economía social.",
          "110-20. Deducción por adquisición de abonos de transporte público.",
          "110-21. Deducción de la cuota íntegra autonómica por gastos en clases de apoyo o refuerzo.",
          "110-22. Deducción de la cuota íntegra autonómica por gastos en formación para la autonomía y la vida independiente de menores con discapacidad.",
          "121-1. Tipo impositivo de las operaciones inmobiliarias con carácter general.",
          "121-2. Tipo impositivo de las concesiones administrativas y actos administrativos asimilados.",
          "121-3. Tipo impositivo de determinadas operaciones inmobiliarias en función del cumplimiento de ciertos requisitos.",
          "121-4. Bonificación en cuota aplicable a la adquisición de su vivienda habitual por parte de personas físicas incluidas en determinados colectivos.",
          "121-5. Bonificación en cuota aplicable a la adquisición de vivienda habitual por familias numerosas.",
          "121-6. Modificación de los tipos de gravamen para determinados bienes muebles.",
          "121-7. Bonificación de la cuota tributaria en los arrendamientos de determinadas fincas urbanas y rústicas.",
          "121-8. Bonificación de la cuota tributaria en la cesión de derechos sobre viviendas de protección oficial.",
          "121-9. Tipo reducido aplicable a la transmisión de inmuebles incluidos en la transmisión de la totalidad del patrimonio empresarial en empresas individuales o negocios profesionales.",
        ],
      },
    ],
  },
  asturias: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "asturias",
        articulo: "2 bis",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-945&p=20261104&tn=1#a2-2",
        sha256:
          "2465b13736a4bb690dd8e43aa9097d57e70898cc90f5864cb0e126313704a427",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "asturias",
        articulo: "2 ter",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-945&p=20261104&tn=1#a2-3",
        sha256:
          "2465b13736a4bb690dd8e43aa9097d57e70898cc90f5864cb0e126313704a427",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "asturias",
        articulo: "2 quater",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-945&p=20261104&tn=1#a2-4",
        sha256:
          "2465b13736a4bb690dd8e43aa9097d57e70898cc90f5864cb0e126313704a427",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "asturias",
        articulo: "2 quinquies",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-945&p=20261104&tn=1#a2-5",
        sha256:
          "2465b13736a4bb690dd8e43aa9097d57e70898cc90f5864cb0e126313704a427",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  "illes-balears": {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "illes-balears",
        articulo: "2",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2014-6925&p=20261104&tn=1#a2",
        sha256:
          "570c97f0645b68d4bf3b1bdedfc03fbc8e19b8eb106caa87c47cda41dce193fe",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  canarias: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "canarias",
        articulo: "18 quater",
        url: "https://www.boe.es/buscar/act.php?id=BOC-j-2009-90008&p=20261104&tn=1#a1-11",
        sha256:
          "43493754a4ce65d4b621290afd967e346f75ecfd9619cff962ecc3824e01a488",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  cantabria: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "cantabria",
        url: "https://www.boe.es/buscar/act.php?id=BOCT-c-2008-90028&p=20261104&tn=1",
        sha256:
          "c0371131618572887560e8aa31b7a52a7a782bc297456c37697100ac9aa4153b",
        alcance:
          "Capítulo/sección IRPF vigente examinado: no fija mínimos distintos; aplicación positiva LIRPF 56.3 y 57–61. No se invoca sólo el manual 2025.",
        articulosIRPF: [
          "único",
          "único. Aprobación del texto refundido de la Ley de medidas fiscales en materia de tributos cedidos por el Estado.",
          "1. Escala autonómica del Impuesto sobre la Renta de las Personas Físicas.",
          "2. Deducciones sobre la cuota íntegra autonómica del Impuesto sobre la Renta de las Personas Físicas.",
          "3. Mínimo exento del Impuesto sobre el Patrimonio.",
          "4. Tipo de gravamen del Impuesto sobre el Patrimonio.",
          "4 bis. Bonificación general.",
          "5. Reducciones de la base imponible.",
          "6. Tipo de gravamen.",
          "7. Cuantías y coeficientes del patrimonio preexistente.",
          "8. Bonificaciones autonómicas.",
          "9. Tipos de gravamen aplicables en las transmisiones patrimoniales onerosas de bienes inmuebles.",
          "10. Tipos de gravamen aplicables a las concesiones administrativas.",
          "11. Tipos de gravamen aplicables a la transmisión onerosa de bienes muebles.",
          "12. Tipo impositivo aplicable a las transmisiones onerosas de determinadas explotaciones agrarias a las que sea aplicable el régimen de incentivos fiscales previsto en la",
          "13. Actos jurídicos documentados. Tipos de gravamen.",
          "14. Requisitos.",
          "15. Bonificación de la cuota en caso de arrendamientos destinados a vivienda.",
          "16. Regulación de los tipos de gravamen tributarios y cuotas fijas de la tasa fiscal sobre los juegos de suerte, envite o azar.",
          "17. Regulación de los tipos de gravamen de las tasas fiscales sobre Apuestas y Combinaciones Aleatorias y bonificación de la cuota en Rifas y Tómbolas.",
          "18. Tipos de gravamen aplicables a los medios de transporte incluidos en los epígrafes del apartado 1 del",
          "19. Justificación de venta de vehículo.",
          "20. Normas de gestión para Notarios y Registradores de la Propiedad.",
          "21. Acuerdos de valoración previa vinculante.",
          "22. Tramitación.",
          "23. Efectos de la inactividad y renuncia.",
          "24. Impuesto sobre Sucesiones y Donaciones.",
        ],
      },
    ],
  },
  "castilla-la-mancha": {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "castilla-la-mancha",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2014-1368&p=20261104&tn=1",
        sha256:
          "bd3e2b89befad6a190d80ed4ab33f74820a8aa1be336711537c87393eb1aaebd",
        alcance:
          "Capítulo/sección IRPF vigente examinado: no fija mínimos distintos; aplicación positiva LIRPF 56.3 y 57–61. No se invoca sólo el manual 2025.",
        articulosIRPF: [
          "1",
          "1. Deducción por nacimiento o adopción de hijos.",
          "2. Deducción por familia numerosa.",
          "2 bis. Deducción por familia monoparental.",
          "3. Deducciones por gastos en la adquisición de libros de texto, por la enseñanza de idiomas y otros gastos relacionados con la educación.",
          "3 bis. Deducción por gastos de guardería.",
          "4. Deducción por discapacidad del contribuyente.",
          "5. Deducción por discapacidad de ascendientes o descendientes.",
          "6. Deducciones para personas mayores de 75 años.",
          "7. Deducción por acogimiento familiar no remunerado de menores.",
          "8. Deducción por acogimiento no remunerado de mayores de 65 años o discapacitados.",
          "9. Deducción por arrendamiento de vivienda habitual por menores de 36 años.",
          "9 bis. Deducción por arrendamiento de vivienda habitual vinculado a determinadas operaciones de dación en pago.",
          "9 ter. Deducción por arrendamiento de vivienda habitual por familias numerosas.",
          "9 quáter. Deducción por arrendamiento de vivienda habitual por familias monoparentales.",
          "9 quinquies. Deducción por arrendamiento de vivienda habitual por personas con discapacidad.",
          "10. Deducción por cantidades donadas para la cooperación internacional al desarrollo y a las entidades para la lucha contra la pobreza, la exclusión social y la ayuda a personas con discapacidad.",
          "11. Deducción por donaciones con finalidad en investigación y desarrollo científico e innovación empresarial.",
          "11 bis. Deducciones por donaciones de bienes culturales y contribuciones a favor de la conservación, reparación y restauración de bienes pertenecientes al patrimonio cultural de Castilla-La Mancha, y para fines culturales, incluidos en el plan de mecenazgo cultural de Castilla-La Mancha.",
          "12. Deducción por los gastos en intereses por la financiación ajena de la adquisición de primera vivienda habitual por menores de 40 años.",
          "12 bis. Deducción por residencia habitual en zonas rurales.",
          "12 ter. Deducción por adquisición o rehabilitación de la vivienda habitual en zonas rurales.",
          "12 quater. Deducción por traslado de vivienda habitual.",
          "12 quinquies. Deducción extraordinaria para compensar los efectos de la inflación.",
          "12 sexies. Deducción por inversión en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o ampliación de capital en las sociedades mercantiles.",
          "12 septies. Deducción por inversión en entidades de la economía social.",
          "13. Normas comunes para la aplicación de las deducciones establecidas en los artículos anteriores.",
          "13 bis. Escala autonómica del Impuesto sobre la Renta de las Personas Físicas.",
          "14. Reducción en adquisiciones «mortis causa» de una empresa individual, un negocio profesional o participaciones en entidades.",
          "15. Reducciones por discapacidad.",
          "16. Reducción en adquisiciones «inter vivos» de una empresa individual, un negocio profesional o participaciones en entidades.",
          "16 bis. Reducciones de la base imponible por la cesión de bienes inscritos en el Catálogo del Patrimonio Cultural de Castilla-La Mancha.",
          "17. Bonificaciones de la cuota del Impuesto sobre Sucesiones y Donaciones, en adquisiciones “mortis causa”.",
          "17 bis. Bonificaciones de la cuota del Impuesto sobre Sucesiones y Donaciones en adquisiciones “inter vivos”.",
          "18. Normas para la aplicación de las bonificaciones.",
        ],
      },
    ],
  },
  "castilla-y-leon": {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "castilla-y-leon",
        articulo: "1 bis",
        url: "https://www.boe.es/buscar/act.php?id=BOCL-h-2013-90254&p=20261104&tn=1#a1bis",
        sha256:
          "cb5a0ab67029f42bbc95bed62947ed46ce5149b31517aaa1f55153cf9cbaf2aa",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  catalunya: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "catalunya",
        articulo: "611-2",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2024-6951&p=20261104&tn=1#a6-2",
        sha256:
          "02533fa01eef47e0e6d66a79b97655919a99f6f6704a0fdd12f47b23c1023d42",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  extremadura: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "extremadura",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2018-8159&p=20261104&tn=1",
        sha256:
          "85e27a881435c0bdc0ba76a8d271601480655b8db0f9fdbe5193090a363ff070",
        alcance:
          "Capítulo/sección IRPF vigente examinado: no fija mínimos distintos; aplicación positiva LIRPF 56.3 y 57–61. No se invoca sólo el manual 2025.",
        articulosIRPF: [
          "único",
          "único. Aprobación del Texto Refundido de las disposiciones legales de la Comunidad Autónoma de Extremadura en materia de tributos cedidos por el Estado.",
          "1. Escala autonómica del Impuesto sobre la Renta de las Personas Físicas.",
          "2. Deducción autonómica por trabajo dependiente.",
          "3. Deducción autonómica por parto o adopción múltiple.",
          "3 bis. Deducción en la cuota íntegra autonómica por nacimiento o adopción de descendientes.",
          "4. Deducción autonómica por acogimiento de menores.",
          "5. Deducción autonómica por cuidado de familiares con discapacidad.",
          "6. Deducción autonómica por cuidado de hijos menores de hasta 14 años inclusive.",
          "7. Deducción autonómica para los contribuyentes viudos.",
          "8. Deducción autonómica por adquisición de vivienda para jóvenes y para víctimas del terrorismo con residencia en la Comunidad Autónoma de Extremadura.",
          "9. Deducción autonómica por arrendamiento de vivienda habitual.",
          "9 bis. Deducción autonómica para arrendadores de viviendas vacías.",
          "9 ter. Deducción autonómica por inversiones en la rehabilitación de viviendas en zonas rurales para ser destinadas a su alquiler.",
          "9 quater. Censo de núcleos de población diferenciados.",
          "10. Deducción autonómica por la compra de material escolar.",
          "11. Deducción autonómica por inversión en la adquisición de acciones y participaciones sociales como consecuencia de acuerdos de constitución de sociedades o ampliación de capital en las sociedades mercantiles.",
          "11 bis. Deducción por adquisición o rehabilitación de la vivienda habitual en zonas rurales.",
          "11 ter. Deducción en la cuota íntegra autonómica para los contribuyentes con residencia habitual en municipios y entidades locales menores de Extremadura con población inferior a 3.000 habitantes.",
          "11 quater. Deducción autonómica por intereses de financiación ajena para la inversión en vivienda habitual para jóvenes.",
          "11 quinquies. Deducción en la cuota íntegra autonómica por donaciones de dinero a entidades culturales, artísticas y para patrocinio a deportistas.",
          "11 sexies. Deducción autonómica para contribuyentes que trasladen su residencia habitual a Extremadura.",
          "11 septies. Deducción por la obtención de ayudas o subvenciones otorgadas por la Comunidad Autónoma de Extremadura a las personas con enfermedad de Esclerosis Lateral Amiotrófica.",
          "11 octies. Deducción destinada a los enfermos de Esclerosis Lateral Amiotrófica y sus familiares.",
          "11 nonies. Deducción en la cuota íntegra autonómica por gastos veterinarios.",
          "12. Incompatibilidades e importe máximo de las deducciones.",
          "12 bis. Exclusión de los límites de renta para contribuyentes residentes en municipios y entidades locales menores de Extremadura con población inferior a 3.000 habitantes a efectos de la aplicación de determinadas deducciones autonómicas.",
          "13. Aplicación de las deducciones.",
          "14. Mínimo exento general y para personas con discapacidad.",
          "15. Tipo de gravamen.",
          "15 bis. Bonificación general.",
          "16. Reducciones en la base imponible.",
          "17. Mejora de la reducción personal en las adquisiciones por causa de muerte para los causahabientes incluidos en los grupos I y II de parentesco.",
          "18. Mejora de la reducción de la base imponible para las personas discapacitadas en las adquisiciones por causa de muerte.",
          "19. Reducción por adquisición por causa de muerte de empresas individuales o negocios profesionales.",
        ],
      },
    ],
  },
  galicia: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "galicia",
        articulo: "4 bis",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-18161&p=20261104&tn=1#a4-2",
        sha256:
          "a0e7a4375c604e7f4e8bbf8b98b276036dfac4e6f634f41de6d3a24760efcaef",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  madrid: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "madrid",
        articulo: "2",
        url: "https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20261104&tn=1#a2",
        sha256:
          "f48006f3ddb2bdb1974ef9bea3f81924dace933a3b884ee64288c6db370065eb",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "madrid",
        articulo: "2 bis",
        url: "https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20261104&tn=1#a2-3",
        sha256:
          "f48006f3ddb2bdb1974ef9bea3f81924dace933a3b884ee64288c6db370065eb",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "madrid",
        articulo: "2 ter",
        url: "https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20261104&tn=1#a2-4",
        sha256:
          "f48006f3ddb2bdb1974ef9bea3f81924dace933a3b884ee64288c6db370065eb",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "madrid",
        articulo: "2 quater",
        url: "https://www.boe.es/buscar/act.php?id=BOCM-m-2010-90068&p=20261104&tn=1#a2-5",
        sha256:
          "f48006f3ddb2bdb1974ef9bea3f81924dace933a3b884ee64288c6db370065eb",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  murcia: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "murcia",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-10542&p=20261104&tn=1",
        sha256:
          "6b8f53bff12350f89ab343bbbb9c847c32b4b5169bac6f80cd733821f37a9659",
        alcance:
          "Capítulo/sección IRPF vigente examinado: no fija mínimos distintos; aplicación positiva LIRPF 56.3 y 57–61. No se invoca sólo el manual 2025.",
        articulosIRPF: [
          "único",
          "único. Aprobación del Texto Refundido.",
          "1. Deducciones autonómicas en el Impuesto sobre la Renta de las Personas Físicas.",
          "2. Tarifa autonómica. Escala autonómica del Impuesto sobre la Renta de las Personas Físicas.",
          "3. Beneficios fiscales en la modalidad de Sucesiones.",
          "4. Beneficios fiscales en la modalidad de Donaciones.",
          "5. Tarifa del Impuesto de Sucesiones y Donaciones.",
          "6. Tipos de gravamen en la modalidad de Transmisiones Patrimoniales Onerosas.",
          "7. Tipos de gravamen en la modalidad de Actos Jurídicos Documentados.",
          "8. Bonificaciones en la cuota.",
          "9. Normas comunes para la aplicación de los tipos reducidos.",
          "10. Tipos tributarios, cuotas fijas, devengo, gestión y recaudación.",
          "11. Tipo impositivo autonómico.",
          "12. Tipo autonómico de devolución del impuesto.",
          "13. Tipo de gravamen.",
          "13 Bis. Deducción por aportaciones a proyectos de excepcional interés público regional.",
          "14. Tipo de gravamen.",
          "15. Normas de gestión.",
        ],
      },
    ],
  },
  "la-rioja": {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "la-rioja",
        articulo: "31 bis",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2017-13750&p=20261104&tn=1#a3-12",
        sha256:
          "83a2dc38d6ed8f64647496d06ad6f62d2c8c5915cffcc015a79880148647a432",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "la-rioja",
        articulo: "31 ter",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2017-13750&p=20261104&tn=1#a3-16",
        sha256:
          "83a2dc38d6ed8f64647496d06ad6f62d2c8c5915cffcc015a79880148647a432",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  "comunitat-valenciana": {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "comunitat-valenciana",
        articulo: "2 bis",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-1998-8202&p=20261104&tn=1#a2-2",
        sha256:
          "57a82f942da47dffda23c09062248d325fd289033579a5fe2ed6ee4ce0dfd976",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  ceuta: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "estatal",
        articulo: "56",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a56",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "57",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a57",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "58",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a58",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "59",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a59",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "60",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a60",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "61",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a61",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "63",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a63",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "74",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a74",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
  melilla: {
    corte: "2026-11-04",
    evidencias: [
      {
        fuente: "estatal",
        articulo: "56",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a56",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "57",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a57",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "58",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a58",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "59",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a59",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "60",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a60",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "61",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a61",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "63",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a63",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
      {
        fuente: "estatal",
        articulo: "74",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764&p=20261104&tn=1#a74",
        sha256:
          "00fc5ee5b1fcffee1968a9d8c27287130677db6162eeddb86875d085f5a5f674",
        nota: "Continuidad comprobada en el bloque y sus notas de reforma del consolidado vigente consultado a 04/11/2026; no prórroga inferida del fichero 2025.",
      },
    ],
  },
} as const

export const MINIMOS_AUTONOMICOS_IRPF_2026: Readonly<
  Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
> = {
  "simulada-estatal": MINIMOS_ESTATALES_2026,
  andalucia: {
    contribuyente: {
      general: importe("5790"),
      adicionalMayor65: importe("1200"),
      adicionalMayor75: importe("1460"),
    },
    descendientes: {
      primero: importe("2510"),
      segundo: importe("2820"),
      tercero: importe("4170"),
      cuartoYSiguientes: importe("4700"),
      adicionalMenorTres: importe("2920"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1200"),
      adicionalMayor75: importe("1460"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3130"),
        grado65OMas: importe("9390"),
        gastosAsistencia: importe("3130"),
      },
      descendiente: {
        grado33Hasta65: importe("3130"),
        grado65OMas: importe("9390"),
        gastosAsistencia: importe("3130"),
      },
      ascendiente: {
        grado33Hasta65: importe("3130"),
        grado65OMas: importe("9390"),
        gastosAsistencia: importe("3130"),
      },
    },
  },
  aragon: MINIMOS_ESTATALES_2026,
  asturias: {
    contribuyente: {
      general: importe("6105"),
      adicionalMayor65: importe("1265"),
      adicionalMayor75: importe("1540"),
    },
    descendientes: {
      primero: importe("2640"),
      segundo: importe("2970"),
      tercero: importe("4400"),
      cuartoYSiguientes: importe("4950"),
      adicionalMenorTres: importe("3080"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1265"),
      adicionalMayor75: importe("1540"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
      descendiente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
      ascendiente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
    },
  },
  "illes-balears": {
    contribuyente: {
      general: importe("5550"),
      adicionalMayor65: importe("1820"),
      adicionalMayor75: importe("1540"),
    },
    descendientes: {
      primero: importe("2400"),
      segundo: importe("2970"),
      tercero: importe("4400"),
      cuartoYSiguientes: importe("4950"),
      adicionalMenorTres: importe("2800"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1265"),
      adicionalMayor75: importe("1540"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
      descendiente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
      ascendiente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
    },
  },
  canarias: {
    contribuyente: {
      general: importe("5606"),
      adicionalMayor65: importe("1162"),
      adicionalMayor75: importe("1414"),
    },
    descendientes: {
      primero: importe("2424"),
      segundo: importe("2727"),
      tercero: importe("4040"),
      cuartoYSiguientes: importe("4545"),
      adicionalMenorTres: importe("2828"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1162"),
      adicionalMayor75: importe("1414"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3030"),
        grado65OMas: importe("9090"),
        gastosAsistencia: importe("3030"),
      },
      descendiente: {
        grado33Hasta65: importe("3030"),
        grado65OMas: importe("9090"),
        gastosAsistencia: importe("3030"),
      },
      ascendiente: {
        grado33Hasta65: importe("3030"),
        grado65OMas: importe("9090"),
        gastosAsistencia: importe("3030"),
      },
    },
  },
  cantabria: MINIMOS_ESTATALES_2026,
  "castilla-la-mancha": MINIMOS_ESTATALES_2026,
  "castilla-y-leon": MINIMOS_ESTATALES_2026,
  catalunya: MINIMOS_ESTATALES_2026,
  extremadura: MINIMOS_ESTATALES_2026,
  galicia: {
    contribuyente: {
      general: importe("5789"),
      adicionalMayor65: importe("1199"),
      adicionalMayor75: importe("1460"),
    },
    descendientes: {
      primero: importe("2503"),
      segundo: importe("2816"),
      tercero: importe("4172"),
      cuartoYSiguientes: importe("4694"),
      adicionalMenorTres: importe("2920"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1199"),
      adicionalMayor75: importe("1460"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3129"),
        grado65OMas: importe("9387"),
        gastosAsistencia: importe("3129"),
      },
      descendiente: {
        grado33Hasta65: importe("3129"),
        grado65OMas: importe("9387"),
        gastosAsistencia: importe("3129"),
      },
      ascendiente: {
        grado33Hasta65: importe("3129"),
        grado65OMas: importe("9387"),
        gastosAsistencia: importe("3129"),
      },
    },
  },
  madrid: {
    contribuyente: {
      general: importe("5956.65"),
      adicionalMayor65: importe("1234.26"),
      adicionalMayor75: importe("1502.58"),
    },
    descendientes: {
      primero: importe("2575.85"),
      segundo: importe("2897.83"),
      tercero: importe("4400"),
      cuartoYSiguientes: importe("4950"),
      adicionalMenorTres: importe("3005.16"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1234.26"),
      adicionalMayor75: importe("1502.58"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3219.81"),
        grado65OMas: importe("9659.44"),
        gastosAsistencia: importe("3219.81"),
      },
      descendiente: {
        grado33Hasta65: importe("3219.81"),
        grado65OMas: importe("9659.44"),
        gastosAsistencia: importe("3219.81"),
      },
      ascendiente: {
        grado33Hasta65: importe("3219.81"),
        grado65OMas: importe("9659.44"),
        gastosAsistencia: importe("3219.81"),
      },
    },
  },
  murcia: MINIMOS_ESTATALES_2026,
  "la-rioja": {
    contribuyente: {
      general: importe("5550"),
      adicionalMayor65: importe("1150"),
      adicionalMayor75: importe("1400"),
    },
    descendientes: {
      primero: importe("2400"),
      segundo: importe("2700"),
      tercero: importe("4000"),
      cuartoYSiguientes: importe("4500"),
      adicionalMenorTres: importe("2800"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1150"),
      adicionalMayor75: importe("1400"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3000"),
        grado65OMas: importe("9000"),
        gastosAsistencia: importe("3000"),
      },
      descendiente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3000"),
      },
      ascendiente: {
        grado33Hasta65: importe("3000"),
        grado65OMas: importe("9000"),
        gastosAsistencia: importe("3000"),
      },
    },
  },
  "comunitat-valenciana": {
    contribuyente: {
      general: importe("6105"),
      adicionalMayor65: importe("1265"),
      adicionalMayor75: importe("1540"),
    },
    descendientes: {
      primero: importe("2640"),
      segundo: importe("2970"),
      tercero: importe("4400"),
      cuartoYSiguientes: importe("4950"),
      adicionalMenorTres: importe("3080"),
    },
    ascendientes: {
      mayor65OConDiscapacidad: importe("1265"),
      adicionalMayor75: importe("1540"),
    },
    discapacidad: {
      contribuyente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
      descendiente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
      ascendiente: {
        grado33Hasta65: importe("3300"),
        grado65OMas: importe("9900"),
        gastosAsistencia: importe("3300"),
      },
    },
  },
  ceuta: MINIMOS_ESTATALES_2026,
  melilla: MINIMOS_ESTATALES_2026,
}
export const obtenerMinimosAutonomicosIrpf2026 = (
  comunidad: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf => MINIMOS_AUTONOMICOS_IRPF_2026[comunidad]
