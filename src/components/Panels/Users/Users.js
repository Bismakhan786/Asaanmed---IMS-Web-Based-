import React, { useEffect } from "react";
import "./Users.css";
import { useDispatch, useSelector } from "react-redux";

import { getAllUsers } from "../../../Redux/slices/UsersSlice";
import Table from "../../../Shared/Table/Table";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";

const Users = () => {
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const columns = ["ID", "Name", "Contact"];
  const rows = [];
  const detailedData = [];

  users &&
    users.forEach((user) => {
      rows.push({
        id: user._id,
        name: user.name,
        contact: user.contact,
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
          loading={loading}
          detailedData={detailedData}
          onEdit={"users"}
          deleteFunc={deleteItem}
          bulkActions={(<button className="bulk-action-button"><span className="bulk-action-btn-txt">Block</span></button>)}
        />
      }
    />
  );
};

export default Users;
