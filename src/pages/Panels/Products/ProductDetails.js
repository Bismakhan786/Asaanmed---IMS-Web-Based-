import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PanelLayout from "../../../components/PanelLayout/PanelLayout";
import "./Products.css";

import Dropdown from "../../../components/Dropdown/Dropdown";
import { getAllCategories } from "../../../Redux/slices/CategoriesSlice";
import { updateProduct } from "../../../Redux/slices/ProductsSlice";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import CustomToast from "../../../components/Toast/CustomToast";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from '@mui/icons-material/ErrorRounded';



const ProductDetails = () => {
  const location = useLocation();
  const data = location.state;
  let product = {
    name: "",
    code: "",
    offer: "",
    desc: "",
    price: "",
    stock: "",
    cat: { _id: "", name: "" },
    status: "",
    image: [{ url: "" }],
  };

  if (data) {
    product = data[0];
  }


  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);
  const { updationInProcess, updationError } = useSelector(
    (state) => state.products
  );

  const [name, setName] = useState(product.name);
  const [code, setCode] = useState(product.code);
  const [desc, setDesc] = useState(product.desc);
  const [price, setPrice] = useState(product.price);
  const [offer, setOffer] = useState(product.offer);
  const [afterDisc, setAfterDisc] = useState(price);
  const [stock, setStock] = useState(product.stock);
  const [image, setImage] = useState(product.image[0].url);
  const [imagePreview, setImagePreview] = useState(product.image[0].url);
  const [category, setCategory] = useState({
    id: product.cat._id,
    value: product.cat.name,
    label: product.cat.name
  });
  const [status, setStatus] = useState({value: product.status, label: product.status});

  const [disableEditing, setDisableEditing] = useState(true);
  const [disableEditBtn, setDisableEditBtn] = useState(false);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);
  const toastId = useRef(null);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);



  const handleEdit = (e) => {
    e.preventDefault();
    setDisableEditing(false);
    setDisableEditBtn(true);
    setDisableUpdateBtn(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setDisableEditing(true);
    setDisableUpdateBtn(true);
    setDisableEditBtn(false);

    toastId.current = toast("Updating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    const newData = {
      name,
      code,
      offer,
      price,
      desc,
      image,
      status: status.value,
      stock,
      cat: category.id,
    };

    dispatch(updateProduct({ id: product._id, newData }));
  };

  const uploadImage = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  let categoryOptions = [];
  categories &&
    categories.map((cat) => {
      categoryOptions.push({
        value: cat.name,
        label: cat.name,
        id: cat._id,
      });
    });

  const statusOptions = [
    {
      value: "Available",
      label: "Available",
    },
    {
      value: "Unavailable",
      label: "Unavailable",
    },
  ];

  

  return (
    <>
      {!updationInProcess &&
        toast.update(toastId.current, {
          render: "Updated Successfully",
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
      <PanelLayout
        PanelName={"Product Details"}
        MainLayout={
          <div className="product-details-main-container">
            <div className="stats-1">
              <div>
                <div className="updateImage">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "5vmax", height: "auto" }}
                  />
                  <input
                    style={{ width: "7vmax" }}
                    type={"file"}
                    name={"image"}
                    accept={"image/png, image/jpeg, image/jpg"}
                    onChange={uploadImage}
                    disabled={disableEditing}
                  />
                </div>

                <div className="updateBtn">
                  <button disabled={disableUpdateBtn} onClick={handleUpdate}>
                    Update
                  </button>
                  <button disabled={disableEditBtn} onClick={handleEdit}>
                    Edit
                  </button>
                </div>
              </div>
              <div className="form-fields">
                <div>
                  <div>
                    <label for={"name"}>Product Name:</label>
                    <input
                      type={"text"}
                      name={"name"}
                      placeholder={"Product Name"}
                      required
                      disabled={disableEditing}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
              <label for={"code"}>Code:</label>
              <input
                type={"text"}
                name={"code"}
                placeholder={"Product Code"}
                disabled={disableEditing}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
                  <div>
                    <label for={"price"}>Price:</label>
                    <input
                      type={"text"}
                      name={"price"}
                      placeholder={"Price"}
                      required
                      disabled={disableEditing}
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setAfterDisc(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label for={"stock"}>Stock:</label>
                    <input
                      type={"number"}
                      name={"stock"}
                      placeholder={"Stock"}
                      required
                      disabled={disableEditing}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label for={"disc"}>Offer:</label>
                    <input
                      type={"text"}
                      name={"disc"}
                      placeholder={"Discount"}
                      value={offer}
                      disabled={disableEditing}
                      onChange={(e) => {
                        setOffer(e.target.value);
                        const discAmount =
                          Number(price) * Number(e.target.value);
                        const afterDiscAmount = Number(price) - discAmount;
                        setAfterDisc(afterDiscAmount);
                      }}
                    />
                  </div>
                  <div>
                    <label for={"afterDisc"}>After Discount:</label>
                    <input
                      type="text"
                      name="afterDisc"
                      value={afterDisc}
                      disabled
                      placeholder="After Discount"
                    />
                  </div>
                  <div>
                    <label for={"cat"}>Category:</label>
                    <Dropdown
                      defaultValue={category}
                      disabled={disableEditing}
                      options={categoryOptions}
                      name={"cat"}
                      placeholder={"-- Category --"}
                      onChange={(e) => setCategory({ id: e.id, value: e.value, label: e.label })}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label for={"status"}>Status:</label>
                    <Dropdown
                      defaultValue={status}
                      disabled={disableEditing}
                      options={statusOptions}
                      name={"status"}
                      placeholder={"-- Status --"}
                      onChange={(e) => setStatus({value: e.value, label: e.label})}
                    />
                  </div>
                  <div className="product-desc">
                    <label for={"desc"}>Description:</label>
                    <textarea
                      rows={2}
                      name={"desc"}
                      placeholder={"Description"}
                      value={desc}
                      required
                      disabled={disableEditing}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        }
      />
    </>
  );
};

export default ProductDetails;
