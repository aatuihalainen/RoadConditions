import React, { useState } from "react";
import { getCamerasOnPath, getCameraWeather } from "../api/cameras";
import { formatData } from "../utils/formatData";
import "../css/cameraWeather.css"
import { getWarnings } from "../utils/getWarnings";
import { getBallColor } from "../utils/getWarnings";

interface Camera {
  id: string;
  geom: string;
  camera_name?: string;
}


const CameraWeather: React.FC = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [openStation, setOpenStation] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setData([]);

      const cameras: Camera[] = await getCamerasOnPath(start, end);

      const weatherPromises = cameras.map(async (camera) => {
        const weather = await getCameraWeather(camera.geom);
        return { ...camera, weather };
      });
      
      const camerasWithWeather = await Promise.all(weatherPromises);
      setData(camerasWithWeather);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="camera-weather-container">
      <div className="search-container">
        <input
          placeholder="Lähtöpiste"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          placeholder="Määränpää"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      
      {data && data.length > 0 &&(
        <div className="timeline-container">
        <div className="timeline-line"></div>
          <div className="station-item station-item-start-end">
            <div className="timeline-ball timeline-ball-start-end"></div>
            <div className="station-content">
              <h3>LÄHTÖ: {start.toUpperCase()}</h3>
            </div>
          </div>
        
        <div className="stations">
          {data
          .sort((a, b) => a.distance_along_route - b.distance_along_route)
          .map((camera, idx) => {
            const formatted = formatData(camera);
            const warnings = getWarnings(formatted);
            const isOpen = openStation === idx;

            return (
              <div key={idx} className="station-item">
                <div className="timeline-ball" style={{backgroundColor:getBallColor(warnings)}}></div>
                <div className="timeline-distance">{formatted.distance_along_route} Km</div>

                <div className="station-content">
                  <h3
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenStation(isOpen ? null : idx)
                    }
                  >
                    {formatted.name ?? formatted.id}
                  </h3>

                  {camera.weather && isOpen && (
                    <div className="weather-details">
                      <p><strong>Air Temperature:</strong> {formatted.weather[0].air_temp_c} °C</p>
                      <p><strong>Road Temperature:</strong> {formatted.weather[0].road_temp_c} °C</p>
                      <p><strong>Avg Wind Speed:</strong> {formatted.weather[0].avg_wind_ms} m/s</p>
                      <p><strong>Rain state:</strong> {formatted.weather[0].rain_state}</p>
                      <p><strong>Rain amount:</strong> {formatted.weather[0].rain_mm_per_h} mm/h</p>
                      <p><strong>Visibility:</strong> {formatted.weather[0].visibility_km} km</p>
                      <p><strong>Salt Amount:</strong> {formatted.weather[0].salt_amount_gm2} g/m²</p>
                      <p><strong>Water on road:</strong> {formatted.weather[0].water_on_road_mm} mm</p>
                      <p><strong>Snow on road:</strong> {formatted.weather[0].snow_on_road_mm} mm</p>
                      <p><strong>Ice on road:</strong> {formatted.weather[0].ice_on_road_mm} mm</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="station-item station-item-start-end">
            <div className="timeline-ball timeline-ball-start-end"></div>
            <div className="station-content">
              <h3>KOHDE: {end.toUpperCase()}</h3>
            </div>
          </div>
      </div>
      )}

    </div>
  );
};

export default CameraWeather;


