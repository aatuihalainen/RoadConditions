import psycopg2
import requests
from fastapi import FastAPI, Query
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor
from .db_connection import get_connection
from urllib.parse import quote
from shapely.geometry import LineString
from .middleware import add_cors_middleware


app = FastAPI(title="Road Conditions API")
add_cors_middleware(app)

@app.get("/cameras/onpath")
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
    distance_m = 50

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    query = """
        SELECT
            c.*,
            ST_LineLocatePoint(route.geom, c.geom) AS fraction_along_route,
            ST_Length(
                ST_LineSubstring(
                    route.geom,
                    0,
                    ST_LineLocatePoint(route.geom, c.geom)
                )::geography
            ) AS distance_along_route
        FROM cameras c
        CROSS JOIN (
            SELECT ST_GeomFromText(%s, 4326) AS geom
        ) AS route
        WHERE ST_DWithin(
            c.geom::geography,
            route.geom::geography,
            %s
        )
        ORDER BY distance_along_route ASC;
    """

    cur.execute(query, (line_wkt, distance_m))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if len(rows) == 0:
        return {"message": f"No stations found on path"}

    return rows


@app.get("/cameras/weather/{camera_geom}")
def get_camera_weather(camera_geom):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT id FROM stations ORDER BY geom <-> %s LIMIT 1;", (camera_geom, ))
    response = cur.fetchone()
    weather_station_id = response["id"]
    
    cur.execute("SELECT * FROM weather_data WHERE station_id = %s", (weather_station_id, ))
    weather_data = cur.fetchall()
    return weather_data
