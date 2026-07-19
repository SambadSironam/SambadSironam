import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase";

interface EditorProtectedRouteProps {
  children: ReactNode;
}

export function EditorProtectedRoute({ children }: EditorProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading while checking login status
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin should be redirected to admin dashboard, not here
  if (user.email === "sambadsironam@gmail.com" || user.uid === "15EZLzmUOzUel1PeAMshEmKqoRr1") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Only allow normal editor login
  if (user.email !== "sambadsironam2002@gmail.com" && user.uid !== "AgAvJsw7hlTzfgFnRAvufMhINSC2") {
    auth.signOut();
    return <Navigate to="/login" replace />;
  }

  // Logged in as editor
  return <>{children}</>;
}
