import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  TrendingUp, Clock, Eye, Heart, Share2, Bookmark, Play,
  ChevronRight, Star, Zap, Camera, BarChart2, BookOpen,
  Headphones, Monitor, FlameKindling, Newspaper
} from "lucide-react";

function NewsCard({ story }: { story: any }) {
  const [saved, setSaved] = useState(false);
  return (
    <Link to={`/article/${story.id}`} className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden aspect-video bg-gray-100">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className="absolute top-3 left-3 text-white text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ backgroundColor: story.catColor, fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          {story.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="text-gray-900 dark:text-gray-100 group-hover:text-red-600 transition-colors line-clamp-3 flex-1 leading-snug"
          style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1rem", fontWeight: 600 }}
        >
          {story.title}
        </h3>
        <div className="flex items-center justify-between mt-3 text-gray-400 text-xs">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {story.time}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {story.views}
            </span>
            <button
              onClick={e => { e.preventDefault(); setSaved(!saved); }}
              className={`transition-colors ${saved ? "text-red-500" : "hover:text-red-500"}`}
            >
              <Bookmark size={12} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, catSlug, href, icon }: { title: string; catSlug?: string; href?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2
          className="text-gray-900 dark:text-white"
          style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.35rem", fontWeight: 700 }}
        >
          {title}
        </h2>
        <div className="w-12 h-0.5 bg-red-600 ml-1" />
      </div>
      {(href || catSlug) && (
        <Link
          to={href || `/category/${catSlug}`}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm transition-colors"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          আরও দেখুন <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

function AdBanner({ label = "বিজ্ঞাপন", size = "728×90" }: { label?: string; size?: string }) {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center py-4 text-gray-400 text-sm my-6">
      {label} — {size}
    </div>
  );
}

function getTimeAgo(timestamp: any) {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const now = new Date();

  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "এইমাত্র";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} মিনিট আগে`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "গতকাল";

  if (days < 30) return `${days} দিন আগে`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} মাস আগে`;

  const years = Math.floor(months / 12);
  return `${years} বছর আগে`;
}

export function HomePage() {
  const [news, setNews] = useState<any[]>([]);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const westBengalNews = news.filter(
  item => item.category === "west-bengal"
).slice(0,3);

const politicsNews = news.filter(
  item => item.category === "politics"
).slice(0,3);

const sportsNews = news.filter(
  item => item.category === "sports"
).slice(0,3);

const businessNews = news.filter(
  
  item => item.category === "business"
).slice(0,3);

const videoNews = news
  .filter((item) => item.category === "videos")
  .slice(0, 4);

const photoNews = news
  .filter((item) => item.image)
  .slice(0, 4);

const editorPickNews = news

  .filter((item) => item.category === "editor-pick")
  .slice(0, 4);
const trendingNews = [...news]
  .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
  .slice(0, 5);
const latestNewsList = news.slice(0, 4);
useEffect(() => {
  const loadNews = async () => {
    const q = query(
      collection(db, "news"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    const newsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNews(newsData);
    console.log("Firestore News:", newsData);
  };

  loadNews();
}, []);
const handleSubscribe = async () => {
  if (!subscriberEmail.trim()) {
    alert("Please enter your email.");
    return;
  }

  try {
    await emailjs.send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      {
        subscriber_email: subscriberEmail,
        time: new Date().toLocaleString(),
      },
      "YOUR_PUBLIC_KEY"
    );

    alert("Thank you for subscribing!");
    setSubscriberEmail("");

  } catch (error) {
    console.error(error);
    alert("Failed to subscribe.");
  }
};
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Hero */}
          <div className="lg:col-span-2">
            {news.slice(0, 1).map((item: any) => (
              <Link key={item.id} to={`/article/${item.id}`} className="group relative block rounded-2xl overflow-hidden aspect-[16/9] bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {item.isLive && (
                      <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        লাইভ আপডেট
                      </span>
                    )}
                    <span
                      className="bg-yellow-400 text-gray-900 text-xs px-2.5 py-1 rounded-full font-bold"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <h1
                    className="text-white mb-2 leading-snug group-hover:text-yellow-300 transition-colors"
                    style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "clamp(1.1rem,3vw,1.7rem)", fontWeight: 700 }}
                  >
                    {item.title}
                  </h1>
                  <p
                    className="text-gray-300 text-sm line-clamp-2"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {item.subtitle}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-gray-400 text-xs">
                    <span className="flex items-center gap-1"><Clock size={12} />{item.time}</span>
                    <span className="flex items-center gap-1"><Eye size={12} />{item.views || 0} Views পাঠক</span>
                    <button className="ml-auto flex items-center gap-1 text-gray-300 hover:text-white">
                      <Share2 size={13} /> শেয়ার
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar: Top Stories */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FlameKindling size={18} className="text-red-600" />
                <h2 style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 700, fontSize: "1.1rem" }} className="dark:text-white">
                  শীর্ষ সংবাদ
                </h2>
              </div>
              <Link
                to="/section/top-stories"
                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs transition-colors"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                আরও দেখুন<ChevronRight size={12} />
              </Link>
            </div>
            {news.slice(1, 5).map((story: any) => (
              <Link key={story.id} to={`/article/${story.id}`} className="group flex gap-3 bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                <div className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-1 left-1 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: story.catColor }}>
                    {story.category}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-gray-900 dark:text-gray-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug"
                    style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "0.875rem", fontWeight: 600 }}
                  >
                    {story.title}
                  </p>
                  <span className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <Clock size={10} /> {story.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdBanner size="970×250" />

      {/* Main Content + Sidebar */}
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          <main>
            {/* Latest News with Tabs */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-red-600" />
                  <h2 style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 700, fontSize: "1.35rem" }} className="dark:text-white">
                    সর্বশেষ সংবাদ
                  </h2>
                </div>
                <Link to="/section/latest-news" className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm transition-colors" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  আরও দেখুন <ChevronRight size={14} />
                </Link>
              </div>

              <div className="space-y-0 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
                {latestNewsList.map((item: any, i: number) => (
                  <Link key={item.id} to={`/article/${item.id}`} className="group flex items-center gap-4 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="text-gray-300 dark:text-gray-600 font-bold text-lg w-6 text-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-1"
                        style={{ backgroundColor: "#d71920" }}
                      >
                        {item.category}
                      </span>
                      <p
                        className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors line-clamp-1"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600, fontSize: "0.95rem" }}
                      >
                        {item.title}
                      </p>
                    </div>
                    <span className="text-gray-400 text-xs flex-shrink-0 flex items-center gap-1">
                      <Clock size={10} /> Just now
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Top Stories Grid */}
            <section className="mb-10">
              <SectionHeader title="প্রধান সংবাদ" href="/section/main-stories" icon={<Star size={18} className="text-yellow-500" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {news.slice(5, 9).map((story: any) => (
                  <NewsCard
  key={story.id}
  story={{
    ...story,
    catColor: "#D71920",
    time: getTimeAgo(story.createdAt),
    views: story.views || 0,
  }}
/>
                ))}
              </div>
            </section>


{/* রাজনীতি */}

<section className="mb-10">
  <SectionHeader
    title="রাজনীতি"
    catSlug="politics"
  />

  <div className="space-y-3">
    {politicsNews.map((item: any, i: number) => (
      <Link
        key={item.id}
        to={`/article/${item.id}`}
        className="bg-white rounded-xl p-4 block shadow-sm hover:shadow-md"
      >
        <h3
          className="font-bold text-lg"
          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
        >
          {i + 1}. {item.title}
        </h3>
      </Link>
    ))}
  </div>
</section>

{/* খেলাধুলা */}

<section className="mb-10">
  <SectionHeader
    title="খেলাধুলা"
    catSlug="sports"
  />

  <div className="space-y-3">
    {sportsNews.map((item: any, i: number) => (
      <Link
        key={item.id}
        to={`/article/${item.id}`}
        className="bg-white rounded-xl p-4 block shadow-sm hover:shadow-md"
      >
        <h3
          className="font-bold text-lg"
          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
        >
          {i + 1}. {item.title}
        </h3>
      </Link>
    ))}
  </div>
</section>

{/* ব্যবসা */}

<section className="mb-10">
  <SectionHeader
    title="ব্যবসা"
    catSlug="business"
  />

  <div className="space-y-3">
    {businessNews.map((item: any, i: number) => (
      <Link
        key={item.id}
        to={`/article/${item.id}`}
        className="bg-white rounded-xl p-4 block shadow-sm hover:shadow-md"
      >
        <h3
          className="font-bold text-lg"
          style={{ fontFamily: "'Noto Serif Bengali', serif" }}
        >
          {i + 1}. {item.title}
        </h3>
      </Link>
    ))}
  </div>
</section>

            {/* Video Section */}
            <section className="mb-10">

  <div className="flex justify-between items-center mb-5">
    
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
    {videoNews.map((item: any) => (
      <NewsCard
        key={item.id}
        story={{
          ...item,
          time: getTimeAgo(item.createdAt),
          views: item.views || 0,
        }}
      />
    ))}
  </div>

</section>

            {/* Photo Gallery */}
            <section className="mb-10">
              <SectionHeader title="ছবিতে সংবাদ" href="/section/photos" icon={<Camera size={18} className="text-yellow-500" />} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {photoNews.map((item: any) => (
  <NewsCard
    key={item.id}
    story={{
      ...item,
      time: getTimeAgo(item.createdAt),
      views: item.views || 0,
    }}
  />
))}
              </div>
            </section>

          

            {/* Newsletter */}
            <section className="mb-10 bg-gradient-to-r from-[#0B1F3A] to-[#1a3a5c] rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.5rem", fontWeight: 700 }} className="mb-2">
                  নিউজলেটারে সাইন আপ করুন
                </h3>
                <p style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }} className="text-blue-200 text-sm mb-6">
                  প্রতিদিনের সেরা সংবাদ সরাসরি আপনার ইমেইলে পান
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input
  type="email"
  value={subscriberEmail}
  onChange={(e) => setSubscriberEmail(e.target.value)}
  placeholder="আপনার ইমেইল ঠিকানা"
  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 outline-none focus:border-yellow-400 transition-colors text-sm"
  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
/>
                  <button
  onClick={handleSubscribe}
  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex-shrink-0"
  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
>
  সাবস্ক্রাইব
</button>
                </div>
              </div>
            </section>
          </main>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Trending */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-600 px-4 py-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-white" />
                <h3 className="text-white font-bold" style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1rem" }}>
                  ট্রেন্ডিং
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {trendingNews.map((item: any, index: number) => (
                  
                  <Link key={item.id} to={`/article/${item.id}`} className="group flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        {item.title}
                      </p>
                      <span className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <Eye size={10} /> {item.views || 0} Views
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Live TV Widget */}
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-video relative bg-gray-800 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mb-3 animate-pulse">
                    <Play size={22} className="ml-1" />
                  </div>
                  <p style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }} className="text-sm">লাইভ টিভি দেখুন</p>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-bold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    সংবাদ শিরোনাম — লাইভ
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  এখন সম্প্রচার: বিকেলের প্রধান সংবাদ
                </p>
              </div>
            </div>

            {/* E-Paper */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#0B1F3A] px-4 py-3">
                <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1rem" }}>
                  <Newspaper size={16} /> আজকের ই-পেপার
                </h3>
              </div>
              <div className="p-4">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm mb-3">
                  পেপার প্রিভিউ
                </div>
                <p className="text-gray-500 text-xs text-center mb-3" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  {new Date().toLocaleDateString("bn-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <a
                  href="/epaper"
                  className="block w-full bg-[#0B1F3A] text-white text-center py-2.5 rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  সম্পূর্ণ পেপার পড়ুন
                </a>
              </div>
            </div>

            {/* Ad */}
            <div className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center py-10 text-gray-400 text-sm">
              বিজ্ঞাপন — ৩০০×২৫০
            </div>

            
          </aside>
        </div>
      </div>

      <style>{`
        .hide-scrollbar { scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .line-clamp-3 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
      `}</style>
    </div>
  );
}
