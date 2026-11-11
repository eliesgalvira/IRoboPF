"""Oráculo Fraction independiente y pruebas ordinarias de artefactos2024.
Sólo stdlib; no importa ni ejecuta candidato, verificador del padre ni dependencias.
La política contrastada se limita a cinco observaciones Murcia2024 versionadas.
"""
from pathlib import Path
from fractions import Fraction as F
import unittest, json, hashlib, base64, zlib, re

def cent(x):
    x=F(x)*100
    sign=-1 if x<0 else 1
    x=abs(x)
    return sign*F((2*x.numerator+x.denominator)//(2*x.denominator),100)

def scale(base, region=True):
    b=max(F(0),F(base))
    rows=[('0','0','0.095'),('12450','1182.75','0.112'),('20200','2050.75','0.133'),('34000','3886.15','0.179'),('60000','8540.15','0.225')] if region else [
      ('0','0','0.095'),('12450','1182.75','0.12'),('20200','2112.75','0.15'),('35200','4362.75','0.185'),('60000','8950.75','0.225')]
    for floor,q,rate in reversed(rows):
        if b>=F(floor):return F(q)+(b-F(floor))*F(rate)

def origin(gross,ss,cost='10000',aid='0'):
    n=F(gross)-F(ss)
    net=n-min(2000,max(F(0),n))
    if n<=14852:r=F(7302)
    elif n<=F('17673.52'):r=F(7302)-F('1.75')*(n-14852)
    elif n<F('19747.50'):r=F('2364.34')-F('1.14')*(n-F('17673.52'))
    else:r=F(0)
    r=cent(min(max(F(0),net),r));b=max(F(0),net-r)
    q=cent(scale(b))-cent(scale(min(b,F(5550))))
    e=cent(scale(b,False))-cent(scale(min(b,F(5550)),False))
    raw=(F(cost)-F(aid))/2;cap=min(F(7000),raw);g=cent(cap);a=min(g,q)
    return dict(base=b,reduction=r,quota=q,state=e,generated=g,applied=a,balance=g-a,raw=raw,excess=raw-cap,adjustment=g-cap)

def scoped(text):
    stack=[];out={}
    for l in text.splitlines():
        indent=len(l)-len(l.lstrip(' '));m=re.fullmatch(r' *\[([A-Z0-9_]+)\]',l)
        if m:
            while stack and stack[-1][0]>=indent:stack.pop()
            stack.append((indent,m[1]));continue
        while stack and stack[-1][0]>=indent:stack.pop()
        m=re.fullmatch(r' *(\w+)~([123])~([^~\r\n]*)(?:~(?:254|255))?',l)
        if m:out.setdefault((tuple(x[1] for x in stack),m[1]),[]).append((m[2],m[3]))
    return out

def one(fields,key,suffix=()):
    v=fields[(('DECLARACIONES','IRPF2024')+suffix,key)]
    assert len(v)==1 and v[0][0]=='1',(key,v)
    return v[0][1]

class Review(unittest.TestCase):
    def test_five_primary_artifacts_and_fraction(self):
        data=json.loads((Path(__file__).parent.parent/'fixtures/revision-b05-capturas2024.json').read_text())
        self.assertEqual(len(data['rows']),5)
        for row in data['rows']:
            with self.subTest(id=row['id']):
                artifacts={}
                for name,a in row['artifacts'].items():
                    b=base64.b64decode(a['base64'],validate=True)
                    self.assertEqual(hashlib.sha256(b).hexdigest(),a['sha256']);artifacts[name]=b
                self.assertTrue(artifacts['pdf'].startswith(b'%PDF-'))
                dec=zlib.decompressobj();raw=dec.decompress(artifacts['ses'],4*1024*1024)
                self.assertTrue(dec.eof);self.assertFalse(dec.unused_data)
                ses=raw.decode('latin1');pdf=artifacts['pdfText'].decode()
                for attr,val in [('EjModelo','2024'),('VersionReglas','N000086471'),('VersionModelo','0.09'),('CodModelo','100')]:
                    self.assertIn(attr+'="'+val+'"',ses.split('?>')[0])
                f=scoped(ses)
                self.assertEqual(one(f,'SPNIF'),'90000000B');self.assertEqual(one(f,'ZCCAD'),'13');self.assertEqual(one(f,'ZFNAC_D'),'01/01/1985')
                self.assertEqual(one(f,'TITULAR'),'DECLARANTE');self.assertEqual(f[(('DECLARACIONES',),'INDV')],[('1','true')])
                self.assertEqual(set(re.findall(r'Ejercicio\s+(20\d\d)\b',pdf)),{'2024'});self.assertRegex(pdf,r'\b90000000B\b')
                i=row['input'];self.assertEqual(F(one(f,'IDII',('ATRABAJO','DLGTRABAJO'))),F(i['gross']))
                self.assertEqual(F(one(f,'GSS',('ATRABAJO','DLGTRABAJO'))),F(i['ss']))
                self.assertEqual(F(one(f,'IMP1MU4',('MURCIA',))),F(i['cost']))
                o=origin(i['gross'],i['ss'],i['cost'])
                for box,key,expected,suffix in [('0505','BLGGRAV',o['base'],()),('0533','CIGAUT',o['quota'],()),('0532','CIGEST',o['state'],()),('1055','MU4',o['applied'],('MURCIA',)),('2038','CANTMU4',o['generated'],('MURCIA',)),('2039','PDTEMU4',o['balance'],('MURCIA',))]:
                    self.assertEqual(F(one(f,key,suffix)),expected)
                    self.assertEqual(F(row['observed'][box]),expected)
                    amounts=re.findall(r'(-?[\d.]+,\d\d)\s+'+box+r'\b',pdf)
                    self.assertTrue(amounts)
                    self.assertTrue(all(F(v.replace('.','').replace(',','.'))==expected for v in amounts))
    def test_generation_tie_and_nonnegative_excess(self):
        o=origin('30000','2000','10000.01')
        self.assertEqual(o['generated'],F('5000.01'));self.assertEqual(o['balance'],F('2705.11'))
        self.assertEqual(o['excess'],0);self.assertEqual(o['adjustment'],F('0.005'))
    def test_caps_around14000(self):
        for cost in ['13999.99','14000','14000.01','20000']:
            o=origin('30000','2000',cost)
            self.assertGreaterEqual(o['excess'],0);self.assertLessEqual(o['generated'],7000)
            self.assertEqual(o['raw']-o['excess']+o['adjustment'],o['generated'])
    def test_conservation_residual_and_term(self):
        for g in ['17000','18000','20000','30000']:
            o=origin(g,'1000')
            for q25 in [F(0),F(1000),F(10000)]:
                available=max(0,q25-60);a25=min(available,o['balance'])
                self.assertEqual(o['applied']+a25+(o['balance']-a25),o['generated'])
        self.assertEqual(2024+2,2026)
    def test_admissible_aid_net(self):
        o=origin('30000','2000',aid='2000');self.assertEqual(o['balance'],F('1705.10'))
        self.assertEqual(origin('30000','2000',aid='10000')['generated'],0)
    def test_prior_expectations_discriminated(self):
        self.assertEqual(cent(F('4700.085')),F('4700.09'))
        self.assertEqual(origin('17000','1000')['balance'],F('4700.08'))
        self.assertEqual(origin('20000','1000')['base'],F('16147.85'))

if __name__=='__main__':unittest.main()
