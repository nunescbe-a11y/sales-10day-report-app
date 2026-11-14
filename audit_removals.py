import os

root = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src'
queries = ['Timer Details', 'Cycle Closes In', 'CYCLE CLOSES IN', 'Current 10-Day Cycle', '🌸', 'Mina 3D', '100 Acts', 'Pranesh']

for dirpath, _, filenames in os.walk(root):
    for f in filenames:
        if f.endswith(('.tsx', '.ts')):
            p = os.path.join(dirpath, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
                for q in queries:
                    if q.lower() in c.lower():
                        print(f'{f}: contains "{q}"')
