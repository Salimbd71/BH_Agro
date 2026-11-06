/**
 * BH Agro Ltd. - Stock Management Module
 * Pure Inventory & Stock Control (No Customer selection)
 * Quick stock increment, decrement, and live Firebase sync
 */

import { store, Product } from './store.ts';
import { showToast } from './ui.ts';

export class StockModule {
  renderStockManagementSection(): string {
    const products = store.db.products;
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.tradePrice), 0);

    const categories = [
      { id: 'all', label: 'সকল ক্যাটাগরি' },
      { id: 'low_stock', label: `⚠️ স্বল্প স্টক (< 10) [${lowStockCount}]`, isAlert: true },
      { id: 'out_of_stock', label: `❌ স্টক আউট [${outOfStockCount}]`, isDanger: true },
      { id: 'antibiotics', label: 'অ্যান্টিবায়োটিক (Antibiotics)' },
      { id: 'vaccines', label: 'ভ্যাকসিন (Vaccines)' },
      { id: 'supplements', label: 'সাপ্লিমেন্ট (Supplements)' },
      { id: 'dewormers', label: 'কৃমিনাশক (Dewormers)' },
    ];

    return `
      <div class="space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="boxes" class="w-6 h-6 text-brand-600"></i>
              <span>স্টক ম্যানেজমেন্ট (Stock Management)</span>
            </h2>
            <p class="text-xs text-slate-500">
              এখানে সরাসরি প্রতিটি ওষুধের মজুদ (Stock) বাড়ানো বা কমানো যায়। পরিবর্তন সাথে সাথে ডাটাবেজে সিঙ্ক হয়।
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.ProductActions.openAddModal()" class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>+ নতুন প্রোডাক্ট যোগ</span>
            </button>
          </div>
        </div>

        <!-- Inventory Metrics -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="text-[11px] font-bold uppercase text-slate-400">মোট ওষুধ আইটেম</div>
            <div class="text-xl font-black text-slate-900 dark:text-white mt-0.5">${products.length} টি</div>
            <div class="text-[10px] text-slate-400">সকল রেজিস্টার্ড প্রোডাক্ট</div>
          </div>

          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="text-[11px] font-bold uppercase text-slate-400">মোট মজুদ ইউনিট</div>
            <div class="text-xl font-black text-brand-700 dark:text-brand-400 mt-0.5">${totalUnits.toLocaleString()} টি</div>
            <div class="text-[10px] text-slate-400">ওয়্যারহাউজ মোট স্টক</div>
          </div>

          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm">
            <div class="text-[11px] font-bold uppercase text-rose-600">স্বল্প স্টক আইটেম (&lt;10)</div>
            <div class="text-xl font-black text-rose-600 mt-0.5">${lowStockCount} টি</div>
            <div class="text-[10px] text-rose-400">জরুরি রিস্টক প্রয়োজন</div>
          </div>

          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="text-[11px] font-bold uppercase text-slate-400">মোট স্টক মূল্য (TP)</div>
            <div class="text-xl font-black text-slate-900 dark:text-white mt-0.5">৳${totalInventoryValue.toLocaleString()}</div>
            <div class="text-[10px] text-emerald-600 font-bold">Trade Price মূল্যায়ন</div>
          </div>
        </div>

        <!-- Real-time Search & Category Filter Bar -->
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="flex items-center gap-2 overflow-x-auto pb-1" id="stockCatContainer">
            ${categories.map(cat => `
              <button onclick="window.StockActions.filterCat('${cat.id}')" data-cat="${cat.id}" class="stock-cat-pill px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                cat.id === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : (cat.isAlert ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100' : 
                    (cat.isDanger ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'))
              }">
                ${cat.label}
              </button>
            `).join('')}
          </div>

          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
            <input 
              type="text" 
              id="stockSearchInput"
              placeholder="ওষুধের নাম, বাংলা নাম, SKU কোড অথবা ক্যাটাগরি দিয়ে সার্চ করুন..." 
              autocomplete="off"
              class="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-brand-500 transition" 
            />
            <button id="clearStockSearchBtn" class="hidden absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div id="stockCountNotice" class="text-xs font-semibold text-slate-500 px-1">
          Showing ${products.length} medicines in inventory
        </div>

        <!-- Stock Management List -->
        <div id="stockProductGrid" class="space-y-3">
          ${products.map(p => this.renderStockRow(p)).join('')}
        </div>
      </div>
    `;
  }

  renderStockRow(p: Product): string {
    const isOut = p.stock <= 0;
    const isLow = p.stock > 0 && p.stock < 10;

    return `
      <div 
        class="stock-item-row p-4 rounded-2xl bg-white dark:bg-slate-900 border ${isOut ? 'border-rose-300 dark:border-rose-900/60' : (isLow ? 'border-amber-300 dark:border-amber-900/60' : 'border-slate-200 dark:border-slate-800')} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:shadow-md"
        data-id="${p.id}"
        data-name="${(p.name || '').toLowerCase()} ${(p.bnName || '').toLowerCase()}"
        data-sku="${(p.sku || '').toLowerCase()}"
        data-cat="${p.category}"
        data-stock="${p.stock}"
      >
        <!-- Product Details -->
        <div class="space-y-1 min-w-0 md:max-w-md">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-xs text-brand-700 dark:text-brand-400">${p.sku}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${p.category}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-extrabold ${
              isOut ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
              (isLow ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300')
            }">
              ${isOut ? '❌ স্টক নেই (Out of Stock)' : (isLow ? `⚠️ স্বল্প স্টক (${p.stock})` : `ইন স্টক: ${p.stock}`)}
            </span>
          </div>

          <h4 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
            ${p.name}
          </h4>
          <p class="text-xs text-slate-500 font-medium">${p.bnName} • ${p.packSize} • ব্যাচ: <span class="font-mono">${p.batchNo || 'B26'}</span></p>

          <div class="text-xs font-bold text-brand-700 dark:text-brand-400 flex items-center gap-3 pt-0.5">
            <span>TP: <b>৳${p.tradePrice}</b></span>
            <span class="text-slate-400 font-normal">MRP: ৳${p.mrp}</span>
            ${p.tradeOffer ? `<span class="text-tealbrand-600 font-semibold">• ${p.tradeOffer}</span>` : ''}
          </div>
        </div>

        <!-- Interactive Stock Adjuster -->
        <div class="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
          
          <!-- Decrement Controls -->
          <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button onclick="window.StockActions.adjustStock('${p.id}', -10)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 shadow-sm transition active:scale-95" title="মজুদ ১০ কমান (-10)">
              -10
            </button>
            <button onclick="window.StockActions.adjustStock('${p.id}', -1)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-600 shadow-sm flex items-center justify-center transition active:scale-95" title="মজুদ ১ কমান (-1)">
              <i data-lucide="minus" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Current Stock Input Field -->
          <div class="flex items-center gap-1.5">
            <div class="text-center">
              <span class="text-[10px] font-bold text-slate-400 block">বর্তমান স্টক</span>
              <input 
                type="number" 
                id="stockInput-${p.id}" 
                value="${p.stock}" 
                min="0"
                class="w-20 px-2 py-1.5 text-sm font-black rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-brand-500 shadow-inner" 
              />
            </div>
            <button onclick="window.StockActions.saveExactStock('${p.id}')" class="mt-3.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition active:scale-95" title="Save Stock">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>সেভ</span>
            </button>
          </div>

          <!-- Increment Controls -->
          <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button onclick="window.StockActions.adjustStock('${p.id}', 1)" class="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm flex items-center justify-center transition active:scale-95" title="মজুদ ১ বাড়ান (+1)">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="window.StockActions.adjustStock('${p.id}', 10)" class="px-2.5 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 shadow-sm transition active:scale-95" title="মজুদ ১০ বাড়ান (+10)">
              +10
            </button>
            <button onclick="window.StockActions.adjustStock('${p.id}', 50)" class="px-2.5 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 shadow-sm transition active:scale-95" title="মজুদ ৫০ বাড়ান (+50)">
              +50
            </button>
            <button onclick="window.StockActions.adjustStock('${p.id}', 100)" class="px-2.5 h-8 rounded-lg bg-white dark:bg-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 shadow-sm transition active:scale-95" title="মজুদ ১০০ বাড়ান (+100)">
              +100
            </button>
          </div>

        </div>
      </div>
    `;
  }

  attachSearchListener() {
    const input = document.getElementById('stockSearchInput') as HTMLInputElement | null;
    const clearBtn = document.getElementById('clearStockSearchBtn');
    const grid = document.getElementById('stockProductGrid');
    const notice = document.getElementById('stockCountNotice');

    if (!input || !grid) return;

    let selectedCat = 'all';

    (window as any).StockActions = {
      filterCat: (catId: string) => {
        selectedCat = catId;
        const pills = document.querySelectorAll('.stock-cat-pill');
        pills.forEach(p => {
          const c = p.getAttribute('data-cat');
          if (c === catId) {
            p.className = 'stock-cat-pill px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-brand-600 text-white shadow-sm';
          } else {
            p.className = 'stock-cat-pill px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200';
          }
        });
        performFilter();
      },
      adjustStock: (pId: string, diff: number) => {
        const p = store.db.products.find(prod => prod.id === pId);
        if (!p) return;
        const newStock = Math.max(0, p.stock + diff);
        p.stock = newStock;
        store.saveDatabase();

        // Update row DOM without losing search input focus
        const rowInput = document.getElementById(`stockInput-${pId}`) as HTMLInputElement | null;
        if (rowInput) rowInput.value = String(newStock);

        const card = document.querySelector(`.stock-item-row[data-id="${pId}"]`);
        if (card) {
          card.setAttribute('data-stock', String(newStock));
        }

        showToast(`${p.name} এর স্টক ${diff > 0 ? `+${diff}` : diff} করা হয়েছে। বর্তমান স্টক: ${newStock}`);
        performFilter();
      },
      saveExactStock: (pId: string) => {
        const p = store.db.products.find(prod => prod.id === pId);
        const rowInput = document.getElementById(`stockInput-${pId}`) as HTMLInputElement | null;
        if (!p || !rowInput) return;
        const val = Math.max(0, parseInt(rowInput.value, 10) || 0);
        p.stock = val;
        store.saveDatabase();

        const card = document.querySelector(`.stock-item-row[data-id="${pId}"]`);
        if (card) {
          card.setAttribute('data-stock', String(val));
        }

        showToast(`${p.name} এর নতুন স্টক ${val} সংরক্ষিত হয়েছে!`);
        performFilter();
      }
    };

    const performFilter = () => {
      const q = input.value.trim().toLowerCase();
      const cards = grid.querySelectorAll<HTMLElement>('.stock-item-row');
      let visible = 0;

      cards.forEach(card => {
        const name = card.getAttribute('data-name') || '';
        const sku = card.getAttribute('data-sku') || '';
        const cat = card.getAttribute('data-cat') || '';
        const stock = parseInt(card.getAttribute('data-stock') || '0', 10);

        let matchesCat = false;
        if (selectedCat === 'all') {
          matchesCat = true;
        } else if (selectedCat === 'low_stock') {
          matchesCat = stock > 0 && stock < 10;
        } else if (selectedCat === 'out_of_stock') {
          matchesCat = stock <= 0;
        } else {
          matchesCat = cat === selectedCat;
        }

        const matchesQuery = !q || name.includes(q) || sku.includes(q) || cat.includes(q);

        if (matchesCat && matchesQuery) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (notice) {
        notice.innerText = `Showing ${visible} of ${cards.length} medicines in inventory`;
      }
      if (clearBtn) {
        if (q) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
      }
    };

    input.addEventListener('input', () => {
      performFilter();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        input.blur();
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        performFilter();
        input.focus();
      });
    }
  }
}

export const stockModule = new StockModule();
