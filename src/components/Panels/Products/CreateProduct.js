import React, { useEffect, useRef, useState } from "react";
import "./Products.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import Loading from "../../../Shared/Loader/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../../Redux/slices/CategoriesSlice";
import Dropdown from "../../../Shared/Dropdown/Dropdown";
import { addProduct } from "../../../Redux/slices/ProductsSlice";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from '@mui/icons-material/ErrorRounded';

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [disc, setDisc] = useState("");
  const [afterDisc, setAfterDisc] = useState(price);
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("/defaultProduct.png");
  const [imagePreview, setImagePreview] = useState("/defaultProduct.png");
  const [category, setCategory] = useState();
  const [status, setStatus] = useState();
  const toastId = useRef(null);

  const dispatch = useDispatch();
  const { loading, categories } = useSelector((state) => state.categories);
  const { creationInProcess, creationError } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

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

  const submitForm = (e) => {
    e.preventDefault();

    toastId.current = toast("Creating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    const product = {
      name,
      price,
      disc,
      desc,
      image,
      status,
      stock,
      cat: category.id,
    };

    console.log(category)
    // dispatch(addProduct(product));
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
    <PanelLayout
      PanelName={"Create Product"}
      MainLayout={
        loading ? (
          <Loading />
        ) : (
          <div className="product-form-container">
            {!creationInProcess &&
              toast.update(toastId.current, {
                render: "Created Successfully!",
                type: toast.TYPE.SUCCESS,
                icon: <SuccessIcon className="successIcon" />,
                autoClose: 5000,
              })}
              {creationError &&
              toast.update(toastId.current, {
                render: creationError,
                type: toast.TYPE.ERROR,
                icon: <ErrorIcon className="errorIcon" />,
                autoClose: 5000,
              })}
            <CustomToast />
            <div className="select-image">
              <div>
                <input
                  type={"file"}
                  name={"image"}
                  disabled={creationInProcess}
                  accept={"image/png, image/jpeg, image/jpg"}
                  onChange={uploadImage}
                />
              </div>
              <div>
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{ width: "6vmax", height: "auto" }}
                />
              </div>
            </div>
            <div>
              <label for={"name"}>Product Name:</label>
              <input
                type={"text"}
                name={"name"}
                placeholder={"Product Name"}
                disabled={creationInProcess}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label for={"price"}>Price:</label>
              <input
                type={"text"}
                name={"price"}
                placeholder={"Price"}
                disabled={creationInProcess}
                required
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
                disabled={creationInProcess}
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <label for={"disc"}>Discount:</label>
              <input
                type={"text"}
                name={"disc"}
                placeholder={"Discount"}
                disabled={creationInProcess}
                value={disc}
                onChange={(e) => {
                  setDisc(e.target.value);
                  const discAmount = Number(price) * Number(e.target.value);
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
                defaultValue={categoryOptions[0]}
                options={categoryOptions}
                disabled={creationInProcess}
                name={"cat"}
                placeholder={"-- Category --"}
                onChange={(e) => setCategory({ id: e.id, name: e.value })}
              />
            </div>
            <div>
              <label for={"status"}>Status:</label>
              <Dropdown
                defaultValue={statusOptions[0]}
                options={statusOptions}
                disabled={creationInProcess}
                name={"status"}
                placeholder={"-- Status --"}
                onChange={(e) => setStatus(e.value)}
              />
            </div>
            <div className="product-desc">
              <label for={"desc"}>Description:</label>
              <textarea
                rows={3}
                disabled={creationInProcess}
                name={"desc"}
                placeholder={"Description"}
                value={desc}
                required
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className={"product-btns"}>
              <button onClick={submitForm} disabled={creationInProcess}>Create</button>
              <button>Import</button>
            </div>
          </div>
        )
      }
    />
  );
};

export default CreateProduct;
