export const family = () => ({
  tipo: "individual",
  edad: 40,
  descendientes: [],
  ascendientes: [],
  discapacidad: { _tag: "SinDiscapacidad" },
});
export const annual = (
  anio = 2025,
  comunidadAutonoma = "madrid",
  amount = 5000000,
) => ({
  anio,
  comunidadAutonoma,
  situacionFamiliar: family(),
  rendimientos: {
    trabajo: [{ importeIntegroCentimos: amount }],
    gananciasPatrimoniales: [
      {
        importeGananciaCentimos: 2000000,
        tratamientoMayores65: { _tag: "SinExencionMayores65" },
      },
    ],
  },
  reducciones: [],
  deducciones: [],
  retencionesSoportadasCentimos: 100,
  pagosACuentaCentimos: 101,
});
export function explicit(bruto = "16576.01", clase = "empleo-laboral") {
  return {
    ejercicio: 2025,
    comunidadAutonoma: "madrid",
    edad: 40,
    modalidad: "individual",
    residenciaTodoElAnio: true,
    devengo: "2025-12-31",
    otrasRentas: "ninguna",
    familiaresConDerechoMinimo: "ninguno",
    discapacidad: "ninguna",
    reduccionesBase: "ninguna",
    saldosAnteriores: "ninguno",
    deducciones: "solo-da61-si-procede",
    rentasExtranjeras: "ninguna",
    especialidades: "ninguna",
    perfil: "solo-trabajo",
    conciliacion: {
      ejercicio: 2025,
      estado: "totales-anuales-sin-duplicados",
      procedencia: ["certificado-anual#2025"],
    },
    trabajo: {
      ejercicio: 2025,
      territorio: "comun",
      reduccionesArt18: "ninguna",
      movilidad: "ninguna",
      discapacidadActiva: "ninguna",
      rendimientos: [
        {
          id: "anual",
          clase,
          integro: bruto,
          cotizaciones: {
            clase: "efectivas",
            seguridadSocial: "0",
            derechosPasivos: "0",
            colegiosHuerfanos: "0",
          },
          sindicato: { importe: "0", satisfecho: "no" },
          colegio: {
            importe: "0",
            satisfecho: "no",
            obligatorio: "no",
            finesEsenciales: "no",
          },
          defensa: {
            importe: "0",
            satisfecho: "no",
            litigioDirectoPagador: "no",
          },
        },
      ],
    },
    retenciones: [],
  };
}
