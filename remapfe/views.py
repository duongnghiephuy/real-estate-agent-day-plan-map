from django.shortcuts import render

# Create your views here.


def indexview(request):
    return render(request, "remapfe/index.html")