import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import PaginaErrata from "../app/errata/page"

describe("pagina de errata", () => {
  it("presenta una errata concisa del redondeo legacy Python", () => {
    const html = renderToStaticMarkup(createElement(PaginaErrata))

    expect(html).toContain("Errata técnica")
    expect(html).toContain("round()")
    expect(html).toContain("half-even")
    expect(html).toContain("half-up")
    expect(html).toContain("float")
    expect(html).toContain("16206.18")
    expect(html).toContain("16206.19")
    expect(html).toContain("3152.71")
    expect(html).toContain("3152.72")
  })
})
