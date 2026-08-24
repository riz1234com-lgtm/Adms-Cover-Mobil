import { CartItem, Product, StoreSettings } from '../types';

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function cleanWhatsAppNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = (phone || '').replace(/\D/g, '');
  
  // If starts with 08..., convert to 628...
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('+62')) {
    cleaned = '62' + cleaned.substring(3);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}

export function buildSingleProductWhatsAppUrl(
  settings: StoreSettings,
  product: Product,
  variant: { size?: string; color?: string; quantity?: number },
  productUrl?: string
): string {
  const waNumber = cleanWhatsAppNumber(settings.whatsappNumber || '6281234567890');
  const size = variant.size || (product.sizes && product.sizes[0]) || 'Standar';
  const color = variant.color || (product.colors && product.colors[0]) || 'Standar';
  const quantity = variant.quantity || 1;
  const unitPrice = product.discountPrice || product.sellingPrice;
  const totalPrice = unitPrice * quantity;
  const currentUrl = productUrl || window.location.href;

  const message = `Halo ${settings.storeName || 'ADMS COVER MOBIL'} 👋

Saya ingin memesan produk:

Produk: ${product.name}
SKU: ${product.sku}
Ukuran: ${size}
Warna: ${color}
Jumlah: ${quantity}
Harga: ${formatIDR(totalPrice)}

Link Produk:
${currentUrl}

Mohon informasi ketersediaan stok dan proses pemesanannya.

Terima kasih.`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function buildCartWhatsAppUrl(
  settings: StoreSettings,
  cartItems: CartItem[]
): string {
  const waNumber = cleanWhatsAppNumber(settings.whatsappNumber || '6281234567890');
  
  if (!cartItems || cartItems.length === 0) {
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${settings.storeName}, saya ingin bertanya mengenai produk cover mobil.`)}`;
  }

  let itemsList = '';
  let totalEstimated = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalEstimated += itemTotal;
    itemsList += `${index + 1}. ${item.product.name} (${item.size} - ${item.color})
   Jumlah: ${item.quantity}
   Harga: ${formatIDR(itemTotal)}
`;
  });

  const message = `Halo ${settings.storeName || 'ADMS COVER MOBIL'}.

Saya ingin memesan:

${itemsList.trim()}

Total estimasi: ${formatIDR(totalEstimated)}

Mohon konfirmasi stok dan ongkos kirim.

Terima kasih.`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralInquiryWhatsAppUrl(
  settings: StoreSettings,
  customText?: string
): string {
  const waNumber = cleanWhatsAppNumber(settings.whatsappNumber || '6281234567890');
  const defaultText = customText || `Halo ${settings.storeName || 'ADMS COVER MOBIL'}, saya ingin bertanya mengenai produk cover mobil.`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(defaultText)}`;
}

export function buildCarConsultationWhatsAppUrl(
  settings: StoreSettings,
  carBrand: string,
  carModel: string,
  year?: string,
  notes?: string
): string {
  const waNumber = cleanWhatsAppNumber(settings.whatsappNumber || '6281234567890');
  const message = `Halo ${settings.storeName || 'ADMS COVER MOBIL'} 👋

Saya mau konsultasi ukuran cover mobil:
Merk/Tipe Mobil: ${carBrand} ${carModel} ${year ? `(${year})` : ''}
Kondisi Parkir: ${notes || 'Outdoor (Luar Ruangan)'}

Rekomendasi bahan dan tipe cover apa yang paling cocok untuk mobil saya? Terima kasih.`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}
