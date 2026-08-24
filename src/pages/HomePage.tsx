import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CarFitFinder } from '../components/CarFitFinder';
import { buildGeneralInquiryWhatsAppUrl } from '../lib/whatsapp';
import {
  Shield,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Award,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { settings, categories } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          const prods: Product[] = data.products;
          setFeaturedProducts(prods.filter(p => p.isFeatured || p.isBestSeller).slice(0, 4));
          setPromoProducts(prods.filter(p => p.isPromo).slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const waConsultUrl = buildGeneralInquiryWhatsAppUrl(
    settings,
    'Halo ADMS COVER MOBIL 👋\n\nSaya ingin konsultasi memilih cover mobil yang paling cocok untuk kendaraan saya.'
  );

  const FAQS = [
    {
      q: 'Apakah cover mobil ADMS aman dan tidak membuat cat mobil baret?',
      a: 'Sangat aman! Seluruh cover mobil ADMS menggunakan lapisan terdalam berupa Ultra-Soft Cotton Fleece yang sangat lembut dan dirancang khusus tidak menggores clear coat maupun lapisan nano ceramic mobil Anda.'
    },
    {
      q: 'Bagaimana cara melakukan pemesanan di ADMS COVER MOBIL?',
      a: 'Pemesanan sangat mudah dan cepat! Anda cukup memilih produk dan varian (ukuran/warna) di website, lalu klik tombol "Pesan via WhatsApp". Pesan pesanan akan otomatis terbuat di WhatsApp Admin kami untuk konfirmasi ketersediaan stok, ongkir, dan pengiriman.'
    },
    {
      q: 'Bagaimana cara menentukan ukuran cover yang pas untuk mobil saya?',
      a: 'Anda dapat menggunakan fitur "Fit Finder" interaktif di website kami atau langsung klik tombol Chat WhatsApp untuk berkonsultasi gratis dengan CS kami mengenai merk, tipe, dan tahun mobil Anda.'
    },
    {
      q: 'Apakah bisa memesan cover custom untuk mobil modifikasi atau bodi kit khusus?',
      a: 'Tentu bisa! Kami menyediakan layanan Cover Mobil Custom Made-by-Order yang dapat disesuaikan dengan penambahan spoiler, bodykit, tanduk depan, roofrack, serta kombinasi 2 warna dan bordir nama/logo.'
    },
    {
      q: 'Berapa lama proses pengiriman barang?',
      a: 'Untuk produk ready stock, pesanan akan dikirim di hari yang sama (sebelum jam 16.00 WIB) menggunakan ekspedisi terpercaya (JNE, J&T, SiCepat, Paxel, atau Sameday/Instant untuk Jabodetabek).'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#07080B] pt-10 pb-16 sm:pb-24 border-b border-[#1F2634]">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#F27D26]/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-orange-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12161F] border border-[#F27D26]/30 text-[#F27D26] text-xs font-bold shadow-md">
                <Shield className="w-4 h-4 text-[#F27D26]" />
                <span>SPESIALIS COVER MOBIL PREMIUM #1 INDONESIA</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] font-display">
                Lindungi Mobil Anda dari <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F27D26] to-amber-200">Debu, Panas & Hujan.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Cover mobil berkualitas tinggi untuk membantu menjaga kendaraan Anda tetap bersih, terlindungi, dan terawat setiap hari di segala kondisi cuaca.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate('/produk')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#F27D26]/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                  id="btn-hero-shop-now"
                >
                  <span>BELANJA SEKARANG</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href={waConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#12161F] hover:bg-[#181D28] border border-[#1F2634] text-zinc-200 hover:text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-[#F27D26]" />
                  <span>Konsultasi Ukuran (WA)</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#1F2634] grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#F27D26] font-display">100%</div>
                  <div className="text-[11px] text-zinc-400 font-medium">Waterproof Lotus Effect</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-display">UPF 50+</div>
                  <div className="text-[11px] text-zinc-400 font-medium">Anti UV & Heat Block</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#F27D26] font-display">15.000+</div>
                  <div className="text-[11px] text-zinc-400 font-medium">Mobil Terlindungi</div>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card Frame */}
                <div className="relative rounded-3xl overflow-hidden bg-[#12161F] border-2 border-[#1F2634] shadow-2xl p-2">
                  <img
                    src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=900&auto=format&fit=crop&q=80"
                    alt="Cover Mobil ADMS Premium Outdoor"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                  />

                  {/* Floating Feature Badges */}
                  <div className="absolute bottom-6 left-6 right-6 p-3.5 rounded-2xl bg-[#0A0C10]/90 backdrop-blur-md border border-[#1F2634] flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F27D26]/15 text-[#F27D26] flex items-center justify-center">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">ADMS 4-Layer Armor</div>
                        <div className="text-[11px] text-zinc-400">Cotton Fleece Anti Baret</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-[#F27D26] text-black font-bold text-[11px]">
                      Garansi Pas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATEGORI PILIHAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">
              PILIHAN KATEGORI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
              Kategori Cover Mobil
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Temukan jenis cover yang paling sesuai dengan kebutuhan parkir Anda
            </p>
          </div>
          <button
            onClick={() => navigate('/produk')}
            className="text-xs sm:text-sm font-bold text-[#F27D26] hover:text-[#E06A14] flex items-center gap-1.5"
          >
            <span>Semua Produk</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate(`/kategori/${cat.slug}`)}
              className="group relative rounded-2xl overflow-hidden bg-[#12161F] border border-[#1F2634] hover:border-[#F27D26]/50 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#0A0C10] relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#F27D26] transition-colors font-display">
                    {cat.name}
                  </h3>
                  {cat.productCount !== undefined && (
                    <span className="text-[11px] text-zinc-300 font-medium">
                      {cat.productCount} Produk
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRODUK UNGGULAN & TERLARIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">
              BEST SELLER
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
              Produk Cover Terlaris
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Pilihan favorit ribuan pemilik mobil di seluruh Indonesia
            </p>
          </div>
          <button
            onClick={() => navigate('/produk')}
            className="text-xs sm:text-sm font-bold text-[#F27D26] hover:text-[#E06A14] flex items-center gap-1.5"
          >
            <span>Lihat Semua Katalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-[#12161F] animate-pulse rounded-2xl border border-[#1F2634]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* 5. FIT FINDER INTERAKTIF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CarFitFinder navigate={navigate} />
      </section>

      {/* 6. PROMO SPESIAL SECTION */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#12161F] via-[#181D28] to-[#12161F] border border-[#F27D26]/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-600/30 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PROMO TERBATAS HARI INI</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                  Diskon Khusus Cover Mobil
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                  Hemat hingga 30% untuk pemesanan langsung melalui WhatsApp hari ini!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map(product => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#F27D26] uppercase tracking-widest">
            TANYA JAWAB
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Jawaban lengkap seputar produk, kualitas bahan, dan proses pemesanan via WhatsApp
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#12161F] border border-[#1F2634] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-100 hover:text-[#F27D26] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-zinc-400 transition-transform duration-200 ${
                    openFaqIndex === idx ? 'rotate-180 text-[#F27D26]' : ''
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-[#1F2634] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181D28] via-[#202736] to-[#12161F] border border-[#F27D26]/40 p-8 sm:p-12 text-center text-white shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight font-display">
              Lindungi Mobil Kesayangan Anda Sekarang!
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm sm:leading-relaxed">
              Konsultasikan tipe dan ukuran mobil Anda secara gratis dengan tim kami via WhatsApp. Dapatkan cover yang presisi, awet, dan berkualitas premium.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>CHAT WHATSAPP SEKARANG</span>
              </a>
              <button
                onClick={() => navigate('/produk')}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#12161F] hover:bg-[#181D28] text-white font-bold text-sm border border-[#1F2634] transition-colors"
              >
                Lihat Katalog Produk
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
