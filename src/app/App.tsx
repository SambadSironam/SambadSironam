import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ArticlePage } from "./components/ArticlePage";
import { CategoryPage } from "./components/CategoryPage";
import { Footer } from "./components/Footer";

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

function LiveTVPage() {
  return (
    <div className="min-h-screen bg-[#121212] py-10">
      <div className="max-w-[1440px] mx-auto px-4">
        <h1
          className="text-white mb-6 flex items-center gap-3"
          style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.75rem", fontWeight: 700 }}
        >
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          লাইভ টিভি
        </h1>
        <div className="aspect-video bg-gray-800 rounded-2xl flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">📺</div>
            <p style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>লাইভ স্ট্রিম শীঘ্রই আসছে</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EPaperPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] py-10">
      <div className="max-w-[1440px] mx-auto px-4">
        <h1
          className="text-gray-900 dark:text-white mb-6"
          style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.75rem", fontWeight: 700 }}
        >
          ই-পেপার
        </h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-gray-500 dark:text-gray-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            আজকের পেপার শীঘ্রই উপলব্ধ হবে
          </p>
        </div>
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
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/live-tv" element={<LiveTVPage />} />
          <Route path="/epaper" element={<EPaperPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
