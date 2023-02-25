import React, { useEffect } from "react";
import "./Orders.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../Redux/slices/OrdersSlice";
import Table from "../../../Shared/Table/Table";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import Delete from "@mui/icons-material/Delete";

const Orders = () => {
  const dispatch = useDispatch();
  const { loading, orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const columns = [
    "ID",
    "Customer Name",
    "Email",
    "Status",
    "Shipping",
    "Bill",
    "Date"
  ];
  const rows = [];
  const detailedData = [];

  orders &&
    orders.forEach((order) => {
      rows.push({
        id: order._id,
        name: order.user?.name,
        email: order.user?.email,
        status: order.orderStatus,
        shipping: order.shippingPrice,
        bill: order.totalPrice,
        date: order.createdAt?.slice(0,10)
      });
      detailedData.push(order);
    });

  const deleteItem = (id) => () => {
    console.log(`delete ${id}`);
  };
  return (
    <PanelLayout
      PanelName={"Orders"}
      MainLayout={
        <Table
          columns={columns}
          rows={rows.reverse()}
          loading={loading}
          detailedData={detailedData}
          onEdit={"orders"}
          deleteFunc={deleteItem}
          bulkActions={
            <>
              <button className="bulk-action-button">
                <span className="bulk-action-btn-txt">Update Status</span>
              </button>{" "}
              <button className="bulk-action-button">
                <Delete />
              </button>
            </>
          }
        />
      }
    />
  );
};

export default Orders;
