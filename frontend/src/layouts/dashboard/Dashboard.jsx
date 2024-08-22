import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Modal, Spinner, Form } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import Sidenav from "../../components/sidebar/Sidenav";
import Navbar from "../../components/navbar/Navbar";
import offeer from "../../assets/dashboard/offer.png";
import sent_offer from "../../assets/dashboard/sent-offer.png";
import order from "../../assets/dashboard/order.png";
import heart from "../../assets/dashboard/heart2.png";
import email from "../../assets/dashboard/email.png";
import empty_mail from "../../assets/dashboard/empty_mail.png";
import fillheart from "../../assets/dashboard/fill-heart2.png";
import search from "../../assets/dashboard/search.png";
import filter from "../../assets/dashboard/filter.png";
import saveheart from "../../assets/dashboard/save-heart.png";
import leftarrow from "../../assets/dashboard/left-arrow.png";
import rightarrow from "../../assets/dashboard/right-arrow.png";
import { Link, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap";

import Slider from "react-slick";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Dashboard() {
  const navigate = useNavigate();
  const togglePropertyDropdown = () =>
    setPropertyDropdownOpen(!propertyDropdownOpen);

  const handlePropertySelect = (propertyType) => {
    setSelectedPropertyType(propertyType);
  };
  const [interestRate, setInterestRate] = useState("");
  const [heading, setHeading] = useState("DASHBOARD");
  const [backArrow, setBackArrow] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [offer, setOffer] = useState(null);
  const [selectedLeadTypes, setSelectedLeadTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  // const [selectedPropertytype, setSelectedPropertyType] =
  //   useState("Property Types");
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setloader] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const [modalData, setModalData] = useState();
  const [showPriceRange, setShowPriceRange] = useState(true);
  const [address, setAddress] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPriceList, setMinPriceList] = useState("");
  const [maxPriceList, setMaxPriceList] = useState("");
  const [showDataMessage, setShowDataMessage] = useState(false);
  const [minBed, setMinBed] = useState("");
  const [maxBed, setMaxBed] = useState("");
  const [minBath, setMinBath] = useState("");
  const [maxBath, setMaxBath] = useState("");
  const [showBeds, setShowBeds] = useState(true);
  const [showBaths, setShowBaths] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState("");
  const [selectedBaths, setSelectedBaths] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedOfferSent, setSavedOfferSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInputField, setShowInputField] = useState(false);
  const [activeButton, setActiveButton] = useState("beds");
  const [activeButtonP, setActiveButtonP] = useState("priceRange");
  const [favorites, setFavorites] = useState(false);
  const [offerSentD, setOfferSentD] = useState(false);
  //more filters states
  const [minStories, setMinStories] = useState("");
  const [maxStories, setMaxStories] = useState("");
  const [minBuildingSize, setMinBuildingSize] = useState("");
  const [maxBuildingSize, setMaxBuildingSize] = useState("");
  const [minLotSize, setMinLotSize] = useState("");
  const [maxLotSize, setMaxLotSize] = useState("");
  const [minYearBuilt, setMinYearBuilt] = useState("");
  const [maxYearBuilt, setMaxYearBuilt] = useState("");
  const [occupancyStatus, setOccupancyStatus] = useState([]);
  const [hasPhotos, setHasPhotos] = useState([]);
  const [mlsKeyword, setMlsKeyword] = useState([]);
  const [financialPrivateLend, setFinancialPrivateLend] = useState("");
  const [ownerOccupied, setOwnerOccupied] = useState([]);
  const [absenteeLocation, setAbsenteeLocationd] = useState([]);
  const [ownerType, setOwnerType] = useState([]);
  const [cashBuyer, setCashBuyer] = useState([]);

  //more filters states end
  //owner filter states
  const [minYearOwner, setMinYearOwner] = useState("");
  const [maxYearOwner, setMaxYearOwner] = useState("");
  const [minTaxDelinquent, setMinTaxDelinquent] = useState("");
  const [maxTaxDelinquent, setMaxTaxDelinquent] = useState("");

  const [minPropertyOwned, setMinPropertyOwned] = useState("");
  const [maxPropertyOwned, setMaxPropertyOwned] = useState("");
  const [minPortfolioValue, setMinPortfolioValue] = useState("");
  const [maxPortfolioValue, setMaxPortfolioValue] = useState("");
  //owner filter states end
  //financial filter states end
  const [minEstimatedValue, setMinEstimatedValue] = useState("");
  const [maxEstimatedValue, setMaxEstimatedValue] = useState("");
  const [minEstimatedEquity, setMinEstimatedEquity] = useState("");
  const [maxEstimatedEquity, setMaxEstimatedEquity] = useState("");

  const [minAssessedTotValue, setMinAssessedTotValue] = useState("");
  const [maxAssessedTotValue, setMaxAssessedTotValue] = useState("");
  const [minAssessedLandValue, setMinAssessedLandValue] = useState("");
  const [maxAssessedLandValue, setMaxAssessedLandValue] = useState("");
  const [minAssessedImpValue, setMinAssessedImpValue] = useState("");
  const [maxAssessedImpValue, setMaxAssessedImpValue] = useState("");
  const [minLastSalePrice, setMinLastSalePrice] = useState("");
  const [maxLastSalePrice, setMaxLastSalePrice] = useState("");
  const [minLastSaleDate, setMinLastSaleDate] = useState("");
  const [maxLastSaleDate, setMaxLastSaleDate] = useState("");
  //financial filter states end
  // forclousure filter start
  const [minRecDate, setMinRecDate] = useState("");
  const [maxRecDate, setMaxRecDate] = useState("");
  const [minAuctionDate, setMinAuctionDate] = useState("");
  const [maxAuctionDate, setMaxAuctionDate] = useState("");
  const [mlsforeclousureSelect, setMlsforeclousureSelect] = useState("Select");

  //financial filter states end
  // forclousure filter end

  // MLS filter start
  const [minDaysMarket, setMinDaysMarket] = useState("");
  const [maxDaysMarket, setMaxDaysMarket] = useState("");
  const [mlsStatus, setMlsStatus] = useState("Select");

  const [minWithDrawnDate, setMinWithDrawnDate] = useState("");
  const [maxWithDrawnDate, setMaxWithDrawnDate] = useState("");
  const [minListingPrice, setMinListingPrice] = useState("");
  const [maxListingPrice, setMaxListingPrice] = useState("");
  //MLS filter end

  const [showModal, setShowModal] = useState(false);
  const [showModalOffer, setShowModalOffer] = useState(false);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState([]);
  const [apiCalled, setApiCalled] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State for button visibility
  const [dropdownValue, setDropdownValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [id, setId] = useState(null);
  const [isButtonVisibleFilter, setIsButtonVisibleFilter] = useState(false);
  const [filterId, setFilterId] = useState("");
  const [toastCheck, setToastCheck] = useState(true);
  const handleDropdownChange = (e) => {
    setDropdownValue(e.target.value);
    setMinPriceList(e.target.value);
  };
  const handleResetClickEstimatedValue = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const handleResetClickListPrice = () => {
    setMinPriceList("");
    setMaxPriceList("");
  };
  const leadTypes = [
    "Absentee Owner",
    "Adjustable Rate",
    "Auction",
    "Reo",
    "Cash Buyer",
    "Free Clear",
    "High Equity",
    "Negative Equity",
    "Mls Active",
    "Mls Pending",
    "Mls Cancelled",
    "Out Of State Owner",
    "Pre Foreclosure",
    "Vacant",
  ];
  const propertyTypes = ["SFR", "MFR", "MOBILE", "LAND", "CONDO", "OTHER"];
  const handleCheckboxChange = (leadType) => {
    setSelectedLeadTypes((prevSelected) =>
      prevSelected.includes(leadType)
        ? prevSelected.filter((type) => type !== leadType)
        : [...prevSelected, leadType]
    );
  };

  const handleReset = () => {
    setSelectedLeadTypes([]);
  };
  // const handleCheckboxChangeP = (lead) => {
  //   setSelectedPropertyType((prevSelected) =>
  //     prevSelected.includes(lead)
  //       ? prevSelected.filter((type) => type !== lead)
  //       : [...prevSelected, lead]
  //   );
  // };
  const handleCheckboxChangeP = (lead) => {
    setSelectedPropertyType(lead);
  };

  const handleResetProperty = () => {
    setSelectedPropertyType([]);
  };
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handlePropertySelet = (property) => {
    setSelectedPropertyType(property);
  };
  // const handlePropertySelect = (property) => {
  //   setSelectedleadtype(property);
  // };
  const handleFilterClick = (filter) => {
    // console.log("check2", filter);
    setFilterId(filter.id);
    const leadTypes = Object.keys(filter).filter((key) => filter[key] === true);

    // Convert lead types to the format you need
    const formattedLeadTypes = leadTypes.map((leadType) =>
      leadType
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );
    // console.log("check", formattedLeadTypes);

    setValues({
      County: filter.county || "",
      City: filter.city || "",
      State: filter.state || "",
      Zip: filter.zip || "",
      Address: filter.address || "",
      House: filter.house || "",
    });
    setFormData({ filterName: filter.filterName || "" });
    // setAddress(filter.address || "");
    // setValues(filter.address || "");
    setMinPrice(filter.min_est_value || "");
    setMaxPrice(filter.max_est_value || "");
    setMinPriceList(filter.min_list_price || "");
    setMaxPriceList(filter.max_list_price || "");
    setSelectedBaths(filter.no_of_baths || "");
    setSelectedBeds(filter.no_of_beds || "");
    setSelectedPropertyType(filter.property_type || "");
    setSelectedLeadTypes(formattedLeadTypes);

    // setSelectedLeadTypes(filter.lead_type || "");
    setMinBath(filter.baths_min || "");
    setMaxBath(filter.baths_max || "");
    setMinBed(filter.beds_min || "");
    setMaxBed(filter.beds_max || "");
    setMinStories(filter.stories_min || "");
    setMaxStories(filter.stories_max || "");
    setMinBuildingSize(filter.building_size_min || "");
    setMaxBuildingSize(filter.building_size_max || "");
    setMinLotSize(filter.lot_size_min || "");
    setMaxLotSize(filter.lot_size_max || "");
    setMinYearBuilt(filter.year_built_min || "");
    setMaxYearBuilt(filter.year_built_max || "");

    setMinYearOwner(filter.years_owned_min || "");
    setMaxYearOwner(filter.years_owned_max || "");
    setMinTaxDelinquent(filter.tax_delinquent_year_min || "");
    setMaxTaxDelinquent(filter.tax_delinquent_year_max || "");
    setMinPropertyOwned(filter.properties_owned_min || "");
    setMaxPropertyOwned(filter.properties_owned_max || "");
    setMinPortfolioValue(filter.portfolio_value_min || "");
    setMaxPortfolioValue(filter.portfolio_value_max || "");
    setFinancialPrivateLend(filter.private_lender || "");

    setMinEstimatedEquity(filter.estimated_equity_min || "");
    setMaxEstimatedEquity(filter.estimated_equity_max || "");
    setMinAssessedTotValue(filter.assessed_value_min || "");
    setMaxAssessedTotValue(filter.assessed_value_max || "");
    setMinAssessedLandValue(filter.assessed_land_value_min || "");
    setMaxAssessedLandValue(filter.assessed_land_value_max || "");
    setMinAssessedImpValue(filter.assessed_improvement_value_min || "");
    setMaxAssessedImpValue(filter.assessed_improvement_value_max || "");
    setMinLastSalePrice(filter.last_sale_price_min || "");
    setMaxLastSalePrice(filter.last_sale_price_max || "");
    setMinLastSaleDate(filter.last_sale_date_min || "");
    setMaxLastSaleDate(filter.last_sale_date_max || "");

    setMinRecDate(filter.pre_foreclosure_date_min || "");
    setMaxRecDate(filter.pre_foreclosure_date_max || "");
    setMinAuctionDate(filter.auction_date_min || "");
    setMaxAuctionDate(filter.auction_date_max || "");

    setMinDaysMarket(filter.mls_days_on_market_min || "");
    setMaxDaysMarket(filter.mls_days_on_market_max || "");
    setMinListingPrice(filter.mls_listing_price_min || "");
    setMaxListingPrice(filter.mls_listing_price_max || "");
    setIsButtonVisibleFilter(true);
    // setIsButtonVisible(false); // Hide the button when a filter is selected

    // setSelectedLeadTypes(filter.selected_lead_type)
    // if (filter.leadType) {
    //   handleCheckboxChange(filter.leadType);
    // }
    const leadTypesObject = selectedLeadTypes.reduce((obj, leadType) => {
      // Convert the leadType to lowercase and replace spaces with underscores
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});

    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    // function convertToNumbers(obj) {
    //   for (let key in obj) {
    //     if (key !== "address" && obj[key] !== null && !isNaN(obj[key])) {
    //       obj[key] = Number(obj[key]);
    //     }
    //   }
    //   return obj;
    // }

    // const address = filter.address;

    // const convertedFilter = convertToNumbers(filter);
    const leadTypes1 = Object.keys(filter).filter(
      (key) => filter[key] === true
    );

    // Create leadTypesObject with the desired format
    const leadTypesObject1 = leadTypes1.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});
    const reapi_payload = {
      address: filter.address,
      house: filter.house,
      // street: filter.street,
      city: filter.city,
      state: filter.state,
      county: filter.county,
      zip: filter.zip,
      ...leadTypesObject1,
      // absentee_owner: leadTypesObject.absentee_owner,
      // adjustable_rate: leadTypesObject.adjustable_rate,
      // auction:leadTypesObject.auction,
      // reo:leadTypesObject.reo,
      // cash_buyer:leadTypesObject.cash_buyer,
      // free_clear:leadTypesObject.free_clear,
      // high_equity:leadTypesObject.high_equity,
      // negative_equity:leadTypesObject.negative_equity,
      // mls_active:leadTypesObject.mls_active,
      // mls_pending:leadTypesObject.mls_pending,
      // mls_cancelled:leadTypesObject.mls_cancelled,
      // out_of_state_owner:leadTypesObject.out_of_state_owner,
      // pre_foreclosure:leadTypesObject.pre_foreclosure,
      // vacant:leadTypesObject.vacant,
      min_est_value: filter.min_est_value,
      max_est_value: filter.max_est_value,
      min_list_price: filter.min_list_price,
      max_list_price: filter.max_list_price,
      mls_listing_price_max: filter.mls_listing_price_max,
      mls_listing_price_min: filter.mls_listing_price_min,
      mls_days_on_market_max: filter.mls_days_on_market_max,
      mls_days_on_market_min: filter.mls_days_on_market_min,

      // auction_date_min: minAuctionDate,
      // auction_date_max: maxAuctionDate,
      pre_foreclosure_date_max: filter.pre_foreclosure_date_max,
      pre_foreclosure_date_min: filter.pre_foreclosure_date_min,

      last_sale_date_min: filter.last_sale_date_min,
      last_sale_date_max: filter.last_sale_date_max,
      last_sale_price_min: filter.last_sale_price_min,
      last_sale_price_max: filter.last_sale_price_max,
      assessed_improvement_value_min: filter.assessed_improvement_value_min,
      assessed_improvement_value_max: filter.assessed_improvement_value_max,
      assessed_land_value_min: filter.assessed_land_value_min,
      assessed_land_value_max: filter.assessed_land_value_max,
      assessed_value_min: filter.assessed_value_min,
      assessed_value_max: filter.assessed_value_max,
      estimated_equity_min: filter.estimated_equity_min,
      estimated_equity_max: filter.estimated_equity_max,

      // portfolio_value_min: parseInt(minPortfolioValue),
      // portfolio_value_max: parseInt(maxPortfolioValue),
      properties_owned_min: filter.properties_owned_min,
      properties_owned_max: filter.properties_owned_max,
      // tax_delinquent_year_min: parseInt(minTaxDelinquent),
      // tax_delinquent_year_max: parseInt(maxTaxDelinquent),
      years_owned_min: filter.years_owned_min,
      years_owned_max: filter.years_owned_max,

      year_built_min: filter.year_built_min,
      year_built_max: filter.year_built_max,
      lot_size_min: filter.lot_size_min,
      lot_size_max: filter.lot_size_max,
      building_size_min: filter.building_size_min,
      building_size_max: filter.building_size_max,
      stories_min: filter.stories_min,
      stories_max: filter.stories_max,
      property_type: filter.property_type,
      private_lender: filter.private_lender,

      baths_min: filter.baths_min,
      baths_max: filter.baths_max,
      beds_min: filter.beds_min,
      beds_max: filter.beds_max,
    };
    setIsButtonVisibleFilter(true);
    // setLoadingSearch(true);
    // const token = localStorage.getItem("accessToken");
    // axios
    //   .post(
    //     "/api/properties/filter",
    //     { ...reapi_payload },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     // console.log("check 1", response);
    //     if (response.data.properties.length === 0) {
    //       toast.info("No properties found for selected filters");
    //       setProperties([]);
    //       setBackArrow(true);
    //       // setTotalPages([]);
    //     } else {
    //       setOfferSentD(false);
    //       setFavorites(false);
    //       if (!toastCheck) {
    //         toast.success("Properties found successfully");
    //       }
    //       setProperties(response.data.properties);
    //       setTotalPages(response.data.total_pages);
    //       setFiltersApplied(true);
    //       // setApiCalled(true);
    //       setFilterValue(reapi_payload);
    //       setBackArrow(true);
    //       setHeading("Filters");
    //     }
    //     setFormData({ filterName: "" });
    //     setLoadingSearch(false);
    //     setShowModal(false);
    //     setShowModalOffer(false);
    //   })
    //   .catch((error) => {
    //     const errorMessage =
    //       error.response?.data?.error?.message ||
    //       error.response?.data?.error ||
    //       error.response?.data?.message ||
    //       error?.error?.message ||
    //       error?.error;
    //     //  ||
    //     // "An error occurred"
    //     toast.error(errorMessage);

    //     // toast.error(
    //     //   error.response.data.error ||
    //     //     error.response?.data?.error?.message ||
    //     //     error.response?.data?.error ||
    //     //     error?.error?.message ||
    //     //     error?.error ||
    //     //     "An unexpected error occur"
    //     // );
    //     // toast.error("not");
    //     console.error("Error  filters:", error);
    //     setLoadingSearch(false);
    //   });
  };

  const handleClose = () => {
    setShowModal(false);
    setShowModalOffer(false);
  };

  const handleUpdateFilter = async () => {
    const leadTypesList = [
      "Absentee Owner",
      "Adjustable Rate",
      "Auction",
      "Reo",
      "Cash Buyer",
      "Free Clear",
      "High Equity",
      "Negative Equity",
      "Mls Active",
      "Mls Pending",
      "Mls Cancelled",
      "Out Of State Owner",
      "Pre Foreclosure",
      "Vacant",
    ];

    const leadTypesObject = leadTypesList.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = selectedLeadTypes.includes(leadType)
        ? true
        : null;
      return obj;
    }, {});
    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };
    const filters = {
      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      filterName: formData.filterName,
      address: values.Address,
      house: values.House,
      street: values.street,
      city: values.City,
      state: values.State,
      county: values.County,
      zip: values.Zip,
      ...leadTypesObject,
      mls_listing_price_max: parseNumber(maxListingPrice),
      mls_listing_price_min: parseNumber(minListingPrice),
      mls_days_on_market_max: parseNumber(maxDaysMarket),
      mls_days_on_market_min: parseNumber(minDaysMarket),

      // auction_date_min: minAuctionDate,
      // auction_date_max: maxAuctionDate,
      pre_foreclosure_date_max: maxRecDate,
      pre_foreclosure_date_min: minRecDate,

      last_sale_date_min: minLastSaleDate,
      last_sale_date_max: maxLastSaleDate,
      last_sale_price_min: parseInt(minLastSalePrice),
      last_sale_price_max: parseInt(maxLastSalePrice),
      assessed_improvement_value_min: parseInt(minAssessedImpValue),
      assessed_improvement_value_max: parseInt(maxAssessedImpValue),
      assessed_land_value_min: parseInt(minAssessedLandValue),
      assessed_land_value_max: parseInt(maxAssessedLandValue),
      assessed_value_min: parseInt(minAssessedTotValue),
      assessed_value_max: parseInt(maxAssessedTotValue),
      estimated_equity_min: parseInt(minEstimatedEquity),
      estimated_equity_max: parseInt(maxEstimatedEquity),

      // portfolio_value_min: parseInt(minPortfolioValue),
      // portfolio_value_max: parseInt(maxPortfolioValue),
      properties_owned_min: parseInt(minPropertyOwned),
      properties_owned_max: parseInt(maxPropertyOwned),
      // tax_delinquent_year_min: parseInt(minTaxDelinquent),
      // tax_delinquent_year_max: parseInt(maxTaxDelinquent),
      years_owned_min: parseInt(minYearOwner),
      years_owned_max: parseInt(maxYearOwner),

      year_built_min: parseInt(minYearBuilt),
      year_built_max: parseInt(maxYearBuilt),
      lot_size_min: parseInt(minLotSize),
      lot_size_max: parseInt(maxLotSize),
      building_size_min: parseInt(minBuildingSize),
      building_size_max: parseInt(maxBuildingSize),
      stories_min: parseInt(minStories),
      stories_max: parseInt(maxStories),
      property_type: selectedPropertyType,
      private_lender: financialPrivateLend,

      baths_min: parseInt(minBath),
      baths_max: parseInt(maxBath),
      beds_min: parseInt(minBed),
      beds_max: parseInt(maxBed),
      ...formData,
    };
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `/api/saved-filters/${filterId}`,
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!toastCheck) {
        toast.success("Offer setting is updated successfully!");
      }
      setIsButtonVisibleFilter(false);
      fetchFilters();
      setFormData({ filterName: "" });
      setAddress("");
      setSelectedBeds("");
      setSelectedBaths("");
      setMaxPriceList("");
      setMinPriceList("");
      setMaxPrice("");
      setMinPrice("");
      setSelectedLeadTypes([]);
      setSelectedPropertyType([]);
      setMinStories("");
      setMaxStories("");
      setMinBuildingSize("");
      setMaxBuildingSize("");
      setMinLotSize("");
      setMaxLotSize("");
      setMinYearBuilt("");
      setMaxYearBuilt("");
      setOccupancyStatus("");
      setHasPhotos("");
      setMlsKeyword("");
      setFinancialPrivateLend("");
      setOwnerOccupied("");
      setAbsenteeLocationd("");
      setOwnerType("");
      setCashBuyer("");
      setMinYearOwner("");
      setMaxYearOwner("");
      setMinTaxDelinquent("");
      setMaxTaxDelinquent("");
      setMinPropertyOwned("");
      setMaxPropertyOwned("");
      setMinPortfolioValue("");
      setMaxPortfolioValue("");
      setMinEstimatedValue("");
      setMaxEstimatedValue("");
      setMinEstimatedEquity("");
      setMaxEstimatedEquity("");
      setMinAssessedTotValue("");
      setMaxAssessedTotValue("");
      setMinAssessedLandValue("");
      setMaxAssessedLandValue("");
      setMinAssessedImpValue("");
      setMaxAssessedImpValue("");
      setMinLastSalePrice("");
      setMaxLastSalePrice("");
      setMinLastSaleDate("");
      setMaxLastSaleDate("");
      setMinRecDate("");
      setMaxRecDate("");
      setMinAuctionDate("");
      setMaxAuctionDate("");
      setMlsforeclousureSelect("");
      setMinDaysMarket("");
      setMaxDaysMarket("");
      setMlsStatus("");
      setMinWithDrawnDate("");
      setMaxWithDrawnDate("");
      setMinListingPrice("");
      setMaxListingPrice("");
      setValues({
        County: "",
        City: "",
        State: "",
        Zip: "",
        Address: "",
        House: "",
      });
      setShowModal(false);
      // setShowModalOffer(false);
    } catch (error) {
      toast.error("Failed to update. Please try again.");
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
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
  useEffect(() => {
    fetchFilters();
  }, []);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState("County");
  const [values, setValues] = useState({
    County: "",
    City: "",
    State: "",
    Zip: "",
    Address: "",
    House: "",
  });

  const toggleDropdown1 = () => setDropdownOpen1((prevState) => !prevState);
  const handleSelect1 = (option) => setSelectedOption1(option);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [selectedOption1]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const leadTypesObject = selectedLeadTypes.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});

    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    const reapi_payload = {
      address: values.Address,
      house: values.House,
      street: values.street,
      city: values.City,
      state: values.State,
      county: values.County,
      zip: values.Zip,
      ...leadTypesObject,

      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      mls_listing_price_max: parseNumber(maxListingPrice),
      mls_listing_price_min: parseNumber(minListingPrice),
      mls_days_on_market_max: parseNumber(maxDaysMarket),
      mls_days_on_market_min: parseNumber(minDaysMarket),

      pre_foreclosure_date_max: maxRecDate,
      pre_foreclosure_date_min: minRecDate,

      last_sale_date_min: minLastSaleDate,
      last_sale_date_max: maxLastSaleDate,
      last_sale_price_min: parseInt(minLastSalePrice),
      last_sale_price_max: parseInt(maxLastSalePrice),
      assessed_improvement_value_min: parseInt(minAssessedImpValue),
      assessed_improvement_value_max: parseInt(maxAssessedImpValue),
      assessed_land_value_min: parseInt(minAssessedLandValue),
      assessed_land_value_max: parseInt(maxAssessedLandValue),
      assessed_value_min: parseInt(minAssessedTotValue),
      assessed_value_max: parseInt(maxAssessedTotValue),
      estimated_equity_min: parseInt(minEstimatedEquity),
      estimated_equity_max: parseInt(maxEstimatedEquity),

      properties_owned_min: parseInt(minPropertyOwned),
      properties_owned_max: parseInt(maxPropertyOwned),

      years_owned_min: parseInt(minYearOwner),
      years_owned_max: parseInt(maxYearOwner),

      year_built_min: parseInt(minYearBuilt),
      year_built_max: parseInt(maxYearBuilt),
      lot_size_min: parseInt(minLotSize),
      lot_size_max: parseInt(maxLotSize),
      building_size_min: parseInt(minBuildingSize),
      building_size_max: parseInt(maxBuildingSize),
      stories_min: parseInt(minStories),
      stories_max: parseInt(maxStories),
      property_type: selectedPropertyType,
      private_lender: financialPrivateLend,

      baths_min: parseInt(minBath),
      baths_max: parseInt(maxBath),
      beds_min: parseInt(minBed),
      beds_max: parseInt(maxBed),
    };

    const requiredFields = [
      reapi_payload.min_est_value,
      reapi_payload.max_est_value,
      reapi_payload.min_list_price,
      reapi_payload.max_list_price,
      reapi_payload.beds_max,
      reapi_payload.beds_min,
      reapi_payload.baths_max,
      reapi_payload.baths_min,
      reapi_payload.min_stories,
      reapi_payload.max_stories,
      reapi_payload.min_building_size,
      reapi_payload.max_building_size,
      reapi_payload.min_lot_size,
      reapi_payload.max_lot_size,
      reapi_payload.min_year_built,
      reapi_payload.max_year_built,
      reapi_payload.min_year_owner,
      reapi_payload.max_year_owner,
      reapi_payload.min_tax_delinquent,
      reapi_payload.max_tax_delinquent,
      reapi_payload.min_property_owned,
      reapi_payload.max_property_owned,
      reapi_payload.min_portfolio_value,
      reapi_payload.max_portfolio_value,
      reapi_payload.finance_min_estimated_value,
      reapi_payload.finance_max_estimated_value,
      reapi_payload.finance_min_estimated_equity,
      reapi_payload.finance_max_estimated_equity,
      reapi_payload.finance_min_assessed_value,
      reapi_payload.finance_max_assessed_value,
      reapi_payload.finance_min_assessed_imp_value,
      reapi_payload.finance_max_assessed_imp_value,
      reapi_payload.finance_min_assessed_land_value,
      reapi_payload.finance_max_assessed_land_value,
      // reapi_payload.finance_min_last_sale_date,
      // reapi_payload.finance_max_last_sale_date,
      reapi_payload.finance_min_last_sale_price,
      reapi_payload.finance_max_last_sale_price,
      reapi_payload.mls_max_days_on_market,
      reapi_payload.mls_min_days_on_market,

      // reapi_payload.mls_min_listing_price,
      // reapi_payload.mls_max_listing_price,
      // reapi_payload.mls_min_withdrawn_date,
      // reapi_payload.mls_max_withdrawn_date,
      // reapi_payload.fore_min_rec_date,
      // reapi_payload.fore_max_rec_date,
      // reapi_payload.fore_min_auction_date,
      // reapi_payload.fore_max_auction_date,
    ];

    const hasValidFilters =
      requiredFields.some((value) => value !== "" && !isNaN(value)) ||
      reapi_payload.address !== "" ||
      reapi_payload.state !== "" ||
      reapi_payload.county !== "" ||
      reapi_payload.city !== "" ||
      reapi_payload.zip !== "" ||
      reapi_payload.house !== "" ||
      // selectedLeadTypes.length > 0 ||
      // selectedPropertyType.length > 0;
      (selectedLeadTypes !== "" &&
        selectedLeadTypes !== "Lead Types" &&
        selectedLeadTypes.length > 0) ||
      (selectedPropertyType !== "" &&
        selectedPropertyType !== "Property Types" &&
        selectedPropertyType.length > 0);
    // selectedleadtype !== ""  ||
    // selectedPropertytype !== "";

    if (!hasValidFilters) {
      toast.error("At least one filter field is required");
      return;
    }

    setLoadingSearch(true);
    const token = localStorage.getItem("accessToken");
    axios
      .post("/api/properties/filter", reapi_payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.properties.length === 0) {
          //  toast.error(response.error.message);
          toast.info("No properties found for selected filters");
          setProperties([]);
          setBackArrow(true);
          // setTotalPages([]);
        } else {
          setOfferSentD(false);
          setFavorites(false);
          if (!toastCheck) {
            toast.success("Properties found successfully");
          }
          setProperties(response.data.properties);
          setTotalPages(response.data.total_pages);
          setFiltersApplied(true);
          setApiCalled(true);
          setFilterValue(reapi_payload);
          setBackArrow(true);
          setHeading("Filters");
        }

        setLoadingSearch(false);
      })

      .catch((error) => {
        // toast.error("Failed to search filter. Please try again");
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.error ||
          error?.error?.message ||
          error.response?.data?.message ||
          error?.error;
        // ||
        // "An error occurred";
        //  ||
        // "Failed to search filter. Please try again"
        toast.error(errorMessage);
        setLoadingSearch(false);
        setLoading(false);
      });
  };
  const [formDataOffer, setFormDataOffer] = useState({
    expirationDate: "",
    closingDate: "",
    offerAmount: "",
    listPricePercentage: "",
    escrowDeposit: "",
    inspectionPeriod: "",
    otherItems: "",
    terms: "",
  });
  const handleChangeOffer = (e) => {
    const { name, value } = e.target;
    setFormDataOffer({ ...formDataOffer, [name]: value });
  };
  const validateForm = () => {
    const requiredFields = [
      "expirationDate",
      "closingDate",
      "escrowDeposit",
      "inspectionPeriod",
    ];
    for (let field of requiredFields) {
      if (!formDataOffer[field]) {
        return false;
      }
    }
    return true;
  };
  const handleSaveFilterOffer = async (property) => {
    // if (!validateForm()) {
    //   toast.error("Please fill in all required(*) fields.");
    //   return;
    // }
    setLoading(true);
    const selectedOffer = data.find((data) => data.id === selectedValue);
    const mutiPropData = {
      offer_template: selectedOffer,
      property_ids: selectedProperties,
    };

    const token = localStorage.getItem("accessToken");
    try {
      // const webhookData = {
      //   sendOfferFormData: formDataOffer,
      //   property,
      // };

      const response = await axios.post(
        "/api/send-multiple-offers",
        mutiPropData,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedProperties([]);
      if (!toastCheck) {
        toast.success("Multiple offer sending in progress");
      }
      handleClose();
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      toast.error("Failed to send offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFilter = () => {
    if (!formData.filterName) {
      toast.error("Filter name is required");
      return;
    }
    const leadTypesObject = selectedLeadTypes.reduce((obj, leadType) => {
      const formattedLeadType = leadType.toLowerCase().replace(/\s+/g, "_");
      obj[formattedLeadType] = true;
      return obj;
    }, {});
    const parseNumber = (value) => {
      const parsed = parseInt(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    // const filters = {
    //   min_est_value: parseInt(minPrice),
    //   max_est_value: parseInt(maxPrice),
    //   min_list_price: parseInt(minPriceList),
    //   max_list_price: parseInt(maxPriceList),
    //   baths_min: parseInt(minBath),
    //   baths_max: parseInt(maxBath),
    //   beds_min: parseInt(minBed),
    //   beds_max: parseInt(maxBed),
    //   address: address,
    //   min_stories: parseInt(minStories),
    //   max_stories: parseInt(maxStories),
    //   min_building_size: parseInt(minBuildingSize),
    //   max_building_size: parseInt(maxBuildingSize),
    //   min_lot_size: parseInt(minLotSize),
    //   max_lot_size: parseInt(maxLotSize),
    //   min_year_built: parseInt(minYearBuilt),
    //   max_year_built: parseInt(maxYearBuilt),
    //   min_year_owner: parseInt(minYearOwner),
    //   max_year_owner: parseInt(maxYearOwner),
    //   min_tax_delinquent: parseInt(minTaxDelinquent),
    //   max_tax_delinquent: parseInt(maxTaxDelinquent),
    //   min_property_owned: parseInt(minPropertyOwned),
    //   max_property_owned: parseInt(maxPropertyOwned),
    //   min_portfolio_value: parseInt(minPortfolioValue),
    //   max_portfolio_value: parseInt(maxPortfolioValue),
    //   finance_min_estimated_value: parseInt(minEstimatedValue),
    //   finance_max_estimated_value: parseInt(maxEstimatedValue),
    //   finance_min_estimated_equity: parseInt(minEstimatedEquity),
    //   finance_max_estimated_equity: parseInt(maxEstimatedEquity),
    //   finance_min_assessed_value: parseInt(minAssessedTotValue),
    //   finance_max_assessed_value: parseInt(maxAssessedTotValue),
    //   finance_min_assessed_land_value: parseInt(minAssessedLandValue),
    //   finance_max_assessed_land_value: parseInt(maxAssessedLandValue),
    //   finance_min_assessed_imp_value: parseInt(minAssessedImpValue),
    //   finance_max_assessed_imp_value: parseInt(maxAssessedImpValue),
    //   // finance_min_last_sale_price: parseInt(minLastSalePrice),
    //   // finance_max_last_sale_price: parseInt(maxLastSalePrice),
    //   // finance_min_last_sale_date: minLastSaleDate,
    //   // finance_max_last_sale_date: maxLastSaleDate,
    //   // mls_status: mlsStatus,
    //   forclousre_reo_date: mlsforeclousureSelect,

    //   // mls_min_days_on_market: parseInt(minDaysMarket),
    //   // mls_max_days_on_market: parseInt(maxDaysMarket),
    //   // mls_min_withdrawn_date: minWithDrawnDate,
    //   // mls_max_withdrawn_date: maxWithDrawnDate,

    //   // mls_min_listing_price: parseInt(minListingPrice),
    //   // mls_max_listing_price: parseInt(maxListingPrice),
    //   // fore_status: parseInt(mlsforeclousureSelect),
    //   // fore_min_rec_date: minRecDate,
    //   // fore_max_rec_date: maxRecDate,

    //   // fore_min_auction_date: minAuctionDate,
    //   // fore_max_auction_date: maxAuctionDate,
    //   // selected_lead_type: selectedLeadTypes,

    //   lead_type: selectedLeadTypes,
    //   property_type: selectedPropertyType,
    //   // occupancy_status: occupancyStatus,
    //   mls_has_photos: hasPhotos,
    //   mls_keyword: mlsKeyword,
    //   financial_private_lender: financialPrivateLend,
    //   Owner_occupied: ownerOccupied,
    //   Absentee_Location: absenteeLocation,
    //   Owner_Type: ownerType,
    //   Cash_Buyer: cashBuyer,
    //   ...formData,
    // };
    const filters = {
      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      filterName: formData.filterName,
      address: values.Address,
      house: values.House,
      street: values.street,
      city: values.City,
      state: values.State,
      county: values.County,
      zip: values.Zip,
      ...leadTypesObject,
      mls_listing_price_max: parseNumber(maxListingPrice),
      mls_listing_price_min: parseNumber(minListingPrice),
      mls_days_on_market_max: parseNumber(maxDaysMarket),
      mls_days_on_market_min: parseNumber(minDaysMarket),

      // auction_date_min: minAuctionDate,
      // auction_date_max: maxAuctionDate,
      pre_foreclosure_date_max: maxRecDate,
      pre_foreclosure_date_min: minRecDate,

      last_sale_date_min: minLastSaleDate,
      last_sale_date_max: maxLastSaleDate,
      last_sale_price_min: parseInt(minLastSalePrice),
      last_sale_price_max: parseInt(maxLastSalePrice),
      assessed_improvement_value_min: parseInt(minAssessedImpValue),
      assessed_improvement_value_max: parseInt(maxAssessedImpValue),
      assessed_land_value_min: parseInt(minAssessedLandValue),
      assessed_land_value_max: parseInt(maxAssessedLandValue),
      assessed_value_min: parseInt(minAssessedTotValue),
      assessed_value_max: parseInt(maxAssessedTotValue),
      estimated_equity_min: parseInt(minEstimatedEquity),
      estimated_equity_max: parseInt(maxEstimatedEquity),

      // portfolio_value_min: parseInt(minPortfolioValue),
      // portfolio_value_max: parseInt(maxPortfolioValue),
      properties_owned_min: parseInt(minPropertyOwned),
      properties_owned_max: parseInt(maxPropertyOwned),
      // tax_delinquent_year_min: parseInt(minTaxDelinquent),
      // tax_delinquent_year_max: parseInt(maxTaxDelinquent),
      years_owned_min: parseInt(minYearOwner),
      years_owned_max: parseInt(maxYearOwner),

      year_built_min: parseInt(minYearBuilt),
      year_built_max: parseInt(maxYearBuilt),
      lot_size_min: parseInt(minLotSize),
      lot_size_max: parseInt(maxLotSize),
      building_size_min: parseInt(minBuildingSize),
      building_size_max: parseInt(maxBuildingSize),
      stories_min: parseInt(minStories),
      stories_max: parseInt(maxStories),
      property_type: selectedPropertyType,
      private_lender: financialPrivateLend,

      baths_min: parseInt(minBath),
      baths_max: parseInt(maxBath),
      beds_min: parseInt(minBed),
      beds_max: parseInt(maxBed),
      ...formData,
    };
    const requiredFields = [
      filters.address,
      filters.house,
      filters.street,
      filters.city,
      filters.state,
      filters.county,
      filters.zip,
      filters.min_est_value,
      filters.max_est_value,
      filters.min_list_price,
      filters.max_list_price,
      filters.beds_max,
      filters.beds_min,
      filters.baths_max,
      filters.baths_min,
      filters.min_stories,
      filters.max_stories,
      filters.min_building_size,
      filters.max_building_size,
      filters.min_lot_size,
      filters.max_lot_size,
      filters.min_year_built,
      filters.max_year_built,
      filters.min_year_owner,
      filters.max_year_owner,
      filters.min_tax_delinquent,
      filters.max_tax_delinquent,
      filters.min_property_owned,
      filters.max_property_owned,
      filters.min_portfolio_value,
      filters.max_portfolio_value,
      filters.finance_min_estimated_value,
      filters.finance_max_estimated_value,
      filters.finance_min_estimated_equity,
      filters.finance_max_estimated_equity,
      filters.finance_min_assessed_value,
      filters.finance_max_assessed_value,
      filters.finance_min_assessed_imp_value,
      filters.finance_max_assessed_imp_value,
      filters.finance_min_assessed_land_value,
      filters.finance_max_assessed_land_value,
      // filters.finance_min_last_sale_date,
      // filters.finance_max_last_sale_date,
      filters.finance_min_last_sale_price,
      filters.finance_max_last_sale_price,
      // filters.mls_max_days_on_market,
      // filters.mls_min_days_on_market,

      // filters.mls_min_listing_price,
      // filters.mls_max_listing_price,
      // filters.mls_min_withdrawn_date,
      // filters.mls_max_withdrawn_date,
      // filters.fore_min_rec_date,
      // filters.fore_max_rec_date,
      // filters.fore_min_auction_date,
      // filters.fore_max_auction_date,
    ];
    // const requiredFields = [
    //   filters.min_est_value,
    //   filters.max_est_value,
    //   filters.min_list_price,
    //   filters.max_list_price,
    //   filters.beds_max,
    //   filters.beds_min,
    //   filters.baths_max,
    //   filters.baths_min,
    //   filters.min_stories,
    //   filters.max_stories,
    //   filters.min_building_size,
    //   filters.max_building_size,
    //   filters.min_lot_size,
    //   filters.max_lot_size,
    //   filters.min_year_built,
    //   filters.max_year_built,
    //   filters.min_year_owner,
    //   filters.max_year_owner,
    //   filters.min_tax_delinquent,
    //   filters.max_tax_delinquent,
    //   filters.min_property_owned,
    //   filters.max_property_owned,
    //   filters.min_portfolio_value,
    //   filters.max_portfolio_value,
    //   filters.finance_min_estimated_value,
    //   filters.finance_max_estimated_value,
    //   filters.finance_min_estimated_equity,
    //   filters.finance_max_estimated_equity,
    //   filters.finance_min_assessed_value,
    //   filters.finance_max_assessed_value,
    //   filters.finance_min_assessed_imp_value,
    //   filters.finance_max_assessed_imp_value,
    //   filters.finance_min_assessed_land_value,
    //   filters.finance_max_assessed_land_value,
    //   // filters.finance_min_last_sale_date,
    //   // filters.finance_max_last_sale_date,
    //   filters.finance_min_last_sale_price,
    //   filters.finance_max_last_sale_price,
    //   filters.mls_max_days_on_market,
    //   filters.mls_min_days_on_market,
    //   // filters.mls_min_listing_price,
    //   // filters.mls_max_listing_price,
    //   // filters.mls_min_withdrawn_date,
    //   // filters.mls_max_withdrawn_date,
    //   // filters.fore_min_rec_date,
    //   // filters.fore_min_rec_date,
    //   // filters.fore_min_auction_date,
    //   // filters.fore_max_auction_date,
    //   filters.lead_type,
    //   filters.property_type,
    // ];
    const hasValidFilters =
      requiredFields.some((value) => value !== "" && !isNaN(value)) ||
      (filters.address && filters.address !== "") ||
      (filters.house && filters.house !== "") ||
      (filters.street && filters.street !== "") ||
      (filters.city && filters.city !== "") ||
      (filters.state && filters.state !== "") ||
      (filters.county && filters.county !== "") ||
      (filters.zip && filters.zip !== "") ||
      // address !== "" ||
      // selectedLeadTypes.length > 0 ||
      (selectedLeadTypes !== "" &&
        selectedLeadTypes !== "Lead Types" &&
        selectedLeadTypes.length > 0) ||
      // selectedPropertyType.length > 0;
      (selectedPropertyType !== "" &&
        selectedPropertyType !== "Property Types" &&
        selectedPropertyType.length > 0);
    // selectedleadtype !== "" ||
    // selectedPropertytype !== "";
    if (!hasValidFilters) {
      toast.error("At least one filter field is required");
      return;
    }
    setLoading(true);
    setLoadingSave(true);
    const token = localStorage.getItem("accessToken");
    axios
      .post("/api/properties/save-filter", filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!toastCheck) {
          toast.success("Filter saved successfully");
        }
        setFilterValue(filters);

        fetchFilters();
        setFormData({ filterName: "" });
        setAddress("");
        setSelectedBeds("");
        setSelectedBaths("");
        setMaxPriceList("");
        setMinPriceList("");
        setMaxPrice("");
        setMinPrice("");
        setSelectedLeadTypes([]);
        setSelectedPropertyType([]);
        setMinStories("");
        setMaxStories("");
        setMinBuildingSize("");
        setMaxBuildingSize("");
        setMinLotSize("");
        setMaxLotSize("");
        setMinYearBuilt("");
        setMaxYearBuilt("");
        setOccupancyStatus("");
        setHasPhotos("");
        setMlsKeyword("");
        setFinancialPrivateLend("");
        setOwnerOccupied("");
        setAbsenteeLocationd("");
        setOwnerType("");
        setCashBuyer("");
        setMinYearOwner("");
        setMaxYearOwner("");
        setMinTaxDelinquent("");
        setMaxTaxDelinquent("");
        setMinPropertyOwned("");
        setMaxPropertyOwned("");
        setMinPortfolioValue("");
        setMaxPortfolioValue("");
        setMinEstimatedValue("");
        setMaxEstimatedValue("");
        setMinEstimatedEquity("");
        setMaxEstimatedEquity("");
        setMinAssessedTotValue("");
        setMaxAssessedTotValue("");
        setMinAssessedLandValue("");
        setMaxAssessedLandValue("");
        setMinAssessedImpValue("");
        setMaxAssessedImpValue("");
        setMinLastSalePrice("");
        setMaxLastSalePrice("");
        setMinLastSaleDate("");
        setMaxLastSaleDate("");
        setMinRecDate("");
        setMaxRecDate("");
        setMinAuctionDate("");
        setMaxAuctionDate("");
        setMlsforeclousureSelect("");
        setMinDaysMarket("");
        setMaxDaysMarket("");
        setMlsStatus("");
        setMinWithDrawnDate("");
        setMaxWithDrawnDate("");
        setMinListingPrice("");
        setMaxListingPrice("");
        setValues({
          County: "",
          City: "",
          State: "",
          Zip: "",
          Address: "",
          House: "",
        });
        setLoadingSave(false);
        setShowModal(false);
        setShowModalOffer(false);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.error("Error saving filters:", error);
        setLoadingSave(false);
      });
  };
  const handleLinkClick = async (e, property, propertyId) => {
    e.preventDefault(); // Prevent the default link behavior
    const payload = {
      comps: "True",
      address: `${property.location}`,
    };
    try {
      await axios.post(`/api/properties-detail/${propertyId}`, payload);
      navigate(`/dashboard/property-detail/${propertyId}`); // Navigate to the new route
    } catch (error) {
      const statusCode = error?.response?.status || "Unknown status";
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";

      if (statusCode === 404) {
        navigate(`/dashboard/property-detail/${propertyId}`);
        toast.error(errorMessage);
      } else if (statusCode === 500) {
        navigate(`/dashboard/property-detail/${propertyId}`);
        toast.error(errorMessage);
      }
      console.error(`Error (${statusCode}): ${errorMessage}`);
      // toast.error(`Error (${statusCode}): ${errorMessage}`);
    }
  };
  const handleMlsHasPhotos = (value) => {
    if (hasPhotos.includes(value)) {
      setHasPhotos(hasPhotos.filter((item) => item !== value));
    } else {
      setHasPhotos([...hasPhotos, value]);
    }
  };
  const handleMlsKeyword = (value) => {
    if (mlsKeyword.includes(value)) {
      setMlsKeyword(mlsKeyword.filter((item) => item !== value));
    } else {
      setMlsKeyword([...mlsKeyword, value]);
    }
  };
  const handlePrivateLender = (value) => {
    if (financialPrivateLend === value) {
      setFinancialPrivateLend(null); // Deselect if the same value is clicked again
    } else {
      setFinancialPrivateLend(value); // Set the new value
    }
  };
  // const handlePrivateLender = (value) => {
  //   if (financialPrivateLend.includes(value)) {
  //     setFinancialPrivateLend(
  //       financialPrivateLend.filter((item) => item !== value)
  //     );
  //   } else {
  //     setFinancialPrivateLend([...financialPrivateLend, value]);
  //   }
  // };
  const handleOwnerOccupied = (value) => {
    if (ownerOccupied.includes(value)) {
      setOwnerOccupied(ownerOccupied.filter((item) => item !== value));
    } else {
      setOwnerOccupied([...ownerOccupied, value]);
    }
  };
  const handleAbsenteeLocation = (value) => {
    if (absenteeLocation.includes(value)) {
      setAbsenteeLocationd(absenteeLocation.filter((item) => item !== value));
    } else {
      setAbsenteeLocationd([...absenteeLocation, value]);
    }
  };
  const handleOwnerType = (value) => {
    if (ownerType.includes(value)) {
      setOwnerType(ownerType.filter((item) => item !== value));
    } else {
      setOwnerType([...ownerType, value]);
    }
  };
  const handleCashBuyer = (value) => {
    if (cashBuyer.includes(value)) {
      setCashBuyer(cashBuyer.filter((item) => item !== value));
    } else {
      setCashBuyer([...cashBuyer, value]);
    }
  };
  const handleOccupancyChange = (value) => {
    if (occupancyStatus.includes(value)) {
      setOccupancyStatus(occupancyStatus.filter((item) => item !== value));
    } else {
      setOccupancyStatus([...occupancyStatus, value]);
    }
  };
  // const handleOccupancyChange = (status) => {
  //   setOccupancyStatus([status]);
  // };
  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };
  const handleBedsClick = (event) => {
    event.stopPropagation();
    setActiveButton("beds");
    setShowBeds(!showBeds);
    setShowBaths(false);
  };
  const handleBathsClick = (event) => {
    event.stopPropagation();
    setActiveButton("baths");
    setShowBaths(!showBaths);
    setShowBeds(false);
  };
  // const handleBedsClick = (event) => {
  //   event.stopPropagation();
  //   const bed = event.target.innerText;

  //   if (bed !== "No. of Bedrooms") {
  //     setSelectedBeds(bed);
  //   }
  //   setShowBeds(true);
  //   setShowBaths(false);

  //   setActiveButton("beds");
  // };

  // const handleBathsClick = (event) => {
  //   event.stopPropagation();
  //   const bath = event.target.innerText;

  //   if (bath !== "No. of Bathrooms") {
  //     setSelectedBaths(bath);
  //   }
  //   setShowBaths(true);
  //   setShowBeds(false);

  //   setActiveButton("baths");
  // };

  const handleShowPriceRange = (event) => {
    event.stopPropagation();
    setShowDataMessage(false);
    setShowInputField(false);
    setShowPriceRange(true);
    setActiveButtonP("priceRange");
  };

  const handleShowDataClick = (event) => {
    event.stopPropagation();
    setShowDataMessage(true);
    setShowPriceRange(false);
    setActiveButtonP("showData");
  };
  // const handleResetProperty = () => {
  //   setSelectedPropertyType("Property Types");
  // };
  const handleResetClickListprice = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinPriceList("");
    setMaxPriceList("");
  };
  const handleResetClick = () => {
    setMinBed("");
    setMaxBed("");
  };
  const handleResetClickBath = () => {
    setMinBath("");
    setMaxBath("");
  };
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <img className="brands_arrow" src={rightarrow} />,
    prevArrow: <img className="brands_arrow" src={leftarrow} />,
  };

  useEffect(() => {
    if (!offerSentD) {
      if (!favorites) {
        if (!filtersApplied) {
          setPaginationLoading(true);
          axios
            .get(`/api/properties?page=${currentPage}`)

            .then((response) => {
              setloader(false);

              setProperties(response.data.properties);
              setCurrentPage(response.data.current_page);
              setTotalPages(response.data.total_pages);
              setInterestRate(response.data.interest_rate);
              setLoading(false);
              setPaginationLoading(false);
            })
            .catch((error) => {
              alert(error.message);
              setLoading(false);
            });
        } else {
          const token = localStorage.getItem("accessToken");
          setPaginationLoading(true);
          axios
            .post(`/api/properties/filter?page=${currentPage}`, filterValue, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              setOfferSentD(false);
              setFavorites(false);
              setloader(false);
              setProperties(response.data.properties);
              setCurrentPage(response.data.current_page);
              setTotalPages(response.data.total_pages);
              setBackArrow(true);
              setHeading("Filters");
              setPaginationLoading(false);
            })
            .catch((error) => {
              alert(error.message);
              setLoading(false);
            });
        }
      } else {
        const token = localStorage.getItem("accessToken");
        setPaginationLoading(true);
        axios
          .get(`/api/saved-lists-properties?page=${currentPage}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setHeading("FAVORITES");
            setloader(false);
            setProperties(response.data.properties);
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.total_pages);
            setLoading(false);
            setBackArrow(true);
            setPaginationLoading(false);
            // console.log("object");
          })
          .catch((error) => {
            alert(error.message);
            setLoading(false);
          });
      }
    } else {
      const token = localStorage.getItem("accessToken");
      setPaginationLoading(true);
      axios
        .get(`/api/send-offer-properties?page=${currentPage}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setHeading("OFFER SENT");
          setloader(false);
          setProperties(response.data.properties);
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.total_pages);
          setLoading(false);
          // console.log("object");
          setBackArrow(true);
          setPaginationLoading(false);
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
        });
    }
  }, [currentPage]);
  const handleSaveFiltersOffer = () => {
    // console.log("handleSaveFiltersOffer triggered");

    setShowModalOffer(true);
    setModalData();
    // console.log("hndle save filter", property);
  };
  const handleSaveFilters = () => {
    setShowModal(true);
  };
  useEffect(() => {
    const offerSent = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/send-offer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSavedOfferSent(response.data);
        // setSavedProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };

    offerSent();
  }, []);
  useEffect(() => {
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

    fetchSavedProperties();
  }, []);

  const handleHeartClick = async (propertyId, address) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "/api/saved-lists",
        {
          property_id: propertyId,
          property_address: address,
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
  const handleFillHeartClick = async (propertyId) => {
    try {
      await axios.delete(`/api/saved-lists/${propertyId}`);
      if (!toastCheck) {
        toast.success("Property Unsaved successfully");
      }
      const updatedSavedProperties = savedProperties.filter(
        (property) => property.id !== propertyId
      );
      setSavedProperties(updatedSavedProperties);
    } catch (error) {
      console.error("Failed to delete property ID", error);
      toast.error("Failed to delete property ID");
    }
  };
  const handleFavoritesClick = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`/api/saved-lists-properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.properties.length === 0) {
        toast.info("No Favorite Property found.");
        setProperties([]);
        setHeading("FAVORITES");
        setBackArrow(true);
        // setTotalPages([]);
      } else {
        setHeading("FAVORITES");
        setFavorites(true);
        setOfferSentD(false);
        if (!toastCheck) {
          toast.success("Favorities Property found successfully");
        }
        setProperties(response.data.properties);
        setTotalPages(response.data.total_pages);
        // setFiltersApplied(false);
        // setApiCalled(true);
        setFilterValue(filters);
        setBackArrow(true);
      }

      setLoadingSearch(false);
    } catch (error) {
      toast.error("Failed to search filter. Please try again");
      setLoadingSearch(false);
    }
  };

  const handleOfferSent = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get("/api/send-offer-properties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.properties.length === 0) {
        toast.info("No Offers Sent Property found");
        setHeading("OFFER SENT");
        setProperties([]);
        setBackArrow(true);
        // setTotalPages([]);
      } else {
        setHeading("OFFER SENT");
        setOfferSentD(true);
        setFavorites(false);
        if (!toastCheck) {
          toast.success("Offers Sent Property found successfully");
        }
        setProperties(response.data.properties);
        setTotalPages(response.data.total_pages);
        // setFiltersApplied(true);
        // setApiCalled(true);
        setFilterValue(filters);
        setBackArrow(true);
      }

      setLoadingSearch(false);
    } catch (error) {
      toast.error("Failed to search filter. Please try again");
      setLoadingSearch(false);
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
      // console.log("check", response.data);
      setData(response.data.offers);

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
  const handleSelect = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleAddProperty = (id) => {
    // console.log("add", id);
    setSelectedProperties((prevSelectedProperties) => [
      ...prevSelectedProperties,
      id,
    ]);
  };
  const handleRemoveProperty = (id) => {
    // console.log("remove", id);
    setSelectedProperties((prevSelectedProperties) =>
      prevSelectedProperties.filter((propertyId) => propertyId !== id)
    );
  };
  const isPropertySelected = (id) => {
    return selectedProperties.includes(id);
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
            <p className="dashboard-text">{heading}</p>
            <div className="filter-main-container">
              <div className="search-main-container">
                <form className="w-100" onSubmit={handleSubmit}>
                  <InputGroup>
                    <Dropdown isOpen={dropdownOpen1} toggle={toggleDropdown1}>
                      <DropdownToggle caret className="county_address">
                        {selectedOption1}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => handleSelect1("County")}>
                          County
                        </DropdownItem>
                        <DropdownItem onClick={() => handleSelect1("Address")}>
                          Address
                        </DropdownItem>
                        <DropdownItem onClick={() => handleSelect1("City")}>
                          City
                        </DropdownItem>
                        <DropdownItem onClick={() => handleSelect1("State")}>
                          State
                        </DropdownItem>
                        <DropdownItem onClick={() => handleSelect1("Zip")}>
                          Zip
                        </DropdownItem>
                        <DropdownItem onClick={() => handleSelect1("House")}>
                          House
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    <img
                      className="search-icon search-icon-dash"
                      src={search}
                      alt="search"
                    />
                    <Input
                      placeholder="123 Main St, Arlington VA 22205"
                      value={values[selectedOption1]}
                      onChange={handleInputChange}

                      // onChange={(e) => setAddress(e.target.value)}
                    />
                  </InputGroup>
                </form>
              </div>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle className="filter-types-main-container" caret>
                  {
                    selectedLeadTypes.length === 0 ? "Lead Types" : "Lead Types"
                    // : selectedLeadTypes.join(", ")
                  }
                </DropdownToggle>
                <DropdownMenu>
                  {leadTypes.map((leadType) => (
                    <DropdownItem key={leadType} toggle={false}>
                      <label style={{ cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={selectedLeadTypes.includes(leadType)}
                          onChange={() => handleCheckboxChange(leadType)}
                        />{" "}
                        {leadType}
                      </label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem className="btn-reset" onClick={handleReset}>
                    Reset
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown
                isOpen={propertyDropdownOpen}
                toggle={togglePropertyDropdown}
              >
                <DropdownToggle className="filter-types-main-container" caret>
                  {
                    selectedPropertyType.length === 0
                      ? "Property Types"
                      : "Property Types"
                    // : selectedLeadTypes.join(", ")
                  }
                </DropdownToggle>
                <DropdownMenu>
                  {propertyTypes.map((lead) => (
                    <DropdownItem key={lead} toggle={false}>
                      <label style={{ cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={selectedPropertyType.includes(lead)}
                          onChange={() => handleCheckboxChangeP(lead)}
                        />{" "}
                        {lead}
                      </label>
                    </DropdownItem>
                  ))}
                  <DropdownItem divider />
                  <DropdownItem
                    className="btn-reset"
                    onClick={handleResetProperty}
                  >
                    Reset
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <div className="dropdown">
                <div
                  className="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Price
                </div>
                <ul className="dropdown-menu bed-bath-hei">
                  <li>
                    <div className="d-flex justify-content-between btn-price-range-both">
                      <button
                        className={`dropdown-item btn-price-range ${
                          activeButtonP === "priceRange" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleShowPriceRange}
                      >
                        <span className="">Estimated Value</span>
                      </button>
                      <button
                        className={`dropdown-item btn-show-data ${
                          activeButtonP === "showData" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleShowDataClick}
                      >
                        <span>List Price</span>
                      </button>
                    </div>
                  </li>
                  {showPriceRange && (
                    <li className="price-range-section1">
                      <p className="pt-3"></p>
                      {/* <span>Estimated Value</span> */}
                      <div className="d-flex justify-content-between">
                        <input
                          type="text"
                          placeholder="Min Est. Value"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="input_css"
                        />
                        <hr className="vertical-divider" />
                        <input
                          type="text"
                          placeholder="Max Est. Value"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="input_css"
                        />
                      </div>
                      <button
                        className="dropdown-item btn-reset"
                        type="button"
                        onClick={handleResetClickEstimatedValue}
                      >
                        Reset
                      </button>
                    </li>
                  )}

                  {showDataMessage && (
                    <li className="price-range-section1">
                      <p className="pt-3"></p>
                      {/* <span>List Price</span> */}
                      <div className="d-flex justify-content-between">
                        <input
                          type="text"
                          placeholder="Min List price"
                          value={minPriceList}
                          onChange={(e) => setMinPriceList(e.target.value)}
                          className="input_css"
                        />
                        <hr className="vertical-divider" />
                        <input
                          type="text"
                          placeholder="Max List price"
                          value={maxPriceList}
                          onChange={(e) => setMaxPriceList(e.target.value)}
                          className="input_css"
                        />
                      </div>
                      <button
                        className="dropdown-item btn-reset"
                        type="button"
                        id="resetPriceButton"
                        onClick={handleResetClickListPrice}
                      >
                        Reset
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              <div className="dropdown">
                <div
                  className="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Beds/ Baths
                </div>
                <ul className="dropdown-menu bed-bath-hei">
                  <li>
                    <div className="d-flex justify-content-between btn-price-range-both">
                      <button
                        className={`dropdown-item btn-price-range ${
                          activeButton === "beds" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleBedsClick}
                      >
                        <span>No. of Bedrooms</span>
                      </button>
                      <button
                        className={`dropdown-item btn-show-data ${
                          activeButton === "baths" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleBathsClick}
                      >
                        <span>No. of Bathrooms</span>
                      </button>
                    </div>
                  </li>
                  {showBeds && (
                    <li className="price-range-section1">
                      <p className="pt-3"></p>
                      <div className="d-flex justify-content-between">
                        <select
                          value={minBed}
                          onChange={(e) => setMinBed(e.target.value)}
                          className="input_css"
                        >
                          <option value="" disabled>
                            Select Min Bed
                          </option>

                          <option value="1" className="SelectOption">
                            1
                          </option>
                          <option value="2" className="SelectOption">
                            2
                          </option>
                          <option value="3" className="SelectOption">
                            3
                          </option>
                          <option value="4" className="SelectOption">
                            4
                          </option>
                          <option value="5" className="SelectOption">
                            5
                          </option>
                          <option value="6" className="SelectOption">
                            6
                          </option>
                          {/* Add more options as needed */}
                        </select>
                        <hr className="vertical-divider" />
                        <select
                          value={maxBed}
                          onChange={(e) => setMaxBed(e.target.value)}
                          className="input_css"
                        >
                          <option value="" disabled>
                            Select Max Bed
                          </option>
                          <option value="1" className="SelectOption">
                            1
                          </option>
                          <option value="2" className="SelectOption">
                            2
                          </option>
                          <option value="3" className="SelectOption">
                            3
                          </option>
                          <option value="4" className="SelectOption">
                            4
                          </option>
                          <option value="5" className="SelectOption">
                            5
                          </option>
                          <option value="6" className="SelectOption">
                            6
                          </option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                      <button
                        className="dropdown-item btn-reset"
                        type="button"
                        onClick={handleResetClick}
                      >
                        Reset
                      </button>
                    </li>
                  )}
                  {showBaths && (
                    <li className="price-range-section1">
                      <p className="pt-3"></p>
                      <div className="d-flex justify-content-between">
                        <select
                          value={minBath}
                          onChange={(e) => setMinBath(e.target.value)}
                          className="input_css"
                        >
                          <option value="" disabled>
                            Select Min Bath
                          </option>

                          <option value="1" className="SelectOption">
                            1
                          </option>
                          <option value="2" className="SelectOption">
                            2
                          </option>
                          <option value="3" className="SelectOption">
                            3
                          </option>
                          <option value="4" className="SelectOption">
                            4
                          </option>
                          <option value="5" className="SelectOption">
                            5
                          </option>
                          <option value="6" className="SelectOption">
                            6
                          </option>
                          {/* Add more options as needed */}
                        </select>
                        <hr className="vertical-divider" />
                        <select
                          value={maxBath}
                          onChange={(e) => setMaxBath(e.target.value)}
                          className="input_css"
                        >
                          <option value="" disabled>
                            Select Max Bath
                          </option>
                          <option value="1" className="SelectOption">
                            1
                          </option>
                          <option value="2" className="SelectOption">
                            2
                          </option>
                          <option value="3" className="SelectOption">
                            3
                          </option>
                          <option value="4" className="SelectOption">
                            4
                          </option>
                          <option value="5" className="SelectOption">
                            5
                          </option>
                          <option value="6" className="SelectOption">
                            6
                          </option>
                          {/* Add more options as needed */}
                        </select>
                      </div>
                      <button
                        className="dropdown-item btn-reset"
                        type="button"
                        onClick={handleResetClickBath}
                      >
                        Reset
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              <div className="dropdown">
                <div
                  className="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img className="filter-icon" src={filter} alt="filter" />
                  More Filters
                </div>
                <ul
                  className="dropdown-menu more-filter-width p-3"
                  onClick={handleDropdownClick}
                >
                  <div className="accordion" id="accordionExample">
                    <div className="accordion-item accordian_border1">
                      <h2 className="accordion-header" id="heading1">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse1"
                          aria-expanded="false"
                          aria-controls="collapse1"
                        >
                          Property Filter
                        </button>
                      </h2>
                      <div
                        id="collapse1"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading1"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Number of stories
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minStories}
                                    onChange={(e) =>
                                      setMinStories(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxStories}
                                    onChange={(e) =>
                                      setMaxStories(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Building size(Sq.ft.)
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minBuildingSize}
                                    onChange={(e) =>
                                      setMinBuildingSize(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxBuildingSize}
                                    onChange={(e) =>
                                      setMaxBuildingSize(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Lot Size
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minLotSize}
                                    onChange={(e) =>
                                      setMinLotSize(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxLotSize}
                                    onChange={(e) =>
                                      setMaxLotSize(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Year Built (YYYY)
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minYearBuilt}
                                    onChange={(e) =>
                                      setMinYearBuilt(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxYearBuilt}
                                    onChange={(e) =>
                                      setMaxYearBuilt(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              {/* <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Occupancy Status
                                </label>
                                <div className="d-flex align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="occupiedCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Occupied")
                                    }
                                    checked={occupancyStatus.includes(
                                      "Occupied"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Occupied
                                  </label>

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="vacantCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Vacant")
                                    }
                                    checked={occupancyStatus.includes("Vacant")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    vacant
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Any")
                                    }
                                    checked={occupancyStatus.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div> */}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading2">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse2"
                          aria-expanded="false"
                          aria-controls="collapse2"
                        >
                          Owner Filter
                        </button>
                      </h2>
                      <div
                        id="collapse2"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading2"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            {/* <div className="row">
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Owner Occupied?
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesYwnerOccupiedCheckbox"
                                    onChange={() => handleOwnerOccupied("Yes")}
                                    checked={ownerOccupied.includes("Yes")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Yes
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noOwnerCheckbox"
                                      onChange={() => handleOwnerOccupied("No")}
                                      checked={ownerOccupied.includes("No")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyOwnerCheckbox"
                                    onChange={() => handleOwnerOccupied("Any")}
                                    checked={ownerOccupied.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Absentee Location
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="inState"
                                    onChange={() =>
                                      handleAbsenteeLocation("in-State")
                                    }
                                    checked={absenteeLocation.includes(
                                      "in-State"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    In-State
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="outstateCheckbox"
                                      onChange={() =>
                                        handleAbsenteeLocation("out-of-state")
                                      }
                                      checked={absenteeLocation.includes(
                                        "out-of-state"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Out-of-State
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyabsenteeCheckbox"
                                    onChange={() =>
                                      handleAbsenteeLocation("Any")
                                    }
                                    checked={absenteeLocation.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Owner Type
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="individualCheckbox"
                                    onChange={() =>
                                      handleOwnerType("Individual")
                                    }
                                    checked={ownerType.includes("Individual")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Individual
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="businessCheckbox"
                                      onChange={() =>
                                        handleOwnerType("Business")
                                      }
                                      checked={ownerType.includes("Business")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Business
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="bankTrustCheckbox"
                                    onChange={() =>
                                      handleOwnerType("BankTrust")
                                    }
                                    checked={ownerType.includes("BankTrust")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Bank or Trust
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Cash Buyer?
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesCashBuyerCheckbox"
                                    onChange={() => handleCashBuyer("Yes")}
                                    checked={cashBuyer.includes("Yes")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Yes
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noCashBuyerCheckbox"
                                      onChange={() => handleCashBuyer("No")}
                                      checked={cashBuyer.includes("No")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyCashBuyerCheckbox"
                                    onChange={() => handleCashBuyer("Any")}
                                    checked={cashBuyer.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                            </div> */}
                            <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Years of Ownership
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minYearOwner}
                                    onChange={(e) =>
                                      setMinYearOwner(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxYearOwner}
                                    onChange={(e) =>
                                      setMaxYearOwner(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Tax Delinquent Year (YYYY)
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minTaxDelinquent}
                                    onChange={(e) =>
                                      setMinTaxDelinquent(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxTaxDelinquent}
                                    onChange={(e) =>
                                      setMaxTaxDelinquent(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Properties Owned
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minPropertyOwned}
                                    onChange={(e) =>
                                      setMinPropertyOwned(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxPropertyOwned}
                                    onChange={(e) =>
                                      setMaxPropertyOwned(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Portfolio Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="$ Min"
                                    value={minPortfolioValue}
                                    onChange={(e) =>
                                      setMinPortfolioValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="$ Max"
                                    value={maxPortfolioValue}
                                    onChange={(e) =>
                                      setMaxPortfolioValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown item 3 */}
                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading3">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse3"
                          aria-expanded="false"
                          aria-controls="collapse3"
                        >
                          Financial Filter
                        </button>
                      </h2>
                      <div
                        id="collapse3"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading3"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Private Lender?
                                </label>
                                <div className="d-flex  justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesPrivatelenderCheckbox"
                                    onChange={() => handlePrivateLender("True")}
                                    checked={financialPrivateLend.includes(
                                      "True"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    True
                                  </label>

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="noPrivatelenderCheckbox"
                                    onChange={() =>
                                      handlePrivateLender("False")
                                    }
                                    checked={financialPrivateLend.includes(
                                      "False"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    False
                                  </label>
                                </div>
                              </div>
                              {/* <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Estimated Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minEstimatedValue}
                                    onChange={(e) =>
                                      setMinEstimatedValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxEstimatedValue}
                                    onChange={(e) =>
                                      setMaxEstimatedValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div> */}
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Estimated Equity
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minEstimatedEquity}
                                    onChange={(e) =>
                                      setMinEstimatedEquity(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxEstimatedEquity}
                                    onChange={(e) =>
                                      setMaxEstimatedEquity(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Total Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedTotValue}
                                    onChange={(e) =>
                                      setMinAssessedTotValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedTotValue}
                                    onChange={(e) =>
                                      setMaxAssessedTotValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Land Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedLandValue}
                                    onChange={(e) =>
                                      setMinAssessedLandValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedLandValue}
                                    onChange={(e) =>
                                      setMaxAssessedLandValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Improvement Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedImpValue}
                                    onChange={(e) =>
                                      setMinAssessedImpValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedImpValue}
                                    onChange={(e) =>
                                      setMaxAssessedImpValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Last Sale Price
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minLastSalePrice}
                                    onChange={(e) =>
                                      setMinLastSalePrice(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxLastSalePrice}
                                    onChange={(e) =>
                                      setMaxLastSalePrice(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Last Sale Date
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="$ Min"
                                    value={minLastSaleDate}
                                    onChange={(e) =>
                                      setMinLastSaleDate(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="$ Max"
                                    value={maxLastSaleDate}
                                    onChange={(e) =>
                                      setMaxLastSaleDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown item 4 */}
                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading4">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse4"
                          aria-expanded="false"
                          aria-controls="collapse4"
                        >
                          Foreclosure Filter
                        </button>
                      </h2>
                      <div
                        id="collapse4"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading4"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Preforeclosure Date
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="date"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minRecDate}
                                    onChange={(e) =>
                                      setMinRecDate(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxRecDate}
                                    onChange={(e) =>
                                      setMaxRecDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Auction Date
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAuctionDate}
                                    onChange={(e) =>
                                      setMinAuctionDate(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAuctionDate}
                                    onChange={(e) =>
                                      setMaxAuctionDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            {/* <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  REO Date
                                </label>
                                <div className="d-flex">
                                  <select
                                    className="w-100  form-control"
                                    value={mlsforeclousureSelect}
                                    onChange={(e) =>
                                      setMlsforeclousureSelect(e.target.value)
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="path_month">
                                      Within past month
                                    </option>
                                    <option value="path_2month">
                                      Within past 2 months
                                    </option>
                                    <option value="path_3month">
                                      Within past 3 months
                                    </option>
                                    <option value="path_6month">
                                      Within past 6 months
                                    </option>
                                    <option value="past_year">
                                      Within past years
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div> */}
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown item 5 */}
                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading5">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse5"
                          aria-expanded="false"
                          aria-controls="collapse5"
                        >
                          MLS Filter
                        </button>
                      </h2>
                      <div
                        id="collapse5"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading5"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-12 mt-3">
                                {/* <div>
                                  <label className="form-label property_filter_head">
                                    MLS Status
                                  </label>
                                  <div className="d-flex">
                                    <select
                                      className="w-100  form-control"
                                      value={mlsStatus}
                                      onChange={(e) =>
                                        setMlsStatus(e.target.value)
                                      }
                                    >
                                      <option value="Select">Select</option>
                                      <option value="active">Active</option>
                                      <option value="pending">Pending</option>
                                      <option value="sold">Sold</option>
                                      <option value="withdrawn">
                                        Withdrawn
                                      </option>
                                    </select>
                                  </div>
                                </div> */}
                                {/* <div>
                                  <label className="form-label property_filter_head">
                                    MLS Withdrwan Date
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="date"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Min"
                                      value={minWithDrawnDate}
                                      onChange={(e) =>
                                        setMinWithDrawnDate(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="date"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Max"
                                      value={maxWithDrawnDate}
                                      onChange={(e) =>
                                        setMaxWithDrawnDate(e.target.value)
                                      }
                                    />
                                  </div>
                                </div> */}
                                {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                  <label className="form-label property_filter_head">
                                    Has Photos?
                                  </label>
                                  <div className="d-flex align-items-center justify-content-around">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="yesMlsHasPhotosCheckbox"
                                      onChange={() => handleMlsHasPhotos("Yes")}
                                      checked={hasPhotos.includes("Yes")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="minCheckbox"
                                    >
                                      Yes
                                    </label>

                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noMlsHasPhotosCheckbox"
                                      onChange={() => handleMlsHasPhotos("No")}
                                      checked={hasPhotos.includes("No")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="anyMlsHasPhotosCheckbox"
                                      onChange={() => handleMlsHasPhotos("Any")}
                                      checked={hasPhotos.includes("Any")}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Any
                                    </label>
                                  </div>
                                </div> */}
                              </div>
                              <div className="col-xl-8 col-lg-6 col-md-12 col-12 mt-3">
                                <div>
                                  <label className="form-label property_filter_head">
                                    Days on Market
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Min"
                                      value={minDaysMarket}
                                      onChange={(e) =>
                                        setMinDaysMarket(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Max"
                                      value={maxDaysMarket}
                                      onChange={(e) =>
                                        setMaxDaysMarket(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="form-label property_filter_head">
                                    Listing Price
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="$ Min"
                                      value={minListingPrice}
                                      onChange={(e) =>
                                        setMinListingPrice(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="$ Max"
                                      value={maxListingPrice}
                                      onChange={(e) =>
                                        setMaxListingPrice(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* <div className="col-xl-3 col-lg-6 col-md-12 col-12 mt-3 mls_back">
                                <label className="form-label property_filter_head">
                                  MLS keyword
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="mlsInvestorOwnedCheckbox"
                                    onChange={() =>
                                      handleMlsKeyword("investor-owned")
                                    }
                                    checked={mlsKeyword.includes(
                                      "investor-owned"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Investor-Owned
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="mlsCreativeFinancingCheckbox"
                                      onChange={() =>
                                        handleMlsKeyword("creative financing")
                                      }
                                      checked={mlsKeyword.includes(
                                        "creative financing"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Creative Financing
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="mlsMotivatedSellerCheckbox"
                                    onChange={() =>
                                      handleMlsKeyword("motivated seller")
                                    }
                                    checked={mlsKeyword.includes(
                                      "motivated seller"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Motivated Seller
                                  </label>
                                </div>
                              </div> */}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="d-flex w-100 mt-3">
                    <button className="btn btn-reset_morefilter me-2 w-100">
                      Reset
                    </button>
                    <button className="btn btn-saveexit_morefilter  w-100">
                      Save/Exit
                    </button>
                  </div> */}
                </ul>
              </div>
              <div className="save-filter" onClick={handleSubmit}>
                {" "}
                {loadingSearch ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Search"
                )}
              </div>
              {isButtonVisible && (
                <div className="save-filter" onClick={handleSaveFilters}>
                  {" "}
                  {loadingSave ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    "Save Filter"
                  )}
                </div>
              )}
              <Modal
                show={showModal}
                onHide={handleClose}
                centered
                size="md"
                dialogClassName="right-side-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p className="send-heading">Save Filter</p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row mt-3">
                    <div className="col-12">
                      <p className="input-head">Write Filter name</p>
                      <input
                        className="send-input"
                        name="filterName"
                        required
                        value={formData.filterName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {isButtonVisibleFilter ? (
                    <div
                      className="send-offer-btn"
                      onClick={handleUpdateFilter}
                    >
                      {loadingSave ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Update Filter"
                      )}
                    </div>
                  ) : (
                    <div className="send-offer-btn" onClick={handleSaveFilter}>
                      {loadingSave ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Save Filter"
                      )}
                    </div>
                  )}
                  {/* <div className="send-offer-btn" onClick={handleSaveFilter}>
                    {loadingSave ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Save Filter"
                    )}
                  </div> */}
                </Modal.Body>
              </Modal>
              <Modal
                show={showModalOffer}
                onHide={handleClose}
                centered
                size="md"
                dialogClassName="right-side-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p className="send-heading">Send Multiple offers</p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Form>
                      <Form.Group controlId="dropdown">
                        <Form.Label>Select any Offer Template</Form.Label>
                        <Form.Control
                          as="select"
                          value={selectedValue}
                          onChange={handleSelect}
                        >
                          <option value="">Select...</option>
                          {data.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.template_name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  )}

                  <div
                    className="send-offer-btn"
                    onClick={() => handleSaveFilterOffer(selectedValue)}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Send Offer"
                    )}
                  </div>
                </Modal.Body>
              </Modal>
            </div>
            <div className="d-flex">
              <div className="dropdown">
                <div
                  className="dropdown-toggle saved-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="save-heart-icon"
                    src={saveheart}
                    alt="saveheart"
                  />
                  Saved
                </div>

                <ul className="dropdown-menu saved-dropmenu">
                  <p className="saved-btns" onClick={handleFavoritesClick}>
                    Favorites
                  </p>
                  <p className="saved-btns" onClick={handleOfferSent}>
                    Offer Sent
                  </p>
                  <p className="saved-btns">Cash Buyer</p>
                </ul>
              </div>
              {selectedProperties.length > 0 && (
                <div
                  className="saved-main-container-offer"
                  type="button"
                  aria-expanded="false"
                  onClick={() => handleSaveFiltersOffer()}
                >
                  <img className="save-heart-icon" src={email} alt="email" />
                  Send Offer
                </div>
              )}
              <div className="dropdown">
                <div
                  className="filter-flask"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaFilter />
                </div>
                <ul className="dropdown-menu">
                  {filters.length > 0 ? (
                    filters.map((filter) => (
                      <li key={filter.id}>
                        <a
                          className="dropdown-item filter_flask"
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
            </div>
            <div className="d-flex justify-content-center mt-4">
              {loader && <CircularProgress color="secondary" />}
            </div>
            {backArrow && (
              <div className="col-12">
                <button
                  className="back-arrow-btn1 mb-3"
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </button>
              </div>
            )}
            <div className="card-parent-container">
              {properties &&
                properties.map((property) => {
                  const hasMultiplePhotos =
                    property.alt_photos && property.alt_photos.length >= 1;

                  const address = property.location;
                  const isSaved = savedProperties.some(
                    (svProperty) => svProperty.property_id === property.id
                  );
                  const savedProperty = savedProperties.find(
                    (svProperty) => svProperty.property_id === property.id
                  );

                  const isSavedOffer = savedOfferSent.some(
                    (svPropertyOffer) =>
                      svPropertyOffer.property_id === property.id
                  );
                  const savedPropertyOffer = savedOfferSent.find(
                    (svPropertyOffer) =>
                      svPropertyOffer.property_id === property.id
                  );
                  return (
                    <div key={property.id}>
                      <div className="main-card-container">
                        {property.alt_photos.length === 1 ? (
                          <img
                            className="prop-img-single"
                            src={property.alt_photos[0] || "N/A"}
                            alt={`property-0`}
                          />
                        ) : property.alt_photos.length === 0 ? (
                          <div className="prop-img-single-background"></div>
                        ) : (
                          <Slider {...settings} className="">
                            {property.alt_photos.map((photo, index) => (
                              <div key={index}>
                                <img
                                  className="prop-img"
                                  src={photo || "N/A"}
                                  alt={`property-${index}`}
                                />
                              </div>
                            ))}
                          </Slider>
                        )}

                        <div className="d-flex flex-row justify-content-end p-2 order-container">
                          {/* <img
                              className="order"
                              src={order || "N/A"}
                              alt="order"
                            /> */}

                          <div className="d-flex flex-row">
                            {isSavedOffer ? (
                              <img
                                className="order"
                                src={sent_offer || "N/A"}
                                alt="offer"
                              />
                            ) : isPropertySelected(property.id) ? (
                              <img
                                className="order"
                                src={offeer || "N/A"}
                                alt="offer"
                                onClick={() => {
                                  handleRemoveProperty(property.id);
                                }}
                              />
                            ) : (
                              <img
                                className="order"
                                src={empty_mail || "N/A"}
                                alt="offer"
                                onClick={() => {
                                  handleAddProperty(property.id);
                                }}
                              />
                            )}
                            {isSaved ? (
                              <img
                                className="order"
                                src={fillheart || "N/A"}
                                alt="fillheart"
                                onClick={() =>
                                  handleFillHeartClick(
                                    savedProperty ? savedProperty.id : null
                                  )
                                }
                              />
                            ) : (
                              <img
                                className="order"
                                src={heart || "N/A"}
                                alt="heart"
                                onClick={() =>
                                  handleHeartClick(property.id, address)
                                }
                              />
                            )}
                            {/* {property.is_saved === "0" ? (
                              <img
                                className="order"
                                src={heart || "N/A"}
                                alt="heart"
                                onClick={() =>
                                  handleHeartClick(property.id, address)
                                }
                              />
                            ) : (
                              <img
                                className="order"
                                src={fillheart || "N/A"}
                                alt="fillheart"
                              />
                            )} */}
                          </div>
                        </div>
                        <div className="d-flex flex-row justify-content-between p-2 rate-container">
                          <div className="rate">
                            <span className="rate-text">
                              MI Rate:
                              {property.list_price ? (
                                <span
                                  title={
                                    (interestRate / 100) *
                                      property.list_price || "N/A"
                                  }
                                >
                                  {(interestRate / 100) * property.list_price ||
                                    "N/A"}
                                </span>
                              ) : null}
                            </span>
                          </div>
                          <div className="rate">
                            <span className="rate-text">
                              Spread: <span>{property.spread || "N/A"}</span>
                            </span>
                          </div>
                        </div>
                        <div
                          className="text-underline"
                          onClick={(e) =>
                            handleLinkClick(e, property, property.id)
                          }
                        >
                          <div className="card-content-container">
                            <div className="row">
                              <div className="col-7">
                                <p
                                  className="address-text location_property p-0 m-0"
                                  title={property.location || "N/A"}
                                >
                                  {property.location || "N/A"}
                                </p>
                              </div>
                              <div className="col-5">
                                <div className="row">
                                  <div className="col-5">
                                    <p className="prop-address-text">
                                      PI: <span>{property.pi || "N/A"}</span>
                                    </p>
                                  </div>
                                  <div className="col-7">
                                    <p className="prop-address-text">
                                      Taxes:{" "}
                                      <span>{property.taxes || "N/A"}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-7">
                                <p className="list-price-text">
                                  List Price:{" "}
                                  <span>${property.list_price || "N/A"}</span>
                                </p>
                              </div>
                              <div className="col-5">
                                <p className="prop-address-text">
                                  HOA: <span>{property.hoa || "N/A"}</span>
                                </p>
                              </div>
                            </div>
                            <div className="row align-items-center">
                              <div className="col border-right">
                                <p className="row-value">
                                  {property.beds || "N/A"}
                                </p>
                                <p className="row-text">Beds</p>
                              </div>
                              <div className="col border-right">
                                <p className="row-value">
                                  {property.full_baths || "N/A"}
                                </p>
                                <p className="row-text">Baths</p>
                              </div>
                              <div className="col border-right">
                                <p className="row-value">
                                  {property.sqft || "N/A"}
                                </p>
                                <p className="row-text">Sq Ft</p>
                              </div>
                              <div className="col border-right">
                                <p className="row-value">
                                  ${property.estimated_value || "N/A"}
                                </p>
                                <p className="row-text">Est. Value</p>
                              </div>
                              <div className="col">
                                <p className="row-value">
                                  {property.rentAmount || "N/A"}
                                </p>
                                <p className="row-text">Rent Rate</p>
                              </div>
                            </div>
                            <div className="d-flex flex-row justify-content-end">
                              {isSavedOffer && (
                                <p className="list-price-text">
                                  Offer Sent:{" "}
                                  <span>
                                    {savedPropertyOffer.offer_sent_date
                                      ? new Date(
                                          savedPropertyOffer.offer_sent_date
                                        ).toLocaleDateString("en-US", {
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : "N/A"}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {paginationLoading ? (
              <div className="d-flex justify-content-center mt-5">
                <CircularProgress /> {/* Loader */}
              </div>
            ) : (
              properties &&
              properties.length > 1 && (
                <div className="d-flex justify-content-center mt-5 ">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
}

export default Dashboard;
