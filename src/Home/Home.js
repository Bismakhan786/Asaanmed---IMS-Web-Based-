import React from "react";
import "./Home.css";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Carousel from "react-material-ui-carousel";
import logo from "../logo.png";
import b2b from "../b2b.png";
import abbott from "../companiesLogo/abbott.jpg";
import bosch from "../companiesLogo/bosch.png";
import getz from "../companiesLogo/getz.png";
import hilton from "../companiesLogo/hilton.png";
import bh from "../companiesLogo/bh.jpg";
import atco from "../companiesLogo/atco.png";
import martin from "../companiesLogo/martin.png";
import searle from "../companiesLogo/searle.png";

const plan = {
  name: "B2B",
  abbr: "Business-to-Business",
  desc: "Now, Physicist and medical store retailers don't have to worry about developing an online platform for their shops. We are prividing them this facility through our application. All they have to do is",
  listOPtions: [
    "Register their shop",
    "Complete verification Process",
    "Sell medicines and earn profits",
  ],
  image: b2b,
};
const Home = () => {
  return (
    <>
      <div className="banner">
        <div className="background">
          <div>
            <img src="/bg2.png" />
          </div>
          <div>
            <img src="/bg-img2.png" />
          </div>
        </div>
        <img src={logo} />
        <p>Hellow World</p>
        <h1>WELCOME TO ASAANMED</h1>
        <span>Business to grow business..</span>
        <span>Our aim is to accelerate the process of purchasing for retailers</span>

        {/* <a href="#container">
          <button>
            <ExpandMoreRoundedIcon />
          </button>
        </a> */}
      </div>
      <div id="container">
        <h2 className="plansHeading">Plan</h2>
        <div className="carousal">
          {/* <Carousel >
            {plans.map((plan, index) => (
              
            ))}
          </Carousel> */}
          <div className="carousal-items">
            <div className="carousal-details">
              <h2>{plan.name}</h2>
              <span>{plan.abbr}</span>
              <p>{plan.desc}</p>
              <ul>
                {plan.listOPtions.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
            <div className="carousal-img">
              <img src={plan.image} />
            </div>
          </div>
        </div>
        <h2 className="plansHeading">Products From</h2>
        <div className="partners-logo">
          <div>
            <img src={bosch} />
            <img src={getz} />
            <img src={bh} />
            <img src={martin} />
            <img src={hilton} />
            <img src={searle} />
            <img src={abbott} />
            <img src={atco} />
            <img src={bosch} />
            <img src={getz} />
            <img src={bh} />
            <img src={martin} />
            <img src={hilton} />
            <img src={searle} />
            <img src={abbott} />
            <img src={atco} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
