import React, { useState, useRef, useEffect } from "react";
import "./Vouchers.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateVoucher } from "../../../Redux/slices/VoucherSlice";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { getProductsFromAPI } from "../../../Redux/slices/ProductsSlice";
import Dropdown from "../../../Shared/Dropdown/Dropdown";

const VoucherDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;

  let voucher = {
    code: "",
    expiredAt: "",
    issuedAt: "",
    items: [],
    percentage: "",
    publish: "",
    _id: "",
  };
  if (data) {
    voucher = data[0];
  }

  const { updationInProcess, updationError } = useSelector(
    (state) => state.vouchers
  );
  const { products } = useSelector((state) => state.products);
  const [code, setCode] = useState(voucher.code);
  const [id, setId] = useState(voucher._id);
  const [expiredAt, setExpiredAt] = useState(voucher.expiredAt);
  const [issuedAt, setIssuedAt] = useState(voucher.issuedAt);
  const [percentage, setPercentage] = useState(voucher.percentage);
  const [publish, setPublish] = useState(voucher.publish);
  const [items, setItems] = useState(voucher.items);
  const [productOpt, setProductOpt] = useState(voucher.items);
  const [disableEdit, setDisableEdit] = useState(true)
  const toastId = useRef(null);

  useEffect(() => {
    dispatch(getProductsFromAPI());
  }, [dispatch]);

  let productOptions = [];
  products &&
    products.map((product) => {
      productOptions.push({
        value: product.name,
        label: product.name,
        id: product._id,
      });
    });

  let defaultOptions = [];
  items &&
    items.map((item) => {
      let product = item.productId;
      defaultOptions.push({
        value: product.name,
        label: product.name,
        id: product._id,
      });
    });

  const handleSubmit = () => {

    toastId.current = toast("Updating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });


    const newItems = [];
    productOpt.map((item) => {
      newItems.push({
        productId: item.id,
      });
    });

    const newVoucher = {
      code,
      expiredAt,
      percentage,
      publish,
      items: newItems,
    };

    dispatch(updateVoucher({ id: voucher._id, newData: newVoucher }));
    setDisableEdit(true)
  };

  return (
    <PanelLayout
      PanelName={"Voucher Details"}
      MainLayout={
        <>
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
          <div className="voucher-main-container">
            <div className="voucher-form-container">
              <div className="voucher-id">
                <span>ID: </span>
                <span>{id}</span>
              </div>
              <div className="issuance-date">
                <span>Issuance Date: </span>
                <span>{issuedAt.slice(0, 10)}</span>
              </div>
              <div>
                <label>Voucher Code:</label>
                <input
                  type={"text"}
                  placeholder={"Voucher Code"}
                  required
                  disabled={updationInProcess || disableEdit}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div>
                <label>Percentage:</label>
                <input
                  type={"text"}
                  placeholder={"percentage"}
                  required
                  disabled={updationInProcess || disableEdit}
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </div>
              <div>
                <label for={"expiry"}>Expiry:</label>
                <input
                  name={"expiry"}
                  type={"date"}
                  value={expiredAt.slice(0, 10)}
                  disabled={disableEdit || disableEdit}
                  onChange={(e) => setExpiredAt(e.target.value)}
                />
              </div>
              <div>
                <label for={"products"}>Products:</label>
                <Dropdown
                  isMulti={true}
                  defaultValue={!disableEdit ? productOptions : defaultOptions}
                  options={productOptions}
                  disabled={disableEdit || disableEdit}
                  name={"product"}
                  placeholder={"-- Products --"}
                  onChange={(e) => setProductOpt(e)}
                />
              </div>

              <div className="radio-group">
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue={publish}
                  onChange={(e) => setPublish(e.target.value)}
                >
                  <FormControlLabel
                    value="Publish Now"
                    disabled={disableEdit || updationInProcess}
                    control={
                      <Radio
                        sx={{
                          color: "#e37e38",
                          "&.Mui-checked": {
                            color: "#e37e38",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 16,
                          },
                        }}
                      />
                    }
                    label="Publish Now"
                  />
                  <FormControlLabel
                    value="Publish Later"
                    disabled={disableEdit || updationInProcess}
                    control={
                      <Radio
                        sx={{
                          color: "#e37e38",
                          "&.Mui-checked": {
                            color: "#e37e38",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: 16,
                          },
                        }}
                      />
                    }
                    label="Publish Later"
                  />
                </RadioGroup>
              </div>
              <div className="voucher-create-btn">
                <button onClick={disableEdit ?  () => setDisableEdit(false) : handleSubmit}>{disableEdit ? "Edit": "Update"}</button>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
};

export default VoucherDetails;
