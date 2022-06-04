# A simple app using Django REST API and React
## Motivation
Real estate agents often have to go to inspect a bunch of properties a day. This might take a huge amount of time and effort to both plan and travel. This app aims to simplify that process. An user can upload the excel file containing locations of all properties (preferably restricted to the user's active areas),then specify a property of highest priority, and desirable maximum distance . The app will process input data, search for all properties within the maximum distance from the top priority, display them on a map, and export an excel for the user.

## Project structure 

```
+-- reproject: initial django app containing settings.py
+-- remapbe: django app to provide REST API
|   +-- tests.py: testing for REST API
|   +-- ...
+-- remapfe: react app to provide front end

```
## Dependencies

React-hook-form for form validation. Charka UI for fast and responsive styling. React-leaflet for map. 