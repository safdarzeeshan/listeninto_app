import json

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from listeningto.models import Song, Playlist, Recommendation
from django.shortcuts import render_to_response


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


def recommend_song(request):
    track_id = request.POST.get('track_id')
    track_type = request.POST.get('track_type')
    track_url = request.POST.get('track_url')
    track_name = request.POST.get('track_name')
    stream_url = request.POST.get('stream_url', 'None')
    track_artwork_url = request.POST.get('track_artwork_url')
    receipient_username = request.POST.get('receipient_username')

    song, created = Song.objects.get_or_create(track_id=track_id)

    if created:
        song.track_type = track_type
        song.track_url = track_url
        song.track_name = track_name
        song.stream_url = stream_url
        song.track_artwork_url = track_artwork_url
        song.save()

    receipient = User.objects.get(username=receipient_username)

    #add to recomendation table
    r = Recommendation.objects.create(receipient=receipient, sender=request.user, song=song)
    r.save()

    return HttpResponse(status=201)


def get_recommendations(request):
    recos = User.objects.get(id=request.user.id).recommendation_set.all()
    if request.is_ajax():
        return render_to_response('_reco.html', {'recommendations': recos})


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

    if request.is_ajax():
        print 'ajax'
        template = '_user_songs.html'
    else:
        print 'normal'
        template = 'home.html'

    return render(request, template, {'songs': songs})


def user_songs(request, username):
    playlist = Playlist.objects.get(user__username=username)
    songs = Song.objects.filter(playlists=playlist)

    return render(request, 'home.html', {'songs': songs})


def get_users(request):

    users = User.objects.all()

    users_list = []
    for i in range(len(users)):

        users_list.append(users[i].username)

    # return render(request, {'users': users})
    return HttpResponse(','.join(users_list), status=201)
