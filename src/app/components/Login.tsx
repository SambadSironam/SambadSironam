import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Newspaper,
  Loader2,
} from "lucide-react";
import { auth } from "../../firebase";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    // Super Admin should use the admin portal
    if (email.trim() === "sambadsironam@gmail.com") {
      setError("Please use the admin login portal for this email.");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email !== "sambadsironam2002@gmail.com" && result.user.uid !== "AgAvJsw7hlTzfgFnRAvufMhINSC2") {
        setError("Unauthorized user.");
        await signOut(auth);
        setLoading(false);
        return;
      }
      navigate("/editor/dashboard");
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;

        case "auth/user-not-found":
          setError("User not found.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;

        default:
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 relative overflow-hidden flex items-center justify-center py-12 px-6">

      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-700/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Header Title */}
        <div className="mb-6 text-center">
          <p className="text-xl font-bold tracking-wider text-blue-400 uppercase" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
            সংবাদ শিরোনাম
          </p>
          <p className="mt-1 text-gray-400 text-sm">
            Content Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)]">

          <div className="mb-6 flex items-center justify-center gap-2">
            <Newspaper className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">
              CMS Editor Login
            </h2>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-600/10 p-4 text-center text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-blue-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-12 pr-12 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/50 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              "LOGIN TO NEWSROOM"
            )}
          </button>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-gray-400">
              Authorized journalists and content creators only.
            </p>
          </div>

        </div>

        <div className="mt-8 text-center">
          <p className="text-xs tracking-wider text-gray-500">
            © {new Date().getFullYear()} SAMBAD SIRONAM
          </p>
        </div>

      </div>

    </div>
  );
}
