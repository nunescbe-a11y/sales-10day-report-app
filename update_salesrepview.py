path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\SalesRepView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getStaffAvatarUrl' not in content:
    content = "import { getStaffAvatarUrl } from '../utils/staffAvatars';\n" + content

old_top_avatar = """          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
            {activeRep?.avatarUrl ? (
              <img
                src={activeRep.avatarUrl}
                alt={activeRep.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full ${
                  activeRep?.avatarColor || 'bg-indigo-600'
                } flex items-center justify-center text-white text-base sm:text-lg font-black shadow-md`}
              >
                {activeRep?.displayName.charAt(0) || currentRole.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Active Staff Profile"
            />
          </div>"""

new_top_avatar = """          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
            {activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps) ? (
              <img
                src={activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps)}
                alt={activeRep?.displayName || currentRole}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full ${
                  activeRep?.avatarColor || 'bg-indigo-600'
                } flex items-center justify-center text-white text-base sm:text-lg font-black shadow-md`}
              >
                {activeRep?.displayName.charAt(0) || currentRole.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Active Staff Profile"
            />
          </div>"""

old_form_badge = """              <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full border ${
                isDark 
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                Staff: {activeRep?.displayName || currentRole}
              </span>"""

new_form_badge = """              <div className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full border flex items-center gap-2 ${
                isDark 
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                <div className="w-5 h-5 rounded-full overflow-hidden border border-indigo-400 shrink-0 bg-slate-800">
                  {activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps) ? (
                    <img
                      src={activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps)}
                      alt={activeRep?.displayName || currentRole}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {(activeRep?.displayName || currentRole).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span>Staff: {activeRep?.displayName || currentRole}</span>
              </div>"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_norm = normalize(content)
for old, new in [(old_top_avatar, new_top_avatar), (old_form_badge, new_form_badge)]:
    old_n = normalize(old)
    new_n = normalize(new)
    if old_n in content_norm:
        content_norm = content_norm.replace(old_n, new_n)
        print("Replaced section in SalesRepView.tsx")
    else:
        print("Warning: section not found in SalesRepView.tsx!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("SalesRepView.tsx updated.")
