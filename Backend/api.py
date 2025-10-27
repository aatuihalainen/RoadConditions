import psycopg2
import requests
from fastapi import FastAPI, Query
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor
from db_connection import get_connection
from urllib.parse import quote
from shapely.geometry import LineString

app = FastAPI(title="Road Conditions API")

@app.get("/stations")
def  get_all_stations():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM stations ORDER BY id")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if len(rows) == 0:
        return {"message": f"No stations found"}

    return rows

@app.get("/stations/{station_id}")
def get_station(station_id : int):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM stations WHERE id = %s;", (station_id, ))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if len(rows) == 0:
        return {"message": f"No station found with id {station_id}"}

    return rows

@app.get("/stations/{station_id}/weather")
def get_station_weather(station_id : int):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM weather_data WHERE station_id = %s;", (station_id, ))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if len(rows) == 0:
        return {"message": f"No station or weather data found"}

    return rows


@app.get("/stations/find/onpath")
def get_stations_on_path(
    start_address: str = Query(),
    end_address: str = Query(),
):
    formatted_start_address = quote(start_address)
    formatted_end_address = quote(end_address)

    start_address_coordinates_url = "https://nominatim.openstreetmap.org/search?q=" + formatted_start_address + "&format=json"
    end_address_coordinates_url = "https://nominatim.openstreetmap.org/search?q=" + formatted_end_address + "&format=json"

    headers = {"User-Agent": "RoadConditons"}

    response = requests.get(start_address_coordinates_url, headers=headers)
    start_address_response = response.json()
    if len(start_address_response) != 0:
        start_coordinates = f"{start_address_response[0]["lon"]},{start_address_response[0]["lat"]}"

    response = requests.get(end_address_coordinates_url, headers=headers)
    end_address_response = response.json()
    if len(start_address_response) != 0:
        end_coordinates = f"{end_address_response[0]["lon"]},{end_address_response[0]["lat"]}"

    route_url = f"http://router.project-osrm.org/route/v1/driving/{start_coordinates};{end_coordinates}?overview=full&geometries=geojson"
    route_response = requests.get(route_url)
    route = route_response.json()
    path_coordinates = route["routes"][0]["geometry"]["coordinates"]
    path_coordinates_latlon = [(lon, lat) for lon, lat in path_coordinates]

    line = LineString(path_coordinates_latlon)
    line_wkt = line.wkt
    distance_m = 1000

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    query = """
    SELECT *
    FROM stations
    WHERE ST_DWithin(
        geom,
        geography(ST_GeomFromText(%s, 4326)),
        %s
    );
    """

    cur.execute(query, (line_wkt, distance_m))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if len(rows) == 0:
        return {"message": f"No stations found on path"}

    return rows

#http://127.0.0.1:8000/stations/find/onpath?start_address=Helsinki&end_address=Tampere