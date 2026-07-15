import { useEffect } from "react";
import { Shield, Mail, FileText, Scale } from "lucide-react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] py-8">
      {/* Header Banner */}
      <section className="max-w-[1440px] mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-yellow-400 mb-3">
                <Shield size={20} />
                <span className="font-bold text-xs uppercase tracking-wider">আইনি নীতি ও নির্দেশিকা</span>
              </div>
              <h1
                className="text-3xl md:text-4xl font-extrabold"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                গোপনীয়তা নীতি (Privacy Policy)
              </h1>
              <p
                className="mt-3 text-blue-200 text-sm md:text-base max-w-2xl"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                তথ্যপ্রযুক্তি আইন (IT Rules 2021) অনুযায়ী সংবাদ শিরোনাম (Sambad Sironam) এর পাঠক এবং ব্যবহারকারীদের ব্যক্তিগত তথ্যের সুরক্ষার বিশদ বিবরণ।
              </p>
            </div>
            <div className="text-xs text-blue-300 md:text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div>সর্বশেষ আপডেট: জুলাই ২০২৬</div>
              <div>সংস্করণ: ১.২ (ডিজিটাল মিডিয়া কোড)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8 text-gray-700 dark:text-gray-300">
          
          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-red-600 rounded-full" />
              ১. ভূমিকা ও তথ্যের সুরক্ষা
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              <strong>সংবাদ শিরোনাম (Sambad Sironam)</strong> এ আপনাকে স্বাগত জানাই। আমরা আমাদের সকল পাঠক ও ব্যবহারকারীর গোপনীয়তা বজায় রাখতে এবং ব্যক্তিগত তথ্য সুরক্ষিত রাখতে অঙ্গীকারবদ্ধ। ভারতের তথ্যপ্রযুক্তি আইন, ২০০০ এবং তথ্যপ্রযুক্তি (মধ্যস্থতাকারী নির্দেশিকা এবং ডিজিটাল মিডিয়া নীতিশাস্ত্র কোড) নিয়মাবলী, ২০২১ (Information Technology Rules, 2021) মেনে এই গোপনীয়তা নীতি তৈরি করা হয়েছে।
            </p>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-red-600 rounded-full" />
              ২. আমরা কী কী তথ্য সংগ্রহ করি
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              আমাদের পোর্টাল ব্যবহারের সময় আমরা নিম্নলিখিত তথ্যসমূহ সংগ্রহ করতে পারি:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              <li><strong>ব্যক্তিগত তথ্য:</strong> আপনি যখন আমাদের নিউজলেটার সাবস্ক্রাইব করেন বা মতামত প্রকাশ করেন, তখন আপনার নাম ও ইমেইল ঠিকানা।</li>
              <li><strong>ডিভাইস ও ব্রাউজার তথ্য:</strong> আইপি (IP) ঠিকানা, ব্রাউজারের ধরণ, অপারেটিং সিস্টেম এবং যে পৃষ্ঠাটি আপনি ভিজিট করছেন তার বিবরণ।</li>
              <li><strong>কুকিজ (Cookies):</strong> আপনার অভিজ্ঞতা উন্নত করতে এবং প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শনের জন্য কুকিজ ব্যবহার করা হয়।</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-red-600 rounded-full" />
              ৩. সংগৃহীত তথ্যের ব্যবহার
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              আপনার থেকে সংগৃহীত তথ্য আমরা নিম্নরূপভাবে ব্যবহার করি:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              <li>পোর্টালের কন্টেন্ট বা সংবাদ সেবার মান উন্নত করতে।</li>
              <li>আমাদের অ্যাপ ও ই-পেপার পরিষেবার ব্যবহার সহজতর করতে।</li>
              <li>পাঠকদের চাহিদা অনুযায়ী প্রাসঙ্গিক ও নিরপেক্ষ সংবাদ পরিবেশন করতে।</li>
              <li>আইনি বাধ্যবাধকতা এবং ভারতের তথ্য সম্প্রচার বিধিমালা মেনে চলতে।</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-red-600 rounded-full" />
              ৪. বিজ্ঞাপন ও থার্ড-পার্টি সার্ভিস
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              আমাদের ওয়েবসাইটে গুগল অ্যাডসেন্স (Google AdSense) বা অন্যান্য থার্ড-পার্টি বিজ্ঞাপন নেটওয়ার্ক বিজ্ঞাপন প্রদর্শন করতে পারে। এই বিজ্ঞাপনদাতারা আপনার ব্রাউজিং রুচি অনুযায়ী বিজ্ঞাপন পরিবেশনের জন্য ডাবলক্লিক ডার্ট কুকি (DART cookie) ব্যবহার করতে পারে। পাঠক চাইলে গুগলের বিজ্ঞাপন ও কন্টেন্ট নেটওয়ার্কের গোপনীয়তা নীতি দেখে কুকি নিষ্ক্রিয় করতে পারেন।
            </p>
          </div>

          {/* Grievance Box (Grievance Redressal Mechanism under IT Rules 2021) */}
          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Scale size={24} />
              <h3
                className="text-lg md:text-xl font-bold"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                ৫. অভিযোগ নিরসন কর্মকর্তা (Grievance Officer)
              </h3>
            </div>
            <p className="text-sm md:text-base leading-7" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              তথ্যপ্রযুক্তি আইন, ২০২১ (IT Rules 2021) এর বিধি ১৮ ধারা অনুযায়ী, ডিজিটাল নিউজ পোর্টাল সংক্রান্ত যেকোনো অভিযোগ বা আপত্তির দ্রুত সমাধানের জন্য আমরা একজন অভিযোগ নিরসন কর্মকর্তা নিযুক্ত করেছি। যেকোনো অভিযোগের ক্ষেত্রে অনুগ্রহ করে নিচের ঠিকানায় যোগাযোগ করুন:
            </p>
            <div className="grid grid-cols-1 gap-4 pt-2 text-xs md:text-sm">
              <div className="space-y-2 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
                <div className="text-gray-400 uppercase tracking-wider text-[10px]">যোগাযোগ ও অভিযোগ জানানোর মাধ্যম</div>
                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 text-sm md:text-base">
                  <Mail size={16} className="text-red-500" />
                  <span>contact@sambadsironam.com</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">ফোন: +91-8900568880</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              * অভিযোগ পাওয়ার ২৪ ঘণ্টার মধ্যে আমরা অভিযোগ স্বীকার করব এবং আইন অনুযায়ী ১৫ দিনের মধ্যে তার সুরাহা করা হবে।
            </p>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-red-600 rounded-full" />
              ৬. গোপনীয়তা নীতির পরিবর্তন
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              সংবাদ শিরোনাম কর্তৃপক্ষ যেকোনো সময় এই গোপনীয়তা নীতি সংশোধন বা পরিবর্তন করার অধিকার সংরক্ষণ করে। যেকোনো বড় ধরনের পরিবর্তন এই পৃষ্ঠায় নোটিশের মাধ্যমে জানানো হবে। এই নীতিমালায় কোনো পরিবর্তনের পর পোর্টালের ব্যবহার বজায় রাখলে তা আপনার পরিবর্তিত নীতির সম্মতি হিসেবে গণ্য হবে।
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
