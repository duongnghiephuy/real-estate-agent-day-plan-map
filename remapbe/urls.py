from django.contrib import admin
from django.urls import path, include
from .views import front, note, note_detail, HandleFileUpload, Search


urlpatterns = [
    path("notes/", note, name="note"),
    path("notes/<int:pk>/", note_detail, name="detail"),
    path("uploadfile", HandleFileUpload.as_view(), name="uploadfile"),
    path("search", Search.as_view(), name="search"),
]
