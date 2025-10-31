import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EditPostPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({}); 

  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/posts/${id}`);
        const postData = res.data;
        setPost({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt || "",
          tags: postData.tags.join(", "),
          category: postData.category?.name || "",
          isPublished: postData.isPublished,
        });
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchPost();
    fetchCategories();
  }, [id]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit updated post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setValidationErrors({}); 

    try {
      const payload = {
        ...post,
        tags: post.tags.split(",").map((t) => t.trim()),
      };

      await axios.put(`/api/posts/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setSuccess("Post updated successfully!");
      setTimeout(() => navigate(`/post/${id}`), 1000);
    } catch (err) {
      if (err.response?.status === 400 && err.response.data?.errors) {
        
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.param] = e.msg;
        });
        setValidationErrors(fieldErrors);
      } else {
        setError(err.response?.data?.message || "Failed to update post.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

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
          {validationErrors.title && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
          )}
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
          {validationErrors.content && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
          )}
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
          {validationErrors.excerpt && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.excerpt}</p>
          )}
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
          {validationErrors.tags && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.tags}</p>
          )}
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
          {validationErrors.category && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
          )}
        </div>

       
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={post.isPublished}
            onChange={handleChange}
          />
          <label className="font-semibold">Published</label>
          {validationErrors.isPublished && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.isPublished}</p>
          )}
        </div>

       
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {saving ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
