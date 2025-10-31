import { Link, useNavigate } from "react-router-dom";

const PostCard = ({ post, user, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 shadow rounded relative">
      <Link to={`/post/${post._id}`}>
        <h1 className="font-bold text-lg wrap-break-word">{post.title}</h1>
        <h4 className="text-blue-500">{post.category?.name}</h4>
        <p className="text-gray-700 text-sm mt-2 wrap-break-word overflow-hidden line-clamp-3">
          {post.excerpt}
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
            onClick={() => onDelete(post._id)}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
