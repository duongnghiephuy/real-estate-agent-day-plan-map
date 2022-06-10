from django.shortcuts import render

# Create your views here.


def indexview(request):
    if not request.session or not request.session.session_key:
        request.session.save()
    return render(request, "remapfe/index.html")
