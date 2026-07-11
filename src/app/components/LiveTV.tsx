import { ExternalLink } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
const CHANNEL_ID = "UCiV2_4B4Ut6-RqmtH27oUgQ";

export default function LiveTV() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-700 to-red-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-center gap-3">

            <div className="animate-pulse w-4 h-4 rounded-full bg-white" />

            <span className="bg-white text-red-700 px-3 py-1 rounded-full font-bold text-sm">
              LIVE
            </span>

            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              সংবাদ শিরোনাম LIVE TV
            </h1>

          </div>

          <p
            className="mt-4 text-red-100 text-lg"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            ২৪ ঘণ্টা লাইভ সংবাদ সম্প্রচার
          </p>

        </div>
      </section>

      {/* Video */}
      <section className="max-w-7xl mx-auto px-4 py-10">

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">

          <div className="aspect-video">

            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1`}
              title="Live TV"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

          </div>

          <div className="p-6">

            <h2
              className="text-3xl font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              সংবাদ শিরোনাম লাইভ
            </h2>

            <p
              className="mt-4 text-gray-600 dark:text-gray-300 leading-8"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              পশ্চিমবঙ্গ, ভারত এবং বিশ্বের সর্বশেষ সংবাদ,
              ব্রেকিং নিউজ, রাজনীতি, খেলা, বিনোদন,
              ব্যবসা এবং বিশেষ প্রতিবেদন লাইভ দেখুন।
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <a
                href={`https://www.youtube.com/channel/${CHANNEL_ID}/live`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                <FaYoutube size={20} />
                Watch on YouTube
              </a>

              <Link
                to="/"
                className="border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2"
              >
                <ExternalLink size={18} />
                Back to Homepage
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-7xl mx-auto px-4 pb-14">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <h3 className="text-xl font-bold mb-3">
              🔴 LIVE Updates
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              ২৪ ঘণ্টা লাইভ সংবাদ সম্প্রচার।
            </p>

          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <h3 className="text-xl font-bold mb-3">
              📰 Breaking News
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              সর্বশেষ ব্রেকিং নিউজ সঙ্গে সঙ্গে।
            </p>

          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow">

            <h3 className="text-xl font-bold mb-3">
              📺 HD Streaming
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              Full HD YouTube Live Streaming.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}