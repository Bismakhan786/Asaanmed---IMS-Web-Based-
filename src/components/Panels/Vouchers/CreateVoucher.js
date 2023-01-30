import React, { useEffect, useRef, useState } from "react";
import "./Vouchers.css";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { useDispatch, useSelector } from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dropdown from "../../../Shared/Dropdown/Dropdown";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import { getProductsFromAPI } from "../../../Redux/slices/ProductsSlice";
import { addVoucher } from "../../../Redux/slices/VoucherSlice";

const CreateVoucher = () => {
  const toastId = useRef(null);
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [publish, setPublish] = useState("Publish Now");
  const [items, setItems] = useState([]);
  const [expiredAt, setExpiredAt] = useState("");

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { creationInProcess, creationError } = useSelector(
    (state) => state.vouchers
  );

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

  const handleSubmit = (e) => {
    e.preventDefault();

    toastId.current = toast("Creating....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    const newItems = []
    items.map(item => {
      newItems.push({
        productId: item.id
      })
    })

    const voucher = {
      code,
      percentage,
      publish,
      items: newItems,
      expiredAt,
    };

    dispatch(addVoucher(voucher));
  };
  return (
    <PanelLayout
      PanelName={"Create Voucher"}
      MainLayout={
        <>
          {!creationInProcess &&
            toast.update(toastId.current, {
              render: "Created Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 5000,
            })}
          {creationError &&
            toast.update(toastId.current, {
              render: creationError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 5000,
            })}
          <CustomToast />
          <div className="voucher-main-container">
            <div className="voucher-form-container">
              <div>
                <label for={"name"}>Product Name:</label>
                <input
                  type={"text"}
                  name={"code"}
                  placeholder={"Code"}
                  disabled={creationInProcess}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div>
                <label for={"price"}>Percentage:</label>
                <input
                  type={"text"}
                  name={"disc"}
                  placeholder={"Discount"}
                  disabled={creationInProcess}
                  required
                  value={percentage}
                  onChange={(e) => {
                    setPercentage(e.target.value);
                  }}
                />
              </div>

              <div>
                <label for={"expiry"}>Expiry:</label>
                <input name={"expiry"} type={"date"} onChange={(e) => setExpiredAt(e.target.value)}/>
              </div>
              <div>
                <label for={"status"}>Products:</label>
                <Dropdown
                  isMulti={true}
                  defaultValue={""}
                  options={productOptions}
                  disabled={creationInProcess}
                  name={"product"}
                  placeholder={"-- Products --"}
                  onChange={(e) => setItems(e)}
                />
              </div>

              <div className="radio-group">
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue={"Publish Now"}
                  onChange={(e) => setPublish(e.target.value)}
                >
                  <FormControlLabel
                    value="Publish Now"
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
              <div className={"voucher-create-btn"}>
                <button onClick={handleSubmit}>Create</button>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
};

export default CreateVoucher;
