import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Container,
  Table,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { tagService } from "../services/index";

const REACT_APP_API_BASEURL = process.env.REACT_APP_API_BASEURL;

export default function TagManager() {
  const [showTagModal, setShowTagModal] = useState(false);
  const [showDeleteTag, setShowDeleteTag] = useState(false);
  const [search, setSearch] = useState("");
  const [updateTag, setUpdateTag] = useState({
    tag_name: "",
    id: "",
    count: "",
  });

  const [removeTag, setRemoveTag] = useState({
    tag_name: "",
    id: "",
    count: "",
  });

  const [tags, setTag] = useState([]);
  const history = useHistory();

  const editTagClose = () => setShowTagModal(false);
  const editTag = (name, id, count) => {
    setShowTagModal(true);
    setUpdateTag({ tag_name: name, id: id, count: count });
  };

  const deleteTagClose = () => setShowDeleteTag(false);
  const deleteTag = (name, id, count) => {
    setShowDeleteTag(true);
    setRemoveTag({ tag_name: name, id: id, count: count });
  };

  useEffect(() => {
    get_tag();
  }, []);

  const get_tag = () => {
    let param = {};
    if (search != "") {
      param = {
        search: search,
      };
    }
    tagService
      .get_tags(param)
      .then((res) => {
        if (res.status === true) {
          setTag(res.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const changeTag = () => {
    tagService
      .update_tag(updateTag)
      .then((res) => {
        get_tag();
        setShowTagModal(false);
      })
      .catch((error) => [console.log(error)]);
  };

  const deleteTagRemove = () => {
    let param = {
      id: removeTag.id,
    };
    tagService
      .delete_tag(param)
      .then((res) => {
        setShowDeleteTag(false);
        get_tag();
      })
      .catch((error) => [console.log(error)]);
  };

  useEffect(() => {
    get_tag();
  }, [search]);

  return (
    <section className="h-100">
      <Container fluid>
        <Row className="border-bottom py-3 px-md-5">
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
        <Row className="mt-3 px-md-5">
          <Col md={12} className="px-md-5 mt-md-4">
            <div className="d-flex justify-content-between flex-wrap align-items-center">
              <h5 className="mb-0 pageHeading">
                Manage Tags ({tags && tags.length})
              </h5>

              <div className="searchBar">
                <img
                  src="/assets/images/searchicon.svg"
                  className="searchicon"
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Tags"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </Col>
          <Col className="px-md-5 mt-md-4" md={12}>
            <div className="borderFrame">
              <Table responsive="sm" className="" borderless={true}>
                <thead>
                  <tr>
                    <th>Tags Name</th>
                    <th>Photos used in</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tags &&
                    tags.map((curElement, i) => (
                      <tr key={i}>
                        <td>{curElement.tag_name}</td>
                        <td>{curElement.photos}</td>
                        <td>
                          {new Date(curElement.created_at).toLocaleDateString()}
                        </td>
                        <td className="text-end">
                          <span
                            className="tableaction editBtn all-cursor"
                            onClick={() =>
                              editTag(
                                curElement.tag_name,
                                curElement._id,
                                curElement.photos
                              )
                            }
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.9999 0.669922C10.4017 0.669922 9.80349 0.896713 9.35016 1.35026L8.07672 2.6237C8.03118 2.65591 7.99135 2.69552 7.95888 2.74089L1.9719 8.72787C1.83191 8.86786 1.72938 9.04195 1.67503 9.23307L0.686094 12.696C0.661705 12.7817 0.660652 12.8723 0.683043 12.9585C0.705434 13.0448 0.750457 13.1234 0.813454 13.1864C0.87645 13.2494 0.955134 13.2945 1.04137 13.3169C1.1276 13.3392 1.21824 13.3382 1.30393 13.3138L4.76747 12.3249C4.76769 12.3247 4.76791 12.3244 4.76813 12.3242C4.95797 12.2696 5.13163 12.1684 5.27203 12.028L11.2466 6.05273C11.3025 6.01575 11.3503 5.96793 11.3873 5.91211L12.6496 4.64974C13.5567 3.7427 13.5567 2.2573 12.6496 1.35026C12.1963 0.896713 11.5981 0.669922 10.9999 0.669922ZM10.9999 1.66406C11.3402 1.66406 11.68 1.79517 11.942 2.05729C11.9422 2.05729 11.9424 2.05729 11.9426 2.05729C12.4676 2.58225 12.4676 3.41775 11.9426 3.94271L10.9628 4.92253L9.07737 3.03711L10.0572 2.05729C10.3192 1.79517 10.6596 1.66406 10.9999 1.66406ZM8.37034 3.74414L10.2558 5.62956L4.56435 11.321C4.54481 11.3404 4.52005 11.3552 4.49208 11.3633L4.16396 11.457L2.54287 9.83594L2.63662 9.50716C2.63662 9.50694 2.63662 9.50673 2.63662 9.50651C2.64426 9.47963 2.65826 9.45557 2.67893 9.4349L8.37034 3.74414ZM2.22841 10.9355L3.06435 11.7715L1.89443 12.1055L2.22841 10.9355Z"
                                fill="#162950"
                              />
                            </svg>
                          </span>
                          <span
                            className="tableaction deleteBtn all-cursor"
                            onClick={() =>
                              deleteTag(
                                curElement.tag_name,
                                curElement._id,
                                curElement.photos
                              )
                            }
                          >
                            <svg
                              width="12"
                              height="14"
                              viewBox="0 0 12 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M9.33317 2.33334L9.26649 2.26667H9.39987V12.3333C9.39987 12.3673 9.39431 12.3855 9.39186 12.3919L9.39184 12.392L9.39177 12.392C9.38538 12.3944 9.36716 12.4 9.3332 12.4H2.66654C2.63258 12.4 2.61436 12.3944 2.60797 12.392L2.6079 12.392L2.60788 12.3919C2.60543 12.3855 2.59987 12.3673 2.59987 12.3333V2.26667H2.73318L2.6665 2.33334H9.33317ZM1.39987 2.26667V12.3333C1.39987 12.6692 1.51373 12.9965 1.75855 13.2413C2.00337 13.4861 2.33065 13.6 2.66654 13.6H9.3332C9.66908 13.6 9.99637 13.4861 10.2412 13.2413C10.486 12.9965 10.5999 12.6692 10.5999 12.3333V2.26667H11.3332V1.06667H8.06649L7.33317 0.333344H4.6665L3.93318 1.06667H0.666504V2.26667H1.39987ZM7.93314 11V3.66667H6.73314V11H7.93314ZM5.2665 3.66667V11H4.0665V3.66667H5.2665Z"
                                fill="#162950"
                              />
                            </svg>
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal
        show={showTagModal}
        centered={true}
        className="editPopup"
        onHide={editTagClose}
      >
        <Modal.Header className="border-0 px-4" closeButton>
          <Modal.Title>
            Edit Tag <b>'{updateTag && updateTag.tag_name}'</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form>
            <Form.Group className="" controlId="exampleForm.ControlInput1">
              <Form.Control
                className="editTag_input"
                type="text"
                placeholder="Tag"
                onChange={(e) =>
                  setUpdateTag({
                    tag_name: e.target.value,
                    id: updateTag.id,
                    count: updateTag.count,
                  })
                }
                value={updateTag.tag_name}
              />
            </Form.Group>
            <p className="d-block mb-4 mt-3">
              This edit will affect <b>{updateTag.count} photos</b>
            </p>
            <Row className="mt-5">
              <Col>
                <Button
                  className="theme-btn btn w-100"
                  onClick={() => changeTag()}
                >
                  Save & Apply
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => editTagClose()}
                  className="transp-btn btn w-100"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDeleteTag}
        centered={true}
        className="deletePopup"
        onHide={deleteTagClose}
      >
        <Modal.Header className="border-0 px-4" closeButton>
          <Modal.Title>
            Delete Tag <b>'{removeTag.tag_name}'</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form>
            <p className="d-block mb-4">
              Are you sure you want to delete the tag -{" "}
              <b>{removeTag.tag_name}?</b>
              It will be removed from <b>{removeTag.count} Photos</b>
            </p>
            <Row className="mt-5">
              <Col>
                <Button
                  className="theme-btn btn w-100"
                  onClick={() => deleteTagRemove()}
                >
                  Confirm Delete
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => deleteTagClose()}
                  className="transp-btn btn w-100"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
}
