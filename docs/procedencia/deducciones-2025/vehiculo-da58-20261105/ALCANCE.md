# Vehículo eléctrico DA58 y movilidad de Castilla y León · 2025

Las dos entradas de la API anual consumen `deduccionesTerritoriales2025.vehiculoDA582025`. El sobre describe la adquisición, matrícula, titular, factura, pagos, características y ayudas previstas de un único vehículo. El motor deriva la base y la deducción; no acepta un importe fiscal calculado por el cliente.

El perfil admitido es individual, Madrid o Castilla y León, turismo nuevo M1 BEV de dos a siete plazas, titular pleno único y factura propia. Adquisición, primera matrícula y pago completo pertenecen a 2025; los pagos son anteriores o simultáneos a la matrícula. Precio antes de IVA hasta 45.000 euros y autonomía WLTP de al menos 30 km. Se exige historia declarada sin otra compra DA58 ni anticipos previos.

La base incluye tributos y gastos inherentes, resta ayudas públicas previstas no cobradas en 2025 y se limita a 20.000 euros. La deducción estatal generada es el 15 %; su aplicación consume únicamente la cuota estatal disponible. El exceso aritmético no se convierte en arrastre ni en cuota autonómica adicional.

Para movilidad sostenible de Castilla y León se concilian vehículo, titular, matrícula, precio, autonomía y cada pago con el mismo libro estatal. Se conserva el 15 % regional y el límite de 4.000 euros menos la deducción estatal **generada** del mismo vehículo. La insuficiencia de cuota estatal no aumenta ese límite regional. Esta lectura normativa está respaldada por la primera revisión; no se ha localizado una consulta vinculante específica sobre insuficiencia. Se conserva además el límite regional de precio de 40.000 euros con impuestos.

Ejemplo revisado: vehículo de 30.000 euros sin ayudas, 3.000 euros estatales y 1.000 regionales generados, cada uno limitado por su cuota. Con ayudas previstas de 3.000 euros para un precio de 18.000, se generan 2.250 estatales y 1.750 regionales. La composición común aplica cada importe una sola vez antes de los pagos a cuenta.

Las referencias IDAE, ficha, matrícula, factura y expediente son declaraciones documentales, sin autenticación automática. Deben acreditar modelo elegible y primera matrícula en España. La permanencia regional de cuatro años exige seguimiento futuro; una declaración de intención no acredita el cumplimiento ni calcula una regularización.

Se rechazan con motivo concreto anticipos, cronologías de otros ejercicios, ayudas cobradas, otras tecnologías/categorías, cotitularidad, financiación pendiente, otros territorios y combinaciones todavía sin productor. También quedan fuera las interacciones con ELA, inmuebles, maternidad y donativos. Estas exclusiones delimitan el contrato técnico y no declaran una inelegibilidad legal general.

Fuentes y localizadores en [FUENTES.json](FUENTES.json). Validación y límites del dictamen en [REVISION.md](REVISION.md). La integración requiere la corrección de precisión monetaria de ELA y el CI completo del corte.
