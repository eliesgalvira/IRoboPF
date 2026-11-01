import { describe, expect, it } from "vitest"
import { MADRID_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/madrid"
import { MURCIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/murcia"

const fichas = [
  ...MADRID_DEDUCCIONES_AUTONOMICAS_2025,
  ...MURCIA_DEDUCCIONES_AUTONOMICAS_2025,
]
function texto(codigo: string) {
  return JSON.stringify(fichas.find((f) => f.codigo === codigo))
}
describe("F: descripción individual y discriminantes documentales", () => {
  for (const ficha of fichas) {
    it(`${ficha.codigo}: sustituye la remisión vacía por condiciones individuales`, () => {
      expect(JSON.stringify(ficha)).not.toMatch(
        /Cuantía calculada por la ficha normativa normalizada|Cumplir los requisitos indicados en la ficha normativa normalizada/
      )
      expect(JSON.stringify(ficha)).toMatch(/euros|por ciento|%/)
    })
  }
  it("acogimiento de menores exige su certificado, sin importar el de mayores ni el préstamo", () => {
    const t = texto("madrid_acogimiento_familiar_menores")
    expect(t).toContain("certificado acreditativo de la formalización")
    expect(t).not.toContain("destino de los fondos")
    expect(t).not.toContain("ni la persona acogida han recibido ayudas")
  })
  it("fianza reformada: arrendadores de 8 bis y 8 ter, denuncia solo inquilino", () => {
    for (const codigo of [
      "madrid_gastos_arrendamiento_viviendas",
      "madrid_arrendamiento_viviendas_vacias",
    ]) {
      expect(texto(codigo)).toContain("depósito de la fianza")
      expect(texto(codigo)).not.toContain("denuncia")
    }
    expect(texto("madrid_arrendamiento_vivienda_habitual")).toContain(
      "denuncia"
    )
  })
  it("alquiler Madrid: edad estricta y esfuerzo superior al veinte por ciento", () => {
    expect(texto("madrid_arrendamiento_vivienda_habitual")).toMatch(
      /cuarenta|40/
    )
    expect(texto("madrid_arrendamiento_vivienda_habitual")).toMatch(
      /superen.*20/
    )
  })
  it("donaciones actuales al cincuenta; escolar ciento veinte y becas", () => {
    expect(texto("murcia_donativos_investigacion_biosanitaria")).toContain("50")
    expect(texto("murcia_material_escolar_libros_texto")).toContain("120")
    expect(texto("murcia_material_escolar_libros_texto")).toMatch(
      /becas|ayudas/
    )
  })
  it("internet: población estricta y reparto igual", () => {
    expect(texto("murcia_acceso_internet")).toContain("15.000")
    expect(texto("murcia_acceso_internet")).toContain("partes iguales")
  })
  it("vehículos conserva la contradicción de igualdad y no decide una cuota", () => {
    expect(texto("murcia_vehiculos_electricos")).toContain("35.000")
    expect(texto("murcia_vehiculos_electricos")).toMatch(/solapamiento/)
    expect(texto("murcia_vehiculos_electricos")).toContain("22,50")
  })
  it("Murcia alquiler conserva el diez ya existente y añade medio de pago", () => {
    expect(texto("murcia_arrendamiento_vivienda_habitual")).toContain(
      '"porcentaje":"10"'
    )
    expect(texto("murcia_arrendamiento_vivienda_habitual")).toMatch(
      /transferencia|tarjeta/
    )
  })
})

// Magnitudes y fronteras escogidas individualmente; no se importan del paquete.
const discriminantes: ReadonlyArray<readonly [string, RegExp]> = [
  ["madrid_adopcion_internacional", /50.*prorratear/],
  ["madrid_acogimiento_familiar_menores", /618,60.*773,25.*927,90/],
  ["madrid_acogimiento_mayores_65_discapacidad", /cuarto grado/],
  ["madrid_cuidado_ascendientes", /515,50/],
  ["madrid_gastos_arrendamiento_viviendas", /154,65/],
  ["madrid_arrendamiento_viviendas_vacias", /seis meses|6 meses/],
  ["madrid_donativos_fundaciones_clubes_deportivos", /base liquidable/],
  ["madrid_incremento_costes_financiacion_vivienda", /390.000/],
  ["madrid_cambio_residencia_municipio_despoblacion", /2.500/],
  ["madrid_vivienda_municipios_despoblacion", /décimas partes/],
  ["madrid_cuidado_hijos_mayores_dependientes_discapacidad", /40 horas/],
  ["madrid_intereses_vivienda_jovenes_menores_30", /mes anterior/],
  ["madrid_intereses_estudios_grado_master_doctorado", /entidades de crédito/],
  ["madrid_vivienda_nacimiento_adopcion_hijos", /doce meses/],
  ["madrid_condicion_familia_numerosa", /24.744/],
  ["madrid_familias_dos_descendientes_ingresos_reducidos", /24.744/],
  ["madrid_inversion_entidades_nuevas_reciente_creacion", /9.279/],
  ["madrid_autoempleo_jovenes_menores_35", /primera vez/],
  ["madrid_inversiones_mercado_alternativo_bursatil", /10.310/],
  ["madrid_inversiones_nuevos_contribuyentes_extranjero", /seis años/],
  ["madrid_nacimiento_adopcion_hijos", /justificación documental/],
  ["madrid_arrendamiento_vivienda_habitual", /superen el 20/],
  ["madrid_gastos_educativos", /becas/],
  ["murcia_vivienda_jovenes_hasta_40", /1.800/],
  [
    "murcia_donativos_patrimonio_cultural_actividades",
    /transferencia bancaria/,
  ],
  ["murcia_donativos_investigacion_biosanitaria", /50/],
  ["murcia_donaciones_bienes_patrimonio_cultural", /valor.*mercado/],
  ["murcia_dispositivos_ahorro_agua", /reconocimiento previo/],
  ["murcia_instalaciones_recursos_energeticos_renovables", /95.000/],
  ["murcia_inversion_entidades_nuevas_reciente_creacion", /diez años|10 años/],
  ["murcia_inversion_mab", /10.000/],
  ["murcia_material_escolar_libros_texto", /53.000/],
  ["murcia_nacimiento_adopcion", /100.*200.*300/],
  ["murcia_contribuyentes_discapacidad", /40.000/],
  ["murcia_conciliacion", /800/],
  ["murcia_acogimiento_mayores_65_discapacidad", /183|ciento ochenta y tres/],
  ["murcia_mujeres_trabajadoras", /75 años/],
  ["murcia_nueva_vivienda_o_ampliacion_familias_numerosas", /15 años/],
  ["murcia_familia_monoparental", /35.240/],
  ["murcia_ensenanza_idiomas", /inferior a 25.000/],
  ["murcia_acceso_internet", /una única vez/],
  ["murcia_vehiculos_electricos", /solapamiento/],
  ["murcia_recarga_vehiculos_electricos", /4.000/],
  ["murcia_cristales_lentes_soluciones_limpieza", /doce años/],
  ["murcia_deporte_actividades_saludables", /150/],
  ["murcia_enfermedades_raras", /300/],
  ["murcia_inversion_economia_social", /cinco años/],
  ["murcia_regimen_transitorio_inversion_vivienda_habitual", /24.200/],
  ["murcia_gastos_guarderia", /autorizados|autorizado/],
  ["murcia_arrendamiento_vivienda_habitual", /40.000/],
  ["murcia_gastos_veterinarios", /factura/],
]
describe("F: fronteras descriptivas por código", () => {
  it("censo de discriminantes completo", () => {
    expect(discriminantes.map(([codigo]) => codigo).sort()).toEqual(
      fichas.map((f) => f.codigo).sort()
    )
  })
  for (const [codigo, expresion] of discriminantes) {
    it(codigo, () => expect(texto(codigo)).toMatch(expresion))
  }
})
