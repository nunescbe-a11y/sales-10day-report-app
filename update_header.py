path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getStaffAvatarUrl' not in content:
    content = "import { getStaffAvatarUrl } from '../utils/staffAvatars';\n" + content

old_btn = """            {activeRep?.avatarUrl ? (
              <img
                src={activeRep.avatarUrl}
                alt={activeRep.displayName}
                className="w-7 h-7 rounded-full object-cover border-2 border-indigo-500 shrink-0 shadow-xs"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full ${
                  activeRep?.avatarColor || 'bg-gradient-to-tr from-amber-500 to-orange-500'
                } text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs`}
              >
                {activeRep ? activeRep.displayName.charAt(0) : '👑'}
              </div>
            )}"""

new_btn = """            {activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps) ? (
              <img
                src={activeRep?.avatarUrl || getStaffAvatarUrl(activeRep?.name || currentRole, reps)}
                alt={activeRep ? activeRep.displayName : 'Staff'}
                className="w-7 h-7 rounded-full object-cover border-2 border-indigo-500 shrink-0 shadow-xs"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full ${
                  activeRep?.avatarColor || 'bg-gradient-to-tr from-amber-500 to-orange-500'
                } text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs`}
              >
                {activeRep ? activeRep.displayName.charAt(0) : '👑'}
              </div>
            )}"""

old_switcher = """          {/* User Role Switcher - Seamlessly switch between MD and any employee */}
          <div className="flex items-center border border-slate-800 rounded-xl p-0.5 bg-slate-900">
            <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              View:
            </span>"""

new_switcher = """          {/* User Role Switcher - Seamlessly switch between MD and any employee */}
          <div className="flex items-center border border-slate-800 rounded-xl p-0.5 bg-slate-900">
            {currentRole !== 'MD' && (
              <div className="pl-1.5 shrink-0 flex items-center">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-indigo-400 shrink-0">
                  <img
                    src={getStaffAvatarUrl(currentRole, reps) || '/avatars/yazhini.png'}
                    alt={currentRole}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">
              {currentRole === 'MD' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              View:
            </span>"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_norm = normalize(content)
for old, new in [(old_btn, new_btn), (old_switcher, new_switcher)]:
    old_n = normalize(old)
    new_n = normalize(new)
    if old_n in content_norm:
        content_norm = content_norm.replace(old_n, new_n)
        print("Replaced section in Header.tsx")
    else:
        print("Warning: section not found in Header.tsx!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("Header.tsx updated.")
