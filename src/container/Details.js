import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Container, Form, Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import Slider from "react-slick";
import { imageService, update_basic_details } from "../services/index";
import { useHistory } from "react-router";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import Cropper from "react-cropper";
import { Storage } from "../Storage";
import axios from "axios";

const REACT_APP_API_BASEURL = process.env.REACT_APP_API_BASEURL;
const REACT_APP_IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

export default function Details(props) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [, forceUpdate] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [image, setImage] = useState([]);
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState([]);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([
    {
      image: "",
      id: "",
      skintype: "",
      gender: "",
      ageRange: "",
      location: "",
      severity: "",
    },
  ]);

  const validator = useRef(
    new SimpleReactValidator({ autoForceUpdate: { forceUpdate: forceUpdate } })
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const history = useHistory();
  let slider1 = [];
  let slider2 = [];
  useEffect(() => {
    getDatails();
  }, []);

  const getDatails = () => {
    let array = [];
    history.location.state &&
      history.location.state[0].images.map((elem, i) => {
        array.push({
          image: elem.image_name,
          id: elem._id,
          skintype:
            elem.basic_details && elem.basic_details.skinType
              ? elem.basic_details.skinType
              : "",
          gender:
            elem.basic_details && elem.basic_details.gender
              ? elem.basic_details.gender
              : "",
          ageRange:
            elem.basic_details && elem.basic_details.ageRange
              ? elem.basic_details.ageRange
              : "",
          location:
            elem.basic_details && elem.basic_details.location
              ? elem.basic_details.location
              : "",
          severity:
            elem.basic_details && elem.basic_details.severity
              ? elem.basic_details.severity
              : "",
        });
      });
    setData(array);
  };
  const RemoveImage = () => {
    let array = [...data];
    array.splice(currentIndex, 1);
    setData(array);
    if (data.length < 2) {
      history.push("/home");
    }
  };

  const updateDetails = () => {
    let toSend = [];
    if (history.location.state[0].type === "single") {
      toSend = [
        {
          basic_details: {
            skinType: data[0].skintype,
            gender: data[0].gender,
            ageRange: data[0].ageRange,
            location: data[0].location,
            severity: data[0].severity,
          },
          id: data[0].id,
        },
      ];
    } else {
      data.map((elem, i) => {
        toSend.push({
          basic_details: {
            skinType: data[0].skintype,
            gender: data[0].gender,
            ageRange: data[0].ageRange,
            location: data[0].location,
            severity: data[0].severity,
          },
          id: elem.id,
        });
      });
    }
    let postData = {
      detailsArray: toSend,
    };
    if (  
      data[0].ageRange != "" &&
      data[0].location != "" &&
      data[0].severity != ""
    ) {
      imageService.update_basic_details(postData).then((res) => {
        if (res.status === true) {
          toast.success(`Details updated for ${toSend.length} Photos.`);
          history.push("/home");
        }
      });
    } else{
      imageService.update_basic_details(postData).then((res) => {
        history.push("/home");
      });
    }
  };

  // useEffect(() => {
  //   setNav1(slider1);
  // }, [slider1]);

  var settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <img alt="img" src="/assets/images/next.svg" />,
    prevArrow: <img alt="img" src="/assets/images/prev.svg" />,
    beforeChange: (current, next) => setCurrentIndex(current),
    afterChange: (current) => setCurrentIndex(current),
  };
  var navSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    dots: false,
    focusOnSelect: true,
    slidesToShow: 6,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const skintype = [
    { value: "Pale", label: "Pale" },
    { value: "Light brown", label: "Light brown" },
    { value: "Dark brown", label: "Dark brown" },
  ];
  const gender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const location = [
    { value: "Full face", label: "Full face" },
    { value: "Upper face", label: "Upper face" },
    { value: "Lower face", label: "Lower face" },
    { value: "Side upper", label: "Side upper" },
    { value: "Side lower", label: "Side lower" },
    { value: "Chest", label: "Chest" },
    { value: "Back", label: "Back" },
  ];
  const ageGroup = [
    { value: "12 - 16 Years", label: "12 - 16 Year" },
    { value: "17 - 28 Years", label: "17 - 28 Year" },
    { value: " 29 - 50 Years", label: "29 - 50 Year" },
    { value: "50 Plus Years", label: "50 - Plus Year" },
  ];
  const severity = [
    { value: "Mild", label: "Mild" },
    { value: "Medium", label: "Medium" },
    { value: "Extreme", label: "Extreme" },
  ];

  const setSkinType = (e, type) => {
    let aray = [...data];
    if (type == "skintype") {
      if( history.location.state[0].type === "multiple" ){
        aray.map((elem)=>{
          elem.skintype = e;
        })
      }
      else{
        aray[currentIndex].skintype = e; 
      }
     
    }
    if (type == "gender") {
      if( history.location.state[0].type === "multiple" ){
        aray.map((elem)=>{
          elem.gender = e;
        })
      }
      else{
        aray[currentIndex].gender = e; 
      }
      
    }
    if (type == "age") {
      if( history.location.state[0].type === "multiple" ){
        aray.map((elem)=>{
          elem.ageRange = e;
        })
      }
      else{
        aray[currentIndex].ageRange = e;
      }
     
    }
    if (type == "severity") {
      if( history.location.state[0].type === "multiple" ){
        aray.map((elem)=>{
          elem.severity = e;
        })
      }
      else{
        aray[currentIndex].severity = e;
      }
    
    }
    if (type == "location") {
      if( history.location.state[0].type === "multiple" ){
        aray.map((elem)=>{
          elem.location = e;
        })
      }
      else{
        aray[currentIndex].location = e;
      }
     
    }
    setData(aray);
  };

  const cropImage = (e) => {
    setShowCrop(true);
    image.push(REACT_APP_IMAGE_URL + data[currentIndex].image);
    setImage(image);
  };

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
  }

  const getCropData = (e) => {
    setLoader(true);
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      let imgBase64 = cropper.getCroppedCanvas().toDataURL();
      const file = DataURIToBlob(imgBase64);
      const response = axios({
        method: "GET",
        url: `${REACT_APP_API_BASEURL}get_image_urls?image_count=1`,
      })
        .then((res) => {
          const result = fetch(res.data[0], {
            method: "PUT",
            body: file,
          });
          let name = res.data[0].split("?")[0].split("com/")[1];
          let postData = {
            image_name: [name],
          };
          imageService
            .uploadImage(postData)
            .then((res) => {
              if (res.status == true) {
                setLoader(false);
                Storage.set("flag", "new");
                toast.success(`Image cropped and added as new`);
                history.push("/home");
              } else {
                toast.error(res.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  
  const getReplaceData = (id) => {
    setLoader(true);
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      let imgBase64 = cropper.getCroppedCanvas().toDataURL();
      const file = DataURIToBlob(imgBase64);
      const response = axios({
        method: "GET",
        url: `${REACT_APP_API_BASEURL}get_image_urls?image_count=1`,
      }).then((res) => {
        console.log(res, "res");
        const result = fetch(res.data[0], {
          method: "PUT",
          body: file,
        });
        let name = res.data[0].split("?")[0].split("com/")[1];
        console.log(name, "name");
        let postData = {
          image_name: name,
          photo_id: data[currentIndex].id,
        };
        imageService
          .update_photos(postData)
          .then((res) => {
            setTimeout(() => {
              if (res.status == true) {
                let ary = [...data];
                ary[currentIndex].image = res.data.image_name;
                console.log(ary[currentIndex], "aryarayarayararary");
                setShowCrop(false);
                setLoader(false);
                setData(ary);
                toast.success(`Image replaced with original image`);
              } else {
                toast.error(res.message);
              }
            }, 3000);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  };

  const cancelCrop = () => {
    setShowCrop(false);
  };

  const deleteImage = (e) => {
    let ary = [];
    ary.push({ id: data[currentIndex].id, name: data[currentIndex].image });
    let postData = {
      images: ary,
    };
    imageService.delete_new_uploads(postData).then((res) => {
      setData();
      toast.success(`${ary.length} Photo Delete From Details`);
      history.push("/home");
    });
  };

  return (
    <section className="h-100">
      {loader ? (
        <div className="fullloading">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        ""
      )}
      <Container fluid>
        <Row className="border-bottom py-3 px-md-5 ">
          <Col className="d-flex align-items-center all-cursor">
            <img
              src="/assets/images/arrow_back.svg"
              height="15"
              onClick={() => history.goBack()}
            />{" "}
            &nbsp;&nbsp;{" "}
            <p className="mb-0" onClick={() => history.goBack()}>
              Back
            </p>
          </Col>
        </Row>
        {showCrop && showCrop === true ? (
          <div className="croppingSec border-top">
            <div className="px-md-5 py-3">
              <p>
                <b>
                  <span>Crop</span>&nbsp; {data[currentIndex].image}
                </b>
                &nbsp;&nbsp;
                <a
                  href="/"
                  style={{ textDecoration: "none", fontSize: "12px" }}
                >
                  Reset
                </a>
              </p>
            </div>
            <div>
              <div style={{ width: "100%" }}>
                <Cropper
                  style={{ height: 400, width: "100%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image && image[0]}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                  guides={true}
                />
              </div>
              <Row className="justify-content-center mt-4">
                <Col md={3}>
                  <Button
                    className="theme-btn btn w-100"
                    onClick={() => getCropData()}
                  >
                    Create a Copy & Share
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    className="transp-btn btn w-100"
                    type="button"
                    onClick={() => getReplaceData()}
                  >
                    Replace Original
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    className="transp-btn btn w-100"
                    type="button"
                    onClick={() => cancelCrop()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        ) : (
          <Row className="mt-3 px-md-5 pb-5">
            <Col md={6}>
              <div className="d-flex align-items-center mt-2 mb-3 my-md-4">
                <h5 className="mb-0 pageHeading">Add Details</h5>
                {history.location.state &&
                history.location.state[0].type === "single" ? (
                  ""
                ) : (
                  <p className="mb-0 ms-2 small subheading">
                    ({currentIndex + 1}/{data && data.length} Photos)
                  </p>
                )}
                <div
                  className="toolbar-end"
                  style={
                    data && data.length === 1
                      ? { marginRight: "0px" }
                      : {
                          marginRight: "130px",
                          paddingRight: "30px",
                          borderRight: "1px solid #909090",
                        }
                  }
                >
                  <span onClick={() => cropImage(data[currentIndex].image)}>
                    <img
                      src="/assets/images/cropping.svg"
                      className="all-cursor"
                    />
                  </span>
                  {history.location.state &&
                  history.location.state[0].type === "multiple" ? (
                    ""
                  ) : (
                    <span onClick={(e) => deleteImage(e)}>
                      <img
                        src="/assets/images/delete.svg"
                        className="all-cursor"
                      />
                    </span>
                  )}
                </div>
              </div>
              <Slider
                className="detailsSlider"
                ref={(slider) => (slider1 = slider)}
                {...settings}
              >
                {data &&
                  data.map((elem, i) => (
                    <div className="lt-slide">
                      {history.location.state &&
                      history.location.state[0].type === "single" ? (
                        ""
                      ) : (
                        <div className="slideOpt">
                          <div className="d-flex align-items-center justify-content-between">
                            <h5 className="mb-0 text-white">Img-1.jpg</h5>
                            <p
                              className="mb-0 text-white all-cursor"
                              onClick={() =>
                                RemoveImage(data[currentIndex].image)
                              }
                            >
                              {" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                fill="white"
                                class="bi bi-x-lg"
                                viewBox="0 0 16 16"
                              >
                                <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                              </svg>
                              <span>Remove Image</span>
                            </p>
                          </div>
                        </div>
                      )}
                      <img
                        alt="img"
                        src={REACT_APP_IMAGE_URL + elem.image}
                        style={{ objectFit: "contain" }}
                        className="w-100"
                      />
                    </div>
                  ))}
              </Slider>
              {history.location.state[0].type === "single" ? (
                ""
              ) : (
                <Slider
                  className="navSlider"
                  {...navSettings}
                  asNavFor={nav1}
                  ref={(slider) => (slider2 = slider)}
                >
                  {data &&
                    data.map((elem, i) => (
                      <div className="p-md-3 p-1 thumbslider">
                        <img
                          alt="img"
                          src={`${REACT_APP_IMAGE_URL + elem.image}`}
                          className="w-100"
                        />
                      </div>
                    ))}
                </Slider>
              )}
            </Col>
            <Col className="px-md-5 mt-md-4" md={6}>
              <Form className="detailsFrom">
                <Form.Group
                  className="input_gap custom-select"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="small">Skin Type</Form.Label>
                  <Select
                    value={
                      data && data[currentIndex] && data[currentIndex].skintype
                    }
                    onChange={(e) => {
                      setSkinType(e, "skintype");
                    }}
                    options={skintype}
                  />
                </Form.Group>
                <Form.Group
                  className="input_gap custom-select"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="small">Gender</Form.Label>
                  <Select
                    value={
                      data && data[currentIndex] && data[currentIndex].gender
                    }
                    onChange={(e) => {
                      setSkinType(e, "gender");
                    }}
                    options={gender}
                  />
                </Form.Group>
                <Form.Group
                  className="input_gap custom-select"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="small">Age Range</Form.Label>
                  <Select
                    value={
                      data && data[currentIndex] && data[currentIndex].ageRange
                    }
                    onChange={(e) => {
                      setSkinType(e, "age");
                    }}
                    options={ageGroup}
                  />
                </Form.Group>
                <Form.Group
                  className="input_gap custom-select"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="small">Location</Form.Label>
                  <Select
                    value={
                      data && data[currentIndex] && data[currentIndex].location
                    }
                    onChange={(e) => {
                      setSkinType(e, "location");
                    }}
                    options={location}
                  />
                </Form.Group>
                <Form.Group
                  className="input_gap custom-select"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="small">Severity</Form.Label>
                  <Select
                    value={
                      data && data[currentIndex] && data[currentIndex].severity
                    }
                    onChange={(e) => {
                      setSkinType(e, "severity");
                    }}
                    options={severity}
                  />
                </Form.Group>
                <Row>
                  <Col>
                    <Button
                      className="theme-btn-outline btn w-100"
                      onClick={() => updateDetails()}
                    >
                      Apply Changes
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="transp-btn btn w-100"
                      type="button"
                      onClick={() => history.push("/home")}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
}
