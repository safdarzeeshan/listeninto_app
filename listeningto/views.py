from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse

from listeningto.models import Songs


def home(request):
    songs = Songs.objects.all()
    return render(request, 'home.html', {'songs': songs})


def add_song(request):
    print "song about to be added"

    track_url = request.GET['track_url']
    track_name = request.GET['track_name']
    track_id = request.GET['track_id']
    stream_url = request.GET['stream_url']
    track_artwork_url = request.GET['track_artwork_url']

    #add song url to table in db
    r = Songs.objects.create(track_url=track_url, track_name=track_name,
                             track_id=track_id, stream_url=stream_url, track_artwork_url=track_artwork_url)
    r.save()

    return HttpResponse(status=201)


def delete_song(request, pk):
    get_object_or_404(Songs, pk=pk).delete()
    return HttpResponseRedirect(reverse('home'))


def youtube(request):

    return render(request, 'videojs_youtube.html')

def jplayer(request):

    return render(request, 'jplayer_example.html')

def jplayer_youtube_custom(request):

    return render(request, 'jplayer_youtube_custom.html')

def jplayer_youtube(request):

    return render(request, 'jplayer_youtube.html')

def jplayer_soundcloud(request):

    return render(request, 'jplayer_soundcloud.html')

def jplayer_scyt(request):

    return render(request, 'jplayer_scyt.html')
