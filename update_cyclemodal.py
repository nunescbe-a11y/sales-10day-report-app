path = r'C:\Users\NUNES\.gemini\antigravity\scratch\sales-10day-report-app\src\components\CycleManagerModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getStaffAvatarUrl' not in content:
    content = "import { getStaffAvatarUrl } from '../utils/staffAvatars';\n" + content

old_block = """                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {c.startDate} to {c.endDate} •{' '}
                          <span className="font-bold text-indigo-700 font-mono">
                            ₹{totalRevenue.toLocaleString('en-IN')}
                          </span>{' '}
                          • {repsFilled}/{reps.length} reps submitted
                        </div>"""

new_block = """                        <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>{c.startDate} to {c.endDate}</span>
                          <span>•</span>
                          <span className="font-bold text-indigo-700 font-mono">
                            ₹{totalRevenue.toLocaleString('en-IN')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="flex -space-x-1.5">
                              {Array.from(new Set(cycleSales.map((s) => s.purchaserName.toLowerCase()))).map((pName) => {
                                const url = getStaffAvatarUrl(pName, reps);
                                return (
                                  <div key={pName} className="w-4 h-4 rounded-full overflow-hidden border border-white ring-1 ring-indigo-400 bg-slate-700 shadow-2xs" title={pName}>
                                    {url ? (
                                      <img src={url} alt={pName} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full text-[8px] text-white flex items-center justify-center font-bold">
                                        {pName.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </span>
                            <span>{repsFilled}/{reps.length} reps submitted</span>
                          </span>
                        </div>"""

def normalize(s):
    return s.replace('\r\n', '\n')

content_norm = normalize(content)
old_n = normalize(old_block)
new_n = normalize(new_block)

if old_n in content_norm:
    content_norm = content_norm.replace(old_n, new_n)
    print("Replaced cycle manager block successfully")
else:
    print("Warning: old block not found in CycleManagerModal.tsx")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print("CycleManagerModal.tsx updated.")
