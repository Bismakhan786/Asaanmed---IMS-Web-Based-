import React, { useEffect, useRef, useState } from "react";
import "./Products.css";
import PanelLayout from "../../../components/PanelLayout/PanelLayout";
import Loading from "../../../components/Loader/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../../Redux/slices/CategoriesSlice";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { addProduct } from "../../../Redux/slices/ProductsSlice";
import CustomToast from "../../../components/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import { getMediaFromAPI } from "../../../Redux/slices/MediaSlice";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/CloseRounded";

const customStyles = {
  content: {
    top: "15%",
    left: "15%",
    right: "15%",
    bottom: "10%",
  },
};

Modal.setAppElement("#root");

const CreateProduct = () => {
  const toastId = useRef(null);

  const dispatch = useDispatch();
  const { loading, categories } = useSelector((state) => state.categories);
  const { media } = useSelector((state) => state.media);
  const { creationInProcess, creationError } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getMediaFromAPI());
  }, [dispatch]);

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

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [stockError, setStockError] = useState("");
  const [afterDisc, setAfterDisc] = useState(price);
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("/defaultProduct.png");
  const [category, setCategory] = useState(
    categoryOptions.length > 0 && categoryOptions[0]
  );
  const [status, setStatus] = useState(statusOptions[0]);
  const [showMedia, setShowMedia] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  function openModal() {
    setShowMedia(false)
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSelectImageFromMedia = (public_id, url) => () => {
    
    setImagePreview(url)
    setImage(url)

    setIsOpen(false)
  }

  const uploadImage = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
    setIsOpen(false)

  };

  const submitForm = (e) => {
    e.preventDefault();

    toastId.current = toast("Creating....", {
      icon: <Spinner size={10} color={"white"} />,
    });

    if(!name || !code || !offer || !price || !desc || !status || !category || !stock){
      toast.update(toastId.current, {
        render: "Please provide product details",
        type: toast.TYPE.ERROR,
        icon: <ErrorIcon className="errorIcon" />,
        autoClose: 1000,
      })
    }
    else{
      let product = {};
      if (image) {
        product = {
          name,
          code,
          offer,
          price,
          desc,
          image,
          status: status.value,
          stock,
          cat: category?.id,
        };
      } 
      else {
        product = {
          name,
          code,
          offer,
          price,
          desc,
          status: status.value,
          stock,
          cat: category?.id,
        };
      }
  
      console.log(product);
      dispatch(addProduct(product));
      setName("");
      setCode("");
      setOffer("");
      setPrice("");
      setDesc("");
      setStatus({});
      setStock("");
      setCategory({});
      setImage("");
      setAfterDisc("");
    }

    

    
  };

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
                autoClose: 1000,
              })}
            {creationError &&
              toast.update(toastId.current, {
                render: creationError,
                type: toast.TYPE.ERROR,
                icon: <ErrorIcon className="errorIcon" />,
                autoClose: 1000,
              })}
            <CustomToast />
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Upload More Modal"
            >
              <div>
                <button onClick={closeModal} className="modal-close-btn">
                  <CloseIcon />
                </button>
                {!showMedia ? (
                  <div
                    className="upload-media-div"
                    style={{ height: "auto" }}
                    // onDragOver={handleDragOver}
                    // onDrop={handleDrop}
                  >
                    <div
                      style={{ height: "65vh", backgroundColor: "transparent" }}
                      // onDragEnter={dragEnter}
                      // onDragLeave={dragLeave}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: 18,
                        }}
                      >
                        Product Image
                      </p>
                      <button
                        className="product-image-btn"
                        onClick={() => setShowMedia(true)}
                      >
                        Select From Media
                      </button>
                      <input
                        type={"file"}
                        name={"image"}
                        disabled={creationInProcess}
                        accept={"image/png, image/jpeg, image/jpg"}
                        onChange={uploadImage}
                        hidden
                        ref={inputRef}
                      />
                      <button
                        className="product-image-btn"
                        onClick={() => inputRef.current.click()}
                      >
                        Select From Device Files
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                      <p style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>Media Files</p>
                    <div
                      className="parent-image-container"
                      style={{ height: "60vh" }}
                    >
                      <div className="images-container">
                        {media &&
                          media.map((image, index) => (
                            <div key={index} className="image select-from-media-img" onClick={handleSelectImageFromMedia(image.public_id, image.url)}>
                              <img
                                src={image.url}
                                height="100"
                                alt=""
                                // style={{ height: "100px", width: "auto", }}
                              />
                              <p>{image.name}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Modal>
            <div className="select-image">
              <button onClick={openModal}>Select Image</button>
              <div>
                {/* <input
                    type={"file"}
                    name={"image"}
                    disabled={creationInProcess}
                    accept={"image/png, image/jpeg, image/jpg"}
                    onChange={uploadImage}
                  /> */}
              </div>
              <div>
                <img
                  src={imagePreview}
                  alt="Preview"
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
              <label for={"code"}>Code:</label>
              <input
                type={"text"}
                name={"code"}
                placeholder={"Product Code"}
                disabled={creationInProcess}
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
              <label for={"offer"}>Offer:</label>
              <input
                type={"text"}
                name={"offer"}
                placeholder={"Discount Offer"}
                disabled={creationInProcess}
                value={offer}
                onChange={(e) => {
                  setOffer(e.target.value);
                  const discAmount =
                    Number(price) * (Number(e.target.value) / 100);
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
              <label for={"stock"}>Stock:</label>
              <input
                type={"number"}
                name={"stock"}
                placeholder={"Stock"}
                disabled={creationInProcess}
                required
                value={stock}
                onChange={(e) => {
                  setStockError("");
                  if (e.target.value < 0) {
                    setStockError(
                      "Stock can't be negative, it can either be 0 or positive!"
                    );
                  } else {
                    setStock(e.target.value);
                  }
                }}
              />
            </div>

            {stockError && <p style={{ color: "red" }}>{stockError}</p>}

            <div>
              <label for={"cat"}>Category:</label>
              <Dropdown
                // defaultValue={categoryOptions[0]}
                options={categoryOptions}
                disabled={creationInProcess}
                name={"cat"}
                placeholder={"-- Category --"}
                onChange={(e) =>
                  setCategory({ id: e.id, name: e.value, label: e.value })
                }
              />
            </div>
            <div>
              <label for={"status"}>Status:</label>
              <Dropdown
                // defaultValue={statusOptions[0]}
                options={statusOptions}
                disabled={creationInProcess}
                name={"status"}
                placeholder={"-- Status --"}
                onChange={(e) => setStatus({ value: e.value, label: e.value })}
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
              <button onClick={submitForm} disabled={creationInProcess}>
                Create
              </button>
            </div>
          </div>
        )
      }
    />
  );
};

export default CreateProduct;
