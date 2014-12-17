from django.contrib import admin
from .models import Song, Playlist, UserPlaylist

# Register your models here.


class UserPlaylistInline(admin.TabularInline):
    model = UserPlaylist
    extra = 2   # how many rows to show


class SongAdmin(admin.ModelAdmin):
    list_display = ('track_name', )
    inlines = (UserPlaylistInline,)


class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('get_user', )

    def get_user(self, obj):
        return obj.user.username

admin.site.register(Song, SongAdmin)
admin.site.register(Playlist, PlaylistAdmin)
