import React, { useEffect } from "react";
import "./Contact.css";

function Contact() {
  useEffect(() => {

    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
  }, [])
  return (
    <>
      <div className="banner contact">
        <div>

        <h1>CONTACT US</h1>
        <span>Business to grow business..</span>
        <span>
          Our aim is to accelerate and ease the purchasing process for retailers
        </span>
        </div>
      </div>
      <div className="contact-content">
        <p>
          ASAANMED would love to hear your reviews. In cas eof any complains or
          confusion you can contact us on the mentioned contact numbers or send us an email at the mentioned address
        </p>
        <p style={{fontWeight: 'bold'}}>Email: <span>asaanmedNew@gmail.com </span></p>
        <p style={{fontWeight: 'bold'}}>Contact: <span>+923362108399</span></p>
      </div>
    </>
  );
}

export default Contact;
