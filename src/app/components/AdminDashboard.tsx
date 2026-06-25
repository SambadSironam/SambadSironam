import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const handlePublish = async () => {
    try {
      await addDoc(collection(db, "news"), {
        title,
        category,
        image,
        content,
        createdAt: new Date(),
      });

      alert("News Published Successfully!");

      setTitle("");
      setCategory("");
      setImage("");
      setContent("");
    } catch (error: any) {
  console.error(error);

  alert(error.message);
}
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px" }}>
      <h1>Admin Dashboard</h1>

      <br />

      <input
        type="text"
        placeholder="News Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <br /><br />

      <textarea
        placeholder="News Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{ width: "100%", padding: "10px" }}
      />

      <br /><br />

      <button onClick={handlePublish}>
        Publish News
      </button>
    </div>
  );
}