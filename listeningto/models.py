from django.db import models

# Create your models here.
class Songs(models.Model):

    song_id = models.CharField(max_length=500, blank=False)

def __str__(self):
    return self.song_id