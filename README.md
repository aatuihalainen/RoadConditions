## About RoadConditions
RoadConditions is a website based project that lets users find on road weather stations and -cameras all around Finland. 
The user inputs a point A (start address) and a point B (end address), after that the website finds the fastest route from A to B and lists all weather cameras and weather details on route.
It also warns the user for bad conditions, like snow on the road or low visibility. (The requirements for showing a warning probably require adjusting).
The website can only be used in finland which is the reason for it being written in Finnish.

## Used technologies
PostgreSQL database with PostGIS extension. Python for backend and React for frontend.

## How does it work?
The backend fetches weather camera and -station data every 15 minutes from Digitraffic's open API and saves it to the PostgreSQL database. 
When the user has given a start and an end, the frontend calls the backend and it does the following:
- The backend uses OpenStreetMaps nominatim API that converts the given addresses to coordinates.  
- After getting the coordinates it uses OpenStreetMaps API to get a route from A to B.
- After getting the route coordinates it makes a linestring using those route coordinates.
- Then a PostgreSQL call is made using that linestring to find all weather cameras along the path.
- And finally all cameras are returned to the frontend.

After that the frontend calls the backend again, to find the closest weather station for each camera on path and to get the weather data.
Then all the data is checked for any condition warnings, formatted for display and displayed on the web page.






