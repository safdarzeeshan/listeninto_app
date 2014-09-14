__author__ = 'zeeshan'

from django.conf.urls import url

from listeningto import views

urlpatterns = [
    url(r'^home/$', views.home, name='home'),
    url(r'^addsong/$', views.add_song, name='add_song'),
    url(r'^deletesong/(?P<pk>\d+)/$', views.delete_song, name='delete_song'),
    url(r'^youtube/$', views.youtube, name='youtube'),
    url(r'^jplayer/$', views.jplayer, name='jplayer'),
    url(r'^jplayeryoutubecustom/$', views.jplayer_youtube_custom, name='jplayer_youtube_custom'),
    url(r'^jplayeryoutube/$', views.jplayer_youtube, name='jplayer_youtube'),
    url(r'^jplayersoundcloud/$', views.jplayer_soundcloud, name='jplayer_soundcloud')

]
