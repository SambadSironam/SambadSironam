import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
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
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [paperDate, setPaperDate] = useState("");

  const [paperFile, setPaperFile] =
    useState<File | null>(null);

  const [uploadingPaper, setUploadingPaper] =
    useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // User not logged in
      if (!user) {
        navigate("/admin", { replace: true });
        return;
      }

      // Only allow your company email
      if (user.email !== "sambadsironam@gmail.com") {
        alert("You are not authorized to access this dashboard.");
        signOut(auth);
        navigate("/admin", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  const handleEPaperUpload = async () => {
    try {
      if (!paperTitle) {
        alert("Please enter edition title.");
        return;
      }

      if (!paperDate) {
        alert("Please select paper date.");
        return;
      }

      if (!paperFile) {
        alert("Please select PDF.");
        return;
      }

      setUploadingPaper(true);

      // Upload PDF
      const storageRef = ref(
        storage,
        `epapers/${Date.now()}-${paperFile.name}`
      );

      await uploadBytes(storageRef, paperFile);

      const pdfUrl = await getDownloadURL(storageRef);

      // Save in Firestore
      await addDoc(collection(db, "epapers"), {
        title: paperTitle,
        date: paperDate,
        pdfUrl,
        createdAt: serverTimestamp(),
      });

      alert("E-Paper uploaded successfully.");

      setPaperTitle("");
      setPaperDate("");
      setPaperFile(null);

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploadingPaper(false);
    }
  };
  const handlePublish = async () => {
    try {
      if (!title || !category || !content) {
        alert("Please fill all required fields.");
        return;
      }

      if (!image) {
        alert("Please select an image.");
        return;
      }

      // Upload image to Firebase Storage
      const imageRef = ref(
        storage,
        `news/${Date.now()}-${image.name}`
      );

      await uploadBytes(imageRef, image);

      const imageURL = await getDownloadURL(imageRef);

      // Save article to Firestore
      await addDoc(collection(db, "news"), {
        title,
        description,
        author,
        location,
        category,
        subcategory,
        image: imageURL,
        content,

        // New fields
        views: 0,
        likes: 0,
        shares: 0,

        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      alert("News Published Successfully!");

      setTitle("");
      setDescription("");
      setAuthor("Sambad Sironam");
      setLocation("");
      setCategory("");
      setSubcategory("");
      setImage(null);
      setContent("");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
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
        <h1>📰 Sambad Sironam Admin Dashboard</h1>

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

      <input
        type="text"
        placeholder="News Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <textarea
        placeholder="Short Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="text"
        placeholder="Reporter Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="text"
        placeholder="Location (e.g. Kolkata)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Select Category</option>

        <option value="west-bengal">পশ্চিমবঙ্গ</option>
        <option value="north-bengal">↳ উত্তরবঙ্গ</option>
        <option value="south-bengal">↳ দক্ষিণবঙ্গ</option>

        <option value="kolkata">কলকাতা</option>

        <option value="india">ভারত</option>

        <option value="world">বিশ্ব</option>

        <option value="politics">রাজনীতি</option>

        <option value="sports">খেলাধুলা</option>
        <option value="cricket">↳ ক্রিকেট</option>
        <option value="football">↳ ফুটবল</option>
        <option value="other-sports">↳ অন্যান্য খেলা</option>

        <option value="business">ব্যবসা</option>

        <option value="technology">প্রযুক্তি</option>

        <option value="health">স্বাস্থ্য</option>

        <option value="education">শিক্ষা</option>

        <option value="entertainment">বিনোদন</option>
        <option value="astrology">জ্যোতিষ</option>

        <option value="editorial">সম্পাদকীয়</option>

        <option value="exclusive">এক্সক্লুসিভ</option>
      </select>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Featured Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />

        {image && (
          <p
            style={{
              marginTop: "10px",
              color: "green",
            }}
          >
            ✅ {image.name}
          </p>
        )}
      </div>

      <textarea
        placeholder="News Content"
        value={content}
        rows={12}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handlePublish}
        style={{
          background: "#16a34a",
          color: "#fff",
          border: "none",
          padding: "12px 25px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Publish News
      </button>
      <hr style={{ margin: "40px 0" }} />

      <h2
        style={{
          marginBottom: "20px",
          color: "#dc2626",
          fontWeight: "bold",
        }}
      >
        📰 Upload E-Paper
      </h2>

      <input
        type="text"
        placeholder="Edition Title (e.g. 30 June 2026)"
        value={paperTitle}
        onChange={(e) => setPaperTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="date"
        value={paperDate}
        onChange={(e) => setPaperDate(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setPaperFile(e.target.files[0]);
          }
        }}
      />

      {paperFile && (
        <p
          style={{
            marginTop: "10px",
            color: "green",
            fontWeight: "bold",
          }}
        >
          ✅ {paperFile.name}
        </p>
      )}

      <button
        onClick={handleEPaperUpload}
        disabled={uploadingPaper}
        style={{
          marginTop: "20px",
          width: "100%",
          background: "#dc2626",
          color: "#fff",
          border: "none",
          padding: "14px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {uploadingPaper ? "Uploading..." : "📄 Upload E-Paper"}
      </button>
    </div>
  );
}