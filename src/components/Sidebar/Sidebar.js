import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MediaIcon from "@mui/icons-material/FilterVintage";
import CategoriesIcon from '@mui/icons-material/Widgets';
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../Redux/slices/AdminLoginSlice";

function Sidebar() {

  const dispatch = useDispatch()

  const logout = (e) => {
    e.preventDefault()
    dispatch(logoutAdmin())
  }

  return (
    <div className="sidebar">
      <Link to={"/"}>
        <img src={"/icon.png"} alt=""/>
      </Link>
      <Link to={"/admin/dashboard"}>
        <p>
          <DashboardIcon />
          
          Dashboard
        </p>
      </Link>
      <Link to={"/admin/media"}>
        <p>
          <MediaIcon />
          Media
        </p>
      </Link>
      <Link>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ImportExportIcon />}
        >
          <TreeItem nodeId="1" label="Products">
            <Link to={"/admin/products"}>
              <TreeItem nodeId="2" label="All" icon={<PostAddIcon />} />
            </Link>
            <Link to={"/admin/products/new"}>
              <TreeItem nodeId="3" label="Create" icon={<AddIcon />} />
            </Link>
          </TreeItem>
        </TreeView>
      </Link>
      <Link>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<CategoriesIcon />}
        >
          <TreeItem nodeId="1" label="Categories">
            <Link to={"/admin/categories"}>
              <TreeItem nodeId="2" label="All" icon={<PostAddIcon />} />
            </Link>
            <Link to={"/admin/categories/new"}>
              <TreeItem nodeId="3" label="Create" icon={<AddIcon />} />
            </Link>
          </TreeItem>
        </TreeView>
      </Link>
      <Link to={"/admin/orders"}>
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to={"/admin/users"}>
        <p>
          <PeopleIcon />
          Users
        </p>
      </Link> 
        

      <button onClick={logout}>
      <p><LogoutRounded/>Logout</p>
      </button>
    </div>
  );
}

export default Sidebar;
