path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\MDDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update race track item mapping to define avatarSrc
old_race_item = """                    const clampedPct = Math.min(100, Math.max(0, item.pct));
                    const isFirst = idx === 0 && item.sales > 0;"""

new_race_item = """                    const clampedPct = Math.min(100, Math.max(0, item.pct));
                    const isFirst = idx === 0 && item.sales > 0;
                    const avatarSrc = getStaffAvatarUrl(item.name, reps) || item.rep.avatarUrl;"""

# 2. Update the lane header (remove duplicate avatar, make title prominent)
old_lane_header = """                          <div className="flex items-center gap-2">
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

new_lane_header = """                          <div className="flex items-center gap-2">
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

                            {/* Rep Name & Stats */}
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

# 3. Update the race bar so the avatar is COMPLETELY INSIDE THE BAR
old_race_bar = """                        {/* Interactive Race Lane with Avatar moving along track */}
                        <div className="relative pt-1 pb-1">
                          <div className="relative h-6 bg-[#080B11] rounded-full overflow-hidden border border-slate-800 shadow-inner">
                            {/* Track Mileposts */}
                            <div className="absolute inset-0 flex justify-between px-2.5 text-[8px] font-black text-slate-400 select-none items-center pointer-events-none">
                              <span>START</span>
                              <span>25%</span>
                              <span>50%</span>
                              <span>75%</span>
                              <span className="text-amber-400 font-black">🏁 FINISH</span>
                            </div>

                            {/* Race Bar Fill */}
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                idx === 0
                                  ? 'bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600 shadow-sm'
                                  : idx === 1
                                  ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                              }`}
                              style={{ width: `${clampedPct}%` }}
                            />
                          </div>

                          {/* RACER AVATAR: Photo sliding right on the progress track! */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 pointer-events-none z-10"
                            style={{
                              left: `${Math.min(94, Math.max(3, clampedPct))}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <div className="relative flex items-center justify-center">
                              {item.rep.avatarUrl || getStaffAvatarUrl(item.name, reps) ? (
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
                              )}
                              {item.sales > 0 && (
                                <span className="absolute -bottom-1 -right-1 text-[9px] bg-white rounded-full px-0.5 shadow-xs leading-none">
                                  ⚡
                                </span>
                              )}
                            </div>
                          </div>
                        </div>"""

new_race_bar = """                        {/* Interactive Race Lane with Avatar strictly INSIDE the bar */}
                        <div className="relative pt-1 pb-1">
                          <div className="relative h-11 sm:h-12 bg-[#080B11] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-inner flex items-center">
                            {/* Track Mileposts */}
                            <div className="absolute inset-0 flex justify-between px-3 text-[9px] font-black text-slate-500 select-none items-center pointer-events-none z-0">
                              <span className="flex items-center gap-1 text-slate-400 font-bold">🚩 START</span>
                              <span>25%</span>
                              <span>50%</span>
                              <span>75%</span>
                              <span className="text-amber-400 font-black">🏁 100% FINISH</span>
                            </div>

                            {/* Race Bar Fill with Racer Avatar INSIDE */}
                            <div
                              className={`h-full rounded-2xl transition-all duration-700 relative z-10 flex items-center justify-end pr-1.5 shadow-md ${
                                idx === 0
                                  ? 'bg-gradient-to-r from-amber-500/70 via-indigo-600 to-purple-600'
                                  : idx === 1
                                  ? 'bg-gradient-to-r from-blue-500/70 to-cyan-500'
                                  : 'bg-gradient-to-r from-emerald-500/70 to-teal-500'
                              }`}
                              style={{
                                width: `${Math.max(clampedPct, 8)}%`,
                                minWidth: '44px',
                              }}
                            >
                              {/* RACER AVATAR: Cleanly nestled INSIDE the track bar */}
                              <div className="relative shrink-0 flex items-center justify-center">
                                {avatarSrc ? (
                                  <img
                                    src={avatarSrc}
                                    alt={item.name}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 shadow-lg ring-2 ${
                                      idx === 0
                                        ? 'border-amber-300 ring-amber-500'
                                        : 'border-white ring-indigo-400'
                                    }`}
                                  />
                                ) : (
                                  <div
                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-lg ${
                                      item.rep.avatarColor || 'bg-slate-700'
                                    }`}
                                  >
                                    {item.name.slice(0, 1)}
                                  </div>
                                )}
                                {isFirst && (
                                  <span className="absolute -top-1.5 -right-1 text-xs drop-shadow-md select-none">
                                    👑
                                  </span>
                                )}
                                {item.sales > 0 && (
                                  <span className="absolute -bottom-1 -right-1 text-[8px] bg-amber-400 text-slate-950 font-black rounded-full px-1 shadow-xs select-none">
                                    ⚡
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_n = normalize(content)
for old, new, label in [
    (old_race_item, new_race_item, "avatarSrc definition"),
    (old_lane_header, new_lane_header, "lane header"),
    (old_race_bar, new_race_bar, "race bar inside avatar"),
]:
    old_n = normalize(old)
    new_n = normalize(new)
    if old_n in content_n:
        content_n = content_n.replace(old_n, new_n)
        print(f"Replaced {label} successfully")
    else:
        print(f"Warning: {label} not found!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_n)

print("Updated MDDashboard.tsx successfully.")
