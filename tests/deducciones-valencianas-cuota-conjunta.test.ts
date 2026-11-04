import { test } from "vitest"
import { casos } from "./cuota-conjunta-valenciana.casos"
for (const [nombre, ejecutar] of Object.entries(casos)) test(nombre, ejecutar)
