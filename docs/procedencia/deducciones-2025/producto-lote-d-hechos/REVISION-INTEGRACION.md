# Integración de CLM, Castilla y León y Extremadura

La revisión independiente identificó R1/R2: se aplicaba en conjunta el reparto
reservado a tributación individual de partos múltiples y material escolar.
Corregidas únicamente esas dos ramas de Extremadura mediante un reparto por
modalidad. La conjunta mantiene el importe completo si contiene algún titular;
una declaración sin titulares conserva cero. El reparto de ELA y los otros
territorios permanece igual.

Los dos contraejemplos independientes pasan ahora: gemelos, 600 EUR en conjunta;
material escolar, 15 EUR. Se conservan 300 y 7,50 EUR respectivamente para
individual con dos titulares. El manual AEAT 2025 precisa el reparto individual
en [partos múltiples](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-extremadura/partos-multiples.html)
y [material escolar](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025-deducciones-autonomicas/comunidad-autonoma-extremadura/compra-material-escolar.html).
Los originales congelados y localizadores constan en la revisión.

Validación del integrador: 78 pruebas (41 del autor, 33 independientes y cuatro
regresiones nuevas), tipos estrictos/Effect, Oxlint y ESLint conformes, con
un worker y timeout por comando. Los rojos originales quedan preservados.
Las expectativas independientes no se cambiaron. Un test nuevo propio tomó
inicialmente 600 para una fixture de trillizos; se corrigió a 900, conservando
ese error de fixture por separado de los hallazgos fiscales.

Se mantiene la matriz: doce reglas parciales y 51 códigos sin nuevo evaluador,
sin conexión anual o reconocimiento de derechos externos. Las reservas de CLM,
CyL y Extremadura conservan su ámbito. El verificador dependiente del manifiesto
privado no se incorpora al repositorio. Pendiente CI conjunto y publicación.
