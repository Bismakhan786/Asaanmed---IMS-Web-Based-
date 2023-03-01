import React, { useState } from "react";
import "./Header.css";
import { MdClose, MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";

function Header() {
    const [menu, showMenu] = useState(false)
  return (
    <div className="Header">
      <Link to={"/"}>
      <p>ASAANMED Ltd.</p>
      </Link>
      <div className="menu">
        <Link to={"/about"}>About</Link>
        <Link to={"/contact"}>Contact</Link>
      </div>
      <div className="menu-icon">
        {menu ? (
            <MdClose onClick={() => showMenu(false)}/>
        ) : (

        <MdMenu onClick={() => showMenu(!menu)}/>
        )}
      </div>
      {menu && (
      
      <div className="hidden-menu">
        <Link to={"/about"}>About</Link>
        <Link to={"/contact"}>Contact</Link>
      </div>

      )}
    </div>
  );
}

export default Header;
