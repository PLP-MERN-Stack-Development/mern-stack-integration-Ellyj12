import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PostCreationPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    category: "",
    isPublished: false,
  });
  const [categories, setCategories] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file
  const handleFileChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  // Submit new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("content", post.content);
      formData.append("excerpt", post.excerpt);
      formData.append("tags", post.tags.split(",").map((t) => t.trim()));
      formData.append("category", post.category);
      formData.append("isPublished", post.isPublished);
      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      setSuccess("Post created successfully!");
      setTimeout(() => navigate("/posts"), 1000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Content</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Excerpt</label>
          <input
            type="text"
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={post.tags}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Category</label>
          <select
            name="category"
            value={post.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Featured Image</label>
          <input
            type="file"
            name="featuredImage"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={post.isPublished}
            onChange={handleChange}
          />
          <label className="font-semibold">Published</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default PostCreationPage;
