import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Container,
  Tab,
  Tabs,
  Dropdown,
  ButtonGroup,
  ListGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { imageService, tagService } from "../services/index";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const REACT_APP_API_BASEURL = process.env.REACT_APP_API_BASEURL;
const REACT_APP_IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

export default function PartialComplete({ constpartialCount }) {
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [images, setImages] = useState([]);
  const [selectImagespart, setSelectImagespart] = useState([]);
  const [skinTypeFilter, setSkinTypeFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [ageGroupFilter, setAgeGroupFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [severityFilter, setSeverityFilter] = useState([]);
  const [diagnosisFilter, setDiagnosisFilter] = useState([]);
  const [newSelectedRecord, setNewSelectedRecord] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [filterFlag, setFilterFlag] = useState(false);
  const [loader, setLoader] = useState(false);

  const history = useHistory();

  useEffect(() => {
    getNewImages1();
    getTags();
  }, []);

  const getTags = () => {
    tagService
      .get_tags()
      .then((res) => {
        if (res.status == true) {
          setTagList(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const diagnosis = () => {
    if (selectImagespart.length > 1) {
      let sendState = [
        {
          type: "multiple",
          images: selectImagespart,
          flag: "partiallyCompleted",
        },
      ];
      history.push("/add-diagnosis", sendState);
    } else {
      var index = images.findIndex((p) => p._id == selectImagespart[0]._id);
      var selected_image = images[index];
      var first_image = images[0];
      images[index] = first_image;
      images[0] = selected_image;

      let sendState = [
        { type: "single", images: images, flag: "partiallyCompleted" },
      ];
      history.push("/add-diagnosis", sendState);
    }
  };

  const getNewImages1 = () => {
    setNewSelectedRecord([]);
    imageService
      .get_partially_uploads()
      .then((res) => {
        if (res.status == true) {
          setImages(res.data);
          constpartialCount(res.data.length);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectImage = (e) => {
    let array = selectImagespart;
    if (array.includes(e)) {
      const index = array.indexOf(e);
      if (index > -1) {
        array.splice(index, 1);
      }
      setSelectImagespart(array);
      setChecked(!checked);
    } else {
      array.push(e);
      setSelectImagespart(array);
      setChecked(!checked);
    }
  };

  const goNext = () => {
    if (selectImagespart.length > 1) {
      let sendState = [{ type: "multiple", images: selectImagespart }];
      history.push("/details", sendState);
    } else {
      var index = images.findIndex((p) => p._id == selectImagespart[0]._id);
      var selected_image = images[index];
      var first_image = images[0];
      images[index] = first_image;
      images[0] = selected_image;
      let sendState = [{ type: "single", images: images }];
      history.push("/details", sendState);
    }
  };

  const onDelete = () => {
    setLoader(true);
    let ary = [];
    selectImagespart.map((elem) => {
      ary.push({ id: elem._id, name: elem.image_name });
    });
    let postData = {
      images: ary,
    };
    imageService
      .delete_new_uploads(postData)
      .then((res) => {
        setChecked(!checked);
        setSelectImagespart([]);
        setLoader(false);
        getNewImages1();
        document
          .querySelectorAll("input[type=checkbox]")
          .forEach((el) => (el.checked = false));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearSelection = () => {
    setChecked(false);
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false));
    setSelectImagespart([]);
  };

  const filerRecords = () => {
    setNewSelectedRecord([]);
    show ? setShow(false) : setShow(true);
    let param = {};
    var all_data = {
      skinType: skinTypeFilter,
      gender: genderFilter,
      ageRange: ageGroupFilter,
      location: locationFilter,
      severity: severityFilter,
      diagnosis: diagnosisFilter,
    };
    for (var key in all_data) {
      if (all_data[key]) {
        param[key] = all_data[key];
      }
    }
    imageService
      .get_partially_uploads_filter(param)
      .then((res) => {
        setImages(res.data);
        if (
          locationFilter.length > 0 ||
          skinTypeFilter.length > 0 ||
          genderFilter.length > 0 ||
          ageGroupFilter.length > 0 ||
          severityFilter.length > 0 ||
          diagnosisFilter.length
        ) {
          setFilterFlag(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setFilterValue = (e) => {
    if (newSelectedRecord.indexOf(e.target.value) !== -1) {
      newSelectedRecord.splice(newSelectedRecord.indexOf(e.target.value), 1); //deleting
    } else {
      newSelectedRecord.push(e.target.value);
    }
    setNewSelectedRecord(newSelectedRecord);
    if (e.target.name === "skinType") {
      let ary = [...skinTypeFilter];
      if (ary.indexOf(e.target.value) !== -1) {
        ary.splice(ary.indexOf(e.target.value), 1);
      } else {
        ary.push(e.target.value);
      }
      setSkinTypeFilter(ary);
    }
    if (e.target.name === "location") {
      let ary = [...locationFilter];
      if (ary.indexOf(e.target.value) !== -1) {
        ary.splice(ary.indexOf(e.target.value), 1);
      } else {
        ary.push(e.target.value);
      }
      setLocationFilter(ary);
    }
    if (e.target.name === "gender") {
      let ary = [...genderFilter];
      if (ary.indexOf(e.target.value) !== -1) {
        ary.splice(ary.indexOf(e.target.value), 1);
      } else {
        ary.push(e.target.value);
      }
      setGenderFilter(ary);
    }
    if (e.target.name === "ageGroup") {
      let ary = [...ageGroupFilter];
      if (ary.indexOf(e.target.value) !== -1) {
        ary.splice(ary.indexOf(e.target.value), 1);
      } else {
        ary.push(e.target.value);
      }
      setAgeGroupFilter(ary);
    }
    if (e.target.name === "severity") {
      let ary = [...severityFilter];
      if (ary.indexOf(e.target.value) !== -1) {
        ary.splice(ary.indexOf(e.target.value), 1);
      } else {
        ary.push(e.target.value);
      }
      setSeverityFilter(ary);
    }
    if (e.target.name === "diagnosis") {
      let ary = [...diagnosisFilter];
      if (ary.indexOf(e.target.value) !== -1) {
        ary.splice(ary.indexOf(e.target.value), 1);
      } else {
        ary.push(e.target.value);
      }
      setDiagnosisFilter(ary);
    }
  };

  const cancelFilter = () => {
    show ? setShow(false) : setShow(true);
    setSkinTypeFilter("");
    setLocationFilter("");
    setGenderFilter("");
    setAgeGroupFilter("");
    setSeverityFilter("");
    setDiagnosisFilter("");
    document.querySelectorAll("input[type=checkbox]").forEach(function (e) {
      if (newSelectedRecord.indexOf(e.value) !== -1) {
        e.checked = false;
      }
    });
  };

  const clearFilter = () => {
    getNewImages1();
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((el) => (el.checked = false));
    setSkinTypeFilter([]);
    setLocationFilter([]);
    setGenderFilter([]);
    setAgeGroupFilter([]);
    setSeverityFilter([]);
    setDiagnosisFilter([]);
  };

  const skintype = [
    { value: "Pale", label: "Pale" },
    { value: "Light brown", label: "Light brown" },
    { value: "Dark brown", label: "Dark brown" },
  ];
  const gender = [
    { value: "Female", label: "female" },
    { value: "Male", label: "male" },
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
    { value: "12 - 16 Years", label: "12-16yr" },
    { value: "17 - 28 Years", label: "17-28yr" },
    { value: " 29 - 50 Years", label: "29-50yr" },
    { value: "50 Plus Years", label: "50-plusyr" },
  ];
  const severity = [
    { value: "Mild", label: "mild" },
    { value: "Medium", label: "medium" },
    { value: "Extreme", label: "extreme" },
  ];

  const removeFilter = (type) => {
    if (type === "skinType") {
      setSkinTypeFilter([]);
      var skinType = [];
      document.querySelectorAll("input[type=checkbox]").forEach((el) => {
        {
          if (el.name == "skinType") {
            el.checked = false;
          }
        }
      });
    }
    if (type === "location") {
      setLocationFilter([]);
      var location = [];
      document.querySelectorAll("input[type=checkbox]").forEach((el) => {
        {
          if (el.name == "location") {
            el.checked = false;
          }
        }
      });
    }
    if (type === "ageGroup") {
      setAgeGroupFilter([]);
      var ageGroup = [];
      document.querySelectorAll("input[type=checkbox]").forEach((el) => {
        {
          if (el.name == "ageGroup") {
            el.checked = false;
          }
        }
      });
    }
    if (type === "gender") {
      setGenderFilter([]);
      var gender = [];
      document.querySelectorAll("input[type=checkbox]").forEach((el) => {
        {
          if (el.name == "gender") {
            el.checked = false;
          }
        }
      });
    }
    if (type === "diagnosis") {
      setDiagnosisFilter([]);
      var diagnosis = [];
      document.querySelectorAll("input[type=checkbox]").forEach((el) => {
        {
          if (el.name == "diagnosis") {
            el.checked = false;
          }
        }
      });
    }
    if (type === "severity") {
      setSeverityFilter([]);
      var severity = [];
      document.querySelectorAll("input[type=checkbox]").forEach((el) => {
        {
          if (el.name == "severity") {
            el.checked = false;
          }
        }
      });
    }

    let param = {};
    var all_data = {
      skinType: type == "skinType" ? skinType : skinTypeFilter,
      gender: type == "gender" ? gender : genderFilter,
      ageRange: type == "ageGroup" ? ageGroup : ageGroupFilter,
      location: type == "location" ? location : locationFilter,
      severity: type == "severity" ? severity : severityFilter,
      diagnosis: type == "diagnosis" ? diagnosis : diagnosisFilter,
    };
    for (var key in all_data) {
      if (all_data[key]) {
        param[key] = all_data[key];
      }
    }
    imageService
      .get_partially_uploads_filter(param)
      .then((res) => {
        setImages(res.data);
        if (
          locationFilter.length > 0 ||
          skinTypeFilter.length > 0 ||
          genderFilter.length > 0 ||
          ageGroupFilter.length > 0 ||
          severityFilter.length > 0 ||
          diagnosisFilter.length
        ) {
          setFilterFlag(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const newFilter = () => {};

  return (
    <>
      {loader ? (
        <div className="fullloading">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        ""
      )}
      <div className="d-md-flex text-md-center align-items-center mb-4 px-md-5">
        <div className="fancy-btn-group d-flex align-items-center">
          <Dropdown className="filterdropdown" show={show}>
            <Dropdown.Toggle
              className="btn btn-outline-secondary small"
              id="dropdown-basic"
              onClick={() => (show ? setShow(false) : setShow(true))}
            >
              <img alt="img" src="assets/images/filter_icon.svg" height="15" />{" "}
              &nbsp; Filters{" "}
              {(locationFilter.length ||
                skinTypeFilter.length ||
                genderFilter.length ||
                ageGroupFilter.length ||
                severityFilter.length ||
                diagnosisFilter.length) &&
              filterFlag === true
                ? `(${images.length} Result(s))`
                : ""}
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-3">
              <Row>
                <Col md="6">
                  <Row>
                    <Col md="6">
                      <h5>Skin Type</h5>
                      <ListGroup className="mb-3">
                        {skintype &&
                          skintype.map((elem, i) => (
                            <ListGroup.Item className="h6">
                              <label className="all-cursor">
                                <input
                                  type="checkbox"
                                  name="skinType"
                                  value={elem.value}
                                  onChange={(e) => setFilterValue(e)}
                                />
                                <span className="custom-checkbox"></span>{" "}
                                {elem.value}
                              </label>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Col>
                    <Col md="6">
                      <h5>Age Range</h5>
                      <ListGroup className="mb-3">
                        {ageGroup &&
                          ageGroup.map((elem, i) => (
                            <ListGroup.Item className="h6">
                              <label className="all-cursor">
                                <input
                                  type="checkbox"
                                  name="ageGroup"
                                  value={elem.value}
                                  onChange={(e) => setFilterValue(e)}
                                />
                                <span className="custom-checkbox"></span>{" "}
                                {elem.value}
                              </label>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Col>
                    <Col md="6">
                      <h5>Gender</h5>
                      <ListGroup className="mb-3">
                        {gender &&
                          gender.map((elem, i) => (
                            <ListGroup.Item className="h6">
                              <label className="all-cursor">
                                <input
                                  type="checkbox"
                                  name="gender"
                                  value={elem.value}
                                  onChange={(e) => setFilterValue(e)}
                                />
                                <span className="custom-checkbox"></span>{" "}
                                {elem.value}
                              </label>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Col>
                    <Col md="6">
                      <h5>Severity</h5>
                      <ListGroup className="mb-3">
                        {severity &&
                          severity.map((elem, i) => (
                            <ListGroup.Item className="h6">
                              <label className="all-cursor">
                                <input
                                  type="checkbox"
                                  name="severity"
                                  value={elem.value}
                                  onChange={(e) => setFilterValue(e)}
                                />
                                <span className="custom-checkbox"></span>{" "}
                                {elem.value}
                              </label>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md="3">
                  <h5>Location</h5>
                  <ListGroup className="mb-3">
                    {location &&
                      location.map((elem, i) => (
                        <ListGroup.Item className="h6">
                          <label className="all-cursor">
                            <input
                              type="checkbox"
                              name="location"
                              value={elem.value}
                              onChange={(e) => setFilterValue(e)}
                            />
                            <span className="custom-checkbox"></span>{" "}
                            {elem.value}
                          </label>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Col>
                <Col md="3" className="scrollable_div">
                  <h5>Diagnosis</h5>
                  <ListGroup className="mb-3">
                    {tagList &&
                      tagList.map((elem, i) => (
                        <ListGroup.Item className="h6">
                          <label className="all-cursor">
                            <input
                              type="checkbox"
                              name="diagnosis"
                              value={elem._id}
                              onChange={(e) => setFilterValue(e)}
                            />
                            <span className="custom-checkbox"></span>{" "}
                            {elem.tag_name}
                          </label>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Col>
              </Row>
              <hr style={{ marginLeft: "-1rem", marginRight: "-1rem" }} />
              <Row>
                <Col md="3">
                  <Button
                    className="theme-btn btn w-100"
                    onClick={() => filerRecords()}
                  >
                    Apply
                  </Button>
                </Col>
                <Col md="3">
                  <Button
                    className="transp-btn btn w-100"
                    type="button"
                    onClick={() => cancelFilter()}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col md="3">
                  <Button
                    className="transp-btn btn w-100"
                    type="button"
                    onClick={() => clearFilter()}
                  >
                    Clear all
                  </Button>
                </Col>
              </Row>
            </Dropdown.Menu>
          </Dropdown>
          {(locationFilter.length ||
            skinTypeFilter.length ||
            genderFilter.length ||
            ageGroupFilter.length ||
            severityFilter.length ||
            diagnosisFilter.length) &&
          filterFlag === true ? (
            <div class="appliedFilters">
              {skinTypeFilter.length > 0 ? (
                <span
                  className="all-cursor"
                  onClick={() => {
                    removeFilter("skinType");
                  }}
                >
                  Skin Type({skinTypeFilter.length}) &nbsp; &#10005;
                </span>
              ) : (
                ""
              )}
              {ageGroupFilter.length > 0 ? (
                <span
                  className="all-cursor"
                  onClick={() => {
                    removeFilter("ageGroup");
                  }}
                >
                  Age Range({ageGroupFilter.length}) &nbsp; &#10005;
                </span>
              ) : (
                ""
              )}
              {locationFilter.length > 0 ? (
                <span
                  className="all-cursor"
                  onClick={() => {
                    removeFilter("location");
                  }}
                >
                  Location({locationFilter.length}) &nbsp; &#10005;
                </span>
              ) : (
                ""
              )}
              {genderFilter.length > 0 ? (
                <span
                  className="all-cursor"
                  onClick={() => {
                    removeFilter("gender");
                  }}
                >
                  Gender({genderFilter.length}) &nbsp; &#10005;
                </span>
              ) : (
                ""
              )}
              {severityFilter.length > 0 ? (
                <span
                  className="all-cursor"
                  onClick={() => {
                    removeFilter("severity");
                  }}
                >
                  Severity({severityFilter.length}) &nbsp; &#10005;
                </span>
              ) : (
                ""
              )}
              {diagnosisFilter.length > 0 ? (
                <span
                  className="all-cursor"
                  onClick={() => {
                    removeFilter("diagnosis");
                  }}
                >
                  Diagnosis({diagnosisFilter.length}) &nbsp; &#10005;
                </span>
              ) : (
                ""
              )}
              <a
                onClick={() => clearFilter()}
                className="small text-primary transp-btn-remove all-cursor"
              >
                Clear all
              </a>
            </div>
          ) : (
            ""
          )}
        </div>
        {images && images.length > 0 ? (
          <div className="text-end  small ms-auto sortDropdown">
            <span>Sort:</span>
            <Dropdown className="d-inline-block p-0 link-dropdown mx-2 ">
              <Dropdown.Toggle id="dropdown-autoclose-true">
                Details Filled Recently
              </Dropdown.Toggle>
            </Dropdown>
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {selectImagespart && selectImagespart.length > 0 ? (
          <div className="px-md-5 px-3 mb-3 ">
            <span className="text-theme font16 mulish_font">
              {selectImagespart.length} Photo Selected
            </span>{" "}
            &nbsp;&nbsp;&nbsp;{" "}
            <a
              className="small text-primary clearSelection "
              href="#"
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
                <img src="assets/images/details.svg" height="16" /> &nbsp; Add
                Details
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary small"
                onClick={() => diagnosis()}
              >
                <img src="assets/images/dignosis.svg" height="16" /> &nbsp; Add
                Diagnosis
              </button>
              <button
                type="button"
                onClick={() => onDelete()}
                class="btn btn-outline-secondary  small"
              >
                <img src="assets/images/delete.svg" height="16" /> &nbsp; Delete
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {images.length > 0 ? (
        <Row className="px-md-5">
          {images.map((element, i) => (
            <Col md={2}>
              <div className="imgThumb">
                <input type="checkbox" onChange={() => selectImage(element)} />{" "}
                <span class="fancycheck">
                  <span></span>
                </span>
                <img
                  alt="img"
                  src={REACT_APP_IMAGE_URL + element.image_name}
                  style={{ objectFit: "cover" }}
                  className="w-100"
                />
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        ""
      )}
    </>
  );
}
