import re

path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\MDDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'getStaffAvatarUrl' not in content:
    content = content.replace(
        "import { StaffFillingOversightHub } from './StaffFillingOversightHub';",
        "import { StaffFillingOversightHub } from './StaffFillingOversightHub';\nimport { getStaffAvatarUrl } from '../utils/staffAvatars';"
    )

# 2. Update Podium avatar
podium_old = """                            {/* Rep Profile Photo Avatar */}
                            <div className="relative shrink-0">
                              {item.rep.avatarUrl ? (
                                <img
                                  src={item.rep.avatarUrl}
                                  alt={item.name}
                                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                                />
                              ) : (
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                                    item.rep.avatarColor || 'bg-slate-600'
                                  }`}
                                >
                                  {item.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}"""

podium_new = """                            {/* Rep Profile Photo Avatar */}
                            <div className="relative shrink-0">
                              {item.rep.avatarUrl || getStaffAvatarUrl(item.name, reps) ? (
                                <img
                                  src={item.rep.avatarUrl || getStaffAvatarUrl(item.name, reps)}
                                  alt={item.name}
                                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                                />
                              ) : (
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                                    item.rep.avatarColor || 'bg-slate-600'
                                  }`}
                                >
                                  {item.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}"""

# 3. Update race track runner avatar
runner_old = """                              {item.rep.avatarUrl ? (
                                <img
                                  src={item.rep.avatarUrl}
                                  alt={item.name}
                                  className={`w-7 h-7 rounded-full object-cover border-2 shadow-lg ring-2 ${
                                    idx === 0
                                      ? 'border-amber-300 ring-amber-500'
                                      : 'border-white ring-indigo-500'
                                  }`}
                                />
                              ) : (
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-lg ${
                                    item.rep.avatarColor || 'bg-slate-700'
                                  }`}
                                >
                                  {item.name.slice(0, 1)}
                                </div>
                              )}"""

runner_new = """                              {item.rep.avatarUrl || getStaffAvatarUrl(item.name, reps) ? (
                                <img
                                  src={item.rep.avatarUrl || getStaffAvatarUrl(item.name, reps)}
                                  alt={item.name}
                                  className={`w-8 h-8 rounded-full object-cover border-2 shadow-lg ring-2 ${
                                    idx === 0
                                      ? 'border-amber-300 ring-amber-500'
                                      : 'border-white ring-indigo-500'
                                  }`}
                                />
                              ) : (
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-lg ${
                                    item.rep.avatarColor || 'bg-slate-700'
                                  }`}
                                >
                                  {item.name.slice(0, 1)}
                                </div>
                              )}"""

# 4. Update Champion topLeader
champ_old = """                      <div className="relative shrink-0">
                        {topLeader.rep.avatarUrl ? (
                          <img
                            src={topLeader.rep.avatarUrl}
                            alt={topLeader.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white text-lg font-bold">
                            {topLeader.name.slice(0, 2)}
                          </div>
                        )}
                        <span className="absolute -top-2 -right-1.5 text-base drop-shadow-sm">👑</span>
                      </div>"""

champ_new = """                      <div className="relative shrink-0">
                        {topLeader.rep.avatarUrl || getStaffAvatarUrl(topLeader.name, reps) ? (
                          <img
                            src={topLeader.rep.avatarUrl || getStaffAvatarUrl(topLeader.name, reps)}
                            alt={topLeader.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white text-lg font-bold">
                            {topLeader.name.slice(0, 2)}
                          </div>
                        )}
                        <span className="absolute -top-2 -right-1.5 text-base drop-shadow-sm">👑</span>
                      </div>"""

# 5. Update runnersUp
runnersup_old = """                        {runner.rep.avatarUrl ? (
                          <img
                            src={runner.rep.avatarUrl}
                            alt={runner.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-600 shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {runner.name.slice(0, 1)}
                          </div>
                        )}"""

runnersup_new = """                        {runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps) ? (
                          <img
                            src={runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps)}
                            alt={runner.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-600 shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {runner.name.slice(0, 1)}
                          </div>
                        )}"""

# 6. Update Tab 2 Staff Filter Bar
tab2_filter_old = """              {reps.map((r) => {
                const count = currentSales.filter((s) => s.purchaserName.toLowerCase() === r.name.toLowerCase()).length;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedStaffFilter(r.name.toLowerCase())}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                      selectedStaffFilter === r.name.toLowerCase()
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    <span>{r.displayName.split(' ')[0]}</span>
                    <span className="px-1 py-0.2 rounded text-[9px] bg-black/20 font-mono">{count}</span>
                  </button>
                );
              })}"""

tab2_filter_new = """              {reps.map((r) => {
                const count = currentSales.filter(
                  (s) =>
                    s.purchaserName.toLowerCase().trim() === r.name.toLowerCase().trim() ||
                    s.purchaserName.toLowerCase().trim() === r.displayName.toLowerCase().trim()
                ).length;
                const avatar = r.avatarUrl || getStaffAvatarUrl(r.name, reps);
                const isSelected = selectedStaffFilter === r.name.toLowerCase();

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedStaffFilter(r.name.toLowerCase())}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/60 shrink-0 shadow-2xs bg-slate-800">
                      {avatar ? (
                        <img src={avatar} alt={r.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-700 text-white text-[9px] font-bold flex items-center justify-center">
                          {r.displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span>{r.displayName.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}"""

# Normalize CRLF
def normalize(s):
    return s.replace('\r\n', '\n')

content_norm = normalize(content)
for old, new in [
    (podium_old, podium_new),
    (runner_old, runner_new),
    (champ_old, champ_new),
    (runnersup_old, runnersup_new),
    (tab2_filter_old, tab2_filter_new)
]:
    old_n = normalize(old)
    new_n = normalize(new)
    if old_n in content_norm:
        content_norm = content_norm.replace(old_n, new_n)
        print("Replaced section successfully")
    else:
        print("Warning: old section not found!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("MDDashboard.tsx updated.")
