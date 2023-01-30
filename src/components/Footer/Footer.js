import React from "react";
import "./Footer.css";
import logo from "../../logo2.png";
import playstore from "../../companiesLogo/playstoreapp.png";
import appstore from "../../companiesLogo/appStoreapp.png";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="links">
        <p>Important Links</p>
        <Link to={"/about"}>About</Link>
        <Link to={"/contact"}>Contact</Link>
        <Link to={"/login"}>Login</Link>
      </div>
      <div className="footer-logo">
        <img src={logo} />
        <p>
          <CopyrightIcon /> Copyright, 2022, asaanmed
        </p>
      </div>
      <div className="download">
        <a href="#">
          <img src={playstore} />
        </a>
        <a href="#">
          <img src={appstore} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
