path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\PasswordResetModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getStaffAvatarUrl' not in content:
    content = "import { getStaffAvatarUrl } from '../utils/staffAvatars';\n" + content

old_field = """              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Employee Username / ID
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. yazhini, naveena, janani, or md"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                  required
                />
              </div>"""

new_field = """              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Employee Username / ID
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. yazhini, naveena, janani, or md"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                    required
                  />
                  {getStaffAvatarUrl(username) && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 shadow-xs ring-1 ring-indigo-200 shrink-0" title={username}>
                      <img src={getStaffAvatarUrl(username)} alt={username} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_norm = normalize(content)
old_n = normalize(old_field)
new_n = normalize(new_field)

if old_n in content_norm:
    content_norm = content_norm.replace(old_n, new_n)
    print("Replaced password reset field successfully")
else:
    print("Warning: old field not found in PasswordResetModal.tsx")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("PasswordResetModal.tsx updated.")
