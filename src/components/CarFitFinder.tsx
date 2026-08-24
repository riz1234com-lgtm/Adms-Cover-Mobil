import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { buildCarConsultationWhatsAppUrl } from '../lib/whatsapp';
import { Car, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface CarFitFinderProps {
  navigate: (path: string) => void;
}

interface CarData {
  brand: string;
  models: {
    name: string;
    recommendedSize: string;
    categorySlug: string;
    notes: string;
  }[];
}

const CAR_DATABASE: CarData[] = [
  {
    brand: 'Toyota',
    models: [
      { name: 'Avanza / Veloz', recommendedSize: 'XL (MPV Compact)', categorySlug: 'cover-mpv', notes: 'Pas menutupi bodi hingga bawah velg' },
      { name: 'Innova Reborn / Zenix', recommendedSize: 'XL (Medium MPV)', categorySlug: 'cover-mpv', notes: 'Ukuran ekstra lebar untuk kenyamanan maksimal' },
      { name: 'Fortuner / Hilux', recommendedSize: 'XXL (Large SUV)', categorySlug: 'cover-suv', notes: 'Bodi jangkung dengan 4 pengait velg' },
      { name: 'Rush / Raize', recommendedSize: 'L (Compact SUV)', categorySlug: 'cover-suv', notes: 'Presisi dengan spion' },
      { name: 'Yaris / Agya / Calya', recommendedSize: 'M (Hatchback/City Car)', categorySlug: 'cover-mobil-outdoor', notes: 'Ukuran pas tanpa kedodoran' },
      { name: 'Vios / Corolla Altis / Camry', recommendedSize: 'L (Sedan)', categorySlug: 'cover-sedan', notes: 'Potongan aerodinamis sedan' },
      { name: 'Alphard / Vellfire', recommendedSize: 'XXL (Big Van)', categorySlug: 'cover-mpv', notes: 'Tinggi ekstra menutupi seluruh bodi van' }
    ]
  },
  {
    brand: 'Honda',
    models: [
      { name: 'Brio / Jazz / City Hatchback', recommendedSize: 'M (City Car/Hatchback)', categorySlug: 'cover-sedan', notes: 'Pas dan ringkas' },
      { name: 'HR-V / WR-V / BR-V', recommendedSize: 'L (Compact Crossover/SUV)', categorySlug: 'cover-suv', notes: 'Menutupi lekukan crossover' },
      { name: 'CR-V Turbo / Hybrid', recommendedSize: 'XL (Medium SUV)', categorySlug: 'cover-suv', notes: 'Ukuran pas untuk SUV premium' },
      { name: 'Civic Turbo / City Sedan / Accord', recommendedSize: 'L (Sedan Sport)', categorySlug: 'cover-sedan', notes: 'Desain sporty dengan kuping spion' },
      { name: 'Mobilio / Freed', recommendedSize: 'XL (MPV)', categorySlug: 'cover-mpv', notes: 'Menutupi bagian belakang dengan rapat' }
    ]
  },
  {
    brand: 'Mitsubishi',
    models: [
      { name: 'Xpander / Xpander Cross', recommendedSize: 'XL (MPV Modern)', categorySlug: 'cover-mpv', notes: 'Ukuran bodi lebar pas sempurna' },
      { name: 'Pajero Sport Dakar', recommendedSize: 'XXL (Big Ladder-Frame SUV)', categorySlug: 'cover-suv', notes: 'Bodi tinggi terlindungi hingga ban' },
      { name: 'Xforce / Outlander', recommendedSize: 'L (Compact SUV)', categorySlug: 'cover-suv', notes: 'Desain presisi' }
    ]
  },
  {
    brand: 'Suzuki',
    models: [
      { name: 'Ertiga / XL7', recommendedSize: 'XL (MPV/Crossover)', categorySlug: 'cover-mpv', notes: 'Ukuran pas untuk bodi Ertiga/XL7' },
      { name: 'Jimny 3-Door / 5-Door', recommendedSize: 'L (SUV Custom)', categorySlug: 'cover-suv', notes: 'Kompak dan bodi kotak tertutup rapi' },
      { name: 'Baleno / Ignis / S-Presso', recommendedSize: 'M (City Car)', categorySlug: 'cover-sedan', notes: 'Ringkas dan mudah dipasang' },
      { name: 'Grand Vitara', recommendedSize: 'L (Medium SUV)', categorySlug: 'cover-suv', notes: 'Cover tebal tahan cuaca luar' }
    ]
  },
  {
    brand: 'Hyundai',
    models: [
      { name: 'Creta / Stargazer', recommendedSize: 'XL (Crossover/MPV)', categorySlug: 'cover-mpv', notes: 'Pas lekuk modern futuristik' },
      { name: 'Santa Fe / Palisade', recommendedSize: 'XXL (Large SUV Luxury)', categorySlug: 'cover-suv', notes: 'Ukuran jumbo terlindungi menyeluruh' },
      { name: 'Ioniq 5 / Ioniq 6 EV', recommendedSize: 'XL (Electric Vehicle Special)', categorySlug: 'cover-anti-uv', notes: 'Anti UV melindungi baterai & kabin' }
    ]
  },
  {
    brand: 'Wuling',
    models: [
      { name: 'Confero / Cortez', recommendedSize: 'XL (MPV)', categorySlug: 'cover-mpv', notes: 'Pas bodi keluarga MPV' },
      { name: 'Almaz / Alvez', recommendedSize: 'XL (SUV Crossover)', categorySlug: 'cover-suv', notes: 'Tahan panas dan hujan deras' },
      { name: 'Air EV / Binguo EV', recommendedSize: 'S (Micro EV Special)', categorySlug: 'cover-mobil-indoor', notes: 'Ukuran imut presisi micro car' }
    ]
  },
  {
    brand: 'Daihatsu',
    models: [
      { name: 'Xenia / Sigra', recommendedSize: 'XL (MPV)', categorySlug: 'cover-mpv', notes: 'Pas dan tidak kedodoran' },
      { name: 'Terios / Rocky', recommendedSize: 'L (SUV/Crossover)', categorySlug: 'cover-suv', notes: 'Cover kokoh pengait velg' },
      { name: 'Ayla / Sirion', recommendedSize: 'M (Hatchback)', categorySlug: 'cover-mobil-outdoor', notes: 'Mudah dipasang satu orang' }
    ]
  }
];

export const CarFitFinder: React.FC<CarFitFinderProps> = ({ navigate }) => {
  const { settings } = useStore();
  const [selectedBrand, setSelectedBrand] = useState<string>(CAR_DATABASE[0].brand);
  const [selectedModelName, setSelectedModelName] = useState<string>(CAR_DATABASE[0].models[0].name);
  const [parkingType, setParkingType] = useState<string>('Outdoor (Panas & Hujan)');

  const currentBrandData = CAR_DATABASE.find(b => b.brand === selectedBrand) || CAR_DATABASE[0];
  const currentModelData = currentBrandData.models.find(m => m.name === selectedModelName) || currentBrandData.models[0];

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const newBrandData = CAR_DATABASE.find(b => b.brand === brand) || CAR_DATABASE[0];
    setSelectedModelName(newBrandData.models[0].name);
  };

  const handleConsultWhatsApp = () => {
    const waUrl = buildCarConsultationWhatsAppUrl(
      settings,
      selectedBrand,
      currentModelData.name,
      '2020-2026',
      parkingType
    );
    window.open(waUrl, '_blank');
  };

  const handleViewProducts = () => {
    navigate(`/kategori/${currentModelData.categorySlug}`);
  };

  return (
    <div className="bg-[#12161F] rounded-3xl border border-[#1F2634] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F27D26]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27D26]/15 text-[#F27D26] text-xs font-bold mb-3 border border-[#F27D26]/30">
            <Car className="w-3.5 h-3.5" />
            <span>FIT FINDER INTERAKTIF</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Cari Ukuran Cover yang Pas untuk Mobil Anda
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2">
            Pilih merk dan model kendaraan Anda di bawah ini untuk mendapatkan rekomendasi ukuran serta spesifikasi cover yang presisi.
          </p>
        </div>

        {/* Form Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Brand Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">1. Merk Mobil:</label>
            <select
              value={selectedBrand}
              onChange={e => handleBrandChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white font-semibold text-sm focus:outline-none focus:border-[#F27D26]"
            >
              {CAR_DATABASE.map(b => (
                <option key={b.brand} value={b.brand}>
                  {b.brand}
                </option>
              ))}
            </select>
          </div>

          {/* Model Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">2. Tipe / Model:</label>
            <select
              value={selectedModelName}
              onChange={e => setSelectedModelName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white font-semibold text-sm focus:outline-none focus:border-[#F27D26]"
            >
              {currentBrandData.models.map(m => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parking Condition */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">3. Kondisi Parkir:</label>
            <select
              value={parkingType}
              onChange={e => setParkingType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white font-semibold text-sm focus:outline-none focus:border-[#F27D26]"
            >
              <option value="Outdoor (Panas Terik & Hujan Badai)">Outdoor (Panas & Hujan)</option>
              <option value="Semi Outdoor (Carport Berkanopi)">Semi Outdoor (Carport)</option>
              <option value="Indoor (Garasi Tertutup Anti Debu)">Indoor (Garasi Tertutup)</option>
              <option value="Mobil Modifikasi Bodykit / Spoiler">Ada Modifikasi Bodykit</option>
            </select>
          </div>
        </div>

        {/* Output Recommendation Result Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0A0C10] to-[#12161F] border border-[#F27D26]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F27D26]">
              <ShieldCheck className="w-4 h-4 text-[#F27D26]" />
              <span>Rekomendasi Terpilih untuk {selectedBrand} {currentModelData.name}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-display">
              Ukuran: <span className="text-[#F27D26]">{currentModelData.recommendedSize}</span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center justify-center md:justify-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
              <span>{currentModelData.notes}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleViewProducts}
              className="px-5 py-3 rounded-xl bg-[#181D28] hover:bg-[#202736] text-zinc-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-[#252D3D]"
            >
              <span>Lihat Produk Sesuai</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleConsultWhatsApp}
              className="px-5 py-3 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-xs shadow-lg shadow-[#F27D26]/25 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Pesan Ukuran Ini via WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
