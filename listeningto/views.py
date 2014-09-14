from django.shortcuts import render
from listeningto.models import *
from django.http import HttpResponse
import json

#direct to homepage
def home(request):
    get_songs();
    return render(request,'home.html')

#get ll songs from db
def get_songs():

    songs = Songs.objects.all()

    for song in songs:
        print (song.track_name)




def add_song(request):
    print "song about to be added"

    track_url = request.GET['track_url']
    track_name = request.GET['track_name']
    track_id = request.GET['track_id']
    stream_url = request.GET['stream_url']
    track_artwork_url = request.GET['track_artwork_url']


    #add song url to table in db
    r = Songs.objects.create(track_url = track_url, track_name = track_name,
                             track_id = track_id, stream_url = stream_url, track_artwork_url = track_artwork_url)
    r.save()


    all_songs = []
    for song in Songs.objects.all():
        all_songs.append(song.track_name)

    return HttpResponse(status=201, content='this is a test')
