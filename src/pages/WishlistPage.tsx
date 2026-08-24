import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight, Shield } from 'lucide-react';

interface WishlistPageProps {
  navigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate }) => {
  const { wishlist } = useStore();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setFavoriteProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          const filtered = data.products.filter((p: Product) => wishlist.includes(p.id));
          setFavoriteProducts(filtered);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [wishlist]);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#12161F] border border-[#1F2634] text-rose-500/60 flex items-center justify-center mx-auto shadow-xl">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white font-display">Daftar Favorit Masih Kosong</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Simpan produk cover mobil impian Anda dengan menekan ikon hati pada katalog produk.
          </p>
        </div>
        <button
          onClick={() => navigate('/produk')}
          className="px-8 py-3.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-xl shadow-[#F27D26]/30 inline-flex items-center gap-2 transition-transform transform hover:scale-105"
        >
          <span>Eksplor Katalog Produk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Produk Favorit Saya ({wishlist.length})
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Daftar cover mobil pilihan yang telah Anda simpan
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-[#12161F] animate-pulse rounded-2xl border border-[#1F2634]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map(product => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};
