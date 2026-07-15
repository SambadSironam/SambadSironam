import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
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
  
  // News Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [subcategory, setSubcategory] = useState("");
  
  // Edit mode state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  // E-Paper Form state
  const [paperTitle, setPaperTitle] = useState("");
  const [paperDate, setPaperDate] = useState("");
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [uploadingPaper, setUploadingPaper] = useState(false);

  // Manage News state
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(list);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoadingArticles(false);
    }
  };

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
      } else {
        fetchArticles();
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

  const handlePublishOrUpdate = async () => {
    try {
      if (!title || !category || !content) {
        alert("Please fill all required fields.");
        return;
      }

      let finalImageUrl = existingImageUrl;

      // If a new image is selected, upload it
      if (image) {
        const imageRef = ref(storage, `news/${Date.now()}-${image.name}`);
        await uploadBytes(imageRef, image);
        finalImageUrl = await getDownloadURL(imageRef);
      } else if (!editingArticleId) {
        alert("Please select an image.");
        return;
      }

      if (editingArticleId) {
        // Update mode
        await updateDoc(doc(db, "news", editingArticleId), {
          title,
          description,
          author,
          location,
          category,
          subcategory,
          image: finalImageUrl,
          content,
          updatedAt: new Date(),
        });
        alert("News Updated Successfully!");
      } else {
        // Create mode
        await addDoc(collection(db, "news"), {
          title,
          description,
          author,
          location,
          category,
          subcategory,
          image: finalImageUrl,
          content,
          views: 0,
          likes: 0,
          shares: 0,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        alert("News Published Successfully!");
      }

      cancelEdit();
      fetchArticles();
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই সংবাদটি মুছে ফেলতে চান?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "news", articleId));
      alert("সংবাদটি সফলভাবে মুছে ফেলা হয়েছে।");
      fetchArticles();
      if (editingArticleId === articleId) {
        cancelEdit();
      }
    } catch (error: any) {
      console.error(error);
      alert("Failed to delete article: " + error.message);
    }
  };

  const handleEditClick = (article: any) => {
    setEditingArticleId(article.id);
    setTitle(article.title || "");
    setDescription(article.description || "");
    setAuthor(article.author || "Sambad Sironam");
    setLocation(article.location || "");
    setCategory(article.category || "");
    setSubcategory(article.subcategory || "");
    setContent(article.content || "");
    setExistingImageUrl(article.image || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingArticleId(null);
    setTitle("");
    setDescription("");
    setAuthor("");
    setLocation("");
    setCategory("");
    setSubcategory("");
    setImage(null);
    setContent("");
    setExistingImageUrl("");
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
      className="selectable"
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

      <h2 style={{ marginBottom: "15px", color: editingArticleId ? "#0284c7" : "#16a34a" }}>
        {editingArticleId ? "✏️ Edit News Article" : "✍️ Publish News"}
      </h2>

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
          {editingArticleId ? "Featured Image (Leave blank to keep existing image)" : "Featured Image"}
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
          <p style={{ marginTop: "10px", color: "green" }}>
            ✅ {image.name}
          </p>
        )}
        {!image && existingImageUrl && (
          <div style={{ marginTop: "10px" }}>
            <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>Current Image:</span>
            <img src={existingImageUrl} alt="Current" style={{ display: "block", height: "60px", marginTop: "5px", borderRadius: "4px" }} />
          </div>
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

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handlePublishOrUpdate}
          style={{
            background: editingArticleId ? "#0284c7" : "#16a34a",
            color: "#fff",
            border: "none",
            padding: "12px 25px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {editingArticleId ? "Update News Article" : "Publish News"}
        </button>
        {editingArticleId && (
          <button
            onClick={cancelEdit}
            style={{
              background: "#6c757d",
              color: "#fff",
              border: "none",
              padding: "12px 25px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* Manage Articles list */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#0B1F3A", fontWeight: "bold", marginBottom: "20px" }}>
          📰 সংবাদ পরিচালনা করুন (Manage Articles)
        </h2>
        {loadingArticles ? (
          <p>লোড হচ্ছে...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {articles.map((art) => (
              <div
                key={art.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                  gap: "15px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
                  {art.image && (
                    <img
                      src={art.image}
                      alt={art.title}
                      style={{ width: "50px", height: "35px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                    />
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        color: "#212529",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {art.title}
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                      বিভাগ: {art.category} | ভিউ: {art.views || 0}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleEditClick(art)}
                    style={{
                      background: "#0d6efd",
                      color: "#fff",
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
                  <button
                    onClick={() => handleDelete(art.id)}
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
            {articles.length === 0 && <p style={{ color: "#6c757d" }}>কোনো সংবাদ পাওয়া যায়নি।</p>}
          </div>
        )}
      </div>

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