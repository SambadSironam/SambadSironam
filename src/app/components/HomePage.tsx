import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router";
import {
  TrendingUp, Clock, Eye, Heart, Share2, Bookmark, Play,
  ChevronRight, Star, Zap, Camera, BarChart2, BookOpen,
  Headphones, Monitor, FlameKindling, Newspaper
} from "lucide-react";

const HERO_NEWS = [
  {
    id: "1",
    category: "ব্রেকিং নিউজ",
    title: "পশ্চিমবঙ্গে ঐতিহাসিক বন্যা পরিস্থিতি, লক্ষাধিক মানুষ বাস্তুচ্যুত",
    subtitle: "রাজ্যের ১২টি জেলায় জরুরি অবস্থা জারি, সেনাবাহিনী উদ্ধার কাজে নামল",
    image: "https://images.unsplash.com/photo-1580060092295-dbe639fffda3?w=1200&h=700&fit=crop&auto=format",
    time: "৩০ মিনিট আগে",
    views: "১.২ লাখ",
    isLive: true,
  },
];

const TOP_STORIES = [
  {
    id: "2",
    category: "রাজনীতি",
    title: "লোকসভায় বাজেট পেশ করলেন অর্থমন্ত্রী, মধ্যবিত্তদের জন্য বড় ঘোষণা",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop&auto=format",
    time: "১ ঘণ্টা আগে",
    views: "৮৫,৪০০",
    catColor: "#D71920",
  },
  {
    id: "3",
    category: "ক্রিকেট",
    title: "ভারত-অস্ট্রেলিয়া টেস্ট সিরিজ: শমীর ব্যাটে চমৎকার জয়",
    image: "https://images.unsplash.com/photo-1675693303492-9a5bc898bf94?w=600&h=400&fit=crop&auto=format",
    time: "২ ঘণ্টা আগে",
    views: "৬৭,২০০",
    catColor: "#1B8A5A",
  },
  {
    id: "4",
    category: "বিনোদন",
    title: "কান চলচ্চিত্র উৎসবে ভারতীয় ছবির জয়জয়কার, সোনার পাম পুরস্কার",
    image: "https://images.unsplash.com/photo-1682130301125-5b63bbf93241?w=600&h=400&fit=crop&auto=format",
    time: "৩ ঘণ্টা আগে",
    views: "৪৫,৮০০",
    catColor: "#F4B400",
  },
  {
    id: "5",
    category: "প্রযুক্তি",
    title: "ভারতে 5G নেটওয়ার্ক সম্পূর্ণ চালু, দাম কমল ইন্টারনেটের",
    image: "https://images.unsplash.com/photo-1533254012848-644c18f39289?w=600&h=400&fit=crop&auto=format",
    time: "৪ ঘণ্টা আগে",
    views: "৩৮,১০০",
    catColor: "#0B1F3A",
  },
];

const LATEST_NEWS = [
  { id: "l1", category: "কলকাতা", title: "কলকাতায় নতুন মেট্রো লাইন উদ্বোধন করলেন মুখ্যমন্ত্রী", time: "১৫ মিনিট আগে", catColor: "#D71920" },
  { id: "l2", category: "ভারত", title: "দিল্লিতে বায়ু দূষণ রেকর্ড উচ্চতায়, স্কুল বন্ধ ঘোষণা", time: "৩০ মিনিট আগে", catColor: "#F4B400" },
  { id: "l3", category: "বিশ্ব", title: "মধ্যপ্রাচ্যে যুদ্ধবিরতি চুক্তি, জাতিসংঘের মধ্যস্থতায় শান্তি প্রচেষ্টা", time: "৪৫ মিনিট আগে", catColor: "#0B1F3A" },
  { id: "l4", category: "খেলাধুলা", title: "ফিফা র‍্যাংকিংয়ে ভারত ৫ ধাপ এগিয়ে, নতুন রেকর্ড", time: "১ ঘণ্টা আগে", catColor: "#1B8A5A" },
  { id: "l5", category: "ব্যবসা", title: "রিলায়েন্সের মার্কেট ক্যাপ ২০ লাখ কোটি ছাড়াল", time: "১.৫ ঘণ্টা আগে", catColor: "#D71920" },
  { id: "l6", category: "স্বাস্থ্য", title: "করোনার নতুন ভ্যারিয়েন্ট শনাক্ত, স্বাস্থ্য মন্ত্রণালয়ের সতর্কতা", time: "২ ঘণ্টা আগে", catColor: "#F4B400" },
  { id: "l7", category: "শিক্ষা", title: "মাধ্যমিক ফলাফল প্রকাশ, পাশের হার ৯৫%", time: "২ ঘণ্টা আগে", catColor: "#0B1F3A" },
  { id: "l8", category: "পরিবেশ", title: "সুন্দরবনে নতুন বাঘের সন্ধান, বনবিভাগের আনন্দ", time: "৩ ঘণ্টা আগে", catColor: "#1B8A5A" },
];

const VIDEOS = [
  {
    id: "v1",
    title: "বিশেষ সংবাদ: পশ্চিমবঙ্গের বন্যা পরিস্থিতির সম্পূর্ণ আপডেট",
    thumbnail: "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?w=600&h=340&fit=crop&auto=format",
    duration: "১৫:৩২",
    views: "২.৪ লাখ",
  },
  {
    id: "v2",
    title: "আজকের বিশেষ প্রতিবেদন: অর্থনৈতিক সংকট ও সমাধানের পথ",
    thumbnail: "https://images.unsplash.com/photo-1513014576558-921f00d80b77?w=600&h=340&fit=crop&auto=format",
    duration: "২২:১৫",
    views: "১.৮ লাখ",
  },
  {
    id: "v3",
    title: "ক্রিকেট বিশ্বকাপের আগে দলের প্রস্তুতি কেমন?",
    thumbnail: "https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=600&h=340&fit=crop&auto=format",
    duration: "০৮:৪৫",
    views: "৯৬,৪০০",
  },
];

const TRENDING = [
  { rank: 1, title: "লোকসভা নির্বাচনে ভোটের তারিখ ঘোষণা", views: "৩.২ লাখ" },
  { rank: 2, title: "ভারত-পাকিস্তান ক্রিকেট ম্যাচের সময়সূচি", views: "২.৮ লাখ" },
  { rank: 3, title: "পেট্রোল-ডিজেলের দাম কমল, নতুন রেট জানুন", views: "২.১ লাখ" },
  { rank: 4, title: "নতুন শিক্ষানীতি কার্যকর, কী বলছেন অভিভাবকরা?", views: "১.৭ লাখ" },
  { rank: 5, title: "বাংলা চলচ্চিত্রে নতুন ঢেউ, আসছে মেগা রিলিজ", views: "১.৪ লাখ" },
];

const PHOTOS = [
  {
    id: "p1",
    title: "কলকাতার রাস্তায় দুর্গাপূজার প্রস্তুতি শুরু",
    image: "https://images.unsplash.com/photo-1513014576558-921f00d80b77?w=500&h=350&fit=crop&auto=format",
    count: "২৪ ছবি",
  },
  {
    id: "p2",
    title: "টি২০ বিশ্বকাপের সেরা মুহূর্তগুলো",
    image: "https://images.unsplash.com/photo-1625401586060-f12be3d7cc57?w=500&h=350&fit=crop&auto=format",
    count: "৩৬ ছবি",
  },
  {
    id: "p3",
    title: "বন্যায় ক্ষতিগ্রস্ত পশ্চিমবঙ্গ — চোখের সামনে বিপর্যয়",
    image: "https://images.unsplash.com/photo-1720195343674-e20e1dcfadf5?w=500&h=350&fit=crop&auto=format",
    count: "১৮ ছবি",
  },
];

const CATEGORIES = [
  { slug: "west-bengal", label: "পশ্চিমবঙ্গ", icon: "🏛️", color: "#D71920", news: [
    { id: "wb1", title: "কলকাতা পুরসভার নতুন বাজেট ঘোষণা, উন্নয়নের বড় পরিকল্পনা" },
    { id: "wb2", title: "দার্জিলিং পর্যটনে নতুন রেকর্ড, বিদেশি পর্যটকের ঢল" },
    { id: "wb3", title: "পশ্চিমবঙ্গ সরকারের নতুন কর্মসংস্থান প্রকল্পে ৫ লাখ চাকরি" },
  ]},
  { slug: "politics", label: "রাজনীতি", icon: "⚖️", color: "#0B1F3A", news: [
    { id: "p1", title: "বিরোধী জোটে নতুন সংকট, মমতার সাথে বৈঠক বাতিল" },
    { id: "p2", title: "কংগ্রেসের নতুন সভাপতি নির্বাচন, তীব্র প্রতিযোগিতা" },
    { id: "p3", title: "রাজ্যসভায় নতুন বিল পাস, বিরোধীদের ওয়াকআউট" },
  ]},
  { slug: "sports", label: "খেলাধুলা", icon: "🏏", color: "#1B8A5A", news: [
    { id: "s1", title: "আইপিএল নিলামে রেকর্ড দামে বিক্রি হলেন ৫ ক্রিকেটার" },
    { id: "s2", title: "পূর্ব বাংলা ক্লাব ফুটবল লিগ শিরোপা জিতল" },
    { id: "s3", title: "নীরজ চোপড়ার বিশ্ব রেকর্ড, ভারত উৎসবে মাতোয়ারা" },
  ]},
  { slug: "business", label: "ব্যবসা", icon: "💹", color: "#F4B400", news: [
    { id: "b1", title: "সেনসেক্স ৮০,০০০ পার করল, বিনিয়োগকারীরা উৎফুল্ল" },
    { id: "b2", title: "টাটার নতুন বৈদ্যুতিক গাড়ি বাজারে আসছে, দাম মাত্র ৮ লাখ" },
    { id: "b3", title: "রপ্তানিতে নতুন রেকর্ড, ডলারের বিপরীতে টাকা শক্তিশালী" },
  ]},
];

const EDITORS_PICKS = [
  { id: "e1", title: "বাংলার ইতিহাসে মহাত্মা গান্ধীর প্রভাব — একটি বিশেষ পর্যালোচনা", category: "বিশেষ প্রতিবেদন", readTime: "৮ মিনিট" },
  { id: "e2", title: "জলবায়ু পরিবর্তনে ক্ষতিগ্রস্ত সুন্দরবন — বাঘের ভবিষ্যৎ কী?", category: "পরিবেশ", readTime: "১২ মিনিট" },
  { id: "e3", title: "ডিজিটাল ইন্ডিয়া: গ্রামে গ্রামে পৌঁছাচ্ছে ইন্টারনেট", category: "প্রযুক্তি", readTime: "৬ মিনিট" },
];

function NewsCard({ story }: { story: typeof TOP_STORIES[0] }) {
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

function SectionHeader({ title, catSlug, icon }: { title: string; catSlug?: string; icon?: React.ReactNode }) {
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
      {catSlug && (
        <Link
          to={`/category/${catSlug}`}
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

export function HomePage() {
  const [activeTab, setActiveTab] = useState("সব সংবাদ");
  const tabs = ["সব সংবাদ", "কলকাতা", "রাজনীতি", "খেলাধুলা", "বিনোদন"];

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Hero */}
          <div className="lg:col-span-2">
            {HERO_NEWS.map(item => (
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
                    <span className="flex items-center gap-1"><Eye size={12} />{item.views} পাঠক</span>
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
            <div className="flex items-center gap-2 mb-1">
              <FlameKindling size={18} className="text-red-600" />
              <h2 style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 700, fontSize: "1.1rem" }} className="dark:text-white">
                শীর্ষ সংবাদ
              </h2>
            </div>
            {TOP_STORIES.map((story, i) => (
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
                <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                        activeTab === tab
                          ? "bg-red-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-0 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
                {LATEST_NEWS.map((item, i) => (
                  <Link key={item.id} to={`/article/${item.id}`} className="group flex items-center gap-4 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="text-gray-300 dark:text-gray-600 font-bold text-lg w-6 text-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-1"
                        style={{ backgroundColor: item.catColor, fontFamily: "'Noto Sans Bengali', sans-serif" }}
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
                      <Clock size={10} /> {item.time}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Top Stories Grid */}
            <section className="mb-10">
              <SectionHeader title="প্রধান সংবাদ" catSlug="top" icon={<Star size={18} className="text-yellow-500" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {TOP_STORIES.map(story => (
                  <NewsCard key={story.id} story={story} />
                ))}
              </div>
            </section>

            {/* Category Sections */}
            {CATEGORIES.map(cat => (
              <section key={cat.slug} className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <h2
                      className="dark:text-white"
                      style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1.35rem", fontWeight: 700 }}
                    >
                      {cat.label}
                    </h2>
                    <div className="w-10 h-0.5 ml-1" style={{ backgroundColor: cat.color }} />
                  </div>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-1 text-sm transition-colors hover:opacity-80"
                    style={{ color: cat.color, fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    আরও দেখুন <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {cat.news.map((item, i) => (
                    <Link
                      key={item.id}
                      to={`/article/${item.id}`}
                      className="group flex items-start gap-3 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: cat.color }}
                      >
                        {i + 1}
                      </span>
                      <p
                        className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors leading-snug"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600, fontSize: "0.95rem" }}
                      >
                        {item.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            {/* Video Section */}
            <section className="mb-10">
              <SectionHeader title="ভিডিও সংবাদ" catSlug="videos" icon={<Monitor size={18} className="text-red-600" />} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {VIDEOS.map(video => (
                  <Link key={video.id} to={`/videos/${video.id}`} className="group relative rounded-xl overflow-hidden bg-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="relative aspect-video">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={20} className="text-white ml-1" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-900">
                      <p
                        className="text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        {video.title}
                      </p>
                      <span className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <Eye size={10} /> {video.views} দর্শক
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Photo Gallery */}
            <section className="mb-10">
              <SectionHeader title="ছবিতে সংবাদ" catSlug="photos" icon={<Camera size={18} className="text-yellow-500" />} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {PHOTOS.map(photo => (
                  <Link key={photo.id} to={`/photos/${photo.id}`} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-[4/3]">
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <span className="bg-yellow-400 text-gray-900 text-xs px-2 py-0.5 rounded-full font-bold mb-2 inline-block">
                        <Camera size={10} className="inline mr-1" />{photo.count}
                      </span>
                      <p
                        className="text-white line-clamp-2 leading-snug"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        {photo.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Editor's Picks */}
            <section className="mb-10">
              <SectionHeader title="সম্পাদকের বাছাই" catSlug="editors-pick" icon={<BookOpen size={18} className="text-blue-600" />} />
              <div className="space-y-4">
                {EDITORS_PICKS.map(item => (
                  <Link key={item.id} to={`/article/${item.id}`} className="group flex gap-4 bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-red-600">
                    <div className="flex-1">
                      <span
                        className="text-xs text-red-600 font-bold uppercase tracking-wider"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {item.category}
                      </span>
                      <h3
                        className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors mt-1 leading-snug"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 700, fontSize: "1rem" }}
                      >
                        {item.title}
                      </h3>
                      <span className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                        <Headphones size={11} /> {item.readTime} পড়ার সময়
                      </span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-red-600 transition-colors flex-shrink-0 mt-2" />
                  </Link>
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
                    placeholder="আপনার ইমেইল ঠিকানা"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300 outline-none focus:border-yellow-400 transition-colors text-sm"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  />
                  <button
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
                {TRENDING.map(item => (
                  <Link key={item.rank} to={`/article/t${item.rank}`} className="group flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full text-xs font-bold flex items-center justify-center">
                      {item.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        {item.title}
                      </p>
                      <span className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <Eye size={10} /> {item.views}
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

            {/* Weather */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-700 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }} className="font-bold">কলকাতার আবহাওয়া</h3>
                <span className="text-3xl">⛅</span>
              </div>
              <div className="text-4xl font-bold mb-1">২৮°C</div>
              <p className="text-blue-200 text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                আংশিক মেঘলা — আর্দ্রতা ৭৮%
              </p>
              <div className="flex justify-between mt-3 text-xs text-blue-200 border-t border-blue-400/40 pt-3">
                <span>বৃষ্টির সম্ভাবনা: ৬৫%</span>
                <span>বায়ু: ১২ কিমি/ঘ</span>
              </div>
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
