/**
 * BH Agro Ltd. - Sales Reports & SheetJS Excel Export Module
 * Includes SR-wise, Customer-wise, Day-wise, Product-wise, and Stock Valuation reports
 */

import { store } from './store.ts';

export class ReportModule {
  renderReportsSection(): string {
    const orders = store.db.orders;
    const srs = store.db.srs;
    const customers = store.db.customers;

    // 1. SR-wise aggregation
    const srReportList = srs.map(sr => {
      const srOrders = orders.filter(o => o.srId === sr.id);
      const totalAmount = srOrders.reduce((acc, o) => acc + o.grandTotal, 0);
      const totalItems = srOrders.reduce((acc, o) => acc + o.items.reduce((s, it) => s + it.qty, 0), 0);
      const target = sr.target || 350000;
      const pct = Math.min(100, Math.round((totalAmount / target) * 100));

      return {
        id: sr.id,
        name: sr.name,
        territory: sr.territory,
        phone: sr.phone,
        target: target,
        orderCount: srOrders.length,
        totalItems: totalItems,
        totalAmount: totalAmount,
        achievementPct: pct
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);

    // 2. Customer-wise aggregation
    const custReportMap: Record<string, {
      id: string;
      shopName: string;
      name: string;
      category: string;
      territory: string;
      phone: string;
      orderCount: number;
      totalItems: number;
      totalAmount: number;
      balance: number;
      creditLimit: number;
    }> = {};

    // Initialize with all approved customers
    customers.forEach(c => {
      custReportMap[c.id] = {
        id: c.id,
        shopName: c.shopName,
        name: c.name,
        category: c.category,
        territory: c.territory,
        phone: c.phone,
        orderCount: 0,
        totalItems: 0,
        totalAmount: 0,
        balance: c.balance || 0,
        creditLimit: c.creditLimit || 0
      };
    });

    // Populate order totals
    orders.forEach(o => {
      if (custReportMap[o.customerId]) {
        custReportMap[o.customerId].orderCount += 1;
        custReportMap[o.customerId].totalAmount += o.grandTotal;
        custReportMap[o.customerId].totalItems += o.items.reduce((s, it) => s + it.qty, 0);
      }
    });

    const custReportList = Object.values(custReportMap).sort((a, b) => b.totalAmount - a.totalAmount);

    // 3. Day-wise aggregation
    const daywiseMap: Record<string, { date: string; orderCount: number; totalAmount: number; totalItems: number }> = {};
    orders.forEach(o => {
      if (!daywiseMap[o.date]) {
        daywiseMap[o.date] = { date: o.date, orderCount: 0, totalAmount: 0, totalItems: 0 };
      }
      daywiseMap[o.date].orderCount += 1;
      daywiseMap[o.date].totalAmount += o.grandTotal;
      daywiseMap[o.date].totalItems += o.items.reduce((s, it) => s + it.qty, 0);
    });
    const daywiseList = Object.values(daywiseMap).sort((a, b) => b.date.localeCompare(a.date));

    // 4. Product-wise aggregation
    const prodSalesMap: Record<string, { name: string; packSize: string; totalQty: number; totalRevenue: number }> = {};
    orders.forEach(o => {
      o.items.forEach(it => {
        if (!prodSalesMap[it.productId]) {
          prodSalesMap[it.productId] = { name: it.name, packSize: it.packSize, totalQty: 0, totalRevenue: 0 };
        }
        prodSalesMap[it.productId].totalQty += it.qty;
        prodSalesMap[it.productId].totalRevenue += it.total;
      });
    });
    const prodSalesList = Object.values(prodSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return `
      <div class="space-y-8">
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="bar-chart-3" class="w-6 h-6 text-brand-600"></i>
              <span>${store.t('reportsAnalytics')} - BH Agro Ltd.</span>
            </h2>
            <p class="text-xs text-slate-500">Comprehensive SR-wise, Customer-wise, Day-wise, and Inventory reports with instant SheetJS Excel export.</p>
          </div>
        </div>

        <!-- 1. SR-WISE SALES REPORT (NEW) -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600"><i data-lucide="trophy" class="w-4 h-4"></i></div>
              <div>
                <h3 class="font-extrabold text-sm sm:text-base">${store.t('srWiseReport')}</h3>
                <p class="text-[11px] text-slate-400">Territory performance and monthly sales target achievements</p>
              </div>
            </div>
            <button onclick="window.ReportActions.exportSRWise()" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Export SR Report (.xlsx)</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase">
                  <th class="pb-2">SR ID</th>
                  <th class="pb-2">SR Name</th>
                  <th class="pb-2">Territory</th>
                  <th class="pb-2">Monthly Target (৳)</th>
                  <th class="pb-2">Orders Placed</th>
                  <th class="pb-2">Units Sold</th>
                  <th class="pb-2">Achieved Sales (৳)</th>
                  <th class="pb-2 text-right">Target Progress</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                ${srReportList.map(sr => `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 font-mono font-bold text-brand-700 dark:text-brand-400">${sr.id}</td>
                    <td class="py-3 font-bold text-slate-900 dark:text-white">
                      ${sr.name}
                      <div class="text-[10px] text-slate-400 font-normal font-mono">${sr.phone}</div>
                    </td>
                    <td class="py-3 text-slate-600 dark:text-slate-300">${sr.territory}</td>
                    <td class="py-3 font-mono text-slate-500">৳${sr.target.toLocaleString()}</td>
                    <td class="py-3 font-bold text-slate-700 dark:text-slate-300">${sr.orderCount} orders</td>
                    <td class="py-3 text-slate-500">${sr.totalItems} units</td>
                    <td class="py-3 font-black text-brand-700 dark:text-brand-400">৳${sr.totalAmount.toLocaleString()}</td>
                    <td class="py-3 text-right">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        sr.achievementPct >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        (sr.achievementPct >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300')
                      }">
                        ${sr.achievementPct}%
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. CUSTOMER-WISE SALES REPORT (NEW) -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600"><i data-lucide="users" class="w-4 h-4"></i></div>
              <div>
                <h3 class="font-extrabold text-sm sm:text-base">${store.t('customerWiseReport')}</h3>
                <p class="text-[11px] text-slate-400">Farm, store and pharmacy purchase volumes and balances</p>
              </div>
            </div>
            <button onclick="window.ReportActions.exportCustomerWise()" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Export Customer Report (.xlsx)</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase">
                  <th class="pb-2">Customer ID</th>
                  <th class="pb-2">Shop / Farm Name</th>
                  <th class="pb-2">Category</th>
                  <th class="pb-2">Territory</th>
                  <th class="pb-2">Orders Placed</th>
                  <th class="pb-2">Units Purchased</th>
                  <th class="pb-2">Total Amount (৳)</th>
                  <th class="pb-2 text-right">Balance Due (৳)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                ${custReportList.map(c => `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 font-mono font-bold text-brand-700 dark:text-brand-400">${c.id}</td>
                    <td class="py-3 font-bold text-slate-900 dark:text-white">
                      ${c.shopName}
                      <div class="text-[10px] text-slate-400 font-normal">${c.name} • ${c.phone}</div>
                    </td>
                    <td class="py-3 uppercase text-[10px] font-bold text-slate-500">${c.category.replace('_', ' ')}</td>
                    <td class="py-3 text-slate-600 dark:text-slate-300">${c.territory}</td>
                    <td class="py-3 font-bold text-slate-700 dark:text-slate-300">${c.orderCount} orders</td>
                    <td class="py-3 text-slate-500">${c.totalItems} units</td>
                    <td class="py-3 font-black text-blue-700 dark:text-blue-400">৳${c.totalAmount.toLocaleString()}</td>
                    <td class="py-3 text-right font-mono font-bold ${c.balance > 0 ? 'text-amber-600' : 'text-slate-400'}">
                      ৳${c.balance.toLocaleString()}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. DAY-WISE SALES REPORT -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600"><i data-lucide="calendar" class="w-4 h-4"></i></div>
              <h3 class="font-extrabold text-sm sm:text-base">${store.t('daywiseSales')}</h3>
            </div>
            <button onclick="window.ReportActions.exportDaywise()" class="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>${store.t('exportExcel')}</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase">
                  <th class="pb-2">Date</th>
                  <th class="pb-2">Orders Placed</th>
                  <th class="pb-2">Units Sold</th>
                  <th class="pb-2 text-right">Total Revenue (৳)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                ${daywiseList.map(d => `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-2.5 font-mono font-bold">${d.date}</td>
                    <td class="py-2.5">${d.orderCount} orders</td>
                    <td class="py-2.5">${d.totalItems} units</td>
                    <td class="py-2.5 text-right font-black text-brand-700 dark:text-brand-400">৳${d.totalAmount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. PRODUCT-WISE SALES REPORT -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600"><i data-lucide="pie-chart" class="w-4 h-4"></i></div>
              <h3 class="font-extrabold text-sm sm:text-base">${store.t('productwiseSales')}</h3>
            </div>
            <button onclick="window.ReportActions.exportProductSales()" class="px-3.5 py-1.5 rounded-xl bg-tealbrand-600 hover:bg-tealbrand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>${store.t('exportExcel')}</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase">
                  <th class="pb-2">Product Name</th>
                  <th class="pb-2">Packing</th>
                  <th class="pb-2">Quantity Sold</th>
                  <th class="pb-2 text-right">Gross Sales (৳)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                ${prodSalesList.map(p => `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-2.5 font-bold text-slate-900 dark:text-white">${p.name}</td>
                    <td class="py-2.5 text-slate-500">${p.packSize}</td>
                    <td class="py-2.5 font-bold text-slate-700 dark:text-slate-300">${p.totalQty} units</td>
                    <td class="py-2.5 text-right font-black text-tealbrand-700 dark:text-tealbrand-400">৳${p.totalRevenue.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. INVENTORY & STOCK VALUATION REPORT -->
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600"><i data-lucide="archive" class="w-4 h-4"></i></div>
              <h3 class="font-extrabold text-sm sm:text-base">${store.t('inventoryReport')}</h3>
            </div>
            <button onclick="window.ReportActions.exportStock()" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>${store.t('exportExcel')}</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 uppercase">
                  <th class="pb-2">SKU</th>
                  <th class="pb-2">Product</th>
                  <th class="pb-2">Current Stock</th>
                  <th class="pb-2">Unit TP</th>
                  <th class="pb-2 text-right">Total TP Valuation (৳)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                ${store.db.products.map(p => `
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-2 font-mono text-slate-400">${p.sku}</td>
                    <td class="py-2 font-bold">${p.name}</td>
                    <td class="py-2">
                      <span class="font-bold ${p.stock < 50 ? 'text-rose-600' : ''}">${p.stock}</span>
                    </td>
                    <td class="py-2">৳${p.tradePrice}</td>
                    <td class="py-2 text-right font-black">৳${(p.stock * p.tradePrice).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  exportSRWiseToExcel(showToast: (m: string) => void) {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return;

    const orders = store.db.orders;
    const rows = store.db.srs.map(sr => {
      const srOrders = orders.filter(o => o.srId === sr.id);
      const totalAmount = srOrders.reduce((acc, o) => acc + o.grandTotal, 0);
      const totalItems = srOrders.reduce((acc, o) => acc + o.items.reduce((s, it) => s + it.qty, 0), 0);
      const target = sr.target || 350000;
      const pct = Math.min(100, Math.round((totalAmount / target) * 100));

      return {
        'SR ID': sr.id,
        'SR Name': sr.name,
        'Territory': sr.territory,
        'Mobile': sr.phone,
        'Monthly Target (BDT)': target,
        'Total Orders Placed': srOrders.length,
        'Total Units Sold': totalItems,
        'Achieved Revenue (BDT)': totalAmount,
        'Target Achievement %': `${pct}%`
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SR_Wise_Sales");
    XLSX.writeFile(wb, `BH_Agro_SR_Wise_Sales_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("SR-wise sales report exported to Excel!");
  }

  exportCustomerWiseToExcel(showToast: (m: string) => void) {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return;

    const orders = store.db.orders;
    const custMap: Record<string, any> = {};

    store.db.customers.forEach(c => {
      custMap[c.id] = {
        'Customer ID': c.id,
        'Shop / Farm Name': c.shopName,
        'Proprietor Name': c.name,
        'Category': c.category,
        'Territory': c.territory,
        'Mobile': c.phone,
        'Total Orders Placed': 0,
        'Total Units Purchased': 0,
        'Total Revenue (BDT)': 0,
        'Credit Limit': c.creditLimit || 0,
        'Current Balance': c.balance || 0
      };
    });

    orders.forEach(o => {
      if (custMap[o.customerId]) {
        custMap[o.customerId]['Total Orders Placed'] += 1;
        custMap[o.customerId]['Total Revenue (BDT)'] += o.grandTotal;
        custMap[o.customerId]['Total Units Purchased'] += o.items.reduce((s, it) => s + it.qty, 0);
      }
    });

    const ws = XLSX.utils.json_to_sheet(Object.values(custMap));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer_Wise_Sales");
    XLSX.writeFile(wb, `BH_Agro_Customer_Wise_Sales_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("Customer-wise sales report exported to Excel!");
  }

  exportDaywiseToExcel(showToast: (m: string) => void) {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return;

    const rows = store.db.orders.map(o => ({
      'Order ID': o.id,
      'Date': o.date,
      'SR Name': o.srName,
      'Customer ID': o.customerId,
      'Customer / Farm': o.customerShopName || o.customerName,
      'Full Address': o.customerAddress || o.territory,
      'Items Count': o.items.length,
      'Subtotal (TP)': o.subtotal,
      'Discount': o.discount,
      'Net Payable (BDT)': o.grandTotal,
      'Status': o.status
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daywise_Sales");
    XLSX.writeFile(wb, `BH_Agro_Daywise_Sales_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("Day-wise sales exported to Excel!");
  }

  exportProductSalesToExcel(showToast: (m: string) => void) {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return;

    const prodMap: Record<string, any> = {};
    store.db.orders.forEach(o => {
      o.items.forEach(it => {
        if (!prodMap[it.name]) {
          prodMap[it.name] = { 'Product Name': it.name, 'Pack Size': it.packSize, 'Unit TP': it.tp, 'Total Quantity Sold': 0, 'Total Revenue (BDT)': 0 };
        }
        prodMap[it.name]['Total Quantity Sold'] += it.qty;
        prodMap[it.name]['Total Revenue (BDT)'] += it.total;
      });
    });
    const ws = XLSX.utils.json_to_sheet(Object.values(prodMap));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Product_Sales");
    XLSX.writeFile(wb, `BH_Agro_Product_Sales_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("Product sales exported to Excel!");
  }

  exportStockToExcel(showToast: (m: string) => void) {
    const XLSX = (window as any).XLSX;
    if (!XLSX) return;

    const rows = store.db.products.map(p => ({
      'SKU': p.sku,
      'Product Name': p.name,
      'Category': p.category,
      'Pack Size': p.packSize,
      'Trade Price (TP)': p.tradePrice,
      'MRP': p.mrp,
      'Stock On Hand': p.stock,
      'Total Valuation (BDT)': p.stock * p.tradePrice,
      'Status': p.stock < 50 ? 'LOW STOCK ALERT' : 'Normal'
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock_Valuation");
    XLSX.writeFile(wb, `BH_Agro_Inventory_Stock_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast("Stock report exported to Excel!");
  }
}

export const reportModule = new ReportModule();
