export function sinTry() {
  return 7
}

export function conCatch() {
  try {
    throw new Error("prueba")
  } catch {
    return 11
  }
}

export function conFinally(pasos: string[]) {
  try {
    pasos.push("try")
    return 13
  } finally {
    pasos.push("finally")
  }
}

export function conTodo(pasos: string[]) {
  pasos.push("antes")
  try {
    pasos.push("try")
    throw new Error("prueba")
  } catch (error) {
    pasos.push(String(error))
    return 17
  } finally {
    pasos.push("finally")
  }
}

export function condicional(entrar: boolean) {
  if (!entrar) return 19
  try {
    return 23
  } catch {
    return 29
  }
}

export function switchSinRepresentar(valor: number) {
  switch (valor) {
    case 1: return 31
    default: return 37
  }
}
