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
    playlist = models.ForeignKey(Playlist, null=True)


def __str__(self):
    return self.track_name
