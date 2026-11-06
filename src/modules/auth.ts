/**
 * BH Agro Ltd. - Authentication & SR Account Management Module
 * Admin creates SR ID with Username & Password, synced to Realtime DB
 */

import { store, SRUser, ADMIN_USER, AdminUser } from './store.ts';
import { showToast } from './ui.ts';

export class AuthModule {
  renderLoginScreen(): string {
    return `
      <div class="min-h-screen bg-gradient-to-br from-brand-950 via-slate-900 to-tealbrand-950 flex flex-col justify-center items-center p-4">
        <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
          
          <div class="text-center mb-6">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-tealbrand-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-brand-500/30 mb-3">
              <i data-lucide="leaf" class="w-8 h-8"></i>
            </div>
            <h1 class="text-2xl font-black text-brand-900 dark:text-brand-300 tracking-tight">BH AGRO LTD.</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${store.t('tagline')}</p>
          </div>

          <!-- Portal Selector -->
          <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6">
            <button id="loginTabSr" onclick="window.AuthActions.switchMode('sr')" class="flex-1 py-2 rounded-xl text-xs font-bold transition-all bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow">
              ${store.t('roleSR')}
            </button>
            <button id="loginTabAdmin" onclick="window.AuthActions.switchMode('admin')" class="flex-1 py-2 rounded-xl text-xs font-bold transition-all text-slate-500 hover:text-slate-800 dark:hover:text-white">
              ${store.t('roleAdmin')}
            </button>
          </div>

          <!-- SR Login Form -->
          <div id="srLoginFormSection">
            <form onsubmit="event.preventDefault(); window.AuthActions.submitSR();" class="space-y-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">${store.t('srUsername')} / ID</label>
                <input type="text" id="srLoginUsername" required value="tanvir_sr" placeholder="e.g. tanvir_sr or SR02" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">${store.t('srPassword')}</label>
                <input type="password" id="srLoginPassword" required value="123" placeholder="Enter Password" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm" />
              </div>

              <button type="submit" class="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black text-sm shadow-lg shadow-brand-600/30 active:scale-95 transition flex items-center justify-center gap-2">
                <i data-lucide="log-in" class="w-4 h-4"></i>
                <span>Login to SR Field Portal</span>
              </button>

              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span class="font-bold text-brand-700">Quick Test Accounts:</span><br>
                • Tanvir Ahmed (Bogura): Username: <code class="font-bold">tanvir_sr</code> | Pass: <code class="font-bold">123</code><br>
                • Rafiqul Islam (Gazipur): Username: <code class="font-bold">rafiq_sr</code> | Pass: <code class="font-bold">123</code>
              </div>
            </form>
          </div>

          <!-- Admin Login Form -->
          <div id="adminLoginFormSection" class="hidden">
            <form onsubmit="event.preventDefault(); window.AuthActions.submitAdmin();" class="space-y-4 text-xs">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Username</label>
                <input type="text" id="adminLoginUsername" required value="admin" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Password</label>
                <input type="password" id="adminLoginPassword" required value="123" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm" />
              </div>

              <button type="submit" class="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-black text-sm shadow-lg shadow-purple-700/30 active:scale-95 transition flex items-center justify-center gap-2">
                <i data-lucide="shield" class="w-4 h-4"></i>
                <span>Login to Admin Portal</span>
              </button>

              <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-[11px] text-purple-900 dark:text-purple-300">
                <span class="font-bold">Default Admin:</span> User: <code class="font-bold">admin</code> | Pass: <code class="font-bold">123</code>
              </div>
            </form>
          </div>

          <!-- Language & Theme Switcher on Login -->
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <button onclick="window.AuthActions.toggleLang()" class="flex items-center gap-1 hover:text-brand-600 font-bold">
              <i data-lucide="languages" class="w-3.5 h-3.5"></i>
              <span>${store.lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
            <button onclick="window.AuthActions.toggleTheme()" class="hover:text-brand-600">
              <i data-lucide="${store.theme === 'dark' ? 'sun' : 'moon'}" class="w-4 h-4"></i>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  renderSRManagementSection(): string {
    const srs = store.db.srs;

    return `
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="user-cog" class="w-6 h-6 text-brand-600"></i>
              <span>${store.t('srManagement')}</span>
            </h2>
            <p class="text-xs text-slate-500">Admin creates SR accounts with Username & Password, synced with Firebase Realtime DB.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="window.AuthActions.openAddAdminModal()" class="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow flex items-center gap-1.5 transition active:scale-95" title="Create New Admin Account">
              <i data-lucide="shield-plus" class="w-4 h-4"></i>
              <span>+ Create Admin</span>
            </button>

            <button onclick="window.AuthActions.downloadTemplate()" class="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-sm" title="Download Excel Template">
              <i data-lucide="download" class="w-3.5 h-3.5 text-brand-600"></i>
              <span>Download Template</span>
            </button>

            <input type="file" id="excelSrFileInput" accept=".xlsx, .xls, .csv" class="hidden" onchange="window.AuthActions.handleUpload(event)" />
            <button onclick="document.getElementById('excelSrFileInput').click()" class="px-3.5 py-2 rounded-xl bg-tealbrand-600 hover:bg-tealbrand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm" title="Import SRs from Excel">
              <i data-lucide="file-up" class="w-3.5 h-3.5"></i>
              <span>Import Excel</span>
            </button>

            <button onclick="window.AuthActions.openAddSRModal()" class="px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow flex items-center gap-1.5 hover:bg-brand-500 transition active:scale-95">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              <span>${store.t('addSR')}</span>
            </button>
          </div>
        </div>

        <!-- Registered Admins List Section -->
        <div class="p-5 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-purple-900 dark:text-purple-300">
              <i data-lucide="shield" class="w-5 h-5 text-purple-600"></i>
              <h3 class="font-extrabold text-sm sm:text-base">System Admin Accounts (${(store.db.admins || []).length})</h3>
            </div>
            <button onclick="window.AuthActions.openAddAdminModal()" class="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-sm">
              + New Admin
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            ${(store.db.admins || []).map(a => `
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md">${a.id}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Central Admin</span>
                  </div>
                  <h4 class="font-black text-sm text-slate-900 dark:text-white">${a.name}</h4>
                  <div class="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] font-mono space-y-0.5">
                    <div class="flex justify-between text-slate-500">
                      <span>Username:</span>
                      <span class="font-bold text-purple-700 dark:text-purple-300">${a.username}</span>
                    </div>
                    <div class="flex justify-between text-slate-500">
                      <span>Password:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-100">${a.password}</span>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-2">${a.territory || 'Head Office'} • <span class="font-mono">${a.phone}</span></p>
                </div>
                ${a.username !== 'admin' ? `
                  <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button onclick="window.AuthActions.deleteAdmin('${a.id}')" class="text-xs text-rose-500 hover:underline">Remove</button>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SR Search Bar -->
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div class="relative flex-1 min-w-[260px]">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
            <input 
              type="text" 
              id="srSearchInput"
              placeholder="এসআর আইডি, নাম, ফোন নম্বর, ইউজারনেম অথবা টেরিটরি দিয়ে খুঁজুন..." 
              autocomplete="off"
              class="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 transition" 
            />
            <button id="clearSrSearchBtn" class="hidden absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
          <div id="srCountNotice" class="text-xs font-bold text-slate-500">
            Showing ${srs.length} Field SR Accounts
          </div>
        </div>

        <div id="srCardsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${srs.map(sr => {
            const srOrders = store.db.orders.filter(o => o.srId === sr.id);
            const sales = srOrders.reduce((sum, o) => sum + o.grandTotal, 0);
            return `
              <div 
                class="sr-account-card p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                data-id="${(sr.id || '').toLowerCase()}"
                data-name="${(sr.name || '').toLowerCase()}"
                data-username="${(sr.username || '').toLowerCase()}"
                data-phone="${(sr.phone || '').toLowerCase()}"
                data-territory="${(sr.territory || '').toLowerCase()}"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-mono font-black text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md">${sr.id}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${sr.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${sr.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <h4 class="font-extrabold text-base text-slate-900 dark:text-white">${sr.name}</h4>
                  
                  <div class="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-mono">
                    <div class="flex justify-between text-slate-500">
                      <span>Username:</span>
                      <span class="font-bold text-brand-700 dark:text-brand-300">${sr.username || sr.id.toLowerCase()}</span>
                    </div>
                    <div class="flex justify-between text-slate-500 mt-1">
                      <span>Password:</span>
                      <span class="font-bold text-slate-800 dark:text-slate-100">${sr.password || sr.pin || '123'}</span>
                    </div>
                  </div>

                  <div class="mt-3 space-y-1 text-xs text-slate-500">
                    <div>Territory: <b class="text-slate-800 dark:text-slate-200">${sr.territory}</b></div>
                    <div>Phone: <b class="font-mono">${sr.phone}</b></div>
                    <div>Target: <b>৳${(sr.target || 0).toLocaleString()}</b></div>
                    <div class="text-brand-600 font-black">Sales Booked: ৳${sales.toLocaleString()} (${srOrders.length} orders)</div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button onclick="window.AuthActions.deleteSR('${sr.id}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 text-xs" title="Delete SR">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  attachSearchListener() {
    const input = document.getElementById('srSearchInput') as HTMLInputElement | null;
    const clearBtn = document.getElementById('clearSrSearchBtn');
    const grid = document.getElementById('srCardsGrid');
    const notice = document.getElementById('srCountNotice');

    if (!input || !grid) return;

    const performFilter = (query: string) => {
      const q = query.trim().toLowerCase();
      const cards = grid.querySelectorAll<HTMLElement>('.sr-account-card');
      let visible = 0;

      cards.forEach(card => {
        const id = card.getAttribute('data-id') || '';
        const name = card.getAttribute('data-name') || '';
        const user = card.getAttribute('data-username') || '';
        const phone = card.getAttribute('data-phone') || '';
        const territory = card.getAttribute('data-territory') || '';

        const matches = !q || id.includes(q) || name.includes(q) || user.includes(q) || phone.includes(q) || territory.includes(q);
        if (matches) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (notice) {
        notice.innerText = q ? `Found ${visible} SR(s) matching "${q}"` : `Showing ${cards.length} Field SR Accounts`;
      }
      if (clearBtn) {
        if (q) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
    };

    input.addEventListener('input', (e) => {
      performFilter((e.target as HTMLInputElement).value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') input.blur();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        performFilter('');
        input.focus();
      });
    }
  }

  openAddSRModal(onSaved: () => void) {
    const nextId = `SR${String(store.db.srs.length + 1).padStart(2, '0')}`;
    const modalHtml = `
      <div id="srModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between pb-3 border-b">
            <h3 class="font-extrabold text-base">${store.t('addSR')}</h3>
            <button onclick="document.getElementById('srModal').remove()"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>
          <form id="newSrForm" class="mt-4 space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold mb-1">${store.t('srStaffId')}</label>
                <input type="text" id="newSrId" required value="${nextId}" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold" />
              </div>
              <div>
                <label class="block font-bold mb-1">Full Name *</label>
                <input type="text" id="newSrName" required placeholder="Md. Aminul Islam" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold mb-1">${store.t('srUsername')} *</label>
                <input type="text" id="newSrUsername" required placeholder="amin_sr" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold" />
              </div>
              <div>
                <label class="block font-bold mb-1">${store.t('srPassword')} *</label>
                <input type="text" id="newSrPassword" required value="123" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold" />
              </div>
            </div>

            <div>
              <label class="block font-bold mb-1">Mobile Phone *</label>
              <input type="tel" id="newSrPhone" required placeholder="017XXXXXXXX" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono" />
            </div>

            <div>
              <label class="block font-bold mb-1">Assigned Territory *</label>
              <input type="text" id="newSrTerritory" required placeholder="Bogura Dairy Zone (শেরপুর)" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            </div>

            <div>
              <label class="block font-bold mb-1">${store.t('monthlyTarget')}</label>
              <input type="number" id="newSrTarget" required value="350000" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono" />
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onclick="document.getElementById('srModal').remove()" class="px-4 py-2 border rounded-xl">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl shadow-md">Create SR Account</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if ((window as any).lucide) (window as any).lucide.createIcons();

    const form = document.getElementById('newSrForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const srId = (document.getElementById('newSrId') as HTMLInputElement).value.trim();
        const name = (document.getElementById('newSrName') as HTMLInputElement).value.trim();
        const username = (document.getElementById('newSrUsername') as HTMLInputElement).value.trim().toLowerCase();
        const password = (document.getElementById('newSrPassword') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('newSrPhone') as HTMLInputElement).value.trim();
        const territory = (document.getElementById('newSrTerritory') as HTMLInputElement).value.trim();
        const target = Number((document.getElementById('newSrTarget') as HTMLInputElement).value) || 300000;

        const newSr: SRUser = {
          id: srId,
          username: username,
          password: password,
          name: name,
          phone: phone,
          territory: territory,
          target: target,
          active: true
        };

        store.db.srs.push(newSr);
        store.saveDatabase();
        document.getElementById('srModal')?.remove();
        onSaved();
      });
    }
  }

  openAddAdminModal(onSaved: () => void) {
    const adminsCount = (store.db.admins || []).length;
    const nextId = `ADMIN${String(adminsCount + 1).padStart(2, '0')}`;
    const modalHtml = `
      <div id="adminCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-200 dark:border-purple-900">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
              <h3 class="font-extrabold text-base">Create New Admin Account</h3>
            </div>
            <button onclick="document.getElementById('adminCreateModal').remove()"><i data-lucide="x" class="w-5 h-5"></i></button>
          </div>

          <form id="newAdminForm" class="mt-4 space-y-3.5 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold mb-1">Admin ID</label>
                <input type="text" id="newAdminId" required value="${nextId}" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold" />
              </div>
              <div>
                <label class="block font-bold mb-1">Admin Full Name *</label>
                <input type="text" id="newAdminName" required placeholder="e.g. Md. Tariqul Islam" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold mb-1">Login Username *</label>
                <input type="text" id="newAdminUsername" required placeholder="tariq_admin" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold" />
              </div>
              <div>
                <label class="block font-bold mb-1">Login Password *</label>
                <input type="text" id="newAdminPassword" required value="123" placeholder="Set Password" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold mb-1">Mobile Phone *</label>
                <input type="tel" id="newAdminPhone" required placeholder="017XXXXXXXX" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div>
                <label class="block font-bold mb-1">Department / Branch *</label>
                <input type="text" id="newAdminTerritory" required value="Head Office (Central HQ)" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium" />
              </div>
            </div>

            <div>
              <label class="block font-bold mb-1">Email (Optional)</label>
              <input type="email" id="newAdminEmail" placeholder="admin@bhagroltd.com" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono" />
            </div>

            <div class="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-300">
              ℹ️ এই অ্যাডমিন অ্যাকাউন্টটি তৈরি করার সাথে সাথেই Firebase Realtime Database এ সিঙ্ক হয়ে যাবে এবং যেকোনো ডিভাইস থেকে এই ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করা যাবে।
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t">
              <button type="button" onclick="document.getElementById('adminCreateModal').remove()" class="px-4 py-2 border rounded-xl font-bold">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl shadow-md">Create Admin Account</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if ((window as any).lucide) (window as any).lucide.createIcons();

    const form = document.getElementById('newAdminForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const adminId = (document.getElementById('newAdminId') as HTMLInputElement).value.trim();
        const name = (document.getElementById('newAdminName') as HTMLInputElement).value.trim();
        const username = (document.getElementById('newAdminUsername') as HTMLInputElement).value.trim().toLowerCase();
        const password = (document.getElementById('newAdminPassword') as HTMLInputElement).value.trim();
        const phone = (document.getElementById('newAdminPhone') as HTMLInputElement).value.trim();
        const territory = (document.getElementById('newAdminTerritory') as HTMLInputElement).value.trim();
        const email = (document.getElementById('newAdminEmail') as HTMLInputElement).value.trim() || `${username}@bhagroltd.com`;

        if (!store.db.admins) store.db.admins = [];

        // Check if username already exists
        if (store.db.admins.some(a => a.username === username)) {
          showToast('This username is already taken by another admin!', 'error');
          return;
        }

        const newAdmin: AdminUser = {
          id: adminId,
          username: username,
          password: password,
          name: name,
          phone: phone,
          territory: territory,
          email: email,
          role: 'admin'
        };

        store.db.admins.push(newAdmin);
        store.saveDatabase();
        document.getElementById('adminCreateModal')?.remove();
        onSaved();
      });
    }
  }
}

export const authModule = new AuthModule();
