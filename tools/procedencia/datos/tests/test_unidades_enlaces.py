"""Independent small fixtures for the candidate contract, through the real CLI."""
import copy
import json
import os
import subprocess
import unittest
import test_obligaciones_lotes as lots
from test_obligaciones_lotes import ROOT
from test_flujo import f


class Units(unittest.TestCase):
    def setUp(self):
        self.fixture = lots.Lots()
        self.fixture.setUp()
        self.addCleanup(self.fixture.doCleanups)

    def registry(self):
        lot = self.fixture
        r = lot.fixture(header='Tasa (%)', unit='percent')
        # Independent official-looking synthetic PDF: observed rate 12 percent.
        r['version'] = 2
        r['tables'][0]['year'] = 2013
        c = r['tables'][0]['cells'][0]
        c.update(subject='synthetic-person', conditions='annual-observed', engineExpression=None)
        c['unitEvidence'].update(relation='column', bbox=[15,15,80,35])
        binding = {'file':'lib/dominio/normativa/datos/ipc-2012-2026.ts',
                   'symbol':'IPC_ANUAL_DICIEMBRE', 'path':['2013']}
        position = json.loads(subprocess.check_output(['bun',str(ROOT/'tools/procedencia/datos/binding-position.mjs'),str(ROOT/binding['file']),binding['symbol'],json.dumps(binding['path'])]))
        quote = position.pop('quote')
        c['engineExpression'] = {'op':'percent','args':[{'binding':binding}]}
        key = f.encode(binding).decode().strip()
        scope = {k:r['tables'][0][k] for k in ('code','year','territory')}
        scope.update({k:c[k] for k in ('row','column','subject','conditions')})
        r['semantics'] = {key:{'unit':'proportion','sourceSha256':f.digest((ROOT/binding['file']).read_bytes()),'quote':quote,'position':position,'targets':[scope]}}
        mapping = json.loads(lot.mapping.read_bytes())
        mapping[0]['year'] = 2013
        mapping[0]['cells'][0].update(subject=c['subject'],conditions=c['conditions'],expression=c['engineExpression'])
        lot.mapping.write_bytes(f.encode(mapping))
        self.save(r)
        return r, key

    def save(self, registry):
        self.fixture.registry.write_bytes(f.encode(registry))

    def test_real_cli_rate_conversion_and_replay(self):
        r, _ = self.registry()
        self.fixture.cli(*self.fixture.pins())
        raw = self.fixture.output.read_bytes()
        m = json.loads(raw)
        self.assertEqual(m['cells'], {'difference':1})  # .003 * 100 = .3, not 12
        rows = json.loads(f.Store([self.fixture.cas]).read(m['artifacts']['comparison']))
        self.assertEqual(rows[0]['observed'], '0.300')
        self.assertEqual(m['acceptance'], 'pending')
        saved = self.fixture.root/'saved.json'
        saved.write_bytes(raw)
        self.fixture.cli('--verify', str(saved), mapping=False)
        self.assertEqual(self.fixture.output.read_bytes(), raw)
        changed = copy.deepcopy(m)
        dependencies = json.loads(f.Store([self.fixture.cas]).read(m['artifacts']['dependencias-runtime.json']))
        dependencies['effect'][0]['sha256'] = '0'*64
        changed['artifacts']['dependencias-runtime.json'] = f.put(self.fixture.cas, f.encode(dependencies))
        saved.write_bytes(f.encode(changed))
        self.assertIn('Reconstrucción distinta', self.fixture.cli('--verify', str(saved), mapping=False, success=False).stderr)

    def test_rehashed_registry_transplants_preimage_and_units(self):
        r, key = self.registry()
        for mutate in [lambda x:x['semantics'][key]['position'].update(start=0),
                       lambda x:x['semantics'][key].update(sourceSha256='0'*64),
                       lambda x:x['semantics'][key].update(unit='invented'),
                       lambda x:x['tables'][0].update(year=2024),
                       lambda x:x['tables'][0].update(territory='other'),
                       lambda x:x['tables'][0]['cells'][0].update(subject='other'),
                       lambda x:x['tables'][0]['cells'][0].update(conditions='monthly'),
                       lambda x:x['tables'][0]['cells'][0].update(engineExpression={'unit':'EUR'}),
                       lambda x:x['tables'][0]['cells'][0]['engineExpression']['args'][0]['binding'].update(path=['2014'])]:
            changed = copy.deepcopy(r)
            mutate(changed)
            self.save(changed)
            self.fixture.cli(*self.fixture.pins(), success=False)

    def test_foreign_column_and_case_rejected(self):
        r, _ = self.registry()
        for mutate in [lambda x:x['tables'][0]['cells'][0]['unitEvidence'].update(bbox=[300,15,500,35]),
                       lambda x:x['tables'][0]['cells'][0]['unitEvidence'].update(literal='tasa (%)')]:
            changed = copy.deepcopy(r)
            mutate(changed)
            self.save(changed)
            self.fixture.cli(*self.fixture.pins(),success=False)

    def test_same_header_in_foreign_column_is_not_evidence(self):
        r, _ = self.registry()
        doc = f.pymupdf.open()
        page = doc.new_page()
        page.insert_text((20,30), 'Tasa (%)')
        page.insert_text((220,30), 'Tasa (%)')
        page.insert_text((20,65), '12')
        ref = f.put(self.fixture.cas,doc.tobytes(),'application/pdf')
        doc.close()
        ref = {k:ref[k] for k in ('sha256','size')}
        r['tables'][0]['document'] = ref
        r['tables'][0]['cells'][0]['unitEvidence']['bbox'] = [215,15,280,35]
        mapping = json.loads(self.fixture.mapping.read_bytes())
        mapping[0]['document'] = ref
        self.fixture.mapping.write_bytes(f.encode(mapping))
        self.save(r)
        result = self.fixture.cli(*self.fixture.pins(),success=False)
        self.assertIn('Cabecera ajena',result.stderr)

    def test_independent_census_scope_cannot_be_redeclared(self):
        binding = {'file':'synthetic.ts','symbol':'RATE_2013','path':['andalucia','rate']}
        expression = {'binding':binding}
        key = f.encode(binding).decode().strip()
        items = [{'layer':'effective','source':{'file':'synthetic.ts'},'symbol':'RATE_2013',
                  'path':'["andalucia", "rate"]','value':'.12','years':[2013],
                  'territories':['andalucia'],'unit':'proporción por uno'}]
        semantics = {key:{'unit':'proportion'}}
        f.validate_engine_scope(expression,items,{'year':2013,'territory':'andalucia'},semantics)
        for table in [{'year':2014,'territory':'andalucia'}, {'year':2013,'territory':'madrid'}]:
            with self.assertRaises(ValueError):
                f.validate_engine_scope(expression,items,table,semantics)
        semantics[key]['unit'] = 'percent'
        with self.assertRaisesRegex(ValueError,'Unidad declarada'):
            f.validate_engine_scope(expression,items,{'year':2013,'territory':'andalucia'},semantics)

    def test_header_unit_cannot_be_invented_by_rehashing_registry(self):
        r, _ = self.registry()
        c = r['tables'][0]['cells'][0]
        c['unit'] = c['unitEvidence']['unit'] = 'EUR'
        mapping = json.loads(self.fixture.mapping.read_bytes())
        mapping[0]['cells'][0]['unit'] = 'EUR'
        self.fixture.mapping.write_bytes(f.encode(mapping))
        self.save(r)
        self.assertIn('Expresión literal de unidad',self.fixture.cli(*self.fixture.pins(),success=False).stderr)

    def test_retired_preimage_cannot_become_live_evidence(self):
        registry, key = self.registry()
        registry['retirements'] = [{'previousBinding':json.loads(key),
                                    'previousSourceSha256':registry['semantics'][key]['sourceSha256'],
                                    'successor':None,'reason':'Synthetic retirement, no automatic successor.'}]
        self.save(registry)
        self.fixture.cli(*self.fixture.pins(),success=False)

    def test_explicit_runtime_is_inherited_by_nested_bun(self):
        root = self.fixture.root/'runtime'
        for name in ['effect','decimal.js','typescript']:
            folder = root/'node_modules'/name
            folder.mkdir(parents=True)
            (folder/'package.json').write_text(json.dumps({'name':name,'type':'module','exports':'./index.js'}))
            (folder/'index.js').write_text('export const marker = "private-fixture"')
        config = self.fixture.root/'runtime-config.json'
        config.write_bytes(subprocess.check_output(['bun','--no-install',str(ROOT/'tools/procedencia/datos/runtime-resolver.mjs'),str(root)]))
        code = """import {marker} from "effect"; import {spawnSync} from "node:child_process"; const child = spawnSync("bun",["-e",'import {marker} from "effect"; console.log(marker)'],{encoding:"utf8"}); if(child.status) throw Error(child.stderr); console.log(marker,child.stdout.trim())"""
        result = subprocess.run(['bun','-e',code],capture_output=True,text=True,
                                env={**os.environ,'BUN_OPTIONS':'--no-install --tsconfig-override '+str(config),'BUN_RUNTIME_TRANSPILER_CACHE_PATH':'0'})
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertEqual(result.stdout.strip(),'private-fixture private-fixture')

    def test_exact_variants_no_general_cleanup(self):
        self.assertEqual(f.declared_number('en adelante',{'unit':'EUR','literalVariant':{'literal':'en adelante','kind':'open'}}),'Infinity')
        self.assertEqual(f.declared_number('9,50%',{'unit':'percent','literalVariant':{'literal':'9,50%','kind':'percent-suffix'}}),'9.50')
        for literal in ['66. 593,00', '+ 1', '−1', '29,50.', '53.407,20,00']:
            with self.assertRaises(ValueError):
                f.number(literal,'EUR')
        with self.assertRaises(ValueError):
            f.declared_number('En adelante',{'unit':'EUR','literalVariant':{'literal':'en adelante','kind':'open'}})


if __name__ == '__main__':
    unittest.main()
