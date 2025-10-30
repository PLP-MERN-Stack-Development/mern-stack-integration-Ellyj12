import useApi from "../src/hooks/api.js";
const PostsList = () => {
  const { data: posts, loading, error } = useApi("http://localhost:5000/api/posts");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!posts) return <p>No posts found</p>;

  return (
    <div className="">
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <strong>{post.title}</strong> - {post.category?.name || "No Category"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
