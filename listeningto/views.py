import json

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm

from listeningto.models import Song, Playlist


def save_song(request):
    track_type = request.POST.get('track_type')
    track_url = request.POST.get('track_url')
    track_name = request.POST.get('track_name')
    track_id = request.POST.get('track_id')
    stream_url = request.POST.get('stream_url', 'None')
    track_artwork_url = request.POST.get('track_artwork_url')

    playlist = Playlist.objects.get(user=request.user)
    r = Song.objects.create(track_type=track_type, track_url=track_url, track_name=track_name,
                            track_id=track_id, stream_url=stream_url, track_artwork_url=track_artwork_url, playlist=playlist)
    r.save()

    return HttpResponse(json.dumps({'id': r.id}), status=201)


def delete_song(request, pk):
    get_object_or_404(Song, pk=pk).delete()
    return redirect('home')


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            # Correct password, and the user is marked "active"
            auth.login(request, user)
            # Redirect to a success page.
            return redirect("home")
        else:
            # Show an error page
            return HttpResponseRedirect("/account/invalid/")
    else:
        return render(request, "registration/login.html")


def logout_view(request):
    auth.logout(request)
    # Redirect to a login page.
    return redirect("login")


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = request.POST.get('username', '')
            password = request.POST.get('password1', '')
            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login(request, user)
                return redirect("home")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {
        'form': form,
    })


def home(request):
    if not request.user.is_authenticated():
        return redirect('login')

    playlist, created = Playlist.objects.get_or_create(user=request.user)
    songs = Song.objects.filter(playlist=playlist)

    return render(request, 'song_input.html', {'songs': songs})


def user_songs(request, username):
    playlist = Playlist.objects.get(user__username=username)
    songs = Song.objects.filter(playlist=playlist)

    return render(request, 'playlist.html', {'songs': songs})

def search(request):

    return render(request, 'search.html')
