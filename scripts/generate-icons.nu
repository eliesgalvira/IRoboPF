#!/usr/bin/env nu

# Genera iconos raster PWA + Apple y el favicon.ico legacy desde `app/icon.svg`.
# Vuelve a ejecutarlo cuando cambie el icono fuente.
#
#   nu scripts/generate-icons.nu

const TEMPORAL = '/tmp/iropf-icons'

def componer [tamano: int, fondo: string, porcentaje_escala: int, cuerpo: string]: nothing -> string {
    let escala = ($tamano * $porcentaje_escala / 100 / 295.996)
    let desplazamiento = ($tamano / 2)
    let rectangulo_fondo = if ($fondo | is-empty) {
        ''
    } else {
        $"<rect width='($tamano)' height='($tamano)' fill='($fondo)'/>"
    }
    let transformacion = $"translate\(($desplazamiento) ($desplazamiento)\) scale\(($escala)\) translate\(-147.998 -147.998\)"
    [
        $"<svg xmlns='http://www.w3.org/2000/svg' width='($tamano)' height='($tamano)' viewBox='0 0 ($tamano) ($tamano)'>"
        $rectangulo_fondo
        $"<g transform='($transformacion)'>"
        $cuerpo
        '</g></svg>'
    ] | str join
}

def rasterizar [texto_svg: string, ruta_salida: path, tamano: int] {
    let svg_temporal = ($TEMPORAL | path join $"fuente-($tamano).svg")
    $texto_svg | save -f $svg_temporal
    mkdir ($ruta_salida | path dirname)
    ^rsvg-convert -w $tamano -h $tamano -o $ruta_salida $svg_temporal
    rm $svg_temporal
}

mkdir $TEMPORAL

let raiz = ('.' | path expand)
let ruta_fuente = ($raiz | path join 'app/icon.svg')

let crudo = (open --raw $ruta_fuente | decode utf-8)
let sin_estilos = (
    $crudo
    | str replace --regex '(?s)<style>.*?</style>\s*' ''
    | str replace --all 'class="ink"' 'fill="#000"'
)
let cuerpo = (
    $sin_estilos
    | parse --regex '(?s)<svg[^>]*>(?P<body>.*)</svg>'
    | get body.0
    | str trim
)

let objetivos = [
    [etiqueta             salida                         tamano fondo      porcentaje_escala];
    ['apple-icon'         'app/apple-icon.png'           180  '#F4ECD3'   70]
    ['icon-192'           'public/icon-192.png'          192  '#FFFFFF'   78]
    ['icon-512'           'public/icon-512.png'          512  '#FFFFFF'   78]
    ['icon-maskable-512'  'public/icon-maskable-512.png' 512  '#FFCE00'   56]
]

for objetivo in $objetivos {
    let svg = (componer $objetivo.tamano $objetivo.fondo $objetivo.porcentaje_escala $cuerpo)
    let ruta_salida = ($raiz | path join $objetivo.salida)
    rasterizar $svg $ruta_salida $objetivo.tamano
    print $"✓ ($objetivo.etiqueta) → ($objetivo.salida)"
}

let tamanos_ico = [16 32 48]
let pngs_ico = ($tamanos_ico | each { |tamano|
    let svg = (componer $tamano '#FFFFFF' 78 $cuerpo)
    let ruta_svg = ($TEMPORAL | path join $"favicon-($tamano).svg")
    let ruta_png = ($TEMPORAL | path join $"favicon-($tamano).png")
    $svg | save -f $ruta_svg
    ^rsvg-convert -w $tamano -h $tamano -o $ruta_png $ruta_svg
    $ruta_png
})
let salida_ico = ($raiz | path join 'app/favicon.ico')
^magick ...$pngs_ico $salida_ico
$pngs_ico | each { |png| rm $png } | ignore
print '✓ favicon.ico → app/favicon.ico'
