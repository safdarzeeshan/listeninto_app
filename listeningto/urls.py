__author__ = 'zeeshan'

from django.conf.urls import url

from listeningto import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^addsong/$', views.save_song, name='save_song'),
    url(r'^deletesong/(?P<track_id>\w+)/$', views.delete_song, name='delete_song'),
    url(r'^user/(?P<username>\w+)/$', views.user_songs, name='user_songs'),
    url(r'^search/$', views.search, name='search'),
    url(r'^recommendsong/$', views.recommend_song, name='recommend_song'),
    url(r'^getrecommendations/$', views.get_recommendations, name='get_recommendations'),
]

