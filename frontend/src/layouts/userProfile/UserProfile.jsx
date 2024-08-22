import React, { useEffect, useState } from "react";
import "./userProfile.css";
import Sidenav from "../../components/sidebar/Sidenav";
import Navbar from "../../components/navbar/Navbar";
// import userprofile from "../../assets/userProfile/user-profile.png";
import userprofile from "../../assets/userProfile/profile.png";
import file from "../../assets/userProfile/file.png";
import download from "../../assets/userProfile/download.png";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { Navigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [id, setId] = useState(null);
  const [toastCheck, setToastCheck] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data[0];
        console.log("object check", data);
        setIsChecked(data.on_sms_setting);
        setId(data.id);
        if (data.on_sms_setting === true) {
          setToastCheck(false);
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the notification setting!",
          error
        );
      });
  }, []);
  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    const token = localStorage.getItem("accessToken");

    // Make a PUT request to update the setting on the server
    axios
      .put(
        `/api/notifications/${id}`,
        {
          on_sms_setting: newCheckedState,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log("Notification setting updated successfully", response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error updating the notification setting!",
          error
        );
      });
  };

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      // Update the profileData image to show the preview immediately
      setProfileData((prevData) => ({
        ...prevData,
        image: previewUrl,
      }));
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("accessToken");

    axios
      .post("/api/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        if (!toastCheck) {
          toast.success("Image uploaded successfully!");
        }
        setFile(null);
        setImagePreview(null);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Error uploading image!");
        console.error("Error uploading image:", error);
      });
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get("/api/user_profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const updatedProfileData = {
          ...response.data,
          image: `${response.data.image}?timestamp=${new Date().getTime()}`,
        };
        setProfileData(updatedProfileData);
        setOriginalProfileData(updatedProfileData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user data!");
        setLoading(false);
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setProfileData(originalProfileData);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setFile(null);
    setImagePreview(null);
    setProfileData((prevData) => ({
      ...prevData,
      image: originalProfileData.image,
    }));
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.put("/api/user-profile", profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        if (!toastCheck) {
          toast.success("Profile updated successfully!");
        }
        setProfileData(response.data);
        setOriginalProfileData(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update user profile!");

      console.error("Failed to update user profile:", error);
    }
  };
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="app-main-container">
        <div className="app-main-left-container">
          <Sidenav />
        </div>
        <div className="app-main-right-container">
          <Navbar />
          <div className="dashboard-main-container">
            <p className="dashboard-text">User Profile</p>
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="d-flex flex-row justify-content-between align-items-end">
                  <div className="user-profile-container">
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <div className="image-container">
                        <img
                          className="userprofile"
                          src={profileData.image || userprofile}
                          // src={userprofile}
                          alt="userprofile"
                        />
                        <div className="edit-button">
                          {!file ? (
                            <label
                              htmlFor="file-upload"
                              onClick={() => {}}
                              className="upload-label"
                            >
                              Edit
                            </label>
                          ) : (
                            <div className="d-flex">
                              <button
                                onClick={handleUpload}
                                className="edit-button1"
                              >
                                Upload
                              </button>
                              <button
                                onClick={handleCancel}
                                className="edit-button2"
                              >
                                X
                              </button>
                            </div>
                          )}
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="d-flex flex-row gap-2">
                      <div
                        className="save-profile-btn"
                        onClick={handleSaveClick}
                      >
                        Save
                      </div>
                      <div
                        className="edit-profile-btn"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </div>
                    </div>
                  ) : (
                    <div className="edit-profile-btn" onClick={handleEditClick}>
                      Edit
                    </div>
                  )}
                </div>
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">First Name</p>
                    <input
                      className="send-input-uprofile"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Last Name</p>
                    <input
                      className="send-input-uprofile"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">
                      Email <span className="verified">Verified</span>
                    </p>
                    <input
                      className="send-input-uprofile"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">
                      Phone <span className="not-verified">Not-Verified</span>
                    </p>
                    <input
                      className="send-input-uprofile"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-3">
                <p className="noti-heading mt-5">Notifications Settings</p>
                <p className="noti-sub-heading mt-4"></p>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Emails about new leads</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Lead purchase email</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Promo emails</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">System notification</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Fixed price mode notifications</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <p className="noti-sub-heading sms-margin"></p>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">SMS about new leads in states</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Promo sms</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Lead purchase SMS</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">On Screen Settting</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <hr className="uprofile-hr" />

            {/* <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <p className="noti-heading mt-3">Auto Offer Send Settings</p>
                <div className="row mt-5">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">% of list price</p>
                    <input className="send-input-uprofile" placeholder="6%" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Offer expiration days</p>
                    <input className="send-input-uprofile" placeholder="20" />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Closing days</p>
                    <input className="send-input-uprofile" placeholder="10" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Escrow deposit ($)</p>
                    <input
                      className="send-input-uprofile"
                      placeholder="$2000"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">
                      Inspection period days
                    </p>
                    <input className="send-input-uprofile" placeholder="5" />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <p className="input-head-uprofile">Terms and Conditions</p>
                    <textarea className="send-textarea-uprofile" rows={5} />
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
                <div class="dropdown mt-3">
                  <div
                    class="dropdown-toggle filter-types-main-container-uprofile"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Saved Filters
                  </div>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-12 email-head-margin">
                  <p className="input-head-uprofile">Email Subject</p>
                  <input
                    className="send-input-uprofile"
                    placeholder=""
                    an
                    email
                    to
                    the
                    realtor
                  />
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <p className="input-head-uprofile">Email Body</p>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onReady={(editor) => {
                        // console.log("Editor is ready to use!", editor);
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        // console.log({ event, editor, data });
                      }}
                      onBlur={(event, editor) => {
                        // console.log("Blur.", editor);
                      }}
                      onFocus={(event, editor) => {
                        // console.log("Focus.", editor);
                      }}
                    />
                    <textarea
                      className="send-textarea-uprofile"
                      rows={13}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="uprofile-hr" />

            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <p className="noti-heading mt-3">Offer document section </p>
                <div className="d-flex flex-row justify-content-between mt-4">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
                <p className="noti-heading mt-3">GHL web hook</p>
                <div className="d-flex flex-row gap-2 mt-4">
                  <input
                    className="send-input-uprofile"
                    placeholder="search?sca_esv=4ce04de13f7e18f6&sca_upv=1&rlz=1C1"
                  />
                  <div className="copy-btn">Copy</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default UserProfile;
