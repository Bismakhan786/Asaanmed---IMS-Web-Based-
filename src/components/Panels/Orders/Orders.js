import React, { useEffect, useRef, useState } from "react";
import "./Orders.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteManyOrders,
  deleteOrder,
  getAllOrders,
  updateOrderStatusMany,
} from "../../../Redux/slices/OrdersSlice";
import Table from "../../../Shared/Table/Table";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import Delete from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import Modal from "react-modal";
import Dropdown from "../../../Shared/Dropdown/Dropdown";
import CloseIcon from "@mui/icons-material/CloseRounded";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const Orders = () => {

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [deleteManyModalOpen, setIsDeleteManyModalOpen] = React.useState(false);
  const [statusOptions, setStatusOptions] = useState([
    {
      value: "Shipped",
      label: "Shipped",
    },
    {
      value: "Delivered",
      label: "Delivered",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
    },
  ]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [disableStatusSelection, setDisableStatusSelection] = useState(false);
  const [errors, setErrors] = useState([]);


  function openDeleteManyModal() {
    setIsDeleteManyModalOpen(true);
  }

  function closeDeleteManyModal() {
    setIsDeleteManyModalOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const dispatch = useDispatch();
  const {
    loadingOrders,
    orders,
    deletionInProcess,
    deletionError,
    updateManyInProcess,
    updateManyError,
    updatedCount,
    deleteManyInProcess,
    deleteManyError,
    deletedCount
  } = useSelector((state) => state.orders);

  const selectedItems = useRef([]);
  const toastIdDeleteSingle = useRef(null);
  const toastIdUpdateMany = useRef(null);
  const toastIdDeleteMany = useRef(null);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch, errors.current]);

  const columns = [
    "ID",
    "Customer Name",
    "Contact",
    "Status",
    "Shipping",
    "Bill",
    "Date",
  ];
  const rows = [];
  const detailedData = [];

  orders &&
    orders.forEach((order) => {
      rows.push({
        id: order._id,
        name: order.user?.name,
        contact: order.user?.contact,
        status: order.orderStatus,
        shipping: order.shippingPrice,
        bill: order.totalPrice,
        date: order.createdAt?.slice(0, 10),
      });
      detailedData.push(order);
    });

  const deleteItem = (id) => () => {
    toastIdDeleteSingle.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(deleteOrder(id));
  };

  const handleErrors = () => {
    let newErrors = [];
    setErrors(newErrors);
    selectedItems.current.map((itemid, i) => {
      orders &&
        orders.map((order, i2) => {
          if (order._id === itemid) {
            if (order.orderStatus === "Delivered") {
              newErrors.push({
                orderId: itemid,
                error: "Can't update delivered order",
              });
              setDisableStatusSelection(true);
              setErrors(newErrors);
            }
            if (order.orderStatus === "Cancelled") {
              newErrors.push({
                orderId: itemid,
                error: "Can't update Cancelled order",
              });
              setDisableStatusSelection(true);
              setErrors(newErrors);
            }

            if (order.orderStatus === "Processing") {
              setDisableStatusSelection(false);
              setStatusOptions([
                {
                  value: "Shipped",
                  label: "Shipped",
                },
                {
                  value: "Cancelled",
                  label: "Cancelled",
                },
              ]);
            }
            if (order.orderStatus === "Shipped") {
              setDisableStatusSelection(false);
              setStatusOptions([
                {
                  value: "Delivered",
                  label: "Delivered",
                },
              ]);
            }
          }
        });
    });

    setIsOpen(true);
  };

  const handleUpdateManyStatus = () => {
    toastIdUpdateMany.current = toast("Updating....", {
      icon: <Spinner size={10} color={"white"} />,
    });

    setIsOpen(false);

    const data = {
      orderids: selectedItems.current,
      orderStatus: status.value
    }

    dispatch(updateOrderStatusMany(data));
    selectedItems.current = [];
  };


  const handleDeleteManyOrders = () => {
    toastIdDeleteMany.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    setIsDeleteManyModalOpen(false);
    dispatch(deleteManyOrders(selectedItems.current));
    selectedItems.current = [];
  }

  return (
    <PanelLayout
      PanelName={"Orders"}
      MainLayout={
        <>
          {!deletionInProcess &&
            toast.update(toastIdDeleteSingle.current, {
              render: "Deleted Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {deletionError &&
            toast.update(toastIdDeleteSingle.current, {
              render: deletionError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
            {!deleteManyInProcess &&
            toast.update(toastIdDeleteMany.current, {
              render: `${deletedCount} Orders Deleted Successfully!`,
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {deleteManyError &&
            toast.update(toastIdDeleteMany.current, {
              render: deleteManyError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          {!updateManyInProcess &&
            toast.update(toastIdUpdateMany.current, {
              render: `${updatedCount} Orders Updated Successfully!`,
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {updateManyError &&
            toast.update(toastIdUpdateMany.current, {
              render: updateManyError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          <CustomToast />
          <Modal
            isOpen={deleteManyModalOpen}
            onRequestClose={closeDeleteManyModal}
            style={customStyles}
            contentLabel="Warning Modal"
          >
            <div>
              <button onClick={closeDeleteManyModal} className="modal-close-btn">
                <CloseIcon />
              </button>
              <h2 className="modal-heading">Warning</h2>
              <p className="modal-warning" style={{fontSize: '0.9em'}}>
                Are you sure you want to delete these orders permanently?
              </p>
              <p className="modal-warning" style={{color: 'red'}}>This action can't be UNDONE</p>

              <div className="modal-btns">
                <button onClick={handleDeleteManyOrders}>Yes</button>
                <button onClick={closeDeleteManyModal}>No</button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Select Status Modal"
          >
            <div className="modal-div">
              <button onClick={closeModal} className="modal-close-btn">
                <CloseIcon />
              </button>
              <h2 className="modal-heading">Update Status</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: "20px",
                }}
              >
                <label for={"status"} style={{ marginRight: "10px" }}>
                  Status:
                </label>
                <Dropdown
                  defaultValue={statusOptions[0]}
                  options={statusOptions}
                  disabled={disableStatusSelection}
                  name={"status"}
                  placeholder={"-- Status --"}
                  onChange={(e) =>
                    setStatus({ value: e.value, label: e.value })
                  }
                />
              </div>
              {errors.length > 0 && (
                <div>
                  <p style={{ marginBottom: "20px", marginTop: "40px" }}>
                    Error Logs
                  </p>
                  <div style={{ maxHeight: "100px", overflowY: "scroll" }}>
                    {errors.map((err, i) => (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <p
                          className="modal-warning"
                          style={{ marginRight: "5px", marginBottom: "1px", color: 'red' }}
                        >
                          {err.orderId}:
                        </p>
                        <p
                          className="modal-warning"
                          style={{ marginBottom: "1px", color: 'red' }}
                        >
                          {err.error}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="modal-btns"
                style={{
                  paddingRight: "5px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={handleUpdateManyStatus}
                  disabled={errors.length > 0 ? true : false}
                >
                  Update
                </button>
              </div>
            </div>
          </Modal>
          <Table
            columns={columns}
            rows={rows.reverse()}
            loading={loadingOrders}
            detailedData={detailedData}
            selectedItems={selectedItems}
            onEdit={"orders"}
            emptyTableText={"Sadly! You have no orders to display.."}
            deleteFunc={deleteItem}
            bulkActions={
              <>
                <button className="bulk-action-button" onClick={handleErrors}>
                  <span className="bulk-action-btn-txt">Update Status</span>
                </button>{" "}
                <button className="bulk-action-button" onClick={openDeleteManyModal}>
                  <Delete />
                </button>
              </>
            }
          />
        </>
      }
    />
  );
};

export default Orders;
