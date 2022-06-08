from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from .serializers import NoteSerializer
from .models import Notes
import pandas as pd

# Create your views here.


def front(request):
    context = {}

    return render(request, "index.html", context)


@api_view(["GET", "POST"])
def note(request):

    if request.method == "GET":
        note = Notes.objects.all()
        serializer = NoteSerializer(note, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def note_detail(request, pk):
    try:
        note = Notes.objects.get(pk=pk)
    except Notes.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class HandleFileUpload(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        print("here")

        uploadfile = request.data["file"]

        df = pd.read_excel(uploadfile)
        """ except Exception as e:
            print("Fuck")
            return Response(data=None, status=status.HTTP_400_BAD_REQUEST) """
        columns = df.columns.to_list()
        sample_length = min(3, df.shape[0])
        df = df.fillna("")
        data = df.iloc[:sample_length, :].values.tolist()
        print(data)
        return Response(
            data={"columns": columns, "data": data}, status=status.HTTP_200_OK
        )
