import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { buildGeneralInquiryWhatsAppUrl } from '../lib/whatsapp';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Shield,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [carType, setCarType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedText = `Halo ADMS COVER MOBIL 👋

Nama: ${name || '-'}
No. HP: ${phone || '-'}
Mobil: ${carType || '-'}

Pesan / Pertanyaan:
${message || 'Saya ingin bertanya seputar cover mobil ADMS.'}

Mohon bantuannya. Terima kasih!`;

    const url = buildGeneralInquiryWhatsAppUrl(settings, formattedText);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F27D26]/20 text-[#F27D26] text-xs font-bold border border-[#F27D26]/30">
          <Phone className="w-3.5 h-3.5" />
          <span>HUBUNGI KAMI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Layanan Pelanggan & Pemesanan
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Tim Customer Service kami siap melayani konsultasi pemilihan ukuran cover mobil, informasi bahan, dan pemesanan setiap hari.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#12161F] border border-[#1F2634] space-y-6">
            <h3 className="text-base font-bold text-white pb-3 border-b border-[#1F2634] font-display">
              Informasi Kontak Resmi
            </h3>

            <div className="space-y-4 text-xs">
              <a
                href={buildGeneralInquiryWhatsAppUrl(settings, 'Halo ADMS COVER MOBIL!')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0A0C10] border border-[#F27D26]/40 hover:border-[#F27D26] transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F27D26] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-[11px] text-[#F27D26] font-bold">WhatsApp Resmi (Paling Cepat)</div>
                  <div className="text-sm font-black text-white group-hover:text-[#F27D26] transition-colors font-display">
                    {settings.whatsappDisplay || settings.whatsappNumber}
                  </div>
                  <div className="text-[10px] text-zinc-400">Klik untuk langsung chat dengan CS</div>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0A0C10] border border-[#1F2634]">
                <div className="w-9 h-9 rounded-xl bg-[#181D28] text-zinc-300 flex items-center justify-center shrink-0 border border-[#1F2634]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">Email Informasi</div>
                  <div className="text-xs font-bold text-white">{settings.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0A0C10] border border-[#1F2634]">
                <div className="w-9 h-9 rounded-xl bg-[#181D28] text-zinc-300 flex items-center justify-center shrink-0 border border-[#1F2634]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">Jam Operasional CS</div>
                  <div className="text-xs font-bold text-white">Senin - Minggu: 08.00 - 21.00 WIB</div>
                  <div className="text-[10px] text-[#F27D26]">Pesan WhatsApp 24 Jam (Dibalas Cepat saat Jam Operasional)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0A0C10] border border-[#1F2634]">
                <div className="w-9 h-9 rounded-xl bg-[#181D28] text-zinc-300 flex items-center justify-center shrink-0 border border-[#1F2634]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium">Workshop & Gudang</div>
                  <div className="text-xs font-bold text-white">{settings.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Direct WhatsApp Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12161F] border border-[#1F2634] shadow-xl space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Kirim Pesan Konsultasi ke WhatsApp
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Isi form di bawah ini dan klik tombol untuk langsung terhubung ke WhatsApp Admin dengan format pertanyaan yang rapi.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Nama Anda:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">No. WhatsApp:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Merk & Tipe Mobil Anda:</label>
                <input
                  type="text"
                  value={carType}
                  onChange={e => setCarType(e.target.value)}
                  placeholder="Contoh: Toyota Innova Reborn 2022 / Honda HR-V"
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Pertanyaan atau Kebutuhan Khusus:</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tulis pertanyaan Anda seputar rekomendasi bahan, cover custom, atau promo..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0C10] border border-[#1F2634] text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-xl shadow-[#F27D26]/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Kirim via WhatsApp Sekarang</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
