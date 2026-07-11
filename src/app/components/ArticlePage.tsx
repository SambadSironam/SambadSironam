import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase";
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

export function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const loadArticle = async () => {
    if (!id) return;

    try {
      const docRef = doc(db, "news", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
  views: increment(1),
});
        setArticle({
          id: docSnap.id,
          ...docSnap.data(),
        });
        const relatedSnapshot = await getDocs(collection(db, "news"));

const related = relatedSnapshot.docs
  .map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((item: any) => item.id !== id)
  .slice(0, 6);

setRelatedNews(related);
      } else {
        console.log("Article not found");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadArticle();
}, [id]);
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
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

if (!article) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Article not found.
    </div>
  );
}
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1440px] mx-auto px-4 py-2.5">
          <div className="flex items-center gap-1 text-xs text-gray-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            <Link to="/" className="hover:text-red-600 transition-colors">হোম</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${article.category}`} className="hover:text-red-600 transition-colors">{article.category}</Link>
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
                    style={{ backgroundColor: "#D71920" }}
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
                  {article.description}
                </p>

                {/* Author & Meta */}
                <div className="flex flex-wrap items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <User size={18} className="text-red-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200 text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                        {article.author}
                      </div>
                      <div className="text-gray-400 text-xs">স্টাফ রিপোর্টার</div>
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
                  src={article.image}
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
                <p
  className="text-gray-700 dark:text-gray-300 leading-loose whitespace-pre-wrap"
  style={{
    fontFamily: "'Noto Sans Bengali', sans-serif",
    fontSize: `${fontSize}px`,
  }}
>
  {article.content}
</p>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  {article.category && (
  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
    <span
      className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
    >
      #{article.category}
    </span>
  </div>
)}
                </div>

                {/* Updated at */}
                <p className="text-gray-400 text-xs mt-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  সর্বশেষ আপডেট: {getTimeAgo(article.createdAt)}
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
                  <button className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600 transition-colors">
                    <FaInstagram size={15} /> ইন্সটাগ্রাম
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

              {/* Comments will be loaded from Firestore when available */}
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
                {relatedNews.map((rel: any) => (
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
                      <Clock size={10} /> Just now
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
                {relatedNews.map((item: any) => (
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
