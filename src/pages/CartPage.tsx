import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatIDR, buildCartWhatsAppUrl } from '../lib/whatsapp';
import {
  ShoppingBag,
  Trash2,
  MessageCircle,
  ArrowRight,
  Shield,
  CheckCircle2,
  Info,
  ChevronLeft
} from 'lucide-react';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, settings } = useStore();

  const totalAmount = getCartTotal();

  const handleOrderAllWhatsApp = () => {
    const waUrl = buildCartWhatsAppUrl(settings, cart);
    window.open(waUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#12161F] border border-[#1F2634] text-zinc-500 flex items-center justify-center mx-auto shadow-xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white font-display">Keranjang Pemesanan Kosong</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Anda belum menambahkan sarung cover mobil ke dalam keranjang. Silakan jelajahi katalog kami untuk menemukan pelindung terbaik bagi mobil Anda.
          </p>
        </div>
        <button
          onClick={() => navigate('/produk')}
          className="px-8 py-3.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-xl shadow-[#F27D26]/30 inline-flex items-center gap-2 transition-transform transform hover:scale-105"
        >
          <span>Mulai Belanja Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2634] pb-6">
        <div>
          <button
            onClick={() => navigate('/produk')}
            className="text-xs text-zinc-400 hover:text-[#F27D26] flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Lanjut Belanja
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Keranjang Pemesanan ({cart.length} Produk)
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Daftar cover mobil yang akan dipesan melalui WhatsApp Admin ADMS
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" /> Kosongkan Keranjang
        </button>
      </div>

      {/* Cart Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div
              key={item.id}
              className="p-4 sm:p-6 rounded-2xl bg-[#12161F] border border-[#1F2634] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-md"
            >
              {/* Product Thumbnail */}
              <img
                src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80'}
                alt={item.product.name}
                className="w-20 h-20 rounded-xl object-cover bg-[#0A0C10] shrink-0 cursor-pointer"
                onClick={() => navigate(`/produk/${item.product.slug}`)}
                referrerPolicy="no-referrer"
              />

              {/* Item Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[11px] font-bold text-[#F27D26] uppercase tracking-wider">
                  {item.product.categoryName}
                </span>
                <h3
                  onClick={() => navigate(`/produk/${item.product.slug}`)}
                  className="font-bold text-white text-sm sm:text-base hover:text-[#F27D26] transition-colors cursor-pointer truncate font-display"
                >
                  {item.product.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-0.5">
                  <span className="bg-[#0A0C10] border border-[#1F2634] px-2 py-0.5 rounded text-zinc-300">
                    Ukuran: <strong className="text-white">{item.size}</strong>
                  </span>
                  <span className="bg-[#0A0C10] border border-[#1F2634] px-2 py-0.5 rounded text-zinc-300">
                    Warna: <strong className="text-white">{item.color}</strong>
                  </span>
                </div>
                <div className="text-xs text-[#F27D26] font-semibold pt-1 font-display">
                  {formatIDR(item.price)} / pcs
                </div>
              </div>

              {/* Quantity & Subtotal */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1F2634]">
                {/* Qty Button */}
                <div className="flex items-center border border-[#1F2634] rounded-xl bg-[#0A0C10]">
                  <button
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="px-3 py-1 text-zinc-300 hover:text-white font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-white min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="px-3 py-1 text-zinc-300 hover:text-white font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-white font-display">
                    {formatIDR(item.subtotal)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Hapus produk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary Box & WhatsApp Order Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#12161F] border border-[#1F2634] shadow-xl space-y-6 sticky top-24">
            <h2 className="font-bold text-white text-base pb-3 border-b border-[#1F2634] font-display">
              Ringkasan Estimasi Pesanan
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Total Jumlah Cover:</span>
                <span className="font-semibold text-white">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)} item
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimasi Harga Produk:</span>
                <span className="font-semibold text-white">{formatIDR(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Ongkos Kirim:</span>
                <span className="text-[#F27D26] font-semibold">Dihitung via WhatsApp</span>
              </div>

              <div className="pt-4 border-t border-[#1F2634] flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Estimasi:</span>
                <span className="text-2xl font-black text-[#F27D26] font-display">
                  {formatIDR(totalAmount)}
                </span>
              </div>
            </div>

            {/* Note on WhatsApp Checkout */}
            <div className="p-3.5 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-[11px] text-zinc-400 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
              <span>
                Seluruh produk di atas akan diformat rapi ke dalam satu pesan WhatsApp untuk konfirmasi stok dan pengiriman bersama admin.
              </span>
            </div>

            {/* Pesan Semua via WhatsApp Button */}
            <button
              onClick={handleOrderAllWhatsApp}
              className="w-full py-4 px-6 rounded-2xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-black text-sm shadow-xl shadow-[#F27D26]/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95"
              id="btn-cart-pesan-semua-wa"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>PESAN SEMUA VIA WHATSAPP</span>
            </button>

            <button
              onClick={() => navigate('/produk')}
              className="w-full py-2.5 text-center text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              + Tambah Produk Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
