import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from './db';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'adms_jwt_secret_key_2026';

// Setup uploads folder in public/uploads and root uploads
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'adms-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Hanya file gambar (JPG, PNG, WebP, SVG) yang diperbolehkan!'));
  }
});

// Admin Auth Middleware
export interface AuthenticatedRequest extends Request {
  adminUser?: {
    id: string;
    username: string;
    role: string;
  };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Silakan login sebagai admin.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Sesi login telah kedaluwarsa. Silakan login kembali.' });
  }
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  const admin = db.findAdminByUsername(username);
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  }

  const isValid = db.verifyAdminPassword(password, admin.passwordHash);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Login berhasil.',
    token,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

router.get('/auth/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const admin = db.findAdminByUsername(req.adminUser!.username);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });
  }
  return res.json({
    success: true,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

router.post('/auth/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
  }

  const admin = db.findAdminByUsername(req.adminUser!.username);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin tidak ditemukan.' });
  }

  const isValid = db.verifyAdminPassword(oldPassword, admin.passwordHash);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Password lama tidak sesuai.' });
  }

  db.updateAdminPassword(admin.id, newPassword);
  return res.json({ success: true, message: 'Password berhasil diperbarui.' });
});

// ----------------------------------------------------
// IMAGE UPLOAD ENDPOINT
// ----------------------------------------------------
router.post('/upload', requireAdmin, upload.array('images', 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
    }

    const urls = files.map(file => `/uploads/${file.filename}`);
    return res.json({
      success: true,
      message: 'Foto berhasil diunggah.',
      urls,
      url: urls[0]
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Gagal mengunggah foto.' });
  }
});

// Direct Base64 image uploader fallback
router.post('/upload-base64', requireAdmin, (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Data gambar tidak valid.' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already a URL or pure data, return it
      return res.json({ success: true, url: imageBase64 });
    }

    const ext = matches[1].split('/')[1] || 'png';
    const buffer = Buffer.from(matches[2], 'base64');
    const safeName = 'adms-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + ext;
    const filePath = path.join(UPLOADS_DIR, safeName);
    
    fs.writeFileSync(filePath, buffer);
    return res.json({
      success: true,
      url: `/uploads/${safeName}`
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e.message || 'Gagal menyimpan gambar base64.' });
  }
});

// ----------------------------------------------------
// SETTINGS ENDPOINTS
// ----------------------------------------------------
router.get('/settings', (req, res) => {
  const settings = db.getSettings();
  return res.json({ success: true, settings });
});

router.put('/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  return res.json({ success: true, message: 'Pengaturan toko berhasil diperbarui.', settings: updated });
});

// ----------------------------------------------------
// CATEGORIES ENDPOINTS
// ----------------------------------------------------
router.get('/categories', (req, res) => {
  const categories = db.getCategories();
  return res.json({ success: true, categories });
});

router.get('/categories/:slug', (req, res) => {
  const category = db.getCategoryBySlug(req.params.slug);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
  }
  return res.json({ success: true, category });
});

router.post('/categories', requireAdmin, (req, res) => {
  const { name, slug, description, image, icon, isActive } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
  }
  const safeSlug = slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat = db.createCategory({
    name,
    slug: safeSlug,
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80',
    icon: icon || 'Shield',
    isActive: isActive !== undefined ? isActive : true
  });
  return res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan.', category: newCat });
});

router.put('/categories/:id', requireAdmin, (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Kategori berhasil diperbarui.', category: updated });
});

router.delete('/categories/:id', requireAdmin, (req, res) => {
  const ok = db.deleteCategory(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Kategori berhasil dihapus.' });
});

// ----------------------------------------------------
// PRODUCTS ENDPOINTS
// ----------------------------------------------------
router.get('/products', (req, res) => {
  const {
    categoryId,
    search,
    size,
    coverType,
    minPrice,
    maxPrice,
    isPromo,
    isBestSeller,
    isFeatured,
    activeOnly,
    sort
  } = req.query;

  const products = db.getProducts({
    categoryId: categoryId as string,
    search: search as string,
    size: size as string,
    coverType: coverType as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    isPromo: isPromo !== undefined ? isPromo === 'true' : undefined,
    isBestSeller: isBestSeller !== undefined ? isBestSeller === 'true' : undefined,
    isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
    activeOnly: activeOnly === 'false' ? false : true,
    sort: sort as string
  });

  return res.json({
    success: true,
    total: products.length,
    products
  });
});

router.get('/products/admin-all', requireAdmin, (req, res) => {
  const products = db.getProducts({ activeOnly: false });
  return res.json({ success: true, total: products.length, products });
});

router.get('/products/slug/:slug', (req, res) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }
  // increment view count
  db.incrementView(product.id);
  return res.json({ success: true, product });
});

router.get('/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }
  return res.json({ success: true, product });
});

router.post('/products', requireAdmin, (req, res) => {
  const {
    name,
    sku,
    slug,
    description,
    shortDescription,
    categoryId,
    categoryName,
    costPrice,
    sellingPrice,
    discountPrice,
    stock,
    isBestSeller,
    isPromo,
    isFeatured,
    isActive,
    images,
    sizes,
    colors,
    material,
    coverType,
    vehicleCompatibility,
    specifications,
    weight
  } = req.body;

  if (!name || !sku || sellingPrice === undefined) {
    return res.status(400).json({ success: false, message: 'Nama produk, SKU, dan harga jual wajib diisi.' });
  }

  const safeSlug = slug
    ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct = db.createProduct({
    name,
    slug: safeSlug,
    sku,
    description: description || '',
    shortDescription: shortDescription || '',
    categoryId: categoryId || 'cat-outdoor',
    categoryName: categoryName || 'Cover Mobil',
    costPrice: Number(costPrice) || 0,
    sellingPrice: Number(sellingPrice) || 0,
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    stock: Number(stock) || 0,
    isBestSeller: Boolean(isBestSeller),
    isPromo: Boolean(isPromo),
    isFeatured: Boolean(isFeatured),
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80'],
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['M', 'L', 'XL', 'XXL'],
    colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Silver', 'Hitam'],
    material: material || 'Polyester Coating Waterproof',
    coverType: coverType || 'Outdoor',
    vehicleCompatibility: vehicleCompatibility || 'Semua Jenis Mobil',
    specifications: specifications || {},
    weight: Number(weight) || 1500
  });

  return res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan.', product: newProduct });
});

router.put('/products/:id', requireAdmin, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Produk berhasil diperbarui.', product: updated });
});

router.patch('/products/:id/toggle-active', requireAdmin, (req, res) => {
  const current = db.getProductById(req.params.id);
  if (!current) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }
  const updated = db.updateProduct(req.params.id, { isActive: !current.isActive });
  return res.json({ success: true, message: `Status produk diubah menjadi ${updated?.isActive ? 'Aktif' : 'Nonaktif'}.`, product: updated });
});

router.delete('/products/:id', requireAdmin, (req, res) => {
  const ok = db.deleteProduct(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Produk berhasil dihapus.' });
});

// Tracking
router.post('/products/:id/track-view', (req, res) => {
  db.incrementView(req.params.id);
  return res.json({ success: true });
});

router.post('/products/:id/track-wa-click', (req, res) => {
  db.incrementWaClick(req.params.id);
  return res.json({ success: true });
});

// ----------------------------------------------------
// REVIEWS ENDPOINTS
// ----------------------------------------------------
router.get('/reviews', (req, res) => {
  const { productId } = req.query;
  const reviews = db.getReviews(productId as string);
  return res.json({ success: true, reviews });
});

router.post('/reviews', (req, res) => {
  const { productId, userName, userLocation, carModel, rating, comment } = req.body;
  if (!productId || !userName || !comment) {
    return res.status(400).json({ success: false, message: 'Nama, ulasan, dan ID produk wajib diisi.' });
  }

  const newRev = db.createReview({
    productId,
    userName,
    userLocation: userLocation || 'Indonesia',
    carModel: carModel || 'Mobil Pribadi',
    rating: Number(rating) || 5,
    comment,
    isVerifiedBuyer: true
  });

  return res.status(201).json({ success: true, message: 'Ulasan Anda berhasil dikirimkan!', review: newRev });
});

router.delete('/reviews/:id', requireAdmin, (req, res) => {
  const ok = db.deleteReview(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Ulasan berhasil dihapus.' });
});

// ----------------------------------------------------
// SALES RECORDING & PROFIT ENDPOINTS
// ----------------------------------------------------
router.get('/sales', requireAdmin, (req, res) => {
  const sales = db.getSales();
  return res.json({ success: true, sales });
});

router.post('/sales', requireAdmin, (req, res) => {
  const { productId, customerName, customerWhatsApp, quantity, costPrice, sellingPrice, saleDate, notes, status } = req.body;
  if (!productId || !customerName || !sellingPrice) {
    return res.status(400).json({ success: false, message: 'Produk, nama pembeli, dan harga jual wajib diisi.' });
  }

  const product = db.getProductById(productId);
  const productName = product ? product.name : (req.body.productName || 'Cover Mobil');
  const actualCost = costPrice !== undefined ? Number(costPrice) : (product ? product.costPrice : 0);

  const newSale = db.createSale({
    productId,
    productName,
    customerName,
    customerWhatsApp: customerWhatsApp || '-',
    quantity: Number(quantity) || 1,
    costPrice: actualCost,
    sellingPrice: Number(sellingPrice),
    date: saleDate || new Date().toISOString().split('T')[0],
    notes: notes || '',
    status: status || 'Selesai'
  });

  return res.status(201).json({ success: true, message: 'Penjualan manual berhasil dicatat.', sale: newSale });
});

router.delete('/sales/:id', requireAdmin, (req, res) => {
  const ok = db.deleteSale(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, message: 'Data penjualan tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Data penjualan berhasil dihapus.' });
});

// ----------------------------------------------------
// DASHBOARD STATS
// ----------------------------------------------------
router.get('/stats', requireAdmin, (req, res) => {
  const stats = db.getDashboardStats();
  return res.json({ success: true, stats });
});

export default router;
