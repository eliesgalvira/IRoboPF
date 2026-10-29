// Contraste ECMAScript de los 16 patrones del schema; sin dependencias.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const patterns = JSON.parse(readFileSync('.cache/preservacion-v4-r26-sol/independientes/patterns.json', 'utf8'));
assert.equal(patterns.length, 16);
for (const [path, pattern] of patterns) {
  const value = pattern.includes('[0-9a-f]') ? 'a'.repeat(pattern.includes('{128}') ? 128 : 64) : 'carpeta/fuente.json';
  const regex = new RegExp(pattern);
  assert(regex.test(value), path);
  for (const suffix of ['\n', '\r', '\r\n', '\0']) assert(!regex.test(value + suffix), path);
}
console.log('16 patrones: valores válidos y rechazo de LF, CR, CRLF y NUL en ECMAScript.');
