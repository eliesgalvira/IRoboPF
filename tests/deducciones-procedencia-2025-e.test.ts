import { test } from "vitest"
import assert from "node:assert/strict"
import casos from "../docs/procedencia/deducciones-2025/lotes/e/casos.json"
import { evaluarCeliaquiaRioja } from "../lib/dominio/irpf/deducciones/contratos-2025"
import { GALICIA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/galicia"
import { RIOJA_DEDUCCIONES_AUTONOMICAS_2025 } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025/comunidades/la-rioja"
import { calcularDeduccionesConsignadas } from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"

const fichas = [
  ...GALICIA_DEDUCCIONES_AUTONOMICAS_2025,
  ...RIOJA_DEDUCCIONES_AUTONOMICAS_2025,
]
test("49 códigos únicos del lote E", () => {
  assert.equal(fichas.length, 49)
  assert.deepEqual(
    new Set(fichas.map((f) => f.codigo)),
    new Set(casos.map((c) => c.codigo))
  )
})
for (const caso of casos) {
  test(`paginación de la edición fijada: ${caso.codigo}`, () => {
    const ficha = fichas.find((f) => f.codigo === caso.codigo)
    assert.deepEqual(ficha?.fuenteManual.paginas, caso.paginas)
  })
}
test("nacimiento Galicia identifica la base neta de mínimos", () => {
  const ficha = fichas.find(
    (f) => f.codigo === "galicia_nacimiento_adopcion_hijos"
  )
  assert.match(
    ficha?.limites.join(" ") ?? "",
    /base imponible total menos los mínimos personal y familiar/i
  )
})
test("consignación no acredita aplicación de tipos ni topes", () => {
  assert.equal(
    calcularDeduccionesConsignadas(
      {
        "rioja_bicicletas_pedaleo_no_asistido:cumple": true,
        "rioja_bicicletas_pedaleo_no_asistido:importe": 123,
      },
      { ejercicio: 2025, territorio: "la-rioja" }
    ),
    123
  )
  // Art. 32.13: para una bicicleta de 1.000 euros el máximo fiscal sería 50.
  assert.equal(Math.min(1000 * 0.15, 50), 50)
})

test("celiaquía: cero personas sigue siendo cálculo parcial", () => {
  const resultado = evaluarCeliaquiaRioja(
    {
      ejercicio: 2025,
      territorio: "la-rioja",
      contribuyente: "t1",
      modalidad: "individual",
    },
    []
  )
  assert.equal(resultado.estado, "calculo_parcial")
  assert.ok("importe" in resultado)
  assert.equal(resultado.importe, 0)
})

test("celiaquía: dos titulares reciben 125 por persona común", () => {
  const resultado = evaluarCeliaquiaRioja(
    {
      ejercicio: 2025,
      territorio: "la-rioja",
      contribuyente: "t1",
      modalidad: "individual",
    },
    [
      {
        id: "t1",
        relacion: "contribuyente",
        titularesDelMinimo: [],
        titularesDeduccion: ["t1", "t2"],
        certificado: {
          referencia: "hipotetica",
          medico: "facultativo",
          colegiado: "hipotetico",
          especialidad: "especialidad",
          fechaEmision: "2025-12-01",
          fechaDiagnostico: "2025-11-01",
          diagnostico: "definitivo",
          ejercicioMedico: "activo",
        },
      },
    ]
  )
  assert.equal(resultado.estado, "calculo_parcial")
  assert.ok("importe" in resultado)
  assert.equal(resultado.importe, 125)
})
