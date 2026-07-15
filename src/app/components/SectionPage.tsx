import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ArrowLeft, Eye, ChevronRight } from "lucide-react";
import { db } from "../../firebase";

const SECTION_META: Record<string, { title: string; description: string; color: string }> = {
  "latest-news": {
    title: "সর্বশেষ সংবাদ",
    description: "সাম্প্রতিক সব খবর একসাথে দেখুন",
    color: "#D71920",
  },
  "top-stories": {
    title: "শীর্ষ সংবাদ",
    description: "সব শীর্ষ সংবাদ একসাথে দেখুন",
    color: "#0B1F3A",
  },
  "photos": {
    title: "ছবিতে সংবাদ",
    description: "সংবাদের ফটো গ্যালারি",
    color: "#F4B400",
  },
  "main-stories": {
    title: "প্রধান সংবাদ",
    description: "সব প্রধান সংবাদ একসাথে দেখুন",
    color: "#ff0040",
  },
};

function getTimeAgo(timestamp: any) {
  if (!timestamp) return "";

  const date = typeof timestamp?.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
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

export default function SectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = SECTION_META[slug || "latest-news"] || SECTION_META["latest-news"];
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const allNews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const sortedNews = [...allNews].sort((a: any, b: any) => {
          if (slug === "top-stories") {
            const aViews = Number(a.views) || 0;
            const bViews = Number(b.views) || 0;
            if (bViews !== aViews) return bViews - aViews;
          }

          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return bTime - aTime;
        });

        setArticles(sortedNews);
      } catch (error) {
        console.error("Failed to load section articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">
      <section className="text-white py-8" style={{ backgroundColor: meta.color }}>
        <div className="max-w-[1440px] mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} /> 
            হোমে ফিরুন
          </Link>
          <h1
            className="text-white"
            style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800 }}
          >
            {meta.title}
          </h1>
          <p className="text-white/80 mt-2" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            {meta.description}
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {loading ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 text-center text-gray-500 dark:text-gray-400">
            লোড হচ্ছে...
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 p-8 text-center text-gray-500 dark:text-gray-400">
            কোন সংবাদ পাওয়া যায়নি
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((item, index) => (
              <Link
                key={item.id}
                to={`/article/${item.id}`}
                className="group flex flex-col sm:flex-row items-start gap-4 rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex-shrink-0 w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
                      ছবি নেই
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {item.category || "নিউজ"}
                    </span>
                    <span className="text-xs text-gray-400">
                      #{index + 1}
                    </span>
                  </div>
                  <h2
                    className="text-gray-900 dark:text-gray-100 group-hover:text-red-600 transition-colors"
                    style={{ fontFamily: "'Noto Serif Bengali', serif", fontSize: "1rem", fontWeight: 700 }}
                  >
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    {item.subtitle || item.description || "আরও পড়ুন"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {item.views || 0} Views
                    </span>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-1 text-sm text-red-600">
                  পড়ুন <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
