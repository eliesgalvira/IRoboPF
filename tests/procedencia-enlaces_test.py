"""Ataques al puente documental con un original y valor independientes reales.

Estos tests del auxiliar no sustituyen la reconstrucción Node ejecutada en CI.
Las atestaciones sintéticas solo existen en directorios temporales de prueba.
"""
import copy
import gzip
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools/procedencia'))
from enlaces import sha, verify_evidence


ROOT = Path(__file__).resolve().parents[1]
REGISTRY = 'docs/procedencia/enlaces/registro.json'
PAYLOAD = 'docs/procedencia/enlaces/madrid-2020-limite.json'


class BindingTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        archive = dict(json.loads(gzip.decompress((ROOT / 'docs/procedencia/inventario-datos.json.gz').read_bytes())))
        payload = json.loads((ROOT / PAYLOAD).read_text())
        cls.real_item = next(i for name, text in archive.items() if name.startswith('inventario-pagina-')
                             for i in json.loads(text) if i['id'] == payload['itemId'])

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.payload = json.loads((ROOT / PAYLOAD).read_text())
        paths = [REGISTRY, PAYLOAD, 'docs/procedencia/enlaces/revisores.json',
                 self.payload['document']['path'], self.payload['citation']['path'],
                 self.payload['legalReview']['decisions']['path']]
        document = json.loads((ROOT / self.payload['document']['path']).read_text())
        citation = json.loads((ROOT / self.payload['citation']['path']).read_text())
        paths += ['docs/procedencia/corpus/fixtures/sha256/' + h
                  for h in (document['sha256'], citation['facsimile']['sha256'])]
        for name in paths:
            target = self.root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, target)
        self.context = {**self.payload['inventory'], 'items': [copy.deepcopy(self.real_item)]}
        # El fixture se mantiene candidato aunque posteriormente se apruebe en repo.
        registry = json.loads((self.root / REGISTRY).read_text())
        registry['entries'][0]['attestation'] = None
        self.write(REGISTRY, registry)
        self.refresh_registry()

    def write(self, path, value):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
        return {'path': path, 'sha256': sha(target.read_bytes())}

    def refresh_registry(self):
        self.context['registrySha256'] = sha((self.root / REGISTRY).read_bytes())

    def change_payload(self):
        ref = self.write(PAYLOAD, self.payload)
        registry = json.loads((self.root / REGISTRY).read_text())
        registry['entries'][0]['payload'] = ref
        self.write(REGISTRY, registry)
        self.refresh_registry()

    def attest(self):
        task = 'node:fixture-reviewer-independent'
        directory = 'docs/procedencia/revisiones/fixture'
        delegates = self.write('docs/procedencia/fixture-delegations.json', [{'taskId': task, 'key': 'revision-fixture'}])
        self.write('docs/procedencia/enlaces/revisores.json', {'schemaVersion': 1, 'reviewers': [
            {'taskId': task, 'delegationRegistry': delegates, 'reportDirectory': directory}]})
        report = self.write(directory + '/report.json', {'testOnly': True, 'decision': 'accepted-limited'})
        registry = json.loads((self.root / REGISTRY).read_text())
        self.attestation = {'schemaVersion': 1, 'payloadSha256': registry['entries'][0]['payload']['sha256'],
                            'inventory': self.payload['inventory'], 'scope': self.payload['scope'],
                            'decision': 'accepted-limited', 'reviewTaskId': task, 'report': report}
        self.attestation_path = directory + '/attestation.json'
        self.change_attestation()

    def change_attestation(self):
        ref = self.write(self.attestation_path, self.attestation)
        registry = json.loads((self.root / REGISTRY).read_text())
        registry['entries'][0]['attestation'] = ref
        self.write(REGISTRY, registry)
        self.refresh_registry()

    def test_real_madrid_binding_is_not_self_accepted(self):
        result = verify_evidence(self.root, self.context)['evidence'][0]
        self.assertEqual(result['value'], '53407.2')
        self.assertEqual(result['numericBinding'], 'verified')
        self.assertEqual(result['bindingReview'], 'pending')
        self.assertFalse(result['completeRuleAcceptance'])

    def test_changed_engine_value_cannot_pass_by_repeating_citation_value(self):
        self.context['items'][0]['value'] = '53407.29'
        with self.assertRaisesRegex(ValueError, 'valor efectivo'):
            verify_evidence(self.root, self.context)

    def test_obsolete_snapshot_is_rejected(self):
        self.context['manifestSha256'] = '0' * 64
        with self.assertRaisesRegex(ValueError, 'snapshot'):
            verify_evidence(self.root, self.context)

    def test_missing_or_duplicate_item_is_rejected(self):
        for items in ([], self.context['items'] * 2):
            with self.subTest(count=len(items)), self.assertRaises(ValueError):
                verify_evidence(self.root, {**self.context, 'items': items})

    def test_duplicate_json_keys_are_rejected(self):
        path = self.root / REGISTRY
        path.write_text(path.read_text().replace('"schemaVersion": 1', '"schemaVersion": 2, "schemaVersion": 1'))
        self.refresh_registry()
        with self.assertRaisesRegex(ValueError, 'Clave JSON duplicada'):
            verify_evidence(self.root, self.context)

    def test_other_occurrence_is_rejected(self):
        self.payload['source']['tablePath'][-1] = '1'
        self.change_payload()
        with self.assertRaisesRegex(ValueError, 'ocurrencia'):
            verify_evidence(self.root, self.context)

    def test_unreviewed_unit_conversion_is_rejected(self):
        self.payload['scope']['unit'] = 'percent'
        self.change_payload()
        with self.assertRaisesRegex(ValueError, 'Unidad'):
            verify_evidence(self.root, self.context)

    def test_quote_tampering_is_rejected(self):
        citation_path = self.payload['citation']['path']
        citation = json.loads((self.root / citation_path).read_text())
        citation['quote'] += ' texto añadido'
        self.payload['citation'] = self.write(citation_path, citation)
        self.change_payload()
        with self.assertRaises(ValueError):
            verify_evidence(self.root, self.context)

    def test_crop_tampering_is_rejected(self):
        citation = json.loads((self.root / self.payload['citation']['path']).read_text())
        crop = self.root / 'docs/procedencia/corpus/fixtures/sha256' / citation['facsimile']['sha256']
        crop.write_bytes(b'PNG sustituido')
        with self.assertRaisesRegex(ValueError, 'Facsímil'):
            verify_evidence(self.root, self.context)

    def test_missing_legal_decision_is_rejected(self):
        self.payload['legalReview']['decisionId'] = 'inexistente'
        self.change_payload()
        with self.assertRaisesRegex(ValueError, 'Decisión'):
            verify_evidence(self.root, self.context)

    def test_paths_cannot_escape_documentary_tree(self):
        self.payload['document']['path'] = 'docs/procedencia/../../package.json'
        self.change_payload()
        with self.assertRaisesRegex(ValueError, 'Ruta'):
            verify_evidence(self.root, self.context)

    def test_registered_test_attestation_has_only_limited_scope(self):
        self.attest()
        result = verify_evidence(self.root, self.context)['evidence'][0]
        self.assertEqual(result['bindingReview'], 'accepted-limited')
        self.assertFalse(result['completeRuleAcceptance'])

    def test_self_review_is_rejected(self):
        self.attest()
        self.attestation['reviewTaskId'] = self.payload['authorTaskId']
        self.change_attestation()
        with self.assertRaisesRegex(ValueError, 'contrarrevisarse'):
            verify_evidence(self.root, self.context)

    def test_unregistered_review_is_rejected(self):
        self.attest()
        self.attestation['reviewTaskId'] = 'node:inventado'
        self.change_attestation()
        with self.assertRaisesRegex(ValueError, 'no registrado'):
            verify_evidence(self.root, self.context)

    def test_attestation_invalidated_by_payload_or_scope_changes(self):
        self.attest()
        self.payload['scope']['year'] = 2021
        self.change_payload()
        with self.assertRaisesRegex(ValueError, 'Atestación'):
            verify_evidence(self.root, self.context)

    def test_report_cannot_be_substituted(self):
        self.attest()
        (self.root / self.attestation['report']['path']).write_text('Sustitución')
        with self.assertRaisesRegex(ValueError, 'Informe independiente'):
            verify_evidence(self.root, self.context)

    def test_public_manifest_must_already_be_sanitized(self):
        path = self.payload['document']['path']
        document = json.loads((self.root / path).read_text())
        document['headers']['set-cookie'] = 'SYNTHETIC-NOT-A-SECRET'
        self.payload['document'] = self.write(path, document)
        self.change_payload()
        with self.assertRaisesRegex(ValueError, 'saneado'):
            verify_evidence(self.root, self.context)

    def test_persistent_documentary_change_during_verification_is_rejected(self):
        import enlaces
        original = enlaces.verify

        def change_after_read(*args, **kwargs):
            result = original(*args, **kwargs)
            path = self.root / PAYLOAD
            path.write_text(path.read_text() + ' ')
            return result

        with patch('enlaces.verify', side_effect=change_after_read):
            with self.assertRaisesRegex(ValueError, 'cambió durante'):
                verify_evidence(self.root, self.context)


if __name__ == '__main__':
    unittest.main()
