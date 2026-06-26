import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import logoImg from "../../imports/logo.png";
import { FaYoutube } from "react-icons/fa6";

const FOOTER_LINKS = [
  {
    title: "বিভাগ",
    links: [
      { label: "পশ্চিমবঙ্গ", href: "/category/west-bengal" },
      { label: "ভারত", href: "/category/india" },
      { label: "বিশ্ব", href: "/category/world" },
      { label: "রাজনীতি", href: "/category/politics" },
      { label: "খেলাধুলা", href: "/category/sports" },
      { label: "বিনোদন", href: "/category/entertainment" },
    ],
  },
  {
    title: "মিডিয়া",
    links: [
      { label: "ভিডিও সংবাদ", href: "/videos" },
      { label: "ছবিতে সংবাদ", href: "/photos" },
      { label: "লাইভ টিভি", href: "/live-tv" },
      { label: "ই-পেপার", href: "/epaper" },
      { label: "ওয়েব স্টোরি", href: "/web-stories" },
      { label: "পডকাস্ট", href: "/podcast" },
    ],
  },
  {
    title: "আমাদের সম্পর্কে",
    links: [
      { label: "আমাদের পরিচয়", href: "/about" },
      { label: "যোগাযোগ করুন", href: "/contact" },
      { label: "বিজ্ঞাপন দিন", href: "/advertise" },
      { label: "ক্যারিয়ার", href: "/career" },
      { label: "গোপনীয়তা নীতি", href: "/privacy" },
      { label: "শর্তাবলী", href: "/terms" },
    ],
  },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer style={{ backgroundColor: "#0B1F3A" }} className="text-white mt-12">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="Sambad Sironam Logo" className="h-14 w-14 object-contain rounded-xl" />
              <div>
                <h3 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
                  সংবাদ শিরোনাম
                </h3>
                <p className="text-yellow-400 text-xs mt-0.5" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  NEWS & ENTERTAINMENT
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-yellow-400 flex-shrink-0" />
                <span style={{ fontFamily: "'Inter', sans-serif" }}>contact@sambadsironam.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-yellow-400 flex-shrink-0" />
                <span style={{ fontFamily: "'Inter', sans-serif" }}>+91-8900568880 , +91-3345299592</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-yellow-400 flex-shrink-0" />
                <span style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>২০, সতীশ চন্দ্র ঘোষ লেন,মহেশ কলোনি,শ্রীরামপুর, হুগলি,পশ্চিমবঙ্গ – ৭১২২০১।</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { label: "f", color: "#1877F2", title: "Facebook" }
              ].map(s => (
                <a
                  key={s.title}
                  href="#"
                  title={s.title}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold hover:scale-110 transition-transform"
                  style={{ backgroundColor: s.color }}
                >
                  {s.label}
                </a>
              ))}
              <a
                href="#"
                title="YouTube"
                className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <FaYoutube size={14} />
              </a>
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map(section => (
            <div key={section.title}>
              <h4
                className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-blue-200 hover:text-white text-sm transition-colors"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Download */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4
                className="text-white font-bold mb-2"
                style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1rem" }}
              >
                আমাদের অ্যাপ ডাউনলোড করুন
              </h4>
              <p className="text-blue-200 text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                যেকোনো ডিভাইসে সর্বশেষ সংবাদ পেতে আমাদের অ্যাপ ডাউনলোড করুন
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">🍎</span>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500">Download on the</div>
                  <div className="font-bold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">▶</span>
                <div className="text-left">
                  <div className="text-[10px] text-gray-500">Get it on</div>
                  <div className="font-bold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-blue-300 text-xs text-center"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            © ২০২৬ সংবাদ শিরোনাম। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 text-xs text-blue-300">
            <Link to="/privacy" className="hover:text-white transition-colors" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>গোপনীয়তা নীতি</Link>
            <Link to="/terms" className="hover:text-white transition-colors" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>শর্তাবলী</Link>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
