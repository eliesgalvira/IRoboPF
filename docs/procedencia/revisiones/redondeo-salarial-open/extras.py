from pathlib import Path
R=Path.cwd(); C=R/'.cache/revision-redondeo-sol'; S=C/'stage'
s=(R/'tests/conexion-anual.test.ts').read_text(); alcance=s[s.index('const alcance'):s.index('function trabajo')]; funciones=s[s.index('function casoBase'):s.index('it("EDS integra')]
header="import {Effect,Schema} from 'effect'; import {writeFileSync} from 'node:fs'; import {liquidarIrpfAnualExplicito} from './lib/dominio/irpf/liquidacion/liquidar-irpf-anual'; import {CasoFiscalAnualExplicito} from './lib/dominio/irpf/trabajo-anual/conexion-contrato';\n"
(S/'actividad.ts').write_text(header+alcance+funciones+"\nconst r=Effect.runSync(liquidarIrpfAnualExplicito(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(actividad()))); const {rastro,...m}=r; writeFileSync(process.argv[2],JSON.stringify({m,lineas:rastro.pasos.flatMap(p=>p.lineasCalculo??[]).map(l=>[l.origen?.siteId,l.origen?.decimal])},null,2))")
