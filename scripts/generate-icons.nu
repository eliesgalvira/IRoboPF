#!/usr/bin/env nu

# Generates raster PWA + Apple icons and the legacy favicon.ico from
# `app/icon.svg`. Re-run whenever the icon source changes.
#
#   nu scripts/generate-icons.nu

const TMP = '/tmp/iropf-icons'

def composite [size: int, bg: string, scale_pct: int, body: string]: nothing -> string {
    let scale = ($size * $scale_pct / 100 / 295.996)
    let offset = ($size / 2)
    let bg_rect = if ($bg | is-empty) {
        ''
    } else {
        $"<rect width='($size)' height='($size)' fill='($bg)'/>"
    }
    let transform = $"translate\(($offset) ($offset)\) scale\(($scale)\) translate\(-147.998 -147.998\)"
    [
        $"<svg xmlns='http://www.w3.org/2000/svg' width='($size)' height='($size)' viewBox='0 0 ($size) ($size)'>"
        $bg_rect
        $"<g transform='($transform)'>"
        $body
        '</g></svg>'
    ] | str join
}

def rasterize [svg_text: string, out_path: path, size: int] {
    let tmp_svg = ($TMP | path join $"source-($size).svg")
    $svg_text | save -f $tmp_svg
    mkdir ($out_path | path dirname)
    ^rsvg-convert -w $size -h $size -o $out_path $tmp_svg
    rm $tmp_svg
}

mkdir $TMP

let root = ('.' | path expand)
let source_path = ($root | path join 'app/icon.svg')

let raw = (open --raw $source_path | decode utf-8)
let stripped = (
    $raw
    | str replace --regex '(?s)<style>.*?</style>\s*' ''
    | str replace --all 'class="ink"' 'fill="#000"'
)
let body = (
    $stripped
    | parse --regex '(?s)<svg[^>]*>(?P<body>.*)</svg>'
    | get body.0
    | str trim
)

let targets = [
    [label                out                            size bg          scale_pct];
    ['apple-icon'         'app/apple-icon.png'           180  '#F4ECD3'   70]
    ['icon-192'           'public/icon-192.png'          192  '#FFFFFF'   78]
    ['icon-512'           'public/icon-512.png'          512  '#FFFFFF'   78]
    ['icon-maskable-512'  'public/icon-maskable-512.png' 512  '#FFCE00'   56]
]

for t in $targets {
    let svg = (composite $t.size $t.bg $t.scale_pct $body)
    let out_path = ($root | path join $t.out)
    rasterize $svg $out_path $t.size
    print $"✓ ($t.label) → ($t.out)"
}

let ico_sizes = [16 32 48]
let ico_pngs = ($ico_sizes | each { |s|
    let svg = (composite $s '#FFFFFF' 78 $body)
    let svg_path = ($TMP | path join $"favicon-($s).svg")
    let png_path = ($TMP | path join $"favicon-($s).png")
    $svg | save -f $svg_path
    ^rsvg-convert -w $s -h $s -o $png_path $svg_path
    $png_path
})
let ico_out = ($root | path join 'app/favicon.ico')
^magick ...$ico_pngs $ico_out
$ico_pngs | each { |p| rm $p } | ignore
print '✓ favicon.ico → app/favicon.ico'
