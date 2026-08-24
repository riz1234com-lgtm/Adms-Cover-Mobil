import React, { useState } from 'react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { X, Save, DollarSign } from 'lucide-react';

interface SaleRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  products: Product[];
}

export const SaleRecordModal: React.FC<SaleRecordModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  products
}) => {
  const { token } = useAuth();
  const { showToast } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(products[0]);
  const [productSize, setProductSize] = useState('XL');
  const [productColor, setProductColor] = useState('Silver');
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(275000);
  const [channel, setChannel] = useState<'whatsapp' | 'shopee' | 'tokopedia' | 'offline' | 'direct'>('whatsapp');
  const [status, setStatus] = useState<'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'>('paid');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleProductChange = (pId: string) => {
    setProductId(pId);
    const prod = products.find(p => p.id === pId);
    setSelectedProduct(prod);
    if (prod) {
      const price = prod.discountPrice || prod.sellingPrice;
      setTotalAmount(price * quantity);
      setProductSize(prod.sizes?.[0] || 'XL');
      setProductColor(prod.colors?.[0] || 'Silver');
    }
  };

  const handleQtyChange = (qty: number) => {
    setQuantity(qty);
    if (selectedProduct) {
      const price = selectedProduct.discountPrice || selectedProduct.sellingPrice;
      setTotalAmount(price * qty);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Nama pelanggan wajib diisi', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const prod = products.find(p => p.id === productId);
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          carModel,
          productId,
          productName: prod?.name || 'Cover Mobil ADMS',
          productSize,
          productColor,
          quantity: Number(quantity),
          totalAmount: Number(totalAmount),
          channel,
          status,
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('Catatan penjualan berhasil disimpan!', 'success');
        onSaved();
        onClose();
      } else {
        showToast(data.message || 'Gagal menyimpan catatan penjualan', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#0f172a' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Catat Penjualan Manual Baru</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Nama Pelanggan *</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Contoh: Pak Herman"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">No. WhatsApp Pelanggan</label>
              <input
                type="text"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="0812..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Tipe / Merk Mobil</label>
              <input
                type="text"
                value={carModel}
                onChange={e => setCarModel(e.target.value)}
                placeholder="Contoh: Toyota Fortuner VRZ 2023"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Channel Order</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium"
              >
                <option value="whatsapp">WhatsApp Order</option>
                <option value="direct">Direct Phone Call / SMS</option>
                <option value="offline">Toko Offline / Workshop</option>
                <option value="shopee">Shopee Marketplace</option>
                <option value="tokopedia">Tokopedia</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Produk yang Dibeli *</label>
            <select
              value={productId}
              onChange={e => handleProductChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} - ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Ukuran</label>
              <input
                type="text"
                value={productSize}
                onChange={e => setProductSize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Warna</label>
              <input
                type="text"
                value={productColor}
                onChange={e => setProductColor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Jumlah (Pcs)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => handleQtyChange(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="space-y-1.5">
              <label className="font-bold text-emerald-400">Total Nominal Pembayaran (Rp) *</label>
              <input
                type="number"
                value={totalAmount}
                onChange={e => setTotalAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Status Transaksi</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
              >
                <option value="paid">Lunas (Sudah Transfer)</option>
                <option value="shipped">Sedang Dikirim</option>
                <option value="completed">Selesai Diterima</option>
                <option value="pending">Menunggu Transfer</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Catatan Tambahan (No Resi / Ekspedisi)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: JNE Reguler Resi JNE123456789"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Penjualan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
