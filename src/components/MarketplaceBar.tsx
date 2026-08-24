import React from 'react';
import { useStore } from '../context/StoreContext';
import { ExternalLink, CheckCircle2, ShoppingCart, Sparkles } from 'lucide-react';

export const MarketplaceBar: React.FC = () => {
  const { settings } = useStore();

  const shopeeUrl = settings.shopee || 'https://shopee.co.id/admscovermobil';
  const tiktokUrl = settings.tiktok || 'https://www.tiktok.com/@admscovermobil';
  const instagramUrl = settings.instagram || 'https://instagram.com/admscovermobil';
  const tokopediaUrl = settings.tokopedia || 'https://www.tokopedia.com/admscovermobil';

  const channels = [
    {
      id: 'shopee',
      name: 'Shopee',
      title: 'Shopee Official Store',
      tag: 'Bebas Ongkir & Diskon',
      badge: 'Official Mall',
      url: shopeeUrl,
      borderColor: 'hover:border-[#EE4D2D]/60',
      glowColor: 'group-hover:shadow-[#EE4D2D]/15',
      iconBg: 'bg-[#EE4D2D]',
      textColor: 'group-hover:text-[#EE4D2D]',
      tagBg: 'bg-[#EE4D2D]/15 text-[#FF6E4E] border-[#EE4D2D]/30',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" aria-hidden="true">
          <path d="M19.5 7.5h-2.25V6a5.25 5.25 0 0 0-10.5 0v1.5H4.5A1.5 1.5 0 0 0 3 9v11.25A2.25 2.25 0 0 0 5.25 22.5h13.5A2.25 2.25 0 0 0 21 20.25V9a1.5 1.5 0 0 0-1.5-1.5ZM8.25 6a3.75 3.75 0 1 1 7.5 0v1.5h-7.5V6Zm11.25 14.25a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75h2.25v1.5a.75.75 0 0 0 1.5 0v-1.5h7.5v1.5a.75.75 0 0 0 1.5 0v-1.5h2.25v10.5Z" />
          <path d="M12 12.5c-1.6 0-2.5.8-2.5 1.8 0 2.2 3.5 1.7 3.5 3.1 0 .6-.5 1-1.3 1-.9 0-1.7-.5-2.2-1.1l-.8.9c.7.8 1.8 1.4 3 1.4 1.8 0 2.8-.9 2.8-2.1 0-2.3-3.5-1.8-3.5-3.1 0-.5.5-.8 1.1-.8.7 0 1.4.3 1.9.8l.8-.8c-.7-.7-1.6-1.1-2.8-1.1Z" />
        </svg>
      )
    },
    {
      id: 'tiktok',
      name: 'TikTok Shop',
      title: 'TikTok Shop Official',
      tag: 'Live Promo & Voucher',
      badge: 'Official Shop',
      url: tiktokUrl,
      borderColor: 'hover:border-[#25F4EE]/60',
      glowColor: 'group-hover:shadow-[#25F4EE]/15',
      iconBg: 'bg-[#010101] border border-white/20',
      textColor: 'group-hover:text-[#25F4EE]',
      tagBg: 'bg-[#25F4EE]/10 text-[#25F4EE] border-[#25F4EE]/30',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" aria-hidden="true">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.882 2.582 2.897 2.897 0 0 1-2.896-2.896 2.897 2.897 0 0 1 2.896-2.896c.394 0 .768.077 1.11.216V9.16a6.34 6.34 0 0 0-1.11-.1c-3.535 0-6.402 2.867-6.402 6.402s2.867 6.402 6.402 6.402 6.402-2.867 6.402-6.402V9.01a8.167 8.167 0 0 0 4.887 1.602V7.167a4.774 4.774 0 0 1-1.192-.481Z" />
        </svg>
      )
    },
    {
      id: 'tokopedia',
      name: 'Tokopedia',
      title: 'Tokopedia Official',
      tag: 'Bebas Ongkir & Cicilan',
      badge: 'Official Store',
      url: tokopediaUrl,
      borderColor: 'hover:border-[#03AC0E]/60',
      glowColor: 'group-hover:shadow-[#03AC0E]/15',
      iconBg: 'bg-[#03AC0E]',
      textColor: 'group-hover:text-[#03AC0E]',
      tagBg: 'bg-[#03AC0E]/15 text-[#32D43E] border-[#03AC0E]/30',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" aria-hidden="true">
          <path d="M12 2C8.5 2 5.5 4.2 4.4 7.4L2.1 14c-.6 1.7.6 3.5 2.4 3.5h.5c.3 2.5 2.4 4.5 5 4.5h4c2.6 0 4.7-2 5-4.5h.5c1.8 0 3-1.8 2.4-3.5l-2.3-6.6C18.5 4.2 15.5 2 12 2Zm-3.5 9c-.8 0-1.5-.7-1.5-1.5S7.7 8 8.5 8s1.5.7 1.5 1.5S9.3 11 8.5 11Zm7 0c-.8 0-1.5-.7-1.5-1.5S14.7 8 15.5 8s1.5.7 1.5 1.5-.7 1.5-1.5 1.5ZM12 17c-2.2 0-4-1.3-4-3h8c0 1.7-1.8 3-4 3Z" />
        </svg>
      )
    },
    {
      id: 'instagram',
      name: 'Instagram',
      title: 'Instagram @admscovermobil',
      tag: 'Katalog & Konsultasi DM',
      badge: 'Official Account',
      url: instagramUrl,
      borderColor: 'hover:border-[#E1306C]/60',
      glowColor: 'group-hover:shadow-[#E1306C]/15',
      iconBg: 'bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
      textColor: 'group-hover:text-[#FCAF45]',
      tagBg: 'bg-[#E1306C]/15 text-[#FFA0C0] border-[#E1306C]/30',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
      )
    }
  ];

  return (
    <section
      aria-label="Toko Resmi di Marketplace & Media Sosial"
      className="w-full bg-[#080B10] border-b border-[#1F2634] py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8 relative z-20 shadow-md"
      id="marketplace-official-bar"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Header Tag / Label */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#F27D26]/15 border border-[#F27D26]/30 text-[#F27D26] flex items-center justify-center shadow-inner">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider font-display">
                  Official Store & Marketplace
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                Pilih platform belanja resmi favorit Anda dengan garansi 100% original:
              </p>
            </div>
          </div>

          {/* Marketplace Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-3 flex-1 lg:max-w-3xl">
            {channels.map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                id={`link-marketplace-${item.id}`}
                className={`group relative flex items-center gap-2.5 p-2.5 sm:p-2 rounded-xl bg-[#12161F] hover:bg-[#181D28] border border-[#1F2634] ${item.borderColor} transition-all duration-200 shadow-sm hover:shadow-lg ${item.glowColor} hover:-translate-y-0.5`}
              >
                {/* Logo Icon with Authentic Badge */}
                <div className={`w-9 h-9 sm:w-8 sm:h-8 rounded-lg ${item.iconBg} flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                  {item.icon}
                </div>

                {/* Text & Meta */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold text-white ${item.textColor} transition-colors truncate font-display`}>
                      {item.name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                  </div>
                  <span className={`inline-block text-[9.5px] font-medium leading-tight text-zinc-400 group-hover:text-zinc-200 truncate max-w-full`}>
                    {item.tag}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
