import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import logoImg from "../../imports/logo.png";

export function AdminDashboard() {
  const navigate = useNavigate();

  // Manage Workers state
  const [workers, setWorkers] = useState<any[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [workerIdInput, setWorkerIdInput] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [workerDob, setWorkerDob] = useState("");
  const [workerDesignation, setWorkerDesignation] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");
  const [workerEmail, setWorkerEmail] = useState("");
  const [workerBloodGroup, setWorkerBloodGroup] = useState("");
  const [workerValidUntil, setWorkerValidUntil] = useState("");
  const [workerPhoto, setWorkerPhoto] = useState<File | null>(null);
  const [workerStatus, setWorkerStatus] = useState("Active");
  const [uploadingWorker, setUploadingWorker] = useState(false);

  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const q = query(collection(db, "workers"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          workerId: data.id || doc.id,
          ...data,
        };
      });
      setWorkers(list);
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // User not logged in
      if (!user) {
        navigate("/admin", { replace: true });
        return;
      }

      // Only allow super admin
      if (user.email !== "sambadsironam@gmail.com" && user.uid !== "15EZLzmUOzUel1PeAMshEmKqoRr1") {
        alert("You are not authorized to access this dashboard.");
        signOut(auth);
        navigate("/admin", { replace: true });
      } else {
        fetchWorkers();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleWorkerUpload = async () => {
    try {
      if (!workerIdInput.trim()) {
        alert("Please enter Worker ID (e.g. SS-001).");
        return;
      }
      if (!workerName.trim()) {
        alert("Please enter worker name.");
        return;
      }
      if (!workerDesignation.trim()) {
        alert("Please enter designation.");
        return;
      }

      setUploadingWorker(true);

      const trimmedId = workerIdInput.trim();
      const safeId = trimmedId.replace(/\//g, "_");

      let photoUrl = "";
      if (workerPhoto) {
        const photoRef = ref(storage, `workers/${safeId}-${Date.now()}-${workerPhoto.name}`);
        await uploadBytes(photoRef, workerPhoto);
        photoUrl = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, "workers", safeId), {
        id: trimmedId,
        name: workerName,
        dob: workerDob,
        designation: workerDesignation,
        phone: workerPhone,
        email: workerEmail,
        bloodGroup: workerBloodGroup,
        validUntil: workerValidUntil,
        photo: photoUrl,
        status: workerStatus,
        createdAt: serverTimestamp(),
      });

      alert("Worker profile registered successfully!");

      setWorkerIdInput("");
      setWorkerName("");
      setWorkerDob("");
      setWorkerDesignation("");
      setWorkerPhone("");
      setWorkerEmail("");
      setWorkerBloodGroup("");
      setWorkerValidUntil("");
      setWorkerPhoto(null);
      setWorkerStatus("Active");

      fetchWorkers();
    } catch (error: any) {
      console.error("Error registering worker:", error);
      alert(error.message);
    } finally {
      setUploadingWorker(false);
    }
  };

  const handleWorkerDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই কর্মীর আইডি মুছে ফেলতে চান?")) {
      try {
        await deleteDoc(doc(db, "workers", id));
        alert("কর্মী সফলভাবে মুছে ফেলা হয়েছে।");
        fetchWorkers();
        if (selectedQrWorker?.id === id) {
          setSelectedQrWorker(null);
        }
        if (selectedIdCardWorker?.id === id) {
          setSelectedIdCardWorker(null);
        }
      } catch (error: any) {
        console.error("Error deleting worker:", error);
        alert("Failed to delete worker: " + error.message);
      }
    }
  };

  const handlePrintIdCard = () => {
    if (!selectedIdCardWorker) return;
    const printContent = document.getElementById("printable-id-card");
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) {
      alert("Please allow popups to print the ID card.");
      return;
    }

    let styles = "";
    document.querySelectorAll("style, link[rel='stylesheet']").forEach((el) => {
      styles += el.outerHTML;
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>ID Card - ${selectedIdCardWorker.name}</title>
          ${styles}
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: #fff;
            }
            #printable-id-card {
              box-shadow: none !important;
              border: 1px solid #000 !important;
            }
            @page {
              size: auto;
              margin: 0mm;
            }
          </style>
        </head>
        <body>
          <div style="transform: scale(1.3);">
            ${printContent.outerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin", { replace: true });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div
      className="selectable font-sans"
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#0B1F3A" }}>📰 Sambad Sironam Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Workers Management Section */}
      <h2
        style={{
          marginBottom: "20px",
          color: "#0B1F3A",
          fontWeight: "bold",
          fontSize: "1.4rem",
        }}
      >
        👥 প্রতিনিধি পরিচালনা (Manage Workers/Representatives)
      </h2>

      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "15px", color: "#495057" }}>
          👤 নতুন প্রতিনিধি যোগ করুন
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>Worker ID (যেমন: SS-001)</label>
            <input
              type="text"
              placeholder="SS-001"
              value={workerIdInput}
              onChange={(e) => setWorkerIdInput(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>পূর্ণ নাম (Full Name)</label>
            <input
              type="text"
              placeholder="প্রতিনিধির নাম লিখুন"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>পদবী (Designation)</label>
            <input
              type="text"
              placeholder="যেমন: সাংবাদিক, ভিডিওগ্রাফার"
              value={workerDesignation}
              onChange={(e) => setWorkerDesignation(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>ফোন নম্বর</label>
            <input
              type="text"
              placeholder="+91-XXXXXXXXXX"
              value={workerPhone}
              onChange={(e) => setWorkerPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>ইমেইল ঠিকানা</label>
            <input
              type="email"
              placeholder="worker@email.com"
              value={workerEmail}
              onChange={(e) => setWorkerEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>রক্তের গ্রুপ (Blood Group)</label>
            <input
              type="text"
              placeholder="A+, O-, B+ ইত্যাদি"
              value={workerBloodGroup}
              onChange={(e) => setWorkerBloodGroup(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>মেয়াদ শেষ (Valid Until)</label>
            <input
              type="text"
              placeholder="যেমন: December 2027"
              value={workerValidUntil}
              onChange={(e) => setWorkerValidUntil(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>স্ট্যাটাস (Status)</label>
            <select
              value={workerStatus}
              onChange={(e) => setWorkerStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Active">Active (সক্রিয়)</option>
              <option value="Inactive">Inactive (অক্রিয়)</option>
              <option value="Suspended">Suspended (স্থগিত)</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>জন্ম তারিখ (Date of Birth)</label>
            <input
              type="date"
              value={workerDob}
              onChange={(e) => setWorkerDob(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>আইডি কার্ডের ছবি (ID Card Image)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setWorkerPhoto(e.target.files[0]);
                }
              }}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            />
          </div>
        </div>

        <button
          onClick={handleWorkerUpload}
          disabled={uploadingWorker}
          style={{
            background: "#28a745",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          {uploadingWorker ? "Saving Representative..." : "👥 প্রতিনিধি আইডি যুক্ত করুন"}
        </button>
      </div>

      {/* Workers List Section */}
      <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "15px", color: "#0B1F3A" }}>
        📁 নিবন্ধিত প্রতিনিধি তালিকা ({workers.length})
      </h3>

      {loadingWorkers ? (
        <p>লোড হচ্ছে...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {workers.map((w) => (
            <div
              key={w.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px",
                background: "#f8f9fa",
                borderRadius: "10px",
                border: "1px solid #e9ecef",
                gap: "15px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", background: "#dee2e6", flexShrink: 0 }}>
                  {w.photo ? (
                    <img src={w.photo} alt={w.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#6c757d", fontSize: "0.8rem" }}>No Pic</div>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "#212529" }}>{w.name}</h4>
                  <div style={{ fontSize: "0.8rem", color: "#495057", marginTop: "2px" }}>
                    ID: <strong>{w.workerId || w.id}</strong> | Designation: <strong>{w.designation}</strong>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        background: w.status === "Active" ? "#d4edda" : w.status === "Suspended" ? "#f8d7da" : "#fff3cd",
                        color: w.status === "Active" ? "#155724" : w.status === "Suspended" ? "#721c24" : "#856404",
                      }}
                    >
                      {w.status}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                <button
                  onClick={() => window.open(`/verify-id?id=${encodeURIComponent(w.workerId || w.id)}`, "_blank")}
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  আইডি কার্ড
                </button>
                <button
                  onClick={() => handleWorkerDelete(w.id)}
                  style={{
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {workers.length === 0 && <p style={{ color: "#6c757d" }}>কোনো কর্মী পাওয়া যায়নি।</p>}
        </div>
      )}

    </div>
  );
}