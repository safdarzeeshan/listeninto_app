from django.contrib import admin
from .models import Song

# Register your models here.


class SongAdmin(admin.ModelAdmin):
    list_display = ('track_name', )

admin.site.register(Song, SongAdmin)
