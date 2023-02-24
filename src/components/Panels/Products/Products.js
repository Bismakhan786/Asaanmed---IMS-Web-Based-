import React, { useEffect, useRef } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getProductsFromAPI,
} from "../../../Redux/slices/ProductsSlice";

import ImportExportIcon from "@mui/icons-material/Publish";
import Table from "../../../Shared/Table/Table";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { toast } from "react-toastify";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";

const Products = () => {
  const dispatch = useDispatch();
  const { loading, products, deletionInProcess, deletionError } = useSelector(
    (state) => state.products
  );
  const toastId = useRef(null);

  useEffect(() => {
    dispatch(getProductsFromAPI());
  }, [dispatch]);

  const columns = [
    "ID",
    "Name",
    "Code",
    "Offer",
    "Price",
    "Category",
    "Status",
    "Stock",
    "Rate",
  ];
  const rows = [];

  const detailedData = [];
  products &&
    products.forEach((product) => {
      rows.push({
        id: product._id,
        name: product.name,
        code: product.code,
        offer: product.offer,
        price: product.price,
        category: product.cat.name,
        status: product.status,
        stock: product.stock,
        afterDiscount: product.price - product.price * product.offer,
      });
      detailedData.push(product);
    });

  const deleteItem = (id) => () => {
    toastId.current = toast("Deleting....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(deleteProduct(id));
  };
  return (
    <PanelLayout
      PanelName={"Products"}
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
          <div className={"import-export-btns"}>
            <button>
              Import{" "}
              <ImportExportIcon style={{ transform: "rotate(180deg)" }} />
            </button>
            <button>Export 
            <ImportExportIcon />

            </button>
          </div>
          <Table
            columns={columns}
            rows={rows}
            loading={loading}
            detailedData={detailedData}
            onEdit={"products"}
            deleteFunc={deleteItem}
            bulkActions={
              <>
                <button className="bulk-action-button">
                  <Delete />
                </button>{" "}
                <button className="bulk-action-button">
                  <Edit />
                </button>
              </>
            }
          />
        </>
      }
    />
  );
};

export default Products;
