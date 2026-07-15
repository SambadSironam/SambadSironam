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
        const docRef = doc(db, "workers", workerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWorker({ id: docSnap.id, ...docSnap.data() });
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden selectable">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)]"></div>
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

          {/* Body Section */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 ${
                    isActive ? "border-emerald-500" : "border-red-500"
                  } shadow-lg bg-slate-800`}
                >
                  {worker.photo ? (
                    <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>

              {/* General Details */}
              <div className="flex-1 text-center md:text-left min-w-0">
                <h2
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                >
                  {worker.name}
                </h2>
                <p
                  className="text-yellow-400 font-semibold text-base mb-3 flex items-center justify-center md:justify-start gap-1"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  <Award size={16} />
                  {worker.designation}
                </p>

                <div
                  className="space-y-2 text-sm text-gray-300"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-gray-500">আইডি নং:</span>
                    <span className="font-bold text-white">{worker.id}</span>
                  </div>
                  {worker.bloodGroup && (
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-gray-500">রক্তের গ্রুপ:</span>
                      <span className="text-red-400 font-bold">{worker.bloodGroup}</span>
                    </div>
                  )}
                  {worker.validUntil && (
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-500">মেয়াদ শেষ:</span>
                      <span className="font-semibold text-white">{worker.validUntil}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Extra Info Grid */}
            <div
              className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              {worker.phone && (
                <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                  <Phone size={14} className="text-blue-400" />
                  <div>
                    <div className="text-[10px] text-gray-600">ফোন নম্বর</div>
                    <div className="text-white font-medium">{worker.phone}</div>
                  </div>
                </div>
              )}
              {worker.email && (
                <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                  <Mail size={14} className="text-emerald-400" />
                  <div>
                    <div className="text-[10px] text-gray-600">ইমেইল</div>
                    <div className="text-white font-medium truncate">{worker.email}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Security Stamp */}
            <div className="mt-6 bg-slate-950 border border-slate-800/60 rounded-xl p-3.5 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">
                Security Digital Signature
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold tracking-wider">
                {currentTime}
              </div>
              <div className="text-[9px] text-slate-600 mt-1">
                Generated dynamically. Valid for immediate field checks.
              </div>
            </div>
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
