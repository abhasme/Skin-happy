import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Container,
  Form,
  Button,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";
import Slider from "react-slick";
import { imageService, tagService } from "../services/index";
import { useHistory } from "react-router";
import Cropper from "react-cropper";
import { toast } from "react-toastify";
import { Storage } from "../Storage";
import axios from "axios";

const REACT_APP_API_BASEURL = process.env.REACT_APP_API_BASEURL;
const REACT_APP_IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

export default function CompleteDetail(props) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [, forceUpdate] = useState("");
  const [showCrop, setShowCrop] = useState(false);
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState([]);
  const [image, setImage] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [manageTag, setManageTag] = useState([]);
  const [enteredTag, setEnteredTag] = React.useState();
  const [tags, setTags] = React.useState([]);
  const [search, setSearch] = useState("");
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
      tag: [{ id: "", tag_name: "" }],
    },
  ]);
 
  
  const history = useHistory();
  let slider1 = [];
  let slider2 = [];

  useEffect(() => {
    getDatails();
    getAvailTag();
  }, []);

  const getDatails = () => {
    let array = [];
    let tagrry = [];
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
          tag: elem.tags_array && elem.tags_array ? elem.tags_array : "",
        });
      });
    setData(array);
  };

  useEffect(() => {
    getAvailTag();
  }, [search]);

  const getAvailTag = () => {
    let param = {
      search: search,
    };
    tagService
      .get_tags(param)
      .then((res) => {
        if (res.status === true) {
          let tagrry = [];
          res.data.map((elem) => {
            tagrry.push({ tag_name: elem.tag_name, id: elem._id });
          });
          setManageTag(res.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const updateDaignosis = () => {
    let array = [];
    let toSend = [];
    data[currentIndex].tag.map((elem) => {
      array.push(elem._id);
    });
    toSend = [
      {
        details: array,
        id: data[currentIndex].id,
      },
    ];
    let postData = {
      array: toSend,
    };
    imageService
      .update_details(postData)
      .then((res) => {
        history.push("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      aray[currentIndex].skintype = e;
    }
    if (type == "gender") {
      aray[currentIndex].gender = e;
    }
    if (type == "age") {
      aray[currentIndex].ageRange = e;
    }
    if (type == "severity") {
      aray[currentIndex].severity = e;
    }
    if (type == "location") {
      aray[currentIndex].location = e;
    }
    setData(aray);
  };

  const cancelDetail = () => {
    history.push("/home");
  };

  const cropImage = (e) => {
    setShowCrop(true);
    image.push(
      REACT_APP_IMAGE_URL + data[currentIndex].image
    );
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
        console.log(res, "res");
        const result = fetch(res.data[0], {
          method: "PUT",
          body: file,
        });
        let name = res.data[0].split("?")[0].split("com/")[1];
        console.log(name, "name");
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
            setTimeout(()=>{
              if (res.status == true) {
                let ary = [...data];
                ary[currentIndex].image = res.data.image_name;
                setLoader(false);
                toast.success(`Image replaced with original image`);
                setData(ary);
                setShowCrop(false);
              } else {
                toast.error(res.message);
              }
            },3000)
          
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
      toast.success(`${ary.length} Photo Delete From Completed Details`);
      history.push("/home");
    });
  };

  const updateDetails = () => {
    let toSend = [];
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
    let postData = {
      detailsArray: toSend,
    };
    imageService
      .update_Completed_details(postData)
      .then((res) => {
        if (res.status === true) {
          updateDaignosis();
          toast.success(
            `Details updated for ${toSend.length} Photos.`
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const deleteTag = (key) => {
    let newArr = [...data];
    newArr[currentIndex].tag.splice(key, 1);
    setData(newArr);
  };

  const createTag = (event) => {
    setEnteredTag(event.target.value);
    setSearch(event.target.value);
    if ((event.keyCode == "8") & (event.target.value === "")) {
      const deleteTag = (key) => {
        let newArr = [...tags];
        newArr.pop();
        setTags(newArr);
        let newData = [...data];
        newData[currentIndex].tag.pop();
        setData(newData);
      };
      deleteTag();
    }
    if (event.keyCode == "13") {
      addNewTag();
      event.target.value = "";
    }
  };

  const addNewTag = () => {
    let postData = {
      tag_name: enteredTag,
    };
    tagService
      .add_tag(postData)
      .then((res) => {
        let newData = [...data];
        newData[currentIndex].tag = [
          ...newData[currentIndex].tag,
          { tag_name: enteredTag, _id: res.data._id },
        ];
        setData(newData);
        getAvailTag();
        setEnteredTag("");
        document.getElementById("gettag").value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addAvailTag = (value) => {
    let newData = [...data];
    newData[currentIndex].tag = [
      ...newData[currentIndex].tag,
      { tag_name: value.tag_name, _id: value._id },
    ];
    setData(newData);
    document.getElementById("gettag").value = "";
  };

  const RemoveImage = () => {
    let array = [...data];
    array.splice(currentIndex, 1);
    setData(array);
    if (data.length < 2) {
      history.push("/home");
    }
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
          <Row className="mt-3 px-md-5 mb-5">
            <Col md={6}>
              <div className="d-flex align-items-center mt-2 mb-3 my-md-4">
                <h5 className="mb-0 pageHeading">Details</h5>
                <div
                  className="toolbar-end"
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
                  <span onClick={(e) => deleteImage(e)}>
                    <img
                      src="/assets/images/delete.svg"
                      className="all-cursor"
                    />
                  </span>
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
                      <img
                        alt="img"
                        src={`${REACT_APP_IMAGE_URL + elem.image}`}
                        style={{ objectFit: "contain" }}
                        className="w-100"
                      />
                    </div>
                  ))}
              </Slider>
            </Col>
            <Col className="px-md-5 mt-md-4" md={6}>
              <Form className="detailsFrom">
                <Form.Group
                  className="input_gap custom-select"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="small">Skin Type</Form.Label>
                  <Select
                    value={data && data[currentIndex].skintype}
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
                    value={data && data[currentIndex].gender}
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
                    value={data && data[currentIndex].ageRange}
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
                    value={data && data[currentIndex].location}
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
                    value={data && data[currentIndex].severity}
                    onChange={(e) => {
                      setSkinType(e, "severity");
                    }}
                    options={severity}
                  />
                </Form.Group>

                <Form.Group
                  className="input_gap"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label className="small">Diagnosis</Form.Label>
                  <div className="tagcreator">
                    <span>
                      {data &&
                        data[currentIndex].tag &&
                        data[currentIndex].tag.map((tag, index) => {
                          return (
                            <span key={index} className="tag">
                              {tag.tag_name}
                              <span onClick={(event) => deleteTag(index)}>
                                &#10006;
                              </span>
                            </span>
                          );
                        })}
                      <Dropdown className="inputholder">
                        <Dropdown.Toggle variant="none" id="dropdown-basic">
                          <input
                            autocomplete="off"
                            onKeyUp={(event) => createTag(event)}
                            id="gettag"
                            placeholder="Enter new tag"
                          />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {manageTag &&
                            manageTag.map((vailTag, index) => {
                              return (
                                <Dropdown.Item
                                  key={index}
                                  onClick={() => addAvailTag(vailTag)}
                                >
                                  {vailTag.tag_name}
                                </Dropdown.Item>
                              );
                            })}
                          {enteredTag && (
                            <Dropdown.Item
                              className="addSingleTag"
                              onClick={() => addNewTag(enteredTag)}
                            >
                              + Create ‘{enteredTag}’
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </span>
                  </div>
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
                      onClick={() => cancelDetail()}
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
