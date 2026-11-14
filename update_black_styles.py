import re

# 1. Update index.css
css_path = 'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/src/index.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

scrollbar_css = """/* Full Pitch-Black Custom Sleek Scrollbar */
* {
  scrollbar-width: thin !important;
  scrollbar-color: #334155 #020617 !important;
}

::-webkit-scrollbar {
  width: 9px !important;
  height: 9px !important;
}
::-webkit-scrollbar-track {
  background: #020617 !important;
}
::-webkit-scrollbar-thumb {
  background: #334155 !important;
  border-radius: 9999px !important;
  border: 2px solid #020617 !important;
}
::-webkit-scrollbar-thumb:hover {
  background: #64748b !important;
}
::-webkit-scrollbar-corner {
  background: #020617 !important;
}

.custom-black-scrollbar {
  scrollbar-width: thin !important;
  scrollbar-color: #334155 #020617 !important;
}
.custom-black-scrollbar::-webkit-scrollbar {
  width: 9px !important;
  height: 9px !important;
}
.custom-black-scrollbar::-webkit-scrollbar-track {
  background: #020617 !important;
}
.custom-black-scrollbar::-webkit-scrollbar-thumb {
  background: #334155 !important;
  border-radius: 9999px !important;
  border: 2px solid #020617 !important;
}
"""

if '/* Full Pitch-Black Custom Sleek Scrollbar */' in css:
    css = css.split('/* Full Pitch-Black Custom Sleek Scrollbar */')[0] + scrollbar_css
else:
    css += '\n' + scrollbar_css

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print('Updated index.css')

# 2. Update MDDashboard.tsx
dash_path = 'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/src/components/MDDashboard.tsx'
with open(dash_path, 'r', encoding='utf-8') as f:
    dash = f.read()

# Replace race track background with jet black asphalt track
dash = dash.replace(
    'relative h-6 bg-slate-200/80 rounded-full overflow-hidden border border-slate-300 shadow-inner',
    'relative h-6 bg-[#080B11] rounded-full overflow-hidden border border-slate-800 shadow-inner'
)
dash = dash.replace(
    '<span className="text-slate-700 font-bold">🏁 FINISH</span>',
    '<span className="text-amber-400 font-black">🏁 FINISH</span>'
)

# Replace Subheader Bar with Sleek Black Bar
old_sub = """      {/* Top MD Sub-Header with Page-Fit Tab Switcher */}
      <div className={`border rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 transition-colors duration-200 ${
        isDark 
          ? 'bg-[#12141F] border-white/10 text-white shadow-xl shadow-black/40' 
          : 'bg-white border-slate-200/90 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-sm sm:text-base font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Managing Director Executive Command
            </h2>
            <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              10-Day Payment Analytics • Master Sales Oversight
            </p>
          </div>
        </div>"""

new_sub = """      {/* Top MD Sub-Header with Page-Fit Tab Switcher - SLEEK BLACK BAR */}
      <div className="border border-slate-800 rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-[#0A0D14] text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black leading-tight text-white">
              Managing Director Executive Command
            </h2>
            <p className="text-xs mt-0.5 font-medium text-slate-400">
              10-Day Payment Analytics • Master Sales Oversight
            </p>
          </div>
        </div>"""

dash = dash.replace(old_sub.replace('\n', '\r\n'), new_sub.replace('\n', '\r\n'))
dash = dash.replace(old_sub, new_sub)

# Also update tabs container and cycle filter in Subheader
dash = dash.replace(
    'isDark ? \'bg-[#0B0D14] border-white/5\' : \'bg-slate-100 border-slate-200\'',
    '\'bg-slate-900 border-slate-800\''
)
dash = dash.replace(
    'isDark ? \'bg-zinc-900 border-zinc-800 text-slate-300\' : \'bg-white border-slate-200 text-slate-800\'',
    '\'bg-slate-900 border-slate-800 text-slate-300\''
)
dash = dash.replace(
    'isDark ? \'bg-zinc-800 border-zinc-700 text-white\' : \'bg-slate-50 border-slate-200 text-slate-900\'',
    '\'bg-slate-800 border-slate-700 text-white\''
)

with open(dash_path, 'w', encoding='utf-8') as f:
    f.write(dash)
print('Updated MDDashboard.tsx')
