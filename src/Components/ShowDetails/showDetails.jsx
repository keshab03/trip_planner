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
    const headerImage =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAFmBe4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKSjdRuoAMUVyvjL4meH/A1u0uralDa4/hZhn8q+ePGX/BQbwdoFw8GnQNqciHB2vtz9DWM61OHxM9HD5disV/Cg2fWP5UV8H3H/AAU7t45GWPwjJIB0P2gVF/w8+jx/yJsuf+vkVz/XKP8AMep/q7mX/Ps+9cUYr4K/4efR4/5E2XP/AF8ij/h59Hj/AJE2XP8A18ij65R/mH/q7mX/AD7PvXFGK+Cv+Hn0eP8AkTZc/wDXyKP+Hn0eP+RNlz/18ij65R/mD/V3Mv8An2feuKMV8Ff8PPo8f8ibLn/r5FH/AA8+jx/yJsuf+vkUfXKP8wf6u5l/z7PvXFGK+Cv+Hn0eP+RNlz/18ij/AIefR4/5E2XP/XyKPrlH+YP9Xcy/59n3rijFfBX/AA8+jx/yJsuf+vkUf8PPo8f8ibLn/r5FH1yj/MH+ruZf8+z71xRivgr/AIefR4/5E2XP/XyKP+Hn0eP+RNlz/wBfIo+uUf5g/wBXcy/59n3rijFfBX/Dz6PH/Imy5/6+RR/w8+jx/wAibLn/AK+RR9co/wAwf6u5l/z7PvXFGK+Cv+Hn0eP+RNlz/wBfIo/4efR4/wCRNlz/ANfIo+uUf5g/1czL/n2feuKMV8Ff8PPo8f8AImy5/wCvkUf8PPo8f8ibLn/r5FH1yj/ML/V3Mv8An2feuKMV8Ff8PPo8f8ibLn/r5FH/AA8+jx/yJsuf+vkUfXKP8w/9Xcy/59n3rijFfBX/AA8+jx/yJsuf+vkUf8PPo8f8ibLn/r5FH1yj/MH+ruZf8+z71xRivgr/AIefR4/5E2XP/XyKP+Hn0eP+RNlz/wBfIo+uUf5g/wBXcy/59n3rijFfBX/Dz6PH/Imy5/6+RR/w8+jx/wAibLn/AK+RR9co/wAwf6u5l/z7PvXFGK+Cv+Hn0eP+RNlz/wBfIo/4efxhf+RMl/8AAkUfXKP8wv8AV3Mv+fZ960n518JWv/BTm2kdRN4RkiTPLfaRx+leneB/29vBHiiaOG8b+zpW42swPb8KtYqk3ZM56mRZhSXNKmz6gyKWsLwx400bxfarcaXfw3akZ/dtk1ubq6k09UeJKMoPlkrMWikzRTJFooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkNLSUAJnrzmvnT9p79qjTvg7pTWNg6XetzZVY1IOz3PPpmvQPj58V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NQ/8DYqP+Htvhr/oSNQ/8DYq9+/4YR+CP/QkWf8A303+NH/DCPwR/wChIs/++m/xo5MX/Mg+scP/APPmX3ngP/D23w1/0JGof+BsVH/D23w1/wBCRqH/AIGxV79/wwj8Ef8AoSLP/vpv8aP+GEfgj/0JFn/303+NHJi/5kH1jh//AJ8y+88B/wCHtvhr/oSNQ/8AA2Kj/h7b4a/6EjUP/A2Kvfv+GEfgj/0JFn/303+NH/DCPwR/6Eiz/wC+m/xo5MX/ADIPrHD/APz5l954D/w9t8Nf9CRqH/gbFR/w9t8Nf9CRqH/gbFXv3/DCPwR/6Eiz/wC+m/xo/wCGEfgj/wBCRZ/99N/jRyYv+ZB9Y4f/AOfMvvPAf+Htvhr/AKEjUP8AwNio/wCHtvhr/oSNQ/8AA2Kvfv8AhhH4I/8AQkWf/fTf40f8MI/BH/oSLP8A76b/ABo5MX/Mg+scP/8APmX3ngP/AA9t8Nf9CRqH/gbFR/w9t8Nf9CRqH/gbFXv3/DCPwR/6Eiz/AO+m/wAaP+GEfgj/ANCRZ/8AfTf40cmL/mQfWOH/APnzL7zwH/h7b4a/6EjUP/A2Kj/h7b4a/wChI1D/AMDYq9+/4YR+CP8A0JFn/wB9N/jR/wAMI/BH/oSLP/vpv8aOTF/zIPrHD/8Az5l954D/AMPbfDX/AEJGof8AgbFR/wAPbfDX/Qkah/4GxV79/wAMI/BH/oSLP/vpv8aP+GEfgj/0JFn/AN9N/jRyYv8AmQfWOH/+fMvvPAf+Htvhr/oSNQ/8DYqP+Htvhr/oSNQ/8DYq9+/4YR+CP/QkWf8A303+NH/DCPwR/wChIs/++m/xo5MX/Mg+scP/APPmX3ngP/D23w1/0JGof+BsVIf+Ctvhr/oSNQ/8DYq9/wD+GEfgj/0JFn/303+NH/DCPwS7eCLQf8Cb/GlyYv8AmQfWOH/+fMvvNv8AZz/aU0b9ovQZ9R0qxmsPJ4eOZ1Y/mK9j9K4/4c/CPwr8J9PksvC2kQ6TbSfeWHPNdhXdDm5VzbnymKlRlVbw6tHpcWiiitDlCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k="; // Replace with your base64 image string
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
