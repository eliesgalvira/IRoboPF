import { execFileSync } from "node:child_process"
import path from "node:path"
const program = String.raw`
import copy,gzip,json,jsonschema
schema=json.load(open('schemas/procedencia/flujo/escalas-r36.schema.json'))
fragment=json.loads(gzip.decompress(open('docs/procedencia/implementaciones/flujo-escalas-r36-sol/fragmento.json.gz','rb').read()))
jsonschema.Draft202012Validator.check_schema(schema)
validator=jsonschema.Draft202012Validator(schema)
validator.validate(fragment)
results=[]
for kind in ['wiring','fiscal','site','operator','unit','admission','extra']:
    mutant=copy.deepcopy(fragment)
    if kind=='wiring': mutant['wiringAllowed']=True
    elif kind=='fiscal': mutant['completeRuleAcceptance']=True
    elif kind=='site': mutant['sites'][0]['siteClosed']=True
    elif kind=='operator': mutant['program'][0]['op']='opaque-financial-helper'
    elif kind=='unit': mutant['outputBindings'][0]['unit']='centimos'
    elif kind=='admission': mutant['admissionObligations'][0]['status']='accepted'
    else: mutant['extra']=True
    assert list(validator.iter_errors(mutant)), kind
    results.append({'case':kind,'rejected':True})
print(json.dumps({'schema':'pass','mutations':results,'meaning':'shape and pending states only; no causal sufficiency or tax acceptance'}))
`
const env = {
  ...process.env,
  PYTHONDONTWRITEBYTECODE: "1",
  UV_PROJECT_ENVIRONMENT: path.resolve(".cache/flujo-escalas-r36/venv")
}
process.stdout.write(
  execFileSync("bash", ["tools/procedencia/run.sh", "-c", program], {
    env,
    maxBuffer: 2e6
  })
)
