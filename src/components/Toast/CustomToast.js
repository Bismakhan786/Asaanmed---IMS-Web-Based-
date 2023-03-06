import React from "react";
import { Slide } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './CustomToast.css'

const CustomToast = () => {
  return (
    <ToastContainer
      draggable={false}
      hideProgressBar
      transition={Slide}
      theme="dark"
      position="bottom-right"
    />
  );
}

export default CustomToast;

