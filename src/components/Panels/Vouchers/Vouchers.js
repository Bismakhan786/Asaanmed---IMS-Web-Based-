import React, { useEffect, useRef } from "react";
import "./Vouchers.css";
import { useDispatch, useSelector } from "react-redux";

import Table from "../../../Shared/Table/Table";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import {
  deleteVoucher,
  getAllVouchers,
} from "../../../Redux/slices/VoucherSlice";
import { toast } from "react-toastify";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import Delete from "@mui/icons-material/Delete";

const Vouchers = () => {
  const dispatch = useDispatch();
  const toastId = useRef(null);
  const { loading, vouchers, deletionInProcess, deletionError } = useSelector(
    (state) => state.vouchers
  );

  useEffect(() => {
    dispatch(getAllVouchers());
  }, [dispatch]);

  const rows = [];
  const columns = ["ID", "Code", "Percentage", "Issuance Date", "Expiry", "Public"];
  const detailedData = [];

  vouchers &&
    vouchers.forEach((voucher) => {
      rows.push({
        id: voucher._id,
        code: voucher.code,
        percentage: voucher.percentage,
        issuedAt: voucher.issuedAt.slice(0, 10),
        expiredAt: voucher.expiredAt.slice(0, 10),
        publish: voucher.publish === "Publish Now" ? "Yes" : "No"
      });
      detailedData.push(voucher);
    });

  const deleteItem = (id) => () => {
    toastId.current = toast("Deleting....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(deleteVoucher(id));
  };
  return (
    <PanelLayout
      PanelName={"Vouchers"}
      MainLayout={
        <>
          {!deletionInProcess &&
            toast.update(toastId.current, {
              render: "Deleted Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 5000,
            })}
          {deletionError &&
            toast.update(toastId.current, {
              render: deletionError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 5000,
            })}
          <CustomToast />
          <Table
            columns={columns}
            rows={rows}
            loading={loading}
            detailedData={detailedData}
            onEdit={"vouchers"}
            deleteFunc={deleteItem}
            bulkActions={
              <>
                <button className="bulk-action-button">
                  <span className="bulk-action-btn-txt">Publish</span>
                </button>
                <button className="bulk-action-button">
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

export default Vouchers;
