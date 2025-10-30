import { useState } from "react";
import useApi from "../hooks/api"; 

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data, error, fetchData } = useApi("/api/auth/login", "POST");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData({ email, password });
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "calc(100vh - 66px)" }}
    >
      <div className="border-2 lg:w-1/2 lg:h-2/3 md:w-1/2 md:h-2/3 w-3/4 h-3/4 p-8 flex flex-col justify-center">
        <h2 className="text-center mb-4 text-xl font-bold">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {data && <p className="text-green-500 mt-2">Login successful!</p>}
      </div>
    </div>
  );
};

export default HomePage;
