# Integración de la revisión del comparador

El dictamen original corresponde a 218 entradas. Encontró cuatro discrepancias
del artículo 20 y el defecto P2 por el que una comparación podía reparar el
journal vivo. Sus informes, reproducciones e intentos fallidos se conservan
sin atribuirles el cierre posterior de 300 casos.

La [corrección monetaria](../ART20.md) tiene su propia revisión y regresiones.
El autor completó después 300 capturas distintas: 3.550 casillas iguales,
650 ausencias y cero diferencias contra la integración. La captura adicional
andaluza detectó siete diferencias, fuera de esos 300; quedan resueltas tras
una revisión independiente de la corrección. Véase el [cierre posterior](../CIERRE.md).

El integrador añade `closed_snapshot` a la lectura JSONL: fija la longitud al
abrir, consume sólo líneas completas y no escribe. No oculta corrupción en
líneas completas ni permite combinar corte de lectura y reparación. La
reparación sigue perteneciendo a la operación bajo bloqueo. Pasan siete pruebas
C300 y catorce portables. El primer lanzamiento portable falló por no tener
configurado `pdftotext`; la repetición con la herramienta Nix pasa. No fue un
defecto del arreglo. Ambos registros se conservan en la entrega de publicación.

El balance final del padre y el CI se registran por separado en ese cierre. El código de
salida 2 del comparador conserva las reservas de hechos sintéticos; no significa
que haya diferencias monetarias ni acredita aceptación fiscal universal.
Los originales grandes, el inventario completo de dependencias y el corte
histórico permanecen fuera del repositorio, identificados por sus manifiestos.
