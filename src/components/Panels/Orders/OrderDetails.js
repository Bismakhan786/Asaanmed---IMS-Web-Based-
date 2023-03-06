import React, { useRef, useState } from "react";
import "./Orders.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { useLocation } from "react-router-dom";
import Dropdown from "../../../Shared/Dropdown/Dropdown";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder } from "../../../Redux/slices/OrdersSlice";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;

  let order = {
    _id: "",
    createdAt: "",
    paidAt: "",
    deliveredAt: "",
    user: { name: "", contact: "" },
    orderItems: [],
    shippingPrice: "",
    totalPrice: "",
    shippingInfo: {
      streetAddress: "",
      floorOrApartment: "",
      city: "",
      postalCode: "",
    },
    paymentInfo: {
      paymentType: "",
      status: "",
    },
    orderStatus: "",
  };
  if (data) {
    order = data[0];
  }

  const toastId = useRef(null);
  const [id, setId] = useState(order._id);
  const [user, setUser] = useState(order.user);
  const [createdAt, setCreatedAt] = useState(order.createdAt);
  const [paidAt, setPaidAt] = useState(order.paidAt);
  const [deliveredAt, setDeliveredAt] = useState(order.deliveredAt);
  const [orderItems, setOrderItems] = useState(order.orderItems);
  const [shippingPrice, setShippingPrice] = useState(order.shippingPrice);
  const [totalPrice, setToalPrice] = useState(order.totalPrice);
  const [shippingInfo, setShippingInfo] = useState(order.shippingInfo);
  const [paymentInfo, setPaymentInfo] = useState(order.paymentInfo);
  const [status, setStatus] = useState(order.orderStatus);
  const { updationInProcess, updationError } = useSelector(
    (state) => state.orders
  );

  let orderTotal = 0;
  orderItems &&
    orderItems.forEach((item) => {
      let productPrice =
        item.product?.price - item.product?.price * (item.product?.offer / 100);
      let itemTotal = productPrice * item.qty;
      orderTotal += itemTotal;
    });

  let defaultStepNumber = 0;

  const statusOptions = [
    {
      value: "Processing",
      label: "Processing",
      step: 0,
    },
    {
      value: "Shipped",
      label: "Shipped",
      step: 1,
    },
    {
      value: "Delivered",
      label: "Delivered",
      step: 2,
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      step: 3,
    },
  ];

  const steps = [
    "Processing",
    "Shipped",
    status === "Cancelled" ? "Cancelled" : "Delivered",
  ];

  // set the step number with respect to the order status
  steps.map((step, index) => {
    if (status === step) {
      defaultStepNumber = index;
    }
  });
  const [stepNumber, setStepNumber] = useState(defaultStepNumber);
  const [completed, setCompleted] = useState([false, false, false]);
  const [active, setActive] = useState([]);
  const [disableUpdateStatus, setDisableUpdateStatus] = useState(
    status === "Delivered" || status === "Cancelled" ? true : false
  );

  const handleUpdate = (e) => {
    e.preventDefault();

    const newData = {
      orderStatus: status,
    };

    toastId.current = toast("Updating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(updateOrder({ id: id, orderStatus: newData }));

    steps.map((step, index) => {
      if (status === step) {
        setStepNumber(index);
        if (index === 0) {
          const newActive = active;
          newActive[index] = true;
          setActive(newActive);

          setCompleted([]);
        } else if (index === steps.length - 1) {
          const newCompleted = completed;
          newCompleted[index] = [true, true, true];
          setCompleted(newCompleted);
          setActive([]);
          setDisableUpdateStatus(true);
        } else {
          const newActive = active;
          newActive[index] = true;
          const newCompleted = completed;
          newCompleted[index - 1] = true;

          setCompleted(newCompleted);
          setActive(newActive);
        }
      }
    });
  };
  return (
    <PanelLayout
      PanelName={"Order Details"}
      MainLayout={
        <div className="order-main">
          {!updationInProcess &&
            toast.update(toastId.current, {
              render: "Updated Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 5000,
            })}
          {updationError &&
            toast.update(toastId.current, {
              render: updationError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 5000,
            })}
          <CustomToast />
          <div className="status-selector">
            <div>
              <span>Status:</span>
              <Dropdown
                defaultValue={statusOptions.filter(
                  (opt) => opt.value === status
                )}
                disabled={disableUpdateStatus}
                options={
                  order.orderStatus === "Processing"
                    ? statusOptions.filter(
                        (o) => o.value === "Shipped" || o.value === "Cancelled"
                      )
                    : order.orderStatus === "Shipped"
                    ? statusOptions.filter((o) => o.value === "Delivered")
                    : null
                }
                name={"status"}
                placeholder={"-- Status --"}
                onChange={(e) => setStatus(e.value)}
              />
            </div>
            <div>
              <button onClick={handleUpdate} disabled={disableUpdateStatus}>
                Update
              </button>
            </div>
          </div>
          <div className="stepper">
            <Stepper activeStep={stepNumber} square>
              {steps.map((label, index) => (
                <Step
                  key={label}
                  completed={
                    order.orderStatus === "Shipped"
                      ? completed[index - 1]
                      : status === "Delivered" && true
                  }
                  active={active[index]}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          <div className="order-container">
            <p className="reciept-logo">ASAANMED Ltd.</p>
            <div>
              <span>Order #:</span>
              <span>{id}</span>
            </div>
            <div>
              <span>Date:</span>
              <span>{createdAt.slice(0, 10)}</span>
            </div>
            <div className="customer-info">
              <p>Customer</p>
              <div>
                <span>Name:</span>
                <span>{user?.name}</span>
              </div>
              <div>
                <span>Contact:</span>
                <span>{user?.contact}</span>
              </div>
            </div>
            <div className="order-items">
              <p>Order Items</p>
              <div className="order-item-table">
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th style={{ textAlign: "right" }}>Price</th>
                      <th style={{ textAlign: "right" }}>Offer</th>
                      <th style={{ textAlign: "right" }}>Quantity</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems &&
                      orderItems.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item.product?.name}</td>
                          <td style={{ textAlign: "right" }}>
                            {item.product?.price}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {item.product?.offer}%
                          </td>
                          <td style={{ textAlign: "right" }}>{item.qty}</td>
                          <td style={{ textAlign: "right" }}>
                            {(item.product?.price -
                              item.product?.price *
                                (item.product?.offer / 100)) *
                              item.qty}
                          </td>
                        </tr>
                      ))}

                    {/* Separator */}
                    <tr>
                      <td colSpan={6} className="separator"></td>
                    </tr>

                    {/* Summary */}
                    <tr>
                      <td colSpan={4}></td>
                      <td className="order-summary">Total</td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {orderTotal}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}></td>
                      <td className="order-summary">Shipping Fee</td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {shippingPrice}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}></td>
                      <td className="order-summary">Grand Total</td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {totalPrice}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p>Shipping Details</p>
              <div className="shipping-details">
                <div>
                  <span>Address:</span>
                  <span>{shippingInfo.streetAddress}</span>
                </div>
                {shippingInfo.floorOrApartment ? (
                  <div>
                    <span>Floor Or Apartment:</span>
                    <span>{shippingInfo.floorOrApartment}</span>
                  </div>
                ) : null}
                <div>
                  <span>Postal Code:</span>
                  <span>{shippingInfo.postalCode}</span>
                </div>
                <div>
                  <span>City:</span>
                  <span>{shippingInfo.city}</span>
                </div>
              </div>
            </div>
            <div>
              <p>Payment Details</p>
              <div className="shipping-details">
                <div>
                  <span>Payment Type:</span>
                  <span>{paymentInfo.paymentType}</span>
                </div>
                <div>
                  <span>Status:</span>
                  <span>{paymentInfo.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default OrderDetails;
