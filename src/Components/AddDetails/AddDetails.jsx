import React, {useRef, useState, useEffect } from "react";
import "./adddetails.css";
import axios from "axios";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import Typewriter from "typewriter-effect";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Initialize Driver
gsap.registerPlugin(TextPlugin);
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function AddDetails({
  onNextStep,
  currentStep,
  setCurrentStep,
  setDays,
  setAdults,
  setChild,
  setDate,
  selectedPlaces,
  setSelectedPlaces,
  setSelectedHotels,
  setType,
  setItem,
  setPlace,
  deletedPlace,
  setDeletedPlace,
  setTotalVisitDuration,
  setTotalTime,
  selectedHotels,
  reset,
  setReset,
}) {
  const [anyhotels] = useState(["Any 5Star", "Any 4Star", "Any 3Star", "Any"]);
  const [data, setData] = useState([]);
  const [showPlaces, setShowPlaces] = useState(true);

  const [steps] = useState([
    "How many days of tour you are planning?",
    "Number of adults?",
    "Number of children?",
    "What will be the tour start date?",
    "Which place do you want to visit?",
    "Which hotel do you want?",
  ]);
  const [days, updateDays] = useState("");
  const [adults, updateAdults] = useState("");
  const [checkin, updateCheckin] = useState("");
  const [childCount, updateChildCount] = useState("");
  const [childrenAges, updateChildrenAges] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionDisabled, setRegionDisabled] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState([]);
  const [selectedTouristPlaceHotels, setSelectedTouristPlaceHotels] = useState(
    []
  );
  const [hoveredRegion, setHoveredRegion] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [midpointMarkers, setMidpointMarkers] = useState([]);

  // const driverInstanceRef = useRef(null);
 
  
  // Define the steps for the tour
  // const introSteps = [
  //   {
  //     element: "#days-input",
  //     popover: {
  //       title: "Enter Days",
  //       description: "Specify the number of days for your trip.",
  //       position: "bottom",
  //     },
  //   },
  //   {
  //     element: "#adults-input",
  //     popover: {
  //       title: "Number of Adults",
  //       description: "Enter the number of adults traveling.",
  //       position: "bottom",
  //     },
  //   },
  //   {
  //     element: "#child-count-input",
  //     popover: {
  //       title: "Number of Children",
  //       description: "Specify how many children are traveling.",
  //       position: "bottom",
  //     },
  //   },
  //   {
  //     element: "#checkin-input",
  //     popover: {
  //       title: "Check-in Date",
  //       description: "Select your check-in date.",
  //       position: "bottom",
  //     },
  //   },
  //   {
  //     element: ".region-img",
  //     popover: {
  //       title: "Select Region",
  //       description: "Choose the region for your trip.",
  //       position: "bottom",
  //     },
  //   },
  //   {
  //     element: ".hotels-row",
  //     popover: {
  //       title: "Select Region",
  //       description: "Choose the region for your trip.",
  //       position: "bottom",
  //     },
  //   },
    
  // ];

  // let tourstart = false;
  // // Function to initialize Driver.js and start the tour
  // const startTour = () => {
  //   tourstart = true;
  //   const driverInstance = new driver({
  //     showProgress: true,
  //     steps: introSteps,
  //     onNext: handleNext,
  //   });

  //   driverInstanceRef.current = driverInstance;
  //   driverInstance.drive();
  // };
  // // Handler for the next button click
  // const handleNext = (element) => {
  //   const currentStepIndex = driverInstanceRef.current.getCurrentStepIndex();
  //   if (currentStepIndex === introSteps.length - 1) {
  //     // If the current step is the last step in introSteps, update to additionalSteps
  //     driverInstanceRef.current.defineSteps(introSteps);
  //     driverInstanceRef.current.start();
  //   }
  // };
  // if(tourstart && currentStep < 7){
  //   currentStep ++;
  // }
  // useEffect(() => {
  //   startTour();
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/allplace");

        setData(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (region) => {
    setShowPlaces(false);
    if (region !== hoveredRegion) {
      setHoveredRegion(region);
    }
  };
  const handleMouseLeave = () => {
    // setShowPlaces(true);
    //   setHoveredRegion([]);
  };

  const clearRoutes = async () => {
    routes.forEach((routeControl) => {
      if (routeControl) {
        map.removeControl(routeControl);
      }
    });
    setRoutes([]);

    // Remove all midpoint markers
    midpointMarkers.forEach((marker) => {
      marker.remove();
    });
    setMidpointMarkers([]);
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setSelectedPlace(null);
    setRegionDisabled(true);
    setShowPlaces(true);
  };
  const clearMapState = () => {
    // Clear existing markers
    markers.forEach(({ marker, labelMarker }) => {
      marker.remove();
      labelMarker.remove();
    });
    setMarkers([]);

    // Clear existing routes
    clearRoutes();

    // Optionally, reset other map-related state variables
    // resetOtherMapStateVariables();
  };
  const changeRegion = () => {
    setSelectedRegion(null);
    setSelectedPlace(null);
    setRegionDisabled(false);
    setShowPlaces(true);
    setSelectedPlaces([]);
    setSelectedHotels([]);
    clearMapState();
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setShowPlaces(false);
  };
  useEffect(() => {
    gsap.from(`.left-div`, {
      x: -220,
      duration: 2,
    });
    gsap.to(".left-div", {
      x: 0,
      duration: 2,
    });
  }, []);
  useEffect(() => {
    // Animate the question text on currentStep change
    if (currentStep >= 1 && currentStep < steps.length) {
      gsap.from(".day-inp", {
        x: -280,
        duration: 0.3,
      });
      gsap.to(".day-inp", {
        x: 0,
        duration: 0.3,
      });

      gsap.from(".arrow-container", {
        x: 280,
        duration: 0.3,
      });
      gsap.to(".arrow-container", {
        x: 10,
        duration: 0.3,
      });
    }
  }, [currentStep, steps, selectedRegion]);

  useEffect(() => {
    // Animate the question text on currentStep change
    if (selectedRegion) {
      gsap.from(".selected-region-name", {
        x: 280,
        duration: 5,
      });
      gsap.to(".selected-region-name", {
        x: 10,
        duration: 5,
      });
    }
  }, [selectedRegion]);

  const handleNextStep = () => {
    if (currentStep === 0) {
      if (!days) {
        alert("Please enter the number of days.");
        return;
      }
      setDays(days);
      onNextStep(days);
    } else if (currentStep === 1) {
      if (!adults) {
        alert("Please enter the number of adults.");
        return;
      }
      setAdults(adults);
      onNextStep(adults);
    } else if (currentStep === 2) {
      if (childCount && childrenAges.some((age) => age === "")) {
        alert("Please enter the age for each child.");
        return;
      }
      if (isNaN(childCount) || childCount === 0) {
        setChild("", "");
        onNextStep();
      } else {
        setChild(childCount, childrenAges);
        onNextStep(childCount, childrenAges);
      }
    } else if (currentStep === 3) {
      if (!checkin) {
        alert("Please enter the date.");
        return;
      }
      setDate(checkin);
      onNextStep(checkin);
    }
  };

  const handleDragStart = (e, type, item, place) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("item", item);
    e.dataTransfer.setData("place", place);
  };
  const handleClick = (e, type, item, place) => {
    setType(type);
    setItem(item);
    setPlace(place);
  };
  // Function to format the duration
  const formatDuration = (hours) => {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} day${days > 1 ? "s" : ""}${
        remainingHours
          ? ` ${remainingHours} hr${remainingHours > 1 ? "s" : ""}`
          : ""
      }`;
    }
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  };

  const touristplacehandleDragStart = async (e, type, item, rdata) => {
    try {
      if (e.dataTransfer) {
        e.dataTransfer.setData("type", type);
        e.dataTransfer.setData("item", item);
      }

      if (
        rdata &&
        rdata.name &&
        rdata.hotels &&
        Array.isArray(rdata.hotels) &&
        e.dataTransfer
      ) {
        const coordinates = await getCoordinates(rdata.name);

        if (!map || !coordinates) {
          console.error(
            "Map or coordinates are not available:",
            map,
            coordinates
          );
          return;
        }

        // Check if the place already exists in the selected places
        const placeIndex = selectedTouristPlaceHotels.findIndex(
          (place) => place.name === rdata.name
        );

        // If the place already exists, remove its markers first
        if (placeIndex !== -1) {
          const existingMarkers = markers.filter(
            (markerObj) => markerObj.name === rdata.name
          );
          existingMarkers.forEach(({ marker, labelMarker }) => {
            marker.remove();
            labelMarker.remove();
          });

          setMarkers((prevMarkers) =>
            prevMarkers.filter((markerObj) => markerObj.name !== rdata.name)
          );
        }

        // Generate a label for the marker based on current number of markers
        const markerLabel = String.fromCharCode(
          "A".charCodeAt(0) + markers.length
        );

        // Add the marker with the default icon and bind popup
        const marker = L.marker([coordinates.lat, coordinates.lon])
          .addTo(map)
          .bindPopup(
            `${rdata.name}<br>Hotels: ${rdata.hotels.join(
              ", "
            )}<br>Visit Duration: ${formatDuration(rdata.visitduration || 0)}`
          );

        // Create a custom label divIcon for the marker label
        const labelIcon = L.divIcon({
          className: "custom-label-icon",
          html: `<div class="marker-label">${markerLabel}</div>`,
          iconSize: null, // Size will be determined by the content
        });

        // Add the label icon as a marker
        const labelMarker = L.marker([coordinates.lat, coordinates.lon], {
          icon: labelIcon,
        }).addTo(map);

        // Store both markers in state
        setMarkers((prevMarkers) => [
          ...prevMarkers,
          { marker, labelMarker, name: rdata.name },
        ]);

        // Update selected places state and total visit duration
        setSelectedTouristPlaceHotels((prevSelected) => {
          const placeExists = prevSelected.some(
            (place) => place.name === rdata.name
          );

          let updatedPlaces;
          if (!placeExists) {
            updatedPlaces = [
              ...prevSelected,
              {
                name: rdata.name,
                hotels: rdata.hotels,
                coordinates,
                visitDuration: rdata.visitduration,
              },
            ];
          } else {
            updatedPlaces = prevSelected.map((place) => {
              if (place.name === rdata.name) {
                const mergedHotels = [
                  ...new Set([...place.hotels, ...rdata.hotels]),
                ];
                return {
                  ...place,
                  hotels: mergedHotels,
                  coordinates,
                  visitDuration: rdata.visitduration,
                };
              } else {
                return place;
              }
            });
          }

          // Calculate the new total visit duration
          const newTotalVisitDuration = updatedPlaces.reduce(
            (total, place) => total + (place.visitDuration || 0),
            0
          );

          const days = Math.floor(newTotalVisitDuration / 24);
          const hours = newTotalVisitDuration % 24;
          setTotalVisitDuration({ days, hours });

          return updatedPlaces;
        });

        // Clear and redraw routes for all selected places
        clearRoutes();
        const allPlaces = [
          ...selectedTouristPlaceHotels,
          { name: rdata.name, coordinates },
        ];
        for (let i = 0; i < allPlaces.length - 1; i++) {
          drawRoute(allPlaces[i].coordinates, allPlaces[i + 1].coordinates);
        }
      }
    } catch (error) {
      console.error("Error handling drag start event:", error);
    }
  };

  useEffect(() => {
    if (map) {
      return;
    }

    const initializeMap = async () => {
      try {
        const mapInstance = L.map("map").setView([51.505, -0.09], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance);

        setMap(mapInstance);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();
  }, [map]);

  const getCoordinates = async (placeName) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        placeName
      )}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { lat, lon };
    } else {
      throw new Error("Place not found");
    }
  };

  const handleDeletePlace = async (deletedPlaceName) => {
    try {
      // Remove the deleted place from selected places state
      const updatedPlaces = selectedTouristPlaceHotels.filter(
        (place) => place.name !== deletedPlaceName
      );
      setSelectedTouristPlaceHotels(updatedPlaces);

      // Calculate the new total visit duration in hours
      const newTotalVisitDurationHours = updatedPlaces.reduce(
        (total, place) => total + (place.visitDuration || 0),
        0
      );
      // Convert total visit duration to days and hours
      const days = Math.floor(newTotalVisitDurationHours / 24);
      const hours = newTotalVisitDurationHours % 24;
      const totalVisitDurationInDays = `${days} days ${hours} hrs`;

      // Set the total visit duration
      setTotalVisitDuration(totalVisitDurationInDays);

      // Remove the corresponding markers from markers state and map
      const markersToRemove = markers.filter(
        (markerObj) => markerObj.name === deletedPlaceName
      );

      markersToRemove.forEach(({ marker, labelMarker }) => {
        marker.remove();
        labelMarker.remove();
      });

      // Update state with markers that are not removed
      const updatedMarkers = markers.filter(
        (markerObj) => !markersToRemove.includes(markerObj)
      );
      setMarkers(updatedMarkers);

      // Clear existing routes completely
      clearRoutes();

      // Redraw routes between remaining places
      for (let i = 0; i < updatedPlaces.length - 1; i++) {
        try {
          drawRoute(
            updatedPlaces[i].coordinates,
            updatedPlaces[i + 1].coordinates
          );
        } catch (error) {
          console.error("Error drawing route:", error);
        }
      }
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };
  useEffect(() => {
    if (deletedPlace) {
      handleDeletePlace(deletedPlace);
      setDeletedPlace(""); // Reset deletedPlace after handling
    }
  }, [deletedPlace]);

  const clicking = async (e, type, item, rdata) => {
    console.log("item", rdata.name);
    try {
      setItem(item);
      setType(type);

      let coordinates;
      if (!selectedPlaces.includes(rdata.name)) {
        setSelectedPlaces((prevPlaces) => [...prevPlaces, item]);

        coordinates = await getCoordinates(rdata.name);
      } else {
        return;
      }

      if (!map || !coordinates) {
        console.error(
          "Map or coordinates are not available:",
          map,
          coordinates
        );
        return;
      }

      // Check if the place already exists in the selected places
      const placeIndex = selectedTouristPlaceHotels.findIndex(
        (place) => place.name === rdata.name
      );

      // If the place already exists, remove its markers first
      if (placeIndex !== -1) {
        const existingMarkers = markers.filter(
          (markerObj) => markerObj.name === rdata.name
        );
        existingMarkers.forEach(({ marker, labelMarker }) => {
          marker.remove();
          labelMarker.remove();
        });

        setMarkers((prevMarkers) =>
          prevMarkers.filter((markerObj) => markerObj.name !== rdata.name)
        );
      }

      // Generate a label for the marker based on current number of markers
      const markerLabel = String.fromCharCode(
        "A".charCodeAt(0) + markers.length
      );

      // Add the marker with the default icon and bind popup
      const marker = L.marker([coordinates.lat, coordinates.lon])
        .addTo(map)
        .bindPopup(
          `${rdata.name}<br>Hotels: ${rdata.hotels.join(
            ", "
          )}<br>Visit Duration: ${formatDuration(rdata.visitduration || 0)}`
        );

      // Create a custom label divIcon for the marker label
      const labelIcon = L.divIcon({
        className: "custom-label-icon",
        html: `<div class="marker-label">${markerLabel}</div>`,
        iconSize: null, // Size will be determined by the content
      });

      // Add the label icon as a marker
      const labelMarker = L.marker([coordinates.lat, coordinates.lon], {
        icon: labelIcon,
      }).addTo(map);

      // Store both markers in state
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { marker, labelMarker, name: rdata.name },
      ]);

      // Update selected places state and total visit duration
      setSelectedTouristPlaceHotels((prevSelected) => {
        const placeExists = prevSelected.some(
          (place) => place.name === rdata.name
        );

        let updatedPlaces;
        if (!placeExists) {
          updatedPlaces = [
            ...prevSelected,
            {
              name: rdata.name,
              hotels: rdata.hotels,
              coordinates,
              visitDuration: rdata.visitduration,
            },
          ];
        } else {
          updatedPlaces = prevSelected.map((place) => {
            if (place.name === rdata.name) {
              const mergedHotels = [
                ...new Set([...place.hotels, ...rdata.hotels]),
              ];
              return {
                ...place,
                hotels: mergedHotels,
                coordinates,
                visitDuration: rdata.visitduration,
              };
            } else {
              return place;
            }
          });
        }

        // Calculate the new total visit duration
        const newTotalVisitDuration = updatedPlaces.reduce(
          (total, place) => total + (place.visitDuration || 0),
          0
        );

        const days = Math.floor(newTotalVisitDuration / 24);
        const hours = newTotalVisitDuration % 24;

        setTotalVisitDuration({ days, hours });

        return updatedPlaces;
      });

      // Clear and redraw routes for all selected places
      clearRoutes();
      const allPlaces = [
        ...selectedTouristPlaceHotels,
        { name: rdata.name, coordinates },
      ];
      for (let i = 0; i < allPlaces.length - 1; i++) {
        drawRoute(allPlaces[i].coordinates, allPlaces[i + 1].coordinates);
      }
    } catch (error) {
      console.error("Error handling clicking event:", error);
    }
  };

  // Function to draw a route between two coordinates
  const drawRoute = async (start, end) => {
    try {
      if (!map || !L.Routing) {
        console.error("Map or L.Routing is not available:", map, L.Routing);
        return;
      }

      const routeControl = L.Routing.control({
        waypoints: [L.latLng(start.lat, start.lon), L.latLng(end.lat, end.lon)],
        createMarker: function () {
          return null;
        }, // Prevent additional markers
        addWaypoints: false,
        routeWhileDragging: false,
        showAlternatives: false,
        show: false,
        lineOptions: {
          styles: [
            {
              color: "blue",
              opacity: 0.6,
              weight: 6,
            },
          ],
        },
      }).addTo(map);

      routeControl.on("routesfound", function (e) {
        const routes = e.routes;
        if (routes.length > 0) {
          const route = routes[0];
          const totalDistance = route.summary.totalDistance / 1000; // Convert to kilometers
          const totalTime = route.summary.totalTime / 3600; // Convert to hours

          // Calculate the midpoint index of the route
          const midpointIndex = Math.floor(route.coordinates.length / 2);
          const midpointCoords = route.coordinates[midpointIndex];

          // Display the total distance and time
          const distanceLabel = `${totalDistance.toFixed(2)} KMS`;
          const timeLabel = `${totalTime.toFixed(2)} HRS`;

          // Create a custom label divIcon for the total distance and time
          const distanceIcon = L.divIcon({
            className: "distance-label",
            html: `<div className="distance-time-label">${distanceLabel}<br>${timeLabel}</div>`,
            iconSize: null, // Size will be determined by the content
          });

          // Add a marker at the midpoint with the distance and time details as popup
          const midpointMarker = L.marker(
            [midpointCoords.lat, midpointCoords.lng],
            {
              icon: distanceIcon,
            }
          )
            .addTo(map)
            .bindPopup(`${distanceLabel}<br>${timeLabel}`)
            .openPopup(); // Open popup by default

          // Store the midpoint marker to remove it later
          setMidpointMarkers((prevMarkers) => [...prevMarkers, midpointMarker]);
        }
      });

      // Handle routing errors
      routeControl.on("routingerror", function (error) {
        console.error("Routing error:", error);
        if (error.error && error.error.status === -1) {
          // Retry the routing request after a delay
          setTimeout(() => {
            drawRoute(start, end);
          }, 1000); // Retry after 1 second (adjust as needed)
        } else {
          // Handle other routing errors
          console.error("Other routing error:", error);
        }
      });

      // Store the route control to be able to clear it later
      setRoutes((prevRoutes) => [...prevRoutes, routeControl]);
    } catch (error) {
      console.error("Error drawing route:", error);
    }
  };

  useEffect(() => {
    const filterHotels = () => {
      const filteredHotels = selectedTouristPlaceHotels.filter((touristPlace) =>
        selectedPlaces.includes(touristPlace.name)
      );
      if (
        JSON.stringify(filteredHotels) !==
        JSON.stringify(selectedTouristPlaceHotels)
      ) {
        setSelectedTouristPlaceHotels(filteredHotels);
      }
    };

    filterHotels();
  }, [selectedPlaces]);

  const handleDays = (e) => {
    const count = parseInt(e.target.value);
    if (count >= 1) {
      updateDays(count);
    }
  };

  const handleAdultsCount = (e) => {
    const count = parseInt(e.target.value);
    if (count >= 1) {
      updateAdults(count);
    }
  };
  const handleChildCountChange = (e) => {
    const count = parseInt(e.target.value);
    if (count >= 0 && count <= 5) {
      updateChildCount(count);
      updateChildrenAges(Array.from({ length: count }, () => ""));
    }
  };

  const handleChildAgeChange = (index, value) => {
    const age = parseInt(value);

    if (!isNaN(age) && age >= 1 && age <= 11) {
      const newAges = [...childrenAges];
      newAges[index] = age;
      updateChildrenAges(newAges);
    }
  };

  const backbtn = () => {
    setShowPlaces(true);
  };

  const backtoplaces = () => {
    setShowPlaces(false);
    if (!selectedPlace) {
      setShowPlaces(true);
    }
    setCurrentStep(4);
  };
  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  const handleCheckinChange = (value) => {
    const tomorrowDate = new Date(getTomorrowDate());
    const enteredDate = new Date(value);

    if (enteredDate < tomorrowDate) {
      alert("Please enter a date that is tomorrow or later.");
      updateCheckin(getTomorrowDate());
    } else {
      updateCheckin(value);
    }
  };

  const NUM_COLUMNS = 3;

  return (
    <div className="left-div">
      <div id="map">
        {selectedPlaces && selectedPlaces.length > 0 && (
          <div className="show-name-container">
            <ol>
              {selectedPlaces.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="questionnaire">
        {currentStep === 0 && (
          <h2>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pauseFor(0.1)
                  .typeString("Make Your Custom Package")
                  .start();
              }}
              options={{
                delay: 60,
              }}
            />
          </h2>
        )}
        {currentStep === 0 && (
          <div className="day-inp">
            <p className="questions">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(0.1)
                    .typeString(steps[currentStep])
                    .start();
                }}
                options={{
                  delay: 30,
                }}
              />
            </p>
            <input
              id="days-input"
              type="number"
              value={days}
              onChange={handleDays}
              placeholder="Enter number of days"
            />
            <div className="arrow-container">
              <button className="arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button className="next-text" onClick={handleNextStep}>
                Next
              </button>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="day-inp">
            <p className="questions">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(100)
                    .typeString(steps[currentStep])
                    .start();
                }}
                options={{
                  delay: 30,
                }}
              />
            </p>
            <input
              id="adults-input"
              type="number"
              value={adults}
              onChange={handleAdultsCount}
              placeholder="Enter number of adults..."
              min="1"
            />
            <div className="arrow-container">
              <button className="arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button className="next-text" onClick={handleNextStep}>
                Next
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="day-inp">
            <p className="questions">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(100)
                    .typeString(steps[currentStep])
                    .start();
                }}
                options={{
                  delay: 30,
                }}
              />
            </p>
            <input
              id="child-count-input"
              type="number"
              value={childCount}
              onChange={handleChildCountChange}
              placeholder="Enter number of children..."
            />

            <div className="child-age">
              {Array.from({ length: childCount }, (_, index) => (
                <div key={index}>
                  <input
                    id="childs-age-input"
                    type="number"
                    value={childrenAges[index]}
                    onChange={(e) =>
                      handleChildAgeChange(index, e.target.value)
                    }
                    placeholder={`Enter age of child ${index + 1}...`}
                    style={{ marginRight: "5px" }}
                  />
                  {childrenAges[index] && (
                    <span style={{ color: "white" }}>yrs</span>
                  )}
                </div>
              ))}
            </div>

            <div className="arrow-container">
              <button className="arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button className="next-text" onClick={handleNextStep}>
                Next
              </button>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="day-inp">
            <p className="questions">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(100)
                    .typeString(steps[currentStep])
                    .start();
                }}
                options={{
                  delay: 30,
                }}
              />
            </p>
            <input
              id="adults-input"
              type="date"
              value={checkin}
              onChange={(e) => handleCheckinChange(e.target.value)}
              placeholder="Enter checkin date..."
              min={getTomorrowDate()}
            />
            <div className="arrow-container">
              <button className="arrow">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button className="next-text" onClick={handleNextStep}>
                Next
              </button>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <p className="questions1">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(100)
                    .typeString(steps[currentStep])
                    .start();
                }}
                options={{
                  delay: 30,
                }}
              />
            </p>
            {!selectedRegion ? (
              <div className="places-row">
                {data.map((region, index) => (
                  <div
                    className={`region-img ${
                      selectedRegion && regionDisabled ? "region-disabled" : ""
                    }`}
                    key={index}
                    id="place-drag"
                    onClick={() => handleRegionClick(region)}
                    onMouseEnter={() => handleMouseEnter(region)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span>{region.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="selected-region-name">
                You are seeing the places in {selectedRegion.name}
              </p>
            )}

            {selectedRegion && (
              <div className="reset-region">
                <strong>If you want to choose another region not this </strong>
                <button className="region-btn" onClick={changeRegion}>
                  Click here
                </button>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {!showPlaces && (
                <div className="arrow-container">
                  <button className="arrow">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <button className="next-text" onClick={backbtn}>
                    Back
                  </button>
                </div>
              )}
              <div className="arrow-container">
                <button className="arrow">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button className="next-text" onClick={onNextStep}>
                  Next
                </button>
              </div>
            </div>

            {!showPlaces && !selectedRegion && (
              <div className="places-listing-card">
                {hoveredRegion && (
                  <table>
                    <tbody>
                      {Array.from({
                        length: Math.ceil(
                          hoveredRegion.places.length / NUM_COLUMNS
                        ),
                      }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          {Array.from({ length: NUM_COLUMNS }).map(
                            (_, colIndex) => {
                              // Flatten and sort the places alphabetically
                              const sortedPlaces = hoveredRegion.places
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name));
                              const placeIndex =
                                rowIndex * NUM_COLUMNS + colIndex;
                              const place = sortedPlaces[placeIndex];
                              const className =
                                placeIndex % 2 === 0 ? "blue-text" : "red-text"; // Alternate classes
                              return (
                                <td
                                  key={colIndex}
                                  className={`places-listing ${className}`}
                                >
                                  {place ? place.name : ""}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {selectedRegion && (
              <div className="places">
                {showPlaces &&
                  selectedRegion.places.map((place, index) => (
                    <div
                      className="places-img"
                      key={index}
                      id="place-drag"
                      onClick={() => handlePlaceClick(place)}
                    >
                      <span>{place.name}</span>
                    </div>
                  ))}

                {!showPlaces &&
                  selectedPlace &&
                  selectedPlace.touristPlaces && (
                    <div className="tourist-places">
                      {selectedPlace.touristPlaces.map(
                        (touristPlace, index) => (
                          <div
                            className="places-img"
                            key={index}
                            id="place-drag"
                            draggable
                            onDragStart={(e) =>
                              touristplacehandleDragStart(
                                e,
                                "place",
                                touristPlace.name,
                                touristPlace
                              )
                            }
                          >
                            <span>{touristPlace.name}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                {!showPlaces &&
                  selectedPlace &&
                  selectedPlace.touristPlaces && (
                    <div className="tourist-places-res">
                      {selectedPlace.touristPlaces.map(
                        (touristPlace, index) => (
                          <div
                            className="places-img"
                            key={index}
                            id="place-drag"
                            onClick={(e) => {
                              clicking(
                                e,
                                "place",
                                touristPlace.name,
                                touristPlace
                              );
                            }}
                          >
                            <span>{touristPlace.name}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
        {currentStep === 5 && (
          <div className="myclass">
            <p className="questions1">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(100)
                    .typeString(steps[currentStep])
                    .start();
                }}
                options={{
                  delay: 30,
                }}
              />
            </p>

            <div>
              <div className="arrow-container1">
                <button className="arrow">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button className="next-text" onClick={backtoplaces}>
                  Back
                </button>
              </div>
            </div>

            <div className="hotels-row">
              {selectedTouristPlaceHotels.length > 0 ? (
                <div className="anyhotel-row">
                  {anyhotels.map((anyhotel, index) => (
                    <div
                      className="any-hotel-img"
                      key={index}
                      id="hotel-drag"
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, "anyhotels", anyhotel)
                      }
                    >
                      <span>{anyhotel}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <h3 className="place-not-selected">
                  You have not chosen a place please go back and select a place
                </h3>
              )}

              {selectedTouristPlaceHotels.length > 0 ? (
                <div className="anyhotel-row-res">
                  {anyhotels.map((anyhotel, index) => (
                    <div
                      className="any-hotel-img-res"
                      key={index}
                      id="hotel-drag"
                      onClick={(e) => handleClick(e, "anyhotels", anyhotel)}
                    >
                      <span>{anyhotel}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <h3 className="place-not-selected-res">
                  You have not chosen a place please go back and select a place
                </h3>
              )}

              {selectedTouristPlaceHotels.length > 0 && (
                <div className="choose-from-below">
                  <p style={{ width: "100%" }}>OR Choose From Below</p>
                </div>
              )}

              {selectedTouristPlaceHotels.map((place, placeIndex) => (
                <div key={placeIndex} className="tourist-place-section">
                  <h5>{place.name}</h5>
                  <div className="hotels-row">
                    {place.hotels.map((hotel, hotelIndex) => (
                      <div
                        className="hotel-img"
                        key={`${placeIndex}-${hotelIndex}`}
                        id="place-drag"
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, "hotel", hotel, place.name)
                        }
                        title={hotel.length > 8 ? hotel : ""}
                      >
                        <span>
                          {hotel.length > 8 ? `${hotel.slice(0, 5)}...` : hotel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selectedTouristPlaceHotels.map((place, placeIndex) => (
                <div key={placeIndex} className="tourist-place-section-res">
                  <h5>{place.name}</h5>
                  <div className="hotels-row-res">
                    {place.hotels.map((hotel, hotelIndex) => (
                      <div
                        className="hotel-img-res"
                        key={`${placeIndex}-${hotelIndex}`}
                        id="place-drag"
                        onClick={(e) =>
                          handleClick(e, "hotel", hotel, place.name)
                        }
                        title={hotel.length > 8 ? hotel : ""}
                      >
                        <span>
                          {hotel.length > 8 ? `${hotel.slice(0, 5)}...` : hotel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddDetails;
