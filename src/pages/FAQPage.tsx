import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HelpCircle, ChevronDown, MessageCircle, Shield } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl } from '../lib/whatsapp';

interface FAQPageProps {
  navigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ navigate }) => {
  const { settings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const FAQ_ITEMS = [
    {
      category: 'produk',
      q: 'Apakah cover mobil ADMS aman untuk mobil berwarna putih?',
      a: 'Sangat aman! Cover ADMS tidak akan luntur atau meninggalkan noda warna pada cat mobil putih. Material dan pewarna yang kami gunakan bersertifikasi UV-Resistant dan lapisan dalamnya berwarna netral/putih lembut.'
    },
    {
      category: 'produk',
      q: 'Bagaimana jika mobil saya terparkir di tempat terbuka terkena hujan badai dan terik matahari?',
      a: 'Kami sangat merekomendasikan varian "Outdoor Heavy Duty" atau "4-Layer Waterproof Armor". Seri ini memiliki lapisan ganda anti rembes, jahitan ultrasonic heat-sealed, serta 4 tali pengait velg dan karet keliling sehingga tidak akan terbang tertiup angin kencang.'
    },
    {
      category: 'produk',
      q: 'Apakah bahan cover mobil ADMS membuat bodi mobil baret halus?',
      a: 'Sama sekali tidak. Lapisan paling bawah (yang menempel langsung ke bodi) menggunakan Ultra-Soft Cotton Fleece yang teksturnya seperti kain mikrofiber lembut, aman untuk cat standar maupun mobil yang sudah dicoating / dipasang PPF.'
    },
    {
      category: 'pemesanan',
      q: 'Mengapa pemesanan di ADMS diarahkan ke WhatsApp?',
      a: 'Setiap merk dan model mobil memiliki dimensi yang spesifik (panjang, lebar, tinggi, modifikasi bodykit/spoiler). Melalui WhatsApp, tim kami dapat memastikan ukuran yang Anda pesan 100% presisi dan pas untuk mobil Anda sebelum dikirim, serta memberikan estimasi ongkir terbaik.'
    },
    {
      category: 'pemesanan',
      q: 'Apakah saya bisa memesan cover ukuran custom untuk mobil lama atau mobil langka?',
      a: 'Bisa! Kami memiliki database ribuan ukuran mobil dari tahun 1980 hingga mobil keluaran terbaru 2026. Anda cukup sebutkan merk, tipe, dan tahun mobil saat chat WhatsApp.'
    },
    {
      category: 'pengiriman',
      q: 'Berapa lama estimasi pengiriman sampai di alamat saya?',
      a: 'Untuk wilayah Jabodetabek berkisar 1-2 hari kerja (atau opsi Sameday). Untuk wilayah Pulau Jawa 2-3 hari kerja, dan luar Pulau Jawa 3-5 hari kerja menggunakan ekspedisi rekanan kami.'
    },
    {
      category: 'pengiriman',
      q: 'Apakah ada garansi jika cover yang diterima ukurannya kekecilan atau tidak pas?',
      a: 'Ya, ADMS memberikan Garansi Pas! Jika ukuran yang kami rekomendasikan tidak pas dengan tipe mobil yang Anda sebutkan, cover dapat ditukar secara gratis.'
    },
    {
      category: 'perawatan',
      q: 'Bagaimana cara merawat dan membersihkan cover mobil ADMS?',
      a: 'Cukup bentangkan cover atau pasang di mobil, lalu semprot dengan air bersih dan lap dengan kanebo/mikrofiber. Jangan dicuci menggunakan mesin cuci atau deterjen keras agar lapisan water-repellent tetap awet.'
    }
  ];

  const filteredFaqs = activeCategory === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(f => f.category === activeCategory);

  const waUrl = buildGeneralInquiryWhatsAppUrl(
    settings,
    'Halo ADMS COVER MOBIL 👋\n\nSaya ada pertanyaan yang belum tercantum di halaman FAQ.'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F27D26]/20 text-[#F27D26] text-xs font-bold border border-[#F27D26]/30">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>PUSAT BANTUAN</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Informasi seputar produk, kualitas bahan, proses pesanan via WhatsApp, garansi, dan pengiriman.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { id: 'all', label: 'Semua Pertanyaan' },
          { id: 'produk', label: 'Produk & Bahan' },
          { id: 'pemesanan', label: 'Cara Pesan WhatsApp' },
          { id: 'pengiriman', label: 'Pengiriman & Garansi' },
          { id: 'perawatan', label: 'Perawatan' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeCategory === tab.id
                ? 'bg-[#F27D26] text-white shadow-md'
                : 'bg-[#12161F] text-zinc-400 hover:text-white border border-[#1F2634]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#12161F] border border-[#1F2634] overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-100 hover:text-[#F27D26] transition-colors font-display"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                  openIndex === idx ? 'rotate-180 text-[#F27D26]' : ''
                }`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-[#1F2634] pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still Have Questions? */}
      <div className="p-8 rounded-3xl bg-[#12161F] border border-[#1F2634] text-center space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white font-display">Masih punya pertanyaan lain?</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Customer Service kami siap membantu menjawab pertanyaan Anda dan merekomendasikan cover mobil yang tepat.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#F27D26]/30"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Tanya Admin via WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
