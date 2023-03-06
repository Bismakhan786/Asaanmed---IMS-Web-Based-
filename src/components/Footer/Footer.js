import React from "react";
import "./Footer.css";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="Footer">
      <div>
      <div className="footer-logo">
        <img src={"/icon.png"} alt=""/>
        <p>
          <CopyrightIcon /> Copyright, 2022, asaanmed
        </p>
      </div>
      <div className="links">
        <p>Important Links</p>
        <Link to={"/about"}>About</Link>
        <Link to={"/contact"}>Contact</Link>
      </div>
      
      </div>

    </div>
  );
};

export default Footer;
