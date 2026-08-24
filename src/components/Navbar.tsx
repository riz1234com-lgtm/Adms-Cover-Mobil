import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { buildGeneralInquiryWhatsAppUrl } from '../lib/whatsapp';
import {
  Shield,
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Clock,
  ChevronDown,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { settings, categories, getCartItemCount, wishlist, setIsSearchOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const cartCount = getCartItemCount();
  const wishlistCount = wishlist.length;

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const directWaUrl = buildGeneralInquiryWhatsAppUrl(settings, 'Halo ADMS COVER MOBIL, saya ingin berkonsultasi mengenai cover mobil.');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#1F2634] shadow-xl">
      {/* Top Announcement Bar */}
      <div className="hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5 bg-[#07080B] text-slate-400 text-xs border-b border-[#1A202C]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>{settings.slogan || 'Lindungi Mobil Anda, Setiap Saat.'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>08:00 - 21:00 WIB (Respon Cepat)</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${settings.phone || '+6281234567890'}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{settings.phone || '0812-3456-7890'}</span>
          </a>
          <span className="text-zinc-700">|</span>
          <button
            onClick={() => handleNav('/admin/login')}
            className="text-zinc-400 hover:text-[#F27D26] transition-colors text-xs font-semibold"
          >
            Dashboard Admin
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="nav-brand-logo"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F27D26] to-[#C95C10] flex items-center justify-center shadow-lg shadow-[#F27D26]/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-sans">ADMS</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#F27D26]/15 text-[#F27D26] border border-[#F27D26]/30 tracking-wider">
                  COVER MOBIL
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium tracking-wide">
                Spesialis Selimut Mobil Premium
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNav('/')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/'
                  ? 'text-[#F27D26] bg-[#181D28]'
                  : 'text-zinc-200 hover:text-white hover:bg-[#181D28]/60'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNav('/produk')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath.startsWith('/produk')
                  ? 'text-[#F27D26] bg-[#181D28]'
                  : 'text-zinc-200 hover:text-white hover:bg-[#181D28]/60'
              }`}
            >
              Katalog Produk
            </button>

            {/* Kategori Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPath.startsWith('/kategori')
                    ? 'text-[#F27D26] bg-[#181D28]'
                    : 'text-zinc-200 hover:text-white hover:bg-[#181D28]/60'
                }`}
              >
                <span>Kategori</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isCategoryDropdownOpen && (
                <div
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-64 rounded-xl bg-[#12161F] border border-[#1F2634] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-3 py-1.5">
                    Pilihan Kategori Cover
                  </div>
                  <div className="space-y-1">
                    {categories.slice(0, 8).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleNav(`/kategori/${cat.slug}`)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-200 hover:text-[#F27D26] hover:bg-[#181D28] flex items-center justify-between group transition-colors"
                      >
                        <span className="font-medium">{cat.name}</span>
                        {cat.productCount !== undefined && (
                          <span className="text-xs text-zinc-500 group-hover:text-zinc-400">
                            {cat.productCount}
                          </span>
                        )}
                      </button>
                    ))}
                    <div className="pt-1 border-t border-[#1F2634]">
                      <button
                        onClick={() => handleNav('/produk')}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#F27D26] hover:bg-[#F27D26]/10"
                      >
                        Lihat Semua Kategori →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('/tentang')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/tentang'
                  ? 'text-[#F27D26] bg-[#181D28]'
                  : 'text-zinc-200 hover:text-white hover:bg-[#181D28]/60'
              }`}
            >
              Tentang Kami
            </button>

            <button
              onClick={() => handleNav('/faq')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/faq'
                  ? 'text-[#F27D26] bg-[#181D28]'
                  : 'text-zinc-200 hover:text-white hover:bg-[#181D28]/60'
              }`}
            >
              FAQ
            </button>

            <button
              onClick={() => handleNav('/kontak')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/kontak'
                  ? 'text-[#F27D26] bg-[#181D28]'
                  : 'text-zinc-200 hover:text-white hover:bg-[#181D28]/60'
              }`}
            >
              Kontak
            </button>
          </nav>

          {/* Right Action Icons & WhatsApp Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#181D28] transition-colors"
              title="Cari cover mobil..."
              id="btn-search-nav"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNav('/wishlist')}
              className="relative p-2.5 rounded-xl text-zinc-300 hover:text-rose-400 hover:bg-[#181D28] transition-colors"
              title="Daftar Favorit"
              id="btn-wishlist-nav"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => handleNav('/keranjang')}
              className="relative p-2.5 rounded-xl text-zinc-300 hover:text-[#F27D26] hover:bg-[#181D28] transition-colors"
              title="Keranjang Pemesanan"
              id="btn-cart-nav"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#F27D26] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp CTA Button */}
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white text-sm font-bold shadow-lg shadow-[#F27D26]/25 transition-all transform hover:-translate-y-0.5 select-none"
              id="btn-whatsapp-nav"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pesan via WA</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-[#181D28] transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1017] border-b border-[#1F2634] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentPath === '/' ? 'text-[#F27D26] bg-[#181D28]' : 'text-zinc-200 hover:bg-[#181D28]/60'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handleNav('/produk')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentPath === '/produk' ? 'text-[#F27D26] bg-[#181D28]' : 'text-zinc-200 hover:bg-[#181D28]/60'
              }`}
            >
              Katalog Produk
            </button>
            <div className="pl-4 py-1 space-y-1 border-l-2 border-[#1F2634] ml-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Kategori Pilihan:</span>
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleNav(`/kategori/${cat.slug}`)}
                  className="w-full text-left py-1.5 text-xs text-zinc-300 hover:text-[#F27D26]"
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleNav('/tentang')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentPath === '/tentang' ? 'text-[#F27D26] bg-[#181D28]' : 'text-zinc-200 hover:bg-[#181D28]/60'
              }`}
            >
              Tentang Kami
            </button>
            <button
              onClick={() => handleNav('/faq')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentPath === '/faq' ? 'text-[#F27D26] bg-[#181D28]' : 'text-zinc-200 hover:bg-[#181D28]/60'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => handleNav('/kontak')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                currentPath === '/kontak' ? 'text-[#F27D26] bg-[#181D28]' : 'text-zinc-200 hover:bg-[#181D28]/60'
              }`}
            >
              Kontak
            </button>
            <button
              onClick={() => handleNav('/admin/login')}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-[#F27D26]"
            >
              Dashboard Admin
            </button>
          </div>

          <div className="pt-2">
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat WhatsApp Admin</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
