import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Slider from "react-slick";
import leftarrow from "../../../assets/dashboard/left-arrow.png";
import rightarrow from "../../../assets/dashboard/right-arrow.png";
import "../pages/propertyDetail.css";

function ImageModal({ show, handleClose, property }) {
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
    if (!property || !property.alt_photos || property.alt_photos.length === 0) {
        return null;
    }
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                centered
                size="lg"
            // dialogClassName="right-side-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p className="modal-address-text">
                            {property && `${property.location}`}
                        </p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {property.alt_photos.length === 1 ? (
                        <img
                            className="modal-img"
                            src={property.alt_photos[0] || "N/A"}
                            alt={`property-0`}
                        />
                    ) : (
                        <Slider {...settings} className="">
                            {property.alt_photos.map((photo, index) => (
                                <div key={index}>
                                    <img
                                        className="modal-img"
                                        src={photo || "N/A"}
                                        alt={`property-${index}`}
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ImageModal;
