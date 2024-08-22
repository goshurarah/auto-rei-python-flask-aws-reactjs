import React, { useState, useEffect, useRef } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import "./emailSetting.css";
import Sidenav from "../../components/sidebar/Sidenav";
import Navbar from "../../components/navbar/Navbar";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import file from "../../assets/userProfile/file.png";
import download from "../../assets/userProfile/download.png";

function EmailSettings() {
  const editorRef = useRef();
  const documents = [
    { name: "AutoRei.pdf", fileUrl: "/AutoRei.pdf" }, // Path from public directory
    // { name: "document2.pdf", fileUrl: "/path/to/document2.pdf" },
    // { name: "document3.pdf", fileUrl: "/path/to/document3.pdf" },
    // // Add more documents as needed
  ];
  const [validationErrors, setValidationErrors] = useState({});

  const [placeholders, setPlaceholders] = useState([]);
  const [formData, setFormData] = useState({
    list_price_percent: "",
    offer_expiration_days: "",
    closing_days: "",
    escrow_deposit: "",
    inspection_period_days: "",
    earnest_money_deposit: "",
    terms_conditions: "",
    email_subject: "",
    email_body: "",
    template_name: "",
    save_filter: "",
    crm_web_hook: "",
  });
  const additionalItems = [
    "inspection_period_days",
    "earnest_money_deposit",
    "list_price_percent",
    "offer_expiration_days",
    "closing_days",
    "escrow_deposit",
    "terms_conditions",
  ];
  const handleSaveFilterChange = (e) => {
    setFormData({ ...formData, save_filter: e.target.value });
  };
  const [selectedFilter, setSelectedFilter] = useState("Saved Filters*");

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setSelectedFilter(filter.filterName);
    setFormData({ ...formData, save_filter: filter });
  };
  const [filters, setFilters] = useState([]);
  const [placeholder, setPlaceholder] = useState([]);

  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveClick, setSaveClick] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [id, setId] = useState(null);
  const [toastCheck, setToastCheck] = useState(true);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredTemplates = templates.filter((template) =>
    template.template_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {}, [filters]);
  useEffect(() => {
    if (selectedTemplate === null) {
      setFormData({
        list_price_percent: "",
        offer_expiration_days: "",
        closing_days: "",
        escrow_deposit: "",
        inspection_period_days: "",
        earnest_money_deposit: "",
        terms_conditions: "",
        email_subject: "",
        email_body: "",
        template_name: "",
        save_filter: "",
        crm_web_hook: "",
      });
    } else {
      setFormData({
        list_price_percent: selectedTemplate.list_price_percent,
        offer_expiration_days: selectedTemplate.offer_expiration_days,
        closing_days: selectedTemplate.closing_days,
        escrow_deposit: selectedTemplate.escrow_deposit,
        inspection_period_days: selectedTemplate.inspection_period_days,
        earnest_money_deposit: selectedTemplate.earnest_money_deposit,
        terms_conditions: selectedTemplate.terms_conditions,
        email_subject: selectedTemplate.email_subject,
        email_body: selectedTemplate.email_body,
        template_name: selectedTemplate.template_name,
        crm_web_hook: selectedTemplate.crm_web_hook,
      });
    }
  }, [selectedTemplate, saveClick]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({ ...formData, email_body: data });
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData({
      list_price_percent: template?.list_price_percent,
      offer_expiration_days: template?.offer_expiration_days,
      closing_days: template?.closing_days,
      escrow_deposit: template?.escrow_deposit,
      inspection_period_days: template?.inspection_period_days,
      earnest_money_deposit: template?.earnest_money_deposit,
      terms_conditions: template?.terms_conditions,
      email_subject: template?.email_subject,
      email_body: template?.email_body,
      template_name: template?.template_name,
      crm_web_hook: template?.crm_web_hook,
    });
    setSelectedFilter(template.save_filter.filterName || "Saved Filter");
  };

  const handleUpdateTemplate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `/api/auto-offer-send-setting/${selectedTemplate.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTemplates = templates.map((template) =>
        template.id === selectedTemplate.id
          ? { ...template, ...formData }
          : template
      );

      setTemplates(updatedTemplates);

      setFormData({
        list_price_percent: "",
        offer_expiration_days: "",
        closing_days: "",
        escrow_deposit: "",
        inspection_period_days: "",
        earnest_money_deposit: "",
        terms_conditions: "",
        email_subject: "",
        email_body: "",
        template_name: "",
        save_filter: "",
        crm_web_hook: "",
      });
      setSelectedTemplate(null);
      setSelectedFilter("Saved Filters");
      if (!toastCheck) {
        toast.success("Offer setting is updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update. Please try again.");
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTemplate = async () => {
    setFormData({
      list_price_percent: "",
      offer_expiration_days: "",
      closing_days: "",
      escrow_deposit: "",
      inspection_period_days: "",
      earnest_money_deposit: "",
      terms_conditions: "",
      email_subject: "",
      email_body: "",
      template_name: "",
      save_filter: "",
      crm_web_hook: "",
    });
    setSelectedTemplate(null);
    setSelectedFilter("Saved Filters");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const missingFields = [];
    const errors = {};

    if (!formData.list_price_percent) errors.list_price_percent = true;
    if (!formData.offer_expiration_days) errors.offer_expiration_days = true;
    if (!formData.closing_days) errors.closing_days = true;
    if (!formData.escrow_deposit) errors.escrow_deposit = true;
    if (!formData.inspection_period_days) errors.inspection_period_days = true;
    if (!formData.earnest_money_deposit) errors.earnest_money_deposit = true;

    // Uncomment if terms_conditions is required
    // if (!formData.terms_conditions) errors.terms_conditions = true;
    if (!formData.email_subject) errors.email_subject = true;
    if (!formData.template_name) errors.template_name = true;
    if (!formData.save_filter) errors.save_filter = true;
    if (!formData.email_body) errors.email_body = true;
    // if (missingFields.length > 0) {
    //   toast.error(
    //     ` ${missingFields.join(
    //       ", "
    //     )} is missing(Please fill in all required fields:)`
    //   );
    //   setLoading(false);
    //   return;
    // }
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/api/auto-offer-send-setting",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSaveClick(true);
      const newTemplate = {
        ...formData,
        id: response.data.id,
      };
      if (response.status === 201 || response.status === 200) {
        fetchTemplates();
      }

      setSelectedFilter("Saved Filters");
      setTemplates([...templates, newTemplate]);
      setFormData({
        list_price_percent: "",
        offer_expiration_days: "",
        closing_days: "",
        escrow_deposit: "",
        inspection_period_days: "",
        earnest_money_deposit: "",
        terms_conditions: "",
        email_subject: "",
        email_body: "",
        template_name: "",
        save_filter: "",
        crm_web_hook: "",
      });
      setSelectedTemplate(null);
      if (!toastCheck) {
        toast.success("Offer setting is saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save. Please try again.");
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTemplates = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/auto-offer-send-setting", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTemplates(response.data.offers);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, []);
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get("/api/saved-filters", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFilters(response.data);
      } catch (error) {
        console.error("Error fetching filters", error);
      }
    };

    fetchFilters();
  }, []);
  useEffect(() => {
    const fetchPlaceholders = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get("/api/property-field-names", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaceholders(response.data);
      } catch (error) {
        console.error("Error fetching filters", error);
      }
    };

    fetchPlaceholders();
  }, []);
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
  const handleInsertPlaceholder = (placeholder) => {
    const editor = editorRef.current.editor;
    editor.model.change((writer) => {
      const insertPosition = editor.model.document.selection.getFirstPosition();
      writer.insertText(`{{${placeholder}}}`, insertPosition);
    });
  };
  const allItems = [...placeholders, ...additionalItems].sort();

  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div>
        <div className="app-main-container">
          <div className="app-main-left-container app-main-left-container1">
            <Sidenav />
          </div>
          <div className="app-main-right-container">
            <Navbar />
            <div className="dashboard-main-container dashboard-main-container1">
              <div className="row">
                <div>
                  {" "}
                  <p className="noti-heading mt-3">Email SETTINGS</p>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="row mt-3">
                    <p className="auto_offer_send">Auto Offer Send Settings</p>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">% of list price*</p>
                      <input
                        className={`send-input-uprofile ${
                          validationErrors.list_price_percent
                            ? "error-border"
                            : ""
                        }`}
                        placeholder="6%"
                        name="list_price_percent"
                        value={formData.list_price_percent}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">
                        Offer expiration days*
                      </p>
                      <input
                        className={`send-input-uprofile ${
                          validationErrors.offer_expiration_days
                            ? "error-border"
                            : ""
                        }`}
                        placeholder="20"
                        name="offer_expiration_days"
                        value={formData.offer_expiration_days}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">Closing days*</p>
                      <input
                        className={`send-input-uprofile ${
                          validationErrors.closing_days ? "error-border" : ""
                        }`}
                        placeholder="10"
                        name="closing_days"
                        value={formData.closing_days}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">Escrow deposit ($)*</p>
                      <input
                        className={`send-input-uprofile ${
                          validationErrors.escrow_deposit ? "error-border" : ""
                        }`}
                        placeholder="$2000"
                        name="escrow_deposit"
                        value={formData.escrow_deposit}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">
                        Inspection period days*
                      </p>
                      <input
                        className={`send-input-uprofile ${
                          validationErrors.inspection_period_days
                            ? "error-border"
                            : ""
                        }`}
                        placeholder="5"
                        name="inspection_period_days"
                        value={formData.inspection_period_days}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">
                        Earnest Money Deposit*
                      </p>
                      <input
                        className={`send-input-uprofile ${
                          validationErrors.earnest_money_deposit
                            ? "error-border"
                            : ""
                        }`}
                        placeholder="15"
                        name="earnest_money_deposit"
                        value={formData.earnest_money_deposit}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <p className="input-head-uprofile">
                        Terms and Conditions
                      </p>
                      <textarea
                        className="send-textarea-uprofile"
                        rows={5}
                        name="terms_conditions"
                        value={formData.terms_conditions}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
                  <div className="dropdown mt-3">
                    <div
                      className={`dropdown-toggle filter-types-main-container-uprofile  ${
                        validationErrors.save_filter ? "error-border" : ""
                      }`}
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="selected_filter">{selectedFilter}</div>
                    </div>
                    <ul className="dropdown-menu">
                      {filters.length > 0 ? (
                        filters.map((filter) => (
                          <li key={filter.id}>
                            <a
                              className="dropdown-item filter_saved"
                              // href="#"
                              onClick={() => handleFilterClick(filter)}
                            >
                              {filter.filterName}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>
                          <p className="">No saved filter found</p>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="col-12 email-head-margin">
                    <p className="input-head-uprofile">Email Subject*</p>
                    <input
                      className={`send-input-uprofile ${
                        validationErrors.email_subject ? "error-border" : ""
                      }`}
                      placeholder=""
                      name="email_subject"
                      value={formData.email_subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="d-flex flex-row justify-content-between">
                        <p className="input-head-uprofile">Email Body*</p>
                        <p className="email-placeholder">
                          {
                            <div className="mb-3">
                              <DropdownButton
                                id="dropdown-basic-button"
                                title="Placeholders"
                              >
                                {allItems.map((item, index) => (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      handleInsertPlaceholder(item)
                                    }
                                  >
                                    {`{{${item}}}`}
                                  </Dropdown.Item>
                                ))}
                              </DropdownButton>
                            </div>

                            // <div className="mb-3">
                            //   <DropdownButton
                            //     id="dropdown-basic-button"
                            //     title="Placeholders"
                            //   >
                            //     {placeholders.map((placeholder, index) => (
                            //       <Dropdown.Item
                            //         key={index}
                            //         onClick={() =>
                            //           handleInsertPlaceholder(placeholder)
                            //         }
                            //       >
                            //         {`{{${placeholder}}}`}
                            //       </Dropdown.Item>
                            //     ))}
                            //   </DropdownButton>
                            // </div>
                          }
                        </p>
                      </div>
                      <CKEditor
                        editor={ClassicEditor}
                        data={formData.email_body}
                        onChange={handleEditorChange}
                        required
                        onReady={(editor) => {
                          editorRef.current = { editor };
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <p className="noti-heading mt-3">Offer document section</p>
                  {documents.map((doc, index) => (
                    <div
                      className="d-flex flex-row justify-content-between mt-4"
                      key={index}
                    >
                      <p className="doc-text">{doc.name}</p>
                      <div className="d-flex flex-row gap-2">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img className="doc-icon" src={file} alt="file" />
                        </a>
                        <a href={doc.fileUrl} download>
                          <img
                            className="doc-icon"
                            src={download}
                            alt="download"
                          />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
                  <p className="noti-heading mt-3">CRM web hook</p>
                  <div className="d-flex flex-row gap-2 mt-4">
                    <input
                      className="send-input-uprofile"
                      placeholder="search?sca_esv=4ce04de13f7e18f6&sca_upv=1&rlz=1C1"
                      name="crm_web_hook"
                      value={formData.crm_web_hook}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4"></div>
                <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-">
                  {selectedTemplate ? (
                    <div className="col-xl-12 col-lg-8 col-md-12 col-sm-12">
                      <p className="noti-heading mt-3">Template Name*</p>
                      <div className="d-flex flex-row gap-2 mt-1">
                        <input
                          className="send-input-uprofile"
                          placeholder="Chicago Template"
                          name="template_name"
                          value={formData.template_name}
                          onChange={handleInputChange}
                          required
                        />
                        <div
                          className="copy-btn"
                          onClick={handleUpdateTemplate}
                        >
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Update"
                          )}
                        </div>
                        <div
                          className="copy-btn"
                          onClick={handleCancelTemplate}
                        >
                          Cancel
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-xl-12 col-lg-8 col-md-12 col-sm-12">
                      <p className="noti-heading mt-3">Template Name*</p>
                      <div className="d-flex flex-row gap-2 mt-1">
                        <input
                          className={`send-input-uprofile ${
                            validationErrors.offer_expiration_days
                              ? "error-border"
                              : ""
                          }`}
                          placeholder="Chicago Template"
                          name="template_name"
                          value={formData.template_name}
                          onChange={handleInputChange}
                        />
                        <div className="copy-btn" onClick={handleSubmit}>
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Save"
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="app-main-container">
          <div className="app-main-left-container"></div>
          <div className="app-main-right-container">
            <div className="email-template-container">
              <h2>Email Templates</h2>
              {loading ? (
                <div className="center-spinner">
                  <Spinner animation="border" role="status">
                    <span className="sr-only"></span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <div className="email-input-container">
                    <input
                      type="text"
                      placeholder="🔍 Template name"
                      className="email-input search-icon"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    {/* <select className="email-input search-button">
                      <option value="category1" className="category_css">
                        Category
                      </option>
                      <option value="category2" className="category_css">
                        Category 1
                      </option>
                      <option value="category3" className="category_css">
                        Category 2
                      </option>
                    </select> */}
                  </div>
                  <div className="box-container">
                    {filteredTemplates.map((template) => (
                      <div className="box" key={template.id}>
                        <>
                          <div className="box_head">
                            <p className="template_name">
                              {template.template_name}
                            </p>
                            <button
                              className="edit_template"
                              onClick={() => handleEditTemplate(template)}
                            >
                              Edit
                            </button>
                          </div>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Email Subject:
                            </span>
                            {template.email_subject}
                          </p>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Closing days:
                            </span>
                            {template.closing_days}
                          </p>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Offer expiration days:
                            </span>
                            {template.offer_expiration_days}
                          </p>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Escrow deposit ($):
                            </span>
                            {template.escrow_deposit}
                          </p>
                        </>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default EmailSettings;
