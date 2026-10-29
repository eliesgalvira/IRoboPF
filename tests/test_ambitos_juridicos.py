"""Casos técnicos sintéticos; no registran revisores ni aceptan datos reales."""
import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools/procedencia'))
import enlaces


class Ambitos(unittest.TestCase):
    def test_delegaciones_versionadas(self):
        delegate = {'taskId': 'synthetic-review', 'key': 'revision-synthetic', 'role': 'review'}
        for registry in [[delegate], {'version': 1, 'delegates': [delegate]},
                         {'version': 1, 'delegate': delegate}]:
            self.assertEqual(enlaces.delegation_entries(registry), [delegate])

    def test_delegaciones_ambiguas(self):
        delegate = {'taskId': 'synthetic-review', 'key': 'revision-synthetic'}
        for registry in [{'version': 99, 'delegates': [delegate]},
                         {'version': 1, 'delegate': delegate, 'delegates': [delegate]},
                         [delegate, delegate]]:
            with self.assertRaises(ValueError):
                enlaces.delegation_entries(registry)

    def test_periodo_y_contexto(self):
        scope = {'year': 2022, 'territory': 'madrid', 'component': 'autonomico',
                 'taxBase': 'general', 'period': 'madrid-2022', 'predicate': 'nominal-cell',
                 'externalConditions': ['residence-unverified', 'eligibility-unverified']}
        context = {'year': 2022, 'territory': 'madrid', 'component': 'autonomico',
                   'taxBase': 'general', 'periodStart': '2022-01-01',
                   'accrual': '2022-06-20', 'death': '2022-06-20',
                   'externalConditions': scope['externalConditions']}
        enlaces.evaluate_scope(scope, context)
        for field, value in [('year', 2025), ('territory', 'catalunya'),
                             ('component', 'estatal'), ('taxBase', 'ahorro'),
                             ('death', None), ('accrual', '2022-02-30')]:
            bad = copy.deepcopy(context)
            bad[field] = value
            with self.assertRaises(ValueError):
                enlaces.evaluate_scope(scope, bad)
        scope['period'] = 'ordinary-no-death'
        with self.assertRaises(ValueError):
            enlaces.evaluate_scope(scope, context)

    def test_murcia_estricta(self):
        scope = {'year': 2022, 'territory': 'murcia', 'component': 'autonomico',
                 'taxBase': 'general', 'period': 'ordinary-no-death',
                 'predicate': 'murcia-blg-gt-60000', 'externalConditions': ['residence-unverified', 'eligibility-unverified']}
        context = {'year': 2022, 'territory': 'murcia', 'component': 'autonomico',
                   'taxBase': 'general', 'periodStart': '2022-01-01',
                   'accrual': '2022-12-31', 'death': None, 'externalConditions': ['residence-unverified', 'eligibility-unverified'],
                   'generalBase': '60000.01'}
        enlaces.evaluate_scope(scope, context)
        for amount in ['59999.99', '60000', 'NaN', 'Infinity', None]:
            context['generalBase'] = amount
            with self.assertRaises(ValueError):
                enlaces.evaluate_scope(scope, context)



class AtestacionSintetica(unittest.TestCase):
    def test_aprobacion_exacta_y_ataques(self):
        import json
        h = 'a' * 64
        payload = {'schemaVersion': 2, 'authorTaskId': 'synthetic-author',
                   'inventory': {'manifestSha256': h, 'artifactSha256': h},
                   'scope': {'year': 2022, 'territory': 'madrid', 'unit': 'EUR',
                             'claim': 'synthetic', 'conditions': ['synthetic'], 'completeRule': False}}
        report = b'synthetic independent report, not a production approval'
        report_ref = {'path': 'docs/procedencia/revisiones/synthetic/report.txt', 'sha256': enlaces.sha(report)}
        attestation = {'schemaVersion': 1, 'payloadSha256': h, 'inventory': payload['inventory'],
                       'scope': payload['scope'], 'decision': 'accepted-limited',
                       'reviewTaskId': 'synthetic-review', 'report': report_ref}
        att_ref = {'path': 'docs/procedencia/revisiones/synthetic/attestation.json', 'sha256': 'b' * 64}
        delegation_ref = {'path': 'docs/procedencia/synthetic-delegation.json', 'sha256': 'c' * 64}
        approval = {'payloadSha256': h, 'attestation': att_ref}
        registration = {'schemaVersion': 2, 'reviewers': [{'taskId': 'synthetic-review',
                        'delegationRegistry': delegation_ref, 'reportDirectory': 'docs/procedencia/revisiones/synthetic',
                        'approvals': [approval]}]}
        delegates = {'version': 1, 'delegates': [{'taskId': 'synthetic-review', 'key': 'revision-synthetic', 'role': 'review'}]}

        class Reader:
            def read_ref(self, ref):
                return attestation if ref == att_ref else delegates

            def read_bytes(self, path):
                return report if path == report_ref['path'] else json.dumps(registration).encode()

        reader = Reader()
        self.assertEqual(enlaces.verify_attestation(reader, att_ref, payload, h), 'accepted-limited')
        for key, value in [('authorTaskId', 'synthetic-review'), ('schemaVersion', 1),
                           ('inventory', {'manifestSha256': 'd' * 64, 'artifactSha256': h})]:
            altered = copy.deepcopy(payload)
            altered[key] = value
            with self.assertRaises(ValueError):
                enlaces.verify_attestation(reader, att_ref, altered, h)
        approval['attestation'] = {**att_ref, 'sha256': 'e' * 64}
        with self.assertRaises(ValueError):
            enlaces.verify_attestation(reader, att_ref, payload, h)


class Candidatos(unittest.TestCase):
    def test_todos_los_ambitos_y_ampliaciones(self):
        import json
        root = Path(__file__).resolve().parents[1]
        folder = root / 'docs/procedencia/implementaciones/ambitos-juridicos'
        rows = json.loads((folder / 'correspondencias.json').read_bytes())['rows']
        self.assertEqual(len(rows), 264)
        reader = enlaces.DocumentaryReadSet(root)
        for row in rows:
            payload = reader.read_ref(row['candidate'])
            scope = reader.read_ref(payload['executableScope'])
            item = {'id': scope['itemId'], 'value': scope['value']}
            enlaces.verify_executable_scope(reader, payload, item)
            for key, value in [('year', 2026), ('territory', 'foral'), ('unit', 'percent'),
                               ('period', 'all-periods'), ('predicate', 'inclusive-60000')]:
                altered = copy.deepcopy(scope)
                altered[key] = value

                class AlteredReader:
                    def read_ref(self, ref):
                        return altered if ref == payload['executableScope'] else reader.read_ref(ref)

                with self.assertRaises((ValueError, enlaces.ValidationError)):
                    enlaces.verify_executable_scope(AlteredReader(), payload, item)
            # Mutantes con vocabulario válido y payload coherentemente rehecho:
            # deben fallar por el dictamen original, no solo por el schema.
            for change in ('column', 'conditions', 'year'):
                altered = copy.deepcopy(scope)
                altered_payload = copy.deepcopy(payload)
                if change == 'column':
                    column = 'cuota' if scope['source']['tablePath'][1] == 'baseInferior' else 'baseInferior'
                    altered['source']['tablePath'][1] = column
                    altered_payload['source'] = altered['source']
                elif change == 'conditions':
                    altered['editorialConditions'] = scope['editorialConditions'][:-1]
                    altered_payload['scope']['conditions'] = altered['editorialConditions']
                else:
                    altered['year'] = scope['year'] + 1
                    altered_payload['scope']['year'] = altered['year']
                with self.assertRaises(ValueError):
                    enlaces.verify_executable_scope(AlteredReader(), altered_payload, item)
        reader.finish()

if __name__ == '__main__':
    unittest.main()
