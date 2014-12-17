from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Playlist(models.Model):
    user = models.ForeignKey(User)

    def __str__(self):
        return "{}'s Playlist".format(self.user.username)


class Song(models.Model):
    track_url = models.CharField(max_length=500, blank=False)
    track_name = models.CharField(max_length=500, blank=False)
    stream_url = models.CharField(max_length=500, blank=False)
    track_id = models.CharField(max_length=500, blank=False)
    track_artwork_url = models.CharField(max_length=500, blank=False)
    track_type = models.CharField(max_length=500, blank=False)
    playlists = models.ManyToManyField(Playlist, blank=True, through='UserPlaylist')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.track_name


class UserPlaylist(models.Model):
    playlist = models.ForeignKey(Playlist)
    song = models.ForeignKey(Song)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} on {}'s list".format(self.song.track_name, self.playlist.user.username)


class Recommendation(models.Model):
    receipient = models.ForeignKey(User)
    sender = models.ForeignKey(User, related_name='sent_recommendation')
    song = models.ForeignKey(Song)
    description = models.CharField(max_length=500, blank=True)
    played = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    message = models.CharField(max_length=500, null=False, blank=False)
    commenter = models.ForeignKey(User)
    recommendation = models.ForeignKey(Recommendation)
