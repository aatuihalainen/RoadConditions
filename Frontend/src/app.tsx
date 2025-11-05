import React from "react";
import CameraWeather from "./components/cameraWeather";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="main-heading">
        Kelikamerat Ja Säätiedot Reitilläsi
      </h1>
      <CameraWeather />
    </div>
  );
};

export default App;