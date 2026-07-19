import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import logoImg from "../../imports/logo.png";
import { CheckCircle2, AlertTriangle, ShieldCheck, Calendar, Phone, Mail, Award } from "lucide-react";

export default function VerifyID() {
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get("id");
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Keep a ticking security timestamp to prevent static image forging
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("bn-BD", { timeZone: "Asia/Kolkata" }) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWorker = async () => {
      if (!workerId) {
        setLoading(false);
        return;
      }
      try {
        const safeId = workerId.replace(/\//g, "_");
        const docRef = doc(db, "workers", safeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWorker({ id: data.id || docSnap.id, ...data });
        }
      } catch (err) {
        console.error("Error fetching worker details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [workerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-lg font-semibold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          আইডি কার্ড যাচাই করা হচ্ছে...
        </p>
      </div>
    );
  }

  if (!workerId || !worker) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-950/20 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
          <AlertTriangle className="mx-auto text-red-500 mb-6 animate-bounce" size={64} />
          <h2
            className="text-2xl font-bold text-red-400 mb-4"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            অবৈধ আইডি কার্ড!
          </h2>
          <p
            className="text-gray-300 leading-relaxed mb-6"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            এই আইডি কার্ডটি আমাদের সিস্টেমে খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক QR কোডটি স্ক্যান করুন অথবা প্রশাসনিক বিভাগে যোগাযোগ করুন।
          </p>
          <div className="text-xs text-gray-500 border-t border-red-500/10 pt-4">
            কোড: {workerId || "অনুপস্থিত"}
          </div>
        </div>
      </div>
    );
  }

  const isActive = worker.status === "Active";
  const isSuspended = worker.status === "Suspended";

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full">
        {/* Card Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <img src={logoImg} alt="Logo" className="h-16 w-16 object-contain rounded-2xl shadow-lg mb-2" />
          <h1
            className="text-2xl font-bold text-white tracking-wide"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            সংবাদ শিরোনাম
          </h1>
          <p className="text-xs text-red-500 uppercase tracking-widest font-bold">
            Official Identification System
          </p>
        </div>

        {/* Security Box Container */}
        <div
          className={`bg-slate-900/80 border ${
            isActive ? "border-emerald-500/40 shadow-emerald-950/30" : "border-red-500/40 shadow-red-950/30"
          } rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-2xl`}
        >
          {/* Top Status Header */}
          <div
            className={`py-4 px-6 text-center flex items-center justify-center gap-2 font-bold text-sm ${
              isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            }`}
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            {isActive ? (
              <>
                <CheckCircle2 size={18} className="animate-pulse" />
                অনুমোদিত প্রতিনিধি (AUTHORIZED STAFF)
              </>
            ) : isSuspended ? (
              <>
                <AlertTriangle size={18} />
                স্থগিত প্রতিনিধি (SUSPENDED STAFF)
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                অকার্যকর প্রতিনিধি (INACTIVE STAFF)
              </>
            )}
          </div>

          {/* Body Section - Displays the exact ID card image in full size */}
          <div className="p-4 flex flex-col items-center justify-center bg-slate-950">
            {worker.photo ? (
              <img
                src={worker.photo}
                alt="Official ID Card"
                className="w-full h-auto object-contain rounded-2xl shadow-lg border border-slate-800"
                style={{ maxHeight: "75vh" }}
              />
            ) : (
              <div className="py-12 text-gray-500 font-semibold">
                আইডি কার্ডের ছবি খুঁজে পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>

        {/* Footer warning */}
        <p className="text-center text-xs text-gray-600 mt-6 px-4">
          This is an official digital verification page of Sambad Sironam. Unauthorized replication or use of this identity information constitutes a legal offense.
        </p>
      </div>
    </div>
  );
}
