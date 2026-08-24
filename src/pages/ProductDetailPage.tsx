import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductReview } from '../types';
import { formatIDR, buildSingleProductWhatsAppUrl } from '../lib/whatsapp';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  MessageCircle,
  ShoppingBag,
  Shield,
  CheckCircle2,
  Car,
  Layers,
  Sparkles,
  Share2,
  Heart,
  Droplets,
  Sun,
  Truck,
  ArrowLeft,
  ChevronRight,
  Send,
  User
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, navigate }) => {
  const { settings, addToCart, isInWishlist, toggleWishlist, showToast, trackWaClick, trackProductView } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Variant States
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'compatibility' | 'reviews'>('desc');

  // Review Form States
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerLocation, setReviewerLocation] = useState('');
  const [reviewerCar, setReviewerCar] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product) {
          const prod: Product = data.product;
          setProduct(prod);
          setSelectedImage(prod.images?.[0] || '');
          setSelectedSize(prod.sizes?.[0] || 'M');
          setSelectedColor(prod.colors?.[0] || 'Silver');
          trackProductView(prod.id);

          // Fetch reviews
          fetch(`/api/reviews?productId=${prod.id}`)
            .then(r => r.json())
            .then(revData => {
              if (revData.success && revData.reviews) {
                setReviews(revData.reviews);
              }
            });

          // Fetch related
          fetch(`/api/products?categoryId=${prod.categoryId}`)
            .then(r => r.json())
            .then(relData => {
              if (relData.success && relData.products) {
                setRelatedProducts(relData.products.filter((p: Product) => p.id !== prod.id).slice(0, 4));
              }
            });
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400">Memuat detail cover mobil...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold text-white font-display">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-zinc-400">Produk yang Anda cari mungkin telah dinonaktifkan atau dihapus.</p>
        <button
          onClick={() => navigate('/produk')}
          className="px-6 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-xs"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const effectivePrice = product.discountPrice || product.sellingPrice;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.sellingPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.sellingPrice - product.discountPrice!) / product.sellingPrice) * 100)
    : 0;

  const isFavorited = isInWishlist(product.id);

  const handleOrderWhatsApp = () => {
    trackWaClick(product.id);
    const productUrl = window.location.href;
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
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link produk berhasil disalin!', 'success');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) {
      showToast('Nama dan komentar ulasan wajib diisi.', 'warning');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewerName,
          userLocation: reviewerLocation || 'Indonesia',
          carModel: reviewerCar || 'Mobil Pribadi',
          rating: reviewerRating,
          comment: reviewerComment
        })
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews(prev => [data.review, ...prev]);
        setReviewerName('');
        setReviewerLocation('');
        setReviewerCar('');
        setReviewerComment('');
        showToast('Terima kasih! Ulasan Anda berhasil diterbitkan.', 'success');
      }
    } catch {
      showToast('Gagal mengirim ulasan.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400">
        <button onClick={() => navigate('/')} className="hover:text-[#F27D26]">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/produk')} className="hover:text-[#F27D26]">
          Produk
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-200 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Big Photo */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#0A0C10] border border-[#1F2634] shadow-2xl">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.isBestSeller && (
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-black shadow-md uppercase tracking-wider">
                  ★ Terlaris
                </span>
              )}
              {product.isPromo && (
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white shadow-md uppercase tracking-wider">
                  Promo Spesial
                </span>
              )}
              {hasDiscount && (
                <span className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#F27D26] text-white shadow-md">
                  Hemat {discountPercent}%
                </span>
              )}
            </div>

            {/* Top Right Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[#12161F]/80 hover:bg-[#181D28] text-zinc-300 hover:text-white backdrop-blur-md transition-colors border border-[#1F2634]"
                title="Bagikan link produk"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-colors border ${
                  isFavorited
                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg'
                    : 'bg-[#12161F]/80 hover:bg-[#181D28] text-zinc-300 hover:text-white border-[#1F2634]'
                }`}
                title="Simpan ke Favorit"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#F27D26] scale-105 shadow-md' : 'border-[#1F2634] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Value Feature Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#1F2634] text-center">
            <div className="p-3.5 rounded-2xl bg-[#12161F] border border-[#1F2634]">
              <Droplets className="w-5 h-5 text-[#F27D26] mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">100% Anti Air</div>
              <div className="text-[10px] text-zinc-400">Efek Daun Talas</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#12161F] border border-[#1F2634]">
              <Sun className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">UPF 50+ Anti UV</div>
              <div className="text-[10px] text-zinc-400">Reflektor Panas</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#12161F] border border-[#1F2634]">
              <Shield className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">Anti Gores Cat</div>
              <div className="text-[10px] text-zinc-400">Soft Cotton Fleece</div>
            </div>
          </div>
        </div>

        {/* Right Column: Buying Box & Variant Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12161F] border border-[#1F2634] shadow-xl space-y-6">
            {/* Header Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F27D26] font-bold uppercase tracking-wider">{product.categoryName}</span>
                <span className="font-mono text-zinc-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight font-display">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-3 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-400">({reviews.length || product.reviewCount || 40} Ulasan Pelanggan)</span>
                </div>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Stok Siap Kirim
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#0A0C10] border border-[#1F2634] flex items-baseline justify-between">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">Harga Satuan:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#F27D26] font-display">
                    {formatIDR(effectivePrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-zinc-500 line-through">
                      {formatIDR(product.sellingPrice)}
                    </span>
                  )}
                </div>
              </div>
              {hasDiscount && (
                <span className="px-3 py-1 rounded-xl bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30 text-xs font-bold">
                  Hemat {formatIDR(product.sellingPrice - product.discountPrice!)}
                </span>
              )}
            </div>

            {/* Variant 1: Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">
                    1. Pilih Ukuran Mobil: <span className="text-[#F27D26] font-semibold">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">Panduan Ukuran</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left truncate ${
                        selectedSize === size
                          ? 'bg-[#F27D26] text-white border-[#F27D26] shadow-md'
                          : 'bg-[#0A0C10] text-zinc-300 border-[#1F2634] hover:border-zinc-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant 2: Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-200">
                  2. Pilih Warna: <span className="text-[#F27D26] font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === color
                          ? 'bg-[#F27D26] text-white border-[#F27D26] shadow-md'
                          : 'bg-[#0A0C10] text-zinc-300 border-[#1F2634] hover:border-zinc-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Total Subtotal */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1F2634]">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-200">Jumlah:</label>
                <div className="flex items-center border border-[#1F2634] rounded-xl bg-[#0A0C10]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-zinc-300 hover:text-white font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3.5 py-1.5 text-xs font-bold text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-zinc-300 hover:text-white font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-zinc-400 font-medium">Total Estimasi:</span>
                <div className="text-xl font-black text-[#F27D26] font-display">
                  {formatIDR(effectivePrice * quantity)}
                </div>
              </div>
            </div>

            {/* WhatsApp Ordering Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleOrderWhatsApp}
                className="w-full py-4 px-6 rounded-2xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-black text-base shadow-2xl shadow-[#F27D26]/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 select-none"
                id="btn-main-pesan-wa"
              >
                <MessageCircle className="w-6 h-6 fill-current text-white" />
                <span>PESAN VIA WHATSAPP</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#181D28] hover:bg-[#202736] text-zinc-200 hover:text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-[#1F2634]"
              >
                <ShoppingBag className="w-4 h-4 text-[#F27D26]" />
                <span>Tambah ke Keranjang Pesanan</span>
              </button>
            </div>

            {/* Marketplace Direct Buy Options */}
            <div className="pt-2 border-t border-[#1F2634] space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                <span>Atau Beli via Marketplace Resmi:</span>
                <span className="text-[#F27D26]">100% Original</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={settings.shopee || 'https://shopee.co.id/admscovermobil'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#EE4D2D]/10 hover:bg-[#EE4D2D]/20 border border-[#EE4D2D]/30 text-[#EE4D2D] text-xs font-bold transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M19.5 7.5h-2.25V6a5.25 5.25 0 0 0-10.5 0v1.5H4.5A1.5 1.5 0 0 0 3 9v11.25A2.25 2.25 0 0 0 5.25 22.5h13.5A2.25 2.25 0 0 0 21 20.25V9a1.5 1.5 0 0 0-1.5-1.5ZM8.25 6a3.75 3.75 0 1 1 7.5 0v1.5h-7.5V6Z" />
                  </svg>
                  <span>Shopee</span>
                </a>
                <a
                  href={settings.tokopedia || 'https://www.tokopedia.com/admscovermobil'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#03AC0E]/10 hover:bg-[#03AC0E]/20 border border-[#03AC0E]/30 text-[#03AC0E] text-xs font-bold transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M12 2C8.5 2 5.5 4.2 4.4 7.4L2.1 14c-.6 1.7.6 3.5 2.4 3.5h.5c.3 2.5 2.4 4.5 5 4.5h4c2.6 0 4.7-2 5-4.5h.5c1.8 0 3-1.8 2.4-3.5l-2.3-6.6C18.5 4.2 15.5 2 12 2Z" />
                  </svg>
                  <span>Tokopedia</span>
                </a>
                <a
                  href={settings.tiktok || 'https://www.tiktok.com/@admscovermobil'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25F4EE]/10 hover:bg-[#25F4EE]/20 border border-[#25F4EE]/30 text-[#25F4EE] text-xs font-bold transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.882 2.582 2.897 2.897 0 0 1-2.896-2.896 2.897 2.897 0 0 1 2.896-2.896c.394 0 .768.077 1.11.216V9.16a6.34 6.34 0 0 0-1.11-.1c-3.535 0-6.402 2.867-6.402 6.402s2.867 6.402 6.402 6.402 6.402-2.867 6.402-6.402V9.01a8.167 8.167 0 0 0 4.887 1.602V7.167a4.774 4.774 0 0 1-1.192-.481Z" />
                  </svg>
                  <span>TikTok Shop</span>
                </a>
                <a
                  href={settings.instagram || 'https://instagram.com/admscovermobil'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border border-[#E1306C]/30 text-[#E1306C] text-xs font-bold transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Note & Guarantee */}
            <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
              🔒 <span className="font-semibold text-zinc-300">Pemesanan Bebas Khawatir:</span> Pesan via WhatsApp untuk memastikan ukuran, stok warna, dan estimasi ongkos kirim termurah ke kota Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section: Deskripsi, Spesifikasi, Kompatibilitas Mobil, Ulasan */}
      <div className="rounded-3xl bg-[#12161F] border border-[#1F2634] overflow-hidden shadow-xl">
        {/* Tab Headers */}
        <div className="flex border-b border-[#1F2634] overflow-x-auto bg-[#0A0C10]">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'desc'
                ? 'border-[#F27D26] text-[#F27D26] bg-[#12161F]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Deskripsi Produk
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'specs'
                ? 'border-[#F27D26] text-[#F27D26] bg-[#12161F]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Spesifikasi & Material
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'compatibility'
                ? 'border-[#F27D26] text-[#F27D26] bg-[#12161F]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Kompatibilitas Kendaraan
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#F27D26] text-[#F27D26] bg-[#12161F]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ulasan Pelanggan ({reviews.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-4xl text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-3xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0A0C10] border border-[#1F2634] space-y-1">
                  <span className="text-zinc-400 font-medium">Bahan Utama</span>
                  <p className="font-bold text-white text-sm">{product.material}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0A0C10] border border-[#1F2634] space-y-1">
                  <span className="text-zinc-400 font-medium">Tipe Cover</span>
                  <p className="font-bold text-white text-sm">{product.coverType}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0A0C10] border border-[#1F2634] space-y-1">
                  <span className="text-zinc-400 font-medium">Berat Produk</span>
                  <p className="font-bold text-white text-sm">{product.weight} gram (±{(product.weight / 1000).toFixed(1)} kg)</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0A0C10] border border-[#1F2634] space-y-1">
                  <span className="text-zinc-400 font-medium">Pilihan Ukuran</span>
                  <p className="font-bold text-white text-sm">{product.sizes?.join(', ')}</p>
                </div>
              </div>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-6 border-t border-[#1F2634] pt-4">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3">Detail Spesifikasi:</h4>
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-[#1F2634]">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key}>
                          <td className="py-2.5 text-zinc-400 font-medium w-1/3">{key}</td>
                          <td className="py-2.5 text-zinc-200 font-semibold">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0A0C10] border border-[#1F2634]">
                <Car className="w-6 h-6 text-[#F27D26] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Daftar Kendaraan yang Cocok:</h4>
                  <p className="text-xs text-zinc-300 mt-1">{product.vehicleCompatibility}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                *Mobil Anda tidak tercantum di atas atau memiliki bodykit tambahan? Jangan khawatir! Silakan hubungi admin via WhatsApp untuk konfirmasi ukuran akurat.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-[#0A0C10] border border-[#1F2634] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#181D28] text-zinc-300 flex items-center justify-center font-bold">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5 font-display">
                            <span>{rev.userName}</span>
                            {rev.isVerifiedBuyer && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                Pembeli Terverifikasi
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {rev.userLocation} • Mobil: <span className="text-zinc-300">{rev.carModel}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Submit New Review Form */}
              <div className="p-6 rounded-2xl bg-[#0A0C10] border border-[#1F2634] space-y-4">
                <h4 className="text-sm font-bold text-white font-display">Tulis Ulasan Anda</h4>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={e => setReviewerName(e.target.value)}
                      placeholder="Nama Lengkap *"
                      className="px-3.5 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                      required
                    />
                    <input
                      type="text"
                      value={reviewerLocation}
                      onChange={e => setReviewerLocation(e.target.value)}
                      placeholder="Kota (contoh: Jakarta Selatan)"
                      className="px-3.5 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                    />
                    <input
                      type="text"
                      value={reviewerCar}
                      onChange={e => setReviewerCar(e.target.value)}
                      placeholder="Merk & Tipe Mobil (contoh: Innova Zenix)"
                      className="px-3.5 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-300">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewerRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewerRating ? 'fill-current' : 'text-zinc-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={reviewerComment}
                    onChange={e => setReviewerComment(e.target.value)}
                    rows={3}
                    placeholder="Ceritakan pengalaman Anda menggunakan cover mobil ini..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2634] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-xs flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#1F2634]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white font-display">Cover Mobil Terkait</h3>
            <button
              onClick={() => navigate('/produk')}
              className="text-xs font-bold text-[#F27D26] hover:text-[#E06A14]"
            >
              Lihat Semua →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
