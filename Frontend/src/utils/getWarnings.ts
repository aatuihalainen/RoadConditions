const today: Date = new Date();
const year = today.getFullYear();
const winterStart = new Date(year, 10, 1);
const WinterEnd = new Date(year, 3, 30);

interface Warning {
  name: string;
  severity: 1 | 2;
  warningText: string;
}

function checkRoadTemp(roadTemp: any, warnings: Warning[]){
    if (roadTemp < 0 && (today < winterStart && today > WinterEnd )){
        warnings.push({name: "Jäätymisvaroitus", severity: 2, warningText: "Tienpinnan lämpötila nollan alapuolella"});
    }

    else if (roadTemp < 2 && (today < winterStart && today > WinterEnd )){
        warnings.push({name: "Jäätymisvaroitus", severity: 1, warningText: "Tienpinnan lämpötila alle 2 astetta"});
    }
}

function checkAvGWind(avgWind: any, warnings: Warning[]){
    if (avgWind > 10){
        warnings.push({name: "Tuulivaroitus", severity: 2, warningText: "Tuulen keskinopeus yli 10m/s"});
    }

    else if(avgWind > 5){
        warnings.push({name: "Tuulivaroitus", severity: 1, warningText: "Tuulen keskinopeus yli 5m/s"});
    }
}

function checkVisibility(visibility: any, warnings: Warning[]){
    if (visibility <= 0.2){
        warnings.push({name: "Näkyvyysvaroitus", severity: 2, warningText: "Näkyvyys alle 200m"});
    }

    else if(visibility <= 0.5){
        warnings.push({name: "Näkyvyysvaroitus", severity: 1, warningText: "Näkyvyys alle 500m"});
    }
}

function checkWaterOnRoad(waterOnRoad: any, warnings: Warning[]){
    if (waterOnRoad > 2){
        warnings.push({name: "Vesivaroitus", severity: 2, warningText: "Tienpinnalla vettä yli 2mm"});
    }
    
    else if (waterOnRoad > 1){
        warnings.push({name: "Vesivaroitus", severity: 1, warningText: "Tienpinnalla vettä yli 1mm"});
    }
}

function checkSnowOnRoad(snowOnRoad: any, warnings: Warning[]){
    if (snowOnRoad > 100){
        warnings.push({name: "Lumivaroitus", severity: 2, warningText: "Lumen syvyys tienpinnalla yli 10cm"});
    }

    else if(snowOnRoad > 50){
        warnings.push({name: "Lumivaroitus", severity: 1, warningText: "Lumen syvyys tienpinnalla yli 5cm"});
    }
}

function checkIceOnRoad(iceOnRoad: any, warnings: Warning[]){
    if (iceOnRoad > 0 && (today < winterStart && today > WinterEnd)){
        warnings.push({name: "Jäävaroitus", severity: 2, warningText: "Tienpinnalla on jäätä"});
    }
}

function checkAirTemp(air_temp_c: any, warnings: Warning[]){
    if (air_temp_c < -30){
        warnings.push({name: "Pakkasvaroitus", severity: 2, warningText: "Ilman lämpötila alle -30 astetta"});
    }

    else if(air_temp_c < -25){
        warnings.push({name: "Pakkasvaroitus", severity: 1, warningText: "Ilman lämpötila alle -25 astetta"});
    }
}

export const getWarnings = (data: any): Warning[] => {
    let warnings: Warning[] = [];
    const weather = data.weather[0];
    weather.air_temp_c != null && checkAirTemp(weather.air_temp_c, warnings);
    weather?.road_temp_c != null && checkRoadTemp(weather.road_temp_c, warnings);
    weather?.avg_wind_ms != null && checkAvGWind(weather.avg_wind_ms, warnings);
    weather?.visibility_km != null && checkVisibility(weather.visibility_km, warnings);
    weather?.water_on_road_mm != null && checkWaterOnRoad(weather.water_on_road_mm, warnings);
    weather?.snow_on_road_mm != null && checkSnowOnRoad(weather.snow_on_road_mm, warnings);
    weather?.ice_on_road_mm != null && checkIceOnRoad(weather.ice_on_road_mm, warnings);
    return warnings;
};

export const getBallColor = (warnings: Warning[]) => {
    if (warnings.length == 0){
        return "#139649ff"
    }

    else if (warnings.length >= 3){
        return "#f4420b"
    }

    else if(warnings.some(warning => warning.severity == 2)){
        return "#f4420b"
    }

    else {
        return "#c5ad23ff"
    }

}