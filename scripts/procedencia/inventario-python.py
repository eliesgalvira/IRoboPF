"""Inventario sintáctico mediante ast; nunca importa ni ejecuta el oracle."""
import ast
import hashlib
import json
import re
import sys
from pathlib import Path

path = Path(sys.argv[1])
raw = path.read_bytes()
text = raw.decode('utf-8')
tree = ast.parse(text, filename=str(path))
items = []

def visit(node, symbol='modulo', route=()):
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
        symbol = node.name
    if isinstance(node, ast.Assign):
        symbol = ast.unparse(node.targets[0])
    kind = None
    if isinstance(node, ast.Constant) and (type(node.value) in (int, float, complex) or (isinstance(node.value, str) and re.fullmatch(r'[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?', node.value))):
        kind = 'Parameter'
    if isinstance(node, (ast.List, ast.Tuple, ast.Dict, ast.Set)):
        kind = 'Parameter'
    if isinstance(node, (ast.BinOp, ast.UnaryOp, ast.Call, ast.AugAssign)):
        kind = 'Formula'
    if isinstance(node, (ast.If, ast.IfExp, ast.Compare, ast.BoolOp)):
        kind = 'Condition'
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        kind = 'Step'
    callee = node.func.id if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) else node.func.attr if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) else None
    if callee in ('round', 'floor', 'ceil', 'trunc', 'quantize'):
        kind = 'Rounding'
    if kind:
        items.append(dict(symbol=symbol, path=json.dumps(route, ensure_ascii=False, separators=(',', ':')), kind=kind, expression=ast.get_source_segment(text, node), line=node.lineno, column=node.col_offset+1, endLine=node.end_lineno, endColumn=node.end_col_offset+1))
    for field, value in ast.iter_fields(node):
        if isinstance(value, ast.AST):
            visit(value, symbol, (*route, field))
        elif isinstance(value, list):
            for index, child in enumerate(value):
                if isinstance(child, ast.AST):
                    label = getattr(child, 'name', str(index))
                    visit(child, symbol, (*route, field, label, index))

visit(tree)
print(json.dumps(dict(sha256=hashlib.sha256(raw).hexdigest(), items=items), ensure_ascii=False))
