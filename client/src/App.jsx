import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import { useState } from "react";
import PostsPage from "./pages/postsPage";
import SinglePost from "./pages/singlePost";
import EditPostPage from "./pages/editPage";
import PostCreationPage from "./pages/postCreation";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNav = () => {
    setIsOpen(prev => !prev);
  };
  const location = useLocation();
  const hideNavbarOn = ["/login"]; 

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar isOpen={isOpen} toggleNav={toggleNav} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Posts" element={<PostsPage />} />
        <Route path="/post/:id" element={<SinglePost />} />

        {/* Protected routes */}
        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute user={user}>
              <EditPostPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute user={user}>
              <PostCreationPage user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  // load user from localStorage
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  return (
    <Router>
      <Layout user={user} />
    </Router>
  );
}

export default App;
