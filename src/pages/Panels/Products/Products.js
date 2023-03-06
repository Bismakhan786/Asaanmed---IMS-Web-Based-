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
  addManyProducts,
} from "../../../Redux/slices/ProductsSlice";

import ImportExportIcon from "@mui/icons-material/Publish";
import Table from "../../../components/Table/Table";
import PanelLayout from "../../../components/PanelLayout/PanelLayout";
import { toast } from "react-toastify";
import CustomToast from "../../../components/Toast/CustomToast";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import Delete from "@mui/icons-material/Delete";
import Modal from "react-modal";
import { getAllCategories } from "../../../Redux/slices/CategoriesSlice";
import Dropdown from "../../../components/Dropdown/Dropdown";
import Papa from "papaparse";
import ProgressBar from "../../../components/Progressbar/Progressbar";

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

const customStylesImportModal = {
  content: {
    top: "15%",
    left: "15%",
    right: "15%",
    bottom: "10%",
  },
};

Modal.setAppElement("#root");

const Products = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const inputRef = useRef();

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

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [dbData, setDbData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [importModalIsOpen, setImportModalIsOpen] = useState(false);
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

  function openImportModal() {
    setImportModalIsOpen(true);
  }

  function closeImportModal() {
    setImportModalIsOpen(false);
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
    createManyLoading,
    createManyError,
  } = useSelector((state) => state.products);

  const toastIdUpdateStatus = useRef(null);
  const toastIdUpdateStock = useRef(null);
  const toastIdUpdateCategory = useRef(null);
  const toastIdDeleteSingle = useRef(null);
  const toastIdDeleteMany = useRef(null);
  const toastIdCreateMany = useRef(null);
  const toastIdExportDownload = useRef(null);
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
    "Orders"
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
        orders: product.numOfOrders
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

  const dragEnter = (event) => {
    console.log(event);
    event.target.style.backgroundColor = "rgba(95, 158, 160, 0.05)";
  };

  const dragLeave = (event) => {
    event.target.style.backgroundColor = "rgba(0, 0, 0, 0.01)";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
    setProgress(35);
    setProgressText("Initializing resources...");
    console.log(event.dataTransfer.files);
    Papa.parse(event.dataTransfer.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setProgress(50);
        setProgressText("Reading from CSV file..");
        results.data.map((d, i) => {
          dbData.push({
            name: d[Object.keys(d)[0]],
            code: d[Object.keys(d)[1]],
            offer: Number(d[Object.keys(d)[2]]),
            price: Number(d[Object.keys(d)[3]]),
            stock: Number(d[Object.keys(d)[4]]),
            cat: d[Object.keys(d)[5]],
            status:
              d[Object.keys(d)[6]].charAt(0).toUpperCase() +
              d[Object.keys(d)[6]].slice(1),
            desc: d[Object.keys(d)[7]],
            image: d[Object.keys(d)[8]],
          });
        });
        setProgress(100);
        setProgressText("Upload Complete...");
      },
    });

    console.log(dbData);
  };

  const handleSelectFile = (event) => {
    console.log(event);
    setFile(event.target.files[0]);
    setProgress(35);
    setProgressText("Initializing resources...");
    console.log(event.target.files);
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setProgress(50);
        setProgressText("Reading from CSV file..");
        results.data.map((d, i) => {
          dbData.push({
            name: d[Object.keys(d)[0]],
            code: d[Object.keys(d)[1]],
            offer: Number(d[Object.keys(d)[2]]),
            price: Number(d[Object.keys(d)[3]]),
            stock: Number(d[Object.keys(d)[4]]),
            cat: d[Object.keys(d)[5]],
            status:
              d[Object.keys(d)[6]].charAt(0).toUpperCase() +
              d[Object.keys(d)[6]].slice(1),
            desc: d[Object.keys(d)[7]],
            image: d[Object.keys(d)[8]],
          });
        });
        setProgress(100);
        setProgressText("Upload Complete...");
      },
    });

    console.log(dbData);
  };

  const createManyProductsDB = () => {
    setImportModalIsOpen(false);

    toastIdCreateMany.current = toast("Creating....", {
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(addManyProducts(dbData));
    setFile(null);
    setDbData([]);
    setProgress(0);
    setProgressText("");
  };

  const handleExportCSV = () => {

    toastIdExportDownload.current = toast("Downloading....", {
      icon: <Spinner size={10} color={"white"} />,
    });

    const fields = [
      "Name",
      "Code",
      "Offer",
      "Price",
      "Stock",
      "Category",
      "Status",
      "Description",
      "Image"
    ]

    const data = detailedData.map((row) => 
      [
        row.name,
        row.code,
        row.offer,
        row.price,
        row.stock,
        row.cat.name,
        row.status,
        row.desc,
        row.image[0].url
      ]
    )
    console.log(fields, data)
    const csv = Papa.unparse({
      data,
      fields
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Products(Exported)';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.update(toastIdExportDownload.current, {
      render: "Downloaded Successfully!",
      type: toast.TYPE.SUCCESS,
      icon: <SuccessIcon className="successIcon" />,
      autoClose: 500,
    })
  }

  return (
    <PanelLayout
      PanelName={"Products"}
      MainLayout={
        <>
        {
          
        }
          {!createManyLoading &&
            toast.update(toastIdCreateMany.current, {
              render: "Created Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {createManyError &&
            toast.update(toastIdCreateMany.current, {
              render: createManyError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
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
            isOpen={importModalIsOpen}
            onRequestClose={closeImportModal}
            style={customStylesImportModal}
            contentLabel="Import Products Modal"
          >
            <div>
              <button onClick={closeImportModal} className="modal-close-btn">
                <CloseIcon />
              </button>
              {!file ? (
                <div
                  className="upload-media-div"
                  style={{ height: "auto" }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div
                    style={{ height: "65vh" }}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                  >
                    <p className="upload-media-head">Import Products</p>
                    <p className="upload-media-subtext">
                      Drag and drop file here
                    </p>
                    <p className="upload-media-subtext">(.csv)</p>

                    <p className="upload-media-or">OR</p>
                    <input
                      type={"file"}
                      accept={".csv"}
                      onChange={handleSelectFile}
                      hidden
                      ref={inputRef}
                    />
                    <button
                      className="upload-media-btn"
                      onClick={() => inputRef.current.click()}
                    >
                      Select File
                    </button>
                    <p
                      style={{
                        color: "red",
                        textAlign: "center",
                        marginTop: "25px",
                      }}
                    >
                      Ensure that the file contain these columns
                    </p>
                    <p
                      style={{
                        textTransform: "capitalize",
                        letterSpacing: "1px",
                        textAlign: "center",
                        width: '80%'
                      }}
                    >
                      name, code, offer, price, stock, category, status{" "}
                      <span>("Available" or "Unavailable")</span>, description
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    height: "65vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {file.name}
                  </p>
                  <ProgressBar
                    completed={progress}
                    bgcolor={"green"}
                    progressText={progressText}
                  />
                  {progress === 100 && (
                    <button
                      className="upload-media-btn"
                      style={{alignSelf: 'center'}}
                      onClick={createManyProductsDB}
                    >
                      Upload
                    </button>
                  )}
                </div>
              )}
            </div>
          </Modal>
          
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
            <button onClick={openImportModal}>
              Import{" "}
              <ImportExportIcon style={{ transform: "rotate(180deg)" }} />
            </button>
            <button onClick={handleExportCSV}>
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
