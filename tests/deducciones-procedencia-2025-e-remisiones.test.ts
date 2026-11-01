import { expect, test } from "vitest";
import { GALICIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/galicia";
import { RIOJA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/la-rioja";

// Oráculos documentales: importes y hechos que distinguen regímenes próximos.
// Se comprueba la descripción; la consignación no evalúa estos requisitos.
const casos: ReadonlyArray<readonly [string, RegExp, RegExp]> = [
  ["galicia_familias_dos_hijos", /250/, /mínimo por descendientes/],
  ["galicia_acogimiento_menores", /300/, /preadoptivo/],
  ["galicia_cuidado_hijos_menores", /30/, /ambos padres/i],
  [
    "galicia_discapacidad_mayor_65_ayuda_terceras_personas",
    /600/,
    /residencias públicas/,
  ],
  ["galicia_nuevas_tecnologias_hogares", /100/, /cambio de compañía/],
  [
    "galicia_inversion_entidades_nuevas_reciente_creacion",
    /6.000/,
    /veinticuatro meses/,
  ],
  ["galicia_inversion_entidades_nuevas_financiacion", /20.000/, /20.*anual/],
  ["galicia_inversion_mab", /4.000/, /tres ejercicios siguientes/],
  ["galicia_donaciones_idi", /25/, /organismo de investigación/],
  ["galicia_climatizacion_agua_caliente_renovables", /280/, /OVI/],
  [
    "galicia_rehabilitacion_centros_historicos",
    /9.000/,
    /certificado.*ayuntamiento/i,
  ],
  ["galicia_inversion_empresas_agrarias", /20.000/, /cinco años/],
  ["galicia_ayudas_incendios_peifoga_2025", /tipos medios/, /76\/2025/],
  ["galicia_obras_eficiencia_energetica", /150/, /salto de letra/],
  [
    "galicia_ayudas_deportistas_alto_nivel",
    /tipos medios/,
    /no genere rendimientos/,
  ],
  ["galicia_aldeas_modelo", /4.500/, /aldeas modelo/],
  [
    "galicia_inversion_proyectos_especial_interes",
    /10.000/,
    /objeto social exclusivo/,
  ],
  ["galicia_adecuacion_inmueble_vacio_arrendamiento", /9.000/, /250.000/],
  ["galicia_arrendamiento_viviendas_vacias", /500/, /700/],
  ["galicia_ayudas_ela_fenotipos", /tipos medios/, /ayuda pública/],
  ["galicia_libros_texto_material_escolar", /105/, /300/],
  ["galicia_ayudas_talidomida", /tipos medios/, /1950/],
  [
    "galicia_nacimiento_adopcion_hijos",
    /31.000/,
    /dos períodos impositivos siguientes/,
  ],
  ["galicia_familia_numerosa", /400/, /título de familia numerosa/],
  ["galicia_alquiler_vivienda_habitual", /22.000/, /fianza/],
  ["rioja_vivienda_habitual_pequenos_municipios", /452/, /2017/],
  ["rioja_escuelas_infantiles_pequenos_municipios", /600/, /no subvencionad/],
  ["rioja_menor_acogimiento_guarda_adopcion", /183/, /90/],
  ["rioja_hijo_0_3_pequenos_municipios", /100/, /mensual/],
  ["rioja_hijo_0_3_escolarizado", /600/, /no subvencionad/],
  ["rioja_vehiculos_electricos_nuevos", /225/, /2024/],
  [
    "rioja_fijacion_poblacion_ocupada_medio_rural",
    /1.000/,
    /autónomos colaboradores/,
  ],
  ["rioja_internet_jovenes_emancipados", /40/, /6 meses/],
  ["rioja_luz_gas_jovenes_emancipados", /25/, /6 meses/],
  ["rioja_inversion_vivienda_jovenes_menores_36", /9.000/, /reinversión/],
  ["rioja_bicicletas_pedaleo_no_asistido", /50/, /gananciales/],
  ["rioja_obras_rehabilitacion_vivienda_habitual", /7/, /2017/],
  ["rioja_adquisicion_construccion_vivienda_jovenes", /3/, /cuatro años/],
  ["rioja_segunda_vivienda_medio_rural", /8%/, /anexo II/],
  ["rioja_adecuacion_vivienda_discapacidad", /15/, /informe técnico/],
  ["rioja_donaciones_fomento_mecenazgo", /300.000/, /crédito fiscal/],
  ["rioja_cantidades_patrimonio_historico", /500/, /usufructo/],
  ["rioja_ejercicio_fisico_deporte", /300/, /factura simplificada/],
  ["rioja_enfermos_ela", /50/, /factura simplificada/],
  [
    "rioja_cuotas_organizaciones_profesionales_agrarias",
    /100/,
    /certificación/,
  ],
  ["rioja_paliar_subida_intereses_hipotecarios", /5.000/, /cobertura/],
  ["rioja_nacimiento_adopcion_hijos", /750/, /por mitad/],
  ["rioja_arrendamiento_menores_36", /1.800/, /no subvencionad/],
  ["rioja_enfermedad_celiaca", /250/, /diagnóstico definitivo/],
];
const fichas = [
  ...GALICIA_DEDUCCIONES_AUTONOMICAS_2025,
  ...RIOJA_DEDUCCIONES_AUTONOMICAS_2025,
];
for (const [codigo, importe, discriminante] of casos) {
  test(`descripción normativa 2025: ${codigo}`, () => {
    const ficha = fichas.find((f) => f.codigo === codigo);
    expect(ficha).toBeDefined();
    const texto = JSON.stringify(ficha).normalize("NFKC");
    expect(texto).toMatch(importe);
    expect(texto).toMatch(discriminante);
    expect(texto).not.toMatch(
      /Cumplir los requisitos indicados|Cuantía calculada por la ficha/,
    );
  });
}

test("dos hijos y familia numerosa mantienen sus cuantías separadas", () => {
  const dos = fichas.find((f) => f.codigo === "galicia_familias_dos_hijos")!;
  expect(JSON.stringify(dos.cuantia)).not.toMatch(/400/);
  expect(dos.incompatibilidades.join(" ")).toMatch(/numerosa/);
});

test("originales refutan tres cifras del discriminante de revisión", () => {
  const proyectos = fichas.find((f) => f.codigo === "galicia_inversion_proyectos_especial_interes")!
  expect(JSON.stringify(proyectos.cuantia)).toContain("10.000")
  expect(JSON.stringify(proyectos.cuantia)).not.toContain("20.000")
  // 60.000 invertidos en una entidad: la base acumulada es 10.000, cuota 2.000.
  expect(Math.min(60000, 10000) * 0.2).toBe(2000)
  const ela = fichas.find((f) => f.codigo === "rioja_enfermos_ela")!
  expect(JSON.stringify(ela.cuantia)).toContain("50%")
  expect(JSON.stringify(ela.cuantia)).not.toContain("40%")
  const rural = fichas.find((f) => f.codigo === "rioja_segunda_vivienda_medio_rural")!
  expect(JSON.stringify(rural.cuantia)).toContain("8%")
})

test("adecuación y puesta en alquiler no heredan el mismo requisito de precio", () => {
  const adecuacion = fichas.find((f) => f.codigo === "galicia_adecuacion_inmueble_vacio_arrendamiento")!
  const alquiler = fichas.find((f) => f.codigo === "galicia_arrendamiento_viviendas_vacias")!
  expect(JSON.stringify(adecuacion)).not.toMatch(/700 euros/)
  expect(JSON.stringify(alquiler)).toMatch(/700 euros/)
  expect(JSON.stringify(adecuacion.cuantia)).toContain("450")
})

test("incendios conserva la reserva temporal tras las derogaciones estatales", () => {
  const incendio = fichas.find((f) => f.codigo === "galicia_ayudas_incendios_peifoga_2025")!
  expect(incendio.requisitos.join(" ")).toMatch(/fueron derogados/)
  expect(incendio.limites.join(" ")).toMatch(/parte integrada|incluido en base liquidable/)
})
