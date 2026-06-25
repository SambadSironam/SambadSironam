import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search, Sun, Moon, Menu, X, ChevronDown, Bell, User,
  Globe, Tv, Newspaper, Youtube, Mic, Camera, Bookmark,
  TrendingUp, Zap, Radio
} from "lucide-react";
import logoImg from "../../imports/ChatGPT_Image_Jan_21__2026_at_12_46_10_PM.png";

const NAV_ITEMS = [
  { label: "হোম", href: "/", children: [] },
  { label: "কলকাতা", href: "/", children: [] },
  {
    label: "পশ্চিমবঙ্গ", href: "/category/west-bengal",
    children: [
      { label: "উত্তরবঙ্গ", href: "/category/north-bengal" },
      { label: "দক্ষিণবঙ্গ", href: "/category/south-bengal" },
    ]
  },
  { label: "ভারত", href: "/", children: [] },
  { label: "বিশ্ব", href: "/", children: [] },
  {
    label: "খেলাধুলা", href: "/category/sports",
    children: [
      { label: "ক্রিকেট", href: "/category/cricket" },
      { label: "ফুটবল", href: "/category/football" },
      { label: "অন্যান্য", href: "/category/other-sports" },
    ]
  },
  { label: "বিনোদন", href: "/", children: [] },
  { label: "প্রযুক্তি", href: "/", children: [] },
  { label: "স্বাস্থ্য", href: "/", children: [] },
  { label: "শিক্ষা", href: "/", children: [] },
  { label: "ব্যবসা", href: "/", children: [] },
  { label: "ভ্রমণ", href: "/", children: [] },
  { label: "জ্যোতিষ", href: "/", children: [] },
  { label: "লাইভ টিভি", href: "/", children: [] },
  { label: "ই-পেপার", href: "/", children: [] },
  { label: "সংবাদ ভিডিও", href: "/", children: [] },
  { label: "রান্না", href: "/", children: [] },
  { label: "সম্পাদকীয়", href: "/", children: [] },
  { label: "যোগাযোগ করুন", href: "/", children: [] },
];

const BREAKING_ITEMS = [
  "পশ্চিমবঙ্গে ভারী বৃষ্টির পূর্বাভাস, রেড অ্যালার্ট জারি",
  "ভারত-পাকিস্তান সীমান্তে উত্তেজনা, সেনা মোতায়েন",
  "কলকাতায় মেট্রো রেলের নতুন রুট উদ্বোধন",
  "টি২০ বিশ্বকাপে ভারতের দুর্দান্ত জয়",
  "শেয়ার বাজারে রেকর্ড উচ্চতা, সেনসেক্স ৮০,০০০ পার",
];

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(i => (i + 1) % BREAKING_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const today = new Date().toLocaleDateString("bn-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  return (
    <>
      {/* Utility Bar */}
      <div style={{ backgroundColor: "#001657" }} className="text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gray-300">
              <Globe size={12} />
              {today}
            </span>
            {/*<span className="text-gray-500">|</span>
            <a href="/live-tv" className="flex items-center gap-1 text-red-400 animate-pulse">
              <Radio size={12} />
              লাইভ টিভি
            </a>
            <a href="/epaper" className="flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-colors">
              <Newspaper size={12} />
              ই-পেপার
            </a>*/}
          </div>
          <div className="flex items-center gap-3">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
              <Youtube size={13} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors text-xs font-bold">f</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-400 transition-colors text-xs font-bold">𝕏</a>
            <span className="text-gray-500">|</span>
            <a href="/admin" className="flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-colors">
              <User size={12} />
              লগইন
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {darkMode ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
        style={{ backgroundColor: darkMode ? "#242377" : "#242377" }}
      >
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between py-2.5 gap-4">
            {/* Logo */}
            {/*<Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src={logoImg}
                alt="Sambad Sironam Logo"
                className="h-12 w-12 object-contain rounded-xl"
              /> */}
              {/*<div className="hidden sm:block">
                <div className="text-white font-bold leading-tight" style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.2rem" }}>
                                     
                </div>
              </div> */}
              <div className="flex items-center gap-4">
            {/*<span className="text-gray-500">|</span>*/}
            <a href="/live-tv" className="flex items-center gap-1 text-red-400 animate-pulse">
              <Radio size={12} />
              লাইভ টিভি
            </a>
            <a href="/epaper" className="flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-colors">
              <Newspaper size={12} />
              ই-পেপার
            </a>
          </div>
           

            {/* Center Ad Banner */}
            
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src={logoImg}
                alt="Sambad Sironam Logo"
                className="h-12 w-12 object-contain rounded-xl"
              />
              <div className="hidden sm:block">
                <div className="text-white font-bold leading-tight" style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "3rem" }}>
                  সংবাদ শিরোনাম
                </div>
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <Search size={18} />
              </button>
              <a href="/notifications" className="text-white hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-white/10 hidden sm:flex relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </a>
              <a href="/saved" className="text-white hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-white/10 hidden sm:flex">
                <Bookmark size={18} />
              </a>
              <button
                className="sm:hidden text-white p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <button
                className="sm:hidden text-white p-2"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Nav Bar */}
        <div className="border-t border-white/10 hidden md:block">
          <div className="max-w-[1440px] mx-auto px-4">
            <nav className="flex items-center gap-0">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => item.children.length > 0 && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 px-3 py-3 text-sm text-gray-200 hover:text-yellow-400 transition-colors whitespace-nowrap"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {item.label}
                    {item.children.length > 0 && <ChevronDown size={12} className="opacity-60" />}
                  </Link>
                  {item.children.length > 0 && activeMenu === item.label && (
                    <div className="absolute top-full left-0 bg-white dark:bg-gray-900 shadow-xl rounded-b-lg py-2 min-w-[180px] z-50 border-t-2 border-red-600">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 transition-colors"
                          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="ml-auto flex items-center gap-2 py-1.5">
                <a href="/live-tv" className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full transition-colors font-medium">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  লাইভ
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Breaking News Ticker */}
      <div className="bg-red-800 text-white py-2 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 flex items-center gap-3">
          <span className="flex-shrink-0 flex items-center gap-1.5 bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
            <Zap size={11} />
            ব্রেকিং
          </span>
          <div className="overflow-hidden flex-1">
            <div
              key={tickerIndex}
              className="text-sm whitespace-nowrap"
              style={{
                fontFamily: "'Noto Sans Bengali', sans-serif",
                animation: "slideIn 0.5s ease-in-out"
              }}
            >
              {BREAKING_ITEMS[tickerIndex]}
            </div>
          </div>
          <TrendingUp size={14} className="flex-shrink-0 opacity-75" />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900/95 text-white overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain rounded-xl" />
                <span className="font-bold text-lg" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>সংবাদ শিরোনাম</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="সংবাদ খুঁজুন..."
                  className="flex-1 bg-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 outline-none"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                />
                <button type="submit" className="bg-red-600 px-4 rounded-lg">
                  <Search size={18} />
                </button>
              </div>
            </form>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between w-full py-3 px-2 border-b border-white/10 text-gray-200 hover:text-yellow-400 transition-colors"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {item.label}
                  </Link>
                  {item.children.length > 0 && (
                    <div className="pl-4 space-y-0">
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 px-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                        >
                          › {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a href="/login" className="flex-1 bg-red-600 text-white text-center py-2.5 rounded-lg font-medium">লগইন</a>
              <a href="/register" className="flex-1 border border-white/20 text-white text-center py-2.5 rounded-lg font-medium">নিবন্ধন</a>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="সংবাদ খুঁজুন..."
                className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl px-6 py-4 text-lg outline-none shadow-2xl pr-16"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-xl">
                <Search size={20} />
              </button>
            </form>
            <div className="mt-4 text-gray-400 text-sm text-center">
              <span>ট্রেন্ডিং: </span>
              {["লোকসভা নির্বাচন", "বিশ্বকাপ", "মমতা বন্দ্যোপাধ্যায়"].map(t => (
                <button
                  key={t}
                  onClick={() => { setSearchQuery(t); }}
                  className="mx-1 text-yellow-400 hover:underline"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  {t}
                </button>
              ))}
            </div>
            <button onClick={() => setSearchOpen(false)} className="mt-4 w-full text-gray-400 hover:text-white text-sm">
              বন্ধ করুন (ESC)
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
