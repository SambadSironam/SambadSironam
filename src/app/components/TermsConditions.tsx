import { useEffect } from "react";
import { FileText, Award, HelpCircle, CheckCircle } from "lucide-react";

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212] py-8">
      {/* Header Banner */}
      <section className="max-w-[1440px] mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-red-800 to-red-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-yellow-400 mb-3">
                <FileText size={20} />
                <span className="font-bold text-xs uppercase tracking-wider">ব্যবহারের নিয়মাবলী</span>
              </div>
              <h1
                className="text-3xl md:text-4xl font-extrabold"
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              >
                ব্যবহারের শর্তাবলী (Terms & Conditions)
              </h1>
              <p
                className="mt-3 text-red-100 text-sm md:text-base max-w-2xl"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              >
                সংবাদ শিরোনাম (Sambad Sironam) নিউজ পোর্টাল, মোবাইল অ্যাপ এবং অন্যান্য ডিজিটাল প্ল্যাটফর্ম ব্যবহারের আইনি চুক্তি ও নিয়মাবলী।
              </p>
            </div>
            <div className="text-xs text-red-200 md:text-right" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div>সর্বশেষ আপডেট: জুলাই ২০২৬</div>
              <div>আইনি এক্তিয়ার: পশ্চিমবঙ্গ, ভারত</div>
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
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              ১. শর্তাবলীর গ্রহণযোগ্যতা
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              এই ওয়েবসাইট, অ্যাপ বা ই-পেপার ব্যবহার করে আপনি আমাদের শর্তাবলীতে পূর্ণ সম্মতি জানাচ্ছেন। আপনি যদি এই শর্তাবলীতে একমত না হন, তবে অনুগ্রহ করে আমাদের পরিষেবা গ্রহণ করা থেকে বিরত থাকুন। এই নীতি ও নির্দেশাবলী ভারতের সমস্ত ডিজিটাল তথ্য ও সম্প্রচার আইন অনুযায়ী বলবৎ থাকবে।
            </p>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              ২. ডিজিটাল সংবাদ আচরণবিধি (Code of Ethics)
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              সংবাদ শিরোনাম (Sambad Sironam) ভারতের তথ্যপ্রযুক্তি সংশোধিত বিধিমালা ২০২১ এর পার্ট-৩ (Part III of IT Rules 2021) মেনে চলে। আমরা নিচের আইনি কোড অনুসরণ করি:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              <li><strong>সাংবাদিকতার আদর্শ নীতি:</strong> প্রেস কাউন্সিল অফ ইন্ডিয়া (PCI) এর সাংবাদিকতার নীতি নির্দেশাবলী মেনে চলা।</li>
              <li><strong>সম্প্রচার আইন:</strong> কেবল টেলিভিশন নেটওয়ার্ক রেগুলেশন অ্যাক্ট ১৯৯৫ অনুযায়ী নীতি লঙ্ঘন না করা।</li>
              <li><strong>সততা ও সত্যতা:</strong> কোনো ধরনের ভুয়ো সংবাদ, সাম্প্রদায়িক উস্কানিমূলক তথ্য বা অশালীন কন্টেন্ট প্রকাশ থেকে বিরত থাকা।</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              ৩. মেধা সম্পত্তি ও কন্টেন্ট ব্যবহার (Copyright)
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              এই পোর্টালে প্রকাশিত সমস্ত লেখা, ছবি, ভিডিও, লোগো এবং গ্রাফিক্স <strong>সংবাদ শিরোনাম</strong>-এর নিজস্ব সম্পত্তি। আমাদের লিখিত অনুমতি ছাড়া কোনো কন্টেন্ট বা ই-পেপার বাণিজ্যিক উদ্দেশ্যে অন্য কোথাও প্রকাশ বা ব্যবহার করা সম্পূর্ণ আইনত দণ্ডনীয় অপরাধ।
            </p>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              ৪. ব্যবহারকারীদের দায়বদ্ধতা (User Conduct)
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              আমাদের আর্টিকেলে বা কমেন্ট সেকশনে মন্তব্য করার ক্ষেত্রে ব্যবহারকারীদের নিচের নিয়মগুলো মেনে চলতে হবে:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              <li>কোনো ধরনের আপত্তিকর, অশালীন, মানহানিকর বা বেআইনি মন্তব্য করা যাবে না।</li>
              <li>ধর্মীয়, রাজনৈতিক বা জাতিগত বিদ্বেষ ছড়ায় এমন কোনো উস্কানিমূলক কথা বলা যাবে না।</li>
              <li>আমরা কোনো নোটিশ ছাড়াই যেকোনো ব্যবহারকারীর কমেন্ট মুছে ফেলা বা তাদের ব্লক করার সম্পূর্ণ অধিকার রাখি।</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              ৫. দায় অস্বীকার (Disclaimer)
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              আমরা সংবাদের সত্যতা ও নিরপেক্ষতা বজায় রাখার আপ্রাণ চেষ্টা করি। তবে পোর্টালে প্রকাশিত বিভিন্ন বিশেষজ্ঞের ব্যক্তিগত কলাম বা মতামতের দায় সংবাদ শিরোনামের সম্পাদকের নয়। এছাড়াও বিজ্ঞাপনের বিষয়বস্তুর দায় সংশ্লিষ্ট বিজ্ঞাপনদাতার।
            </p>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              ৬. আইন ও বিচারবিভাগীয় এক্তিয়ার (Jurisdiction)
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              সংবাদ শিরোনাম পোর্টালের যেকোনো পরিষেবার আইনি বিরোধ নিষ্পত্তি হবে ভারতের আইন অনুযায়ী। সমস্ত আইনি অভিযোগ এবং কার্যধারা শ্রীরামপুর আদালত (Serampore Court) অথবা কলকাতা হাইকোর্ট (Calcutta High Court), পশ্চিমবঙ্গ, ভারতের বিচারবিভাগীয় এক্তিয়ারের অধীনে থাকবে।
            </p>
          </div>

          <div className="space-y-4">
            <h2
              className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            >
              <span className="w-2 h-6 bg-blue-600 rounded-full" />
              ৭. যোগাযোগ
            </h2>
            <p className="leading-8 text-sm md:text-base" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              আমাদের ব্যবহারের শর্তাবলী নিয়ে আপনার কোনো জিজ্ঞাসা থাকলে যোগাযোগ করতে পারেন:
              <br />
              ইমেইল: <a href="mailto:contact@sambadsironam.com" className="text-red-600 font-semibold hover:underline">contact@sambadsironam.com</a>
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
