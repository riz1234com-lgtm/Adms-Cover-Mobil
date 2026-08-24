import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { formatIDR } from '../lib/whatsapp';
import { Search, X, Shield, ArrowRight, Star } from 'lucide-react';

interface SearchModalProps {
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ navigate }) => {
  const { isSearchOpen, setIsSearchOpen, categories } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/products?search=${encodeURIComponent(query.trim())}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.products) {
            setResults(data.products);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    navigate(`/produk/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    setIsSearchOpen(false);
    navigate(`/kategori/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative w-full max-w-2xl bg-[#12161F] border border-[#1F2634] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1F2634] bg-[#0A0C10]">
          <Search className="w-5 h-5 text-[#F27D26] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari cover mobil, merk (Avanza, Pajero, Civic), atau tipe bahan..."
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-500 hover:text-zinc-300 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 rounded-lg bg-[#181D28] hover:bg-[#202736] text-zinc-400 hover:text-white text-xs font-semibold border border-[#1F2634]"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Categories when no query */}
          {!query && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Kategori Populer
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="px-3 py-1.5 rounded-lg bg-[#181D28] hover:bg-[#202736] border border-[#1F2634] text-xs text-zinc-200 hover:text-[#F27D26] transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-8 text-center text-xs text-zinc-400">
              <div className="w-6 h-6 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Mencari produk cover mobil...
            </div>
          )}

          {/* Results List */}
          {!isLoading && query && results.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Ditemukan {results.length} Produk:
              </span>
              <div className="space-y-1.5">
                {results.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.slug)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0A0C10] hover:bg-[#181D28] border border-[#1F2634] hover:border-[#F27D26]/40 cursor-pointer transition-all group"
                  >
                    <img
                      src={prod.images?.[0]}
                      alt={prod.name}
                      className="w-14 h-12 rounded-lg object-cover bg-[#12161F] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#F27D26] font-semibold">{prod.categoryName}</span>
                        <span className="text-[11px] text-zinc-500">• {prod.sku}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#F27D26] transition-colors truncate font-display">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span className="text-[#F27D26] font-bold">
                          {formatIDR(prod.discountPrice || prod.sellingPrice)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" /> {prod.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#F27D26] transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && query && results.length === 0 && (
            <div className="py-8 text-center space-y-2">
              <Shield className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">
                Tidak ada produk yang cocok dengan "{query}"
              </p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Coba gunakan kata kunci lain seperti jenis mobil (Innova, Brio, Fortuner) atau tipe cover (Outdoor, Waterproof, Sedan).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
