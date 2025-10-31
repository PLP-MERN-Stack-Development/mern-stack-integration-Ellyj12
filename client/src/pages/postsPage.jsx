import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const user = JSON.parse(localStorage.getItem("user")); 

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts?page=${page}&limit=6`);
      setPosts(res.data?.posts || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    if (!user?.token) {
      alert("You must be logged in to delete posts.");
      return;
    }

    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-4 shadow rounded relative">
              <Link to={`/post/${post._id}`}>
                <h1 className="font-bold text-lg wrap-break-word">{post.title}</h1>
                <h4 className="text-blue-500">{post.category?.name}</h4>
                <p className="text-gray-700 text-sm mt-2 wrap-break-word overflow-hidden line-clamp-3">
                  {post.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <h4>{post.author}</h4>
                  <p className="text-sm">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </Link>

            
              {user?.role === "admin" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts available.</p>
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
        <span className="font-semibold">{page} / {totalPages}</span>
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
