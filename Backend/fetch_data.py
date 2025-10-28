import requests
from db_connection import get_connection

def fetch_station_data():
    url ="https://tie.digitraffic.fi/api/weather/v1/stations"
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        conn = get_connection()
        cur = conn.cursor()

        for feature in data["features"]:
            station_id = feature["id"]
            station_name = feature["properties"]["name"]
            lon, lat, _ = feature["geometry"]["coordinates"]

            cur.execute("""
                INSERT INTO stations (id, name, geom)
                VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
            """, (station_id, station_name, lon, lat))
            
        conn.commit()
        cur.close()
        conn.close()

def fetch_camera_data():
    url ="https://tie.digitraffic.fi/api/weathercam/v1/stations"
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        conn = get_connection()
        cur = conn.cursor()

        for camera in data["features"]:
            camera_id = camera["id"]
            lon, lat, _ = camera["geometry"]["coordinates"]
            camera_name = camera["properties"]["name"]
            preset_id = camera["properties"]["presets"][0]["id"]

            cur.execute("""
                INSERT INTO cameras (camera_id, preset_id, camera_name, geom)
                VALUES (%s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
            """, (camera_id, preset_id, camera_name, lon, lat))
            
        conn.commit()
        cur.close()
        conn.close()


def fetch_weather_data():
    url = "https://tie.digitraffic.fi/api/weather/v1/stations/data"
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        conn = get_connection()
        cur = conn.cursor()
        wanted_sensors = [1, 3, 16, 22, 23, 25, 26, 52, 177, 178, 179]

        for station in data["stations"]:
            station_id = station["id"] 
            filtered_sensors = [s for s in station["sensorValues"] if s["id"] in wanted_sensors]
            values = {s["id"]: s["value"] for s in filtered_sensors}
            
            cur.execute("""
                INSERT INTO weather_data (station_id, air_temp_c, road_temp_c, avg_wind_ms, rain_state, rain_mm_per_h, rain_type, visibility_km, salt_amount_gm2, water_on_road_mm, snow_on_road_mm, ice_on_road_mm)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (station_id, values.get(1), values.get(3), values.get(16), values.get(22), values.get(23), values.get(25), values.get(26), values.get(52), values.get(177), values.get(178), values.get(179)))
        
        conn.commit()
        cur.close()
        conn.close()


