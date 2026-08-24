import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X, Send, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { buildGeneralInquiryWhatsAppUrl, cleanWhatsAppNumber } from '../lib/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const waClean = cleanWhatsAppNumber(settings.whatsappNumber || '6282116095618');

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = customMsg.trim() || 'Halo ADMS COVER MOBIL, saya ingin bertanya mengenai produk cover mobil.';
    const url = buildGeneralInquiryWhatsAppUrl(settings, textToSend);
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  const handleQuickQuestion = (question: string) => {
    const url = buildGeneralInquiryWhatsAppUrl(settings, `Halo ADMS COVER MOBIL 👋\n\n${question}`);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Expanded Consultation Card */}
      {isOpen && (
        <div
          className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#12161F] border border-[#1F2634] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F27D26] to-[#C95C10] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#12161F] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight font-display">Customer Service ADMS</h4>
                <p className="text-[11px] text-orange-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Online • Siap Melayani
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-orange-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#0A0C10]/90">
            <div className="bg-[#181D28] p-3 rounded-xl border border-[#252D3D] text-xs text-zinc-300 leading-relaxed shadow-sm">
              <p className="font-semibold text-white mb-1">👋 Selamat datang di ADMS COVER MOBIL!</p>
              <p>Ada yang bisa kami bantu seputar ukuran cover mobil, pemilihan bahan anti air, atau custom order?</p>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Pertanyaan Cepat:</p>
              <button
                onClick={() => handleQuickQuestion('Saya mau konsultasi ukuran cover yang pas untuk mobil saya.')}
                className="w-full text-left p-2.5 rounded-xl bg-[#12161F] hover:bg-[#181D28] border border-[#1F2634] text-xs text-zinc-200 hover:text-[#F27D26] transition-colors flex items-center justify-between group"
              >
                <span>🚗 Konsultasi Ukuran Mobil Saya</span>
                <Sparkles className="w-3.5 h-3.5 text-[#F27D26] group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => handleQuickQuestion('Apakah ada promo atau diskon gratis ongkir hari ini?')}
                className="w-full text-left p-2.5 rounded-xl bg-[#12161F] hover:bg-[#181D28] border border-[#1F2634] text-xs text-zinc-200 hover:text-[#F27D26] transition-colors flex items-center justify-between group"
              >
                <span>🎁 Tanya Promo & Diskon Hari Ini</span>
                <CheckCircle className="w-3.5 h-3.5 text-[#F27D26] group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => handleQuickQuestion('Saya ingin pesan cover mobil custom 2 warna / ada bodykit khusus.')}
                className="w-full text-left p-2.5 rounded-xl bg-[#12161F] hover:bg-[#181D28] border border-[#1F2634] text-xs text-zinc-200 hover:text-[#F27D26] transition-colors flex items-center justify-between group"
              >
                <span>🎨 Pesan Cover Custom / Modifikasi</span>
                <Sparkles className="w-3.5 h-3.5 text-[#F27D26] group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Custom Input */}
            <form onSubmit={handleSendCustom} className="pt-2 flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder="Tulis pesan Anda..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#12161F] border border-[#1F2634] text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27D26]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#F27D26] hover:bg-[#E06A14] text-white transition-colors flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#F27D26] hover:bg-[#E06A14] text-white font-bold text-sm shadow-2xl shadow-[#F27D26]/40 border border-[#F27D26]/40 transform hover:scale-105 transition-all select-none"
          id="floating-whatsapp-btn"
          aria-label="Chat WhatsApp Admin"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-current text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
          </div>
          <span className="hidden sm:inline">💬 Chat WhatsApp</span>
        </button>

        {!isOpen && (
          <span className="hidden lg:block absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#12161F] text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#1F2634] shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            Konsultasi gratis ukuran cover
          </span>
        )}
      </div>
    </div>
  );
};
