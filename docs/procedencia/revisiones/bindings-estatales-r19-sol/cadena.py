"""Localizadores exactos dentro de la captura oficial fijada, sin seguir enlaces."""
from revisar import resolve, save


def main():
    h = 'b24910e31ccd9a7eeb3e542d4c10cdfe51aaaea978155a212f02b30e518d289f'
    text = resolve(h).read_text()
    result = []
    for token in ['id="a63"', 'id="datrigesimaquinta"']:
        start = text.find(token)
        assert start >= 0, token
        end = text.find('<div class="bloque"', start)
        assert end > start
        result.append({'sourceSha256': h, 'selector': token, 'start': start, 'end': end, 'quoteHTML': text[start:end], 'authority': 'Índice informativo cotejado con originales PDF; no sustituye a ley publicada.'})
    save('cadena-indice-oficial.json', result)
    print('CADENA dos bloques oficiales conservados por offsets; comprobar contra PDF primario')


if __name__ == '__main__':
    main()
