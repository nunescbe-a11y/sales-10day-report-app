path = 'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/src/data/initialData.ts'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("targetAmount: 150000,", "avatarUrl: '/avatars/yazhini.png',\n    targetAmount: 150000,")
c = c.replace("targetAmount: 100000,", "avatarUrl: '/avatars/janani.jpg',\n    targetAmount: 100000,")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated initialData.ts with avatarUrls!')
