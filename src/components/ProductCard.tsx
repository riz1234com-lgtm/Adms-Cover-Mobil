import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatIDR, buildSingleProductWhatsAppUrl } from '../lib/whatsapp';
import { Star, MessageCircle, Eye, Heart, Shield, CheckCircle2, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { settings, isInWishlist, toggleWishlist, setQuickViewProduct, trackWaClick } = useStore();
  const isFavorited = isInWishlist(product.id);

  const effectivePrice = product.discountPrice || product.sellingPrice;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.sellingPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.sellingPrice - product.discountPrice!) / product.sellingPrice) * 100)
    : 0;

  const mainImage = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80';

  const handleOrderWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackWaClick(product.id);
    const productUrl = `${window.location.origin}/produk/${product.slug}`;
    const waUrl = buildSingleProductWhatsAppUrl(
      settings,
      product,
      {
        size: product.sizes?.[0] || 'M',
        color: product.colors?.[0] || 'Hitam',
        quantity: 1
      },
      productUrl
    );
    window.open(waUrl, '_blank');
  };

  const handleCardClick = () => {
    navigate(`/produk/${product.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#12161F] rounded-2xl border border-[#1F2634] hover:border-[#F27D26]/60 shadow-lg hover:shadow-2xl hover:shadow-[#F27D26]/10 transition-all duration-300 overflow-hidden cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0C10]">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12161F] via-transparent to-black/40 opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F27D26] text-black shadow-md uppercase tracking-wider flex items-center gap-1">
              ★ Terlaris
            </span>
          )}
          {product.isPromo && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 text-white shadow-md uppercase tracking-wider">
              Promo
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-1 rounded-lg text-[11px] font-bold bg-[#F27D26]/90 text-white shadow-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Top Right Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={e => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-[#0A0C10]/80 text-zinc-300 hover:text-white hover:bg-[#181D28]'
            }`}
            title="Tambah ke Favorit"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="p-2 rounded-xl bg-[#0A0C10]/80 hover:bg-[#181D28] text-zinc-300 hover:text-white backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
            title="Pratinjau Cepat"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Cover Type Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0A0C10]/90 text-zinc-300 border border-[#1F2634] backdrop-blur-sm">
            {product.coverType || 'All-Weather'}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="text-[#F27D26] font-semibold uppercase tracking-wider">{product.categoryName}</span>
            <span className="font-mono text-zinc-400 font-medium">{product.sku}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-zinc-100 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-[#F27D26] transition-colors font-display">
            {product.name}
          </h3>

          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-zinc-200">{product.rating.toFixed(1)}</span>
              <span className="text-zinc-400">({product.reviewCount || 40})</span>
            </div>

            {product.stock > 0 ? (
              <span className="text-[11px] text-[#F27D26] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Stok Tersedia
              </span>
            ) : (
              <span className="text-[11px] text-red-400 font-medium">Stok Habis</span>
            )}
          </div>

          {/* Vehicle Compatibility Preview */}
          {product.vehicleCompatibility && (
            <p className="text-[11px] text-zinc-400 line-clamp-1">
              <span className="text-zinc-300 font-medium">Cocok: </span>
              {product.vehicleCompatibility}
            </p>
          )}
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-4 mt-3 border-t border-[#1F2634] space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-[#F27D26]">
              {formatIDR(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through font-medium">
                {formatIDR(product.sellingPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                navigate(`/produk/${product.slug}`);
              }}
              className="px-3 py-2 rounded-xl bg-[#181D28] hover:bg-[#202736] text-zinc-200 hover:text-white text-xs font-semibold transition-colors text-center border border-[#252D3D]"
            >
              Lihat Detail
            </button>

            <button
              onClick={handleOrderWhatsApp}
              className="px-3 py-2 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white text-xs font-bold transition-all shadow-md shadow-[#F27D26]/20 flex items-center justify-center gap-1.5 transform active:scale-95"
              id={`btn-wa-order-${product.id}`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Pesan WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
