# Valencia: replay público del alquiler

El paquete textual reconstruye los 185 originales fijados por el vínculo documental: UTF-8 exacto, PDF base64, SES Latin-1 representado en UTF-8 y recomprimido con Node Nix 24.19.0 fijado por derivación y SHA. El auxiliar Latin-1 sin comprimir se representa también sin pérdida. No se excluyen faltantes ni se añade autoridad alternativa.

El loader exige paquete, fixture completo, módulos, entrada estable y pesos exactos. No admite raíces privadas ni omisiones. El PDF se lee además desde los bytes originales con rawPdfRows; se concilian todas las casillas declaradas y NIF y se exige igualdad con la proyección del extracto.

Se conservan 601.05 del resumen salarial y -198.95 del final independiente. El residual queda intacto: no se resta ninguna deducción para fabricar el final. Los hechos externos siguen separados de readbacks. La vinculación documental no cuenta coincidencias; sólo el medidor puede hacerlo tras comparar con el motor. No se cambia ninguna fórmula ni se usa fallback salarial.

El delta del medidor incorpora exclusivamente la ruta de vinculación Valencia. Los dos documentos de casos son propuestas POST que mantienen los otros 79 por valor. La función proponerPublicacionValencia valida los tres PRE completos mediante SHA antes de devolver ambos documentos, sin escribir; el integrador debe volver a comprobar PRE y aplicar ambos o ninguno bajo su control transaccional. No ejecutar la función sobre POST como si fuera PRE.

La revisión independiente contrastó estáticamente los originales, los pesos y la preservación de los otros 79 casos. Sus adversas se ejecutaron junto con el replay y el control del motor: 41 pruebas pasan en cinco suites. La medición separada obtiene −198,95 EUR tanto en Open como en el motor y eleva la muestra a 70/80. La prueba nacional exige además ambas vinculaciones de alquiler. Las verificaciones obligatorias están incorporadas a CI.

Los pendientes del manifiesto de preparación se conservan como antecedentes; no sustituyen los resultados ejecutados. El alcance sigue limitado al caso sintético: documentos externos, derechos jurídicos y hechos futuros no se presentan como comprobados por la interfaz de Open. La aplicación local de los dos documentos se hizo tras replay, comparación con el POST revisado y segunda comprobación de los PRE, con lock cooperativo y rollback ante excepciones; no se afirma atomicidad frente a un fallo del proceso.
