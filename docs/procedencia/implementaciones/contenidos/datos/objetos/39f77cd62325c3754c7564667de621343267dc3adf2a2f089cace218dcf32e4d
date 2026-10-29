// Frontera síncrona Node del almacén local; nunca se importa desde el rastro cliente.
export {
  readFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  cpSync,
  renameSync,
  writeFileSync,
} from "node:fs"
export { resolve } from "node:path"
export { tmpdir } from "node:os"

import {
  openSync,
  closeSync,
  fstatSync,
  lstatSync,
  readSync,
  writeSync,
  fsyncSync,
  linkSync,
  unlinkSync,
  constants,
} from "node:fs"
import { isAbsolute, resolve as absolute } from "node:path"
import { createHash, randomUUID } from "node:crypto"

// Linux local: cada directorio se abre relativo al descriptor anterior. No sigue
// symlinks, ni siquiera en ancestros. Mantiene los descriptores hasta terminar.
function directorios(ruta) {
  if (!isAbsolute(ruta) || absolute(ruta) !== ruta)
    throw new Error("Raíz CAS absoluta y canónica requerida")
  const abiertos = []
  let actual = ""
  try {
    for (const parte of ["", ...ruta.split("/").filter(Boolean)]) {
      actual = parte ? actual + "/" + parte : "/"
      const parent = abiertos.at(-1)
      const fd = openSync(
        parent ? `/proc/self/fd/${parent.fd}/${parte}` : "/",
        constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW
      )
      abiertos.push({
        fd,
        ruta: actual.replace(/^\/\//, "/"),
        stat: fstatSync(fd),
      })
    }
    return abiertos
  } catch (error) {
    for (const d of abiertos.reverse()) closeSync(d.fd)
    throw error
  }
}
function comprobarDirectorios(abiertos) {
  for (const d of abiertos) {
    const s = lstatSync(d.ruta)
    if (!s.isDirectory() || s.dev !== d.stat.dev || s.ino !== d.stat.ino)
      throw new Error("Ancestro CAS sustituido")
  }
}
function identidad(h) {
  if (h.length !== 64 || !/^[a-f0-9]{64}$/.test(h))
    throw new Error("Hash CAS inválido")
}
export function leerLocalCerrado(raiz, h, limite, esperado) {
  identidad(h)
  const dirs = directorios(absolute(raiz))
  let fd
  try {
    comprobarDirectorios(dirs)
    fd = openSync(
      `/proc/self/fd/${dirs.at(-1).fd}/${h}`,
      constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK
    )
    const antes = fstatSync(fd)
    if (
      !antes.isFile() ||
      antes.size > limite ||
      (esperado !== undefined && antes.size !== esperado)
    )
      throw new Error("Tamaño o clase física CAS incorrectos")
    const bytes = Buffer.alloc(antes.size)
    let pos = 0
    while (pos < bytes.length) {
      const n = readSync(
        fd,
        bytes,
        pos,
        Math.min(1_048_576, bytes.length - pos),
        pos
      )
      if (n === 0) throw new Error("Objeto CAS truncado")
      pos += n
    }
    const despues = fstatSync(fd)
    const nombre = lstatSync(`/proc/self/fd/${dirs.at(-1).fd}/${h}`)
    if (
      antes.size !== despues.size ||
      antes.mtimeMs !== despues.mtimeMs ||
      antes.ctimeMs !== despues.ctimeMs ||
      nombre.ino !== antes.ino ||
      nombre.dev !== antes.dev ||
      !nombre.isFile() ||
      createHash("sha256").update(bytes).digest("hex") !== h
    )
      throw new Error("Objeto CAS mutado o corrupto")
    comprobarDirectorios(dirs)
    return bytes
  } catch (error) {
    if (error.code === "ENOENT") throw new Error("Objeto prometido ausente")
    throw error
  } finally {
    if (fd !== undefined) closeSync(fd)
    for (const d of dirs.reverse()) closeSync(d.fd)
  }
}
function validarExterno(descriptor) {
  if (
    Object.keys(descriptor).sort().join() !== "bytes,clase,hash,mime,sha512" ||
    descriptor.clase !== "original-pdf" ||
    descriptor.mime !== "application/pdf" ||
    !Number.isSafeInteger(descriptor.bytes) ||
    descriptor.bytes <= 10_000_000 ||
    descriptor.bytes > 100_000_000 ||
    descriptor.sha512.length !== 128 ||
    !/^[a-f0-9]{128}$/.test(descriptor.sha512)
  )
    throw new Error("Descriptor externo fuera de contrato")
  identidad(descriptor.hash)
}
export function leerExterno(descriptor) {
  validarExterno(descriptor)
  const raiz = process.env.IROBOPF_CAS_LOCAL
  if (!raiz || !isAbsolute(raiz) || absolute(raiz) !== raiz)
    throw new Error("CAS local externo no configurado")
  const bytes = leerLocalCerrado(
    raiz,
    descriptor.hash,
    100_000_000,
    descriptor.bytes
  )
  if (
    descriptor.clase !== "original-pdf" ||
    descriptor.mime !== "application/pdf" ||
    descriptor.bytes <= 10_000_000 ||
    descriptor.bytes > 100_000_000 ||
    !bytes.subarray(0, 5).equals(Buffer.from("%PDF-")) ||
    createHash("sha512").update(bytes).digest("hex") !== descriptor.sha512
  )
    throw new Error("Descriptor externo incorrecto")
  return bytes
}
export function guardarExterno(descriptor, bytes) {
  validarExterno(descriptor)
  if (
    bytes.length !== descriptor.bytes ||
    !bytes.subarray(0, 5).equals(Buffer.from("%PDF-")) ||
    createHash("sha256").update(bytes).digest("hex") !== descriptor.hash ||
    createHash("sha512").update(bytes).digest("hex") !== descriptor.sha512
  )
    throw new Error("Original externo incoherente antes de escribir")
  // El mismo contrato verifica también los objetos preexistentes; nunca sobrescribe.
  const raiz = process.env.IROBOPF_CAS_LOCAL
  if (!raiz || !isAbsolute(raiz) || absolute(raiz) !== raiz)
    throw new Error("CAS local externo no configurado")
  identidad(descriptor.hash)
  const dirs = directorios(raiz)
  let fd
  const temporal = `/proc/self/fd/${dirs.at(-1).fd}/.entrada-${randomUUID()}`
  try {
    comprobarDirectorios(dirs)
    fd = openSync(
      temporal,
      constants.O_WRONLY |
        constants.O_CREAT |
        constants.O_EXCL |
        constants.O_NOFOLLOW,
      0o600
    )
    let pos = 0
    while (pos < bytes.length)
      pos += writeSync(fd, bytes, pos, Math.min(1_048_576, bytes.length - pos))
    fsyncSync(fd)
    closeSync(fd)
    fd = undefined
    try {
      linkSync(temporal, `/proc/self/fd/${dirs.at(-1).fd}/${descriptor.hash}`)
    } catch (error) {
      if (error.code !== "EEXIST") throw error
    }
    fsyncSync(dirs.at(-1).fd)
    comprobarDirectorios(dirs)
  } finally {
    if (fd !== undefined) closeSync(fd)
    try {
      unlinkSync(temporal)
    } finally {
      for (const d of dirs.reverse()) closeSync(d.fd)
    }
  }
  leerExterno(descriptor)
}
