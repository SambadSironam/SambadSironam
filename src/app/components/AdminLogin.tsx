import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  Newspaper,
  Loader2,
} from "lucide-react";
import { auth } from "../../firebase";

export function AdminLogin() {
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

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (result.user.email !== "sambadsironam@gmail.com" && result.user.uid !== "15EZLzmUOzUel1PeAMshEmKqoRr1") {
        setError("Unauthorized user.");
        await signOut(auth);
        setLoading(false);
        return;
      }

      navigate("/admin/dashboard");
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
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-red-900/20 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-start justify-center px-6 pt-2">

        <div className="w-full max-w-md">

          {/* Logo */}

          <div className="mb-3 text-center">

            <p className="mt-2 text-red-100">

              Content Management System

            </p>

          </div>

          {/* Login Card */}

          <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)]">

            <div className="mb-2 flex items-center justify-center gap-1">

              <ShieldCheck className="h-8 w-8 text-red-500" />

              <h2 className="text-2xl font-bold text-white">

                Admin Login

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

                <Mail className="absolute left-4 top-4 h-5 w-5 text-red-400" />

                <input
                  type="email"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                />

              </div>

            </div>

            {/* Password */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-gray-300">

                Password

              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-4 h-5 w-5 text-red-400" />
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
                  className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-12 pr-12 text-white outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
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
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-800 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-900/50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "LOGIN TO CMS"
              )}
            </button>

            <div className="mt-8 border-t border-white/10 pt-6 text-center">

              <p className="text-sm text-gray-400">
                Secure access for authorized newsroom administrators only.
              </p>

              <div className="mt-4 flex items-center justify-center gap-2">

                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

                <span className="text-xs uppercase tracking-[0.25em] text-green-400">
                  Protected by Authentication
                </span>

              </div>

            </div>

          </div>

          <div className="mt-8 text-center">

            <p className="text-xs tracking-wider text-gray-500">
              © {new Date().getFullYear()} SAMBAD SIRONAM 
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}