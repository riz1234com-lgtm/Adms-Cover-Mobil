import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Trash2, Image, Shield, Save } from 'lucide-react';

interface ProductFormModalProps {
  product: Product | null; // null for add new
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaved
}) => {
  const { token } = useAuth();
  const { categories, showToast } = useStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState<number>(250000);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [costPrice, setCostPrice] = useState<number | undefined>(150000);
  const [stock, setStock] = useState<number>(50);
  const [material, setMaterial] = useState('Oxford 4-Layer');
  const [coverType, setCoverType] = useState('Outdoor Heavy Duty');
  const [weight, setWeight] = useState<number>(1800);
  const [vehicleCompatibility, setVehicleCompatibility] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [sizes, setSizes] = useState<string[]>(['M', 'L', 'XL', 'XXL']);
  const [colors, setColors] = useState<string[]>(['Hitam Silver', 'Silver Grey', 'Navy Blue']);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSku(product.sku || '');
      setCategoryId(product.categoryId || (categories[0]?.id || ''));
      setDescription(product.description || '');
      setSellingPrice(product.sellingPrice || 0);
      setDiscountPrice(product.discountPrice);
      setCostPrice(product.costPrice);
      setStock(product.stock || 0);
      setMaterial(product.material || '');
      setCoverType(product.coverType || '');
      setWeight(product.weight || 1500);
      setVehicleCompatibility(product.vehicleCompatibility || '');
      setImages(product.images && product.images.length > 0 ? product.images : ['']);
      setSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['M', 'L', 'XL', 'XXL']);
      setColors(product.colors && product.colors.length > 0 ? product.colors : ['Silver', 'Hitam']);
      setIsFeatured(!!product.isFeatured);
      setIsBestSeller(!!product.isBestSeller);
      setIsPromo(!!product.isPromo);
      setIsActive(product.isActive !== false);
    } else {
      // Reset for new
      setName('');
      setSku(`ADMS-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategoryId(categories[0]?.id || '');
      setDescription('Sarung cover mobil premium ADMS dengan perlindungan 4 lapis anti debu, anti sinar UV matahari, dan 100% waterproof lotus effect.');
      setSellingPrice(275000);
      setDiscountPrice(undefined);
      setCostPrice(160000);
      setStock(50);
      setMaterial('4-Layer Oxford & Cotton Fleece');
      setCoverType('Outdoor Heavy Duty');
      setWeight(1800);
      setVehicleCompatibility('Avanza, Xpander, Ertiga, BR-V, Livina, Stargazer');
      setImages(['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80']);
      setSizes(['M', 'L', 'XL', 'XXL']);
      setColors(['Hitam Carbon', 'Silver Grey', 'Deep Navy']);
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsPromo(false);
      setIsActive(true);
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddImageField = () => {
    setImages(prev => [...prev, '']);
  };

  const handleUpdateImage = (index: number, val: string) => {
    setImages(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama produk wajib diisi', 'warning');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name,
      sku,
      categoryId,
      description,
      sellingPrice: Number(sellingPrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      stock: Number(stock),
      material,
      coverType,
      weight: Number(weight),
      vehicleCompatibility,
      images: images.filter(img => img.trim().length > 0),
      sizes,
      colors,
      isFeatured,
      isBestSeller,
      isPromo,
      isActive
    };

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showToast(product ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!', 'success');
        onSaved();
        onClose();
      } else {
        showToast(data.message || 'Gagal menyimpan produk', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8"
        style={{ backgroundColor: '#0f172a' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {product ? 'Edit Produk Cover Mobil' : 'Tambah Produk Cover Mobil Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                Kelola foto, harga, spesifikasi, dan varian cover mobil
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300">Nama Produk *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Cover Mobil Outdoor Heavy Duty 4-Layer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">SKU / Kode Produk</label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category & Cover Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Kategori Produk *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Tipe Pelindung</label>
              <input
                type="text"
                value={coverType}
                onChange={e => setCoverType(e.target.value)}
                placeholder="Contoh: Outdoor Heavy Duty, All-Weather, Anti UV"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="space-y-1.5">
              <label className="font-bold text-emerald-400">Harga Jual (Rp) *</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={e => setSellingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-rose-400">Harga Coret / Promo (Rp)</label>
              <input
                type="number"
                value={discountPrice || ''}
                onChange={e => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Kosongkan jika tdk diskon"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400">Modal / HPP (Rp)</label>
              <input
                type="number"
                value={costPrice || ''}
                onChange={e => setCostPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Stok Barang</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
              />
            </div>
          </div>

          {/* Material & Vehicle Compatibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Material & Bahan</label>
              <input
                type="text"
                value={material}
                onChange={e => setMaterial(e.target.value)}
                placeholder="Contoh: Oxford 4-Layer + Cotton Fleece"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Berat Produk (Gram)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Daftar Kompatibilitas Kendaraan</label>
            <input
              type="text"
              value={vehicleCompatibility}
              onChange={e => setVehicleCompatibility(e.target.value)}
              placeholder="Contoh: Avanza, Xpander, Innova, Ertiga, BR-V, Sigra, Calya"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Deskripsi Lengkap Produk</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Images URL List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300">Link URL Foto Produk</label>
              <button
                type="button"
                onClick={handleAddImageField}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Foto
              </button>
            </div>
            <div className="space-y-2">
              {images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={img}
                    onChange={e => handleUpdateImage(idx, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Badges and Toggles */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none font-semibold">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={e => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950"
              />
              <span>★ Terlaris</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none font-semibold">
              <input
                type="checkbox"
                checked={isPromo}
                onChange={e => setIsPromo(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950"
              />
              <span>🎁 Promo Spesial</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none font-semibold">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950"
              />
              <span>Unggulan Beranda</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none font-semibold">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950"
              />
              <span>Status Aktif</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
