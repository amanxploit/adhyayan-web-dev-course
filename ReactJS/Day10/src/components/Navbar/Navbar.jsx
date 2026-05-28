import React from "react";
import NavLogo from "./NavLogo";
import Navmenus from "./Navmenus";
import NavIcons from "./NavIcons";

const Navbar = () => {
  return (
    <div className="bg-white m-5 rounded-4xl p-5 flex justify-between">
      <NavLogo/>
      <Navmenus/>
      <NavIcons/>      
    </div>
  );
};

export default Navbar;
