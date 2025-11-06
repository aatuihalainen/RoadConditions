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
  let [start, setStart] = useState("");
  let [end, setEnd] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  let [error, setError] = useState<string | null>(null);

  const [openStation, setOpenStation] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setData([]);
      setError(null)

      start = start.replace(/([a-zA-Z])(\d)|(\d)([a-zA-Z])/g, '$1$3 $2$4') + " finland"
      end = end.replace(/([a-zA-Z])(\d)|(\d)([a-zA-Z])/g, '$1$3 $2$4') + " finland"

      const cameras: Camera[] = await getCamerasOnPath(start, end);

      const weatherPromises = cameras.map(async (camera) => {
        const weather = await getCameraWeather(camera.geom);
        return { ...camera, weather };
      });
      
      const camerasWithWeather = await Promise.all(weatherPromises);
      setData(camerasWithWeather);
    } catch (err) {
      setError("Reitiltäsi ei löytynyt yhtään kelikameraa. Kokeile tarkentaa hakua tai kokeile toista reittiä.")
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
          {loading ? "Haetaan..." : "Hae"}
        </button>
      </div>
      
      {error && <p className="error-message">{error}</p>}

      {data && data.length > 0 &&(
        <div className="timeline-container">
        <div className="timeline-line"></div>
          <div className="station-item station-item-start-end">
            <div className="timeline-ball timeline-ball-start-end"></div>
            <div className="station-content">
              <h3>LÄHTÖ: {start.replace(/([a-zA-Z])(\d)|(\d)([a-zA-Z])/g, '$1$3 $2$4').toUpperCase()}</h3>
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
              <div key={idx} className="station-item" 
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenStation(isOpen ? null : idx)
                    }>
                <div className="timeline-ball" style={{backgroundColor:getBallColor(warnings)}}></div>
                <div className="timeline-distance">{formatted.distance_along_route} Km</div>

                <div className="station-content">
                  <h3>
                    {formatted.name ?? formatted.id}
                  </h3>
                  {warnings.map((warning) => {
                    return <ul><li className="warning" style={{color: warning.severity == 1 ? "#c5ad23ff" :
                       warning.severity == 2 ? "#f4420b" : "white"}}
                       >{warning.name} : {warning.warningText}</li></ul>
                  })}

                  {camera.weather && isOpen && (
                    <div className="station-details">
                      <div className="weather-details">
                        <h4>Sääolosuhteet</h4>
                        <p><strong>Ilman lämpötila:</strong> {formatted.weather[0].air_temp_c} °C</p>
                        <p><strong>Tienpinnan lämpötila:</strong> {formatted.weather[0].road_temp_c} °C</p>
                        <p><strong>Tuulen keskinopeus:</strong> {formatted.weather[0].avg_wind_ms} m/s</p>
                        <p><strong>Näkyvyys:</strong> {formatted.weather[0].visibility_km} km</p>
                        <p><strong>Sadetilanne:</strong> {formatted.weather[0].rain_state}</p>
                        <p><strong>Sadekertymä:</strong> {formatted.weather[0].rain_mm_per_h} mm/h</p>
                        <p><strong>Vettä tienpinnalla:</strong> {formatted.weather[0].water_on_road_mm} mm</p>
                        <p><strong>Jäätä tienpinnalla:</strong> {formatted.weather[0].ice_on_road_mm} mm</p>
                        <p><strong>Lunta tienpinnalla:</strong> {formatted.weather[0].snow_on_road_mm} mm</p>
                        <p><strong>Suolan määrä tienpinnalla:</strong> {formatted.weather[0].salt_amount_gm2} g/m²</p>
                      </div>
                      <div className="weather-camera">
                        <img src={isOpen ? "https://weathercam.digitraffic.fi/" + formatted.preset + ".jpg" : undefined} loading="lazy" alt="Kelikamerakuva"/>
                      </div>
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
              <h3>KOHDE: {end.replace(/([a-zA-Z])(\d)|(\d)([a-zA-Z])/g, '$1$3 $2$4').toUpperCase()}</h3>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default CameraWeather;


