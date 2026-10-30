import { annual } from "./causal-escalas-r60-casos.mjs";
/** Hechos del caso positivo previo de mínimos; ninguna fórmula financiera. */
export function derechosCaso() {
  const holder = (id) => ({
    titularId: id,
    grado: 1,
    vinculo: { clase: "consanguinidad" },
    relacion: "convivencia",
    custodia: "compartida",
    alimentosJudiciales: false,
    aplicaEspecialidadAlimentos: false,
    residenteIrpf: true,
    rentasNoExentasCentimos: 2605600,
  });
  const child = (id, age, ids) => ({
    sujetoId: id,
    edadDevengo: age,
    fechaNacimiento: 2025 - age + "-01-01",
    vivoAlDevengo: true,
    rentasNoExentasCentimos: 0,
    declaracion: { modalidad: "no-presenta" },
    discapacidad: { _tag: "SinDiscapacidad" },
    titulares: ids.map(holder),
    titularesCompletos: true,
  });
  const c = annual(2025, "madrid", 3000000);
  c.rendimientos.gananciasPatrimoniales = [];
  const derechosMinimos = {
    ejercicio: 2025,
    territorio: "madrid",
    regimen: "comun",
    modalidad: "individual",
    devengo: "2025-12-31",
    contribuyenteId: "s-1",
    edadContribuyenteDevengo: 40,
    discapacidadContribuyente: { _tag: "SinDiscapacidad" },
    ascendientes: "ninguno",
    fallecimientosEnElEjercicio: "ninguno",
    descendientesCompletos: true,
    conciliacionRentasContribuyente: {
      perfil: "caso-anual-parcial",
      otrasRentasOGastosNoRepresentados: "ninguno",
    },
    descendientes: [child("s-4", 5, ["s-1"]), child("s-3", 8, ["s-1", "s-2"])],
  };
  return Object.assign(c, { derechosMinimos });
}
