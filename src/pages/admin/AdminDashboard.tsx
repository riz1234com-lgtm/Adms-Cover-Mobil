import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Product, Category, SaleRecord, StoreSettings } from '../../types';
import { formatIDR } from '../../lib/whatsapp';
import { ProductFormModal } from './ProductFormModal';
import { CategoryFormModal } from './CategoryFormModal';
import { SaleRecordModal } from './SaleRecordModal';
import {
  Shield,
  LayoutDashboard,
  Package,
  FolderTree,
  DollarSign,
  MessageCircle,
  Star,
  Settings,
  Download,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  RefreshCw,
  Lock,
  Server,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { isAuthenticated, user, token, login, logout, isLoading: authLoading } = useAuth();
  const { settings, refreshSettings, showToast } = useStore();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'sales' | 'wa-tracking' | 'reviews' | 'settings' | 'deploy'
  >('overview');

  // Login Form States (if unauthenticated)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [waLogs, setWaLogs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Filter & Search States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const fetchDashboardData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      // 1. Stats
      const resStats = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataStats = await resStats.json();
      if (dataStats.success) {
        setStats(dataStats.stats);
      }

      // 2. Products
      const resProd = await fetch('/api/products');
      const dataProd = await resProd.json();
      if (dataProd.success) setProducts(dataProd.products);

      // 3. Categories
      const resCat = await fetch('/api/categories');
      const dataCat = await resCat.json();
      if (dataCat.success) setCategories(dataCat.categories);

      // 4. Sales
      const resSales = await fetch('/api/sales', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataSales = await resSales.json();
      if (dataSales.success) setSales(dataSales.sales);

      // 5. WhatsApp Tracking
      const resWa = await fetch('/api/tracking/whatsapp', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataWa = await resWa.json();
      if (dataWa.success) setWaLogs(dataWa.logs);

      // 6. Reviews
      const resRev = await fetch('/api/reviews');
      const dataRev = await resRev.json();
      if (dataRev.success) setReviews(dataRev.reviews);
    } catch {
      showToast('Gagal memuat data dashboard', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, token]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await login(loginUsername, loginPassword);
    setIsLoggingIn(false);
    if (success) {
      showToast('Berhasil masuk ke Dashboard Admin ADMS', 'success');
    } else {
      showToast('Username atau password salah', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus produk "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Produk berhasil dihapus', 'success');
        fetchDashboardData();
      }
    } catch {
      showToast('Gagal menghapus produk', 'error');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Kategori berhasil dihapus', 'success');
        fetchDashboardData();
      }
    } catch {
      showToast('Gagal menghapus kategori', 'error');
    }
  };

  // Delete Sale Record
  const handleDeleteSale = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus catatan penjualan ini?')) return;
    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Catatan penjualan berhasil dihapus', 'success');
        fetchDashboardData();
      }
    } catch {
      showToast('Gagal menghapus catatan penjualan', 'error');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Pengaturan toko & WhatsApp berhasil diperbarui!', 'success');
        refreshSettings();
      } else {
        showToast(data.message || 'Gagal menyimpan pengaturan', 'error');
      }
    } catch {
      showToast('Gagal menyimpan pengaturan', 'error');
    }
  };

  // Export JSON Database
  const handleExportDatabase = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      storeSettings: settings,
      categories,
      products,
      sales,
      waLogs,
      reviews
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adms-cover-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database berhasil diexport ke file JSON!', 'success');
  };

  // If Not Authenticated -> Show Clean Login Card
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-md bg-[#12161F] border border-[#1F2634] rounded-3xl p-8 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#F27D26]/20 text-[#F27D26] flex items-center justify-center mx-auto border border-[#F27D26]/30">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white font-display">ADMS Admin Panel</h1>
            <p className="text-xs text-zinc-400">
              Masuk untuk mengelola katalog cover mobil, nomor WhatsApp, dan laporan penjualan.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Username atau Email:</label>
              <input
                type="text"
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                placeholder="Masukkan username atau email"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white font-medium focus:outline-none focus:border-[#F27D26] placeholder:text-zinc-600"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Password:</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Masukkan password admin"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white font-medium focus:outline-none focus:border-[#F27D26] placeholder:text-zinc-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-xl shadow-[#F27D26]/30 flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Memverifikasi...' : 'Masuk Dashboard'}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-zinc-400 hover:text-white"
            >
              ← Kembali ke Beranda Toko
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = !productCategoryFilter || p.categoryId === productCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">Dashboard Admin ADMS</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Selamat datang, <strong className="text-slate-200">{user?.name || 'Administrator'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoadingData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-rose-600/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Admin Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Ringkasan & Statistik', icon: LayoutDashboard },
          { id: 'products', label: `Kelola Produk (${products.length})`, icon: Package },
          { id: 'categories', label: `Kategori (${categories.length})`, icon: FolderTree },
          { id: 'sales', label: `Pencatatan Penjualan (${sales.length})`, icon: DollarSign },
          { id: 'wa-tracking', label: `Log Klik WA (${waLogs.length})`, icon: MessageCircle },
          { id: 'reviews', label: `Ulasan (${reviews.length})`, icon: Star },
          { id: 'settings', label: 'Pengaturan WhatsApp & Toko', icon: Settings },
          { id: 'deploy', label: 'Hosting & Database (Hostinger)', icon: Server }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TOTAL PRODUK</span>
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats?.totalProducts || products.length}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">
                {products.filter(p => p.stock > 0).length} Produk Stok Siap Kirim
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TOTAL KLIK WHATSAPP</span>
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {stats?.totalWhatsAppClicks || waLogs.length}
              </div>
              <div className="text-[11px] text-slate-400">
                Calon pembeli yang diarahkan ke WA Admin
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TRANSAKSI PENJUALAN</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats?.totalSalesRecords || sales.length}
              </div>
              <div className="text-[11px] text-amber-400 font-semibold">
                Tercatat manual di sistem
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>TOTAL OMSET PENJUALAN</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {formatIDR(stats?.totalRevenue || 0)}
              </div>
              <div className="text-[11px] text-slate-400">
                Akumulasi penjualan tercatat
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent WhatsApp Inquiries */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Aktivitas Klik Pemesanan WhatsApp Terbaru</span>
                </h3>
                <button
                  onClick={() => setActiveTab('wa-tracking')}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-2">
                {waLogs.slice(0, 5).map(log => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{log.productName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">{formatIDR(log.price)}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Manual Sales */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Transaksi Penjualan Terbaru</span>
                </h3>
                <button
                  onClick={() => setIsSaleModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Catat Baru
                </button>
              </div>

              <div className="space-y-2">
                {sales.slice(0, 5).map(sale => (
                  <div
                    key={sale.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{sale.customerName} ({sale.carModel || 'Mobil'})</div>
                      <div className="text-[11px] text-slate-400">
                        {sale.productName} • {sale.productSize} • {sale.quantity} pcs
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">{formatIDR(sale.totalAmount)}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {sale.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Cari nama produk atau SKU..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={e => setProductCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              >
                <option value="">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Foto & Produk</th>
                  <th className="p-4">Kategori / SKU</th>
                  <th className="p-4">Harga Jual</th>
                  <th className="p-4">Stok</th>
                  <th className="p-4">Status & Badge</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-12 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-white truncate">{p.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{p.material}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-emerald-400">{p.categoryName}</div>
                      <div className="font-mono text-[11px] text-slate-400">{p.sku}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-white">
                        {formatIDR(p.discountPrice || p.sellingPrice)}
                      </div>
                      {p.discountPrice && (
                        <div className="text-[11px] text-slate-400 line-through">
                          {formatIDR(p.sellingPrice)}
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-bold text-white">{p.stock} pcs</td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isBestSeller && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold">
                            Terlaris
                          </span>
                        )}
                        {p.isPromo && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">
                            Promo
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-400 font-bold">
                            Unggulan
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-base">Daftar Kategori Cover</h3>
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Kategori
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(c => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-xs text-emerald-400 font-semibold">{c.productCount || 0} Produk</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(c);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANUAL SALES RECORD */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">Buku Catatan Penjualan Manual</h3>
              <p className="text-xs text-slate-400">
                Pencatatan pesanan yang masuk dari WhatsApp, Marketplace, atau Toko Offline
              </p>
            </div>
            <button
              onClick={() => setIsSaleModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Plus className="w-4 h-4" /> Catat Penjualan Baru
            </button>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Pelanggan & Mobil</th>
                  <th className="p-4">Produk & Varian</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Nominal</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {sales.map(s => (
                  <tr key={s.id} className="hover:bg-slate-850/50">
                    <td className="p-4 text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{s.customerName}</div>
                      <div className="text-[11px] text-slate-400">{s.customerPhone} • {s.carModel}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{s.productName}</div>
                      <div className="text-[11px] text-slate-400">
                        Ukuran: {s.productSize} | {s.productColor} | {s.quantity} pcs
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-emerald-400 uppercase">{s.channel}</td>
                    <td className="p-4 font-bold text-white">{formatIDR(s.totalAmount)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteSale(s.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: WHATSAPP TRACKING LOG */}
      {activeTab === 'wa-tracking' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-white text-base">Log Lead & Klik Pemesanan WhatsApp</h3>
            <p className="text-xs text-slate-400">
              Pelacakan real-time setiap pengunjung yang menekan tombol "Pesan via WhatsApp"
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Waktu</th>
                  <th className="p-4">Produk</th>
                  <th className="p-4">SKU / Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Perangkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {waLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-850/50">
                    <td className="p-4 text-slate-400">
                      {new Date(log.timestamp).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 font-bold text-white">{log.productName}</td>
                    <td className="p-4 text-slate-400">{log.sku} • {log.categoryName}</td>
                    <td className="p-4 font-bold text-emerald-400">{formatIDR(log.price)}</td>
                    <td className="p-4 text-[11px] text-slate-500 truncate max-w-xs">{log.userAgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="font-bold text-white text-base">Kelola Ulasan Pelanggan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(r => (
              <div key={r.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{r.userName}</span>
                    <span className="text-[10px] text-slate-400">({r.userLocation})</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Mobil: {r.carModel}</div>
                <p className="text-slate-300 leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: STORE & WHATSAPP SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs max-w-4xl">
          <div>
            <h3 className="font-bold text-white text-base">Pengaturan WhatsApp & Toko</h3>
            <p className="text-slate-400 mt-0.5">
              Ubah nomor WhatsApp tujuan, teks template pembuka, dan informasi kontak resmi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Nama Toko *</label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={e => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Slogan / Tagline</label>
              <input
                type="text"
                value={settingsForm.slogan}
                onChange={e => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="space-y-1.5">
              <label className="font-bold text-emerald-400">Nomor WhatsApp Admin (Format 62...)</label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                placeholder="6281234567890"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-emerald-400">Tampilan Nomor WA di Website</label>
              <input
                type="text"
                value={settingsForm.whatsappDisplay}
                onChange={e => setSettingsForm({ ...settingsForm, whatsappDisplay: e.target.value })}
                placeholder="+62 812-3456-7890"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Template Pembuka Pesan WhatsApp Konsultasi</label>
            <input
              type="text"
              value={settingsForm.whatsappTemplate}
              onChange={e => setSettingsForm({ ...settingsForm, whatsappTemplate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Email Toko</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Alamat Workshop & Gudang</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Pemberitahuan Banner Promo Atas (Announcement Bar)</label>
            <input
              type="text"
              value={settingsForm.announcementText}
              onChange={e => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-[#0A0C10] border border-[#1F2634]">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F27D26]" />
              <span>Link Toko Resmi di Marketplace & Media Sosial</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#EE4D2D]">Link Shopee Official Store</label>
                <input
                  type="url"
                  value={settingsForm.shopee || ''}
                  onChange={e => setSettingsForm({ ...settingsForm, shopee: e.target.value })}
                  placeholder="https://shopee.co.id/admscovermobil"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-white focus:outline-none focus:border-[#EE4D2D]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-[#03AC0E]">Link Tokopedia Official Store</label>
                <input
                  type="url"
                  value={settingsForm.tokopedia || ''}
                  onChange={e => setSettingsForm({ ...settingsForm, tokopedia: e.target.value })}
                  placeholder="https://www.tokopedia.com/admscovermobil"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-white focus:outline-none focus:border-[#03AC0E]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-[#25F4EE]">Link TikTok Shop</label>
                <input
                  type="url"
                  value={settingsForm.tiktok || ''}
                  onChange={e => setSettingsForm({ ...settingsForm, tiktok: e.target.value })}
                  placeholder="https://www.tiktok.com/@admscovermobil"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-[#E1306C]">Link Akun Instagram Resmi</label>
                <input
                  type="url"
                  value={settingsForm.instagram || ''}
                  onChange={e => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                  placeholder="https://instagram.com/admscovermobil"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-white focus:outline-none focus:border-[#E1306C]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-xl shadow-[#F27D26]/20 transition-all"
          >
            Simpan Pengaturan
          </button>
        </form>
      )}

      {/* TAB 8: HOSTING & DATABASE GUIDE (HOSTINGER READY) */}
      {activeTab === 'deploy' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-xs max-w-4xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <span>Panduan Hosting & Database di Hostinger</span>
              </h3>
              <p className="text-slate-400 mt-1">
                Website ADMS COVER MOBIL dirancang 100% kompatibel dengan Cloud Hosting / VPS / Shared Hosting Hostinger (Node.js + MySQL).
              </p>
            </div>

            <button
              onClick={handleExportDatabase}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup JSON</span>
            </button>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm">Langkah 1: Setup Node.js di hPanel Hostinger</h4>
              <p>
                1. Masuk ke hPanel Hostinger &gt; <strong>Node.js</strong>.<br />
                2. Buat App Node.js baru dengan versi <strong>Node.js 18 / 20 / 22</strong>.<br />
                3. Application root: <code>/public_html</code>.<br />
                4. Application startup file: <code>dist/server.cjs</code>.<br />
                5. Jalankan perintah build: <code>npm run build</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm">Langkah 2: Setup Database MySQL di phpMyAdmin Hostinger</h4>
              <p>
                1. Buat Database MySQL baru di hPanel Hostinger (contoh: <code>u123456_adms_db</code>).<br />
                2. Buka phpMyAdmin, lalu import file <code>server/schema.sql</code> yang sudah kami sediakan di dalam source code.<br />
                3. Masukkan konfigurasi database di <code>.env</code> file Hostinger Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm">Langkah 3: Setting Environment Variables (.env)</h4>
              <pre className="p-3 rounded-xl bg-slate-900 text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
{`DB_HOST=localhost
DB_USER=u123456_adms_user
DB_PASSWORD=PasswordDatabaseAnda
DB_NAME=u123456_adms_db
DB_PORT=3306
JWT_SECRET=super_secret_adms_key
WHATSAPP_NUMBER=6281234567890
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSaved={fetchDashboardData}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSaved={fetchDashboardData}
      />

      <SaleRecordModal
        isOpen={isSaleModalOpen}
        products={products}
        onClose={() => setIsSaleModalOpen(false)}
        onSaved={fetchDashboardData}
      />
    </div>
  );
};
