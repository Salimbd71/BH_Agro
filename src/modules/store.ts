/**
 * Bioherbs Agrovet - Store & State Management Module
 * Synchronized with Firebase Realtime Database & LocalStorage
 */

export interface Product {
  id: string;
  name: string;
  bnName: string;
  sku: string;
  category: 'antibiotics' | 'vaccines' | 'supplements' | 'dewormers';
  packSize: string;
  tradePrice: number;
  mrp: number;
  stock: number;
  tradeOffer: string;
  batchNo: string;
  dosage?: string;
}

export interface Customer {
  id: string; // e.g. BH0001, BH0002...
  name: string;
  shopName: string;
  bnShopName?: string;
  phone: string;
  category: 'dairy_farm' | 'poultry_farm' | 'pharmacy' | 'feed_mill';
  address: string; // Full address provided during registration
  territory: string;
  status: 'approved' | 'pending';
  creditLimit: number;
  balance: number;
  createdBy: string;
  assignedSrId?: string; // SR ID to whom this customer is assigned (e.g. SR01, SR02)
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  packSize: string;
  qty: number;
  freeQty: number;
  tp: number;
  total: number;
}

export interface Order {
  id: string;
  date: string;
  srId: string;
  srName: string;
  customerId: string;
  customerShopName: string;
  customerName: string;
  customerAddress: string;
  territory: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  status: 'confirmed';
  paymentStatus: string;
  notes?: string;
}

export interface SRUser {
  id: string;
  username: string;
  password: string;
  name: string;
  bnName?: string;
  phone: string;
  territory: string;
  email?: string;
  target: number;
  active: boolean;
  pin?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  bnName?: string;
  phone: string;
  territory: string;
  email?: string;
  role: 'admin';
  pin?: string;
}

export const DB_STORAGE_KEY = 'bioherbs_agrovet_db_v3';
export const FIREBASE_CONFIG_KEY = 'bioherbs_agrovet_fb_config';
export const PREF_LANG_KEY = 'bioherbs_lang';
export const PREF_THEME_KEY = 'bioherbs_theme';
export const SESSION_AUTH_KEY = 'bioherbs_auth_session';

export const INITIAL_SR_LIST: SRUser[] = [
  { id: 'SR01', username: 'rafiq_sr', password: '123', name: 'Md. Rafiqul Islam', bnName: 'মোঃ রফিকুল ইসলাম', phone: '01711-234567', territory: 'Gazipur (শ্রীপুর-জয়দেবপুর)', email: 'rafiq.sr@bhagroltd.com', target: 350000, active: true },
  { id: 'SR02', username: 'tanvir_sr', password: '123', name: 'Tanvir Ahmed', bnName: 'তানভীর আহমেদ', phone: '01822-345678', territory: 'Bogura Dairy Zone (শেরপুর)', email: 'tanvir.sr@bhagroltd.com', target: 420000, active: true },
  { id: 'SR03', username: 'kamrul_sr', password: '123', name: 'Kamrul Hasan', bnName: 'কামরুল হাসান', phone: '01933-456789', territory: 'Mymensingh Poultry Belt (ভালুকা)', email: 'kamrul.sr@bhagroltd.com', target: 380000, active: true },
];

export const ADMIN_USER: AdminUser = {
  id: 'ADMIN01',
  username: 'admin',
  password: '123',
  name: 'Dr. Nazmul Huda',
  bnName: 'ডাঃ নাজমুল হুদা',
  phone: '01700-112233',
  territory: 'Head Office (Dhaka Central)',
  email: 'admin@bhagroltd.com',
  role: 'admin'
};

export const INITIAL_PRODUCTS: Product[] = [
  // Antibiotics
  { id: 'PROD-01', name: 'Ciprovet-Vet 100ml', bnName: 'সিপ্রোভেট-ভেট ১০০ মি.লি.', sku: 'BHA-ANT-001', category: 'antibiotics', packSize: '100 ml Bottle', tradePrice: 280, mrp: 330, stock: 240, tradeOffer: '10+1 Free', batchNo: 'B26-084', dosage: 'Poultry: 1ml / 2L water' },
  { id: 'PROD-02', name: 'Amoxicillin-Vet 100g WSP', bnName: 'অ্যামোক্সিসিলিন-ভেট ১০০ গ্রাম', sku: 'BHA-ANT-002', category: 'antibiotics', packSize: '100 gm Sachet', tradePrice: 350, mrp: 410, stock: 180, tradeOffer: '5% Cash Discount', batchNo: 'B26-092', dosage: 'Broiler & Layer bacterial cure' },
  { id: 'PROD-03', name: 'Colistin DS Powder 100g', bnName: 'কলিস্টিন ডিএস পাউডার ১০০ গ্রাম', sku: 'BHA-ANT-003', category: 'antibiotics', packSize: '100 gm Pack', tradePrice: 420, mrp: 495, stock: 120, tradeOffer: '20+2 Free', batchNo: 'B26-077', dosage: 'Specific for E. coli & Salmonella' },
  { id: 'PROD-04', name: 'Oxyvet LA Inj 50ml', bnName: 'অক্সিভেট এলএ ইনজেকশন ৫০ মি.লি.', sku: 'BHA-ANT-004', category: 'antibiotics', packSize: '50 ml Vial', tradePrice: 260, mrp: 310, stock: 95, tradeOffer: '15+1 Free', batchNo: 'B26-105', dosage: 'Long acting cattle antibiotic' },
  { id: 'PROD-05', name: 'Gentasol-Vet 100ml', bnName: 'জেন্টাসল-ভেট ১০০ মি.লি.', sku: 'BHA-ANT-005', category: 'antibiotics', packSize: '100 ml Vial', tradePrice: 195, mrp: 235, stock: 32, tradeOffer: 'Standard', batchNo: 'B26-061', dosage: 'Broad spectrum injectable' },

  // Vaccines
  { id: 'PROD-06', name: 'Bio-Gumboro Live (1000D)', bnName: 'বায়ো-গামবোরো লাইভ (১০০০ ডোজ)', sku: 'BHA-VAC-001', category: 'vaccines', packSize: '1000 Dose Vial', tradePrice: 450, mrp: 520, stock: 300, tradeOffer: 'Strict Cold Chain', batchNo: 'VAC-26-03', dosage: 'Poultry IBD protection' },
  { id: 'PROD-07', name: 'ND Clone 30 Lasota (1000D)', bnName: 'এনডি ক্লোন ৩০ লাসোটা (১০০০ ডোজ)', sku: 'BHA-VAC-002', category: 'vaccines', packSize: '1000 Dose Vial', tradePrice: 380, mrp: 440, stock: 250, tradeOffer: 'Cold Chain', batchNo: 'VAC-26-09', dosage: 'Newcastle Disease prevention' },
  { id: 'PROD-08', name: 'Bio-FMD Inactivated (50D)', bnName: 'বায়ো-এফএমডি ভ্যাকসিন (৫০ ডোজ)', sku: 'BHA-VAC-003', category: 'vaccines', packSize: '100 ml Vial', tradePrice: 1850, mrp: 2150, stock: 65, tradeOffer: 'Free Icebox with 5 vials', batchNo: 'VAC-26-14', dosage: 'Cattle Foot & Mouth Disease' },
  { id: 'PROD-09', name: 'Anthrax Spore Vaccine (50D)', bnName: 'অ্যানথ্রাক্স স্পোর ভ্যাকসিন (৫০ ডোজ)', sku: 'BHA-VAC-004', category: 'vaccines', packSize: '50 ml Vial', tradePrice: 320, mrp: 390, stock: 18, tradeOffer: 'Cold Chain', batchNo: 'VAC-26-02', dosage: 'Cattle & Sheep anthrax control' },

  // Feed Supplements & Vitamins
  { id: 'PROD-10', name: 'Bio-CalPlex 5 Litre', bnName: 'বায়ো-ক্যালপ্লেক্স ৫ লিটার', sku: 'BHA-SUP-001', category: 'supplements', packSize: '5 Litre Jar', tradePrice: 820, mrp: 980, stock: 140, tradeOffer: 'Buy 5 Jars get 1 Mineral 1kg Free', batchNo: 'SUP-26-44', dosage: 'High potency Dairy Calcium + D3' },
  { id: 'PROD-11', name: 'Aminovit Plus Liquid 1L', bnName: 'অ্যামিনোভিট প্লাস লিকুইড ১ লি.', sku: 'BHA-SUP-002', category: 'supplements', packSize: '1 Litre Bottle', tradePrice: 650, mrp: 770, stock: 210, tradeOffer: '12+1 Free', batchNo: 'SUP-26-52', dosage: 'Essential Amino Acids & Multivitamin' },
  { id: 'PROD-12', name: 'Hepato-Care Liquid 1L', bnName: 'হেপাটো-কেয়ার লিকুইড ১ লিটার', sku: 'BHA-SUP-003', category: 'supplements', packSize: '1 Litre Bottle', tradePrice: 480, mrp: 575, stock: 165, tradeOffer: '10+1 Free', batchNo: 'SUP-26-38', dosage: 'Herbal Liver tonic & Antitoxin' },
  { id: 'PROD-13', name: 'Toxi-Bind Powder 1kg', bnName: 'টক্সি-বাইন্ড পাউডার ১ কেজি', sku: 'BHA-SUP-004', category: 'supplements', packSize: '1 kg Foil Pack', tradePrice: 390, mrp: 460, stock: 190, tradeOffer: '20+2 Free', batchNo: 'SUP-26-81', dosage: 'Mycotoxin binder with MOS' },
  { id: 'PROD-14', name: 'Bio-Electrolyte WS 500g', bnName: 'বায়ো-ইলেক্ট্রোলাইট ডব্লিউএস ৫০০ গ্রাম', sku: 'BHA-SUP-005', category: 'supplements', packSize: '500 gm Pack', tradePrice: 210, mrp: 255, stock: 320, tradeOffer: '25+3 Free', batchNo: 'SUP-26-90', dosage: 'Heat stress relief for poultry & dairy' },

  // Dewormers
  { id: 'PROD-15', name: 'Albendazole-Vet Bolus (10x4)', bnName: 'অ্যালবেনডাজল-ভেট বোলাস', sku: 'BHA-DEW-001', category: 'dewormers', packSize: 'Box of 40 Bolus', tradePrice: 380, mrp: 450, stock: 110, tradeOffer: '10+1 Free', batchNo: 'DEW-26-11', dosage: 'Broad spectrum dewormer' },
  { id: 'PROD-16', name: 'Levamisole + Tricla 100ml', bnName: 'লেভামিসল + ট্রাইক্লা ১০০ মি.লি.', sku: 'BHA-DEW-002', category: 'dewormers', packSize: '100 ml Bottle', tradePrice: 290, mrp: 345, stock: 85, tradeOffer: '15+1 Free', batchNo: 'DEW-26-24', dosage: 'Liver fluke & roundworm cure' },
  { id: 'PROD-17', name: 'Ivervet 1% Inj 50ml', bnName: 'আইভারভেট ১% ইনজেকশন ৫০ মি.লি.', sku: 'BHA-DEW-003', category: 'dewormers', packSize: '50 ml Vial', tradePrice: 340, mrp: 410, stock: 130, tradeOffer: '10+1 Free', batchNo: 'DEW-26-30', dosage: 'Endo & Ectoparasiticide' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'BH0001', name: 'Haji Nurul Islam', shopName: 'Green Valley Dairy Farm', bnShopName: 'গ্রিন ভ্যালি ডেইরি ফার্ম', phone: '01712-349876', category: 'dairy_farm', address: 'Bhawal Mirzapur, Gazipur Sadar, Gazipur', territory: 'Gazipur (শ্রীপুর-জয়দেবপুর)', status: 'approved', creditLimit: 150000, balance: 24500, createdBy: 'SR01', assignedSrId: 'SR01' },
  { id: 'BH0002', name: 'Md. Aminul Islam', shopName: 'Amin Feed', bnShopName: 'আমিন ফিড', phone: '01718-554433', category: 'feed_mill', address: '1/2 bonani, bogura', territory: 'Bogura Dairy Zone (শেরপুর)', status: 'approved', creditLimit: 250000, balance: 35000, createdBy: 'SR02', assignedSrId: 'SR02' },
  { id: 'BH0003', name: 'Dr. Shahinur Rahman', shopName: 'Bhai Bhai Veterinary Pharmacy', bnShopName: 'ভাই ভাই ভেটেরিনারি ফার্মেসি', phone: '01911-887766', category: 'pharmacy', address: 'Medical Mor, Trishal, Mymensingh', territory: 'Mymensingh Poultry Belt (ভালুকা)', status: 'approved', creditLimit: 200000, balance: 48000, createdBy: 'SR03', assignedSrId: 'SR03' },
  { id: 'BH0004', name: 'Tariqul Anam', shopName: 'Sonali Agro Poultry Complex', bnShopName: 'সোনালী এগ্রো পোল্ট্রি কমপ্লেক্স', phone: '01819-223344', category: 'poultry_farm', address: 'Sherpur Road, Bogura Sadar, Bogura', territory: 'Bogura Dairy Zone (শেরপুর)', status: 'approved', creditLimit: 120000, balance: 12000, createdBy: 'SR02', assignedSrId: 'SR02' },
  { id: 'BH0005', name: 'Al-Haj Mosharraf Hossain', shopName: 'Bismillah Feed & Poultry Centre', bnShopName: 'বিসমিল্লাহ ফিড ও পোল্ট্রি সেন্টার', phone: '01715-998877', category: 'feed_mill', address: 'Masterbari, Sreepur, Gazipur', territory: 'Gazipur (শ্রীপুর-জয়দেবপুর)', status: 'approved', creditLimit: 300000, balance: 75000, createdBy: 'SR01', assignedSrId: 'SR01' },
  { id: 'REQ-01', name: 'Khorshed Alam', shopName: 'Popular Agro Vet Corner', bnShopName: 'পপুলার এগ্রো ভেট কর্নার', phone: '01733-441122', category: 'pharmacy', address: 'Bazar Road, Valuka, Mymensingh', territory: 'Mymensingh Poultry Belt (ভালুকা)', status: 'pending', creditLimit: 80000, balance: 0, createdBy: 'SR03', assignedSrId: 'SR03', createdAt: '2026-11-05' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'BHA-ORD-202611-001',
    date: '2026-11-04',
    srId: 'SR01',
    srName: 'Md. Rafiqul Islam',
    customerId: 'BH0001',
    customerShopName: 'Green Valley Dairy Farm',
    customerName: 'Haji Nurul Islam',
    customerAddress: 'Bhawal Mirzapur, Gazipur Sadar, Gazipur',
    territory: 'Gazipur (শ্রীপুর-জয়দেবপুর)',
    items: [
      { productId: 'PROD-10', name: 'Bio-CalPlex 5 Litre', packSize: '5 Litre Jar', qty: 10, freeQty: 2, tp: 820, total: 8200 },
      { productId: 'PROD-12', name: 'Hepato-Care Liquid 1L', packSize: '1 Litre Bottle', qty: 10, freeQty: 1, tp: 480, total: 4800 },
      { productId: 'PROD-15', name: 'Albendazole-Vet Bolus (10x4)', packSize: 'Box of 40 Bolus', qty: 5, freeQty: 0, tp: 380, total: 1900 },
    ],
    subtotal: 14900,
    discount: 400,
    grandTotal: 14500,
    status: 'confirmed',
    paymentStatus: 'Credit Account',
    notes: 'Priority delivery for dairy farm milk-fever protection.'
  },
  {
    id: 'BHA-ORD-202611-002',
    date: '2026-11-05',
    srId: 'SR02',
    srName: 'Tanvir Ahmed',
    customerId: 'BH0002',
    customerShopName: 'Amin Feed',
    customerName: 'Md. Aminul Islam',
    customerAddress: '1/2 bonani, bogura',
    territory: 'Bogura Dairy Zone (শেরপুর)',
    items: [
      { productId: 'PROD-01', name: 'Ciprovet-Vet 100ml', packSize: '100 ml Bottle', qty: 20, freeQty: 2, tp: 280, total: 5600 },
      { productId: 'PROD-06', name: 'Bio-Gumboro Live (1000D)', packSize: '1000 Dose Vial', qty: 15, freeQty: 0, tp: 450, total: 6750 },
      { productId: 'PROD-14', name: 'Bio-Electrolyte WS 500g', packSize: '500 gm Pack', qty: 25, freeQty: 3, tp: 210, total: 5250 },
    ],
    subtotal: 17600,
    discount: 600,
    grandTotal: 17000,
    status: 'confirmed',
    paymentStatus: 'Credit Account',
    notes: 'Bulk feed supplement order for Bogura layer farm.'
  }
];

export const I18N: Record<string, Record<string, string>> = {
  en: {
    appName: 'BH Agro Ltd.',
    tagline: 'Veterinary Pharmaceuticals & Animal Health',
    dashboard: 'Dashboard',
    orderBooking: 'Order Booking',
    customerList: 'Customer List',
    addCustomer: 'Request New Customer',
    pendingApprovals: 'Customer Approvals',
    productsInventory: 'Products & Inventory',
    pricingManager: 'Price & Discount Manager',
    srWiseReport: 'SR-wise Sales Report',
    customerWiseReport: 'Customer-wise Sales Report',
    srManagement: 'SR Accounts (Create ID)',
    reportsAnalytics: 'Reports & Analytics',
    dbSettings: 'Firebase Realtime DB',
    logout: 'Log Out',
    roleSR: 'Field Sales Rep (SR)',
    roleAdmin: 'Central Admin',
    currentRole: 'Active Profile',
    onlineFirebase: 'Firebase Online 🟢',
    localDemo: 'Local Offline Demo 🟡',
    todayBooking: "Today's Orders",
    monthlyRevenue: 'Monthly Sales',
    approvedCustomers: 'Active Customers',
    pendingOrders: 'Pending Approval',
    productCatalog: 'Veterinary Medicines',
    categoryAll: 'All Products',
    categoryAntibiotics: 'Antibiotics',
    categoryVaccines: 'Vaccines',
    categorySupplements: 'Feed Supplements',
    categoryDewormers: 'Dewormers',
    searchPlaceholder: 'Search medicines by name or SKU...',
    searchCustomerPlaceholder: 'Search customer by ID (e.g. BH0002) or Name...',
    cartTitle: 'Order Slip / Cart',
    emptyCart: 'No medicines added to cart yet',
    selectCustomer: 'Select Customer',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal (TP)',
    discount: 'Special Discount (৳)',
    vat: 'VAT (0% Vet Exemption)',
    grandTotal: 'Net Payable Amount',
    submitOrder: 'Confirm & Place Order',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    tradeOffer: 'Offer',
    unitTP: 'Trade Price',
    mrp: 'M.R.P.',
    freeQty: 'Free Items',
    statusConfirmed: 'Confirmed',
    statusPending: 'Pending Admin',
    statusApproved: 'Approved',
    exportExcel: 'Export to Excel (.xlsx)',
    uploadExcel: 'Upload Products Excel',
    downloadTemplate: 'Download Excel Template',
    printInvoice: 'Print PDF Invoice',
    deleteOrder: 'Delete Order',
    action: 'Actions',
    approve: 'Approve Customer',
    reject: 'Reject',
    save: 'Save Changes',
    cancel: 'Cancel',
    customerName: 'Proprietor / Doctor Name',
    shopName: 'Farm / Shop / Pharmacy Name',
    phone: 'Mobile Number',
    category: 'Category',
    address: 'Full Address',
    territory: 'Sales Territory',
    creditLimit: 'Credit Limit (BDT)',
    balance: 'Current Balance',
    filterDate: 'Filter Date',
    filterCategory: 'Category Filter',
    daywiseSales: 'Day-wise Sales Report (All SRs)',
    productwiseSales: 'Product-wise Sales Analysis',
    inventoryReport: 'Storage & Stock Valuation',
    resetDemo: 'Reset / Seed Demo Data',
    srStaffId: 'SR ID',
    srUsername: 'SR Username',
    srPassword: 'Password',
    monthlyTarget: 'Monthly Target (৳)',
    addSR: 'Create New SR Account',
    dairyFarm: 'Dairy Farm',
    poultryFarm: 'Poultry Farm',
    pharmacy: 'Vet Pharmacy',
    feedMill: 'Feed Mill & Dealer',
    target: 'Target',
    achievement: 'Achievement',
    todayBookingCount: "Today's Orders",
    todayBookingValue: "Today's Value",
  },
  bn: {
    appName: 'বিএইচ এগ্রো লি.',
    tagline: 'ভেটেরিনারি ওষুধ ও প্রাণিস্বাস্থ্য পণ্য',
    dashboard: 'ড্যাশবোর্ড',
    orderBooking: 'অর্ডার বুকিং',
    customerList: 'গ্রাহকের তালিকা',
    addCustomer: 'নতুন গ্রাহক আবেদন',
    pendingApprovals: 'গ্রাহক অনুমোদন',
    productsInventory: 'পণ্য ও ইনভেন্টরি',
    pricingManager: 'মূল্য ও ডিসকাউন্ট ম্যানেজার',
    srWiseReport: 'এসআরভিত্তিক বিক্রয় রিপোর্ট',
    customerWiseReport: 'গ্রাহকভিত্তিক বিক্রয় রিপোর্ট',
    srManagement: 'এসআর একাউন্ট তৈরি ও ব্যবস্থাপনা',
    reportsAnalytics: 'রিপোর্ট ও সেলস',
    dbSettings: 'ফায়ারবেস ডাটাবেস',
    logout: 'লগআউট',
    roleSR: 'ফিল্ড সেলস রিপ্রেজেন্টেটিভ (এসআর)',
    roleAdmin: 'সেন্ট্রাল অ্যাডমিন',
    currentRole: 'বর্তমান প্রোফাইল',
    onlineFirebase: 'ফায়ারবেস অনলাইন 🟢',
    localDemo: 'লোকাল ডেমো মোড 🟡',
    todayBooking: 'আজকের বুকিং',
    monthlyRevenue: 'মাসিক মোট বিক্রয়',
    approvedCustomers: 'অনুমোদিত গ্রাহক',
    pendingOrders: 'অপেক্ষমাণ',
    productCatalog: 'ভেটেরিনারি ওষুধ ক্যাটালগ',
    categoryAll: 'সকল ওষুধ',
    categoryAntibiotics: 'অ্যান্টিবায়োটিক',
    categoryVaccines: 'ভ্যাকসিন',
    categorySupplements: 'ফিড সাপ্লিমেন্ট ও ভিটামিন',
    categoryDewormers: 'কৃমিনাশক (ডিওয়ার্মার)',
    searchPlaceholder: 'ওষুধের নাম বা এসকেইউ খুঁজুন...',
    searchCustomerPlaceholder: 'আইডি (যেমন: BH0002) অথবা ফার্ম/দোকানের নাম দিয়ে খুঁজুন...',
    cartTitle: 'অর্ডার স্লিপ / কার্ট',
    emptyCart: 'কার্টে কোন ওষুধ যোগ করা হয়নি',
    selectCustomer: 'গ্রাহক নির্বাচন করুন',
    orderSummary: 'অর্ডারের বিবরণ',
    subtotal: 'মোট ট্রেড প্রাইস (টিপি)',
    discount: 'বিশেষ ছাড় (৳)',
    vat: 'ভ্যাট (ভেটেরিনারি ভ্যাটমুক্ত)',
    grandTotal: 'সর্বমোট প্রদেয় টাকা',
    submitOrder: 'অর্ডার নিশ্চিত ও সাবমিট করুন',
    inStock: 'মজুদ আছে',
    lowStock: 'স্বল্প স্টক',
    tradeOffer: 'অফার',
    unitTP: 'ট্রেড প্রাইস (টিপি)',
    mrp: 'এম.আর.পি.',
    freeQty: 'ফ্রি ওষুধ',
    statusConfirmed: 'নিশ্চিত অর্ডার',
    statusPending: 'অনুমোদনের অপেক্ষায়',
    statusApproved: 'অনুমোদিত',
    exportExcel: 'এক্সেলে ডাউনলোড (.xlsx)',
    uploadExcel: 'এক্সেল দিয়ে পণ্য আপলোড',
    downloadTemplate: 'এক্সেল টেমপ্লেট ডাউনলোড',
    printInvoice: 'পিডিএফ ইনভয়েস প্রিন্ট',
    deleteOrder: 'অর্ডার ডিলিট',
    action: 'অ্যাকশন',
    approve: 'গ্রাহক অনুমোদন দিন',
    reject: 'বাতিল',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    customerName: 'মালিক / ডাক্তারের নাম',
    shopName: 'ফার্ম / দোকানের নাম',
    phone: 'মোবাইল নম্বর',
    category: 'ক্যাটাগরি',
    address: 'সম্পূর্ণ ঠিকানা',
    territory: 'টেরিটরি / এলাকা',
    creditLimit: 'বাকি নেওয়ার সীমা (টাকা)',
    balance: 'বর্তমান বকেয়া (টাকা)',
    filterDate: 'তারিখ নির্বাচন',
    filterCategory: 'ক্যাটাগরি ফিল্টার',
    daywiseSales: 'দৈনিক সেলস রিপোর্ট (সকল এসআর)',
    productwiseSales: 'পণ্যভিত্তিক বিক্রয় বিশ্লেষণ',
    inventoryReport: 'গুদাম মজুদ ও স্টক মূল্যায়ন',
    resetDemo: 'ডেমো ডেটা রিসেট',
    srStaffId: 'এসআর আইডি',
    srUsername: 'ইউজারনেম',
    srPassword: 'পাসওয়ার্ড',
    monthlyTarget: 'মাসিক সেলস টার্গেট (৳)',
    addSR: 'নতুন এসআর আইডি তৈরি করুন',
    dairyFarm: 'ডেইরি খামার',
    poultryFarm: 'পোল্ট্রি খামার',
    pharmacy: 'ভেট ফার্মেসি',
    feedMill: 'ফিড মিল ও ডিলার',
    target: 'টার্গেট',
    achievement: 'অর্জিত',
    todayBookingCount: 'আজকের মোট অর্ডার',
    todayBookingValue: 'আজকের বুকিং মূল্য',
  }
};

export interface DBState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  srs: SRUser[];
  lastUpdated: string;
}

export class Store {
  lang: string;
  theme: string;
  authSession: {
    isLoggedIn: boolean;
    user: SRUser | AdminUser | null;
    role: 'sr' | 'admin' | null;
  };
  activeTab: string;
  customerSearchQuery: string;
  catalogCategory: string;
  catalogSearch: string;
  cart: {
    customerId: string;
    items: Record<string, { product: Product; qty: number; freeQty: number; total: number }>;
    discount: number;
    notes: string;
  };
  db!: DBState;
  firebaseApp: any;
  firebaseDb: any;
  isFirebaseReady: boolean;

  constructor() {
    this.lang = localStorage.getItem(PREF_LANG_KEY) || 'en'; // Default English
    this.theme = localStorage.getItem(PREF_THEME_KEY) || 'light'; // Default Light
    
    // Auth session
    this.authSession = JSON.parse(localStorage.getItem(SESSION_AUTH_KEY) || 'null') || {
      isLoggedIn: true,
      user: INITIAL_SR_LIST[1], // Default to Tanvir Ahmed (Bogura - SR02)
      role: 'sr'
    };

    this.activeTab = 'home'; // Default SR view is Home page (with Hero Banner & Customer list)
    this.customerSearchQuery = '';
    this.catalogCategory = 'all';
    this.catalogSearch = '';

    this.cart = {
      customerId: 'BH0002',
      items: {},
      discount: 0,
      notes: ''
    };

    this.firebaseApp = null;
    this.firebaseDb = null;
    this.isFirebaseReady = false;

    this.initTheme();
    this.loadDatabase();
  }

  initTheme() {
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(PREF_THEME_KEY, this.theme);
    this.initTheme();
  }

  setLang(lang: string) {
    this.lang = lang;
    localStorage.setItem(PREF_LANG_KEY, lang);
    document.documentElement.lang = lang;
  }

  t(key: string): string {
    return (I18N[this.lang] && I18N[this.lang][key]) || (I18N.en && I18N.en[key]) || key;
  }

  loadDatabase() {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      this.seedInitialData();
    } else {
      try {
        this.db = JSON.parse(raw);
        // Ensure assignedSrId exists for legacy data
        if (this.db && this.db.customers) {
          this.db.customers.forEach(c => {
            if (!c.assignedSrId) {
              c.assignedSrId = c.createdBy || 'SR01';
            }
          });
        }
      } catch (e) {
        this.seedInitialData();
      }
    }
    this.tryInitFirebase();
  }

  seedInitialData() {
    this.db = {
      products: [...INITIAL_PRODUCTS],
      customers: [...INITIAL_CUSTOMERS],
      orders: [...INITIAL_ORDERS],
      srs: [...INITIAL_SR_LIST],
      lastUpdated: new Date().toISOString()
    };
    this.saveDatabase();
  }

  saveDatabase() {
    this.db.lastUpdated = new Date().toISOString();
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.db));

    if (this.isFirebaseReady && this.firebaseDb) {
      try {
        this.firebaseDb.ref('bioherbs_agrovet').set(this.db)
          .catch((err: any) => console.warn('Firebase sync warning:', err));
      } catch (e) {
        console.warn('Firebase sync failed:', e);
      }
    }
  }

  tryInitFirebase() {
    const configRaw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (!configRaw) return;
    try {
      const config = JSON.parse(configRaw);
      const fb = (window as any).firebase;
      if (config && config.databaseURL && fb) {
        if (!fb.apps.length) {
          this.firebaseApp = fb.initializeApp(config);
        } else {
          this.firebaseApp = fb.app();
        }
        this.firebaseDb = fb.database();
        this.isFirebaseReady = true;

        this.firebaseDb.ref('bioherbs_agrovet').on('value', (snapshot: any) => {
          const val = snapshot.val();
          if (val && val.products) {
            this.db = val;
            localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.db));
            if ((window as any).App && (window as any).App.render) {
              (window as any).App.render();
            }
          }
        });
      }
    } catch (e) {
      console.warn('Firebase initialization skipped/failed:', e);
      this.isFirebaseReady = false;
    }
  }

  setAuth(user: SRUser | AdminUser | null, role: 'sr' | 'admin' | null) {
    this.authSession = {
      isLoggedIn: !!user,
      user: user,
      role: role
    };
    localStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(this.authSession));
    this.activeTab = role === 'admin' ? 'dashboard' : 'home';
  }

  logout() {
    this.setAuth(null, null);
  }

  getNextCustomerId(): string {
    let maxNum = 0;
    this.db.customers.forEach(c => {
      if (c.id && c.id.startsWith('BH')) {
        const num = parseInt(c.id.replace('BH', ''), 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    return 'BH' + String(maxNum + 1).padStart(4, '0');
  }
}

export const store = new Store();
