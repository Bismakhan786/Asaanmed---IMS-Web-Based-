import React, { useEffect } from "react";
import "./Dashboard.css";

import MovingIcon from "@mui/icons-material/Moving";
import SalesIcon from "@mui/icons-material/MonetizationOnRounded";
import ExpensesIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import ProfitIcon from "@mui/icons-material/PercentRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import MedicationIcon from "@mui/icons-material/Medication";
import PanelLayout from "../../Shared/PanelLayout/PanelLayout";
import { getAllOrders } from "../../Redux/slices/OrdersSlice";

import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  Filler,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../Shared/Loader/Loading";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  BarElement,
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const { totalAmount, ordersCount, loading, orders } = useSelector(
    (state) => state.orders
  );

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const optionsUsersReviews = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Users and Reviews (Count)",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const usersAndReviews = {
    labels,
    datasets: [
      {
        label: "# of Users",
        lineTension: 0.5,
        data: [5, 10, 30, 15, 80, 90],
        borderColor: "#e37e38",
        backgroundColor: "#e37e38",
        yAxisID: "y",
      },
      {
        label: "# of Reviews",
        lineTension: 0.5,
        data: [0, 30, 10, 80, 200, 300],
        borderColor: "#67b8e3",
        backgroundColor: "#67b8e3",
        yAxisID: "y1",
      },
    ],
  };

  const optionsSalesExpenses = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Sales Vs Expenses",
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const salesAndExpense = {
    labels,
    datasets: [
      {
        label: "Sale",
        data: [20000, 10000, 60000, 5000, 90000, 30000],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        hoverBackgroundColor: "rgb(53, 162, 235)",
      },
      {
        label: "Expense",
        data: [5000, 9000, 20000, 2000, 80000, 15000],
        backgroundColor: "rgba(190, 165, 38, 0.5)",
        hoverBackgroundColor: "rgb(190, 165, 38)",
      },
    ],
  };

  const ordersOptions = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Order Stats",
      },
    },
  };

  let delivered = 0;
  let shipped = 0;
  let processing = 0;
  let cancelled = 0;
  orders && orders.map((order) => {
    if(order.orderStatus === "Processing"){
      processing += 1
    }
    else if(order.orderStatus === "Shipped"){
      shipped += 1
    }
    else if(order.orderStatus === "Cancelled"){
      cancelled += 1
    }
    else{
      delivered += 1
    }
  })

  const ordersData = {
    labels: ["Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        backgroundColor: [
          "rgba(227, 126, 56, 0.7)",
          "rgba(102, 102, 102, 0.7)",
          "rgba(200, 80, 44, 0.7)",
          "rgba(227, 50, 30, 0.7)",
        ],
        hoverBackgroundColor: [
          "rgb(227, 126, 56)",
          "rgb(102, 102, 102)",
          "rgb(200, 80, 44)",
          "rgb(227, 50, 30)",
        ],
        data: [processing, shipped, delivered, cancelled],
      },
    ],
  };

  const optionsTop3users = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Top 3 Users",
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const top3users = {
    labels,
    datasets: [
      {
        label: "User 1",
        data: [5, 10, 5, 20, 30, 10],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        hoverBackgroundColor: "rgb(255, 99, 132)",
        stack: "Stack 0",
      },
      {
        label: "User 2",
        data: [0, 5, 3, 10, 50, 10],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        hoverBackgroundColor: "rgb(75, 192, 192)",
        stack: "Stack 0",
      },
      {
        label: "User 3",
        data: [1, 13, 14, 10, 70, 40],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        hoverBackgroundColor: "rgb(53, 162, 235)",
        stack: "Stack 1",
      },
    ],
  };

  return (
    <PanelLayout
      PanelName={"Dashboard"}
      MainLayout={
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="Dashboard-stats">
              {/* first div */}
              <div className="first">
                <div>
                  <div>
                    <p>
                      Sales <SalesIcon />
                    </p>
                    <p className="price">{totalAmount ? totalAmount.toLocaleString() : 0}</p>
                    <p>
                      <MovingIcon /> 17%
                      <p className="timeline">Since last week</p>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      Expenses <ExpensesIcon />
                    </p>
                    <p className="price">50,000</p>
                    <p>
                      <MovingIcon /> 17%
                      <p className="timeline">Since last week</p>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      Profit <ProfitIcon />
                    </p>
                    <p className="price">75,000</p>
                    <p>
                      <MovingIcon /> 17%
                      <p className="timeline">Since last week</p>{" "}
                    </p>
                  </div>
                </div>
                <div className="charts">
                  <div className="line">
                    <Bar
                      data={salesAndExpense}
                      options={optionsSalesExpenses}
                    />
                  </div>
                  <div className="line">
                    <Line
                      data={usersAndReviews}
                      options={optionsUsersReviews}
                    />
                  </div>
                </div>
                <div className="charts">
                  <div className="doughnut">
                    <Doughnut data={ordersData} options={ordersOptions} />
                  </div>
                  <div className="bar">
                    <Bar data={top3users} options={optionsTop3users} />
                  </div>
                </div>
              </div>

              {/* second div */}
              <div className="second">
                <div>
                  <p>Most Selling Products</p>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <MedicationIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Product 1" secondary="Stock: 23" />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <MedicationIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Product 2" secondary="Stock: 54" />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <MedicationIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Product 3"
                        secondary="Stock, 1004"
                      />
                    </ListItem>
                  </List>
                </div>
                <div>
                  <p>Top Users</p>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="User 1"
                        secondary="user1@gmail.com"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="User 2"
                        secondary="user2@gmail.com"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="User 3"
                        secondary="user3@gmail.com"
                      />
                    </ListItem>
                  </List>
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  );
}

export default Dashboard;
