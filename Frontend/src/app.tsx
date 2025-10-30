import React from "react";
import CameraWeather from "./components/cameraWeather";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1 className="text-2xl font-bold text-center my-4">
        Cameras and Weather on Path
      </h1>
      <CameraWeather />
    </div>
  );
};

export default App;