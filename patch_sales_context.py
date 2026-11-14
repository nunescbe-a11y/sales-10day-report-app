p = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\context\SalesContext.tsx'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Default selectedCycleId to 'all'
old_cycle = '''  const [selectedCycleId, setSelectedCycleIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_CYCLE);
    return saved || 'all';
  });'''

new_cycle = '''  const [selectedCycleId, setSelectedCycleIdState] = useState<string>(() => {
    return 'all';
  });'''

# 2. Guard auto-sync so empty state never overwrites disk database
old_sync = '''  // 2. Continuous Auto-Sync to Permanent Disk Storage (Debounced 500ms)
  useEffect(() => {
    const timer = setTimeout(async () => {'''

new_sync = '''  // 2. Continuous Auto-Sync to Permanent Disk Storage (Debounced 500ms)
  useEffect(() => {
    if (!sales || sales.length === 0) return;
    const timer = setTimeout(async () => {'''

text = text.replace(old_cycle, new_cycle)
text = text.replace(old_sync, new_sync)

with open(p, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated SalesContext.tsx successfully!')
