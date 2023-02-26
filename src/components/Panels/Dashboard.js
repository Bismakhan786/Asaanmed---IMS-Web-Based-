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
import _, { find } from "lodash";

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

function getPercentageIncrease(current, prior) {
  let percent = ((current - prior) / prior) * 100;
  if (percent === Infinity) {
    return 100;
  }
  return percent;
}

function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getProductsFromAPI());
    dispatch(getAllUsers());
  }, [dispatch]);

  let currentMonth = new Date().getMonth();
  let prevMonth = new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1;
  let currentYear = new Date().getFullYear();
  let prevYear = new Date().getFullYear() - 1;
  let currentMonthOrders = 0;
  let prevMonthOrders = 0;
  let currentMonthProducts = 0;
  let prevMonthProducts = 0;
  let currentMonthUsers = 0;
  let prevMonthUsers = 0;

  const { totalAmount, ordersCount, loadingOrders, orders } = useSelector(
    (state) => state.orders
  );

  const { productsCount, loadingProducts, products, mostSellingProducts } =
    useSelector((state) => state.products);
  const { usersCount, loadingUsers, users, chasingUsers } = useSelector(
    (state) => state.users
  );

  const plugins = [
    {
      afterDraw: function (chart) {
        console.log(chart);
        if (chart.data.datasets[0].data.length < 1) {
          let ctx = chart.ctx;
          let width = chart.width;
          let height = chart.height;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.font = "1em Arial";
          ctx.fillText("No data to display..", width / 2, height / 2);
          ctx.restore();
        }
      },
    },
  ];

  const salesLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let userChartData = [];
  let usersData = [];
  users &&
    users.map((u, i) => {
      usersData.push({
        user: u,
        year: new Date(u.createdAt.slice(0, 10)).toLocaleString("default", {
          year: "numeric",
        }),
        month: new Date(u.createdAt.slice(0, 10)).toLocaleString("default", {
          month: "short",
        }),
      });
    });

  usersData = _.groupBy(usersData, "year");

  let monthlyUsersData = [];

  Object.keys(usersData).map((year, i) => {
    monthlyUsersData.push({
      year: year,
      users: _.groupBy(usersData[year], "month"),
    });
  });

  let finalUsersData = [];

  monthlyUsersData?.map((item, i) => {
    Object.keys(item.users).map((m, i2) => {
      finalUsersData.push({
        year: monthlyUsersData[i].year,
        month: m,
        totalUsers: monthlyUsersData[i].users[m].length,
      });
    });
  });

  finalUsersData = _.groupBy(finalUsersData, "year");

  currentMonthUsers =
    finalUsersData[currentYear]?.find(
      (u) => u.month === salesLabels[currentMonth]
    ) === undefined
      ? 0
      : finalUsersData[currentYear]?.find(
          (u) => u.month === salesLabels[currentMonth]
        ).totalUsers;
  prevMonthUsers =
    finalUsersData[currentYear]?.find(
      (u) => u.month === salesLabels[prevMonth]
    ) === undefined
      ? 0
      : finalUsersData[currentYear]?.find(
          (u) => u.month === salesLabels[prevMonth]
        ).totalUsers;

  finalUsersData &&
    salesLabels.map((m, i) => {
      finalUsersData[currentYear]?.map((m2, i2) => {
        if (m === m2.month) {
          userChartData.push(finalUsersData[currentYear][i2].totalUsers);
        } else {
          userChartData.push(0);
        }
      });
    });

  let productsData = [];
  products &&
    products.map((p, i) => {
      productsData.push({
        product: p,
        year: new Date(p.createdAt.slice(0, 10)).toLocaleString("default", {
          year: "numeric",
        }),
        month: new Date(p.createdAt.slice(0, 10)).toLocaleString("default", {
          month: "short",
        }),
      });
    });

  productsData = _.groupBy(productsData, "year");

  let monthlyProductsData = [];

  Object.keys(productsData).map((year, i) => {
    monthlyProductsData.push({
      year: year,
      products: _.groupBy(productsData[year], "month"),
    });
  });

  let finalProductsData = [];

  monthlyProductsData?.map((item, i) => {
    Object.keys(item.products).map((m, i2) => {
      finalProductsData.push({
        year: monthlyProductsData[i].year,
        month: m,
        totalProducts: monthlyProductsData[i].products[m].length,
      });
    });
  });

  finalProductsData = _.groupBy(finalProductsData, "year");

  currentMonthProducts =
    finalProductsData[currentYear]?.find(
      (p) => p.month === salesLabels[currentMonth]
    ) === undefined
      ? 0
      : finalProductsData[currentYear]?.find(
          (p) => p.month === salesLabels[currentMonth]
        ).totalProducts;
  prevMonthProducts =
    finalProductsData[currentYear]?.find(
      (p) => p.month === salesLabels[prevMonth]
    ) === undefined
      ? 0
      : finalProductsData[currentYear]?.find(
          (p) => p.month === salesLabels[prevMonth]
        ).totalProducts;

  let yearlyOrders = [];

  orders &&
    orders.map((o, i) => {
      yearlyOrders.push({
        order: o,
        year: new Date(o.createdAt.slice(0, 10)).toLocaleString("default", {
          year: "numeric",
        }),
        month: new Date(o.createdAt.slice(0, 10)).toLocaleString("default", {
          month: "short",
        }),
      });
    });

  let yearlyData = yearlyOrders ? _.groupBy(yearlyOrders, "year") : {};

  let monthlyOrdersData = [];

  Object.keys(yearlyData).map((year, i) => {
    monthlyOrdersData.push({
      year: year,
      orders: _.groupBy(yearlyData[year], "month"),
    });
  });

  let finalMonthlyData = [];

  monthlyOrdersData?.map((item, i) => {
    Object.keys(item.orders).map((m, i2) => {
      let monthlySum = 0;
      monthlyOrdersData[i].orders[m].map((o, i3) => {
        monthlySum += o.order.totalPrice;
      });
      finalMonthlyData.push({
        year: monthlyOrdersData[i].year,
        month: m,
        total: monthlySum,
        totalOrders: monthlyOrdersData[i].orders[m].length,
      });
    });
  });

  let salesData = [];
  let ordersCountData = [];

  finalMonthlyData = _.groupBy(finalMonthlyData, "year");

  currentMonthOrders =
    finalMonthlyData[currentYear]?.find(
      (o) => o.month === salesLabels[currentMonth]
    ) === undefined
      ? 0
      : finalMonthlyData[currentYear]?.find(
          (o) => o.month === salesLabels[currentMonth]
        ).totalOrders;
  prevMonthOrders =
    finalMonthlyData[currentYear]?.find(
      (o) => o.month === salesLabels[prevMonth]
    ) === undefined
      ? 0
      : finalMonthlyData[currentYear]?.find(
          (o) => o.month === salesLabels[prevMonth]
        ).totalOrders;

  finalMonthlyData &&
    salesLabels.map((m, i) => {
      finalMonthlyData[currentYear]?.map((m2, i2) => {
        if (m === m2.month) {
          ordersCountData.push(finalMonthlyData[currentYear][i2].totalOrders);
          salesData.push(finalMonthlyData[currentYear][i2].total);
        } else {
          ordersCountData.push(0);
          salesData.push(0);
        }
      });
    });

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
    labels: salesLabels,
    datasets: [
      {
        label: "Sale",
        data: salesData,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        hoverBackgroundColor: "rgb(53, 162, 235)",
      },
    ],
  };

  const optionsUsersAndOrders = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        display: true,
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
    labels: salesLabels,
    datasets: [
      {
        label: "# of Users",
        // lineTension: 0.5,
        data: userChartData,
        borderColor: "#e37e38",
        backgroundColor: "#e37e38",
        yAxisID: "y",
      },
      {
        label: "# of Orders",
        // lineTension: 0.5,
        data: ordersCountData,
        borderColor: "#67b8e3",
        backgroundColor: "#67b8e3",
        yAxisID: "y1",
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
        data:
          processing === 0 &&
          shipped === 0 &&
          delivered === 0 &&
          cancelled === 0
            ? []
            : [processing, shipped, delivered, cancelled],
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

  console.log("SALES DATA");
  console.log(salesData);
  console.log("FINAL PRODUCTS DATA");
  console.log(finalProductsData);
  console.log("FINAL USERS DATA");
  console.log(finalUsersData);
  console.log("FINAL ORDERS DATA");
  console.log(finalMonthlyData);

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
                      <MovingIcon />{" "}
                      {salesData.length > 0
                        ? getPercentageIncrease(
                            salesData[currentMonth],
                            salesData[prevMonth]
                          )
                        : 0}
                      %<p className="timeline">Since last month</p>{" "}
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
                      <MovingIcon />{" "}
                      {Object.keys(finalMonthlyData).length > 0
                        ? getPercentageIncrease(
                            currentMonthOrders,
                            prevMonthOrders
                          )
                        : 0}
                      %<p className="timeline">Since last month</p>{" "}
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
                      <MovingIcon />
                      {Object.keys(finalProductsData).length > 0
                        ? getPercentageIncrease(
                            currentMonthProducts,
                            prevMonthProducts
                          )
                        : 0}
                      %<p className="timeline">Since last month</p>{" "}
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
                      <MovingIcon />
                      {Object.keys(finalUsersData).length > 0
                        ? getPercentageIncrease(
                            currentMonthUsers,
                            prevMonthUsers
                          )
                        : 0}
                      %<p className="timeline">Since last month</p>{" "}
                    </p>
                  </div>
                </div>

                <div className="charts">
                  <div className="line">
                    <Bar data={sales} options={optionSales} plugins={plugins} />
                  </div>
                  <div className="line">
                    <Line
                      data={usersAndOrders}
                      options={optionsUsersAndOrders}
                      plugins={plugins}
                    />
                  </div>
                </div>
                <div className="charts">
                  <div className="doughnut">
                    <Doughnut
                      data={ordersData}
                      options={ordersOptions}
                      plugins={plugins}
                    />
                  </div>
                  <div className="bar">
                    <Bar
                      data={top5products}
                      options={optionstop5products}
                      plugins={plugins}
                    />
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
