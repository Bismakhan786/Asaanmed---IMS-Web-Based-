import React, { useEffect } from "react";
import "./Home.css";
import { abbott, bosch, getz, hilton, bh, atco, martin, searle } from "../../companiesLogo";

import {Link} from "react-router-dom"

const plan = {
  name: "B2B",
  abbr: "Business-to-Business",
  desc: `
  ASAANMED was founded by two young Entrepreneurs who were inspired
  by a desire to serve the people of Karachi an affordable and
  accessible alternative to buying medicines.
`,
  listOPtions: ["300+ Medical products", "Order 24/7", "Get next day delivery"],
  image: "/b2b22.png",
};
const Home = () => {
  useEffect(() => {

    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
  }, [])
  return (
    <>
      <div className="banner">
        
        <div>
          <img src={"/icon.png"} alt=""/>
          <h1>WELCOME TO ASAANMED</h1>
          <span>Business to grow business..</span>
          <span>
            Our aim is to accelerate and ease the purchasing process for
            retailers
          </span>
          <Link to={"/about"}>
          
          <button>Know More</button>
          </Link>
        </div>
        <div>
            <img src="/bg.png" alt=""/>
          
        </div>
      </div>
      <div id="container">
        <div className="cards-cont">
          <div>
            <p>300+</p>
            <p>Products</p>
          </div>
          <div>
            <p>PKR. 1B+</p>
            <p>Volume</p>
          </div>
          <div>
            <p>50+</p>
            <p>Employees</p>
          </div>
        </div>
        <h2 className="plansHeading">Plan</h2>
        <div className="carousal">
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
              <img src={plan.image} alt=""/>
            </div>
          </div>
        </div>
        <h2 className="plansHeading">Products From</h2>
        <div className="partners-logo">
          <div>
            <img src={bosch} alt=""/>
            <img src={getz} alt=""/>
            <img src={bh} alt=""/>
            <img src={martin} alt=""/>
            <img src={hilton} alt=""/>
            <img src={searle} alt=""/>
            <img src={abbott} alt=""/>
            <img src={atco} alt=""/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
