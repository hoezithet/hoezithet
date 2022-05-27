#! /bin/env python

import sys
from tabulate import tabulate

dep_count = {}
current = None

for l in sys.stdin.readlines():
    if l.startswith('├─┬ ') or l.startswith('└─┬ ') or l.startswith('├── '):
        current = l[4:-1]
        dep_count[current] = 0
    elif l.startswith('  ├── ') or l.startswith('│ ├── ') or l.startswith('│ └── ') or l.startswith('  └── '):
        dep_count[current] += 1


print(tabulate([(k, v) for k, v in sorted(dep_count.items(), key=lambda p: p[1], reverse=True)]))
