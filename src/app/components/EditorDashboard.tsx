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

export function EditorDashboard() {
  const navigate = useNavigate();

  // News Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");

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
  const [visibleCount, setVisibleCount] = useState(3);

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
        navigate("/login", { replace: true });
        return;
      }

      // If super admin logs in here, redirect to admin dashboard
      if (user.email === "sambadsironam@gmail.com" || user.uid === "15EZLzmUOzUel1PeAMshEmKqoRr1") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // Only allow normal editor login
      if (user.email !== "sambadsironam2002@gmail.com" && user.uid !== "AgAvJsw7hlTzfgFnRAvufMhINSC2") {
        alert("You are not authorized to access this dashboard.");
        signOut(auth);
        navigate("/login", { replace: true });
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
    setImage(null);
    setContent("");
    setExistingImageUrl("");
    setVisibleCount(3);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
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
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#0B1F3A" }}>📰 Sambad Sironam CMS Editor Dashboard</h1>

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

      <h2 style={{ marginBottom: "15px", color: editingArticleId ? "#0284c7" : "#16a34a", fontSize: "1.4rem", fontWeight: "bold" }}>
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

      <div style={{ marginBottom: "15px" }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "100%",
            background: "#fff",
          }}
        >
          <option value="">Select Main Category</option>
          <option value="kolkata">কলকাতা</option>
          <option value="west-bengal">পশ্চিমবঙ্গ</option>
          <option value="north-bengal">উত্তরবঙ্গ</option>
          <option value="south-bengal">দক্ষিণবঙ্গ</option>
          <option value="india">ভারত</option>
          <option value="world">বিশ্ব</option>
          <option value="sports">খেলাধুলা</option>
          <option value="cricket">ক্রিকেট</option>
          <option value="football">ফুটবল</option>
          <option value="other-sports">অন্যান্য খেলা</option>
          <option value="entertainment">বিনোদন</option>
          <option value="technology">প্রযুক্তি</option>
          <option value="health">স্বাস্থ্য</option>
          <option value="education">শিক্ষা</option>
          <option value="business">ব্যবসা</option>
          <option value="astrology">জ্যোতিষ</option>
          <option value="exclusive">এক্সক্লুসিভ</option>
          <option value="editorial">সম্পাদকীয়</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "bold", marginBottom: "8px", color: "#495057" }}>
          খবরের মূল ছবি (News Cover Image)
        </label>
        
        <input
          type="file"
          id="news-image-input"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
          style={{ display: "none" }}
        />

        <div
          onClick={() => document.getElementById("news-image-input")?.click()}
          style={{
            border: "2px dashed #0284c7",
            borderRadius: "10px",
            padding: "25px",
            textAlign: "center",
            cursor: "pointer",
            background: "#f0f9ff",
            transition: "all 0.2s ease",
          }}
        >
          {image ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <img
                src={URL.createObjectURL(image)}
                alt="Selected Preview"
                style={{ maxHeight: "150px", borderRadius: "8px", objectFit: "contain", border: "1px solid #e2e8f0" }}
              />
              <div style={{ fontSize: "0.85rem", color: "#0369a1", fontWeight: "bold" }}>
                Selected: {image.name}
              </div>
              <span style={{ fontSize: "0.75rem", background: "#0284c7", color: "#fff", padding: "4px 10px", borderRadius: "4px", fontWeight: "bold" }}>
                পরিবর্তন করুন (Change Image)
              </span>
            </div>
          ) : existingImageUrl ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <img
                src={existingImageUrl}
                alt="Current Preview"
                style={{ maxHeight: "150px", borderRadius: "8px", objectFit: "contain", border: "1px solid #e2e8f0" }}
              />
              <div style={{ fontSize: "0.85rem", color: "#475569" }}>
                বর্তমান ছবি (Existing Image)
              </div>
              <span style={{ fontSize: "0.75rem", background: "#0284c7", color: "#fff", padding: "4px 10px", borderRadius: "4px", fontWeight: "bold" }}>
                নতুন ছবি নির্বাচন করুন (Upload New)
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "2rem", color: "#0284c7" }}>🖼️</div>
              <div style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#0369a1" }}>
                ছবি আপলোড করতে এখানে ক্লিক করুন (Click to Select News Image)
              </div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                JPEG, PNG, WebP format supported
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "5px" }}>
          Full Article Content (HTML Allowed)
        </label>
        <textarea
          placeholder="Write article body in HTML/text format..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontFamily: "monospace",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <button
          onClick={handlePublishOrUpdate}
          style={{
            flex: 1,
            background: editingArticleId ? "#0284c7" : "#16a34a",
            color: "#fff",
            border: "none",
            padding: "14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {editingArticleId ? "Update Article" : "Publish Article"}
        </button>

        {editingArticleId && (
          <button
            onClick={cancelEdit}
            style={{
              background: "#6b7280",
              color: "#fff",
              border: "none",
              padding: "14px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* News List Section */}
      <h2 style={{ marginBottom: "20px", color: "#0B1F3A", fontSize: "1.4rem", fontWeight: "bold" }}>
        📁 published articles ({articles.length})
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
        {loadingArticles ? (
          <p>লোড হচ্ছে...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {articles.slice(0, visibleCount).map((art) => (
              <div
                key={art.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                  background: "#f8f9fa",
                  gap: "15px",
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
            {articles.length > visibleCount && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                style={{
                  marginTop: "10px",
                  background: "#0B1F3A",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                আরও দেখুন (Show More)
              </button>
            )}
            {articles.length === 0 && <p style={{ color: "#6c757d" }}>কোনো সংবাদ পাওয়া যায়নি।</p>}
          </div>
        )}
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2 style={{ marginBottom: "20px", color: "#dc2626", fontSize: "1.4rem", fontWeight: "bold" }}>
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

      <div style={{ marginBottom: "15px" }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setPaperFile(e.target.files[0]);
            }
          }}
        />
      </div>

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
          marginTop: "10px",
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
        {uploadingPaper ? "Uploading..." : "Upload EPaper"}
      </button>
    </div>
  );
}
