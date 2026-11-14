path = 'C:/Users/NUNES/.gemini/antigravity/scratch/sales-10day-report-app/src/components/Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add LogOut to import
text = text.replace('  UserCheck\n', '  UserCheck,\n  LogOut\n')

# 2. Add logout to useSales()
text = text.replace('    syncStatus,\n', '    syncStatus,\n    logout,\n')

# 3. Add Logout button before </div> of action controls
old_controls_end = '''            </label>
          )}

        </div>'''

new_controls_end = '''            </label>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              logout();
              setCurrentRole('MD');
              setIsStaffLoginOpen(true);
            }}
            title="Logout / Switch Staff Session"
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-rose-400 hover:bg-rose-950/60 hover:border-rose-600 hover:text-rose-300 transition cursor-pointer flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold hidden lg:inline">Logout</span>
          </button>
        </div>'''

text = text.replace(old_controls_end, new_controls_end)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Added Logout button to Header.tsx')
