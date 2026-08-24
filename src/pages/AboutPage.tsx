import React from 'react';
import { useStore } from '../context/StoreContext';
import { Shield, Droplets, Sun, Layers, Award, Sparkles, Truck, CheckCircle2, MessageCircle } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '../lib/whatsapp';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useStore();
  const waUrl = buildGeneralInquiryWhatsAppUrl(
    settings,
    'Halo ADMS COVER MOBIL 👋\n\nSaya ingin mengenal lebih banyak tentang produk dan pemesanan cover mobil ADMS.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F27D26]/20 text-[#F27D26] text-xs font-bold border border-[#F27D26]/30">
          <Shield className="w-3.5 h-3.5" />
          <span>TENTANG ADMS COVER MOBIL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
          Dedikasi Perlindungan Maksimal untuk Kendaraan Anda
        </h1>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          ADMS COVER MOBIL lahir dari komitmen untuk menyediakan perlindungan terbaik bagi pemilik mobil di Indonesia. Kami memahami betapa berharganya kendaraan Anda terhadap paparan cuaca ekstrim tropis.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden bg-[#12161F] border border-[#1F2634] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=900&auto=format&fit=crop&q=80"
            alt="ADMS Cover Mobil Factory Quality"
            className="w-full h-80 sm:h-96 object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Mengapa Kami Berbeda?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Berbeda dengan sarung mobil konvensional tipis yang mudah rembes dan menggores cat, cover mobil ADMS dirancang dengan teknologi multi-lapis terpadu. Lapisan luar menolak air layaknya daun talas, lapisan tengah memantulkan panas UV, dan lapisan terdalam menggunakan kain katun sutra mikro yang melindungi kilau cat bodi mobil.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#F27D26] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-zinc-300">
                <strong className="text-white">Custom Fit & Presisi:</strong> Pola jahitan yang disesuaikan dengan dimensi nyata lekukan mobil.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#F27D26] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-zinc-300">
                <strong className="text-white">Anti Terbang & Tahan Angin Kencang:</strong> Dilengkapi tali pengait di 4 velg roda dan karet keliling 360°.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#F27D26] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-zinc-300">
                <strong className="text-white">Pemesanan Langsung & Ramah:</strong> Seluruh pemesanan dan konsultasi dilayani oleh CS berpengalaman via WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Layer Armor Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#12161F] border border-[#1F2634] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">
            TEKNOLOGI MATERIAL
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Konstruksi 4-Layer Armor ADMS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-[#0A0C10] border border-[#1F2634] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#F27D26]/10 text-[#F27D26] flex items-center justify-center font-bold text-xs">
              Lapis 1
            </div>
            <h4 className="text-sm font-bold text-white font-display">Oxford Outer Coating</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Kain poliester berkekuatan tinggi dengan water-repellent Lotus Effect anti air & debu.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A0C10] border border-[#1F2634] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
              Lapis 2
            </div>
            <h4 className="text-sm font-bold text-white font-display">Reflective Silver Film</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Memantulkan 99% sinar ultraviolet matahari dan menjaga suhu kabin mobil tetap sejuk.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A0C10] border border-[#1F2634] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">
              Lapis 3
            </div>
            <h4 className="text-sm font-bold text-white font-display">EVA Breathable Membrane</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mencegah kelembaban terperangkap di bawah cover sehingga mobil bebas jamur kaca.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0A0C10] border border-[#1F2634] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
              Lapis 4
            </div>
            <h4 className="text-sm font-bold text-white font-display">Ultra-Soft Cotton Fleece</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Lapisan bulu katun ultra halus yang bersentuhan dengan cat mobil, dijamin 100% anti baret.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
          Siap Memberikan Perlindungan Terbaik untuk Mobil Anda?
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-[#F27D26]/30"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Konsultasi WhatsApp Sekarang</span>
          </a>
          <button
            onClick={() => navigate('/produk')}
            className="px-6 py-3.5 rounded-xl bg-[#181D28] hover:bg-[#202736] text-zinc-200 hover:text-white font-bold text-xs sm:text-sm border border-[#1F2634]"
          >
            Lihat Produk Kami
          </button>
        </div>
      </div>
    </div>
  );
};
