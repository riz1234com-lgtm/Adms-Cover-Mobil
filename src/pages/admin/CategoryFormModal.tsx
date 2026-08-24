import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { X, Shield, Save } from 'lucide-react';

interface CategoryFormModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  category,
  isOpen,
  onClose,
  onSaved
}) => {
  const { token } = useAuth();
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [icon, setIcon] = useState('Shield');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      setImage(category.image || '');
      setIcon(category.icon || 'Shield');
    } else {
      setName('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80');
      setIcon('Shield');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama kategori wajib diisi', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const url = category ? `/api/categories/${category.id}` : '/api/categories';
      const method = category ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, image, icon })
      });

      const data = await res.json();
      if (data.success) {
        showToast(category ? 'Kategori berhasil diperbarui!' : 'Kategori baru berhasil ditambahkan!', 'success');
        onSaved();
        onClose();
      } else {
        showToast(data.message || 'Gagal menyimpan kategori', 'error');
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
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#0f172a' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <h2 className="text-base font-bold text-white">
            {category ? 'Edit Kategori Produk' : 'Tambah Kategori Baru'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Nama Kategori *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Cover Mobil SUV / Crossover"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Deskripsi Singkat</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan jenis perlindungan cover mobil dalam kategori ini..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">URL Gambar Banner Kategori</label>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
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
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
