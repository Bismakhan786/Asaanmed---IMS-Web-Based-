import React, { useEffect, useRef, useState } from "react";
import "./Users.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../../../Redux/slices/UsersSlice";
import Loading from "../../../Shared/Loader/Loading";
import CustomToast from "../../../Shared/Toast/CustomToast";
import "react-activity/dist/Spinner.css";
import Dropdown from "../../../Shared/Dropdown/Dropdown";
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
import Table from "../../../Shared/Table/Table";

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
  let cancelled = 0;
  let cancelledAmount = 0;
  let delivered = 0;
  let deliveredAmount = 0;
  let processing = 0;
  let processingAmount = 0;
  let shipped = 0;
  let shippedAmount = 0;
  let totalAmount = 0;
  orders &&
    orders.map((order) => {
      if (order.orderStatus === "Delivered") {
        delivered += 1;
        deliveredAmount += order.totalPrice;
      }
      if (order.orderStatus === "Processing") {
        processing += 1;
        processingAmount += order.totalPrice;
      }
      if (order.orderStatus === "Shipped") {
        shipped += 1;
        shippedAmount += order.totalPrice;
      }
      if (order.orderStatus === "Cancelled") {
        cancelled += 1;
        cancelledAmount += order.totalPrice;
      }
      months.push(
        new Date(order.createdAt.slice(0, 10)).toLocaleString("default", {
          month: "short",
        })
      );
      totalAmount += order.totalPrice;
    });

  console.log(months);

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
        data: monthCounts,
        backgroundColor: "rgba(248, 174, 14, 0.7)",
        hoverBackgroundColor: "rgb(248, 174, 14)",
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
                {/* <div className="addressBook">
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
                </div> */}
                <h4 style={{margin: 'auto', marginTop: '20px', marginBottom: '20px'}}>Address Book</h4>
                <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Street Address</th>
                        <th>Floor or Apartment</th>
                        <th>City</th>
                        <th>Postal Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addressBook?.map((address, index) => (
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{address.streetAddress}</td>
                          <td>{address.floorOrApartment}</td>
                          <td>{address.city}</td>
                          <td>{address.postalCode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                <h4 style={{margin: 'auto', marginTop: '20px', marginBottom: '20px'}}>Total Orders</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Processing</th>
                      <th>Shipped</th>
                      <th>Delivered</th>
                      <th>Cancelled</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{processing}</td>
                      <td>{shipped}</td>
                      <td>{delivered}</td>
                      <td>{cancelled}</td>
                      <td>{orders.length}</td>
                    </tr>
                  </tbody>
                </table>
                <h4 style={{margin: 'auto', marginTop: '20px', marginBottom: '20px'}}>Total Amount</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Processing</th>
                      <th>Shipped</th>
                      <th>Delivered</th>
                      <th>Cancelled</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{processingAmount}</td>
                      <td>{shippedAmount}</td>
                      <td>{deliveredAmount}</td>
                      <td>{cancelledAmount}</td>
                      <td>{totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
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
                  <Line options={options} data={sampleData} />
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
