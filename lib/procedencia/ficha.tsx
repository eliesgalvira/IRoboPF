import type { Entidad } from "./modelo"

export function Ficha({
  entidad,
  snapshot,
}: {
  entidad: Entidad
  snapshot: string
}) {
  return (
    <main>
      <h1>{entidad.titulo}</h1>
      <p>
        {entidad.identidad === "ocurrencia"
          ? "Ocurrencia técnica versionada; no es una regla fiscal aceptada."
          : "Concepto editorial pendiente de enlace y revisión."}
      </p>
      <p>Interpretación, autenticidad y contrarrevisión: pendientes.</p>
      <p>Snapshot: {snapshot}</p>
      {"expresion" in entidad && (
        <dl>
          <dt>Expresión observada</dt>
          <dd>
            <code>{entidad.expresion}</code>
          </dd>
          <dt>Valor observado</dt>
          <dd>{entidad.valorObservado ?? "Desconocido"}</dd>
          <dt>Unidad candidata</dt>
          <dd>{entidad.unidadCandidata}</dd>
          <dt>Ejercicios candidatos</dt>
          <dd>{entidad.ejerciciosCandidatos.join(", ") || "Desconocidos"}</dd>
          <dt>Territorios candidatos</dt>
          <dd>{entidad.territoriosCandidatos.join(", ") || "Desconocidos"}</dd>
        </dl>
      )}
      {Object.entries(entidad.secciones).map(([nombre, seccion]) => (
        <section key={nombre}>
          <h2>{nombre}</h2>
          <p>
            {seccion.estado}: {seccion.texto}
          </p>
        </section>
      ))}
      <h2>Fuentes exactas</h2>
      <ul>
        {entidad.fuentes.map((f) => (
          <li key={`${f.archivo}/${f.localizador}`}>
            <p>
              {f.archivo} · SHA-256 {f.sha256}
            </p>
            <pre>{f.localizador}</pre>
          </li>
        ))}
      </ul>
      <ul>
        {entidad.aristas.map((a) => (
          <li key={`${a.relacion}/${a.destino.id}`}>
            <a
              href={`/procedencia/${snapshot}/${a.destino.id}/${a.destino.revision}`}
            >
              {a.relacion}: {a.destino.id}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
