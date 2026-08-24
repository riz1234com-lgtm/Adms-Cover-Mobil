import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Shield, ChevronRight, ArrowLeft } from 'lucide-react';

interface CategoryDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({ slug, navigate }) => {
  const { categories } = useStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Find category info
    const matched = categories.find(c => c.slug === slug);
    if (matched) {
      setCategory(matched);
      fetch(`/api/products?categoryId=${matched.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.products) {
            setProducts(data.products);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      // Try searching categories endpoint or default
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.categories) {
            const found = data.categories.find((c: Category) => c.slug === slug);
            if (found) {
              setCategory(found);
              return fetch(`/api/products?categoryId=${found.id}`);
            }
          }
          return null;
        })
        .then(res => (res ? res.json() : null))
        .then(data => {
          if (data && data.success) {
            setProducts(data.products);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [slug, categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <button onClick={() => navigate('/')} className="hover:text-[#F27D26]">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/produk')} className="hover:text-[#F27D26]">
          Katalog Produk
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-200 font-medium">{category?.name || slug}</span>
      </nav>

      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#12161F] border border-[#1F2634] p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27D26]/20 text-[#F27D26] text-xs font-bold border border-[#F27D26]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>KATEGORI COVER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            {category?.name || 'Koleksi Cover Mobil'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {category?.description || 'Koleksi sarung mobil berkualitas tinggi dengan bahan premium tahan cuaca.'}
          </p>
        </div>

        {category?.image && (
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden sm:block">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
      </div>

      {/* Product List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white font-display">
            Daftar Produk ({products.length})
          </h2>
          <button
            onClick={() => navigate('/produk')}
            className="text-xs font-semibold text-[#F27D26] hover:text-[#E06A14]"
          >
            Lihat Semua Kategori →
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-[#12161F] animate-pulse rounded-2xl border border-[#1F2634]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#12161F] border border-[#1F2634] space-y-4">
            <Shield className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white font-display">Belum ada produk di kategori ini</h3>
            <p className="text-xs text-zinc-400">
              Silakan periksa kategori lain atau hubungi admin via WhatsApp untuk pesanan custom.
            </p>
            <button
              onClick={() => navigate('/produk')}
              className="px-6 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-xs"
            >
              Lihat Semua Produk
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
