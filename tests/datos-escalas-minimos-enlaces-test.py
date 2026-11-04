"""Fixtures públicos autónomos: no leen CAS ni dependencias de entregas previas."""
from pathlib import Path
import tempfile
import unittest
import sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools/procedencia/datos/lotes/escalas-minimos-2012-2018'))
import enlaces as e
from aliases import component
from scope_sections import scope_before
from selectores_minimos import statutory, inherits_default
f=e.flujo


class Correspondence(unittest.TestCase):
    def test_omission_transplant_year_territory_and_unit(self):
        table={'code':'public-fixture','year':2020,'territory':'ceuta','document':{'sha256':'a'*64,'size':1},'page':1,
               'cells':[{'row':'child','column':'increment','bbox':[1,1,2,2],'unit':'EUR'}]}
        from copy import deepcopy
        for mutate in (lambda t:t['cells'].clear(),lambda t:t.update(year=2021),lambda t:t.update(territory='melilla'),lambda t:t['cells'][0].update(unit='percent'),lambda t:t['cells'][0].update(row='parent')):
            changed=deepcopy(table);mutate(changed)
            with self.assertRaises(ValueError):f.validate_obligations([changed],[table])

    def test_final_override_cannot_inherit_base_default(self):
        source='madrid: MINIMOS_ESTATALES_2014,\n'
        self.assertTrue(inherits_default(source,'madrid',2014))
        # An equal numeric amount in the override would still have another scope.
        self.assertFalse(inherits_default(source+'madrid: MINIMOS_MADRID_2014,\n','madrid',2014))
        self.assertFalse(inherits_default(source,'madrid',2013))

    def test_alias_uses_final_reference_and_territory(self):
        binding={'file':'minimos-autonomicos-2020.ts','symbol':'MINIMOS_AUTONOMICOS_IRPF_2020','path':['valor','madrid','contribuyente','general']}
        source='madrid: MINIMOS_ESTATALES_2020,\nmadrid: MINIMOS_MADRID_2020,\n'
        target,quote=component(source,binding)
        self.assertEqual(target['symbol'],'MINIMOS_MADRID_2020')
        self.assertEqual(target['path'],['contribuyente','general'])
        self.assertIn('MINIMOS_MADRID',quote)
        binding['path'][1]='ceuta'
        self.assertIsNone(component(source,binding))

    def test_scope_heading_can_precede_table_on_previous_page(self):
        doc=f.pymupdf.open();p=doc.new_page();p.insert_text((40,750),'Comunidad Autonoma de Extremadura')
        p=doc.new_page();p.insert_text((40,100),'Base liquidable');p.insert_text((40,500),'Comunidad de Madrid')
        words={i+1:doc[i].get_text('words') for i in range(2)}
        names={'extremadura':'extremadura','madrid':'madrid'}
        self.assertEqual(scope_before(words,2,150,names)[0],'extremadura')
        self.assertEqual(scope_before(words,2,550,names)[0],'madrid')

    def test_duplicate_occurrences_rejected(self):
        leaf={'file':'fixture','symbol':'amount','path':['subject'],'years':[2020],'territories':['ceuta']}
        with self.assertRaises(ValueError):e.balance([leaf,leaf],{'comparison':[]},[])

    def test_selector_gap_is_not_external_absence(self):
        leaf={'file':'fixture','symbol':'amount','path':['subject'],'years':[2020],'territories':['melilla']}
        row=e.balance([leaf],{'comparison':[]},[])['occurrences'][0]
        self.assertEqual(row['reason'],'selector-not-implemented')
        self.assertEqual(row['availability'],'not-assessed')

    def test_units_pending_do_not_become_matches(self):
        with tempfile.TemporaryDirectory() as temporary:
            root=Path(temporary);doc=f.pymupdf.open();page=doc.new_page()
            page.insert_text((50,50),'EUR candidate heading');page.insert_text((50,100),'1.234,56')
            ref=f.put(root,doc.tobytes());t={'code':'fixture','year':2020,'territory':'ceuta','document':ref,'page':1,'cells':[{'row':'0','column':'minimum','bbox':[49,86,110,104],'unit':'EUR','unitEvidence':{'bbox':[49,36,200,54],'literal':'EUR candidate heading','unit':'EUR'},'expression':None}]}
            registry={'tables':[t],'semantics':{}}
            result=e.execute(ROOT,[t],registry,[],e.VerifiedStore([root]),{})
            self.assertEqual(result['counts'],{'not-verifiable':1})
            self.assertEqual(len(result['unitCorrespondenceProposals']),1)
            self.assertEqual(result['comparison'][0]['expected'],'1234.56')

    def test_wrong_header_preimage_rejects_entire_table(self):
        with tempfile.TemporaryDirectory() as temporary:
            root=Path(temporary);doc=f.pymupdf.open();page=doc.new_page()
            page.insert_text((50,50),'Other subject');page.insert_text((50,100),'12')
            ref=f.put(root,doc.tobytes());t={'code':'fixture','year':2020,'territory':'ceuta','document':ref,'page':1,'cells':[{'row':'0','column':'minimum','bbox':[49,86,110,104],'unit':'EUR','unitEvidence':{'bbox':[49,36,200,54],'literal':'Base liquidable hasta euros','unit':'EUR'},'expression':None}]}
            result=e.execute(ROOT,[t],{'tables':[t],'semantics':{}},[],e.VerifiedStore([root]),{})
            self.assertEqual(result['comparison'],[])
            self.assertEqual(result['extraction'],[])
            self.assertEqual(result['unitCorrespondenceProposals'],[])
            self.assertIn('no reproducible',result['errors'][0]['error'])

    def test_truncated_table_has_no_partial_results(self):
        with tempfile.TemporaryDirectory() as temporary:
            root=Path(temporary);doc=f.pymupdf.open();page=doc.new_page();page.insert_text((50,100),'12');page.insert_text((50,150),'broken')
            ref=f.put(root,doc.tobytes());t={'code':'fixture','year':2020,'territory':'ceuta','document':ref,'page':1,'cells':[{'row':str(i),'column':'minimum','bbox':[49,y-14,110,y+4],'unit':'EUR','unitEvidence':None,'expression':None} for i,y in enumerate([100,150])]}
            result=e.execute(ROOT,[t],{'tables':[t],'semantics':{}},[],e.VerifiedStore([root]),{})
            self.assertEqual(result['comparison'],[]);self.assertEqual(result['extraction'],[]);self.assertEqual(result['errors'][0]['cells'],2)

    def test_statutory_subjects_thresholds_and_ordinals(self):
        paragraphs = [
            'Artículo 57. Mínimo del contribuyente. General 101 euros. Mayor de 65 años 102 euros. Mayor de 75 años 103 euros.',
            'Artículo 58. Mínimo por descendientes. rentas anuales superiores a 999 euros. 201 euros anuales por el primero. 202 euros anuales por el segundo. 203 euros anuales por el tercero. 204 euros anuales por el cuarto y siguientes. Menor de tres años 205 euros.',
            'Artículo 59. Mínimo por ascendientes. Mayor de 65 años 301 euros. rentas anuales superiores a 998 euros. Mayor de 75 años 302 euros.',
            'Artículo 60. Mínimo por discapacidad. Contribuyente 401 euros y 402 euros. gastos de asistencia 403 euros. Ascendientes o descendientes 501 euros y 502 euros. gastos de asistencia 503 euros.'
        ]
        doc=f.pymupdf.open();page=doc.new_page()
        page.insert_textbox(f.pymupdf.Rect(30,30,560,800),'\n'.join(paragraphs),fontsize=10)
        selected=statutory(doc,[1])
        self.assertEqual(len(selected),19)
        by_path={tuple(c['path']):c for c in selected}
        for path,expected in [(('contribuyente','adicionalMayor75'),'103'),(('descendientes','cuartoYSiguientes'),'204'),(('ascendientes','mayor65OConDiscapacidad'),'301'),(('discapacidad','ascendiente','gastosAsistencia'),'503'),(('discapacidad','contribuyente','grado65OMas'),'402')]:
            c=by_path[path]
            words=[w[4] for w in page.get_text('words') if f.pymupdf.Rect(c['bbox']).contains(f.pymupdf.Rect(w[:4]))]
            self.assertEqual(words,[expected])
        bad=f.pymupdf.open();p=bad.new_page();p.insert_textbox(f.pymupdf.Rect(30,30,560,800),'\n'.join(paragraphs).replace('por el segundo','por el tercero'),fontsize=10)
        with self.assertRaisesRegex(ValueError,'ordinal'):statutory(bad,[1])
        wrong=f.pymupdf.open();p=wrong.new_page();p.insert_textbox(f.pymupdf.Rect(30,30,560,800),'\n'.join(paragraphs).replace('Mínimo del contribuyente','Mínimo por descendientes'),fontsize=10)
        with self.assertRaisesRegex(ValueError,'heading'):statutory(wrong,[1])

    def test_boundaries_stay_literal(self):
        self.assertEqual(f.number('12.450,01','EUR'),'12450.01')
        for text in ('12.450,01%','−12.450,01','en adelante'):
            with self.assertRaises(ValueError):f.number(text,'EUR')


if __name__=='__main__':unittest.main()
