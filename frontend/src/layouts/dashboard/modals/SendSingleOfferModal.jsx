import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";

function SendSingleOfferModal({ show, handleClose, property }) {
  const [formData, setFormData] = useState({
    expirationDate: "",
    closingDate: "",
    offerAmount: "",
    listPricePercentage: "",
    escrowDeposit: "",
    inspectionPeriod: "",
    otherItems: "",
    terms: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validateForm = () => {
    const requiredFields = [
      "expirationDate",
      "closingDate",
      "escrowDeposit",
      "inspectionPeriod",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required(*) fields.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const webhookData = {
        sendOfferFormData: formData,
        property,
      };
      await axios.post("/api/send-single-offer", webhookData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Email and offer sent successfully");
      handleClose();
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      toast.error("Failed to send offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="md"
        dialogClassName="right-side-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="send-heading">Send single offer</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="send-address-text">
            {property && `${property.location}`}
          </p>
          <div className="row mt-5">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <p className="input-head">Offer Expiration Date*</p>
              <input
                className="send-input"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <p className="input-head">Closing Date*</p>
              <input
                className="send-input"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <p className="input-head">Offer Amounts $ (Optional)</p>
              <input
                className="send-input"
                name="offerAmount"
                value={formData.offerAmount}
                onChange={handleChange}
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <p className="input-head">% Of List Price (Optional)</p>
              <input
                className="send-input"
                name="listPricePercentage"
                value={formData.listPricePercentage}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <p className="input-head">Escrow Deposit*</p>
              <input
                className="send-input"
                name="escrowDeposit"
                value={formData.escrowDeposit}
                onChange={handleChange}
              />
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <p className="input-head">Inspection Period*</p>
              <input
                className="send-input"
                name="inspectionPeriod"
                value={formData.inspectionPeriod}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <p className="input-head">
                Other Person Property Item Included (Optional)
              </p>
              <input
                className="send-input"
                name="otherItems"
                value={formData.otherItems}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <p className="input-head">Terms (Optional)</p>
              <textarea
                className="send-textarea"
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </div>
          <div className="send-offer-btn" onClick={handleSubmit}>
            {loading ? <Spinner animation="border" size="sm" /> : "Send Offer"}
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default SendSingleOfferModal;
