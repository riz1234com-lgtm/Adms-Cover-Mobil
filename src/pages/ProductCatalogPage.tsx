import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Shield,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface ProductCatalogPageProps {
  navigate: (path: string) => void;
  initialCategorySlug?: string;
}

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({
  navigate,
  initialCategorySlug
}) => {
  const { categories } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    if (initialCategorySlug) {
      const match = categories.find(c => c.slug === initialCategorySlug);
      return match ? match.id : '';
    }
    return '';
  });
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedCoverType, setSelectedCoverType] = useState<string>('');
  const [isPromoOnly, setIsPromoOnly] = useState(false);
  const [isBestSellerOnly, setIsBestSellerOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('terbaru');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const SIZE_OPTIONS = ['M (City Car)', 'L (Sedan/Small MPV)', 'XL (Medium MPV/SUV)', 'XXL (Large SUV/Van)', 'Custom'];
  const COVER_TYPE_OPTIONS = ['Outdoor Heavy Duty', 'All-Weather Waterproof', 'Sun & Heat Protector', 'Indoor Luxury', 'Custom Tailored'];

  useEffect(() => {
    if (initialCategorySlug && categories.length > 0) {
      const match = categories.find(c => c.slug === initialCategorySlug);
      if (match) {
        setSelectedCategoryId(match.id);
      }
    }
  }, [initialCategorySlug, categories]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategoryId) params.append('categoryId', selectedCategoryId);
    if (searchQuery) params.append('search', searchQuery);
    if (selectedSize) params.append('size', selectedSize.split(' ')[0]);
    if (selectedCoverType) params.append('coverType', selectedCoverType);
    if (isPromoOnly) params.append('isPromo', 'true');
    if (isBestSellerOnly) params.append('isBestSeller', 'true');
    if (sortBy) params.append('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [selectedCategoryId, searchQuery, selectedSize, selectedCoverType, isPromoOnly, isBestSellerOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('');
    setSelectedSize('');
    setSelectedCoverType('');
    setIsPromoOnly(false);
    setIsBestSellerOnly(false);
    setSortBy('terbaru');
  };

  const hasActiveFilters = !!(
    selectedCategoryId ||
    searchQuery ||
    selectedSize ||
    selectedCoverType ||
    isPromoOnly ||
    isBestSellerOnly
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#12161F] rounded-3xl border border-[#1F2634] p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F27D26]/15 text-[#F27D26] text-xs font-bold border border-[#F27D26]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>KATALOG RESMI ADMS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Katalog Sarung & Cover Mobil
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Pilihan lengkap cover pelindung outdoor dan indoor berkualitas tinggi dengan pemesanan langsung via WhatsApp.
          </p>
        </div>
      </div>

      {/* Main Filter & Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2634] space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2634]">
              <div className="flex items-center gap-2 font-bold text-white text-sm font-display">
                <SlidersHorizontal className="w-4 h-4 text-[#F27D26]" />
                <span>Filter Produk</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Kategori
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategoryId('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    !selectedCategoryId ? 'bg-[#F27D26] text-white' : 'text-zinc-300 hover:bg-[#181D28]'
                  }`}
                >
                  <span>Semua Kategori</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategoryId === cat.id ? 'bg-[#F27D26] text-white' : 'text-zinc-300 hover:bg-[#181D28]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span className="text-[11px] opacity-70">({cat.productCount})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="space-y-2 pt-2 border-t border-[#1F2634]">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Ukuran
              </label>
              <div className="space-y-1">
                {SIZE_OPTIONS.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedSize === size ? 'bg-[#F27D26] text-white' : 'text-zinc-300 hover:bg-[#181D28]'
                    }`}
                  >
                    <span>{size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Promo & Best Seller Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#1F2634]">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Penawaran
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPromoOnly}
                    onChange={e => setIsPromoOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1F2634] bg-[#0A0C10] text-[#F27D26] focus:ring-[#F27D26]"
                  />
                  <span>Hanya Promo / Diskon</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBestSellerOnly}
                    onChange={e => setIsBestSellerOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1F2634] bg-[#0A0C10] text-[#F27D26] focus:ring-[#F27D26]"
                  />
                  <span>Hanya Produk Terlaris</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Control Bar: Search & Sort & Mobile Filter Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#12161F] border border-[#1F2634]">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari tipe mobil (Avanza, Pajero, HR-V) atau spesifikasi..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 rounded-xl bg-[#181D28] text-zinc-200 text-xs font-bold flex items-center gap-2 border border-[#1F2634]"
              >
                <Filter className="w-4 h-4 text-[#F27D26]" />
                <span>Filter</span>
              </button>

              {/* Sorting */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-zinc-400 hidden sm:inline">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white text-xs font-semibold focus:outline-none focus:border-[#F27D26]"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlaris">Paling Laris</option>
                  <option value="termurah">Harga Termurah</option>
                  <option value="termahal">Harga Tertinggi</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400">Filter Aktif:</span>
              {selectedCategoryId && (
                <span className="px-2.5 py-1 rounded-lg bg-[#181D28] text-[#F27D26] text-xs font-semibold flex items-center gap-1 border border-[#1F2634]">
                  Kategori: {categories.find(c => c.id === selectedCategoryId)?.name}
                  <button onClick={() => setSelectedCategoryId('')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSize && (
                <span className="px-2.5 py-1 rounded-lg bg-[#181D28] text-[#F27D26] text-xs font-semibold flex items-center gap-1 border border-[#1F2634]">
                  Ukuran: {selectedSize}
                  <button onClick={() => setSelectedSize('')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {isPromoOnly && (
                <span className="px-2.5 py-1 rounded-lg bg-[#181D28] text-rose-400 text-xs font-semibold flex items-center gap-1 border border-[#1F2634]">
                  Promo Diskon
                  <button onClick={() => setIsPromoOnly(false)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {isBestSellerOnly && (
                <span className="px-2.5 py-1 rounded-lg bg-[#181D28] text-amber-400 text-xs font-semibold flex items-center gap-1 border border-[#1F2634]">
                  Terlaris
                  <button onClick={() => setIsBestSellerOnly(false)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-zinc-400 hover:text-white underline ml-2"
              >
                Hapus Semua
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-[#12161F] border border-[#1F2634] animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#12161F] border border-[#1F2634] space-y-4">
              <Shield className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-display">Tidak ada cover mobil yang sesuai</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Silakan coba atur ulang filter pencarian Anda atau hubungi admin via WhatsApp untuk pesanan custom cover khusus.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-xs"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#12161F] rounded-3xl border border-[#1F2634] p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2634]">
              <h3 className="font-bold text-white text-base font-display">Filter Produk</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kategori</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategoryId('')}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left ${
                    !selectedCategoryId ? 'bg-[#F27D26] text-white' : 'bg-[#181D28] text-zinc-300'
                  }`}
                >
                  Semua
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left truncate ${
                      selectedCategoryId === cat.id ? 'bg-[#F27D26] text-white' : 'bg-[#181D28] text-zinc-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2 pt-2 border-t border-[#1F2634]">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ukuran</label>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedSize === size ? 'bg-[#F27D26] text-white' : 'bg-[#181D28] text-zinc-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1F2634] flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 rounded-xl bg-[#181D28] text-zinc-300 font-bold text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#F27D26] text-white font-bold text-xs"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
