path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\MDDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define avatarSrc at line 446
old_def = """                  {repPerformanceData.map((item, idx) => {
                    const isFirst = idx === 0 && item.sales > 0;
                    const clampedPct = Math.min(100, Math.max(item.sales > 0 ? 5 : 0, item.pct));"""

new_def = """                  {repPerformanceData.map((item, idx) => {
                    const isFirst = idx === 0 && item.sales > 0;
                    const clampedPct = Math.min(100, Math.max(item.sales > 0 ? 5 : 0, item.pct));
                    const avatarSrc = getStaffAvatarUrl(item.name, reps) || item.rep.avatarUrl;"""

# Remove redundant top avatar next to name, keeping clean medal and name
old_header_section = """                          <div className="flex items-center gap-2">
                            {/* Rank Medal */}
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                idx === 0
                                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                                  : idx === 1
                                  ? 'bg-slate-200 text-slate-800'
                                  : idx === 2
                                  ? 'bg-amber-800/10 text-amber-900'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                            </span>

                            {/* Rep Profile Photo Avatar */}
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
                              )}
                              {isFirst && (
                                <span className="absolute -top-1.5 -right-1 text-[11px]" title="Sprint Leader">
                                  👑
                                </span>
                              )}
                            </div>

                            {/* Rep Name & Stats */}
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                              {isFirst && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Leader
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 hidden sm:inline">
                                • {item.orders} {item.orders === 1 ? 'deal' : 'deals'} (Profit: ₹{item.profit.toLocaleString('en-IN')})
                              </span>
                            </div>
                          </div>"""

new_header_section = """                          <div className="flex items-center gap-2">
                            {/* Rank Medal */}
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                idx === 0
                                  ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                                  : idx === 1
                                  ? 'bg-slate-200 text-slate-800'
                                  : idx === 2
                                  ? 'bg-amber-800/10 text-amber-900'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                            </span>

                            {/* Rep Name & Stats (Image is inside the race bar) */}
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.name}</span>
                              {isFirst && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5 shadow-2xs">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Sprint Leader
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                                • {item.orders} {item.orders === 1 ? 'deal' : 'deals'} (Profit: ₹{item.profit.toLocaleString('en-IN')})
                              </span>
                            </div>
                          </div>"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_n = normalize(content)
for old, new, lbl in [
    (old_def, new_def, "define avatarSrc"),
    (old_header_section, new_header_section, "remove top avatar"),
]:
    old_n = normalize(old)
    new_n = normalize(new)
    if old_n in content_n:
        content_n = content_n.replace(old_n, new_n)
        print(f"Replaced {lbl} successfully")
    else:
        print(f"Warning: {lbl} not found!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_n)

print("Updated MDDashboard.tsx")
