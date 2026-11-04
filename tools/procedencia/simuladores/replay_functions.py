from pathlib import Path
import json
from evidence import visible_version
import re,zlib,time
from decimal import Decimal
BASE=None
MAP=dict(zip(['0023','0025','0500','0505','0528','0529','0530','0531','0532','0533','0414','0595','0610','0670'],['TPRRT','TPTOTAL','BLGRAL','BLGGRAV','CEXGE1','CEXGA1','CEXGE2','CEXGA2','CIGEST','CIGAUT','CLDED2','CAUTLIQ','CDIF','RESULTADO']))
def fields(b):
    from contract import fields as parse
    return parse(b)
def eq(a,b):
    return a is None and b is None or a is not None and b is not None and Decimal(a)==Decimal(b)
def capture_case(name,expected=None):
    text=page.locator('body').inner_text()
    work()
    if page.get_by_title('Mostrar opciones',exact=True).count(): page.get_by_title('Mostrar opciones',exact=True).click()
    with page.expect_download() as d: page.get_by_title('Guardar datos trabajo (.ses)',exact=True).click()
    data=Path(d.value.path()).read_bytes(); f=fields(data)
    result={'id':name,'url':page.url,'utc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'ses':blob(data),'summary':blob(text.encode()),'fields':{k:f.get(k) for k in list(MAP.values())+['IDII','GSS','IDRE','GCS','GCC','GDJ','IDICLDED2','GSSCLDED2']},'bootstrap':LAST_BOOTSTRAP,'visibleVersion':LAST_VISIBLE,'version':re.search(r'<\?xml.*?\?>',zlib.decompress(data).decode('latin1')).group()}
    if expected:
        old=fields(expected)
        result['comparison']={box:{'expected':old.get(k),'actual':f.get(k),'equal':eq(old.get(k),f.get(k))} for box,k in MAP.items()}
        assert all(x['equal'] for x in result['comparison'].values()),result
    page.get_by_title('Resumen de declaraciones',exact=True).click()
    page.get_by_role('button',name='Vista previa',exact=True).click()
    page.wait_for_function('Array.from(document.querySelectorAll("iframe")).some(e=>e.src.includes("PDFborrador.pdf"))')
    url=page.locator('iframe').evaluate_all('(es)=>es.map(e=>e.src).find(s=>s.includes("PDFborrador.pdf"))')
    r=context.request.get(url); assert r.status==200 and r.body().startswith(b'%PDF')
    result['pdf']=blob(r.body())
    page.get_by_role('button',name='Volver a declaración',exact=True).click()
    print('CAPTURED',name,f.get('RESULTADO'),flush=True)
    return result
def load(name,year=2025):
    global LAST_BOOTSTRAP,LAST_VISIBLE
    response=page.goto(f'https://www2.agenciatributaria.gob.es/wlpl/PARE-RW{str(year)[2:]}/OPEN/index.zul?EJER={year}&TACCESO=COLAB')
    if response is None or response.status != 200: raise ValueError('Aplicación oficial no disponible')
    bootstrap=response.body()
    LAST_VISIBLE=visible_version(bootstrap)
    LAST_BOOTSTRAP=blob(bootstrap)
    page.get_by_role('button',name='Cargar',exact=True).click()
    page.locator('input[type=file][accept=".ses"]').set_input_files(str(BASE/(name+'.ses')))
    page.get_by_role('button',name='Vista previa',exact=True).wait_for()
    time.sleep(1.5)
def work():
    if not page.get_by_title(re.compile(r'^Apartados(?: declaración)?$')).count():
        page.get_by_title('Continuar con la declaración',exact=True).click(); time.sleep(1)
    page.get_by_title(re.compile(r'^Apartados(?: declaración)?$')).click()
    page.get_by_text('Rendimientos del trabajo (sueldos, nóminas, pensiones, etc.)',exact=True).click()
    page.get_by_text(re.compile(r'^0*25$')).wait_for()
def amount(field,value):
    # Los widgets se reconstruyen tras respuestas ZK; el título puede desaparecer.
    page.wait_for_timeout(1000)
    fid=field.get_attribute('id')
    ids=dlg().locator('input[type=text]:visible').evaluate_all('(es)=>es.map(e=>e.id)')
    field=dlg().locator('input[type=text]:visible').nth(ids.index(fid))
    field.click(); field.press('ControlOrMeta+A'); field.press_sequentially(str(value).replace('.',','),delay=40); field.press('Tab'); time.sleep(1)
    assert Decimal(field.input_value().replace('.','').replace(',','.') or '0')==Decimal(value)
def change(inputs):
    work()
    page.get_by_text(re.compile(r'^0*3$')).locator('xpath=../../..').get_by_role('button').click()
    dialog=dlg(); dialog.get_by_title(re.compile(r'^Importe íntegro:?$')).wait_for()
    for title,value in inputs.items(): amount(dialog.get_by_title(re.compile('^'+re.escape(title.rstrip(':'))+':?$')),value)
    dialog.get_by_role('button',name='Aceptar',exact=True).click(); time.sleep(1)
    page.get_by_title('Resumen de declaraciones',exact=True).click(); time.sleep(1)
def identity(year):
    page.goto(f'https://www2.agenciatributaria.gob.es/wlpl/PARE-RW{str(year)[2:]}/OPEN/index.zul?TACCESO=COLAB&EJER={year}')
    page.get_by_role('button',name='Nueva declaración',exact=True).click()
    page.locator('input[title="NIF:"],input[title="NIF"]').first.fill('90000000B')
    page.locator('input[title="Apellidos y nombre:"],input[title="Apellidos y nombre"]').first.fill('PRUEBA C OPEN')
    page.locator('input[type=checkbox]:visible').first.check()
    page.locator('.z-combobox[title^="Estado Civil"]').click(); page.get_by_text('SOLTERO/A',exact=True).click()
    page.locator('.z-datebox input:visible').first.fill('01/01/1985'); page.locator('.z-datebox input:visible').first.press('Tab')
    page.locator('.z-combobox[title="Comunidad Autónoma"]').click(); page.get_by_text('MADRID',exact=True).click()
    page.get_by_text('Hombre',exact=True).click()
    page.get_by_role('button',name='Aceptar',exact=True).click()
    page.get_by_role('button',name='Vista previa',exact=True).wait_for(); time.sleep(1)
def da61(gross,ss):
    work(); page.get_by_text('0003',exact=True).locator('xpath=../../..').get_by_role('button').click()
    page.get_by_text('Deducción por obtención de rendimientos del trabajo',exact=True).click()
    ds=dlg().locator('input[type=text]:visible'); ds.nth(8).wait_for()
    amount(ds.nth(0),gross); amount(ds.nth(8),ss)
    dlg().get_by_role('button',name='Aceptar',exact=True).click(); time.sleep(1)
    work(); page.get_by_title('Resumen de declaraciones',exact=True).click(); time.sleep(1)

def dlg():
    accessible=page.get_by_role('dialog')
    return accessible if accessible.count() else page.locator('.z-window-modal:visible').last
