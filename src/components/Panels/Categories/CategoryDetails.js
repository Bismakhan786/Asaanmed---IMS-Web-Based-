import React, {useState, useRef} from "react";
import "./Categories.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SketchPicker } from "react-color";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import { updateCategory } from "../../../Redux/slices/CategoriesSlice";

const CategoryDetails = () => {
  const location = useLocation();
  const data = location.state;

  let category = {
    name: "",
    color: "",
  };
  if (data) {
    category = data[0];
  }

  const {updationInProcess, updationError} = useSelector(state => state.categories)
  const [name, setName] = useState(category.name);
  const [currentColor, setCurrentColor] = useState(category.color);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const toastId = useRef(null);
  const dispatch = useDispatch()
 

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
    toastId.current = toast("Updating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    const newCat = {
      name,
      color: currentColor,
    };

    dispatch(updateCategory({id: category._id, newData: newCat}));
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
      PanelName={"Category Details"}
      MainLayout={
        <div className="cat-form-main">
        {!updationInProcess &&
          toast.update(toastId.current, {
            render: "Updated Successfully!",
            type: toast.TYPE.SUCCESS,
            icon: <SuccessIcon className="successIcon" />,
            autoClose: 5000,
          })}
        {updationError &&
          toast.update(toastId.current, {
            render: updationError,
            type: toast.TYPE.ERROR,
            icon: <ErrorIcon className="errorIcon" />,
            autoClose: 5000,
          })}
        <CustomToast />
        <div className="cat-form-container">
          <div className="nameInput">
            <label>Name:</label>
            <input
              type={"text"}
              placeholder={"Category Name"}
              required
              disabled={updationInProcess}
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
                <SketchPicker color={currentColor} onChange={handleChange} />
              </div>
            )}
          </div>

          <div className={"createBtn"}>
            <button onClick={handleSubmit}>Update</button>
          </div>
        </div>
      </div>
      }
    />
  );
};

export default CategoryDetails;
