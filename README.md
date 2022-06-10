# A simple app using Django REST API and React
## Motivation
Real estate agents often have to go to inspect a bunch of properties a day. This might take a huge amount of time and effort to both plan and travel. This app aims to simplify that process. An user can upload the excel file containing locations of all properties (preferably restricted to the user's active areas),then specify a property of highest priority, and desirable maximum distance . The app will process input data, search for all properties within the maximum distance from the top priority, display them on a map, and export an excel for the user.

## Project structure 

Reference:
https://www.valentinog.com/blog/drf/
https://www.saaspegasus.com/guides/modern-javascript-for-django-developers/integrating-django-react/

After reading through several articles and SO, I understand there are several ways to integrate Django and React. 
However, I avoided the first option of using script tag to include React because of larger size and possibly slower loading speed.
The option of running them on seperate sever presents will take considerable time to set up token authentication to protect from CSRF attack
so it's not my choice. 


The approach of using mini React app in Django Template with webpack and babel, on the other hand, fits my small project. It can make use of 
Django session authentication easily while compiling only the necessary JavaScript.  

```
+-- reproject: initial django app containing settings.py
+-- remapbe: django app to provide REST API
|   +-- urls.py: routing for REST API
|   +-- views.py: REST API
|   +-- ...
+-- remapfe: react app to provide front end
|   +-- src: index.js: entry point for webpack, components/App.js: React file
|   +-- views.py: index view to index.html
|   +-- templates/index.html: template to load index.js/react into
```
## Dependencies

React-hook-form for form validation. Charka UI for fast and responsive styling. React-leaflet for map. 

Pandas to process excel and write csv resutl. Geopy for geocode and distance calculation from latitude and longitude. 