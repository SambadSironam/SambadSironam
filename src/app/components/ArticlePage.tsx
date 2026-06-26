import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  Eye,
  Share2,
  Bookmark,
  Heart,
  ChevronRight,
  Link2,
  Minus,
  Plus,
  Headphones,
  MessageSquare,
  ThumbsUp,
  User,
  ChevronUp
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube
} from "react-icons/fa6";

const ARTICLE_DATA = {
  id: "1",
  category: "ব্রেকিং নিউজ",
  catColor: "#D71920",
  catSlug: "breaking",
  title: "পশ্চিমবঙ্গে ঐতিহাসিক বন্যা পরিস্থিতি, লক্ষাধিক মানুষ বাস্তুচ্যুত",
  subtitle: "রাজ্যের ১২টি জেলায় জরুরি অবস্থা জারি, সেনাবাহিনী উদ্ধার কাজে নামল। বিভিন্ন নদীর জলস্তর বিপদসীমার উপরে।",
  heroImage: "https://images.unsplash.com/photo-1580060092295-dbe639fffda3?w=1200&h=700&fit=crop&auto=format",
  author: { name: "সৌম্যদীপ চট্টোপাধ্যায়", avatar: "", role: "সিনিয়র সংবাদদাতা" },
  publishedAt: "১৩ জুন ২০২৬, বিকেল ৩:৪৫",
  updatedAt: "১৩ জুন ২০২৬, সন্ধ্যা ৬:০০",
  readTime: "৮ মিনিট",
  views: "১,২৩,৪৫৬",
  tags: ["বন্যা", "পশ্চিমবঙ্গ", "ত্রাণ", "সেনাবাহিনী", "দুর্যোগ"],
  content: [
    {
      type: "paragraph",
      text: "পশ্চিমবঙ্গের বিভিন্ন জেলায় অবিরাম বৃষ্টিপাতের কারণে ভয়াবহ বন্যা পরিস্থিতি তৈরি হয়েছে। রাজ্যের ১২টি জেলায় জরুরি অবস্থা জারি করা হয়েছে এবং সেনাবাহিনীকে উদ্ধার কাজে নামানো হয়েছে। প্রায় ১৫ লাখ মানুষ গৃহহীন হয়ে পড়েছেন।",
    },
    {
      type: "paragraph",
      text: "মুর্শিদাবাদ, মালদা, নদিয়া, বর্ধমান সহ ১২টি জেলায় বন্যার জল ছড়িয়ে পড়েছে। গঙ্গা, পদ্মা, তিস্তা, ময়ূরাক্ষী সহ বিভিন্ন নদীর জলস্তর বিপদসীমার উপরে রয়েছে। আবহাওয়া দফতর আগামী ৪৮ ঘণ্টা ভারী বৃষ্টিপাতের পূর্বাভাস দিয়েছে।",
    },
    {
      type: "pullquote",
      text: "\"পরিস্থিতি অত্যন্ত গুরুতর। আমরা সর্বাত্মক চেষ্টা করছি যাতে কোনো প্রাণহানি না হয়।\" — মুখ্যমন্ত্রী",
    },
    {
      type: "paragraph",
      text: "রাজ্য সরকার ইতিমধ্যে ৫০০টি ত্রাণ শিবির খুলেছে এবং সেখানে প্রায় ৩ লাখ মানুষকে আশ্রয় দেওয়া হয়েছে। জাতীয় দুর্যোগ মোকাবেলা বাহিনী (এনডিআরএফ) এবং রাজ্য দুর্যোগ মোকাবেলা বাহিনীর (এসডিআরএফ) ৩০টিরও বেশি দল উদ্ধার কাজে নিয়োজিত রয়েছে।",
    },
    {
      type: "paragraph",
      text: "কৃষিক্ষেত্রেও ব্যাপক ক্ষতি হয়েছে। প্রায় ২ লাখ হেক্টর জমির ফসল জলের নিচে ডুবে গেছে। কৃষি বিশেষজ্ঞরা বলছেন, এই ক্ষতি সামলাতে কৃষকদের বছরের পর বছর লাগবে।",
    },
    {
      type: "paragraph",
      text: "কেন্দ্র সরকার ইতিমধ্যে রাজ্যকে ৫০০ কোটি টাকার জরুরি সাহায্য দেওয়ার প্রতিশ্রুতি দিয়েছে। প্রধানমন্ত্রী পরিস্থিতি পর্যালোচনার জন্য উচ্চ পর্যায়ের বৈঠক ডেকেছেন।",
    },
  ],
};

const RELATED_ARTICLES = [
  { id: "r1", title: "ত্রাণ শিবিরে মানুষের ঢল, প্রশাসনের বিরুদ্ধে অভিযোগ", category: "পশ্চিমবঙ্গ", image: "https://images.unsplash.com/photo-1513014576558-921f00d80b77?w=300&h=200&fit=crop&auto=format", time: "২ ঘণ্টা আগে" },
  { id: "r2", title: "বন্যা পরিস্থিতিতে বিদ্যুৎ সংযোগ বিচ্ছিন্ন, অন্ধকারে হাজারো পরিবার", category: "পশ্চিমবঙ্গ", image: "https://images.unsplash.com/photo-1624858020896-4a558c5d7042?w=300&h=200&fit=crop&auto=format", time: "৩ ঘণ্টা আগে" },
  { id: "r3", title: "বন্যা কবলিত এলাকায় স্বাস্থ্য সমস্যা, ডায়রিয়ার প্রকোপ বাড়ছে", category: "স্বাস্থ্য", image: "https://images.unsplash.com/photo-1720195343674-e20e1dcfadf5?w=300&h=200&fit=crop&auto=format", time: "৪ ঘণ্টা আগে" },
];

const COMMENTS = [
  { id: "c1", author: "রাজীব সেন", time: "১ ঘণ্টা আগে", text: "সরকারকে আরও দ্রুত পদক্ষেপ নিতে হবে। বন্যায় ক্ষতিগ্রস্তদের জন্য যথেষ্ট ত্রাণ দেওয়া হচ্ছে না।", likes: 45 },
  { id: "c2", author: "সুমিতা দাস", time: "২ ঘণ্টা আগে", text: "এই পরিস্থিতিতে সকলের একতাবদ্ধ হওয়া উচিত। আমাদের যতটুকু পারি সাহায্য করতে হবে।", likes: 32 },
];

export function ArticlePage() {
  const { id } = useParams();
  const article = ARTICLE_DATA;
  const [fontSize, setFontSize] = useState(16);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(4821);
  const [commentText, setCommentText] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1440px] mx-auto px-4 py-2.5">
          <div className="flex items-center gap-1 text-xs text-gray-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            <Link to="/" className="hover:text-red-600 transition-colors">হোম</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${article.catSlug}`} className="hover:text-red-600 transition-colors">{article.category}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{article.title.slice(0, 40)}...</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          <article>
            {/* Article Header */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm mb-6">
              {/* Category & Meta */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="text-white text-xs px-3 py-1 rounded-full font-bold"
                    style={{ backgroundColor: article.catColor, fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  >
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-red-500 font-medium animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    লাইভ আপডেট
                  </span>
                </div>

                <h1
                  className="text-gray-900 dark:text-white mb-3 leading-snug"
                  style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800 }}
                >
                  {article.title}
                </h1>
                <p
                  className="text-gray-600 dark:text-gray-400 leading-relaxed"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif", fontSize: "1.05rem" }}
                >
                  {article.subtitle}
                </p>

                {/* Author & Meta */}
                <div className="flex flex-wrap items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <User size={18} className="text-red-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                        {article.author.name}
                      </div>
                      <div className="text-gray-400 text-xs">{article.author.role}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    <span className="flex items-center gap-1"><Clock size={11} /> {article.publishedAt}</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {article.views}</span>
                    <span className="flex items-center gap-1"><Headphones size={11} /> {article.readTime}</span>
                  </div>
                </div>

                {/* Font controls & actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">ফন্ট সাইজ:</span>
                    <button
                      onClick={() => setFontSize(s => Math.max(14, s - 1))}
                      className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm w-6 text-center text-gray-600 dark:text-gray-400">{fontSize}</span>
                    <button
                      onClick={() => setFontSize(s => Math.min(22, s + 1))}
                      className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSaved(!saved)}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all ${saved ? "border-red-600 text-red-600 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-600 hover:text-red-600"}`}
                    >
                      <Bookmark size={12} fill={saved ? "currentColor" : "none"} />
                      সেভ করুন
                    </button>
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-all">
                      <Share2 size={12} />
                      শেয়ার
                    </button>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "500px" }}
                />
                <p className="text-gray-400 text-xs text-center py-2 bg-gray-50 dark:bg-gray-800" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  ছবি: পশ্চিমবঙ্গের বন্যা কবলিত এলাকায় উদ্ধার কাজ চলছে
                </p>
              </div>

              {/* Article Body */}
              <div className="px-6 py-6">
                {article.content.map((block, i) => {
                  if (block.type === "paragraph") {
                    return (
                      <p
                        key={i}
                        className="text-gray-700 dark:text-gray-300 mb-5 leading-loose"
                        style={{
                          fontFamily: "'Noto Sans Bengali', sans-serif",
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === "pullquote") {
                    return (
                      <blockquote
                        key={i}
                        className="border-l-4 border-red-600 pl-5 my-8 italic text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/10 py-4 pr-4 rounded-r-xl"
                        style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: `${fontSize + 2}px` }}
                      >
                        {block.text}
                      </blockquote>
                    );
                  }
                  return null;
                })}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  {article.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/tag/${tag}`}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm px-3 py-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                {/* Updated at */}
                <p className="text-gray-400 text-xs mt-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  সর্বশেষ আপডেট: {article.updatedAt}
                </p>
              </div>

              {/* Social Share */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-gray-500 text-sm mb-3" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  সংবাদটি শেয়ার করুন:
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    <FaFacebookF size={15} /> ফেসবুক
                  </button>
                  <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-600 transition-colors">
                    <FaInstagram size={15} /> টুইটার
                  </button>
                  <button className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Link2 size={15} /> লিংক কপি
                  </button>
                  <div className="ml-auto flex items-center gap-3">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-red-600" : "text-gray-500 hover:text-red-600"}`}
                    >
                      <Heart size={16} fill={liked ? "currentColor" : "none"} />
                      <span style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{likeCount.toLocaleString("bn-IN")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-6">
              <h3
                className="text-gray-900 dark:text-white mb-5 flex items-center gap-2"
                style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 700, fontSize: "1.2rem" }}
              >
                <MessageSquare size={20} className="text-red-600" />
                মন্তব্য করুন
              </h3>

              <div className="flex gap-3 mb-6">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="আপনার মতামত লিখুন..."
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none focus:border-red-400 transition-colors resize-none text-sm"
                    style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                      disabled={!commentText.trim()}
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      জমা দিন
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {COMMENTS.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-9 h-9 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0 flex items-center justify-center">
                      <User size={14} className="text-red-600" />
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                          {comment.author}
                        </span>
                        <span className="text-gray-400 text-xs">{comment.time}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                        {comment.text}
                      </p>
                      <button className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition-colors text-xs mt-2">
                        <ThumbsUp size={11} /> {comment.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
              <h3
                className="text-gray-900 dark:text-white mb-5"
                style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 700, fontSize: "1.2rem" }}
              >
                সম্পর্কিত সংবাদ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {RELATED_ARTICLES.map(rel => (
                  <Link key={rel.id} to={`/article/${rel.id}`} className="group">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2">
                      <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <span className="text-red-600 text-xs font-bold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                      {rel.category}
                    </span>
                    <p
                      className="text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mt-1"
                      style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600, fontSize: "0.875rem" }}
                    >
                      {rel.title}
                    </p>
                    <span className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                      <Clock size={10} /> {rel.time}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center py-12 text-gray-400 text-sm">
              বিজ্ঞাপন ৩০০×৬০০
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#0B1F3A] px-4 py-3">
                <h3 className="text-white font-bold" style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1rem" }}>
                  আরও পড়ুন
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {RELATED_ARTICLES.map(item => (
                  <Link key={item.id} to={`/article/${item.id}`} className="group flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <img src={item.image} alt={item.title} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                    <p
                      className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug text-sm"
                      style={{ fontFamily: "'Noto Serif Bengali', serif", fontWeight: 600 }}
                    >
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Share Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg md:hidden z-40">
        <div className="flex items-center justify-around px-4 py-3">
          <button onClick={handleLike} className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${liked ? "text-red-600" : "text-gray-500"}`}>
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
            <span style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>পছন্দ</span>
          </button>
          <button onClick={() => setSaved(!saved)} className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${saved ? "text-red-600" : "text-gray-500"}`}>
            <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
            <span style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>সেভ</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-xs text-gray-500">
            <Share2 size={20} />
            <span style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>শেয়ার</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-xs text-gray-500">
            <MessageSquare size={20} />
            <span style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>মন্তব্য</span>
          </button>
        </div>
      </div>
    </div>
  );
}
