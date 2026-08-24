import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { MarketplaceBar } from './components/MarketplaceBar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { ToastContainer } from './components/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductCatalogPage } from './pages/ProductCatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Push state & handle routing
  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse path & parameters
  const renderRoute = () => {
    // Admin Route
    if (currentPath.startsWith('/admin')) {
      return <AdminDashboard navigate={navigate} />;
    }

    // Product Detail Route: /produk/:slug
    if (currentPath.startsWith('/produk/')) {
      const slug = currentPath.replace('/produk/', '').split('?')[0].split('#')[0];
      return <ProductDetailPage slug={slug} navigate={navigate} />;
    }

    // Category Detail Route: /kategori/:slug
    if (currentPath.startsWith('/kategori/')) {
      const slug = currentPath.replace('/kategori/', '').split('?')[0].split('#')[0];
      return <CategoryDetailPage slug={slug} navigate={navigate} />;
    }

    // Static Routes
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/produk':
        return <ProductCatalogPage navigate={navigate} />;
      case '/keranjang':
        return <CartPage navigate={navigate} />;
      case '/wishlist':
        return <WishlistPage navigate={navigate} />;
      case '/tentang':
        return <AboutPage navigate={navigate} />;
      case '/kontak':
        return <ContactPage navigate={navigate} />;
      case '/faq':
        return <FAQPage navigate={navigate} />;
      default:
        // Default fallback to Home
        return <HomePage navigate={navigate} />;
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0C10] text-[#F3F4F6] selection:bg-[#F27D26] selection:text-black">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Global Navbar */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Official Marketplace Links Bar (Below Header) */}
      {!isAdminRoute && <MarketplaceBar />}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Modals & Floating Widgets (Enabled for client views) */}
      {!isAdminRoute && (
        <>
          <FloatingWhatsApp />
          <QuickViewModal navigate={navigate} />
          <SearchModal navigate={navigate} />
        </>
      )}

      {/* Global Footer */}
      {!isAdminRoute && <Footer navigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
