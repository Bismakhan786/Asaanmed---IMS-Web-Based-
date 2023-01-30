import React, { useEffect, useRef, useState } from "react";
import "./Users.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrdersAndReviews,
  updateUser,
} from "../../../Redux/slices/UsersSlice";
import Loading from "../../../Shared/Loader/Loading";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import Dropdown from "../../../Shared/Dropdown/Dropdown";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import Rating from "@mui/material/Rating";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Orders from Past 1 Year",
    },
  },
};

const countOccurrances = (item, array) => {
  return array.filter(element => element===item).length
}

const UserDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location.state;

  let user = {
    avatar: { public_id: "", url: "" },
    email: "",
    isAdmin: "",
    name: "",
    _id: "",
  };

  if (data) {
    user = data[0];
  }

  useEffect(() => {
    if (data) {
      user = data[0];
      dispatch(getOrdersAndReviews(user._id));
    }
  }, [dispatch]);

  const {
    loadingOrdersAndReviews,
    orders,
    reviews,
    updationInProcess,
    updationError,
  } = useSelector((state) => state.users);
  const toastId = useRef(null);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [id, setId] = useState(user._id);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [avatar, setAvatar] = useState(user.avatar);
  const [readMore, setReadMore] = useState(false);
  const [roleOpt, setRoleOpt] = useState(isAdmin ? "Admin" : "User");
  const roleOptions = [
    {
      value: "Admin",
      label: "Admin",
    },
    {
      value: "User",
      label: "User",
    },
  ];

  // filter options for graph
  const [filterOpt, setFilterOpt] = useState("");
  const filterOptions = [
    {
      value: "Last 1 Year",
      label: "Last 1 Year",
      id: 1
    },
    {
      value: "Last 2 Years",
      label: "Last 2 Years",
      id: 3
    },
  ];

  let months = [];
  let totalAmount = 0;
  orders &&
    orders.map((order) => {
      months.push(new Date(order.createdAt.slice(0, 10)).toLocaleString('default', {month: 'short'}))
      totalAmount += order.totalPrice;
    });

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];


  let monthCounts = [];
  labels.map(label => {
    monthCounts.push(countOccurrances(label, months))
  })


  const sampleData = {
    labels,
    datasets: [
      {
        type: 'bar',
        data: monthCounts,
        backgroundColor: "rgba(248, 174, 14, 0.7)",
        hoverBackgroundColor: "rgb(248, 174, 14)",
        barPercentage: 0.5,
      },
    ],
  };

  let finalReviews = [];
  let totalRating = 0;
  reviews &&
    reviews.map((rev) => {
      let filteredRev = rev.reviews.slice().filter((item) => item.user === id);
      filteredRev.map((item) => {
        totalRating += item.rating;
        finalReviews.push({
          productName: rev.name,
          rating: item.rating,
          comment: item.comment,
        });
      });
    });
  

  const handleSubmit = () => {
    let isAdmin = "";
    if (roleOpt === "Admin") {
      isAdmin = true;
    } else {
      isAdmin = false;
    }

    toastId.current = toast("Updating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(updateUser({ id: user._id, isAdmin }));
  };

  return (
    <PanelLayout
      PanelName={"User Details"}
      MainLayout={
        loadingOrdersAndReviews ? (
          <Loading />
        ) : (
          <>
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
            <div className="change-user-role">
              <div>
                <span>Role</span>
                <Dropdown
                  defaultValue={isAdmin ? roleOptions[0] : roleOptions[1]}
                  options={roleOptions}
                  name={"userRole"}
                  placeholder={"-- Change --"}
                  onChange={(e) => setRoleOpt(e.id)}
                />
              </div>
              <div>
                <button onClick={handleSubmit}>Update</button>
              </div>
            </div>
            <div className="user-stats-container">
              <div className="user-details-container">
                <div>
                  <span>Name:</span>
                  <span>{name}</span>
                </div>
                <div>
                  <span>Email:</span>
                  <span>{email}</span>
                </div>
                <div>
                  <span>Total Orders:</span>
                  <span>{orders.length}</span>
                </div>
                <div>
                  <span>Total Amount:</span>
                  <span>{totalAmount}</span>
                </div>
                <div>
                  <span>Average Rating:</span>
                  <span>{finalReviews.length > 0 ? totalRating / finalReviews.length : totalRating}</span>
                </div>
                <div>
                  <span>Total Reviews:</span>
                  <span>{reviews.length}</span>
                </div>
                <div className="graph-container">
                  <div>
                    <Dropdown
                      defaultValue={filterOptions[0]}
                      options={filterOptions}
                      name={"filterGraph"}
                      placeholder={"-- Filter --"}
                      onChange={(e) => setFilterOpt(e.value)}
                    />
                    <button>Apply</button>
                  </div>
                  <Bar options={options} data={sampleData} />
                </div>
              </div>
              <div className="user-reviews-container">
                <span>Submitted Reviews:</span>

                <div className="rev" style={{ width: "100%" }}>
                  <List
                    sx={{
                      bgcolor: "background.paper",
                    }}
                  >
                    {finalReviews.length > 0 ? (
                      finalReviews.map((rev, index) => (
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
                              <RateReviewIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <div className="nameRating">
                                <p>{rev.productName}</p>
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
                                  className={
                                    readMore ? "comment-new" : "comment"
                                  }
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
                    )}
                  </List>
                </div>
              </div>
            </div>
          </>
        )
      }
    />
  );
};

export default UserDetails;
