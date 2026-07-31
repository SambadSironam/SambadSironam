import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import logoImg from "../../imports/logo.png";
import { CheckCircle2, AlertTriangle, Car, ShieldAlert, Camera } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function VerifyCar() {
  const [searchParams] = useSearchParams();
  const carId = searchParams.get("id");
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        setLoading(false);
        return;
      }
      try {
        const safeId = carId.replace(/\//g, "_");
        const docRef = doc(db, "cars", safeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCar({ id: data.id || docSnap.id, ...data });
        }
      } catch (err) {
        console.error("Error fetching car details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (showScanner) {
      setScanError(null);
      // Wait a moment for container to render
      const timer = setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              // Successfully scanned
              try {
                if (scanner) {
                  scanner.clear().catch(console.error);
                }
              } catch (e) {
                console.error("Error clearing scanner", e);
              }
              setShowScanner(false);

              // Check if URL belongs to verify-id or verify-car
              try {
                const url = new URL(decodedText);
                if (url.pathname.includes("/verify-id") || url.pathname.includes("/verify-car")) {
                  navigate(url.pathname + url.search);
                } else {
                  setScanError("অপরিচিত কিউআর কোড। এটি সংবাদ শিরোনাম যাচাইকরণের কিউআর কোড নয়।");
                }
              } catch (err) {
                // If not a URL, check if it looks like an ID
                if (decodedText.startsWith("SS-")) {
                  navigate(`/verify-id?id=${encodeURIComponent(decodedText)}`);
                } else {
                  setScanError(`স্ক্যানকৃত কোড: ${decodedText}. সঠিক যাচাইকরণ লিংক স্ক্যান করুন।`);
                }
              }
            },
            (errorMessage) => {
              // Ignore standard scanning noise
            }
          );
        } catch (e: any) {
          console.error("Failed to initialize html5-qrcode scanner", e);
          setScanError("ক্যামেরা চালু করতে ব্যর্থ হয়েছে। অনুগ্রহ করে ক্যামেরার পারমিশন চেক করুন।");
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (scanner) {
          try {
            scanner.clear().catch(console.error);
          } catch (e) {
            console.error("Error clearing scanner in cleanup", e);
          }
        }
      };
    }
  }, [showScanner, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          গাড়ির তথ্য যাচাই করা হচ্ছে...
        </p>
      </div>
    );
  }

  // If scanner is open
  if (showScanner) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-20%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] h-[600px] w-[600px] rounded-full bg-red-500/10 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-md w-full flex flex-col items-center">
          <div className="flex flex-col items-center mb-6 text-center">
            <img src={logoImg} alt="Logo" className="h-14 w-14 object-contain rounded-2xl shadow-lg mb-2" />
            <h1 className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
              কিউআর কোড স্ক্যানার
            </h1>
            <p className="text-xs text-red-500 uppercase tracking-widest font-bold">
              Camera Verification System
            </p>
          </div>

          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center">
            <div id="qr-reader" className="w-full overflow-hidden rounded-2xl border border-slate-700 bg-black mb-4"></div>

            {scanError && (
              <div className="text-sm text-red-400 bg-red-950/20 border border-red-500/30 rounded-xl p-3 text-center w-full mb-4">
                {scanError}
              </div>
            )}

            <button
              onClick={() => setShowScanner(false)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition duration-300 font-semibold"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!carId || !car) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-950/20 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
          <ShieldAlert className="mx-auto text-red-500 mb-6 animate-bounce" size={64} />
          <h2
            className="text-2xl font-bold text-red-400 mb-4"
            style={{ fontFamily: "'Noto Serif Bengali', serif" }}
          >
            অননুমোদিত গাড়ি! (UNAUTHORIZED VEHICLE)
          </h2>
          <p
            className="text-gray-300 leading-relaxed mb-6"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            এই গাড়ির তথ্য বা অনুমোদন পত্রটি আমাদের সিস্টেমে খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক অনুমতিপত্রটি স্ক্যান করুন অথবা প্রশাসনিক বিভাগে যোগাযোগ করুন।
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition duration-300 font-semibold"
              style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
            >
              <Camera size={18} /> কিউআর স্ক্যান করুন (Scan QR)
            </button>
          </div>

          <div className="text-xs text-gray-500 border-t border-red-500/10 pt-4">
            গাড়ির নম্বর/আইডি: {carId || "অনুপস্থিত"}
          </div>
        </div>
      </div>
    );
  }

  const isActive = car.status === "Active";
  const isSuspended = car.status === "Suspended";

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
            Authorized Vehicle Directory
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
                অনুমোদিত গাড়ি (AUTHORIZED VEHICLE)
              </>
            ) : isSuspended ? (
              <>
                <AlertTriangle size={18} />
                স্থগিত গাড়ি (SUSPENDED VEHICLE)
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                অকার্যকর গাড়ি (INACTIVE VEHICLE)
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 border-b border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-red-500 border border-slate-700">
                <Car size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-wide text-white">{car.carNumber}</h3>
                <p className="text-sm text-gray-400" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  গাড়ির নম্বর (Car Number)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                <span className="text-gray-400 block text-xs mb-1">প্রতিনিধি/মালিক</span>
                <strong className="text-white text-base">{car.ownerName || "N/A"}</strong>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                <span className="text-gray-400 block text-xs mb-1">পদবী (Designation)</span>
                <strong className="text-white text-base">{car.designation || "N/A"}</strong>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                <span className="text-gray-400 block text-xs mb-1">ফোন নম্বর (Phone)</span>
                <strong className="text-white text-base">{car.phone || "N/A"}</strong>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                <span className="text-gray-400 block text-xs mb-1">মেয়াদ শেষ (Valid Until)</span>
                <strong className="text-white text-base">{car.validUntil || "N/A"}</strong>
              </div>
            </div>
          </div>

          {/* Scanner/Permit Image Display */}
          <div className="p-6 flex flex-col items-center justify-center bg-slate-950">
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              অনুমতিপত্র / স্ক্যানার কপি (Permit Sticker)
            </h4>
            {car.photo ? (
              <img
                src={car.photo}
                alt="Authorized Sticker/Permit"
                className="w-full h-auto object-contain rounded-2xl shadow-lg border border-slate-800"
                style={{ maxHeight: "40vh" }}
              />
            ) : (
              <div className="py-8 text-gray-500 font-semibold text-sm" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                অনুমতিপত্রের ছবি আপলোড করা হয়নি।
              </div>
            )}
          </div>
        </div>

        {/* Camera scan option */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-2xl transition duration-300 font-bold text-sm"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            <Camera size={18} /> আরেকটি কিউআর স্ক্যান করুন (Scan Another QR)
          </button>
        </div>

        {/* Footer warning */}
        <p className="text-center text-xs text-gray-600 mt-6 px-4">
          This is an official digital verification page of Sambad Sironam. Unauthorized replication or use of this vehicle permission information constitutes a legal offense.
        </p>
      </div>
    </div>
  );
}
