path_initial = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\data\initialData.ts'
with open(path_initial, 'r', encoding='utf-8') as f:
    content = f.read()

if 'staffAvatarsData' not in content:
    content = "import { AVATAR_YAZHINI, AVATAR_NAVEENA, AVATAR_JANANI } from '../utils/staffAvatarsData';\n" + content

content = content.replace("avatarUrl: '/avatars/yazhini.png'", "avatarUrl: AVATAR_YAZHINI")
content = content.replace("avatarUrl: '/avatars/naveena.png'", "avatarUrl: AVATAR_NAVEENA")
content = content.replace("avatarUrl: '/avatars/janani.jpg'", "avatarUrl: AVATAR_JANANI")

with open(path_initial, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated initialData.ts")

path_context = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\context\SalesContext.tsx'
with open(path_context, 'r', encoding='utf-8') as f:
    content_ctx = f.read()

if 'staffAvatarsData' not in content_ctx:
    content_ctx = "import { DEFAULT_AVATARS, AVATAR_YAZHINI, AVATAR_NAVEENA, AVATAR_JANANI } from '../utils/staffAvatarsData';\n" + content_ctx

# Replace old DEFAULT_AVATARS block and attachAvatars
old_attach_block = """const DEFAULT_AVATARS: Record<string, string> = {
  yazhini: '/avatars/yazhini.png',
  naveena: '/avatars/naveena.png',
  janani: '/avatars/janani.jpg',
};

const attachAvatars = (repList: SalesRep[]): SalesRep[] => {
  return repList.map((r) => ({
    ...r,
    avatarUrl: r.avatarUrl || DEFAULT_AVATARS[r.id?.toLowerCase()] || DEFAULT_AVATARS[r.name?.toLowerCase()],
  }));
};"""

new_attach_block = """const attachAvatars = (repList: SalesRep[]): SalesRep[] => {
  return repList.map((r) => {
    const idKey = r.id?.toLowerCase() || '';
    const nameKey = r.name?.toLowerCase() || '';
    let embedded = DEFAULT_AVATARS[idKey] || DEFAULT_AVATARS[nameKey];
    if (!embedded) {
      if (idKey.includes('yazhini') || nameKey.includes('yazhini')) embedded = AVATAR_YAZHINI;
      else if (idKey.includes('naveena') || nameKey.includes('naveena')) embedded = AVATAR_NAVEENA;
      else if (idKey.includes('janani') || nameKey.includes('janani')) embedded = AVATAR_JANANI;
    }

    const isCustomBase64 = r.avatarUrl && r.avatarUrl.startsWith('data:image') && !r.avatarUrl.includes('/avatars/');
    return {
      ...r,
      avatarUrl: isCustomBase64 ? r.avatarUrl : (embedded || r.avatarUrl),
    };
  });
};"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_ctx_n = normalize(content_ctx)
old_n = normalize(old_attach_block)
new_n = normalize(new_attach_block)

if old_n in content_ctx_n:
    content_ctx_n = content_ctx_n.replace(old_n, new_n)
    print("Replaced attachAvatars in SalesContext.tsx")
else:
    print("Warning: old_attach_block not found in SalesContext.tsx!")

with open(path_context, 'w', encoding='utf-8') as f:
    f.write(content_ctx_n)

print("Updated SalesContext.tsx")
