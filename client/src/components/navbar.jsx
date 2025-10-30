import navbarArray from "./navbarArray";
import { FaAlignLeft } from "react-icons/fa6";

const Navbar = (className) => {
  console.log(navbarArray);
  return (
    <nav className="border flex gap-5 p-5 items-center justify-between">
      <FaAlignLeft className="text-2xl block md:hidden" />

      <div className="hidden md:block">
        <ul className="flex gap-5">
          {navbarArray.map((i, index) => (
            <li key={index}>
              <a href={i.Path}>{i.Label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
