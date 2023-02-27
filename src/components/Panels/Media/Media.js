import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMediaFromAPI, uploadMedia } from "../../../Redux/slices/MediaSlice";
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
import { Tooltip } from "@mui/material";

const Media = () => {
  const dispatch = useDispatch();
  const { loadingMedia, media, creationInProcess, creationError } = useSelector(
    (state) => state.media
  );
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagesForDB, setSelectedImagesForDB] = useState([]);
  const [copied, setCopied] = useState(false);
  const toastId = useRef(null);
  // const [dataArray, setDataArray] = useState([])
  const inputRef = useRef();

  useEffect(() => {
    dispatch(getMediaFromAPI());
  }, [dispatch]);

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
    toastId.current = toast("Uploading....", {
      icon: <Spinner size={10} color={"white"} />,
    });
    console.log(selectedImages);
    console.log(selectedImagesForDB);
    dispatch(uploadMedia(selectedImagesForDB));
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
          <CustomToast />
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
                  onClick={() => inputRef.current.click()}
                >
                  Upload More
                </button>
                {/* <button className="upload-media-btn" onClick={handleDBupload}>
                  Upload More
                </button> */}
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
