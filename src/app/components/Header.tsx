import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../firebase";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Globe,
  Tv,
  Newspaper,
  Mic,
  Camera,
  Bookmark,
  TrendingUp,
  Zap,
  Radio,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";

import logo from "../../imports/logo.png";

const NAV_ITEMS = [
  { label: "হোম", href: "/", children: [] },
  { label: "কলকাতা", href: "/category/kolkata", children: [] },

  {
    label: "পশ্চিমবঙ্গ",
    href: "/category/west-bengal",
    children: [
      { label: "উত্তরবঙ্গ", href: "/category/north-bengal" },
      { label: "দক্ষিণবঙ্গ", href: "/category/south-bengal" },
    ],
  },

  { label: "ভারত", href: "/category/india", children: [] },
  { label: "বিশ্ব", href: "/category/world", children: [] },

  {
    label: "খেলাধুলা",
    href: "/category/sports",
    children: [
      { label: "ক্রিকেট", href: "/category/cricket" },
      { label: "ফুটবল", href: "/category/football" },
      { label: "অন্যান্য", href: "/category/other-sports" },
    ],
  },

  { label: "বিনোদন", href: "/category/entertainment", children: [] },
  { label: "প্রযুক্তি", href: "/category/technology", children: [] },
  { label: "স্বাস্থ্য", href: "/category/health", children: [] },
  { label: "শিক্ষা", href: "/category/education", children: [] },
  { label: "ব্যবসা", href: "/category/business", children: [] },
  { label: "ভ্রমণ", href: "/category/travel", children: [] },
  { label: "জ্যোতিষ", href: "/category/astrology", children: [] },
  { label: "লাইভ টিভি", href: "/live-tv", children: [] },
  { label: "ই-পেপার", href: "/epaper", children: [] },
  {
  label: "সংবাদ ভিডিও",
  href: "https://www.youtube.com/@sambadsironamdigital",
  external: true,
  children: [],
},
  { label: "রান্না", href: "/category/food", children: [] },
  { label: "সম্পাদকীয়", href: "/category/editorial", children: [] },
  { label: "যোগাযোগ করুন", href: "/contact", children: [] },
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
  const [breakingItems, setBreakingItems] = useState<string[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBreakingNews = async () => {
      try {
        const q = query(
          collection(db, "news"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const snapshot = await getDocs(q);
        const items = snapshot.docs
          .map((doc) => doc.data())
          .map((item) => item.title || item.description || "")
          .filter(Boolean) as string[];

        setBreakingItems(items);
        setTickerIndex(0);
      } catch (error) {
        console.error("Failed to load breaking news:", error);
      }
    };

    loadBreakingNews();
  }, []);

  useEffect(() => {
    if (breakingItems.length === 0) return;

    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % breakingItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [breakingItems]);

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

  const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

const today = currentTime.toLocaleDateString("bn-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const time = currentTime.toLocaleTimeString("bn-IN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

  return (
    <>
      {/* Utility Bar */}
      <div style={{ backgroundColor: "#001657" }} className="text-white py-1">
        <div className="max-w-[1440px] mx-auto px-2 sm:px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-300">
            <span className="flex items-center gap-1.5">
              <Globe size={12} />
              <span>{today}</span>
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] sm:text-xs">
            <Link
              to="/admin"
              className="flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <User size={12} />
              লগইন
            </Link>
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
        <div className="relative flex items-center justify-between py-3 min-h-[100px]">

  {/* Left Section */}
  <div className="flex items-center gap-2 sm:gap-3 z-5 px-2 sm:px-4 lg:px-8">

    <Link
      to="/live-tv"
      className="hidden lg:flex items-center gap-1 text-red-400 animate-pulse font-semibold hover:text-yellow-400 transition-colors"
    >
      <Radio size={16} />
      <span>লাইভ টিভি</span>
    </Link>

    <Link
      to="/live-tv"
      className="flex lg:hidden items-center text-red-400 animate-pulse hover:text-yellow-400 transition-colors"
    >
      <Radio size={16} />
    </Link>

    <Link
      to="/epaper"
      className="hidden lg:flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-colors"
    >
      <Newspaper size={16} />
      <span>ই-পেপার</span>
    </Link>

    <Link
      to="/epaper"
      className="flex lg:hidden items-center text-gray-300 hover:text-yellow-400 transition-colors"
    >
      <Newspaper size={16} />
    </Link>

  </div>

  {/* EXACT CENTER LOGO */}
  <Link
    to="/"
    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center px-2 z-0"
  >

    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">

      <img
        src={logo}
        alt="Sambad Sironam"
        className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 rounded-lg sm:rounded-lg md:rounded-xl object-contain flex-shrink-0"
      />

      <h1
        className="text-white font-bold leading-tight"
        style={{
          fontFamily: "'Noto Serif Bengali', serif",
          fontSize: "clamp(1rem, 4vw, 3rem)",
        }}
      >
        সংবাদ শিরোনাম
      </h1>

    </div>

    <p
      className="mt-1 sm:mt-1.5 md:mt-2 text-yellow-300 tracking-wide font-medium text-center px-2"
      style={{
        fontFamily: "'Noto Sans Bengali', sans-serif",
        fontSize: "clamp(0.5rem, 1.4vw, 0.95rem)",
        lineHeight: 1.2,
      }}
    >
      মাথা উঁচু করে এগিয়ে চলার শপথ
    </p>

  </Link>

  {/* Right Section - Far Right */}
  <div className="flex items-center gap-3 md:gap-5 z-10 ml-auto pr-2 sm:pr-4 lg:pr-6">

    <div className="hidden md:flex items-center gap-3">
      <a
        href="https://www.youtube.com/@sambadsironamdigital"
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-400 hover:text-gray-400 transition-colors"
      >
        <FaYoutube size={22} />
      </a>

      <a
        href="https://www.facebook.com/sambadsironam"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-gray-400 transition-colors"
      >
        <FaFacebookF size={18} />
      </a>

      <a
        href="https://instagram.com/sambadsironam"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-400 hover:text-gray-400 transition-colors"
      >
        <FaInstagram size={18} />
      </a>
    </div>

    <div className="flex md:hidden items-center gap-2">
      <a
        href="https://www.youtube.com/@sambadsironamdigital"
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-400 hover:text-gray-400 transition-colors"
      >
        <FaYoutube size={16} />
      </a>

      <a
        href="https://www.facebook.com/sambadsironam"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-gray-400 transition-colors"
      >
        <FaFacebookF size={13} />
      </a>

      <a
        href="https://instagram.com/sambadsironam"
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-400 hover:text-gray-400 transition-colors"
      >
        <FaInstagram size={14} />
      </a>
    </div>

    <button
      className="md:hidden text-white p-2"
      onClick={() => setMobileOpen(!mobileOpen)}
    >
      {mobileOpen ? <X size={22} /> : <Menu size={22} />}
    </button>

  </div>

</div>

        {/* Nav Bar */}
        <div className="border-t border-white/10 hidden md:block overflow-x-auto">
          <div className="min-w-min">
            <nav className="flex items-center gap-0 px-4">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => item.children.length > 0 && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.external ? (
  <a
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1 lg:px-3 md:px-2 py-3 text-xs lg:text-sm text-gray-200 hover:text-yellow-400 transition-colors whitespace-nowrap"
    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
  >
    {item.label}
    {item.children.length > 0 && (
      <ChevronDown size={12} className="opacity-60" />
    )}
  </a>
) : (
  <Link
    to={item.href}
    className="flex items-center gap-1 lg:px-3 md:px-2 py-3 text-xs lg:text-sm text-gray-200 hover:text-yellow-400 transition-colors whitespace-nowrap"
    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
  >
    {item.label}
    {item.children.length > 0 && (
      <ChevronDown size={12} className="opacity-60" />
    )}
  </Link>
)}
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
              <div className="flex-shrink-0 flex items-center gap-2 py-1.5 ml-2">
                <Link to="/live-tv" className="hidden lg:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full transition-colors font-medium">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  লাইভ
                </Link>
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
            {breakingItems.length > 0 && (
              <div
                key={tickerIndex}
                className="text-sm whitespace-nowrap"
                style={{
                  fontFamily: "'Noto Sans Bengali', sans-serif",
                  animation: "slideIn 0.5s ease-in-out"
                }}
              >
                {breakingItems[tickerIndex]}
              </div>
            )}
          </div>
          <TrendingUp size={14} className="flex-shrink-0 opacity-75" />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900/95 text-white overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              
              <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
            </div>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.external ? (
  <a
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => setMobileOpen(false)}
    className="flex items-center justify-between w-full py-3 px-2 border-b border-white/10 text-gray-200 hover:text-yellow-400 transition-colors"
    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
  >
    {item.label}
  </a>
) : (
  <Link
    to={item.href}
    onClick={() => setMobileOpen(false)}
    className="flex items-center justify-between w-full py-3 px-2 border-b border-white/10 text-gray-200 hover:text-yellow-400 transition-colors"
    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
  >
    {item.label}
  </Link>
)}
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
            <div className="mt-6">
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-red-600 text-white text-center py-2.5 rounded-lg font-medium"
              >
                লগইন
              </Link>
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
