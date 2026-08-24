import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Category, Product, ProductReview, SaleRecord, StoreSettings, DashboardStats, AdminUser } from '../src/types';
import { defaultCategories, defaultProducts, defaultReviews, defaultSales, defaultSettings } from './seedData';

interface DatabaseSchema {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  sales: SaleRecord[];
  reviews: ProductReview[];
  admins: {
    id: string;
    username: string;
    passwordHash: string;
    name: string;
    email: string;
    role: 'admin' | 'superadmin';
  }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'adms_store.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Admin: username: 'admin', password: 'password123' or 'admin123'
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('admin123', 10);

function getInitialData(): DatabaseSchema {
  return {
    settings: defaultSettings,
    categories: defaultCategories,
    products: defaultProducts,
    sales: defaultSales,
    reviews: defaultReviews,
    admins: [
      {
        id: 'adm-001',
        username: 'admin',
        passwordHash: DEFAULT_PASSWORD_HASH,
        name: 'Administrator ADMS',
        email: 'admin@admscovermobil.com',
        role: 'superadmin'
      }
    ]
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Merge with defaults to guarantee all structures exist
        return {
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : defaultCategories,
          products: parsed.products && parsed.products.length > 0 ? parsed.products : defaultProducts,
          sales: parsed.sales || defaultSales,
          reviews: parsed.reviews || defaultReviews,
          admins: parsed.admins && parsed.admins.length > 0 ? parsed.admins : [
            {
              id: 'adm-001',
              username: 'admin',
              passwordHash: DEFAULT_PASSWORD_HASH,
              name: 'Administrator ADMS',
              email: 'admin@admscovermobil.com',
              role: 'superadmin'
            }
          ]
        };
      }
    } catch (e) {
      console.error('Error loading database file, initializing defaults:', e);
    }
    const initial = getInitialData();
    this.saveDirect(initial);
    return initial;
  }

  private save(): void {
    this.saveDirect(this.data);
  }

  private saveDirect(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database file:', e);
    }
  }

  // --- Settings ---
  getSettings(): StoreSettings {
    return this.data.settings;
  }

  updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings
    };
    this.save();
    return this.data.settings;
  }

  // --- Categories ---
  getCategories(): Category[] {
    // Recalculate product count
    return this.data.categories.map(cat => {
      const count = this.data.products.filter(p => p.categoryId === cat.id && p.isActive).length;
      return { ...cat, productCount: count };
    });
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.getCategories().find(c => c.slug === slug);
  }

  createCategory(category: Omit<Category, 'id'>): Category {
    const id = 'cat-' + Date.now();
    const newCat: Category = {
      ...category,
      id,
      productCount: 0
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = {
      ...this.data.categories[index],
      ...updates
    };
    this.save();
    return this.data.categories[index];
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Products ---
  getProducts(filter?: {
    categoryId?: string;
    search?: string;
    size?: string;
    coverType?: string;
    minPrice?: number;
    maxPrice?: number;
    isPromo?: boolean;
    isBestSeller?: boolean;
    isFeatured?: boolean;
    activeOnly?: boolean;
    sort?: string;
  }): Product[] {
    let result = [...this.data.products];

    if (filter?.activeOnly !== false) {
      result = result.filter(p => p.isActive);
    }

    if (filter?.categoryId) {
      result = result.filter(p => p.categoryId === filter.categoryId);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.vehicleCompatibility.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    }

    if (filter?.size) {
      result = result.filter(p => p.sizes.some(s => s.toLowerCase().includes(filter.size!.toLowerCase())));
    }

    if (filter?.coverType) {
      result = result.filter(p => p.coverType.toLowerCase().includes(filter.coverType!.toLowerCase()));
    }

    if (filter?.minPrice !== undefined) {
      result = result.filter(p => (p.discountPrice || p.sellingPrice) >= filter.minPrice!);
    }

    if (filter?.maxPrice !== undefined) {
      result = result.filter(p => (p.discountPrice || p.sellingPrice) <= filter.maxPrice!);
    }

    if (filter?.isPromo !== undefined) {
      result = result.filter(p => p.isPromo === filter.isPromo);
    }

    if (filter?.isBestSeller !== undefined) {
      result = result.filter(p => p.isBestSeller === filter.isBestSeller);
    }

    if (filter?.isFeatured !== undefined) {
      result = result.filter(p => p.isFeatured === filter.isFeatured);
    }

    // Sorting
    if (filter?.sort) {
      switch (filter.sort) {
        case 'terlaris':
          result.sort((a, b) => (b.waClickCount + b.reviewCount * 2) - (a.waClickCount + a.reviewCount * 2));
          break;
        case 'termurah':
          result.sort((a, b) => (a.discountPrice || a.sellingPrice) - (b.discountPrice || b.sellingPrice));
          break;
        case 'termahal':
          result.sort((a, b) => (b.discountPrice || b.sellingPrice) - (a.discountPrice || a.sellingPrice));
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'terbaru':
        default:
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug === slug);
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'waClickCount' | 'rating' | 'reviewCount'>): Product {
    const now = new Date().toISOString();
    const id = 'prod-' + Date.now();
    const newProd: Product = {
      ...product,
      id,
      rating: 5.0,
      reviewCount: 0,
      viewCount: 0,
      waClickCount: 0,
      createdAt: now,
      updatedAt: now
    };
    this.data.products.unshift(newProd);
    this.save();
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  incrementView(idOrSlug: string): void {
    const product = this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (product) {
      product.viewCount = (product.viewCount || 0) + 1;
      this.save();
    }
  }

  incrementWaClick(idOrSlug: string): void {
    const product = this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (product) {
      product.waClickCount = (product.waClickCount || 0) + 1;
      this.save();
    }
  }

  // --- Reviews ---
  getReviews(productId?: string): ProductReview[] {
    if (productId) {
      return this.data.reviews.filter(r => r.productId === productId);
    }
    return this.data.reviews;
  }

  createReview(review: Omit<ProductReview, 'id' | 'date'>): ProductReview {
    const newRev: ProductReview = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    this.data.reviews.unshift(newRev);

    // Recalculate rating on product
    const productReviews = this.data.reviews.filter(r => r.productId === review.productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / (productReviews.length || 1);
    const product = this.getProductById(review.productId);
    if (product) {
      product.rating = Number(avgRating.toFixed(1));
      product.reviewCount = productReviews.length;
    }

    this.save();
    return newRev;
  }

  deleteReview(id: string): boolean {
    const index = this.data.reviews.findIndex(r => r.id === id);
    if (index === -1) return false;
    const rev = this.data.reviews[index];
    this.data.reviews.splice(index, 1);

    // Recalculate
    const productReviews = this.data.reviews.filter(r => r.productId === rev.productId);
    const product = this.getProductById(rev.productId);
    if (product) {
      const avgRating = productReviews.length > 0
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        : 5.0;
      product.rating = Number(avgRating.toFixed(1));
      product.reviewCount = productReviews.length;
    }
    this.save();
    return true;
  }

  // --- Sales & Profit ---
  getSales(): SaleRecord[] {
    return this.data.sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  createSale(sale: Omit<SaleRecord, 'id' | 'totalRevenue' | 'totalCost' | 'profit'>): SaleRecord {
    const totalRevenue = sale.sellingPrice * sale.quantity;
    const totalCost = sale.costPrice * sale.quantity;
    const profit = totalRevenue - totalCost;

    const newSale: SaleRecord = {
      ...sale,
      id: 'sale-' + Date.now(),
      totalRevenue,
      totalCost,
      profit
    };

    // Auto deduct inventory if stock exists
    const product = this.getProductById(sale.productId);
    if (product && product.stock > 0) {
      product.stock = Math.max(0, product.stock - sale.quantity);
    }

    this.data.sales.unshift(newSale);
    this.save();
    return newSale;
  }

  deleteSale(id: string): boolean {
    const initialLen = this.data.sales.length;
    this.data.sales = this.data.sales.filter(s => s.id !== id);
    if (this.data.sales.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Admin Authentication ---
  findAdminByUsername(username: string) {
    return this.data.admins.find(a => a.username.toLowerCase() === username.toLowerCase());
  }

  verifyAdminPassword(plainPassword: string, hash: string): boolean {
    return bcrypt.compareSync(plainPassword, hash);
  }

  updateAdminPassword(adminId: string, newPassword: string): boolean {
    const admin = this.data.admins.find(a => a.id === adminId);
    if (!admin) return false;
    admin.passwordHash = bcrypt.hashSync(newPassword, 10);
    this.save();
    return true;
  }

  // --- Dashboard Statistics ---
  getDashboardStats(): DashboardStats {
    const products = this.data.products;
    const activeProducts = products.filter(p => p.isActive).length;
    const outOfStockProducts = products.filter(p => p.stock <= 0).length;
    const bestSellerCount = products.filter(p => p.isBestSeller).length;

    const totalWaClicks = products.reduce((acc, p) => acc + (p.waClickCount || 0), 0);
    const totalProductViews = products.reduce((acc, p) => acc + (p.viewCount || 0), 0);

    const sales = this.data.sales;
    const completedSales = sales.filter(s => s.status === 'Selesai');
    const totalRevenue = completedSales.reduce((acc, s) => acc + s.totalRevenue, 0);
    const totalProfit = completedSales.reduce((acc, s) => acc + s.profit, 0);
    const profitMarginPercent = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;

    const topViewedProducts = [...products]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);

    const topClickedProducts = [...products]
      .sort((a, b) => (b.waClickCount || 0) - (a.waClickCount || 0))
      .slice(0, 5);

    return {
      totalProducts: products.length,
      activeProducts,
      outOfStockProducts,
      bestSellerCount,
      totalCategories: this.data.categories.length,
      totalWaClicks,
      totalProductViews,
      totalSalesRecorded: sales.length,
      totalRevenue,
      totalProfit,
      profitMarginPercent,
      topViewedProducts,
      topClickedProducts,
      recentSales: sales.slice(0, 5)
    };
  }
}

export const db = new Database();
