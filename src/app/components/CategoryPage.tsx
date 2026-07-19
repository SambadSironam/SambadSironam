import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Eye, ChevronRight, TrendingUp, Filter, Grid, List } from "lucide-react";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

const CATEGORY_META: Record<
  string,
  {
    label: string;
    color: string;
    description: string;
    icon: string;
  }
> = {
    "west-bengal": {
    label: "পশ্চিমবঙ্গ",
    color: "#D71920",
    description: "পশ্চিমবঙ্গের সর্বশেষ সংবাদ",
    icon: "🏛️",
    
  },
  "north-bengal": {
  label: "উত্তরবঙ্গ",
  color: "#D71920",
  description: "উত্তরবঙ্গের সর্বশেষ সংবাদ",
  icon: "🏔️",
},

"south-bengal": {
  label: "দক্ষিণবঙ্গ",
  color: "#D71920",
  description: "দক্ষিণবঙ্গের সর্বশেষ সংবাদ",
  icon: "🌾",
},

  "kolkata": {
    label: "কলকাতা",
    color: "#C62828",
    description: "কলকাতার সর্বশেষ সংবাদ",
    icon: "🌆",
  },

  "india": {
    label: "ভারত",
    color: "#FF9933",
    description: "ভারতের জাতীয় সংবাদ",
    icon: "🇮🇳",
  },

  "world": {
    label: "বিশ্ব",
    color: "#0B1F3A",
    description: "আন্তর্জাতিক সংবাদ",
    icon: "🌍",
  },

  "politics": {
    label: "রাজনীতি",
    color: "#1E3A8A",
    description: "রাজনৈতিক সংবাদ",
    icon: "⚖️",
  },

  "crime": {
    label: "অপরাধ",
    color: "#B91C1C",
    description: "অপরাধ সংক্রান্ত সংবাদ",
    icon: "🚔",
  },

  "accident": {
    label: "দুর্ঘটনা",
    color: "#EF4444",
    description: "দুর্ঘটনার খবর",
    icon: "🚑",
  },

  "sports": {
    label: "খেলাধুলা",
    color: "#15803D",
    description: "খেলাধুলার সর্বশেষ সংবাদ",
    icon: "🏆",
  },

  "cricket": {
    label: "ক্রিকেট",
    color: "#16A34A",
    description: "ক্রিকেট সংবাদ",
    icon: "🏏",
  },

  "football": {
    label: "ফুটবল",
    color: "#22C55E",
    description: "ফুটবল সংবাদ",
    icon: "⚽",
  },

  "ipl": {
    label: "আইপিএল",
    color: "#7C3AED",
    description: "আইপিএল সংবাদ",
    icon: "🏆",
  },

  "tennis": {
    label: "টেনিস",
    color: "#84CC16",
    description: "টেনিস সংবাদ",
    icon: "🎾",
  },

  "other-sports": {
    label: "অন্যান্য খেলা",
    color: "#059669",
    description: "অন্যান্য খেলাধুলার সংবাদ",
    icon: "🥇",
  },

  "business": {
    label: "ব্যবসা",
    color: "#D97706",
    description: "ব্যবসা ও বাণিজ্যের সংবাদ",
    icon: "💹",
  },

  "economy": {
    label: "অর্থনীতি",
    color: "#F59E0B",
    description: "অর্থনীতির খবর",
    icon: "📈",
  },

  "stock-market": {
    label: "শেয়ার বাজার",
    color: "#EA580C",
    description: "শেয়ার বাজারের সংবাদ",
    icon: "📊",
  },

  "startup": {
    label: "স্টার্টআপ",
    color: "#FB923C",
    description: "স্টার্টআপ ও উদ্যোক্তা",
    icon: "🚀",
  },

  "cryptocurrency": {
    label: "ক্রিপ্টোকারেন্সি",
    color: "#FACC15",
    description: "ক্রিপ্টোকারেন্সির খবর",
    icon: "₿",
  },

  "technology": {
    label: "প্রযুক্তি",
    color: "#2563EB",
    description: "প্রযুক্তির সর্বশেষ সংবাদ",
    icon: "💻",
  },

  "ai": {
    label: "কৃত্রিম বুদ্ধিমত্তা",
    color: "#4338CA",
    description: "AI সংক্রান্ত সংবাদ",
    icon: "🤖",
  },

  "mobile": {
    label: "মোবাইল",
    color: "#0284C7",
    description: "মোবাইল সংবাদ",
    icon: "📱",
  },

  "gadgets": {
    label: "গ্যাজেট",
    color: "#0EA5E9",
    description: "গ্যাজেট রিভিউ ও সংবাদ",
    icon: "⌚",
  },

  "cyber-security": {
    label: "সাইবার নিরাপত্তা",
    color: "#1D4ED8",
    description: "সাইবার নিরাপত্তা",
    icon: "🛡️",
  },

    "entertainment": {
    label: "বিনোদন",
    color: "#EC4899",
    description: "বিনোদন জগতের সর্বশেষ সংবাদ",
    icon: "🎬",
  },

  "tollywood": {
    label: "টলিউড",
    color: "#F97316",
    description: "টলিউড সংবাদ",
    icon: "🎭",
  },

  "bollywood": {
    label: "বলিউড",
    color: "#DC2626",
    description: "বলিউড সংবাদ",
    icon: "🎥",
  },

  "hollywood": {
    label: "হলিউড",
    color: "#7C2D12",
    description: "হলিউড সংবাদ",
    icon: "🎞️",
  },

  "ott": {
    label: "ওটিটি",
    color: "#8B5CF6",
    description: "ওটিটি প্ল্যাটফর্ম সংবাদ",
    icon: "📺",
  },

  "television": {
    label: "টেলিভিশন",
    color: "#2563EB",
    description: "টেলিভিশন সংবাদ",
    icon: "📡",
  },

  "celebrities": {
    label: "তারকা",
    color: "#F43F5E",
    description: "তারকাদের খবর",
    icon: "⭐",
  },

  "health": {
    label: "স্বাস্থ্য",
    color: "#DC2626",
    description: "স্বাস্থ্য সংক্রান্ত সংবাদ",
    icon: "🏥",
  },

  "fitness": {
    label: "ফিটনেস",
    color: "#16A34A",
    description: "ফিটনেস সংবাদ",
    icon: "💪",
  },

  "medical": {
    label: "চিকিৎসা",
    color: "#EF4444",
    description: "চিকিৎসা ও হাসপাতালের খবর",
    icon: "🩺",
  },

  "education": {
    label: "শিক্ষা",
    color: "#2563EB",
    description: "শিক্ষা সংক্রান্ত সংবাদ",
    icon: "🎓",
  },

  "school": {
    label: "স্কুল",
    color: "#1D4ED8",
    description: "স্কুল সংবাদ",
    icon: "🏫",
  },

  "college": {
    label: "কলেজ",
    color: "#3B82F6",
    description: "কলেজ সংবাদ",
    icon: "🎒",
  },

  "competitive-exams": {
    label: "প্রতিযোগিতামূলক পরীক্ষা",
    color: "#0EA5E9",
    description: "চাকরি ও প্রবেশিকা পরীক্ষার খবর",
    icon: "📖",
  },

  "results": {
    label: "ফলাফল",
    color: "#06B6D4",
    description: "পরীক্ষার ফলাফল",
    icon: "📜",
  },

  "career": {
    label: "ক্যারিয়ার",
    color: "#0284C7",
    description: "ক্যারিয়ার সংক্রান্ত সংবাদ",
    icon: "🎯",
  },

  "jobs": {
    label: "চাকরি",
    color: "#6D4C41",
    description: "চাকরির খবর",
    icon: "💼",
  },

  "environment": {
    label: "পরিবেশ",
    color: "#15803D",
    description: "পরিবেশ সংক্রান্ত সংবাদ",
    icon: "🌿",
  },

  "weather": {
    label: "আবহাওয়া",
    color: "#0EA5E9",
    description: "আবহাওয়ার সর্বশেষ আপডেট",
    icon: "⛅",
  },

  "agriculture": {
    label: "কৃষি",
    color: "#65A30D",
    description: "কৃষি সংবাদ",
    icon: "🌾",
  },

  "science": {
    label: "বিজ্ঞান",
    color: "#0284C7",
    description: "বিজ্ঞান সংবাদ",
    icon: "🔬",
  },

  "space": {
    label: "মহাকাশ",
    color: "#312E81",
    description: "মহাকাশ গবেষণার সংবাদ",
    icon: "🚀",
  },

  "lifestyle": {
    label: "লাইফস্টাইল",
    color: "#9333EA",
    description: "লাইফস্টাইল সংবাদ",
    icon: "🏡",
  },

  "travel": {
    label: "ভ্রমণ",
    color: "#0F766E",
    description: "ভ্রমণ সংবাদ",
    icon: "✈️",
  },

  "food": {
    label: "খাদ্য",
    color: "#EA580C",
    description: "খাবার ও রেসিপি",
    icon: "🍲",
  },

  "fashion": {
    label: "ফ্যাশন",
    color: "#DB2777",
    description: "ফ্যাশন সংবাদ",
    icon: "👗",
  },

  "relationship": {
    label: "সম্পর্ক",
    color: "#E11D48",
    description: "সম্পর্ক ও পরিবার",
    icon: "❤️",
  },

    "religion": {
    label: "ধর্ম",
    color: "#F97316",
    description: "ধর্মীয় সংবাদ",
    icon: "🕉️",
  },

  "astrology": {
    label: "রাশিফল",
    color: "#8B5CF6",
    description: "রাশিফল ও জ্যোতিষ সংবাদ",
    icon: "🔮",
  },

  "automobile": {
    label: "অটোমোবাইল",
    color: "#475569",
    description: "গাড়ি ও বাইকের সংবাদ",
    icon: "🚗",
  },

  "opinion": {
    label: "মতামত",
    color: "#6D4C41",
    description: "বিশেষজ্ঞদের মতামত",
    icon: "💬",
  },

  "editorial": {
    label: "সম্পাদকীয়",
    color: "#5D4037",
    description: "সম্পাদকীয় নিবন্ধ",
    icon: "✍️",
  },

  "history": {
    label: "ইতিহাস",
    color: "#795548",
    description: "ইতিহাস বিষয়ক সংবাদ ও বিশেষ প্রতিবেদন",
    icon: "📜",
  },

  "festivals": {
    label: "উৎসব",
    color: "#F59E0B",
    description: "উৎসব ও সংস্কৃতি",
    icon: "🎉",
  },

  "government-schemes": {
    label: "সরকারি প্রকল্প",
    color: "#1D4ED8",
    description: "কেন্দ্র ও রাজ্য সরকারের বিভিন্ন প্রকল্প",
    icon: "🏛️",
  },

  "international": {
    label: "আন্তর্জাতিক",
    color: "#1E3A8A",
    description: "আন্তর্জাতিক সংবাদ",
    icon: "🌐",
  },

  "national": {
    label: "জাতীয়",
    color: "#EA580C",
    description: "জাতীয় সংবাদ",
    icon: "🇮🇳",
  },

  default: {
    label: "সকল সংবাদ",
    color: "#D71920",
    description: "সর্বশেষ সংবাদ",
    icon: "📰",
  },

    "defence": {
    label: "প্রতিরক্ষা",
    color: "#374151",
    description: "প্রতিরক্ষা সংক্রান্ত সংবাদ",
    icon: "🪖",
  },

  "railways": {
    label: "রেল",
    color: "#DC2626",
    description: "রেলওয়ে সংবাদ",
    icon: "🚆",
  },

  "metro": {
    label: "মেট্রো",
    color: "#0284C7",
    description: "মেট্রো রেলের খবর",
    icon: "🚇",
  },

  "aviation": {
    label: "বিমান",
    color: "#2563EB",
    description: "বিমান চলাচলের সংবাদ",
    icon: "✈️",
  },

  "banking": {
    label: "ব্যাংকিং",
    color: "#16A34A",
    description: "ব্যাংকিং ও আর্থিক সংবাদ",
    icon: "🏦",
  },

  "insurance": {
    label: "বীমা",
    color: "#0F766E",
    description: "বীমা সংক্রান্ত সংবাদ",
    icon: "🛡️",
  },

  "real-estate": {
    label: "রিয়েল এস্টেট",
    color: "#92400E",
    description: "রিয়েল এস্টেট সংবাদ",
    icon: "🏢",
  },

  "startup-india": {
    label: "স্টার্টআপ ইন্ডিয়া",
    color: "#7C3AED",
    description: "স্টার্টআপ ইন্ডিয়া সংবাদ",
    icon: "🚀",
  },

  "women": {
    label: "নারী",
    color: "#DB2777",
    description: "নারী বিষয়ক সংবাদ",
    icon: "👩",
  },

  "children": {
    label: "শিশু",
    color: "#EA580C",
    description: "শিশু বিষয়ক সংবাদ",
    icon: "🧒",
  },

  "senior-citizen": {
    label: "প্রবীণ",
    color: "#78716C",
    description: "প্রবীণ নাগরিকদের সংবাদ",
    icon: "👴",
  },

  "exclusive": {
    label: "এক্সক্লুসিভ",
    color: "#B91C1C",
    description: "এক্সক্লুসিভ প্রতিবেদন",
    icon: "⭐",
  },

  "fact-check": {
    label: "ফ্যাক্ট চেক",
    color: "#2563EB",
    description: "ফ্যাক্ট চেক প্রতিবেদন",
    icon: "✔️",
  },

  "investigation": {
    label: "অনুসন্ধান",
    color: "#7C2D12",
    description: "অনুসন্ধানমূলক প্রতিবেদন",
    icon: "🔍",
  },

  "special-report": {
    label: "বিশেষ প্রতিবেদন",
    color: "#9333EA",
    description: "বিশেষ প্রতিবেদন",
    icon: "📰",
  },
};




export function CategoryPage() {
const { slug } = useParams<{ slug: string }>();
const meta =
  CATEGORY_META[slug || "west-bengal"] || CATEGORY_META["west-bengal"];

const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
const [sortBy, setSortBy] = useState("সর্বশেষ");
const [page, setPage] = useState(1);

const [articles, setArticles] = useState<any[]>([]);

const pageSize = 9;
const totalPages = Math.ceil(articles.length / pageSize) || 1;

const paginatedArticles = articles.slice(
  (page - 1) * pageSize,
  page * pageSize
  
);
const categoryMap: Record<string, string> = {
  "west-bengal": "west-bengal",
  "north-bengal": "north-bengal",
  "south-bengal": "south-bengal",

  "politics": "politics",

  "sports": "sports",
  "cricket": "cricket",
  "football": "football",
  "other-sports": "other-sports",

  "business": "business",
  "technology": "technology",
  "health": "health",
  "education": "education",
  "entertainment": "entertainment",
  "food": "food",

  "india": "india",
  "world": "world",

  "editorial": "editorial",
};
useEffect(() => {
  const loadNews = async () => {
    try {
      const snapshot = await getDocs(collection(db, "news"));

const allNews = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

const firebaseCategory = (categoryMap[slug || ""] || slug)?.toLowerCase();

const filtered = allNews.filter((item: any) => {
  const itemCat = item.category?.toLowerCase();
  if (firebaseCategory === "sports") {
    return ["sports", "cricket", "football", "other-sports"].includes(itemCat);
  }
  if (firebaseCategory === "west-bengal") {
    return ["west-bengal", "north-bengal", "south-bengal"].includes(itemCat);
  }
  return itemCat === firebaseCategory;
});

console.log("Slug:", slug);
console.log("Filtered:", filtered);

setArticles(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  loadNews();
}, [slug]);
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
            {articles.length > 0 && (
              <Link to={`/article/${articles[0].id}`} className="group block mb-6 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden bg-gray-100">
                    <img
                      src={articles[0].image}
                      alt={articles[0].title}
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
                      {articles[0].title}
                    </h2>
                    <p
                      className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {articles[0].description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye size={11} />{articles[0].views} Views</span>
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
                {paginatedArticles.map((article) => (
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
                        <span className="flex items-center gap-1"><Eye size={10} />{article.views} Views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {paginatedArticles.map((article) => (
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
                        {article.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-gray-400 text-xs">
                        <span className="flex items-center gap-1"><Eye size={10} />{article.views} Views</span>
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
                {articles.slice(0, 5).map((item, i) => (
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
