p = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\context\SalesContext.tsx'
with open(p, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_block = [
    '    loadFromPermanentStorage();\n',
    '\n',
    '    // Auto-poll every 5 seconds so MD and all staff see live updates automatically without refresh\n',
    '    const pollInterval = setInterval(loadFromPermanentStorage, 5000);\n',
    '    const onFocus = () => loadFromPermanentStorage();\n',
    '    window.addEventListener("focus", onFocus);\n',
    '    window.addEventListener("visibilitychange", onFocus);\n',
    '\n',
    '    return () => {\n',
    '      isMounted = false;\n',
    '      clearInterval(pollInterval);\n',
    '      window.removeEventListener("focus", onFocus);\n',
    '      window.removeEventListener("visibilitychange", onFocus);\n',
    '    };\n',
    '  }, []);\n'
]

lines = lines[:301] + new_block + lines[304:]

with open(p, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Updated successfully by line slice!')
