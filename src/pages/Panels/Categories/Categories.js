import React, { useEffect, useRef } from "react";
import "./Categories.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getAllCategories,
  deleteManyCategories
} from "../../../Redux/slices/CategoriesSlice";
import Table from "../../../components/Table/Table";
import PanelLayout from "../../../components/PanelLayout/PanelLayout";
import { toast } from "react-toastify";
import CustomToast from "../../../components/Toast/CustomToast";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import Modal from "react-modal";
import Delete from "@mui/icons-material/Delete";



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

const Categories = () => {

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const dispatch = useDispatch();
  const { loading, categories, deletionInProcess, deletionError, deleteManyInProcess, deleteManyError, deletedCount } = useSelector(
    (state) => state.categories
  );
  const toastIdDeleteSingle = useRef(null)
  const toastIdDeleteMany = useRef(null)
  const selectedItems = useRef([]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
    toastIdDeleteSingle.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    dispatch(deleteCategory(id));
  };

  const deleteMany = () => {
    toastIdDeleteMany.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    setIsOpen(false);
    dispatch(deleteManyCategories(selectedItems.current));
    console.log(selectedItems.current)
    selectedItems.current = [];
  }
  return (
    <PanelLayout
      PanelName={"Categories"}
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
              render: `${deletedCount} Categories Deleted Successfully!`,
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
              <p className="modal-warning"  style={{fontSize: '0.9em'}}>
                Are you sure you want to delete these categories permanently?
              </p>
              <p className="modal-warning" style={{color: 'red'}}>This action can't be UNDONE</p>

              <div className="modal-btns">
                <button onClick={deleteMany}>Yes</button>
                <button onClick={closeModal}>No</button>
              </div>
            </div>
          </Modal>
          <Table
            columns={columns}
            rows={rows}
            loading={loading}
            detailedData={detailedData}
            selectedItems={selectedItems}
            onEdit={"categories"}
            emptyTableText={"Oops! You have no categories to display.."}
            deleteFunc={deleteItem}
            deleteWarning={'This will delete "ALL PRODUCTS" of: '}
            bulkActions={
              <>
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

export default Categories;
