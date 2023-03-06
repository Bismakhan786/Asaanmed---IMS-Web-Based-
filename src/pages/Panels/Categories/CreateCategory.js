import React, { useRef, useState } from "react";
import "./Categories.css";
import PanelLayout from "../../../components/PanelLayout/PanelLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
} from "../../../Redux/slices/CategoriesSlice";
import { SketchPicker } from "react-color";
import CustomToast from "../../../components/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [currentColor, setCurrentColor] = useState("#e37e38");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const toastId = useRef(null);

  const dispatch = useDispatch();
  const { creationInProcess, creationError } = useSelector(
    (state) => state.categories
  );

  const handleChange = (color) => {
    setCurrentColor(color.hex);
  };

  const handleClick = () => {
    setDisplayColorPicker(true);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleSubmit = () => {
    toastId.current = toast("Creating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    const newCat = {
      name,
      color: currentColor,
    };

    dispatch(addCategory(newCat));
  };
  const color = {
    width: "10vmax",
    height: "1.5vmax",
    borderRadius: "5px",
    background: currentColor,
  };
  const swatch = {
    padding: "5px",
    background: "#fff",
    borderRadius: "5px",
    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
    display: "inline-block",
    cursor: "pointer",
  };
  const popover = {
    position: "absolute",
    zIndex: "2",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <PanelLayout
      PanelName={"Create Category"}
      MainLayout={
        <div className="cat-form-main">
          {!creationInProcess &&
            toast.update(toastId.current, {
              render: "Created Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {creationError &&
            toast.update(toastId.current, {
              render: creationError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          <CustomToast />
          <div className="cat-form-container">
            <div className="nameInput">
              <label>Name:</label>
              <input
                type={"text"}
                placeholder={"Category Name"}
                required
                disabled={creationInProcess}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <div className="colorInput">
                <span>Color: </span>
                <div>
                  <div style={swatch} onClick={handleClick}>
                    <div style={color} />
                  </div>
                  <span>{currentColor}</span>
                </div>
              </div>
              {displayColorPicker && (
                <div style={popover}>
                  <div style={cover} onClick={handleClose} />
                  <SketchPicker color={color} onChange={handleChange} />
                </div>
              )}
            </div>

            <div className={"createBtn"}>
              <button onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default CreateCategory;
