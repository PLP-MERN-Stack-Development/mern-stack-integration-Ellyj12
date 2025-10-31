import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!post) return <p className="p-4">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-6 shadow rounded">
     
      {post.featuredImage && (
        <img
          src={`http://localhost:5000/uploads/${post.featuredImage}`}
          alt={post.title}
          className="w-full h-auto rounded mb-4"
        />
      )}

      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="text-sm text-gray-600 mt-2">
        By <span className="font-semibold">{post.author}</span> •{" "}
        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
      </div>

      <h4 className="text-blue-500 mt-1">{post.category?.name}</h4>

      <p className="mt-4 text-gray-800 leading-relaxed">{post.content}</p>
    </div>
  );
};

export default SinglePost;
