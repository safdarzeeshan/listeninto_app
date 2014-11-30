__author__ = 'zeeshan'

from django.conf.urls import url

from listeningto import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^addsong/$', views.save_song, name='save_song'),
    url(r'^deletesong/$', views.delete_song, name='delete_song'),
    # url(r'^user/(?P<username>\w+)/$', views.user_songs, name='user_songs'),
    url(r'^user/$', views.user_songs, name='user_songs'),
    url(r'^recommendsong/$', views.recommend_song, name='recommend_song'),
    url(r'^getrecommendations/$', views.get_recommendations, name='get_recommendations'),
    url(r'^getusers/$', views.get_users, name='get_users'),
    url(r'^searchusers/$', views.search_users, name='search_users'),
    url(r'^isrecoplayed/$', views.check_if_reco_played, name='check_if_reco_played'),
    url(r'^anynewrecos/$', views.any_new_recos, name='any_new_recos'),
    url(r'^feed/$', views.activity_feed, name='activity_feed'),
]
