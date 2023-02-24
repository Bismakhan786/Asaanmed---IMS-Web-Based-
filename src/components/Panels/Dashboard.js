import React, { useEffect } from "react";
import "./Dashboard.css";

import MovingIcon from "@mui/icons-material/Moving";
import OrdersIcon from "@mui/icons-material/AssignmentTurnedIn";
import ProductsIcon from "@mui/icons-material/Inventory";
import UsersIcon from "@mui/icons-material/GroupAdd";
import SalesIcon from "@mui/icons-material/MonetizationOnRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import MedicationIcon from "@mui/icons-material/Medication";
import PanelLayout from "../../Shared/PanelLayout/PanelLayout";
import { getAllOrders } from "../../Redux/slices/OrdersSlice";
import { getProductsFromAPI } from "../../Redux/slices/ProductsSlice";
import { getAllUsers } from "../../Redux/slices/UsersSlice";

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
import _ from "lodash";

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
    dispatch(getProductsFromAPI());
    dispatch(getAllUsers());
  }, [dispatch]);

  const { totalAmount, ordersCount, loadingOrders, orders } = useSelector(
    (state) => state.orders
  );

  const { productsCount, loadingProducts, products, mostSellingProducts } =
    useSelector((state) => state.products);
  const { usersCount, loadingUsers, users, chasingUsers } = useSelector(
    (state) => state.users
  );

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const optionsUsersAndOrders = {
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
        text: "Users and Orders (Count)",
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

  const usersAndOrders = {
    labels,
    datasets: [
      {
        label: "# of Users",
        // lineTension: 0.5,
        data: [5, 10, 30, 15, 80, 90],
        borderColor: "#e37e38",
        backgroundColor: "#e37e38",
        yAxisID: "y",
      },
      {
        label: "# of Orders",
        // lineTension: 0.5,
        data: [0, 30, 10, 80, 200, 300],
        borderColor: "#67b8e3",
        backgroundColor: "#67b8e3",
        yAxisID: "y1",
      },
    ],
  };

  const optionSales = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Sales",
      },
    },
    responsive: true,
  };

  const sales = {
    labels,
    datasets: [
      {
        label: "Sale",
        data: [1000, 2000, 3000, 1000, 5000, 9000],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        hoverBackgroundColor: "rgb(53, 162, 235)",
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
  orders &&
    orders.map((order) => {
      if (order.orderStatus === "Processing") {
        processing += 1;
      } else if (order.orderStatus === "Shipped") {
        shipped += 1;
      } else if (order.orderStatus === "Cancelled") {
        cancelled += 1;
      } else {
        delivered += 1;
      }
    });

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

  const optionstop5products = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Most Selling Products",
      },
    },
    responsive: true,
  };

  let sellingProductsNames = [];
  let sellingProductsValue = [];

  mostSellingProducts &&
    mostSellingProducts.map((p, i) => {
      sellingProductsNames.push(p.name);
      sellingProductsValue.push(p.numOfOrders);
    });

  const top5products = {
    labels: sellingProductsNames,
    datasets: [
      {
        data: sellingProductsValue,
        backgroundColor: "rgba(170, 170, 127, 0.5)",
        hoverBackgroundColor: "rgb(170, 170, 127)",
      },
    ],
  };

  return (
    <PanelLayout
      PanelName={"Dashboard"}
      MainLayout={
        <>
          {loadingOrders || loadingProducts || loadingUsers ? (
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
                    <p className="price">
                      {totalAmount ? totalAmount.toLocaleString() : 0}
                    </p>
                    <p>
                      <MovingIcon /> 17%
                      <p className="timeline">Since last week</p>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      Orders <OrdersIcon />
                    </p>
                    <p className="price">
                      {ordersCount ? ordersCount.toLocaleString() : 0}
                    </p>
                    <p>
                      <MovingIcon /> 17%
                      <p className="timeline">Since last week</p>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      Products <ProductsIcon />
                    </p>
                    <p className="price">
                      {productsCount ? productsCount.toLocaleString() : 0}
                    </p>
                    <p>
                      <MovingIcon /> 17%
                      <p className="timeline">Since last week</p>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      Users <UsersIcon />
                    </p>
                    <p className="price">
                      {usersCount ? usersCount.toLocaleString() : 0}
                    </p>
                    <p>
                      <MovingIcon /> 17%
                      <p className="timeline">Since last week</p>{" "}
                    </p>
                  </div>
                </div>

                <div className="charts">
                  <div className="line">
                    <Bar data={sales} options={optionSales} />
                  </div>
                  <div className="line">
                    <Line
                      data={usersAndOrders}
                      options={optionsUsersAndOrders}
                    />
                  </div>
                </div>
                <div className="charts">
                  <div className="doughnut">
                    <Doughnut data={ordersData} options={ordersOptions} />
                  </div>
                  <div className="bar">
                    <Bar data={top5products} options={optionstop5products} />
                  </div>
                </div>

                <div className="laptop-list-users">
                  <p>Top 3 Users</p>
                  {chasingUsers.length > 0 ? (
                    chasingUsers.map((user, index) => (
                      <div key={{ index }}>
                        <p>
                          <span>Name:</span> {user?.name}
                        </p>
                        <p>
                          <span>Orders:</span> {user?.numOfOrders}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p>
                        Your system has no top users, promote now to get some.
                      </p>
                    </div>
                  )}
                  
                </div>
                <div className="charts mobile-charts">
                  <div className="doughnut mob-doughnut">
                    <Doughnut data={ordersData} options={ordersOptions} />
                  </div>
                  <div className="users-list mob-list">
                    <p>Top 3 Users</p>
                    {chasingUsers.length > 0 ? (
                      chasingUsers.map((user, index) => (
                        <div key={{ index }}>
                          <p>
                            <span>Name:</span> {user?.name}
                          </p>
                          <p>
                            <span>Orders:</span> {user?.numOfOrders}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div>
                        <p>
                          Your system has no top users, promote now to get some.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* second div */}
              {/* <div className="second">
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
              </div> */}
            </div>
          )}
        </>
      }
    />
  );
}

export default Dashboard;
