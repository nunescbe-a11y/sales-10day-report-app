path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\Header.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace header styling
content = content.replace(
    '<header className="sticky top-0 z-40 bg-[#0B0F19] border-b border-slate-800 text-white shadow-md">',
    '<header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">'
)

content = content.replace(
    '<h1 className="text-sm font-bold tracking-tight leading-none text-white">',
    '<h1 className="text-sm font-bold tracking-tight leading-none text-slate-900">'
)

content = content.replace(
    'bg-amber-950/50 text-amber-300 border-amber-700/50',
    'bg-amber-50 text-amber-800 border-amber-200'
)

content = content.replace(
    'bg-emerald-950/50 text-emerald-300 border-emerald-700/50',
    'bg-emerald-50 text-emerald-800 border-emerald-200'
)

content = content.replace(
    '<p className="text-[10px] mt-0.5 text-slate-400">',
    '<p className="text-[10px] mt-0.5 text-slate-500">'
)

content = content.replace(
    'border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-white transition cursor-pointer shadow-xs',
    'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 transition cursor-pointer shadow-xs'
)

content = content.replace(
    '<span className="block text-xs font-black leading-tight text-white">',
    '<span className="block text-xs font-black leading-tight text-slate-900">'
)

content = content.replace(
    '<span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">',
    '<span className="block text-[10px] text-indigo-600 font-bold uppercase tracking-wider">'
)

content = content.replace(
    '<UserCheck className="w-4 h-4 text-indigo-400 hidden md:block" />',
    '<UserCheck className="w-4 h-4 text-indigo-600 hidden md:block" />'
)

content = content.replace(
    'border border-slate-800 rounded-xl p-0.5 bg-slate-900',
    'border border-slate-200 rounded-xl p-0.5 bg-slate-50'
)

content = content.replace(
    '<span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">',
    '<span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">'
)

content = content.replace(
    'border border-slate-700 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-bold bg-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs',
    'border border-slate-300 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-bold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs'
)

content = content.replace(
    'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white',
    'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
)

content = content.replace(
    'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-emerald-950/60 hover:border-emerald-600 hover:text-emerald-300',
    'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
)

content = content.replace(
    'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-indigo-950/60 hover:border-indigo-600 hover:text-indigo-300',
    'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
)

content = content.replace(
    'border border-slate-800 bg-slate-900 text-rose-400 hover:bg-rose-950/60 hover:border-rose-600 hover:text-rose-300 transition cursor-pointer flex items-center gap-1',
    'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition cursor-pointer flex items-center gap-1 shadow-2xs'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Header.tsx to white theme.")
