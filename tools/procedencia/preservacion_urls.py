"""Endpoints documentales publicables; lo no clasificado queda excluido."""
import re
from urllib.parse import parse_qsl, unquote, urlsplit

# Solo espacios documentales, no expedientes, búsquedas libres ni sesiones.
PATHS = {
    'www.boe.es': [
        r'/boe/dias/\d{4}/\d{2}/\d{2}/pdfs/(?:BOE-[A-Z]-\d{4}-\d+|[AB]\d+-\d+)\.pdf',
        r'/boe_(?:catalan|gallego|euskera|valenciano)/dias/\d{4}/\d{2}/\d{2}/pdfs/(?:BOE-[A-Z]-\d{4}-\d+(?:-[CGEV])?|[AB]\d+-\d+)\.pdf',
        r'/ccaa/(?:boa|boc|bocl|bocm|boct|boja|bopa|borm|docm|doe|dog|dogc|dogv)/\d{4}/\d{3,5}/[a-z]\d+-\d+\.pdf',
        r'/eli/es(?:-[a-z]{2})?/(?:l|lo|rd|rdl|rdlg|dlg|dl|d|o|res)/\d{4}/\d{2}/\d{2}/(?:\d+|\(\d+\)|(?:ess|tas|tin|tms|pcm|pjc)\d+)(?:/(?:dof/(?:spa|cat|glg|eus)(?:/pdf)?|con(?:/\d{8})?|corrigendum/\d{8}(?:/dof/spa/pdf)?))?/?',
        r'/buscar/pdf/\d{4}/BOE-[A-Z]-\d{4}-\d+-consolidado\.pdf',
        r'/boe/dias/\d{4}/\d{2}/\d{2}/index\.php',
        r'/datos/pdfs/BOE/\d{4}/\d{3}/[A-Z]\d+-\d+\.pdf',
    ],
    'bocyl.jcyl.es': [r'/boletines/\d{4}/\d{2}/\d{2}/pdf/BOCYL-[A-Z]-\d+-\d+\.pdf', r'/eli/es-cl/(?:dgl|dlg)/\d{4}/\d{2}/\d{2}/\d+/'],
    'dogv.gva.es': [r'/datos/\d{4}/\d{2}/\d{2}/pdf/\d{4}_\d+\.pdf'],
    'www.ine.es': [r'/daco/daco42/daco421/ipc\d{4}\.pdf', r'/daco/daco42/etcl/etcl\d{4}\.pdf', r'/dyngs/Prensa/IPC\d{4}\.(?:htm|pdf)', r'/jaxiT3/files/t/csv_bdsc/\d+\.csv', r'/metodologia/t25/metodologia_IPC_base_\d{4}\.pdf', r'/prensa/ipc_tabla\.htm'],
    'www.bocm.es': [r'/boletin/CM_Orden_BOCM/\d{4}/\d{2}/\d{2}/BOCM-\d{8}-\d+\.PDF'],
    'www.gobiernodecanarias.org': [r'/boc/\d{4}/\d{3}/(?:\d{3}\.html|boc-\d{4}-\d{3}-\d{3}\.pdf)'],
    'www3.gobiernodecanarias.org': [r'/libroazul/pdf/\d+\.pdf'],
    'doe.juntaex.es': [r'/pdfs/doe/\d{4}/\d+[a-z]/\d+\.pdf', r'/aviso/avisolegal\.pdf'],
    'www.cortsvalencianes.es': [r'/sites/default/files/migrated/resolutions/doc/\d+_\d+\.pdf'],
}


def public_url(value):
    if not isinstance(value, str) or re.search(r'[\x00-\x20\x7f]', value):
        return None
    try:
        u = urlsplit(value)
        if u.scheme != 'https' or not u.hostname or u.username or u.password or u.fragment or u.port not in (None, 443):
            return None
        pairs = parse_qsl(u.query, keep_blank_values=True, strict_parsing=True)
        query = dict(pairs)
        if len(query) != len(pairs):
            return None
    except ValueError:
        return None
    path = unquote(u.path)
    if '..' in path.split('/') or '\\' in path or re.search(r'[\x00-\x1f\x7f]', path):
        return None
    if u.hostname == 'www.boe.es' and path in ('/buscar/act.php', '/buscar/doc.php', '/diario_boe/txt.php'):
        query_patterns = {'id': r'(?:BOE|BOA|BOC|BOCL|BOCM|BOCT|BOJA|BOPA|BORM|DOE|DOG|DOGV)-[A-Za-z]-\d{4}-\d+', 'p': r'\d{8}', 'tn': r'[0-9]', 'lang': r'(?:es|ca|gl|eu)'}
        return value if 'id' in query and all(k in query_patterns and re.fullmatch(query_patterns[k], v) for k, v in query.items()) else None
    if u.hostname == 'www.borm.es' and re.fullmatch(r'/services/anuncio/ano/\d{4}/numero/\d+/pdf', path):
        return value if set(query) <= {'id'} and all(re.fullmatch(r'\d+', v) for v in query.values()) else None
    if query:
        return None
    if u.hostname in ('sede.agenciatributaria.gob.es', 'www3.agenciatributaria.gob.es'):
        patterns = [
            r'/static_files/Sede/Programas_ayuda/Retenciones/\d{4}/(?:ALGORITMO|Algoritmo|Nota_informativa)[A-Za-z0-9_ .-]*\.pdf',
            r'/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/(?:IRPF-)?\d{4}(?:-Deducciones-autonomicas)?/Manual[A-Za-z0-9_]*\.pdf',
            r'/Sede/ayuda/(?:descarga-programas-ayuda/retenciones|manuales-videos-folletos)/(?:[a-z0-9_-]+/)*[a-z0-9_-]+\.html',
            r'/Sede/(?:Retenciones\.shtml|manuales-practicos\.html)',
            r'/Sede/ciudadanos-familias-personas-discapacidad/minimo-personal-familiar/minimos-ascendientes\.html',
        ]
    elif u.hostname == 'www.hacienda.gob.es':
        # Títulos de cuatro publicaciones examinadas, no rutas libres del portal.
        patterns = [r'/(?:Documentacion/Publico/PortalVarios|SGFAL)/FinanciacionTerritorial/[Aa]utonomica/[Cc]apítulo [Ii][Vv] [Tt]ributación [Aa]utonómica 201[23]\.pdf', r'/SGT/SUSCRIPCIONES_REPOSITORIO/TEXTOS_LEGALES/SEPARATA 7 2013 IMPUESTO SOBRE LA RENTA DE LAS PERSONAS FÍSICAS EN LINEA\.pdf']
    else:
        patterns = PATHS.get(u.hostname, [])
    return value if any(re.fullmatch(pattern, path) for pattern in patterns) else None
