import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllMedia,
  deleteMedia,
  getMediaFromAPI,
  uploadMedia,
} from "../../../Redux/slices/MediaSlice";
import PanelLayout from "../../../Shared/PanelLayout/PanelLayout";
import Loading from "../../../Shared/Loader/Loading";
import "./Media.css";
import CustomToast from "../../../Shared/Toast/CustomToast";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";
import SuccessIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorIcon from "@mui/icons-material/ErrorRounded";
import Copy from "@mui/icons-material/Code";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { Tooltip } from "@mui/material";


const customStyles = {
  content: {
    top: "15%",
    left: "15%",
    right: "15%",
    bottom: "10%",
    // marginBottom: "-20%",
    // transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const Media = () => {
  const dispatch = useDispatch();
  const {
    loadingMedia,
    media,
    creationInProcess,
    creationError,
    deleteImageInProcess,
    deleteMediaInProcess,
    deletedCount,
    deleteImageError,
    deleteMediaError,
  } = useSelector((state) => state.media);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagesForDB, setSelectedImagesForDB] = useState([]);
  const [copied, setCopied] = useState(false);
  const toastId = useRef(null);
  const toastIdDeleteMedia = useRef(null);
  const toastIdDeleteImage = useRef(null);
  // const [dataArray, setDataArray] = useState([])
  const inputRef = useRef();

  useEffect(() => {
    dispatch(getMediaFromAPI());
  }, [dispatch]);


  function openModal() {
    setSelectedImages([])
    setSelectedImagesForDB([])
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }


  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFiles = event.dataTransfer.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file, index) => {
      return URL.createObjectURL(file);
    });

    setSelectedImages((prevImages) => prevImages.concat(imagesArray));

    let dataArray = [];

    selectedFilesArray.map((file, index) => {
      console.log(file);
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log(reader.result);
          dataArray.push({ name: file.name, imageData: reader.result });
          setSelectedImagesForDB((selectedImagesForDB) => [
            ...selectedImagesForDB,
            { name: file.name, imageData: reader.result },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    // console.log(dataArray);

    // dataArray.map((value, index) => console.log(value))
    // setSelectedImagesForDB(selectedImagesForDB => [...selectedImagesForDB, dataArray]);
  };

  const handleSelectImages = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file, index) => {
      return URL.createObjectURL(file);
    });

    setSelectedImages((prevImages) => prevImages.concat(imagesArray));

    const dataArray = [];

    selectedFilesArray.map((file, index) => {
      console.log(file);
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log(reader.result);
          dataArray.push({ name: file.name, imageData: reader.result });
          setSelectedImagesForDB((selectedImagesForDB) => [
            ...selectedImagesForDB,
            { name: file.name, imageData: reader.result },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    console.log(dataArray);
    let temp = selectedImagesForDB.slice();
    console.log(temp);
    // setSelectedImagesForDB(selectedImagesForDB => [...selectedImagesForDB, dataArray]);
    // dataArray.map((e, i) => console.log(e))
  };

  const handleDBupload = () => {
    setIsOpen(false)
    toastId.current = toast("Uploading....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    console.log(selectedImages);
    console.log(selectedImagesForDB);
    dispatch(uploadMedia(selectedImagesForDB));
  };

  const handleDeleteImage = (id) => () => {
    toastIdDeleteImage.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    console.log(id);

    dispatch(deleteMedia(id));
  };

  const handleDeleteMedia = () => {
    toastIdDeleteMedia.current = toast("Deleting....", {
      icon: <Spinner size={10} color={"white"} />,
    });

    dispatch(deleteAllMedia());
    setSelectedImagesForDB([])
    setSelectedImages([])
  };
  return (
    <PanelLayout
      PanelName={"Media"}
      MainLayout={
        <>
          {!creationInProcess &&
            toast.update(toastId.current, {
              render: "Uploaded Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {creationError &&
            toast.update(toastId.current, {
              render: creationError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          {!deleteImageInProcess &&
            toast.update(toastIdDeleteImage.current, {
              render: "Deleted Successfully!",
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {deleteImageError &&
            toast.update(toastIdDeleteImage.current, {
              render: deleteImageError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          {!deleteMediaInProcess &&
            toast.update(toastIdDeleteMedia.current, {
              render: `${deletedCount} Images Deleted Successfully!`,
              type: toast.TYPE.SUCCESS,
              icon: <SuccessIcon className="successIcon" />,
              autoClose: 3000,
            })}
          {deleteMediaError &&
            toast.update(toastIdDeleteMedia.current, {
              render: deleteMediaError,
              type: toast.TYPE.ERROR,
              icon: <ErrorIcon className="errorIcon" />,
              autoClose: 3000,
            })}
          <CustomToast />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Upload More Modal"
          >
            <div>
              <button onClick={closeModal} className="modal-close-btn">
                <CloseIcon />
              </button>
              {selectedImages.length === 0 ? (
                <div
                className="upload-media-div"
                style={{height: 'auto'}}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div style={{height: '65vh'}}>
                  <p className="upload-media-head">Drag and drop files here</p>
                  <p className="upload-media-subtext">png, jpg, jpeg</p>
                  <p className="upload-media-or">OR</p>
                  <input
                    type={"file"}
                    multiple
                    accept={"image/png, image/jpeg, image/jpg"}
                    onChange={handleSelectImages}
                    hidden
                    ref={inputRef}
                  />
                  <button
                    className="upload-media-btn"
                    onClick={() => inputRef.current.click()}
                  >
                    Select Files
                  </button>
                </div>
              </div>
              ) : (
                <>
              <div className="upload-select-more-div" style={{paddingTop: '20px'}}>
                <input
                  type={"file"}
                  multiple
                  accept={"image/png, image/jpeg, image/jpg"}
                  onChange={handleSelectImages}
                  hidden
                  ref={inputRef}
                />
                <button
                  className="upload-media-btn"
                  onClick={() => inputRef.current.click()}
                >
                  Select More
                </button>
                <button className="upload-media-btn" onClick={handleDBupload}>
                  Upload
                </button>
              </div>
              <div className="parent-image-container" style={{height: '60vh'}}>
                <div className="images-container">
                  {selectedImages &&
                    selectedImages.map((image, index) => (
                      <div key={index} className="image">
                        <img
                          src={image}
                          height="100"
                          // style={{ height: "100px", width: "auto", }}
                        />
                        <button
                          onClick={() => {
                            setSelectedImages(
                              selectedImages.filter((e) => e !== image)
                            );
                            setSelectedImagesForDB(
                              selectedImagesForDB.filter((v, i) => i !== index)
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </>
              )}
              
            </div>
          </Modal>
          {loadingMedia ? (
            <Loading />
          ) : media && media.length > 0 ? (
            <div>
              <div className="upload-select-more-div">
                <input
                  type={"file"}
                  multiple
                  accept={"image/png, image/jpeg, image/jpg"}
                  onChange={handleSelectImages}
                  hidden
                  ref={inputRef}
                />
                <button
                  className="upload-media-btn"
                  onClick={openModal}
                >
                  Upload More
                </button>
                <button
                  className="upload-media-btn"
                  onClick={handleDeleteMedia}
                >
                  Delete All
                </button>
              </div>
              <div className="db-parent-image-container">
                <div className="db-images-container">
                  {media.map((image, index) => (
                    <div key={index} className="db-image">
                      <img
                        src={image.url}
                        height="120"
                        style={{
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      />

                      <CopyToClipboard
                        text={image.url}
                        onCopy={() => setCopied(true)}
                      >
                        <button onClick={() => {}}>
                          Copy URL <Copy />
                        </button>
                      </CopyToClipboard>
                      <button onClick={handleDeleteImage(image._id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedImages.length === 0 ? (
            <div
              className="upload-media-div"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div>
                <p className="upload-media-head">Drag and drop files here</p>
                <p className="upload-media-subtext">png, jpg, jpeg</p>
                <p className="upload-media-or">OR</p>
                <input
                  type={"file"}
                  multiple
                  accept={"image/png, image/jpeg, image/jpg"}
                  onChange={handleSelectImages}
                  hidden
                  ref={inputRef}
                />
                <button
                  className="upload-media-btn"
                  onClick={() => inputRef.current.click()}
                >
                  Select Files
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="upload-select-more-div">
                <input
                  type={"file"}
                  multiple
                  accept={"image/png, image/jpeg, image/jpg"}
                  onChange={handleSelectImages}
                  hidden
                  ref={inputRef}
                />
                <button
                  className="upload-media-btn"
                  onClick={() => inputRef.current.click()}
                >
                  Select More
                </button>
                <button className="upload-media-btn" onClick={handleDBupload}>
                  Upload
                </button>
              </div>
              <div className="parent-image-container">
                <div className="images-container">
                  {selectedImages &&
                    selectedImages.map((image, index) => (
                      <div key={index} className="image">
                        <img
                          src={image}
                          height="100"
                          // style={{ height: "100px", width: "auto", }}
                        />
                        <button
                          onClick={() => {
                            setSelectedImages(
                              selectedImages.filter((e) => e !== image)
                            );
                            setSelectedImagesForDB(
                              selectedImagesForDB.filter((v, i) => i !== index)
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </>
      }
    />
  );
};

export default Media;
