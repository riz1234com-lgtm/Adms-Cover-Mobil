import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatIDR, buildSingleProductWhatsAppUrl } from '../lib/whatsapp';
import { X, Star, MessageCircle, ShoppingBag, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  navigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ navigate }) => {
  const { quickViewProduct, setQuickViewProduct, settings, addToCart, trackWaClick } = useStore();

  const product = quickViewProduct;
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Silver');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || '');

  const effectivePrice = product.discountPrice || product.sellingPrice;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.sellingPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.sellingPrice - product.discountPrice!) / product.sellingPrice) * 100)
    : 0;

  const handleOrderWA = () => {
    trackWaClick(product.id);
    const productUrl = `${window.location.origin}/produk/${product.slug}`;
    const waUrl = buildSingleProductWhatsAppUrl(
      settings,
      product,
      {
        size: selectedSize,
        color: selectedColor,
        quantity
      },
      productUrl
    );
    window.open(waUrl, '_blank');
    setQuickViewProduct(null);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  const handleFullDetail = () => {
    setQuickViewProduct(null);
    navigate(`/produk/${product.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#12161F] border border-[#1F2634] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-[#181D28]/80 hover:bg-[#202736] text-zinc-300 hover:text-white transition-colors border border-[#1F2634]"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 p-6 bg-[#0A0C10] flex flex-col justify-between">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#12161F] border border-[#1F2634]">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {hasDiscount && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F27D26] text-white shadow">
                Diskon {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? 'border-[#F27D26] scale-105' : 'border-[#1F2634] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#1F2634] flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1 text-[#F27D26] font-medium">
              <Shield className="w-3.5 h-3.5" /> Garansi Kualitas ADMS
            </span>
            <button
              onClick={handleFullDetail}
              className="text-zinc-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              Lihat Detail Lengkap <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Product Details & Variant Picker */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-[#F27D26] uppercase tracking-wider">{product.categoryName}</span>
              <h2 className="text-lg font-bold text-white leading-snug mt-0.5 font-display">{product.name}</h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-zinc-200">{product.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span className="font-mono">{product.sku}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{product.stock > 0 ? 'Stok Tersedia' : 'Habis'}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 py-2 border-y border-[#1F2634]">
              <span className="text-2xl font-black text-[#F27D26] font-display">
                {formatIDR(effectivePrice * quantity)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-zinc-500 line-through">
                  {formatIDR(product.sellingPrice * quantity)}
                </span>
              )}
            </div>

            {/* Sizes Variant */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Pilih Ukuran:</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSize === size
                          ? 'bg-[#F27D26] text-white border-[#F27D26] shadow-md'
                          : 'bg-[#0A0C10] text-zinc-300 border-[#1F2634] hover:border-zinc-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Variant */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Pilih Warna:</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedColor === color
                          ? 'bg-[#F27D26] text-white border-[#F27D26] shadow-md'
                          : 'bg-[#0A0C10] text-zinc-300 border-[#1F2634] hover:border-zinc-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 pt-1">
              <label className="text-xs font-bold text-zinc-300">Jumlah:</label>
              <div className="flex items-center border border-[#1F2634] rounded-lg bg-[#0A0C10]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-zinc-300 hover:text-white text-sm font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-white min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-zinc-300 hover:text-white text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-2 pt-3">
            <button
              onClick={handleOrderWA}
              className="w-full py-3 px-4 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-xl shadow-[#F27D26]/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pesan via WhatsApp Sekarang</span>
            </button>

            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 px-4 rounded-xl bg-[#181D28] hover:bg-[#202736] text-zinc-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-[#1F2634]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tambah ke Keranjang</span>
            </button>

            {/* Quick Marketplace options */}
            <div className="pt-2 border-t border-[#1F2634] grid grid-cols-4 gap-1.5 text-center">
              <a
                href={settings.shopee || 'https://shopee.co.id/admscovermobil'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 rounded-lg bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 text-[#EE4D2D] border border-[#EE4D2D]/30 text-[10px] font-bold truncate transition-colors"
                title="Beli di Shopee"
              >
                Shopee
              </a>
              <a
                href={settings.tokopedia || 'https://www.tokopedia.com/admscovermobil'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 rounded-lg bg-[#03AC0E]/10 hover:bg-[#03AC0E]/20 text-[#03AC0E] border border-[#03AC0E]/30 text-[10px] font-bold truncate transition-colors"
                title="Beli di Tokopedia"
              >
                Tokopedia
              </a>
              <a
                href={settings.tiktok || 'https://www.tiktok.com/@admscovermobil'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 rounded-lg bg-[#25F4EE]/10 hover:bg-[#25F4EE]/20 text-[#25F4EE] border border-[#25F4EE]/30 text-[10px] font-bold truncate transition-colors"
                title="Beli di TikTok Shop"
              >
                TikTok
              </a>
              <a
                href={settings.instagram || 'https://instagram.com/admscovermobil'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 rounded-lg bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] border border-[#E1306C]/30 text-[10px] font-bold truncate transition-colors"
                title="Order via Instagram DM"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
