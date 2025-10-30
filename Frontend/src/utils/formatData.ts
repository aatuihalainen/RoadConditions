interface WeatherData{
    air_temp_c?: number | null;
    road_temp_c?: number | null;
    avg_wind_ms?: number | null;
    rain_state?: number | null;
    rain_mm_per_h?: number | null;
    rain_type?: number | null;
    visibility_km?: number | null;
    salt_amoung_gm2?: number | null;
    water_on_road_mm?: number | null;
    snow_on_road_mm?: number | null;
    ice_on_road_mm?: number | null;
}

interface Camera{
    id: number;
    camera_name: string;
    geom: string;
    weather: WeatherData[];
}

function formatRainState(state: number){
    switch (state){
        case 0:
            return "Poutaa";
        case 1:
            return "Heikkoa sadetta";
        case 2:
            return "Kohtalaista sadetta";
        case 3:
            return "Rankkaa sadetta";
    }
}

function formatRainType(type: number){
     switch (type){
        case 0:
            return "vesi";
        case 1:
            return "lumi";
        case 2:
            return "räntä";
        case 3:
            return "rae";
    }
}

function formatCameraName(name: string): string {
  let count = 0;
  name = name.toUpperCase();
  return name.replace(/_/g, (match) => {
    count++;
    if (count === 1) return " "; 
    if (count === 2) return ", ";
    return " ";                     
  });
}

export const formatData = (camera: any) => {
    const formattedData =
        camera.weather?.map((w: any) => ({
            air_temp_c: w.air_temp_c != null ? w.air_temp_c.toFixed(1): "-",
            road_temp_c: w.road_temp_c != null ? w.road_temp_c.toFixed(1): "-",
            avg_wind_ms: w.avg_wind_ms != null ? w.avg_wind_ms.toFixed(1): "-",
            rain_state: w.rain_state != null ? formatRainState(w.rain_state): "-",
            rain_mm_per_h: w.rain_mm_per_h != null ? w.rain_mm_per_h.toFixed(1): "-",
            rain_type: w.rain_type != null ? formatRainType(w.rain_type): "-",
            visibility_km: w.visibility_km != null ? w.avg_wind_ms.toFixed(1) : "-",
            salt_amoung_gm2: w.salt_amoung_gm2 != null ? w.salt_amoung_gm2.toFixed(2): "-",
            water_on_road_mm: w.water_on_road_mm != null ? w.water_on_road_mm.toFixed(2): "-",
            snow_on_road_mm: w.snow_on_road_mm  != null ? w.snow_on_road_mm.toFixed(2): "-",
            ice_on_road_mm: w.ice_on_road_mm != null ? w.ice_on_road_mm.toFixed(2): "-"
        })) ?? [];

    return {
        id: camera.id,
        name: formatCameraName(camera.camera_name),
        geom: camera.geom,
        weather: formattedData,
    };
};
