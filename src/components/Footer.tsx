import React from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, MessageCircle, Phone, Mail, MapPin, Clock, ArrowRight, Instagram, Facebook } from 'lucide-react';
import { cleanWhatsAppNumber } from '../lib/whatsapp';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings, categories } = useStore();
  const waClean = cleanWhatsAppNumber(settings.whatsappNumber || '6281234567890');

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07080B] text-zinc-400 border-t border-[#1F2634]">
      {/* Value Badges Banner */}
      <div className="border-b border-[#1F2634] bg-[#0A0C10]/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] flex items-center justify-center mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm">100% Anti Air & UV</h4>
            <p className="text-xs text-zinc-400 mt-1">Efek daun talas dan proteksi panas maksimal</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm">Lapisan Lembut Anti Baret</h4>
            <p className="text-xs text-zinc-400 mt-1">Cotton fleece aman untuk cat & nano ceramic</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] flex items-center justify-center mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm">Presisi Custom Fit</h4>
            <p className="text-xs text-zinc-400 mt-1">Ukuran pas tiap tipe mobil + tali pengait velg</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/10 text-[#F27D26] flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm">Fast Response WhatsApp</h4>
            <p className="text-xs text-zinc-400 mt-1">Konsultasi ukuran & tipe cover gratis via CS</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => handleNav('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F27D26] to-[#C95C10] flex items-center justify-center shadow-lg shadow-[#F27D26]/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">{settings.storeName || 'ADMS COVER MOBIL'}</span>
                <p className="text-xs text-[#F27D26] font-semibold">{settings.slogan || 'Lindungi Mobil Anda, Setiap Saat.'}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              {settings.storeDescription || 'Produsen dan toko cover mobil terpercaya di Indonesia. Menghadirkan perlindungan terbaik untuk menjaga estetika dan keawetan cat bodi kendaraan Anda di segala kondisi cuaca.'}
            </p>
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {settings.shopee && (
                <a
                  href={settings.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#12161F] hover:bg-[#EE4D2D]/20 text-[#EE4D2D] hover:text-white flex items-center justify-center transition-colors border border-[#1F2634] hover:border-[#EE4D2D]/50"
                  aria-label="Shopee Official Store"
                  title="Shopee"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M19.5 7.5h-2.25V6a5.25 5.25 0 0 0-10.5 0v1.5H4.5A1.5 1.5 0 0 0 3 9v11.25A2.25 2.25 0 0 0 5.25 22.5h13.5A2.25 2.25 0 0 0 21 20.25V9a1.5 1.5 0 0 0-1.5-1.5ZM8.25 6a3.75 3.75 0 1 1 7.5 0v1.5h-7.5V6Z" />
                  </svg>
                </a>
              )}
              {settings.tokopedia && (
                <a
                  href={settings.tokopedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#12161F] hover:bg-[#03AC0E]/20 text-[#03AC0E] hover:text-white flex items-center justify-center transition-colors border border-[#1F2634] hover:border-[#03AC0E]/50"
                  aria-label="Tokopedia Official Store"
                  title="Tokopedia"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M12 2C8.5 2 5.5 4.2 4.4 7.4L2.1 14c-.6 1.7.6 3.5 2.4 3.5h.5c.3 2.5 2.4 4.5 5 4.5h4c2.6 0 4.7-2 5-4.5h.5c1.8 0 3-1.8 2.4-3.5l-2.3-6.6C18.5 4.2 15.5 2 12 2Z" />
                  </svg>
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#12161F] hover:bg-[#25F4EE]/20 text-[#25F4EE] hover:text-white flex items-center justify-center transition-colors border border-[#1F2634] hover:border-[#25F4EE]/50"
                  aria-label="TikTok Shop"
                  title="TikTok"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.882 2.582 2.897 2.897 0 0 1-2.896-2.896 2.897 2.897 0 0 1 2.896-2.896c.394 0 .768.077 1.11.216V9.16a6.34 6.34 0 0 0-1.11-.1c-3.535 0-6.402 2.867-6.402 6.402s2.867 6.402 6.402 6.402 6.402-2.867 6.402-6.402V9.01a8.167 8.167 0 0 0 4.887 1.602V7.167a4.774 4.774 0 0 1-1.192-.481Z" />
                  </svg>
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#12161F] hover:bg-[#E1306C]/20 text-[#E1306C] hover:text-white flex items-center justify-center transition-colors border border-[#1F2634] hover:border-[#E1306C]/50"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${waClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#F27D26]/15 text-[#F27D26] hover:bg-[#F27D26] hover:text-white flex items-center justify-center transition-colors border border-[#F27D26]/30"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-display">Menu Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('/')} className="hover:text-[#F27D26] transition-colors">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/produk')} className="hover:text-[#F27D26] transition-colors">
                  Katalog Semua Produk
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/tentang')} className="hover:text-[#F27D26] transition-colors">
                  Tentang ADMS COVER
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/faq')} className="hover:text-[#F27D26] transition-colors">
                  Tanya Jawab (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/kontak')} className="hover:text-[#F27D26] transition-colors">
                  Kontak & Lokasi
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/keranjang')} className="hover:text-[#F27D26] transition-colors">
                  Keranjang Pemesanan
                </button>
              </li>
            </ul>
          </div>

          {/* Kategori Pilihan */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-display">Kategori Cover</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleNav(`/kategori/${cat.slug}`)}
                    className="hover:text-[#F27D26] transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak Toko */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-display">Hubungi Kami</h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>{settings.address || 'Jakarta, Indonesia'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#F27D26] shrink-0" />
                <a
                  href={`https://wa.me/${waClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F27D26] font-semibold"
                >
                  +{settings.whatsappNumber || '6281234567890'} (WA)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>{settings.email || 'info@admscovermobil.com'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>{settings.operatingHours || '08.00 - 21.00 WIB'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Note & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#1F2634] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} <span className="text-zinc-300 font-semibold">{settings.storeName || 'ADMS COVER MOBIL'}</span>. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Pemesanan Langsung WhatsApp Tanpa Checkout Otomatis</span>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => handleNav('/admin/login')}
              className="text-zinc-500 hover:text-[#F27D26] underline"
            >
              Login Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
