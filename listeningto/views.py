from django.shortcuts import render
from listeningto.models import *
from django.http import HttpResponse
import json

#direct to homepage
def home(request):
    return render(request,'home.html')


def add_song(request):
    print "song about to be added"
    song_url = request.GET['song_url']

    #add song url to table in db
    r = Songs.objects.create(song_id = song_url)
    r.save()

    all_songs = []
    for song in Songs.objects.all():
        all_songs.append(song.song_id)

    print "song added"
    return HttpResponse(status=201, content=json.dumps(all_songs))
