import { explicit } from "./causal-escalas-r60-casos.mjs";
// Fixture estructural reutilizado de tests/conexion-anual.test.ts; no calcula actividad.
function casoBase() {
  return {
    ejercicio: 2025,
    territorio: "comun",
    individual: true,
    actividadId: "profesion",
    iae: "servicios",
    fechaInicio: "2025-01-01",
    fechaFin: "2025-12-31",
    serviciosOrdinarios: true,
    hechos: {
      otrasActividades: false,
      otrasRentas: false,
      existencias: false,
      empleados: false,
      artistica: false,
      irregular: false,
      subvenciones: false,
      transmisiones: false,
      extranjero: false,
      mutualidad: false,
      especialidadesTerritoriales: false,
      saldosPendientes: false,
      serviciosGratuitos: false,
      autoconsumo: false,
      noFacturados: false,
      subvalorados: false,
      trade: false,
      hechosDesconocidos: false,
    },
    historial: [],
    actividadPreviaAlInicio: "ausente",
    regimen2025: "eds",
    criterio2025: "devengo",
    documentoCriterio2025: "alta",
    renuncia2025: false,
    exclusion2025: false,
    volumen2024: "0",
    diasActividad2024: 0,
    documentoVolumen2024: "sin-actividad",
    clientes: [
      {
        id: "cliente",
        vinculado: false,
        empleadorEnAnioAnteriorAlInicio: false,
        documento: "contrato",
      },
    ],
    ingresos: [],
    gastos: [],
    reta: [],
    activos: [],
    obligacionesFormales: true,
    documentoObligaciones: "libros",
    discapacidad: {
      grado: 0,
      ayudaOMovilidad: false,
      ejercicioEfectivo: true,
      documento: "sin-discapacidad",
    },
    opcion: "gastos-dificiles",
    aplicarRentasBajas: true,
    aplicarInicio: false,
    retenciones: [],
    pagosFraccionados: [],
  };
}
export function actividad() {
  const { perfil, trabajo, conciliacion, retenciones, ...alcance } = explicit();
  return { ...alcance, perfil: "solo-actividad-eds", actividad: casoBase() };
}
