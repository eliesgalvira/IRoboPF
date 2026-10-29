import { Schema } from "effect"
// Contraste del cierre ya conservado. No ejecuta ni sustituye al coordinador.
export function verificarAceptacionLimitada(
  payloadHash,
  sujeto,
  dependencias,
  leer
) {
  const porRuta = new Map()
  for (const d of dependencias) {
    if (porRuta.has(d.path)) throw new Error("Dependencia duplicada")
    porRuta.set(d.path, d.sha256)
  }
  const referencia = (ref) => {
    if (!ref || porRuta.get(ref.path) !== ref.sha256)
      throw new Error("Referencia fuera del cierre exacto")
    return JSON.parse(leer(ref.sha256).toString())
  }
  const ruta = (path) => referencia({ path, sha256: porRuta.get(path) })
  const registro = ruta("docs/procedencia/enlaces/registro.json")
  const entradas = registro.entries.filter(
    (e) => e.payload.sha256 === payloadHash
  )
  if (entradas.length !== 1) throw new Error("Payload sin registro inequívoco")
  const entry = entradas[0]
  const payload = referencia(entry.payload)
  if (payload.schemaVersion !== 2 || payload.itemId !== sujeto)
    throw new Error("Aceptación sin ámbito ejecutable del sujeto")
  const ambito = referencia(payload.executableScope)
  const atestacion = referencia(entry.attestation)
  const revisores = ruta("docs/procedencia/enlaces/revisores.json")
  const matches = revisores.reviewers.filter(
    (r) => r.taskId === atestacion.reviewTaskId
  )
  if (
    revisores.schemaVersion !== 2 ||
    matches.length !== 1 ||
    payload.authorTaskId === atestacion.reviewTaskId
  )
    throw new Error("Revisión independiente no registrada")
  const reviewer = matches[0]
  const aprobaciones = reviewer.approvals.filter(
    (a) => a.payloadSha256 === payloadHash
  )
  if (
    aprobaciones.length !== 1 ||
    JSON.stringify(aprobaciones[0].attestation) !==
      JSON.stringify(entry.attestation)
  )
    throw new Error("Atestación sin aprobación exacta")
  const registroDelegacion = referencia(reviewer.delegationRegistry)
  let delegados
  if (Array.isArray(registroDelegacion)) delegados = registroDelegacion
  else {
    const containers = ["delegates", "delegate", "delegaciones"].filter(
      (k) => k in registroDelegacion
    )
    if (registroDelegacion.version !== 1 || containers.length !== 1)
      throw new Error("Delegación versionada ambigua")
    delegados =
      containers[0] === "delegate"
        ? [registroDelegacion.delegate]
        : registroDelegacion[containers[0]]
  }
  if (
    !Array.isArray(delegados) ||
    new Set(delegados.map((d) => d.taskId)).size !== delegados.length ||
    delegados.some(
      (d) =>
        !Schema.is(Schema.String)(d.taskId) ||
        d.taskId.length === 0 ||
        ("key" in d && "clave" in d) ||
        ("role" in d && "rol" in d)
    )
  )
    throw new Error("Identidad de delegación ambigua")
  const claves = delegados
    .map((d) => d.key ?? d.clave)
    .filter((key) => key !== undefined)
  if (
    new Set(claves).size !== claves.length ||
    claves.some((key) => !Schema.is(Schema.String)(key) || key.length === 0)
  )
    throw new Error("Clave de delegación ambigua")
  const delegacion = delegados.filter(
    (d) => d.taskId === atestacion.reviewTaskId
  )
  if (delegacion.length !== 1) throw new Error("Revisor sin delegación")
  const rol = delegacion[0].role ?? delegacion[0].rol
  const key = delegacion[0].key ?? delegacion[0].clave
  if (
    (rol !== undefined && !["review", "revision"].includes(rol)) ||
    (key !== undefined && !key.startsWith("revision-"))
  )
    throw new Error("Delegación no independiente")
  if (
    !atestacion.report.path.startsWith(reviewer.reportDirectory + "/") ||
    porRuta.get(atestacion.report.path) !== atestacion.report.sha256 ||
    leer(atestacion.report.sha256).length === 0
  )
    throw new Error("Informe ausente o ajeno")
  for (const key of ["inventory", "scope"])
    if (JSON.stringify(atestacion[key]) !== JSON.stringify(payload[key]))
      throw new Error("Atestación de otro inventario o alcance")
  if (
    atestacion.payloadSha256 !== payloadHash ||
    atestacion.decision !== "accepted-limited" ||
    ambito.itemId !== sujeto ||
    ambito.completeRuleAcceptance !== false ||
    JSON.stringify(ambito.inventory) !== JSON.stringify(payload.inventory) ||
    JSON.stringify(ambito.source) !== JSON.stringify(payload.source) ||
    JSON.stringify(ambito.decision) !== JSON.stringify(payload.legalReview)
  )
    throw new Error("Aceptación de otro payload o ámbito")
  const decisiones = referencia(payload.legalReview.decisions)
  const elegidas = decisiones.filter(
    (d) => d.id === payload.legalReview.decisionId
  )
  if (elegidas.length !== 1 || elegidas[0].status !== "accepted")
    throw new Error("Decisión ausente o ambigua")
  const decision = elegidas[0]
  const scopeKeys = [
    "schemaVersion",
    "decision",
    "source",
    "itemId",
    "inventory",
    "year",
    "territory",
    "unit",
    "value",
    "component",
    "taxBase",
    "period",
    "predicate",
    "externalConditions",
    "editorialConditions",
    "completeRuleAcceptance",
  ]
  if (
    Object.keys(ambito).sort().join() !== scopeKeys.sort().join() ||
    ambito.schemaVersion !== 1 ||
    ambito.taxBase !== "general" ||
    ambito.unit !== "EUR" ||
    ![
      "estatal-comun",
      "andalucia",
      "comunitat-valenciana",
      "catalunya",
      "madrid",
      "murcia",
    ].includes(ambito.territory) ||
    JSON.stringify(ambito.externalConditions) !==
      JSON.stringify(["residence-unverified", "eligibility-unverified"])
  )
    throw new Error("Contrato de ámbito no soportado")
  const source = ambito.source
  const localizador =
    source.symbol + "[" + source.tablePath[0] + "]." + source.tablePath[1]
  if (
    source.tablePath.length !== 2 ||
    decision.engineLocations.length !== 1 ||
    decision.engineLocations[0].symbol !== localizador ||
    decision.engineLocations[0].path !== source.file ||
    decision.engineLocations[0].sha256 !== source.sha256 ||
    decision.column !== source.tablePath[1]
  )
    throw new Error("Celda distinta de la decisión")
  const estatal = ambito.territory === "estatal-comun"
  const periodo = estatal
    ? "nominal-only"
    : ambito.territory === "madrid"
      ? "madrid-2022"
      : "ordinary-no-death"
  const predicado =
    source.symbol === "MURCIA_2022" && source.tablePath[0] === "4"
      ? "murcia-blg-gt-60000"
      : "nominal-cell"
  if (
    ambito.component !== (estatal ? "estatal" : "autonomico") ||
    ambito.period !== periodo ||
    ambito.predicate !== predicado ||
    (ambito.territory === "madrid" &&
      (ambito.year !== 2022 || source.symbol !== "MADRID_2022")) ||
    (ambito.territory === "catalunya" &&
      (ambito.year < 2020 || ambito.year > 2024))
  )
    throw new Error("Condiciones ejecutables contradictorias")
  for (const key of ["year", "territory", "unit"])
    if (ambito[key] !== payload.scope[key])
      throw new Error("Ámbito distinto del payload")
  for (const key of ["year", "territory", "unit", "value"])
    if (ambito[key] !== decision[key])
      throw new Error("Dimensión jurídica contradictoria")
  if (
    JSON.stringify(ambito.editorialConditions) !==
      JSON.stringify(decision.conditions) ||
    JSON.stringify(payload.scope.conditions) !==
      JSON.stringify(decision.conditions)
  )
    throw new Error("Condiciones editoriales alteradas")
  for (const citation of decision.citations) referencia(citation)
  for (const key of ["chainEvidence", "additionalCitations"])
    if (decision[key]) referencia(decision[key])
  return ambito
}

// La ausencia de metadatos de validación se conserva explícita; no se fecha hoy.
export function estadoAutenticidad(manifiesto) {
  return {
    estado: manifiesto.authenticity?.status ?? "not-validated",
    fecha:
      manifiesto.authenticity?.checkedAt ?? "No consta fecha de validación",
    limites:
      manifiesto.authenticity?.scope ??
      "No consta validación de autenticidad histórica",
  }
}
