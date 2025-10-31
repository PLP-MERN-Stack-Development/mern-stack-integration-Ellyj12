import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Add search and category as query params
      let url = `/api/posts?page=${page}&limit=6`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (filterCategory) url += `&category=${encodeURIComponent(filterCategory)}`;

      const res = await axios.get(url);
      setPosts(res.data?.posts || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, search, filterCategory]);

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (!user?.token) {
      alert("You must be logged in to delete posts.");
      return;
    }
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setPage(1); // reset page
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />

        <select
          value={filterCategory}
          onChange={(e) => {
            setPage(1); // reset page
            setFilterCategory(e.target.value);
          }}
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} user={user} onDelete={deletePost} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span className="font-semibold">
          {page} / {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostsPage;
