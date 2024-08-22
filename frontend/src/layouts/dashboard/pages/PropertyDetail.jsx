import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./propertyDetail.css";
import Sidenav from "../../../components/sidebar/Sidenav";
import Navbar from "../../../components/navbar/Navbar";
import demo from "../../../assets/dashboard/demo.jpg";
import bucket from "../../../assets/dashboard/bucket.png";
import offer from "../../../assets/dashboard/offer.svg";
import SendSingleOfferModal from "../modals/SendSingleOfferModal";
import ImageModal from "../modals/ImageModal";

import { useParams } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";

export default function PropertyDetail() {
  const navigate = useNavigate();
  const [comps, setComps] = useState([]);
  const [foreclosureInfo, setForeclosureInfo] = useState([]);
  const [mlsHistory, setMlsHistory] = useState([]);
  const [sale, setSale] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [property, setProperty] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [propertyImage, setPropertyImage] = useState([]);
  const { id } = useParams();
  const [loader, setloader] = useState(true);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleImageShow = () => setShowImageModal(true);
  const handleImageClose = () => setShowImageModal(false);
  const [loading, setLoading] = useState(false);
  const [toastCheck, setToastCheck] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [idi, setIdi] = useState(null);
  const [savedProperties, setSavedProperties] = useState([]);

  const [savedOfferSent, setSavedOfferSent] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Comparable");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Comparable":
        return (
          <div className="comparable-section">
            <h2>Comparable</h2>
            <div className="comps-list">
              {comps.map((comp, index) => (
                // <div className="value-container mt-3">
                <div key={index} className="comp-item value-container mt-3">
                  {/* <p className="value-text">comps</p> */}
                  <div class="d-flex flex-row mt-3">
                    <p class="field-text">Address:</p>
                    <p class="field-value" title={comp.address || "N/A"}>
                      {comp.address || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Bedrooms:</p>
                    <p class="field-value">{comp.bedrooms || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Bathrooms:</p>
                    <p class="field-value"> {comp.bathrooms || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Cash Buyer:</p>
                    <p class="field-value">{comp.cashBuyer || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Company Name:</p>
                    <p class="field-value" title={comp.companyName || "N/A"}>
                      {comp.companyName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Equity Percent:</p>
                    <p class="field-value">{comp.equityPercent || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Estimated Value:</p>
                    <p class="field-value">{comp.estimatedValue || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">ID:</p>
                    <p class="field-value">{comp.id || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Last Sale Amount:</p>
                    <p class="field-value">{comp.lastSaleAmount || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">LandUse:</p>
                    <p class="field-value">{comp.landUse || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Last Sale Date:</p>
                    <p class="field-value">{comp.lastSaleDate || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Latitude:</p>
                    <p class="field-value">{comp.latitude || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">LenderName:</p>
                    <p class="field-value" title={comp.lenderName || "N/A"}>
                      {comp.lenderName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Longitude:</p>
                    <p class="field-value">{comp.longitude || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Mail Address:</p>
                    <p class="field-value" title={comp.mailAddress || "N/A"}>
                      {comp.mailAddress || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Lot Square Feet:</p>
                    <p class="field-value" title={comp.lotSquareFeet || "N/A"}>
                      {comp.lenderName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Mls Days On Market:</p>
                    <p class="field-value">{comp.mlsDaysOnMarket || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Mls Last Status Date:</p>
                    <p
                      class="field-value"
                      title={comp.mlsLastStatusDate || "N/A"}
                    >
                      {comp.lenderName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Mls Listing Date:</p>
                    <p class="field-value">{comp.mlsListingDate || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Open Mortgage Balance:</p>
                    <p
                      class="field-value"
                      title={comp.openMortgageBalance || "N/A"}
                    >
                      {comp.lenderName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Owner1 Last Name:</p>
                    <p class="field-value" title={comp.owner1LastName || "N/A"}>
                      {comp.owner1LastName || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Property Id:</p>
                    <p class="field-value">{comp.propertyId || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Property Type:</p>
                    <p class="field-value">{comp.propertyType || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Property Use:</p>
                    <p class="field-value" title={comp.propertyUse || "N/A"}>
                      {comp.propertyUse || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">propertyUseCode:</p>
                    <p class="field-value">{comp.propertyUseCode || "N/A"}</p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Square Feet:</p>
                    <p class="field-value">{comp.squareFeet || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Year Built:</p>
                    <p class="field-value">{comp.yearBuilt || "N/A"}</p>
                  </div>
                </div>
                // <div key={index} className="comp-item">
                //   <h3>{comp.address}</h3>
                //   <p>Bedrooms: {comp.bedrooms}</p>
                //   <p>Bathrooms: {comp.bathrooms}</p>
                //   <p>Estimated Value: ${comp.estimatedValue}</p>
                //   <p>Last Sale Amount: ${comp.lastSaleAmount}</p>
                //   <p>Year Built: {comp.yearBuilt}</p>
                //   <p>Last Sale Amount: ${comp.lastSaleAmount}</p>
                //   <p>Year Built: {comp.yearBuilt}</p>
                // </div>
              ))}
            </div>
          </div>
        );

      case "Sale & Loan":
        return (
          <div>
            <div className="comp-item  mt-3">
              {sale ? (
                <>
                  <div class="d-flex flex-row mt-3">
                    <p class="field-text">Buyer Names:</p>
                    <p class="field-value" title={sale.buyerNames || "N/A"}>
                      {sale.buyerNames || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Document Type:</p>
                    <p class="field-value">{sale.documentType || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Document Type Code:</p>
                    <p class="field-value">{sale.documentTypeCode || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Down Payment:</p>
                    <p class="field-value">{sale.downPayment || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">LTV:</p>
                    <p class="field-value">{sale.ltv || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Recording Date:</p>
                    <p class="field-value">{sale.recordingDate || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Sale Amount :</p>
                    <p class="field-value">{sale.saleAmount || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Sale Date:</p>
                    <p class="field-value">{sale.saleDate || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Seller Names:</p>
                    <p class="field-value" title={sale.sellerNames || "N/A"}>
                      {sale.sellerNames || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Seq No:</p>
                    <p class="field-value">{sale.seqNo || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Transaction Type:</p>
                    <p class="field-value">{sale.transactionType || "N/A"}</p>
                  </div>
                </>
              ) : (
                <p>No sale information found</p>
              )}
            </div>
          </div>
        );
      case "MLS":
        return (
          <div className="comparable-section">
            <h2>MLS</h2>
            <div className="comps-list">
              {mlsHistory.map((mls, index) => (
                <div key={index} className="comp-item value-container mt-3">
                  {/* <p className="value-text">comps</p> */}
                  <div class="d-flex flex-row mt-3">
                    <p class="field-text">Property Id:</p>
                    <p class="field-value" title={mls.propertyId || "N/A"}>
                      {mls.propertyId || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Type:</p>
                    <p class="field-value">{mls.type || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Price:</p>
                    <p class="field-value"> {mls.price || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Beds:</p>
                    <p class="field-value">{mls.beds || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Baths:</p>
                    <p class="field-value" title={mls.baths || "N/A"}>
                      {mls.baths || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Days On Market:</p>
                    <p class="field-value">{mls.daysOnMarket || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Agent Name:</p>
                    <p class="field-value" title={mls.agentName || "N/A"}>
                      {mls.agentName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Agent Office:</p>
                    <p class="field-value" title={mls.agentOffice || "N/A"}>
                      {mls.agentOffice || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Agent Phone:</p>
                    <p class="field-value" title={mls.agentPhone || "N/A"}>
                      {mls.agentPhone || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Status:</p>
                    <p class="field-value" title={mls.status || "N/A"}>
                      {mls.status || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Status Date:</p>
                    <p class="field-value">{mls.statusDate || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Seq No:</p>
                    <p class="field-value">{mls.seqNo || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Demographics":
        return (
          <div>
            <div className="comp-item  mt-3">
              {demographics ? (
                <>
                  <div class="d-flex flex-row mt-3">
                    <p class="field-text">FMR Efficiency:</p>
                    <p class="field-value">
                      {demographics.fmrEfficiency || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">FMR Four Bedroom:</p>
                    <p class="field-value">
                      {demographics.fmrFourBedroom || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">FMR One Bedroom:</p>
                    <p class="field-value">
                      {demographics.fmrOneBedroom || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">FMR Three Bedroom:</p>
                    <p class="field-value">
                      {demographics.fmrThreeBedroom || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">FMR Two Bedroom:</p>
                    <p class="field-value">
                      {demographics.fmrTwoBedroom || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">FMR Year:</p>
                    <p class="field-value">{demographics.fmrYear || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Hud Area Code:</p>
                    <p
                      class="field-value"
                      title={demographics.hudAreaCode || "N/A"}
                    >
                      {demographics.hudAreaCode || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Hud Area Name:</p>
                    <p
                      class="field-value"
                      title={demographics.hudAreaName || "N/A"}
                    >
                      {demographics.hudAreaName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Median Income:</p>
                    <p class="field-value">
                      {demographics.medianIncome || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Suggested Rent:</p>
                    <p class="field-value">
                      {demographics.suggestedRent || "N/A"}
                    </p>
                  </div>
                </>
              ) : (
                <p>No demographics information found</p>
              )}
            </div>
          </div>
        );
      case "Foreclosure & Lien":
        return (
          <div className="comparable-section">
            <h2>Foreclosure & Lien</h2>
            <div className="comps-list">
              {foreclosureInfo.map((fore, index) => (
                // <div className="value-container mt-3">
                <div key={index} className="comp-item value-container mt-3">
                  {/* <p className="value-text">comps</p> */}
                  <div class="d-flex flex-row mt-3">
                    <p class="field-text">Foreclosure Id:</p>
                    <p class="field-value" title={fore.foreclosureId || "N/A"}>
                      {fore.foreclosureId || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Original Loan Amount:</p>
                    <p class="field-value">
                      {fore.originalLoanAmount || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Estimated Bank Value:</p>
                    <p class="field-value">
                      {" "}
                      {fore.estimatedBankValue || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Recording Date:</p>
                    <p class="field-value">{fore.recordingDate || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Default Amount:</p>
                    <p class="field-value" title={fore.defaultAmount || "N/A"}>
                      {fore.companyName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Opening Bid:</p>
                    <p class="field-value">{fore.openingBid || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Auction Date:</p>
                    <p class="field-value">{fore.auctionDate || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Auction Time:</p>
                    <p class="field-value">{fore.auctionTime || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Auction Street Address:</p>
                    <p
                      class="field-value"
                      title={fore.auctionStreetAddress || "N/A"}
                    >
                      {fore.auctionStreetAddress || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Document Type:</p>
                    <p class="field-value" title={fore.documentType || "N/A"}>
                      {fore.documentType || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Trustee Sale Number:</p>
                    <p class="field-value">{fore.trusteeSaleNumber || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Type Name:</p>
                    <p class="field-value">{fore.typeName || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Active:</p>
                    <p class="field-value">{fore.active || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "Owner Profile":
        return (
          <div>
            <div className="comp-item  mt-3">
              {ownerInfo ? (
                <>
                  <div class="d-flex flex-row mt-3">
                    <p class="field-text">equity:</p>
                    <p class="field-value">{ownerInfo.equity || "N/A"}</p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Owner1 First Name:</p>
                    <p class="field-value">
                      {ownerInfo.owner1FirstName || "N/A"}
                    </p>
                  </div>

                  <div class="d-flex flex-row">
                    <p class="field-text">Owner1 FullName:</p>
                    <p class="field-value">
                      {ownerInfo.owner1FullName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Owner1 LastName:</p>
                    <p class="field-value">
                      {ownerInfo.owner1LastName || "N/A"}
                    </p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">Owner1 Type:</p>
                    <p class="field-value">{ownerInfo.owner1Type || "N/A"}</p>
                  </div>
                  <div class="d-flex flex-row">
                    <p class="field-text">ownershipLength:</p>
                    <p class="field-value">
                      {ownerInfo.ownershipLength || "N/A"}
                    </p>
                  </div>

                  {ownerInfo.mailAddress ? (
                    <>
                      <div className="d-flex flex-row mt-3">
                        <p className="field-text">Mail Address:</p>
                        <p
                          className="field-value"
                          title={ownerInfo.mailAddress.address || "N/A"}
                        >
                          {ownerInfo.mailAddress.address || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">Address Format:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.addressFormat || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">Carrier Route:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.carrierRoute || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">City:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.city || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">County:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.county || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">FIPS Code:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.fips || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">House Number:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.house || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">Label:</p>
                        <p
                          className="field-value"
                          title={ownerInfo.mailAddress.label || "N/A"}
                        >
                          {ownerInfo.mailAddress.label || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">State:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.state || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">Street:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.street || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">Street Type:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.streetType || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">ZIP Code:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.zip || "N/A"}
                        </p>
                      </div>

                      <div className="d-flex flex-row">
                        <p className="field-text">ZIP+4 Code:</p>
                        <p className="field-value">
                          {ownerInfo.mailAddress.zip4 || "N/A"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p>No mail address found</p>
                  )}
                </>
              ) : (
                <p>No owner information found</p>
              )}
            </div>
          </div>
        );
      default:
        return <div>Select an item to view data</div>;
    }
  };
  const isSavedOffer = savedOfferSent.some(
    (svPropertyOffer) => svPropertyOffer.property_id === property?.id
  );

  const isSaved = savedProperties.some(
    (svProperty) => svProperty.property_id === id
  );
  useEffect(() => {
    const fetchSavedOffers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/send-offer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedOfferSent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };
    const fetchSavedProperties = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/saved-lists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };

    fetchSavedOffers();
    fetchSavedProperties();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`);

      setloader(false);
      let priImage = response.data.primary_photo;
      let images = response.data.alt_photos;
      const slicedImages = images.slice(0, 3);

      setProperty(response.data);
      setPrimaryImage(priImage);
      setPropertyImage(slicedImages);
      setSale(response.data.lastSale);
      setOwnerInfo(response.data.ownerInfo);
      setDemographics(response.data.demographics);
      const compsData = response.data.comps.map((comp) => ({
        absenteeOwner: comp.absenteeOwner,
        address:
          `${comp.address.street}, ${comp.address.city}, ${comp.address.state} ${comp.address.zip}` ||
          "N/A",
        bedrooms: comp.bedrooms,
        bathrooms: comp.bathrooms,
        cashBuyer: comp.cashBuyer,
        companyName: comp.companyName,
        corporateOwned: comp.corporateOwned,
        equityPercent: comp.equityPercent,
        estimatedValue: comp.estimatedValue,
        id: comp.id,
        inStateAbsenteeOwner: comp.inStateAbsenteeOwner,
        lastSaleAmount: comp.lastSaleAmount,
        lastSaleDate: comp.lastSaleDate,

        latitude: comp.latitude,
        lenderName: comp.lenderName,
        longitude: comp.longitude,
        lotSquareFeet: comp.lotSquareFeet,
        mailAddress:
          `${comp.mailAddress.street}, ${comp.mailAddress.city}, ${comp.mailAddress.state} ${comp.mailAddress.zip}` ||
          "N/A",
        mlsDaysOnMarket: comp.mlsDaysOnMarket,
        mlsLastStatusDate: comp.mlsLastStatusDate,
        mlsListingDate: comp.mlsListingDate,
        openMortgageBalance: comp.openMortgageBalance,
        outOfStateAbsenteeOwner: comp.outOfStateAbsenteeOwner,
        owner1LastName: comp.owner1LastName,
        preForeclosure: comp.preForeclosure,
        privateLender: comp.privateLender,
        propertyId: comp.propertyId,
        propertyType: comp.propertyType,
        propertyUse: comp.propertyUse,
        propertyUseCode: comp.propertyUseCode,
        squareFeet: comp.squareFeet,
        vacant: comp.vacant,
        yearBuilt: comp.yearBuilt,
      }));

      setComps(compsData);
      const foreclosureData = response.data.foreclosureInfo.map((fore) => ({
        foreclosureId: fore.foreclosureId,
        originalLoanAmount: fore.originalLoanAmount,
        estimatedBankValue: fore.estimatedBankValue,
        defaultAmount: fore.defaultAmount,
        recordingDate: fore.recordingDate,
        openingBid: fore.openingBid,
        auctionDate: fore.auctionDate,
        auctionTime: fore.auctionTime,
        auctionStreetAddress: fore.auctionStreetAddress,
        documentType: fore.documentType,
        trusteeSaleNumber: fore.trusteeSaleNumber,
        typeName: fore.typeName,
        active: fore.active,
      }));

      setForeclosureInfo(foreclosureData);
      const mlsHistory = response.data.mlsHistory.map((mls) => ({
        propertyId: mls.propertyId,
        type: mls.type,
        price: mls.price,
        beds: mls.beds,
        baths: mls.baths,
        daysOnMarket: mls.daysOnMarket,
        agentName: mls.agentName,
        agentOffice: mls.agentOffice,
        agentPhone: mls.agentPhone,
        status: mls.status,
        statusDate: mls.statusDate,
        seqNo: mls.seqNo,
      }));

      setMlsHistory(mlsHistory);
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };
  useEffect(() => {
    // console.log("123", property);
    fetchData();
  }, [id]);
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
        // console.log("object check", data);
        setIsChecked(data.on_sms_setting);
        setIdi(data.id);
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
  const handleSaveBucket = async (propertyDetail) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "/api/saved-lists",
        {
          property_id: propertyDetail.id,
          property_address: propertyDetail.location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!toastCheck) {
        toast.success("Property added to saved");
      }
      setSavedProperties((prevProperties) => [
        ...prevProperties,
        response.data,
      ]);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  // const ownerFullName = property.owner1FirstName && property.owner1LastName
  //   ? `${property.owner1FirstName} ${property.owner1LastName}`
  //   : "N/A";
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
          <SendSingleOfferModal
            show={showModal}
            handleClose={handleClose}
            property={property}
          />
          <ImageModal
            show={showImageModal}
            handleClose={handleImageClose}
            property={property}
          />
          <div className="dashboard-main-container">
            <div className="d-flex justify-content-center m-1">
              {loader && <CircularProgress color="secondary" />}
            </div>
            {property && (
              <div className="row">
                <div className="col-12">
                  <button
                    className="back-arrow-btn"
                    onClick={() => navigate("/dashboard")}
                  >
                    ← Back
                  </button>
                </div>
                <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                  <p className="prop-detail-text mb-4">PROPERTY DETAILS</p>
                  <div>
                    {propertyImage.length === 0 ? (
                      <div
                        className="prop-main-img red-border"
                        onClick={handleImageShow}
                      >
                        No Image
                      </div>
                    ) : (
                      <img
                        className="prop-main-img"
                        src={propertyImage[0] ? propertyImage[0] : primaryImage}
                        alt="demo"
                        onClick={handleImageShow}
                      />
                    )}
                  </div>
                  <div className="d-flex flex-row gap-3 mt-3 mb-3">
                    {propertyImage.map((photo, index) => (
                      <img
                        key={index}
                        className="prop-small-img"
                        src={photo}
                        alt="demo"
                        onClick={handleImageShow}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                  <div className="row gap-3 mb-3">
                    {isSaved ? (
                      <div className="bucket-container">
                        <p className="bucket-text saved-bucket-text">
                          Already saved in Bucket
                        </p>
                        <img className="" src={bucket} alt="bucket" />
                      </div>
                    ) : (
                      <div
                        className="bucket-container"
                        onClick={() => handleSaveBucket(property)}
                      >
                        <p className="bucket-text">Save to the Bucket</p>
                        <img className="" src={bucket} alt="bucket" />
                      </div>
                    )}
                    {/* <div
                      className="offer-container"
                      onClick={!isSavedOffer ? handleShow : undefined}
                    >
                      {isSavedOffer ? (
                        <span className="already_sent">Offer Already Sent</span>
                      ) : (
                        <>
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <p className="offer-text">Send Single Offer</p>
                          )}
                        </>
                      )}
                      <img className="" src={offer} alt="offer" />
                    </div> */}
                  </div>
                  <p className="property-address-text">
                    {property.location || "N/A"}
                  </p>
                  <div className="row">
                    <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                      <div class="d-flex flex-row mt-3">
                        <p class="field-text">Year Built</p>
                        <p class="field-value">
                          {property.year_built || "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Living Area SqFt</p>
                        <p class="field-value">{property.sqft || "N/A"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Bedrooms</p>
                        <p class="field-value">{property.beds || "N/A"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Bathrooms</p>
                        <p class="field-value">
                          {property.full_baths || "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">No. of Units</p>
                        <p class="field-value">{property.unit || "N/A"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Last Sale Date</p>
                        <p class="field-value">
                          {property.last_sold_date || "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Property Vacant</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Mail Vacant</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Owner Name</p>

                        <p
                          class="field-value ownernameproperty"
                          title={property.owner1FirstName}
                        >
                          {property.owner1FirstName && property.owner1LastName
                            ? `${property.owner1FirstName} ${property.owner1LastName}`
                            : "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">APN</p>
                        <p class="field-value" title={property.lotInfo?.apn}>
                          {" "}
                          {property.lotInfo?.apn || "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Owner Type</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Ownership Length</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Owner Occupied</p>
                        <p class="field-value">
                          {property.ownerOccupied !== undefined
                            ? property.ownerOccupied.toString()
                            : "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Skiped Traced</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Opt-Out</p>
                        <p class="field-value">N/A</p>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                      <div className="value-container mt-3">
                        <p className="value-text">Value</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Estimated Value</p>
                          <p class="field-value">
                            {property.estimated_value || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Confidence Score</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Est. Equity</p>
                          <p class="field-value">
                            {" "}
                            {property.estimatedEquity || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Estimated Rent</p>
                          <p class="field-value">N/A</p>
                        </div>
                      </div>
                      <div className="value-container mt-3">
                        <p className="value-text">MLS</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">MLS Status</p>
                          <p class="field-value">{property.status || "N/A"}</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">MLS Number</p>
                          <p class="field-value">{property.mls_id || "N/A"}</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Listing Date</p>
                          <p class="field-value">
                            {property.list_date
                              ? new Date(property.list_date)
                                  .toISOString()
                                  .split("T")[0]
                              : "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Listing Amount</p>
                          <p class="field-value">
                            ${property.mlsHistory?.price || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">After Repair Value</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Agent Name</p>
                          <p class="field-value">
                            {property.mlsHistory?.agentName || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Office</p>
                          <p class="field-value">
                            {property.mlsHistory?.agentOffice || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                      <div className="value-container mt-3">
                        <p className="value-text">Mortgage / Debt Summary</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Open Mortgages</p>
                          <p class="field-value">
                            {" "}
                            {property.openMortgageBalance || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Total Mortgage Balance</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Recording Date</p>
                          <p class="field-value">
                            {property.mortgageHistory?.recordingDate || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Sale Amount</p>
                          <p class="field-value">
                            ${property.mortgageHistory?.amount || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="value-container mt-3">
                        <p className="value-text">Distress Indicators</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Active Auction</p>
                          <p class="field-value">
                            {" "}
                            {property.auction || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Expired Listing</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Inherited</p>
                          <p class="field-value">
                            {" "}
                            {property.inherited || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Active Pre-Foreclosure</p>
                          <p class="field-value">
                            {property.foreclosure || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Tax Default</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Tired Landlord</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Unknown Equity</p>
                          <p class="field-value">N/A</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="prop-detail-main-container mt-5">
              <div className="d-flex flex-wrap justify-content-start gap-2">
                <div
                  className={`prop-text-container ${
                    selectedItem === "Comparable" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Comparable")}
                >
                  Comparable
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Sale & Loan" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Sale & Loan")}
                >
                  Last Sale
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "MLS" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("MLS")}
                >
                  MLS
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Demographics" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Demographics")}
                >
                  Demographics
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Foreclosure & Lien" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Foreclosure & Lien")}
                >
                  Foreclosure & Lien
                </div>
                <div
                  className={`prop-text-container ${
                    selectedItem === "Owner Profile" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("Owner Profile")}
                >
                  Owner Profile
                </div>
              </div>
            </div>
            <div className="data-display mt-3">{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
