import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f3] dark:bg-[#111827]">

      {/* Hero */}

      <section className="bg-gradient-to-r from-[#001f5c] via-[#0b2d84] to-[#001f5c] text-white py-20">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold mb-4">
            যোগাযোগ করুন
          </h1>

          <p className="text-blue-100 text-lg max-w-3xl mx-auto">
            সংবাদ, বিজ্ঞাপন, অভিযোগ অথবা যেকোনো তথ্যের জন্য আমাদের সঙ্গে যোগাযোগ করুন।
          </p>

        </div>

      </section>



      {/* Contact Cards */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center hover:scale-105 transition">

            <Mail className="mx-auto text-red-600 mb-5" size={40} />

            <h3 className="text-2xl font-bold mb-3">
              ইমেইল
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-5">
              contact@sambadsironam.com
            </p>

            <a
              href="mailto:contact@sambadsironam.com"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
            >
              <Send size={18} />
              Email Us
            </a>

          </div>



          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center hover:scale-105 transition">

            <Phone className="mx-auto text-green-600 mb-5" size={40} />

            <h3 className="text-2xl font-bold mb-3">
              ফোন
            </h3>

            <p className="mb-2">
              +91-8900568880
            </p>

            <p className="mb-5">
              +91-3345299592
            </p>

            <a
              href="tel:+918900568880"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full inline-block"
            >
              Call Now
            </a>

          </div>



          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center hover:scale-105 transition">

            <MapPin className="mx-auto text-blue-600 mb-5" size={40} />

            <h3 className="text-2xl font-bold mb-3">
              অফিস
            </h3>

            <p className="text-gray-600 dark:text-gray-400">

              ২০, সতীশ চন্দ্র ঘোষ লেন,<br/>

              মহেশ কলোনি,<br/>

              শ্রীরামপুর,<br/>

              হুগলি,<br/>

              পশ্চিমবঙ্গ – ৭১২২০১

            </p>

          </div>

        </div>

      </section>



      {/* Newsletter */}

      <section className="bg-[#001f5c] text-white py-20">

        <div className="max-w-3xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-4">

            নিউজলেটারে সাইন আপ করুন

          </h2>

          <p className="text-white-100 mb-8">

            প্রতিদিনের সেরা সংবাদ সরাসরি আপনার ইমেইলে পান

          </p>

          <div className="flex flex-col md:flex-row gap-4">

            <div className="mt-8 max-w-2xl mx-auto">
  <div className="flex flex-col sm:flex-row gap-4">

    <div className="relative flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 12H8m8-4H8m8 8H8"
        />
      </svg>

      <input
        type="email"
        placeholder="আপনার ইমেইল ঠিকানা লিখুন"
        className="
          w-full
          pl-12
          pr-4
          py-4
          rounded-xl
          bg-white
          text-gray-900
          border-2
          border-gray-300
          shadow-lg
          outline-none
          transition
          duration-300
          focus:border-red-600
          focus:ring-4
          focus:ring-red-100
          placeholder:text-gray-400
        "
      />
    </div>

    <button
      className="
        bg-red-600
        hover:bg-red-700
        text-white
        px-8
        py-4
        rounded-xl
        font-bold
        shadow-lg
        transition
        duration-300
        hover:scale-105
      "
    >
      📩 সাবস্ক্রাইব করুন
    </button>

  </div>
  <p className="text-sm text-gray-400 mt-3 text-center">
    আপনার ইমেইল কখনও তৃতীয় পক্ষের সাথে শেয়ার করা হবে না।
  </p>
</div>
</div>

        </div>

      </section>



      {/* Social */}

      <section className="py-16">

        <div className="text-center">

          <h2 className="text-3xl font-bold mb-8">

            Follow Sambad Sironam

          </h2>

          <div className="flex justify-center gap-6">

            <a
  href="https://facebook.com/sambadsironam"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full text-white transition"
>
  <FaFacebookF />
</a>

            <a
  href="https://instagram.com/sambadsironam"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-pink-600 hover:bg-pink-700 p-4 rounded-full text-white transition"
>
  <FaInstagram />
</a>

            <a
  href="https://youtube.com/@sambadsironamdigital"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-red-600 hover:bg-red-700 p-4 rounded-full text-white transition"
>
  <FaYoutube />
</a>

          </div>

        </div>

      </section>

    </div>
  );
}