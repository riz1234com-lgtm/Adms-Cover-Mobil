export interface ProductVariant {
  size: string;
  color: string;
  sku?: string;
  priceAdjustment?: number;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  categoryName: string;
  costPrice: number; // Harga modal (admin only)
  sellingPrice: number; // Harga jual normal
  discountPrice?: number; // Harga promo/diskon jika ada
  stock: number;
  isBestSeller: boolean;
  isPromo: boolean;
  isFeatured: boolean;
  isActive: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  material: string;
  coverType: string; // e.g. 'Outdoor Extreme', 'Indoor Premium', 'All-Weather 4-Layer'
  vehicleCompatibility: string; // e.g. 'Avanza, Xpander, Innova, Pajero, Fortuner, Civic, Brio, dll.'
  specifications: Record<string, string>;
  weight: number; // dalam gram (e.g. 1500 = 1.5 kg)
  rating: number;
  reviewCount: number;
  viewCount: number;
  waClickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  isActive: boolean;
  productCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  logo: string;
  favicon: string;
  whatsappNumber: string; // e.g. '6282116095618'
  whatsappDisplay?: string;
  whatsappTemplate?: string;
  phone: string;
  email: string;
  address: string;
  operatingHours: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  shopee?: string;
  tokopedia?: string;
  storeDescription: string;
  seoTitle: string;
  seoDescription: string;
  mapsEmbedUrl?: string;
  enableStockWarning?: boolean;
}

export interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerWhatsApp: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  date: string;
  notes?: string;
  status: 'Selesai' | 'Pending' | 'Dibatalkan';
}

export interface ProductReview {
  id: string;
  productId: string;
  productName?: string;
  userName: string;
  userLocation: string;
  carModel: string;
  rating: number;
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
  images?: string[];
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  token?: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  bestSellerCount: number;
  totalCategories: number;
  totalWaClicks: number;
  totalProductViews: number;
  totalSalesRecorded: number;
  totalRevenue: number;
  totalProfit: number;
  profitMarginPercent: number;
  topViewedProducts: Product[];
  topClickedProducts: Product[];
  recentSales: SaleRecord[];
}
