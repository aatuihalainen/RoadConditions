import React, { useState } from "react";
import { getCamerasOnPath, getCameraWeather } from "../api/cameras";

interface Camera {
  id: string;
  geom: string;
  name?: string;
}

const CameraWeather: React.FC = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="p-4 space-y-4">
      <div>
        <input
          className="border p-2 mr-2"
          placeholder="Start address"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="End address"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>


      {data.map((camera, idx) => (
        <div key={idx} className="border p-2 rounded shadow">
          <h3 className="font-semibold">{camera.camera_name ?? camera.camera_id}</h3>
          {camera.weather && (
            <div className="mt-2 text-sm">
              <p><strong>Air Temperature:</strong> {camera.weather[0].air_temp_c ?? "N/A"}</p>
              <p><strong>Avg Wind Speed:</strong> {camera.weather[0].avg_wind_ms ?? "N/A"}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CameraWeather;