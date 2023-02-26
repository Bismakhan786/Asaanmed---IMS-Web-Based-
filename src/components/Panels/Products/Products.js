import React, { useEffect, useRef, useState } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteManyProducts,
  deleteProduct,
  getProductsFromAPI,
  updateStatusOfManyProducts,
  updateStockOfManyProducts,
  updateCategoryOfManyProducts,
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
import CloseIcon from "@mui/icons-material/CloseRounded";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Modal from "react-modal";
import { getAllCategories } from "../../../Redux/slices/CategoriesSlice";
import Dropdown from "../../../Shared/Dropdown/Dropdown";

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

const Products = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getProductsFromAPI());
  }, [dispatch]);

  let categoryOptions = [];
  categories &&
    categories.map((cat) => {
      categoryOptions.push({
        value: cat.name,
        label: cat.name,
        id: cat._id,
      });
    });

  const statusOptions = [
    {
      value: "Available",
      label: "Available",
    },
    {
      value: "Unavailable",
      label: "Unavailable",
    },
  ];

  const [modalIsOpen, setIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [isCat, setIsCat] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [isStock, setIsStock] = useState(false);
  const [stock, setStock] = useState("");
  const [stockError, setStockError] = useState("");
  const [category, setCategory] = useState(
    categoryOptions.length > 0 && categoryOptions[0]
  );
  const [status, setStatus] = useState(statusOptions[0]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const {
    loadingProducts,
    products,
    deletionInProcess,
    deletionError,
    deleteManyInProcess,
    deleteManyError,
    deletedCount,
    updatedCount,
    updateCategoryInProcess,
    updateCategoryError,
    updateStockInProcess,
    updateStockError,
    updateStatusInProcess,
    updateStatusError,
  } = useSelector((state) => state.products);

  const toastIdUpdateStatus = useRef(null);
  const toastIdUpdateStock = useRef(null);
  const toastIdUpdateCategory = useRef(null);
  const toastIdDeleteSingle = useRef(null);
  const toastIdDeleteMany = useRef(null);
  const selectedItems = useRef([]);

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
        afterDiscount: product.price - product.price * (product.offer / 100),
      });
      detailedData.push(product);
    });

  const deleteItem = (id) => () => {
    toastIdDeleteSingle.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(deleteProduct(id));
  };

  const deleteMany = () => {
    toastIdDeleteMany.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    setIsOpen(false);
    dispatch(deleteManyProducts(selectedItems.current));
    selectedItems.current = [];
  };

  const handleOpenModalCatUpdate = () => {
    setIsStatus(false);
    setIsStock(false);
    setIsCat(true);
    setUpdateModalIsOpen(true);
  };

  const handleOpenModalStatusUpdate = () => {
    setIsStock(false);
    setIsCat(false);
    setIsStatus(true);
    setUpdateModalIsOpen(true);
  };

  const handleOpenModalStockUpdate = () => {
    setIsStatus(false);
    setIsCat(false);
    setIsStock(true);
    setUpdateModalIsOpen(true);
  };

  const updateStatus = () => {
    toastIdUpdateStatus.current = toast("Updating....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    setUpdateModalIsOpen(false);
    console.log(selectedItems.current);

    const data = {
      productids: selectedItems.current,
      status: status.value,
    };

    dispatch(updateStatusOfManyProducts(data));
    selectedItems.current = [];
  };

  const updateStock = () => {
    toastIdUpdateStock.current = toast("Updating....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    setUpdateModalIsOpen(false);
    console.log(selectedItems.current);

    const data = {
      productids: selectedItems.current,
      stock,
    };

    dispatch(updateStockOfManyProducts(data));
    selectedItems.current = [];
  };

  const updateCategory = () => {
    toastIdUpdateCategory.current = toast("Updating....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    setUpdateModalIsOpen(false);
    console.log(selectedItems.current);

    const data = {
      productids: selectedItems.current,
      categoryid: category.id,
    };

    dispatch(updateCategoryOfManyProducts(data));
    selectedItems.current = [];
  };

  return (
    <PanelLayout
      PanelName={"Products"}
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
              render: `${deletedCount} Products Deleted Successfully!`,
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

          {!updateStockInProcess &&
            toast.update(toastIdUpdateStock.current, {
              render: `${updatedCount} Products Stock Updated Successfully!`,
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {updateStockError &&
            toast.update(toastIdUpdateStock.current, {
              render: updateStockError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          {!updateStatusInProcess &&
            toast.update(toastIdUpdateStatus.current, {
              render: `${updatedCount} Products Status Updated Successfully!`,
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {updateStatusError &&
            toast.update(toastIdUpdateStatus.current, {
              render: updateStatusError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          {!updateCategoryInProcess &&
            toast.update(toastIdUpdateCategory.current, {
              render: `${updatedCount} Products Category Updated Successfully!`,
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {updateCategoryError &&
            toast.update(toastIdUpdateCategory.current, {
              render: updateCategoryError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          <CustomToast />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Warning Modal"
          >
            <div>
              <button onClick={closeModal} className="modal-close-btn">
                <CloseIcon />
              </button>
              <h2 className="modal-heading">Warning</h2>
              <p className="modal-warning" style={{ fontSize: "0.9em" }}>
                Are you sure you want to delete these products permanently?
              </p>
              <p className="modal-warning" style={{ color: "red" }}>
                This action can't be UNDONE
              </p>

              <div className="modal-btns">
                <button onClick={deleteMany}>Yes</button>
                <button onClick={closeModal}>No</button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={updateModalIsOpen}
            onRequestClose={() => setUpdateModalIsOpen(false)}
            style={customStyles}
            contentLabel="Update Modal"
          >
            <div className="modal-div">
              <button
                onClick={() => setUpdateModalIsOpen(false)}
                className="modal-close-btn"
              >
                <CloseIcon />
              </button>
              <h2 className="modal-heading">
                Update{" "}
                {isCat
                  ? "Category"
                  : isStatus
                  ? "Status"
                  : isStock
                  ? "Stock"
                  : null}
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: "20px",
                }}
              >
                <label for={"status"} style={{ marginRight: "10px" }}>
                  {isCat
                    ? "Category:"
                    : isStatus
                    ? "Status:"
                    : isStock
                    ? "Stock:"
                    : null}
                </label>
                {isStatus && (
                  <Dropdown
                    options={statusOptions}
                    name={"status"}
                    placeholder={"-- Status --"}
                    onChange={(e) =>
                      setStatus({ value: e.value, label: e.value })
                    }
                  />
                )}
                {isCat && (
                  <Dropdown
                    options={categoryOptions}
                    name={"category"}
                    placeholder={"-- Category --"}
                    onChange={(e) =>
                      setCategory({ id: e.id, name: e.value, label: e.value })
                    }
                  />
                )}
                {isStock && (
                  <input
                    type={"number"}
                    name={"stock"}
                    placeholder={"Stock"}
                    // disabled={creationInProcess}
                    required
                    value={stock}
                    onChange={(e) => {
                      setStockError("");
                      if (e.target.value < 0) {
                        setStockError(
                          "Stock can't be negative, it can either be 0 or positive!"
                        );
                      } else {
                        setStock(e.target.value);
                      }
                    }}
                  />
                )}
              </div>

              {stockError && <p style={{ color: "red" }}>{stockError}</p>}

              <div
                className="modal-btns"
                style={{
                  paddingRight: "5px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={
                    isStatus
                      ? updateStatus
                      : isCat
                      ? updateCategory
                      : isStock
                      ? updateStock
                      : () => {}
                  }
                  disabled={stockError ? true : false}
                >
                  Update
                </button>
              </div>
            </div>
          </Modal>

          <div className={"import-export-btns"}>
            <button>
              Import{" "}
              <ImportExportIcon style={{ transform: "rotate(180deg)" }} />
            </button>
            <button>
              Export
              <ImportExportIcon />
            </button>
          </div>
          <Table
            columns={columns}
            rows={rows.reverse()}
            loading={loadingProducts}
            detailedData={detailedData}
            onEdit={"products"}
            selectedItems={selectedItems}
            emptyTableText={"Oops! You have no products to display.."}
            deleteFunc={deleteItem}
            bulkActions={
              <>
                <button
                  className="bulk-action-button"
                  onClick={handleOpenModalStatusUpdate}
                >
                  <span className="bulk-action-btn-txt">Status</span>
                </button>
                <button
                  className="bulk-action-button"
                  onClick={handleOpenModalStockUpdate}
                >
                  <span className="bulk-action-btn-txt">Stock</span>
                </button>
                <button
                  className="bulk-action-button"
                  onClick={handleOpenModalCatUpdate}
                >
                  <span className="bulk-action-btn-txt">Category</span>
                </button>
                <button className="bulk-action-button" onClick={openModal}>
                  <Delete />
                </button>{" "}
              </>
            }
          />
        </>
      }
    />
  );
};

export default Products;
