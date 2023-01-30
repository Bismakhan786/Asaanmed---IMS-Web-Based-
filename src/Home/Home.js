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

const plans = [
  {
    name: "B2C",
    abbr: "Business-to-Consumer",
    desc: "We provide a responsive, user-friendly, easily configured application for both Play Store and AppStore, where one can",
    listOPtions: [
      "Browse medicines of all categories",
      "Place instant order",
      "Get their order delivered in approximately 2 hours",
    ],
    image: b2b,
  },
  {
    name: "B2B",
    abbr: "Business-to-Business",
    desc: "Now, Physicist and medical store retailers don't have to worry about developing an online platform for their shops. We are prividing them this facility through our application. All they have to do is",
    listOPtions: [
      "Register their shop",
      "Complete verification Process",
      "Sell medicines and earn profits",
    ],
    image: b2b,
  },
];

const Home = () => {
  return (
    <>
      <div className="banner">
        <img src={logo} />
        <p>Hellow World</p>
        <h1>WELCOME TO ASAANMED</h1>
        <span>Want to know about our plans and services?</span>
        <span>Happy Scroll 😊</span>

        <a href="#container">
          <button>
            <ExpandMoreRoundedIcon />
          </button>
        </a>
      </div>
      <div id="container">
        <h2 className="plansHeading">Our Plans</h2>
        <div className="carousal">
          <Carousel>
            {plans.map((plan, index) => (
              <div key={index} className="carousal-items">
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
            ))}
          </Carousel>
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
          </div>
          <div>
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
