import json

from django.shortcuts import render, redirect
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
    r, created = Song.objects.get_or_create(track_id=track_id)

    if created:
        r.track_type = track_type
        r.track_url = track_url
        r.track_name = track_name
        r.stream_url = stream_url
        r.track_artwork_url = track_artwork_url

    r.playlists.add(playlist)
    r.save()

    return HttpResponse(json.dumps({'id': r.id}), status=201)


def delete_song(request, track_id):
    song = Song.objects.get(track_id=track_id)
    playlist = Playlist.objects.get(user=request.user)
    song.playlists.remove(playlist)
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
    songs = Song.objects.filter(playlists=playlist)

    return render(request, 'song_input.html', {'songs': songs})


def user_songs(request, username):
    playlist = Playlist.objects.get(user__username=username)
    songs = Song.objects.filter(playlists=playlist)

    return render(request, 'playlist.html', {'songs': songs})


def search(request):

    return render(request, 'search.html')
