import React, { useState } from "react";
import AddDetails from "./Components/AddDetails/AddDetails";
import ShowDetails from "./Components/ShowDetails/showDetails";

import "./Components/ShowDetails/showdetails.css";

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [days, setDays] = useState("");
  const [adults, setAdults] = useState("");
  const [child, setChild] = useState("");
  const [date, setDate] = useState("");
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [reset, setReset] = useState(false);
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [place, setPlace] = useState("");
  const [deletedPlace, setDeletedPlace] = useState("");
  const [totalVisitDuration, setTotalVisitDuration] = useState({ days: 0, hours: 0 });
  


  const handleNextStep = (answer, answer1) => {
    if (currentStep === 0) {
      setDays(answer);
    } else if (currentStep === 1) {
      setAdults(answer);
    } else if (currentStep === 2 && answer) {
      const formattedAges = answer1.map((age) => `${age} yrs`);
      setChild("Child: " + answer + " Age of: " + formattedAges);
    } else if (currentStep === 3) {
      setDate(answer.split("-").reverse().join("/"));
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const resetSteps = (step) => {
    if (step === 0) {
      setDays("");
    } else if (step === 1) {
      setAdults("");
    } else if (step === 2) {
      setChild("");
    } else if (step === 3) {
      setDate("");
    } else if (step === 4) {
      setSelectedPlaces([]);
    } else if (step === 5) {
      setSelectedHotels([]);
    } else {
      setDays("");
      setAdults("");
      setChild("");
      setDate("");
      setSelectedPlaces([]);
      setSelectedHotels([]);
      setCurrentStep(0);
      setReset(true);
      return;
    }
    setCurrentStep(step);
  };

  return (
    <div className="App">
      <AddDetails
        className="adddetails"
        onNextStep={handleNextStep}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setDays={setDays}
        setAdults={setAdults}
        setChild={setChild}
        setDate={setDate}
        selectedPlaces={selectedPlaces}
        setSelectedPlaces={setSelectedPlaces}
        setSelectedHotels={setSelectedHotels}
        selectedHotels={selectedHotels}
        reset={reset}
        setReset={setReset}
        setItem={setItem}
        setType={setType}
        setPlace={setPlace}
        deletedPlace={deletedPlace}
        setDeletedPlace={setDeletedPlace}
        setTotalVisitDuration={setTotalVisitDuration}
      />
      <ShowDetails
        days={days}
        adults={adults}
        child={child}
        date={date}
        currentStep={currentStep}
        selectedPlaces={selectedPlaces}
        selectedHotels={selectedHotels}
        resetSteps={resetSteps}
        setSelectedPlaces={setSelectedPlaces}
        setSelectedHotels={setSelectedHotels}
        setCurrentStep={setCurrentStep}
        item={item}
        type={type}
        place={place}
        setDeletedPlace={setDeletedPlace}
        totalVisitDuration={totalVisitDuration}
      />
    </div>
  );
}

export default App;
