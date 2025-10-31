import navbarArray from "./navbarArray";
import { FaAlignLeft } from "react-icons/fa6";
import { useLocation } from "react-router-dom";

const Navbar = ({ toggleNav, isOpen }) => {
  const location = useLocation();

  return (
    <nav className="border flex flex-col md:flex-row gap-5 p-5 items-start md:items-center justify-between relative">
     
      <FaAlignLeft
        className={`text-2xl block md:hidden cursor-pointer ${
          isOpen ? "text-green-500" : "text-red-600"
        }`}
        onClick={toggleNav}
      />

    
      <div className="hidden md:block">
        <ul className="flex gap-5">
          {navbarArray.map((item, index) => {
            const isActive = location.pathname === item.Path;
            return (
              <li key={index}>
                <a
                  href={item.Path}
                  className={isActive ? "text-blue-500 font-bold" : ""}
                >
                  {item.Label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

   
      {isOpen && (
        <>
         
          <div 
            className="fixed inset-0 bg-black/40 md:hidden z-40"
            onClick={toggleNav}
          ></div>

          <div className="fixed top-16 left-0 w-full bg-white md:hidden z-50 animate-slideDown">
            <ul className="flex flex-col gap-4 bg-gray-100 p-4 shadow-lg border-b">
              {navbarArray.map((item, index) => {
                const isActive = location.pathname === item.Path;
                return (
                  <li key={index}>
                    <a
                      href={item.Path}
                      className={`block py-2 ${
                        isActive ? "text-blue-500 font-bold" : ""
                      }`}
                      onClick={toggleNav}
                    >
                      {item.Label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
