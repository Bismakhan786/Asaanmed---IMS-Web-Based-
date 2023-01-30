import * as React from "react";
import "./PanelLayout.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Typography } from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import { Link, useNavigate } from "react-router-dom";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Backdrop from "@mui/material/Backdrop";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DiscountIcon from "@mui/icons-material/Discount";
import CategoriesIcon from "@mui/icons-material/Widgets";
import ExpensesIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import logo from "../../logo.png";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../Redux/slices/AdminLoginSlice";
import { MdPersonOutline } from "react-icons/md";

const actions = [
  { icon: <DashboardIcon />, name: "Dashboard", route: "/admin/dashboard" },
  { icon: <ImportExportIcon />, name: "Products", route: "/admin/products" },
  { icon: <CategoriesIcon />, name: "Categories", route: "/admin/categories" },
  { icon: <ListAltIcon />, name: "Orders", route: "/admin/orders" },
  { icon: <PeopleIcon />, name: "Users", route: "/admin/users" },
  { icon: <DiscountIcon />, name: "Vouchers", route: "/admin/vouchers" },
  { icon: <ExpensesIcon />, name: "Expenses", route: "/admin/expenses" },
  { icon: <MdPersonOutline />, name: "Profile", route: "/admin/profile" },
  { icon: <LogoutRounded />, name: "Logout" },
];

// props: MainLayout, PanelName, ShowProfileIcon
const PanelLayout = ({ MainLayout, PanelName, ShowProfileIcon = true }) => {
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="panel">
      <Sidebar />
      <div className="panel-container">
        <div>
          <Typography component={"h1"}>{PanelName}</Typography>
          <img
            className="nav-logo"
            src={logo}
            style={{
              width: 40,
              height: 40,
            }}
          />
          {ShowProfileIcon && (
            <div>
              <Backdrop open={open} />
              <SpeedDial
                className="custom-sd"
                ariaLabel="SpeedDial playground example"
                icon={<Person2Icon />}
                direction={"down"}
                sx={{ position: "absolute", right: 2, top: 16 }}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={() => {
                      setOpen(false);
                      if (action.name === "Logout") {
                        dispatch(logoutAdmin());
                      } else {
                        navigate(action.route);
                      }
                    }}
                  />
                ))}
              </SpeedDial>
              <Link to={"/admin/profile"}>
                <Person2Icon />
              </Link>
            </div>
          )}
        </div>
        {MainLayout}
      </div>
    </div>
  );
};

export default PanelLayout;
