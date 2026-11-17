# Cuantización familiar ordinaria 2025

Política interna `open-familia-cuatro-gravamenes-2025`: aplica HALF_UP a céntimos
a cada gravamen completo estatal/autonómico de base y mínimo. Después resta los
mínimos y suma las cuotas. No redondea por tramo ni sólo al neto o resultado.
Los mínimos proceden de los productores vigentes; no se cambian tablas ni
esperados oficiales. Se conserva la cuantización salarial existente de Madrid.

Selección posterior a validar derechos, censo, rentas propias y atribuciones.
Sólo conexión anual explícita de empleo laboral/estatutario efectivo conciliado,
individual 2025, adulto de 18–64 sin discapacidad ni fallecimiento, sin ahorro,
otras rentas, art20/DA61 aplicables, deducciones, vivienda ni productores mixtos.
Base y mínimos finitos no negativos y base mayor o igual a ambos mínimos;
retenciones a céntimos. Se exige reconciliar bruto, cotizaciones y gasto general
ordinario; no se decide por identificadores de captura o importes particulares.

Censo observado: un descendiente ordinario con uno o dos titulares en Andalucía,
Cataluña, Galicia, Madrid o Comunitat Valenciana; o un ascendiente ordinario con
un titular en Aragón, Canarias, Castilla y León o Comunitat Valenciana. Todos
los titulares censados deben coincidir con la atribución producida. Otros
censos conservan el comportamiento anterior; esta política no les otorga derechos.

La condición literal `decimal-hasta-salida` de la capacidad anual de mínimos se
conserva. La API canónica, cotizaciones estimadas y retenciones no aportan los
hechos internos de selección. No se amplía la capacidad de mínimos ni se modifica
su evaluación jurídica. La política salarial sin familia permanece separada.

Se conservan 22 vectores sintéticos con esperados independientes para todos los
gravámenes, cuotas y resultado. Andalucía discrimina redondeo sólo neto; Canarias
discrimina sólo final; el medio céntimo estatal discrimina HALF_EVEN. Incluye
exclusiones de ámbito y adversas. Las seis suites del corte integrado pasan
169 pruebas, incluidas las fronteras del selector, los rechazos por causa y
la interacción con la política territorial. Tipos estrictos y Effect pasan;
los dos linters no presentan errores nuevos. Esta evidencia focal no sustituye
el CI completo ni amplía el alcance de las capturas.
