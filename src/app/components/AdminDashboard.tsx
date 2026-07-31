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

export function AdminDashboard() {
  const navigate = useNavigate();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<"workers" | "cars">("workers");

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
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [workerStatus, setWorkerStatus] = useState("Active");
  const [uploadingWorker, setUploadingWorker] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
  const [existingProfilePhotoUrl, setExistingProfilePhotoUrl] = useState("");

  // Manage Cars state
  const [cars, setCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carIdInput, setCarIdInput] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [carOwner, setCarOwner] = useState("");
  const [carDesignation, setCarDesignation] = useState("");
  const [carPhone, setCarPhone] = useState("");
  const [carValidUntil, setCarValidUntil] = useState("");
  const [carPhoto, setCarPhoto] = useState<File | null>(null);
  const [carStatus, setCarStatus] = useState("Active");
  const [uploadingCar, setUploadingCar] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [existingCarPhotoUrl, setExistingCarPhotoUrl] = useState("");
  const [showWorkersList, setShowWorkersList] = useState(false);
  const [showCarsList, setShowCarsList] = useState(false);
  const [deletingWorkerIdConfirm, setDeletingWorkerIdConfirm] = useState<string | null>(null);
  const [deletingCarIdConfirm, setDeletingCarIdConfirm] = useState<string | null>(null);

  const fetchWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const q = query(collection(db, "workers"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          workerId: data.id || doc.id,
        };
      });
      setWorkers(list);
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const fetchCars = async () => {
    setLoadingCars(true);
    try {
      const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          carId: data.id || doc.id,
        };
      });
      setCars(list);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoadingCars(false);
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
        fetchCars();
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

      let photoUrl = existingPhotoUrl || "";
      if (workerPhoto) {
        const photoRef = ref(storage, `workers/${safeId}-${Date.now()}-${workerPhoto.name}`);
        await uploadBytes(photoRef, workerPhoto);
        photoUrl = await getDownloadURL(photoRef);
      }

      let profilePhotoUrl = existingProfilePhotoUrl || "";
      if (profilePhoto) {
        const profilePhotoRef = ref(storage, `profiles/${safeId}-${Date.now()}-${profilePhoto.name}`);
        await uploadBytes(profilePhotoRef, profilePhoto);
        profilePhotoUrl = await getDownloadURL(profilePhotoRef);
      }

      // If we are editing, and the document ID has changed (e.g. they edited worker ID)
      if (editingWorkerId && editingWorkerId !== safeId) {
        await deleteDoc(doc(db, "workers", editingWorkerId));
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
        profilePhoto: profilePhotoUrl,
        status: workerStatus,
        createdAt: serverTimestamp(),
      });

      alert(editingWorkerId ? "প্রতিনিধির তথ্য সফলভাবে আপডেট করা হয়েছে!" : "কর্মী সফলভাবে নিবন্ধিত করা হয়েছে!");

      setWorkerIdInput("");
      setWorkerName("");
      setWorkerDob("");
      setWorkerDesignation("");
      setWorkerPhone("");
      setWorkerEmail("");
      setWorkerBloodGroup("");
      setWorkerValidUntil("");
      setWorkerPhoto(null);
      setProfilePhoto(null);
      setWorkerStatus("Active");
      setEditingWorkerId(null);
      setExistingPhotoUrl("");
      setExistingProfilePhotoUrl("");

      fetchWorkers();
    } catch (error: any) {
      console.error("Error saving worker:", error);
      alert(error.message);
    } finally {
      setUploadingWorker(false);
    }
  };

  const handleStartEdit = (worker: any) => {
    setEditingWorkerId(worker.id);
    setWorkerIdInput(worker.workerId || worker.id);
    setWorkerName(worker.name || "");
    setWorkerDob(worker.dob || "");
    setWorkerDesignation(worker.designation || "");
    setWorkerPhone(worker.phone || "");
    setWorkerEmail(worker.email || "");
    setWorkerBloodGroup(worker.bloodGroup || "");
    setWorkerValidUntil(worker.validUntil || "");
    setWorkerStatus(worker.status || "Active");
    setExistingPhotoUrl(worker.photo || "");
    setExistingProfilePhotoUrl(worker.profilePhoto || "");
    setWorkerPhoto(null);
    setProfilePhoto(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingWorkerId(null);
    setWorkerIdInput("");
    setWorkerName("");
    setWorkerDob("");
    setWorkerDesignation("");
    setWorkerPhone("");
    setWorkerEmail("");
    setWorkerBloodGroup("");
    setWorkerValidUntil("");
    setWorkerPhoto(null);
    setProfilePhoto(null);
    setWorkerStatus("Active");
    setExistingPhotoUrl("");
    setExistingProfilePhotoUrl("");
  };

  const handleWorkerDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই কর্মীর আইডি মুছে ফেলতে চান?")) {
      try {
        await deleteDoc(doc(db, "workers", id));
        alert("কর্মী সফলভাবে মুছে ফেলা হয়েছে।");
        fetchWorkers();
      } catch (error: any) {
        console.error("Error deleting worker:", error);
        alert("Failed to delete worker: " + error.message);
      }
    }
  };

  const handleCarUpload = async () => {
    try {
      if (!carIdInput.trim()) {
        alert("Please enter Car ID / Permit ID (e.g. SS-CAR-001).");
        return;
      }
      if (!carNumber.trim()) {
        alert("Please enter car number (e.g. WB-12-AB-3456).");
        return;
      }
      if (!carOwner.trim()) {
        alert("Please enter owner / driver name.");
        return;
      }

      setUploadingCar(true);

      const trimmedId = carIdInput.trim();
      const safeId = trimmedId.replace(/\//g, "_");

      let photoUrl = existingCarPhotoUrl || "";
      if (carPhoto) {
        const photoRef = ref(storage, `cars/${safeId}-${Date.now()}-${carPhoto.name}`);
        await uploadBytes(photoRef, carPhoto);
        photoUrl = await getDownloadURL(photoRef);
      }

      // If we are editing, and the document ID has changed
      if (editingCarId && editingCarId !== safeId) {
        await deleteDoc(doc(db, "cars", editingCarId));
      }

      await setDoc(doc(db, "cars", safeId), {
        id: trimmedId,
        carNumber: carNumber,
        ownerName: carOwner,
        designation: carDesignation,
        phone: carPhone,
        validUntil: carValidUntil,
        photo: photoUrl,
        status: carStatus,
        createdAt: serverTimestamp(),
      });

      alert(editingCarId ? "গাড়ির তথ্য সফলভাবে আপডেট করা হয়েছে!" : "গাড়ি সফলভাবে নিবন্ধিত করা হয়েছে!");

      setCarIdInput("");
      setCarNumber("");
      setCarOwner("");
      setCarDesignation("");
      setCarPhone("");
      setCarValidUntil("");
      setCarPhoto(null);
      setCarStatus("Active");
      setEditingCarId(null);
      setExistingCarPhotoUrl("");

      fetchCars();
    } catch (error: any) {
      console.error("Error saving car:", error);
      alert(error.message);
    } finally {
      setUploadingCar(false);
    }
  };

  const handleStartCarEdit = (car: any) => {
    setEditingCarId(car.id);
    setCarIdInput(car.carId || car.id);
    setCarNumber(car.carNumber || "");
    setCarOwner(car.ownerName || "");
    setCarDesignation(car.designation || "");
    setCarPhone(car.phone || "");
    setCarValidUntil(car.validUntil || "");
    setCarStatus(car.status || "Active");
    setExistingCarPhotoUrl(car.photo || "");
    setCarPhoto(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelCarEdit = () => {
    setEditingCarId(null);
    setCarIdInput("");
    setCarNumber("");
    setCarOwner("");
    setCarDesignation("");
    setCarPhone("");
    setCarValidUntil("");
    setCarPhoto(null);
    setCarStatus("Active");
    setExistingCarPhotoUrl("");
  };

  const handleCarDelete = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই গাড়ির তথ্য মুছে ফেলতে চান?")) {
      try {
        await deleteDoc(doc(db, "cars", id));
        alert("গাড়ির তথ্য সফলভাবে মুছে ফেলা হয়েছে।");
        fetchCars();
      } catch (error: any) {
        console.error("Error deleting car:", error);
        alert("Failed to delete car: " + error.message);
      }
    }
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

      {/* Tab Switcher */}
      <div style={{ display: "flex", borderBottom: "2px solid #e9ecef", marginBottom: "30px", gap: "10px" }}>
        <button
          onClick={() => {
            setActiveTab("workers");
            handleCancelCarEdit();
          }}
          style={{
            padding: "12px 20px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "workers" ? "3px solid #0B1F3A" : "3px solid transparent",
            color: activeTab === "workers" ? "#0B1F3A" : "#6c757d",
            fontWeight: "bold",
            fontSize: "1.05rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          👥 প্রতিনিধি পরিচালনা (Representatives)
        </button>
        <button
          onClick={() => {
            setActiveTab("cars");
            handleCancelEdit();
          }}
          style={{
            padding: "12px 20px",
            background: "none",
            border: "none",
            borderBottom: activeTab === "cars" ? "3px solid #0B1F3A" : "3px solid transparent",
            color: activeTab === "cars" ? "#0B1F3A" : "#6c757d",
            fontWeight: "bold",
            fontSize: "1.05rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          🚗 গাড়ির তথ্য পরিচালনা (Authorized Cars)
        </button>
      </div>

      {activeTab === "workers" && (
        <>
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
              {editingWorkerId ? "✏️ প্রতিনিধি তথ্য সম্পাদনা করুন" : "👤 নতুন প্রতিনিধি যোগ করুন"}
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
                {existingPhotoUrl && (
                  <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginTop: "5px" }}>
                    Current ID Card: <a href={existingPhotoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7" }}>View Image</a>
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>প্রোফাইল ছবি (Profile Photo)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfilePhoto(e.target.files[0]);
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
                {existingProfilePhotoUrl && (
                  <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginTop: "5px" }}>
                    Current Profile Pic: <a href={existingProfilePhotoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7" }}>View Image</a>
                  </span>
                )}
              </div>
              <div></div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleWorkerUpload}
                disabled={uploadingWorker}
                style={{
                  flex: 1,
                  background: editingWorkerId ? "#0284c7" : "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                }}
              >
                {uploadingWorker ? "সংরক্ষণ করা হচ্ছে..." : editingWorkerId ? "💾 তথ্য আপডেট করুন" : "👥 প্রতিনিধি আইডি যুক্ত করুন"}
              </button>
              {editingWorkerId && (
                <button
                  onClick={handleCancelEdit}
                  style={{
                    background: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                  }}
                >
                  বাতিল করুন (Cancel)
                </button>
              )}
            </div>
          </div>

          {/* Workers List Section */}
          <div
            onClick={() => setShowWorkersList(!showWorkersList)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 18px",
              background: "#f1f3f5",
              borderRadius: "8px",
              cursor: "pointer",
              userSelect: "none",
              marginBottom: "15px",
              border: "1px solid #dee2e6",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e9ecef")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f3f5")}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0B1F3A", margin: 0 }}>
              📁 নিবন্ধিত প্রতিনিধি তালিকা ({workers.length})
            </h3>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#0B1F3A",
                color: "#ffffff",
                fontSize: "0.75rem",
                transition: "transform 0.2s",
                transform: showWorkersList ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>

          {showWorkersList && (
            loadingWorkers ? (
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
                        {w.profilePhoto ? (
                          <img src={w.profilePhoto} alt={w.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyResponse: "center", height: "100%", color: "#6c757d", fontSize: "0.8rem" }}>No Pic</div>
                        )}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#0B1F3A" }}>{w.name}</h4>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "8px 16px",
                            marginTop: "10px",
                            fontSize: "0.85rem",
                            color: "#495057"
                          }}
                        >
                          <div style={{ whiteSpace: "nowrap" }}>🆔 ID: <strong style={{ color: "#212529" }}>{w.workerId || w.id}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>
                            ⚡ Status:{" "}
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
                          <div style={{ whiteSpace: "nowrap" }}>📅 DOB: <strong style={{ color: "#212529" }}>{w.dob || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>📞 Phone: <strong style={{ color: "#212529" }}>{w.phone || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>🩸 Blood Group: <strong style={{ color: "#212529" }}>{w.bloodGroup || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>⏳ Valid Until: <strong style={{ color: "#212529" }}>{w.validUntil || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap", gridColumn: "span 2" }}>✉️ Email: <strong style={{ color: "#212529" }}>{w.email || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap", gridColumn: "span 2" }}>💼 Designation: <strong style={{ color: "#212529" }}>{w.designation}</strong></div>
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
                        onClick={() => handleStartEdit(w)}
                        style={{
                          background: "#ffc107",
                          color: "#212529",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        Edit
                      </button>
                      {deletingWorkerIdConfirm === w.id ? (
                        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                          <span style={{ fontSize: "0.8rem", color: "#dc3545", fontWeight: "bold" }}>Are you sure?</span>
                          <button
                            onClick={async () => {
                              try {
                                await deleteDoc(doc(db, "workers", w.id));
                                alert("কর্মী সফলভাবে মুছে ফেলা হয়েছে।");
                                setDeletingWorkerIdConfirm(null);
                                fetchWorkers();
                              } catch (error: any) {
                                console.error("Error deleting worker:", error);
                                alert("Failed to delete worker: " + error.message);
                              }
                            }}
                            style={{
                              background: "#dc3545",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingWorkerIdConfirm(null)}
                            style={{
                              background: "#6c757d",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingWorkerIdConfirm(w.id)}
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
                      )}
                    </div>
                  </div>
                ))}

                {workers.length === 0 && <p style={{ color: "#6c757d" }}>কোনো কর্মী পাওয়া যায়নি।</p>}
              </div>
            )
          )}
        </>
      )}

      {activeTab === "cars" && (
        <>
          {/* Cars Management Section */}
          <h2
            style={{
              marginBottom: "20px",
              color: "#0B1F3A",
              fontWeight: "bold",
              fontSize: "1.4rem",
            }}
          >
            🚗 গাড়ির তথ্য পরিচালনা (Manage Authorized Cars)
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
              {editingCarId ? "✏️ গাড়ির তথ্য সম্পাদনা করুন" : "🚗 নতুন অনুমোদিত গাড়ি যোগ করুন"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>Car ID / Permit ID (যেমন: SS-CAR-001)</label>
                <input
                  type="text"
                  placeholder="SS-CAR-001"
                  value={carIdInput}
                  onChange={(e) => setCarIdInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>গাড়ির নম্বর (Car Number)</label>
                <input
                  type="text"
                  placeholder="যেমন: WB-12-AB-3456"
                  value={carNumber}
                  onChange={(e) => setCarNumber(e.target.value)}
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
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>প্রতিনিধি/মালিকের নাম (Owner Name)</label>
                <input
                  type="text"
                  placeholder="নাম লিখুন"
                  value={carOwner}
                  onChange={(e) => setCarOwner(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>পদবী (Designation)</label>
                <input
                  type="text"
                  placeholder="যেমন: সাংবাদিক, প্রতিনিধি"
                  value={carDesignation}
                  onChange={(e) => setCarDesignation(e.target.value)}
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
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>ফোন নম্বর</label>
                <input
                  type="text"
                  placeholder="+91-XXXXXXXXXX"
                  value={carPhone}
                  onChange={(e) => setCarPhone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>মেয়াদ শেষ (Valid Until)</label>
                <input
                  type="text"
                  placeholder="যেমন: December 2027"
                  value={carValidUntil}
                  onChange={(e) => setCarValidUntil(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>স্ট্যাটাস (Status)</label>
                <select
                  value={carStatus}
                  onChange={(e) => setCarStatus(e.target.value)}
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
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>অনুমতিপত্র/স্ক্যানার কপি (Scanner/Permit Image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCarPhoto(e.target.files[0]);
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
                {existingCarPhotoUrl && (
                  <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginTop: "5px" }}>
                    Current Permit: <a href={existingCarPhotoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0284c7" }}>View Image</a>
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCarUpload}
                disabled={uploadingCar}
                style={{
                  flex: 1,
                  background: editingCarId ? "#0284c7" : "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                }}
              >
                {uploadingCar ? "সংরক্ষণ করা হচ্ছে..." : editingCarId ? "💾 তথ্য আপডেট করুন" : "🚗 গাড়ি যুক্ত করুন"}
              </button>
              {editingCarId && (
                <button
                  onClick={handleCancelCarEdit}
                  style={{
                    background: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                  }}
                >
                  বাতিল করুন (Cancel)
                </button>
              )}
            </div>
          </div>

          {/* Cars List Section */}
          <div
            onClick={() => setShowCarsList(!showCarsList)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 18px",
              background: "#f1f3f5",
              borderRadius: "8px",
              cursor: "pointer",
              userSelect: "none",
              marginBottom: "15px",
              border: "1px solid #dee2e6",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e9ecef")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f3f5")}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#0B1F3A", margin: 0 }}>
              📁 নিবন্ধিত গাড়ির তালিকা ({cars.length})
            </h3>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#0B1F3A",
                color: "#ffffff",
                fontSize: "0.75rem",
                transition: "transform 0.2s",
                transform: showCarsList ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>

          {showCarsList && (
            loadingCars ? (
              <p>লোড হচ্ছে...</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {cars.map((c) => (
                  <div
                    key={c.id}
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
                      <div style={{ width: "64px", height: "64px", background: "#fff", border: "1px solid #dee2e6", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "2px", flexShrink: 0 }}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                            window.location.origin + "/verify-car?id=" + (c.carId || c.id)
                          )}`}
                          alt="QR Code"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          title="গাড়ির কিউআর কোড"
                        />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#0B1F3A" }}>
                          🚗 {c.carNumber}
                        </h4>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "8px 16px",
                            marginTop: "10px",
                            fontSize: "0.85rem",
                            color: "#495057"
                          }}
                        >
                          <div style={{ whiteSpace: "nowrap" }}>🆔 ID: <strong style={{ color: "#212529" }}>{c.carId || c.id}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>
                            ⚡ Status:{" "}
                            <span
                              style={{
                                fontSize: "0.75rem",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                background: c.status === "Active" ? "#d4edda" : c.status === "Suspended" ? "#f8d7da" : "#fff3cd",
                                color: c.status === "Active" ? "#155724" : c.status === "Suspended" ? "#721c24" : "#856404",
                              }}
                            >
                              {c.status}
                            </span>
                          </div>
                          <div style={{ whiteSpace: "nowrap" }}>👤 Owner/Driver: <strong style={{ color: "#212529" }}>{c.ownerName || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>💼 Role: <strong style={{ color: "#212529" }}>{c.designation || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>📞 Phone: <strong style={{ color: "#212529" }}>{c.phone || "N/A"}</strong></div>
                          <div style={{ whiteSpace: "nowrap" }}>⏳ Valid Until: <strong style={{ color: "#212529" }}>{c.validUntil || "N/A"}</strong></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
                      <button
                        onClick={() => window.open(`/verify-car?id=${encodeURIComponent(c.carId || c.id)}`, "_blank")}
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
                        যাচাই লিংক
                      </button>
                      <button
                        onClick={() => handleStartCarEdit(c)}
                        style={{
                          background: "#ffc107",
                          color: "#212529",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        Edit
                      </button>
                      {deletingCarIdConfirm === c.id ? (
                        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                          <span style={{ fontSize: "0.8rem", color: "#dc3545", fontWeight: "bold" }}>Are you sure?</span>
                          <button
                            onClick={async () => {
                              try {
                                await deleteDoc(doc(db, "cars", c.id));
                                alert("গাড়ির তথ্য সফলভাবে মুছে ফেলা হয়েছে।");
                                setDeletingCarIdConfirm(null);
                                fetchCars();
                              } catch (error: any) {
                                console.error("Error deleting car:", error);
                                alert("Failed to delete car: " + error.message);
                              }
                            }}
                            style={{
                              background: "#dc3545",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingCarIdConfirm(null)}
                            style={{
                              background: "#6c757d",
                              color: "#fff",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingCarIdConfirm(c.id)}
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
                      )}
                    </div>
                  </div>
                ))}

                {cars.length === 0 && <p style={{ color: "#6c757d" }}>কোনো গাড়ি পাওয়া যায়নি।</p>}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}