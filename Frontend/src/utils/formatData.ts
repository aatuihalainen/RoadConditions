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
    distance_along_route: number;
    weather: WeatherData[];
}

function formatRainState(state: number, type: number){
    switch (state){
        case 0:
            return "Poutaa";
        case 1:
            return "Heikkoa " + formatRainType(type) + "sadetta";         
        case 2:
            return "Kohtalaista " + formatRainType(type) + "sadetta";
        case 3:
            return "Rankkaa " + formatRainType(type) + "sadetta";
        default:
            return "-";
    }
}

function formatRainType(type: number){
     switch (type){
        case 10:
            return "vesi";
        case 9:
            return "tihku";
        case 8:
            return "lumi";
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
            rain_state: w.rain_state != null ? formatRainState(Math.round(w.rain_state), Math.round(w.rain_type)): "-",
            rain_mm_per_h: w.rain_mm_per_h != null ? w.rain_mm_per_h.toFixed(1): "-",
            visibility_km: w.visibility_km != null ? w.visibility_km.toFixed(1) : "-",
            salt_amount_gm2: w.salt_amoung_gm2 != null ? w.salt_amoung_gm2.toFixed(2): "-",
            water_on_road_mm: w.water_on_road_mm != null ? w.water_on_road_mm.toFixed(2): "-",
            snow_on_road_mm: w.snow_on_road_mm  != null ? w.snow_on_road_mm.toFixed(2): "-",
            ice_on_road_mm: w.ice_on_road_mm != null ? w.ice_on_road_mm.toFixed(2): "-"
        })) ?? [];
        
    return {
        id: camera.id,
        name: formatCameraName(camera.camera_name),
        geom: camera.geom,
        preset: camera.preset_id,
        distance_along_route: Math.round(camera.distance_along_route / 1000),
        weather: formattedData,
    };
};
