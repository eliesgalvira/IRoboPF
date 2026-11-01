# Aviso para rediseño: auxiliar condicionado por hechos

El cambio candidato añade `calcularDeduccionesAutonomicasAplicadas(entradas, ambito, hechos?)`. `HechosAuxiliar2025` se importa de `lib/dominio/irpf/deducciones/hechos-auxiliar-2025.ts`. El mapa de entradas sigue admitiendo exclusivamente escalares.

Para los nueve códigos enumerados en ese módulo, una llamada activa sin hechos lanza `RangeError` con prefijo estable `Hechos insuficientes para deducción: ` y código. Hay rechazos distintos para hechos duplicados, otro ámbito e importe manual simultáneo. No sustituir estos errores por cero. Los escalares antiguos no aportan modalidad, reparto ni hechos de personas/eventos; no sirven de fallback.

Ejemplo sintético de aritmética condicionada:

```ts
calcularDeduccionesAutonomicasAplicadas({}, { ejercicio: 2025, territorio: "cantabria" }, [{
  codigo: "cantabria_arrendamiento_jovenes_mayores_discapacidad",
  contexto: { ejercicio: 2025, territorio: "cantabria", contribuyente: "a", modalidad: "conjunta" },
  declarantes: ["a", "b"],
  elegibilidadExterna: true,
  gastoElegible: 6000,
}]) // 600, parcial
```

Los registros y colecciones son explícitos y exhaustivos para la deducción/declaración. La elegibilidad externa no se inventa ni equivale a aceptación fiscal; véase [alcance del informe](INFORME.md). `evaluarHechosAuxiliar2025` permite conservar el resultado etiquetado como parcial. El agregado fiscal sigue rechazando parciales. La ruta anual de consignación permanece intacta: usa importes explícitos, sin derivar hechos.

Los controles exportados históricos permanecen, pero sus entradas escalares de esos nueve códigos ahora exigen hechos y no constituyen fixtures completos. No hay consumidores del auxiliar en app/lib fuera de su definición; no se toca UI ni se conecta esta API al anual. El padre incorporará este aviso al rediseño compartido tras revisión independiente.
