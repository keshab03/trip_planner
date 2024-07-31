import React, { useState, useEffect } from "react";
import "./showdetails.css";
import jsPDF from "jspdf";
import drag from "../../images/drag & drop.png";
import Typewriter from "typewriter-effect";
import Modal from "../Modal/Modal";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

function ShowDetails({
  days,
  adults,
  child,
  date,
  currentStep,
  selectedPlaces = [],
  selectedHotels = [],
  resetSteps,
  setSelectedPlaces,
  setSelectedHotels,
  setCurrentStep,
  type,
  item,
  place,
  setDeletedPlace,
  totalVisitDuration,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [anyHotelSelected, setAnyHotelSelected] = useState(false);
  const [hotelSelected, setHotelSelected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [prevPlaces, setPrevPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState("");

  const showModal = (title, message) => {
    console.log("Function called");
    setModalContent({ title, message });
    setModalVisible(true);
  };

  useEffect(() => {
    if (type === "anyhotels") {
      if (
        !anyHotelSelected &&
        !hotelSelected &&
        (!selectedHotels[place] || !selectedHotels[place].includes(item))
      ) {
        setSelectedHotels((prevHotels) => ({
          ...prevHotels,
          [place]: [...(prevHotels[place] || []), item],
        }));
        setAnyHotelSelected(true);
      } else if (anyHotelSelected) {
        showModal(
          "Selection Error",
          "You are not allowed to select multiple any type hotels"
        );
      } else if (hotelSelected) {
        showModal(
          "Selection Error",
          "You are not allowed to select any type hotels along with hotels"
        );
      }
    } else if (type === "hotel") {
      if (
        !anyHotelSelected &&
        (!selectedHotels[place] || !selectedHotels[place].includes(item))
      ) {
        setSelectedHotels((prevHotels) => ({
          ...prevHotels,
          [place]: [...(prevHotels[place] || []), item],
        }));
        setHotelSelected(true);
      } else if (anyHotelSelected) {
        showModal(
          "Selection Error",
          "You are not allowed to select hotels along with any hotels"
        );
      }
    } else if (type === "place") {
      if (!selectedPlaces.includes(item)) {
        setSelectedPlaces((prevPlaces) => [...prevPlaces, item]);
      }
    }
  }, [type, item, place]);

  const handleDrop = (e) => {
    const type = e.dataTransfer.getData("type");
    const item = e.dataTransfer.getData("item");
    const place = e.dataTransfer.getData("place");

    if (type === "anyhotels") {
      if (
        !anyHotelSelected &&
        !hotelSelected &&
        (!selectedHotels[place] || !selectedHotels[place].includes(item))
      ) {
        setSelectedHotels((prevHotels) => ({
          ...prevHotels,
          [place]: [...(prevHotels[place] || []), item],
        }));
        setAnyHotelSelected(true);
      } else if (anyHotelSelected) {
        showModal(
          "Selection Error",
          "You are not allowed to select multiple any type hotels"
        );
      } else if (hotelSelected) {
        showModal(
          "Selection Error",
          "You are not allowed to select any type hotels along with hotels"
        );
      }
    } else if (type === "hotel") {
      if (
        !anyHotelSelected &&
        (!selectedHotels[place] || !selectedHotels[place].includes(item))
      ) {
        setSelectedHotels((prevHotels) => ({
          ...prevHotels,
          [place]: [...(prevHotels[place] || []), item],
        }));
        setHotelSelected(true);
      } else if (anyHotelSelected) {
        showModal(
          "Selection Error",
          "You are not allowed to select hotels along with any hotels"
        );
      }
    } else if (type === "place") {
      if (!selectedPlaces.includes(item)) {
        setSelectedPlaces((prevPlaces) => [...prevPlaces, item]);
      }
    }
  };

  useEffect(() => {
    if (selectedPlaces.length > prevPlaces.length) {
      const newlyAddedPlace = selectedPlaces[selectedPlaces.length - 1];
      setNewPlace(newlyAddedPlace);
    }
    setPrevPlaces(selectedPlaces);
  }, []);

  useEffect(() => {
    gsap.from(".empty-right-div", {
      y: 280,
      duration: 2,
    });
    gsap.to(".empty-right-div", {
      x: 2,
      duration: 2,
    });
  }, []);

  useEffect(() => {
    if (days || date || adults || child || selectedPlaces) {
      gsap.from(".card", {
        x: 280,
        duration: 3,
      });
      gsap.to(".card", {
        x: 10,
        duration: 3,
      });
    }
  }, [days, date, adults, child, selectedPlaces]);

  useEffect(() => {
    if (selectedHotels.length) {
      gsap.from(".hotel-card-content", {
        x: -280,
        duration: 5,
      });
      gsap.to(".hotel-card-content", {
        x: 10,
        duration: 5,
      });
    }
  }, [selectedHotels]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (days <= totalVisitDuration.days && totalVisitDuration.hours >= 0) {
      console.log("Submit clicked");
      showModal(
        "Are you sure to confirm your trip?",
        `You are planning for ${days} ${
          days === 1 ? "day" : "days"
        }, but the recommended total visit time is ${totalVisitDuration.days} ${
          totalVisitDuration.days === 1 ? "day" : "days"
        }${
          totalVisitDuration.hours > 0
            ? ` and ${totalVisitDuration.hours} hours`
            : ""
        }.`
      );
    } else {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4"); // Portrait orientation
  
    const startX = 10;
    const valueX = 120; // Column alignment for values
    const startY = 10;
    let currentY = startY;
  
    // Define border color and width
    const borderColor = [148, 41, 41]; // border color in RGB
    const borderWidth = 0.5; // Width of the border
    const borderMargin = 5; // Margin inside the border
  
    doc.setLineWidth(borderWidth);
    doc.setDrawColor(...borderColor); // Set the color to red
    const pageWidth1 = doc.internal.pageSize.getWidth();
    const pageHeight1 = doc.internal.pageSize.getHeight();
    doc.rect(borderMargin, borderMargin, pageWidth1 - 2 * borderMargin, pageHeight1 - 2 * borderMargin); // Adjusted for margins
  
    // Add Header Image
    const headerImage = "Trip Details"
  const imgWidth = 180;  // Adjust width as needed
    const imgHeight = 40; // Adjust height as needed
    doc.addImage(headerImage, "jpeg", startX, currentY, imgWidth, imgHeight);
  
    currentY += imgHeight + 5; // Move down after image
  
    // Add Line Separator
    doc.setLineWidth(0.5);
    doc.line(startX, currentY, 200 - borderMargin, currentY); // Adjusted for border
    currentY += 10;
  
    // Add Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
  
    const addDetailLine = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, startX, currentY);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value, 70); // Adjust the width as necessary
      const valueY = currentY;
      lines.forEach((line, index) => {
        doc.text(line, valueX, valueY + index * 10);
      });
      currentY += lines.length * 10; // Adjust line height as needed
    };
  
    addDetailLine("No. of Days", String(days));
    addDetailLine("Adults", String(adults));
  
    // Handle child ages
    if (child) {
      const childAgesFormatted = `${String(child)} yrs`;
      addDetailLine("Child Age(s)", childAgesFormatted);
    } else {
      addDetailLine("Child", "0");
    }
  
    addDetailLine("Travel Start Date", String(date));
    addDetailLine("Places", selectedPlaces.join(", "));
  
    // Add hotels section
    if (Object.keys(selectedHotels).length > 0) {
      currentY += 10; // Add some space before hotels
  
      // Iterate over each place in selectedHotels
      Object.keys(selectedHotels).forEach((place) => {
        const hotels = selectedHotels[place].join(", ");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Hotels in ${place}:`, startX, currentY);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(hotels, 70); // Adjust the width as necessary
        const valueY = currentY;
        lines.forEach((line, index) => {
          doc.text(line, valueX, valueY + index * 10);
        });
        currentY += lines.length * 10; // Adjust line height as needed
      });
    }
  
    // Add the centered text with sky blue color
    const textColor = [15, 97, 180]; // Sky blue color in RGB
    doc.setTextColor(...textColor); // Set text color to sky blue
    doc.setFontSize(12); // Adjust font size as needed
    doc.setFont("helvetica", "bold");
  
    const pageWidth = Math.floor(doc.internal.pageSize.getWidth());

    const pageHeight = doc.internal.pageSize.getHeight();

    // Center the first line of text within the border
    const firstLineText = "Contact for picTOURnic exclusive curated \n“Domestic and International” Package Tours";
    const firstLineWidth = pageWidth-80;
    const firstLineX = (pageWidth - firstLineWidth) / 2; // Centered within the page
    const firstLineY = currentY + 20; // Adjust vertical position as needed
    
    doc.text(firstLineText, firstLineX, firstLineY);
  
    // Center the second line of text within the border
    const secondLineText = "Offering customized Tours.\nBest in Class Quality Service with comparatively guaranteed lower Prices.";
    doc.setFontSize(12); // Adjust font size as needed
    const secondLineWidth =pageWidth-80;
    const secondLineX = (pageWidth - secondLineWidth) / 2; // Centered within the page
    const secondLineY = firstLineY + 20; // Adjust vertical position as needed
  
    doc.text(secondLineText, secondLineX, secondLineY);
  
    doc.setTextColor(0, 0, 0);
    // Add Footer with Timestamp
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = currentDate.getFullYear();
    const formattedDate = `${day} / ${month} / ${year}`;
    const formattedTime = currentDate.toLocaleTimeString();
    const footerText = `Created on ${formattedDate} at ${formattedTime}`;
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(footerText, startX, pageHeight - 20); // Adjust position for footer
  
    // Page number (if you have multiple pages, you may need to adjust this)
    doc.text(`Page 1 of 1`, startX, pageHeight - 10); // Adjust position for page number
  
    doc.save("selected_hotels_places.pdf");
    setModalOpen(false);
  };
  
  
  
  

  const resetForm = () => {
    resetSteps();
    setModalOpen(false);
    window.location.reload();
  };

  const deleteDays = () => {
    resetSteps(0);
  };

  const deleteAdults = () => {
    resetSteps(1);
  };

  const deleteChild = () => {
    resetSteps(2);
  };

  const deleteDate = () => {
    resetSteps(3);
  };

  const deletePlace = (place) => {
    setDeletedPlace(place);
    setSelectedPlaces((prevPlaces) => {
      const updatedPlaces = prevPlaces.filter((p) => p !== place);
      return updatedPlaces;
    });
    setSelectedHotels((prevHotels) => {
      const updatedHotels = { ...prevHotels };
      delete updatedHotels[place];
      return updatedHotels;
    });
    setAnyHotelSelected(false);
    setHotelSelected(false);
    setCurrentStep(4);
  };

  const deleteHotel = (hotel, place) => {
    setSelectedHotels((prevHotels) => {
      const updatedHotels = {
        ...prevHotels,
        [place]: prevHotels[place].filter((h) => h !== hotel),
      };
      // Check if the updated hotels for the place are empty and delete the place if so
      if (updatedHotels[place].length === 0) {
        delete updatedHotels[place];
      }
      return updatedHotels;
    });
    setAnyHotelSelected(false); // Reset anyHotelSelected state
    setHotelSelected(false); // Reset hotelSelected state
    setCurrentStep(5); // Assuming 5 is the step for managing hotel selection
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    setModalOpen(false);
  };

  return (
    <div className={!days && !adults && !date ? 'right-div1' : 'right-div'}>
   
      {!days && !adults && !date ? (
        <div className="empty-right-div">
          <p>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(1000)
                  .typeString("Your Itineraries will be shown here")
                  .start();
              }}
              options={{
                delay: 30,
              }}
            />
          </p>
        </div>
      ) : (
        <div className="right">
          {/* <div
            className={`drag-place ${
              currentStep !== 4 && currentStep !== 5 ? "drag-disabled" : ""
            }`}
          > */}
            <div
            className='drag-place'
          >
            <strong style={{ textDecoration: "underline" }}>
              Drag & Drop Your Hotels & Places
            </strong>
            <div
              className="drag"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="basket">
                <div className="object"></div>
              </div>
            </div>
          </div>

          <div className="selected">
            <Modal
              show={modalVisible}
              title={modalContent.title}
              message={modalContent.message}
              onClose={() => setModalVisible(false)}
            />
            <div className="cards">
              {days && (
                <div className="card" title={`Days: ${days}`}>
                  <div className="card-content">
                    <span className="card-title">{days}</span>
                  </div>
                  <sup className="delete-icon" onClick={deleteDays}>
                    X
                  </sup>
                </div>
              )}
              {adults && (
                <div className="card" title={`Adults: ${adults}`}>
                  <div className="card-content">
                    <span className="card-title">{adults}</span>
                  </div>
                  <sup className="delete-icon" onClick={deleteAdults}>
                    X
                  </sup>
                </div>
              )}
              {child && (
                <div className="card" title={`Child: ${child}`}>
                  <div className="card-content">
                    <span className="card-title">{child}</span>
                  </div>
                  <sup className="delete-icon" onClick={deleteChild}>
                    X
                  </sup>
                </div>
              )}
              {date && (
                <div className="card" title={`Traveling Dates: ${date}`}>
                  <div className="card-content">
                    <span className="card-title">{date}</span>
                  </div>
                  <sup className="delete-icon" onClick={deleteDate}>
                    X
                  </sup>
                </div>
              )}
              {Array.isArray(selectedPlaces) &&
                selectedPlaces.length > 0 &&
                selectedPlaces.map((place, index) => (
                  <div className="card" title={`Place: ${place}`} key={index}>
                    <div className="card-content">
                      <p className="card-title">{place}</p>
                    </div>
                    <sup
                      className="delete-icon"
                      onClick={() => deletePlace(place)}
                    >
                      X
                    </sup>
                  </div>
                ))}

              {Object.keys(selectedHotels).length > 0 &&
                Object.keys(selectedHotels).map((place, index) => (
                  <div
                    className="hotel-card-container"
                    title={`Hotels in ${place}`}
                    key={index}
                  >
                    <div className="hotel-card-content">
                      {selectedHotels[place].map((hotel, idx) => (
                        <div key={idx} className="hotel-card">
                          <span>{hotel}</span>
                          <sup
                            className="delete-icon"
                            onClick={() => deleteHotel(hotel, place)}
                          >
                            X
                          </sup>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* {days && ( */}
            <h4 className="typeing-box-heading">Your Itineraries</h4>
            <div
              className={`typeing-box ${
                currentStep !== 4 && currentStep !== 5 ? "typeing-box1" : ""
              }`}
            >
              <div className="typeing-box-content">
                {days && (
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .pauseFor(1000)
                        .typeString(
                          `<span class="text-small">No. of Day</span> <span class="text-large day-text"><span class="text-small">:</span>${days}</span>`
                        )
                        .start();
                    }}
                    options={{
                      delay: 30,
                    }}
                  />
                )}
                {adults && (
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .pauseFor(1000)
                        .typeString(
                          `<span class="text-small">Adults</span> <span class="text-large adult-text"><span class="text-small">:</span>${adults}</span>`
                        )
                        .start();
                    }}
                    options={{
                      delay: 30,
                    }}
                  />
                )}
                {child && (
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .pauseFor(1000)
                        .typeString(
                          `<span class="text-small">No. of Child</span> <span class="text-large child-text"><span class="text-small">:</span>${child}</span>`
                        )
                        .start();
                    }}
                    options={{
                      delay: 30,
                    }}
                  />
                )}
                {date && (
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .pauseFor(1000)
                        .typeString(
                          `<span class="text-small">Travel Start Date</span> <span class="text-large date-text"> <span class="text-small">:</span>${date}</span>`
                        )
                        .start();
                    }}
                    options={{
                      delay: 30,
                    }}
                  />
                )}
                {selectedPlaces.length > 0 && (
                  <>
                    <span className="text-small">Places you have chosen:</span>
                    <span className="text-large">
                      {selectedPlaces.join(" , ")}
                    </span>
                    <Typewriter
                      options={{
                        strings: `<span class="text-large">${newPlace}</span>`,
                        autoStart: true,
                        delay: 30,
                        loop: false,
                      }}
                    />
                  </>
                )}
                {selectedHotels && Object.keys(selectedHotels).length > 0 && (
                  <Typewriter
                    options={{
                      strings: `<span class="text-small">Hotels you have chosen:</span> <span class="text-large">${Object.values(
                        selectedHotels
                      )
                        .flat()
                        .join(", ")}</span>`,
                      autoStart: true,
                      delay: 30,
                      loop: false,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {days && adults && date && (
        <button id="submit-button" className="submitbtn" onClick={handleSubmit}>
          Submit
        </button>
      )}
      {modalOpen && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <div className="modal-content" id="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">YOUR ITERNARY. Please Verify</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <ul>
                  <ol>
                    {days && (
                      <li>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Days:</span> {days}
                      </li>
                    )}
                    {adults && (
                      <li>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Adults:</span>{" "}
                        {adults}
                      </li>
                    )}
                    {child && (
                      <li>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Child:</span>{" "}
                        {child}
                      </li>
                    )}
                    {date && (
                      <li>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Date:</span> {date}
                      </li>
                    )}

                    {selectedHotels.length > 0 && (
                      <li>
                        {" "}
                        <span style={{ fontWeight: "bold" }}>Hotels:</span>{" "}
                        {selectedHotels.join(", ")}
                      </li>
                    )}
                    {selectedPlaces.length > 0 && (
                      <li>
                        <span style={{ fontWeight: "bold" }}>Places:</span>{" "}
                        {selectedPlaces.join(", ")}
                      </li>
                    )}
                  </ol>
                </ul>
                <strong>* Breakfast Provided</strong>
              </div>
              {days &&
              selectedPlaces.length > 0 &&
              selectedHotels &&
              Object.keys(selectedHotels).length > 0 ? (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="modal-btn"
                    onClick={generatePDF}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="modal-btn1"
                    onClick={resetForm}
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <span style={{ fontWeight: "bold" }}>
                  {days && adults && date && selectedPlaces.length === 0 ? (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStepChange(4)}
                    >
                      * Please choose Places. click here
                    </span>
                  ) : days &&
                    adults &&
                    date &&
                    selectedPlaces.length > 0 &&
                    Object.keys(selectedHotels).length === 0 ? (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStepChange(5)}
                    >
                      * Please choose Hotels. click here
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowDetails;
