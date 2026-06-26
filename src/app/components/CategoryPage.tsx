import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, Eye, ChevronRight, TrendingUp, Filter, Grid, List } from "lucide-react";

const CATEGORY_META: Record<string, { label: string; color: string; description: string; icon: string }> = {
  "west-bengal": { label: "পশ্চিমবঙ্গ", color: "#D71920", description: "পশ্চিমবঙ্গের সর্বশেষ সংবাদ ও আপডেট", icon: "🏛️" },
  "kolkata": { label: "কলকাতা", color: "#D71920", description: "মহানগরী কলকাতার খবরাখবর", icon: "🌆" },
  "india": { label: "ভারত", color: "#F4B400", description: "ভারতের জাতীয় সংবাদ", icon: "🇮🇳" },
  "politics": { label: "রাজনীতি", color: "#0B1F3A", description: "দেশ-বিদেশের রাজনৈতিক সংবাদ", icon: "⚖️" },
  "sports": { label: "খেলাধুলা", color: "#1B8A5A", description: "ক্রিকেট, ফুটবল ও অন্যান্য খেলার খবর", icon: "🏏" },
  "cricket": { label: "ক্রিকেট", color: "#1B8A5A", description: "ক্রিকেটের সর্বশেষ আপডেট", icon: "🏏" },
  "entertainment": { label: "বিনোদন", color: "#F4B400", description: "চলচ্চিত্র, টেলিভিশন ও বিনোদনের খবর", icon: "🎬" },
  "technology": { label: "প্রযুক্তি", color: "#0B1F3A", description: "প্রযুক্তি ও বিজ্ঞানের সর্বশেষ আপডেট", icon: "💻" },
  "business": { label: "ব্যবসা", color: "#F4B400", description: "অর্থনীতি ও ব্যবসার সংবাদ", icon: "💹" },
  "world": { label: "বিশ্ব", color: "#0B1F3A", description: "আন্তর্জাতিক সংবাদ ও বিশ্বের খবর", icon: "🌍" },
};

const MOCK_ARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: `cat-${i + 1}`,
  title: [
    "পশ্চিমবঙ্গে নতুন সরকারি প্রকল্প ঘোষণা, কোটি কোটি মানুষ উপকৃত হবেন",
    "লোকসভায় বিতর্কিত বিল পাস, বিরোধীদের তীব্র প্রতিবাদ",
    "ক্রিকেট বিশ্বকাপে ভারতের ঐতিহাসিক জয়, দেশজুড়ে আনন্দ উদযাপন",
    "বাংলা চলচ্চিত্রে নতুন অধ্যায়, আন্তর্জাতিক পুরস্কার পেল বাংলা ছবি",
    "প্রযুক্তি খাতে ভারত বিশ্বে চতুর্থ স্থানে, রপ্তানি রেকর্ড",
    "কলকাতায় ঐতিহ্যবাহী দুর্গাপূজার প্রস্তুতি শুরু, কোটি টাকার বাজেট",
    "রাজ্যে নতুন বিদ্যুৎ প্রকল্প, ২ লাখ পরিবার পাবে সুবিধা",
    "ভারত-চীন সীমান্ত উত্তেজনা, কূটনৈতিক আলোচনার উদ্যোগ",
    "শেয়ার বাজারে ধস, বিনিয়োগকারীদের মাথায় হাত",
    "সুন্দরবনে নতুন বাঘের সন্ধান, পর্যটকদের উত্তেজনা",
    "রাজ্যের স্বাস্থ্য পরিষেবায় নতুন উদ্যোগ, বিনামূল্যে চিকিৎসা",
    "শিক্ষা ব্যবস্থায় বড় পরিবর্তন, নতুন পাঠ্যক্রম চালু",
  ][i],
  category: "পশ্চিমবঙ্গ",
  image: [
    "https://images.unsplash.com/photo-1580060092295-dbe639fffda3?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1675693303492-9a5bc898bf94?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1682130301125-5b63bbf93241?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1533254012848-644c18f39289?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1513014576558-921f00d80b77?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1583608563020-9772ff491a8c?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1625401586060-f12be3d7cc57?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1720195343674-e20e1dcfadf5?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1635017010130-8b12cbae591d?w=600&h=400&fit=crop&auto=format",
  ][i],
  time: `${i + 1} ঘণ্টা আগে`,
  views: `${Math.floor(Math.random() * 90000 + 10000).toLocaleString("bn-IN")}`,
  excerpt: "বিস্তারিত তথ্য জানতে সম্পূর্ণ প্রতিবেদনটি পড়ুন। এই সংবাদটি আমাদের বিশেষ সংবাদদাতার পাঠানো প্রতিবেদন থেকে নেওয়া হয়েছে।",
}));

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = CATEGORY_META[slug || "west-bengal"] || CATEGORY_META["west-bengal"];
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("সর্বশেষ");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const totalPages = Math.ceil(MOCK_ARTICLES.length / pageSize);
  const articles = MOCK_ARTICLES.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">
      {/* Category Header */}
      <div style={{ backgroundColor: meta.color }} className="text-white py-8">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{meta.icon}</span>
            <div>
              <h1
                className="text-white"
                style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 800 }}
              >
                {meta.label}
              </h1>
              <p className="text-white/80 text-sm mt-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                {meta.description}
              </p>
            </div>
          </div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-white/60 text-sm mt-3" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            <Link to="/" className="hover:text-white transition-colors">হোম</Link>
            <ChevronRight size={13} />
            <span className="text-white">{meta.label}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
          <main>
            {/* Featured Article */}
            {MOCK_ARTICLES[0] && (
              <Link to={`/article/${MOCK_ARTICLES[0].id}`} className="group block mb-6 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden bg-gray-100">
                    <img
                      src={MOCK_ARTICLES[0].image}
                      alt={MOCK_ARTICLES[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className="absolute top-3 left-3 text-white text-xs px-2.5 py-1 rounded-full font-bold"
                      style={{ backgroundColor: meta.color, fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      বিশেষ প্রতিবেদন
                    </span>
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h2
                      className="text-gray-900 dark:text-white group-hover:text-red-600 transition-colors mb-3 leading-snug"
                      style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.3rem", fontWeight: 700 }}
                    >
                      {MOCK_ARTICLES[0].title}
                    </h2>
                    <p
                      className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {MOCK_ARTICLES[0].excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} />{MOCK_ARTICLES[0].time}</span>
                      <span className="flex items-center gap-1"><Eye size={11} />{MOCK_ARTICLES[0].views}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter size={15} className="text-gray-400" />
                {["সর্বশেষ", "সর্বাধিক পঠিত", "সম্পাদকের বাছাই"].map(s => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${sortBy === s ? "text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    style={{
                      backgroundColor: sortBy === s ? meta.color : undefined,
                      fontFamily: "'Noto Sans Bengali', sans-serif"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-red-600 text-white" : "bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-red-600 text-white" : "bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Articles Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {articles.map(article => (
                  <Link key={article.id} to={`/article/${article.id}`} className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span
                        className="absolute top-2 left-2 text-white text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: meta.color, fontFamily: "'Noto Sans Bengali', sans-serif" }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3
                        className="text-gray-900 dark:text-gray-100 group-hover:text-red-600 transition-colors flex-1 leading-snug"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "0.9rem", fontWeight: 600 }}
                      >
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3 text-gray-400 text-xs">
                        <span className="flex items-center gap-1"><Clock size={10} />{article.time}</span>
                        <span className="flex items-center gap-1"><Eye size={10} />{article.views}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {articles.map((article, i) => (
                  <Link key={article.id} to={`/article/${article.id}`} className="group flex gap-4 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="relative flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-gray-900 dark:text-gray-100 group-hover:text-red-600 transition-colors leading-snug mb-2"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "0.95rem", fontWeight: 600 }}
                      >
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-gray-400 text-xs">
                        <span className="flex items-center gap-1"><Clock size={10} />{article.time}</span>
                        <span className="flex items-center gap-1"><Eye size={10} />{article.views}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                পূর্ববর্তী
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm transition-all ${page === p ? "text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  style={{ backgroundColor: page === p ? meta.color : undefined }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                পরবর্তী
              </button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3" style={{ backgroundColor: meta.color }}>
                <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1rem" }}>
                  <TrendingUp size={16} /> ট্রেন্ডিং
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {MOCK_ARTICLES.slice(0, 5).map((item, i) => (
                  <Link key={item.id} to={`/article/${item.id}`} className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: meta.color }}
                    >
                      {i + 1}
                    </span>
                    <p
                      className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug text-sm"
                      style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600 }}
                    >
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center py-16 text-gray-400 text-sm">
              বিজ্ঞাপন ৩০০×৩৫০
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
      `}</style>
    </div>
  );
}
