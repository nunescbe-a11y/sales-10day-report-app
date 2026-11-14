path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\StaffLoginModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getStaffAvatarUrl' not in content:
    content = "import { getStaffAvatarUrl } from '../utils/staffAvatars';\n" + content

old_pin_avatar = """                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md shrink-0">
                      {selectedRep.avatarUrl ? (
                        <img src={selectedRep.avatarUrl} alt={selectedRep.displayName} className="w-full h-full object-cover" />
                      ) : ("""

new_pin_avatar = """                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md shrink-0">
                      {selectedRep.avatarUrl || getStaffAvatarUrl(selectedRep.name, reps) ? (
                        <img src={selectedRep.avatarUrl || getStaffAvatarUrl(selectedRep.name, reps)} alt={selectedRep.displayName} className="w-full h-full object-cover" />
                      ) : ("""

old_card_avatar = """                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0 transition-transform group-hover:scale-105">
                            {rep.avatarUrl ? (
                              <img
                                src={rep.avatarUrl}
                                alt={rep.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : ("""

new_card_avatar = """                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0 transition-transform group-hover:scale-105">
                            {rep.avatarUrl || getStaffAvatarUrl(rep.name, reps) ? (
                              <img
                                src={rep.avatarUrl || getStaffAvatarUrl(rep.name, reps)}
                                alt={rep.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : ("""

def normalize(s):
    return s.replace('\r\n', '\n')

content_norm = normalize(content)
for old, new in [(old_pin_avatar, new_pin_avatar), (old_card_avatar, new_card_avatar)]:
    old_n = normalize(old)
    new_n = normalize(new)
    if old_n in content_norm:
        content_norm = content_norm.replace(old_n, new_n)
        print("Replaced section in StaffLoginModal.tsx")
    else:
        print("Warning: section not found in StaffLoginModal.tsx!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("StaffLoginModal.tsx updated.")
