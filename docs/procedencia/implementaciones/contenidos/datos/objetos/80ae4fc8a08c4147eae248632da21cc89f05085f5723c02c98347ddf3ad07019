import type { Entidad, EstadoEvidencia } from "./modelo"

export function Ficha({
  entidad,
  snapshot,
  evidencia,
  enlaces = [],
}: {
  entidad: Entidad
  snapshot: string
  enlaces?: ReadonlyArray<{ titulo: string; href: string }>
  evidencia?: typeof EstadoEvidencia.Type | undefined
}) {
  return (
    <main>
      <h1>{entidad.titulo}</h1>
      <p>
        {entidad.identidad === "ocurrencia"
          ? "Ocurrencia técnica versionada; no es una regla fiscal aceptada."
          : "Concepto editorial pendiente de enlace y revisión."}
      </p>
      {evidencia !== undefined ? (
        <dl>
          <dt>Integridad</dt>
          <dd>{evidencia.integridad}</dd>
          <dt>Exactitud numérica del sujeto</dt>
          <dd>{evidencia.exactitudNumerica}</dd>
          <dt>Autenticidad según manifiesto</dt>
          <dd>
            {evidencia.autenticidad.estado}. Evaluación:{" "}
            {evidencia.autenticidad.fecha}. {evidencia.autenticidad.limites}
          </dd>
          <dt>Interpretación</dt>
          <dd>candidata</dd>
          <dt>Revisión del binding</dt>
          <dd>pendiente</dd>
          <dt>Aceptación fiscal completa</dt>
          <dd>false</dd>
        </dl>
      ) : (
        <p>Interpretación, autenticidad y contrarrevisión: pendientes.</p>
      )}
      <ul>
        {enlaces.map((e) => (
          <li key={e.href}>
            <a href={e.href}>{e.titulo}</a>
          </li>
        ))}
      </ul>
      {entidad.tipo === "Citation" && (
        <blockquote>{entidad.selector.texto}</blockquote>
      )}
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
