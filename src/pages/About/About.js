import React, { useEffect } from "react";
import "./About.css";

function About() {

  useEffect(() => {

    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
  }, [])
  return (
    <>
      <div className="banner about">
        <div>

        <h1>ABOUT US</h1>
        <span>Business to grow business..</span>
        <span>
          Our aim is to accelerate and ease the purchasing process for retailers
        </span>
        </div>

      </div>
      <div className="body-container">
        <div className="who-are-we">
          <div>
            <p>Who</p>
            <p>we</p>
            <p>are.</p>
          </div>
          <div>
            ASAANMED was formed in the year 2020 by Rauf Ashfaq and Sheeraz
            Khan. It is one of the leading medicine trading company of Karachi
            offering market leading discount offers to wholesalers and
            retailers. ASAANMED is dedicated to providing better service and
            quality medicine products to a large number of customers who are
            looking for medical supplies at affordable prices. We offer a wide
            range of over 6,500 different medicines from top pharma companies at
            great prices. An extensive range of medical products like Abocran
            Sachet, Risek, etc. are also available at amazing discounts with us
            which can only be found here at ASAANMED.
          </div>
        </div>
        <div className="founders-cont">
          <h2>Founders</h2>

          <div className="founder2">
            <div className="founder-img-div">
              <img src="/ra.jpg" alt="" />
              <div></div>
            </div>
            <div className="founder-details-div">
              <p>Rauf Ashfaq</p>
              <p>
                He is a passionate business man whose mission is to spread
                awareness to people about the pros of doing business instead of
                9-5 job. In 2019, he thought of transforming the life of himself
                and others by a successful business and eventually build one by
                the time 2020, now named as ASAANMED. He has gone through many
                ups and downs in his journey but he hever loose the courage and
                continue to work.
              </p>
            </div>
          </div>
          <div className="founder1">
            <div className="founder-details-div">
              <p>Sheeraz Khan</p>
              <p>
                A hard-worker, well planner, and a source of inspiration.
                Sheeraz Khan joined ASAANMED in 2020 as a Co-Founder.He worked
                for day and night fr the growth of ASAANMED. Today he is dealing
                with almost 10 employees under him and 60 areas.
              </p>
            </div>
            <div className="founder-img-div">
              <img src="/sk.jpg" alt=""/>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
