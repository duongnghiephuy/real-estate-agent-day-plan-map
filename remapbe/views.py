from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
import pandas as pd
from geopy.geocoders import Nominatim
from geopy import distance
from django.core.files import File

# Create your views here.


class HandleFileUpload(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        print(request.session.session_key)
        uploadfile = request.data["file"]
        try:
            df = pd.read_excel(uploadfile)
        except:
            return Response(data=None, status=status.HTTP_400_BAD_REQUEST)
        columns = df.columns.to_list()
        sample_length = min(3, df.shape[0])
        df = df.fillna("")
        data = df.iloc[:sample_length, :].values.tolist()

        return Response(
            data={"columns": columns, "data": data}, status=status.HTTP_200_OK
        )


# Currently there is only km and m
def resolve_to_km(value, unit):
    if unit == "m":
        return value / 1000
    else:
        return value


# Add coordinate, distance columns to df
def add_geo(geolocator, address_column, row, center):
    try:
        coor = geolocator.geocode(str(row[address_column]))
        row["coordinate"] = [coor.latitude, coor.longitude]
    except:
        coor = None
    if coor:
        row["distance"] = distance.distance(
            (coor.latitude, coor.longitude),
            tuple(center),
        ).km
    else:
        row["distance"] = float("inf")
    return row


class Search(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        geolocator = Nominatim(user_agent="realtor-day-plan")

        userfile = request.data["file"]
        try:
            df = pd.read_excel(userfile)
        except:
            return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

        try:
            geodecode_res = geolocator.geocode(request.data["center"])
            if not geodecode_res:
                return Response(data=None, status=status.HTTP_400_BAD_REQUEST)
            center = [geodecode_res.latitude, geodecode_res.longitude]
        except:
            return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

        # convert to km
        max_distance = resolve_to_km(
            float(request.data["distance"]), request.data["unit"]
        )

        address_column = request.data["addressColumn"]

        # New df with coordinate, distance columns
        df = df.apply(
            lambda row: add_geo(geolocator, address_column, row, center),
            axis="columns",
        )

        # Search within max distance
        df = df.loc[df["distance"] <= max_distance]

        # Convert result to dict for JSON conversion later
        res = df[[address_column, "coordinate"]].copy()
        res.columns = ["address", "coordinate"]
        res = res.to_dict("records")

        # Df to save for serving result file
        df = df.iloc[:, :-2]
        filename = "media/searchresfile" + str(request.session.session_key) + ".csv"
        with open(filename, "wb") as f:
            searchresfile = File(f)
            df.to_csv(searchresfile)

        return Response(
            data={
                "center": center,
                "locations": res,
                "outputURL": filename,
            },
            status=status.HTTP_200_OK,
        )
