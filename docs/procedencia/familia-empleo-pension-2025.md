# Bases familiares de 2025 con empleo y pensión ordinaria

El contrato `solo-trabajo` admite una mezcla únicamente con `mezclaEmpleoPension2025`: sujeto, empleoId, pensionId, pagadorPension, soportePension, prestación `jubilacion-publica-ordinaria-no-exenta` e imputación `periodica-2025-sin-atrasos-ni-art18`. Exige calendario laboral, un empleo laboral/estatutario y una pensión, ambos positivos. El calendario identifica el empleo; no contiene la pensión entre sus ingresos. Conserva censo completo, otras rentas ninguna, reduccionesBase ninguna y saldosAnteriores ninguno.

No admite otras prestaciones, rescates, exenciones parciales, atrasos, art18, movilidad, ahorro, inmuebles, actividad, gastos de la pensión, sindicato/colegio/defensa laborales ni cambios de categoría activa. La jubilación no acredita discapacidad activa. Continúan certificados de organismo competente, efectos expresos, corte documental, partición anual, conciliación de cotizaciones e importes, rechazo de duplicados/fechas imposibles/solapes, H2 sin calendario, filiación y rentas de mínimos.

Se suma empleo y pensión antes del gasto general único. El calendario atribuye el incremento exclusivamente al empleo certificado y descuenta su parte temporal de los gastos generales. La pensión nunca aumenta el límite asociado. El art20 se aplica una vez sobre el previo conjunto anterior a todos los gastos f; pensión no es otra renta distinta del trabajo. La mezcla usa Decimal exacto, sin extender la política Open exclusiva de empleo Madrid ni redondear cada rendimiento. No se altera ninguna fórmula ni expectativa previa.

Consumidores conectados por el libro existente: Madrid (educativos, familia numerosa, dos descendientes) y Valencia (dos descendientes). Andalucía conserva su alcance. Pruebas nuevas focalizan ambas API Madrid familia numerosa/Valencia dos descendientes, fronteras ±0,01, composición propia intacta, art19 frente a art20, orden y rechazos. No se afirma cobertura nueva de todas las combinaciones de los tres consumidores madrileños.

Fuentes primarias: LIRPF17.2.a.1,19.2.f,20 (texto a cierre2025); RIRPF11.2 y72; AEAT Manual IRPF2025, gastos art19.2.f y rendimientos de pensionistas. Originales y hashes en fuentes.json de la entrega, CAS externo. Manual2025 publicado en2026 se identifica como guía del ejercicio, no norma emitida en2025. No hay bloqueo jurídico para este perfil acotado: excluir la pensión del incremento sigue RIRPF11.2; atribuirle gasto activo por ser trabajo contradiría ese precepto. Otras prestaciones requieren un corte propio.

La renta y la base se conservan con su precisión interna. Su conciliación con los
censos en céntimos exige la proyección HALF_UP exacta y conservar la clasificación
respecto de 8.000 euros y, cuando procede por declaración individual, 1.800 euros.
La proyección no sustituye la renta que utiliza el cálculo. Un transporte que
cambie esa clasificación se rechaza antes de calcular el derecho familiar.

La primera revisión independiente queda favorable con reservas para este perfil.
Se conservan las pruebas anteriores al ajuste y los 24 controles de precisión;
no se extiende la conclusión a otras prestaciones o concurrencias. El estado de
comprobaciones conjuntas figura en el informe del corte de integración.
