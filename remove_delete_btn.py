path = 'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/src/components/Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if 'Trash2,' in line:
        continue
    if 'clearAllSalesData,' in line:
        continue
    if 'Fresh Wipe / Clear All Older Sales Data' in line:
        skip = True
        continue
    if skip and '</button>' in line:
        skip = False
        continue
    if skip:
        continue
    # skip the closing )} if skip was just closed
    new_lines.append(line)

# Let's clean up if any leftover closing wrapper
content = "".join(new_lines)
import re
content = re.sub(r'\s*\{\/\* Fresh Wipe.*?\<\/\button\>\s*\}\)\s*', '\n', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Cleaned Header.tsx successfully')
