"""Identidades de componentes por referencias de código, sin buscar valores iguales."""
import re


def component(source, binding):
    path=binding['path'];name=binding['file'].rsplit('/',1)[-1]
    if name.startswith('irpf-autonomico-') and len(path)>=4 and path[1]=='tramos':
        territory=re.escape(path[0])
        pattern=r'(?m)^\s*(?:"'+territory+r'"|'+territory+r'):\s*\w+\(\{(?:(?!\}\),).)*?tramos:\s*(TRAMOS_\w+)'
        match=re.search(pattern,source,re.S)
        if match:return {'file':binding['file'],'symbol':match[1],'path':path[2:]},match[0].strip()
    if name.startswith('minimos-autonomicos-') and len(path)>2 and path[0]=='valor':
        territory=re.escape(path[1]);matches=list(re.finditer(r'(?m)^\s*(?:"'+territory+r'"|'+territory+r'):\s*(MINIMOS_\w+),',source))
        if matches:
            final=matches[-1]
            return {'file':binding['file'],'symbol':final[1],'path':path[2:]},final[0].strip()
    return None
