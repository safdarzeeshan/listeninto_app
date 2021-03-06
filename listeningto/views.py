import json
from datetime import datetime, timedelta
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import auth

from forms import MyRegistrationForm
from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import render_to_response
from listeningto.models import Song, Playlist, Recommendation, UserPlaylist


def login_view(request):
    if request.method == 'POST':
        # form = AuthenticationForm(request.POST)
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
        # if form.is_valid:
            # Correct password, and the user is marked "active"
            auth.login(request, user)
            # Redirect to a success page.
            return redirect("home")
        else:
            # Show an error page
            return render(request, "registration/login.html", {'errors': ['Invalid username or password']})
    else:
        # form = AuthenticationForm()
        return render(request, "registration/login.html", {'errors': []})


def register(request):
    if request.method == 'POST':
        form = MyRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            username = request.POST.get('username', '')
            password = request.POST.get('password1', '')
            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login(request, user)
                return redirect("home")
        else:
            return render(request, "registration/register.html", {'form': form})

    else:
        return render(request, "registration/login.html")


def registration_form(request):
    form = MyRegistrationForm()

    return render(request, "registration/_registration_form.html", {'form': form})


def logout_view(request):
    auth.logout(request)
    # Redirect to a login page.
    return redirect("login")


def save_song(request):
    track_type = request.POST.get('track_type')
    track_url = request.POST.get('track_url')
    track_name = request.POST.get('track_name')
    track_id = request.POST.get('track_id')
    stream_url = request.POST.get('stream_url', 'None')
    track_artwork_url = request.POST.get('track_artwork_url')

    # playlist = Playlist.objects.get(user=request.user)
    playlist = Playlist.objects.get(user=request.user)
    songs = Song.objects.filter(playlists=playlist)

    playlist_size = len(songs)

    print playlist_size

    if (playlist_size >= 10):

        return HttpResponse(status=400)

    else:

        r, created = Song.objects.get_or_create(track_id=track_id)

        if created:
            r.track_type = track_type
            r.track_url = track_url
            r.track_name = track_name
            r.stream_url = stream_url
            r.track_artwork_url = track_artwork_url

        # r.playlists.add(playlist)
        UserPlaylist.objects.create(playlist=playlist, song=r)
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
    recommendation_descripton = request.POST.get('description')

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
    r = Recommendation.objects.create(receipient=receipient, sender=request.user, song=song, description=recommendation_descripton)
    r.save()

    return HttpResponse(status=201)


def get_recommendations(request):
    recos = User.objects.get(id=request.user.id).recommendation_set.all().order_by('-created_at')
    if request.is_ajax():
        return render_to_response('_reco.html', {'recommendations': recos})


def check_if_reco_played(request):

    track_id = request.POST.get('track_id')
    senderUsername = request.POST.get('sender')

    song = Song.objects.get(track_id=track_id)
    sender = User.objects.get(username=senderUsername)
    reco = Recommendation.objects.get(receipient_id=request.user.id, song_id=song.id, sender=sender.id)

    was_reco_played = reco.played;

    if not reco.played:
        reco.played = True
        reco.save()

    return HttpResponse(was_reco_played, status=201)


def any_new_recos(request):

    new_recos = User.objects.get(id=request.user.id).recommendation_set.filter(played=False)

    if(new_recos):
        any_new_recos = True

    else:
        any_new_recos = False

    return HttpResponse(any_new_recos, status=201)


def delete_song(request):

    track_id = request.GET.get('trackid')
    song = Song.objects.get(track_id=track_id)
    playlist = Playlist.objects.get(user=request.user)
    # song.playlists.remove(playlist)
    UserPlaylist.objects.filter(playlist=playlist, song=song)[0].delete()

    return HttpResponse(status=201)


def home(request):
    if not request.user.is_authenticated():
        return redirect('login')

    playlist, created = Playlist.objects.get_or_create(user=request.user)

    #need each song to pick up the created at date value from the playlist table
    user_playlist = UserPlaylist.objects.filter(playlist=playlist).order_by('-created_at')
    songs = [entry.song for entry in user_playlist]

    if request.is_ajax():
        print 'ajax'
        template = '_user_songs.html'
    else:
        print 'normal'
        template = 'home.html'

    return render(request, template, {'songs': songs})


def user_songs(request):
    username = request.GET.get('user')
    user = User.objects.get(username=username)

    playlist = Playlist.objects.get(user__username=username)
    user_playlist = UserPlaylist.objects.filter(playlist=playlist).order_by('-created_at')
    songs = [entry.song for entry in user_playlist]

    if request.is_ajax():
        return render_to_response('_searched_user_songs.html', {'songs': songs, 'user': user})


def get_users(request):
    users = User.objects.all()
    users_list = {'users': []}

    for user in users:

        userinfo = {'label': user.first_name + ' ' + user.last_name + ' (' + user.username + ')',
                    'value': user.username
                    }

        users_list['users'].append(userinfo)

    return HttpResponse(json.dumps(users_list), status=201)


def search_users(request):
    query = request.GET.get('userquery')

    users_list = {'users': []}

    users = User.objects.filter(Q(username__icontains=query) | Q(first_name__icontains=query) | Q(last_name__icontains=query))

    for user in users:

        userinfo = {'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                    }

        users_list['users'].append(userinfo)

    return HttpResponse(json.dumps(users_list), status=201)


def activity_feed(request):
    feed = {'users': [], 'recommendations': []}
    today = datetime.today()
    yesterday = datetime.today() - timedelta(days=1)

    new_users = User.objects.filter(date_joined__gte=yesterday, date_joined__lte=today).order_by('-date_joined')
    new_recommendations = Recommendation.objects.filter(created_at__gte=yesterday, created_at__lte=today).order_by('-created_at')
    # new_songs = Song.objects.filter(created_at__gte=yesterday, created_at__lte=today)

    for user in new_users:
        new_user = {'username': user.username, 'name': '{} {}'.format(user.first_name.encode('utf8'), user.last_name.encode('utf8'))}
        feed['users'].append(new_user)

    for recommendation in new_recommendations:
        new_reco = {'sender': recommendation.sender.username,
                    'receipient': recommendation.receipient.username,
                    'track_name': recommendation.song.track_name,
                    'track_id': recommendation.song.track_id,
                    'track_type': recommendation.song.track_type,
                    'track_artwork_url': recommendation.song.track_artwork_url
                    }

        feed['recommendations'].append(new_reco)

    return HttpResponse(json.dumps(feed), status=200)
