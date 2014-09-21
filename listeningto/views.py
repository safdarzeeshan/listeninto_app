from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib import auth
from listeningto.models import Songs
from django.contrib.auth.forms import UserCreationForm


def home(request):
    songs = Songs.objects.all()
    return render(request, 'home.html', {'songs': songs})


def add_song(request):
    print "song about to be added"

    track_type = request.GET['track_type']
    track_url = request.GET['track_url']
    track_name = request.GET['track_name']
    track_id = request.GET['track_id']
    stream_url = request.GET['stream_url']
    track_artwork_url = request.GET['track_artwork_url']

    #add song url to table in db
    r = Songs.objects.create(track_type=track_type, track_url=track_url, track_name=track_name,
                             track_id=track_id, stream_url=stream_url, track_artwork_url=track_artwork_url)
    r.save()

    return HttpResponse(status=201)


def delete_song(request, pk):
    get_object_or_404(Songs, pk=pk).delete()
    return HttpResponseRedirect(reverse('home'))


def login_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        # Correct password, and the user is marked "active"
        auth.login(request, user)
        # Redirect to a success page.
        return HttpResponseRedirect("/account/loggedin/")
    else:
        # Show an error page
        return HttpResponseRedirect("/account/invalid/")


def logout_view(request):
    auth.logout(request)
    # Redirect to a success page.
    return HttpResponseRedirect("/account/loggedout/")


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            return HttpResponseRedirect("/books/")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {
        'form': form,
    })


def simple_yt_sc(request):
    songs = Songs.objects.all()

    return render(request, 'simple_yt_sc.html',  {'songs': songs})
