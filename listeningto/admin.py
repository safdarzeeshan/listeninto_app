from django.contrib import admin
from .models import Song, Playlist

# Register your models here.


class SongAdmin(admin.ModelAdmin):
    list_display = ('track_name', )


class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('get_user', )

    def get_user(self, obj):
        return obj.user.username

admin.site.register(Song, SongAdmin)
admin.site.register(Playlist)
