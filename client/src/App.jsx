import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/homePage";
import { useState } from "react";
import PostsPage from "./pages/postsPage";
import SinglePost from "./pages/singlePost";


const Layout = () => {


  const [isOpen ,setIsOpen] = useState(false)
  const toggleNav = ()=>{
    setIsOpen(prev=>!prev)
  }
  const location = useLocation();
  const hideNavbarOn = ["/"]; 

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar isOpen={isOpen} toggleNav={toggleNav} />}

      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/Home" element={<HomePage/>}/>
        <Route path="/Posts" element={<PostsPage/>}/>
        <Route path="/post/:id" element={<SinglePost />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
