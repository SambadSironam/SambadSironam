import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ArticlePage } from "./components/ArticlePage";
import { CategoryPage } from "./components/CategoryPage";
import { Footer } from "./components/Footer";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LiveTV from "./components/LiveTV";
import EPaper from "./components/Epaper";
import ContactPage from "./components/Contact";
import VideosPage from "./components/VideosPage";
import SectionPage from "./components/SectionPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsConditions from "./components/TermsConditions";

function SearchPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] py-10">
      <div className="max-w-[1440px] mx-auto px-4">
        <h1
          className="text-gray-900 dark:text-white mb-6"
          style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.75rem", fontWeight: 700 }}
        >
          অনুসন্ধান ফলাফল
        </h1>
        <p className="text-gray-500 dark:text-gray-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          অনুসন্ধান পরিষেবা শীঘ্রই চালু হবে।
        </p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-black text-red-600 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>404</div>
        <h2
          className="text-gray-900 dark:text-white mb-3"
          style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.5rem", fontWeight: 700 }}
        >
          পৃষ্ঠাটি পাওয়া যায়নি
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যাচ্ছে না।
        </p>
        <a
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          হোমপেজে ফিরুন
        </a>
      </div>
    </div>
  );
}

function AppLayout({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] transition-colors duration-300">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute> } />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/live-tv" element={<LiveTV />} />
          <Route path="/epaper" element={<EPaper />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/section/:slug" element={<SectionPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/videos" element={<VideosPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sambad-dark-mode");
    if (saved === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    // Disable right click context menu (optional, but standard for copy protection)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest(".selectable")
      ) {
        return;
      }
      e.preventDefault();
    };

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest(".selectable")
      ) {
        return;
      }
      e.preventDefault();
    };

    // Disable cut
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest(".selectable")
      ) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
    };
  }, []);

  const handleDarkMode = (v: boolean) => {
    setDarkMode(v);
    localStorage.setItem("sambad-dark-mode", String(v));
  };

  return (
    <BrowserRouter>
      <AppLayout darkMode={darkMode} setDarkMode={handleDarkMode} />
    </BrowserRouter>
  );
}
