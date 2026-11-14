path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\MDDashboard.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Sub-Header bar
content = content.replace(
    'border border-slate-800 rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-[#0A0D14] text-white shadow-md',
    'border border-slate-200 rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-white text-slate-900 shadow-xs'
)

content = content.replace(
    '<h2 className="text-sm sm:text-base font-black leading-tight text-white">',
    '<h2 className="text-sm sm:text-base font-black leading-tight text-slate-900">'
)

content = content.replace(
    '<p className="text-xs mt-0.5 font-medium text-slate-400">',
    '<p className="text-xs mt-0.5 font-medium text-slate-500">'
)

# 2. View Tabs wrapper
content = content.replace(
    "'bg-slate-900 border-slate-800'",
    "'bg-slate-100/90 border-slate-200'"
)

# 3. Cycle filter dropdown
content = content.replace(
    "'bg-slate-900 border-slate-800 text-slate-300'",
    "'bg-slate-50 border-slate-200 text-slate-700'"
)

content = content.replace(
    "'bg-slate-800 border-slate-700 text-white'",
    "'bg-white border-slate-300 text-slate-800'"
)

# 4. Race Track Lane - make the track clean light slate instead of pitch black
content = content.replace(
    'relative h-11 sm:h-12 bg-[#080B11] rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-inner flex items-center',
    'relative h-11 sm:h-12 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200/90 shadow-inner flex items-center'
)

content = content.replace(
    'text-slate-500 select-none items-center pointer-events-none z-0',
    'text-slate-400 select-none items-center pointer-events-none z-0'
)

content = content.replace(
    '<span className="flex items-center gap-1 text-slate-400 font-bold">🚩 START</span>',
    '<span className="flex items-center gap-1 text-slate-500 font-bold">🚩 START</span>'
)

content = content.replace(
    '<span className="text-amber-400 font-black">🏁 100% FINISH</span>',
    '<span className="text-amber-600 font-black">🏁 100% FINISH</span>'
)

# 5. Right Column Sidebar - change from luxury black to clean white card
old_sidebar = """            {/* Right Column: Sprint Leader Spotlight & Market Split - FULL LUXURY BLACK SIDEBAR */}
            <div className="p-3.5 rounded-2xl bg-[#080B11] border border-slate-800 text-white shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-black tracking-tight text-white">Sprint Leader Spotlight</h3>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    👑 10-Day Leader
                  </span>
                </div>

                {/* Champion Card */}
                {topLeader && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-900/95 border border-amber-500/40 relative overflow-hidden mb-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
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
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-white truncate flex items-center gap-1">
                          {topLeader.name}
                        </h4>
                        <p className="text-[10px] text-amber-400 font-medium">Rank #1 • Highest Sales</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                          <span className="font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono">
                            ₹{topLeader.sales.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-300">
                            Profit: <strong className="text-emerald-300 font-mono">₹{topLeader.profit.toLocaleString('en-IN')}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Contenders Strip */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Top Contenders</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {runnersUp.map((runner, i) => (
                      <div
                        key={runner.rep.id}
                        className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 shadow-xs"
                      >
                        {runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps) ? (
                          <img
                            src={runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps)}
                            alt={runner.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-600 shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {runner.name.slice(0, 1)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-slate-200 truncate">
                            {runner.name.split(' ')[0]}
                          </div>
                          <div className="text-[9px] font-mono text-emerald-400 font-bold">
                            ₹{runner.sales.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px]">{i === 0 ? '🥈' : '🥉'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographic Split at Bottom */}
              <div className="border-t border-slate-800 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>Market Geography</span>
                  <span className="text-slate-300 font-mono">Total: ₹{(kpis.totalRevenue / 1000).toFixed(0)}k</span>
                </div>
                {regionBreakdown.map((r, i) => {
                  const total = kpis.totalRevenue || 1;
                  const pct = Math.round((r.value / total) * 100);
                  return (
                    <div key={r.name} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-medium text-slate-300">{r.name}</span>
                        <span className="font-mono text-white font-bold">
                          ₹{r.value.toLocaleString('en-IN')} <span className="text-indigo-400">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            i === 0
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/50'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/50'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>"""

new_sidebar = """            {/* Right Column: Sprint Leader Spotlight & Market Split - CLEAN WHITE THEME */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-black tracking-tight text-slate-900">Sprint Leader Spotlight</h3>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    👑 10-Day Leader
                  </span>
                </div>

                {/* Champion Card */}
                {topLeader && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 border border-amber-300 relative overflow-hidden mb-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        {topLeader.rep.avatarUrl || getStaffAvatarUrl(topLeader.name, reps) ? (
                          <img
                            src={topLeader.rep.avatarUrl || getStaffAvatarUrl(topLeader.name, reps)}
                            alt={topLeader.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white text-lg font-bold">
                            {topLeader.name.slice(0, 2)}
                          </div>
                        )}
                        <span className="absolute -top-2 -right-1.5 text-base drop-shadow-sm">👑</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
                          {topLeader.name}
                        </h4>
                        <p className="text-[10px] text-amber-700 font-medium">Rank #1 • Highest Sales</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                          <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono">
                            ₹{topLeader.sales.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-600">
                            Profit: <strong className="text-emerald-700 font-mono">₹{topLeader.profit.toLocaleString('en-IN')}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Contenders Strip */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Top Contenders</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {runnersUp.map((runner, i) => (
                      <div
                        key={runner.rep.id}
                        className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 shadow-2xs"
                      >
                        {runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps) ? (
                          <img
                            src={runner.rep.avatarUrl || getStaffAvatarUrl(runner.name, reps)}
                            alt={runner.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {runner.name.slice(0, 1)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold text-slate-800 truncate">
                            {runner.name.split(' ')[0]}
                          </div>
                          <div className="text-[9px] font-mono text-emerald-700 font-bold">
                            ₹{runner.sales.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px]">{i === 0 ? '🥈' : '🥉'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographic Split at Bottom */}
              <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                  <span>Market Geography</span>
                  <span className="text-slate-800 font-mono font-bold">Total: ₹{(kpis.totalRevenue / 1000).toFixed(0)}k</span>
                </div>
                {regionBreakdown.map((r, i) => {
                  const total = kpis.totalRevenue || 1;
                  const pct = Math.round((r.value / total) * 100);
                  return (
                    <div key={r.name} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-medium text-slate-600">{r.name}</span>
                        <span className="font-mono text-slate-900 font-bold">
                          ₹{r.value.toLocaleString('en-IN')} <span className="text-indigo-600">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            i === 0
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>"""

def norm(s): return s.replace('\r\n', '\n')
cn = norm(content)
old_n = norm(old_sidebar)
new_n = norm(new_sidebar)

if old_n in cn:
    cn = cn.replace(old_n, new_n)
    print("Replaced sidebar in MDDashboard.tsx")
else:
    print("Warning: old sidebar not found in MDDashboard.tsx!")

# 6. Tab 2 Staff filter buttons
cn = cn.replace(
    ": 'bg-white/5 hover:bg-white/10 text-slate-400'",
    ": 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'"
)

cn = cn.replace(
    ": 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'",
    ": 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(cn)

print("Updated MDDashboard.tsx to clean white theme.")
