import api from "./apiClient";

export async function getCamerasOnPath(startAddress: string, endAddress: string) {
  const response = await api.get("/cameras/onpath", {
    params: { start_address: startAddress, end_address: endAddress },
  });
  return response.data;
}

export async function getCameraWeather(cameraGeom: string) {
  const response = await api.get(`/cameras/weather/${encodeURIComponent(cameraGeom)}`);
  return response.data;
}