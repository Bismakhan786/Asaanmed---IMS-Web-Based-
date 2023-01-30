import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import "./Products.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Dropdown from "../../../Shared/Dropdown/Dropdown";
import { getAllCategories } from "../../../Redux/slices/CategoriesSlice";
import { updateProduct } from "../../../Redux/slices/ProductsSlice";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import CustomToast from "../../../Shared/Toast/CustomToast";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from '@mui/icons-material/ErrorRounded';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  LineElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

const ratingsOptions = {
  elements: {
    bar: {
      borderWidth: 0.5,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Ratings from the Past 1 Year",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const productSalesOption = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Sale from the Past 1 Year",
    },
  },
};


const ProductDetails = () => {
  const location = useLocation();
  const data = location.state;
  let product = {
    name: "",
    desc: "",
    price: "",
    disc: "",
    stock: "",
    cat: { _id: "", name: "" },
    status: "",
    image: [{ url: "/defaultProduct.png" }],
  };

  let reviews = [];
  if (data) {
    product = data[0];
    reviews = product.reviews;
  }

  console.log(reviews)

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);
  const { updationInProcess, updatedProduct, updationError } = useSelector(
    (state) => state.products
  );

  const [name, setName] = useState(product.name);
  const [desc, setDesc] = useState(product.desc);
  const [price, setPrice] = useState(product.price);
  const [disc, setDisc] = useState(product.disc);
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

  const [userReviews, setUserReviews] = useState(reviews);
  const [readMore, setReadMore] = useState(false);
  const [disableEditing, setDisableEditing] = useState(true);
  const [disableEditBtn, setDisableEditBtn] = useState(false);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);
  const toastId = useRef(null);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);


  const ratingsData = {
    labels,
    datasets: [
      {
        type: "bar",
        data: [0, 1, 1.3, 3, 3.1, 3.7, 2.5, 4, 4.2, 4.5, 4.9, 5],
        borderColor: "rgb(248, 163, 60)",
        backgroundColor: "rgba(248, 163, 60, 0.5)",
        hoverBackgroundColor: "rgb(248, 163, 60)",
      },
      {
        type: "line",
        tension: 0.5,
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1.5,
        pointRadius: 2,
        fill: false,
        data: [0, 1, 1.3, 3, 3.1, 3.7, 2.5, 4, 4.2, 4.5, 4.9, 5],
      },
    ],
  };

  const productSalesData = {
    labels,
    datasets: [
      {
        data: [12, 19, 3, 5, 3, 10, 60, 40, 12, 30, 58, 26],
        borderColor: "rgb(85, 170, 127)",
        backgroundColor: "rgba(85, 170, 127, 0.5)",
        hoverBackgroundColor: "rgb(85, 170, 127)",
        pointRadius: 2,
        borderWidth: 1,
        tension: 0.5,
        fill: true,
      },
    ],
  };

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
      price,
      disc,
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

  const revs = [
    {
      name: "Bisma Khan",
      date: "Oct 17, 2020",
      comment:
        "This product is so helpfulzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
    },
    {
      name: "Bisma Khan",
      date: "Oct 17, 2020",
      comment: "This product is so helpful",
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
                    <label for={"disc"}>Discount:</label>
                    <input
                      type={"text"}
                      name={"disc"}
                      placeholder={"Discount"}
                      value={disc}
                      disabled={disableEditing}
                      onChange={(e) => {
                        setDisc(e.target.value);
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
            <div className="second-row">
              <div className="stats-2">
                <div className={"ratings-graph"}>
                  <Bar options={ratingsOptions} data={ratingsData} />
                </div>
                <div className="sales-graph">
                  <Line data={productSalesData} options={productSalesOption} />
                </div>
              </div>

              <div className="reviews-container">
                <div>
                  <span>Reviews</span>
                  <span>Count: {userReviews.length}</span>
                </div>
                <div className="rev" style={{ width: "100%" }}>
                  <List
                    sx={{
                      bgcolor: "background.paper",
                    }}
                  >
                    {userReviews.length > 0 ? (

                      userReviews.map((rev, index) => (
                        <ListItem
                          alignItems="flex-start"
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <FolderIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <div className="nameRating">
                                <p>{rev.name}</p>
                                <Rating
                                  name="size-small"
                                  size="small"
                                  value={rev.rating}
                                  readOnly
                                  precision={0.5}
                                  emptyIcon={
                                    <StarIcon
                                      style={{ opacity: 0.55 }}
                                      fontSize="inherit"
                                    />
                                  }
                                />
                              </div>
                            }
                            secondary={
                              <>
                                <p
                                  className={readMore ? "comment-new" : "comment"}
                                >
                                  {rev.comment}
                                </p>
                                <p
                                  className="read-more"
                                  onClick={() => setReadMore(!readMore)}
                                >
                                  Read More
                                </p>{" "}
                              </>
                            }
                          />
                        </ListItem>
                      ))
                    ) : (
                      <p className="no-reviews-text">No Reviews...</p>
                    )
                    
                    }
                  </List>
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
