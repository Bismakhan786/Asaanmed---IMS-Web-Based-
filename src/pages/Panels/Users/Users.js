import React, { useEffect, useRef } from "react";
import "./Users.css";
import { useDispatch, useSelector } from "react-redux";

import { getAllUsers } from "../../../Redux/slices/UsersSlice";
import Table from "../../../components/Table/Table";
import PanelLayout from "../../../components/PanelLayout/PanelLayout";

const Users = () => {
  const dispatch = useDispatch();
  const { loadingUsers, users } = useSelector((state) => state.users);

  const selectedItems = useRef([]);


  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const columns = ["ID", "Name", "Contact", "Orders", "Joined At"];
  const rows = [];
  const detailedData = [];

  users &&
    users.forEach((user) => {
      rows.push({
        id: user._id,
        name: user.name,
        contact: user.contact,
        orders: user.numOfOrders,
        since: user.createdAt?.slice(0, 10)
      });
      detailedData.push(user);
    });

  const deleteItem = (id) => () => {
    console.log(`delete ${id}`);
  };
  return (
    <PanelLayout
      PanelName={"Users"}
      MainLayout={
        <Table
          columns={columns}
          rows={rows}
          loading={loadingUsers}
          detailedData={detailedData}
          selectedItems={selectedItems}
          selectItemsDisable={true}
          emptyTableText={"Sadly! You have no users to display.."}
          onEdit={"users"}
          deleteFunc={deleteItem}
          bulkActions={(<button className="bulk-action-button"><span className="bulk-action-btn-txt">Block</span></button>)}
        />
      }
    />
  );
};

export default Users;
