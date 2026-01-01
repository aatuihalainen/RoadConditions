import React from "react";
import CameraWeather from "./components/cameraWeather";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="main-heading">
        Tarkista tieolosuhteet reitilläsi
      </h1>
      <CameraWeather />
    </div>
  );
};

export default App;