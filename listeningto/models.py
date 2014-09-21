from django.db import models

# Create your models here.


class Song(models.Model):
    track_url = models.CharField(max_length=500, blank=False)
    track_name = models.CharField(max_length=500, blank=False)
    stream_url = models.CharField(max_length=500, blank=False)
    track_id = models.CharField(max_length=500, blank=False)
    track_artwork_url = models.CharField(max_length=500, blank=False)
    track_type = models.CharField(max_length=500, blank=False)


def __str__(self):
    return self.track_name
