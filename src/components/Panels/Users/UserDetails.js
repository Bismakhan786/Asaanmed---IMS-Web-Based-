import React, { useEffect, useRef, useState } from "react";
import "./Users.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../../../Redux/slices/UsersSlice";
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
  return array.filter((element) => element === item).length;
};

const UserDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location.state;

  let user = {
    addressBook: [],
    contact: "",
    name: "",
    _id: "",
  };

  if (data) {
    user = data[0];
  }

  useEffect(() => {
    if (data) {
      user = data[0];
      dispatch(getUserOrders(user._id));
    }
  }, [dispatch]);

  const { loadingOrders, orders } = useSelector((state) => state.users);
  const toastId = useRef(null);
  const [id, setId] = useState(user._id);
  const [name, setName] = useState(user.name);
  const [contact, setContact] = useState(user.contact);
  const [addressBook, setAddressBook] = useState(user.addressBook);

  // filter options for graph
  const [filterOpt, setFilterOpt] = useState("");
  const filterOptions = [
    {
      value: "Last 1 Year",
      label: "Last 1 Year",
      id: 1,
    },
    {
      value: "Last 2 Years",
      label: "Last 2 Years",
      id: 3,
    },
  ];

  let months = [];
  let totalAmount = 0;
  orders &&
    orders.map((order) => {
      months.push(
        new Date(order.createdAt.slice(0, 10)).toLocaleString("default", {
          month: "short",
        })
      );
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
  labels.map((label) => {
    monthCounts.push(countOccurrances(label, months));
  });

  const sampleData = {
    labels,
    datasets: [
      {
        type: "bar",
        data: monthCounts,
        backgroundColor: "rgba(248, 174, 14, 0.7)",
        hoverBackgroundColor: "rgb(248, 174, 14)",
        barPercentage: 0.5,
      },
    ],
  };

  return (
    <PanelLayout
      PanelName={"User Details"}
      MainLayout={
        loadingOrders ? (
          <Loading />
        ) : (
          <>
            <CustomToast />

            <div className="user-stats-container">
              <div className="user-details-container">
              <div>
                    <span>Name:</span>
                    <span>{name}</span>
                  </div>
                  <div>
                    <span>Contact:</span>
                    <span>{contact}</span>
                  </div>

                  <div>
                    <span>Total Orders:</span>
                    <span>{orders.length}</span>
                  </div>
                  <div>
                    <span>Total Amount:</span>
                    <span>{totalAmount}</span>
                  </div>

                <div className="addressBook">
                  <span>Address Book</span>

                  <ol>
                    {addressBook?.map((address, index) => (
                      <li>
                        <div className="addressContainer" key={index}>
                          <span>{address.streetAddress}</span>
                          <span>{address.floorOrApartment}</span>
                          <span>{address.city}</span>
                          <span>{address.postalCode}</span>
                        </div>
                      </li>
                    ))}
                    
                  </ol>
                </div>
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
                <div className="bar-chart-container">
                  <Bar options={options} data={sampleData} />
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
