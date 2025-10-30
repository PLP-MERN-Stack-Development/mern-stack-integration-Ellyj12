
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import Navbar from "./components/navbar";
import HomePage from "./pages/homePage";

function App() {


  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
      </Routes>
    </Router>
  )
}

export default App
