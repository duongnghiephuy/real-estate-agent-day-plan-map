from django.contrib import admin
from django.urls import path, include
from .views import HandleFileUpload, Search
from django.conf import settings
from django.conf.urls.static import static

app_name = "remapbe"
urlpatterns = [
    path("uploadfile", HandleFileUpload.as_view(), name="uploadfile"),
    path("search", Search.as_view(), name="search"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
