import React, { useEffect, useRef } from "react";
import "./Categories.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getAllCategories,
} from "../../../Redux/slices/CategoriesSlice";
import Table from "../../../Shared/Table/Table";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import { toast } from "react-toastify";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";

const Categories = () => {
  const dispatch = useDispatch();
  const { loading, categories, deletionInProcess, deletionError } = useSelector(
    (state) => state.categories
  );
  const toastId = useRef(null)

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const columns = ["ID", "Name", "Color", "Created At"];
  const rows = [];
  const detailedData = [];

  categories &&
    categories.forEach((category) => {
      rows.push({
        id: category._id,
        name: category.name,
        color: category.color,
        createdAt: category.createdAt,
      });
      detailedData.push(category);
    });
  const deleteItem = (id) => () => {
    toastId.current = toast("Deleting....", {
      autoClose: false,
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(deleteCategory(id));
  };
  return (
    <PanelLayout
      PanelName={"Categories"}
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
            onEdit={"categories"}
            deleteFunc={deleteItem}
            deleteWarning={'This will delete "ALL PRODUCTS" of: '}
          />
        </>
      }
    />
  );
};

export default Categories;
