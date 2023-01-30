import React from "react";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
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

