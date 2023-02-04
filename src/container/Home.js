import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Container,
  Tab,
  Tabs,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import { imageService } from "../services/index";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import PartialComplete from "../container/partialComplete";
import { Storage } from "../Storage";
import Completed from "../container/completed";
import Dropzone from "react-dropzone-uploader";
import axios from "axios";
import "react-dropzone-uploader/dist/styles.css";

const REACT_APP_API_BASEURL = process.env.REACT_APP_API_BASEURL;
const REACT_APP_IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

export default function Home() {
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [images, setImages] = useState([]);
  const [partialCount, setPartialCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [selectImages, setSelectImages] = useState([]);
  const [singleData, setSingleData] = useState();
  const [flag, setFlag] = useState(Storage.get("flag"));

  const history = useHistory();
  var imageUpload = false;

  const goNext = () => {
    if (selectImages.length > 1) {
      let sendState = [{ type: "multiple", images: selectImages }];
      history.push("/details", sendState);
    } else {
      var index = images.findIndex((p) => p._id == selectImages[0]._id);
      var selected_image = images[index];
      var first_image = images[0];
      images[index] = first_image;
      images[0] = selected_image;
      let sendState = [{ type: "single", images: images }];
      history.push("/details", sendState);
    }
  };

  const diagnosis = () => {
    if (selectImages.length > 1) {
      let sendState = [{ type: "multiple", images: selectImages, flag: "new" }];
      history.push("/add-diagnosis", sendState);
    } else {
      var index = images.findIndex((p) => p._id == selectImages[0]._id);
      var selected_image = images[index];
      var first_image = images[0];
      images[index] = first_image;
      images[0] = selected_image;

      let sendState = [{ type: "single", images: images, flag: "new" }];
      history.push("/add-diagnosis", sendState);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getNewImages();
    }, 3000);
  }, []);

  const getNewImages = () => {
    imageService
      .get_new_uploads()
      .then((res) => {
        if (res.status == true) {
          setImages(res.data);
          getCounts();
          getCompleteCounts();
          if (imageUpload == true) {
            setLoader(false);
            toast.success("Uploaded successfully");
            imageUpload = false;
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCounts = () => {
    imageService
      .get_partially_uploads()
      .then((res) => {
        if (res.status == true) {
          setPartialCount(res.data.length);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCompleteCounts = () => {
    imageService
      .get_complete()
      .then((res) => {
        if (res.status == true) {
          constCompleteCount(res.data.length);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const constpartialCount = (count) => {
    setPartialCount(count);
  };

  const constCompleteCount = (count) => {
    setCompleteCount(count);
  };

  useEffect(() => {}, [images]);

  const getImages = async (files) => {
    setLoader(true);
    const response = await axios({
      method: "GET",
      url: `${REACT_APP_API_BASEURL}get_image_urls?image_count=${Number(files && files.length)}`,
    });
    var image_arr = [];
    Object.keys(files).map(async (element, i) => {
      const result = await fetch(response.data[i], {
        method: "PUT",
        body: files[i],
      });
      image_arr.push(response.data && response.data[i].split("?")[0]);
      setImages(image_arr);
      if (files.length === image_arr.length) {
        let imgName = [];
        image_arr.map((elem) => {
          imgName.push(elem.split("com/")[1]);
        });
        let postData = {
          image_name: imgName,
        };
        imageService
          .uploadImage(postData)
          .then((res) => {
            if (res.status == true) {
              imageUpload = true;
              setLoader(false);
              setTimeout(function () {
                getNewImages();
              }, 1000);
            } else {
              toast.error(res.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const onDelete = () => {
    setLoader(true);
    let ary = [];
    selectImages.map((elem) => {
      ary.push({ id: elem._id, name: elem.image_name });
    });
    let postData = {
      images: ary,
    };
    imageService
      .delete_new_uploads(postData)
      .then((res) => {
        setLoader(false);
        setChecked(!checked);
        setSelectImages([]);
        getNewImages();

        document
          .querySelectorAll("input[type=checkbox]")
          .forEach((el) => (el.checked = false));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectImage = (e, i) => {
    let array = selectImages;
    if (array.includes(e)) {
      const index = array.indexOf(e);
      if (index > -1) {
        array.splice(index, 1);
      }
      setSelectImages(array);
      setChecked(!checked);
    } else {
      array.push(e);
      setSelectImages(array);
      setChecked(!checked);
    }
  };

  const clearSelection = () => {
    setChecked(false);
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false));
    setSelectImages([]);
  };

  const onTabClick = (e) => {
    Storage.set("flag", e.target.dataset.rrUiEventKey);
    setFlag(e.target.dataset.rrUiEventKey);
  };

  return (
    <section className="h-100">
      <Container fluid>
        {loader ? (
          <div className="fullloading">
            <Spinner animation="border" variant="light" />
          </div>
        ) : (
          ""
        )}
        <Row className="position-relative">
          {images && images.length > 0 ? (
            <div className="uploadbtn all-cursor">
              <button className="btn theme-btn btn-primary inputfilebtn all-cursor">
                <input
                  type="file"
                  multiple
                  // onSubmit={handleSubmit}
                  onChange={(e) => getImages(e.target.files)}
                  accept="image/*"
                />
                Upload Photos
              </button>
            </div>
          ) : (
            ""
          )}
          <Tabs
            onClick={(e) => onTabClick(e)}
            defaultActiveKey={flag}
            id="uncontrolled-tab-example"
            className="mb-3 px-md-5"
          >
            <Tab eventKey="new" title={`New (${images && images.length})`}>
              <div className="d-md-flex text-md-center align-items-center justify-content-center mb-4 px-md-5">
                {selectImages && selectImages.length > 0 ? (
                  <div className="px-3 ">
                    <span className="text-theme mulish_font h6">
                      {selectImages && selectImages.length} Photo Selected
                    </span>{" "}
                    &nbsp;&nbsp;&nbsp;{" "}
                    <a
                      className="small text-primary clearSelection all-cursor"
                      onClick={() => clearSelection()}
                    >
                      Clear Selection
                    </a>{" "}
                    &nbsp;&nbsp;&nbsp;
                    <div
                      aria-label="Basic example"
                      role="group"
                      class="btn-group fancy-btn-group me-3"
                    >
                      <button
                        type="button"
                        class="btn btn-outline-secondary small"
                        onClick={() => goNext()}
                      >
                        <img src="assets/images/details.svg" height="16" />{" "}
                        &nbsp; Add Details
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline-secondary small"
                        onClick={() => diagnosis()}
                      >
                        <img src="assets/images/dignosis.svg" height="16" />{" "}
                        &nbsp; Add Diagnosis
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete()}
                        class="btn btn-outline-secondary  small"
                      >
                        <img src="assets/images/delete.svg" height="16" />{" "}
                        &nbsp; Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {images && images.length > 0 ? (
                  <div className="text-end  small ms-auto sortDropdown">
                    <span>Sort:</span>
                    <Dropdown className="d-inline-block p-0 link-dropdown mx-2 ">
                      <Dropdown.Toggle id="dropdown-autoclose-true">
                        Recently Uploaded
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {images && images.length > 0 ? (
                <Row className="px-md-5">
                  {images.map((elem, i) => (
                    <Col md={2}>
                      <div className="imgThumb">
                        <input
                          type="checkbox"
                          onChange={(e) => selectImage(elem)}
                        />
                        <span class="fancycheck">
                          <span></span>
                        </span>
                        <img
                          src={REACT_APP_IMAGE_URL + elem.image_name}
                          style={{ objectFit: "cover" }}
                          className="w-100"
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Row className="px-md-5">
                  <Col md={12} className="mx-auto no-data text-center">
                    <form>
                      <img src="/assets/images/image_icon.svg" />
                      <h5 className="py-4 text-theme">
                        Looks like you have not uploaded any records yet!
                      </h5>
                      <button className="btn theme-btn btn-primary inputfilebtn">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => getImages(e.target.files)}
                          accept="image/*"
                        />
                        Upload Photos
                      </button>
                    </form>
                  </Col>
                </Row>
              )}
            </Tab>
            <Tab
              eventKey="partiallyCompleted"
              title={`Partially Completed (${partialCount})`}
            >
              <PartialComplete
                constpartialCount={(e) => constpartialCount(e)}
              />
            </Tab>
            <Tab eventKey="completed" title={`Completed(${completeCount})`}>
              <Completed constpartialCount={(e) => constCompleteCount(e)} />
            </Tab>
          </Tabs>
        </Row>
      </Container>
    </section>
  );
}
