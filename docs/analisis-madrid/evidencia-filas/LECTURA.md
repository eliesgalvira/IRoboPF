# Lectura de evidencia por fila

24 actuaciones; 2 pares PDF original/SES textual derivado de 2018; 2 coincidencias al céntimo publicado; 22 entradas exactas no conservadas tras escritura secuencial y Tab. Cero igualdades internas exactas certificadas y cero certificaciones completas. No equivale a 24/24 contrastadas.

Los extractos se transformaron seleccionando bruto, SS, nacimiento y selección regional: no son originales. Su SHA corresponde a sus propios bytes. El manifiesto conserva localizadores relativos y SHA de originales privados. Los PDF originales se guardan sin transformación en CAS base64: su SHA es de los bytes decodificados. Cada SES se publica como JSON UTF-8 declarado DERIVADO-SES-TEXTO con TODO el contenido inflado y decodificado ISO-8859-1, sin selección ni ocultación de campos. Su nombre CAS corresponde a los bytes del JSON derivado; no sustituye el SHA del SES comprimido original. Los originales comprimidos completos se conservan privados, referenciados por su hash. La preparación cotejó esos bytes con el registro de captura y verificó el roundtrip Latin1 exacto de todos los bytes antes y después de serializar. El JSON conserva el hash comprimido de procedencia y el hash del inflado Latin1. Si el texto contiene una cabecera ISO-8859-1, ésta pertenece a la representación decodificada; el JSON UTF-8 no es un SES listo para importar. Requiere revisión de privacidad antes de publicar; los tokens fiscales enteros permanecen escaneables. Los SHA fijan bytes; no certifican veracidad, identidad completa ni los negativos asumidos del escenario sintético.

El comando de resultados valida todo offline con Bun, decimal.js y pdftotext (Poppler) en PATH. No necesita red. Comprueba SHA de los artefactos públicos, formato discriminado exacto del derivado, texto dentro de Latin1 y roundtrip/hash del inflado. El SHA del comprimido es procedencia declarada: sin sus bytes privados el CLI público no verifica el original comprimido ni necesita acceder a él. Comprueba entrada CLI exacta, año/ID, bruto/SS, selección regional tipada y contradicciones de las casillas PDF con SES. Si falta una fuente o cambia un byte, falla. El manifiesto queda anclado por SHA en el verificador; actualizar evidencia requiere revisar ese contrato. No se usa un comparador aritmético como certificado de identidad.

H usa gasto general, reducción del trabajo, base, escalas estatal y Madrid, mínimos y composición de cuota con la implementación y normativa del catálogo. Los pares corroboran esos resultados sólo para dos entradas H de 2018 al céntimo de presentación. X comparte las operaciones fiscales y la normativa de 2018; I comparte las operaciones y transforma parámetros monetarios por IPC. Ninguna de esas formas X/I tiene salida directa Open aquí; compartir implementación o norma no extiende el contraste. Actualizar tramos, mínimos y demás parámetros por IPC y convertir netos a EUR-diciembre-2018 son transformaciones del motor no observadas en Open. Tampoco se extrapola a otros años.

Cuota Open: casilla 0595 / CAUTLIQ. Neto derivado = bruto − SS − cuota; no es casilla Open. Unidad nominal del ejercicio. Diferencias = Open menos interno CLI; ninguna tolerancia de un céntimo. SS estimada, sin TGSS; no certifica empleo, naturaleza de cotización ni identidad fiscal completa. Los ocho originales históricos/95 casillas son un contador separado.

## madrid-2018-base16000

[Extracto](sha256/2ac626e31b7c81a0bcdb6c98e69f6e60cabd87bbed04436cd684300a6c38d118.json). Entrada CLI SHA-256: `45a5eb6ca90b2a5e7a9488af92eff166898e38079e66c422242323da7ea0a49b`. Bruto: 16000; SS solicitada: 1016; leída: 1016; delta SS: 0 EUR del ejercicio.

Cuota PDF/SES: 1119.85; cuota interna: 1119.85125; delta: -0.00125. Neto derivado Open: 13864.15; interno: 13864.14875; delta: 0.00125. Coinciden al céntimo ya publicado; igualdad interna no acreditada. [PDF original base64](sha256/65d64628824bed71f2dfffcade172d6c40e43ea9d0eb6ffb4b3a3283ff8d1627.b64); [SES textual derivado completo UTF-8](sha256/2580b2320ddfc66534338cc9875e3d99cd7960c00ba426f7ee0ac4e538ca25d3.json).

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2019-base16000

[Extracto](sha256/4bbf15ac92ca80e8a75491bce54188adce6390bbd03a91e40e93b161b81ef524.json). Entrada CLI SHA-256: `f6f5a38b2e35e3bf8d0a0b1e49ee241f7c90548a5da650ade21105fd40080189`. Bruto: 16126.09; SS solicitada: 1024.006715; leída: 1024; delta SS: -0.006715 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2020-base16000

[Extracto](sha256/2ca0b4e9184a2cc04704e62ae0801fb8605aa65969e2509334c9934fa3b1832d.json). Entrada CLI SHA-256: `3a646f14b94bc97c15dee988c3b9718ef22f88fa5f5047aede54b8a768fa19cc`. Bruto: 16040.28; SS solicitada: 1018.55778; leída: 1018.55; delta SS: -0.00778 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2021-base16000

[Extracto](sha256/481cbf47b6ecd0218489127b5be30a75a8fafdac6b6b2f6b9d17d60a43c83133.json). Entrada CLI SHA-256: `76b5649a226f0426008a2241700110de94d658ecd4229044b3101c770a75fb07`. Bruto: 17090.9; SS solicitada: 1085.27215; leída: 1085.27; delta SS: -0.00215 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2022-base16000

[Extracto](sha256/cb8339e6c08cb23480e4cada5b3a462d29c613c9d268dd7380b23235558ce4b1.json). Entrada CLI SHA-256: `534e20a792350e30cf82cb728344a8671cdb3c82724c126634e145f53f33a16e`. Bruto: 18066.39; SS solicitada: 1147.215765; leída: 1147.21; delta SS: -0.005765 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2023-base16000

[Extracto](sha256/0508261e45b7a5057bba232afedfc17cfa104e96c6fbb0d3ca121277a045577a.json). Entrada CLI SHA-256: `4879da35dbdc610dfed1d1bb31da7ce9876c2bf23f82c49ee1a9e45f3a734cb0`. Bruto: 18626.8; SS solicitada: 1201.4286; leída: 1201.42; delta SS: -0.0086 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2024-base16000

[Extracto](sha256/88651fd113bc0f45461038b5a74eb308951758dead9c8092688f33355630d325.json). Entrada CLI SHA-256: `f84d1d300c806d513a2007f2d76b5743612067f1f2b544d06e8944597ceb2c0f`. Bruto: 19157.13; SS solicitada: 1239.466311; leída: 1239.46; delta SS: -0.006311 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2025-base16000

[Extracto](sha256/5c8b87e8a638548db220c51d0a4182715dfefc7fd7f2063a94c08f6f914c2ebc.json). Entrada CLI SHA-256: `bcff1a56a40f6ab4fbbe1a25b8c525565d79279dbd5dd2c38748c0d0f25cf7ed`. Bruto: 19717.37; SS solicitada: 1277.685576; leída: 1277.68; delta SS: -0.005576 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2018-base30000

[Extracto](sha256/faea59a8c63551a00733a2576f7eb8b98b4666f89c1502b7119823a3e8d381e1.json). Entrada CLI SHA-256: `2f1b83f06e645ae660fa49b410b6983726ce360d036e47752bbdde3dbbd290e3`. Bruto: 30000; SS solicitada: 1905; leída: 1905; delta SS: 0 EUR del ejercicio.

Cuota PDF/SES: 4795.14; cuota interna: 4795.1374; delta: 0.0026. Neto derivado Open: 23299.86; interno: 23299.8626; delta: -0.0026. Coinciden al céntimo ya publicado; igualdad interna no acreditada. [PDF original base64](sha256/09e1452cc2e139a7a6ae1ae6fa12a4bd10dbd67686a6c43b10b1dd7b2a396805.b64); [SES textual derivado completo UTF-8](sha256/410550519dffc2a92e7bd94c37720d0e8e2bd6ea873a8e9b266e59ec68c9034f.json).

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2019-base30000

[Extracto](sha256/b9967a6c1f5c00a94978261c05d91739d5d5b8fc79b6d98ef82231aacfd5ca0e.json). Entrada CLI SHA-256: `df404c9e78e6b76a84ab5b2d2f98c9de8b97ba4e27f5ca167374355c8ed7ace0`. Bruto: 30236.41; SS solicitada: 1920.012035; leída: 1920.01; delta SS: -0.002035 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2020-base30000

[Extracto](sha256/a545355d38f3d6b3b8633cbc8768dc5ba2b02f56c349fe2e3cf2d34edaf9ae57.json). Entrada CLI SHA-256: `f51d00e3fd23253842f5915280d8a4a424a320878e708fa8d65041b9072ff045`. Bruto: 30075.52; SS solicitada: 1909.79552; leída: 1909.79; delta SS: -0.00552 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2021-base30000

[Extracto](sha256/369145cd6cf3248a48046e71dd324e4e219a07914aca87de802c3ac5fbf869e3.json). Entrada CLI SHA-256: `aa7ad8d47af4f9eb7393aed049b08a825163f4519c057a4fc812751e393b053e`. Bruto: 32045.43; SS solicitada: 2034.884805; leída: 2034.88; delta SS: -0.004805 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2022-base30000

[Extracto](sha256/9608a7374165323863495180ccfaa1a9afc8a437f7332b4752bb83d33b402ab4.json). Entrada CLI SHA-256: `6d7b770fb941561f8e367bee91980e94f87d5a817b6e2cf73902f4a96aa787dc`. Bruto: 33874.49; SS solicitada: 2151.030115; leída: 2151.03; delta SS: -0.000115 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2023-base30000

[Extracto](sha256/bcde7bdb9b192ebb089204f4f04062ec0126df22ed524b65b3391528e4971978.json). Entrada CLI SHA-256: `35723746d6d0635007f515bf08b2ae8c14b1b7f38b60fe34c5fbb42ffb9cf425`. Bruto: 34925.25; SS solicitada: 2252.678625; leída: 2252.67; delta SS: -0.008625 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2024-base30000

[Extracto](sha256/076cbc9ec750b675407ced33bfb5105f5c206620af092ef61cde577baef7ec2e.json). Entrada CLI SHA-256: `bd31874c7864265387c77d253cda58e204ffb34a811243fb35f27b272a46be85`. Bruto: 35919.61; SS solicitada: 2323.998767; leída: 2323.99; delta SS: -0.008767 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2025-base30000

[Extracto](sha256/aa713297b08283a5bac0016b927357bf54ca9078158c67e3fb5f25ee1879f1ba.json). Entrada CLI SHA-256: `1e98b22ecbb97afc2a85131085114ff460cb85a95bccd928bd5be45c25ebe6fc`. Bruto: 36970.07; SS solicitada: 2395.660536; leída: 2395.66; delta SS: -0.000536 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2018-base60000

[Extracto](sha256/e09c6598829048574bb8648bbc51eaf306f514c096d9174bfc8812c0e2772d85.json). Entrada CLI SHA-256: `a75e2f31fc281c034197c7c95e6219fbb88571127f25e585ccfeb2858359ac41`. Bruto: 60000; SS solicitada: 2875.08315; leída: 2875.08; delta SS: -0.00315 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2019-base60000

[Extracto](sha256/4855c40a356c8270a770cedc78c322b0ee791f8cda4a24f01ee1063e5f8ff15e.json). Entrada CLI SHA-256: `06f451e525c6968eb1a14d3e3d514d855358a2ae9301cf2a61b1d9d7fdf2dcb3`. Bruto: 60472.83; SS solicitada: 3101.4162; leída: 3101.41; delta SS: -0.0062 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2020-base60000

[Extracto](sha256/e8c14ffbb6511d644683e251731013ce1229b455d672eee18647616435968830.json). Entrada CLI SHA-256: `83095d3f1a88f35a488f3d1e6cdf003d7883220156350018f6d005ffa7ec250d`. Bruto: 60151.03; SS solicitada: 3101.4162; leída: 3101.41; delta SS: -0.0062 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2021-base60000

[Extracto](sha256/980ce2cec8305954f5d16e7552fa2f8aef009fff6ddc7192dec116c5fbb4a34e.json). Entrada CLI SHA-256: `348591a03c8ca8aac41984e2555b1296a5e5186ac74152c5e5fcb92cf7532010`. Bruto: 64090.87; SS solicitada: 3101.4162; leída: 3101.41; delta SS: -0.0062 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2022-base60000

[Extracto](sha256/b1b2698e8a098122ea373494fea0b066accd8a53c6765d4a13655a8760bbf8b9.json). Entrada CLI SHA-256: `e6436d653ae188fbccf0e5121a5f4ee8feed3ba578cb71d29825ec79a53e7bfa`. Bruto: 67748.98; SS solicitada: 3154.2228; leída: 3154.22; delta SS: -0.0028 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2023-base60000

[Extracto](sha256/b4f63604115c0bffbca5e39c9ad85f4d1cfcb245d082d7ae689e3946695ab901.json). Entrada CLI SHA-256: `950c3fa4c2a338ed8d11f75fd7b984cedfdd63fc182085cac9ef571cf97edbdf`. Bruto: 69850.51; SS solicitada: 3479.517; leída: 3479.51; delta SS: -0.007 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2024-base60000

[Extracto](sha256/066284ff06698430c7da4e14ffee3a2628c845027f9a6bfb6a7be03dc961d865.json). Entrada CLI SHA-256: `ad41f069c594312dffb68b82e4cd26b8b64147d699c96e7d513317f1b4f1a5f0`. Bruto: 71839.23; SS solicitada: 3664.9962; leída: 3664.99; delta SS: -0.0062 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

## madrid-2025-base60000

[Extracto](sha256/8a26eacc69a6b191676b2a73d3defc640f63a12d8d637d44f2270b2110bd6593.json). Entrada CLI SHA-256: `2becc1d3a52bc30a53a35a5d3347febe138ff7c6a4f1e4ff24ebdaab46312f54`. Bruto: 73940.14; SS solicitada: 3841.993358; leída: 3841.99; delta SS: -0.003358 EUR del ejercicio.

SS no conservada en la ruta ordinaria ensayada, antes de Aceptar. Sin SES/PDF de ese intento; persistencia no acreditada. No demuestra imposibilidad universal de entrada. No hay cuota/neto Open comparable.

SS estimada; no acreditación TGSS ni coste laboral; Negativos parcialmente asumidos del escenario sintético; identidad completa no acreditada; X/I sin salida directa Open; IPC EUR-2018 es transformación del motor.

