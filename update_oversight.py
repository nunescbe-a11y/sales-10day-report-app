path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\StaffFillingOversightHub.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import getStaffAvatarUrl
if 'getStaffAvatarUrl' not in content:
    content = "import { getStaffAvatarUrl } from '../utils/staffAvatars';\n" + content

# 2. Update inspected rep header avatar fallback
old_header_avatar = """              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
                {rep.avatarUrl ? (
                  <img
                    src={rep.avatarUrl}
                    alt={rep.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : ("""

new_header_avatar = """              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
                {rep.avatarUrl || getStaffAvatarUrl(rep.name, reps) ? (
                  <img
                    src={rep.avatarUrl || getStaffAvatarUrl(rep.name, reps)}
                    alt={rep.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : ("""

# 3. Update staff card grid avatar
old_card_avatar = """                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
                        {rep.avatarUrl ? (
                          <img
                            src={rep.avatarUrl}
                            alt={rep.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : ("""

new_card_avatar = """                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
                        {rep.avatarUrl || getStaffAvatarUrl(rep.name, reps) ? (
                          <img
                            src={rep.avatarUrl || getStaffAvatarUrl(rep.name, reps)}
                            alt={rep.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : ("""

# 4. Update staff table avatar
old_table_avatar = """                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md ${st.rep.avatarColor} text-white font-bold text-[10px] flex items-center justify-center`}>
                          {st.rep.displayName.charAt(0)}
                        </div>
                        <div>
                          <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{st.rep.displayName}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">@{st.rep.username}</span>
                        </div>
                      </div>"""

new_table_avatar = """                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 shrink-0 bg-slate-800 shadow-xs">
                          {st.rep.avatarUrl || getStaffAvatarUrl(st.rep.name, reps) ? (
                            <img
                              src={st.rep.avatarUrl || getStaffAvatarUrl(st.rep.name, reps)}
                              alt={st.rep.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full ${st.rep.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                              {st.rep.displayName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{st.rep.displayName}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">@{st.rep.username}</span>
                        </div>
                      </div>"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_norm = normalize(content)
for old, new in [
    (old_header_avatar, new_header_avatar),
    (old_card_avatar, new_card_avatar),
    (old_table_avatar, new_table_avatar),
]:
    old_n = normalize(old)
    new_n = normalize(new)
    if old_n in content_norm:
        content_norm = content_norm.replace(old_n, new_n)
        print("Replaced section successfully in StaffFillingOversightHub")
    else:
        print("Warning: section not found in StaffFillingOversightHub!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("StaffFillingOversightHub.tsx updated.")
